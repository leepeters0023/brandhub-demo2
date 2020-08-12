import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";
import { removeGridItem } from "../../redux/slices/programTableSlice";

import PreOrderCartTable from "./PreOrderCartTable";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import AutoComplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
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

  const tableData = useSelector((state) => state.programTable);

  const handleRemove = (program, itemNum) => {
    dispatch(removeGridItem({ program, itemNum }));
  };

  const programArray = [];
  for (let program in tableData.programs) {
    programArray.push(tableData.programs[program].details);
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

  if (programArray.length === 0) {
    return <CircularProgress />;
  }

  return (
    <>
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
