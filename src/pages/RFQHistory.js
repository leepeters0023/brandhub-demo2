import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";
import { navigate } from "@reach/router";
import { formatMoney } from "../utility/utilityFunctions";
import Helmet from "react-helmet";

import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useSelector, useDispatch } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";
import { useReactToPrint } from "react-to-print";

import { updateMultipleFilters, setSorted } from "../redux/slices/filterSlice";

import { fetchNextFilteredRFQHistory } from "../redux/slices/rfqHistorySlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import RFQHistoryTable from "../components/SupplierManagement/RFQHistoryTable";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import TuneIcon from "@material-ui/icons/Tune";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

const defaultCurrentFilters = {
  brand: [],
  program: [],
  itemType: [],
  status: "not-awarded",
  rfqNum: "",
  itemNumber: "",
  sortOrder: "asc",
  sortOrderBy: "rfqNum",
};

const defaultSupplierNewFilters = {
  brand: [],
  program: [],
  itemType: [],
  status: "bid-sent",
  rfqNum: "",
  itemNumber: "",
  sortOrder: "asc",
  sortOrderBy: "rfqNum",
};

const defaultSupplierInProgressFilters = {
  brand: [],
  program: [],
  itemType: [],
  status: "bid-accepted",
  rfqNum: "",
  itemNumber: "",
  sortOrder: "asc",
  sortOrderBy: "rfqNum",
};

const defaultSupplierAwardedFilters = {
  brand: [],
  program: [],
  itemType: [],
  status: "bid-awarded",
  rfqNum: "",
  itemNumber: "",
  sortOrder: "asc",
  sortOrderBy: "rfqNum",
};

const defaultHistoryFilters = {
  brand: [],
  program: [],
  itemType: [],
  status: "all",
  rfqNum: "",
  itemNumber: "",
  sortOrder: "asc",
  sortOrderBy: "rfqNum",
};

const filterOptionMap = {
  current: defaultCurrentFilters,
  new: defaultSupplierNewFilters,
  inProgress: defaultSupplierInProgressFilters,
  awarded: defaultSupplierAwardedFilters,
  all: defaultHistoryFilters,
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const RFQHistory = ({ handleFilterDrawer, filtersOpen, filterOption }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const tableRef = useRef(null);

  const [currentCSV, setCurrentCSV] = useState({ data: [], headers: [] });
  const [currentView, setCurrentView] = useState(filterOption);

  const nextLink = useSelector((state) => state.rfqHistory.nextLink);
  const isNextLoading = useSelector((state) => state.rfqHistory.isNextLoading);

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      if (scrollRef.current.scrollTop !== 0) {
        dispatch(fetchNextFilteredRFQHistory(nextLink));
      }
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll);

  const currentUserRole = useSelector((state) => state.user.role);
  const supplierId = useSelector((state) => state.user.supplierId);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const isRFQsLoading = useSelector((state) => state.rfqHistory.isLoading);
  const currentRFQs = useSelector((state) => state.rfqHistory.rfqs);
  const error = useSelector((state) => state.rfqHistory.error);

  const defaultFilters = filterOptionMap[filterOption];

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  const handleStatus = useCallback(
    (status, bids) => {
      if (currentUserRole === "supplier" && status === "sent") {
        let currentBid = bids.find((bid) => bid.supplierId === supplierId);
        if (currentBid.status === "sent") {
          return "New";
        } else if (currentBid.status === "accepted") {
          return "In Progress";
        } else if (currentBid.status === "declined") {
          return "Declined";
        }
      }
      if (status === "sent") {
        let bidCount = 0;
        bids.forEach((bid) => {
          if (bid.status === "accepted" || bid.status === "declined") {
            bidCount += 1;
          }
        });
        if (bidCount !== bids.length) {
          return `Waiting for Resp. ${bidCount}/${bids.length}`;
        } else {
          return "Ready for Review";
        }
      } else {
        return status[0].toUpperCase() + status.slice(1);
      }
    },
    [currentUserRole, supplierId]
  );

  const handleSort = (sortObject) => {
    scrollRef.current.scrollTop = 0;
    dispatch(
      updateMultipleFilters({
        filterObject: {
          sortOrder: sortObject.order,
          sortOrderBy: sortObject.orderBy,
        },
      })
    );
    dispatch(setSorted());
  };

  useEffect(() => {
    if (
      (currentRFQs.length > 0 && currentCSV.data.length === 0) ||
      (currentRFQs.length > 0 &&
        currentCSV.data.length > 0 &&
        currentRFQs.length !== currentCSV.data.length) ||
      (currentRFQs.length > 0 &&
        currentCSV.data.length > 0 &&
        currentRFQs[0].itemNumber !== currentCSV.data[0].itemNumber)
    ) {
      let csvHeaders = [
        { label: "RFQ #", key: "rfqNum" },
        { label: "Sequence #", key: "itemNumber" },
        { label: "Program", key: "program" },
        { label: "Brand", key: "brand" },
        { label: "Item Type", key: "itemType" },
        { label: "Item Description", key: "itemDesc" },
        { label: "Total Ordered", key: "totalItems" },
        { label: "Est. Cost", key: "estCost" },
        { label: "Est. Total", key: "totalEstCost" },
        { label: "Act. Total", key: "totalActCost" },
        { label: "Due Date", key: "dueDate" },
        { label: "In Market Date", key: "inMarketDate" },
        { label: "Status", key: "status" },
      ];

      let csvSupplierHeaders = [
        { label: "RFQ #", key: "rfqNum" },
        { label: "Sequence #", key: "itemNumber" },
        { label: "Item Type", key: "itemType" },
        { label: "Item Description", key: "itemDesc" },
        { label: "Total Ordered", key: "totalItems" },
        { label: "Due Date", key: "dueDate" },
        { label: "In Market Date", key: "inMarketDate" },
        { label: "Status", key: "status" },
        { label: "Bid", key: "bidValue" },
      ];

      let csvData = [];
      currentRFQs.forEach((rfq) => {
        if (currentUserRole !== "supplier") {
          csvData.push({
            rfqNum: rfq.id,
            itemNumber: rfq.itemNumber,
            program: rfq.program,
            brand: rfq.brand,
            itemType: rfq.itemType,
            itemDesc: rfq.itemDescription,
            totalItems: rfq.totalItems,
            estCost: formatMoney(rfq.estCost, true),
            totalEstCost: formatMoney(rfq.totalEstCost, true),
            totalActCost: rfq.totalActCost
              ? formatMoney(rfq.totalActCost, true)
              : "---",
            dueDate: rfq.dueDate,
            inMarketDate: rfq.inMarketDate,
            status: handleStatus(rfq.status, rfq.bids),
          });
        } else {
          csvData.push({
            rfqNum: rfq.id,
            itemNumber: rfq.itemNumber,
            itemType: rfq.itemType,
            itemDesc: rfq.itemDescription,
            totalItems: rfq.totalItems,
            dueDate: rfq.dueDate,
            inMarketDate: rfq.inMarketDate,
            status: handleStatus(rfq.status, rfq.bids),
            bidValue: rfq.bids.find((bid) => bid.supplierId === supplierId)
              .price
              ? formatMoney(
                  rfq.bids.find((bid) => bid.supplierId === supplierId).price,
                  true
                )
              : "---",
          });
        }
      });
      setCurrentCSV({
        data: csvData,
        headers:
          currentUserRole !== "supplier" ? csvHeaders : csvSupplierHeaders,
      });
    }
  }, [currentRFQs, currentCSV, currentUserRole, handleStatus, supplierId]);

  useInitialFilters(
    "history-rfq",
    defaultFilters,
    retainFilters,
    dispatch,
    handleFilterDrawer,
    currentUserRole
  );

  useEffect(() => {
    if (currentView !== filterOption) {
      setCurrentView(filterOption);
      dispatch(
        updateMultipleFilters({ filterObject: filterOptionMap[filterOption] })
      );
      dispatch(setSorted());
    }
  }, [currentView, setCurrentView, filterOption, dispatch]);

  useEffect(() => {
    if (error) {
      navigate("/whoops");
    }
  }, [error]);

  return (
    <>
      <Helmet><title>RTA | RFQ History</title></Helmet>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>RFQ History</Typography>
          <div
            style={{
              display: "flex",
              width: "250px",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip title="Print RFQs">
              <IconButton onClick={handlePrint}>
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            marginBottom: "10px",
          }}
        >
          <div
            className={classes.showHideFilters}
            onClick={() => {
              handleFilterDrawer(!filtersOpen);
            }}
          >
            <TuneIcon fontSize="small" color="secondary" />
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ margin: "10px 10px" }}
            >
              {filtersOpen ? "Hide Filters" : "Show Filters"}
            </Typography>
          </div>
          <FilterChipList classes={classes} />
          <br />
        </div>
        <RFQHistoryTable
          rfqs={currentRFQs}
          rfqsLoading={isRFQsLoading}
          handleSort={handleSort}
          scrollRef={scrollRef}
          supplierId={supplierId}
          tableRef={tableRef}
        />
        {isNextLoading && (
          <div style={{ width: "100%" }}>
            <LinearProgress />
          </div>
        )}
        {!isNextLoading && <div style={{ width: "100%", height: "4px" }}></div>}
      </Container>
      <br />
    </>
  );
};

RFQHistory.propTypes = {
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default RFQHistory;
