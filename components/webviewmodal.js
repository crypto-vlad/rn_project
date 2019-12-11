import React, {Component} from 'react';
import {Image, View, Modal, Alert} from 'react-native';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';
import {TouchableHighlight} from 'react-native';
import {WebView} from 'react-native-webview';

export default class CardImageExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showwebview: true,
    };
  }
  render() {
    return (
      <>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showwebview}
          onRequestClose={() => this.props.closewebview()}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'blue',
                padding: 10,
              }}>
              <View style={{paddingRight: 20, paddingLeft: 10}}>
                {/*    <TouchableHighlight onPress={() => this.props.closewebview()}>
                  <Ionicons name="md-arrow-back" size={25} color="white" />
                </TouchableHighlight> */}
              </View>
              <View>
                <Text style={{color: 'white'}}>{this.props.url}</Text>
              </View>
              <View></View>
            </View>
            {this.state.showwebview != false ? (
              <WebView source={{uri: this.props.url}} />
            ) : null}
          </View>
        </Modal>
      </>
    );
  }
}
