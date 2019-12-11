import React from "react";

import { WebView } from "react-native-webview";

export default function WebviewComponent(props) {
  return <WebView source={{ uri: props.url }} />;
}
