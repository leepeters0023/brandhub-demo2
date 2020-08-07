import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import GalloLogo from "../assets/gallologo.png";

import SelectorMenus from "../components/Utility/SelectorMenus";

//mockdata
import items from "../assets/mockdata/Items";
import programs from "../assets/mockdata/Programs";

import ItemFilter from "../components/Utility/ItemFilter";
import ProgramFilter from "../components/Utility/ProgramFilter";
import ProgramSort from "../components/Utility/ProgramSort";
import OrderItemViewControl from "../components/Purchasing/OrderItemViewControl";
import OrderPreOrder from "../components/Purchasing/OrderPreOrder";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";

import { useProgramSort } from "../hooks/UtilityHooks";

import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
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
}));

const brands = items.map((item) => item.brand);
const itemTypes = items.map((item) => item.itemType);
const focusMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const units = ["Compass", "Popular", "Renaissance", "Spirits"];
const channels = ["Channel 1", "Channel 2", "Channel 3"];
const others = ["Growth Engines", "Key Brands", "High Potential"];

const PlaceOrder = ({ userType }) => {
  const classes = useStyles();
  const [value, updateValue] = useState(1);
  const [currentView, setView] = useState("list");
  const [previewModal, handlePreviewModal] = useState(false);
  const [currentItem, handleCurrentItem] = useState({});
  const [sortOption, setSortOption] = useState("brand");
  const [programFilters, setProgramFilters] = useState([]);
  //const [itemFilters, setItemFilters] = useState([]);
  const currentPrograms = useProgramSort(programs, sortOption, programFilters);

  const handleChangeTab = (_evt, newValue) => {
    if (newValue === 1) {
      window.location.hash = "#pre";
    } else if (newValue === 2) {
      window.location.hash = "#instock";
    } else if (newValue === 3) {
      window.location.hash = "#ondemand";
    }
    updateValue(newValue);
  };

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

  useEffect(() => {
    if (window.location.hash === "#pre") {
      updateValue(1);
    } else if (window.location.hash === "#instock") {
      updateValue(2);
    } else if (window.location.hash === "#ondemand") {
      updateValue(3);
    }
  }, []);

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
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <div className={classes.titleImage}>
            <img className={classes.logo} src={GalloLogo} alt="Gallo" />
            <Typography className={classes.titleText} variant="h5">
              Place an Order
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
          <Tab className={classes.headerText} label="Pre-Order" value={1} />
          <Tab className={classes.headerText} label="In-Stock" value={2} />
          <Tab className={classes.headerText} label="On-Demand" value={3} />
        </Tabs>
        <br />
        <br />
        {value === 1 && (
          <>
            <div style={{ display: "flex" }}>
              <ProgramFilter
                brands={brands}
                focusMonths={focusMonths}
                units={units}
                setProgramFilters={setProgramFilters}
              />
              <ProgramSort setSortOption={setSortOption} />
            </div>
            <OrderPreOrder currentPrograms={currentPrograms} />
          </>
        )}
        {value !== 1 && (
          <>
            <ItemFilter
              brands={brands}
              itemTypes={itemTypes}
              units={units}
              channels={channels}
              others={others}
            />
            {value === 2 && (
              <OrderItemViewControl
                type={"inStock"}
                currentView={currentView}
                handlePreview={handlePreview}
              />
            )}
            {value === 3 && (
              <OrderItemViewControl
                type={"onDemand"}
                currentView={currentView}
                handlePreview={handlePreview}
              />
            )}
          </>
        )}
      </Container>
      <br />
    </>
  );
};

PlaceOrder.propTypes = {
  userType: PropTypes.string,
};

export default PlaceOrder;
