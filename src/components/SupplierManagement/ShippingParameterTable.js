import React, { useState, useCallback } from "react";
import format from "date-fns/format";
import { formatMoney } from "../../utility/utilityFunctions";

import { useSelector } from "react-redux";

import ReallocateShipmentModal from "./ReallocateShipmentModal";

import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  clickableCell: {
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#737373",
      color: "white",
    },
  },
  okChip: {
    backgroundColor: "#004d00",
    color: "white",
  },
  holdChip: {
    backgroundColor: "#920000",
    color: "white",
    "&:hover": {
      cursor: "pointer",
    },
  },
  supHoldChip: {
    backgroundColor: "#920000",
    color: "white",
  },
}));

const CollapseRow = ({
  shippingInfo,
  classes,
  handleTrackingClick,
  poStatus,
  handleModalOpen,
  role,
}) => {
  const [open, setOpen] = useCallback(useState(false));
  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">
          {shippingInfo.distributor !== "---"
            ? shippingInfo.distributor
            : shippingInfo.name}
        </TableCell>
        <TableCell align="left">{shippingInfo.address}</TableCell>
        <TableCell align="left">{shippingInfo.attn}</TableCell>
        <TableCell align="left">{shippingInfo.carrier}</TableCell>
        <TableCell align="left">
          {[...new Set(shippingInfo.items.map((i) => i.method))].join(", ")}
        </TableCell>
        <TableCell align="left">
          {[
            ...new Set(
              shippingInfo.items.map((i) =>
                i.actShipDate !== "---"
                  ? format(new Date(i.actShipDate), "MM/dd/yyyy")
                  : "---"
              )
            ),
          ].join(", ")}
        </TableCell>
        <TableCell align="center" padding="checkbox">
          {poStatus === "draft" ? (
            "---"
          ) : shippingInfo.onShipHold ? (
            role !== "supplier" ? (
              <Tooltip title="Click to Reallocate Shipment">
                <Chip
                  classes={{ root: classes.holdChip }}
                  color="primary"
                  label="ON HOLD"
                  onClick={() => {
                    if (role !== "supplier") {
                      handleModalOpen(shippingInfo.id);
                    }
                  }}
                />
              </Tooltip>
            ) : (
              <Chip
                classes={{ root: classes.supHoldChip }}
                color="primary"
                label="ON HOLD"
              />
            )
          ) : (
            <Chip
              classes={{ root: classes.okChip }}
              color="primary"
              label="OK"
            />
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} style={{ overFlowX: "scroll" }}>
              <TableContainer>
                <Table size="small" aria-label="item-details">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        <Typography className={classes.bodyText}>
                          Sequence Number
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography className={classes.bodyText}>
                          Item Type
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography className={classes.bodyText}>
                          Total Items
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography className={classes.bodyText}>
                          Shipping Status
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography className={classes.bodyText}>
                          Tracking
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography className={classes.bodyText}>
                          Tax
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {shippingInfo.items.map((item) => (
                      <TableRow key={`${item.id}`}>
                        <TableCell align="center">{item.itemNumber}</TableCell>
                        <TableCell align="center">{item.itemType}</TableCell>
                        <TableCell align="center">{item.totalItems}</TableCell>
                        <TableCell align="center">{item.shipStatus}</TableCell>
                        <TableCell
                          align="center"
                          className={
                            item.trackingNum !== "---"
                              ? classes.clickableCell
                              : null
                          }
                          onClick={
                            item.trackingNum !== "---"
                              ? () => handleTrackingClick(item.id)
                              : null
                          }
                        >
                          {item.trackingNum}
                        </TableCell>
                        <TableCell align="center">
                          {item.tax === "---"
                            ? item.tax
                            : formatMoney(item.tax)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ShippingParameterTable = ({ handleTrackingClick }) => {
  const classes = useStyles();

  const [isReallocateModalOpen, setReallocateModalOpen] = useCallback(
    useState(false)
  );
  const [paramId, setParamId] = useCallback(useState(null));

  const shippingInfo = useSelector(
    (state) => state.purchaseOrder.currentPO.shippingParams
  );
  const poStatus = useSelector((state) => state.purchaseOrder.currentPO.status);
  const currentUserRole = useSelector((state) => state.user.role);

  const handleOpenModal = (id) => {
    console.log(id);
    setParamId(id);
    setReallocateModalOpen(true);
  };

  const handleModalClose = () => {
    setParamId(null);
    setReallocateModalOpen(false);
  };

  return (
    <>
      {isReallocateModalOpen && paramId && (
        <ReallocateShipmentModal
          modalOpen={isReallocateModalOpen}
          paramId={paramId}
          handleClose={handleModalClose}
        />
      )}
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "Calc(100vh - 300px)" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell className={classes.headerText} align="left">
                Name:
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Ship To:
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Attn:
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Carrier:
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Method:
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Act. Ship:
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Ship Status:
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shippingInfo.map((param, index) => (
              <CollapseRow
                key={index}
                classes={classes}
                shippingInfo={param}
                handleTrackingClick={handleTrackingClick}
                poStatus={poStatus}
                handleModalOpen={handleOpenModal}
                role={currentUserRole}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default React.memo(ShippingParameterTable);
