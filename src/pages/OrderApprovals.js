import React, { useState, useCallback } from "react";
import "date-fns";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import format from "date-fns/format";

import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useSelector, useDispatch } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

import { fetchNextFilteredOrderSets } from "../redux/slices/orderSetHistorySlice";

import {
  approveMultipleOrderSets,
  deleteOrdSet,
} from "../redux/slices/patchOrderSlice";

import { updateMultipleFilters, setSorted } from "../redux/slices/filterSlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import OrderApprovalTable from "../components/OrderManagement/OrderApprovalTable";
import OrderPatchLoading from "../components/Utility/OrderPatchLoading";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

const defaultFilters = {
  fromDate: format(subDays(new Date(), 7), "MM/dd/yyyy"),
  toDate: format(addDays(new Date(), 1), "MM/dd/yyyy"),
  user: [],
  distributor: [],
  program: [],
  brand: [],
  itemType: [],
  itemNumber: "",
  groupBy: "order",
  type: "not-pre-order",
  status: "submitted",
  sortOrder: "asc",
  sortOrderBy: "user",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));
//TODO figure out notifications
const OrderApprovals = ({ handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [selected, setSelected] = useCallback(useState([]));

  const nextLink = useSelector((state) => state.orderHistory.nextLink);
  const isNextLoading = useSelector(
    (state) => state.orderHistory.isNextLoading
  );
  const allFilters = useSelector((state) => state.filters);

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      if (scrollRef.current.scrollTop !== 0) {
        dispatch(fetchNextFilteredOrderSets(nextLink));
      }
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll);

  const isOrdersLoading = useSelector(
    (state) => state.orderSetHistory.isLoading
  );
  const currentOrders = useSelector((state) => state.orderSetHistory.orderSets);
  const currentUserRole = useSelector((state) => state.user.role);
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

  const handleDeny = (id) => {
    dispatch(deleteOrdSet(id, allFilters, "approval"));
  };

  const handleBulkApproval = () => {
    dispatch(approveMultipleOrderSets(selected, allFilters));
    setSelected([]);
  };

  useInitialFilters(
    "history-approvals",
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
          <Typography className={classes.titleText}>Order Approvals</Typography>
          <div
            style={{
              display: "flex",
              width: "250px",
              justifyContent: "flex-end",
            }}
          >
            <Button
              className={classes.largeButton}
              variant="contained"
              color="secondary"
              disabled={selected.length === 0}
              style={{ marginRight: "20px" }}
              onClick={handleBulkApproval}
            >
              APPROVE
            </Button>
            <Tooltip title="Print Order History">
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
        <OrderApprovalTable
          orders={currentOrders}
          isOrdersLoading={isOrdersLoading}
          handleSort={handleSort}
          scrollRef={scrollRef}
          handleDeny={handleDeny}
          selected={selected}
          setSelected={setSelected}
        />
        {isNextLoading && (
          <div style={{ width: "100%" }}>
            <LinearProgress />
          </div>
        )}
        {!isNextLoading && <div style={{ width: "100%", height: "4px" }}></div>}
        <OrderPatchLoading />
      </Container>
      <br />
    </>
  );
};

export default OrderApprovals;
