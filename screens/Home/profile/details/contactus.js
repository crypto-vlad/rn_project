import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';

import {Query, ApolloConsumer, Mutation} from 'react-apollo';
import {gql} from 'apollo-boost';
import {STATIC_URL} from '../../../../config';

import {Context} from '../../../../usercontext';

import Layout from '../../layout';
import {Button, Spinner} from 'native-base';

export default function Contact(props) {
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [messageSent, setMessageSent] = React.useState(false);
  const handleUpdate = async sendMessage => {
    let res = await sendMessage({variables: {subject, message}});
    setMessageSent(true);

    setSubject('');
    setMessage('');
  };
  return (
    <Mutation mutation={SEND_MESSAGE} variables={{subject, message}}>
      {(sendMessage, {loading, error, called, client}) => {
        if (loading) return <Text>Loading</Text>;
        if (error) {
          return <Text>Error</Text>;
        }
        return (
          <Layout {...props}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <TextInput
                placeholder="Old Passwrod"
                style={{
                  height: 40,
                  borderColor: 'violet',
                  borderWidth: 1,
                  margin: 8,
                }}
                value={subject}
                onChangeText={text => setSubject(text)}
              />

              <TextInput
                placeholder="Old Passwrod"
                style={{
                  height: 200,
                  borderColor: 'violet',
                  borderWidth: 1,
                  margin: 8,
                }}
                multiline={true}
                value={message}
                onChangeText={text => setMessage(text)}
              />

              <View style={{padding: 16}}>
                <Button onPress={() => handleUpdate(sendMessage)} full primary>
                  {loading ? (
                    <Spinner color="white" />
                  ) : (
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 16,
                        textAlign: 'center',
                      }}>
                      Send Email
                    </Text>
                  )}
                </Button>
              </View>
            </View>
          </Layout>
        );
      }}
    </Mutation>
  );
}

const SEND_MESSAGE = gql`
  mutation($subject: String!, $message: String!) {
    sendMessage(subject: $subject, message: $message) {
      status
    }
  }
`;
