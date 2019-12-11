import React, { Component } from "react";
import { Image, View } from "react-native";
import {
  Card,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Button,
  Icon
} from "native-base";
import Retweetmodal from "./retweetbox";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
  Shine
} from "rn-placeholder";
import Webviewmodal from "./webviewmodal";
import { STATIC_URL } from "../config";
import Createlike from "./createlike";
import Commentmodal from "./commentmodal";
import CreateComment from "./createComment";
import Likemodal from "./likemodal";

import { TouchableOpacity } from "react-native";
import { Context } from "../usercontext";

export default function NewsFeedCard(props) {
  const cuser = React.useContext(Context);
  const [webview, setWebview] = React.useState(false);
  const [likeModal, setLikeModal] = React.useState(false);
  const [commentModal, setCommentModal] = React.useState(false);
  const [retweetModal, setRetweetModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(false);
  const [title, setTitle] = React.useState(false);
  const [description, setDescription] = React.useState(false);
  const [image, setImage] = React.useState(false);
  const [video, setVideo] = React.useState(false);
  let { item, linkcontent, linkindex, lastindex, text } = props;

  /*    React.useEffect(() => {
    LinkPreview.getPreview(props.url, {
      imagesPropertyType: "og",
      language: "fr-CA"
    }).then(data => {
      setTitle(data.title);
      setDescription(data.description);
      if (data.videos) {
       
        setVideo(data.videos[0]);
      }
      if (data.images) {
       
        setImage(data.images[0]);
      }

      setLoading(false);
    });
  }, []);  */

  //alert(image);
  /*  console.debug(image); */

  /*   if (loading) { */
  /*    return (
      <>
        {/* <Placeholder
        Animation={Fade}
        Left={PlaceholderMedia}
        style={{ paddingTop: 8 }}
      >
        <PlaceholderLine />
        <PlaceholderLine width={80} />
        <PlaceholderLine width={30} />
      </Placeholder> 
     
      </>
    );
  } */
  return (
    <>
      <TouchableOpacity onPress={() => setWebview(props.url)}>
        <Card>
          <CardItem>
            <Left>
              {props.logo ? (
                <Thumbnail source={props.logo} />
              ) : (
                <Text
                  style={{
                    color: "white",
                    fontSize: 25,
                    backgroundColor: "red",
                    padding: 10,
                    borderRadius: 150 / 2
                  }}
                >
                  {props.letter}
                </Text>
              )}

              <Body>
                <Text>{props.title}</Text>
                <Text note>{props.date}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem cardBody>
            {props.media ? (
              <Image
                source={{
                  uri: props.media
                }}
                style={{ width: "100%", height: 200 }}
              />
            ) : null}
            <Text>{props.description}</Text>
          </CardItem>
          {props.isReTweet != true ? (
            <CardItem>
              <Left>
                <Button transparent>
                  <Createlike
                    CREATE_LIKE_MUTATION={props.CREATE_LIKE_MUTATION}
                    isTweet={false}
                    updateLikeFunction={props.updateLikeFunction}
                    tweetid={props.item ? props.item.id : null}
                  />
                  <TouchableOpacity onPress={() => setLikeModal(true)}>
                    <Text>{props.likes.length} Like </Text>
                  </TouchableOpacity>
                </Button>
                <Button transparent>
                  <CreateComment
                    CREATE_COMMENT_MUTATION={props.CREATE_COMMENT_MUTATION}
                    isTweet={false}
                    comments={props.comments}
                    updateCommentFunction={props.updateCommentFunction}
                    tweetid={props.item ? props.item.id : null}
                  />
                </Button>

                <Button onPress={() => setRetweetModal(true)} transparent>
                  <Icon active name="git-compare" />
                </Button>
              </Left>
            </CardItem>
          ) : (
            false
          )}
        </Card>
      </TouchableOpacity>
      {webview != false ? (
        <Webviewmodal closewebview={() => setWebview(false)} url={webview} />
      ) : null}

      {likeModal != false ? (
        <Likemodal likes={props.likes} closemodal={() => setLikeModal(false)} />
      ) : null}
      {retweetModal != false ? (
        <Retweetmodal
          handlename={props.handlename}
          item={props.item}
          closemodal={() => setRetweetModal(false)}
          likes={props.likes}
          comments={props.comments}
          url={props.url}
          date={props.date}
          letter={props.letter}
          title={props.title}
          media={props.media}
          description={props.description}
          wid={props.item.wid}
        />
      ) : null}
    </>
    /*   <View style={{ flex: 1, flexDirection: "column" }}>
        <Text>{props.item.title}</Text>
        <Text>{props.date}</Text>
        {props.media != false ? (
          <Image
            source={{
              uri: props.item.media
            }}
            style={{ width: "100%", height: 200 }}
          />
        ) : null}
        <Text>{props.item.summary}</Text>
        <TouchableOpacity onPress={() => alert("hello")}>
          <Text style={{ padding: 20 }}>testtt </Text>
        </TouchableOpacity>
      </View> */
    /*   </> */
  );
}
