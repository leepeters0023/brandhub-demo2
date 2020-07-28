import React, { useState, useEffect } from "react";

import BudgetRegional from "../components/BudgetRegional";
import BudgetUser from "../components/BudgetUser";
import BudgetBrand from "../components/BudgetBrand";
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

const Budget = () => {
  const classes = useStyles();
  const [value, updateValue] = useState(1);
  const currentUser = window.localStorage.getItem("user");

  const handleChangeTab = (_evt, newValue) => {
    if (newValue === 1) {
      window.location.hash = "#regional"
    } else if (newValue === 2) {
      window.location.hash = "#user"
    } else if (newValue === 3) {
      window.location.hash = "#brand"
    }
    updateValue(newValue);
  };

  useEffect(()=>{
    if(window.location.hash === "#regional") {
      updateValue(1)
    } else if (window.location.hash === "#user") {
      updateValue(2)
    } else if (window.location.hash === "#brand") {
      updateValue(3)
    }
  },[])

  return (
    <>
      <Paper className={classes.paperContainer}>
        <div className={classes.formControl}>
          <SelectorMenus type="regions" />
        </div>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Budgets
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
            label="Regional Budgets"
            value={1}
          />
          {(currentUser === "super" || currentUser === "field2") && (
            <Tab
              className={classes.headerText}
              label="User Budgets"
              value={2}
            />
          )}
          <Tab className={classes.headerText} label="Brand Budgets" value={3} />
        </Tabs>
        {value === 1 && <BudgetRegional />}
        {value === 2 && <BudgetUser />}
        {value === 3 && <BudgetBrand />}
      </Paper>
    </>
  );
};

export default Budget;
