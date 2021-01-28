import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";
import Helmet from "react-helmet";

import { useDispatch, useSelector } from "react-redux";
import {
  setProgramName,
  fetchPreOrders,
} from "../redux/slices/preOrderDetailSlice";

import { fetchProgramOrders } from "../redux/slices/orderSetSlice";

import {
  deleteSetItem,
  deleteSetOrder,
  completeOrderSet,
} from "../redux/slices/patchOrderSlice";
import { deletePreOrderItems } from "../redux/slices/programsSlice";

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

  const currentUserId = useSelector((state) => state.user.id);
  const currentTerritory = useSelector((state) => state.user.currentTerritory);
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
  const error = useSelector((state) => state.orderSet.error);
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
    if (program) {
      dispatch(
        fetchPreOrders(currentUserId, "summary", program, currentTerritory)
      );
      dispatch(fetchProgramOrders(program, currentUserId, currentTerritory));
      let currentProg = userPrograms.find((prog) => prog.id === program);
      dispatch(
        setProgramName({
          name: `${currentProg.name}-${currentProg.focusMonth}`,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program, dispatch, userPrograms.length]);

  useEffect(() => {
    window.addEventListener("popstate", handleProgramIdHash);
    return () => window.removeEventListener("popstate", handleProgramIdHash);
  }, [handleProgramIdHash]);

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
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      navigate("/whoops");
    }
  }, [error]);

  if (userPrograms.length === 0) {
    return <></>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Helmet><title>RTA | Current Pre-Order</title></Helmet>
      <AreYouSure
        open={confirmModal}
        handleClose={handleCloseConfirm}
        handleRemove={handleRemoveItem}
        itemNumber={currentItemNum}
        type="order"
      />
      <ItemPreviewModal
        handleClose={handleModalClose}
        previewModal={previewModal}
        currentItem={currentItem}
        type={"catalog"}
      />
      <ConfirmDeleteOrder
        open={isConfirmDeleteOpen}
        handleClose={handleModalClose}
        handleRemove={handleRemoveOrder}
        orderId={deleteOrderId}
      />
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
                      width: `Calc(${
                        (grandTotalMod + setTotal).toString().length
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
        {!programsLoading && currentItems.length === 0 && (
          <Typography className={classes.headerText}>
            There are no items in this program
          </Typography>
        )}
        <br />
        <br />
        {preOrderStatus !== "submitted" && preOrderStatus !== "approved" && (
          <>
            <div className={classes.orderControl}>
              {!overviewVisible && (
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
