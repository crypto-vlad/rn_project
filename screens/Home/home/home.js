import React, { useState } from "react";
import { Query, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  FlatList
} from "react-native";

import Singletweet from "../../../components/singletweet";
import Tweetbox from "../../../components/tweetbox";
import Layout from "../layout";
import { Context } from "../../../usercontext";
import { Row } from "native-base";
const CnnFeed = props => {
  const cuser = React.useContext(Context);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [tempid, settempid] = React.useState(200);
  const [firstload, setFirstload] = React.useState(true);
  const [firstpage, setFirstpage] = React.useState(true);

  let updateLikeFunction = (cache, { data: { createLike } }) => {
    const tweets = cache.readQuery({
      query: GET_TWEETS,
      variables: { username: cuser.username, page }
    });

    let newtweets = tweets.usertweets.map(item => {
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
              username: cuser.username,
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
      query: GET_TWEETS,
      data: { usertweets: newtweets },
      variables: { username: cuser.username, page }
    });
  };

  let updateCommentFunction = (cache, { data: { createComment } }) => {
    const tweets = cache.readQuery({
      query: GET_TWEETS,
      variables: { username: cuser.username, page: 1 }
    });
    let newtweets = tweets.usertweets.map(item => {
      if (createComment.tweet.id == item.id) {
        item.comments.push({
          id: createComment.comment.id,
          commenttime: createComment.comment.commenttime,
          comment: createComment.comment.comment,
          user: {
            id: cuser.id,
            profileSet: [
              {
                profilePic: cuser.profileSet[0].profilePic,
                __typename: "ProfileType"
              }
            ],
            username: cuser.username,
            __typename: "UserType"
          },
          __typename: "CommentType"
        });

        return item;
      }
      return item;
    });

    cache.writeQuery({
      query: GET_TWEETS,
      data: { usertweets: newtweets },
      variables: { username: cuser.username, page: page }
    });
  };
  const updateAfterDelete = (cache, { data: { deleteTweet } }) => {
    const tweets = cache.readQuery({
      query: GET_TWEETS,
      variables: { username: cuser.username, page: 1 }
    });

    let newtweets = [];
    tweets.usertweets.map(item => {
      if (item.id != deleteTweet.tweetid) newtweets.push(item);
    });

    cache.writeQuery({
      query: GET_TWEETS,
      data: { usertweets: newtweets },
      variables: { username: cuser.username, page: page }
    });
  };

  const updateTweets = (cache, { data: { createTweet, hastagset } }) => {
    const { usertweets } = cache.readQuery({
      query: GET_TWEETS,
      variables: { username: cuser.username, page: 1 }
    });

    const newtweets = [createTweet.tweet].concat(usertweets);

    settempid(201);

    cache.writeQuery({
      query: GET_TWEETS,
      data: { usertweets: newtweets },
      variables: { username: cuser.username, page: page }
    });

    /*  let newtweets = tweets.usertweets.map(item => {
          if (createComment.tweet.id == item.id) {
            item.comments.push({id:createComment.commentid,
                    comment:createComment.commenttext,
                    user:{
                    id:cuser.id,
                    profileSet: [{profilePic: cuser.profileSet[0].profilePic, __typename: "ProfileType"}],
                    username: cuser.username,
                    __typename: "UserType"
                    },
                    __typename:"CommentType",
                })
              console.log(item)
              return item
          }
          return item
        })
         */
  };

  const updateAfterCommentDelete = (cache, data, feeditem) => {
    const feeds = cache.readQuery({
      query: GET_TWEETS,
      variables: { username: cuser.username, page: 1 }
    });

    let newfeeds = feeds.usertweets.map(item => {
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
      query: GET_TWEETS,
      data: { usertweets: newfeeds },
      variables: { username: cuser.username, page: page }
    });
    settempid(tempid + 1);
  };

  return (
    <Layout {...props} title="Home">
      <Query
        query={GET_TWEETS}
        variables={{ username: cuser.username, page }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data, fetchMore }) => {
          if (loading && firstload) {
            return <Text>Loading</Text>;
          }
          if (error) {
            return <Text>Error</Text>;
          }
          if (data) {
            setFirstload(false);
            console.log(data.usertweets.length);
          }
          return (
            <>
              <View style={{ flex: 1, flexDirection: "column" }}>
                <Tweetbox updateTweets={updateTweets} />
                <FlatList
                  data={data.usertweets}
                  renderItem={({ item, index }) => (
                    <Singletweet
                      navigation={props.navigation}
                      key={index}
                      reportabuse={true}
                      key={item.id}
                      DELETE_COMMENT_MUTATION={DELETE_COMMENT_MUTATION}
                      page={page}
                      updateAfterCommentDelete={updateAfterCommentDelete}
                      updateAfterDelete={updateAfterDelete}
                      updateLikeFunction={updateLikeFunction}
                      updateCommentFunction={updateCommentFunction}
                      username={cuser.username}
                      item={item}
                    />
                  )}
                  keyExtractor={item => item.id}
                />
                {loading ? (
                  <Text>Loading</Text>
                ) : (
                  <TouchableHighlight
                    style={{ padding: 10 }}
                    onPress={() =>
                      fetchMore({
                        variables: {
                          page: data.usertweets.length / 10 + 1
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) return prev;
                          return Object.assign({}, prev, {
                            usertweets: [
                              ...prev.usertweets,
                              ...fetchMoreResult.usertweets
                            ]
                          });
                        }
                      })
                    }
                  >
                    <Text>Load mmore</Text>
                  </TouchableHighlight>
                )}
              </View>
            </>
          );
        }}
      </Query>
    </Layout>
  );
};

export const GET_TWEETS = gql`
  query($username: String!, $page: Int) {
    usertweets(username: $username, page: $page) {
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

const DELETE_COMMENT_MUTATION = gql`
  mutation($commentid: Int!) {
    deleteComment(commentId: $commentid) {
      commentId
    }
  }
`;

const styles = theme => ({
  root: {
    padding: 20
  },
  aside: {
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  }
});

export default CnnFeed;
