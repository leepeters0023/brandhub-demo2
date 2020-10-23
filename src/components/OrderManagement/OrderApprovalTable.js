import React, { useState } from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";
import format from "date-fns/format";

import { formatMoney } from "../../utility/utilityFunctions";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const headCells = [
  { id: "id", disablePadding: false, label: "Order #", sort: true },
  { id: "type", disablePadding: false, label: "Type", sort: false },
  { id: "user", disablePadding: false, label: "Person", sort: true },
  { id: "program", disablePadding: false, label: "Program", sort: false },
  { id: "state", disablePadding: false, label: "State", sort: false },
  { id: "orderDate", disablePadding: false, label: "Order Date", sort: true },
  {
    id: "estTotal",
    disablePadding: false,
    label: "Est. Total",
    sort: false,
  },
  {
    id: "paidBudget",
    disablePadding: false,
    label: "Budget Paid",
    sort: false,
  },
  {
    id: "remainingBudget",
    disablePadding: false,
    label: "Budget Rem.",
    sort: false,
  },
  {
    id: "actions",
    disablePadding: false,
    label: "Deny",
    sort: false,
  },
];

const EnhancedTableHead = (props) => {
  const {
    classes,
    rowCount,
    order,
    orderBy,
    onRequestSort,
    onSelectAllClick,
    numSelected,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all items" }}
          />
        </TableCell>
        {headCells.map((headCell) => {
          if (!headCell.sort) {
            return (
              <TableCell
                className={classes.headerText}
                key={headCell.id}
                align="left"
              >
                {headCell.label}
              </TableCell>
            );
          } else {
            return (
              <TableCell
                className={classes.headerText}
                key={headCell.id}
                align="left"
                padding={headCell.disablePadding ? "none" : "default"}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <span className={classes.visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            );
          }
        })}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  orderHistoryRow: {
    "&&:hover": {
      cursor: "pointer",
    },
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

const OrderApprovalTable = ({
  orders,
  handleSort,
  isOrdersLoading,
  scrollRef,
  handleApproval,
  selected,
  setSelected,
}) => {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("orderDate");

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    handleSort({ order: isAsc ? "desc" : "asc", orderBy: property });
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orders.map((order) => order.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleRowClick = (id) => {
    navigate(`/orders/open/${id}#approval`);
  };

  return (
    <>
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "Calc(100vh - 400px)" }}
        ref={scrollRef}
      >
        <Table stickyHeader className={classes.table}>
          <EnhancedTableHead
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            onSelectAllClick={handleSelectAllClick}
            rowCount={orders.length}
          />
          <TableBody>
            {!isOrdersLoading && orders.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={11}>
                  <Typography className={classes.headerText}>
                    {`You currently don't have any orders on record that match this search criteria..`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!isOrdersLoading &&
              orders.length > 0 &&
              orders.map((row, index) => {
                const isOrderSelected = isSelected(row.id);
                const labelId = `approvals-Checkbox-${index}`;
                return (
                  <TableRow
                    key={row.id}
                    hover
                    className={classes.orderHistoryRow}
                    onClick={() => {
                      handleRowClick(row.id);
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isOrderSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          event.stopPropagation();
                          handleClick(event, row.id);
                        }}
                      />
                    </TableCell>
                    <TableCell align="left">{row.id}</TableCell>
                    <TableCell align="left">{row.type}</TableCell>
                    <TableCell align="left">{row.userName}</TableCell>
                    <TableCell align="left">
                      {row.program ? row.program : "---"}
                    </TableCell>
                    <TableCell>{row.state}</TableCell>
                    <TableCell align="left">
                      {format(new Date(row.orderDate), "MM/dd/yyyy")}
                    </TableCell>
                    <TableCell align="left">
                      {row.totalEstCost !== "---"
                        ? formatMoney(row.totalEstCost)
                        : row.totalEstCost}
                    </TableCell>
                    <TableCell>$5,000.00</TableCell>
                    <TableCell>$25,000.00</TableCell>
                    <TableCell align="right">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Tooltip title="Deny">
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                          >
                            <CancelIcon color="inherit" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            {isOrdersLoading && (
              <TableRow>
                <TableCell align="left" colSpan={7}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

OrderApprovalTable.propTypes = {
  orders: PropTypes.array,
  handleSort: PropTypes.func.isRequired,
  isOrdersLoading: PropTypes.bool.isRequired,
  scrollRef: PropTypes.any.isRequired,
  handleApproval: PropTypes.func.isRequired,
};

export default OrderApprovalTable;
