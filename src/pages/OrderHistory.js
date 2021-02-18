import React, { useCallback, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "date-fns";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import format from "date-fns/format";
import { formatMoney } from "../utility/utilityFunctions";
import { CSVLink } from "react-csv";
import Helmet from "react-helmet";

import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useSelector, useDispatch } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";
import { useReactToPrint } from "react-to-print";

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
import TuneIcon from "@material-ui/icons/Tune";
import Tooltip from "@material-ui/core/Tooltip";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

const orderHeaders = [
  { label: "Order Number", key: "orderNum" },
  { label: "Order Type", key: "type" },
  { label: "Distributor / Address Name", key: "name" },
  { label: "State", key: "state" },
  { label: "Program", key: "program" },
  { label: "Brand", key: "brand" },
  { label: "Order Date", key: "orderDate" },
  { label: "Ship Date", key: "shipDate" },
  { label: "Total Items", key: "totalItems" },
  { label: "Est. Total", key: "totalEstCost" },
  { label: "Act. Total", key: "totalActCost" },
  { label: "Status", key: "status" },
];

const itemHeaders = [
  { label: "Sequence #", key: "itemNumber" },
  { label: "Order Type", key: "orderType" },
  { label: "Order Number", key: "orderNum" },
  { label: "Brand", key: "brand" },
  { label: "Program", key: "program" },
  { label: "Item Type", key: "itemType" },
  { label: "Item Description", key: "itemDesc" },
  { label: "Distributor / Address Name", key: "name" },
  { label: "State", key: "state" },
  { label: "Total Qty", key: "totalItems" },
  { label: "Est. Cost/Unit", key: "estCost" },
  { label: "Act. Cost/Unit", key: "actCost" },
  { label: "Order Date", key: "orderDate" },
  { label: "Ship Date", key: "shipDate" },
  { label: "Carrier", key: "carrier" },
  { label: "Tracking #", key: "tracking" },
  { label: "Status", key: "status" },
];

const orderTypeMap = {
  "on-demand": "On Demand",
  "in-stock": "In Stock",
  "pre-order": "Pre Order",
};

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

  const orderRef = useRef(null);
  const itemRef = useRef(null);

  const [currentView, setCurrentView] = useCallback(useState(filterOption));
  const [currentItem, setCurrentItem] = useCallback(useState({}));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [isTrackingOpen, setTrackingOpen] = useCallback(useState(false));
  const [currentCSVData, setCurrentCSVData] = useState({
    data: [],
    headers: [],
    group: filterOption === "byOrder" ? "order" : "item",
  });
  const currentGrouping = useSelector((state) => state.filters.groupBy);
  const nextLink = useSelector((state) => state.orderHistory.nextLink);
  const isNextLoading = useSelector(
    (state) => state.orderHistory.isNextLoading
  );

  const handlePrintOrderTable = useReactToPrint({
    content: () => orderRef.current,
  });

  const handlePrintItemTable = useReactToPrint({
    content: () => itemRef.current,
  });

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

  const scrollRef = useBottomScrollListener(handleBottomScroll, 300);

  const isOrdersLoading = useSelector((state) => state.orderHistory.isLoading);
  const currentOrders = useSelector((state) => state.orderHistory.orders);
  const currentOrderItems = useSelector((state) => state.orderHistory.items);
  const currentUserRole = useSelector((state) => state.user.role);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const defaultFilters =
    filterOption === "byOrder" ? defaultOrderFilters : defaultItemFilters;

  const handleModalOpen = (itemNumber) => {
    let item = currentOrderItems.find((item) => item.itemNumber === itemNumber);
    setCurrentItem(item);
    handlePreviewModal(true);
  };

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
    if (filterOption && currentView !== filterOption) {
      setCurrentView(filterOption);
      if (filterOption === "byOrder") {
        dispatch(updateMultipleFilters({ filterObject: defaultOrderFilters }));
      } else {
        dispatch(updateMultipleFilters({ filterObject: defaultItemFilters }));
      }
      dispatch(setSorted());
    }
  }, [currentView, setCurrentView, filterOption, dispatch]);

  useEffect(() => {
    if (
      (currentGrouping && currentCSVData.group !== currentGrouping) ||
      currentCSVData.data.length === 0 ||
      (currentGrouping &&
        currentGrouping === "order" &&
        currentCSVData.data.length !== currentOrders.length) ||
      (currentGrouping &&
        currentGrouping === "item" &&
        currentCSVData.data.length !== currentOrderItems.length)
    ) {
      let dataObject = {
        data: [],
        headers: [],
        group: currentGrouping ? currentGrouping : currentCSVData.group,
      };
      dataObject.headers =
        dataObject.group === "order" ? orderHeaders : itemHeaders;
      dataObject.data =
        dataObject.group === "order"
          ? currentOrders.map((order) => ({
              orderNum: order.id,
              type: order.type,
              name: order.distributorName ? order.distributorName : "---",
              state: order.distributorState
                ? order.distributorState
                : order.customAddressState,
              program: order.program,
              brand: order.brand.join(", "),
              orderDate: format(new Date(order.orderDate), "MM/dd/yyyy"),
              shipDate:
                order.shipDate !== "---"
                  ? format(new Date(order.orderDate), "MM/dd/yyyy")
                  : order.shipDate,
              totalItems: order.totalItems,
              totalEstCost:
                order.totalEstCost !== "---"
                  ? formatMoney(order.totalEstCost, false)
                  : order.totalEstCost,
              totalActCost:
                order.totalActCost !== "---"
                  ? formatMoney(order.totalActCost, false)
                  : order.totalActCost,
              status: order.status[0].toUpperCase() + order.status.slice(1),
            }))
          : currentOrderItems.map((item) => ({
              itemNumber: item.itemNumber,
              orderType: item.orderType ? orderTypeMap[item.orderType] : "---",
              orderNum: item.orderId,
              brand: item.brand.join(", "),
              program: item.program,
              itemType: item.itemType,
              itemDesc: item.itemDescription,
              name: item.distributor.length > 0 ? item.distributor : "---",
              state: item.state,
              totalItems: item.totalItems,
              estCost:
                item.estCost !== "---"
                  ? formatMoney(item.estCost, false)
                  : item.estCost,
              actCost:
                item.actCost !== "---"
                  ? formatMoney(item.actCost, false)
                  : item.actCost,
              orderDate:
                item.orderDate !== "---"
                  ? format(new Date(item.orderDate), "MM/dd/yyyy")
                  : item.orderDate,
              shipDate:
                item.shipDate !== "---"
                  ? format(new Date(item.shipDate), "MM/dd/yyyy")
                  : item.shipDate,
              carrier: item.carrier,
              tracking: item.tracking,
              status: item.status[0].toUpperCase() + item.status.slice(1),
            }));
      setCurrentCSVData(dataObject);
    }
  }, [
    currentCSVData.data.length,
    currentCSVData.group,
    currentGrouping,
    currentOrders,
    currentOrderItems,
  ]);

  return (
    <>
      <Helmet>
        <title>RTA | Order History</title>
        {(currentUserRole === "field2" || currentUserRole === "field1") && (
          <script type="text/javascript">{` Beacon('suggest', ['600af2ff1c64ad47e4b7201d','5ffdf334b9a8501b295cf995'])`}</script>
        )}
        {currentUserRole === "read-only" && (
          <script type="text/javascript">{` Beacon('suggest', ['600ed315c64fe14d0e1fe351'])`}</script>
        )}
      </Helmet>
      {previewModal && currentItem && (
        <ItemPreviewModal
          type={"catalog"}
          handleClose={handleModalClose}
          previewModal={previewModal}
          currentItem={currentItem}
        />
      )}
      {isTrackingOpen && (
        <TrackingModal open={isTrackingOpen} handleClose={setTrackingOpen} />
      )}
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
              <IconButton
                onClick={() => {
                  if (currentGrouping === "order") {
                    handlePrintOrderTable();
                  } else {
                    handlePrintItemTable();
                  }
                }}
              >
                <PrintIcon color="secondary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export File">
              <CSVLink
                data={currentCSVData.data}
                headers={currentCSVData.headers}
              >
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
        {currentGrouping === "order" && (
          <OrderHistoryTable
            orders={currentOrders}
            isOrdersLoading={isOrdersLoading}
            handleSort={handleSort}
            scrollRef={scrollRef}
            orderRef={orderRef}
          />
        )}
        {currentGrouping === "item" && (
          <OrderHistoryByItemTable
            items={currentOrderItems}
            isOrdersLoading={isOrdersLoading}
            handleSort={handleSort}
            scrollRef={scrollRef}
            itemRef={itemRef}
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
