import React, { useState, useEffect } from "react";

import { useInput } from "../../hooks/UtilityHooks";

import MaterialTable from "material-table";

import CircularProgress from "@material-ui/core/CircularProgress";
import AutoComplete from "@material-ui/lab/Autocomplete";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";
import AddIcon from "@material-ui/icons/Add";
import { tableIcons } from "../../utility/tableIcons";

//import { programs } from "../../assets/mockdata/Programs";
import items from "../../assets/mockdata/Items";
import programs from "../../assets/mockdata/Programs";

const itemNumbers = items.map((item) => item.itemNumber.toString());

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  settingsMargin: {
    marginBottom: "15px",
  },
  dateField: {
    width: "Calc(50% - 7.5px)",
    marginBottom: "15px",
  },
}));

const EditProgramModal = ({ handleClose, currentProgram }) => {
  const classes = useStyles();

  const [program, setProgram] = useState(null);
  const [currentItemNumber, setCurrentItemNumber] = useState(null);
  const [currentItems, setCurrentItems] = useState([]);
  const [selectedFromDate, setSelectedFromDate] = useState(
    new Date().toLocaleDateString()
  );
  const [selectedToDate, setSelectedToDate] = useState(
    new Date().toLocaleDateString()
  );

  const {
    value: programName,
    bind: bindProgramName,
    reset: resetProgramName,
  } = useInput("");
  const {
    value: programDescription,
    bind: bindProgramDescription,
    reset: resetProgramDesicription,
  } = useInput("");
  const {
    value: programGoals,
    bind: bindProgramGoals,
    reset: resetProgramGoals,
  } = useInput("");
  const {
    value: programStrategies,
    bind: bindProgramStrategies,
    reset: resetProgramStrategies,
  } = useInput("");

  const handleFromDateChange = (date) => {
    setSelectedFromDate(date);
  };
  const handleToDateChange = (date) => {
    setSelectedToDate(date);
  };

  const handleItemNumber = () => {
    const currentItemList = [...currentItems];
    if (
      currentItemList.filter((item) => item.itemNumber === item).length === 0
    ) {
      let newItem = items.find((item) => item.itemNumber === parseInt(currentItemNumber));
      currentItemList.push(newItem);
      setCurrentItems(currentItemList);
    }
  };

  const handleFormSubmit = (evt) => {
    evt.preventDefault();
    //temporary event handler
    console.log(programName, programDescription, programGoals, programStrategies)
    resetProgramName();
    resetProgramDesicription();
    resetProgramGoals();
    resetProgramStrategies();
  }

  useEffect(()=>{
    let onMountProgram = programs.find((prog) => prog.id = currentProgram)
    setProgram(onMountProgram);
  },[currentProgram])

  if (!program) {
    return <CircularProgress />
  }

  return (
    <>
      <IconButton
        className={classes.closeButton}
        onClick={() => {
          handleClose(false);
        }}
      >
        <CancelIcon fontSize="large" color="secondary" />
      </IconButton>
      <Typography className={classes.titleText}>{program.name}</Typography>
      <form>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            style={{ marginRight: "15px" }}
            color="secondary"
            className={classes.dateField}
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="fromDate"
            label="Program From Date"
            value={selectedFromDate}
            onChange={handleFromDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            color="secondary"
            className={classes.dateField}
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="toDate"
            label="Program To Date"
            value={selectedToDate}
            onChange={handleToDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
        <TextField
          className={classes.settingsMargin}
          variant="outlined"
          color="secondary"
          name="programName"
          type="text"
          label="Program Name"
          {...bindProgramName}
          fullWidth
        />
        <TextField
          multiline
          rows="5"
          className={classes.settingsMargin}
          variant="outlined"
          color="secondary"
          name="programDescription"
          type="text"
          label="Program Description"
          {...bindProgramDescription}
          fullWidth
        />
        <TextField
          className={classes.settingsMargin}
          multiline
          rows="3"
          variant="outlined"
          color="secondary"
          name="programGoals"
          type="text"
          label="Program Goals"
          {...bindProgramGoals}
          fullWidth
        />
        <TextField
          multiline
          rows="3"
          className={classes.settingsMargin}
          variant="outlined"
          color="secondary"
          name="programStrategies"
          type="text"
          label="Program Strategies"
          {...bindProgramStrategies}
          fullWidth
        />
        <br />
        <Typography
          className={classes.headerText}
          style={{ marginBottom: "15px" }}
        >
          Add Items
        </Typography>
        <div style={{ display: "flex", flexWrap: "none", width: "100%" }}>
          <AutoComplete
            fullWidth
            className={classes.settingsMargin}
            value={currentItemNumber}
            onChange={(event, value) => setCurrentItemNumber(value)}
            id="itemNumber"
            options={itemNumbers}
            getOptionLabel={(num) => num}
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label="Item Number"
                variant="outlined"
                size="small"
              />
            )}
          />
          <Button
            style={{
              height: "40px",
              marginLeft: "5px",
            }}
            variant="contained"
            color="primary"
            id="addItem"
            disabled={currentItemNumber === null}
            onClick={handleItemNumber}
          >
            <AddIcon color="secondary" />
          </Button>
        </div>
        <br />
        <MaterialTable
          title=""
          columns={[
            { title: "Item #", field: "itemNumber" },
            { title: "Brand", field: "brand" },
            { title: "Item Type", field: "itemType" },
            { title: "Qty/pk", field: "qty" },
            { title: "Price", field: "price" },
          ]}
          data={currentItems}
          editable={{
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...currentItems];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  setCurrentItems([...dataDelete]);
                  resolve();
                }, 500);
              }),
          }}
          icons={tableIcons}
          options={{
            paging: false,
            search: false,
            toolbar: false,
          }}
        />
        <br />
        <Button
        className={classes.largeButton}
        variant="contained"
        color="secondary"
        id="profile"
        onClick={handleFormSubmit}
      >
        SUBMIT
      </Button>
      </form>
      <br />
    </>
  )
}

export default EditProgramModal;