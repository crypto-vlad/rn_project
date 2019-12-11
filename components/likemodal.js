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
  Title
} from "native-base";
import { Modal } from "react-native";
export default class CardImageExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showmodal: true
    };
  }

  render() {
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
              <Title>Likes</Title>
            </Body>
          </Header>
          <Content>
            <List>
              {this.props.likes.map(item => {
                return (
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
                    </Body>
                    <Right>
                      <Text note>3:43 pm</Text>
                    </Right>
                  </ListItem>
                );
              })}
            </List>
          </Content>
        </Container>
      </Modal>
    );
  }
}
