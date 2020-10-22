import React, { useState } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { updateCouponValue } from "../../redux/slices/couponSlice";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { couponTypeList } from "../../utility/constants";

const ItemTypeSelector = ({
  classes,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [itemType, setItemType] = useState("");
  
  return (
    <>
      <Autocomplete
        fullWidth
        className={classes.couponField}
        id="itemType-selector"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={itemType}
        onInputChange={(_evt, value) => setItemType(value)}
        onChange={(evt, value) => {
          dispatch(updateCouponValue({key: "itemType", value: value ? value.name : null}));
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={couponTypeList}
        classes={{
          "popper": classes.popper
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Item Type"
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

ItemTypeSelector.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default ItemTypeSelector;