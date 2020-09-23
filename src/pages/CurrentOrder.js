import React, { useState, useCallback } from "react";
import { Link, navigate } from "@reach/router";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { formatMoney } from "../utility/utilityFunctions";

import { useInput, useLimitedInput } from "../hooks/UtilityHooks";

import { setOrderDetails, setShipping } from "../redux/slices/patchOrderSlice";
import { deleteCurrentOrder } from "../redux/slices/currentOrderSlice";

import CurrentOrderTable from "../components/Purchasing/CurrentOrderTable";
import OrderItemPreview from "../components/Purchasing/OrderItemPreview";
import DistributorAutoComplete from "../components/Utility/DistributorAutoComplete";
import OrderPatchLoading from "../components/Utility/OrderPatchLoading";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  orderControl: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
}));

const CurrentOrder = ({ orderType }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [modal, handleModal] = useCallback(useState(false));
  const [currentItem, setCurrentItem] = useCallback(useState({}));
  const [shippingSet, setShippingSet] = useCallback(useState(false));
  const [terms, setTerms] = useCallback(useState(false));
  const [rush, setRush] = useCallback(useState(false));

  const { value: orderNote, bind: bindOrderNote } = useLimitedInput("", 300);
  const { value: attention, bind: bindAttention } = useInput("");

  const patchLoading = useSelector((state) => state.patchOrder.isLoading);
  const currentOrder = useSelector((state) => state.currentOrder);

  const handleModalClose = () => {
    handleModal(false);
  };

  const handleModalOpen = useCallback(
    (img, brand, itemType, itemNumber) => {
      setCurrentItem({
        imgUrl: img,
        brand: brand,
        itemType: itemType,
        itemNumber: itemNumber,
      });
      handleModal(true);
    },
    [handleModal, setCurrentItem]
  );

  const handleShippingLocation = (value, _type) => {
    setShippingSet(true);
    dispatch(setShipping(value.id));
  };

  const handleSave = () => {
    dispatch(
      setOrderDetails(currentOrder.orderNumber, orderNote, attention, orderType)
    );
  };

  const handleSubmit = () => {
    dispatch(
      setOrderDetails(currentOrder.orderNumber, orderNote, attention, orderType)
    );
    //dispatch submit when available
  };

  const handleApprove = () => {
    dispatch(
      setOrderDetails(currentOrder.orderNumber, orderNote, attention, orderType)
    );
    //dispatch approve when available
  };

  const handleDeny = () => {
    dispatch(deleteCurrentOrder(currentOrder.orderNumber));
    navigate("/orders/approvals");
  };

  return (
    <>
      <OrderItemPreview
        handleModalClose={handleModalClose}
        modal={modal}
        currentItem={currentItem}
      />
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          {orderType === "inStock" && (
            <Typography className={classes.titleText} variant="h5">
              Current In-Stock Order
            </Typography>
          )}
          {orderType === "onDemand" && (
            <Typography className={classes.titleText} variant="h5">
              Current On-Demand Order
            </Typography>
          )}
          {orderType === "approval" && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Back to Approvals" placement="bottom-start">
                <IconButton component={Link} to="/orders/approvals">
                  <ArrowBackIcon fontSize="large" color="secondary" />
                </IconButton>
              </Tooltip>
              <Typography
                className={classes.titleText}
                style={{ marginTop: "5px" }}
              >
                {`Order Number: ${window.location.hash.slice(1)}`}
              </Typography>
            </div>
          )}
          <div className={classes.configButtons}>
            <div className={classes.innerConfigDiv}>
              {orderType !== "approval" && (
                <Tooltip title="Add Items to Order">
                  <IconButton
                    component={Link}
                    to={`/orders/items/${orderType}`}
                  >
                    <ExitToAppIcon
                      fontSize="large"
                      color="inherit"
                      style={{ transform: "rotate(180deg)" }}
                    />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
        <br />
        <CurrentOrderTable
          orderType={orderType}
          handleModalOpen={handleModalOpen}
        />
        <br />
        <br />
        {currentOrder.items.length > 0 && (
          <>
            <Grid container spacing={5}>
              <Grid item md={7} xs={12}>
                {orderType !== "approval" && currentOrder.items.length > 0 && (
                  <>
                    <Typography className={classes.headerText}>
                      TERMS AND CONDITIONS
                    </Typography>
                    <br />
                    <Typography className={classes.bodyText}>
                      Use of this site is subject to all Gallo use policies. By
                      using this site, you warrant that you are a Gallo or Gallo
                      Sales employee and that you have reviewed, read, and
                      understand the Compliance rules below associated with this
                      site and with your intended order. You further warrant
                      that you will not, under any circumstances, order items
                      for use in stated where prohibited or use items in a
                      prohibited manner. If you have any questions, please
                      contact your Compliance representative.
                    </Typography>
                    <br />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={terms}
                          onChange={() => {
                            setTerms(!terms);
                          }}
                          name="Terms"
                          color="primary"
                        />
                      }
                      label=" I have read and accept the Terms and Conditions"
                    />
                    <br />
                    <br />
                  </>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography className={classes.headerText}>
                    Order Notes
                  </Typography>
                  <Typography
                    className={classes.bodyText}
                    color="textSecondary"
                  >
                    {`${orderNote.length} / 300`}
                  </Typography>
                </div>
                <br />
                <TextField
                  color="secondary"
                  multiline
                  fullWidth
                  variant="outlined"
                  size="small"
                  rows="5"
                  {...bindOrderNote}
                />
              </Grid>
              <Grid item md={5} xs={12}>
                <DistributorAutoComplete
                  classes={classes}
                  handleChange={handleShippingLocation}
                />
                <br />
                <TextField
                  label="Attention"
                  color="secondary"
                  fullWidth
                  variant="outlined"
                  size="small"
                  {...bindAttention}
                />
                <br />
                <br />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    className={classes.headerText}
                    style={{ marginRight: "10px" }}
                  >
                    Rush Order:
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rush}
                        onChange={() => {
                          setRush(!rush);
                        }}
                        name="Rush Order"
                        color="primary"
                      />
                    }
                  />
                </div>
                <br />
                <br />
                <Divider />
                <br />
                <br />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography className={classes.titleText}>Total:</Typography>
                  <Typography className={classes.titleText}>{`${formatMoney(
                    currentOrder.totalCost
                  )}`}</Typography>
                </div>
              </Grid>
            </Grid>
            <br />
            <div className={classes.orderControl}>
              {orderType !== "approval" && (
                <Button
                  className={classes.largeButton}
                  color="secondary"
                  variant="contained"
                  onClick={handleSave}
                  style={{ marginRight: "10px" }}
                >
                  SAVE ORDER
                </Button>
              )}
              {orderType === "approval" && (
                <Button
                  className={classes.largeButton}
                  color="secondary"
                  variant="contained"
                  component={Link}
                  to={`/orders/confirmation/${orderType}`}
                  onClick={handleApprove}
                  style={{ marginRight: "10px" }}
                >
                  APPROVE
                </Button>
              )}
              {orderType !== "approval" && (
                <Button
                  className={classes.largeButton}
                  color="secondary"
                  variant="contained"
                  disabled={!terms || shippingSet === null}
                  component={Link}
                  to={`/orders/confirmation/${orderType}`}
                  onClick={handleSubmit}
                >
                  SUBMIT ORDER
                </Button>
              )}
              {orderType === "approval" && (
                <Button
                  className={classes.largeButton}
                  color="secondary"
                  variant="contained"
                  onClick={handleDeny}
                >
                  DENY
                </Button>
              )}
            </div>
            {patchLoading && <OrderPatchLoading />}
          </>
        )}
      </Container>
    </>
  );
};

CurrentOrder.propTypes = {
  orderType: PropTypes.string,
};

export default CurrentOrder;
