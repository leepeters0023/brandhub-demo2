import React, { useState } from "react";

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

const MoneyCell = ({ initialCost, inputActive }) => {
    const { value: cost, bind: bindCost } = useMoneyInput(initialCost);
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

const handleSubmit = (event, id) => {
    //submit that RFQ!
}

const handleDecline = (event, id) => {
    //declined
}

const RFQAcceptOrDecline = () => {
    const classes = useStyles();
    const [values, setValues] = useState({
        amount: '',
    })

    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="stretch"
            style={{ width: "75%", minWidth: "600px" }}
            spacing={5}
        >
            <Grid item>
                <Typography> Accept or Decline Quote</Typography>
            </Grid>
            <Grid item>
                <MoneyCell value={values.amount} initialCost={formatMoney(values.amount)} />
            </Grid>
            <Grid item style={{ alignSelf: "flex-end" }}>
                <Button
                    className={classes.largeButton}
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        handleDecline()
                    }}
                >
                    Decline
                </Button>
                <Button
                    style={{ marginLeft: "10px" }}
                    className={classes.largeButton}
                    value={values.accepted}
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        handleSubmit()
                    }}
                >
                    Accept and Submit
              </Button>
            </Grid>
        </Grid>

    );
};

export default RFQAcceptOrDecline;