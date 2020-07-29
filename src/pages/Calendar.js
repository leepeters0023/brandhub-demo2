import React, { useState } from "react";

import SelectorMenus from "../components/SelectorMenus";

import GalloLogo from "../assets/gallologo.png";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
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

  const handleChangeTab = (_evt, newValue) => {
    updateValue(newValue);
  };


  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.formControl}>
          <SelectorMenus type="regions" />
        </div>
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
      </Container>
    </>
  );
};

export default Calendar;
