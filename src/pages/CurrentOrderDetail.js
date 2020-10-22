import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";
import addDays from "date-fns/addDays";
import format from "date-fns/format";

import { useDispatch, useSelector } from "react-redux";

import { updateOrderNote, fetchOrderSet } from "../redux/slices/orderSetSlice";

import {
  deleteSetItem,
  deleteSetOrder,
  setOrderSetNotes,
  submitOrdSet,
  approveOrdSet,
} from "../redux/slices/patchOrderSlice";

import { formatMoney } from "../utility/utilityFunctions";

import OrderSetTable from "../components/Purchasing/OrderSetTable";
import OrderSetOverview from "../components/Purchasing/OrderSetOverview";
import AreYouSure from "../components/Utility/AreYouSure";
import OrderItemPreview from "../components/Purchasing/OrderItemPreview";
import OrderPatchLoading from "../components/Utility/OrderPatchLoading";
import Loading from "../components/Utility/Loading";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Container from "@material-ui/core/Container";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  previewModal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  cartPreviewImage: {
    width: "60%",
    height: "auto",
  },
  orderControl: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
  },
}));

const CurrentOrderDetail = ({ handleFiltersClosed, orderId }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [open, setOpen] = useCallback(useState(true));
  const [tableStyle, setTableStyle] = useCallback(useState("tableOpen"));
  const [confirmModal, handleConfirmModal] = useCallback(useState(false));
  const [currentItemNum, setCurrentItemNum] = useCallback(useState(null));
  const [currentItemId, setCurrentItemId] = useCallback(useState(null));
  const [currentItem, setCurrentItem] = useCallback(useState({}));
  const [modal, handleModal] = useCallback(useState(false));
  const [terms, setTerms] = useCallback(useState(false));
  const [rush, setRush] = useCallback(useState(false));
  const [dueDate, setDueDate] = useCallback(
    useState(format(addDays(new Date(), 28), "MM/dd/yyyy"))
  );

  const isLoading = useSelector((state) => state.orderSet.isLoading);
  const orderNote = useSelector((state) => state.orderSet.orderNote);
  const currentOrderType = useSelector((state) => state.orderSet.type);
  const currentOrderId = useSelector((state) => state.orderSet.id);
  const orderStatus = useSelector((state) => state.orderSet.status);
  const currentItems = useSelector((state) => state.orderSet.items);
  const orders = useSelector((state) => state.orderSet.orders);
  const currentTotal = useSelector((state) => state.orderSet.orderTotal);
  const currentUserRole = useSelector((state) => state.user.role);
  const inStockItems = useSelector(
    (state) => state.currentOrder.inStockOrderItems
  );
  const onDemandItems = useSelector(
    (state) => state.currentOrder.onDemandOrderItems
  );

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

  const handleModalClose = () => {
    handleModal(false);
  };

  const handleOpenConfirm = useCallback(
    (itemNum, itemId) => {
      console.log(itemNum, itemId);
      setCurrentItemNum(itemNum);
      setCurrentItemId(itemId);
      handleConfirmModal(true);
    },
    [setCurrentItemNum, setCurrentItemId, handleConfirmModal]
  );

  const handleCloseConfirm = useCallback(() => {
    handleConfirmModal(false);
  }, [handleConfirmModal]);

  const handleRemoveItem = (itemNum) => {
    dispatch(deleteSetItem(currentItemId, itemNum));
    handleConfirmModal(false);
  };

  const handleRemoveOrder = (id) => {
    dispatch(deleteSetOrder(id));
  };

  const handleOrderNote = (evt) => {
    dispatch(updateOrderNote({ value: evt.target.value }));
  };

  const handleSave = () => {
    dispatch(setOrderSetNotes(currentOrderId, orderNote));
  };

  const handleDate = (date) => {
    console.log(date);
    console.log(format(date, "MM/dd/yyyy"));
    setDueDate(format(date, "MM/dd/yyyy"));
  };

  const handleSubmit = () => {
    let role = currentUserRole;
    if (
      window.location.href.includes("rollup") ||
      window.location.hash.includes("approval")
    ) {
      role = null;
    }
    //TODO send due date and rush status as well when available on api
    dispatch(submitOrdSet(null, "submitted", currentOrderId, role));
    dispatch(setOrderSetNotes(currentOrderId, orderNote));
    setTerms(false);
  };

  const handleApproval = () => {
    dispatch(approveOrdSet(orderId, "approved"));
  };

  useEffect(() => {
    if (orderId !== "inStock" && orderId !== "onDemand") {
      if (
        (currentUserRole.length > 0 && !currentOrderId) ||
        (currentUserRole.length > 0 && currentOrderId !== orderId) ||
        (orderStatus === "in-progress" &&
          currentOrderType === "in-stock" &&
          currentItems.length !== inStockItems.length) ||
        (orderStatus === "in-progress" &&
          currentOrderType === "on-demand" &&
          currentItems.length !== onDemandItems.length)
      ) {
        dispatch(fetchOrderSet(orderId));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (orderId === "inStock" || orderId === "onDemand") {
    return (
      <>
        <Container style={{ textAlign: "center" }}>
          <br />
          {orderId === "inStock" && (
            <Typography className={classes.headerText}>
              You currently do not have an active In-Stock order.
            </Typography>
          )}
          {orderId === "onDemand" && (
            <Typography className={classes.headerText}>
              You currently do not have an active On-Demand order.
            </Typography>
          )}
          <br />
          <br />
          <Button
            className={classes.largeButton}
            color="secondary"
            variant="contained"
            component={Link}
            to={
              orderId === "inStock"
                ? "/orders/items/inStock"
                : "/orders/items/onDemand"
            }
          >
            {orderId === "inStock"
              ? "PLACE AN IN-STOCK ORDER"
              : "PLACE AN ON-DEMAND ORDER"}
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <div className={classes.relativeContainer}>
        <Dialog
          open={confirmModal}
          onClose={handleCloseConfirm}
          disableScrollLock
          fullWidth
          maxWidth="sm"
          style={{ zIndex: "15000" }}
        >
          <DialogContent>
            <AreYouSure
              handleRemove={handleRemoveItem}
              handleModalClose={handleCloseConfirm}
              itemNumber={currentItemNum}
            />
          </DialogContent>
        </Dialog>
      </div>
      <OrderItemPreview
        handleModalClose={handleModalClose}
        modal={modal}
        currentItem={currentItem}
      />
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          {currentOrderType === "in-stock" && orderStatus === "in-progress" && (
            <>
              <Typography className={classes.titleText} variant="h5">
                Current In-Stock Order
              </Typography>
              <div className={classes.configButtons}>
                <div className={classes.innerConfigDiv}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      className={classes.titleText}
                      style={{ marginRight: "10px" }}
                    >
                      Total:
                    </Typography>
                    <Typography className={classes.titleText}>{`${formatMoney(
                      currentTotal
                    )}`}</Typography>
                  </div>
                  <Tooltip title="Add Items to Order">
                    <IconButton component={Link} to={`/orders/items/inStock`}>
                      <ExitToAppIcon
                        fontSize="large"
                        color="inherit"
                        style={{ transform: "rotate(180deg)" }}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </>
          )}
          {currentOrderType === "on-demand" && orderStatus === "in-progress" && (
            <>
              <Typography className={classes.titleText} variant="h5">
                Current On-Demand Order
              </Typography>
              <div className={classes.configButtons}>
                <div className={classes.innerConfigDiv}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      className={classes.titleText}
                      style={{ marginRight: "10px" }}
                    >
                      Total:
                    </Typography>
                    <Typography className={classes.titleText}>{`${formatMoney(
                      currentTotal
                    )}`}</Typography>
                  </div>
                  <Tooltip title="Add Items to Order">
                    <IconButton component={Link} to={`/orders/items/onDemand`}>
                      <ExitToAppIcon
                        fontSize="large"
                        color="inherit"
                        style={{ transform: "rotate(180deg)" }}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </>
          )}
          {window.location.href.includes("rollup") && (
            <>
              <div className={classes.titleImage}>
                <Tooltip
                  title="Quarterly Rollup Overview"
                  placement="bottom-start"
                >
                  <IconButton component={Link} to="/rollup">
                    <ArrowBackIcon fontSize="large" color="secondary" />
                  </IconButton>
                </Tooltip>
                <Typography
                  className={classes.titleText}
                  style={{ marginLeft: "5px", marginTop: "5px" }}
                >
                  {decodeURIComponent(window.location.hash.slice(1))}
                </Typography>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  className={classes.titleText}
                  style={{ marginRight: "10px" }}
                >
                  Total:
                </Typography>
                <Typography className={classes.titleText}>{`${formatMoney(
                  currentTotal
                )}`}</Typography>
              </div>
            </>
          )}
          {window.location.hash.includes("approval") && (
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                {decodeURIComponent(window.location.hash.slice(1)).includes(
                  "approval"
                ) && (
                  <Tooltip title="Back to Approvals" placement="bottom-start">
                    <IconButton component={Link} to="/orders/approvals">
                      <ArrowBackIcon fontSize="large" color="secondary" />
                    </IconButton>
                  </Tooltip>
                )}
                <Typography
                  className={classes.titleText}
                  style={{ marginTop: "5px" }}
                >
                  {`Order Number: ${orderId}`}
                </Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  className={classes.titleText}
                  style={{ marginRight: "10px" }}
                >
                  Total:
                </Typography>
                <Typography className={classes.titleText}>{`${formatMoney(
                  currentTotal
                )}`}</Typography>
              </div>
            </>
          )}
        </div>
        <br />
        {(orderStatus === "approved" || orderStatus === "submitted") &&
        (currentUserRole === "field1" ||
          (!window.location.hash.includes("approval") &&
            !window.location.href.includes("rollup"))) ? (
          <OrderSetOverview />
        ) : (
          <OrderSetTable
            currentProgram={undefined}
            open={open}
            setOpen={setOpen}
            tableStyle={tableStyle}
            setTableStyle={setTableStyle}
            handleModalOpen={handleModalOpen}
            handleOpenConfirm={handleOpenConfirm}
            handleRemoveOrder={handleRemoveOrder}
            isLoading={isLoading}
            orderId={currentOrderId}
            orderStatus={orderStatus}
            currentItems={currentItems}
            orders={orders}
            orderType={currentOrderType}
          />
        )}
        <br />
        <br />
        {((orderStatus !== "submitted" &&
          orderStatus !== "approved" &&
          currentUserRole === "field1") ||
          (currentUserRole !== "field1" &&
            window.location.hash.includes("approval")) ||
          (currentUserRole !== "field1" &&
            orderStatus !== "submitted" &&
            orderStatus !== "approved" &&
            !window.location.hash.includes("approval"))) && (
          <>
            <Grid container spacing={5}>
              <Grid item md={7} xs={12}>
                {orderStatus === "in-progress" && (
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
              </Grid>
              <Grid item md={5} xs={12}>
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
                    {`${(orderNote && orderNote.length) || "0"} / 300`}
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
                  value={orderNote}
                  onChange={handleOrderNote}
                />
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
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
                    label=" Set Rush Order"
                  />
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      color="secondary"
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="dueDate"
                      label="Due Date"
                      value={dueDate}
                      onChange={(value) => handleDate(value)}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </Grid>
            </Grid>
          </>
        )}
        <>
          <br />
          <div className={classes.orderControl}>
            {((orderStatus === "in-progress" && currentUserRole === "field1") ||
              (currentUserRole !== "field1" &&
                window.location.hash.includes("approval")) ||
              window.location.href.includes("rollup")) && (
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
            {orderStatus === "in-progress" && (
              <Button
                className={classes.largeButton}
                color="secondary"
                variant="contained"
                disabled={!terms}
                onClick={handleSubmit}
              >
                SUBMIT ORDER
              </Button>
            )}
            {window.location.hash.includes("approval") && (
              <>
                <Button
                  className={classes.largeButton}
                  color="secondary"
                  variant="contained"
                  disabled={!terms && currentUserRole === "field1"}
                  onClick={handleApproval}
                  style={{ marginRight: "10px" }}
                >
                  APPROVE
                </Button>
                <Button
                  className={classes.largeButton}
                  color="secondary"
                  variant="contained"
                  disabled={!terms && currentUserRole === "field1"}
                  onClick={() => console.log("denied!")}
                >
                  DENY
                </Button>
              </>
            )}
          </div>
        </>
        <br />
        <br />
      </Container>
      <OrderPatchLoading />
    </>
  );
};

CurrentOrderDetail.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
  orderId: PropTypes.string,
};

export default CurrentOrderDetail;
