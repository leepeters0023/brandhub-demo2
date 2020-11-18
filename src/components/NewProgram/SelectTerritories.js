import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { updateTerritories } from "../../redux/slices/newProgramSlice";

import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import CircularProgress from "@material-ui/core/CircularProgress";

const TerritorySelector = React.memo(
  ({ classes, handleTerritories, territories }) => (
    <div className={classes.inputRow}>
      <Autocomplete
        multiple
        fullWidth
        freeSolo
        id="tags-standard"
        options={territories}
        getOptionLabel={(option) => option.name}
        onChange={(_evt, value) => handleTerritories(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Territory"
            size="small"
          />
        )}
      />
    </div>
  ),
  (prev, next) => {
    return (
      Object.keys(prev.classes).length === Object.keys(next.classes).length
    );
  }
);

const SelectTerritories = ({ classes }) => {
  const dispatch = useDispatch();

  const [allTerritories, setAllTerritories] = useCallback(useState(false));

  const territories = useSelector((state) => state.territories.territoryList);
  const isLoading = useSelector((state) => state.territories.isLoading);

  const handleTerritories = useCallback(
    (value, _type, _filter) => {
      dispatch(updateTerritories({ territories: value }));
    },
    [dispatch]
  );

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={allTerritories}
            onChange={() => {
              if (allTerritories) {
                dispatch(updateTerritories({ territories: [] }));
              } else {
                dispatch(updateTerritories({ territories: territories }));
              }
              setAllTerritories(!allTerritories);
            }}
            name="allTerritoryToggle"
          />
        }
        label="All Territories"
      />
      <br />
      {!allTerritories && (
        <TerritorySelector
          classes={classes}
          handleTerritories={handleTerritories}
          territories={territories}
        />
      )}
    </>
  );
};

SelectTerritories.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default React.memo(SelectTerritories);
