import React, { useState } from "react";

import {
  List,
  ListItem,
  Left,
  Body,
  Thumbnail,
  Text,
  Icon,
  Right
} from "native-base";
import { TouchableHighlight } from "react-native";
import { Query, Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Context } from "../../../../usercontext";

export default function Handles(props) {
  const cuser = React.useContext(Context);

  return (
    <Query
      query={GET_HANDLERS}
      variables={{ username: props.username }}
      fetchPolicy="cache-and-network"
    >
      {({ loading, error, data }) => {
        if (loading) return <Text>Loadfing</Text>;
        if (error) return <Text>Error</Text>;

        return (
          <List>
            {data.allhandles.length > 0 ? (
              data.allhandles.map((item, index) => {
                return (
                  <ShowHandler
                    username={props.username}
                    removeHandle={
                      props.username == cuser.username ? true : false
                    }
                    item={item}
                  />
                );
              })
            ) : (
              <Text>No handle</Text>
            )}
          </List>
        );
      }}
    </Query>
  );
}

function ShowHandler(props) {
  return (
    <Mutation
      mutation={REMOVE_HANDLE}
      variables={{ handle: props.item.TweetHandlers.handlename }}
      refetchQueries={() => [
        {
          query: GET_HANDLERS,
          variables: {
            username: props.username
          }
        }
      ]}
    >
      {(removeHandle, { loading, error, called, client }) => {
        if (loading) return <Text>Loading</Text>;
        if (error) return <Text>Error</Text>;
        return (
          <ListItem avatar>
            <Left>
              <Thumbnail
                source={{
                  uri: `${props.item.TweetHandlers.logo}`
                }}
              />
            </Left>
            <Body>
              <Text>{props.item.TweetHandlers.handlename}</Text>
            </Body>
            {props.removeHandle ? (
              <Right>
                <TouchableHighlight
                  onPress={async () => {
                    await removeHandle();
                  }}
                >
                  <Icon name="md-remove-circle-outline" />
                </TouchableHighlight>
              </Right>
            ) : null}
          </ListItem>
        );
      }}
    </Mutation>
  );
}

export const GET_HANDLERS = gql`
  query($username: String) {
    allhandles(username: $username) {
      id
      user {
        id
        username
      }
      TweetHandlers {
        id
        handlename
        logo
      }
    }
  }
`;

const REMOVE_HANDLE = gql`
  mutation($handle: String!) {
    removeHandle(handle: $handle) {
      status
    }
  }
`;
