import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import PropTypes from "prop-types";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import { formatDate, formatMoney } from "../utility/utilityFunctions";
import Helmet from "react-helmet";

import { useSelector, useDispatch } from "react-redux";

import { getOrderItemReport, clearReports } from "../redux/slices/reportSlice";
import { updateSingleFilter, resetFilters } from "../redux/slices/filterSlice";

import UserAutoComplete from "../components/Utility/UserAutoComplete";
import UserSuperAutoComplete from "../components/Utility/UserSuperAutoComplete";
import WrapUpTable from "../components/Reporting/WrapUpTable";

import Container from "@material-ui/core/Container";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  ...theme.reports,
}));

const ReportWrapUp = ({ handleFiltersClosed }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const orderTypeMap = {
    "on-demand": "On Demand",
    "in-stock": "In Stock",
    "pre-order": "Pre Order",
  };

  const [currentCSV, setCurrentCSV] = useState({ data: [], headers: [] });
  const [hasGenerated, setHasGenerated] = useState(false);
  const [reset, setReset] = useState(false);
  const [fromDate, setFromDate] = useState(
    format(formatDate(subDays(new Date(), 7)), "MM/dd/yyyy")
  );
  const [toDate, setToDate] = useState(
    format(formatDate(new Date()), "MM/dd/yyyy")
  );
  const [currentUsers, setCurrentUsers] = useState([]);

  const currentUserRole = useSelector((state) => state.user.role);
  const currentUserFilter = useSelector((state) => state.filters.user);
  const isLoading = useSelector((state) => state.reports.isLoading);
  const report = useSelector((state) => state.reports.reportData);

  const handleUser = (value, _type, _filter) => {
    setCurrentUsers(value);
    dispatch(updateSingleFilter({ filter: "user", value: value }));
  };

  const handleChipClick = (id) => {
    let currentUserArray = currentUserFilter.filter((user) => user.id !== id);
    setCurrentUsers(currentUserArray);
    dispatch(updateSingleFilter({ filter: "user", value: currentUserArray }));
  }

  const handleReset = () => {
    setFromDate(format(formatDate(subDays(new Date(), 7)), "MM/dd/yyyy"));
    setToDate(format(formatDate(new Date()), "MM/dd/yyyy"));
    setReset(true);
    setCurrentUsers([]);
    dispatch(clearReports());
    dispatch(resetFilters());
    setCurrentCSV({ data: [], headers: [] });
  };

  const handleGetReport = () => {
    const filterObject = {
      fromDate: fromDate,
      toDate: toDate,
      user: currentUsers,
      status: "approved",
    };
    dispatch(getOrderItemReport(filterObject));
    setHasGenerated(true);
  };

  useEffect(() => {
    if (
      (hasGenerated && !isLoading && report.length > 0) ||
      (report.length > 0 && currentCSV.data.length === 0)
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
      ];
      let csvData = [];
      report.forEach((item) => {
        let dataObject = {
          user: item.user,
          state: item.state,
          brandCode: item.brandCode,
          unit: item.unit,
          itemType: item.itemType,
          inMarketDate: item.inMarketDate,
          totalEstCost: formatMoney(item.totalEstCost),
          totalItems: item.totalItems,
          itemNumber: item.itemNumber,
          program: item.program,
          orderType: orderTypeMap[item.orderType],
        };
        csvData.push(dataObject);
      });
      setCurrentCSV({ data: csvData, headers: csvHeaders });
      setHasGenerated(false);
    }
  }, [
    report,
    hasGenerated,
    isLoading,
    currentCSV.data,
    orderTypeMap,
  ]);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(clearReports())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Helmet>
        <title> Report Wrap-Up</title>
        {currentUserRole === "super" && (
          <script type="text/javascript">{` Beacon('suggest', ['600ed398cfe30d219ccdb224'])`}</script>
        )}
        {currentUserRole === "read-only" && (
          <script type="text/javascript">{` Beacon('suggest', ['600ed315c64fe14d0e1fe351'])`}</script>
        )}
      </Helmet>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>Wrap Up Report</Typography>
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
                  disabled={currentCSV.data.length === 0}
                >
                  EXPORT TO CSV
                </Button>
              </CSVLink>
            </div>
          </div>
        </div>
        <br />
        <div className={classes.searchComponents}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              fullWidth
              style={{ marginTop: 0 }}
              color="secondary"
              className={classes.queryField}
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="reportFromDate"
              label="Order From Date"
              value={fromDate}
              onChange={(value) =>
                setFromDate(format(formatDate(value), "MM/dd/yyyy"))
              }
            />
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              fullWidth
              style={{ marginTop: 0 }}
              color="secondary"
              className={classes.queryField}
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="reportToDate"
              label="Order To Date"
              value={toDate}
              onChange={(value) =>
                setToDate(format(formatDate(value), "MM/dd/yyyy"))
              }
            />
          </MuiPickersUtilsProvider>
          {currentUserRole !== "field1" ? (
            currentUserRole === "super" ? (
              <UserSuperAutoComplete
                classes={classes}
                handleChange={handleUser}
                reset={reset}
                setReset={setReset}
                filterType="report"
                id="report-user-complete"
              />
            ) : (
                <UserAutoComplete
                  classes={classes}
                  handleChange={handleUser}
                  reset={reset}
                  setReset={setReset}
                  filterType="report"
                  id="report-user-complete"
                />
              )
          ) : null}
        </div>
        <br />
        <div className={classes.chipRow}>
          {currentUsers.length > 0 &&
            currentUsers.map((user) => (
              <Chip
                style={{ margin: "auto 2.5px" }}
                color="primary"
                key={user.id}
                label={user.name}
                onDelete={() => handleChipClick(user.id)}
              />
            ))}
        </div>
        <br />
        <div className={classes.buttonRow}>
          <Button
            className={classes.largeButton}
            variant="contained"
            color="secondary"
            onClick={handleGetReport}
            style={{ marginRight: "20px" }}
          >
            GENERATE REPORT
          </Button>
          <Button
            className={classes.largeButton}
            variant="contained"
            color="secondary"
            onClick={handleReset}
          >
            CLEAR FILTERS
          </Button>
        </div>
        <br />
        <br />
        {isLoading && (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <CircularProgress size={100} style={{ marginTop: "50px" }} />
          </div>
        )}
        {!isLoading && report.length > 0 && (
          <WrapUpTable
            report={report}
            orderTypeMap={orderTypeMap}
          />
        )}
      </Container>
    </>
  );
};

ReportWrapUp.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default ReportWrapUp;
