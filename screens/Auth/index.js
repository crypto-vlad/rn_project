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
  const [username, setUsername] = useState("");
  const [value, onChangeText] = React.useState("Useless Placeholder");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [passwordNotMatch, setPasswordNotMatch] = useState("");
  const [open, setOpen] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [showPolicy, setShowPolicy] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const handleSubmit = async (createUser, client) => {
    //
    alert(username);
    if (!passwordNotMatch && passwordValid) {
      const res = await createUser();
      console.log(res);
      /*  localStorage.setItem("authtoken", res.data.createUser.token); */
      /*  setCurrentRoute("Email"); */
      await AsyncStorage.setItem("authtoken", res.data.createUser.token);
      props.navigation.push("Verifyemail");
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
      <Mutation
        mutation={REGISTER_MUTATION}
        variables={{ username, email, password }}
      >
        {(createUser, { loading, error, called, client }) => {
          let message;
          if (error) {
            console.debug(error);
            message = error.message.replace("GraphQL Error:", "").trim();
            message = message.replace("GraphQL error:", "").trim();
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
                  Register
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
                    placeholder="username"
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
                    placeholder="email"
                    onChangeText={text => setEmail(text)}
                  />

                  <TextInput
                    style={{
                      height: 40,
                      borderColor: "violet",
                      borderWidth: 1,
                      margin: 8
                    }}
                    placeholder="password"
                    onChangeText={text => {
                      setPassword(text);
                    }}
                    value={password}
                    onBlur={() => {
                      let regex = new RegExp(
                        "^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,}))"
                      );
                      if (!regex.test(password)) setPasswordValid(false);
                      else setPasswordValid(true);
                    }}
                  />

                  <TextInput
                    style={{
                      height: 40,
                      borderColor: "violet",
                      borderWidth: 1,
                      margin: 8
                    }}
                    placeholder="confirm password"
                    onBlur={() => {
                      if (password != cpassword) {
                        setPasswordNotMatch(true);
                      } else setPasswordNotMatch(false);
                    }}
                    onChangeText={text => {
                      setCpassword(text);
                      if (text == password) {
                        setPasswordNotMatch(false);
                      }
                    }}
                  />
                </Form>
              </View>
              <View style={{ padding: 16 }}>
                <Button
                  onPress={() => handleSubmit(createUser, client)}
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
                    Register
                  </Text>
                </Button>
                <View style={{ paddingTop: 15 }}>
                  {/* <TouchableOpacity
                    onPress={() => props.navigation.push("Login")}
                  >
                    <Text style={{ color: "violet", fontSize: 16 }}>
                      Do you already have an account? Log in
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

const REGISTER_MUTATION = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;
