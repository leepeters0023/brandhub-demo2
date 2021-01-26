import React, { useState, useEffect, useCallback } from "react";
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
    color: theme.palette.secondary.dark,
  },
}));

const FadeTransition = (props) => (
  <Fade {...props} timeout={{ enter: 250, exit: 2000 }} />
);

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const AddItemConfirmation = ({ item, type }) => {
  const classes = useStyles();
  const [open, setOpen] = useCallback(useState(false));
  const formattedType = `selected${type[0].toUpperCase() + type.slice(1)}Items`;

  const isLoading = useSelector(
    (state) => state.currentOrder.orderUpdateLoading
  );
  const selectedItems = useSelector(
    (state) => state.currentOrder[formattedType]
  );
  const error = useSelector((state) => state.currentOrder.error);

  useEffect(() => {
    let timeOut;
    if (isLoading) {
      setOpen(true);
    }
    if (!isLoading) {
      timeOut = setTimeout(() => {
        setOpen(false);
      }, 1500);
    }
    return () => {
      clearTimeout(timeOut);
    };
  }, [setOpen, isLoading]);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={open}
        TransitionComponent={FadeTransition}
        style={{ zIndex: "15000", marginLeft: "100px", marginBottom: "15px" }}
      >
        {isLoading ? (
          <Alert severity="info" classes={{ filledInfo: classes.alertColor }}>
            ...Updating Order...
          </Alert>
        ) : !error ? (
          <Alert
            severity="success"
            classes={{ filledSuccess: classes.alertColor }}
          >
            {selectedItems.length === 0 && item
              ? `You have successfully added ${item.brand}-${
                  item.itemType
                } to your ${
                  type === "inStock" ? "Inventory" : "On-Demand"
                } order!`
              : `Items successfully added to your ${
                  type === "inStock" ? "Inventory" : "On-Demand"
                } order!`}
          </Alert>
        ) : (
          <Alert severity="error" classes={{ filledError: classes.alertColor }}>
            {error.includes("422") ? "You've already added this item" : error}
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
