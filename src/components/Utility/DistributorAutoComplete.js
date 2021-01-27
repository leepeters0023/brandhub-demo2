import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { fetchUserDistributors } from "../../redux/slices/distributorSlice";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

const DistributorAutoComplete = ({
  classes,
  handleChange,
  reset,
  setReset,
  filterType,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [distributor, setDistributor] = useState("");
  const [currentDistributors, setCurrentDistributors] = useState([]);

  const isLoading = useSelector((state) => state.distributors.isLoading);
  const options = useSelector((state) => state.distributors.distributorList);
  const territoryId = useSelector((state) => state.user.currentTerritory);
  const userStates = useSelector((state) => state.user.states);
  const currentFiltersDistributor = useSelector(
    (state) => state.filters.distributor
  );

  const loading = open && isLoading;

  const handleDistributors = (value) => {
    setCurrentDistributors(value);
  };

  useEffect(() => {
    if (distributor.length >= 1) {
      dispatch(
        fetchUserDistributors(
          distributor,
          territoryId,
          userStates.map((state) => state.id).join(",")
        )
      );
    }
  }, [distributor, territoryId, userStates, dispatch]);

  useEffect(() => {
    if (currentFiltersDistributor.length !== currentDistributors.length) {
      setCurrentDistributors(currentFiltersDistributor);
    }
  }, [currentFiltersDistributor, currentDistributors.length]);

  useEffect(() => {
    if (reset && setReset) {
      if (reset) {
        setDistributor("");
        setCurrentDistributors([]);
        setReset(false);
      }
    }
  }, [reset, setDistributor, setReset]);

  return (
    <>
      <Autocomplete
        multiple
        freeSolo
        renderTags={() => null}
        fullWidth
        className={classes.queryField}
        classes={{
          popper: classes.liftedPopper,
        }}
        id="distributor-auto-complete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={distributor}
        onInputChange={(_evt, value) => setDistributor(value)}
        onChange={(_evt, value) => {
          handleChange(value, "distributor", filterType);
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
            label="Distributor Name / ABN"
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

DistributorAutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  filterType: PropTypes.string.isRequired,
};

export default DistributorAutoComplete;
