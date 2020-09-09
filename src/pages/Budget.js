import React, { useState, useEffect } from "react";

import BudgetRegional from "../components/Budgets/BudgetRegional";
import BudgetUser from "../components/Budgets/BudgetUser";
import BudgetBrand from "../components/Budgets/BudgetBrand";
//import RegionSelector from "../components/Utility/RegionSelector";

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

const Budget = () => {
  const classes = useStyles();
  const [value, updateValue] = useState(1);
  const currentUser = window.localStorage.getItem("brandhub-role");

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
      <Container className={classes.mainWrapper}>
        <div className={classes.formControl}>
          {/* <RegionSelector /> */}
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
        <br />
        <br />
        {value === 1 && <BudgetRegional />}
        {value === 2 && <BudgetUser />}
        {value === 3 && <BudgetBrand />}
      </Container>
      <br />
    </>
  );
};

export default Budget;
