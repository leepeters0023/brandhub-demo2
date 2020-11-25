import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useInitialFilters } from "../hooks/UtilityHooks";

import {
  updateMultipleFilters,
  setSorted,
} from "../redux/slices/filterSlice";
import { fetchNextFilteredPOHistory } from "../redux/slices/purchaseOrderHistorySlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import PurchaseOrderHistoryTable from "../components/SupplierManagement/PurchaseOrderHistoryTable";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

const defaultCurrentFilters = {
  supplier: [],
  brand: [],
  program: [],
  itemType: [],
  status: "submitted",
  poNum: "",
  sequenceNum: "",
  sortOrder: "asc",
  sortOrderBy: "poNum",
}

const defaultHistoryFilters = {
  supplier: [],
  brand: [],
  program: [],
  itemType: [],
  status: "all",
  poNum: "",
  sequenceNum: "",
  sortOrder: "asc",
  sortOrderBy: "poNum",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PurchaseOrderHistory = ({ handleFilterDrawer, filtersOpen, filterOption }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const nextLink = useSelector((state) => state.rfqHistory.nextLink);
  const isNextLoading = useSelector(
    (state) => state.rfqHistory.isNextLoading
  );

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      if (scrollRef.current.scrollTop !== 0) {
        dispatch(fetchNextFilteredPOHistory(nextLink));
      }
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll);

  const [currentView, setCurrentView] = useState(filterOption);

  const currentUserRole = useSelector((state) => state.user.role);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const isPOsLoading = useSelector((state) => state.purchaseOrderHistory.isLoading);
  const currentPOs = useSelector((state) => state.purchaseOrderHistory.pos)
  const defaultFilters = filterOption === "current" ? defaultCurrentFilters : defaultHistoryFilters

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
    "history-po",
    defaultFilters,
    retainFilters,
    dispatch,
    handleFilterDrawer,
    currentUserRole
  );

  useEffect(() => {
    if (currentView !== filterOption) {
      setCurrentView(filterOption);
      if (filterOption === "current") {
        dispatch(updateMultipleFilters({filterObject: defaultCurrentFilters}))
      } else {
        dispatch(updateMultipleFilters({ filterObject: defaultHistoryFilters}))
      }
      dispatch(setSorted());
    }
  }, [currentView, setCurrentView, filterOption, dispatch])

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>
            Purchase Order History
          </Typography>
          <div
            style={{
              display: "flex",
              width: "250px",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip title="Print POs">
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
        <div style={{ display: "flex", alignItems: "center", height: "32px" }}>
          <Typography
            variant="body2"
            color="textSecondary"
            className={classes.hoverText}
            style={{ marginRight: "20px" }}
            onClick={() => {
              handleFilterDrawer(!filtersOpen);
            }}
          >
            Filters
          </Typography>
          <FilterChipList classes={classes} />
        </div>
        <br />
        <PurchaseOrderHistoryTable
          pos={currentPOs}
          posLoading={isPOsLoading}
          handleSort={handleSort}
          scrollRef={scrollRef}
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

PurchaseOrderHistory.propTypes = {
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default PurchaseOrderHistory;
