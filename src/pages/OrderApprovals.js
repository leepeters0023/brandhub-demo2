import React, { useEffect } from "react";
import "date-fns";
import subDays from "date-fns/subDays";
import format from "date-fns/format";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

import { useSelector, useDispatch } from "react-redux";

import {
  fetchNextFilteredOrderSets,
} from "../redux/slices/orderSetHistorySlice";

import {
  approveOrdSet,
  //approveMultipleOrderSets,
} from "../redux/slices/patchOrderSlice";

import {
  setFilterType,
  setDefaultFilters,
  updateMultipleFilters,
  setSorted,
  setClear,
} from "../redux/slices/filterSlice";

import FilterChipList from "../components/Utility/FilterChipList";
import OrderApprovalTable from "../components/OrderManagement/OrderApprovalTable";
import OrderPatchLoading from "../components/Utility/OrderPatchLoading";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

const defaultFilters = {
  fromDate: format(subDays(new Date(), 7), "MM/dd/yyyy"),
  toDate: format(new Date(), "MM/dd/yyyy"),
  user: null,
  distributor: null,
  program: "",
  brand: null,
  sequenceNum: "",
  type: "not-pre-order",
  status: "submitted",
  sortOrder: "asc",
  sortOrderBy: "user",
}

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));
//TODO figure out order denial process / notifications
const OrderApprovals = ({ handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

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

  const handleApproval = (id) => {
    dispatch(approveOrdSet(id, "approved", allFilters));
  };

  // const handleBulkApproval = () => {
  //   let idArray = currentOrders.map((order) => order.id);
  //   dispatch(approveMultipleOrderSets(idArray, allFilters));
  // };

  useEffect(() => {
    dispatch(setFilterType({ type: "history-approvals" }));
    dispatch(
      setDefaultFilters({
        filterObject: defaultFilters,
      })
    );
    dispatch(
      updateMultipleFilters({
        filterObject: defaultFilters,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentUserRole.length > 0) {
      dispatch(setClear());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>Order Approvals</Typography>
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
          handleApproval={handleApproval}
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
