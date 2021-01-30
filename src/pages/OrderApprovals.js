import React, { useState, useCallback } from "react";
import "date-fns";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import format from "date-fns/format";
import Helmet from "react-helmet";

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
import TuneIcon from '@material-ui/icons/Tune';
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

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

  const nextLink = useSelector((state) => state.orderSetHistory.nextLink);
  const isNextLoading = useSelector(
    (state) => state.orderSetHistory.isNextLoading
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
      <Helmet><title>RTA | Order Approval</title>
      {(currentUserRole === "field2" && !filtersOpen) && (
       <script type="text/javascript">{`Beacon('open'), Beacon('suggest', ['600af2ff1c64ad47e4b7201d'])`}</script>
      )}
      </Helmet>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>Order Approvals</Typography>
          {currentUserRole !== "read-only" ? (
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
            </div>
          ) : (
              <div></div>
            )}
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
