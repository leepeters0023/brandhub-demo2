import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const focusMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const FocusMonthAutoComplete = ({
  classes,
  handleChange,
  reset,
  setReset,
  filterType,
}) => {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState("");
  const [currentMonths, setCurrentMonths] = useState([]);

  const currentFiltersMonth = useSelector((state) => state.filters.month);
  const isGlobalLoading = useSelector((state) => state.globalLoad.isLoading);

  const handleMonths = (value) => {
    setCurrentMonths(value);
  };

  useEffect(() => {
    if (currentFiltersMonth.length !== currentMonths.length) {
      setCurrentMonths(currentFiltersMonth);
    }
  }, [currentFiltersMonth, currentMonths.length]);

  useEffect(() => {
    if (reset) {
      setMonth("");
      setCurrentMonths([]);
      setReset(false);
    }
  }, [reset, setMonth, setReset]);

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
        id="month-auto-complete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={month}
        onInputChange={(_evt, value) => setMonth(value)}
        onChange={(_evt, value) => {
          handleChange(value, "month", filterType);
          handleMonths(value);
        }}
        getOptionSelected={(option, value) => option === value}
        getOptionLabel={(month) => month}
        options={focusMonths}
        value={currentMonths}
        disabled={isGlobalLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Focus Month"
            id="month-auto-search"
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
