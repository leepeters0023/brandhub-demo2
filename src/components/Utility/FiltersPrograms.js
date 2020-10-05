import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

import BrandAutoComplete from "../Utility/BrandAutoComplete";

import { useSelector, useDispatch } from "react-redux";

import { updateSingleFilter, setChips } from "../../redux/slices/filterSlice";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const MonthsList = React.memo(
  ({ listItems, handleCheckToggle, monthsChecked, setMonthsChecked }) => {
    return (
      <List component="div" disablePadding>
        {listItems.map((item) => {
          const labelId = `checkbox-list-label-${item}`;

          return (
            <ListItem
              key={item}
              role={undefined}
              dense
              button
              onClick={() => {
                handleCheckToggle(item, monthsChecked, setMonthsChecked, "month");
              }}
            >
              <ListItemIcon>
                <Checkbox
                  color="secondary"
                  edge="start"
                  checked={monthsChecked.indexOf(item) !== -1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${item}`} />
            </ListItem>
          );
        })}
      </List>
    );
  }
);

const UnitsList = React.memo(
  ({ listItems, handleCheckToggle, unitsChecked, setUnitsChecked }) => {
    return (
      <List component="div" disablePadding>
        {listItems.map((item) => {
          const labelId = `checkbox-list-label-${item}`;

          return (
            <ListItem
              key={item}
              role={undefined}
              dense
              button
              onClick={() => {
                handleCheckToggle(item, unitsChecked, setUnitsChecked, "bu");
              }}
            >
              <ListItemIcon>
                <Checkbox
                  color="secondary"
                  edge="start"
                  checked={unitsChecked.indexOf(item) !== -1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${item}`} />
            </ListItem>
          );
        })}
      </List>
    );
  }
);

const FiltersPrograms = ({
  units,
  months,
  reset,
  setReset,
  handleFilters,
  classes,
}) => {
  const dispatch = useDispatch();
  const [value, setValue] = useCallback(useState("brand"))
  const [monthsOpen, setMonthsOpen] = useCallback(useState(false));
  const [monthsChecked, setMonthsChecked] = useCallback(useState([]));
  const [unitsOpen, setUnitsOpen] = useCallback(useState(false));
  const [unitsChecked, setUnitsChecked] = useCallback(useState([]));

  const currentMonthFilter = useSelector((state) => state.filters.month);
  const currentBuFilter = useSelector((state) => state.filters.bu);

  const handleCheckToggle = useCallback(
    (value, array, func, type, deleting) => {
      const currentIndex = array.indexOf(value);
      const newChecked = [...array];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      func(newChecked);
      if (!deleting) {
        dispatch(updateSingleFilter({ filter: type, value: newChecked }));

        dispatch(setChips({ filterType: "program" }));
      }
    },
    [dispatch]
  );

  const handleListToggle = (open, func) => {
    func(!open);
  };

  useEffect(() => {
    if (currentBuFilter.length !== unitsChecked.length) {
      if (unitsChecked.length > currentBuFilter.length) {
        let missingFilter;
        unitsChecked.forEach((unit) => {
          if (currentBuFilter.filter((u) => u === unit).length === 0) {
            missingFilter = unit;
          }
        });
        handleCheckToggle(
          missingFilter,
          unitsChecked,
          setUnitsChecked,
          "bu",
          true
        );
      }
    }
  }, [currentBuFilter, unitsChecked, setUnitsChecked, handleCheckToggle]);

  useEffect(() => {
    if (currentMonthFilter.length !== monthsChecked.length) {
      if (monthsChecked.length > currentMonthFilter.length) {
        let missingFilter;
        monthsChecked.forEach((unit) => {
          if (currentMonthFilter.filter((u) => u === unit).length === 0) {
            missingFilter = unit;
          }
        });
        handleCheckToggle(
          missingFilter,
          monthsChecked,
          setMonthsChecked,
          "month",
          true
        );
      }
    }
  }, [currentMonthFilter, monthsChecked, setMonthsChecked, handleCheckToggle]);

  return (
    <>
      <List>
      <ListItem>
          <BrandAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"item"}
          />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            handleListToggle(monthsOpen, setMonthsOpen);
          }}
        >
          <ListItemText primary="Focus Month" />
          {monthsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse
          in={monthsOpen}
          timeout={{ appear: 400, enter: 400, exit: 0 }}
        >
          <MonthsList
            listItems={months}
            handleCheckToggle={handleCheckToggle}
            monthsChecked={monthsChecked}
            setMonthsChecked={setMonthsChecked}
          />
        </Collapse>
        <Divider />
        <ListItem
          button
          onClick={() => {
            handleListToggle(unitsOpen, setUnitsOpen);
          }}
        >
          <ListItemText primary="Business Unit" />
          {unitsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={unitsOpen} timeout={{ appear: 250, enter: 250, exit: 0 }}>
          <UnitsList
            listItems={units}
            handleCheckToggle={handleCheckToggle}
            unitsChecked={unitsChecked}
            setUnitsChecked={setUnitsChecked}
          />
        </Collapse>
      </List>
      <br />
      <br />
      <Typography className={classes.headerText}>
        Sort Pre-Order Programs By:
      </Typography>
      <br />
      <ButtonGroup
        orientation="vertical"
        fullWidth
        color="secondary"
        aria-label="program-sort"
      >
          <Button
            className={
              value === "brand" ? classes.largeButton : classes.selectedButton
            }
            variant={value === "brand" ? "contained" : "outlined"}
            onClick={() => {
              setValue("brand");
              handleFilters("brand", "sortProgramsBy", "program");
            }}
          >
            BRAND
          </Button>
          <Button
            className={
              value === "month" ? classes.largeButton : classes.selectedButton
            }
            variant={value === "month" ? "contained" : "outlined"}
            onClick={() => {
              setValue("month");
              handleFilters("month", "sortProgramsBy", "program");
            }}
          >
            FOCUS MONTH
          </Button>
          <Button
            className={
              value === "unit" ? classes.largeButton : classes.selectedButton
            }
            variant={value === "unit" ? "contained" : "outlined"}
            onClick={() => {
              setValue("unit");
              handleFilters("unit", "sortProgramsBy", "program");
            }}
          >
            BUSINESS UNIT
          </Button>
      </ButtonGroup>
    </>
  )
};

FiltersPrograms.propTypes = {
  months: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  handleFilters: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

export default FiltersPrograms;
