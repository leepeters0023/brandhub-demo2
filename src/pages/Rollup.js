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
  setFilterType,
  setDefaultFilters,
  updateMultipleFilters,
  setSorted,
  setClear
} from "../redux/slices/filterSlice";

import { formatMoney } from "../utility/utilityFunctions";

import FilterChipList from "../components/Filtering/FilterChipList";
import RollupOverviewTable from "../components/OrderManagement/RollupOverviewTable";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import FormControl from "@material-ui/core/FormControl";
import InputBase from "@material-ui/core/InputBase";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

const defaultFilters = {
  fromDate: format(subDays(new Date(), 7), "MM/dd/yyyy"),
  toDate: format(new Date(), "MM/dd/yyyy"),
  type: "pre-order",
  user: null,
  program: "",
  brand: null,
  sequenceNum: "",
  status: "submitted",
  sortOrder: "asc",
  sortOrderBy: "user",
}

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Rollup = ({ handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const currentPreOrders = useSelector(
    (state) => state.orderSetHistory.orderSets
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
  const currentUserRoll = useSelector((state) => state.user.role);

  const handleBottomScroll = () => {
    if (nextLink && !isNextPreOrdersLoading) {
      if (scrollRef.current.scrollTop !== 0) {
        dispatch(fetchNextFilteredOrderSets(nextLink));
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

  useEffect(() => {
    dispatch(setFilterType({ type: "history-rollup" }));
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
    handleFilterDrawer(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentUserRoll.length > 0) {
      dispatch(setClear());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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
                  value={`${orderCount} / ${formatMoney(queryTotal)}`}
                  inputProps={{
                    "aria-label": "naked",
                    "data-lpignore": "true",
                  }}
                  style={{
                    marginTop: "10px",
                    marginBottom: "0px",
                    width: `Calc(${
                      queryTotal && orderCount
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
        <RollupOverviewTable
          rollupData={currentPreOrders}
          handleSort={handleSort}
          isRollupLoading={isPreOrdersLoading}
          scrollRef={scrollRef}
        />
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