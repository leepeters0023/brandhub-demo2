import React, { useState, useEffect } from "react";

import GalloLogo from "../assets/gallologo.png";

import ApprovalPrior from "../components/Compliance/ApprovalPrior";
import ApprovalPending from "../components/Compliance/ApprovalPending";
import ComplianceModal from "../components/Compliance/ComplianceModal";
import SelectorMenus from "../components/Utility/SelectorMenus";

import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Approvals = () => {
  const classes = useStyles();

  const [value, updateValue] = useState(1);
  const [modal, setModal] = useState(false);
  const [currentId, setCurrentId] = useState("");

  const handleChangeTab = (_evt, newValue) => {
    if (newValue === 1) {
      window.location.hash = "#pending";
    } else if (newValue === 2) {
      window.location.hash = "#prior";
    }
    updateValue(newValue);
  };

  const handleModal = (id) => {
    setCurrentId(id);
    setModal(true);
  };

  useEffect(() => {
    if (window.location.hash === "#pending") {
      updateValue(1);
    } else if (window.location.hash === "#prior") {
      updateValue(2);
    }
  }, []);

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
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <div className={classes.titleImage}>
            <img className={classes.logo} src={GalloLogo} alt="Gallo" />
            <Typography className={classes.titleText} variant="h5">
              Approvals
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
            label="Pending Approval"
            value={1}
          />
          <Tab
            className={classes.headerText}
            label="Prior Approval"
            value={2}
          />
        </Tabs>
        <br />
        <Divider classes={{root: classes.pageBreak}}/>
        <br />
        {value === 1 && <ApprovalPending handleModal={handleModal} />}
        {value === 2 && <ApprovalPrior handleModal={handleModal} />}
      </Container>
      <br />
    </>
  );
};

export default Approvals;
