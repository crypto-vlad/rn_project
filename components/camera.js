import React, { PureComponent } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  ImageBackground,
  Image,
  TouchableHighlight
} from "react-native";

import { RNCamera } from "react-native-camera";
import { Icon } from "native-base";

export default class ExampleApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      type: "front"
    };
  }
  render() {
    if (this.state.image) {
      return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={true}
          onRequestClose={() => {
            this.setState({ image: null });
          }}
        >
          <Showimage
            close={() => this.setState({ image: null })}
            saveImage={image => {
              this.props.saveImage(image);
            }}
            image={this.state.image}
          />
        </Modal>
      );
    }

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={true}
        onRequestClose={() => {
          this.props.close();
        }}
      >
        <View style={styles.container}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={
              this.state.type == "front"
                ? RNCamera.Constants.Type.front
                : RNCamera.Constants.Type.back
            }
            flashMode={RNCamera.Constants.FlashMode.on}
            androidCameraPermissionOptions={{
              title: "Permission to use camera",
              message: "We need your permission to use your camera",
              buttonPositive: "Ok",
              buttonNegative: "Cancel"
            }}
            androidRecordAudioPermissionOptions={{
              title: "Permission to use audio recording",
              message: "We need your permission to use your audio",
              buttonPositive: "Ok",
              buttonNegative: "Cancel"
            }}
            onGoogleVisionBarcodesDetected={({ barcodes }) => {
              console.log(barcodes);
            }}
          />
          <View
            style={{
              flex: 0,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={{ flex: 1, paddingLeft: 15 }}
              onPress={() => this.props.close()}
            >
              <Icon
                name="ios-arrow-back"
                style={{ fontSize: 30, color: "#fff" }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.takePicture.bind(this)}
              style={styles.capture}
            >
              <Text style={{ fontSize: 14 }}> SNAP </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,

                paddingRight: 15,
                alignItems: "flex-end",
                justifyContent: "flex-end"
              }}
              onPress={() => {
                this.setState({
                  type: this.state.type === "back" ? "front" : "back"
                });
              }}
            >
              <Icon name="ios-redo" style={{ fontSize: 30, color: "#fff" }} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: false };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      console.log(data);
      this.setState({ image: data });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black"
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  capture: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20
  }
});

function Showimage(props) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: "#000" }}>
        <TouchableOpacity onPress={() => props.close()}>
          <Icon
            name="ios-close"
            style={{ fontSize: 50, color: "#fff", padding: 10 }}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: props.image.uri }}
          style={{ flex: 1, height: undefined, width: undefined }}
        />
      </View>

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000"
        }}
      >
        <TouchableOpacity onPress={() => props.saveImage(props.image)}>
          <Icon name="ios-checkmark" style={{ fontSize: 50, color: "#fff" }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
