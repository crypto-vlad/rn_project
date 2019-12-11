import React from "react";

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

import { STATIC_URL } from "../../../../config/";

function Followers(props) {
  function handleNoFollower(data, refetch) {
    console.log(data);
    if (data.specificuserfollower != undefined) {
      return data.specificuserfollower.followerId.map((item, index) => (
        <Showfollowers
          refetch={refetch}
          key={index}
          userid={props.userid}
          item={item}
        />
      ));
    } else {
      return <Text>No Follower</Text>;
    }
  }

  return (
    <Query
      query={GET_FOLLOWER}
      fetchPolicy="cache-and-network"
      variables={{ userid: props.userid }}
      notifyOnNetworkStatusChange
    >
      {({ loading, error, data, refetch, networkStatus }) => {
        if (loading) return <Text>Loading</Text>;
        if (error) return <Text>Error</Text>;
        console.log("follower data");
        console.log(data);
        return <List>{handleNoFollower(data, refetch)}</List>;
      }}
    </Query>
  );
}

const GET_FOLLOWER = gql`
  query($userid: Int!) {
    specificuserfollower(userid: $userid) {
      id
      user {
        id
        username
        profileSet {
          profilePic
        }
      }
      followerId {
        id
        username
        profileSet {
          profilePic
        }
      }
    }
  }
`;

function Showfollowers(props) {
  return (
    <Mutation
      mutation={REMOVE_FOLLOWER}
      variables={{ usertoremoveid: props.item.id }}
      onCompleted={() => props.refetch()}
    >
      {(removeFollower, { loading, error, called, client }) => {
        if (loading) return <Text>Loading</Text>;
        if (error) return <Text>Error</Text>;
        console.log("userid");
        console.log(props.userid);
        console.log("user to remove");
        console.log(props.item.id);
        return (
          <ListItem avatar>
            <Left>
              <Thumbnail
                source={{
                  uri: `${STATIC_URL}${props.item.profileSet[0].profilePic}`
                }}
              />
            </Left>
            <Body>
              <Text>{props.item.username}</Text>
            </Body>
            <Right>
              <Right>
                <TouchableHighlight
                  onPress={async () => {
                    const res = await removeFollower();
                    console.log(res);
                  }}
                >
                  <Icon name="md-remove-circle-outline" />
                </TouchableHighlight>
              </Right>
            </Right>
          </ListItem>
        );
      }}
    </Mutation>
  );
}

const REMOVE_FOLLOWER = gql`
  mutation($usertoremoveid: Int!) {
    removeFollower(userToRemoveId: $usertoremoveid) {
      user {
        id
      }
      userremoved {
        id
      }
    }
  }
`;

export default Followers;
