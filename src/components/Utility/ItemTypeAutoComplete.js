import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputAdornment from '@material-ui/core/InputAdornment';

const ItemTypeAutoComplete = ({
  classes,
  handleChange,
  reset,
  setReset,
  filterType,
}) => {
  const [open, setOpen] = useState(false);
  const [itemType, setItemType] = useState("");
  const [currentItemTypes, setCurrentItemTypes] = useState([]);

  const currentFiltersItemType = useSelector((state) => state.filters.itemType);
  const itemTypeList = useSelector((state) => state.itemTypes.itemTypeList);

  const handleItemTypes = (value) => {
    setCurrentItemTypes(value);
  };

  useEffect(() => {
    if (currentFiltersItemType.length !== currentItemTypes.length) {
      setCurrentItemTypes(currentFiltersItemType);
    }
  }, [currentFiltersItemType, currentItemTypes.length]);

  useEffect(() => {
    if (reset) {
      setItemType("");
      setCurrentItemTypes([]);
      setReset(false);
    }
  }, [reset, setItemType, setReset]);

  return (
    <>
      <Autocomplete
        multiple
        freeSolo
        renderTags={() => null}
        fullWidth
        className={classes.queryField}
        id="itemType-auto-complete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={itemType}
        onInputChange={(_evt, value) => setItemType(value)}
        onChange={(evt, value) => {
          handleChange(value, "itemType", filterType);
          handleItemTypes(value);
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={itemTypeList}
        value={currentItemTypes}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Item Type"
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
              autoComplete: "new-password",
              endAdornment: <>
                <InputAdornment>
                  <ExpandMoreIcon // not married to the idea of this being here as it's hard to position with "X" clear icon https://github.com/mui-org/material-ui/issues/17799
                    className={classes.hoverText}
                    color="secondary"
                    onMouseEnter={() => setOpen(true)}
                   />
                   {params.InputProps.endAdornment}
                </InputAdornment>
              </>,
            }}
          />
        )}
      />
    </>
  );
};

ItemTypeAutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  filterType: PropTypes.string.isRequired,
};

export default ItemTypeAutoComplete;
