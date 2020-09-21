import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import "date-fns";
import subDays from "date-fns/subDays";
import format from "date-fns/format";
import { CSVLink } from "react-csv";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

import { fetchUserDistributors } from "../redux/slices/distributorSlice";
import {
  fetchFilteredOrderHistory,
  fetchNextOrderHistory,
} from "../redux/slices/orderHistorySlice";

import { useInput } from "../hooks/UtilityHooks";

import BrandAutoComplete from "../components/Utility/BrandAutoComplete";
import OrderHistoryTable from "../components/OrderHistory/OrderHistoryTable";
import Loading from "../components/Utility/Loading";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import AutoComplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

const csvHeaders = [
  { label: "Order Number", key: "orderNum" },
  { label: "Distributor", key: "distributor" },
  { label: "State", key: "state" },
  { label: "Program", key: "program" },
  { label: "Order Date", key: "orderDate" },
  { label: "Ship Date", key: "shipDate" },
  { label: "Tracking", key: "trackingNum" },
  { label: "Total Items", key: "totalItems" },
  { label: "Est. Total", key: "estTotal" },
  { label: "Act. Total", key: "actTotal" },
  { label: "Status", key: "orderStatus" },
];

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  queryRow: {
    display: "flex",
    width: "90%",
    marginLeft: "10%",
  },
  gridItemContainer: {
    display: "flex",
    alignItems: "center",
  },
  trackingLogo: {
    width: "100px",
    height: "auto",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  selectedButton: {
    fontWeight: "600",
    fontSize: "1rem",
    textAlign: "center",
    color: "#737373",
  },
  dateField: {
    marginBottom: "17px",
    marginTop: "12px",
  },
}));

const OrderHistory = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const nextLink = useSelector((state) => state.orderHistory.nextLink);
  const isNextLoading = useSelector(
    (state) => state.orderHistory.isNextLoading
  );

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      dispatch(fetchNextOrderHistory(nextLink));
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll);

  const [currentFilters, setCurrentFilters] = useState({
    fromDate: format(subDays(new Date(), 7), "MM/dd/yyyy"),
    toDate: format(new Date(), "MM/dd/yyyy"),
    distributor: null,
    brand: null,
    program: "",
    sequenceNum: "",
    sortOrder: "asc",
    sortOrderBy: "orderDate",
  });

  const handleProgram = useCallback(
    (value) => {
      setCurrentFilters({
        ...currentFilters,
        program: value,
      });
    },
    [currentFilters]
  );

  const handleSequence = useCallback(
    (value) => {
      setCurrentFilters({
        ...currentFilters,
        sequenceNum: value,
      });
    },
    [currentFilters]
  );

  const [distributor, setDistributor] = useState(null);
  const { value: sequenceNumber, bind: bindSequenceNumber } = useInput(
    "",
    handleSequence
  );
  const { value: program, bind: bindProgram } = useInput("", handleProgram);
  const [selectedFromDate, setSelectedFromDate] = useState(
    subDays(new Date(), 7).toLocaleDateString()
  );
  const [selectedToDate, setSelectedToDate] = useState(
    new Date().toLocaleDateString()
  );

  const isDistLoading = useSelector((state) => state.distributors.isLoading);
  const isOrdersLoading = useSelector((state) => state.orderHistory.isLoading);
  const currentOrders = useSelector((state) => state.orderHistory.orders);
  const currentDistributors = useSelector(
    (state) => state.distributors.distributorList
  );
  const currentUserRole = useSelector((state) => state.user.role);

  const handleFromDateChange = useCallback(
    (date) => {
      setSelectedFromDate(date);
      setCurrentFilters({
        ...currentFilters,
        fromDate: format(date, "MM/dd/yyyy"),
      });
    },
    [currentFilters]
  );

  const handleToDateChange = useCallback(
    (date) => {
      setSelectedToDate(date);
      setCurrentFilters({
        ...currentFilters,
        toDate: format(date, "MM/dd/yyyy"),
      });
    },
    [currentFilters]
  );

  const handleSetDistributor = useCallback(
    (value) => {
      setCurrentFilters({
        ...currentFilters,
        distributor: value ? value.id : null,
      });
    },
    [currentFilters]
  );

  const handleSetBrand = useCallback((value) => {
    setCurrentFilters({
      ...currentFilters,
      brand: value ? value.id : null,
    });
  }, [currentFilters]);

  const handleSearch = (sortBy = undefined) => {
    let filterObject;
    if (sortBy.order) {
      console.log(sortBy);
      filterObject = {
        ...currentFilters,
        sortOrder: sortBy.order,
        sortOrderBy: sortBy.orderBy,
      };
    } else {
      console.log(currentFilters);
      filterObject = { ...currentFilters };
    }
    console.log("searching");
    dispatch(fetchFilteredOrderHistory(filterObject));
  };

  const handleSort = (sortObject) => {
    setCurrentFilters({
      ...currentFilters,
      sortOrder: sortObject.order,
      sortOrderBy: sortObject.orderBy,
    });
    handleSearch(sortObject);
  };

  useEffect(() => {
    if (currentDistributors.length === 0 && currentUserRole.length > 0) {
      dispatch(fetchUserDistributors());
    }
  }, [currentDistributors, dispatch, currentUserRole]);

  useEffect(() => {
    if (currentOrders.length === 0 && currentUserRole.length > 0) {
      dispatch(fetchFilteredOrderHistory(currentFilters));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isDistLoading || currentDistributors.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>Order History</Typography>
          <div
            style={{
              display: "flex",
              width: "150px",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip title="Print Order History">
              <IconButton>
                <PrintIcon color="secondary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export CSV">
              <CSVLink data={currentOrders} headers={csvHeaders}>
                <IconButton>
                  <GetAppIcon color="secondary" />
                </IconButton>
              </CSVLink>
            </Tooltip>
          </div>
        </div>
        <br />
        <div className={classes.queryRow}>
          <Grid container spacing={2} justify="flex-end">
            <Grid
              item
              lg={2}
              md={3}
              sm={4}
              className={classes.gridItemContainer}
            >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  color="secondary"
                  className={classes.dateField}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="fromDate"
                  label="Order From Date"
                  value={selectedFromDate}
                  onChange={handleFromDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid
              item
              lg={2}
              md={3}
              sm={4}
              className={classes.gridItemContainer}
            >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  color="secondary"
                  className={classes.dateField}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="toDate"
                  label="Order To Date"
                  value={selectedToDate}
                  onChange={handleToDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid
              item
              lg={2}
              md={3}
              sm={4}
              className={classes.gridItemContainer}
            >
              <BrandAutoComplete classes={classes} handleChange={handleSetBrand}/>
            </Grid>
            <Grid
              item
              lg={2}
              md={3}
              sm={4}
              className={classes.gridItemContainer}
            >
              <AutoComplete
                fullWidth
                value={distributor}
                className={classes.queryField}
                onChange={(event, value) => {
                  setDistributor(value);
                  handleSetDistributor(value);
                }}
                id="distributor"
                options={currentDistributors}
                getOptionLabel={(dist) => dist.name}
                renderInput={(params) => (
                  <TextField
                    color="secondary"
                    {...params}
                    label="Distributor"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid
              item
              lg={2}
              md={3}
              sm={4}
              className={classes.gridItemContainer}
            >
              <TextField
                className={classes.queryField}
                color="secondary"
                fullWidth
                name="program"
                type="text"
                label="Program"
                value={program}
                {...bindProgram}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid
              item
              lg={2}
              md={3}
              sm={4}
              className={classes.gridItemContainer}
            >
              <TextField
                className={classes.queryField}
                color="secondary"
                fullWidth
                name="sequenceNumber"
                type="text"
                label="Sequence #"
                value={sequenceNumber}
                {...bindSequenceNumber}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid
              item
              lg={2}
              md={3}
              sm={4}
              className={classes.gridItemContainer}
            >
              <Button
                fullWidth
                className={classes.largeButton}
                variant="contained"
                color="secondary"
                onClick={handleSearch}
              >
                SEARCH
              </Button>
            </Grid>
          </Grid>
        </div>
        <br />
        <br />
        <OrderHistoryTable
          orders={currentOrders}
          isOrdersLoading={isOrdersLoading}
          handleSort={handleSort}
          scrollRef={scrollRef}
        />
        {isNextLoading && (
          <div style={{ width: "100%" }}>
            <LinearProgress />
          </div>
        )}
      </Container>
      <br />
    </>
  );
};

export default OrderHistory;
