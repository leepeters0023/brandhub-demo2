import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { fetchAddresses } from "../../redux/slices/addressSlice";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

const AddressAutoComplete = ({ classes, handleChange }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");

  const isLoading = useSelector((state) => state.addresses.isLoading);
  const options = useSelector((state) => state.addresses.customAddressList);

  const loading = open && isLoading;

  const debounce = useRef(null);

  const handleAddress = (value) => {
    setCurrentAddress(value);
  };

  const handleQuery = useCallback(() => {
    clearTimeout(debounce.current);

    debounce.current = setTimeout(() => {
      dispatch(fetchAddresses(address));
    }, 250);
  }, [address, dispatch]);

  useEffect(() => {
    if (address.length >= 1) {
      handleQuery();
    }
  }, [address, handleQuery, dispatch]);

  return (
    <>
      <Autocomplete
        freeSolo
        fullWidth
        className={classes.queryField}
        id="address-auto-complete"
        classes={{
          popper: classes.popper,
        }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={address}
        onInputChange={(_evt, value) => setAddress(value)}
        onChange={(_evt, value) => {
          handleChange(value);
          handleAddress(value);
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option ? option.name : ""}
        options={options}
        loading={loading}
        value={currentAddress}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Address"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={15} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </>
  );
};

AddressAutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default AddressAutoComplete;
