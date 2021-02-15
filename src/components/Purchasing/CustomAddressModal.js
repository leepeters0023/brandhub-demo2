import React, { useState } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { addCustomAddressOrder } from "../../redux/slices/orderSetSlice";

import { useInput } from "../../hooks/InputHooks";

import StateSelector from "../Utility/StateSelector";
import AddressAutoComplete from "../Utility/AddressAutoComplete";

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
  popper: {
    zIndex: "16000",
  },
}));

const orderTypeMap = {
  "On Demand": "on-demand",
  "In Stock": "in-stock",
  "Pre Order": "pre-order",
};

const CustomAddressModal = ({ orderSetId, orderType, open, handleClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const rapidId = useSelector((state) => state.addresses.rapidAddress.id);
  const championId = useSelector((state) => state.addresses.championAddress.id);
  const currentUserRole = useSelector((state) => state.user.role);

  const {
    value: name,
    bind: bindName,
    setValue: setName,
    reset: resetName,
  } = useInput("");
  const {
    value: addressOne,
    bind: bindAddressOne,
    setValue: setAddressOne,
    reset: resetAddressOne,
  } = useInput("");
  const {
    value: addressTwo,
    bind: bindAddressTwo,
    setValue: setAddressTwo,
    reset: resetAddressTwo,
  } = useInput("");
  const {
    value: city,
    bind: bindCity,
    setValue: setCity,
    reset: resetCity,
  } = useInput("");
  const {
    value: zip,
    bind: bindZip,
    setValue: setZip,
    reset: resetZip,
  } = useInput("");
  // const {
  //   value: gLCode,
  //   bind: bindGlCode,
  //   setValue: setGLCode,
  //   reset: resetGlCode,
  // } = useInput("");
  const {
    value: country,
    bind: bindCountry,
    setValue: setCountry,
    reset: resetCountry,
  } = useInput("");

  const [state, setState] = useState("");
  const [isCustomAddress, setIsCustomAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleShipToRapid = () => {
    dispatch(
      addCustomAddressOrder(null, orderSetId, orderTypeMap[orderType], rapidId)
    );
    handleClose(false);
  };

  const handleShipToChampion = () => {
    dispatch(
      addCustomAddressOrder(
        null,
        orderSetId,
        orderTypeMap[orderType],
        championId
      )
    );
    handleClose(false);
  };

  const handleCustomAddressSelection = (address) => {
    if (address) {
      setName(address.name);
      setAddressOne(address["street-address-1"]);
      setAddressTwo(
        address["street-address-2"] ? address["street-address-2"] : "---"
      );
      setCity(address.city);
      setState(address.state);
      setZip(address.zip);
      setCountry(address.country);
      setIsCustomAddress(true);
      setSelectedAddress(address);
    } else {
      resetName();
      resetAddressOne();
      resetAddressTwo();
      resetCity();
      resetZip();
      resetCountry();
      setState("");
      setIsCustomAddress(false);
      setSelectedAddress(null);
    }
  };

  const handleSubmit = () => {
    if (isCustomAddress) {
      dispatch(
        addCustomAddressOrder(
          null,
          orderSetId,
          orderTypeMap[orderType],
          selectedAddress.id
        )
      );
    } else {
      const address = {
        name: name,
        addressOne: addressOne,
        addressTwo: addressTwo,
        city: city,
        state: state.id,
        zip: zip,
        country: country,
        //gLCode: gLCode,
      };
      dispatch(
        addCustomAddressOrder(
          address,
          orderSetId,
          orderTypeMap[orderType],
          null
        )
      );
    }
    resetName();
    resetAddressOne();
    resetAddressTwo();
    resetCity();
    resetZip();
    resetCountry();
    //resetGlCode();
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
            {currentUserRole !== "field1" && currentUserRole !== "field2" && (
              <>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Button
                    className={classes.largeButton}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleShipToRapid()}
                  >
                    SHIP TO RAPID
                  </Button>
                  <Button
                    className={classes.largeButton}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleShipToChampion()}
                  >
                    SHIP TO CHAMPION
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
            <Typography className={classes.bodyText}>
              {`Ship to pre existing address:`}
            </Typography>
            <br />
            <AddressAutoComplete
              classes={classes}
              handleChange={handleCustomAddressSelection}
            />
            <br />
            <Divider />
            <br />
            <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="name"
              type="text"
              label="Address Name"
              disabled={isCustomAddress}
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
              disabled={isCustomAddress}
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
              disabled={isCustomAddress}
              {...bindCity}
            />
            {!isCustomAddress && (
              <StateSelector handleState={setState} currentState={state} />
            )}
            {isCustomAddress && state.code && (
              <TextField
                fullWidth
                style={{ marginBottom: "15px" }}
                variant="outlined"
                color="secondary"
                name="zip"
                type="text"
                label="Zip Code"
                disabled={isCustomAddress}
                value={state.code}
              />
            )}
            <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="zip"
              type="text"
              label="Zip Code"
              disabled={isCustomAddress}
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
              disabled={isCustomAddress}
              {...bindCountry}
            />
            {/* <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="gLCode"
              type="text"
              label="GL Code"
              {...bindGlCode}
            /> */}
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
