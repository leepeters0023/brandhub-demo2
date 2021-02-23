import React, { useState, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { CSVLink } from "react-csv";
import { CSVReader } from "react-papaparse";

import { useDispatch, useSelector } from "react-redux";
import {
  setProgramName,
  fetchPreOrders,
} from "../redux/slices/preOrderDetailSlice";
import { createNewBulkItemOrder } from "../redux/slices/currentOrderSlice";
import {
  fetchProgramOrders,
  addPreAllocatedOrder,
} from "../redux/slices/orderSetSlice";
import { fetchFavDistributors } from "../redux/slices/distributorSlice";

import {
  deleteSetItem,
  deleteSetOrder,
  completeOrderSet,
} from "../redux/slices/patchOrderSlice";
import { deletePreOrderItems } from "../redux/slices/programsSlice";
import { setError } from "../redux/slices/errorSlice";

import { formatMoney } from "../utility/utilityFunctions";

import OrderSetTable from "../components/Purchasing/OrderSetTable";
import OrderSetOverview from "../components/Purchasing/OrderSetOverview";
import AreYouSure from "../components/Utility/AreYouSure";
import ConfirmDeleteOrder from "../components/Utility/ConfirmDeleteOrder";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";
import ProgramSelector from "../components/Utility/ProgramSelector";
import OrderPatchLoading from "../components/Utility/OrderPatchLoading";
import PreOrderSummary from "../components/Purchasing/PreOrderSummary";
import Loading from "../components/Utility/Loading";

import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordianSummary from "@material-ui/core/AccordionSummary";
import AccordianDetails from "@material-ui/core/AccordionDetails";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PublishIcon from "@material-ui/icons/Publish";
import GetAppIcon from "@material-ui/icons/GetApp";

import { makeStyles } from "@material-ui/core/styles";

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

const TotalsDiv = React.memo(() => {
  const classes = useStyles();
  const programTotal = useSelector((state) => state.orderSet.totalEstItemCost);

  return (
    <>
      <FormControl style={{ pointerEvents: "none", minWidth: "100px" }}>
        <InputLabel htmlFor="program-total" style={{ whiteSpace: "nowrap" }}>
          Program Total
        </InputLabel>
        <InputBase
          className={classes.titleText}
          id="program-total"
          value={`${formatMoney(programTotal, false)}`}
          inputProps={{ "aria-label": "naked" }}
          style={{
            marginTop: "10px",
            marginBottom: "0px",
            width: `Calc(${programTotal.toString().length}*15px + 20px)`,
            minWidth: "100px",
            readonly: "readonly",
            pointerEvents: "none",
          }}
        />
      </FormControl>
      {/* <FormControl
        style={{ pointerEvents: "none", minWidth: "100px", marginLeft: "30px" }}
      >
        <InputLabel htmlFor="current-budget" style={{ whiteSpace: "nowrap" }}>
          Current Budget
        </InputLabel>
        <InputBase
          className={classes.titleText}
          id="current-budget"
          value={`$24,560.00`}
          inputProps={{ "aria-label": "naked" }}
          style={{
            marginTop: "10px",
            marginBottom: "0px",
            width: `Calc(7*15px + 20px)`,
            minWidth: "100px",
            readonly: "readonly",
            pointerEvents: "none",
          }}
        />
      </FormControl> */}
    </>
  );
});

const CurrentPreOrder = ({ handleFiltersClosed }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const csvRef = useRef(null);

  const [program, setProgram] = useState(undefined);
  const [confirmModal, handleConfirmModal] = useCallback(useState(false));
  const [currentItemNum, setCurrentItemNum] = useCallback(useState(null));
  const [currentItemId, setCurrentItemId] = useCallback(useState(null));
  const [deleteOrderId, setDeleteOrderId] = useCallback(useState(null));
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useCallback(
    useState(false)
  );
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, setCurrentItem] = useState({});
  const [overviewVisible, setOverviewVisible] = useCallback(useState(false));
  const [switched, setSwitched] = useCallback(useState(false));
  const [currentCSV, setCurrentCSV] = useState({
    data: [],
    headers: [],
    program: null,
    territory: null,
  });
  const [isUploadLoading, setUploadLoading] = useState(false);

  const currentUserId = useSelector((state) => state.user.id);
  const currentUserRole = useSelector((state) => state.user.role);
  const currentTerritory = useSelector((state) => state.user.currentTerritory);
  const currentChannel = useSelector((state) => state.user.currentChannel);
  const isLoading = useSelector((state) => state.orderSet.isLoading);
  const programsLoading = useSelector((state) => state.programs.isLoading);
  const preOrderId = useSelector((state) => state.orderSet.orderId);
  const preOrderStatus = useSelector((state) => state.orderSet.status);
  const preOrderComplete = useSelector((state) => state.orderSet.isComplete);
  const currentItems = useSelector((state) => state.orderSet.items);
  const orders = useSelector((state) => state.orderSet.orders);
  const userPrograms = useSelector((state) => state.programs.programs);
  const grandTotalMod = useSelector(
    (state) => state.preOrderDetails.preOrderTotalMod
  );
  const setTotal = useSelector((state) => state.orderSet.totalEstItemCost);
  const detailError = useSelector((state) => state.preOrderDetails.error);

  const handleModalClose = () => {
    handlePreviewModal(false);
    setConfirmDeleteOpen(false);
  };

  const handleModalOpen = (itemNumber) => {
    let item = currentItems.find((item) => item.itemNumber === itemNumber);
    setCurrentItem(item);
    handlePreviewModal(true);
  };

  const handleCloseConfirm = useCallback(() => {
    handleConfirmModal(false);
  }, [handleConfirmModal]);

  const handleOpenConfirm = useCallback(
    (itemNum, itemId) => {
      setCurrentItemNum(itemNum);
      setCurrentItemId(itemId);
      handleConfirmModal(true);
    },
    [setCurrentItemNum, setCurrentItemId, handleConfirmModal]
  );

  const handleRemoveItem = (itemNum) => {
    dispatch(deleteSetItem(currentItemId, itemNum));
    handleConfirmModal(false);
    let currentId = currentItems.find((item) => item.id === currentItemId)
      .itemId;
    dispatch(deletePreOrderItems({ id: currentId }));
  };

  const handleRemoveOrder = (id) => {
    dispatch(deleteSetOrder(id));
    setConfirmDeleteOpen(false);
  };

  const handleDeleteOrderModal = (id) => {
    setDeleteOrderId(id);
    setConfirmDeleteOpen(true);
  };

  const handleSubmit = () => {
    dispatch(completeOrderSet(preOrderId, program, !preOrderComplete));
  };

  const handleProgramIdHash = useCallback(() => {
    setProgram(window.location.hash.slice(1));
  }, []);

  const handleProgram = useCallback(
    (id) => {
      setProgram(id);
      setSwitched(true);
      window.location.hash = id;
    },
    [setSwitched]
  );

  const handleOpenDialog = (evt) => {
    if (csvRef.current) {
      csvRef.current.open(evt);
    }
  };

  const handleFileUpload = (data) => {
    const mappedData = data
      .filter((dataPoint) => dataPoint.errors.length === 0)
      .map((dataPoint) => {
        let itemNumbers = Object.keys(dataPoint.data).filter(
          (key) => key !== "ABN"
        );
        let dataObject = {
          abn: dataPoint.data["ABN"],
        };
        itemNumbers.forEach((num) => {
          dataObject[num] = dataPoint.data[num];
        });
        return dataObject;
      });
    if (mappedData.length > 0) {
      dispatch(
        addPreAllocatedOrder(
          mappedData,
          preOrderId,
          currentTerritory,
          "pre-order",
          null
        )
      );
    }
    setUploadLoading(false);
  };

  const handleFileUploadError = (err, file, inputElem, reason) => {
    dispatch(setError({ error: err.toString() }));
    console.log(err, file, inputElem, reason);
  };

  const generatePreOrder = () => {
    let currentProgram = userPrograms.find((prog) => prog.id === program);
    let channel = currentChannel === "On Premise" ? "on_premise" : "retail";
    if (currentProgram.items.length > 0) {
      let itemIds = currentProgram.items.map((item) => item.id);
      dispatch(
        createNewBulkItemOrder(
          "preOrder",
          itemIds,
          currentTerritory,
          channel,
          program,
          currentUserId
        )
      );
    } else {
      dispatch(
        createNewBulkItemOrder(
          "preOrder",
          [],
          currentTerritory,
          channel,
          program,
          currentUserId
        )
      );
    }
  };

  useEffect(() => {
    if (window.location.hash.length === 0) {
      if (userPrograms.length > 0 && !program) {
        setProgram(userPrograms[0].id);
        window.location.hash = userPrograms[0].id;
      }
    } else {
      if (userPrograms.length > 0) {
        handleProgramIdHash();
      } else window.location.hash = "";
    }
  }, [
    userPrograms,
    userPrograms.length,
    setProgram,
    program,
    handleProgramIdHash,
  ]);

  useEffect(() => {
    if (program && !isNaN(parseInt(program))) {
      dispatch(
        fetchPreOrders(currentUserId, "summary", program, currentTerritory)
      );
      dispatch(fetchProgramOrders(program, currentUserId, currentTerritory));
      //setCurrentCSV({ data: [], headers: [] });
      let currentProg = userPrograms.find((prog) => prog.id === program);
      if (currentProg) {
        dispatch(
          setProgramName({
            name: `${currentProg.name}-${currentProg.focusMonth}`,
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program, dispatch, userPrograms.length]);

  useEffect(() => {
    window.addEventListener("popstate", handleProgramIdHash);
    return () => window.removeEventListener("popstate", handleProgramIdHash);
  }, [handleProgramIdHash]);

  useEffect(() => {
    if (
      (program &&
        currentItems.length > 0 &&
        currentCSV.headers.length === 0 &&
        !isLoading) ||
      (program && program !== currentCSV.program) ||
      (currentTerritory && currentTerritory !== currentCSV.territory)
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
        program: program,
        territory: currentTerritory,
      });
    }
  }, [program, currentItems, currentCSV, isLoading, orders, currentTerritory]);

  useEffect(() => {
    if (
      (preOrderStatus === "inactive" || preOrderStatus === "in-progress") &&
      overviewVisible &&
      switched
    ) {
      setOverviewVisible(false);
      setSwitched(false);
    }
  });
  useEffect(() => {
    dispatch(fetchFavDistributors(currentTerritory));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (userPrograms.length === 0) {
    return <></>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title> Current Pre-Order</title>
        {currentUserRole === "field2" && (
          <script type="text/javascript">{` Beacon('suggest', ['600af2ff1c64ad47e4b7201d'])`}</script>
        )}
        {currentUserRole === "field1" && (
          <script type="text/javascript">{` Beacon('suggest', ['5ffdf334b9a8501b295cf995'])`}</script>
        )}
      </Helmet>
      {confirmModal && (
        <AreYouSure
          open={confirmModal}
          handleClose={handleCloseConfirm}
          handleRemove={handleRemoveItem}
          itemNumber={currentItemNum}
          type="order"
        />
      )}
      {previewModal && currentItem && (
        <ItemPreviewModal
          handleClose={handleModalClose}
          previewModal={previewModal}
          currentItem={currentItem}
          type={"catalog"}
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
      <Container className={classes.mainWrapper}>
        {/* eslint-disable-next-line no-dupe-keys */}
        <Accordion style={{ backgroundColor: "#fafafa" }}>
          <AccordianSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="pre-order-summary"
            id="pre-order-summary-header"
          >
            <div
              className={classes.titleBar}
              style={{ width: "100%", alignItems: "center" }}
            >
              <ProgramSelector
                handler={handleProgram}
                currentProgram={program}
              />
              <div className={classes.configButtons}>
                <div className={classes.innerConfigDiv}>
                  {program && <TotalsDiv program={program} />}
                </div>
              </div>
            </div>
          </AccordianSummary>
          <AccordianDetails>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {!detailError ? (
                <PreOrderSummary />
              ) : (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography className={classes.headerText}>
                      Error: Cannont display program details at this time...
                  </Typography>
                  </div>
                )}
              <br />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <FormControl
                  style={{
                    pointerEvents: "none",
                    minWidth: "100px",
                    marginLeft: "30px",
                  }}
                >
                  <InputLabel
                    htmlFor="grand-total"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Quarterly Spend
                  </InputLabel>
                  <InputBase
                    className={classes.titleText}
                    id="grand-total"
                    value={`${formatMoney(grandTotalMod + setTotal, false)}`}
                    inputProps={{ "aria-label": "naked" }}
                    style={{
                      marginTop: "10px",
                      marginBottom: "0px",
                      width: `Calc(${(grandTotalMod + setTotal).toString().length
                        }*15px + 20px)`,
                      minWidth: "100px",
                      readonly: "readonly",
                      pointerEvents: "none",
                    }}
                  />
                </FormControl>
              </div>
            </div>
          </AccordianDetails>
        </Accordion>
        <br />
        {(userPrograms.length === 0 || !program || programsLoading) && (
          <CircularProgress color="inherit" />
        )}
        {(overviewVisible ||
          preOrderStatus === "complete" ||
          preOrderStatus === "submitted" ||
          preOrderStatus === "approved") &&
          currentItems.length > 0 && (
            <OrderSetOverview setOverviewVisible={setOverviewVisible} />
          )}
        {!overviewVisible &&
          (preOrderStatus === "in-progress" || preOrderStatus === "inactive") &&
          currentItems.length > 0 && (
            <OrderSetTable
              currentProgram={program}
              handleModalOpen={handleModalOpen}
              handleOpenConfirm={handleOpenConfirm}
              handleRemoveOrder={handleDeleteOrderModal}
              isLoading={isLoading}
              orderId={preOrderId}
              orderStatus={preOrderStatus}
              currentItems={currentItems}
              orders={orders}
              orderType="preOrder"
            />
          )}
        {!programsLoading && preOrderId && currentItems.length === 0 && (
          <Typography className={classes.headerText}>
            There are no items in this program
          </Typography>
        )}
        {!programsLoading && !preOrderId && currentItems.length === 0 && (
          <Button
            className={classes.largeButton}
            color="secondary"
            variant="contained"
            onClick={() => {
              generatePreOrder();
            }}
          >
            GENERATE PROGRAM PRE ORDER
          </Button>
        )}
        <br />
        <br />
        {preOrderStatus !== "submitted" && preOrderStatus !== "approved" && (
          <>
            <div className={classes.orderControl}>
              {!overviewVisible && (
                <>
                  {program &&
                    currentItems.length > 0 &&
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
                    )}
                  <Button
                    className={classes.largeButton}
                    color="secondary"
                    variant="contained"
                    onClick={() => {
                      setSwitched(false);
                      setOverviewVisible(true);
                      dispatch(
                        fetchProgramOrders(
                          program,
                          currentUserId,
                          currentTerritory
                        )
                      );
                    }}
                    disabled={
                      currentItems.length === 0 ||
                      setTotal === 0 ||
                      preOrderStatus === "inactive"
                    }
                  >
                    ORDER OVERVIEW
                  </Button>
                </>
              )}
              {overviewVisible && (
                <Button
                  className={classes.largeButton}
                  color="secondary"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  {preOrderComplete ? "MARK IN-PROGRESS" : "MARK COMPLETE"}
                </Button>
              )}
            </div>
          </>
        )}
        <br />
        <br />
      </Container>
      <OrderPatchLoading />
    </>
  );
};

CurrentPreOrder.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default CurrentPreOrder;
