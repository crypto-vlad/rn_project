import React from "react";
import ReactDOM from "react-dom";

export const Context = React.createContext("");

export default class App extends React.Component {
  render() {
    return (
      <Context.Provider
        value={{
          foo: "bar",
          baz: "blah"
        }}
      ></Context.Provider>
    );
  }
}
