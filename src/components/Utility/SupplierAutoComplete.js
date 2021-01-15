import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { fetchSuppliersByName } from "../../redux/slices/supplierSlice";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";


const FocusMonthAutoComplete = ({
  classes,
  handleChange,
  reset,
  setReset,
  filterType,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [supplier, setSupplier] = useState("");
  const [currentSuppliers, setCurrentSuppliers] = useState([]);

  const isLoading = useSelector((state) => state.suppliers.isLoading);
  const options = useSelector((state) => state.suppliers.filteredSupplierList);
  const currentFiltersSupplier = useSelector((state) => state.filters.supplier);

  const loading = open && isLoading;

  const handleSuppliers = (value) => {
    setCurrentSuppliers(value);
  };

  useEffect(() => {
    if (supplier.length >= 1) {
      dispatch(fetchSuppliersByName(supplier))
    }
  }, [supplier, dispatch])

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
        classes={{
          popper: classes.liftedPopper
        }}
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
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
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