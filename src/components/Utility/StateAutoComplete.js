import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const StateAutoComplete = ({
  classes,
  handleChange,
  reset,
  setReset,
  filterType,
  id,
}) => {
  const [open, setOpen] = useState(false);
  const [user, setStateCode] = useState("");
  const [currentStateCodes, setCurrentStateCodes] = useState([]);
  const [currentStatCodeList, setCurrentStateCodeList] = useState([]);

  const states = useSelector((state) => state.territories.stateList);
  const currentFiltersState = useSelector((state) => state.filters.stateIds);

  const handleStates = (value) => {
    setCurrentStateCodes(value);
  };

  useEffect(() => {
    if (currentStatCodeList.length === 0 && states) {
      setCurrentStateCodeList(states);
    }
  }, [currentStatCodeList, states]);

  useEffect(() => {
    if (currentFiltersState.length !== currentStateCodes.length) {
      setCurrentStateCodes(currentFiltersState);
    }
  }, [currentFiltersState, currentStateCodes.length]);

  useEffect(() => {
    if (reset) {
      setStateCode("");
      setCurrentStateCodes([]);
      setReset(false);
    }
  }, [reset, setStateCode, setReset]);

  return (
    <>
      <Autocomplete
        multiple
        freeSolo
        renderTags={() => null}
        fullWidth
        className={classes.queryField}
        classes={{
          popper: classes.liftedPopper
        }}
        id={id ? id : "state-code-complete"}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={user}
        onInputChange={(_evt, value) => setStateCode(value)}
        onChange={(_evt, value) => {
          handleChange(value, "stateIds", filterType);
          handleStates(value);
        }}
        getOptionSelected={(option, value) => option.code === value.code}
        getOptionLabel={(user) => user.code}
        options={currentStatCodeList}
        value={currentStateCodes}
        renderInput={(params) => (
          <TextField
            {...params}
            label="State"
            id="state-auto-search"
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

StateAutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  filterType: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export default StateAutoComplete;