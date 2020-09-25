import React from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import { useSelector, useDispatch } from "react-redux";

import { formatMoney } from "../../utility/utilityFunctions";

import { useNumberOnlyInput } from "../../hooks/UtilityHooks";

import {
  updateOrderItem,
  deleteOrdItem,
} from "../../redux/slices/patchOrderSlice";

import Loading from "../Utility/Loading";

import Container from "@material-ui/core/Container";
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

const MemoInput = React.memo(({ classes, id, value, orderType }) => {
  const dispatch = useDispatch();
  const { value: qty, bind: bindQty } = useNumberOnlyInput(value);
  return (
    <TextField
      color="secondary"
      className={classes.itemQty}
      variant="outlined"
      size="small"
      id={id}
      {...bindQty}
      onBlur={(evt) => {
        if (value !== qty) {
          dispatch(updateOrderItem(id, qty, orderType));
        }
      }}
    />
  );
});

const CurrentOrderTable = ({ handleModalOpen, orderType }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const items = useSelector((state) => state.currentOrder.items);
  const isLoading = useSelector((state) => state.currentOrder.isLoading);

  const handleRemove = (i) => {
    dispatch(deleteOrdItem(items[i].id));
  };

  if (isLoading) {
    return <Loading />;
  }

  if (items.length === 0) {
    return (
      <>
        <Container style={{ textAlign: "center" }}>
          <br />
          <Typography className={classes.headerText}>
            You currently do not have an active In-Stock order.
          </Typography>
          <br />
          <br />
          <Button
            className={classes.largeButton}
            color="secondary"
            variant="contained"
            component={Link}
            to={
              orderType === "inStock"
                ? "/orders/items/inStock"
                : "/orders/items/onDemand"
            }
          >
            {orderType === "inStock"
              ? "PLACE AN IN-STOCK ORDER"
              : "PLACE AN ON-DEMAND ORDER"}
          </Button>
        </Container>
      </>
    );
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
                  <MemoInput
                    classes={classes}
                    id={row.id}
                    value={row.totalItems}
                    orderType={orderType}
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
    </>
  );
};

CurrentOrderTable.propTypes = {
  orderType: PropTypes.string.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
};

export default CurrentOrderTable;
