/* import * as React from "react";
import { View, StyleSheet, Text } from "react-native";

import { Query, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import { STATIC_URL } from "../../../../config";

import { Context } from "../../../../usercontext";

import Layout from "../../layout";
import { Button } from "native-base";

export default function Details(props) {
  const cuser = React.useState(Context);

  const [value, setValue] = React.useState(false);

  const handleUpdate = async (updateTwofa, value) => {
    let res = await updateTwofa({ variables: { value: value } });
  };
  return (
    <Layout {...props}>
      <Query
        query={GET_PROFILE}
        fetchPolicy={"cache-and-network"}
        variables={{ username: cuser.username }}
        notifyOnNetworkStatusChange={true}
      >
        {({ loading, error, data }) => {
          if (loading) return <Text>Loading</Text>;
          if (error) {
            return <Text>Error</Text>;
          }
          if (data) {
            return (
              <>
                <Mutation mutation={UPDATE_TWO_FA} onCompleted={data => {}}>
                  {(updateTwofa, { loading, error, called, client }) => {
                    if (error) {
                      return <Text>Error</Text>;
                    }
                    if (loading) {
                      return <Text>Loading</Text>;
                    }

                    return (
                      <>
                        <Layout {...props}>
                          <View
                            style={{
                              flexDirection: "row",
                              flex: 1,
                              justifyContent: "space-around",
                              alignItems: "center"
                            }}
                          >
                            {value == true ? (
                              <>
                                <Text style={{ fontSize: 18 }}>
                                  Two FS is enabled
                                </Text>
                                {loading ? (
                                  <Spinner color="blue" />
                                ) : (
                                  <Switch
                                    onValueChange={async () => {
                                      await updateTwofa({
                                        variables: { value: false }
                                      });

                                      setValue(false);
                                    }}
                                    value={value}
                                  />
                                )}
                              </>
                            ) : (
                              <>
                                <Text style={{ fontSize: 18 }}>
                                  Two FA is disabled
                                </Text>
                                {loading ? (
                                  <Spinner color="blue" />
                                ) : (
                                  <Switch
                                    onValueChange={async () => {
                                      const res = await updateTwofa({
                                        variables: { value: true }
                                      });

                                      setValue(true);
                                    }}
                                    value={value}
                                  />
                                )}
                              </>
                            )}
                          </View>
                        </Layout>
                      </>
                    );
                  }}
                </Mutation>
              </>
            );
          }
        }}
      </Query>
    </Layout>
  );
}
 */ import * as React from "react";
import { View, StyleSheet, Text } from "react-native";

import { Query, ApolloConsumer, Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { STATIC_URL } from "../../../../config";

import { Context } from "../../../../usercontext";

import Layout from "../../layout";
import { Button, Switch } from "native-base";

export default function Details(props) {
  const cuser = React.useContext(Context);

  return (
    <Layout {...props}>
      <Query
        query={GET_PROFILE}
        fetchPolicy={"cache-and-network"}
        variables={{ username: cuser.username }}
        notifyOnNetworkStatusChange
      >
        {({ loading, error, data, refetch, networkStatus }) => {
          console.log("networkstatsu");
          console.log(networkStatus);
          if (loading) {
            console.log(loading);
            return <Text>Loading</Text>;
          }
          if (error) {
            return <Text>Error</Text>;
          }
          if (data) {
            return (
              <>
                <Mutation
                  refetchQueries={() => {
                    return [
                      {
                        query: GET_PROFILE,
                        variables: { username: cuser.username }
                      }
                    ];
                  }}
                  mutation={UPDATE_TWO_FA}
                  onCompleted={data => {
                    refetch();
                  }}
                >
                  {(updateTwofa, { loading, error, called, client }) => {
                    if (error) {
                      return <Text>Error</Text>;
                    }
                    if (loading) {
                      return <Text>Loading</Text>;
                    }

                    return (
                      <>
                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            justifyContent: "space-around",
                            alignItems: "center"
                          }}
                        >
                          {data.userprofile.is2fa == true ? (
                            <>
                              <Text style={{ fontSize: 18 }}>
                                Two FS is enabled
                              </Text>
                            </>
                          ) : (
                            <Text style={{ fontSize: 18 }}>
                              Two FS is disabled
                            </Text>
                          )}

                          <Switch
                            onValueChange={async () => {
                              const res = await updateTwofa({
                                variables: { value: !data.userprofile.is2fa }
                              });
                              console.log(res);
                            }}
                            value={data.userprofile.is2fa}
                          />
                        </View>
                      </>
                    );
                  }}
                </Mutation>
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

const UPDATE_TWO_FA = gql`
  mutation($value: Boolean!) {
    updateTwofa(value: $value) {
      status
    }
  }
`;
