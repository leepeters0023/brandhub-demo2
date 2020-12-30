import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import "date-fns";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import format from "date-fns/format";
import { CSVLink } from "react-csv";

import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useSelector, useDispatch } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

import {
  fetchNextOrderHistory,
  fetchNextFilteredOrderHistoryByItem,
} from "../redux/slices/orderHistorySlice";
import { getTracking } from "../redux/slices/trackingSlice";

import { updateMultipleFilters, setSorted } from "../redux/slices/filterSlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import OrderHistoryTable from "../components/OrderHistory/OrderHistoryTable";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";
import OrderHistoryByItemTable from "../components/OrderHistory/OrderHistoryByItemTable";
import TrackingModal from "../components/Utility/TrackingModal";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
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
  { label: "Est. Total", key: "totalEstCost" },
  { label: "Act. Total", key: "actTotal" },
  { label: "Status", key: "orderStatus" },
];

const defaultOrderFilters = {
  fromDate: format(subDays(new Date(), 7), "MM/dd/yyyy"),
  toDate: format(addDays(new Date(), 1), "MM/dd/yyyy"),
  user: [],
  distributor: [],
  groupBy: "order",
  brand: [],
  program: [],
  itemType: [],
  itemNumber: "",
  status: "not-draft",
  sortOrder: "asc",
  sortOrderBy: "orderDate",
};

const defaultItemFilters = {
  fromDate: format(subDays(new Date(), 7), "MM/dd/yyyy"),
  toDate: format(addDays(new Date(), 1), "MM/dd/yyyy"),
  user: [],
  distributor: [],
  groupBy: "item",
  brand: [],
  program: [],
  itemType: [],
  itemNumber: "",
  status: "not-draft",
  sortOrder: "asc",
  sortOrderBy: "itemType",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const OrderHistory = ({ handleFilterDrawer, filtersOpen, filterOption }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [currentView, setCurrentView] = useCallback(useState(filterOption));
  const [currentItem, setCurrentItem] = useCallback(useState({}));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [isTrackingOpen, setTrackingOpen] = useCallback(useState(false));
  const currentGrouping = useSelector((state) => state.filters.groupBy);
  const nextLink = useSelector((state) => state.orderHistory.nextLink);
  const isNextLoading = useSelector(
    (state) => state.orderHistory.isNextLoading
  );

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      if (scrollRef.current.scrollTop !== 0) {
        if (currentGrouping === "order") {
          dispatch(fetchNextOrderHistory(nextLink));
        } else {
          dispatch(fetchNextFilteredOrderHistoryByItem(nextLink));
        }
      }
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll);

  const isOrdersLoading = useSelector((state) => state.orderHistory.isLoading);
  const currentOrders = useSelector((state) => state.orderHistory.orders);
  const currentOrderItems = useSelector((state) => state.orderHistory.items);
  const currentUserRole = useSelector((state) => state.user.role);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const defaultFilters =
    filterOption === "byOrder" ? defaultOrderFilters : defaultItemFilters;
  console.log(currentOrderItems)
    const handleModalOpen = (itemNumber) => {
      let item = currentOrderItems.find((item) => item.itemNumber === itemNumber);
      console.log(itemNumber)
      setCurrentItem(item);
      handlePreviewModal(true);
    }
   
  const handleModalClose = () => {
    handlePreviewModal(false);
  };

  const handleTrackingClick = (id) => {
    dispatch(getTracking(id));
    setTrackingOpen(true);
  };

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
    "history-orders",
    defaultFilters,
    retainFilters,
    dispatch,
    handleFilterDrawer,
    currentUserRole
  );

  useEffect(() => {
    if (currentView !== filterOption) {
      setCurrentView(filterOption);
      if (filterOption === "byOrder") {
        dispatch(updateMultipleFilters({ filterObject: defaultOrderFilters }));
      } else {
        dispatch(updateMultipleFilters({ filterObject: defaultItemFilters }));
      }
      dispatch(setSorted());
    }
  }, [currentView, setCurrentView, filterOption, dispatch]);

  return (
    <>
      <ItemPreviewModal
        type={"catalog"}
        handleClose={handleModalClose}
        previewModal={previewModal}
        currentItem={currentItem}
      />
      <TrackingModal open={isTrackingOpen} handleClose={setTrackingOpen} />
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
        {currentGrouping === "order" && (
          <OrderHistoryTable
            orders={currentOrders}
            isOrdersLoading={isOrdersLoading}
            handleSort={handleSort}
            scrollRef={scrollRef}
          />
        )}
        {currentGrouping === "item" && (
          <OrderHistoryByItemTable
            items={currentOrderItems}
            isOrdersLoading={isOrdersLoading}
            handleSort={handleSort}
            scrollRef={scrollRef}
            handlePreview={handleModalOpen}
            handleTrackingClick={handleTrackingClick}
          />
        )}
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

OrderHistory.propTypes = {
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default OrderHistory;
