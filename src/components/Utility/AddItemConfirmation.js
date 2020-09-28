import React, {useState, useEffect, useCallback} from 'react'
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";
import Fade from "@material-ui/core/Fade";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  alertColor: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.secondary.dark
  }
}))

const FadeTransition = (props) => <Fade {...props} timeout={{enter: 250, exit: 2000}} />

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />

const AddItemConfirmation = ({
  item,
  type,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useCallback(useState(false))

  const isLoading = useSelector((state) => state.currentOrder.orderUpdateLoading);

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

  if (!item) {
    return null;
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left"}}
        open={open}
        TransitionComponent={FadeTransition}
      >
        {isLoading ? (
        <Alert severity="info" classes={{filledInfo: classes.alertColor}}>
          ...Updating Order...
        </Alert>
        ) : (
          <Alert severity="success" classes={{filledSuccess: classes.alertColor}}>
            {`You have successfully added ${item.brand}-${item.itemType} to your ${
            type === "inStock" ? "In-Stock" : "On-Demand"
          } order!`} 
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

AddItemConfirmation.propTypes = {
  item: PropTypes.object,
  type: PropTypes.string,
};

export default AddItemConfirmation;
