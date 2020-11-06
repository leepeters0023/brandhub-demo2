import React, { useState } from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const AllocationAutoComplete = ({
  classes,
  handleChange,
}) => {
  const [open, setOpen] = useState(false);
  const [allocation, setAllocation] = useState("");
  //TODO currently doesn't exist!
  const currentAllocations = useSelector((state) => state.user.allocationList);

  return (
    <>
      <Autocomplete
        fullWidth
        className={classes.queryField}
        id="allocation-auto-complete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={allocation}
        onInputChange={(_evt, value) => setAllocation(value)}
        onChange={(_evt, value) => {
          handleChange(value);
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={currentAllocations}
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

AllocationAutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  filterType: PropTypes.string.isRequired,
};

export default AllocationAutoComplete;