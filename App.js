/*

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { firebase } from "@react-native-firebase/messaging";

// TODO(you): import any additional firebase services that you require for your app, e.g for auth:
//    1) install the npm package: `yarn add @react-native-firebase/auth@alpha` - you do not need to
//       run linking commands - this happens automatically at build time now
//    2) rebuild your app via `yarn run run:android` or `yarn run run:ios`
//    3) import the package here in your JavaScript code: `import '@react-native-firebase/auth';`
//    4) The Firebase Auth service is now available to use here: `firebase.auth().currentUser`

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\nCmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\nShake or press menu button for dev menu"
});

const firebaseCredentials = Platform.select({
  ios: "https://invertase.link/firebase-ios",
  android: "https://invertase.link/firebase-android"
});

export default class App extends Component {
  async componentDidMount() {
    this.checkPermission();
  }

  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      // user has a device token
      console.log(fcmToken);
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log("permission rejected");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native + Firebase!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
 */

import React from "react";

import { Text, View } from "react-native";
import { Query, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import { firebase } from "@react-native-firebase/messaging";

import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import ChangePassword from "./screens/Home/profile/details/changepassword";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, Observable } from "apollo-link";

import HashtagScreen from "./screens/Home/hashtag";
import { withClientState } from "apollo-link-state";

import { AsyncStorage } from "react-native";
import { Context } from "./usercontext";

import { InMemoryCache } from "apollo-cache-inmemory";
import Is2fa from "./screens/Home/profile/details/twofa";
import Details from "./screens/Home/profile/details";

import Contactus from "./screens/Home/profile/details/contactus";
import ShareScreen from "./screens/Share/";
import HomeScreen from "./screens/Home/hoc";
import CnnScreen from "./screens/Home/cnn/index";
import EspnScreen from "./screens/Home/espn";
import FoxScreen from "./screens/Home/fox";
import WorldTweet from "./screens/Home/worldtweets";

import ChangeEMailScreen from "./screens/Home/profile/details/changeemail";
import RegisterScreen from "./screens/Auth";
import AuthLoadingScreen from "./screens/Authentication";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import ProfileScreen from "./screens/Home/profile/index";
import SearchScreen from "./screens/Home/search";
import LoginScreen from "./screens/Auth/signin";
import EditProfileScreen from "./screens/Home/profile/details/editprofile";
import VerifyEmail from "./screens/Auth/verifyEmail";
import TwoFa from "./screens/Auth/2fa";
import ForgetPassword from "./screens/Auth/forgetpassword";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import Splash from './screens/Splash';
import Dashboard from './screens/Dashboard';

/* const httpLink = createHttpLink({
  uri: "https://api.buzzraker.com/graphql/"
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists

  const token = await AsyncStorage.getItem("authtoken");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      Authorization: `JWT ${token || ""}`
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
 */
/* const waitOnCache = persistCache({ cache, storage: AsyncStorage }); */

const request = async operation => {
  const token = (await AsyncStorage.getItem("authtoken")) || "";

  operation.setContext({
    headers: {
      Authorization: `JWT ${token}`
    }
  });
};

const cache = new InMemoryCache();
const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle;
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
      }
      if (networkError) {
      }
    }),
    requestLink,
    withClientState({
      defaults: {
        isConnected: true,
        isLoggedIn: !!AsyncStorage.getItem("authtoken"),
        authRoute: false,
        showProfile: false,
        tempuser: false
      },
      resolvers: {
        Mutation: {
          updateNetworkStatus: (_, { isConnected }, { cache }) => {
            return null;
          }
        }
      },
      cache
    }),
    new HttpLink({
      uri: "https://api.buzzraker.com/graphql/"
      // uri: 'http://localhost:8000/graphql/'
    })
  ]),
  cache
});

const AppStack = createStackNavigator(
  {
    /* Home: HomeScreen
    /* Search: SearchScreen,*/
    //  Hashtag: HashtagScreen

    Cnn: CnnScreen,

    Espn: EspnScreen,
    Fox: FoxScreen,

    Worldtweet: WorldTweet
    /*
    Profile: ProfileScreen,
    Details,
    Editprofile: EditProfileScreen,
    ChangePassword,
    Is2fa,
    contactus: Contactus,
    Changeemail: ChangeEMailScreen,
    ShareScreen: ShareScreen */
  },
  {
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);
const AuthStack = createStackNavigator(
  {
    Dash : Dashboard,
    Register: RegisterScreen,
    Login: LoginScreen
    /*TwoFa: TwoFa,
    Verifyemail: VerifyEmail,
    Forgetpassword: ForgetPassword */
  },
  {
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      // Splash: Splash,
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);

export default class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      senderId: "482158670065"
    };
  }

  componentWillUnmount() {
    this.removeNotificationDisplayedListener();
    this.removeNotificationListener();
  }
  async componentDidMount() {
    /*  console.log('hello');
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
     
    }); */
    /*   this.setState({loading: false}); */
    const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
      // user has a device token
      console.log(fcmToken);
      const enabled = await firebase.messaging().hasPermission();
      if (enabled) {
        firebase.messaging().subscribeToTopic("testtopic");
        // user has permissions
        console.log("enabled");
        this.removeNotificationDisplayedListener = firebase
          .notifications()
          .onNotificationDisplayed(notification => {
            console.log(notification);
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
          });
        this.removeNotificationListener = firebase
          .notifications()
          .onNotification(notification => {
            console.log(notification);
            // Process your notification as required
          });
        this.removeNotificationOpenedListener = firebase
          .notifications()
          .onNotificationOpened(notificationOpen => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            cosnole.log(action);
            // Get information about the notification that was opened
            const notification = notificationOpen.notification;
            console.log(notification);
          });
        const notificationOpen = await firebase
          .notifications()
          .getInitialNotification();
        if (notificationOpen) {
          // App was opened by a notification
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          console.log(action);
          // Get information about the notification that was opened
          const notification = notificationOpen.notification;
          console.log(notification);
        }
      } else {
        console.log("not enabled");
        await firebase.messaging().requestPermission();
        // user doesn't have permission
      }
    } else {
      console.log("no token");
      // user doesn't have a device token yet
    }
  }
  render() {
    /*  if (this.state.loading) {
      return <Text>loading</Text>;
    } */
    return (
      <ApolloProvider fetchPolicy="cache-and-network" client={client}>
        <Query query={GET_CURRENT_USER}>
          {({ loading, error, data }) => {
            
            if (loading) return <Splash/>;
            if (error) {
              console.debug(error);
            } 
            return (
              <Context.Provider value={data ? data.me : false}>
                <AppContainer currentUser={data ? data.me : false} />
              </Context.Provider>
            );
          }}
        </Query>
      </ApolloProvider>
    );
  }
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

/* 
import React from 'react';
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  ScrollView,
} from 'react-native';



export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
    alert('ngkj');
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      // user has a device token
      console.log(fcmToken);
      const enabled = await firebase.messaging().hasPermission();
      if (enabled) {
        firebase.messaging().subscribeToTopic('testtopic');
        // user has permissions
        console.log('enabled');
        this.removeNotificationDisplayedListener = firebase
          .notifications()
          .onNotificationDisplayed(notification => {
            console.log(notification);
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
          });
        this.removeNotificationListener = firebase
          .notifications()
          .onNotification(notification => {
            console.log(notification);
            // Process your notification as required
          });
        this.removeNotificationOpenedListener = firebase
          .notifications()
          .onNotificationOpened(notificationOpen => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            cosnole.log(action);
            // Get information about the notification that was opened
            const notification = notificationOpen.notification;
            console.log(notification);
          });
        const notificationOpen = await firebase
          .notifications()
          .getInitialNotification();
        if (notificationOpen) {
          // App was opened by a notification
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          console.log(action);
          // Get information about the notification that was opened
          const notification = notificationOpen.notification;
          console.log(notification);
        }
      } else {
        console.log('not enabled');
        await firebase.messaging().requestPermission();
        // user doesn't have permission
      }
    } else {
      console.log('no token');
      // user doesn't have a device token yet
    }
  }
  componentWillUnmount() {
    this.removeNotificationDisplayedListener();
    this.removeNotificationListener();
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Welcome to {'\n'} React Native Firebase
          </Text>

          <View style={styles.modules}>
            <Text style={styles.modulesHeader}>
              The following Firebase modules are pre-installed:
            </Text>
            {firebase.admob.nativeModuleExists && (
              <Text style={styles.module}>admob()</Text>
            )}
            {firebase.analytics.nativeModuleExists && (
              <Text style={styles.module}>analytics()</Text>
            )}
            {firebase.auth.nativeModuleExists && (
              <Text style={styles.module}>auth()</Text>
            )}
            {firebase.config.nativeModuleExists && (
              <Text style={styles.module}>config()</Text>
            )}
            {firebase.crashlytics.nativeModuleExists && (
              <Text style={styles.module}>crashlytics()</Text>
            )}
            {firebase.database.nativeModuleExists && (
              <Text style={styles.module}>database()</Text>
            )}
            {firebase.firestore.nativeModuleExists && (
              <Text style={styles.module}>firestore()</Text>
            )}
            {firebase.functions.nativeModuleExists && (
              <Text style={styles.module}>functions()</Text>
            )}
            {firebase.iid.nativeModuleExists && (
              <Text style={styles.module}>iid()</Text>
            )}
            {firebase.links.nativeModuleExists && (
              <Text style={styles.module}>links()</Text>
            )}
            {firebase.messaging.nativeModuleExists && (
              <Text style={styles.module}>messaging()</Text>
            )}
            {firebase.notifications.nativeModuleExists && (
              <Text style={styles.module}>notifications()</Text>
            )}
            {firebase.perf.nativeModuleExists && (
              <Text style={styles.module}>perf()</Text>
            )}
            {firebase.storage.nativeModuleExists && (
              <Text style={styles.module}>storage()</Text>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logo: {
    height: 120,
    marginBottom: 16,
    marginTop: 64,
    padding: 10,
    width: 135,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  modules: {
    margin: 20,
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});
 */
