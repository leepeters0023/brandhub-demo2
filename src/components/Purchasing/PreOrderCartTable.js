import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setGridItem, setItemTotal } from "../../redux/slices/programCartSlice";

import SelectorMenus from "../Utility/SelectorMenus";

import TextField from "@material-ui/core/TextField";
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
import { makeStyles } from "@material-ui/core/styles";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  headerCell: {
    padding: "0",
    height: "184px",
    width: "150px",
    maxWidth: "150px",
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
    width: "150px",
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

const MemoInputCell = React.memo(
  ({ distributor, itemNumber }) => {
    const dispatch = useDispatch();
    const value = useSelector((state) => state.programCart.items[`${itemNumber}`].distributors[distributor]);

    return (
      <TableCell>
        <TextField
          label={distributor.split(" ")[0]}
          color="secondary"
          variant="outlined"
          size="small"
          id={`${distributor}-${itemNumber}`}
          value={
            value
          }
          onChange={(evt) => {
            dispatch(
              setGridItem({
                itemNumber: `${itemNumber}`,
                distributor: distributor,
                value: evt.target.value,
              })
            );
            dispatch(setItemTotal({itemNumber: `${itemNumber}`}))
          }}
        />
      </TableCell>
    );
  }
);

const TotalItemCell = React.memo(({ itemNumber }) => {
  const value = useSelector((state) => state.programCart.items[`${itemNumber}`].itemDetails.totalItems)
  return (
    <TableCell style={{textAlign: "center"}}>
      {value}
    </TableCell>
  )
})

const TotalEstCostCell = React.memo(({ itemNumber }) => {
  const value = useSelector((state) => state.programCart.items[`${itemNumber}`].itemDetails.estTotal)
  return (
    <TableCell style={{textAlign: "center"}}>
      {`$${value.toFixed(2)}`}
    </TableCell>
  )
})

const PreOrderCartTable = (props) => {
  const {
    currentItems,
    distributors,
    open,
    setOpen,
    tableStyle,
    setTableStyle,
    handleModalOpen,
    handleRemove,
  } = props;

  const classes = useStyles();
  return (
    <>
      <TableContainer className={classes.cartContainer}>
        <Table stickyHeader={true} size="small" aria-label="pre-order-table">
          <TableHead>
            <TableRow>
              <TableCell>
                <SelectorMenus type="programs" />
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
              <TableCell align="right" style={{ top: 197 }}>
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
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
                      <TableBody>
                        <TableRow className={classes.infoRow}>
                          <TableCell className={classes.borderRight}>
                            <div className={classes.colTitle}>
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
                          <TableCell className={classes.borderRight}>
                            <div className={classes.colTitle}>
                              <Typography className={classes.headerText}>
                                Total Qty of Items
                              </Typography>
                            </div>
                          </TableCell>
                          {currentItems.map((item) => (
                            <TotalItemCell itemNumber={item.itemNumber} key={item.itemNumber} />
                          ))}
                        </TableRow>
                        <TableRow className={classes.infoRow}>
                          <TableCell className={classes.borderRight}>
                            <div className={classes.colTitle}>
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
                          <TableCell className={classes.borderRight}>
                            <div className={classes.colTitle}>
                              <Typography className={classes.headerText}>
                                Total Est Cost
                              </Typography>
                            </div>
                          </TableCell>
                          {currentItems.map((item) => (
                            <TotalEstCostCell itemNumber={item.itemNumber} key={item.itemNumber} />
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {distributors.map((dist) => (
              <TableRow key={dist.id}>
                <TableCell className={classes.borderRight}>
                  <div className={classes.colTitle}>
                    <Typography className={classes.headerText}>
                      {dist.name}
                    </Typography>
                  </div>
                </TableCell>
                {currentItems.map((item) => (
                  <MemoInputCell
                    key={item.itemNumber}
                    distributor={dist.name}
                    itemNumber={item.itemNumber}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default React.memo(PreOrderCartTable)
