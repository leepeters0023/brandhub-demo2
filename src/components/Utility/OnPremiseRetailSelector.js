import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { updateCurrentMarket } from "../../redux/slices/userSlice";

import { fetchPrograms } from "../../redux/slices/programsSlice";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

const OnPremiseRetailSelector = ({ classes }) => {
  const dispatch = useDispatch();

  const [market, setMarket] = useState("");

  const isRetail = useSelector((state) => state.user.isRetail);
  const isOnPremise = useSelector((state) => state.user.isOnPremise);
  const currentMarket = useSelector((state) => state.user.currentMarket);
  const currentTerritory = useSelector((state) => state.user.currentTerritory);
  const isOrdering = useSelector((state) => state.orderSet.isOrdering);

  const handleChangeSelect = (evt) => {
    setMarket(evt.target.value);
    let marketBool = evt.target.value === "On Premise" ? true : false;
    dispatch(fetchPrograms(currentTerritory, marketBool));
    dispatch(updateCurrentMarket({ market: evt.target.value }));
  };

  useEffect(() => {
    if (currentMarket !== market) {
      setMarket(currentMarket);
    }
  }, [currentMarket, market]);

  if ((isRetail && !isOnPremise) || (!isRetail && !isOnPremise)) {
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
          {currentMarket}
        </Typography>
      </div>
    );
  } else {
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
            value={market}
            disabled={isOrdering}
            onChange={handleChangeSelect}
            MenuProps={{
              style: { zIndex: "10001" },
            }}
          >
            <MenuItem value={"Retail"}>
              <Typography variant="body2">Retail</Typography>
            </MenuItem>
            <MenuItem value={"On Premise"}>
              <Typography variant="body2">On Premise</Typography>
            </MenuItem>
          </Select>
        </FormControl>
      </>
    );
  }
};

OnPremiseRetailSelector.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default React.memo(OnPremiseRetailSelector);
