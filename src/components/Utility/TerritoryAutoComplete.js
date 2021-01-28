import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { fetchTerritoriesByName } from "../../redux/slices/territorySlice";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

const TerritoryAutoComplete = ({
  classes,
  handleChange,
  reset,
  setReset,
  filterType,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [territory, setTerritory] = useState("");
  const [currentTerritories, setCurrentTerritories] = useState([]);

  const isLoading = useSelector((state) => state.territories.isLoading);
  const options = useSelector(
    (state) => state.territories.filteredTerritoryList
  );
  const currentFiltersTerritory = useSelector(
    (state) => state.filters.territory
  );

  const loading = open && isLoading;

  const debounce = useRef(null);

  const handleTerritories = (value) => {
    setCurrentTerritories(value);
  };

  const handleQuery = useCallback(() => {
    clearTimeout(debounce.current);

    debounce.current = setTimeout(() => {
      dispatch(fetchTerritoriesByName(territory));
    }, 250);
  }, [territory, dispatch]);

  useEffect(() => {
    if (territory.length >= 1) {
      handleQuery();
    }
  }, [territory, handleQuery, dispatch]);

  useEffect(() => {
    if (currentFiltersTerritory.length !== currentTerritories.length) {
      setCurrentTerritories(currentFiltersTerritory);
    }
  }, [currentFiltersTerritory, currentTerritories.length]);

  useEffect(() => {
    if (reset && setReset) {
      if (reset) {
        setTerritory("");
        setCurrentTerritories([]);
        setReset(false);
      }
    }
  }, [reset, setTerritory, setReset]);

  return (
    <>
      <Autocomplete
        multiple
        freeSolo
        renderTags={() => null}
        fullWidth
        className={classes.queryField}
        id="territory-auto-complete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={territory}
        onInputChange={(_evt, value) => setTerritory(value)}
        onChange={(_evt, value) => {
          handleChange(value, "territory", filterType);
          handleTerritories(value);
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={currentTerritories}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Territory"
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

TerritoryAutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  reset: PropTypes.bool,
  setReset: PropTypes.func,
};

export default TerritoryAutoComplete;
