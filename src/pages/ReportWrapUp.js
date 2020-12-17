import React, { useState, useEffect, useCallback } from "react";
import { CSVLink } from "react-csv";
import PropTypes from "prop-types";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import { formatDate } from "../utility/utilityFunctions";

import { useSelector, useDispatch } from "react-redux";

import UserAutoComplete from "../components/Utility/UserAutoComplete";

import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Divider from "@material-ui/core/Divider";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const ReportWrapUp = ({ handleFiltersClosed }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [currentCSV, setCurrentCSV] = useState({ data: [], headers: [] });
  const [fromDate, setFromDate] = useState(
    format(formatDate(subDays(new Date(), 7)), "MM/dd/yyyy")
  );
  const [toDate, setToDate] = useState(
    format(formatDate(new Date()), "MM/dd/yyyy")
  );

  const userId = useSelector((state) => state.user.id);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>Wrap Up Report</Typography>
          <div className={classes.configButtons}>
            <div className={classes.innerConfigDiv}>
              <CSVLink
                data={currentCSV.data}
                headers={currentCSV.headers}
                style={{ textDecoration: "none" }}
              >
                <Button
                  className={classes.largeButton}
                  variant="contained"
                  color="secondary"
                  startIcon={<GetAppIcon />}
                  disabled={currentCSV.data.length === 0}
                >
                  EXPORT TO CSV
                </Button>
              </CSVLink>
            </div>
          </div>
        </div>
        <br />
        <div className={classes.searchComponents}>
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
              value={fromDate}
              onChange={(value) =>
                setFromDate(format(formatDate(value)), "MM/dd/yyyy")
              }
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
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
              value={toDate}
              onChange={(value) =>
                setToDate(format(formatDate(value)), "MM/dd/yyyy")
              }
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
      </Container>
    </>
  );
};
