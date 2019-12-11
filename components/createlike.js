import React from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import {
  Card,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Button,
  Icon
} from "native-base";
import { Context } from "../usercontext";
import { TouchableHighlight } from "react-native";

export default function Createlike(props) {
  const cuser = React.useContext(Context);

  let handleLikeCreate = async createLike => {
    console.debug("inside ceate tike");
    if (cuser && props.isTweet) {
      if (props.userid != cuser.id) {
        const res = await createLike();
      }
    }
    if (!props.isTweet) {
      const res = await createLike();
    }
  };

  return (
    <Mutation
      mutation={props.CREATE_LIKE_MUTATION}
      variables={{ tweetid: props.tweetid }}
      onCompleted={data => {}}
      update={props.updateLikeFunction}
    >
      {(createLike, { loading, error }) => {
        if (loading) {
          console.log("loading");
          return <Text>Loading</Text>;
        }

        if (error) {
          console.log("error");
          console.log(error);
          return <Text>Error</Text>;
        }

        return (
          <>
            <TouchableHighlight onPress={() => handleLikeCreate(createLike)}>
              <Icon active name="thumbs-up" />
            </TouchableHighlight>
          </>
        );
      }}
    </Mutation>
  );
}
