import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

//import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useDispatch, useSelector } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

// import {
//   updateMultipleFilters,
//   setSorted,
// } from "../redux/slices/filterSlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import OrderItemViewControl from "../components/Purchasing/OrderItemViewControl";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import ViewStreamIcon from "@material-ui/icons/ViewStream";
import ViewModuleIcon from "@material-ui/icons/ViewModule";

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

const ItemCatalog = ({
  catalogType,
  userType,
  handleFilterDrawer,
  filtersOpen,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [currentView, setView] = useCallback(useState("list"));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState({}));
  // const nextLink = useSelector((state) => state.items.nextLink);
  // const isNextLoading = useSelector(
  //   (state) => state.items.isNextLoading
  // );

  // const handleBottomScroll = () => {
  //   if (nextLink && !isNextLoading) {
  //     if (scrollRef.current.scrollTop !== 0) {
  //       dispatch(fetchNextOrderHistory(nextLink));
  //     }
  //   }
  // };

  // const scrollRef = useBottomScrollListener(handleBottomScroll);
  const currentItems = useSelector((state) => state.items.items);
  const itemsLoading = useSelector((state) => state.items.isLoading);
  const currentUserRole = useSelector((state) => state.user.role);
  const selectedItems = useSelector((state) => state.items.selectedItems);
  const retainFilters = useSelector((state) => state.filters.retainFilters);

  const handlePreview = (itemNumber) => {
    let item = currentItems.find((item) => item.itemNumber === itemNumber);
    handleCurrentItem(item);
    handlePreviewModal(true);
  };

  const handleModalClose = () => {
    handlePreviewModal(false);
  };

  useInitialFilters(
    `item-${catalogType}`,
    defaultFilters,
    retainFilters,
    dispatch,
    handleFilterDrawer,
    currentUserRole
  );

  return (
    <>
      <ItemPreviewModal
        type={"catalog"}
        currentItem={currentItem}
        handleClose={handleModalClose}
        previewModal={previewModal}
      />
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText} variant="h5">
            Item Catalog
          </Typography>

          <div className={classes.innerConfigDiv}>
            <Button
              className={classes.largeButton}
              style={{ marginRight: "20px" }}
              variant="contained"
              color="secondary"
              disabled={selectedItems.length === 0}
            >
              ADD TO FAVORITES
            </Button>
            <Button
              className={classes.largeButton}
              style={{ marginRight: "20px" }}
              variant="contained"
              color="secondary"
              disabled={selectedItems.length === 0}
            >
              CREATE SHARE LINK
            </Button>
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
        <>
          <div
            style={{ display: "flex", alignItems: "center", height: "32px" }}
          >
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
          <OrderItemViewControl
            type={"catalog"}
            currentView={currentView}
            handlePreview={handlePreview}
            items={currentItems}
            catalogType={catalogType}
            isItemsLoading={itemsLoading}
          />
        </>
      </Container>
      <br />
    </>
  );
};

ItemCatalog.propTypes = {
  userType: PropTypes.string,
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default ItemCatalog;
