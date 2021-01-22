import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useSelector, useDispatch } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

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
  status: "new",
  rfqNum: "",
  itemNumber: "",
  sortOrder: "asc",
  sortOrderBy: "rfqNum",
};

const defaultSupplierInProgressFilters = {
  brand: [],
  program: [],
  itemType: [],
  status: "in-progress",
  rfqNum: "",
  itemNumber: "",
  sortOrder: "asc",
  sortOrderBy: "rfqNum",
};

const defaultSupplierAwardedFilters = {
  brand: [],
  program: [],
  itemType: [],
  status: "awarded",
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

  const [currentView, setCurrentView] = useState(filterOption);

  const currentUserRole = useSelector((state) => state.user.role);
  const supplierId = useSelector((state) => state.user.supplierId)
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const isRFQsLoading = useSelector((state) => state.rfqHistory.isLoading);
  const currentRFQs = useSelector((state) => state.rfqHistory.rfqs);
  const defaultFilters = filterOptionMap[filterOption];
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

  return (
    <>
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
          <FilterChipList classes={classes} />
        </div>
        <br />
        <RFQHistoryTable
          rfqs={currentRFQs}
          rfqsLoading={isRFQsLoading}
          handleSort={handleSort}
          scrollRef={scrollRef}
          supplierId={supplierId}
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
