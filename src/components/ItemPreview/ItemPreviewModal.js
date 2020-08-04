import React, { useState } from "react";

import ItemOneSheet from "./ItemOneSheet";
import ItemFeedback from "./ItemFeedback";
import ItemAssembly from "./ItemAssembly";
import SelectorMenus from "../Utility/SelectorMenus";

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
  cartButton: {
    width: theme.spacing(38),
    marginTop: "10px",
  },
}));

const ItemPreviewModal = (props) => {
  const classes = useStyles();
  const {
    type,
    currentItem: { itemNumber, brand, itemType, price, imgUrl, qty },
    handleClose,
    userType,
  } = props;

  const [currentImage, setImage] = useState(imgUrl);
  const [value, setValue] = useState(1);

  const handleChangeTab = (_evt, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid container spacing={5} className={classes.dialogGrid}>
        <IconButton
          className={classes.closeButton}
          onClick={() => {
            handleClose(false);
          }}
        >
          <CancelIcon fontSize="large" color="secondary" />
        </IconButton>
        <Grid item className={classes.previewGrid} md={7} xs={12}>
          <div className={classes.imgPreview}>
            <div className={classes.largeImageWrapper}>
              <img
                className={classes.largeImage}
                src={currentImage}
                alt={`${brand} ${itemType}`}
              />
            </div>
            <div className={classes.carousel}>
              <img
                id={currentImage}
                className={classes.previewImg}
                src={currentImage}
                alt={`${brand} ${itemType}`}
                onClick={() => {
                  setImage(currentImage);
                }}
              />
              <img
                id={currentImage}
                className={classes.previewImg}
                src={currentImage}
                alt={`${brand} ${itemType}`}
                onClick={() => {
                  setImage(currentImage);
                }}
              />
              <img
                id={currentImage}
                className={classes.previewImg}
                src={currentImage}
                alt={`${brand} ${itemType}`}
                onClick={() => {
                  setImage(currentImage);
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
            {price}
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
              {`Amount Available: ${Math.floor(Math.random() * 10 + 1) * 5}`}
            </Typography>
          )}
          <Typography variant="body1" color="textSecondary">
            {qty}
          </Typography>
          <br />
          <Box bgcolor="primary.main" className={classes.dividerBox} />
          <br />
          {userType !== "field1" && (
            <div>
              <SelectorMenus type="cart" />
              <br />
              <br />
            </div>
          )}
          {type !== "preOrder" && (
            <>
              <TextField
                color="secondary"
                style={{ width: "150px", marginLeft: "5px" }}
                id={`${itemNumber}`}
                placeholder="Qty"
                variant="outlined"
              />
              <SelectorMenus type="budgets" />
            </>
          )}
          <br />
          <Button
            variant="contained"
            color="secondary"
            className={classes.cartButton}
          >
            ADD TO CART
          </Button>
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
        <Tab className={classes.headerText} label="Item Feedback" value={2} />
        <Tab className={classes.headerText} label="Assembly" value={3} />
      </Tabs>
      <hr />
      <br />
      {value === 1 && <ItemOneSheet />}
      {value === 2 && <ItemFeedback />}
      {value === 3 && <ItemAssembly />}
      <br />
    </>
  );
};

export default ItemPreviewModal;
