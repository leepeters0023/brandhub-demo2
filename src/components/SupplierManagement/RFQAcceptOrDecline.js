import React, { useState } from "react";

import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    ...theme.global,
    controlGrid: {
        display: "flex",
    },
}));

const RFQAcceptOrDecline = ({ }) => {
    const classes = useStyles();
    const [values, setValues] = useState({
        amount: '',
        accepted: false,
        declined: false,
        notes: '',
    })

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        console.log(event.target.value)
    };

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
                <Typography style={{ marginBottom: "10px" }}> Accept or Decline Quote</Typography>
                <Button
                    className={classes.largeButton}
                    disabled={values.accepted}
                    value={"true"}
                    variant="contained"
                    color="secondary"
                    onClick={handleChange("accepted")}
                >
                    Accept
              </Button>
                <Button
                    className={classes.largeButton}
                    disabled={values.declined}
                    value={"true"}
                    variant="contained"
                    color="secondary"
                    style={{ marginLeft: "10px" }}
                    onClick={handleChange("declined")}
                >
                    Decline
              </Button>
            </Grid>
            <Grid item>
                <FormControl fullWidth className={classes.margin} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        value={values.amount}
                        onChange={handleChange('amount')}
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        labelWidth={60}
                    />
                </FormControl>
            </Grid>
            <Grid item style={{alignSelf: "flex-end"}}>
                <Button
                    className={classes.largeButton}
                    value={values.accepted}
                    variant="contained"
                    color="secondary"
                >
                    Submit
              </Button>
            </Grid>
        </Grid>

    );
};

export default RFQAcceptOrDecline;