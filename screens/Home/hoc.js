import React from "react";

import { Text } from "native-base";

import { Query, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import HomeScreen from "./home/home";
import { Context } from "../../usercontext";

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

export default function Hoc(props) {
  return (
    <Query query={IS_LOGGED_IN_QUERY}>
      {({ data }) => {
        if (data) {
          return (
            <>
              {data.tempuser ? (
                <Context.Provider value={false}>
                  <Text>No CUser</Text>
                </Context.Provider>
              ) : (
                <Query query={GET_CURRENT_USER}>
                  {({ loading, error, data }) => {
                    if (loading) return <Text>Loading</Text>;
                    if (error) {
                      console.debug(error);
                      return <Text>Error</Text>;
                    }
                    if (data) {
                      return (
                        <Context.Provider value={data.me}>
                          <HomeScreen {...props} />
                        </Context.Provider>
                      );
                    }
                  }}
                </Query>
              )}
            </>
          );
        }
      }}
    </Query>
  );
}

const IS_LOGGED_IN_QUERY = gql`
  {
    isLoggedIn
    tempuser @client
  }
`;

//

export const GET_CURRENT_USER = gql`
  {
    me {
      id
      username
      profileSet {
        profilePic
        emailverified
      }
    }
  }
`;
