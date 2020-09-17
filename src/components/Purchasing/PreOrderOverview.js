import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";

import { useSelector, useDispatch } from "react-redux";

import { setProgStatus } from "../../redux/slices/patchOrderSlice";

import { formatMoney } from "../../utility/utilityFunctions";

import PreOrderConfirmationTable from "./PreOrderConfirmationTable";

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

const PreOrderOverview = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [currentCSV, setCurrentCSV] = useState({ data: [], headers: [] });

  const preOrder = useSelector((state) => state.programTable);

  const handleEditOrder = () => {
    dispatch(
      setProgStatus(preOrder.programId, "in-progress", preOrder.preOrderId)
    );
  };

  useEffect(() => {
    if (preOrder && currentCSV.data.length === 0) {
      let orderHeaders = [
        { label: "Order Number", key: "orderNum" },
        { label: "Distributor", key: "distributorName" },
        { label: "Total Items", key: "totalItems" },
        { label: "Est. Cost", key: "estTotal" },
      ];
      let itemHeaders = preOrder.items.map((item) => ({
        label: item.itemNumber,
        key: item.itemNumber,
      }));
      let headers = orderHeaders.concat(itemHeaders);
      let orderData = preOrder.orders.map((order) => {
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
  }, [currentCSV.data, preOrder]);

  return (
    <>
      <Grid container spacing={5}>
        <Grid item lg={9} sm={12} xs={12}>
          <Typography className={classes.headerText}>
            Pre-Order Overview:
          </Typography>
          <Divider />
          <br />
          <PreOrderConfirmationTable
            orders={preOrder.orders}
            items={preOrder.items}
          />
        </Grid>
        <Grid item lg={3} sm={12} xs={12}>
          <Typography className={classes.headerText}>
            Pre-Order Summary:
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
          {preOrder.status !== "submitted" && (
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
          {preOrder.status === "submitted" && (
            <Typography className={classes.headerText}>
              Thank you for your Submission!
            </Typography>
          )}
          <br />
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(PreOrderOverview);
