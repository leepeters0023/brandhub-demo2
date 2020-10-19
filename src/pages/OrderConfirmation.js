import React, { useState, useEffect } from "react";
import { Link, navigate } from "@reach/router";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";

import { useSelector, useDispatch } from "react-redux";

//import { submitCurrentOrder } from "../redux/slices/patchOrderSlice";

import { clearCurrentOrder } from "../redux/slices/currentOrderSlice";

import { formatMoney } from "../utility/utilityFunctions";

import OrderConfirmationTable from "../components/Purchasing/OrderConfirmationTable";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
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

const OrderConfirmation = ({ userType, handleFiltersClosed, orderType }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [currentCSV, setCurrentCSV] = useState({ data: [], headers: [] });
  const [submitted, setSubmitted] = useState(false);
  const order = useSelector((state) => state.currentOrder);

  if (order.items.length === 0 && !submitted) {
    const path =
      orderType === "inStock"
        ? "/orders/items/inStock"
        : "/orders/items/onDemand";
    navigate(path);
  }

  const handleSubmit = () => {
    //dispatch(submitCurrentOrder(window.location.hash.slice(1), userType));
    dispatch(clearCurrentOrder());
    setSubmitted(true);
  };

  useEffect(() => {
    if (order && currentCSV.data.length === 0) {
      let headers = [
        { label: "Item", key: "item" },
        { label: "Sequence #", key: "itemNumber" },
        { label: "Qty /Pack", key: "packSize" },
        { label: "Est. Cost", key: "price" },
        { label: "Qty", key: "totalItems" },
        { label: "Est. Total", key: "estTotal" },
        { label: "", key: "blank" },
        { label: "Shipping Location", key: "distributor" },
        { label: "Address", key: "address" },
        { label: "Attention", key: "attn" },
        { label: "Rush Order", key: "rush" },
        { label: "Order Total Items", key: "ordTotalItems" },
        { label: "Est. Order Total", key: "ordEstTotal" },
      ];
      let csvData = order.items.map((item, index) => {
        if (index === 0) {
          return {
            item: `${item.brand} - ${item.itemType}`,
            itemNumber: item.itemNumber,
            packSize: item.packSize,
            price: formatMoney(item.price),
            totalItems: item.totalItems,
            estTotal: item.estTotal,
            blank: "",
            distributor: `${order.distributorName} - ${order.distributorId}`,
            address: "123 Address Rd., Burlington VT 05401",
            attn: order.attention,
            rush: order.rushOrder ? "True" : "False",
            ordTotalItems: order.totalItems,
            ordEstTotal: formatMoney(order.totalCost),
          };
        } else {
          return {
            item: `${item.brand} - ${item.itemType}`,
            itemNumber: item.itemNumber,
            packSize: item.packSize,
            price: formatMoney(item.price),
            totalItems: item.totalItems,
            estTotal: item.estTotal,
          };
        }
      });
      setCurrentCSV({ data: csvData, headers: headers });
    }
  }, [currentCSV.data.length, order]);

  useEffect(() => {
    handleFiltersClosed()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!order.orderNumber && submitted) {
    return (
      <Container className={classes.mainWrapper}>
        <br />
        <br />
        <br />
        <br />
        <div style={{ width: "100%", textAlign: "center" }}>
          <Typography className={classes.titleText}>
            Thank you for your order!
          </Typography>
        </div>
      </Container>
    );
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
            <Tooltip title="Export CSV">
              <CSVLink data={currentCSV.data} headers={currentCSV.headers}>
                <IconButton>
                  <GetAppIcon color="secondary" />
                </IconButton>
              </CSVLink>
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
            <Typography className={classes.headerText}>
              Order Summary:
            </Typography>
            <Divider />
            <br />
            <Typography className={classes.headerText}>
              {`Shipping Location: ${order.distributorName} - ${order.distributorId}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Address: 123 Address Rd., Burlington VT 05401`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Attention: ${order.attention}`}
            </Typography>
            {order.rushOrder && (
              <Typography className={classes.headerText}>Rush Order</Typography>
            )}
            <Typography className={classes.headerText}>
              {`Total Items: ${order.totalItems}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Total Cost: ${formatMoney(order.totalCost)}`}
            </Typography>
            <br />
            <Typography className={classes.headerText}>
              {`Order Notes: ${order.orderNote}`}
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
              onClick={handleSubmit}
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
  handleFiltersClosed: PropTypes.func.isRequired,
  orderType: PropTypes.string,
};

export default React.memo(OrderConfirmation);
