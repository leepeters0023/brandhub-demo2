import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  dialogGrid: {
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  itemImage: {
    width: "85%",
    height: "auto",
  },
}));

const OrderHistoryItemModal = ({ handleClose }) => {
  const classes = useStyles();
  return (
    <>
      <Grid container spacing={5} className={classes.dialogGrid}>
        <IconButton
          className={classes.closeButton}
          onClick={() => {
            handleClose(false);
          }}
        >
          <CancelIcon fontSize="large" color="secondary" />
        </IconButton>
        <Grid item md={6} sm={12}>
          <div className={classes.centerWrapper}>
            <img
              className={classes.itemImage}
              src="https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013431/Select/bh_darkhorse_bin_ujhalx.jpg"
              alt="Item"
            />
          </div>
        </Grid>
        <Grid item md={6} sm={12}>
          <Typography className={classes.headerText}>Address:</Typography>
          <Typography className={classes.bodyText} variant="body2">
            {`ABC Distributor-(POS Only), CA (P)(6543158)`}
          </Typography>
          <Typography className={classes.bodyText} variant="body2">
            {`8550 Address St.`}
          </Typography>
          <Typography className={classes.bodyText} variant="body2">
            {`Town, CA, 90040`}
          </Typography>
          <br />
          <div style={{ display: "flex" }}>
            <Typography
              className={classes.headerText}
              style={{ marginRight: "2px" }}
            >
              Unit Price:
            </Typography>
            <Typography className={classes.bodyText} variant="body2">
              $123.50
            </Typography>
          </div>
          <div style={{ display: "flex" }}>
            <Typography
              className={classes.headerText}
              style={{ marginRight: "2px" }}
            >
              Extended Price:
            </Typography>
            <Typography className={classes.bodyText} variant="body2">
              $247.00
            </Typography>
          </div>
          <div style={{ display: "flex" }}>
            <Typography
              className={classes.headerText}
              style={{ marginRight: "2px" }}
            >
              Product Name:
            </Typography>
            <Typography className={classes.bodyText} variant="body2">
              Corrugate Bin
            </Typography>
          </div>
          <br />
          <div style={{ display: "flex" }}>
            <Typography
              className={classes.headerText}
              style={{ marginRight: "2px" }}
            >
              Requested Ship Date:
            </Typography>
            <Typography className={classes.bodyText} variant="body2">
              {new Date().toLocaleDateString()}
            </Typography>
          </div>
          <div style={{ display: "flex" }}>
            <Typography
              className={classes.headerText}
              style={{ marginRight: "2px" }}
            >
              Ordered By:
            </Typography>
            <Typography className={classes.bodyText} variant="body2">
              employee@employee_email.com
            </Typography>
          </div>
          <div style={{ display: "flex" }}>
            <Typography
              className={classes.headerText}
              style={{ marginRight: "2px" }}
            >
              Approval Id:
            </Typography>
            <Typography className={classes.bodyText} variant="body2">
              123456
            </Typography>
          </div>
          <div style={{ display: "flex" }}>
            <Typography
              className={classes.headerText}
              style={{ marginRight: "2px" }}
            >
              Compliance Status:
            </Typography>
            <Typography className={classes.bodyText} variant="body2">
              Pending
            </Typography>
          </div>
          <br />
          <div style={{ display: "flex" }}>
            <Typography
              className={classes.headerText}
              style={{ marginRight: "2px" }}
            >
              Coupon Type:
            </Typography>
            <Typography className={classes.bodyText} variant="body2">
              N/A
            </Typography>
          </div>
          <div style={{ display: "flex" }}>
            <Typography
              className={classes.headerText}
              style={{ marginRight: "2px" }}
            >
              Offer Detail:
            </Typography>
            <Typography className={classes.bodyText} variant="body2">
              Ipsum aliquip magna laboris aliqua occaecat quis enim est et aute.
            </Typography>
          </div>
          <div style={{ display: "flex" }}>
            <Typography
              className={classes.headerText}
              style={{ marginRight: "2px" }}
            >
              Campaign:
            </Typography>
            <Typography className={classes.bodyText} variant="body2">
              Summer Wine 2020
            </Typography>
          </div>
          <div style={{ display: "flex" }}>
            <Typography
              className={classes.headerText}
              style={{ marginRight: "2px" }}
            >
              Vendor:
            </Typography>
            <Typography className={classes.bodyText} variant="body2">
              Westrock Converting Company
            </Typography>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

OrderHistoryItemModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default OrderHistoryItemModal;
