import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";
import {
  setGridItem,
  setItemTotal,
} from "../../redux/slices/programTableSlice";

import { setProgStatus } from "../../redux/slices/patchOrderSlice";

import { patchItem } from "../../redux/slices/patchOrderSlice";

import { formatMoney } from "../../utility/utilityFunctions";

import Box from "@material-ui/core/Box";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import InputBase from "@material-ui/core/InputBase";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  headerCell: {
    position: "relative",
    padding: "0",
    height: "125px",
    minWidth: "150px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    textAlign: "center",
  },
  borderRight: {
    borderRight: "1px solid #cbcbcb",
  },
  borderRightLight: {
    borderRight: `1px solid rgba(224, 224, 224, 1)`,
  },
  infoRow: {
    backgroundColor: "#cbcbcb",
  },
  infoCell: {
    width: "100%",
    minWidth: "150px",
  },
  tableControl: {
    display: "flex",
    alignItems: "center",
  },
  orderControl: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  tableClosed: {
    zIndex: "-5",
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
        itemNumber,
        itemId,
        index,
        preOrderId,
        preOrderStatus,
        program,
        cellRef,
        handleEnter,
      },
      ref
    ) => {
      const classes = useStyles();
      const numArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
      const dispatch = useDispatch();
      const [change, setChange] = useState(false);
      const value = useSelector(
        (state) =>
          state.programTable.orders
            .find((ord) => ord.orderNumber === orderNumber)
            .items.find((item) => item.itemNumber === itemNumber).totalItems
      );
      const loading = useSelector((state) =>
        state.patchOrder.cellsLoading.find(
          (cell) => cell.id === itemId && cell.orderNumber === orderNumber
        )
      );

      const handleScrollLeft = () => {
        ref.current.scrollLeft = 0;
      };

      const handleEnterEvent = ({ key }) => {
        if (key === "Enter") {
          handleEnter(`${orderNumber}-${itemNumber}`);
          window.removeEventListener("keydown", handleEnterEvent)
        }
        if (key === "Tab") {
          console.log("tabbed!")
          window.removeEventListener("keydown", handleEnterEvent)
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
              window.addEventListener("keydown", handleEnterEvent);
              return index === 0 ? handleScrollLeft() : null;
            }}
            onBlur={() =>
              window.removeEventListener("keydown", handleEnterEvent)
            }
          >
            <Typography className={classes.headerText}>
              NOT COMPLIANT
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
              value={value}
              onFocus={()=>{
                console.log(cellRef.current.firstChild)
                window.addEventListener("keydown", handleEnterEvent);
              }}
              onBlur={(evt) => {
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
                    dispatch(patchItem(itemId, evt.target.value, orderNumber));
                  }
                  setChange(false);
                  if (preOrderStatus === "inactive") {
                    dispatch(setProgStatus(program, "in-progress", preOrderId));
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
          </div>
        </TableCell>
      );
    }
  )
);

const TotalItemCell = React.memo(({ itemNumber }) => {
  const classes = useStyles();
  const value = useSelector(
    (state) =>
      state.programTable.items.find((item) => item.itemNumber === itemNumber)
        .totalItems
  );
  return (
    <TableCell
      classes={{ root: classes.root }}
      style={{ textAlign: "center" }}
      className={classes.borderRightLight}
    >
      <div className={classes.infoCell}>{value}</div>
    </TableCell>
  );
});

const TotalEstCostCell = React.memo(({ itemNumber }) => {
  const classes = useStyles();
  const value = useSelector(
    (state) =>
      state.programTable.items.find((item) => item.itemNumber === itemNumber)
        .estTotal
  );
  return (
    <TableCell
      classes={{ root: classes.root }}
      style={{ textAlign: "center" }}
      className={classes.borderRightLight}
    >
      <div className={classes.infoCell}>{`${formatMoney(value)}`}</div>
    </TableCell>
  );
});

const PreOrderTable = (props) => {
  const {
    currentProgram,
    open,
    setOpen,
    tableStyle,
    setTableStyle,
    handleModalOpen,
    handleOpenConfirm,
    isLoading,
    preOrderId,
    preOrderStatus,
  } = props;
  const classes = useStyles();
  const tableRef = useRef(null);
  const currentItems = useSelector((state) => state.programTable.items);
  const orders = useSelector((state) => state.programTable.orders);

  const [refTable, setRefTable] = useState(null);
  const [itemLength, setItemLength] = useState(null);

  const handleEnter = useCallback(
    //TODO add arrow key functionality as well
    //TODO play with user-select css attribute
    (ref) => {
      console.log("click")
      console.log(ref)
      let keys = Object.keys(refTable);
      let currentIndex = keys.indexOf(ref);
      if (keys.length - (currentIndex + 1) >= itemLength) {
        return refTable[
          keys[currentIndex + itemLength]
        ].current.firstChild.focus();
      } else return null;
    },
    [itemLength, refTable]
  );

  useEffect(() => {
    if (orders && !refTable) {
      if (orders.length !== 0) {
        let refs = {};
        orders.forEach((order) => {
          order.items.forEach((item) => {
            refs[`${order.orderNumber}-${item.itemNumber}`] = React.createRef(
              null
            );
          });
        });
        console.log(refs);
        setRefTable(refs);
      }
    }
  }, [orders, refTable, orders.length]);

  useEffect(() => {
    if (currentItems && !itemLength) {
      console.log("here")
      setItemLength(currentItems.length);
    }
  }, [itemLength, currentItems]);

  if (isLoading || !refTable || !itemLength) {
    return <CircularProgress color="inherit" />;
  }

  return (
    <>
      <TableContainer className={classes.cartContainer} ref={tableRef}>
        <Table stickyHeader={true} size="small" aria-label="pre-order-table">
          {currentItems.length === 0 ? (
            <TableHead>
              <TableRow>
                <TableCell
                  classes={{ root: classes.root }}
                  style={{ zIndex: "100", width: "300px" }}
                  className={classes.borderRight}
                ></TableCell>
                <TableCell classes={{ root: classes.root }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography
                      className={classes.bodyText}
                      style={{ marginRight: "10px" }}
                    >
                      There are no items currently in this program...
                    </Typography>
                    <Button
                      className={classes.largeButton}
                      component={Link}
                      to={`/program/${currentProgram}`}
                      variant="contained"
                      color="secondary"
                    >
                      View Program
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
          ) : (
            <>
              <TableHead>
                <TableRow>
                  <TableCell
                    classes={{ root: classes.root }}
                    className={classes.borderRight}
                    style={{ zIndex: "100" }}
                  ></TableCell>
                  {currentItems.map((item) => (
                    <TableCell
                      classes={{ root: classes.root }}
                      className={classes.borderRight}
                      key={item.id}
                    >
                      <div className={classes.headerCell}>
                        <Tooltip title="Remove from Order">
                          <IconButton
                            onClick={() => {
                              handleOpenConfirm(item.itemNumber, item.id);
                            }}
                            style={{ position: "absolute", top: 0, right: -15 }}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <img
                          id={item.id}
                          className={classes.previewImageFloat}
                          src={item.imgUrl}
                          alt={item.itemType}
                          onClick={() =>
                            handleModalOpen(
                              item.imgUrl,
                              item.brand,
                              item.itemType,
                              item.itemNumber
                            )
                          }
                        />
                        <Typography className={classes.headerText} variant="h5">
                          {item.brand}
                        </Typography>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell
                    classes={{ root: classes.root }}
                    className={classes.borderRight}
                    align="right"
                    style={{ top: 138, zIndex: "100" }}
                  >
                    <div className={classes.tableControl}>
                      <Typography>Order Details</Typography>
                      <IconButton
                        aria-label="expand row"
                        onClick={() => {
                          setOpen(!open);
                          !open
                            ? setTableStyle(null)
                            : setTableStyle("tableClosed");
                        }}
                      >
                        {open ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </div>
                  </TableCell>
                  {currentItems.map((item) => {
                    return (
                      <TableCell
                        classes={{ root: classes.root }}
                        style={{ top: 138, textAlign: "center" }}
                        className={classes.borderRight}
                        key={item.id}
                      >
                        <div className={classes.infoCell}>
                          <Typography variant="body2" color="textSecondary">
                            {`${item.itemType} | ${item.itemNumber}`}
                          </Typography>
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow>
                  <TableCell
                    classes={{ root: classes.root }}
                    style={{ padding: 0, top: 199 }}
                    colSpan={currentItems.length + 1}
                    className={classes[tableStyle]}
                  >
                    <Collapse in={open} timeout="auto">
                      <Box>
                        <Table
                          size="small"
                          className={classes.table}
                          aria-label="item-info"
                        >
                          <TableBody
                            style={{ position: "relative", zIndex: "10" }}
                          >
                            <TableRow className={classes.infoRow}>
                              <TableCell
                                classes={{ root: classes.root }}
                                style={{
                                  position: "sticky",
                                  left: 0,
                                  backgroundColor: "white",
                                  zIndex: "100",
                                }}
                                className={classes.borderRight}
                              >
                                <div style={{ zIndex: "100" }}>
                                  <Typography className={classes.headerText}>
                                    Items Per Pack
                                  </Typography>
                                </div>
                              </TableCell>
                              {currentItems.map((item) => (
                                <TableCell
                                  classes={{ root: classes.root }}
                                  align="center"
                                  key={item.id}
                                  className={classes.borderRightLight}
                                >
                                  <div className={classes.infoCell}>
                                    {item.qty !== "Single Unit"
                                      ? parseInt(item.qty.split(" ")[0])
                                      : 1}
                                  </div>
                                </TableCell>
                              ))}
                            </TableRow>
                            <TableRow className={classes.infoRow}>
                              <TableCell
                                classes={{ root: classes.root }}
                                style={{
                                  position: "sticky",
                                  left: 0,
                                  backgroundColor: "white",
                                  zIndex: "100",
                                }}
                                className={classes.borderRight}
                              >
                                <div style={{ zIndex: "100" }}>
                                  <Typography className={classes.headerText}>
                                    Total Qty of Items
                                  </Typography>
                                </div>
                              </TableCell>
                              {currentItems.map((item) => (
                                <TotalItemCell
                                  itemNumber={item.itemNumber}
                                  key={item.id}
                                />
                              ))}
                            </TableRow>
                            <TableRow className={classes.infoRow}>
                              <TableCell
                                classes={{ root: classes.root }}
                                style={{
                                  position: "sticky",
                                  left: 0,
                                  backgroundColor: "white",
                                  zIndex: "100",
                                }}
                                className={classes.borderRight}
                              >
                                <div style={{ zIndex: "100" }}>
                                  <Typography className={classes.headerText}>
                                    Item Est Cost
                                  </Typography>
                                </div>
                              </TableCell>
                              {currentItems.map((item) => (
                                <TableCell
                                  classes={{ root: classes.root }}
                                  align="center"
                                  key={item.id}
                                  className={classes.borderRightLight}
                                >
                                  {`${formatMoney(item.price)}`}
                                </TableCell>
                              ))}
                            </TableRow>
                            <TableRow className={classes.infoRow}>
                              <TableCell
                                classes={{ root: classes.root }}
                                style={{
                                  position: "sticky",
                                  left: 0,
                                  backgroundColor: "white",
                                  zIndex: "100",
                                }}
                                className={classes.borderRight}
                              >
                                <div style={{ zIndex: "100" }}>
                                  <Typography className={classes.headerText}>
                                    Total Est Cost
                                  </Typography>
                                </div>
                              </TableCell>
                              {currentItems.map((item) => (
                                <TotalEstCostCell
                                  itemNumber={item.itemNumber}
                                  key={item.id}
                                />
                              ))}
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ position: "relative" }}>
                {orders.map((ord) => (
                  <TableRow key={ord.orderNumber}>
                    <TableCell
                      classes={{ root: classes.root }}
                      className={classes.borderRight}
                      style={{
                        position: "sticky",
                        left: 0,
                        backgroundColor: "#cbcbcb",
                        zIndex: "1",
                      }}
                    >
                      <div>
                        <Typography className={classes.headerText}>
                          {ord.distributorName}
                        </Typography>
                      </div>
                    </TableCell>
                    {ord.items.map((item, index) => (
                      <MemoInputCell
                        key={item.id}
                        compliance={item.complianceStatus}
                        orderNumber={ord.orderNumber}
                        itemNumber={item.itemNumber}
                        itemId={item.id}
                        index={index}
                        preOrderStatus={preOrderStatus}
                        preOrderId={preOrderId}
                        program={currentProgram}
                        cellRef={
                          refTable[`${ord.orderNumber}-${item.itemNumber}`]
                        }
                        handleEnter={handleEnter}
                        ref={tableRef}
                      />
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
      </TableContainer>
    </>
  );
};

PreOrderTable.propTypes = {
  currentProgram: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  tableStyle: PropTypes.string,
  setTableStyle: PropTypes.func.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
  handleOpenConfirm: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  preOrderId: PropTypes.string,
  preOrderStatus: PropTypes.string,
};

export default React.memo(PreOrderTable, (prev, next) => {
  return (
    prev.currentProgram === next.currentPrograms &&
    prev.distributors.length === next.distributors.length &&
    prev.open === next.open &&
    prev.tableStyle === next.tableStyle &&
    prev.isLoading === next.isLoading
  );
});
