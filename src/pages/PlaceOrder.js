import React, { useState, useEffect } from "react";

import GalloLogo from "../assets/gallologo.png";

import SelectorMenus from "../components/SelectorMenus";

//mockdata
import items from "../assets/mockdata/Items";
import programs from "../assets/mockdata/Programs";

import ItemFilter from "../components/ItemFilter";
import OrderItemViewControl from "../components/OrderItemViewControl";
import OrderPreOrder from "../components/OrderPreOrder";
import ItemPreviewModal from "../components/ItemPreviewModal";
import ProgramModal from "../components/ProgramModal";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import ViewStreamIcon from "@material-ui/icons/ViewStream";
import ViewModuleIcon from "@material-ui/icons/ViewModule";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  orderGrid: {
    display: "flex",
    justifyContent: "space-around",
  },
}));

let brands = items.map((item) => item.brand);
let itemTypes = items.map((item) => item.itemType);

const PlaceOrder = ({ userType }) => {
  const classes = useStyles();
  const [value, updateValue] = useState(1);
  const [currentView, setView] = useState("list");
  const [previewModal, handlePreviewModal] = useState(false);
  const [programModal, handleProgramModal] = useState(false);
  const [currentItem, handleCurrentItem] = useState({});
  const [currentProgram, handleCurrentProgram] = useState({});

  const handleChangeTab = (_evt, newValue) => {
    if (newValue === 1) {
      window.location.hash = "#pre"
    } else if (newValue === 2) {
      window.location.hash = "#instock"
    } else if (newValue === 3) {
      window.location.hash = "#ondemand"
    }
    updateValue(newValue);
  };

  useEffect(()=>{
    if(window.location.hash === "#pre"){
      updateValue(1);
    } else if (window.location.hash === "#instock") {
      updateValue(2)
    } else if (window.location.hash === "#ondemand") {
      updateValue(3)
    }
  },[])

  const handlePreview = (evt) => {
    let item = items.find(
      (item) => item.itemNumber === parseInt(evt.target.id)
    );
    handleCurrentItem(item);
    handlePreviewModal(true);
  };

  const handleProgram = (evt) => {
    let prog = programs.find((prog) => prog.id === evt.target.id);
    handleCurrentProgram(prog);
    handleProgramModal(true);
  };

  const handleModalClose = () => {
    handlePreviewModal(false);
    handleProgramModal(false);
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
              type={value === 2 ? "inStock" : "onDemand"}
              currentItem={currentItem}
              handleClose={handleModalClose}
              userType={userType}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className={classes.relativeContainer}>
        <Dialog
          open={programModal}
          onClose={handleModalClose}
          fullWidth
          maxWidth="xl"
        >
          <DialogTitle>
            <Typography className={classes.titleText}>
              {currentProgram.name}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <ProgramModal
              program={currentProgram}
              items={items}
              handleClose={handleModalClose}
              userType={userType}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Paper className={classes.paperContainer}>
        <div className={classes.titleBar}>
          <div className={classes.titleImage}>
            <img className={classes.logo} src={GalloLogo} alt="Gallo" />
            <Typography className={classes.titleText} variant="h5">
              Place an Order
            </Typography>
          </div>
          <div>
            {userType !== "field1" && <SelectorMenus type="bdms" />}
            <SelectorMenus type="regions" />
            {value !== 1 && (
              <div className={classes.configButtons}>
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
            )}
          </div>
        </div>
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChangeTab}
          indicatorColor="primary"
          centered
        >
          <Tab className={classes.headerText} label="Pre-Order" value={1} />
          <Tab className={classes.headerText} label="In-Stock" value={2} />
          <Tab className={classes.headerText} label="On-Demand" value={3} />
        </Tabs>
        <br />
        <br />
        <Grid
          container
          spacing={5}
          className={classes.orderGrid}
          justify="space-around"
        >
          <Grid item md={2}>
            <br />
            <ItemFilter brands={brands} itemTypes={itemTypes} />
          </Grid>
          <Divider orientation="vertical" flexItem />
          {value === 1 && (
            <Grid item md={9}>
              <OrderPreOrder
                currentPrograms={programs}
                handleProgram={handleProgram}
              />
            </Grid>
          )}
          {value === 2 && (
            <Grid item md={9}>
              <OrderItemViewControl
                type={"inStock"}
                currentView={currentView}
                handlePreview={handlePreview}
              />
            </Grid>
          )}
          {value === 3 && (
            <Grid item md={9}>
              <OrderItemViewControl
                type={"onDemand"}
                currentView={currentView}
                handlePreview={handlePreview}
              />
            </Grid>
          )}
        </Grid>
      </Paper>
    </>
  );
};

export default PlaceOrder;
