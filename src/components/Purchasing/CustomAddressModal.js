import React from "react";
import PropTypes from "prop-types";

//import { useDispatch } from "react-redux";
//TODO write this Thunk!
//import { addCustomAddress } from "../../redux/slices/patchOrderSlice";

import { useInput } from "../../hooks/InputHooks";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const CustomAddressModal = ({ orderSetId, orderType, open, handleClose }) => {
  const classes = useStyles();
  //const dispatch = useDispatch();

  const {
    value: addressOne,
    bind: bindAddressOne,
    reset: resetAddressOne,
  } = useInput("");
  const {
    value: addressTwo,
    bind: bindAddressTwo,
    reset: resetAddressTwo,
  } = useInput("");
  const {
    value: addressThree,
    bind: bindAddressThree,
    reset: resetAddressThree,
  } = useInput("");
  const { value: city, bind: bindCity, reset: resetCity } = useInput("");
  const { value: state, bind: bindState, reset: resetState } = useInput("");
  const { value: zip, bind: bindZip, reset: resetZip } = useInput("");
  const { value: country, bind: bindCountry, reset: resetCountry } = useInput(
    ""
  );
  const {
    value: attention,
    bind: bindAttention,
    reset: resetAttention,
  } = useInput("");

  const handleSubmit = () => {
    // dispatch(
    //   addCustomAddress(
    //     orderSetId,
    //     addressOne,
    //     addressTwo,
    //     addressThree,
    //     city,
    //     state,
    //     zip,
    //     country,
    //     attention
    //   )
    // );
    //temp log to get rid of unused vars warning until tied to api
    console.log(
      addressOne,
      addressTwo,
      addressThree,
      city,
      state,
      zip,
      country,
      attention
    );
    resetAddressOne();
    resetAddressTwo();
    resetAddressThree();
    resetCity();
    resetState();
    resetZip();
    resetCountry();
    resetAttention();
    handleClose(false);
  };

  if (!orderSetId) {
    return null;
  }

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={open !== false}
        onClose={() => handleClose(false)}
        fullWidth
        maxWidth="sm"
        style={{ zIndex: "15000" }}
      >
        <DialogContent>
          <IconButton className={classes.closeButton} onClick={() => handleClose(false)}>
            <CancelIcon fontSize="large" color="secondary" />
          </IconButton>
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography className={classes.headerText}>
              {`Custom Address for ${orderType} order #${orderSetId}`}
            </Typography>
            <br />
            <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="address-one"
              type="text"
              label="Address Line One"
              {...bindAddressOne}
            />
            <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="address-two"
              type="text"
              label="Address Line Two"
              {...bindAddressTwo}
            />
            <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="address-three"
              type="text"
              label="Address Line Three"
              {...bindAddressThree}
            />
            <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="city"
              type="text"
              label="City"
              {...bindCity}
            />
            <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="state-province"
              type="text"
              label="State / Province"
              {...bindState}
            />
            <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="zip"
              type="text"
              label="Zip Code"
              {...bindZip}
            />
            <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="country"
              type="text"
              label="Country"
              {...bindCountry}
            />
            <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="attention"
              type="text"
              label="Attention"
              {...bindAttention}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                className={classes.largeButton}
                variant="contained"
                color="secondary"
                onClick={() => handleSubmit()}
              >
                ADD TO ORDER
              </Button>
            </div>
          </div>
          <br />
        </DialogContent>
      </Dialog>
    </div>
  );
};

CustomAddressModal.propTypes = {
  orderSetId: PropTypes.string,
  orderType: PropTypes.string,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default React.memo(CustomAddressModal);
