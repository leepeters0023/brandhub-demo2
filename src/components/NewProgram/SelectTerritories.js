import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { updateTerritories } from "../../redux/slices/newProgramSlice";

import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

//mockdata switch when territory fetch becomes available
import { regions } from "../../utility/constants";

const TerritorySelector = React.memo(
  ({ classes, handleTerritories }) => (
    <div className={classes.inputRow}>
      <Autocomplete
        multiple
        fullWidth
        freeSolo
        id="tags-standard"
        options={regions}
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

  const handleTerritories = useCallback(
    (value, _type, _filter) => {
      dispatch(updateTerritories({ territories: value }));
    },
    [dispatch]
  );

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
                dispatch(updateTerritories({ territories: regions }));
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
        />
      )}
    </>
  );
};

SelectTerritories.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default React.memo(SelectTerritories);
