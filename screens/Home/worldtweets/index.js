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
import WorldTweet from '../../../components/worldtweet';
import Layout from '../layout';

const CnnFeed = props => {
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [tempid, settempid] = React.useState(200);
  const [firstload, setFirstload] = React.useState(true);
  const [firstpage, setFirstpage] = React.useState(true);

  let updateLikeFunction = (cache, {data: {createCnnLike}}) => {
    const feeds = cache.readQuery({
      query: GET_CNN_FEEDS,
      variables: {page: 1},
    });

    let newfeeds = feeds.cnnfeed.map(item => {
      if (createCnnLike.feed.id == item.id) {
        let itemexist = false;
        let templikes = [];
        item.cnnfeedlikes.map(likeitem => {
          if (likeitem.user.id != cuser.id) {
            templikes.push(likeitem);
          } else {
            itemexist = true;
          }
        });

        item.cnnfeedlikes = templikes;

        if (!itemexist) {
          item.cnnfeedlikes.push({
            id: createCnnLike.likesid,
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
      query: GET_CNN_FEEDS,
      data: {cnnfeed: newfeeds},
      variables: {page: 1},
    });
  };

  let updateCommentFunction = (cache, {data}) => {
    const feeds = cache.readQuery({
      query: GET_CNN_FEEDS,
      variables: {page: 1},
    });

    let newfeeds = feeds.cnnfeed.map(item => {
      if (data.createCnnComment.feed.id == item.id) {
        item.cnnfeedcomments.push({
          id: data.createCnnComment.comment.id,
          commenttime: data.createCnnComment.comment.commenttime,
          comment: data.createCnnComment.comment.comment,
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
      query: GET_CNN_FEEDS,
      data: {cnnfeed: newfeeds},
      variables: {page: page},
    });
  };

  const updateAfterCommentDelete = (cache, data, feeditem) => {
    const feeds = cache.readQuery({
      query: GET_CNN_FEEDS,
      variables: {page: 1},
    });

    let newfeeds = feeds.cnnfeed.map(item => {
      if (feeditem.id == item.id) {
        let tempcomments = [];
        item.cnnfeedcomments.map(commentitem => {
          if (commentitem.id != data.deleteCnnComment.commentId) {
            tempcomments.push(commentitem);
          }
        });
        item.cnnfeedcomments = tempcomments;

        return item;
      }
      return item;
    });

    cache.writeQuery({
      query: GET_CNN_FEEDS,
      data: {cnnfeed: newfeeds},
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
  console.debug('this.prps');
  console.debug(props);
  return (
    <Layout {...props} title="World Tweet">
      <Query
        fetchPolicy="cache-and-network"
        query={GET_WORLD_TWEETS}
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
            console.log(data.worldtweets.length);
          }
          return (
            <>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <FlatList
                  data={data.worldtweets}
                  renderItem={({item}) => (
                    <WorldTweet
                      maxToRenderPerBatch={1}
                      item={item}
                      fox
                      likes={item.worldtweetlikes}
                      comments={item.worldtweetcomments}
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
                          page: data.worldtweets.length / 10 + 1,
                        },
                        updateQuery: (prev, {fetchMoreResult}) => {
                          if (!fetchMoreResult) return prev;
                          return Object.assign({}, prev, {
                            worldtweets: [
                              ...prev.worldtweets,
                              ...fetchMoreResult.worldtweets,
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

export const GET_WORLD_TWEETS = gql`
  query($page: Int) {
    worldtweets(page: $page) {
      id
      logo
      wid
      wmedia
      published
      wtext
      wcreatedat
      handlename {
        id
        handlename
      }
      worldtweetlikes {
        id
        user {
          id
          username
          profileSet {
            profilePic
          }
        }
      }
      worldtweetcomments {
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
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation($commentid: Int!) {
    deleteWorldtweetComment(commentId: $commentid) {
      commentId
    }
  }
`;

const CREATE_LIKE_MUTATION = gql`
  mutation($tweetid: Int!) {
    createWorldtweetLike(tweetId: $tweetid) {
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
    createWorldtweetComment(tweetId: $tweetid, commenttext: $commenttext) {
      feed {
        id
      }
      commentid
      commenttext
    }
  }
`;

const styles = theme => ({
  root: {
    padding: 20,
  },
  aside: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
});

export default CnnFeed;
