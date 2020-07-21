import React, { useState } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

//mock data
import items from "../assets/mockdata/Items";
import distributors from "../assets/mockdata/distributors";
import { TableContainer } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  previewImg: {
    width: "75px",
    height: "75px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  cartContainer: {
    maxHeight: "65vh",
  },
  headerCell: {
    padding: "0",
    height: "200px",
    width: "150px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
  },
  borderRight: {
    borderRight: "1px solid lightgrey",
  },
  colTitle: {
    width: "150px",
  },
  infoRow: {
    backgroundColor: "#ffcc80",
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
}));

const OrderPreOrderCart = (props) => {
  const classes = useStyles();

  const [open, setOpen] = useState(true);
  const [program, updateProgram] = useState("Apothic Launch");
  const [terms, setTermsChecked] = useState(false);

  const handleChangeSelect = (evt) => {
    updateProgram(evt.target.value);
  };

  return (
    <>
      <FormControl variant="outlined">
        <InputLabel id="program-select-label">Program</InputLabel>
        <Select
          labelId="program-select-label"
          id="program-select"
          value={program}
          onChange={handleChangeSelect}
          label="Program"
        >
          <MenuItem value={"Apothic Launch"}>Apothic Launch</MenuItem>
          <MenuItem value={"Barefoot Summer"}>Barefoot Summer</MenuItem>
          <MenuItem value={"Gallo Fall Promo"}>Gallo Fall Promo</MenuItem>
        </Select>
      </FormControl>
      <TableContainer className={classes.cartContainer}>
        <Table>
          <TableRow>
            <TableCell align="right">
              <div className={classes.tableControl}>
                <Typography>Order Details</Typography>
                <IconButton
                  aria-label="expand row"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </div>
            </TableCell>
          </TableRow>
          <TableCell style={{ padding: 0 }} colSpan={items.length + 1}>
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
        </Table>

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
                    <Typography className={classes.headerText} variant="h5">
                      {item.brand}
                    </Typography>
                    <img
                      id={item.itemNumber}
                      className={classes.previewImg}
                      src={item.imgUrl}
                      alt={item.itemType}
                    />
                    <Typography variant="body2" color="textSecondary">
                      {`${item.itemType} | ${item.itemNumber}`}
                    </Typography>
                  </div>
                </TableCell>
              ))}
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
      <Typography className={classes.headerText}>
        TERMS AND CONDITIONS
      </Typography>
      <br />
      <Typography className={classes.bodyText}>
        Use of this site is subject to all Gallo use policies. By using this
        site, you warrant that you are a Gallo or Gallo Sales employee and that
        you have reviewed, read, and understand the Compliance rules below
        associated with this site and with your intended order. You further
        warrant that you will not, under any circumstances, order items for use
        in stated where prohibited or use items in a prohibited manner. If you
        have any questions, please contact your Compliance representative.
      </Typography>
      <br />
      <FormControlLabel
        control={
          <Checkbox
            checked={terms}
            onChange={() => setTermsChecked(!terms)}
            name="Terms"
            color="primary"
          />
        }
        label=" I have read and accept the Terms and Conditions"
      />
      <br />
      <Grid container spacing={5}>
        <Grid item md={7} xs={12}>
          <br />
          <Typography className={classes.headerText}>Order Notes</Typography>
          <br />
          <TextField
            multiline
            fullWidth
            variant="outlined"
            size="small"
            rows="5"
          />
        </Grid>
        <Grid item md={5} xs={12}>
          <Typography className={classes.titleText}>Subtotal:</Typography>
          <Typography className={classes.titleText}>Shipping:</Typography>
          <Typography className={classes.titleText}>Handling:</Typography>
          <br />
          <Divider />
          <br />
          <Typography className={classes.titleText}>Total:</Typography>
        </Grid>
      </Grid>
      <div className={classes.orderControl}>
      <Button
          className={classes.largeButton}
          color="secondary"
          variant="contained"
        >
          SAVE ORDER
        </Button>
        <Button
          className={classes.largeButton}
          color="primary"
          variant="contained"
        >
          PURCHASE ORDER
        </Button>
      </div>
      <br />
      <br />
    </>
  );
};

export default OrderPreOrderCart;
