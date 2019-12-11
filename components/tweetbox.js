import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { Icon, Button } from "native-base";
import EmojiInput from "react-native-emoji-input";
import DocumentPicker from "react-native-document-picker";
import Camera from "./camera";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import Axios from "axios";
import { Context } from "../usercontext";
import { PERSPECTIVE_API_URL, UPLOAD_URL } from "../config";

export default function Tweetbox(props) {
  const [showemoji, setShowemoji] = React.useState(false);
  const [camera, showcamera] = React.useState(false);
  const [image, setImage] = React.useState(false);
  const [text, setText] = React.useState("");
  const [file, setFile] = React.useState(false);
  const [isAbusive, setIsAbusive] = useState(false);
  const [componentLoading, setComponentLoading] = React.useState(false);
  const [componentError, setComponentError] = React.useState(false);
  const [tweetError, setTweetError] = React.useState(false);
  const cuser = React.useContext(Context);
  const pickFiles = async () => {
    let result = await DocumentPicker.pick();
    setFile(result);
    console.log(result);
  };
  if (camera) {
    return (
      <Camera
        saveImage={image => {
          showcamera(false);
          setImage(image);
        }}
        close={() => showcamera(false)}
      />
    );
  }
  const handleTweetCreate = async createTweet => {
    setComponentLoading(true);
    console.log(file);
    console.log(image);
    let res;
    let tempIsAbusive = false;
    let authtoken = await AsyncStorage.getItem("authtoken");
    let threat = "";

    let insult = "";

    let toxic = "";
    if (text) {
      try {
        const abusiveRes = await Axios.post(PERSPECTIVE_API_URL, {
          comment: {
            text: text
          },
          languages: ["en"],
          requestedAttributes: {
            TOXICITY: {},
            INSULT: {},
            FLIRTATION: {},
            THREAT: {}
          }
        });
        threat = abusiveRes.data.attributeScores.THREAT.summaryScore.value;
        insult = abusiveRes.data.attributeScores.INSULT.summaryScore.value;
        toxic = abusiveRes.data.attributeScores.TOXICITY.summaryScore.value;
      } catch (error) {
        console.log(error);
        threat = 0.2;
        insult = 0.2;
        toxic = 0.2;
        console.log("perspective not working");
      }

      console.log("fneklf");

      if (threat > 0.95 || insult > 0.95 || toxic > 0.95) {
        console.log("setting abusibf");
        if (props.isReTweet) {
          props.handleAbusive();
          setComponentLoading(false);
        } else {
          setIsAbusive(true);
          setComponentLoading(false);
        }
      } else {
        console.log("files");
        if (props.isReTweet) {
          setComponentLoading(false);
          props.handleText(text);
        } else {
          if (image || file) {
            let dataToSent = false;
            let picname;
            if (image) {
              let a = new Date().toString().split("(")[0];
              let b = a.split(" ");
              b.pop();
              b.pop();
              picname = b.join("-") + cuser.username;
              dataToSent = {
                uri: image.uri,
                name: picname,
                type: "image/jpg"
              };
            }
            if (file && dataToSent == false) {
              let a = new Date().toString().split("(")[0];
              let b = a.split(" ");
              b.pop();
              b.pop();
              picname = b.join("-") + cuser.username;
              if (file.type == "image/jpeg") {
                dataToSent = {
                  uri: file.uri,
                  name: picname,
                  type: "image/jpeg"
                };
              } else if (file.type == "image/png") {
                dataToSent = {
                  uri: file.uri,
                  name: picname,
                  type: "image/png"
                };
              } else if (file.type == "image/jpg") {
                dataToSent = {
                  uri: file.uri,
                  name: picname,
                  type: "image/jpg"
                };
              } else {
                alert("Only Image files are supported for now");
                setComponentLoading(false);
                return;
              }
            }
            console.log("helo");
            console.log(dataToSent);

            try {
              let data = new FormData();
              data.append("token", authtoken);
              data.append("name", picname);
              data.append("file", dataToSent);
              let newres = await Axios.post(UPLOAD_URL, data);

              if (newres.data.success || newres.data.success == "true") {
                let createdtweet = await createTweet({
                  variables: { tweettext: text, tweetimage: picname }
                });
                console.log(createdtweet);
                setComponentLoading(false);
              } else {
                setComponentLoading(false);
                setComponentError(true);
              }
              console.log(newres.data);
            } catch (err) {
              console.log(err);
              setComponentError(true);
              setComponentLoading(false);
            }
          } else {
            try {
              let createdtweet = await createTweet({
                variables: { tweettext: text, tweetimage: "null" }
              });
              console.log(createdtweet);
              setComponentLoading(false);
              console.log("nonimage or file");
            } catch (err) {
              console.log(err);
              setComponentError(true);
              setComponentLoading(false);
            }
          }
        }

        /*   if (pics.length > 0) {
          if (pics[0].size / 1048576 <= 5) {
            let a = new Date().toString().split("(")[0];
            let b = a.split(" ");
            b.pop();
            b.pop();
            let picname = b.join("-") + pics[0].name;

            let data = new FormData();
            data.append("token", localStorage.getItem("authtoken"));
            data.append("name", picname);
            data.append("file", pics[0]);
            let res = await Axios.post(UPLOAD_URL, data);
            if (res.data.success == true) {
              let resdata = await createTweet({
                variables: { tweettext: text, tweetimage: picname }
              });
              setComponentLoading(false);
              setText("");
            } else {
              setComponentLoading(false);
              setComponentError({
                message: "Some Error occured on server"
              });
            }
          } else {
            let resdata = await createTweet({
              variables: { tweettext: text, tweetimage: "null" }
            });
            setComponentLoading(false);

            setText("");
          }
        } */
      }
    } else {
      console.log("no tetx");
      setComponentLoading(false);
    }
  };
  return (
    <Mutation
      mutation={CREATE_TWEET}
      /* refetchQueries={() =>{

            return [{ query: GET_TWEETS, variables:{username:props.username}}]
          }}  */
      update={props.updateTweets}
    >
      {(createTweet, { loading, error, called, client }) => {
        if (loading || componentLoading) {
          return <Text>Loading</Text>;
        }
        if (error) {
          setComponentLoading(false);
        }
        return (
          <View style={{ flex: 1, flexDirection: "column" }}>
            <TextInput
              onChangeText={text => setText(text)}
              style={{ height: 120, borderColor: "#ccc", borderWidth: 1 }}
              placeholder="Create a buzz"
              multiline
              value={text}
            />
            <View
              style={{
                flexDirection: "row",
                borderWidth: 1,
                borderColor: "#ccc",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={pickFiles}>
                  <Icon
                    style={{ padding: 10, color: "violet" }}
                    name="ios-attach"
                  />
                </TouchableOpacity>
                {/*    <TouchableOpacity onPress={() => setShowemoji(!showemoji)}>
            <Icon style={{ padding: 10, color: "violet" }} name="md-sad" />
          </TouchableOpacity> */}
                <TouchableOpacity onPress={() => showcamera(true)}>
                  <Icon
                    style={{ padding: 10, color: "violet" }}
                    name="ios-camera"
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: 100,
                  paddingRight: 10,
                  paddingTop: 2,
                  paddingBottom: 2,
                  justifyContent: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => handleTweetCreate(createTweet)}
                  style={{
                    backgroundColor: "violet",
                    flex: 1,
                    borderRadius: 10
                  }}
                >
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={{ textAlign: "center" }}>Buzz</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {isAbusive && <Text>Your text contain abusive text</Text>}
            {componentError && <Text>An error occured</Text>}
          </View>
        );
      }}
    </Mutation>
  );
}

const CREATE_TWEET = gql`
  mutation($tweettext: String!, $tweetimage: String!) {
    createTweet(tweetext: $tweettext, tweetimage: $tweetimage) {
      tweet {
        id
        url
        logo
        wid
        wmedia
        published
        wtext
        wcreatedat
        isRetweeted
        isUrlValid
        handlename {
          id
          handlename
        }
        user {
          id
          username
          profileSet {
            profilePic
          }
        }
        tweettext
        tweetcountry
        hashtagsSet {
          id
          hastag
        }
        tweetfile
        tweettime
        likes {
          id
          user {
            id
            username
            profileSet {
              profilePic
            }
          }
        }
        comments {
          id
          user {
            id
            username
            profileSet {
              profilePic
            }
          }
          comment
          commenttime
        }
      }
    }
  }
`;
