import React, { useState } from "react";

import GalloLogo from "../assets/gallologo.png";

import OrderPrePortal from "../components/OrderPrePortal";
import OrderInStockPortal from "../components/OrderInStockPortal";
import OrderOnDemandPortal from "../components/OrderOnDemandPortal";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  formControl: {
    float: "right",
  }
}));

const Order = () => {
  const classes = useStyles();
  const [value, updateValue] = useState(1);
  const [region, updateRegion] = useState("Region 1");

  const handleChangeTab = (_evt, newValue) => {
    updateValue(newValue)
  }

  const handleChangeSelect = (evt) => {
    updateRegion(evt.target.value);
  }

  return (
    <div>
      <Paper className={classes.paperContainer}>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Region</InputLabel>
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
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Place an Order
          </Typography>
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
      </Paper>
      {value === 1 && <OrderPrePortal />}
      {value === 2 && <OrderInStockPortal />}
      {value === 3 && <OrderOnDemandPortal />}
    </div>
  );
};

export default Order;
