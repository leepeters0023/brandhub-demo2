import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { fetchStatesByIds } from "../../redux/slices/territorySlice";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

const StateSelector = ({ handleState, currentState, type }) => {
  const dispatch = useDispatch();

  const [currentStates, setCurrentStates] = useState([]);

  const allStates = useSelector((state) => state.territories.stateList);
  const states = useSelector((state) => state.territories.filteredStateList);
  const isLoading = useSelector((state) => state.territories.isStatesLoading);
  const currentTerritory = useSelector((state) => state.user.currentTerritory);

  const handleChangeSelect = (evt) => {
    handleState(evt.target.value);
  };

  useEffect(() => {
    if (currentStates.length === 0 && states.length > 0) {
      setCurrentStates(states);
    }
  }, [currentStates.length, states, setCurrentStates]);

  useEffect(() => {
    if (states.length === 0) {
      dispatch(fetchStatesByIds([currentTerritory]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (states.length === 0 && allStates.length > 0) {
      setCurrentStates(allStates);
    }
  }, [states, allStates, setCurrentStates]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <FormControl
      fullWidth
      variant="outlined"
      size={type === "grid" ? "small" : "medium"}
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
          style: { zIndex: "16000" },
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
        {currentStates.map((state, index) => (
          <MenuItem value={state} key={index}>
            <Typography variant="body2">{state.code}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

StateSelector.propTypes = {
  handleState: PropTypes.func.isRequired,
};

export default StateSelector;
