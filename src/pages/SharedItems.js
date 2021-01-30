import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

import { useDispatch, useSelector } from "react-redux";
import { fetchSharedItemsByIds } from "../redux/slices/sharedItemsSlice";

import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";
import SharedItemViewControl from "../components/SharedItems/SharedItemViewControl";
import PublicFooter from "../components/SharedItems/SharedFooter";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import ViewStreamIcon from "@material-ui/icons/ViewStream";
import ViewModuleIcon from "@material-ui/icons/ViewModule";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const SharedItems = ({ handleFiltersClosed, itemIds }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [currentView, setView] = useCallback(useState("list"));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState(null));

  const isLoading = useSelector((state) => state.sharedItems.isLoading);
  const items = useSelector((state) => state.sharedItems.items);

  const handleModalOpen = (id) => {
    let item = items.find((item) => item.id === id);
    handleCurrentItem(item);
    handlePreviewModal(true);
  };

  const handleModalClose = () => {
    handleCurrentItem(null);
    handlePreviewModal(false);
  };

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(fetchSharedItemsByIds(itemIds.split("-").join(",")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet><title>RTA | Shared Items</title>

      </Helmet>
      {currentItem && previewModal && (
        <ItemPreviewModal
          type="catalog"
          previewModal={previewModal}
          handleClose={handleModalClose}
          currentItem={currentItem}
        />
      )}
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText} variant="h5">
            Shared Items
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
        <SharedItemViewControl
          currentView={currentView}
          items={items}
          handlePreview={handleModalOpen}
          isItemsLoading={isLoading}
        />
      </Container>
      <PublicFooter />
    </>
  );
};

SharedItems.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
  itemIds: PropTypes.string,
};

export default SharedItems;
