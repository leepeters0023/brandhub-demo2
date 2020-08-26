import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  orderConfirmationModal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: "250px",
  }
}));

const OrderConfirmation = ({
  item,
  type,
  handleModalClose
}) => {
  const classes = useStyles();

  return (
    <>
      <IconButton className={classes.closeButton} onClick={()=>handleModalClose(false)}>
        <CancelIcon fontSize="large" color="secondary" />
      </IconButton>
      <div className={classes.orderConfirmationModal}>
        <br />
        <Typography className={classes.headerText}>
          {`You have successfully added the following to your ${
            type === "inStock" ? "In-Stock" : "On-Demand"
          } order!`} 
        </Typography>
        <img className={classes.previewImg} src={item.imgUrl} alt={item.brand} />
        <div style={{ width: "100%", textAlign: "center" }}>
        <Typography className={classes.bodyText}>
          {`Qty: ${item.totalItems}`}
        </Typography>
        <Typography className={classes.bodyText}>
          {`${item.brand}-${item.itemType}`}
        </Typography>
        </div>
        <br />
      </div>
    </>
  );
};

OrderConfirmation.propTypes = {
  handleModalClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  type: PropTypes.string,
};

export default OrderConfirmation;
