import React, { useState } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { updateCouponValue } from "../../redux/slices/couponSlice";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { offerTypes } from "../../utility/constants";

const OfferTypeSelector = ({ classes }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [offerType, setOfferType] = useState("");

  return (
    <>
      <Autocomplete
        fullWidth
        className={classes.couponField}
        id="offerType-selector"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={offerType}
        onInputChange={(_evt, value) => setOfferType(value)}
        onChange={(_evt, value) => {
          dispatch(updateCouponValue({ key: "offerType", value: value }));
        }}
        getOptionSelected={(option, value) => option === value}
        getOptionLabel={(offerType) => offerType}
        options={offerTypes}
        classes={{
          "popper": classes.popper
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Offer Type"
            id="offerType-auto-search"
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
              autoComplete: "new-password",
              endAdornment: <>{params.InputProps.endAdornment}</>,
            }}
          />
        )}
      />
    </>
  );
};

OfferTypeSelector.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default OfferTypeSelector;