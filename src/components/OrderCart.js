import React, { useState } from "react";

import TextField from "@material-ui/core/TextField";
import AutoComplete from "@material-ui/lab/Autocomplete";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

//mock data
import items from "../assets/mockdata/Items";
import distributors from "../assets/mockdata/distributors";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  itemQty: {
    width: "100px",
  },
  orderControl: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
}));

let itemList = [...items];
let initialBudgets = itemList.map((item) => {
  return { id: `${item.itemNumber}`, budget: "" };
});

const OrderCart = () => {
  const classes = useStyles();

  const [budgets, setBudget] = useState(initialBudgets);
  const [currentItems, setItems] = useState(itemList);
  const [terms, setTermsChecked] = useState(false);
  const [rush, setRushChecked] = useState(false);
  const [shippingLocation, setShippingLocation] = useState(null);

  const handleChangeBudget = (evt) => {
    let newBudgets = budgets.map((budget) => {
      return budget.id === evt.target.id
        ? { id: budget.id, budget: evt.target.value }
        : budget;
    });
    setBudget(newBudgets);
  };

  const handleRemove = (i) => {
    currentItems.splice(i, 1);
    let newItems = [...currentItems];
    setItems(newItems);
  };

  return (
    <>
      <TableContainer className={classes.cartContainer}>
        <Table className={classes.table} aria-label="in-stock-table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell className={classes.headerText} align="left">
                Preview
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Item
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Item #
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Qty / Item
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Cost
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Qty
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Budget
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Total Cost
              </TableCell>
              <TableCell className={classes.headerText}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((row, index) => (
              <TableRow key={row.itemNumber} hover>
                <TableCell>
                  <Tooltip title="Remove from Cart">
                    <IconButton onClick={() => handleRemove(index)}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell align="left">
                  <img
                    id={row.itemNumber}
                    className={classes.previewImg}
                    src={row.imgUrl}
                    alt={row.itemType}
                  />
                </TableCell>
                <TableCell align="left">{`${row.brand} ${row.itemType}`}</TableCell>
                <TableCell align="left">{row.itemNumber}</TableCell>
                <TableCell align="left">{row.qty}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>
                  <TextField
                    className={classes.itemQty}
                    variant="outlined"
                    size="small"
                    id={`${row.itemNumber}`}
                  />
                </TableCell>
                <TableCell>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel htmlFor="budget">Budget</InputLabel>
                    <Select
                      native
                      value={
                        budgets.find(
                          (budget) => budget.id === `${row.itemNumber}`
                        ).budget
                      }
                      onChange={handleChangeBudget}
                      id={`${row.itemNumber}`}
                      label="Budget"
                      inputProps={{
                        name: "Budget",
                        id: `${row.itemNumber}`,
                      }}
                    >
                      <option value={""} aria-label="Budget" />
                      <option value={1}>Region 1 Budget</option>
                      <option value={2}>Region 2 Budget</option>
                      <option value={3}>Retion 3 Budget</option>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="center">$TBD</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <br />
      <Grid container spacing={5}>
        <Grid item md={7} xs={12}>
          <Typography className={classes.headerText}>
            TERMS AND CONDITIONS
          </Typography>
          <br />
          <Typography className={classes.bodyText}>
            Use of this site is subject to all Gallo use policies. By using this
            site, you warrant that you are a Gallo or Gallo Sales employee and
            that you have reviewed, read, and understand the Compliance rules
            below associated with this site and with your intended order. You
            further warrant that you will not, under any circumstances, order
            items for use in stated where prohibited or use items in a
            prohibited manner. If you have any questions, please contact your
            Compliance representative.
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
          <AutoComplete
            value={shippingLocation}
            onChange={(event, value) => setShippingLocation(value)}
            id="shippingLocation"
            options={distributors}
            getOptionLabel={(distributor) => distributor.name}
            renderInput={(params)=> <TextField {...params} label="Shipping Location" variant="outlined" size="small" />}
            />
          <br/>
          <br/>
          <Typography className={classes.headerText}>Rush Order</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={rush}
                onChange={() => setRushChecked(!rush)}
                name="Rush Order"
                color="primary"
              />
            }
            label=" This is a rush order"
          />
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

export default OrderCart;
