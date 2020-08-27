import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useWindowHash } from "../hooks/UtilityHooks";

import CurrentPreOrder from "../components/Purchasing/CurrentPreOrder";
import OrdersCurrentTable from "../components/OrderHistory/OrdersCurrentTable";
import CurrentInStockOrder from "../components/Purchasing/InStockOrder";
import CurrentOnDemandOrder from "../components/Purchasing/OnDemandOrder";
import SelectorMenus from "../components/Utility/SelectorMenus";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import CancelIcon from "@material-ui/icons/Cancel";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  previewModal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  cartPreviewImage: {
    width: "60%",
    height: "auto",
  },
}));

const CurrentOrders = ({ userType }) => {
  const classes = useStyles();

  const [value, updateValue] = useCallback(useState(1));
  const [modal, handleModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const handleChangeTab = useWindowHash(
    ["#preorder", "#instock", "#ondemand", "#status"],
    updateValue
  );

  const handleModalClose = () => {
    handleModal(false);
  };

  const handleModalOpen = useCallback((img, brand, itemType, itemNumber) => {
    setCurrentItem({
      imgUrl: img,
      brand: brand,
      itemType: itemType,
      itemNumber: itemNumber,
    });
    handleModal(true);
  }, []);

  return (
    <>
      <div className={classes.relativeContainer}>
        <Dialog open={modal} onClose={handleModalClose} fullWidth maxWidth="sm">
          <DialogContent>
            <IconButton
              className={classes.closeButton}
              onClick={handleModalClose}
            >
              <CancelIcon fontSize="large" color="secondary" />
            </IconButton>
            <div className={classes.previewModal}>
              <img
                className={classes.cartPreviewImage}
                src={currentItem.imgUrl}
                alt={currentItem.itemNumber}
              />
              <br />
              <Typography
                className={classes.bodyText}
                variant="body1"
              >{`${currentItem.brand} ${currentItem.itemType}`}</Typography>
              <Typography
                variant="body2"
                color="textSecondary"
              >{`${currentItem.itemNumber}`}</Typography>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText} variant="h5">
            Current Orders
          </Typography>
          <div className={classes.configButtons}>
            <div className={classes.innerConfigDiv}>
              {(userType === "super" || userType === "field2") && (
                <SelectorMenus type="cart" />
              )}
              <SelectorMenus type="regions" />
            </div>
          </div>
        </div>
        <br />
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChangeTab}
          indicatorColor="primary"
          centered
        >
          <Tab className={classes.headerText} label="Pre Order" value={1} />
          <Tab className={classes.headerText} label="In-Stock" value={2} />
          <Tab className={classes.headerText} label="On-Demand" value={3} />
          <Tab className={classes.headerText} label="Order Status" value={4} />
        </Tabs>
        <br />
        {value === 1 && (
          <CurrentPreOrder
            userType={userType}
            handleModalOpen={handleModalOpen}
          />
        )}
        {value === 2 && (
          <CurrentInStockOrder
            userType={userType}
            handleModalOpen={handleModalOpen}
          />
        )}
        {value === 3 && (
          <CurrentOnDemandOrder
            userType={userType}
            handleModalOpen={handleModalOpen}
          />
        )}
        {value === 4 && <OrdersCurrentTable />}
      </Container>
    </>
  );
};

CurrentOrders.propTypes = {
  userType: PropTypes.string,
};

export default CurrentOrders;
