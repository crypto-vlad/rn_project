import React, { Component } from "react";
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
import { View, Text, TouchableOpacity } from "react-native";
export default class FloatingLabelExample extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          margin: 16
        }}
      >
        <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10 }}>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
              padding: 16
            }}
          >
            <Text style={{ fontSize: 20, textAlign: "center" }}>Register</Text>
          </View>
          <View
            style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}
          >
            <Form>
              <Item floatingLabel>
                <Label>Otp</Label>
                <Input />
              </Item>
            </Form>
          </View>
          <View style={{ padding: 16 }}>
            <Button full primary>
              <Text
                style={{ color: "white", fontSize: 16, textAlign: "center" }}
              >
                Verify Otp
              </Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
