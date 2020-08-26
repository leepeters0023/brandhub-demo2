import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import { useWindowHash } from "../hooks/UtilityHooks";

//mockdata
import items from "../assets/mockdata/Items";
import programs from "../assets/mockdata/Programs";

import ProgramDetails from "../components/Purchasing/ProgramDetails";
import ItemFilter from "../components/Utility/ItemFilter";
import OrderItemViewControl from "../components/Purchasing/OrderItemViewControl";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";

import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import ViewStreamIcon from "@material-ui/icons/ViewStream";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const units = ["Compass", "Popular", "Renaissance", "Spirits"];
const channels = ["Channel 1", "Channel 2", "Channel 3"];
const others = ["Growth Engines", "Key Brands", "High Potential"];
const brands = items.map((item) => item.brand);
const itemTypes = items.map((item) => item.itemType);

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  orderGrid: {
    display: "flex",
    justifyContent: "space-around",
  },
  filterDiv: {
    borderRight: "1px solid #4c4c4c",
    paddingRight: "15px",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      borderRight: "0px solid rgb(0,0,0,0)",
    },
  },
}));

const Program = ({ userType, programId }) => {
  const classes = useStyles();
  const [value, updateValue] = useCallback(useState(1));
  const [currentView, setView] = useCallback(useState("list"));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState({}));
  const [currentProgram, setCurrentProgram] = useCallback(useState(null));
  const handleChangeTab = useWindowHash(["#details", "#items"], updateValue)


  useEffect(() => {
    let program = programs.find((prog) => prog.id === programId);
    setCurrentProgram(program);
  
  }, [programId, setCurrentProgram]);

  const handlePreview = (itemNumber) => {
    let item = items.find(
      (item) => item.itemNumber === itemNumber
    );
    handleCurrentItem(item);
    handlePreviewModal(true);
  };

  const handleModalClose = () => {
    handlePreviewModal(false);
  };

  if (!currentProgram) {
    return <CircularProgress />;
  }

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
              type="preOrder"
              currentItem={currentItem}
              handleClose={handleModalClose}
              userType={userType}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <div className={classes.titleImage}>
            <Tooltip title="Back to All Programs" placement="bottom-start">
              <IconButton component={Link} to="/order#pre">
                <ArrowBackIcon fontSize="large" color="secondary" />
              </IconButton>
            </Tooltip>
            <Typography className={classes.titleText} variant="h5">
              {`${currentProgram.name} - ${currentProgram.focusMonth}`}
            </Typography>
          </div>
          <div className={classes.configButtons}>
            <div className={classes.innerConfigDiv}>
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
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChangeTab}
          indicatorColor="primary"
          centered
        >
          <Tab className={classes.headerText} label="Details" value={1} />
          <Tab className={classes.headerText} label="Items" value={2} />
        </Tabs>
        <br />
        <br />

        {value === 1 && <ProgramDetails program={currentProgram} />}
        {value === 2 && (
          <>
            <div style={{ display: "flex" }}>
              <ItemFilter
                brands={brands}
                units={units}
                channels={channels}
                itemTypes={itemTypes}
                others={others}
              />
              <div
                style={{
                  width: "133px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Tooltip placement="top" title="Add All to PDF">
                  <Button
                    variant="contained"
                    color="secondary"
                    id="addAllPdf"
                    style={{ marginRight: "2.5px" }}
                  >
                    <PictureAsPdfIcon className={classes.navIcon} />
                  </Button>
                </Tooltip>
              </div>
            </div>

            <OrderItemViewControl
              type={"program"}
              currentView={currentView}
              handlePreview={handlePreview}
              currentProgram={currentProgram}
            />
          </>
        )}
      </Container>
      <br />
    </>
  );
};

Program.propTypes = {
  userType: PropTypes.string,
  programId: PropTypes.string,
};

export default Program;
