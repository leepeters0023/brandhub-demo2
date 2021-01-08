import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";

import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useSelector, useDispatch } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

import { fetchNextFilteredRFQItems } from "../redux/slices/rfqSlice";
import { createNewRFQ } from "../redux/slices/rfqSlice";

import { updateMultipleFilters, setSorted } from "../redux/slices/filterSlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import ItemRollupTable from "../components/SupplierManagement/ItemRollupTable";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import TuneIcon from '@material-ui/icons/Tune';
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

const defaultFilters = {
  orderType: "pre-order",
  brand: [],
  program: [],
  itemType: [],
  user: [],
  bus: [],
  itemNumber: "",
  sortOrder: "asc",
  sortOrderBy: "itemNumber",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const RFQRollup = ({ handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const nextLink = useSelector((state) => state.rfq.nextLink);
  const isNextLoading = useSelector((state) => state.rfq.isNextLoading);

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      if (scrollRef.current.scrollTop !== 0) {
        dispatch(fetchNextFilteredRFQItems(nextLink));
      }
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll);

  const [itemSelected, setItemSelected] = useCallback(useState(false));

  const isRFQItemsLoading = useSelector((state) => state.rfq.isLoading);
  const currentRFQItems = useSelector((state) => state.rfq.rfqItems);
  const selectedRFQItem = useSelector((state) => state.rfq.selectedRFQItem);
  const currentUserRole = useSelector((state) => state.user.role);
  const retainFilters = useSelector((state) => state.filters.retainFilters);

  const handleNewRFQ = () => {
    let currentItem = currentRFQItems.find(
      (item) => item.itemId === selectedRFQItem
    );
    dispatch(createNewRFQ(selectedRFQItem, currentItem.program.id));
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
    "itemRollup-rfq",
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
          <Typography className={classes.titleText}>RFQ Rollup</Typography>
          <div
            style={{
              display: "flex",
              width: "300px",
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
                handleNewRFQ();
                navigate("/purchasing/rfq#new");
              }}
            >
              CREATE QUOTE
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
        <div
          className={classes.hoverText}
          style={{ display: "flex", alignItems: "center", height: "32px" }}
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
          <FilterChipList classes={classes} />
        </div>
        <br />
        <ItemRollupTable
          items={currentRFQItems}
          isItemsLoading={isRFQItemsLoading}
          handleSort={handleSort}
          scrollRef={scrollRef}
          itemSelected={itemSelected}
          setItemSelected={setItemSelected}
          type={"rfq"}
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

RFQRollup.propTypes = {
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default RFQRollup;
