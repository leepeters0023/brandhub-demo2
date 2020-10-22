import React, { useState } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { updateCouponValue } from "../../redux/slices/couponSlice";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { units } from "../../utility/constants";

const BUSelector = ({ classes }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [bu, setBU] = useState("");

  return (
    <>
      <Autocomplete
        fullWidth
        className={classes.couponField}
        id="bu-auto-complete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={bu}
        onInputChange={(_evt, value) => setBU(value)}
        onChange={(_evt, value) => {
          dispatch(updateCouponValue({ key: "bu", value: value }));
        }}
        getOptionSelected={(option, value) => option === value}
        getOptionLabel={(bu) => bu}
        options={units}
        classes={{
          "popper": classes.popper
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Business Unit"
            id="bu-auto-search"
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

BUSelector.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default BUSelector;
