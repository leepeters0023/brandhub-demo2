import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { suppliers } from "../../utility/constants";

const FocusMonthAutoComplete = ({
  classes,
  handleChange,
  reset,
  setReset,
  filterType,
}) => {
  const [open, setOpen] = useState(false);
  const [supplier, setSupplier] = useState("");
  const [currentSuppliers, setCurrentSuppliers] = useState([]);

  const currentFiltersSupplier = useSelector((state) => state.filters.supplier);

  const handleSuppliers = (value) => {
    setCurrentSuppliers(value);
  };

  useEffect(() => {
    if (currentFiltersSupplier.length !== currentSuppliers.length) {
      setCurrentSuppliers(currentFiltersSupplier);
    }
  }, [currentFiltersSupplier, currentSuppliers.length]);

  useEffect(() => {
    if (reset) {
      setSupplier("");
      setCurrentSuppliers([]);
      setReset(false);
    }
  }, [reset, setSupplier, setReset]);

  return (
    <>
      <Autocomplete
        multiple
        freeSolo
        renderTags={() => null}
        fullWidth
        className={classes.queryField}
        id="supplier-auto-complete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={supplier}
        onInputChange={(_evt, value) => setSupplier(value)}
        onChange={(_evt, value) => {
          handleChange(value, "supplier", filterType);
          handleSuppliers(value);
        }}
        getOptionSelected={(option, value) => option === value}
        getOptionLabel={(supplier) => supplier}
        options={suppliers}
        value={currentSuppliers}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Supplier"
            id="supplier-auto-search"
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