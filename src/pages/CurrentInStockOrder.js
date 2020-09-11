import React, { useState, useCallback } from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import InStockOrder from "../components/Purchasing/InStockOrder";
import OrderItemPreview from "../components/Purchasing/OrderItemPreview";
//import RegionSelector from "../components/Utility/RegionSelector";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const CurrentInStockOrder = ({ userType }) => {
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
            Current In-Stock Order
          </Typography>
          <div className={classes.configButtons}>
            <div className={classes.innerConfigDiv}>
            <Tooltip title="Add Items to Order">
              <IconButton component={Link} to="/orders/items/instock">
                <ExitToAppIcon fontSize="large" color="inherit" style={{transform: "rotate(180deg)"}}/>
              </IconButton>
            </Tooltip>
            </div>
          </div>
        </div>
        <br />
        <InStockOrder userType={userType} handleModalOpen={handleModalOpen} />
      </Container>
    </>
  );
};

CurrentInStockOrder.propTypes = {
  userType: PropTypes.string,
};

export default CurrentInStockOrder;
