import React from "react";
import PropTypes from "prop-types";

import { addDefaultImg } from "../../utility/utilityFunctions";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
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
    width: "100%",
  },
  cartPreviewImage: {
    width: "60%",
    height: "auto",
  },
}));

const OrderItemPreview = ({ handleModalClose, modal, currentItem }) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.relativeContainer}>
        <Dialog
          open={modal}
          onClose={handleModalClose}
          fullWidth
          maxWidth="sm"
          disableScrollLock
          style={{ zIndex: "15000" }}
        >
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
                onError={addDefaultImg}
                alt={currentItem.itemNumber}
              />
              <br />
              <Typography
                className={classes.bodyText}
                variant="body1"
              >{`${currentItem.brand} ${currentItem.itemType}`}</Typography>
              <Typography className={classes.bodyText} variant="body1">
                {currentItem.itemDescription}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
              >{`${currentItem.itemNumber}`}</Typography>
              <br />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

OrderItemPreview.propTypes = {
  handleModalClose: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  currentItem: PropTypes.object,
};

export default OrderItemPreview;
