import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "date-fns";

import GalloLogo from "../assets/gallologo.png";

import ReportHistoryForm from "../components/Reports/ReportHistoryForm";
import ReportModal from "../components/Reports/ReportModal";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Reports = ({ handleFiltersClosed }) => {
  const classes = useStyles();

  const [reportModal, setReportModal] = useState(false);
  const [reportType, setReportType] = useState("Order History Details");

  const handleReportSubmit = (type) => {
    setReportType(type);
    setReportModal(true);
  };

  const handleModalClose = () => {
    setReportModal(false);
  };

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Container className={classes.mainWrapper}>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Reports
          </Typography>
        </div>
        <br />
        <br />
        <Typography className={classes.headerText}>Order History:</Typography>
        <br />
        <ReportHistoryForm handleReportSubmit={handleReportSubmit} />
      </Container>
      <br />
    </>
  );
};

Reports.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default Reports;
