import React, { useState } from "react";

import ItemOneSheet from "./ItemOneSheet";
import ItemFeedback from "./ItemFeedback";
import ItemAssembly from "./ItemAssembly";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  closeButton: {
    position: "absolute",
    top: "0",
    right: "0",
  },
  dialogGrid: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("md")] : {
      flexDirection: "column",
    }
  },
  imgPreview: {
    display: "flex",
    height: "500px",
  },
  largeImage: {
    display: "flex",
    alignItems: "center",
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
    border: "5px solid #ffac33",
    "&:hover": {
      cursor: "pointer",
      border: "5px solid #3d6bb3",
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
  formControl: {
    width: "150px",
    margin: "0px 5px",
  },
  cartButton: {
    width: theme.spacing(38),
    marginTop: "10px",
  }
}));

const ItemPreviewModal = (props) => {
  const classes = useStyles();
  const {
    currentItem: { itemNumber, brand, itemType, price, imgUrl, qty },
    handleClose,
  } = props;

  const [currentImage, updateImage] = useState(imgUrl);
  const [budget, updateBudget] = useState("");
  const [value, updateValue] = useState(1);

  const handleChangeTab = (_evt, newValue) => {
    updateValue(newValue);
  };

  const handleChangeBudget = (evt) => {
    updateBudget(evt.target.value);
  };


  return (
    <div>
      <Grid container spacing={1} className={classes.dialogGrid}>
        <IconButton
          className={classes.closeButton}
          onClick={() => {
            handleClose(false);
          }}
        >
          <CancelIcon fontSize="large" color="secondary" />
        </IconButton>
        <Grid className={classes.previewGrid} item lg={6} md={12} xs={12}>
          <div className={classes.imgPreview}>
            <div className={classes.largeImage}>
              <img src={currentImage} alt={`${brand} ${itemType}`} />
            </div>
            <div className={classes.carousel}>
              <img
                id={currentImage}
                className={classes.previewImg}
                src={currentImage}
                alt={`${brand} ${itemType}`}
              />
              <img
                id={currentImage}
                className={classes.previewImg}
                src={currentImage}
                alt={`${brand} ${itemType}`}
              />
              <img
                id={currentImage}
                className={classes.previewImg}
                src={currentImage}
                alt={`${brand} ${itemType}`}
              />
            </div>
          </div>
        </Grid>
        <Grid className={classes.previewGrid} item lg={6} md={12} xs={12}>
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
          <Typography variant="body1" color="textSecondary">
            Amount Available
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {qty}
          </Typography>
          <br />
          <Box bgcolor="primary.main" className={classes.dividerBox} />
          <TextField
            style={{width: "150px"}}
            id={`${itemNumber}`}
            placeholder="Qty"
            variant="outlined"
          />
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="budget">Budget</InputLabel>
            <Select
              native
              value={budget}
              onChange={handleChangeBudget}
              label="Budget"
              inputProps={{
                name: "Budget",
                id: "budget",
              }}
            >
              <option value={""} aria-label="Budget" />
              <option value={1}>Region 1 Budget</option>
              <option value={2}>Region 2 Budget</option>
              <option value={3}>Retion 3 Budget</option>
            </Select>
          </FormControl>
          <br/>
          <Button variant="contained" color="secondary" className={classes.cartButton}>
            ADD TO CART
          </Button>
        </Grid>
      </Grid>
      <br/>
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
      <hr/>
      <br/>
      {value === 1 && <ItemOneSheet />}
      {value === 2 && <ItemFeedback />}
      {value === 3 && <ItemAssembly />}
      <br/>
    </div>
  );
};

export default ItemPreviewModal;
