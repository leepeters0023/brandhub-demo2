import React, { useEffect, useState, useCallback } from "react";
import { Link } from "@reach/router";
import { CSVLink } from "react-csv";
import PropTypes from "prop-types";
import format from "date-fns/format";
import Helmet from "react-helmet";

import { useSelector, useDispatch } from "react-redux";
import { useRetainFiltersOnPopstate } from "../hooks/UtilityHooks";

import { fetchOrder } from "../redux/slices/orderHistorySlice";
import { getTracking } from "../redux/slices/trackingSlice";
import { setRetain } from "../redux/slices/filterSlice";

import { formatMoney } from "../utility/utilityFunctions";

import SingleOrderDetailTable from "../components/OrderHistory/SingleOrderDetailTable";
import Loading from "../components/Utility/Loading";
import TrackingModal from "../components/Utility/TrackingModal";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import GetAppIcon from "@material-ui/icons/GetApp";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const SingleOrder = ({ handleFiltersClosed, orderId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [isTrackingOpen, setTrackingOpen] = useCallback(useState(false));
  const [currentCSV, setCurrentCSV] = useState({ data: [], headers: [] });

  const currentOrder = useSelector((state) => state.orderHistory.singleOrder);
  const currentUserRole = useSelector((state) => state.user.role);
  const currentSuppliers = useSelector((state) => state.suppliers.supplierList);
  const isLoading = useSelector((state) => state.orderHistory.isLoading);
  const currentGrouping = useSelector((state) => state.filters.groupBy);

  const handleTrackingClick = (id) => {
    dispatch(getTracking(id));
    setTrackingOpen(true);
  };

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
    if (
      currentOrder.orderNumber &&
      currentCSV.data.length === 0 &&
      currentOrder.orderNumber === orderId &&
      currentSuppliers.length > 0
    ) {
      let csvHeaders = [
        { label: "Ordered By", key: "user" },
        { label: "Market", key: "state" },
        { label: "Brand", key: "brandCode" },
        { label: "BU", key: "unit" },
        { label: "Month in Market", key: "inMarketDate" },
        { label: "Tactic", key: "tactic" },
        { label: "Vendor", key: "supplier" },
        { label: "Estimated Cost", key: "totalEstCost" },
        { label: "Qty Ordered", key: "totalItems" },
        { label: "Hold Type", key: "holdType" },
        { label: "Seq #", key: "itemNumber" },
        { label: "Program", key: "program" },
        { label: "Order Type", key: "orderType" },
      ];
      let csvData = [];
      currentOrder.items.forEach((item) => {
        let supName = currentSuppliers.find((sup) => sup.id === item.supplierId)
          .name;
        let dataObject = {
          user: currentOrder.user,
          state: item.state,
          brandCode: item.brandCode,
          unit: item.unit,
          inMarketDate: item.inMarketDate,
          tactic: /*TODO*/ "---",
          supplier: supName,
          totalEstCost: formatMoney(item.totalEstCost),
          totalItems: item.totalItems,
          holdType: item.onShipHold ? "Compliance Pending" : "OK to ship",
          itemNumber: item.itemNumber,
          program: item.program,
          orderType: item.orderType,
        };
        csvData.push(dataObject);
      });
      setCurrentCSV({ data: csvData, headers: csvHeaders });
    }
  }, [
    currentOrder.items,
    currentOrder.user,
    currentOrder.orderNumber,
    currentCSV.data.length,
    currentSuppliers,
    orderId,
  ]);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || !currentOrder.orderNumber) {
    return <Loading />;
  }

  return (
    <>
      <Helmet><title>RTA | Order</title></Helmet>
      <TrackingModal open={isTrackingOpen} handleClose={setTrackingOpen} />
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
          <div className={classes.configButtons}>
            <div className={classes.innerConfigDiv}>
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
          </div>
        </div>
        <br />
        <br />
        <Grid container spacing={5}>
          <Grid item lg={9} sm={12} xs={12}>
            <Typography className={classes.headerText}>Order Items:</Typography>
            <Divider />
            <br />
            <SingleOrderDetailTable
              items={currentOrder.items}
              handleTrackingClick={handleTrackingClick}
            />
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
              {`Shipping Location: ${
                currentOrder.distributorName
                  ? currentOrder.distributorName
                  : currentOrder.customAddressName
              } - ${
                currentOrder.distributorId
                  ? currentOrder.distributorId
                  : currentOrder.customAddressId
              }`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Address: ${
                currentOrder.distributorAddress
                  ? currentOrder.distributorAddress
                  : currentOrder.customAddressAddress
              }`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Attention: ${currentOrder.attn}`}
            </Typography>
            <br />
            <Divider />
            <br />
            <Typography className={classes.headerText}>
              {`Total Items: ${currentOrder.totalItems}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Total Item Est. Cost: ${formatMoney(
                currentOrder.totalItemEstCost,
                false
              )}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Total Item Act. Cost: ${
                currentOrder.totalActCost !== "---"
                  ? formatMoney(currentOrder.totalActCost, false)
                  : "---"
              }`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Total Est. Freight: ${formatMoney(
                currentOrder.totalEstFreight,
                false
              )}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Total Act. Freight: ${
                currentOrder.totalActFreight !== "---"
                  ? formatMoney(currentOrder.totalActFreight, false)
                  : "---"
              }`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Total Est. Tax: ${formatMoney(
                currentOrder.totalEstTax,
                false
              )}`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Total Act. Tax: ${
                currentOrder.totalActTax !== "---"
                  ? formatMoney(currentOrder.totalActTax, false)
                  : "---"
              }`}
            </Typography>
            <Typography className={classes.headerText}>
              {`Total Est. Cost: ${formatMoney(
                currentOrder.totalEstCost,
                false
              )}`}
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
