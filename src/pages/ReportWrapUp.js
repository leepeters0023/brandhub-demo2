import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import PropTypes from "prop-types";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import { formatDate, formatMoney } from "../utility/utilityFunctions";
import Helmet from "react-helmet";

import { useSelector, useDispatch } from "react-redux";

import { getWrapUp, clearReports } from "../redux/slices/reportSlice";
import { updateSingleFilter, resetFilters } from "../redux/slices/filterSlice";

import UserAutoComplete from "../components/Utility/UserAutoComplete";
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
  searchComponents: {
    width: "60%",
    minWidth: "600px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    margin: "0 auto",
  },
  queryField: {
    width: "32%",
    maxWidth: "250px",
  },
  buttonRow: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  chipRow: {
    height: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
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

  const currentSuppliers = useSelector((state) => state.suppliers.supplierList);
  const currentUserRole = useSelector((state) => state.user.role);
  const isLoading = useSelector((state) => state.reports.isLoading);
  const report = useSelector((state) => state.reports.reportData);

  const handleUser = (value, _type, _filter) => {
    setCurrentUsers(value);
    dispatch(updateSingleFilter({ filter: "user", value: value }));
  };

  const handleReset = () => {
    setFromDate(format(formatDate(subDays(new Date(), 7)), "MM/dd/yyyy"));
    setToDate(format(formatDate(new Date()), "MM/dd/yyyy"));
    setReset(true);
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
    dispatch(getWrapUp(filterObject));
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
      report.forEach((item) => {
        let supName = currentSuppliers.find((sup) => sup.id === item.supplierId)
          .name;
        let dataObject = {
          user: item.user,
          state: item.state,
          brandCode: item.brandCode,
          unit: item.unit,
          inMarketDate: /*TODO*/ "---",
          tactic: /*TODO*/ "---",
          supplier: supName,
          totalEstCost: formatMoney(item.totalEstCost),
          totalItems: item.totalItems,
          holdType: /*TODO*/ "---",
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
    currentSuppliers,
    hasGenerated,
    isLoading,
    currentCSV.data,
    orderTypeMap,
  ]);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <>
      <Helmet><title>RTA | Report Wrap-Up</title>
      <script type="text/javascript">{`Beacon('close')`}</script>
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
          {currentUserRole !== "field1" && (
            <UserAutoComplete
              classes={classes}
              handleChange={handleUser}
              reset={reset}
              setReset={setReset}
              filterType="report"
              id="report-user-complete"
            />
          )}
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
            RESET
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
        {!isLoading && report.length > 0 && currentSuppliers.length > 0 && (
          <WrapUpTable
            report={report}
            orderTypeMap={orderTypeMap}
            currentSuppliers={currentSuppliers}
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
