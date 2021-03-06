import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { updateCompItemSelection } from "../../redux/slices/complianceItemsSlice";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import AutorenewIcon from "@material-ui/icons/Autorenew";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const headCells = [
  { id: "itemNumber", disablePadding: false, label: "Sequence #", sort: true },
  { id: "program", disablePadding: false, label: "Program", sort: true },
  { id: "brand", disablePadding: false, label: "Brand", sort: true },
  { id: "itemType", disablePadding: false, label: "Item Type", sort: true },
  { id: "state", disablePadding: false, label: "State", sort: false },
  { id: "ruleType", disablePadding: false, label: "Rule Type", sort: true },
  { id: "desc", disablePadding: false, label: "Rule Description", sort: false },
  { id: "status", disablePadding: false, label: "Status", sort: false },
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
  const currentUserRole = useSelector((state) => state.user.role);

  return (
    <TableHead>
      <TableRow>
        {(currentUserRole === "compliance" || currentUserRole === "super") && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "select all items" }}
            />
          </TableCell>
        )}
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
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  emailButton: {
    color: "#920000",
    "&:hover": {
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

const ComplianceItemsTable = ({
  items,
  itemsLoading,
  handleSort,
  scrollRef,
  tableRef,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemNumber");
  const [selected, setSelected] = useState([]);

  const currentUserRole = useSelector((state) => state.user.role);
  const selectedCompItems = useSelector(
    (state) => state.complianceItems.selectedItems
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = items
        .filter(
          (item) =>
            item.ruleType === "Prior Approval" ||
            item.ruleType === "Internal Approval" ||
            item.ruleType === "Coupon Prior Approval"
        )
        .map((item) => item.id);
      setSelected(newSelecteds);
      dispatch(updateCompItemSelection({ selectedItems: newSelecteds }));
      return;
    }
    setSelected([]);
  };

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    handleSort({ order: isAsc ? "desc" : "asc", orderBy: property });
  };

  const handleClick = (_event, id) => {
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
    if (newSelected.length >= 1) {
      dispatch(updateCompItemSelection({ selectedItems: newSelected }));
    } else {
      dispatch(updateCompItemSelection({ selectedItems: [] }));
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  useEffect(() => {
    if (selectedCompItems.length === 0 && selected.length > 0) {
      setSelected([]);
    }
  }, [selectedCompItems, selected]);

  return (
    <>
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "Calc(100vh - 250px)" }}
        ref={scrollRef}
      >
        <Table
          stickyHeader
          className={classes.table}
          style={{ minWidth: "1325px" }}
          ref={tableRef}
        >
          <EnhancedTableHead
            classes={classes}
            onRequestSort={handleRequestSort}
            order={order}
            orderBy={orderBy}
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={items.length}
          />
          <TableBody>
            {!itemsLoading && items.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={11}>
                  <Typography className={classes.headerText}>
                    {`There are no items that match the current search criteria..`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!itemsLoading &&
              items.length > 0 &&
              items.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `compliance-Checkbox-${index}`;
                return (
                  <TableRow key={index} hover>
                    {(currentUserRole === "compliance" ||
                      currentUserRole === "super") && (
                      <>
                        {row.active ? (
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              disabled={
                                row.ruleType !== "Prior Approval" &&
                                row.ruleType !== "Internal Approval" &&
                                row.ruleType !== "Coupon Prior Approval"
                              }
                              inputProps={{ "aria-labelledby": labelId }}
                              onClick={(event) => event.stopPropagation()}
                              onChange={(event) => {
                                handleClick(event, row.id);
                                event.stopPropagation();
                              }}
                            />
                          </TableCell>
                        ) : (
                          <TableCell padding="checkbox">
                            <Tooltip title="Activate Rule">
                              <IconButton>
                                <AutorenewIcon
                                  fontSize="small"
                                  color="inherit"
                                />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        )}
                      </>
                    )}

                    <TableCell align="left">{row.itemNumber}</TableCell>
                    <TableCell align="left">{row.program}</TableCell>
                    {row.brand && row.brand !== "---" && row.brand.length > 1 ? (
                      <Tooltip
                        placement="left"
                        title={`${row.brand.join(", ")}`}
                      >
                        <TableCell align="left">
                          {row.brand[0]}
                          <MoreHorizIcon
                            fontSize="small"
                            color="inherit"
                            style={{ float: "right" }}
                          />
                        </TableCell>
                      </Tooltip>
                    ) : (
                      <TableCell align="left">
                        {row.brand && row.brand !== "---" ? row.brand[0] : "---"}
                      </TableCell>
                    )}
                    <TableCell align="left">{row.itemType}</TableCell>
                    <TableCell align="left">{row.state}</TableCell>
                    <TableCell align="left">{row.ruleType}</TableCell>
                    <TableCell align="left">{row.ruleDesc}</TableCell>
                    <TableCell align="left">
                      {row.status === "Pending" &&
                      (row.ruleType === "Prior Approval" ||
                        row.ruleType === "Coupon Prior Approval" ||
                        row.ruleType === "Internal Approval") ? (
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <Typography variant="body2">{row.status}</Typography>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography
                              variant="body2"
                              style={{ marginRight: "10px" }}
                            >
                              {row.emailSent !== "---"
                                ? `Email sent on ${row.emailSent}`
                                : "Email not sent"}
                            </Typography>
                            {/* <Typography
                              variant="body2"
                              className={classes.emailButton}
                            >
                              {"(resend)"}
                            </Typography> */}
                          </div>
                        </div>
                      ) : (
                        <Typography variant="body2">{row.status}</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            {itemsLoading && (
              <TableRow>
                <TableCell align="left" colSpan={9}>
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

ComplianceItemsTable.propTypes = {
  items: PropTypes.array,
  handleSort: PropTypes.func.isRequired,
  itemsLoading: PropTypes.bool.isRequired,
  scrollRef: PropTypes.any,
  tableRef: PropTypes.any,
};

export default ComplianceItemsTable;
