import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import OnDemandOrder from "../components/Purchasing/OnDemandOrder";
import SelectorMenus from "../components/Utility/SelectorMenus";
import OrderItemPreview from "../components/Purchasing/OrderItemPreview";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const CurrentOnDemandOrder = ({ userType }) => {
  const classes = useStyles();

  const [modal, handleModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({});

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
      <OrderItemPreview
        handleModalClose={handleModalClose}
        modal={modal}
        currentItem={currentItem}
      />
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText} variant="h5">
            Current On-Demand Order
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
        <OnDemandOrder userType={userType} handleModalOpen={handleModalOpen} />
      </Container>
    </>
  );
};

CurrentOnDemandOrder.propTypes = {
  userType: PropTypes.string,
};

export default CurrentOnDemandOrder;