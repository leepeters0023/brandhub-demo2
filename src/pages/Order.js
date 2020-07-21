import React, { useState } from "react";

import GalloLogo from "../assets/gallologo.png";

//mockdata
import items from "../assets/mockdata/Items";

import ItemFilter from "../components/ItemFilter";
import OrderPre from "../components/OrderPre";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import ViewStreamIcon from "@material-ui/icons/ViewStream";
import ViewModuleIcon from "@material-ui/icons/ViewModule";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  orderGrid: {
    display: "flex",
    justifyContent: "space-around"
  }
}));

let brands = items.map((item) => item.brand);
let itemTypes = items.map((item) => item.itemType);

const Order = () => {
  const classes = useStyles();
  const [value, updateValue] = useState(1);
  const [region, updateRegion] = useState("Region 1");
  const [currentView, setView] = useState("list");

  const handleChangeTab = (_evt, newValue) => {
    updateValue(newValue);
  };

  const handleChangeSelect = (evt) => {
    updateRegion(evt.target.value);
  };

  return (
    <>
      <Paper className={classes.paperContainer}>
        <div className={classes.titleBar}>
          <div className={classes.titleImage}>
            <img className={classes.logo} src={GalloLogo} alt="Gallo" />
            <Typography className={classes.titleText} variant="h5">
              Place an Order
            </Typography>
          </div>
          <div>
            <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                Region
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={region}
                onChange={handleChangeSelect}
                label="Region"
              >
                <MenuItem value={"Region 1"}>Region 1</MenuItem>
                <MenuItem value={"Region 2"}>Region 2</MenuItem>
                <MenuItem value={"Region 3"}>Region 3</MenuItem>
              </Select>
            </FormControl>
            <div className={classes.configButtons}>
              <Tooltip title="View List">
                <IconButton
                  onClick={() => {
                    setView("list");
                  }}
                >
                  <ViewStreamIcon
                    fontSize="large"
                    color={currentView === "list" ? "primary" : "inherit"}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="View Grid">
                <IconButton
                  onClick={() => {
                    setView("grid");
                  }}
                >
                  <ViewModuleIcon
                    fontSize="large"
                    color={currentView === "grid" ? "primary" : "inherit"}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChangeTab}
          indicatorColor="primary"
          centered
        >
          <Tab className={classes.headerText} label="Pre-Order" value={1} />
          <Tab className={classes.headerText} label="In-Stock" value={2} />
          <Tab className={classes.headerText} label="On-Demand" value={3} />
        </Tabs>
        <br />
        <br />
        <Grid container spacing={5} className={classes.orderGrid}>
          <Grid item md={2}>
            <br />
            <ItemFilter brands={brands} itemTypes={itemTypes} />
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item md={9}>
            <OrderPre currentView={currentView} />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default Order;
