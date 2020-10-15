import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import addDays from "date-fns/addDays";
import format from "date-fns/format";

import { useSelector, useDispatch } from "react-redux";

import { fetchFilteredItems } from "../redux/slices/itemSlice";

import { setFilterType } from "../redux/slices/filterSlice";

import { useInput } from "../hooks/UtilityHooks";

import OrderItemViewControl from "../components/Purchasing/OrderItemViewControl";
import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";
import FilterChipList from "../components/Filtering/FilterChipList";

import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

import ViewStreamIcon from "@material-ui/icons/ViewStream";
import ViewModuleIcon from "@material-ui/icons/ViewModule";

import { regions } from "../utility/constants";

const TerritorySelector = React.memo(({ classes, handleTerritories }) => (
  <div className={classes.inputRow}>
    <Autocomplete
      multiple
      fullWidth
      id="tags-standard"
      options={regions}
      getOptionLabel={(option) => option.name}
      onChange={(_evt, value) => handleTerritories(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Territory"
          size="small"
        />
      )}
    />
  </div>
), (prev, next) => {
  return (
    Object.keys(prev.classes).length === Object.keys(next.classes).length
  )
});

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  inputRow: {
    width: "80%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    minWidth: "700px",
    maxWidth: "1000px",
  },
  inputField: {
    width: "31.5%",
  },
}));

const ProgramNew = ({ userType, handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [currentView, setView] = useCallback(useState("list"));
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState({}));
  const [currentProgramItems, setCurrentProgramItems] = useCallback(
    useState([])
  );
  const [currentTerritories, setCurrentTerritories] = useCallback(useState([]));
  const [allTerritories, setAllTerritories] = useCallback(useState(false));
  const [startDate, setStartDate] = useCallback(
    useState(format(new Date(), "MM/dd/yyyy"))
  );
  const [endDate, setEndDate] = useCallback(
    useState(format(addDays(new Date(), 30), "MM/dd/yyyy"))
  );
  const { value: name, bind: bindName } = useCallback(useInput(""));

  const itemsLoading = useSelector((state) => state.programs.itemsIsLoading);
  const currentUserRole = useSelector((state) => state.user.role);
  const currentItems = useSelector((state) => state.items.items);

  const handlePreview = (itemNumber) => {
    let item = currentItems.find((item) => item.itemNumber === itemNumber);
    handleCurrentItem(item);
    handlePreviewModal(true);
  };

  const handleModalClose = () => {
    handlePreviewModal(false);
  };

  const handleProgramItem = useCallback(
    (item, remove) => {
      let items = [...currentProgramItems];
      let currentItem = items.find((i) => i.id === item.id);
      if (!currentItem) {
        items.push(item);
        setCurrentProgramItems(items);
      } else if (currentItem && remove) {
        items = items.filter((i) => i.id !== item.id);
        setCurrentProgramItems(items);
      }
    },
    [currentProgramItems, setCurrentProgramItems]
  );

  const handleTerritories = useCallback((value, _type, _filter) => {
    setCurrentTerritories(value);
  }, [setCurrentTerritories]);

  useEffect(() => {
    dispatch(setFilterType({ type: "item-all" }));
    handleFilterDrawer(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentItems.length === 0 && userType && currentUserRole.length > 0) {
      dispatch(fetchFilteredItems("inStock"));
    }
  }, [currentItems, dispatch, userType, currentUserRole]);

  return (
    <>
      <ItemPreviewModal
        type="program"
        currentItem={currentItem}
        handleClose={handleModalClose}
        previewModal={previewModal}
      />

      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <div className={classes.titleImage}>
            <Typography className={classes.titleText}>
              Create New Program
            </Typography>
          </div>
          <div className={classes.configButtons}>
            <div className={classes.innerConfigDiv}>
              <>
                <Tooltip title="View List">
                  <IconButton
                    onClick={() => {
                      setView("list");
                    }}
                  >
                    <ViewStreamIcon
                      fontSize="large"
                      color={currentView === "list" ? "primary" : "inherit"}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Grid">
                  <IconButton
                    onClick={() => {
                      setView("grid");
                    }}
                  >
                    <ViewModuleIcon
                      fontSize="large"
                      color={currentView === "grid" ? "primary" : "inherit"}
                    />
                  </IconButton>
                </Tooltip>
              </>
            </div>
          </div>
        </div>
        <br />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography className={classes.headerText}>
            Program Details
          </Typography>

          <div className={classes.inputRow}>
            <TextField
              className={classes.inputField}
              style={{ marginBottom: "7px" }}
              color="secondary"
              name="programName"
              type="text"
              label="Program Name"
              value={name}
              {...bindName}
              variant="outlined"
              size="small"
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                color="secondary"
                className={classes.inputField}
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="startDate"
                label="Program Start Date"
                value={startDate}
                onChange={(value) => setStartDate(value)}
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
                id="endDate"
                label="Program End Date"
                value={endDate}
                onChange={(value) => setEndDate(value)}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
          <br />
          <FormControlLabel
            control={
              <Switch
                checked={allTerritories}
                onChange={() => {
                  setAllTerritories(!allTerritories);
                }}
                name="allTerritoryToggle"
              />
            }
            label="All Territories"
          />
          <br />
          {!allTerritories && (
            <TerritorySelector
              classes={classes}
              handleTerritories={handleTerritories}
            />
          )}
          <br />
          <Button
            className={classes.largeButton}
            variant="contained"
            color="secondary"
            disabled={
              currentProgramItems.length === 0 ||
              name.length === 0 ||
              (!allTerritories && currentTerritories.length === 0)
            }
          >
            CREATE PROGRAM
          </Button>
        </div>
        <br />
        <Divider />
        <br />
        <Typography className={classes.headerText}>Current Items</Typography>
        <br />
        {currentProgramItems.length > 0 ? (
          <>
            <OrderItemViewControl
              type={"new-program-current"}
              currentView="list"
              handlePreview={handlePreview}
              items={currentProgramItems}
              secondaryAddFunction={handleProgramItem}
            />
            <br />
          </>
        ) : (
          <>
            <Typography className={classes.bodyText}>
              You have not added any items to this program yet ...
            </Typography>
            <br />
            <Divider />
            <br />
          </>
        )}

        <Typography className={classes.headerText}>Add Items</Typography>
        <br />
        <div style={{ display: "flex", alignItems: "center", height: "32px" }}>
          <Typography
            variant="body2"
            color="textSecondary"
            className={classes.hoverText}
            style={{ marginRight: "20px" }}
            onClick={() => {
              handleFilterDrawer(!filtersOpen);
            }}
          >
            Filters
          </Typography>
          <FilterChipList classes={classes} />
        </div>
        {itemsLoading ? (
          <CircularProgress />
        ) : (
          <OrderItemViewControl
            type={"new-program"}
            currentView={currentView}
            handlePreview={handlePreview}
            items={currentItems}
            secondaryAddFunction={handleProgramItem}
          />
        )}
      </Container>
      <br />
    </>
  );
};

ProgramNew.propTypes = {
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
  programId: PropTypes.string,
};

export default React.memo(ProgramNew);
