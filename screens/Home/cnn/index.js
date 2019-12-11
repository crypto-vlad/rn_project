import React, { useState } from "react";
import { Query, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableHighlight
} from "react-native";
import Resolver from "../../../components/resolvepromise";
import InfiniteScroll from "react-native-infinite-scroll";
import { Button } from "native-base";
import FeedCard from "../../../components/newsfeed";
import Layout from "../layout";
import { Context } from "../../../usercontext";

const CnnFeed = props => {
  const cuser = React.useContext(Context);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [tempid, settempid] = React.useState(200);
  const [firstload, setFirstload] = React.useState(true);
  const [firstpage, setFirstpage] = React.useState(true);

  let updateLikeFunction = (cache, { data: { createCnnLike } }) => {
    const feeds = cache.readQuery({
      query: GET_CNN_FEEDS,
      variables: { page: 1 }
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
                  __typename: "ProfileType"
                }
              ],
              username: cuser.username,
              __typename: "UserType"
            },
            __typename: "CNNLikeType"
          });
        }

        return item;
      }
      return item;
    });
    settempid(tempid + 1);

    cache.writeQuery({
      query: GET_CNN_FEEDS,
      data: { cnnfeed: newfeeds },
      variables: { page: 1 }
    });
  };

  let updateCommentFunction = (cache, { data }) => {
    const feeds = cache.readQuery({
      query: GET_CNN_FEEDS,
      variables: { page: 1 }
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
                __typename: "ProfileType"
              }
            ],
            username: cuser.username,
            __typename: "UserType"
          },
          __typename: "CNNCommentType"
        });

        return item;
      }
      return item;
    });
    cache.writeQuery({
      query: GET_CNN_FEEDS,
      data: { cnnfeed: newfeeds },
      variables: { page: page }
    });
  };

  const updateAfterCommentDelete = (cache, data, feeditem) => {
    const feeds = cache.readQuery({
      query: GET_CNN_FEEDS,
      variables: { page: 1 }
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
      data: { cnnfeed: newfeeds },
      variables: { page: page }
    });
    settempid(tempid + 1);
  };
  const loadmore = (fetchMore, newpage) => {
    return fetchMore({
      variables: {
        page: page
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        if (fetchMoreResult.cnnfeed.length == 0) {
          return prev;
        }

        /*   console.log(newresult); */
        let newresult = Object.assign({}, prev, {
          cnnfeed: [...prev.cnnfeed, ...fetchMoreResult.cnnfeed]
        });

        setPage(newpage);

        return newresult;
      }
    });
  };

  return (
    <Layout {...props} title="CNN Feeds">
      <Query
        fetchPolicy="cache-and-network"
        query={GET_CNN_FEEDS}
        variables={{ page }}
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
            console.log(data.cnnfeed.length);
          }
          return (
            <>
              <View style={{ flex: 1, flexDirection: "column" }}>
                <FlatList
                  data={data.cnnfeed}
                  renderItem={({ item }) => (
                    <FeedCard
                      maxToRenderPerBatch={1}
                      item={item}
                      cnn
                      likes={item.cnnfeedlikes}
                      comments={item.cnnfeedcomments}
                      letter={"C"}
                      url={item.link}
                      updateLikeFunction={updateLikeFunction}
                      CREATE_LIKE_MUTATION={CREATE_LIKE_MUTATION}
                      CREATE_COMMENT_MUTATION={CREATE_COMMENT_MUTATION}
                      updateCommentFunction={updateCommentFunction}
                      key={item.id}
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
                          page: data.cnnfeed.length / 10 + 1
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) return prev;
                          return Object.assign({}, prev, {
                            cnnfeed: [
                              ...prev.cnnfeed,
                              ...fetchMoreResult.cnnfeed
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

              {/* <ScrollView>
                  {status.data.cnnfeed.map((item, index) => {
                    return (
                      <FeedCard
                        item={item}
                        cnn
                        likes={item.cnnfeedlikes}
                        comments={item.cnnfeedcomments}
                        letter={"C"}
                        url={item.link}
                        updateLikeFunction={updateLikeFunction}
                        CREATE_LIKE_MUTATION={CREATE_LIKE_MUTATION}
                        key={index}
                      />
                    );
                  })} */}

              {/* </ScrollView> */}
            </>
          );
        }}
      </Query>
    </Layout>
  );
};

export const GET_CNN_FEEDS = gql`
  query($page: Int) {
    cnnfeed(page: $page) {
      id
      title
      summary
      link
      published
      media
      cnnfeedlikes {
        id
        user {
          id
          username
          profileSet {
            profilePic
          }
        }
      }
      cnnfeedcomments {
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
    createCnnLike(tweetId: $tweetid) {
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
    createCnnComment(tweetId: $tweetid, commenttext: $commenttext) {
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
    deleteCnnComment(commentId: $commentid) {
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
