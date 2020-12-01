import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
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
}));

const CollapseRow = ({ shippingInfo, classes }) => {
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
        <TableCell align="left">{shippingInfo.distributor}</TableCell>
        <TableCell align="left">{shippingInfo.address}</TableCell>
        <TableCell align="left">{shippingInfo.attn}</TableCell>
        <TableCell align="left">{shippingInfo.carrier}</TableCell>
        <TableCell align="left">{shippingInfo.method}</TableCell>
        <TableCell align="left">{shippingInfo.actualShip}</TableCell>
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
                        <TableCell align="center">{item.sequenceNum}</TableCell>
                        <TableCell align="center">{item.itemType}</TableCell>
                        <TableCell align="center">{item.totalItems}</TableCell>
                        <TableCell align="center">{item.shippingStatus}</TableCell>
                        <TableCell align="center">{item.tracking}</TableCell>
                        <TableCell align="center">{item.tax}</TableCell>
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

const ShippingParameterTable = ({ shippingInfo }) => {
  const classes = useStyles();

  return (
    <>
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "Calc(100vh - 300px)" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell className={classes.headerText} align="left">
                Distributor:
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
            </TableRow>
          </TableHead>
          <TableBody>
            {shippingInfo.map((param, index) =>(
              <CollapseRow 
              key={index}
              classes={classes}
              shippingInfo={param}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

ShippingParameterTable.propTypes = {
  shippingInfo: PropTypes.array.isRequired,
};

export default React.memo(ShippingParameterTable, (prev, next) => {
  return prev.shippingInfo.length === next.shippingInfo.length
});
