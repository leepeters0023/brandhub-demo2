import React, { useState } from "react";

import ItemOptions from "./ItemOptions";
import SelectorMenus from "./SelectorMenus";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

//mockData
import distributors from "../assets/mockdata/distributors";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  formControl: {
    position: "absolute",
    top: "15px",
    right: "60px",
  },
  programImage: {
    width: "90%",
    height: "auto",
    objectFit: "cover",
    borderRadius: "50%",
  },
  dialogGrid: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  cartButton: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
  },
  headerCell: {
    padding: "0",
    height: "184px",
    width: "150px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    textAlign: "center",
  },
  borderRight: {
    borderRight: "1px solid lightgrey",
  },
  colTitle: {
    width: "150px",
  },
  infoRow: {
    backgroundColor: "#404040",
  },
  infoCell: {
    textAlign: "center",
    width: "150px",
  },
  tableClosed: {
    zIndex: "-5",
  }
}));

const ProgramModal = (props) => {
  const classes = useStyles();
  const {
    program: { name, imgUrl, desc, goals, timeframe },
    items,
    handleClose,
    userType,
  } = props;

  const [open, setOpen] = useState(true);
  const [tableStyle, setTableStyle] = useState("tableOpen");

  return (
    <>
      <Grid container spacing={5} className={classes.dialogGrid}>
        <IconButton
          className={classes.closeButton}
          onClick={() => {
            handleClose(false);
          }}
        >
          <CancelIcon fontSize="large" color="secondary" />
        </IconButton>
        {userType !== "field1" && (
          <div className={classes.formControl}>
            <SelectorMenus type="bdms" />
          </div>
        )}
        <Grid item md={3} style={{ textAlign: "center" }}>
          <img src={imgUrl} className={classes.programImage} alt={name} />
          <Typography className={classes.bodyText}>{timeframe}</Typography>
        </Grid>
        <Grid item md={9}>
          <Typography className={classes.headerText}>Description</Typography>
          <Typography className={classes.bodyText}>{desc}</Typography>
          <br />
          <Typography className={classes.headerText}>Goals</Typography>
          <Typography className={classes.bodyText}>{goals}</Typography>
        </Grid>
      </Grid>
      <br />
      <Divider />
      <br />
      <TableContainer className={classes.cartContainer}>
        <Table stickyHeader={true} size="small" aria-label="pre-order-table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.borderRight}>
                <div className={classes.colTitle}>
                  <Typography className={classes.headerText}>
                    Brand / Item
                  </Typography>
                </div>
              </TableCell>
              {items.map((item) => (
                <TableCell key={item.itemNumber}>
                  <div className={classes.headerCell}>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography className={classes.headerText}>
                        {item.brand}
                      </Typography>
                      <ItemOptions />
                    </div>
                    <img
                      id={item.itemNumber}
                      className={classes.previewImg}
                      src={item.imgUrl}
                      alt={item.itemType}
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell align="right" style={{ top: 197 }}>
                <div className={classes.tableControl}>
                  <Tooltip title="Details">
                    <IconButton
                      aria-label="expand row"
                      onClick={() => {
                        setOpen(!open)
                        !open ? setTableStyle(null) : setTableStyle("tableClosed")
                      }}
                    >
                      {open ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </div>
              </TableCell>
              {items.map((item) => {
                return (
                  <TableCell style={{ top: 197 }} key={item.itemNumber}>
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
              <TableCell style={{ padding: 0 }} colSpan={items.length + 1} className={classes[tableStyle]}>
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
                          {items.map((item) => (
                            <TableCell align="center" key={item.itemNumber}>
                              <div className={classes.infoCell}>
                                {item.qty !== "Single Unit"
                                  ? item.qty.split(" ")[0]
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
                          {items.map((item) => (
                            <TableCell align="center" key={item.itemNumber}>
                              0
                            </TableCell>
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
                          {items.map((item) => (
                            <TableCell align="center" key={item.itemNumber}>
                              $TBD
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
                          {items.map((item) => (
                            <TableCell align="center" key={item.itemNumber}>
                              $TBD
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow className={classes.infoRow}>
                          <TableCell className={classes.borderRight}>
                            <div className={classes.colTitle}>
                              <Typography className={classes.headerText}>
                                Inv. Balance
                              </Typography>
                            </div>
                          </TableCell>
                          {items.map((item) => (
                            <TableCell align="center" key={item.itemNumber}>
                              NA
                            </TableCell>
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
                {items.map((item) => (
                  <TableCell key={`${dist.name}-${item.itemNumber}`}>
                    <TextField
                      color="secondary"
                      variant="outlined"
                      size="small"
                      id={`${dist.name}-${item.itemNumber}`}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <br />
      <div className={classes.cartButton}>
        <Button
          className={classes.largeButton}
          color="primary"
          variant="contained"
        >
          ADD TO CART
        </Button>
      </div>
      <br />
      <br />
    </>
  );
};

export default ProgramModal;
