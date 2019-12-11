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
  const [otp, setOtp] = useState("");
  const [otperror, setOtpError] = useState(false);

  const handleSubmit = async (verifyEmail, client) => {
    try {
      //

      let res = await verifyEmail();
      console.log(res);
      if (!res.data.verifyEmail.isVerified) setOtpError(true);
      else {
        // console.log(localStorage.getItem("authtoken"))

        props.navigation.navigate("Home");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  console.log(props.navigation.getParam("token"));
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        margin: 16
      }}
    >
      <Mutation mutation={VERIFY_OTP} variables={{ otp }}>
        {(verifyEmail, { loading, error, called, client }) => {
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
                  Verify Email
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
                    value={otp}
                    onChangeText={text => setOtp(text)}
                  />
                </Form>
              </View>
              <View style={{ padding: 16 }}>
                <Button
                  onPress={() => handleSubmit(verifyEmail, client)}
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
                    Verify OTP
                  </Text>
                </Button>

                <View style={{ paddingTop: 16 }}>
                  <Button bordered>
                    <Text
                      style={{
                        color: "violet",
                        fontSize: 16,
                        textAlign: "center"
                      }}
                    >
                      Skip Verification
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

const VERIFY_OTP = gql`
  mutation($otp: String!) {
    verifyEmail(otp: $otp) {
      isVerified
    }
  }
`;
