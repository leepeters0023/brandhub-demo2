import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";

const Loading = ({ partial }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: partial ? "rgb(0,0,0,0)" : "white",
        zIndex: "10000",
      }}
    >
      <br />

      <CircularProgress
        color="secondary"
        disableShrink
        size={100}
        />
        </div>
  );
};

export default Loading;
