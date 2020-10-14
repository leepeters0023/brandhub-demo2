import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { /*useSelector,*/ useDispatch } from "react-redux";
//import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { navigate } from "@reach/router";

import {
  setFilterType,
  setDefaultFilters,
  updateMultipleFilters,
  //setSorted,
  //setClear
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

import { currentBidItems } from "../assets/mockdata/dataGenerator.js";

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

const BidRollup = ({ handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [itemSelected, setItemSelected] = useCallback(useState(false));

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
    dispatch(setFilterType({ type: "itemRollup" }));
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
          <Typography className={classes.titleText}>RFQ Rollup</Typography>
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
                //TODO create bid function
                navigate("/purchasing/rfq#new");
              }}
            >
              CREATE BID
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
          items={currentBidItems}
          isItemsLoading={false}
          handleSort={handleSort}
          // scrollRef={scrollRef}
          itemSelected={itemSelected}
          setItemSelected={setItemSelected}
          type={"rfq"}
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

BidRollup.propTypes = {
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default BidRollup;
