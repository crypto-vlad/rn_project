import React, {useState} from 'react';
import {Query, ApolloConsumer} from 'react-apollo';
import {gql} from 'apollo-boost';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import InfiniteScroll from 'react-native-infinite-scroll';
import {Button} from 'native-base';
import FeedCard from '../../../components/newsfeed';
import Layout from '../layout';

const EspnFeed = props => {
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [tempid, settempid] = React.useState(200);
  const [firstload, setFirstload] = React.useState(true);
  const [firstpage, setFirstpage] = React.useState(true);

  let updateLikeFunction = (cache, {data: {createFoxLike}}) => {
    const tweets = cache.readQuery({
      query: GET_FOX_FEEDS,
      variables: {page: 1},
    });

    let newtweets = tweets.foxfeed.map(item => {
      if (createFoxLike.feed.id == item.id) {
        let itemexist = false;
        let templikes = [];
        item.foxfeedlikes.map(likeitem => {
          if (likeitem.user.id != cuser.id) {
            templikes.push(likeitem);
          } else {
            itemexist = true;
          }
        });

        item.foxfeedlikes = templikes;
        if (!itemexist) {
          item.foxfeedlikes.push({
            id: createFoxLike.likesid,
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
            __typename: 'CNNLikeType',
          });
        }

        return item;
      }

      return item;
    });
    settempid(tempid + 1);
    cache.writeQuery({
      query: GET_FOX_FEEDS,
      data: {foxfeed: newtweets},
    });
  };

  let updateCommentFunction = (cache, {data}) => {
    const feeds = cache.readQuery({
      query: GET_FOX_FEEDS,
      variables: {page: 1},
    });

    let newfeeds = feeds.foxfeed.map(item => {
      if (data.createFoxComment.feed.id == item.id) {
        item.foxfeedcomments.push({
          id: data.createFoxComment.comment.id,
          comment: data.createFoxComment.comment.comment,
          commenttime: data.createFoxComment.comment.commenttime,
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
          __typename: 'CNNCommentType',
        });

        return item;
      }
      return item;
    });
    cache.writeQuery({
      query: GET_FOX_FEEDS,
      data: {foxfeed: newfeeds},
      variables: {page: page},
    });
  };

  const updateAfterCommentDelete = (cache, data, feeditem) => {
    const feeds = cache.readQuery({
      query: GET_FOX_FEEDS,
      variables: {page: 1},
    });

    let newfeeds = feeds.foxfeed.map(item => {
      if (feeditem.id == item.id) {
        let tempcomments = [];
        item.foxfeedcomments.map(commentitem => {
          if (commentitem.id != data.deleteFoxComment.commentId) {
            tempcomments.push(commentitem);
          }
        });
        item.foxfeedcomments = tempcomments;

        return item;
      }
      return item;
    });

    cache.writeQuery({
      query: GET_FOX_FEEDS,
      data: {foxfeed: newfeeds},
      variables: {page: page},
    });
    settempid(tempid + 1);
  };
  return (
    <Layout {...props} title="FOX Feed">
      <Query
        fetchPolicy="cache-and-network"
        query={GET_FOX_FEEDS}
        variables={{page}}>
        {({loading, error, data, fetchMore}) => {
          if (loading && firstload) {
            return <Text>Loading</Text>;
          }
          if (error) {
            return <Text>Error</Text>;
          }
          if (data) {
            setFirstload(false);
            console.log(data.foxfeed.length);
          }
          return (
            <>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <FlatList
                  data={data.foxfeed}
                  renderItem={({item}) => (
                    <FeedCard
                      maxToRenderPerBatch={1}
                      item={item}
                      fox
                      likes={item.foxfeedlikes}
                      comments={item.foxfeedcomments}
                      letter={'F'}
                      url={item.link}
                      updateLikeFunction={updateLikeFunction}
                      CREATE_LIKE_MUTATION={CREATE_LIKE_MUTATION}
                      key={item.id}
                    />
                  )}
                  keyExtractor={item => item.id}
                />
                {loading ? (
                  <Text>Loading</Text>
                ) : (
                  <TouchableHighlight
                    style={{padding: 10}}
                    onPress={() =>
                      fetchMore({
                        variables: {
                          page: data.foxfeed.length / 10 + 1,
                        },
                        updateQuery: (prev, {fetchMoreResult}) => {
                          if (!fetchMoreResult) return prev;
                          return Object.assign({}, prev, {
                            foxfeed: [
                              ...prev.foxfeed,
                              ...fetchMoreResult.foxfeed,
                            ],
                          });
                        },
                      })
                    }>
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

export const GET_FOX_FEEDS = gql`
  query($page: Int) {
    foxfeed(page: $page) {
      id
      title
      summary
      link
      published
      media
      foxfeedlikes {
        id
        user {
          id
          username
          profileSet {
            profilePic
          }
        }
      }
      foxfeedcomments {
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

const CREATE_LIKE_MUTATION = gql`
  mutation($tweetid: Int!) {
    createFoxLike(tweetId: $tweetid) {
      feed {
        id
      }
      likedordisliked
      likesid
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation($tweetid: Int!, $commenttext: String!) {
    createFoxComment(tweetId: $tweetid, commenttext: $commenttext) {
      feed {
        id
      }
      comment {
        comment
        commenttime
        id
      }
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation($commentid: Int!) {
    deleteFoxComment(commentId: $commentid) {
      commentId
    }
  }
`;
export default EspnFeed;
