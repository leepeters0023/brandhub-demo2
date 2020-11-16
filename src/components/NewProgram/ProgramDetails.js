import React from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";

import { useSelector, useDispatch } from "react-redux";
import { useInput } from "../../hooks/InputHooks";

import { updateName, updateDate } from "../../redux/slices/newProgramSlice";

import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const ProgramDetails = ({ classes }) => {
  const dispatch = useDispatch();

  const currentName = useSelector((state) => state.newProgram.name);
  const orderStartDate = useSelector(
    (state) => state.newProgram.orderStartDate
  );
  const orderEndDate = useSelector((state) => state.newProgram.orderEndDate);
  const inMarketStartDate = useSelector(
    (state) => state.newProgram.inMarketStartDate
  );
  const inMarketEndDate = useSelector(
    (state) => state.newProgram.inMarketEndDate
  );
  const { value: name, bind: bindName } = useInput(currentName);

  const handleDate = (type, value) => {
    dispatch(
      updateDate({
        dateType: type,
        value: format(new Date(value), "MM/dd/yyyy"),
      })
    );
  };

  const handleName = (value) => {
    dispatch(updateName({ name: value }));
  };

  return (
    <>
      <br />
      <br />
      <TextField
        className={classes.inputField}
        style={{ width: "50%", minWidth: "500px" }}
        color="secondary"
        name="programName"
        type="text"
        label="Program Name"
        value={name}
        {...bindName}
        onBlur={(evt) => handleName(evt.target.value)}
        variant="outlined"
        size="small"
      />
      <br />
      <br />
      <div className={classes.inputRow}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            color="secondary"
            className={classes.inputField}
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="orderStart"
            label="Order Window Start"
            value={orderStartDate}
            onChange={(value) => handleDate("orderStartDate", value)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            color="secondary"
            className={classes.inputField}
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="orderEnd"
            label="Order Window End"
            value={orderEndDate}
            onChange={(value) => handleDate("orderEndDate", value)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
      </div>
      <br />
      <div className={classes.inputRow}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            color="secondary"
            className={classes.inputField}
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="inMarketStart"
            label="In Market Start"
            value={inMarketStartDate}
            onChange={(value) => handleDate("inMarketStartDate", value)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            color="secondary"
            className={classes.inputField}
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="inMarketEnd"
            label="In Market End"
            value={inMarketEndDate}
            onChange={(value) => handleDate("inMarketEndDate", value)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
      </div>
    </>
  );
};

ProgramDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default React.memo(ProgramDetails);
