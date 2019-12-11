import * as React from "react";
import { View, StyleSheet, Text } from "react-native";

import { Query, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import { STATIC_URL } from "../../../../config";

import { Context } from "../../../../usercontext";

import Layout from "../../layout";
import { Button } from "native-base";

export default function Details(props) {
  const cuser = React.useContext(Context);
  return (
    <Layout {...props}>
      <Query
        query={GET_PROFILE}
        fetchPolicy={"cache-and-network"}
        variables={{ username: cuser.username }}
      >
        {({ loading, error, data }) => {
          if (loading) return <Text>Loading</Text>;
          if (error) {
            return <Text>Error</Text>;
          }
          if (data) {
            return (
              <>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Button
                    onPress={() => props.navigation.navigate("Editprofile")}
                    style={{ marginBottom: 16 }}
                    full
                    bordered
                    primary
                  >
                    <Text>Edit Profile</Text>
                  </Button>
                  <Button
                    onPress={() => props.navigation.navigate("ChangePassword")}
                    style={{ marginBottom: 16 }}
                    full
                    bordered
                    primary
                  >
                    <Text>Change Password</Text>
                  </Button>
                  <Button
                    onPress={() =>
                      props.navigation.navigate("Is2fa", {
                        is2fa: data.userprofile.is2fa
                      })
                    }
                    style={{ marginBottom: 16 }}
                    full
                    bordered
                    primary
                  >
                    <Text> Two Factor Authentication</Text>
                  </Button>
                  <Button
                    onPress={() => props.navigation.navigate("contactus")}
                    style={{ marginBottom: 16 }}
                    full
                    bordered
                    primary
                  >
                    <Text>Contact US</Text>
                  </Button>
                  <Button
                    onPress={() => props.navigation.navigate("Changeemail")}
                    style={{ marginBottom: 16 }}
                    full
                    bordered
                    primary
                  >
                    <Text> Change Email</Text>
                  </Button>
                </View>
              </>
            );
          }
        }}
      </Query>
    </Layout>
  );
}

export const GET_PROFILE = gql`
  query($username: String!) {
    userprofile(username: $username) {
      id
      fullname
      city
      state
      country
      headerPic
      profilePic
      shortdescription
      occupation
      verified
      is2fa
      user {
        id
        username
        email
        tweetSet {
          id
          tweettext
        }
        followers {
          id
          user {
            id
            email
            username
          }
        }
      }
    }
  }
`;

const styles = StyleSheet.create({
  scene: {
    flex: 1
  }
});
