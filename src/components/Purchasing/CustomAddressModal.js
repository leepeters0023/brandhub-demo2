import React, { useState } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { addCustomAddressOrder } from "../../redux/slices/orderSetSlice";

import { useInput } from "../../hooks/InputHooks";

import StateSelector from "../Utility/StateSelector";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const orderTypeMap = {
  "On Demand": "on-demand",
  "In Stock": "in-stock",
  "Pre Order": "pre-order",
};

const CustomAddressModal = ({ orderSetId, orderType, open, handleClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const warehouseId = useSelector(
    (state) => state.addresses.warehouseAddress.id
  );
  const currentUserRole = useSelector((state) => state.user.role);

  const { value: name, bind: bindName, reset: resetName } = useInput("");
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
  const { value: city, bind: bindCity, reset: resetCity } = useInput("");
  const { value: zip, bind: bindZip, reset: resetZip } = useInput("");
  const { value: country, bind: bindCountry, reset: resetCountry } = useInput(
    ""
  );

  const [state, setState] = useState("");

  const handleCDC = () => {
    dispatch(
      addCustomAddressOrder(
        null,
        orderSetId,
        orderTypeMap[orderType],
        warehouseId
      )
    );
    handleClose(false);
  };

  const handleSubmit = () => {
    const address = {
      name: name,
      addressOne: addressOne,
      addressTwo: addressTwo,
      city: city,
      state: state.id,
      zip: zip,
      country: country,
    };
    dispatch(
      addCustomAddressOrder(address, orderSetId, orderTypeMap[orderType], null)
    );
    resetName();
    resetAddressOne();
    resetAddressTwo();
    resetCity();
    resetZip();
    resetCountry();
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
          <IconButton
            className={classes.closeButton}
            onClick={() => handleClose(false)}
          >
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
            {currentUserRole !== "field1" && (
              <>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    className={classes.largeButton}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleCDC()}
                  >
                    SHIP TO CDC
                  </Button>
                </div>
                <br />
                <Divider />
                <br />
              </>
            )}
            <Typography className={classes.headerText}>
              {`Custom Address for ${orderType} order #${orderSetId}`}
            </Typography>
            <br />
            <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="name"
              type="text"
              label="Address Name"
              {...bindName}
            />
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
              name="city"
              type="text"
              label="City"
              {...bindCity}
            />
            <StateSelector handleState={setState} currentState={state} />
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
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
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
