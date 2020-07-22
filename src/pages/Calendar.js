import React, { useState } from "react";

import GalloLogo from "../assets/gallologo.png";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  formControl: {
    float: "right",
  },
}));

const Calendar = () => {
  const classes = useStyles();
  const [value, updateValue] = useState(1);
  const [region, updateRegion] = useState(1);

  const handleChangeTab = (_evt, newValue) => {
    updateValue(newValue);
  };

  const handleChangeSelect = (evt) => {
    updateRegion(evt.target.value);
  };

  return (
    <>
      <Paper className={classes.paperContainer}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">Region</InputLabel>
          <InputLabel id="region-select">Region</InputLabel>
          <Select
            native
            labelId="region-select"
            id="regions"
            value={region}
            onChange={handleChangeSelect}
            label="Region"
          >
            <option value={1}>Region 1</option>
            <option value={2}>Region 2</option>
            <option value={3}>Retion 3</option>
          </Select>
        </FormControl>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            GALLO Integrated Calendar
          </Typography>
        </div>
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChangeTab}
          indicatorColor="primary"
          centered
        >
          <Tab
            className={classes.headerText}
            label="Priority Calendar"
            value={1}
          />
          <Tab className={classes.headerText} label="On Premise" value={2} />
          <Tab className={classes.headerText} label="Off Premise" value={3} />
        </Tabs>
      </Paper>
    </>
  );
};

export default Calendar;
