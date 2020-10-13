import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import { useDispatch, useSelector } from "react-redux";

import { fetchCurrentOrderByType } from "../redux/slices/currentOrderSlice";

import {
  setFilterType,
  setDefaultFilters,
  updateMultipleFilters,
  //setSorted,
  setClear,
} from "../redux/slices/filterSlice";

import FilterChipList from "../components/Filtering/FilterChipList";
import OrderItemViewControl from "../components/Purchasing/OrderItemViewControl";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";
import Loading from "../components/Utility/Loading";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
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
}

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PlaceOnDemandOrder = ({ userType, handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [currentView, setView] = useCallback(useState("list"));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState({}));
  const currentItems = useSelector((state) => state.items.items);
  const itemsLoading = useSelector((state) => state.items.isLoading);
  const currentUserRole = useSelector((state) => state.user.role);
  const orderLoading = useSelector((state) => state.currentOrder.isLoading);
  const currentOrder = useSelector((state) => state.currentOrder);
  const userId = useSelector((state) => state.user.id);

  const handlePreview = (itemNumber) => {
    let item = currentItems.find((item) => item.itemNumber === itemNumber);
    handleCurrentItem(item);
    handlePreviewModal(true);
  };

  const handleModalClose = () => {
    handlePreviewModal(false);
  };

  useEffect(() => {
    dispatch(setFilterType({ type: "item-onDemand" }));
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

  useEffect(() => {
    if (
      (userId && !currentOrder.orderNumber) ||
      (userId && currentOrder.type !== "on-demand")
    ) {
      dispatch(fetchCurrentOrderByType("onDemand", userId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrder.type]);

  useEffect(() => {
    if (currentUserRole.length > 0) {
      dispatch(setClear());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (orderLoading) {
    return <Loading />;
  }

  return (
    <>
      <ItemPreviewModal
        type={"onDemand"}
        currentItem={currentItem}
        handleClose={handleModalClose}
        previewModal={previewModal}
      />

      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText} variant="h5">
            Place an On-Demand Order
          </Typography>

          <div className={classes.innerConfigDiv}>
            <Tooltip title="View Current Order">
              <IconButton
                component={Link}
                to={
                  currentOrder.onDemandOrderItems.length > 0
                    ? `/orders/open/${currentOrder.onDemandOrderNumber}`
                    : "/orders/open/onDemand"
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
        <>
          {itemsLoading ? (
            <CircularProgress />
          ) : (
            <OrderItemViewControl
              type={"onDemand"}
              currentView={currentView}
              handlePreview={handlePreview}
              items={currentItems}
            />
          )}
        </>
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
