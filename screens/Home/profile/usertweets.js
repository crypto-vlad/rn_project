import React, { useState } from "react";
import { Query, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import { View, Text, ScrollView } from "react-native";

import Singletweet from "../../../components/singletweet";

import Layout from "../layout";
import { Context } from "../../../usercontext";
import { Row } from "native-base";
const ProfileTweets = props => {
  const cuser = React.useContext(Context);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [tempid, settempid] = React.useState(200);
  const [firstload, setFirstload] = React.useState(true);
  const [firstpage, setFirstpage] = React.useState(true);
  let updateLikeFunction = (cache, { data: { createLike } }) => {
    const ptweets = cache.readQuery({
      query: GET_CURRENT_USER_TWEETS,
      variables: { username: props.username, page: 1 }
    });

    let newtweets = ptweets.tweets.map(item => {
      if (createLike.tweet.id == item.id) {
        let itemexist = false;
        let templikes = [];
        item.likes.map(likeitem => {
          if (likeitem.user.id != cuser.id) {
            templikes.push(likeitem);
          } else {
            itemexist = true;
          }
        });

        item.likes = templikes;

        if (!itemexist) {
          item.likes.push({
            id: createLike.likesid,
            user: {
              id: cuser.id,
              profileSet: [
                {
                  profilePic: cuser.profileSet[0].profilePic,
                  __typename: "ProfileType"
                }
              ],
              username: props.username,
              __typename: "UserType"
            },
            __typename: "LikeType"
          });
        }

        return item;
      }
      return item;
    });

    cache.writeQuery({
      query: GET_CURRENT_USER_TWEETS,
      data: { tweets: newtweets },
      variables: { username: props.username }
    });
  };

  let updateCommentFunction = (cache, { data: { createComment } }) => {
    const ptweets = cache.readQuery({
      query: GET_CURRENT_USER_TWEETS,
      variables: { username: props.username, page: 1 }
    });
    let newtweets = ptweets.tweets.map(item => {
      if (createComment.tweet.id == item.id) {
        item.comments.push({
          id: createComment.comment.id,
          comment: createComment.comment.comment,
          commenttime: createComment.comment.commenttime,
          user: {
            id: cuser.id,
            profileSet: [
              {
                profilePic: cuser.profileSet[0].profilePic,
                __typename: "ProfileType"
              }
            ],
            username: props.username,
            __typename: "UserType"
          },
          __typename: "CommentType"
        });

        return item;
      }
      return item;
    });
    cache.writeQuery({
      query: GET_CURRENT_USER_TWEETS,
      data: { tweets: newtweets },
      variables: { username: props.username, page: page }
    });
  };
  const updateAfterDelete = (cache, { data: { deleteTweet } }) => {
    const tweets = cache.readQuery({
      query: GET_CURRENT_USER_TWEETS,
      variables: { username: props.username, page: 1 }
    });

    let newtweets = [];
    tweets.tweets.map(item => {
      if (item.id != deleteTweet.tweetid) newtweets.push(item);
    });

    cache.writeQuery({
      query: GET_CURRENT_USER_TWEETS,
      data: { tweets: newtweets },
      variables: { username: props.username, page: page }
    });
  };

  const updateAfterCommentDelete = (cache, data, feeditem) => {
    const feeds = cache.readQuery({
      query: GET_CURRENT_USER_TWEETS,
      variables: { username: props.username, page: 1 }
    });

    let newfeeds = feeds.tweets.map(item => {
      if (feeditem.id == item.id) {
        let tempcomments = [];
        item.comments.map(commentitem => {
          if (commentitem.id != data.deleteComment.commentId) {
            tempcomments.push(commentitem);
          }
        });
        item.comments = tempcomments;

        return item;
      }
      return item;
    });

    cache.writeQuery({
      query: GET_CURRENT_USER_TWEETS,
      data: { tweets: newfeeds },
      variables: { username: props.username, page: page }
    });
    settempid(tempid + 1);
  };
  return (
    <ScrollView>
      <Query
        query={GET_CURRENT_USER_TWEETS}
        variables={{ username: props.username, page }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data, fetchMore }) => {
          if (loading) {
            return <Text>Loading</Text>;
          }
          if (error) {
            return <Text>Error</Text>;
          }
          if (data) {
            return (
              <>
                {data.tweets &&
                  data.tweets.map((item, index) => {
                    return (
                      <Singletweet
                        key={index}
                        DELETE_COMMENT_MUTATION={DELETE_COMMENT_MUTATION}
                        page={page}
                        updateAfterCommentDelete={updateAfterCommentDelete}
                        updateAfterDelete={updateAfterDelete}
                        updateLikeFunction={updateLikeFunction}
                        updateCommentFunction={updateCommentFunction}
                        refetchQuery={GET_CURRENT_USER_TWEETS}
                        username={"rahul"}
                        item={item}
                      />
                    );
                  })}
              </>
            );
          }
        }}
      </Query>
    </ScrollView>
  );
};

const DELETE_COMMENT_MUTATION = gql`
  mutation($commentid: Int!) {
    deleteComment(commentId: $commentid) {
      commentId
    }
  }
`;

export const GET_CURRENT_USER_TWEETS = gql`
  query($username: String!, $page: Int) {
    tweets(username: $username, page: $page) {
      id
      url
      logo
      wid
      wmedia
      published
      wtext
      isRetweeted
      isUrlValid
      wcreatedat
      handlename {
        id
        handlename
      }
      user {
        id
        username
        profileSet {
          profilePic
        }
      }
      tweettext
      tweetcountry
      hashtagsSet {
        id
        hastag
      }
      tweetfile
      tweettime
      likes {
        id
        user {
          id
          username
          profileSet {
            profilePic
          }
        }
      }
      comments {
        id
        user {
          id
          username
          profileSet {
            profilePic
          }
        }
        comment
        commenttime
      }
    }
  }
`;

export default ProfileTweets;
