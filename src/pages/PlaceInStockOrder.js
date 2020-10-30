import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

//import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useDispatch, useSelector } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

import {
  fetchCurrentOrderByType,
  addBulkOrderItems,
  createNewBulkItemOrder,
  clearItemSelections,
} from "../redux/slices/currentOrderSlice";

// import {
//   updateMultipleFilters,
//   setSorted,
// } from "../redux/slices/filterSlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import OrderItemViewControl from "../components/Purchasing/OrderItemViewControl";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";
import Loading from "../components/Utility/Loading";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import ViewStreamIcon from "@material-ui/icons/ViewStream";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const defaultFilters = {
  brand: [],
  itemType: [],
  bu: [],
  program: [],
  sequenceNum: "",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PlaceInStockOrder = ({ userType, handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  // const nextLink = useSelector((state) => state.items.nextLink);
  // const isNextLoading = useSelector(
  //   (state) => state.items.isNextLoading
  // );

  // const handleBottomScroll = () => {
  //   if (nextLink && !isNextLoading) {
  //     if (scrollRef.current.scrollTop !== 0) {
  //       dispatch(fetchNextItems(nextLink));
  //     }
  //   }
  // };

  // const scrollRef = useBottomScrollListener(handleBottomScroll);
  const [currentView, setView] = useCallback(useState("list"));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState({}));
  const currentItems = useSelector((state) => state.items.items);
  const itemsLoading = useSelector((state) => state.items.isLoading);
  const orderLoading = useSelector((state) => state.currentOrder.isLoading);
  const selectedItems = useSelector(
    (state) => state.currentOrder.selectedInStockItems
  );
  const currentOrder = useSelector((state) => state.currentOrder);
  const userId = useSelector((state) => state.user.id);
  const currentUserRole = useSelector((state) => state.user.role);
  const retainFilters = useSelector((state) => state.filters.retainFilters);

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
    if (currentOrder.inStockOrderItems.length === 0) {
      dispatch(createNewBulkItemOrder("inStock", selectedItems));
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

  if (orderLoading) {
    return <Loading />;
  }

  return (
    <>
      <ItemPreviewModal
        type={"inStock"}
        currentItem={currentItem}
        handleClose={handleModalClose}
        previewModal={previewModal}
      />

      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText} variant="h5">
            Place an In-Stock Order
          </Typography>

          <div className={classes.innerConfigDiv}>
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
            <Tooltip title="View Current Order">
              <IconButton
                component={Link}
                to={
                  currentOrder.inStockOrderItems.length > 0
                    ? `/orders/open/${currentOrder.inStockOrderNumber}`
                    : "/orders/open/inStock"
                }
              >
                <ExitToAppIcon fontSize="large" color="inherit" />
              </IconButton>
            </Tooltip>
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
        <>
          <OrderItemViewControl
            type={"inStock"}
            currentView={currentView}
            handlePreview={handlePreview}
            items={currentItems}
            isItemsLoading={itemsLoading}
          />
        </>
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
