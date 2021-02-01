import React, { useState } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";
import { setGridItem, setItemTotal } from "../../redux/slices/orderSetSlice";

import { startOrdSet } from "../../redux/slices/patchOrderSlice";

import { patchItem } from "../../redux/slices/patchOrderSlice";

import { roundUp } from "../../utility/utilityFunctions";

import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import WarningIcon from "@material-ui/icons/Warning";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  borderRight: {
    borderRight: "1px solid #cbcbcb",
  },
  root: {
    width: "200px !important",
    maxWidth: "200px !important",
    minWidth: "200px !important",
  },
}));

const MemoInputCell = React.memo(
  React.forwardRef(
    (
      {
        orderNumber,
        compliance,
        priorApprovalDenied,
        itemNumber,
        itemId,
        index,
        orderId,
        orderStatus,
        program,
        cellRef,
        handleKeyDown,
        packSize,
      },
      ref
    ) => {
      const classes = useStyles();
      const numArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
      const dispatch = useDispatch();
      const [change, setChange] = useState(false);
      const value = useSelector((state) =>
        state.orderSet.orders
          .find((ord) => ord.id === orderNumber)
          .items.find((item) => item.itemNumber === itemNumber)
      );
      const loading = useSelector((state) =>
        state.patchOrder.cellsLoading.find(
          (cell) => cell.id === itemId && cell.orderNumber === orderNumber
        )
      );
      const error = useSelector((state) =>
        state.patchOrder.cellsError.find(
          (cell) => cell.id === itemId && cell.orderNumber === orderNumber
        )
      );

      const handleScrollLeft = () => {
        ref.current.scrollLeft = 0;
      };

      const handleKeyEvent = (evt) => {
        if (
          evt.key === "Enter" ||
          evt.key === "ArrowUp" ||
          evt.key === "ArrowDown" ||
          evt.key === "ArrowLeft" ||
          evt.key === "ArrowRight"
        ) {
          evt.preventDefault();
          handleKeyDown(`${orderNumber}-${itemNumber}`, evt.key);
          window.removeEventListener("keydown", handleKeyEvent);
        }
        if (evt.key === "Tab") {
          window.removeEventListener("keydown", handleKeyEvent);
        }
      };

      if (compliance !== "compliant") {
        return (
          <TableCell
            ref={cellRef}
            align="center"
            classes={{ root: classes.root }}
            className={classes.borderRight}
            style={{ zIndex: "-100", backgroundColor: "#999999" }}
            onFocus={() => {
              window.addEventListener("keydown", handleKeyEvent);
              return index === 0 ? handleScrollLeft() : null;
            }}
            onBlur={() => window.removeEventListener("keydown", handleKeyEvent)}
          >
            <Typography className={classes.headerText}>
              NOT COMPLIANT
            </Typography>
          </TableCell>
        );
      }

      if (priorApprovalDenied) {
        return (
          <TableCell
            ref={cellRef}
            align="center"
            classes={{ root: classes.root }}
            className={classes.borderRight}
            style={{ zIndex: "-100", backgroundColor: "#999999" }}
            onFocus={() => {
              window.addEventListener("keydown", handleKeyEvent);
              return index === 0 ? handleScrollLeft() : null;
            }}
            onBlur={() => window.removeEventListener("keydown", handleKeyEvent)}
          >
            <Typography className={classes.headerText}>
              PRIOR APPROVAL DENIED
            </Typography>
          </TableCell>
        );
      }

      return (
        <TableCell
          classes={{ root: classes.root }}
          className={classes.borderRight}
          style={{ zIndex: "-100" }}
          onFocus={() => {
            return index === 0 ? handleScrollLeft() : null;
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <InputBase
              ref={cellRef}
              style={{ textAlign: "center", zIndex: "0" }}
              fullWidth
              size="small"
              id={`${orderNumber}-${itemNumber}`}
              value={value ? value.totalItems : ""}
              onFocus={() => {
                cellRef.current.firstChild.select();
                window.addEventListener("keydown", handleKeyEvent);
              }}
              onBlur={(evt) => {
                window.removeEventListener("keydown", handleKeyEvent);
                if (change) {
                  if (evt.target.value === "") {
                    dispatch(
                      setGridItem({
                        itemNumber: `${itemNumber}`,
                        orderNumber: orderNumber,
                        value: 0,
                      })
                    );
                    dispatch(setItemTotal({ itemNumber: `${itemNumber}` }));

                    dispatch(patchItem(itemId, 0, orderNumber));
                  } else {
                    if (parseInt(evt.target.value) % packSize === 0) {
                      dispatch(
                        patchItem(itemId, evt.target.value, orderNumber)
                      );
                    } else {
                      let rounded = roundUp(
                        parseInt(evt.target.value),
                        packSize
                      );
                      dispatch(
                        setGridItem({
                          itemNumber: `${itemNumber}`,
                          orderNumber: orderNumber,
                          value: rounded,
                        })
                      );
                      dispatch(setItemTotal({ itemNumber: `${itemNumber}` }));
                      dispatch(patchItem(itemId, rounded, orderNumber));
                    }
                  }
                  setChange(false);
                  if (orderStatus === "inactive") {
                    dispatch(startOrdSet(program, "in-progress", orderId));
                  }
                }
              }}
              onChange={(evt) => {
                if (
                  numArray.includes(
                    evt.target.value[evt.target.value.length - 1]
                  ) ||
                  evt.target.value === ""
                ) {
                  dispatch(
                    setGridItem({
                      itemNumber: `${itemNumber}`,
                      orderNumber: orderNumber,
                      value: evt.target.value,
                    })
                  );
                  dispatch(setItemTotal({ itemNumber: `${itemNumber}` }));

                  setChange(true);
                }
              }}
            />
            {loading && <CircularProgress size={20} />}
            {error && (
              <Tooltip
                title={error.error ? error.error : "Something went wrong"}
              >
                <WarningIcon color="error" />
              </Tooltip>
            )}
          </div>
        </TableCell>
      );
    }
  )
);

MemoInputCell.propTypes = {
  orderNumber: PropTypes.string.isRequired,
  compliance: PropTypes.string.isRequired,
  itemNumber: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  orderId: PropTypes.string,
  orderStatus: PropTypes.string,
  program: PropTypes.string,
  cellRef: PropTypes.any,
  handleKeyDown: PropTypes.func.isRequired,
};

export default MemoInputCell;
