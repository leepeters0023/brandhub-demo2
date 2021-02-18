import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";
import Helmet from "react-helmet";

import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useDispatch, useSelector } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

import { fetchNextFilteredItems } from "../redux/slices/itemSlice";
import { setIsOrdering } from "../redux/slices/orderSetSlice";
import {
  fetchCurrentOrderByType,
  addBulkOrderItems,
  createNewBulkItemOrder,
  clearItemSelections,
} from "../redux/slices/currentOrderSlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import OrderItemViewControl from "../components/Purchasing/OrderItemViewControl";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";
import Loading from "../components/Utility/Loading";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import TuneIcon from "@material-ui/icons/Tune";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import ViewStreamIcon from "@material-ui/icons/ViewStream";
import ViewModuleIcon from "@material-ui/icons/ViewModule";

const defaultFilters = {
  brand: [],
  itemType: [],
  bu: [],
  program: [],
  favItems: [],
  orderType: "on-demand",
  itemNumber: "",
  itemDesc: "",
  isItemVisible: true,
  isItemOrderable: true,
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PlaceOnDemandOrder = ({ handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const nextLink = useSelector((state) => state.items.nextLink);
  const isNextLoading = useSelector((state) => state.items.isNextLoading);

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      if (scrollRef.current.scrollTop !== 0) {
        dispatch(fetchNextFilteredItems(nextLink));
      }
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll, 300);
  const [currentView, setView] = useCallback(useState("list"));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState({}));
  const currentItems = useSelector((state) => state.items.items);
  const currentChannel = useSelector((state) => state.user.currentChannel);
  const itemsLoading = useSelector((state) => state.items.isLoading);
  const currentUserRole = useSelector((state) => state.user.role);
  const territoryId = useSelector((state) => state.user.currentTerritory);
  const orderLoading = useSelector((state) => state.currentOrder.isLoading);
  const selectedItems = useSelector(
    (state) => state.currentOrder.selectedOnDemandItems
  );
  const currentOrder = useSelector((state) => state.currentOrder);
  const userId = useSelector((state) => state.user.id);
  const isOrdering = useSelector((state) => state.orderSet.isOrdering);
  const orderTerritoryId = useSelector(
    (state) => state.currentOrder.onDemandOrderTerritory
  );
  const orderChannel = useSelector(
    (state) => state.currentOrder.onDemandChannel
  );
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const isUpdateLoading = useSelector(
    (state) => state.currentOrder.orderUpdateLoading
  );

  defaultFilters.isOnPremise = currentChannel === "On Premise" ? true : false;
  defaultFilters.currentTerritoryId = territoryId;

  const handlePreview = (itemNumber) => {
    let item = currentItems.find((item) => item.itemNumber === itemNumber);
    handleCurrentItem(item);
    handlePreviewModal(true);
    dispatch(clearItemSelections());
  };

  const handleModalClose = () => {
    handlePreviewModal(false);
  };

  const handleAddToOrder = () => {
    let channel = currentChannel === "On Premise" ? "on_premise" : "retail";
    if (currentOrder.onDemandOrderItems.length === 0) {
      dispatch(
        createNewBulkItemOrder("onDemand", selectedItems, territoryId, channel)
      );
    } else
      dispatch(
        addBulkOrderItems(currentOrder.orderId, selectedItems, "onDemand")
      );
    dispatch(clearItemSelections());
  };

  useEffect(() => {
    if (
      (userId && !currentOrder.orderNumber) ||
      (userId && currentOrder.type !== "on-demand")
    ) {
      dispatch(fetchCurrentOrderByType("onDemand", userId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrder.type]);

  useInitialFilters(
    "item-onDemand",
    defaultFilters,
    retainFilters,
    dispatch,
    handleFilterDrawer,
    currentUserRole,
    orderTerritoryId,
    territoryId,
    orderChannel,
    currentChannel,
    isOrdering
  );

  useEffect(() => {
    if (!orderTerritoryId && isOrdering) {
      dispatch(setIsOrdering({ status: false }));
    }
  }, [orderTerritoryId, isOrdering, dispatch]);

  if (orderLoading) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>RTA | On-Demand Order</title>
        {currentUserRole === "field2" && !filtersOpen && (
          <script type="text/javascript">{`Beacon('suggest', ['600af2ff1c64ad47e4b7201d'], )`}</script>
        )}
        {currentUserRole === "field1" && !filtersOpen && (
          <script type="text/javascript">{`Beacon('suggest', ['5ffdf334b9a8501b295cf995'])`}</script>
        )}
      </Helmet>
      {previewModal && (
        <ItemPreviewModal
          type={"onDemand"}
          currentItem={currentItem}
          handleClose={handleModalClose}
          previewModal={previewModal}
        />
      )}
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText} variant="h5">
            Place an On-Demand Order
          </Typography>

          <div className={classes.innerConfigDiv}>
            {currentUserRole !== "read-only" && (
              <>
                <Button
                  className={classes.largeButton}
                  variant="contained"
                  color="secondary"
                  disabled={selectedItems.length === 0}
                  onClick={handleAddToOrder}
                  style={{ marginRight: "20px" }}
                >
                  ADD TO ORDER
                </Button>
                <Button
                  component={Link}
                  disabled={
                    isUpdateLoading ||
                    currentOrder.onDemandOrderItems.length === 0
                  }
                  to={
                    currentOrder.onDemandOrderItems.length > 0
                      ? `/orders/open/${currentOrder.onDemandOrderNumber}`
                      : "/orders/open/onDemand"
                  }
                  className={classes.largeButton}
                  variant="contained"
                  color="secondary"
                  style={{ marginRight: "20px" }}
                >
                  VIEW ORDER
                </Button>
              </>
            )}
            <Tooltip title="View List">
              <IconButton
                onClick={() => {
                  setView("list");
                }}
              >
                <ViewStreamIcon
                  fontSize="large"
                  color={currentView === "list" ? "primary" : "inherit"}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Grid">
              <IconButton
                onClick={() => {
                  setView("grid");
                }}
              >
                <ViewModuleIcon
                  fontSize="large"
                  color={currentView === "grid" ? "primary" : "inherit"}
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            marginBottom: "10px",
          }}
        >
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

        <OrderItemViewControl
          type={"onDemand"}
          currentView={currentView}
          handlePreview={handlePreview}
          items={currentItems}
          isItemsLoading={itemsLoading}
          scrollRef={scrollRef}
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

PlaceOnDemandOrder.propTypes = {
  userType: PropTypes.string,
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default PlaceOnDemandOrder;
