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
        zIndex: "2499", // when a user filters for a program or other item then clears said filter, the loading state renders above TopDrawerNav which has a zIndex of 2500. I don't see what else this change might impact but wanted to check with you first. 
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
