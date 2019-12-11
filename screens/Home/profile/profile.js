import { Mutation, Query } from "react-apollo";
import { gql } from "apollo-boost";
import {
  List,
  ListItem,
  Left,
  Body,
  Thumbnail,
  Text,
  Right
} from "native-base";
import React, { useState } from "react";

export default function FolderList({ profile, email }) {
  return (
    <>
      <Profiledetails title="Full Name" value={profile.fullname} />

      <Profiledetails title="Email" value={email} />

      <Profiledetails title="City" value={profile.city} />
      <Profiledetails title="State" value={profile.state} />
      <Profiledetails title="Country" value={profile.country} />
      <Profiledetails title="Occupation" value={profile.occupation} />
      <Profiledetails
        title="Short Description"
        value={profile.shortdescription}
      />
    </>
  );
}

function Profiledetails(props) {
  return (
    <>
      <ListItem>
        <Left>
          <Text>{props.title}</Text>
        </Left>

        <Body>
          <Text>{props.value}</Text>
        </Body>
      </ListItem>
    </>
  );
}
