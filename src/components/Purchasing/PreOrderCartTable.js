import React, { useState } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";
import { setGridItem, setItemTotal } from "../../redux/slices/programCartSlice";

import SelectorMenus from "../Utility/SelectorMenus";

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
import { makeStyles } from "@material-ui/core/styles";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  headerCell: {
    padding: "0",
    height: "184px",
    minWidth: "150px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    textAlign: "center",
  },
  borderRight: {
    borderRight: "1px solid lightgrey",
    width: "196px",
  },
  colTitle: {
    width: "150px",
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
}));

const MemoInputCell = React.memo(({ program, distributor, itemNumber }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const value = useSelector(
    (state) =>
      state.programCart[`${program}`].items[`${itemNumber}`].distributors[distributor]
  );

  return (
    <TableCell className={classes.borderRight} style={{ zIndex: "-100" }}>
      <InputBase
        style={{ textAlign: "center", zIndex: "0" }}
        fullWidth
        size="small"
        id={`${distributor}-${itemNumber}`}
        value={value}
        onChange={(evt) => {
          dispatch(
            setGridItem({
              program: program,
              itemNumber: `${itemNumber}`,
              distributor: distributor,
              value: evt.target.value,
            })
          );
          dispatch(setItemTotal({ program: program, itemNumber: `${itemNumber}` }));
        }}
      />
    </TableCell>
  );
});

const TotalItemCell = React.memo(({ program, itemNumber }) => {
  const classes = useStyles();
  const value = useSelector(
    (state) => state.programCart[`${program}`].items[`${itemNumber}`].itemDetails.totalItems
  );
  return (
    <TableCell style={{ textAlign: "center" }}>
      <div className={classes.infoCell}>{value}</div>
    </TableCell>
  );
});

const TotalEstCostCell = React.memo(({ program, itemNumber }) => {
  const classes = useStyles();
  const value = useSelector(
    (state) => state.programCart[`${program}`].items[`${itemNumber}`].itemDetails.estTotal
  );
  return (
    <TableCell style={{ textAlign: "center" }}>
      <div className={classes.infoCell}>{`$${value.toFixed(2)}`}</div>
    </TableCell>
  );
});

const PreOrderCartTable = (props) => {
  const {
    currentPrograms,
    distributors,
    open,
    setOpen,
    tableStyle,
    setTableStyle,
    handleModalOpen,
    handleRemove,
  } = props;

  const [currentProgram, setCurrentProgram] = useState(currentPrograms[0].id);

  const currentItems = useSelector(
    (state) => state.programCart.programs[`${currentProgram}`].items
  );

  const handleProgram = (id) => {
    setCurrentProgram(id);
  };

  const classes = useStyles();
  return (
    <>
      <TableContainer className={classes.cartContainer}>
        <Table stickyHeader={true} size="small" aria-label="pre-order-table">
          {Object.keys(currentItems).length === 0 ? (
            <TableHead>
              <TableRow>
                <TableCell style={{ zIndex: "100", width: "300px" }}>
                  <SelectorMenus type="programs" programs={currentPrograms} handler={handleProgram} />
                </TableCell>
                <TableCell>
                  You currently have no items in this cart...
                </TableCell>
              </TableRow>
            </TableHead>
          ) : (
            <>
              <TableHead>
                <TableRow>
                  <TableCell style={{ zIndex: "100" }}>
                    <SelectorMenus type="programs" programs={currentPrograms} handler={handleProgram} />
                  </TableCell>
                  {currentItems.map((item) => (
                    <TableCell key={item.itemNumber}>
                      <div className={classes.headerCell}>
                        <Tooltip title="Remove from Cart">
                          <IconButton
                            onClick={() => {
                              handleRemove(item.itemNumber);
                            }}
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </Tooltip>
                        <img
                          id={item.itemNumber}
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
                  <TableCell align="right" style={{ top: 197, zIndex: "100" }}>
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
                        style={{ top: 197, textAlign: "center" }}
                        key={item.itemNumber}
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
                    style={{ padding: 0, top: 258 }}
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
                                className={classes.borderRight}
                                style={{
                                  position: "sticky",
                                  left: 0,
                                  backgroundColor: "white",
                                  zIndex: "100",
                                }}
                              >
                                <div
                                  className={classes.colTitle}
                                  style={{ zIndex: "100" }}
                                >
                                  <Typography className={classes.headerText}>
                                    Items Per Pack
                                  </Typography>
                                </div>
                              </TableCell>
                              {currentItems.map((item) => (
                                <TableCell align="center" key={item.itemNumber}>
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
                                className={classes.borderRight}
                                style={{
                                  position: "sticky",
                                  left: 0,
                                  backgroundColor: "white",
                                  zIndex: "100",
                                }}
                              >
                                <div
                                  className={classes.colTitle}
                                  style={{ zIndex: "100" }}
                                >
                                  <Typography className={classes.headerText}>
                                    Total Qty of Items
                                  </Typography>
                                </div>
                              </TableCell>
                              {currentItems.map((item) => (
                                <TotalItemCell
                                  program={currentProgram}
                                  itemNumber={item.itemNumber}
                                  key={item.itemNumber}
                                />
                              ))}
                            </TableRow>
                            <TableRow className={classes.infoRow}>
                              <TableCell
                                className={classes.borderRight}
                                style={{
                                  position: "sticky",
                                  left: 0,
                                  backgroundColor: "white",
                                  zIndex: "100",
                                }}
                              >
                                <div
                                  className={classes.colTitle}
                                  style={{ zIndex: "100" }}
                                >
                                  <Typography className={classes.headerText}>
                                    Item Est Cost
                                  </Typography>
                                </div>
                              </TableCell>
                              {currentItems.map((item) => (
                                <TableCell align="center" key={item.itemNumber}>
                                  {`$${item.price.toFixed(2)}`}
                                </TableCell>
                              ))}
                            </TableRow>
                            <TableRow className={classes.infoRow}>
                              <TableCell
                                className={classes.borderRight}
                                style={{
                                  position: "sticky",
                                  left: 0,
                                  backgroundColor: "white",
                                  zIndex: "100",
                                }}
                              >
                                <div
                                  className={classes.colTitle}
                                  style={{ zIndex: "100" }}
                                >
                                  <Typography className={classes.headerText}>
                                    Total Est Cost
                                  </Typography>
                                </div>
                              </TableCell>
                              {currentItems.map((item) => (
                                <TotalEstCostCell
                                  program={currentProgram}
                                  itemNumber={item.itemNumber}
                                  key={item.itemNumber}
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
                {distributors.map((dist) => (
                  <TableRow key={dist.id}>
                    <TableCell
                      className={classes.borderRight}
                      style={{
                        position: "sticky",
                        left: 0,
                        backgroundColor: "#cbcbcb",
                        zIndex: "1",
                      }}
                    >
                      <div className={classes.colTitle}>
                        <Typography className={classes.headerText}>
                          {dist.name}
                        </Typography>
                      </div>
                    </TableCell>
                    {currentItems.map((item) => (
                      <MemoInputCell
                        key={item.itemNumber}
                        program={currentProgram}
                        distributor={dist.name}
                        itemNumber={item.itemNumber}
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

PreOrderCartTable.propTypes = {
  currentPrograms: PropTypes.array.isRequired,
  distributors: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  tableStyle: PropTypes.string,
  setTableStyle: PropTypes.func.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default React.memo(PreOrderCartTable);
