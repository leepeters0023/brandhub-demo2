import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { updateCurrentTerritory } from "../../redux/slices/userSlice";

import { fetchPrograms } from "../../redux/slices/programsSlice";
import { fetchStatesByIds } from "../../redux/slices/territorySlice";
import { clearDistributors } from "../../redux/slices/distributorSlice";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

const RegionSelector = ({ classes }) => {
  const dispatch = useDispatch();
  
  const [region, updateRegion] = useState("");
  
  const regions = useSelector((state) => state.user.territories);
  const currentRegion = useSelector((state) => state.user.currentTerritory);

  const handleChangeSelect = (evt) => {
    window.location.hash = "";
    updateRegion(evt.target.value);
    let currentTerritory = regions.find((reg) => reg.name === evt.target.value);
    dispatch(clearDistributors());
    dispatch(updateCurrentTerritory({ territory: currentTerritory.id }));
    dispatch(fetchPrograms(currentTerritory.id));
    dispatch(fetchStatesByIds([currentTerritory.id]));
  };

  useEffect(() => {
    if (regions.length > 0) {
      updateRegion(regions.find((reg) => reg.id === currentRegion).name);
    }
  }, [regions, currentRegion]);

  if (regions.length === 1) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "103.5px",
          height: "41px",
          margin: "0 5px",
          backgroundColor: "white",
          borderRadius: "5px",
        }}
      >
        <Typography className={classes.regionText} variant="body2">
          {regions[0].name}
        </Typography>
      </div>
    );
  } else
    return (
      <>
        <FormControl
          variant="outlined"
          size="small"
          style={{
            margin: "0 5px",
            borderRadius: "5px",
            backgroundColor: "white",
          }}
        >
          <Select
            name="regions"
            labelId="region-select"
            id="regions"
            value={region}
            onChange={handleChangeSelect}
            MenuProps={{
              style: { zIndex: "10001" },
            }}
          >
            {regions.map((region, index) => (
              <MenuItem value={region.name} key={index}>
                <Typography variant="body2">{region.name}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    );
};

RegionSelector.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default React.memo(RegionSelector);
