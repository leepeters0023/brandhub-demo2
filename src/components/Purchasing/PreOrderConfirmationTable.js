import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

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

const CollapseRow = ({ classes, rowData, items }) => {
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
        <TableCell align="left">{rowData.orderNumber}</TableCell>
        <TableCell align="left">{rowData.distributorName}</TableCell>
        <TableCell align="left">
          {`123 Road St., Burlington VT 05401`}
        </TableCell>
        <TableCell align="left">{rowData.totalItems}</TableCell>
        <TableCell align="left">{`${formatMoney(rowData.estTotal)}`}</TableCell>
        <TableCell align="left">---</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} style={{ overFlowX: "scroll" }}>
              <Typography
                className={classes.headerText}
                gutterBottom
                component="div"
              >
                Item Details
              </Typography>
              <TableContainer>
                <Table size="small" aria-label="item-details">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      {items.map((item) => (
                        <TableCell align="center" key={item.id}>
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              flexDirection: "column",
                              alignItem: "center",
                            }}
                          >
                            <Typography variant="body2" color="textSecondary">
                              {`${item.brand}`}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {`${item.itemType}`}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {item.itemNumber}
                            </Typography>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="left">
                        <Typography className={classes.bodyText}>
                          Est. Cost:
                        </Typography>
                      </TableCell>
                      {rowData.items.map((item) => (
                        <TableCell align="center" key={item.itemNumber}>
                          {`${formatMoney(item.price)}`}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell align="left">
                        <Typography className={classes.bodyText}>
                          Total Items:
                        </Typography>
                      </TableCell>
                      {rowData.items.map((item) => (
                        <TableCell align="center" key={item.itemNumber}>
                          {item.totalItems}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell align="left">
                        <Typography className={classes.bodyText}>
                          Est. Total:
                        </Typography>
                      </TableCell>
                      {rowData.items.map((item) => (
                        <TableCell align="center" key={item.itemNumber}>
                          {`${formatMoney(item.estTotal)}`}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell align="left">
                        <Typography className={classes.bodyText}>
                          Act. Total
                        </Typography>
                      </TableCell>
                      {rowData.items.map((item) => (
                        <TableCell align="center" key={item.itemNumber}>
                          ---
                        </TableCell>
                      ))}
                    </TableRow>
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

const PreOrderConfirmationTable = ({ orders, items }) => {
  const classes = useStyles();

  return (
    <>
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "600px" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell className={classes.headerText} align="left">
                Order #
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Distributor
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Address
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Total Items
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Est. Cost
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Act. Cost
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <CollapseRow
                key={order.orderNumber}
                classes={classes}
                rowData={order}
                items={items}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

PreOrderConfirmationTable.propTypes = {
  orders: PropTypes.array,
  items: PropTypes.array,
};

export default PreOrderConfirmationTable;
