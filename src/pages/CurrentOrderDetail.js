import React, { useState, useCallback, useEffect /*, useRef*/ } from "react";
import PropTypes from "prop-types";
import { Link, navigate } from "@reach/router";
import isBefore from "date-fns/isBefore";
import Helmet from "react-helmet";
// import { CSVLink } from "react-csv";
// import { CSVReader } from "react-papaparse";

import { useDispatch, useSelector } from "react-redux";
import { useRetainFiltersOnPopstate } from "../hooks/UtilityHooks";

import {
  fetchOrderSet,
  setIsOrdering,
  //addPreAllocatedOrder,
} from "../redux/slices/orderSetSlice";
import {
  updateCurrentTerritory,
  updateCurrentChannel,
} from "../redux/slices/userSlice";
import { fetchFavDistributors } from "../redux/slices/distributorSlice";
import {
  deleteSetItem,
  deleteSetOrder,
  deleteAllSetOrders,
  submitOrdSet,
  approveOrdSet,
  deleteOrdSet,
} from "../redux/slices/patchOrderSlice";
// import { setError } from "../redux/slices/errorSlice";
import { setRetain } from "../redux/slices/filterSlice";

import { formatMoney } from "../utility/utilityFunctions";

import OrderSetTable from "../components/Purchasing/OrderSetTable";
import OrderSetOverview from "../components/Purchasing/OrderSetOverview";
import AreYouSure from "../components/Utility/AreYouSure";
import ConfirmDeleteOrder from "../components/Utility/ConfirmDeleteOrder";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";
import OrderPatchLoading from "../components/Utility/OrderPatchLoading";
import NeedRushItemModal from "../components/Utility/NeedRushItemModal";
import Loading from "../components/Utility/Loading";

// import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
// import PublishIcon from "@material-ui/icons/Publish";
// import GetAppIcon from "@material-ui/icons/GetApp";

const determineOrigin = () => {
  let origin;
  if (window.location.href.includes("rollup")) {
    origin = "/rollup";
  } else if (window.location.hash.includes("approval")) {
    origin = "/orders/approvals";
  } else {
    origin = "/orders/items";
  }
  return origin;
};

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
  // const csvRef = useRef(null);

  const [confirmModal, handleConfirmModal] = useCallback(useState(false));
  const [currentItemNum, setCurrentItemNum] = useCallback(useState(null));
  const [currentItemId, setCurrentItemId] = useCallback(useState(null));
  const [deleteOrderId, setDeleteOrderId] = useCallback(useState(null));
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useCallback(
    useState(false)
  );
  const [currentItem, setCurrentItem] = useCallback(useState({}));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [overviewVisible, setOverviewVisible] = useCallback(useState(false));
  const [isRushUpdateOpen, setRushUpdateOpen] = useCallback(useState(false));
  const [needRushItems, setNeedRushItems] = useCallback(useState([]));
  const [currentCSV, setCurrentCSV] = useState({
    data: [],
    headers: [],
  });
  // const [isUploadLoading, setUploadLoading] = useState(false);

  const isLoading = useSelector((state) => state.orderSet.isLoading);
  const currentOrderType = useSelector((state) => state.orderSet.type);
  const currentOrderId = useSelector((state) => state.orderSet.orderId);
  const orderStatus = useSelector((state) => state.orderSet.status);
  const currentItems = useSelector((state) => state.orderSet.items);
  const orders = useSelector((state) => state.orderSet.orders);
  const currentTotal = useSelector((state) => state.orderSet.totalEstItemCost);
  const currentUserRole = useSelector((state) => state.user.role);
  const currentUserTerritory = useSelector(
    (state) => state.user.currentTerritory
  );
  const currentChannel = useSelector((state) => state.user.currentChannel);
  const currentOrderTerritory = useSelector(
    (state) => state.orderSet.territoryId
  );
  const currentOrderChannel = useSelector((state) => state.orderSet.channel);
  const inStockItems = useSelector(
    (state) => state.currentOrder.inStockOrderItems
  );
  const onDemandItems = useSelector(
    (state) => state.currentOrder.onDemandOrderItems
  );
  const currentFilters = useSelector((state) => state.filters);
  // const currentWarehouse = useSelector(
  //   (state) => state.currentOrder.currentWarehouse
  // );

  const handleModalOpen = (itemNumber) => {
    let item = currentItems.find((item) => item.itemNumber === itemNumber);
    setCurrentItem(item);
    handlePreviewModal(true);
  }; // useCallback() was causing currentItems to not be passed in to this function

  const handleModalClose = () => {
    handlePreviewModal(false);
    setConfirmDeleteOpen(false);
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
    let length = currentItems.length;
    handleConfirmModal(false);
    if (length === 1) {
      if (currentOrderType === "in-stock") {
        navigate("/orders/items/inventory");
      } else if (currentOrderType === "on-demand") {
        navigate("/orders/items/onDemand");
      }
      handleDeleteOrderSet();
    } else {
      dispatch(deleteSetItem(currentItemId, itemNum));
    }
  };

  const handleDeleteOrderModal = (id) => {
    setDeleteOrderId(id);
    setConfirmDeleteOpen(true);
  };

  const handleRemoveOrder = (id) => {
    dispatch(deleteSetOrder(id));
    setConfirmDeleteOpen(false);
  };

  const handleRemoveAllOrders = () => {
    let ids = orders.map((ord) => ord.id);
    dispatch(deleteAllSetOrders(ids));
  };

  const handleSubmit = () => {
    let role = currentUserRole;
    if (
      window.location.href.includes("rollup") ||
      window.location.hash.includes("approval")
    ) {
      role = null;
    }
    if (currentOrderType !== "pre-order") {
      let needsRush = false;
      let rushItems = [];
      currentItems.forEach((item) => {
        if (
          isBefore(
            new Date(item.inMarketDate),
            new Date(item.standardDeliveryDate)
          ) &&
          !item.isRush
        ) {
          needsRush = true;
          rushItems.push(item.itemNumber);
        }
      });
      if (needsRush) {
        setRushUpdateOpen(true);
        setNeedRushItems(rushItems);
      } else {
        dispatch(submitOrdSet(null, "submitted", currentOrderId, role));
      }
    } else dispatch(submitOrdSet(null, "submitted", currentOrderId, role));
  };

  const handleApproval = () => {
    dispatch(approveOrdSet(orderId, "approved"));
  };

  const handleDeny = () => {
    dispatch(deleteOrdSet(orderId, null, "approval"));
  };

  const handleDeleteOrderSet = () => {
    dispatch(deleteOrdSet(orderId, currentFilters, "order", currentOrderType));
  };

  useRetainFiltersOnPopstate(determineOrigin(), dispatch);

  // const handleOpenDialog = (evt) => {
  //   if (csvRef.current) {
  //     csvRef.current.open(evt);
  //   }
  // };

  // const handleFileUpload = (data) => {
  //   const mappedData = data
  //     .filter((dataPoint) => dataPoint.errors.length === 0)
  //     .map((dataPoint) => {
  //       let itemNumbers = Object.keys(dataPoint.data).filter(
  //         (key) => key !== "ABN"
  //       );
  //       let dataObject = {
  //         abn: dataPoint.data["ABN"],
  //       };
  //       itemNumbers.forEach((num) => {
  //         dataObject[num] = dataPoint.data[num];
  //       });
  //       return dataObject;
  //     });
  //   if (mappedData.length > 0) {
  //     dispatch(
  //       addPreAllocatedOrder(
  //         mappedData,
  //         currentOrderId,
  //         currentUserTerritory,
  //         currentOrderType,
  //         currentOrderType === "in-stock" ? currentWarehouse : null
  //       )
  //     );
  //   }
  //   setUploadLoading(false);
  // };

  // const handleFileUploadError = (err, file, inputElem, reason) => {
  //   dispatch(setError({ error: err.toString() }));
  //   console.log(err, file, inputElem, reason);
  // };

  useEffect(() => {
    if (orderId !== "inStock" && orderId !== "onDemand") {
      if (
        (currentUserRole.length > 0 && !currentOrderId) ||
        (currentUserRole.length > 0 && currentOrderId !== orderId) ||
        ((orderStatus === "in-progress" || orderStatus === "inactive") &&
          currentOrderType === "in-stock" &&
          currentItems.length !== inStockItems.length) ||
        ((orderStatus === "in-progress" || orderStatus === "inactive") &&
          currentOrderType === "on-demand" &&
          currentItems.length !== onDemandItems.length)
      ) {
        dispatch(fetchOrderSet(orderId));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    if (
      currentOrderTerritory &&
      currentUserTerritory !== currentOrderTerritory
    ) {
      dispatch(updateCurrentTerritory({ territory: currentOrderTerritory }));
    }
  }, [currentUserTerritory, currentOrderTerritory, dispatch]);

  useEffect(() => {
    if (
      currentOrderChannel !== null &&
      currentOrderChannel === "on_premise" &&
      currentChannel === "Retail"
    ) {
      dispatch(updateCurrentChannel({ channel: "On Premise" }));
    }
  });

  useEffect(() => {
    if (
      currentOrderChannel !== null &&
      currentOrderChannel === "retail" &&
      currentChannel === "On Premise"
    ) {
      dispatch(updateCurrentChannel({ channel: "Retail" }));
    }
  });

  useEffect(() => {
    if (
      currentItems.length > 0 &&
      currentCSV.headers.length === 0 &&
      !isLoading
    ) {
      let itemHeaders = currentItems.map((item) => ({
        label: item.itemNumber,
        key: item.itemNumber,
      }));
      let csvHeaders = [{ label: "ABN", key: "abn" }].concat(itemHeaders);
      let csvData = [];
      if (orders.length > 0) {
        orders.forEach((ord) => {
          let dataObject = {
            abn: ord.distributorId,
          };
          ord.items.forEach((i) => {
            dataObject[i.itemNumber] = i.totalItems;
          });
          csvData.push(dataObject);
        });
      }
      setCurrentCSV({
        data: csvData,
        headers: csvHeaders,
      });
    }
  }, [currentItems, currentCSV, isLoading, orders]);

  useEffect(() => {
    dispatch(setIsOrdering({ status: true }));
    return () => dispatch(setIsOrdering({ status: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(fetchFavDistributors(currentUserTerritory));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Helmet>
          <title>RTA | Current Order</title>
        </Helmet>
        <Container style={{ textAlign: "center" }}>
          <br />
          {orderId === "inStock" && (
            <Typography className={classes.headerText}>
              You currently do not have an active Inventory order.
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
                ? "/orders/items/inventory"
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
      {confirmModal && (
        <AreYouSure
          open={confirmModal}
          handleRemove={handleRemoveItem}
          handleClose={handleCloseConfirm}
          itemNumber={currentItemNum}
          type="item"
        />
      )}
      {isConfirmDeleteOpen && (
        <ConfirmDeleteOrder
          open={isConfirmDeleteOpen}
          handleClose={handleModalClose}
          handleRemove={handleRemoveOrder}
          orderId={deleteOrderId}
        />
      )}
      {isRushUpdateOpen && (
        <NeedRushItemModal
          open={isRushUpdateOpen}
          handleClose={setRushUpdateOpen}
          rushItems={needRushItems}
        />
      )}
      {previewModal && (
        <ItemPreviewModal
          handleClose={handleModalClose}
          previewModal={previewModal}
          currentItem={currentItem}
          type={"catalog"}
        />
      )}
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          {currentOrderType === "in-stock" &&
            (orderStatus === "inactive" || orderStatus === "in-progress") && (
              <>
                <Typography className={classes.titleText} variant="h5">
                  Current Inventory Order
                </Typography>
                <div className={classes.configButtons}>
                  <div className={classes.innerConfigDiv}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        className={classes.titleText}
                        style={{ marginRight: "10px" }}
                      >
                        Total:
                      </Typography>
                      <Typography className={classes.titleText}>{`${formatMoney(
                        currentTotal,
                        false
                      )}`}</Typography>
                    </div>
                    <Button
                      className={classes.largeButton}
                      style={{ marginLeft: "20px" }}
                      variant="contained"
                      color="secondary"
                      startIcon={
                        <ExitToAppIcon
                          style={{ transform: "rotate(180deg)" }}
                        />
                      }
                      component={Link}
                      to={"/orders/items/inventory"}
                    >
                      ADD ITEMS
                    </Button>
                  </div>
                </div>
              </>
            )}
          {currentOrderType === "on-demand" &&
            (orderStatus === "inactive" || orderStatus === "in-progress") && (
              <>
                <Typography className={classes.titleText} variant="h5">
                  Current On-Demand Order
                </Typography>
                <div className={classes.configButtons}>
                  <div className={classes.innerConfigDiv}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        className={classes.titleText}
                        style={{ marginRight: "10px" }}
                      >
                        Total:
                      </Typography>
                      <Typography className={classes.titleText}>{`${formatMoney(
                        currentTotal,
                        false
                      )}`}</Typography>
                    </div>
                    <Button
                      className={classes.largeButton}
                      style={{ marginLeft: "20px" }}
                      variant="contained"
                      color="secondary"
                      startIcon={
                        <ExitToAppIcon
                          style={{ transform: "rotate(180deg)" }}
                        />
                      }
                      component={Link}
                      to={"/orders/items/onDemand"}
                    >
                      ADD ITEMS
                    </Button>
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
                  <IconButton
                    component={Link}
                    to="/rollup"
                    onClick={() => dispatch(setRetain({ value: true }))}
                  >
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
                  currentTotal,
                  false
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
                    <IconButton
                      component={Link}
                      to="/orders/approvals"
                      onClick={() => dispatch(setRetain({ value: true }))}
                    >
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
                  currentTotal,
                  false
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
            handleModalOpen={handleModalOpen}
            handleOpenConfirm={handleOpenConfirm}
            handleRemoveOrder={handleDeleteOrderModal}
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
          {(orderStatus === "in-progress" || orderStatus === "inactive") &&
            currentOrderType !== "pre-order" && (
              <>
                {/* {currentItems.length > 0 &&
                  orders.length === 0 &&
                  currentUserRole === "super" && (
                    <>
                      <CSVLink
                        data={currentCSV.data}
                        headers={currentCSV.headers}
                        style={{ textDecoration: "none" }}
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          className={classes.largeButton}
                          style={{ marginRight: "10px" }}
                          startIcon={<GetAppIcon />}
                        >
                          TEMPLATE
                        </Button>
                      </CSVLink>
                      <CSVReader
                        ref={csvRef}
                        onFileLoad={handleFileUpload}
                        onError={handleFileUploadError}
                        noClick
                        noDrag
                        config={{
                          header: true,
                          beforeFirstChunk: (_chunk) => {
                            setUploadLoading(true);
                          },
                        }}
                        noProgressBar
                      >
                        {() => (
                          <Button
                            className={classes.largeButton}
                            style={{
                              marginRight: "20px",
                              width: isUploadLoading ? "132.93px" : "auto",
                            }}
                            variant="contained"
                            color="secondary"
                            startIcon={<PublishIcon />}
                            onClick={(evt) => {
                              handleOpenDialog(evt);
                            }}
                            onFocus={(evt) => evt.stopPropagation()}
                          >
                            {isUploadLoading ? (
                              <CircularProgress size={27.78} />
                            ) : (
                              "ORDER"
                            )}
                          </Button>
                        )}
                      </CSVReader>
                    </>
                  )} */}
                {orders.length > 0 && !overviewVisible && (
                  <Button
                    className={classes.largeButton}
                    style={{ marginRight: "10px" }}
                    color="secondary"
                    variant="contained"
                    onClick={() => {
                      handleRemoveAllOrders();
                    }}
                  >
                    DELETE ORDERS
                  </Button>
                )}
                <Button
                  className={classes.largeButton}
                  style={{ marginRight: "10px" }}
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    if (currentOrderType === "in-stock") {
                      navigate("/orders/items/inventory");
                    } else if (currentOrderType === "on-demand") {
                      navigate("/orders/items/onDemand");
                    }
                    handleDeleteOrderSet();
                  }}
                >
                  DELETE ORDER SET
                </Button>
              </>
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
          {(orderStatus === "inactive" || orderStatus === "in-progress") &&
            !overviewVisible && (
              <Button
                className={classes.largeButton}
                color="secondary"
                variant="contained"
                onClick={() => {
                  setOverviewVisible(true);
                  dispatch(fetchOrderSet(orderId));
                }}
                disabled={
                  orders.length === 0 ||
                  orderStatus === "inactive" ||
                  currentTotal === 0
                }
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
