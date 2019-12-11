import React, {useState} from 'react';
import {Query, ApolloConsumer} from 'react-apollo';
import {gql} from 'apollo-boost';
import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  FlatList,
} from 'react-native';

import Singletweet from '../../components/hashtag';

import Layout from './layout';
import {Context} from '../../usercontext';
import {Row} from 'native-base';

const Tweetsheet = ({classes, setCurrentRoute, match, navigation}) => {
  const cuser = React.useContext(Context);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [tempid, settempid] = React.useState(200);
  const [firstload, setFirstload] = React.useState(true);

  let updateLikeFunction = (cache, {data: {createLike}}) => {
    const tweets = cache.readQuery({
      query: GET_HASHTAG,
      variables: {hashtag: match.params.hashtag, page: 1},
    });

    let newtweets = tweets.hashtags[0].tweet.map(item => {
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
                  __typename: 'ProfileType',
                },
              ],
              username: cuser.username,
              __typename: 'UserType',
            },
            __typename: 'LikeType',
          });
        }

        return item;
      }
      return item;
    });

    tweets.hashtags[0].tweet = newtweets;
    cache.writeQuery({
      query: GET_HASHTAG,
      data: {hashtags: tweets.hashtag},
      variables: {hashtag: match.params.hashtag, page: 1},
    });
  };

  let updateCommentFunction = (cache, {data: {createComment}}) => {
    const tweets = cache.readQuery({
      query: GET_HASHTAG,
      variables: {hashtag: match.params.hashtag, page: 1},
    });
    let newtweets = tweets.hashtags[0].tweet.map(item => {
      if (createComment.tweet.id == item.id) {
        item.comments.push({
          id: createComment.commentid,
          comment: createComment.commenttext,
          user: {
            id: cuser.id,
            profileSet: [
              {
                profilePic: cuser.profileSet[0].profilePic,
                __typename: 'ProfileType',
              },
            ],
            username: cuser.username,
            __typename: 'UserType',
          },
          __typename: 'CommentType',
        });

        return item;
      }
      return item;
    });
    tweets.hashtags[0].tweet = newtweets;
    cache.writeQuery({
      query: GET_HASHTAG,
      data: {hashtags: tweets.hashtags},
      variables: {hashtag: match.params.hashtag, page: page},
    });
  };

  const updateAfterDelete = (cache, {data: {deleteTweet}}) => {
    const tweets = cache.readQuery({
      query: GET_HASHTAG,
      variables: {hashtag: match.params.hashtag, page: 1},
    });

    let newtweets = [];
    tweets.hashtags[0].tweet.map(item => {
      if (item.id != deleteTweet.tweetid) newtweets.push(item);
    });
    tweets.hashtags[0].tweet = newtweets;

    settempid(tempid + 1);
    cache.writeQuery({
      query: GET_HASHTAG,
      data: {hashtags: tweets.hashtags},
      variables: {hashtag: match.params.hashtag, page: page},
    });
  };

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

  const updateAfterCommentDelete = (cache, data, feeditem) => {
    const feeds = cache.readQuery({
      query: GET_HASHTAG,
      variables: {hashtag: match.params.hashtag, page: 1},
    });

    let newfeeds = feeds.hashtags[0].tweet.map(item => {
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

    feeds.hashtags[0].tweet = newfeeds;
    cache.writeQuery({
      query: GET_HASHTAG,
      data: {hashtags: feeds.hashtags},
      variables: {hashtag: match.params.hashtag, page: 1},
    });
    settempid(tempid + 1);
  };
  console.log(navigation);
  return (
    <Layout title={'Hashtag'} navigation={navigation}>
      <Query
        query={GET_HASHTAG}
        variables={{
          hashtag: navigation.getParam('hastag'),
          page,
        }}>
        {({loading, error, data, fetchMore}) => {
          if (loading && firstload) {
            return <Text>Loading</Text>;
          }
          if (error) {
            return <Text>Error</Text>;
          }
          if (data) {
            setFirstload(false);
            console.log(data);
          }
          return (
            <>
              <View style={{flex: 1, flexDirection: 'column'}}>
                {data.hashtags.length > 0 ? (
                  <FlatList
                    data={data.hashtags[0].tweet}
                    renderItem={({item, index}) => (
                      <Singletweet
                        navigation={navigation}
                        key={index}
                        reportabuse={true}
                        key={item.id}
                        CREATE_LIKE_MUTATION={CREATE_LIKE_MUTATION}
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
                ) : (
                  <Text>No Hashtag found</Text>
                )}
              </View>
            </>
          );
        }}
      </Query>
    </Layout>
  );
};

export const GET_HASHTAG = gql`
  query($hashtag: String!, $page: Int) {
    hashtags(hashtag: $hashtag, page: $page) {
      id
      tweet {
        id
        user {
          id
          username
          profileSet {
            profilePic
          }
        }
        tweettext
        tweetcountry
        tweetfile
        tweettime
        hashtagsSet {
          id
          hastag
        }
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
        }
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

const CREATE_LIKE_MUTATION = gql`
  mutation($tweetid: Int!) {
    createLike(tweetId: $tweetid) {
      tweet {
        id
      }
      likedordisliked
      likesid
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation($tweetid: Int!, $commenttext: String!) {
    createComment(tweetId: $tweetid, commenttext: $commenttext) {
      tweet {
        id
      }
      commenttext
      commentid
    }
  }
`;

const DELETE_MUTATION = gql`
  mutation($tweetid: Int!) {
    deleteTweet(tweetid: $tweetid) {
      status
      tweetid
    }
  }
`;
const REPORT_ABUSE = gql`
  mutation($tweetid: Int!) {
    reportAbuse(tweetid: $tweetid) {
      status
      tweetid
    }
  }
`;

export default Tweetsheet;
