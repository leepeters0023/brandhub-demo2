import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { ruleTypes } from "../../utility/constants";

const FocusMonthAutoComplete = ({
  classes,
  handleChange,
  reset,
  setReset,
  filterType,
}) => {
  const [open, setOpen] = useState(false);
  const [ruleType, setRuleType] = useState("");
  const [currentRuleTypes, setCurrentRuleTypes] = useState([]);

  const currentFiltersRuleType = useSelector((state) => state.filters.ruleType);

  const handleRuleTypes = (value) => {
    setCurrentRuleTypes(value);
  };

  useEffect(() => {
    if (currentFiltersRuleType.length !== currentRuleTypes.length) {
      setCurrentRuleTypes(currentFiltersRuleType);
    }
  }, [currentFiltersRuleType, currentRuleTypes.length]);

  useEffect(() => {
    if (reset) {
      setRuleType("");
      setCurrentRuleTypes([]);
      setReset(false);
    }
  }, [reset, setRuleType, setReset]);

  return (
    <>
      <Autocomplete
        multiple
        freeSolo
        renderTags={() => null}
        fullWidth
        className={classes.queryField}
        id="ruleType-auto-complete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={ruleType}
        onInputChange={(_evt, value) => setRuleType(value)}
        onChange={(_evt, value) => {
          handleChange(value, "ruleType", filterType);
          handleRuleTypes(value);
        }}
        getOptionSelected={(option, value) => option === value}
        getOptionLabel={(ruleType) => ruleType}
        options={ruleTypes}
        value={currentRuleTypes}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Rule Type"
            id="ruleType-auto-search"
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

FocusMonthAutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  filterType: PropTypes.string.isRequired,
};

export default FocusMonthAutoComplete;