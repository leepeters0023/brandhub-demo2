import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import { useDispatch, useSelector } from "react-redux";

import { fetchFilteredItems } from "../redux/slices/itemSlice";

import { fetchCurrentOrderByType } from "../redux/slices/currentOrderSlice";

import {
  brands,
  itemTypes,
  families,
  units,
  others,
} from "../utility/constants";

import ItemFilter from "../components/Utility/ItemFilter";
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

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PlaceOnDemandOrder = ({ userType }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [currentView, setView] = useCallback(useState("list"));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState({}));
  //const [itemFilters, setItemFilters] = useState([]);
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
    if (currentItems.length === 0 && userType && currentUserRole.length > 0) {
      dispatch(fetchFilteredItems("onDemand"));
    }
  }, [currentItems, dispatch, userType, currentUserRole]);

  useEffect(()=>{
    if ((userId && !currentOrder.orderNumber && currentOrder.items.length === 0) || (userId && currentOrder.type !== "on-demand")) {
      dispatch(fetchCurrentOrderByType("onDemand", userId))
    }
    // return () => {dispatch(clearCurrentOrder())}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrder.type])

  if (orderLoading) {
    return <Loading />
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
              <IconButton component={Link} to="/orders/open/onDemand">
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
            {/* <RegionSelector /> */}
          </div>
        </div>

        <br />
        <>
          <ItemFilter
            brands={brands}
            itemTypes={itemTypes}
            families={families}
            units={units}
            others={others}
          />
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
};

export default PlaceOnDemandOrder;
