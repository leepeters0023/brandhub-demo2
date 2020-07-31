import React, { useState, useEffect } from "react";

import GalloLogo from "../assets/gallologo.png";

//mockdata
import items from "../assets/mockdata/Items";
import programs from "../assets/mockdata/Programs";

import ProgramDetails from "../components/ProgramDetails";
import SelectorMenus from "../components/SelectorMenus";
import ItemFilter from "../components/ItemFilter";
import OrderItemViewControl from "../components/OrderItemViewControl";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";

import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import ViewStreamIcon from "@material-ui/icons/ViewStream";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

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

let brands = items.map((item) => item.brand);
let itemTypes = items.map((item) => item.itemType);

const Program = ({ userType, programId }) => {
  const classes = useStyles();
  const [value, updateValue] = useState(1);
  const [currentView, setView] = useState("list");
  const [previewModal, handlePreviewModal] = useState(false);
  const [currentItem, handleCurrentItem] = useState({});
  const [currentProgram, setCurrentProgram] = useState(null);

  const handleChangeTab = (_evt, newValue) => {
    if (newValue === 1) {
      window.location.hash = "#details";
    } else if (newValue === 2) {
      window.location.hash = "#items";
    }
    updateValue(newValue);
  };

  useEffect(() => {
    let program = programs.find((prog) => prog.id === programId);
    setCurrentProgram(program);
    if (window.location.hash === "#details") {
      updateValue(1);
    } else if (window.location.hash === "#items") {
      updateValue(2);
    }
  }, [programId]);

  const handlePreview = (evt) => {
    let item = items.find(
      (item) => item.itemNumber === parseInt(evt.target.id)
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
            <img className={classes.logo} src={GalloLogo} alt="Gallo" />
            <Typography className={classes.titleText} variant="h5">
              {currentProgram.name}
            </Typography>
          </div>
          <div className={classes.configButtons}>
            <div className={classes.innerConfigDiv}>
              {userType !== "field1" && <SelectorMenus type="cart" />}
              <SelectorMenus type="regions" />
            </div>
            <div className={classes.innerConfigDiv}>
              <Tooltip title="View Current PDF">
                <IconButton>
                  <PictureAsPdfIcon fontSize="large" />
                </IconButton>
              </Tooltip>
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
        <Divider classes={{ root: classes.pageBreak }} />
        <br />

        {value === 1 && <ProgramDetails program={currentProgram} />}
        {value === 2 && (
            <>
             
              
                <ItemFilter brands={brands} itemTypes={itemTypes} />
              
            
            
              <OrderItemViewControl
                type={"preOrder"}
                currentView={currentView}
                handlePreview={handlePreview}
              />
            </>
        )}
      </Container>
      <br />
    </>
  );
};

export default Program;
