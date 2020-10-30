import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import { useDispatch, useSelector } from "react-redux";

import { fetchOrderSet } from "../redux/slices/orderSetSlice";

import {
  deleteSetItem,
  deleteSetOrder,
  setOrderSetNotes,
  submitOrdSet,
  approveOrdSet,
  deleteOrdSet,
} from "../redux/slices/patchOrderSlice";

import { setRetain } from "../redux/slices/filterSlice";

import { formatMoney } from "../utility/utilityFunctions";

import OrderSetTable from "../components/Purchasing/OrderSetTable";
import OrderSetOverview from "../components/Purchasing/OrderSetOverview";
import AreYouSure from "../components/Utility/AreYouSure";
import OrderItemPreview from "../components/Purchasing/OrderItemPreview";
import OrderPatchLoading from "../components/Utility/OrderPatchLoading";
import Loading from "../components/Utility/Loading";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Container from "@material-ui/core/Container";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
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
  const [overviewVisible, setOverviewVisible] = useCallback(useState(false));

  const isLoading = useSelector((state) => state.orderSet.isLoading);
  const orderNote = useSelector((state) => state.orderSet.orderNote);
  const currentOrderType = useSelector((state) => state.orderSet.type);
  const currentOrderId = useSelector((state) => state.orderSet.orderId);
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

  const handleSave = () => {
    dispatch(setOrderSetNotes(currentOrderId, orderNote));
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
  };

  const handleApproval = () => {
    dispatch(approveOrdSet(orderId, "approved"));
  };

  const handleDeny = () => {
    dispatch(deleteOrdSet(orderId))
  }

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
            onClick={() => dispatch(setRetain({value: true}))}
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
                    <IconButton component={Link} to={`/orders/items/inStock`} onClick={() => dispatch(setRetain({value: true}))}>
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
                    <IconButton component={Link} to={`/orders/items/onDemand`} onClick={() => dispatch(setRetain({value: true}))}>
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
                  <IconButton component={Link} to="/rollup" onClick={() => dispatch(setRetain({value: true}))}>
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
                    <IconButton component={Link} to="/orders/approvals" onClick={() => dispatch(setRetain({value: true}))}>
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
        {overviewVisible ||
        ((orderStatus === "approved" || orderStatus === "submitted") &&
          (currentUserRole === "field1" ||
            (!window.location.hash.includes("approval") &&
              !window.location.href.includes("rollup")))) ? (
          <OrderSetOverview setOverviewVisible={setOverviewVisible} />
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
        <div className={classes.orderControl}>
          {((orderStatus === "in-progress") ||
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
          {orderStatus === "in-progress" && overviewVisible && (
            <Button
              className={classes.largeButton}
              color="secondary"
              variant="contained"
              onClick={handleSubmit}
            >
              SUBMIT ORDER
            </Button>
          )}
          {orderStatus === "in-progress" && !overviewVisible && (
            <Button
              className={classes.largeButton}
              color="secondary"
              variant="contained"
              onClick={() => setOverviewVisible(true)}
            >
              ORDER OVERVIEW
            </Button>
          )}
          {window.location.hash.includes("approval") && (
            <>
              <Button
                className={classes.largeButton}
                color="secondary"
                variant="contained"
                onClick={handleApproval}
                style={{ marginRight: "10px" }}
              >
                APPROVE
              </Button>
              <Button
                className={classes.largeButton}
                color="secondary"
                variant="contained"
                onClick={handleDeny}
              >
                DENY
              </Button>
            </>
          )}
        </div>

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
