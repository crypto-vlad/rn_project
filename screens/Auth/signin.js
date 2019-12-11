import React, { Component, useState } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Card,
  CardItem,
  Input,
  Label,
  Left,
  Thumbnail,
  Body,
  Grid,
  Row,
  Col,
  Button
} from "native-base";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  AsyncStorage
} from "react-native";
export default function Register(props) {
  const [username, setUsername] = useState("rahul");

  const [password, setPassword] = useState("Rahul@1289");

  const handleSubmit = async (tokenAuth, client) => {
    const res = await tokenAuth();
    console.log(res);
    if (res.data.customLogin.user.profileSet[0].is2fa) {
      /*   setPropsUsername(username)
      setCurrentRoute('2fa') */
      await AsyncStorage.setItem("authtoken", res.data.customLogin.token);
      props.navigation.navigate("App");
    } else {
      console.log("settintoken");
      await AsyncStorage.setItem("authtoken", res.data.customLogin.token);
      props.navigation.navigate("App");
    }
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        margin: 16
      }}
    >
      <Mutation mutation={LOGIN_MUTATION} variables={{ username, password }}>
        {(tokenAuth, { loading, error, called, client }) => {
          if (loading) {
            console.debug("loading");
          }
          let message;
          if (error) {
            message = error.message.replace("GraphQL Error:", "").trim();
            message = message.replace("GraphQL error:", "").trim();
            console.log(message);
          }
          return (
            <View
              style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10 }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#ddd",
                  padding: 16
                }}
              >
                <Text style={{ fontSize: 20, textAlign: "center" }}>
                  Login
                </Text>
              </View>
              <View
                style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}
              >
                <Form>
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

                  <TextInput
                    style={{
                      height: 40,
                      borderColor: "violet",
                      borderWidth: 1,
                      margin: 8
                    }}
                    onChangeText={text => {
                      setPassword(text);
                    }}
                    value={password}
                  />
                </Form>
              </View>
              <View style={{ padding: 16 }}>
                <Button
                  onPress={() => handleSubmit(tokenAuth, client)}
                  full
                  primary
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      textAlign: "center"
                    }}
                  >
                    Login
                  </Text>
                </Button>
                <View style={{ paddingTop: 15 }}>
                  {/* <TouchableOpacity
                    onPress={() => this.props.navigation.push("Register")}
                  >
                    <Text style={{ color: "violet", fontSize: 16 }}>
                      Don't have an account? Register Here
                    </Text>
                  </TouchableOpacity> */}
                </View>
                <View style={{ paddingTop: 16 }}>
                  <Button bordered>
                    <Text
                      style={{
                        color: "violet",
                        fontSize: 16,
                        textAlign: "center"
                      }}
                    >
                      Skip Registration (You agreee to accept T&C and cookies
                      policy)
                    </Text>
                  </Button>
                </View>
              </View>
            </View>
          );
        }}
      </Mutation>
    </View>
  );
}

const LOGIN_MUTATION = gql`
  mutation($username: String!, $password: String!) {
    customLogin(username: $username, password: $password) {
      token
      user {
        profileSet {
          is2fa
        }
      }
    }
  }
`;
