import React from "react";

import {
  ScrollView,
  Text,
  TouchableHighlight,
  FlatList,
  View
} from "react-native";
import FeedCard from "./newsfeed";
export default function Resolver(props) {
  return (
    <>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <FlatList
          onEndReached={() => alert("hello")}
          data={props.data}
          renderItem={({ item }) => (
            <FeedCard
              item={item}
              cnn={props.cnn ? true : false}
              espn={props.espn ? true : false}
              fox={props.fox ? true : false}
              likes={props.likes}
              comments={props.comments}
              letter={"C"}
              url={item.link}
              updateLikeFunction={props.updateLikeFunction}
              CREATE_LIKE_MUTATION={props.CREATE_LIKE_MUTATION}
              key={item.id}
            />
          )}
          keyExtractor={item => item.id}
        />
        <TouchableHighlight onPress={() => props.loadmore()}>
          <Text>load more</Text>
        </TouchableHighlight>
      </View>
    </>
  );
}
