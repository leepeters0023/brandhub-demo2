import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";
import {
  removeGridItem,
  fetchProgramOrders,
  setProgramName,
  updatePreOrderNote,
  fetchPreOrders,
} from "../redux/slices/programTableSlice";

import { deletePreOrdItem, setPreOrderNotes } from "../redux/slices/patchOrderSlice";

import { setProgStatus } from "../redux/slices/patchOrderSlice";

import { formatMoney } from "../utility/utilityFunctions";

import PreOrderTable from "../components/Purchasing/PreOrderTable";
import PreOrderOverview from "../components/Purchasing/PreOrderOverview";
import AreYouSure from "../components/Utility/AreYouSure";
import OrderItemPreview from "../components/Purchasing/OrderItemPreview";
import ProgramSelector from "../components/Utility/ProgramSelector";
import OrderPatchLoading from "../components/Utility/OrderPatchLoading";
import PreOrderSummary from "../components/Purchasing/PreOrderSummary";

import Accordion from "@material-ui/core/Accordion";
import AccordianSummary from "@material-ui/core/AccordionSummary";
import AccordianDetails from "@material-ui/core/AccordionDetails";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputBase from "@material-ui/core/InputBase";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
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
  const programTotal = useSelector((state) => state.programTable.programTotal);
  const grandTotal = useSelector(
    (state) => state.programTable.preOrderTotal.updatedTotal
  );

  return (
    <>
      <FormControl style={{ pointerEvents: "none", minWidth: "100px" }}>
        <InputLabel htmlFor="program-total" style={{ whiteSpace: "nowrap" }}>
          Program Total
        </InputLabel>
        <InputBase
          className={classes.titleText}
          id="program-total"
          value={`${formatMoney(programTotal)}`}
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
      <FormControl
        style={{ pointerEvents: "none", minWidth: "100px", marginLeft: "30px" }}
      >
        <InputLabel htmlFor="grand-total" style={{ whiteSpace: "nowrap" }}>
          Quarterly Spend
        </InputLabel>
        <InputBase
          className={classes.titleText}
          id="grand-total"
          value={`${formatMoney(grandTotal)}`}
          inputProps={{ "aria-label": "naked" }}
          style={{
            marginTop: "10px",
            marginBottom: "0px",
            width: `Calc(${grandTotal.toString().length}*15px + 20px)`,
            minWidth: "100px",
            readonly: "readonly",
            pointerEvents: "none",
          }}
        />
      </FormControl>
    </>
  );
});

const CurrentPreOrder = ({ userType }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [open, setOpen] = useCallback(useState(true));
  const [terms, setTermsChecked] = useCallback(useState(false));
  const [tableStyle, setTableStyle] = useCallback(useState("tableOpen"));
  const [program, setProgram] = useState(undefined);
  const [confirmModal, handleConfirmModal] = useCallback(useState(false));
  const [currentItemNum, setCurrentItemNum] = useCallback(useState(null));
  const [currentItemId, setCurrentItemId] = useCallback(useState(null));
  const [modal, handleModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({});

  const isLoading = useSelector((state) => state.programTable.isLoading);
  const programsLoading = useSelector((state) => state.programs.isLoading);
  const preOrderNote = useSelector((state) => state.programTable.preOrderNote);
  const preOrderId = useSelector((state) => state.programTable.preOrderId);
  const preOrderStatus = useSelector((state) => state.programTable.status);
  const userPrograms = useSelector((state) => state.programs.programs);
  const handleModalClose = () => {
    handleModal(false);
  };

  const handleModalOpen = useCallback((img, brand, itemType, itemNumber) => {
    setCurrentItem({
      imgUrl: img,
      brand: brand,
      itemType: itemType,
      itemNumber: itemNumber,
    });
    handleModal(true);
  }, []);

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

  const handleRemove = (itemNum) => {
    dispatch(removeGridItem({ itemNum }));
    dispatch(deletePreOrdItem(currentItemId));
    handleConfirmModal(false);
  };

  const handleComplete = () => {
    dispatch(setProgStatus(program, "complete", preOrderId));
    dispatch(setPreOrderNotes(preOrderId, preOrderNote))
  };

  const handleSubmit = () => {
    dispatch(setProgStatus(program, "submitted", preOrderId))
    dispatch(setPreOrderNotes(preOrderId, preOrderNote))
  }

  const handleProgramIdHash = useCallback(() => {
    setProgram(window.location.hash.slice(1));
  }, []);

  const handleProgram = useCallback((id) => {
    setProgram(id);
    window.location.hash = id;
  }, []);

  const handlePreOrderNote = (evt) => {
    dispatch(updatePreOrderNote({ value: evt.target.value }));
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
    if (program) {
      dispatch(fetchProgramOrders(program));
      dispatch(fetchPreOrders("summary"));
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

  return (
    <>
      <div className={classes.relativeContainer}>
        <Dialog
          open={confirmModal}
          onClose={handleCloseConfirm}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent>
            <AreYouSure
              handleRemove={handleRemove}
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
            <PreOrderSummary />
          </AccordianDetails>
        </Accordion>
        <br />
        {userPrograms.length === 0 || !program || programsLoading ? (
          <CircularProgress color="inherit" />
        ) : preOrderStatus === "complete" || preOrderStatus === "submitted" ? (
          <PreOrderOverview />
        ) : (
          <PreOrderTable
            currentProgram={program}
            open={open}
            setOpen={setOpen}
            tableStyle={tableStyle}
            setTableStyle={setTableStyle}
            handleModalOpen={handleModalOpen}
            handleOpenConfirm={handleOpenConfirm}
            setProgram={setProgram}
            isLoading={isLoading}
            preOrderId={preOrderId}
            preOrderStatus={preOrderStatus}
          />
        )}
        <br />
        <br />
        {preOrderStatus !== "submitted" && (
          <>
            <Grid container spacing={5}>
              <Grid item md={7} xs={12}>
                <Typography className={classes.headerText}>
                  TERMS AND CONDITIONS
                </Typography>
                <br />
                <Typography className={classes.bodyText}>
                  Use of this site is subject to all Gallo use policies. By
                  using this site, you warrant that you are a Gallo or Gallo
                  Sales employee and that you have reviewed, read, and
                  understand the Compliance rules below associated with this
                  site and with your intended order. You further warrant that
                  you will not, under any circumstances, order items for use in
                  stated where prohibited or use items in a prohibited manner.
                  If you have any questions, please contact your Compliance
                  representative.
                </Typography>
                <br />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={terms}
                      onChange={() => setTermsChecked(!terms)}
                      name="Terms"
                      color="primary"
                    />
                  }
                  label=" I have read and accept the Terms and Conditions"
                />
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
                    {`${preOrderNote.length} / 300`}
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
                  value={preOrderNote}
                  onChange={handlePreOrderNote}
                />
                <br />
                <br />
              </Grid>
            </Grid>
            <br />
            <br />
            <div className={classes.orderControl}>
              <Button
                className={classes.largeButton}
                color="secondary"
                variant="contained"
                style={{ marginRight: "20px" }}
                onClick={handleComplete}
              >
                SAVE ORDER
              </Button>

              <Button
                className={classes.largeButton}
                color="secondary"
                variant="contained"
                disabled={!terms}
                onClick={handleSubmit}
              >
                SUBMIT ORDER
              </Button>
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
  userType: PropTypes.string,
};

export default CurrentPreOrder;
