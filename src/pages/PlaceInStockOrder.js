import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useDispatch, useSelector } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

import { fetchNextFilteredItems } from "../redux/slices/itemSlice";

import {
  fetchCurrentOrderByType,
  addBulkOrderItems,
  createNewBulkItemOrder,
  clearItemSelections,
} from "../redux/slices/currentOrderSlice";
import { updateSingleFilter, setSorted } from "../redux/slices/filterSlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import OrderItemViewControl from "../components/Purchasing/OrderItemViewControl";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";
import AddInventoryModal from "../components/Purchasing/AddInventoryModal";
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
  orderType: "in-stock",
  itemNumber: "",
  itemDesc: "",
  isItemVisible: true,
  isItemOrderable: true,
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PlaceInStockOrder = ({ handleFilterDrawer, filtersOpen }) => {
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

  const scrollRef = useBottomScrollListener(handleBottomScroll);
  const [currentView, setView] = useCallback(useState("list"));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState({}));
  const [invItemId, setInvItemId] = useCallback(useState(null));
  const [isAddInvModalOpen, setAddInvModalOpen] = useCallback(useState(false));
  const currentItems = useSelector((state) => state.items.items);
  const currentMarket = useSelector((state) => state.user.currentMarket);
  const currentMarketBool = useSelector((state) => state.filters.isOnPremise);
  const itemsLoading = useSelector((state) => state.items.isLoading);
  const orderLoading = useSelector((state) => state.currentOrder.isLoading);
  const selectedItems = useSelector(
    (state) => state.currentOrder.selectedInStockItems
  );
  const currentOrder = useSelector((state) => state.currentOrder);
  const userId = useSelector((state) => state.user.id);
  const currentUserRole = useSelector((state) => state.user.role);
  const territoryId = useSelector((state) => state.user.currentTerritory);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const isUpdateLoading = useSelector(
    (state) => state.currentOrder.orderUpdateLoading
  );

  defaultFilters.isOnPremise = currentMarket === "On Premise" ? true : false;
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

  const handleAddInvClose = () => {
    setAddInvModalOpen(false);
    setInvItemId(null);
  };

  const handleAddInvOpen = (id) => {
    setInvItemId(id);
    setAddInvModalOpen(true);
  };

  const handleAddToOrder = () => {
    if (currentOrder.inStockOrderItems.length === 0) {
      dispatch(createNewBulkItemOrder("inStock", selectedItems, territoryId));
    } else
      dispatch(
        addBulkOrderItems(currentOrder.orderId, selectedItems, "inStock")
      );
    dispatch(clearItemSelections());
  };

  useEffect(() => {
    if (
      (userId && !currentOrder.orderNumber) ||
      (userId && currentOrder.type !== "in-stock")
    ) {
      dispatch(fetchCurrentOrderByType("inStock", userId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInitialFilters(
    "item-inStock",
    defaultFilters,
    retainFilters,
    dispatch,
    handleFilterDrawer,
    currentUserRole
  );

  useEffect(() => {
    if (
      (currentMarket === "On Premise" && !currentMarketBool) ||
      (currentMarket === "Retail" && currentMarketBool)
    ) {
      dispatch(
        updateSingleFilter({ filter: "isOnPremise", value: !currentMarketBool })
      );
      dispatch(setSorted());
    }
  }, [currentMarket, currentMarketBool, dispatch]);

  if (orderLoading) {
    return <Loading />;
  }

  return (
    <>
      {previewModal && (
        <ItemPreviewModal
          type={"inStock"}
          currentItem={currentItem}
          handleClose={handleModalClose}
          previewModal={previewModal}
        />
      )}
      {isAddInvModalOpen && invItemId && (
        <AddInventoryModal
          itemId={invItemId}
          handleClose={handleAddInvClose}
          open={isAddInvModalOpen}
        />
      )}
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText} variant="h5">
            Place an In-Stock Order
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
                    currentOrder.inStockOrderItems.length === 0
                  }
                  to={
                    currentOrder.inStockOrderItems.length > 0
                      ? `/orders/open/${currentOrder.inStockOrderNumber}`
                      : "/orders/open/inStock"
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
          <FilterChipList classes={classes} />
        </div>
        <br />

        <OrderItemViewControl
          type={"inStock"}
          currentView={currentView}
          handlePreview={handlePreview}
          handleAddInvOpen={handleAddInvOpen}
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

PlaceInStockOrder.propTypes = {
  userType: PropTypes.string,
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default PlaceInStockOrder;
