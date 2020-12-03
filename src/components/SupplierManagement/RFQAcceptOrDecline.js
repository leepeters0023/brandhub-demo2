import React, { useState } from "react";
//import { useSelector, useDispatch } from "react-redux";

import { formatMoney } from "../../utility/utilityFunctions";
import { useMoneyInput } from "../../hooks/InputHooks";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  controlGrid: {
    display: "flex",
  },
}));

const MoneyCell = ({ quote }) => {
  const { value: cost, bind: bindCost } = useMoneyInput(
    quote,
    undefined,
    undefined,
    true
  );
  //TODO, write update function and pass to useMoneyInput
  return (
    <TextField
      value={cost}
      variant="outlined"
      size="small"
      fullWidth
      {...bindCost}
    />
  );
};

// const returnNote = useSelector((state) => state.rfq.currentRFQ.returnNote);

const handleSubmit = (event, id) => {
  //submit that RFQ!
};

const handleDecline = (event, id) => {
  //declined
};

const RFQAcceptOrDecline = () => {
  const classes = useStyles();
  const [quoteValue] = useState(0);

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="stretch"
      style={{ width: "50%", minWidth: "600px" }}
      spacing={5}
    >
      <Grid sm={8} item>
        <Typography>Accept or Decline RFQ</Typography>
      </Grid>
      <Grid sm={12} item>
        <MoneyCell value={quoteValue} quote={formatMoney(quoteValue, true)} />
      </Grid>
      <Grid sm={12} item>
        <TextField
          label="Return Note"
          color="secondary"
          multiline
          fullWidth
          variant="outlined"
          size="small"
          rows="4"
          //value={returnNote}
          onChange={
            (event) => {}
            //update returnNote
          }
          onBlur={
            (event) => {}
            //update returnNote
          }
        />
      </Grid>
      <Grid sm={10} item style={{ alignSelf: "flex-end" }}>
        <Button
          className={classes.largeButton}
          variant="contained"
          color="secondary"
          onClick={() => {
            handleDecline();
          }}
        >
          Decline
        </Button>
        <Button
          style={{ marginLeft: "10px" }}
          className={classes.largeButton}
          value={quoteValue.accepted}
          variant="contained"
          color="secondary"
          onClick={() => {
            handleSubmit();
          }}
        >
          Accept and Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default RFQAcceptOrDecline;
