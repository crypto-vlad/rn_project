import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import Axios from "axios";

import { Query, ApolloConsumer, Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { STATIC_URL, UPLOAD_URL } from "../../../../config";

import { Context } from "../../../../usercontext";
import csc from "country-state-city";
import Layout from "../../layout";
import { Button, Picker, Icon } from "native-base";
import { TextInput } from "react-native-gesture-handler";

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
                <EditPofile data={data} />
              </>
            );
          }
        }}
      </Query>
    </Layout>
  );
}

function EditPofile({ data }) {
  const cuser = React.useContext(Context);
  const [fullname, setFullname] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [headerPic, setHeaderPic] = React.useState({ name: false });
  const [profilePic, setProfilePic] = React.useState({ name: false });
  const [country, setCountry] = React.useState("");
  const [occupation, setOccupation] = React.useState("");
  const [shortdescription, setShortdescription] = React.useState("");
  const [statelist, setStatelist] = React.useState(null);
  const [citylist, setCitylist] = React.useState(null);
  const [countrylist, setCountrylist] = React.useState(null);
  const [imageUploading, setImageUploading] = React.useState(false);

  React.useEffect(() => {
    data.userprofile.fullname ? setFullname(data.userprofile.fullname) : null;
    data.userprofile.occupation
      ? setOccupation(data.userprofile.occupation)
      : null;
    data.userprofile.shortdescription
      ? setShortdescription(data.userprofile.shortdescription)
      : null;
    data.userprofile.city ? setCity(data.userprofile.city) : null;
    let allcountries = csc.getAllCountries();
    if (data.userprofile.country) {
      let countryId = null;
      allcountries.forEach(item => {
        if (item.name == data.userprofile.country) {
          countryId = item.id;
        }
      });
      let tempstatelist = csc.getStatesOfCountry(countryId);
      setCountrylist(allcountries);
      setStatelist(tempstatelist);
    } else {
      setCountrylist(allcountries);
    }
  }, []);
  const handleHeaderChange = async () => {
    let result = await DocumentPicker.pick();
    let ext = result.name.split(".");
    if (ext.length == 2) {
      if (ext[1] == "jpg" || ext[1] == "jpeg" || ext == "png") {
        setHeaderPic({ ...result });
      } else {
        alert("invalid file");
      }
    }
    /*   setFile(file); */
    console.log(result);
  };

  const handleProfileUpload = async updateProfile => {
    alert("hello");
    console.log("hello");
    let a = new Date().toString().split("(")[0];
    let b = a.split(" ");
    let authtoken = await AsyncStorage.getItem("authtoken");
    b.pop();
    b.pop();
    let headerPicName;
    let profilePicName;
    console.log(profilePic.name != false);
    console.log(headerPic.name != false);
    if (profilePic.name != false) {
      setImageUploading(true);
      profilePicName = b.join("-") + profilePic.name;
      let data = new FormData();
      let ext = profilePic.name.split(".");
      let data1ToSent = "";
      if (ext[1] == "jpg") {
        data1ToSent = {
          uri: profilePic.uri,
          name: profilePicName,
          type: "image/jpg"
          //type: "application/pdf"
        };
      }
      if (ext[1] == "jpeg") {
        data1ToSent = {
          uri: profilePic.uri,
          name: profilePicName,
          type: "image/jpeg"
          //type: "application/pdf"
        };
      }
      if (ext[1] == "png") {
        data1ToSent = {
          uri: profilePic.uri,
          name: profilePicName,
          type: "image/png"
          //type: "application/pdf"
        };
      }
      data.append("token", authtoken);
      data.append("name", profilePicName);
      data.append("file", data1ToSent);
      let res1 = await Axios.post(UPLOAD_URL, data);
      setImageUploading(false);
      /*    console.log("blah");
      console.log(res1);
      console.log(data1ToSent); */
    } else {
      profilePicName = data.userprofile.profilePic;
    }
    if (headerPic.name != false) {
      setImageUploading(true);
      console.log("header");
      headerPicName = b.join("-") + headerPic.name;
      let data = new FormData();
      let ext = headerPic.name.split(".");
      let data1ToSent = "";
      if (ext[1] == "jpg") {
        data1ToSent = {
          uri: headerPic.uri,
          name: headerPicName,
          type: "image/jpg"
          //type: "application/pdf"
        };
      }
      if (ext[1] == "jpeg") {
        data1ToSent = {
          uri: headerPic.uri,
          name: headerPicName,
          type: "image/jpeg"
          //type: "application/pdf"
        };
      }
      if (ext[1] == "png") {
        data1ToSent = {
          uri: headerPic.uri,
          name: headerPicName,
          type: "image/png"
          //type: "application/pdf"
        };
      }
      /*  console.log(data1ToSent); */
      data.append("token", authtoken);
      data.append("name", profilePicName);
      data.append("file", data1ToSent);
      /*  console.log("blah"); */
      let res1 = await Axios.post(UPLOAD_URL, data);
      setImageUploading(false);
      /* console.log(res1); */
    } else {
      headerPicName = data.userprofile.headerPic;
    }
    let variables = {
      name: fullname,
      email: data.userprofile.user.email,
      city: city,
      state: state,
      country: country,
      occupation: occupation,
      profilepic: profilePicName,
      headerpic: headerPicName,

      shortdescription: shortdescription
    };
    console.log("variables");
    console.log(variables);
    let res = await updateProfile({
      variables: variables
    });
    console.log(res);
  };
  const handleProfileChange = async () => {
    let result = await DocumentPicker.pick();
    let ext = result.name.split(".");
    if (ext.length == 2) {
      if (ext[1] == "jpg" || ext[1] == "jpeg" || ext == "png") {
        setProfilePic({ ...result });
      } else {
        alert("invalid file");
      }
    }
    /*  setFile(file); */
    console.log(result);
  };
  return (
    <ScrollView>
      <Mutation
        mutation={UPDATE_PROFILE_MUTATION}
        refetchQueries={() => {
          return [
            { query: GET_PROFILE, variables: { username: cuser.username } }
          ];
        }}
      >
        {(updateProfile, { loading, error, called, client }) => {
          if (error) {
            console.log(error.message);
            return <Text>Error</Text>;
          }
          if (loading || imageUploading) return <Text>Loading</Text>;
          console.log(data.userprofile);
          return (
            <View style={{ flex: 1, flexDirection: "column" }}>
              <View style={{ marginBottom: 10 }}>
                {headerPic.name == false &&
                data.userprofile.headerPic == "header.png" ? (
                  <View
                    style={{
                      backgroundColor: "#E7625F",
                      height: 200,
                      width: "100%"
                    }}
                  >
                    <View
                      style={{ position: "absolute", right: 20, bottom: "10%" }}
                    >
                      <TouchableOpacity onPress={handleHeaderChange}>
                        <Icon name="md-brush" style={{ color: "white" }} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <ImageBackground
                    style={{ width: "100%", height: 200 }}
                    source={{
                      uri:
                        headerPic.name == false
                          ? `${STATIC_URL}${data.userprofile.headerPic}`
                          : headerPic.uri
                    }}
                  >
                    <View
                      style={{ position: "absolute", right: 20, bottom: "10%" }}
                    >
                      <TouchableOpacity onPress={handleHeaderChange}>
                        <Icon name="md-brush" style={{ color: "white" }} />
                      </TouchableOpacity>
                    </View>
                  </ImageBackground>
                )}
                <View style={{ position: "relative" }}>
                  <View
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
                  >
                    <ImageBackground
                      source={{
                        uri:
                          profilePic.name == false
                            ? `${STATIC_URL}${data.userprofile.profilePic}`
                            : profilePic.uri
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 150 / 2
                      }}
                      imageStyle={{ borderRadius: 150 / 2 }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <TouchableOpacity onPress={handleProfileChange}>
                          <Icon name="md-brush" style={{ color: "white" }} />
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                  </View>
                </View>
              </View>
              <InputBox
                value={fullname}
                onChangeText={text => setFullname(text)}
                style={styles.input}
                placeholder="Full Name"
              />

              <View
                style={{
                  borderWidth: 1,
                  borderColor: "violet",
                  marginBottom: 10,
                  borderRadius: 10
                }}
              >
                <PickerComonent
                  value={
                    country == ""
                      ? data.userprofile.country
                        ? data.userprofile.country
                        : null
                      : country
                  }
                  data={countrylist}
                  onValueChange={value => {
                    setCountry(value);
                  }}
                />
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "violet",
                  marginBottom: 10,
                  borderRadius: 10
                }}
              >
                <StatePickerComonent
                  value={
                    state == ""
                      ? data.userprofile.state
                        ? data.userprofile.state
                        : null
                      : state
                  }
                  data={statelist}
                  onValueChange={value => setState(value)}
                  placeholder="Select State"
                  country={
                    country == ""
                      ? data.userprofile.country
                        ? data.userprofile.country
                        : null
                      : country
                  }
                  countrylist={countrylist}
                />
              </View>
              <InputBox
                value={city}
                onChangeText={text => setCity(city)}
                style={styles.input}
                placeholder="City"
              />
              <InputBox
                value={occupation}
                onChangeText={text => setOccupation(text)}
                style={styles.input}
                placeholder="Occupation"
              />
              <InputBox
                value={shortdescription}
                onChangeText={text => setShortdescription(text)}
                style={styles.input}
                placeholder="Short Description"
                multiline={true}
                height={200}
              />

              <Button
                onPress={() => handleProfileUpload(updateProfile)}
                style={{ marginBottom: 16 }}
                full
                primary
              >
                <Text style={{ color: "white" }}> Change Email</Text>
              </Button>
            </View>
          );
        }}
      </Mutation>
    </ScrollView>
  );
}

function InputBox(props) {
  return (
    <TextInput
      placeholder={props.placeholder}
      value={props.value}
      onChangeText={props.onChangeText}
      multiline={props.multiline}
      style={
        props.height ? { ...props.style, height: props.height } : props.style
      }
    />
  );
}

function PickerComonent(props) {
  return (
    <Picker
      note
      mode="dropdown"
      placeholder={props.value == null ? props.placeholder : null}
      selectedValue={props.value}
      onValueChange={value => props.onValueChange(value)}
    >
      {props.data != null
        ? props.data.map((item, index) => {
            return (
              <Picker.Item key={index} label={item.name} value={item.name} />
            );
          })
        : null}
    </Picker>
  );
}

function StatePickerComonent(props) {
  let statelist = null;
  if (props.country && props.countrylist) {
    let countryId;
    props.countrylist.forEach(item => {
      if (item.name == props.country) {
        countryId = item.id;
      }
    });
    statelist = csc.getStatesOfCountry(countryId);
  }

  return (
    <Picker
      note
      mode="dropdown"
      placeholder={props.value == null ? props.placeholder : null}
      selectedValue={props.value}
      onValueChange={value => props.onValueChange(value)}
    >
      {statelist != null
        ? statelist.map((item, index) => {
            return (
              <Picker.Item key={index} label={item.name} value={item.name} />
            );
          })
        : null}
    </Picker>
  );
}

const UPDATE_PROFILE_MUTATION = gql`
  mutation(
    $name: String!
    $email: String!
    $city: String!
    $state: String!
    $country: String!
    $shortdescription: String!
    $occupation: String!
    $profilepic: String!
    $headerpic: String!
  ) {
    updateProfile(
      fullname: $name
      email: $email
      city: $city
      state: $state
      country: $country
      occupation: $occupation
      shortdescription: $shortdescription
      profilepic: $profilepic
      headerpic: $headerpic
    ) {
      profile {
        id
      }
    }
  }
`;

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
  input: {
    borderWidth: 1,
    borderColor: "violet",
    marginBottom: 10,
    borderRadius: 10
  }
});
