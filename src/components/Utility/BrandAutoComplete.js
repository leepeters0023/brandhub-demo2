import React, {useState, useEffect} from 'react'
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import {fetchBrands} from "../../redux/slices/brandSlice";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';


const BrandAutoComplete = ({ classes, handleChange, reset, setReset, filterType }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState("");

  const isLoading = useSelector((state) => state.brands.isLoading);
  const options = useSelector((state) => state.brands.brandList)

  const loading = open && isLoading

  useEffect(()=>{
    if (brand.length >= 1) {
      dispatch(fetchBrands(brand))
    }
  }, [brand, dispatch])

  useEffect(()=>{
    if (reset) {
      setBrand("")
      setReset(false);
    }
  }, [reset, setBrand, setReset])

  return (
    <>
      <Autocomplete
        fullWidth
        className={classes.queryField}
        id="brand-auto-complete"
        open={open}
        onOpen={()=>setOpen(true)}
        onClose={()=>setOpen(false)}
        inputValue={brand}
        onInputChange={(_evt, value) => setBrand(value)}
        onChange={(evt, value) => {
          handleChange(value, "brand", filterType)
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option)=>option.name}
        options={options}
        loading={loading}
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
                  {loading ? <CircularProgress color="inherit" size={15} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
      />
    </>
  )
}

BrandAutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
}

export default BrandAutoComplete;
