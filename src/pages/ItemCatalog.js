import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { fetchFilteredItems } from "../redux/slices/itemSlice";

import { setFilterType } from "../redux/slices/filterSlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import OrderItemViewControl from "../components/Purchasing/OrderItemViewControl";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import ViewStreamIcon from "@material-ui/icons/ViewStream";
import ViewModuleIcon from "@material-ui/icons/ViewModule";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const ItemCatalog = ({ catalogType, userType, handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [currentView, setView] = useCallback(useState("list"));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState({}));
  const currentItems = useSelector((state) => state.items.items);
  const itemsLoading = useSelector((state) => state.items.isLoading);
  const currentUserRole = useSelector((state) => state.user.role);

  const handlePreview = (itemNumber) => {
    let item = currentItems.find((item) => item.itemNumber === itemNumber);
    handleCurrentItem(item);
    handlePreviewModal(true);
  };

  const handleModalClose = () => {
    handlePreviewModal(false);
  };

  useEffect(() => {
    dispatch(setFilterType({ type: "item" }));
    handleFilterDrawer(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentItems.length === 0 && userType && currentUserRole.length > 0) {
      dispatch(fetchFilteredItems("catalog"));
    }
  }, [currentItems, dispatch, userType, currentUserRole]);

  return (
    <>
      <ItemPreviewModal
        type={null}
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
          {itemsLoading ? (
            <CircularProgress />
          ) : (
            <OrderItemViewControl
              type={"catalog"}
              currentView={currentView}
              handlePreview={handlePreview}
              items={currentItems}
              catalogType={catalogType}
            />
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
