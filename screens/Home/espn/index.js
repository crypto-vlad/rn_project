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

  let updateLikeFunction = (cache, {data: {createEspnLike}}) => {
    const tweets = cache.readQuery({
      query: GET_ESPN_FEEDS,
      variables: {page: 1},
    });

    let newtweets = tweets.espnfeed.map(item => {
      if (createEspnLike.feed.id == item.id) {
        let itemexist = false;
        let templikes = [];
        item.espnfeedlikes.map(likeitem => {
          if (likeitem.user.id != cuser.id) {
            templikes.push(likeitem);
          } else {
            itemexist = true;
          }
        });

        item.espnfeedlikes = templikes;
        if (!itemexist) {
          item.espnfeedlikes.push({
            id: createEspnLike.likesid,
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
      query: GET_ESPN_FEEDS,
      data: {espnfeed: newtweets},
    });
  };

  let updateCommentFunction = (cache, {data}) => {
    const feeds = cache.readQuery({
      query: GET_ESPN_FEEDS,
      variables: {page: 1},
    });

    let newfeeds = feeds.espnfeed.map(item => {
      if (data.createEspnComment.feed.id == item.id) {
        item.espnfeedcomments.push({
          id: data.createEspnComment.comment.id,
          comment: data.createEspnComment.comment.comment,
          commenttime: data.createEspnComment.comment.commenttime,
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
      query: GET_ESPN_FEEDS,
      data: {espnfeed: newfeeds},
      variables: {page: page},
    });
  };

  const updateAfterCommentDelete = (cache, data, feeditem) => {
    const feeds = cache.readQuery({
      query: GET_ESPN_FEEDS,
      variables: {page: 1},
    });

    let newfeeds = feeds.espnfeed.map(item => {
      if (feeditem.id == item.id) {
        let tempcomments = [];
        item.espnfeedcomments.map(commentitem => {
          if (commentitem.id != data.deleteEspnComment.commentId) {
            tempcomments.push(commentitem);
          }
        });
        item.espnfeedcomments = tempcomments;

        return item;
      }
      return item;
    });

    cache.writeQuery({
      query: GET_ESPN_FEEDS,
      data: {espnfeed: newfeeds},
      variables: {page: page},
    });
    settempid(tempid + 1);
  };
  const loadmore = fetchMore => {
    console.debug(fetchMore);
    console.debug(fetchMore);
    console.debug('debug');
    console.debug(page);

    setFirstpage(false);
    fetchMore({
      variables: {
        page: page + 1,
      },
      updateQuery: (prev, {fetchMoreResult}) => {
        if (!fetchMoreResult) return prev;
        if (fetchMoreResult.cnnfeed.length == 0) {
          setHasMore(false);
          return prev;
        }
        console.debug(fetchMoreResult.cnnfeed);
        return Object.assign({}, prev, {
          cnnfeed: [...prev.cnnfeed, ...fetchMoreResult.cnnfeed],
        });
      },
    });
    setPage(page + 1);
  };
  return (
    <Layout {...props} title="ESPN Feed">
      <Query
        fetchPolicy="cache-and-network"
        query={GET_ESPN_FEEDS}
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
            console.log(data.espnfeed.length);
          }
          return (
            <>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <FlatList
                  data={data.espnfeed}
                  renderItem={({item}) => (
                    <FeedCard
                      maxToRenderPerBatch={1}
                      item={item}
                      espn
                      likes={item.espnfeedlikes}
                      comments={item.espnfeedcomments}
                      letter={'E'}
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
                          page: data.espnfeed.length / 10 + 1,
                        },
                        updateQuery: (prev, {fetchMoreResult}) => {
                          if (!fetchMoreResult) return prev;
                          return Object.assign({}, prev, {
                            espnfeed: [
                              ...prev.espnfeed,
                              ...fetchMoreResult.espnfeed,
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

export const GET_ESPN_FEEDS = gql`
  query($page: Int) {
    espnfeed(page: $page) {
      id
      title
      summary
      link
      published
      media
      espnfeedlikes {
        id
        user {
          id
          username
          profileSet {
            profilePic
          }
        }
      }
      espnfeedcomments {
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
    createEspnLike(tweetId: $tweetid) {
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
    createEspnComment(tweetId: $tweetid, commenttext: $commenttext) {
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
    deleteEspnComment(commentId: $commentid) {
      commentId
    }
  }
`;

export default EspnFeed;
