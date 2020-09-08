import React, { useState, useCallback, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  brands,
  itemTypes,
  families,
  units,
  others,
} from "../utility/constants";

import { fetchFilteredItems } from "../redux/slices/itemSlice";

import ItemFilter from "../components/Utility/ItemFilter";
import OrderItemViewControl from "../components/Purchasing/OrderItemViewControl";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";

import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
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

const ItemCatalog = ({ userType }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [currentView, setView] = useCallback(useState("list"));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState({}));
  const currentItems = useSelector((state) => state.items.items);
  const itemsLoading = useSelector((state) => state.items.isLoading);

  const handlePreview = (itemNumber) => {
    let item = currentItems.find((item) => item.itemNumber === itemNumber);
    handleCurrentItem(item);
    handlePreviewModal(true);
  };

  const handleModalClose = () => {
    handlePreviewModal(false);
  };

  useEffect(() => {
    if (currentItems.length === 0 && userType) {
      dispatch(fetchFilteredItems("catalog"));
    }
  }, [currentItems, dispatch, userType]);

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
              type={null}
              currentItem={currentItem}
              handleClose={handleModalClose}
              userType={null}
            />
          </DialogContent>
        </Dialog>
      </div>
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
              type={"catalog"}
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

export default ItemCatalog;
