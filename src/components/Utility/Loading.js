import React from 'react'

import CircularProgress from "@material-ui/core/CircularProgress";

const Loading = () => {
  return (
    <div
          style={{
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            zIndex: "10000",
          }}
        >
          <br />
          <CircularProgress color="inherit" disableShrink />
        </div>
  )
}

export default Loading;
