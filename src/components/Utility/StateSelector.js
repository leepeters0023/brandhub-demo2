import React from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

const StateSelector = ({ handleState, currentState, type }) => {
  const states = useSelector((state) => state.territories.stateList);
  const isLoading = useSelector((state) => state.territories.isStatesLoading);

  const handleChangeSelect = (evt) => {
    handleState(evt.target.value);
  }

  if (isLoading || states.length === 0) {
    return <CircularProgress />
  }

  return (
    <FormControl
    fullWidth
    variant="outlined"
    style={{
      marginBottom: type === "grid" ? "0" : "15px",
      maxWidth: type === "grid" ? "100px" : "100%",
      minWidth: "100px",
    }}
    >
      <InputLabel id="state-select">State</InputLabel>
      <Select
        label="State"
        name="state"
        labelId="state-select"
        id="state"
        value={currentState}
        onChange={handleChangeSelect}
        MenuProps={{
          style: {zIndex: "16000"},
          getContentAnchorEl: null,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        }}
      >
        {states.map((state, index) => (
          <MenuItem value={state} key={index}>
            <Typography variant="body2">{state.code}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
};

StateSelector.propTypes = {
  handleState: PropTypes.func.isRequired
}

export default StateSelector;
