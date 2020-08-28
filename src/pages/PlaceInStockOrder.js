import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

//mockdata
import items from "../assets/mockdata/Items";

import ItemFilter from "../components/Utility/ItemFilter";
import OrderItemViewControl from "../components/Purchasing/OrderItemViewControl";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";
import SelectorMenus from "../components/Utility/SelectorMenus";

import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import ViewStreamIcon from "@material-ui/icons/ViewStream";
import ViewModuleIcon from "@material-ui/icons/ViewModule";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const brands = items.map((item) => item.brand);
const itemTypes = items.map((item) => item.itemType);
const families = ["Wine", "Spirits", "Beer"];
const units = ["Compass", "Popular", "Renaissance", "Spirits"];
//const channels = ["Channel 1", "Channel 2", "Channel 3"];
const others = ["Growth Engines", "Key Brands", "High Potential"];

const PlaceInStockOrder = ({ userType }) => {
  const classes = useStyles();
  const [currentView, setView] = useCallback(useState("list"));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState({}));
  //const [itemFilters, setItemFilters] = useState([]);

  const handlePreview = (itemNumber) => {
    let item = items.find((item) => item.itemNumber === itemNumber);
    handleCurrentItem(item);
    handlePreviewModal(true);
  };

  const handleModalClose = () => {
    handlePreviewModal(false);
  };

  return (
    <>
      <div className={classes.relativeContainer}>
        <Dialog
          open={previewModal}
          onClose={handleModalClose}
          fullWidth
          maxWidth="lg"
        >
          <DialogContent>
            <ItemPreviewModal
              type={"inStock"}
              currentItem={currentItem}
              handleClose={handleModalClose}
              userType={userType}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText} variant="h5">
            Place an In-Stock Order
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
            {(userType === "super" || userType === "field2") && (
              <SelectorMenus type="cart" />
            )}
            <SelectorMenus type="regions" />
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
          <OrderItemViewControl
            type={"inStock"}
            currentView={currentView}
            handlePreview={handlePreview}
          />
        </>
      </Container>
      <br />
    </>
  );
};

PlaceInStockOrder.propTypes = {
  userType: PropTypes.string,
};

export default PlaceInStockOrder;
