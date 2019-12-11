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

import { Mutation } from "react-apollo";
export default class CardImageExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showmodal: true,
      comment: ""
    };
  }

  handleComment = async createComment => {
    let res = await createComment();
    console.log(res);
  };

  render() {
    return (
      <Mutation
        mutation={this.props.CREATE_COMMENT_MUTATION}
        variables={{
          tweetid: this.props.tweetid,
          commenttext: this.state.comment
        }}
        onCompleted={data => {}}
        update={this.props.updateCommentFunction}
      >
        {(createComment, { loading, error }) => {
          if (error) {
            console.log(error);
          }
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
                    <Title>Comments</Title>
                  </Body>
                </Header>
                <Content>
                  <Grid>
                    <Row>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <View>
                          {loading && <Text>Loading</Text>}
                          {error && <Text>An error occured</Text>}
                        </View>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            borderColor: "violet",
                            borderWidth: 1,
                            margin: 8,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#eee"
                          }}
                        >
                          <TextInput
                            style={{
                              height: 40,

                              flex: 1
                            }}
                            placeholder="Write your comment"
                            onChangeText={text => {
                              this.setState({ comment: text });
                            }}
                            value={this.state.comment}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              if (this.state.comment != "") {
                                this.handleComment(createComment);
                              }
                            }}
                          >
                            <Icon
                              style={{ padding: 20, color: "violet" }}
                              active
                              name="md-send"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Row>

                    <Row>
                      <FlatList
                        data={this.props.comments}
                        renderItem={({ item, index }) => (
                          <ListItem avatar>
                            <Left>
                              <Thumbnail
                                source={{
                                  uri:
                                    "https://cdn1.thr.com/sites/default/files/imagecache/768x433/2019/03/avatar-publicity_still-h_2019.jpg"
                                }}
                              />
                            </Left>
                            <Body>
                              <Text>{item.user.username}</Text>
                              <Text note>{item.comment}</Text>
                            </Body>
                            <Right>
                              <Text note>3:43 pm</Text>
                            </Right>
                          </ListItem>
                        )}
                        keyExtractor={item => item.id}
                      />
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
}
