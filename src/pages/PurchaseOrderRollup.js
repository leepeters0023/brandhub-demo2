import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";

//import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useSelector, useDispatch } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

import {
  updateMultipleFilters,
  //setSorted,
} from "../redux/slices/filterSlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import ItemRollupTable from "../components/SupplierManagement/ItemRollupTable";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
//import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

import { currentPOItems } from "../assets/mockdata/dataGenerator.js";

const defaultFilters = {
  orderType: "on-demand",
  brand: [],
  program: [],
  itemType: [],
  sequenceNum: "",
  sortOrder: "asc",
  sortOrderBy: "sequenceNum",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PurchaseOrderRollup = ({ handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [itemSelected, setItemSelected] = useCallback(useState(false));

  const currentUserRole = useSelector((state) => state.user.role);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
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
    "itemRollup-po",
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
          <Typography className={classes.titleText}>
            Purchase Order Rollup
          </Typography>
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
              disabled={!itemSelected}
              style={{ marginRight: "20px" }}
              onClick={() => {
                //TODO create po function
                navigate("/purchasing/purchaseOrder#new");
              }}
            >
              CREATE PO
            </Button>
            <Tooltip title="Print Purchase Order Items">
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
        <ItemRollupTable
          items={currentPOItems}
          isItemsLoading={false}
          handleSort={handleSort}
          // scrollRef={scrollRef}
          itemSelected={itemSelected}
          setItemSelected={setItemSelected}
          type={"po"}
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

PurchaseOrderRollup.propTypes = {
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default PurchaseOrderRollup;
