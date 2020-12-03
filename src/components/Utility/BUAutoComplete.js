import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { units } from "../../utility/constants";

const BUAutoComplete = ({
  classes,
  handleChange,
  reset,
  setReset,
  filterType,
}) => {
  const [open, setOpen] = useState(false);
  const [bu, setBU] = useState("");
  const [currentBUs, setCurrentBUs] = useState([]);

  const currentFiltersBU = useSelector((state) => state.filters.bu);

  const handleBUs = (value) => {
    setCurrentBUs(value);
  };

  useEffect(() => {
    if (currentFiltersBU.length !== currentBUs.length) {
      setCurrentBUs(currentFiltersBU);
    }
  }, [currentFiltersBU, currentBUs.length]);

  useEffect(() => {
    if (reset) {
      setBU("");
      setCurrentBUs([]);
      setReset(false);
    }
  }, [reset, setBU, setReset]);

  return (
    <>
      <Autocomplete
        multiple
        freeSolo
        renderTags={() => null}
        fullWidth
        className={classes.queryField}
        id="bu-auto-complete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={bu}
        onInputChange={(_evt, value) => setBU(value)}
        onChange={(_evt, value) => {
          handleChange(value, "bu", filterType);
          handleBUs(value);
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(bu) => bu.name}
        options={units}
        value={currentBUs}
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

BUAutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  filterType: PropTypes.string.isRequired,
};

export default BUAutoComplete;
