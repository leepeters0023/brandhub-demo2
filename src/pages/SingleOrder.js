import React, { useEffect } from "react";
import { Link } from "@reach/router";
//import { CSVLink } from "react-csv";
import PropTypes from "prop-types";
import format from "date-fns/format";

import { useSelector, useDispatch } from "react-redux";
import { useRetainFiltersOnPopstate } from "../hooks/UtilityHooks";

import { fetchOrder } from "../redux/slices/orderHistorySlice";

import { setRetain } from "../redux/slices/filterSlice";

import { formatMoney } from "../utility/utilityFunctions";

import SingleOrderDetailTable from "../components/OrderHistory/SingleOrderDetailTable";
import Loading from "../components/Utility/Loading";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import GetAppIcon from "@material-ui/icons/GetApp";
import PrintIcon from "@material-ui/icons/Print";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const SingleOrder = ({ handleFiltersClosed, orderId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const currentOrder = useSelector((state) => state.orderHistory.singleOrder);
  const currentUserRole = useSelector((state) => state.user.role);
  const isLoading = useSelector((state) => state.orderHistory.isLoading);
  const currentGrouping = useSelector((state) => state.filters.groupBy);

  useRetainFiltersOnPopstate(
    `/orders/history/group/by${
      currentGrouping[0].toUpperCase() + currentGrouping.slice(1)
    }`,
    dispatch
  );

  useEffect(() => {
    if (
      (!currentOrder.orderNumber && currentUserRole.length > 0) ||
      (currentOrder.orderNumber !== orderId && currentUserRole.length > 0)
    ) {
      dispatch(fetchOrder(orderId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || !currentOrder.orderNumber) {
    return <Loading />;
  }

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Back to Order History" placement="bottom-start">
              <IconButton
                component={Link}
                to={`/orders/history/group/by${
                  currentGrouping[0].toUpperCase() + currentGrouping.slice(1)
                }`}
                onClick={() => {
                  dispatch(setRetain({ value: true }));
                }}
              >
                <ArrowBackIcon fontSize="large" color="secondary" />
              </IconButton>
            </Tooltip>
            <Typography
              className={classes.titleText}
              style={{ marginTop: "5px" }}
            >
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
            <Tooltip title="Export CSV">
              <IconButton>
                <GetAppIcon color="secondary" />
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
            <SingleOrderDetailTable items={currentOrder.items} />
          </Grid>
          <Grid item lg={3} sm={12} xs={12}>
            <Typography className={classes.headerText}>
              Order Summary:
            </Typography>
            <Divider />
            <br />
            <Typography className={classes.headerText}>
              {`Status: ${
                currentOrder.status[0].toUpperCase() +
                currentOrder.status.slice(1)
              }`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Order Type: ${currentOrder.type}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Order Date: ${format(
                new Date(currentOrder.orderDate),
                "MM/dd/yyyy"
              )}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Ship Date: ${
                currentOrder.shipDate !== "---"
                  ? format(new Date(currentOrder.shipDate))
                  : currentOrder.shipDate
              }`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Shipping Location: ${currentOrder.distributorName} - ${currentOrder.distributorId}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Address: ${currentOrder.distributorAddress}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Attention: ${currentOrder.attn}`}
            </Typography>
            {/* {order.rushOrder && (
              <Typography className={classes.headerText}>Rush Order</Typography>
            )} */}
            <Typography className={classes.headerText}>
              {`Total Items: ${currentOrder.totalItems}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Total Est. Cost: ${formatMoney(currentOrder.totalEstCost, false)}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Total Act. Cost: ${currentOrder.totalActCost}`}
            </Typography>
            <br />
            <Typography className={classes.headerText}>
              {`Order Notes: ${currentOrder.note ? currentOrder.note : "---"}`}
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
  handleFiltersClosed: PropTypes.func.isRequired,
  order: PropTypes.string,
};

export default SingleOrder;
