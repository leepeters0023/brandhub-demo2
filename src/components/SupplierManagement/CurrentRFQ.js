import React from "react";
import format from "date-fns/format";

import { useSelector, useDispatch } from "react-redux";

import {
  updateNote,
  updateSupplierNote,
  updateRFQDates,
} from "../../redux/slices/rfqSlice";
import { formatDate } from "../../utility/utilityFunctions";

import ImageWrapper from "../Utility/ImageWrapper";
import SpecDetailTable from "./SpecDetailTable";
import OrderPatchLoading from "../Utility/OrderPatchLoading";

import Grid from "@material-ui/core/Grid";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  bidText: {
    marginBottom: "5px",
  },
  gridBorder: {
    borderRight: "1px solid #cbcbcb",
    [theme.breakpoints.down("md")]: {
      borderRight: "0px solid black",
    },
  },
  fullHeightGridItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    height: "100%",
    width: "100%",
  },
  squareGridItem: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  squarePaper: {
    backgroundColor: "whitesmoke",
    width: "100%",
    paddingBottom: "100%",
    position: "relative",
  },
  squareInnerPaper: {
    position: "absolute",
    width: "Calc(100% - 50px)",
    height: "Calc(100% - 50px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "25px",
  },
  largePreview: {
    objectFit: "contain",
    width: "100%",
    heigth: "100%",
  },
  specTableCellRoot: {
    padding: "5px 0px",
  },
  specTableCellDetailRoot: {
    padding: "5px 10px",
  },
}));

const CurrentRFQ = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const currentRFQ = useSelector((state) => state.rfq.currentRFQ);
  const currentUserRole = useSelector((state) => state.user.role);

  return (
    <>
      <Grid
        container
        spacing={5}
        style={{ width: "75%", minWidth: "600px" }}
        alignItems="stretch"
      >
        <Grid item lg={6} sm={12} className={classes.gridBorder}>
          <Grid container spacing={2}>
            <Grid item sm={6}>
              {currentUserRole !== "supplier" ? (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    color="secondary"
                    fullWidth
                    className={classes.dateField}
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="quoteDue"
                    label="Quote Due"
                    value={
                      currentRFQ.dueDate !== "---"
                        ? format(
                            formatDate(new Date(currentRFQ.dueDate)),
                            "MM/dd/yyyy"
                          )
                        : format(new Date(), "MM/dd/yyyy")
                    }
                    onChange={(value) =>
                      dispatch(
                        updateRFQDates(
                          currentRFQ.id,
                          "due-date",
                          new Date(value)
                        )
                      )
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              ) : (
                <Typography className={classes.bodyText}>
                  {`Quote Due: ${
                    currentRFQ.dueDate !== "---"
                      ? format(
                          formatDate(new Date(currentRFQ.dueDate)),
                          "MM/dd/yyyy"
                        )
                      : format(new Date(), "MM/dd/yyyy")
                  }`}
                </Typography>
              )}
            </Grid>
            <Grid item sm={6}>
              {currentUserRole !== "supplier" ? (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    color="secondary"
                    fullWidth
                    className={classes.dateField}
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="dueDate"
                    label="In-Market Date"
                    value={
                      currentRFQ.inMarketDate !== "---"
                        ? format(
                            formatDate(new Date(currentRFQ.inMarketDate)),
                            "MM/dd/yyyy"
                          )
                        : format(new Date(), "MM/dd/yyyy")
                    }
                    onChange={(value) =>
                      dispatch(
                        updateRFQDates(
                          currentRFQ.id,
                          "in-market-date",
                          new Date(value)
                        )
                      )
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              ) : (
                <Typography className={classes.bodyText}>
                  {`In-Market Date: ${
                    currentRFQ.inMarketDate !== "---"
                      ? format(
                          formatDate(new Date(currentRFQ.inMarketDate)),
                          "MM/dd/yyyy"
                        )
                      : format(new Date(), "MM/dd/yyyy")
                  }`}
                </Typography>
              )}
            </Grid>
          </Grid>
          <br />
          <br />
          <TableContainer className={classes.TableContainer}>
            <Table className={classes.table} size="small">
              <TableBody>
                <TableRow>
                  <TableCell
                    classes={{ root: classes.specTableCellRoot }}
                    align="left"
                    className={classes.headerText}
                  >
                    Sequence #
                  </TableCell>
                  <TableCell
                    classes={{ root: classes.specTableCellDetailRoot }}
                    align="left"
                    className={classes.bodyText}
                  >
                    {currentRFQ.itemNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    classes={{ root: classes.specTableCellRoot }}
                    align="left"
                    className={classes.headerText}
                  >
                    Item Type
                  </TableCell>
                  <TableCell
                    classes={{ root: classes.specTableCellDetailRoot }}
                    align="left"
                    className={classes.bodyText}
                  >
                    {currentRFQ.itemType}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    classes={{ root: classes.specTableCellRoot }}
                    align="left"
                    className={classes.headerText}
                  >
                    Project Id
                  </TableCell>
                  <TableCell
                    classes={{ root: classes.specTableCellDetailRoot }}
                    align="left"
                    className={classes.bodyText}
                  >
                    {currentRFQ.projectNum}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    classes={{ root: classes.specTableCellRoot }}
                    align="left"
                    className={classes.headerText}
                  >
                    Program
                  </TableCell>
                  <TableCell
                    classes={{ root: classes.specTableCellDetailRoot }}
                    align="left"
                    className={classes.bodyText}
                  >
                    {currentRFQ.program}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    classes={{ root: classes.specTableCellRoot }}
                    align="left"
                    className={classes.headerText}
                  >
                    {"Brand(s)"}
                  </TableCell>
                  <TableCell
                    classes={{ root: classes.specTableCellDetailRoot }}
                    align="left"
                    className={classes.bodyText}
                  >
                    {currentRFQ.brand}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    classes={{ root: classes.specTableCellRoot }}
                    align="left"
                    className={classes.headerText}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    classes={{ root: classes.specTableCellDetailRoot }}
                    align="left"
                    className={classes.bodyText}
                  >
                    {currentRFQ.totalItems}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          <br />
          {currentUserRole !== "supplier" && (
            <TextField
              label="Supplier Notes"
              color="secondary"
              multiline
              fullWidth
              variant="outlined"
              size="small"
              rows="4"
              value={currentRFQ.supplierNote}
              onChange={(event) =>
                dispatch(updateNote({ note: event.target.value }))
              }
              onBlur={(event) =>
                dispatch(updateSupplierNote(currentRFQ.id, event.target.value))
              }
            />
          )}
          {currentUserRole === "supplier" && (
            <>
              <Typography className={classes.headerText}>Notes:</Typography>
              <br />
              <Typography className={classes.bodyText}>
                {currentRFQ.supplierNote}
              </Typography>
            </>
          )}
        </Grid>
        <Grid item lg={6} sm={12}>
          <div className={classes.fullHeightGridItem}>
            <Typography className={classes.titleText}>
              Product Specifications:
            </Typography>
            <br />
            <SpecDetailTable
              classes={classes}
              specArray={Object.keys(currentRFQ.itemSpec).map((spec) => ({
                spec: spec,
                desc: currentRFQ.itemSpec[spec],
              }))}
            />
          </div>
        </Grid>
      </Grid>
      <br />
      <br />
      <Divider style={{ width: "75%", minWidth: "600px" }} />
      <br />
      <Grid
        container
        spacing={5}
        style={{ width: "75%", minWidth: "600px" }}
        alignItems="stretch"
      >
        {currentRFQ.imgUrlLg.map((img, index) => (
          <Grid item md={4} sm={12} key={index}>
            <div className={classes.squareGridItem}>
              <Paper className={classes.squarePaper}>
                <div className={classes.squareInnerPaper}>
                  <ImageWrapper
                    id={currentRFQ.id}
                    imgClass={classes.largePreview}
                    alt={`Item number ${currentRFQ.itemNumber}`}
                    imgUrl={img}
                  />
                </div>
              </Paper>
            </div>
          </Grid>
        ))}
      </Grid>
      <OrderPatchLoading />
    </>
  );
};

export default CurrentRFQ;
