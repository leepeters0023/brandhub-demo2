import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import { useSelector, useDispatch } from "react-redux";
import { useWindowHash } from "../hooks/UtilityHooks";
import { useRetainFiltersOnPopstate } from "../hooks/UtilityHooks";

import { fetchItems } from "../redux/slices/programsSlice";

import { setRetain } from "../redux/slices/filterSlice";

import ProgramDetails from "../components/Purchasing/ProgramDetails";
import OrderItemViewControl from "../components/Purchasing/OrderItemViewControl";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";

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
//import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Program = ({ userType, handleFiltersClosed, programId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [value, updateValue] = useCallback(useState(1));
  const [currentView, setView] = useCallback(useState("list"));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState({}));
  const [currentProgram, setCurrentProgram] = useCallback(useState(null));
  const handleChangeTab = useWindowHash(["#details", "#items"], updateValue);

  const programs = useSelector((state) => state.programs.programs);
  const itemsLoading = useSelector((state) => state.programs.itemsIsLoading);
  const selectedItems = useSelector((state) => state.items.selectedItems);

  useEffect(() => {
    let program = programs.find((prog) => prog.id === programId);
    setCurrentProgram(program);
    if (program && program.items.length === 0) {
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

  useRetainFiltersOnPopstate("/programs", dispatch)

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentProgram) {
    return <CircularProgress />;
  }

  return (
    <>
      <ItemPreviewModal
        type="program"
        currentItem={currentItem}
        handleClose={handleModalClose}
        previewModal={previewModal}
      />

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
              {value !== 1 && (
                <>
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
                </>
              )}
              {userType === "field1" && (
                <Tooltip title="Place Program Pre-Order">
                  <IconButton
                    component={Link}
                    to={`/orders/open/preorder#${programId}`}
                  >
                    <ExitToAppIcon fontSize="large" color="inherit" />
                  </IconButton>
                </Tooltip>
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
              />
            )}
          </>
        )}
      </Container>
      <br />
    </>
  );
};

Program.propTypes = {
  userType: PropTypes.string.isRequired,
  handleFiltersClosed: PropTypes.func.isRequired,
  programId: PropTypes.string,
};

export default Program;
