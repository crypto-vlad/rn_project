import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";

import { Query, ApolloConsumer, Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { STATIC_URL } from "../../../../config";

import { Context } from "../../../../usercontext";

import Layout from "../../layout";
import { Button, Spinner } from "native-base";

export default function ChangeEmail(props) {
  const [currentActive, setCurrentActive] = React.useState(1);
  const [message, setMessage] = React.useState(false);

  return (
    <Query query={IS_EMAIL_CHANGED} fetchPolicy={"cache-and-network"}>
      {({ loading, error, data }) => {
        if (data) {
          if (data.isEmailChanged) {
            if (data.isEmailChanged[0].isOtpChanged) {
              setCurrentActive(2);
            } else {
              setCurrentActive(1);
            }
          }
        }
        if (loading) return <Text>Loading</Text>;
        if (error) {
          return <Text>Error1</Text>;
        }

        return (
          <>
            <Layout {...props}>
              <View style={{ flex: 1 }}>
                {currentActive == 1 ? (
                  <Showemailbox
                    message={message}
                    setCurrentActive={setCurrentActive}
                  />
                ) : (
                  <Showotpbox
                    setMessage={setMessage}
                    setCurrentActive={setCurrentActive}
                  />
                )}
              </View>
            </Layout>
          </>
        );
      }}
    </Query>
  );
}

function Showemailbox(props) {
  const [email, setEmail] = useState("");

  const handleSubmit = async changeEmail => {
    const res = await changeEmail();

    props.setCurrentActive(2);
  };

  return (
    <>
      <Mutation
        mutation={CHANGE_EMAIL}
        variables={{ email: email }}
        refetchQueries={() => {
          return [{ query: IS_EMAIL_CHANGED }];
        }}
        notifyOnNetworkStatusChange={true}
        onCompleted={data => {}}
      >
        {(changeEmail, { loading, error, called, client }) => {
          if (loading) {
            return <Text>Loading</Text>;
          }
          if (error) {
            return <Text>Error2</Text>;
          }
          return (
            <>
              <Text>Enter new email address</Text>
              <TextInput
                placeholder="New Email"
                style={{
                  height: 40,
                  borderColor: "violet",
                  borderWidth: 1,
                  margin: 8
                }}
                value={email}
                onChangeText={text => setEmail(text)}
              />

              <View style={{ padding: 16 }}>
                <Button onPress={() => handleSubmit(changeEmail)} full primary>
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
                      Send Email
                    </Text>
                  )}
                </Button>
              </View>
            </>
          );
        }}
      </Mutation>
    </>
  );
}

function Showotpbox(props) {
  const [otp, setOtp] = useState("");

  const handleSubmit = async verifyEmailChangeOtp => {
    const res = await verifyEmailChangeOtp();

    props.setMessage("Email Changed Successfully");
    props.setCurrentActive(1);
  };

  return (
    <>
      <Mutation
        refetchQueries={() => {
          return [{ query: IS_EMAIL_CHANGED }];
        }}
        mutation={VERIFY_EMAIL_CHANGE}
        variables={{ otp: otp }}
        onCompleted={data => {}}
      >
        {(verifyEmailChangeOtp, { loading, error, called, client }) => {
          if (loading) {
            return <Text>Loafing</Text>;
          }
          return (
            <>
              <Text> Enter otp send to your email</Text>

              <TextInput
                placeholder="Otp"
                style={{
                  height: 40,
                  borderColor: "violet",
                  borderWidth: 1,
                  margin: 8
                }}
                value={otp}
                onChangeText={text => setOtp(text)}
              />
              <View style={{ padding: 16 }}>
                <Button
                  onPress={() => handleSubmit(verifyEmailChangeOtp)}
                  full
                  primary
                >
                  {loading ? (
                    <Text>Loading</Text>
                  ) : (
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        textAlign: "center"
                      }}
                    >
                      Updateee
                    </Text>
                  )}
                </Button>
              </View>
            </>
          );
        }}
      </Mutation>
    </>
  );
}

const IS_EMAIL_CHANGED = gql`
  {
    isEmailChanged {
      id
      emailotp
      tempemail
      isOtpChanged
      user {
        id
        username
      }
    }
  }
`;

const RESET_EMAIL_CHANGE = gql`
  mutation {
    resetEmailChange {
      status
    }
  }
`;

const CHANGE_EMAIL = gql`
  mutation($email: String!) {
    changeEmail(email: $email) {
      status
    }
  }
`;

const VERIFY_EMAIL_CHANGE = gql`
  mutation($otp: String!) {
    verifyEmailChangeOtp(otp: $otp) {
      status
    }
  }
`;
