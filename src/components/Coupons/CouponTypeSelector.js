import React, { useState } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { updateCouponValue } from "../../redux/slices/couponSlice";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { couponTypes } from "../../utility/constants";

const CouponTypeSelector = ({ classes }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [couponType, setCouponType] = useState("");

  return (
    <>
      <Autocomplete
        fullWidth
        className={classes.couponField}
        id="couponType-selector"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={couponType}
        onInputChange={(_evt, value) => setCouponType(value)}
        onChange={(_evt, value) => {
          dispatch(updateCouponValue({ key: "couponType", value: value }));
        }}
        getOptionSelected={(option, value) => option === value}
        getOptionLabel={(couponType) => couponType}
        options={couponTypes}
        classes={{
          "popper": classes.popper
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Coupon Type"
            id="couponType-auto-search"
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

CouponTypeSelector.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default CouponTypeSelector;