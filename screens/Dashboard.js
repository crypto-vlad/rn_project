import React from "react";
import {
  ImageBackground,
  Image,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import splash from '../components/images/splash.png'


export default class Dashboard extends React.Component {
  // Render any loading content that you like here

  onRegister(){
    this.props.navigation.navigate('Register');
  }
  onlogin(){
    this.props.navigation.navigate('Login');
  }
  render() {
    return (
        <>
        <StatusBar  hidden={true} />
        <View style={{flex: 1,  alignItems:'center', backgroundColor:'#FAFAFA', flexDirection:'column'}}>
            <Image style={{width: 300, height: 100, marginTop: 100}} source={require('../components/images/logotext.png')}></Image> 
            <View style={{width:'80%', height: 5, backgroundColor:'#fff', marginTop: 5}}></View>

            <View style={{flexDirection: 'column', width:'90%', }}>
                    <View style={styels.rowstyle}>
                        <Icon name="logo-usd" style={{color:'#490083'}}></Icon>
                        <Text style={styels.maintext} >Up to $50,000 in rewards to<Text style={{color: 'blue', fontSize:16}}> verified users </Text>for creating great content (check T&C for details).</Text>
                    </View>
                    <View style={styels.rowstyle}>
                        <View style={{backgroundColor:'#490083', width: 24, height: 24, borderRadius:12, justifyContent:'center', alignItems:'center'}}>
                            <Icon name="logo-twitter"style={{color:'#FFF', fontSize: 16}} ></Icon></View>
                            <Image source={require('../components/images/news.png')} style={{width: 22, height:20, marginLeft:10}}></Image>
                            <Image source={require('../components/images/mice.png')} style={{width: 22, height:22, marginLeft:10}}></Image>
                            <Icon name="speaking"style={{color:'#FFF', fontSize: 20}} ></Icon>
                            <View style={{flexDirection:'column'}}>
                                <Text style={styels.maintext}>4-IN-1: Twitter, CNN, ESPN, FOX all in 1</Text>
                                <Text style={styels.maintext}>platform</Text>
                            </View>
                    </View>
                    <View style={styels.rowstyle}>
                    <View style={{backgroundColor:'#490083', width: 24, height: 24, borderRadius:12, justifyContent:'center', alignItems:'center'}}>
                            <Icon name="logo-twitter"style={{color:'#FFF', fontSize: 16}} ></Icon></View>
                            <Image source={require('../components/images/news.png')} style={{width: 22, height:20, marginLeft:10}}></Image>
                            <Image source={require('../components/images/mice.png')} style={{width: 22, height:22, marginLeft:10}}></Image>    
                        <View style={{flexDirection:'column'}}>
                            <Text style={styels.maintext} >  Create Buzz, follow breaking news and</Text>
                            <Text style={styels.maintext} >  breaking tweets.</Text>
                        </View>                       
                    </View>
                    <View style={styels.rowstyle}>
                        <Icon name="trash" style={{color:'#490083'}}></Icon>
                        <Text style={styels.maintext} >Career friendly, posts auto delete after 1 year.</Text>
                    </View>
                    <View style={styels.rowstyle}>
                        <Icon name="locate" style={{color:'#490083'}}></Icon>
                        <Text style={styels.maintext} >No Russian influence, posts show country of origin.</Text>
                    </View>
                    <View style={styels.rowstyle}>
                    <Image source={require('../components/images/ppp.png')} style={{width: 25, height:24}}></Image>
                        <Text style={styels.maintext} >Absolutely no shadow banning, rudeness censored.</Text>
                    </View>
                    <View style={styels.rowstyle}>
                        <Icon name="contact" style={{color:'#490083'}}></Icon>
                        <Text style={styels.maintext} >Only real jumans, no bots and trolls accounts permitted.</Text>
                    </View>
                    <View style={styels.rowstyle}>
                        <Image source={require('../components/images/verify.png')} style={{width: 24, height:28}}></Image>
                        <Text style={styels.maintext} >Verified account status available for all users if conditions fulfilled.</Text>
                    </View>

            </View>
        </View>
        <TouchableOpacity style={{width:'80%', height: 50, borderRadius:25,marginBottom: 30, backgroundColor:'#1DA1F3',justifyContent:'center', alignItems:'center', alignSelf:'center'}}
            onPress={()=>this.onRegister()}>
            <Text style={{color:'#FFF', fontSize: 30, fontWeight:'bold'}}>Create account</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {{justifyContent:'flex-end', alignSelf:'center', marginBottom: 20}} onPress={()=>this.onlogin()}>
            <Text style={{color:'#13171A', fontSize:20}}>Have an account already? <Text style={{color:'#1DA1F3', fontSize:20}}>  Log in</Text></Text>
        </TouchableOpacity>
        </>
    );
  }
}

const styels = StyleSheet.create({
    maintext : {
        color:'#0F1316', 
        marginLeft: 10,
        fontSize: 16
    },
    rowstyle : {
        marginTop: 20,
        flexDirection:'row',
        alignItems:'center'
    }
});