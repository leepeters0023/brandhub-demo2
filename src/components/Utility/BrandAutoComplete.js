import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { fetchBrands } from "../../redux/slices/brandSlice";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

const BrandAutoComplete = ({
  classes,
  handleChange,
  reset,
  setReset,
  filterType,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState("");
  const [currentBrands, setCurrentBrands] = useState([]);

  const isLoading = useSelector((state) => state.brands.isLoading);
  const options = useSelector((state) => state.brands.brandList);
  const currentFiltersBrand = useSelector((state) => state.filters.brand);

  const loading = open && isLoading;

  const handleBrands = (value) => {
    setCurrentBrands(value);
  }

  useEffect(() => {
    if (brand.length >= 1) {
      dispatch(fetchBrands(brand));
    }
  }, [brand, dispatch]);

  useEffect(() => {
    if (currentFiltersBrand.length !== currentBrands.length) {
      setCurrentBrands(currentFiltersBrand);
    }
  }, [currentFiltersBrand, currentBrands.length]);

  useEffect(() => {
    if (reset) {
      setBrand("");
      setCurrentBrands([]);
      setReset(false);
    }
  }, [reset, setBrand, setReset]);

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
        id="brand-auto-complete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={brand}
        onInputChange={(_evt, value) => setBrand(value)}
        onChange={(_evt, value) => {
          handleChange(value, "brand", filterType);
          handleBrands(value);
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={currentBrands}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Brand"
            variant="outlined"
            size="small"
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

BrandAutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  filterType: PropTypes.string.isRequired,
};

export default BrandAutoComplete;
