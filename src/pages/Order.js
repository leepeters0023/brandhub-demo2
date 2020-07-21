import React, { useState } from "react";

import GalloLogo from "../assets/gallologo.png";

//mockdata
import items from "../assets/mockdata/Items";
import programs from "../assets/mockdata/Programs";

import ItemFilter from "../components/ItemFilter";
import OrderInStock from "../components/OrderInStock";
import OrderPreOrder from "../components/OrderPreOrder";
import ItemPreviewModal from "../components/ItemPreviewModal";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
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

const Order = () => {
  const classes = useStyles();
  const [value, updateValue] = useState(1);
  const [region, updateRegion] = useState("Region 1");
  const [currentView, setView] = useState("list");
  const [previewModal, handlePreviewModal] = useState(false);
  const [programModal, handleProgramModal] = useState(false);
  const [currentItem, handleCurrentItem] = useState({});
  const [currentProgram, handleCurrentProgram] = useState({});

  const handleChangeTab = (_evt, newValue) => {
    updateValue(newValue);
  };

  const handleChangeSelect = (evt) => {
    updateRegion(evt.target.value);
  };

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
    console.log(currentProgram);
    console.log(programModal);
  };

  const handleModalClose = () => {
    handlePreviewModal(false);
    handleProgramModal(false);
  };

  return (
    <>
      <Dialog
        open={previewModal}
        onClose={handleModalClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent>
          <ItemPreviewModal
            currentItem={currentItem}
            handleClose={handleModalClose}
          />
        </DialogContent>
      </Dialog>
      <Paper className={classes.paperContainer}>
        <div className={classes.titleBar}>
          <div className={classes.titleImage}>
            <img className={classes.logo} src={GalloLogo} alt="Gallo" />
            <Typography className={classes.titleText} variant="h5">
              Place an Order
            </Typography>
          </div>
          <div>
            <FormControl variant="outlined">
              <InputLabel id="region-select">Region</InputLabel>
              <Select
                labelId="region-select"
                id="regions"
                value={region}
                onChange={handleChangeSelect}
                label="Region"
              >
                <MenuItem value={"Region 1"}>Region 1</MenuItem>
                <MenuItem value={"Region 2"}>Region 2</MenuItem>
                <MenuItem value={"Region 3"}>Region 3</MenuItem>
              </Select>
            </FormControl>
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
        <Grid container spacing={5} className={classes.orderGrid}>
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
              <OrderInStock
                currentView={currentView}
                handlePreview={handlePreview}
              />
            </Grid>
          )}
          {value === 3 && (
            <Grid item md={9}>
              <OrderInStock
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

export default Order;
