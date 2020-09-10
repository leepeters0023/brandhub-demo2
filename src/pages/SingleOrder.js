import React from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

//import { useSelector } from "react-redux";

import OrderConfirmationTable from "../components/Purchasing/OrderConfirmationTable";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

//mockData
import orders from "../assets/mockdata/Orders";

const order = orders[0];

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const SingleOrder = ({ orderId }) => {
  const classes = useStyles();

  //const order = useSelector((state) => state.currentOrder);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Back to Order History" placement="bottom-start">
              <IconButton component={Link} to="/orders/history">
                <ArrowBackIcon fontSize="large" color="secondary" />
              </IconButton>
            </Tooltip>
            <Typography className={classes.titleText} style={{marginTop: "5px"}}>
              {`Order ${orderId}`}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              width: "150px",
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
            {/*//TODO make actual order history items table*/}
            <OrderConfirmationTable items={order.items} />
          </Grid>
          <Grid item lg={3} sm={12} xs={12}>
            <Typography className={classes.headerText}>
              Order Summary:
            </Typography>
            <Divider />
            <br />
            <Typography className={classes.headerText}>
              {`Status:`}
            </Typography>
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
            <Typography className={classes.headerText}>{`Budget:`}</Typography>
            <Typography className={classes.headerText}>
              {`Total Items: ${order.totalItems}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Total Cost: $${order.totalEstCost}`}
            </Typography>
            <br />
            <Typography className={classes.headerText}>
              {`Order Notes:`}
            </Typography>
            <br />
          </Grid>
        </Grid>
      </Container>
      <br />
    </>
  );
};

SingleOrder.propTypes = {
  order: PropTypes.string,
};

export default SingleOrder;
