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
import OrderHistoryDetailTable from "../components/Reporting/OrderHistoryDetailTable";

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

const ReportOrderHistoryDetail = ({ handleFiltersClosed }) => {
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
      status: "not-draft"
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
        { label: "Seq #", key: "itemNumber" },
        { label: "Cart Type", key: "territoryType" },
        { label: "Territory", key: "territoryName" },
        { label: "Order Type", key: "orderType" },
        { label: "Program", key: "program" },
        { label: "BU", key: "unit" },
        { label: "Brand", key: "brandCode" },
        { label: "Item Type Code", key: "itemTypeCode" },
        { label: "Item Type", key: "itemType" },
        { label: "Item Desc.", key: "itemDescription" },
        { label: "Vendor", key: "supplier" },
        { label: "Address 1", key: "addressOne" },
        { label: "Address 2", key: "addressTwo" },
        { label: "City", key: "city" },
        { label: "State", key: "state" },
        { label: "Zip", key: "zip" },
        { label: "Distributor Name", key: "distributorName" },
        { label: "ABN", key: "abn" },
        { label: "Tactic", key: "tactic" },
        { label: "Qty Ordered", key: "totalItems" },
        { label: "Est. Cost", key: "estCost" },
        { label: "Total Est. Cost", key: "totalEstCost" },
        { label: "Act. Cost", key: "actCost" },
        { label: "Total Act. Cost", key: "totalActCost" },
        { label: "Ordered By", key: "user" },
        { label: "Compliance Status", key: "complianceStatus" },
        { label: "In Market Date", key: "inMarketDate" },
        { label: "Order Date", key: "orderDate" },
        { label: "Order Number", key: "orderNumber" },
        { label: "Shipped Date", key: "shippedDate" },
        { label: "Order Status", key: "status" },
      ];
      let csvData = [];
      report.forEach((item) => {
        let dataObject = {
          itemNumber: item.itemNumber,
          territoryType: item.territoryType,
          territoryName: item.territoryName,
          orderType: orderTypeMap[item.orderType],
          program: item.program,
          unit: item.unit,
          brandCode: item.brandCode,
          itemTypeCode: item.itemTypeCode,
          itemType: item.itemType,
          itemDescription: item.itemDescription,
          supplier: currentSuppliers.find((sup) => sup.id === item.supplierId)
            .name,
          addressOne: item.addressOne,
          addressTwo: item.addressTwo,
          city: item.city,
          state: item.state,
          zip: item.zip,
          distributorName: item.distributor,
          abn: item.distributorAbn,
          tactic: item.isCoupon ? "Coupon" : "POS",
          totalItems: item.totalItems,
          estCost: formatMoney(item.estCost),
          totalEstCost: formatMoney(item.totalEstCost),
          actCost: item.actCost !== "---" ? formatMoney(item.actCost) : "---",
          totalActCost:
            item.totalActCost !== "---"
              ? formatMoney(item.totalActCost)
              : "---",
          user: item.user,
          complianceStatus:
            !item.triggeredRules &&
            !item.triggeredPriorApprovalRules &&
            !item.isComplianceCanceled
              ? "Ok"
              : item.isComplianceCanceled
              ? "Compliance Canceled"
              : item.triggeredRules.length > 0 ||
                item.triggeredPriorApprovalRules.length > 0
              ? "On Hold"
              : "Ok",
          inMarketDate: item.inMarketDate,
          orderDate: item.orderDate,
          orderNumber: item.orderNumber,
          shippedDate: item.shipDate,
          status: item.status,
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

  useEffect(() => {
    dispatch(clearReports())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Helmet>
        <title>RTA | Order History Detail</title>
        {currentUserRole === "super" && (
          <script type="text/javascript">{` Beacon('suggest', ['600ed398cfe30d219ccdb224'])`}</script>
        )}
        {currentUserRole === "read-only" && (
          <script type="text/javascript">{` Beacon('suggest', ['600ed315c64fe14d0e1fe351'])`}</script>
        )}
      </Helmet>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>Order History Detail Report</Typography>
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
          <OrderHistoryDetailTable
            report={report}
            orderTypeMap={orderTypeMap}
            currentSuppliers={currentSuppliers}
          />
        )}
      </Container>
    </>
  );
};

ReportOrderHistoryDetail.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default ReportOrderHistoryDetail;
