import React from "react";
import { Link, navigate } from "@reach/router";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import OrderConfirmationTable from "../components/Purchasing/OrderConfirmationTable";

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

const OrderConfirmation = ({ userType, orderType }) => {
  const classes = useStyles();
  const formattedType = `${orderType}Order`;
  const order = useSelector((state) => state[formattedType]);
  
  if (order.items.length === 0) {
    const path = orderType === "inStock" ? "/orders/items/instock" : "/orders/items/ondemand"
    navigate(path)
  }

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>

        <Typography className={classes.titleText}>
          {orderType === "inStock"
            ? "In-Stock Order Confirmation"
            : "On-Demand Order Confirmation"}
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
            
        <Typography className={classes.headerText}>Order Items:</Typography>
        <Divider />
        <br />
        <OrderConfirmationTable items={order.items} />
          </Grid>
          <Grid item lg={3} sm={12} xs={12}>
        <Typography className={classes.headerText}>Order Summary:</Typography>
        <Divider />
        <br />
            <Typography className={classes.headerText}>
              {`Shipping Location: ${order.distributorName} - ${order.distributorId}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Address: 123 Address Rd., Burlington VT 05401`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Attention:`}
            </Typography>
            {order.rushOrder && (
              <Typography className={classes.headerText}>Rush Order</Typography>
            )}
            <Typography className={classes.headerText}>
              {`Budget: ${order.budget}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Total Items: ${order.totalItems}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Total Cost: $${order.totalCost}`}
            </Typography>
            <br />
            <Typography className={classes.headerText}>
              {`Order Notes:`}
            </Typography>
            <br />
            <Button
              className={classes.largeButton}
              variant="contained"
              color="primary"
              fullWidth
              component={Link}
              to={
                orderType === "inStock"
                  ? "/orders/open/instock"
                  : "/orders/open/ondemand"
              }
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
            >
              {userType === "field1"
                ? "CONFIRM SUBMISSION"
                : "CONFIRM PURCHASE"}
            </Button>
          </Grid>
        </Grid>
      </Container>
      <br />
    </>
  );
};

OrderConfirmation.propTypes = {
  userType: PropTypes.string,
  orderType: PropTypes.string,
};

export default OrderConfirmation;
