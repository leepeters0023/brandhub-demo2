import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { updateCurrentChannel } from "../../redux/slices/userSlice";

import { fetchPrograms } from "../../redux/slices/programsSlice";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

const OnPremiseRetailSelector = ({ classes }) => {
  const dispatch = useDispatch();

  const [channel, setChannel] = useState("");

  const isRetail = useSelector((state) => state.user.isRetail);
  const isOnPremise = useSelector((state) => state.user.isOnPremise);
  const currentChannel = useSelector((state) => state.user.currentChannel);
  const currentTerritory = useSelector((state) => state.user.currentTerritory);
  const isOrdering = useSelector((state) => state.orderSet.isOrdering);

  const handleChangeSelect = (evt) => {
    setChannel(evt.target.value);
    let channelBool = evt.target.value === "On Premise" ? true : false;
    dispatch(fetchPrograms(currentTerritory, channelBool));
    dispatch(updateCurrentChannel({ channel: evt.target.value }));
  };

  useEffect(() => {
    if (currentChannel !== channel) {
      setChannel(currentChannel);
    }
  }, [currentChannel, channel]);

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
          {currentChannel}
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
            value={channel}
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
