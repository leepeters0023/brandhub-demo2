import React, { useState, useCallback } from "react";
import { Link, navigate } from "@reach/router";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { setProgComplete } from "../redux/slices/patchOrderSlice";

import { formatMoney } from "../utility/utilityFunctions";

import OrderComplete from "../components/Utility/OrderComplete";
import PreOrderConfirmationTable from "../components/Purchasing/PreOrderConfirmationTable";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PreOrderConfirmation = ({ userType }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [completeOpen, setCompleteOpen] = useCallback(useState(false));
  const preOrder = useSelector((state) => state.programTable);

  if (preOrder.preOrderId === null) {
    navigate("/orders/open/preorder");
    return null;
  }

  const handleComplete = () => {
    dispatch(setProgComplete(preOrder.programId, true, preOrder.preOrderId));
    setCompleteOpen(true);
  };

  const handleClose = () => {
    setCompleteOpen(false);
    navigate(`/orders/open/preorder#${preOrder.programId}`);
  };


  return (
    <>
      <OrderComplete open={completeOpen} handleClose={handleClose} />
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>
            {`${preOrder.name} Pre-Order Confirmation`}
          </Typography>
          <div
            style={{
              display: "flex",
              width: "100px",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip title="Print Order">
              <IconButton>
                <PrintIcon color="secondary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export PDF">
              <IconButton>
                <PictureAsPdfIcon color="secondary" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <br />
        <br />
        <Grid container spacing={5}>
          <Grid item lg={9} sm={12} xs={12}>
            <Typography className={classes.headerText}>
              Pre-Order Overview:
            </Typography>
            <Divider />
            <br />
            <PreOrderConfirmationTable orders={preOrder.orders} items={preOrder.items} />
          </Grid>
          <Grid item lg={3} sm={12} xs={12}>
            <Typography className={classes.headerText}>
              Pre-Order Summary:
            </Typography>
            <Divider />
            <br />
            <Typography className={classes.headerText}>{`Budget:`}</Typography>
            <Typography className={classes.headerText}>
              {`Total Items: ${preOrder.items
                .map((item) => item.totalItems)
                .reduce((a, b) => a + b)}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Total Cost: ${formatMoney(preOrder.programTotal)}`}
            </Typography>
            <br />
            <Typography className={classes.headerText}>
              {`Order Notes: ${preOrder.preOrderNote}`}
            </Typography>
            <br />
            <Button
              className={classes.largeButton}
              variant="contained"
              color="primary"
              fullWidth
              component={Link}
              to={`/orders/open/preorder#${preOrder.programId}`}
            >
              EDIT ORDER
            </Button>
            <br />
            <br />
            <Button
              className={classes.largeButton}
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleComplete}
            >
              {userType === "field1"
                ? "CONFIRM SUBMISSION"
                : "CONFIRM PURCHASE"}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

PreOrderConfirmation.propTypes = {
  userType: PropTypes.string,
};

export default PreOrderConfirmation;
