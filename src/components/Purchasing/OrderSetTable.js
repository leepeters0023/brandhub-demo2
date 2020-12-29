import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { setRebuildRef } from "../../redux/slices/orderSetSlice";

import EditOrderDetailModal from "./EditOrderDetailModal";
import MemoInputCell from "../Utility/MemoInputCell";
import OrderSetTableHead from "./OrderSetTableHead";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";
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
    justifyContent: "space-between",
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
  colRoot: {
    width: "300px !important",
    maxWidth: "300px !important",
    minWidth: "300px !important",
  },
  noPadCell: {
    width: "200px !important",
    maxWidth: "200px !important",
    minWidth: "200px !important",
    padding: 0,
  },
  tableRoot: {
    borderCollapse: "inherit",
  },
}));

const OrderSetTable = (props) => {
  const {
    currentProgram,
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
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  const [refTable, setRefTable] = useState(null);
  const [itemLength, setItemLength] = useState(null);
  const [orderNumberModal, setOrderNumber] = useState(false);

  const patchLoading = useSelector((state) => state.patchOrder.isLoading);

  const rebuildRef = useSelector((state) => state.orderSet.rebuildRef);
  const stateFilter = useSelector((state) => state.orderSet.stateFilter);

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
    let filteredOrders;
    if (stateFilter) {
      filteredOrders = orders.filter((ord) => {
        let currentState = ord.distributorId
          ? ord.distributorState
          : ord.customAddressState;
        return stateFilter === currentState;
      });
    } else filteredOrders = orders;
    if (
      (orders && !refTable) ||
      (stateFilter &&
        filteredOrders.length > 0 &&
        Object.keys(refTable).length > 0 &&
        `${filteredOrders[0].id}` !== Object.keys(refTable)[0].split("-")[0]) ||
      (!stateFilter &&
        orders.length > 0 &&
        Object.keys(refTable).length > 0 &&
        `${orders[0].id}` !== Object.keys(refTable)[0].split("-")[0]) ||
      (stateFilter &&
        Object.keys(refTable).length !==
          filteredOrders.length * currentItems.length) ||
      (!stateFilter &&
        Object.keys(refTable).length !== orders.length * currentItems.length) ||
      rebuildRef
    ) {
      if (orders.length !== 0) {
        if (rebuildRef) {
          dispatch(setRebuildRef());
        }
        let refs = {};

        filteredOrders.forEach((order) => {
          order.items.forEach((item) => {
            refs[`${order.id}-${item.itemNumber}`] = React.createRef(null);
          });
        });
        setRefTable(refs);
      }
    }
  }, [
    orders,
    refTable,
    orders.length,
    currentItems.length,
    rebuildRef,
    stateFilter,
    dispatch,
  ]);

  useEffect(() => {
    if ((currentItems && !itemLength) || itemLength !== currentItems.length) {
      setItemLength(currentItems.length);
    }
  }, [itemLength, currentItems, currentItems.length]);

  if (isLoading || !itemLength || (!refTable && orders.length > 0)) {
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
        <Table
          stickyHeader={true}
          size="small"
          aria-label="pre-order-table"
          classes={{ root: classes.tableRoot }}
        >
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
              <OrderSetTableHead
                classes={classes}
                orderType={orderType}
                orderStatus={orderStatus}
                currentItems={currentItems}
                handleOpenConfirm={handleOpenConfirm}
                handleModalOpen={handleModalOpen}
              />
              <TableBody style={{ position: "relative" }}>
                {orders
                  .filter((order) => {
                    if (!stateFilter) {
                      return order;
                    } else {
                      let currentState = order.distributorId
                        ? order.distributorState
                        : order.customAddressState;
                      return stateFilter === currentState;
                    }
                  })
                  .map((ord) => (
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
                              title={`${
                                ord.distributorCity
                                  ? ord.distributorCity
                                  : ord.customAddressCity
                              }, ${
                                ord.distributorState
                                  ? ord.distributorState
                                  : ord.customAddressState
                              }`}
                            >
                              <Typography className={classes.headerText} noWrap>
                                {`${
                                  ord.distributorName
                                    ? ord.distributorName
                                    : ord.customAddressName
                                }: ${
                                  ord.distributorCity
                                    ? ord.distributorCity
                                    : ord.customAddressCity
                                }, ${
                                  ord.distributorState
                                    ? ord.distributorState
                                    : ord.customAddressState
                                }`}
                              </Typography>
                            </Tooltip>
                            <div style={{ display: "flex" }}>
                              <Tooltip title="Delete Order">
                                <span>
                                  <IconButton
                                    onClick={() => handleRemoveOrder(ord.id)}
                                    disabled={patchLoading}
                                  >
                                    <CancelIcon
                                      fontSize="small"
                                      color="inherit"
                                    />
                                  </IconButton>
                                </span>
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
