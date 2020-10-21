import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { fetchUserDistributors } from "../../redux/slices/distributorSlice";
import { setDistributors } from "../../redux/slices/userSlice";

import DistributorTable from "./DistributorTable";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const FavoriteDistributors = () => {
  const classes = useStyles()
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [distributor, setDistributor] = useState("");
  const [currentDistributors, setCurrentDistributors] = useState([]);

  const isLoading = useSelector((state) => state.distributors.isLoading);
  const options = useSelector((state) => state.distributors.distributorList);
  const userDistributors = useSelector((state) => state.user.favoriteDistributors)

  const loading = open && isLoading;

  const handleDistributors = (value) => {
    console.log(value);
    setCurrentDistributors(value);
    dispatch(setDistributors({distributors: value}))
  };

  useEffect(() => {
    if (distributor.length >= 1) {
      dispatch(fetchUserDistributors(distributor));
    }
  }, [distributor, dispatch]);

  useEffect(() => {
    if (userDistributors.length !== currentDistributors.length) {
      setCurrentDistributors(userDistributors);
    }
  }, [currentDistributors, userDistributors])

  return (
    <>
      <Autocomplete
        multiple
        freeSolo
        renderTags={() => null}
        fullWidth
        className={classes.queryField}
        id="distributor-auto-complete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={distributor}
        onInputChange={(_evt, value) => setDistributor(value)}
        onChange={(_evt, value) => {
          handleDistributors(value);
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={currentDistributors}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Add Distributor"
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
      <br />
      <DistributorTable distributors={userDistributors} isLoading={false}/>
    </>
  )
}

export default FavoriteDistributors;