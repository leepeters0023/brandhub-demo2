import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";

import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useSelector, useDispatch } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

import { fetchNextFilteredPOItems } from "../redux/slices/purchaseOrderSlice";
import {
  updateMultipleFilters,
  setSorted,
} from "../redux/slices/filterSlice";
import { createNewRFQ } from "../redux/slices/rfqSlice"

import FilterChipList from "../components/Filtering/FilterChipList";
import ItemRollupTable from "../components/SupplierManagement/ItemRollupTable";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

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
  const nextLink = useSelector((state) => state.purchaseOrder.nextLink);
  const isNextLoading = useSelector(
    (state) => state.purchaseOrder.isNextLoading
  );

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      if (scrollRef.current.scrollTop !== 0) {
        dispatch(fetchNextFilteredPOItems(nextLink));
      }
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll);

  const [itemSelected, setItemSelected] = useCallback(useState(false));

  const isPOItemsLoading = useSelector((state) => state.purchaseOrder.isLoading);
  const currentPOItems = useSelector((state) => state.purchaseOrder.poItems);
  const selectedPOItems = useSelector((state) => state.purchaseOrder.selectedPOItems);
  const currentUserRole = useSelector((state) => state.user.role);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const currentOrderType = useSelector((state) => state.filters.orderType);

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

  const handleNewRFQ = () => {
    let currentItem = currentPOItems.find((item) => item.id === selectedPOItems[0]);
    dispatch(createNewRFQ(selectedPOItems[0], currentItem.program[0].id))
  }

  const handleNewPO = () => {
    //TODO
    console.log(selectedPOItems);
  }

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
              width: "500px",
              justifyContent: "flex-end",
            }}
          >
            {currentOrderType === "pre-order" && (
              <Button
                className={classes.largeButton}
                variant="contained"
                color="secondary"
                disabled={selectedPOItems.length !== 1}
                style={{ marginRight: "20px" }}
                onClick={() => {
                  handleNewRFQ()
                  navigate("/purchasing/rfq#new");
                }}
              >REQUEST QUOTE</Button>
            )}
            <Button
              className={classes.largeButton}
              variant="contained"
              color="secondary"
              disabled={!itemSelected}
              style={{ marginRight: "20px" }}
              onClick={() => {
                handleNewPO()
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
          isItemsLoading={isPOItemsLoading}
          handleSort={handleSort}
          scrollRef={scrollRef}
          itemSelected={itemSelected}
          setItemSelected={setItemSelected}
          type={"po"}
        />
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

PurchaseOrderRollup.propTypes = {
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default PurchaseOrderRollup;
