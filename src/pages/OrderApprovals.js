import React, { useEffect, useState, useCallback } from "react";
import "date-fns";
import subDays from "date-fns/subDays";
import format from "date-fns/format";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

import { useSelector, useDispatch } from "react-redux";

import {
  fetchFilteredOrderSets,
  fetchNextFilteredOrderSets,
} from "../redux/slices/orderSetHistorySlice";

import {
  approveOrdSet,
  approveMultipleOrderSets,
} from "../redux/slices/patchOrderSlice";

import { clearBrands } from "../redux/slices/brandSlice";

import { useDetailedInput } from "../hooks/UtilityHooks";

import BrandAutoComplete from "../components/Utility/BrandAutoComplete";
import DistributorAutoComplete from "../components/Utility/DistributorAutoComplete";
import UserAutoComplete from "../components/Utility/UserAutoComplete";
import OrderApprovalTable from "../components/OrderManagement/OrderApprovalTable";
import OrderPatchLoading from "../components/Utility/OrderPatchLoading";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  queryRow: {
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      paddingLeft: "0%",
      display: "flex",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      paddingLeft: "0%",
      display: "flex",
    },
    [theme.breakpoints.up("md")]: {
      width: "100%",
      paddingLeft: "10%",
      display: "flex",
    },
    [theme.breakpoints.up("lg")]: {
      width: "100%",
      paddingLeft: "10%",
      display: "flex",
    },
  },
  gridItemContainer: {
    display: "flex",
    alignItems: "center",
  },
}));
//TODO figure out order denial process / notifications
const OrderApprovals = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const nextLink = useSelector((state) => state.orderHistory.nextLink);
  const isNextLoading = useSelector(
    (state) => state.orderHistory.isNextLoading
  );

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      dispatch(fetchNextFilteredOrderSets(nextLink));
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll);

  const [reset, setReset] = useCallback(useState(false));

  const [currentFilters, setCurrentFilters] = useState({
    fromDate: format(subDays(new Date(), 7), "MM/dd/yyyy"),
    toDate: format(new Date(), "MM/dd/yyyy"),
    user: null,
    distributor: null,
    program: "",
    brand: null,
    sequenceNum: "",
    type: "not-pre-order",
    status: "submitted",
    sortOrder: "asc",
    sortOrderBy: "user",
  });

  const handleFilters = useCallback(
    (value, type) => {
      if (type === "program" || type === "sequenceNum") {
        setCurrentFilters({
          ...currentFilters,
          [`${type}`]: value,
        });
      } else if (type === "fromDate" || type === "toDate") {
        setCurrentFilters({
          ...currentFilters,
          [`${type}`]: format(value, "MM/dd/yyyy"),
        });
      } else if (
        type === "distributor" ||
        type === "brand" ||
        type === "user"
      ) {
        setCurrentFilters({
          ...currentFilters,
          [`${type}`]: value ? value.id : null,
        });
      }
    },
    [currentFilters]
  );

  const {
    value: sequenceNumber,
    bind: bindSequenceNumber,
    reset: resetSequenceNumber,
  } = useDetailedInput("", handleFilters, "sequenceNum");
  const {
    value: program,
    bind: bindProgram,
    reset: resetProgram,
  } = useDetailedInput("", handleFilters, "program");

  const isOrdersLoading = useSelector(
    (state) => state.orderSetHistory.isLoading
  );
  const currentOrders = useSelector((state) => state.orderSetHistory.orderSets);
  const currentUserRole = useSelector((state) => state.user.role);

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
      filterObject = { ...currentFilters };
    }
    dispatch(fetchFilteredOrderSets(filterObject));
  };

  const handleClearFilters = () => {
    resetProgram();
    resetSequenceNumber();
    setReset(true);
    dispatch(clearBrands());
    setCurrentFilters({
      fromDate: format(subDays(new Date(), 7), "MM/dd/yyyy"),
      toDate: format(new Date(), "MM/dd/yyyy"),
      user: null,
      distributor: null,
      program: "",
      brand: null,
      sequenceNum: "",
      type: "not-pre-order",
      status: "submitted",
      sortOrder: "asc",
      sortOrderBy: "user",
    });
    dispatch(
      fetchFilteredOrderSets({
        fromDate: format(subDays(new Date(), 7), "MM/dd/yyyy"),
        toDate: format(new Date(), "MM/dd/yyyy"),
        user: null,
        distributor: null,
        program: "",
        brand: null,
        sequenceNum: "",
        type: "not-pre-order",
        status: "submitted",
        sortOrder: "asc",
        sortOrderBy: "user",
      })
    );
  };

  const handleSort = (sortObject) => {
    setCurrentFilters({
      ...currentFilters,
      sortOrder: sortObject.order,
      sortOrderBy: sortObject.orderBy,
    });
    handleSearch(sortObject);
  };

  const handleApproval = (id) => {
    dispatch(approveOrdSet(id, "approved", currentFilters))
  };

  const handleBulkApproval = () => {
    let idArray = currentOrders.map((order) => order.id)
    dispatch(approveMultipleOrderSets(idArray, currentFilters))
  };

  useEffect(() => {
    if (currentUserRole.length > 0) {
      dispatch(fetchFilteredOrderSets(currentFilters));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>Order Approvals</Typography>
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
              {/* <CSVLink data={currentOrders} headers={csvHeaders}> */}
              <IconButton>
                <GetAppIcon color="secondary" />
              </IconButton>
              {/* </CSVLink> */}
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
              xs={4}
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
                  value={currentFilters.fromDate}
                  onChange={(value) => handleFilters(value, "fromDate")}
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
              xs={4}
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
                  value={currentFilters.toDate}
                  onChange={(value) => handleFilters(value, "toDate")}
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
              xs={4}
              className={classes.gridItemContainer}
            >
              <UserAutoComplete
                classes={classes}
                handleChange={handleFilters}
                reset={reset}
                setReset={setReset}
              />
            </Grid>
            <Grid
              item
              lg={2}
              md={3}
              sm={4}
              xs={4}
              className={classes.gridItemContainer}
            >
              <BrandAutoComplete
                classes={classes}
                handleChange={handleFilters}
                reset={reset}
                setReset={setReset}
              />
            </Grid>
            <Grid
              item
              lg={2}
              md={3}
              sm={4}
              xs={4}
              className={classes.gridItemContainer}
            >
              <DistributorAutoComplete
                classes={classes}
                handleChange={handleFilters}
                reset={reset}
                setReset={setReset}
              />
            </Grid>
            <Grid
              item
              lg={2}
              md={3}
              sm={4}
              xs={4}
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
              xs={4}
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
              xs={4}
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
            <Grid
              item
              lg={2}
              md={3}
              sm={4}
              xs={4}
              className={classes.gridItemContainer}
            >
              <Button
                fullWidth
                className={classes.largeButton}
                variant="contained"
                color="secondary"
                onClick={handleClearFilters}
              >
                CLEAR FILTERS
              </Button>
            </Grid>
            <Grid
              item
              lg={2}
              md={3}
              sm={4}
              xs={4}
              className={classes.gridItemContainer}
            >
              <Button
                fullWidth
                className={classes.largeButton}
                variant="contained"
                color="secondary"
                onClick={handleBulkApproval}
              >
                APPROVE ALL
              </Button>
            </Grid>
          </Grid>
        </div>
        <br />
        <br />
        <OrderApprovalTable
          orders={currentOrders}
          isOrdersLoading={isOrdersLoading}
          handleSort={handleSort}
          scrollRef={scrollRef}
          handleApproval={handleApproval}
        />
        {isNextLoading && (
          <div style={{ width: "100%" }}>
            <LinearProgress />
          </div>
        )}
        <OrderPatchLoading />
      </Container>
      <br />
    </>
  );
};

export default OrderApprovals;
