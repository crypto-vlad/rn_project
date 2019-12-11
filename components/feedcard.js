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

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
  Shine,
} from 'rn-placeholder';
import Webviewmodal from './webviewmodal';
import {STATIC_URL} from '../config';
import Createlike from './createlike';
import Commentmodal from './commentmodal';
import Likemodal from './likemodal';

import {TouchableOpacity} from 'react-native';
import {Context} from '../usercontext';
import LinkPreview from 'link-preview-js';

export default function HomeCard(props) {
  const cuser = React.useContext(Context);
  const [webview, setWebview] = React.useState(false);
  const [likeModal, setLikeModal] = React.useState(false);
  const [commentModal, setCommentModal] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(false);
  const [title, setTitle] = React.useState(false);
  const [description, setDescription] = React.useState(false);
  const [image, setImage] = React.useState(false);
  const [video, setVideo] = React.useState(false);
  let {item, linkcontent, linkindex, lastindex, text} = props;

  LinkPreview.getPreview(props.url, {
    imagesPropertyType: 'og', // fetches only open-graph images
    language: 'fr-CA', // fetches site for French language
  }).then(data => {
    /*  console.debug(data); */

    setTitle(data.title);
    setDescription(data.description);
    if (data.videos) {
      /*  console.debug("setting videos"); */
      setVideo(data.videos[0]);
    }
    if (data.images) {
      /* console.debug("settinng images"); */
      setImage(data.images[0]);
    }

    setLoading(false);
  });
  //alert(image);
  /*  console.debug(image); */

  if (loading) {
    return (
      <Placeholder
        Animation={Fade}
        Left={PlaceholderMedia}
        style={{paddingTop: 8}}>
        <PlaceholderLine />
        <PlaceholderLine width={80} />
        <PlaceholderLine width={30} />
      </Placeholder>
    );
  }
  return (
    <>
      <Card>
        <CardItem>
          <Left>
            <Thumbnail source={{uri: 'Image URL'}} />
            <Body>
              <Text>{title}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem cardBody>
          {image != false ? (
            <Image
              source={{
                uri: image,
              }}
              style={{width: '100%', height: 200}}
            />
          ) : null}
          <Text>{description}</Text>
        </CardItem>
      </Card>
    </>
  );
}
