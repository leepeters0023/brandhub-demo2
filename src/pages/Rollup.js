import React, { useRef, useEffect, useState } from "react";
import "date-fns";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import format from "date-fns/format";
import { CSVLink } from "react-csv";
import Helmet from "react-helmet";

import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useReactToPrint } from "react-to-print";
import { useSelector, useDispatch } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

import {
  fetchNextFilteredOrderSets,
  fetchNextFilteredOrderSetItems,
} from "../redux/slices/orderSetHistorySlice";

import { updateMultipleFilters, setSorted } from "../redux/slices/filterSlice";

import { formatMoney } from "../utility/utilityFunctions";

import FilterChipList from "../components/Filtering/FilterChipList";
import RollupOverviewTable from "../components/OrderManagement/RollupOverviewTable";
import RollupOverviewByItemTable from "../components/OrderManagement/RollupOverviewByItemTable";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import TuneIcon from "@material-ui/icons/Tune";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import FormControl from "@material-ui/core/FormControl";
import InputBase from "@material-ui/core/InputBase";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

const orderHeaders = [
  { label: "Person", key: "user" },
  { label: "Program", key: "program" },
  { label: "Brand", key: "brand" },
  { label: "State", key: "state" },
  { label: "Est. Cost", key: "totalEstCost" },
  { label: "Order Submitted", key: "orderDate" },
  { label: "Order Window Close", key: "dueDate" },
  { label: "In Market Date", key: "inMarketDate" },
  { label: "Status", key: "status" },
];

const itemHeaders = [
  { label: "Person", key: "user" },
  { label: "Sequence #", key: "itemNumber" },
  { label: "Program", key: "program" },
  { label: "Brand", key: "brand" },
  { label: "Item Type", key: "itemType" },
  { label: "Item Desc.", key: "itemDescription" },
  { label: "State", key: "state" },
  { label: "Qty / Pack", key: "packSize" },
  { label: "Total Items", key: "totalItems" },
  { label: "Est. Cost", key: "estCost" },
  { label: "Est. Total", key: "totalEstCost" },
  { label: "Order Submitted", key: "orderDate" },
  { label: "Order Window Close", key: "dueDate" },
  { label: "In Market Date", key: "inMarketDate" },
  { label: "Status", key: "status" },
];

const defaultFilters = {
  fromDate: format(subDays(new Date(), 7), "MM/dd/yyyy"),
  toDate: format(addDays(new Date(), 1), "MM/dd/yyyy"),
  type: "pre-order",
  user: [],
  program: [],
  brand: [],
  itemType: [],
  groupBy: "order",
  itemNumber: "",
  status: "submitted",
  sortOrder: "asc",
  sortOrderBy: "user",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Rollup = ({ handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const orderRef = useRef(null);
  const itemRef = useRef(null);

  const [currentCSVData, setCurrentCSVData] = useState({
    data: [],
    headers: [],
    group: "order",
  });

  const currentPreOrders = useSelector(
    (state) => state.orderSetHistory.orderSets
  );
  const quarterlyRollupItems = useSelector(
    (state) => state.orderSetHistory.itemGroups
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
  const currentUserRole = useSelector((state) => state.user.role);
  const currentGrouping = useSelector((state) => state.filters.groupBy);
  const retainFilters = useSelector((state) => state.filters.retainFilters);

  const handlePrintOrderTable = useReactToPrint({
    content: () => orderRef.current,
  });

  const handlePrintItemTable = useReactToPrint({
    content: () => itemRef.current,
  });

  const statusConverter = (status) => {
    if (status === "inactive") {
      return "Not Started";
    } else if (status === "in-progress") {
      return "In Progress";
    } else if (status === "submitted") {
      return "Order Submitted";
    } else {
      return "Error";
    }
  };

  const handleBottomScroll = () => {
    if (nextLink && !isNextPreOrdersLoading) {
      if (scrollRef.current.scrollTop !== 0) {
        if (currentGrouping === "order") {
          dispatch(fetchNextFilteredOrderSets(nextLink));
        } else {
          dispatch(fetchNextFilteredOrderSetItems(nextLink));
        }
      }
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll);

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
    "history-rollup",
    defaultFilters,
    retainFilters,
    dispatch,
    handleFilterDrawer,
    currentUserRole
  );

  useEffect(() => {
    if (
      (currentGrouping && currentCSVData.group !== currentGrouping) ||
      currentCSVData.data.length === 0 ||
      (currentGrouping &&
        currentGrouping === "order" &&
        currentCSVData.data.length !== currentPreOrders.length) ||
      (currentGrouping &&
        currentGrouping === "item" &&
        currentCSVData.data.length !== quarterlyRollupItems.length)
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
          ? currentPreOrders.map((order) => ({
              user: order.userName,
              program: order.program.join(", "),
              brand: order.brand.join(", "),
              state: order.state,
              totalEstCost: formatMoney(order.totalEstCost, false),
              orderDate:
                order.orderDate !== "---"
                  ? format(new Date(order.orderDate), "MM/dd/yyyy")
                  : order.orderDate,
              dueDate:
                order.dueDate !== "---"
                  ? format(new Date(order.dueDate), "MM/dd/yyyy")
                  : order.dueDate,
              inMarketDate:
                order.inMarketDate !== "---"
                  ? format(new Date(order.inMarketDate), "MM/dd/yyyy")
                  : order.inMarketDate,
              status: statusConverter(order.status),
            }))
          : quarterlyRollupItems.map((item) => ({
              user: item.user,
              itemNumber: item.itemNumber,
              program: item.program,
              brand: item.brand.join(", "),
              itemType: item.itemType,
              itemDescription: item.itemDescription,
              state: item.state,
              packSize: item.packSize,
              totalItems: item.totalItems,
              estCost:
                item.estCost !== "---"
                  ? formatMoney(item.estCost, false)
                  : item.estCost,
              totalEstCost:
                item.totalEstCost !== "---"
                  ? formatMoney(item.totalEstCost, false)
                  : item.totalEstCost,
              orderDate:
                item.orderDate !== "---"
                  ? format(new Date(item.orderDate), "MM/dd/yyyy")
                  : item.orderDate,
              dueDate:
                item.orderDue !== "---"
                  ? format(new Date(item.orderDue), "MM/dd/yyyy")
                  : item.orderDue,
              inMarketDate:
                item.inMarketDate !== "---"
                  ? format(new Date(item.inMarketDate), "MM/dd/yyyy")
                  : item.inMarketDate,
              status: statusConverter(item.status),
            }));
      setCurrentCSVData(dataObject);
    }
  }, [
    currentCSVData.data.length,
    currentCSVData.group,
    currentGrouping,
    currentPreOrders,
    quarterlyRollupItems,
  ]);

  return (
    <>
    <Helmet><title>RTA | Quarterly Rollup</title></Helmet>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>
            Quarterly Rollup
          </Typography>
          <div
            style={{
              display: "flex",
              minWidth: "150px",
              justifyContent: "flex-end",
            }}
          >
            {queryTotal && (
              <FormControl style={{ pointerEvents: "none", minWidth: "100px" }}>
                <InputLabel
                  htmlFor="program-total"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Pre-Order Count / Total
                </InputLabel>
                <InputBase
                  className={classes.titleText}
                  id="program-total"
                  value={`${orderCount} / ${formatMoney(queryTotal, false)}`}
                  inputProps={{
                    "aria-label": "naked",
                    "data-lpignore": "true",
                  }}
                  style={{
                    marginTop: "10px",
                    marginBottom: "0px",
                    width: `Calc(${queryTotal && orderCount
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
            <Tooltip title="Export CSV">
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
        <div style={{ display: "flex", flexDirection: "row", alignContent: "center", marginBottom: "10px" }}>
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
          <RollupOverviewTable
            rollupData={currentPreOrders}
            handleSort={handleSort}
            isRollupLoading={isPreOrdersLoading}
            scrollRef={scrollRef}
            orderRef={orderRef}
          />
        )}
        {currentGrouping === "item" && (
          <RollupOverviewByItemTable
            items={quarterlyRollupItems}
            handleSort={handleSort}
            isRollupLoading={isPreOrdersLoading}
            scrollRef={scrollRef}
            itemRef={itemRef}
          />
        )}
        {isNextPreOrdersLoading && (
          <div style={{ width: "100%" }}>
            <LinearProgress />
          </div>
        )}
        {!isNextPreOrdersLoading && (
          <div style={{ width: "100%", height: "4px" }}></div>
        )}
      </Container>
    </>
  );
};

export default Rollup;
