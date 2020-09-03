import React, {useState, useEffect, useCallback} from 'react'

import { useSelector } from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";
import Fade from "@material-ui/core/Fade";
import MuiAlert from "@material-ui/lab/Alert";

const FadeTransition = (props) => <Fade {...props} timeout={{enter: 250, exit: 1000}} />

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />

const OrderPatchLoading = () => {
  const [open, setOpen] = useCallback(useState(false))

  const isLoading = useSelector((state) => state.patchOrder.isLoading);

  useEffect(() => {
    let timeOut;
    if (isLoading) {
      setOpen(true)
    }
    if (!isLoading) {
      timeOut = setTimeout(()=>{setOpen(false)}, 1000)
    }
    return ()=>{clearTimeout(timeOut)}
  }, [setOpen, isLoading])

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left"}}
        open={open}
        TransitionComponent={FadeTransition}
      >
        {isLoading ? (
        <Alert severity="info">
          ...Saving...
        </Alert>
        ) : (
          <Alert severity="success">
            Work is Saved!
          </Alert>
        )}
      </Snackbar>
    </>
  )
}

export default OrderPatchLoading
