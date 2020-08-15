import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  removeGridItem,
  setOrders,
  setHasFetched,
} from "../../redux/slices/programTableSlice";
import {
  addNewOrder,
  updateOrder,
  removeProgramOrders,
  fetchProgramOrders,
} from "../../redux/slices/ordersSlice";

import {
  mapNewOrdersToProgram,
  updateProgramOrders,
} from "../../utility/utilityFunctions";

import PreOrderCartTable from "./CurrentPreOrderTable";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import AutoComplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";

//mock data
import distributors from "../../assets/mockdata/distributors";
const budgets = ["Regional Budget", "User Budget", "Key Account Budget"];

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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const TotalsDiv = React.memo(({ program }) => {
  const classes = useStyles();
  const programTotal = useSelector(
    (state) => state.programTable.programs[`${program}`].programDetails.total
  );
  const grandTotal = useSelector((state) => state.programTable.details.total);

  return (
    <>
      <Typography
        className={classes.titleText}
      >{`Program Total: $${programTotal.toFixed(2)}`}</Typography>
      <Typography
        className={classes.titleText}
      >{`Pre-Order Total: $${grandTotal.toFixed(2)}`}</Typography>
    </>
  );
});

const OrderPreOrderCart = ({ userType, handleModalOpen }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [open, setOpen] = useCallback(useState(true));
  const [terms, setTermsChecked] = useCallback(useState(false));
  const [tableStyle, setTableStyle] = useCallback(useState("tableOpen"));
  const [budget, setBudget] = useCallback(useState(null));
  const [program, setProgram] = useCallback(useState(undefined));
  const [backdrop, setBackdrop] = useCallback(useState(false));

  const isLoading = useSelector((state) => state.orders.isLoading);

  const tableData = useSelector(
    (state) => state.programTable.programs,
    shallowEqual
  );

  const hasFetched = useSelector((state) => state.programTable.hasFetched)

  const handleRemove = (program, itemNum) => {
    dispatch(removeGridItem({ program, itemNum }));
  };

  const handleSaveOrder = () => {
    for (let program in tableData) {
      if (
        !(
          Object.keys(tableData[`${program}`].items).length === 0 &&
          tableData[`${program}`].orders.length === 0
        )
      ) {
        if (tableData[program].orders.length === 0) {
          let orders = mapNewOrdersToProgram(
            tableData[program].details,
            distributors,
            tableData[program].items
          );
          orders.forEach((ord) => {
            dispatch(
              addNewOrder({
                id: ord.id,
                distributorId: ord.distributorId,
                distributorName: ord.distributorName,
                type: ord.type,
                program: ord.program,
                items: ord.items,
                budget: ord.budget,
                totalItems: ord.totalItems,
                totalEstCost: ord.totalEstCost,
                status: ord.status,
              })
            );
          });
          dispatch(setOrders({ program: program, orders: orders }));
        } else {
          let updatedOrders = updateProgramOrders(
            tableData[program].orders,
            tableData[program].items
          );
          if (updatedOrders.length === 0) {
            dispatch(removeProgramOrders({ program: program }));
            dispatch(setOrders({ program: program, orders: [] }));
          } else {
            updatedOrders.forEach((ord) => {
              dispatch(
                updateOrder({
                  orderId: ord.id,
                  items: ord.items,
                  budget: ord.budget,
                  totalItems: ord.totalItems,
                  totalEstCost: ord.totalEstCost,
                  status: ord.status,
                })
              );
            });
            dispatch(setOrders({ program: program, orders: updatedOrders }));
          }
        }
      }
    }
    setTimeout(() => {
      setBackdrop(false);
    }, 1000);
  };

  const programArray = [];
  for (let program in tableData) {
    programArray.push(tableData[program].details);
  }
  programArray.sort((a, b) => {
    return a.name.toLowerCase()[0] < b.name.toLowerCase()[0]
      ? -1
      : a.name.toLowerCase()[0] > b.name.toLowerCase()[0]
      ? 1
      : 0;
  });

  useEffect(() => {
    if (programArray.length > 0 && !program) {
      setProgram(programArray[0].id);
    }
  });

  useEffect(() => {
    if (!hasFetched[program] && program) {
      dispatch(fetchProgramOrders(userType, program));
      dispatch(setHasFetched({ program: [`${program}`] }));
    }
  }, [program, userType, dispatch, hasFetched]);

  if (programArray.length === 0 || !program) {
    return (
      <Backdrop className={classes.backdrop} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <>
      <Backdrop className={classes.backdrop} open={backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <PreOrderCartTable
        currentPrograms={programArray}
        distributors={distributors}
        open={open}
        setOpen={setOpen}
        tableStyle={tableStyle}
        setTableStyle={setTableStyle}
        handleModalOpen={handleModalOpen}
        handleRemove={handleRemove}
        setProgram={setProgram}
        isLoading={isLoading}
      />
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
        </Grid>
        <Grid item md={5} xs={12}>
          <Typography className={classes.headerText}>Order Notes</Typography>
          <br />
          <TextField
            color="secondary"
            multiline
            fullWidth
            variant="outlined"
            size="small"
            rows="5"
          />
          <br />
          <br />
          <AutoComplete
            value={budget}
            onChange={(event, value) => setBudget(value)}
            id="budget"
            options={budgets}
            getOptionLabel={(budget) => budget}
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label="Budget"
                variant="outlined"
                size="small"
              />
            )}
          />
          <br />

          {program ? (
            <TotalsDiv program={program} />
          ) : (
            <>
              <Typography
                className={classes.titleText}
              >{`Program Total:`}</Typography>
              <Typography
                className={classes.titleText}
              >{`Pre-Order Total:`}</Typography>
            </>
          )}
        </Grid>
      </Grid>
      <br />
      <br />
      <div className={classes.orderControl}>
        <Button
          className={classes.largeButton}
          color="secondary"
          variant="contained"
          onClick={() => {
            setBackdrop(true);
            handleSaveOrder(program);
          }}
        >
          SAVE ORDER
        </Button>
        {userType !== "field1" && (
          <Button
            className={classes.largeButton}
            color="secondary"
            variant="contained"
          >
            PURCHASE ORDER
          </Button>
        )}
        {userType === "field1" && (
          <Button
            className={classes.largeButton}
            color="secondary"
            variant="contained"
          >
            SUBMIT ORDER
          </Button>
        )}
      </div>
      <br />
      <br />
    </>
  );
};

OrderPreOrderCart.propTypes = {
  userType: PropTypes.string.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
};

export default React.memo(OrderPreOrderCart);