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

import { clearBrands } from "../redux/slices/brandSlice";

import { formatMoney } from "../utility/utilityFunctions";

import { useDetailedInput } from "../hooks/UtilityHooks";

import RollupOverviewTable from "../components/OrderManagement/RollupOverviewTable";
import BrandAutoComplete from "../components/Utility/BrandAutoComplete";
import UserAutoComplete from "../components/Utility/UserAutoComplete";
import StatusSelector from "../components/Utility/StatusSelector";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import FormControl from "@material-ui/core/FormControl";
import InputBase from "@material-ui/core/InputBase";
import InputLabel from "@material-ui/core/InputLabel";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
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

const Rollup = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [status, setStatus] = useCallback(useState("submitted"));
  const [reset, setReset] = useCallback(useState(false));
  const [currentFilters, setCurrentFilters] = useState({
    fromDate: format(subDays(new Date(), 7), "MM/dd/yyyy"),
    toDate: format(new Date(), "MM/dd/yyyy"),
    type: "pre-order",
    user: null,
    program: "",
    brand: null,
    sequenceNum: "",
    status: "submitted",
    sortOrder: "asc",
    sortOrderBy: "user",
  });

  const handleFilters = useCallback(
    (value, type) => {
      if (type === "program" || type === "sequenceNum" || type === "status") {
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
    value: program,
    bind: bindProgram,
    reset: resetProgram,
  } = useDetailedInput("", handleFilters, "program");
  const {
    value: sequenceNum,
    bind: bindSequenceNum,
    reset: resetSequenceNum,
  } = useDetailedInput("", handleFilters, "sequenceNum");

  const currentPreOrders = useSelector(
    (state) => state.orderSetHistory.orderSets
  );
  const orderCount = useSelector((state) => state.orderSetHistory.orderCount);
  const queryTotal = useSelector((state) => state.orderSetHistory.queryTotal);
  const isPreOrdersLoading = useSelector(
    (state) => state.orderSetHistory.isLoading
  );
  const nextLink = useSelector((state) => state.orderSetHistory.nextLink);
  const isNextPreOrdersLoading = useSelector(
    (state) => state.orderSetHistory.isNextLoading
  );
  const currentUserRoll = useSelector((state) => state.user.role);

  const handleBottomScroll = () => {
    if (nextLink && !isNextPreOrdersLoading) {
      dispatch(fetchNextFilteredOrderSets(nextLink));
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll);

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
    resetSequenceNum();
    setReset(true);
    setStatus("submitted");
    dispatch(clearBrands());
    setCurrentFilters({
      fromDate: format(subDays(new Date(), 7), "MM/dd/yyyy"),
      toDate: format(new Date(), "MM/dd/yyyy"),
      type: "pre-order",
      user: null,
      program: "",
      brand: null,
      sequenceNum: "",
      status: "submitted",
      sortOrder: "asc",
      sortOrderBy: "user",
    });
    dispatch(
      fetchFilteredOrderSets({
        fromDate: format(subDays(new Date(), 7), "MM/dd/yyyy"),
        toDate: format(new Date(), "MM/dd/yyyy"),
        type: "pre-order",
        user: null,
        program: "",
        brand: null,
        sequenceNum: "",
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

  useEffect(() => {
    if (currentPreOrders.length === 0 && currentUserRoll.length > 0) {
      dispatch(fetchFilteredOrderSets(currentFilters));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>
            Quarterly Rollup
          </Typography>
          <div
            style={{
              display: "flex",
              width: "150px",
              justifyContent: "flex-end",
            }}
          >
            {queryTotal && (
              <FormControl style={{ pointerEvents: "none", minWidth: "100px", marginRight:"30px" }}>
                <InputLabel
                  htmlFor="program-total"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Pre-Order Count / Total
                </InputLabel>
                <InputBase
                  className={classes.titleText}
                  id="program-total"
                  value={`${orderCount} / ${formatMoney(queryTotal)}`}
                  inputProps={{
                    "aria-label": "naked",
                    "data-lpignore": "true",
                  }}
                  style={{
                    marginTop: "10px",
                    marginBottom: "0px",
                    width: `Calc(${
                      queryTotal && orderCount
                        ? queryTotal.toString().length +
                          orderCount.toString().length
                        : 0
                    }*15px + 50px)`,
                    minWidth: "100px",
                    readonly: "readonly",
                    pointerEvents: "none",
                  }}
                />
              </FormControl>
            )}
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
                  disabled={currentFilters.status !== "submitted"}
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
                  disabled={currentFilters.status !== "submitted"}
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
              <TextField
                color="secondary"
                fullWidth
                name="program"
                type="text"
                label="Program"
                variant="outlined"
                size="small"
                value={program}
                {...bindProgram}
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
              <TextField
                color="secondary"
                fullWidth
                name="sequenceNum"
                type="text"
                label="Sequence #"
                variant="outlined"
                size="small"
                value={sequenceNum}
                {...bindSequenceNum}
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
              <StatusSelector
                handleStatus={handleFilters}
                status={status}
                setStatus={setStatus}
                classes={classes}
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
          </Grid>
        </div>
        <br />
        <br />
        <RollupOverviewTable
          rollupData={currentPreOrders}
          handleSort={handleSort}
          isRollupLoading={isPreOrdersLoading}
          scrollRef={scrollRef}
        />
        {isNextPreOrdersLoading && (
          <div style={{ width: "100%" }}>
            <LinearProgress />
          </div>
        )}
      </Container>
    </>
  );
};

export default Rollup;
