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

export default function UserTweetCard(props) {
  const cuser = React.useContext(Context);
  const [webview, setWebview] = React.useState(false);
  const [likeModal, setLikeModal] = React.useState(false);
  const [commentModal, setCommentModal] = React.useState(false);
  let {item, linkcontent, linkindex, lastindex, text} = props;

  /* alert(`${STATIC_URL}${props.media}`); */
  /*  console.debug(image); */
  return (
    <>
      <Card>
        <CardItem>
          <Left>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('Profile', {username: props.title})
              }>
              <Thumbnail source={{uri: `${STATIC_URL}${props.logo}`}} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('Profile', {username: props.title})
              }>
              <Body>
                <Text>{props.title}</Text>
                <Text note>{props.date}</Text>
              </Body>
            </TouchableOpacity>
          </Left>
        </CardItem>
        <CardItem cardBody>
          {props.image ? (
            <Image
              source={{
                uri: `${STATIC_URL}${props.image}`,
              }}
              style={{width: '100%', height: 200}}
            />
          ) : null}
          <>
            {item.isRetweeted ? (
              <View style={{flexDirection: 'column'}}>
                <View style={{padding: 8, flex: 1}}>
                  {linkcontent == '' ? <Text>{item.tweettext} </Text> : null}

                  {linkcontent != '' ? (
                    <Text>{text.slice(0, linkindex)}</Text>
                  ) : null}
                  {linkcontent != '' ? (
                    <TouchableOpacity>
                      <Text>{text.slice(linkindex, lastindex)}</Text>
                    </TouchableOpacity>
                  ) : null}

                  {linkcontent != '' ? (
                    <Text> {text.slice(lastindex, text.length)}</Text>
                  ) : null}

                  {item.hashtagsSet.map((hastag, index) => (
                    <TouchableOpacity
                      onPress={() => alert(`/hashtag/${hastag.hastag}`)}>
                      <Text> &nbsp;#{hastag.hastag}&nbsp;</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={{flex: 1}}>
                  {item.wtext ? (
                    <WorldTweetCard linkcontent={linkcontent} item={item} />
                  ) : item.url.indexOf('youtube.com') >= 0 ||
                    item.url.indexOf('youtu.be') >= 0 ? (
                    <Video url={item.url} />
                  ) : (
                    <FeedPreview
                      showWebview={url => setWebview(url)}
                      url={item.url}
                    />
                  )}
                </View>
              </View>
            ) : (
              <View style={{flexDirection: 'column'}}>
                <View style={{padding: 8, flex: 1}}>
                  {!item.isUrlValid && item.isUrlValid != null ? (
                    <Text>{text.slice(0, linkindex)}</Text>
                  ) : null}

                  {!item.isUrlValid && item.isUrlValid != null ? (
                    <TouchableOpacity>
                      <Text>{text.slice(linkindex, lastindex)}</Text>
                    </TouchableOpacity>
                  ) : null}

                  {!item.isUrlValid && item.isUrlValid != null ? (
                    <Text>{text.slice(lastindex, text.length)} </Text>
                  ) : null}

                  {item.isUrlValid || item.isUrlValid == null ? (
                    <Text> {item.tweettext}</Text>
                  ) : null}

                  {item.hashtagsSet.map((hastag, index) => (
                    <TouchableOpacity>
                      <Text>{`/hashtag/${hastag.hastag}`}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={{flex: 1}}>
                  {item.url != null &&
                  isNaN(item.url) &&
                  (item.isUrlValid || item.isUrlValid == null) ? (
                    item.url.indexOf('youtube.com') >= 0 ||
                    item.url.indexOf('youtu.be') >= 0 ? (
                      <Video url={item.url} />
                    ) : (
                      <FeedPreview
                        showWebview={url => setWebview(url)}
                        url={item.url}
                      />
                    )
                  ) : null}
                  {item.wtext ? (
                    <WorldTweetCard linkcontent={linkcontent} item={item} />
                  ) : null}
                </View>
              </View>
            )}
          </>
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
