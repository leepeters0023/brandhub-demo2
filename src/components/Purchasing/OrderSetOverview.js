import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import { CSVLink } from "react-csv";

import { useSelector, useDispatch } from "react-redux";

import {
  restartOrdSet,
  approveOrdSet,
} from "../../redux/slices/patchOrderSlice";

import { formatMoney } from "../../utility/utilityFunctions";

import OrderSetConfirmationTable from "./OrderSetConfirmationTable";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import GetAppIcon from "@material-ui/icons/GetApp";
import PrintIcon from "@material-ui/icons/Print";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const OrderSetOverview = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [currentCSV, setCurrentCSV] = useState({ data: [], headers: [] });
  const [orderType, setOrderType] = useState("");

  const orderSet = useSelector((state) => state.orderSet);
  const programId = useSelector((state) => state.preOrderDetails.programId);
  const currentUserRoll = useSelector((state) => state.user.role);

  const handleEditOrder = () => {
    dispatch(restartOrdSet(programId, "in-progress", orderSet.orderId));
  };

  const handleApproval = () => {
    dispatch(approveOrdSet(orderSet.orderId, "approved", null));
  };

  useEffect(() => {
    if (orderSet && currentCSV.data.length === 0) {
      let orderHeaders = [
        { label: "Order Number", key: "orderNum" },
        { label: "Distributor", key: "distributorName" },
        { label: "Total Items", key: "totalItems" },
        { label: "Est. Cost", key: "estTotal" },
      ];
      let itemHeaders = orderSet.items.map((item) => ({
        label: item.itemNumber,
        key: item.itemNumber,
      }));
      let headers = orderHeaders.concat(itemHeaders);
      let orderData = orderSet.orders.map((order) => {
        let dataObject = {};
        dataObject.orderNum = order.orderNumber;
        dataObject.distributorName = order.distributorName;
        dataObject.totalItems = order.totalItems;
        dataObject.estTotal = formatMoney(order.estTotal);
        order.items.forEach((item) => {
          dataObject[item.itemNumber] = item.totalItems;
        });
        return dataObject;
      });
      setCurrentCSV({ data: orderData, headers: headers });
    }
  }, [currentCSV.data, orderSet]);

  useEffect(() => {
    if (orderType.length === 0 && orderSet.type) {
      let typeArray = orderSet.type.split("-");
      let typeString = `${typeArray[0][0].toUpperCase()}${typeArray[0].slice(
        1
      )}-${typeArray[1][0].toUpperCase()}${typeArray[1].slice(1)}`;
      setOrderType(typeString);
    }
  }, [orderType, orderSet, setOrderType]);

  return (
    <>
      <Grid container spacing={5}>
        <Grid item lg={9} sm={12} xs={12}>
          <Typography className={classes.headerText}>
            {`${orderType} Overview:`}
          </Typography>
          <Divider />
          <br />
          <OrderSetConfirmationTable
            orders={orderSet.orders}
            items={orderSet.items}
          />
        </Grid>
        <Grid item lg={3} sm={12} xs={12}>
          <Typography className={classes.headerText}>
            {`${orderType} Summary:`}
          </Typography>
          <Divider />
          <br />
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
            <Tooltip title="Export CSV">
              <CSVLink data={currentCSV.data} headers={currentCSV.headers}>
                <IconButton>
                  <GetAppIcon color="secondary" />
                </IconButton>
              </CSVLink>
            </Tooltip>
          </div>
          <br />
          <Typography className={classes.headerText}>
            {`Total Items: ${orderSet.items
              .map((item) => item.totalItems)
              .reduce((a, b) => a + b)}`}
          </Typography>
          <Typography className={classes.headerText}>
            {`Total Cost: ${formatMoney(orderSet.orderTotal)}`}
          </Typography>
          <br />
          <Typography className={classes.headerText}>
            {`Order Notes: ${orderSet.orderNote}`}
          </Typography>
          <br />
          {((currentUserRoll === "super" && orderSet.status !== "approved") ||
            (currentUserRoll === "field2" && orderSet.status !== "approved") ||
            (orderSet.status !== "submitted" &&
              orderSet.status !== "approved")) && (
            <Button
              className={classes.largeButton}
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleEditOrder}
            >
              EDIT ORDER
            </Button>
          )}
          {orderSet.status === "submitted" &&
            window.location.href.includes("approval") && (
              <>
                <br />
                <br />
                <Button
                  fullWidth
                  className={classes.largeButton}
                  color="secondary"
                  variant="contained"
                  onClick={handleApproval}
                  style={{ marginRight: "10px" }}
                >
                  APPROVE
                </Button>
                <br />
                <br />
                <Button
                  fullWidth
                  className={classes.largeButton}
                  color="secondary"
                  variant="contained"
                  //onClick={handleDeny}
                >
                  DENY
                </Button>
              </>
            )}
          {((orderSet.status === "submitted" &&
            currentUserRoll !== "super" &&
            currentUserRoll !== "field2") ||
            orderSet.status === "approved") && (
            <>
              <Typography className={classes.headerText}>
                Thank you for your Submission!
              </Typography>
              <br />
              <br />
              {!window.location.href.includes("preorder") && (
                <>
                  <Button
                    fullWidth
                    className={classes.largeButton}
                    color="secondary"
                    variant="contained"
                    component={Link}
                    to="/"
                  >
                    DASHBOARD
                  </Button>
                  <br />
                  <br />
                  <Button
                    fullWidth
                    className={classes.largeButton}
                    color="secondary"
                    variant="contained"
                    component={Link}
                    to="/orders/open/preorder"
                  >
                    PLACE QUARTERLY ORDER
                  </Button>
                  <br />
                  <br />
                  <Button
                    fullWidth
                    className={classes.largeButton}
                    color="secondary"
                    variant="contained"
                    component={Link}
                    to="/orders/items/inStock"
                  >
                    PLACE IN-STOCK ORDER
                  </Button>
                  <br />
                  <br />
                  <Button
                    fullWidth
                    className={classes.largeButton}
                    color="secondary"
                    variant="contained"
                    component={Link}
                    to="/orders/items/onDemand"
                  >
                    PLACE ON-DEMAND ORDER
                  </Button>
                  <br />
                  <br />
                  <Button
                    fullWidth
                    className={classes.largeButton}
                    color="secondary"
                    variant="contained"
                    component={Link}
                    to="/orders/history"
                  >
                    ORDER HISTORY
                  </Button>
                </>
              )}
            </>
          )}
          <br />
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(OrderSetOverview);
