import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import {
  addNewOrderItem,
  createNewOrder,
} from "../../redux/slices/currentOrderSlice";

import { formatMoney } from "../../utility/utilityFunctions";

import AddItemConfirmation from "../Utility/AddItemConfirmation";
import ImageWrapper from "../Utility/ImageWrapper";

// import ItemOneSheet from "./ItemOneSheet";
// import ItemFeedback from "./ItemFeedback";
// import ItemAssembly from "./ItemAssembly";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
// import Tabs from "@material-ui/core/Tabs";
// import Tab from "@material-ui/core/Tab";
import Carousel from "react-material-ui-carousel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
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
  scrollDiv: {
    margin: "5% 0",
    width: "100%",
    maxHeight: "90%",
    overflowY: "scroll",
    paddingRight: "20px",
    [theme.breakpoints.down("sm")]: {
      overflowY: "visible",
      height: "fit-content",
      paddingRight: "0px",
    },
  },
  largeImageWrapper: {
    display: "flex",
    alignItems: "center",
    margin: "25px 0",
  },
  largeImage: {
    maxHeight: "500px",
    objectFit: "contain",
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
  dialogPaper: {
    minHeight: "80vh",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  specTableCellRoot: {
    padding: "5px 0px",
  },
  specTableCellRootDesc: {
    padding: "5px 10px",
  },
  carouselRoot: {
    [theme.breakpoints.down("sm")]: {
      marginTop: "100%",
    },
  },
}));

const ItemPreviewModal = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    type,
    currentItem: {
      id,
      itemNumber,
      brand,
      program,
      itemType,
      itemDescription,
      estCost,
      imgUrlLg,
      packSize,
      stock,
      coupon = false,
      couponType = "MIR",
      offerType = "Dual AB/NAB",
      bottles,
      bottleDiscount,
      discountAmount,
      startDate,
      expirationDate,
      specification,
    },
    handleClose,
    previewModal,
  } = props;

  // const [value, setValue] = useState(1);
  const [currentItem, setCurrentItem] = useState(null);
  const currentOrderId = useSelector((state) => state.currentOrder.orderId);
  const territoryId = useSelector((state) => state.user.currentTerritory);
  const currentUserRole = useSelector((state) => state.user.role);

  // const handleChangeTab = (_evt, newValue) => {
  //   setValue(newValue);
  // };

  const handleModalClose = () => {
    setCurrentItem(null);
    handleClose();
  };
  const handleAddItem = useCallback(() => {
    let newItem = {
      brand: brand,
      itemType: itemType,
    };

    setCurrentItem(newItem);

    if (!currentOrderId) {
      dispatch(createNewOrder(type, id, territoryId));
    } else {
      dispatch(addNewOrderItem(currentOrderId, id, type));
    }
  }, [
    dispatch,
    setCurrentItem,
    brand,
    id,
    itemType,
    currentOrderId,
    type,
    territoryId,
  ]);

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={previewModal}
        onClose={handleModalClose}
        disableScrollLock
        fullWidth
        maxWidth="lg"
        style={{ zIndex: "15000" }}
        classes={{ paper: classes.dialogPaper }}
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
              <Carousel
                classes={{ root: classes.carouselRoot }}
                autoPlay=""
                navButtonsAlwaysInvisible={
                  imgUrlLg && imgUrlLg.length === 1 ? true : false
                }
              >
                {imgUrlLg &&
                  imgUrlLg.map((url, index) => (
                    <div className={classes.largeImageWrapper} key={index}>
                      <ImageWrapper
                        imgUrl={url}
                        alt={`${brand} ${itemType}`}
                        imgClass={classes.largeImage}
                        id={itemNumber}
                      />
                    </div>
                  ))}
              </Carousel>
            </Grid>
            <Grid item className={classes.detailGrid} md={5} xs={12}>
              {!coupon && (
                <div
                  style={{
                    display: "flex",
                    height: "Calc(100vh - 300px)",
                    alignItems: "center",
                  }}
                >
                  <div className={classes.scrollDiv}>
                    <Typography variant="body1" color="textSecondary">
                      {`#${itemNumber}`}
                    </Typography>
                    <Typography className={classes.headerText}>
                      {`Brand(s):  ${brand}`}
                    </Typography>
                    <Typography className={classes.headerText}>
                      {`Program:  ${program}`}
                    </Typography>
                    <Typography className={classes.headerText}>
                      {`Item Type:  ${itemType}`}
                    </Typography>
                    <Typography className={classes.headerText}>
                      {`Item Description:  ${itemDescription}`}
                    </Typography>
                    <br />
                    <Box
                      bgcolor="primary.main"
                      className={classes.dividerBox}
                    />
                    <br />
                    <Typography className={classes.headerText}>
                      {`Est. Cost: ${formatMoney(estCost, false)}`}
                    </Typography>
                    <br />
                    <Typography variant="body1" color="textSecondary">
                      {`Pack Size: ${packSize}`}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {`Available to Order: 10/01/2020 - 12/01/2020`}
                    </Typography>
                    <br />
                    {type &&
                      type !== "program" &&
                      type !== "catalog" &&
                      currentUserRole !== "view-only" && (
                        <>
                          <Button
                            variant="contained"
                            color="secondary"
                            className={classes.largeButton}
                            style={{
                              width: "150px",
                              marginTop: "10px",
                            }}
                            onClick={handleAddItem}
                          >
                            ADD TO ORDER
                          </Button>
                          <br />
                          <br />
                          <Box
                            bgcolor="primary.main"
                            className={classes.dividerBox}
                          />
                          <br />
                          <br />
                        </>
                      )}
                    <Typography className={classes.headerText}>
                      Specifications:{" "}
                    </Typography>
                    <br />
                    <Table size="small">
                      <TableBody>
                        {specification &&
                          specification.map((spec, index) => (
                            <TableRow key={index}>
                              <TableCell
                                classes={{ root: classes.specTableCellRoot }}
                                align="left"
                                className={classes.headerText}
                              >
                                {spec.key}
                              </TableCell>
                              <TableCell
                                classes={{
                                  root: classes.specTableCellRootDesc,
                                }}
                                align="left"
                                className={classes.bodyText}
                              >
                                {spec.value}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              {coupon && (
                <>
                  <Typography variant="body1" color="textSecondary">
                    {`#${itemNumber}`}
                  </Typography>
                  <Typography className={classes.headerText}>
                    {`Brand(s): ${brand}`}
                  </Typography>
                  <Typography className={classes.headerText}>
                    {`Program: ${program}`}
                  </Typography>
                  <Typography className={classes.headerText}>
                    {/* {`Item Type: ${itemType}`} */}
                    {"Item Type: Necker Coupon"}
                  </Typography>
                  <Typography className={classes.headerText}>
                    {`Coupon Type: ${couponType}`}
                  </Typography>
                  <Typography className={classes.headerText}>
                    {`Offer Type: ${offerType}`}
                  </Typography>
                  <br />
                  <Box bgcolor="primary.main" className={classes.dividerBox} />
                  <br />
                  <Typography className={classes.headerText} variant="h5">
                    {`Est. Cost: ${formatMoney(estCost, false)}`}
                  </Typography>
                  <br />
                  <Typography variant="body1" color="textSecondary">
                    {`Pack Size: ${packSize}`}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {`Bottles: ${bottles ? bottles : "---"}`}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {`Bottle Discount: ${
                      bottleDiscount
                        ? formatMoney(bottleDiscount, false)
                        : "---"
                    }`}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {`Discount Amount: ${
                      discountAmount
                        ? formatMoney(discountAmount, false)
                        : "---"
                    }`}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {`Promotion Start: ${startDate ? startDate : "---"}`}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {`Expiration Date: ${
                      expirationDate ? expirationDate : "---"
                    }`}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {`Available to Order: 10/01/2020 - 12/01/2020`}
                  </Typography>
                  {type === "inStock" && (
                    <Typography variant="body1" color="textSecondary">
                      {`Amount Available: ${stock}`}
                    </Typography>
                  )}
                </>
              )}
            </Grid>
          </Grid>
          <br />
          {/* <Tabs
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
          <br /> */}
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
