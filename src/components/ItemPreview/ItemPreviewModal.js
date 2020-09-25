import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import {
  addNewOrderItem,
  createNewOrder,
} from "../../redux/slices/currentOrderSlice";

import { formatMoney } from "../../utility/utilityFunctions";

import AddItemConfirmation from "../Utility/AddItemConfirmation";

import ItemOneSheet from "./ItemOneSheet";
import ItemFeedback from "./ItemFeedback";
import ItemAssembly from "./ItemAssembly";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  previewGrid: {
    display: "flex",
    justifyContent: "space-around",
  },
  dialogGrid: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  imgPreview: {
    display: "flex",
    height: "auto",
  },
  largeImageWrapper: {
    display: "flex",
    alignItems: "center",
    width: "75%",
  },
  largeImage: {
    width: "100%",
    height: "auto",
  },
  carousel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  previewImg: {
    height: "25%",
    width: "175px",
    objectFit: "cover",
    border: `5px solid ${theme.palette.secondary.dark}`,
    "&:hover": {
      cursor: "pointer",
      border: `5px solid ${theme.palette.primary.main}`,
    },
  },
  itemTitle: {
    display: "flex",
    alignItems: "center",
  },
  itemNumber: {
    marginLeft: "5px",
  },
  dividerBox: {
    width: "75px",
    height: "5px",
    margin: "10px 0",
  },
}));

const ItemPreviewModal = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    type,
    currentItem: { id, itemNumber, brand, itemType, price, imgUrl, qty, stock },
    handleClose,
    previewModal,
  } = props;

  const [currentImage, setImage] = useState(imgUrl);
  const [value, setValue] = useState(1);
  const [itemQty, setItemQty] = useState("");
  const [currentItem, setCurrentItem] = useState(null);

  const currentOrderId = useSelector((state) => state.currentOrder.orderNumber);
  const currentItemsByType = useSelector(
    (state) => state.currentOrder[`${type}OrderItems`]
  );

  const handleChangeTab = (_evt, newValue) => {
    setValue(newValue);
  };

  const handleItemQty = (evt) => {
    const numArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    let total;
    if (
      numArray.includes(evt.target.value[evt.target.value.length - 1]) ||
      evt.target.value === ""
    ) {
      if (evt.target.value === "") {
        total = 0;
      } else total = parseInt(evt.target.value);
      setItemQty(total);
    }
  };

  const handleModalClose = () => {
    setCurrentItem(null);
    handleClose();
  };

  const handleAddItem = useCallback(() => {
    let newItem = {
      itemNumber: itemNumber,
      brand: brand,
      itemType: itemType,
      price: price,
      qty: qty,
      imgUrl: imgUrl,
      complianceStatus: "pending",
      totalItems: parseInt(itemQty),
      estTotal: parseInt(itemQty) * price,
    };

    setCurrentItem(newItem);
    setItemQty("0");

    if (!currentOrderId) {
      dispatch(createNewOrder(type, itemNumber, qty));
    } else {
      let currentItem = currentItemsByType.find(
        (i) => i.itemNumber === itemNumber
      );
      if (currentItem) {
        dispatch(
          addNewOrderItem(currentOrderId, id, currentItem.id, itemQty, type)
        );
      } else {
        dispatch(
          addNewOrderItem(currentOrderId, id, undefined, itemQty, type)
        );
      }
    }
  }, [
    dispatch,
    setCurrentItem,
    brand,
    qty,
    id,
    itemNumber,
    itemType,
    price,
    imgUrl,
    itemQty,
    currentItemsByType,
    currentOrderId,
    type,
  ]);

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={previewModal}
        onClose={handleModalClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent>
          <Grid container spacing={5} className={classes.dialogGrid}>
            <IconButton
              className={classes.closeButton}
              onClick={() => {
                handleModalClose();
              }}
            >
              <CancelIcon fontSize="large" color="secondary" />
            </IconButton>
            <Grid item className={classes.previewGrid} md={7} xs={12}>
              <div className={classes.imgPreview}>
                <div className={classes.largeImageWrapper}>
                  <img
                    className={classes.largeImage}
                    src={currentImage || imgUrl}
                    alt={`${brand} ${itemType}`}
                  />
                </div>
                <div className={classes.carousel}>
                  <img
                    id={currentImage || imgUrl}
                    className={classes.previewImg}
                    src={currentImage || imgUrl}
                    alt={`${brand} ${itemType}`}
                    onClick={() => {
                      setImage(currentImage || imgUrl);
                    }}
                  />
                  <img
                    id={currentImage || imgUrl}
                    className={classes.previewImg}
                    src={currentImage || imgUrl}
                    alt={`${brand} ${itemType}`}
                    onClick={() => {
                      setImage(currentImage || imgUrl);
                    }}
                  />
                  <img
                    id={currentImage || imgUrl}
                    className={classes.previewImg}
                    src={currentImage || imgUrl}
                    alt={`${brand} ${itemType}`}
                    onClick={() => {
                      setImage(currentImage || imgUrl);
                    }}
                  />
                </div>
              </div>
            </Grid>
            <Grid item className={classes.detailGrid} md={5} xs={12}>
              <Typography color="textSecondary" variant="body2">
                {brand}
              </Typography>
              <div className={classes.itemTitle}>
                <Typography className={classes.titleText} variant="h2">
                  {`${brand} ${itemType}`}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  className={classes.itemNumber}
                >
                  {` | #${itemNumber}`}
                </Typography>
              </div>
              <Typography className={classes.headerText} variant="h5">
                {`${formatMoney(price)}`}
              </Typography>
              <Box bgcolor="primary.main" className={classes.dividerBox} />
              <br />
              <Typography className={classes.bodyText} variant="body1">
                Item description here
              </Typography>
              <Typography className={classes.bodyText} variant="body1">
                - Item bullet point
              </Typography>
              <Typography className={classes.bodyText} variant="body1">
                - Item bullet point
              </Typography>
              <Typography className={classes.bodyText} variant="body1">
                - Item bullet point
              </Typography>
              <br />
              {type === "inStock" && (
                <Typography variant="body1" color="textSecondary">
                  {`Amount Available: ${stock}`}
                </Typography>
              )}
              {type && (
                <>
                  <Typography variant="body1" color="textSecondary">
                    {qty}
                  </Typography>
                  <br />
                  <Box bgcolor="primary.main" className={classes.dividerBox} />
                  <br />
                </>
              )}
              {type && type !== "program" && (
                <>
                  <TextField
                    color="secondary"
                    style={{
                      width: "150px",
                      marginLeft: "5px",
                      marginTop: "10px",
                    }}
                    id={`${itemNumber}`}
                    placeholder="Qty"
                    variant="outlined"
                    value={itemQty}
                    onChange={handleItemQty}
                  />
                  <br />
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.largeButton}
                    style={{
                      width: "150px",
                      marginLeft: "5px",
                      marginTop: "10px",
                    }}
                    onClick={handleAddItem}
                  >
                    ADD TO ORDER
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
          <br />
          <Tabs
            variant="fullWidth"
            value={value}
            onChange={handleChangeTab}
            indicatorColor="primary"
            centered
          >
            <Tab className={classes.headerText} label="One Sheet" value={1} />
            <Tab
              className={classes.headerText}
              label="Item Feedback"
              value={2}
            />
            <Tab className={classes.headerText} label="Assembly" value={3} />
          </Tabs>
          <hr />
          <br />
          {value === 1 && <ItemOneSheet />}
          {value === 2 && <ItemFeedback />}
          {value === 3 && <ItemAssembly />}
          <br />
          {type !== "program" && type !== "catalog" && (
            <AddItemConfirmation type={type} item={currentItem} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

ItemPreviewModal.propTypes = {
  type: PropTypes.string,
  currentItem: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ItemPreviewModal;
