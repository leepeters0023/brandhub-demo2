import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import { useSelector, useDispatch } from "react-redux";

import {
  removeApprovalItem,
  updateApprovalOrder,
  setRushOrder,
  updateOrderNote,
  addAttention,
} from "../../redux/slices/approvalOrderSlice";

import { formatMoney } from "../../utility/utilityFunctions";

import Loading from "../Utility/Loading";

import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  itemQty: {
    width: "100px",
  },
  orderControl: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
  },
}));

const ApprovalOrder = ({ userType, handleModalOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const items = useSelector((state) => state.approvalOrder.items);
  const orderTotal = useSelector((state) => state.approvalOrder.totalCost);
  const isLoading = useSelector((state) => state.approvalOrder.isLoading);
  const orderNote = useSelector((state) => state.approvalOrder.orderNote);
  const attention = useSelector((state) => state.approvalOrder.attention);
  const shippingLocation = useSelector((state) => state.approvalOrder.distributorName)

  const [rush, setRushChecked] = useCallback(useState(false));

  const handleRemove = (i) => {
    dispatch(removeApprovalItem({ item: items[i] }));
  };

  const handleOrderNote = (evt) => {
    dispatch(updateOrderNote({ value: evt.target.value }));
  };

  const handleAttention = (evt) => {
    dispatch(addAttention({ attention: evt.target.value }));
  };

  const handleValue = (evt) => {
    const numArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    let total;
    if (
      numArray.includes(evt.target.value[evt.target.value.length - 1]) ||
      evt.target.value === ""
    ) {
      if (evt.target.value === "") {
        total = 0;
      } else total = parseInt(evt.target.value);

      dispatch(
        updateApprovalOrder({ itemNumber: evt.target.id, totalItems: total })
      );
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <TableContainer className={classes.cartContainer}>
        <Table className={classes.table} aria-label="in-stock-table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell className={classes.headerText} align="left">
                Preview
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Item
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Item #
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Qty / Pack
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Cost
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Qty
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Total Cost
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row, index) => (
              <TableRow key={row.itemNumber} hover>
                <TableCell>
                  <Tooltip title="Remove from Order">
                    <IconButton onClick={() => handleRemove(index)}>
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell align="left">
                  <img
                    id={row.itemNumber}
                    className={classes.previewImageFloat}
                    src={row.imgUrl}
                    alt={row.itemType}
                    onClick={() =>
                      handleModalOpen(
                        row.imgUrl,
                        row.brand,
                        row.itemType,
                        row.itemNumber
                      )
                    }
                  />
                </TableCell>
                <TableCell align="left">{`${row.brand} ${row.itemType}`}</TableCell>
                <TableCell align="left">{row.itemNumber}</TableCell>
                <TableCell align="left">{row.qty}</TableCell>
                <TableCell>{`${formatMoney(row.price)}`}</TableCell>
                <TableCell>
                  <TextField
                    color="secondary"
                    className={classes.itemQty}
                    variant="outlined"
                    size="small"
                    id={`${row.itemNumber}`}
                    value={row.totalItems.toString()}
                    onChange={handleValue}
                  />
                </TableCell>
                <TableCell align="center">{`${formatMoney(
                  row.estTotal
                )}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <br />
      <Grid container spacing={5}>
        <Grid item md={7} xs={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography className={classes.headerText}>Order Notes</Typography>
            <Typography className={classes.bodyText} color="textSecondary">
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
            value={orderNote}
            onChange={handleOrderNote}
          />
        </Grid>
        <Grid item md={5} xs={12}>
          <Typography className={classes.headerText}>
            Shipping Location:
          </Typography>
          <Typography className={classes.bodyText}>
            {shippingLocation}
          </Typography>
          <br />
          <TextField
            label="Attention"
            color="secondary"
            fullWidth
            variant="outlined"
            size="small"
            value={attention}
            onChange={handleAttention}
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
                    setRushChecked(!rush);
                    dispatch(setRushOrder({ rush: !rush }));
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography className={classes.titleText}>Total:</Typography>
            <Typography className={classes.titleText}>{`${formatMoney(
              orderTotal
            )}`}</Typography>
          </div>
        </Grid>
      </Grid>
      <br />
      <div className={classes.orderControl}>
        {userType !== "field1" && (
          <Button
            className={classes.largeButton}
            color="secondary"
            variant="contained"
            component={Link}
            to="/orders/confirmation/approval"
          >
            APPROVE
          </Button>
        )}
        {userType === "field1" && (
          <Button
            className={classes.largeButton}
            color="secondary"
            variant="contained"
            // TODO add onClick remove item
          >
            DENY
          </Button>
        )}
      </div>
      <br />
      <br />
    </>
  );
};

ApprovalOrder.propTypes = {
  userType: PropTypes.string.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
};

export default ApprovalOrder;
