import React, { useState } from "react";

import OrderPreOrderCart from "../components/Purchasing/OrderPreOrderCart";
import OrderCart from "../components/Purchasing/OrderCart";
import SelectorMenus from "../components/Utility/SelectorMenus";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  previewModal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  cartPreviewImage: {
    width: "60%",
    height: "auto"
  }
}));

const Cart = ({ userType }) => {
  const classes = useStyles();

  const [value, updateValue] = useState(1);
  const [modal, handleModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({});

  const handleChangeTab = (_evt, newValue) => {
    updateValue(newValue);
  };

  const handleModalClose = () => {
    handleModal(false);
  };

  const handleModalOpen = (img, brand, itemType, itemNumber) => {
    setCurrentItem({
      imgUrl: img,
      brand: brand,
      itemType: itemType,
      itemNumber: itemNumber,
    });
    handleModal(true);
  };

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
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography className={classes.titleText} variant="h5">
            Your Cart
          </Typography>
          {userType !== "field1" && (
            <div className={classes.formControl}>
              <SelectorMenus type="cart" />
            </div>
          )}
        </div>
        <br />
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
        <Divider className={classes.pageBreak} />
        <br />
        {value === 1 && (
          <OrderPreOrderCart
            userType={userType}
            handleModalOpen={handleModalOpen}
          />
        )}
        {value === 2 && (
          <OrderCart userType={userType} handleModalOpen={handleModalOpen} />
        )}
        {value === 3 && (
          <OrderCart userType={userType} handleModalOpen={handleModalOpen} />
        )}
      </Container>
      <br />
    </>
  );
};

export default Cart;
