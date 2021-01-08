import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useDispatch, useSelector } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

import {
  fetchNextFilteredItems,
  clearItemSelection,
} from "../redux/slices/itemSlice";
import { updateSingleFilter, setSorted } from "../redux/slices/filterSlice";
import { addToFavoriteItems } from "../redux/slices/userSlice";
import {
  fetchSharedItemsByIds,
  clearSharedItems,
} from "../redux/slices/sharedItemsSlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import OrderItemViewControl from "../components/Purchasing/OrderItemViewControl";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";
import ItemShareModal from "../components/Utility/ItemShareModal";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import TuneIcon from '@material-ui/icons/Tune';
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
  orderType: "",
  itemNumber: "",
  itemDesc: "",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const ItemCatalog = ({ catalogType, handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [currentType, setCurrentType] = useCallback(useState(catalogType));
  const [currentView, setView] = useCallback(useState("list"));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState({}));
  const [currentLink, setCurrentLink] = useCallback(useState(null));
  const [isLinkModalOpen, setLinkModalOpen] = useCallback(useState(false));
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
  const currentItems = useSelector((state) => state.items.items);
  const itemsLoading = useSelector((state) => state.items.isLoading);
  const currentUserRole = useSelector((state) => state.user.role);
  const selectedItems = useSelector((state) => state.items.selectedItems);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const favoriteItems = useSelector((state) => state.user.favoriteItems);

  const handlePreview = (itemNumber) => {
    let item = currentItems.find((item) => item.itemNumber === itemNumber);
    handleCurrentItem(item);
    handlePreviewModal(true);
  };

  const handleModalClose = () => {
    handlePreviewModal(false);
  };

  const handleFavoriteItems = () => {
    const uniqueArray = [
      ...new Set(selectedItems.concat(favoriteItems.map((i) => i.id))),
    ];
    if (uniqueArray.length > 0) {
      dispatch(addToFavoriteItems(uniqueArray));
    }
    dispatch(clearItemSelection());
  };

  const handleShareLink = () => {
    dispatch(clearSharedItems());
    const baseUrl = window.location.origin;
    let urlString = `${baseUrl}/shared/items/${selectedItems.join("-")}`;
    dispatch(fetchSharedItemsByIds(selectedItems));
    setCurrentLink(urlString);
    setLinkModalOpen(true);
  };

  useEffect(() => {
    if (catalogType && currentType !== catalogType) {
      setCurrentType(catalogType);
      dispatch(
        updateSingleFilter({
          filter: "orderType",
          value: catalogType === "all" ? "" : catalogType,
        })
      );
      dispatch(setSorted());
    }
    defaultFilters.orderType = catalogType === "all" ? "" : catalogType;
  }, [currentType, catalogType, dispatch, setCurrentType]);

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
      {isLinkModalOpen && (
        <ItemShareModal
          modalOpen={isLinkModalOpen}
          handleClose={setLinkModalOpen}
          shareLink={currentLink}
        />
      )}
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
              onClick={handleFavoriteItems}
            >
              ADD TO FAVORITES
            </Button>
            <Button
              className={classes.largeButton}
              style={{ marginRight: "20px" }}
              variant="contained"
              color="secondary"
              disabled={selectedItems.length === 0}
              onClick={handleShareLink}
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
            className={classes.hoverText}
            style={{ display: "flex", alignItems: "center", height: "32px" }}
            onClick={() => {
              handleFilterDrawer(!filtersOpen);
            }}
          >
            <TuneIcon fontSize="small" color="secondary"/>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ margin: "10px 10px" }}
            >
              {filtersOpen ? "Hide Filters" : "Show Filters"}
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
            scrollRef={scrollRef}
          />
          {isNextLoading && (
            <div style={{ width: "100%" }}>
              <LinearProgress />
            </div>
          )}
          {!isNextLoading && (
            <div style={{ width: "100%", height: "4px" }}></div>
          )}
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
