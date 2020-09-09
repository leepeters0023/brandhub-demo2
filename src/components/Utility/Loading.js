import React from 'react'

import CircularProgress from "@material-ui/core/CircularProgress";

const Loading = ({ partial }) => {
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
          <CircularProgress color="inherit" disableShrink size={100}/>
        </div>
  )
}

export default Loading;
