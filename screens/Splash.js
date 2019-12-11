import React from "react";
import {
  ImageBackground,
  Image,
  StatusBar,
  View,
  Text,
  TouchableOpacity
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import splash from '../components/images/splash.png'


export default class Splash extends React.Component {
  // Render any loading content that you like here

//   componentDidMount(){
//     setTimeout(()=>{this.props.navigation.navigate('AuthLoading')}, 3000);
//   }
  render() {
    return (
        <>
        <StatusBar  hidden={true} />
        <LinearGradient start={{x:0, y:0.5}} end={{x:1, y:0.5}} colors = {['#FA2115', '#800C7B', '#2400C4']} 
                        style = {{ height:'100%',width:'100%', alignItems:'center', justifyContent:'center'}}>
            <Image style={{width:'80%', height:'52%'}}  source={splash}/> 
        </LinearGradient>
        </>
    );
  }
}
