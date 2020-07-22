import React, { useState } from "react";

import GalloLogo from "../assets/gallologo.png";
import { useInput } from "../hooks/UtilityHooks";

import ApprovalPrior from "../components/ApprovalPrior";
import ApprovalPending from "../components/ApprovalPending";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  queryControl: {
    display: "flex",
    width: "100%",
    justifyContent: "space-around",
  },
}));

const Compliance = () => {
  const classes = useStyles();

  const [value, updateValue] = useState(1);
  const [region, updateRegion] = useState(1);
  const [modal, setModal] = useState(false);

  const {
    value: sequenceNum,
    bind: bindSequenceNum,
    reset: resetSequenceNum,
  } = useInput("");
  const { value: brand, bind: bindBrand, reset: resetBrand } = useInput("");
  const {
    value: approvalId,
    bind: bindApprovalId,
    reset: resetApprovalId,
  } = useInput("");

  const handleChangeTab = (_evt, newValue) => {
    updateValue(newValue);
  };

  const handleChangeSelect = (evt) => {
    updateRegion(evt.target.value);
  };

  const handleSearch = () => {
    console.log(sequenceNum, brand, approvalId);
  };

  const handleClear = () => {
    resetSequenceNum();
    resetBrand();
    resetApprovalId();
  };

  const handleModal = (id) => {
    setModal(true);
    console.log(modal)
    console.log(id)
  }

  return (
    <>
      <Paper className={classes.paperContainer}>
        <div className={classes.titleBar}>
          <div className={classes.titleImage}>
            <img className={classes.logo} src={GalloLogo} alt="Gallo" />
            <Typography className={classes.titleText} variant="h5">
              Compliance
            </Typography>
          </div>
          <div>
            <FormControl variant="outlined">
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
          </div>
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
            label="Prior Approval"
            value={1}
          />
          <Tab
            className={classes.headerText}
            label="Pending Approval"
            value={2}
          />
        </Tabs>
        <br />
        <br />
        <Grid container spacing={5} className={classes.orderGrid}>
          <Grid item md={2}>
            <br />
            <Typography className={classes.headerText} >
              Filter
            </Typography>
              <form>
                <TextField
                  fullWidth
                  size="small"
                  color="primary"
                  variant="outlined"
                  margin="normal"
                  id="sequenceNumber"
                  label="Sequence Num"
                  name="sequenceNumber"
                  {...bindSequenceNum}
                />
                <TextField
                  fullWidth
                  size="small"
                  color="primary"
                  variant="outlined"
                  margin="normal"
                  id="brand"
                  label="Brand"
                  name="brand"
                  {...bindBrand}
                />
                <TextField
                  fullWidth
                  size="small"
                  color="primary"
                  variant="outlined"
                  margin="normal"
                  id="approvalId"
                  label="Approval ID"
                  name="approvalId"
                  {...bindApprovalId}
                />
              </form>
              <div className={classes.queryControl}>
                <Tooltip title="Search">
                  <IconButton onClick={handleSearch}>
                    <SearchIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Search">
                  <IconButton onClick={handleClear}>
                    <ClearIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
              </div>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item md={9}>
            {value === 1 && <ApprovalPrior handleModal={handleModal}/>}
            {value === 2 && <ApprovalPending handleModal={handleModal}/>}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default Compliance;
