import React, { useState } from "react";

import GalloLogo from "../assets/gallologo.png";

import ApprovalPrior from "../components/ApprovalPrior";
import ApprovalPending from "../components/ApprovalPending";
import ComplianceModal from "../components/ComplianceModal";
import SelectorMenus from "../components/SelectorMenus";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Compliance = () => {
  const classes = useStyles();

  const [value, updateValue] = useState(1);
  const [modal, setModal] = useState(false);
  const [currentId, setCurrentId] = useState("");

  const handleChangeTab = (_evt, newValue) => {
    updateValue(newValue);
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
            <SelectorMenus type="regions" />
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
        {value === 1 && <ApprovalPrior handleModal={handleModal} />}
        {value === 2 && <ApprovalPending handleModal={handleModal} />}
      </Paper>
    </>
  );
};

export default Compliance;
