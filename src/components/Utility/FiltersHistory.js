import React, {useState, useCallback} from "react";
import PropTypes from "prop-types";
import subDays from "date-fns/subDays";
import format from "date-fns/format";

import { useDispatch } from "react-redux";

import { setClear } from "../../redux/slices/filterSlice";

import BrandAutoComplete from "../Utility/BrandAutoComplete";
import DistributorAutoComplete from "../Utility/DistributorAutoComplete";
import UserAutoComplete from "../Utility/UserAutoComplete";
import StatusSelector from "../Utility/StatusSelector";

import { useSelector } from "react-redux";

import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const FiltersHistory = ({
  reset,
  setReset,
  handleFilters,
  classes,
  sequenceNum,
  bindSequenceNum,
  program,
  bindProgram,
  handleSearch,
  historyType,
}) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useCallback(useState("submitted"));

  const currentUserRole = useSelector((state) => state.user.role);
  const toDate = useSelector((state) => state.filters.toDate);
  const fromDate = useSelector((state) => state.filters.fromDate);

  return (
    <>
      <List>
        <ListItem>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              fullWidth
              color="secondary"
              className={classes.dateField}
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="fromDate"
              label="Order From Date"
              value={fromDate || format(subDays(new Date(), 7), "MM/dd/yyyy")}
              onChange={(value) => handleFilters(value, "fromDate")}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </ListItem>
        <ListItem>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              fullWidth
              color="secondary"
              className={classes.dateField}
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="toDate"
              label="Order To Date"
              value={toDate || format(new Date(), "MM/dd/yyyy")}
              onChange={(value) => handleFilters(value, "toDate")}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </ListItem>
        <ListItem />
        {currentUserRole !== "field1" && (
          <ListItem>
            <UserAutoComplete
              classes={classes}
              handleChange={handleFilters}
              reset={reset}
              setReset={setReset}
              filterType={"history"}
            />
          </ListItem>
        )}
        <ListItem>
          <BrandAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"history"}
          />
        </ListItem>
        {historyType !== "rollup" && (
          <ListItem>
            <DistributorAutoComplete
              classes={classes}
              handleChange={handleFilters}
              reset={reset}
              setReset={setReset}
              filterType={"history"}
            />
          </ListItem>
        )}
        {historyType === "rollup" && (
          <ListItem>
            <StatusSelector
              handleStatus={handleFilters}
              status={status}
              setStatus={setStatus}
              classes={classes}
              filterType={"history"}
            />
          </ListItem>
        )}
        <ListItem>
          <TextField
            className={classes.queryField}
            color="secondary"
            fullWidth
            name="program"
            type="text"
            label="Program"
            value={program}
            {...bindProgram}
            variant="outlined"
            size="small"
          />
        </ListItem>
        <ListItem>
          <TextField
            className={classes.queryField}
            color="secondary"
            fullWidth
            name="sequenceNumber"
            type="text"
            label="Sequence #"
            value={sequenceNum}
            {...bindSequenceNum}
            variant="outlined"
            size="small"
          />
        </ListItem>
        <ListItem />
        <ListItem />
        <ListItem>
          <Button
            fullWidth
            className={classes.largeButton}
            variant="contained"
            color="secondary"
            onClick={handleSearch}
          >
            SEARCH
          </Button>
        </ListItem>
        <ListItem>
          <Button
            fullWidth
            className={classes.largeButton}
            variant="contained"
            color="secondary"
            onClick={() => {
              dispatch(setClear());
            }}
          >
            CLEAR FILTERS
          </Button>
        </ListItem>
      </List>
    </>
  );
};

FiltersHistory.propTypes = {
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  handleFilters: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  sequenceNum: PropTypes.string.isRequired,
  bindSequenceNum: PropTypes.object.isRequired,
  program: PropTypes.string.isRequired,
  bindProgram: PropTypes.object.isRequired,
};

export default FiltersHistory;
