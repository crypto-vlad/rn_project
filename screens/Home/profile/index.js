import * as React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { Query, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import { STATIC_URL } from "../../../config";
import ProfileTweets from "./usertweets";
import Followers from "./followers";
import Handles from "./handles";
import UserProfile from "./profile";
import { Context } from "../../../usercontext";
import { Button } from "native-base";

import Layout from "../layout";
const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: "#ff4081" }]} />
);

const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: "#673ab7" }]} />
);

export default function Profile(props) {
  const cuser = React.useContext(Context);
  const [index, setIndex] = React.useState(0);
  const [routes, setRoutes] = React.useState([
    { key: "Buzz", title: `Buzz` },
    { key: "Follower", title: `Follower` },
    { key: "Handles", title: `Handles` },
    { key: "Profile", title: `Profile` }
  ]);

  let username;

  if (props.navigation.getParam("username")) {
    username = props.navigation.getParam("username");
  } else {
    username = cuser.username;
  }

  return (
    <Layout {...props} title="Profile">
      <Query
        query={GET_PROFILE}
        fetchPolicy={"cache-and-network"}
        variables={{ username: username }}
      >
        {({ loading, error, data }) => {
          if (loading) return <Text>Loading</Text>;
          if (error) {
            return <Text>Error</Text>;
          }
          if (data) {
            console.log(data);
            return (
              <>
                <ScrollView>
                  <View style={{ flex: 1, flexDirection: "column" }}>
                    {data.userprofile.headerPic == "header.png" ? (
                      <View
                        style={{
                          backgroundColor: "#E7625F",
                          height: 200,
                          width: "100%"
                        }}
                      />
                    ) : (
                      <Image
                        style={{ width: "100%", height: 200 }}
                        source={{
                          uri: `${STATIC_URL}${data.userprofile.headerPic}`
                        }}
                      />
                    )}
                    <View style={{ position: "relative" }}>
                      <Image
                        source={{
                          uri: `${STATIC_URL}${data.userprofile.profilePic}`
                        }}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 150 / 2,
                          borderColor: "blue",
                          borderWidth: 3,
                          position: "absolute",
                          bottom: "-10%",
                          left: 20
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                        marginTop: 16
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        {cuser ? (
                          <TouchableOpacity
                            onPress={() => props.navigation.push("Details")}
                            style={{
                              backgroundColor: "blue",
                              flex: 1,
                              borderRadius: 10
                            }}
                          >
                            <View style={{ flex: 1, justifyContent: "center" }}>
                              <Text
                                style={{ textAlign: "center", color: "white" }}
                              >
                                Edit Profile
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                      <View style={{ flex: 1, alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 22 }}>
                          {data.userprofile.fullname}
                        </Text>
                        <Text
                          style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            fontSize: 18
                          }}
                        >
                          @ {data.userprofile.user.username}
                        </Text>
                      </View>
                    </View>
                    <TabView
                      navigationState={{ index, routes }}
                      renderScene={({ route }) => {
                        switch (route.key) {
                          case "Buzz":
                            return (
                              <ProfileTweets
                                username={data.userprofile.user.username}
                              />
                            );
                          case "Follower":
                            return <Followers userid={data.userprofile.id} />;
                          case "Handles":
                            return (
                              <Handles
                                refetch={() => [
                                  {
                                    query: GET_PROFILE,
                                    variables: {
                                      username: cuser.username
                                    }
                                  }
                                ]}
                                username={data.userprofile.user.username}
                              />
                            );
                          case "Profile":
                            return (
                              <UserProfile
                                profile={data.userprofile}
                                email={data.userprofile.user.email}
                              />
                            );
                          default:
                            return null;
                        }
                      }}
                      onIndexChange={index => setIndex(index)}
                      initialLayout={{
                        width: Dimensions.get("window").width
                      }}
                    />
                  </View>
                </ScrollView>
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
