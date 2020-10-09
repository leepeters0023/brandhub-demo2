import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { /*useSelector,*/ useDispatch } from "react-redux";
//import { useBottomScrollListener } from "react-bottom-scroll-listener";

import {
  setFilterType,
  setDefaultFilters,
  updateMultipleFilters,
  //setSorted,
  //setClear
} from "../redux/slices/filterSlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import PurchaseOrderHistoryTable from "../components/SupplierManagement/PurchaseOrderHistoryTable";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
//import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

import { poCurrent, poAll } from "../assets/mockdata/dataGenerator.js";

const defaultFilters = {
  orderType: "on-demand",
  brand: null,
  program: "",
  sequenceNum: "",
  sortOrder: "asc",
  sortOrderBy: "sequenceNum",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PurchaseOrderHistory = ({ handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  //const currentUserRole = useSelector((state) => state.user.role);
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

  useEffect(() => {
    dispatch(setFilterType({ type: "history-po" }));
    dispatch(
      setDefaultFilters({
        filterObject: defaultFilters,
      })
    );
    dispatch(
      //TODO filters based off of window hash
      updateMultipleFilters({
        filterObject: defaultFilters,
      })
    );
    handleFilterDrawer(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (currentUserRole.length > 0) {
  //     dispatch(setClear());;
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>Purchase Order History</Typography>
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
          pos={window.location.hash.includes("current") ? poCurrent : poAll}
          posLoading={false}
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

PurchaseOrderHistory.propTypes = {
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default PurchaseOrderHistory;