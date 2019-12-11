import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Button,
  Icon,
  Title,
  Row,
  Grid
} from "native-base";
import {
  Modal,
  FlatList,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity
} from "react-native";

import Tweetbox from "./tweetbox";
import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";
import NewsFeedCard from "./newsfeedcard";
export default function Retweetbox(props) {
  const [showmodal, setShowModal] = React.useState(true);
  const [abusive, setAbusive] = React.useState(false);
  const handleText = async (text, createTweetFromUrl) => {
    console.log("from retweet");
    let res = "";
    if (props.handlename) {
      res = await createTweetFromUrl({
        variables: {
          tweettext: text,
          url: props.wid,
          handlename: props.handlename
        }
      });
      console.log(res);
    } else {
      res = await createTweetFromUrl({
        variables: { tweettext: text, url: props.url }
      });
      console.log(res);
    }
    //  props.closemodal();
  };
  console.log(props);
  return (
    <Mutation mutation={CREATE_TWEET_FROM_URL}>
      {(createTweetFromUrl, { loading, error, called, client }) => {
        if (loading) {
          return <Text>Loafing</Text>;
        }
        if (error) {
          console.log(error);
          return <Text>AN error occured</Text>;
        }

        return (
          <Modal
            animationType="slide"
            transparent={false}
            visible={showmodal}
            onRequestClose={() => props.closemodal()}
          >
            <Container>
              <Header>
                <Left>
                  <Button onPress={() => props.closemodal()} transparent>
                    <Icon name="arrow-back" />
                  </Button>
                </Left>
                <Body>
                  <Title>Comments</Title>
                </Body>
              </Header>
              <Content>
                <Grid>
                  <Row>
                    <View style={{ width: "100%" }}>
                      <NewsFeedCard isReTweet={true} {...props} />
                      <Tweetbox
                        isReTweet={true}
                        handleAbusive={() => setAbusive(true)}
                        handleText={text =>
                          handleText(text, createTweetFromUrl)
                        }
                      />
                      {abusive && <Text>Bad words are not allowed</Text>}
                    </View>
                  </Row>
                </Grid>
              </Content>
            </Container>
          </Modal>
        );
      }}
    </Mutation>
  );
}

const CREATE_TWEET_FROM_URL = gql`
  mutation($tweettext: String!, $url: String!, $handlename: Int) {
    createTweetFromUrl(
      tweetext: $tweettext
      url: $url
      handlename: $handlename
    ) {
      tweet {
        id
      }
    }
  }
`;
