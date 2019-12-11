import React from "react";

import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Footer,
  FooterTab,
  Text,
  Grid,
  Content,
  Row,
  Col
} from "native-base";
import Constants from "expo-constants";
import { AsyncStorage } from "react-native";

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      showhome: false
    };
  }

  async componentDidMount() {}

  render() {
    let routename = this.props.navigation.state.routeName;

    return (
      <Container style={{ marginTop: Constants.statusBarHeight }}>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{this.props.title}</Title>
          </Body>
          <Right>
            <Button
              onPress={() => {
                AsyncStorage.removeItem("authtoken");
                this.props.navigation.push("Auth");
              }}
              transparent
            >
              <Icon name="search" />
            </Button>
            <Button
              onPress={() => this.props.navigation.push("Profile")}
              transparent
            >
              <Icon name="person" />
            </Button>
          </Right>
        </Header>
        <Content>
          <Grid style={{ padding: 8 }}>{this.props.children}</Grid>
        </Content>

        <Footer>
          <FooterTab>
            <Button
              active={routename == "Home" ? true : false}
              onPress={() => this.props.navigation.push("Home")}
              vertical
            >
              <Icon name="apps"/>
              <Text>Home</Text>
            </Button>
            <Button
              active={routename == "Cnn" ? true : false}
              vertical
              onPress={() => this.props.navigation.push("Cnn")}
            >
              <Icon name="camera"  />
              <Text >Cnn</Text>
            </Button>
            <Button
              onPress={() => this.props.navigation.push("Espn")}
              vertical
              active={routename == "Espn" ? true : false}
            >
              <Icon active name="navigate" />
              <Text>Espn</Text>
            </Button>
            <Button
              active={routename == "Fox" ? true : false}
              onPress={() => this.props.navigation.push("Fox")}
              vertical
            >
              <Icon name="person" />
              <Text>Fox</Text>
            </Button>
            <Button
              active={routename == "Worldtweet" ? true : false}
              onPress={() => this.props.navigation.push("Worldtweet")}
              vertical
            >
              <Icon name="person" />
              <Text>worldtweet</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
