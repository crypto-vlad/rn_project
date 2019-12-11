import React from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
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
import TextInput from "react-native";
import { Context } from "../usercontext";
import { TouchableHighlight, TouchableOpacity, View } from "react-native";
import Commentmodal from "./commentmodal";
export default function Createlike(props) {
  const cuser = React.useContext(Context);
  const [commenttext, setComment] = React.useState("");
  const [commentModal, setCommentModal] = React.useState(false);
  let handleCommentCreate = async (createComment, comment) => {
    let res = await createComment();
    console.log(res);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setCommentModal(true)}>
        <Icon active name="chatbubbles" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setCommentModal(true)}>
        <Text>{props.comments.length} Comment</Text>
      </TouchableOpacity>

      {commentModal != false ? (
        <Commentmodal
          comments={props.comments}
          tweetid={props.tweetid}
          updateCommentFunction={props.updateCommentFunction}
          CREATE_COMMENT_MUTATION={props.CREATE_COMMENT_MUTATION}
          closemodal={() => setCommentModal(false)}
        />
      ) : null}
    </>
  );
}

function ShowCommentBox(props) {
  const [commenttext, setComment] = React.useState("");
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={this.state.showmodal}
      onRequestClose={() => this.props.closemodal()}
    >
      <Container>
        <Header>
          <Left>
            <Button onPress={() => this.props.closemodal()} transparent>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Create Comment</Title>
          </Body>
        </Header>
        <Content>
          <TextInput
            style={{
              height: 40,
              borderColor: "violet",
              borderWidth: 1,
              margin: 8
            }}
            onChangeText={text => {
              let tuser = text;

              setUsername(tuser.toLowerCase());
            }}
            value={username}
          />
        </Content>
      </Container>
    </Modal>
  );
}
