import React, { useState } from "react";
import "date-fns";

import GalloLogo from "../assets/gallologo.png";

import ReportHistoryForm from "../components/ReportHistoryForm";
import ReportModal from "../components/ReportModal";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Reports = () => {
  const classes = useStyles();

  const [reportModal, setReportModal] = useState(false);
  const [reportType, setReportType] = useState("Order History Details");

  const handleReportSubmit = (type) => {
    setReportType(type)
    setReportModal(true)
  }

  const handleModalClose = () => {
    setReportModal(false);
  };

  return (
    <>
      <div className={classes.relativeContainer}>
        <Dialog
          open={reportModal}
          onClose={handleModalClose}
          fullWidth
          maxWidth="xl"
        >
          <IconButton
            className={classes.closeButton}
            onClick={() => {
              handleModalClose();
            }}
          >
            <CancelIcon fontSize="large" color="secondary" />
          </IconButton>
          <DialogTitle>
            <Typography className={classes.titleText}>{reportType}</Typography>
          </DialogTitle>
          <DialogContent>
            <ReportModal handleClose={handleModalClose} />
          </DialogContent>
        </Dialog>
      </div>
      <Paper className={classes.paperContainer}>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Reports
          </Typography>
        </div>
        <br />
        <Divider />
        <br />
        <Typography className={classes.headerText}>Order History:</Typography>
        <br />
        <ReportHistoryForm handleReportSubmit={handleReportSubmit}/>
      </Paper>
    </>
  );
};

export default Reports;
