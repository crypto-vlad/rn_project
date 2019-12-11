import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";

import { Query, ApolloConsumer, Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { STATIC_URL } from "../../../../config";

import { Context } from "../../../../usercontext";

import Layout from "../../layout";
import { Button, Spinner } from "native-base";

export default function ChangePassword(props) {
  const [password, setPassword] = useState("");
  const [opassword, setOpassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [passwordNotMatch, setPasswordNotMatch] = useState("");

  const [passwordValid, setPasswordValid] = useState(true);

  const handleSubmit = async updatePassword => {
    //
    if (!passwordNotMatch && passwordValid) {
      const res = await updatePassword();

      if (res.data.updatePassword.status) alert("Pasword Updated Succesfully");
    }
  };
  return (
    <>
      <Mutation
        mutation={UPDATE_PASSWORD_MUTATION}
        variables={{ op: opassword, p: password }}
        onCompleted={data => {}}
      >
        {(updatePassword, { loading, error, called, client }) => {
          return (
            <>
              <Layout {...props}>
                <View style={{ flexDirection: "column", flex: 1 }}>
                  <TextInput
                    placeholder="Old Passwrod"
                    style={{
                      height: 40,
                      borderColor: "violet",
                      borderWidth: 1,
                      margin: 8
                    }}
                    value={opassword}
                    onChangeText={text => setOpassword(text)}
                  />

                  <TextInput
                    placeholder="New Password"
                    style={{
                      height: 40,
                      borderColor: "violet",
                      borderWidth: 1,
                      margin: 8
                    }}
                    onChangeText={text => {
                      setPassword(text);
                    }}
                    onBlur={() => {
                      let regex = new RegExp(
                        "^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,}))"
                      );
                      if (!regex.test(password)) setPasswordValid(false);
                      else setPasswordValid(true);
                    }}
                  />
                  <TextInput
                    placeholder="Confirm Password"
                    style={{
                      height: 40,
                      borderColor: "violet",
                      borderWidth: 1,
                      margin: 8
                    }}
                    onBlur={() => {
                      if (password != cpassword) setPasswordNotMatch(true);
                      else setPasswordNotMatch(false);
                    }}
                    onChangeText={text => setCpassword(text)}
                  />

                  <View style={{ padding: 16 }}>
                    <Button
                      onPress={() => handleSubmit(updatePassword)}
                      full
                      primary
                    >
                      {loading ? (
                        <Spinner color="white" />
                      ) : (
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                            textAlign: "center"
                          }}
                        >
                          Change Password
                        </Text>
                      )}
                    </Button>
                  </View>
                </View>
              </Layout>
            </>
          );
        }}
      </Mutation>
    </>
  );
}

const UPDATE_PASSWORD_MUTATION = gql`
  mutation($op: String!, $p: String) {
    updatePassword(oldpassword: $op, password: $p) {
      status
    }
  }
`;
