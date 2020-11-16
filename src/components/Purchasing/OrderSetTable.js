import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import { formatMoney } from "../../utility/utilityFunctions";

import EditOrderDetailModal from "./EditOrderDetailModal";
import DistributorSelection from "./DistributorSelection";
import MemoInputCell from "../Utility/MemoInputCell";

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
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import EditIcon from "@material-ui/icons/Edit";

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
    width: "300px !important",
    maxWidth: "300px !important",
    minWidth: "300px !important",
  },
  noPadCell: {
    width: "300px !important",
    maxWidth: "300px !important",
    minWidth: "300px !important",
    padding: 0,
  },
  tableRoot: {
    borderCollapse: "inherit",
  }
}));

const TotalItemCell = React.memo(({ itemNumber }) => {
  const classes = useStyles();
  const value = useSelector((state) =>
    state.orderSet.items.find((item) => item.itemNumber === itemNumber)
  );
  return (
    <TableCell
      classes={{ root: classes.root }}
      style={{ textAlign: "center" }}
      className={classes.borderRightLight}
    >
      <div className={classes.infoCell}>{value ? value.totalItems : "---"}</div>
    </TableCell>
  );
});

const TotalEstCostCell = React.memo(({ itemNumber }) => {
  const classes = useStyles();
  const value = useSelector((state) =>
    state.orderSet.items.find((item) => item.itemNumber === itemNumber)
  );
  return (
    <TableCell
      classes={{ root: classes.root }}
      style={{ textAlign: "center" }}
      className={classes.borderRightLight}
    >
      <div className={classes.infoCell}>
        {value ? `${formatMoney(value.totalEstCost)}` : "---"}
      </div>
    </TableCell>
  );
});

const OrderSetTable = (props) => {
  const {
    currentProgram,
    open,
    setOpen,
    tableStyle,
    setTableStyle,
    handleModalOpen,
    handleOpenConfirm,
    handleRemoveOrder,
    isLoading,
    orderId,
    orderStatus,
    currentItems,
    orders,
    orderType,
  } = props;
  const classes = useStyles();
  const tableRef = useRef(null);

  const [refTable, setRefTable] = useState(null);
  const [itemLength, setItemLength] = useState(null);
  const [orderNumberModal, setOrderNumber] = useState(false);

  const handleKeyDown = useCallback(
    (ref, key) => {
      let keys = Object.keys(refTable);
      let currentIndex = keys.indexOf(ref);
      if (key === "Enter" || key === "ArrowDown") {
        if (keys.length - (currentIndex + 1) >= itemLength) {
          return refTable[
            keys[currentIndex + itemLength]
          ].current.firstChild.focus();
        } else return null;
      } else if (key === "ArrowUp") {
        if (currentIndex + 1 >= itemLength) {
          return refTable[
            keys[currentIndex - itemLength]
          ].current.firstChild.focus();
        }
      } else if (key === "ArrowLeft") {
        if (currentIndex !== 0) {
          return refTable[keys[currentIndex - 1]].current.firstChild.focus();
        }
      } else if (key === "ArrowRight") {
        if (currentIndex !== keys.length - 1) {
          return refTable[keys[currentIndex + 1]].current.firstChild.focus();
        }
      }
    },
    [itemLength, refTable]
  );

  useEffect(() => {
    if (
      (orders && !refTable) ||
      `${orders[0].id}` !== Object.keys(refTable)[0].split("-")[0] ||
      Object.keys(refTable).length !== orders.length * currentItems.length
    ) {
      if (orders.length !== 0) {
        let refs = {};
        orders.forEach((order) => {
          order.items.forEach((item) => {
            refs[`${order.id}-${item.itemNumber}`] = React.createRef(null);
          });
        });
        setRefTable(refs);
      }
    }
  }, [orders, refTable, orders.length, currentItems.length]);

  useEffect(() => {
    if ((currentItems && !itemLength) || itemLength !== currentItems.length) {
      setItemLength(currentItems.length);
    }
  }, [itemLength, currentItems, currentItems.length]);

  if (isLoading || !refTable || !itemLength) {
    return <CircularProgress color="inherit" />;
  }

  return (
    <>
      {orderNumberModal && (
        <EditOrderDetailModal
          orderNumber={orderNumberModal}
          handleClose={setOrderNumber}
        />
      )}
      <TableContainer className={classes.cartContainer} ref={tableRef}>
        <Table stickyHeader={true} size="small" aria-label="pre-order-table" classes={{root: classes.tableRoot}}>
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
                      There are no items currently in this order...
                    </Typography>
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
                  >
                    {orderType !== "preOrder" && orderType !== "pre-order" && orderStatus !== "submitted" && (
                      <div className={classes.headerCell}>
                        <DistributorSelection />
                      </div>
                    )}
                  </TableCell>
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
                              item.itemNumber,
                              item.itemDescription
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
                          classes={{root: classes.tableRoot}}
                        >
                          <TableBody
                            style={{ position: "relative", zIndex: "10" }}
                          >
                            {orderType !== "pre-order" && (
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
                                      Lead Time
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
                                      {item.leadTime ? item.leadTime : "---"}
                                    </div>
                                  </TableCell>
                                ))}
                              </TableRow>
                            )}
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
                                    {item.packSize}
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
                                  {`${formatMoney(item.estCost)}`}
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
                  <TableRow key={ord.id}>
                    <TableCell
                      classes={{ root: classes.noPadCell }}
                      className={classes.borderRight}
                      style={{
                        position: "sticky",
                        left: 0,
                        backgroundColor: "#cbcbcb",
                        zIndex: "1",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "fit-content",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "Calc(100% - 8px)",
                            position: "absolute",
                            top: "0",
                            left: "0",
                            height: "100%",
                            padding: "0px 2px 0px 6px",
                          }}
                        >
                          <Tooltip
                            placement="right"
                            title={`${ord.distributorCity}, ${ord.distributorState}`}
                          >
                            <Typography className={classes.headerText} noWrap>
                              {`${ord.distributorName}: ${ord.distributorCity}, ${ord.distributorState}`}
                            </Typography>
                          </Tooltip>
                          <div style={{ display: "flex" }}>
                            <Tooltip title="Delete Order">
                              <IconButton
                                onClick={() => handleRemoveOrder(ord.id)}
                              >
                                <CancelIcon fontSize="small" color="inherit" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Edit Details">
                              <IconButton
                                onClick={() => {
                                  setOrderNumber(ord.id);
                                }}
                              >
                                <EditIcon fontSize="small" color="inherit" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    {ord.items.map((item, index) => (
                      <MemoInputCell
                        key={item.id}
                        compliance={item.complianceStatus}
                        orderNumber={ord.id}
                        itemNumber={item.itemNumber}
                        itemId={item.id}
                        index={index}
                        orderStatus={orderStatus}
                        orderId={orderId}
                        program={currentProgram}
                        cellRef={refTable[`${ord.id}-${item.itemNumber}`]}
                        handleKeyDown={handleKeyDown}
                        packSize={item.packSize}
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

OrderSetTable.propTypes = {
  currentProgram: PropTypes.string,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  tableStyle: PropTypes.string,
  setTableStyle: PropTypes.func.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
  handleOpenConfirm: PropTypes.func.isRequired,
  handleRemoveOrder: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  orderId: PropTypes.string,
  orderStatus: PropTypes.string,
  orderType: PropTypes.string,
};

export default React.memo(OrderSetTable, (prev, next) => {
  return (
    prev.currentProgram === next.currentProgram &&
    prev.orders.length === next.orders.length &&
    prev.open === next.open &&
    prev.tableStyle === next.tableStyle &&
    prev.isLoading === next.isLoading &&
    prev.currentItems.length === next.currentItems.length &&
    prev.orderStatus === next.orderStatus
  );
});
