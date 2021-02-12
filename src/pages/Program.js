import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";
import Helmet from "react-helmet";

import { useSelector, useDispatch } from "react-redux";
import { useWindowHash } from "../hooks/UtilityHooks";
import { useRetainFiltersOnPopstate } from "../hooks/UtilityHooks";

import {
  fetchItems,
  addItemToPreOrder,
  addPreOrderItems,
} from "../redux/slices/programsSlice";
import { fetchProgramOrders } from "../redux/slices/orderSetSlice";
import { addToFavoriteItems } from "../redux/slices/userSlice";
import { setRetain } from "../redux/slices/filterSlice";
import { clearItemSelection } from "../redux/slices/itemSlice";
import {
  fetchSharedItemsByIds,
  clearSharedItems,
} from "../redux/slices/sharedItemsSlice";

import ProgramDetails from "../components/Purchasing/ProgramDetails";
import OrderItemViewControl from "../components/Purchasing/OrderItemViewControl";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";
import OrderPatchLoading from "../components/Utility/OrderPatchLoading";
import ItemShareModal from "../components/Utility/ItemShareModal";

import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import ViewStreamIcon from "@material-ui/icons/ViewStream";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Program = ({ handleFiltersClosed, programId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [value, updateValue] = useCallback(useState(1));
  const [currentView, setView] = useCallback(useState("list"));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState({}));
  const [currentProgram, setCurrentProgram] = useCallback(useState(null));
  const [currentLink, setCurrentLink] = useCallback(useState(null));
  const [isLinkModalOpen, setLinkModalOpen] = useCallback(useState(false));
  const handleChangeTab = useWindowHash(["#details", "#items"], updateValue);

  const userId = useSelector((state) => state.user.id);
  const programs = useSelector((state) => state.programs.programs);
  const itemsLoading = useSelector((state) => state.programs.itemsIsLoading);
  const selectedItems = useSelector((state) => state.items.selectedItems);
  const preOrderId = useSelector((state) => state.orderSet.orderId);
  const favoriteItems = useSelector((state) => state.user.favoriteItems);
  const currentTerritory = useSelector((state) => state.user.currentTerritory);
  const currentUserRole = useSelector((state) => state.user.role);

  useEffect(() => {
    let program = programs.find((prog) => prog.id === programId);
    setCurrentProgram(program);
    if (program && program.items.length === 0 && !program.isItemsFetched) {
      dispatch(fetchItems(programId));
    }
  }, [programId, setCurrentProgram, programs, dispatch]);

  const handlePreview = (itemNumber) => {
    let item = currentProgram.items.find(
      (item) => item.itemNumber === itemNumber
    );
    handleCurrentItem(item);
    handlePreviewModal(true);
  };

  const handleModalClose = () => {
    handlePreviewModal(false);
  };

  const handleShareClose = () => {
    setLinkModalOpen(false);
    dispatch(clearItemSelection());
  };

  const handleAddItem = (itemId) => {
    dispatch(addItemToPreOrder(preOrderId, itemId));
    dispatch(addPreOrderItems({ ids: [itemId] }));
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

  useRetainFiltersOnPopstate("/programs", dispatch);

  useEffect(() => {
    dispatch(fetchProgramOrders(programId, userId, currentTerritory));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentProgram) {
    return <CircularProgress />;
  }

  return (
    <>
      <Helmet>
        <title>RTA | Program</title>
      </Helmet>
      {isLinkModalOpen && (
        <ItemShareModal
          modalOpen={isLinkModalOpen}
          handleClose={handleShareClose}
          shareLink={currentLink}
        />
      )}
      {previewModal && currentItem && (
        <ItemPreviewModal
          type="program"
          currentItem={currentItem}
          handleClose={handleModalClose}
          previewModal={previewModal}
        />
      )}
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <div className={classes.titleImage}>
            <Tooltip title="Back to All Programs" placement="bottom-start">
              <IconButton
                component={Link}
                to="/programs"
                onClick={() => {
                  dispatch(setRetain({ value: true }));
                }}
              >
                <ArrowBackIcon fontSize="large" color="secondary" />
              </IconButton>
            </Tooltip>
            <Typography
              className={classes.titleText}
              style={{ marginLeft: "5px", marginTop: "5px" }}
            >
              {`${currentProgram.name} - ${currentProgram.focusMonth}`}
            </Typography>
          </div>
          <div className={classes.configButtons}>
            <div className={classes.innerConfigDiv}>
              <Button
                className={classes.largeButton}
                style={{ marginRight: value !== 1 ? "20px" : "0px" }}
                variant="contained"
                color="secondary"
                startIcon={<ExitToAppIcon />}
                component={Link}
                to={`/orders/open/preorder#${programId}`}
              >
                ORDER
              </Button>
              {value !== 1 && (
                <>
                  {currentUserRole !== "read-only" && (
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
                  )}
                  <Button
                    className={classes.largeButton}
                    style={{ marginRight: "20px" }}
                    variant="contained"
                    color="secondary"
                    disabled={selectedItems.length === 0}
                    onClick={handleShareLink}
                  >
                    CREATE PDF
                  </Button>
                </>
              )}
              {value !== 1 && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
        <Tabs value={value} onChange={handleChangeTab} indicatorColor="primary">
          <Tab className={classes.headerText} label="Details" value={1} />
          <Tab className={classes.headerText} label="Items" value={2} />
        </Tabs>
        <Divider />
        <br />
        <br />

        {value === 1 && <ProgramDetails program={currentProgram} />}
        {value === 2 && (
          <>
            {itemsLoading ? (
              <CircularProgress />
            ) : (
              <OrderItemViewControl
                type={"catalog"}
                currentView={currentView}
                handlePreview={handlePreview}
                items={currentProgram.items}
                isItemsLoading={itemsLoading}
                addPreOrderItem={handleAddItem}
              />
            )}
          </>
        )}
      </Container>
      <br />
      <OrderPatchLoading />
    </>
  );
};

Program.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
  programId: PropTypes.string,
};

export default Program;
