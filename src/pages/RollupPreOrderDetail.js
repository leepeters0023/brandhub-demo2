import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import { useDispatch, useSelector } from "react-redux";

import {
  removeGridItem,
  updatePreOrderNote,
} from "../redux/slices/programTableSlice";

import {
  deletePreOrdItem,
  setPreOrderNotes,
} from "../redux/slices/patchOrderSlice";

import { fetchRollupProgram } from "../redux/slices/rollupSlice";

import { setProgStatus } from "../redux/slices/patchOrderSlice";

import PreOrderTable from "../components/Purchasing/PreOrderTable";
import PreOrderOverview from "../components/Purchasing/PreOrderOverview";
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
import { makeStyles } from "@material-ui/core/styles";

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

const RollupPreOrderDetail = ({ orderId }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [open, setOpen] = useCallback(useState(true));
  const [tableStyle, setTableStyle] = useCallback(useState("tableOpen"));
  const [confirmModal, handleConfirmModal] = useCallback(useState(false));
  const [currentItemNum, setCurrentItemNum] = useCallback(useState(null));
  const [currentItemId, setCurrentItemId] = useCallback(useState(null));
  const [currentItem, setCurrentItem] = useState({});
  const [modal, handleModal] = useState(false);

  const isLoading = useSelector((state) => state.rollup.isLoading);
  const preOrderNote = useSelector((state) => state.programTable.preOrderNote);
  const preOrderId = useSelector((state) => state.programTable.preOrderId);
  const preOrderStatus = useSelector((state) => state.programTable.status);
  const currentItems = useSelector((state) => state.programTable.items);
  const orders = useSelector((state) => state.programTable.orders);
  const currentUserRoll = useSelector((state) => state.user.role);

  const handleModalOpen = useCallback((img, brand, itemType, itemNumber) => {
    setCurrentItem({
      imgUrl: img,
      brand: brand,
      itemType: itemType,
      itemNumber: itemNumber,
    });
    handleModal(true);
  }, []);

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

  const handleRemove = (itemNum) => {
    dispatch(removeGridItem({ itemNum }));
    dispatch(deletePreOrdItem(currentItemId));
    handleConfirmModal(false);
  };

  const handlePreOrderNote = (evt) => {
    dispatch(updatePreOrderNote({ value: evt.target.value }));
  };

  const handleSave = () => {
    dispatch(setPreOrderNotes(preOrderId, preOrderNote));
  };

  const handleSubmit = () => {
    dispatch(setProgStatus(null, "submitted", preOrderId));
    dispatch(setPreOrderNotes(preOrderId, preOrderNote));
  };

  useEffect(() => {
    if (
      (currentUserRoll.length > 0 && !preOrderId) ||
      (currentUserRoll.length > 0 && preOrderId !== orderId)
    ) {
      dispatch(fetchRollupProgram(orderId));
    }
  }, [currentUserRoll.length, preOrderId, orderId, dispatch]);

  if (isLoading) {
    return <Loading />;
  }

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
        <div className={classes.titleImage}>
          <Tooltip title="Quarterly Rollup Overview" placement="bottom-start">
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
        <br />
        {preOrderStatus === "complete" || preOrderStatus === "submitted" ? (
          <PreOrderOverview />
        ) : (
          <PreOrderTable
            currentProgram={undefined}
            open={open}
            setOpen={setOpen}
            tableStyle={tableStyle}
            setTableStyle={setTableStyle}
            handleModalOpen={handleModalOpen}
            handleOpenConfirm={handleOpenConfirm}
            isLoading={isLoading}
            preOrderId={preOrderId}
            preOrderStatus={preOrderStatus}
            currentItems={currentItems}
            orders={orders}
          />
        )}
        <br />
        <br />
        {preOrderStatus !== "submitted" && (
          <>
            <Grid container spacing={5}>
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
              </Grid>
              <Grid
                item
                md={7}
                xs={12}
                style={{ display: "flex", alignItems: "flex-end" }}
              >
                <div className={classes.orderControl}>
                  <Button
                    className={classes.largeButton}
                    color="secondary"
                    variant="contained"
                    style={{ marginRight: "20px" }}
                    onClick={handleSave}
                  >
                    SAVE ORDER
                  </Button>

                  <Button
                    className={classes.largeButton}
                    color="secondary"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    SUBMIT ORDER
                  </Button>
                </div>
              </Grid>
            </Grid>
          </>
        )}
        <br />
        <br />
      </Container>
      <OrderPatchLoading />
    </>
  );
};

RollupPreOrderDetail.propTypes = {
  orderId: PropTypes.string,
};

export default RollupPreOrderDetail;
