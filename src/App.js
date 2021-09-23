import React from "react";
import "./App.css";

function App() {
  let containerStyle = {
    backgroundColor: window.REACT_APP_NAVBAR_COLOR,
  };

  return (
    <div
      style={{
        ...containerStyle,
        padding: 10,
        height: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      environment: <b>{window.REACT_APP_ENVIRONMENT}</b>
    </div>
  );
}

export default App;
