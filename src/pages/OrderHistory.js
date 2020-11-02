import React from "react";
import PropTypes from "prop-types";
import "date-fns";
import subDays from "date-fns/subDays";
import format from "date-fns/format";
import { CSVLink } from "react-csv";

import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useSelector, useDispatch } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

import { fetchNextOrderHistory } from "../redux/slices/orderHistorySlice";

import { updateMultipleFilters, setSorted } from "../redux/slices/filterSlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import OrderHistoryTable from "../components/OrderHistory/OrderHistoryTable";
import OrderHistoryByItemTable from "../components/OrderHistory/OrderHistoryByItemTable";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

//mock data
import { orderHistoryItems } from "../assets/mockdata/dataGenerator";

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

const defaultFilters = {
  fromDate: format(subDays(new Date(), 7), "MM/dd/yyyy"),
  toDate: format(new Date(), "MM/dd/yyyy"),
  user: [],
  distributor: [],
  groupBy: "order",
  brand: [],
  program: [],
  itemType: [],
  sequenceNum: "",
  sortOrder: "asc",
  sortOrderBy: "orderDate",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const OrderHistory = ({ handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const nextLink = useSelector((state) => state.orderHistory.nextLink);
  const isNextLoading = useSelector(
    (state) => state.orderHistory.isNextLoading
  );

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      if (scrollRef.current.scrollTop !== 0) {
        dispatch(fetchNextOrderHistory(nextLink));
      }
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll);

  const isOrdersLoading = useSelector((state) => state.orderHistory.isLoading);
  const currentOrders = useSelector((state) => state.orderHistory.orders);
  const currentUserRole = useSelector((state) => state.user.role);
  const currentGrouping = useSelector((state) => state.filters.groupBy);
  const retainFilters = useSelector((state) => state.filters.retainFilters);

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
            items={orderHistoryItems}
            isOrdersLoading={isOrdersLoading}
            handleSort={handleSort}
            scrollRef={scrollRef}
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
