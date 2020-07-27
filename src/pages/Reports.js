import React, { useState } from "react";

import OrderHistory from "../components/OrderHistory";
import SelectorMenus from "../components/SelectorMenus";

import GalloLogo from "../assets/gallologo.png";

import Paper from "@material-ui/core/Paper";
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

const Reports = () => {
  const classes = useStyles();
  const [value, updateValue] = useState(1);

  const handleChangeTab = (_evt, newValue) => {
    updateValue(newValue);
  };

  return (
    <>
      <Paper className={classes.paperContainer}>
        <div className={classes.formControl}>
          <SelectorMenus type="regions" />
        </div>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Reports
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
            label="Order History"
            value={1}
          />
          <Tab
            className={classes.headerText}
            label="Custom Reports"
            value={2}
          />
        </Tabs>
        {value === 1 && <OrderHistory />}
      </Paper>
    </>
  );
};

export default Reports;
