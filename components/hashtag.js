import React, {Component} from 'react';
import {Image, View} from 'react-native';
import {
  Card,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Button,
  Icon,
} from 'native-base';
import Webviewmodal from './webviewmodal';
import {STATIC_URL} from '../config';
import Createlike from './createlike';
import Commentmodal from './commentmodal';
import Likemodal from './likemodal';

import Video from './video';
import WorldTweetCard from './worldtweet';
import FeedPreview from './feedcard';
import {TouchableOpacity} from 'react-native';
import {Context} from '../usercontext';

function SingleHashTag(props) {
  const cuser = React.useContext(Context);
  const [webview, setWebview] = React.useState(false);
  const [likeModal, setLikeModal] = React.useState(false);
  const [commentModal, setCommentModal] = React.useState(false);

  let {item} = props;
  let tweettime = item.tweettime.split('T')[0];

  return (
    <>
      <Card>
        <CardItem>
          <Left>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('Profile', {username: props.title})
              }>
              <Thumbnail
                source={{
                  uri: `${STATIC_URL}${item.user.profileSet[0].profilePic}`,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('Profile', {
                  username: item.user.username,
                })
              }>
              <Body>
                <Text>{item.user.username}</Text>
                <Text note>{tweettime}</Text>
              </Body>
            </TouchableOpacity>
          </Left>
        </CardItem>
        <CardItem cardBody>
          {item.tweetfile ? (
            <Image
              source={{
                uri: `${STATIC_URL}${item.tweetfile}`,
              }}
              style={{width: '100%', height: 200}}
            />
          ) : null}
          <View style={{flexDirection: 'column'}}>
            <Text> {item.tweettext}</Text>
            {item.hashtagsSet.map(hastag => (
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate('/hashtag', {
                    hastag: hastag.hastag,
                  })
                }>
                <Text>{hastag.hastag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </CardItem>
        <CardItem>
          <Left>
            <Button transparent>
              <Createlike
                CREATE_LIKE_MUTATION={props.CREATE_LIKE_MUTATION}
                isTweet
                userid={props.item.user.id}
                updateLikeFunction={props.updateLikeFunction}
                tweetid={props.item.id}
              />
              <TouchableOpacity onPress={() => setLikeModal(true)}>
                <Text>{props.likecount} Like </Text>
              </TouchableOpacity>
            </Button>
            <Button transparent>
              <Icon active name="chatbubbles" />
              <TouchableOpacity onPress={() => setCommentModal(true)}>
                <Text>{props.commentCount} Comment</Text>
              </TouchableOpacity>
            </Button>
            {cuser.username == props.title ? (
              <Button transparent>
                <Icon active name="git-compare" />
              </Button>
            ) : null}
          </Left>
        </CardItem>
      </Card>
      {webview != false ? (
        <Webviewmodal closewebview={() => setWebview(false)} url={webview} />
      ) : null}
      {commentModal != false ? (
        <Commentmodal
          comments={props.item.comments}
          closemodal={() => setCommentModal(false)}
        />
      ) : null}
      {likeModal != false ? (
        <Likemodal
          likes={props.item.likes}
          closemodal={() => setLikeModal(false)}
        />
      ) : null}
    </>
  );
}

export default SingleHashTag;
