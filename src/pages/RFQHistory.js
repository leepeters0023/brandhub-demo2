import React from "react";
import PropTypes from "prop-types";

//import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useSelector, useDispatch } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

import {
  updateMultipleFilters,
  //setSorted,
} from "../redux/slices/filterSlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import RFQHistoryTable from "../components/SupplierManagement/RFQHistoryTable";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
//import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

// import { rfqCurrent, rfqAll } from "../assets/mockdata/dataGenerator.js";

const defaultFilters = {
  brand: [],
  program: [],
  itemType: [],
  status: "all",
  rfqNum: "",
  sequenceNum: "",
  sortOrder: "asc",
  sortOrderBy: "rfqNum",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const RFQHistory = ({ handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const currentUserRole = useSelector((state) => state.user.role);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const isRFQsLoading = useSelector((state) => state.rfqHistory.isLoading);
  const currentRFQs = useSelector((state) => state.rfqHistory.rfqs);
  //TODO nextLink, handleBottomScroll, scrollRef, loading selectors

  const handleSort = (sortObject) => {
    //scrollRef.current.scrollTop = 0;
    dispatch(
      updateMultipleFilters({
        filterObject: {
          sortOrder: sortObject.order,
          sortOrderBy: sortObject.orderBy,
        },
      })
    );
    //dispatch(setSorted());
  };

  useInitialFilters(
    "history-rfq",
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
        <RFQHistoryTable
          rfqs={currentRFQs}
          rfqsLoading={isRFQsLoading}
          handleSort={handleSort}
          // scrollRef={scrollRef}
        />
        {/* {isNextLoading && (
          <div style={{ width: "100%" }}>
            <LinearProgress />
          </div>
        )}
        {!isNextLoading && <div style={{ width: "100%", height: "4px" }}></div>} */}
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
