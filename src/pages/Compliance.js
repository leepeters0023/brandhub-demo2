import React, { useState } from "react";

import GalloLogo from "../assets/gallologo.png";

import ApprovalPrior from "../components/ApprovalPrior";
import ApprovalPending from "../components/ApprovalPending";
import ComplianceModal from "../components/ComplianceModal";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Compliance = () => {
  const classes = useStyles();

  const [value, updateValue] = useState(1);
  const [region, updateRegion] = useState(1);
  const [modal, setModal] = useState(false);
  const [currentId, setCurrentId] = useState("");

  const handleChangeTab = (_evt, newValue) => {
    updateValue(newValue);
  };

  const handleChangeSelect = (evt) => {
    updateRegion(evt.target.value);
  };

  const handleModal = (id) => {
    setCurrentId(id);
    setModal(true);
  };

  return (
    <>
      <div className={classes.relativeContainer}>
        <Dialog
          open={modal}
          onClose={() => setModal(!modal)}
          fullWidth
          maxWidth="xl"
        >
          <DialogContent>
            <ComplianceModal id={currentId} handleClose={setModal} />
          </DialogContent>
        </Dialog>
      </div>
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
        {/* <Grid container spacing={5} justify="space-around">
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
          <Grid item md={9}> */}
        {value === 1 && <ApprovalPrior handleModal={handleModal} />}
        {value === 2 && <ApprovalPending handleModal={handleModal} />}
        {/* </Grid>
        </Grid> */}
      </Paper>
    </>
  );
};

export default Compliance;
