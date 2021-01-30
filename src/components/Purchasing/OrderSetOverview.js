import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";

import { useSelector, useDispatch } from "react-redux";

import {
  restartOrdSet,
  approveOrdSet,
} from "../../redux/slices/patchOrderSlice";

import {
  clearCurrentOrder,
  clearOrderByType,
} from "../../redux/slices/currentOrderSlice";

import { formatMoney } from "../../utility/utilityFunctions";

import OrderSetConfirmationTable from "./OrderSetConfirmationTable";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const OrderSetOverview = ({ setOverviewVisible }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const typeMap = {
    "pre-order": "Pre Order",
    "on-demand": "On Demand",
    "in-stock": "Inventory",
  }

  const [currentCSV, setCurrentCSV] = useState({ data: [], headers: [] });
  const [orderType, setOrderType] = useState("");

  const orderSet = useSelector((state) => state.orderSet);
  const programId = useSelector((state) => state.preOrderDetails.programId);
  const currentUserRoll = useSelector((state) => state.user.role);
  const name = useSelector((state) => state.user.name);
  const currentSuppliers = useSelector((state) => state.suppliers.supplierList);

  const handleEditOrder = () => {
    dispatch(restartOrdSet(programId, "in-progress", orderSet.orderId));
  };

  const handleApproval = () => {
    dispatch(approveOrdSet(orderSet.orderId, "approved", null));
  };

  useEffect(() => {
    if (
      orderSet &&
      currentCSV.data.length === 0 &&
      currentSuppliers.length > 0
    ) {
      let csvHeaders = [
        { label: "Ordered By", key: "user" },
        { label: "Market", key: "state" },
        { label: "Brand", key: "brandCode" },
        { label: "BU", key: "unit" },
        { label: "Item Type", key: "itemType" },
        { label: "Month in Market", key: "inMarketDate" },
        { label: "Estimated Cost", key: "totalEstCost" },
        { label: "Qty Ordered", key: "totalItems" },
        { label: "Seq #", key: "itemNumber" },
        { label: "Program", key: "program" },
        { label: "Order Type", key: "orderType" },
        { lable: "On Rush", key: "isRush" },
      ];
      let csvData = [];
      orderSet.orders.forEach((ord) => {
        ord.items.forEach((item) => {
          let dataObject = {
            user: `${name}`,
            state: item.state,
            brandCode: item.brandCode,
            unit: item.unit,
            itemType: item.itemType,
            inMarketDate: orderSet.items.find((i) => i.itemId === item.itemId).inMarketDate,
            totalEstCost: formatMoney(item.totalEstCost),
            totalItems: item.totalItems,
            itemNumber: item.itemNumber,
            program: item.program,
            orderType: typeMap[orderSet.type],
            isRush: orderSet.items.find((i) => i.itemId === item.itemId)
          };
          csvData.push(dataObject);
        });
      });
      csvData.sort((a, b) => {
        return parseInt(a.itemNumber) < parseInt(b.itemNumber)
          ? -1
          : parseInt(a.itemNumber) > parseInt(b.itemNumber)
          ? 1
          : 0;
      });
      setCurrentCSV({ data: csvData, headers: csvHeaders });
    }
  }, [currentCSV.data, orderSet, currentSuppliers, name, typeMap]);

  useEffect(() => {
    if (orderType.length === 0 && orderSet.type) {
      let typeArray = orderSet.type.split("-");
      let typeString = `${typeArray[0][0].toUpperCase()}${typeArray[0].slice(
        1
      )}-${typeArray[1][0].toUpperCase()}${typeArray[1].slice(1)}`;
      setOrderType(typeString);
    }

    return () => {
      if (orderSet.type === "in-stock") {
        dispatch(clearOrderByType({ type: "inStock" }));
      }
      if (orderSet.type === "on-demand") {
        dispatch(clearOrderByType({ type: "onDemand" }));
      }
      dispatch(clearCurrentOrder());
    };
  }, [orderType, orderSet, setOrderType, dispatch]);

  return (
    <>
      <Grid container spacing={5}>
        <Grid item lg={9} sm={12} xs={12}>
          <Typography className={classes.headerText}>
            {`${orderType} Overview:`}
          </Typography>
          <Divider />
          <br />
          {orderSet.items
            .map((item) => item.totalItems)
            .reduce((a, b) => a + b) > 0 ? (
            <OrderSetConfirmationTable
              orders={orderSet.orders}
              items={orderSet.items}
              type={orderSet.type}
            />
          ) : (
            <Typography
              className={classes.bodyText}
              style={{ marginTop: "20px" }}
            >
              There are no items added to this order currently ...
            </Typography>
          )}
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
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <CSVLink
              data={currentCSV.data}
              headers={currentCSV.headers}
              style={{ textDecoration: "none" }}
            >
              <Button
                className={classes.largeButton}
                variant="contained"
                color="secondary"
                startIcon={<GetAppIcon />}
              >
                WRAP UP
              </Button>
            </CSVLink>
          </div>
          <br />
          <Typography className={classes.headerText}>
            {`Total Items: ${orderSet.items
              .map((item) => item.totalItems)
              .reduce((a, b) => a + b)}`}
          </Typography>
          <Typography className={classes.headerText}>
            {`Total Est. Item Cost: ${formatMoney(orderSet.totalEstItemCost, false)}`}
          </Typography>
          <Typography className={classes.headerText}>
            {`Est. Freight Charge: ${formatMoney(orderSet.totalEstFreight, false)}`}
          </Typography>
          <Typography
            className={classes.headerText}
          >{`Est. Tax: ${formatMoney(orderSet.totalEstTax, false)}`}</Typography>
          <br />
          <Divider />
          <br />
          <Typography className={classes.headerText}>
            {`Total Cost: ${formatMoney(orderSet.orderTotal, false)}`}
          </Typography>
          <br />
          {((currentUserRoll === "super" &&
            orderSet.status !== "approved" &&
            window.location.href.includes("approval")) ||
            (currentUserRoll === "field2" &&
              orderSet.status !== "approved" &&
              window.location.href.includes("approval")) ||
            (orderSet.status !== "submitted" &&
              orderSet.status !== "approved")) && (
            <Button
              className={classes.largeButton}
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => {
                orderSet.status === "in-progress" ||
                orderSet.status === "inactive"
                  ? setOverviewVisible(false)
                  : handleEditOrder();
              }}
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
            (orderSet.status === "submitted" &&
              (currentUserRoll === "super" || currentUserRoll === "field2") &&
              !window.location.href.includes("approval")) ||
            orderSet.status === "approved") && (
            <>
              <Typography className={classes.headerText}>
                Thank you for your Submission!
              </Typography>
            </>
          )}
          <br />
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(OrderSetOverview);
