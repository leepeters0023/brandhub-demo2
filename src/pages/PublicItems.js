import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";
import { fetchPublicItemsByIds } from "../redux/slices/publicItemsSlice";

import PublicItemPreview from "../components/PublicItems/PublicItemPreview";
import PublicItemViewControl from "../components/PublicItems/PublicItemViewControl";
import PublicFooter from "../components/PublicItems/PublicFooter";

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

const PublicItems = ({ handleFiltersClosed, itemIds }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [currentView, setView] = useCallback(useState("list"));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState(null));

  const isLoading = useSelector((state) => state.publicItems.isLoading);
  const items = useSelector((state) => state.publicItems.items);

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
    dispatch(fetchPublicItemsByIds(itemIds.split("-").join(",")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PublicItemPreview
        open={previewModal}
        handleClose={handleModalClose}
        item={currentItem}
      />
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
        <PublicItemViewControl
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

PublicItems.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
  itemIds: PropTypes.string,
}

export default PublicItems;
