import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { updateSingleFilter, setChips } from "../../redux/slices/filterSlice";

import BrandAutoComplete from "../Utility/BrandAutoComplete";
import ItemTypeAutoComplete from "../Utility/ItemTypeAutoComplete";
import ProgramAutoComplete from "../Utility/ProgramAutoComplete";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

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

const FiltersItems = ({
  units,
  reset,
  setReset,
  handleFilters,
  classes,
  sequenceNum,
  bindSequenceNum,
}) => {
  const dispatch = useDispatch();
  const [unitsOpen, setUnitsOpen] = useCallback(useState(false));
  const [unitsChecked, setUnitsChecked] = useCallback(useState([]));

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

        dispatch(setChips({ filterType: "item" }));
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

  return (
    <>
      <List>
        <ListItem>
          <TextField
            color="secondary"
            fullWidth
            name="sequenceNum"
            type="text"
            label="Sequence #"
            variant="outlined"
            size="small"
            value={sequenceNum}
            {...bindSequenceNum}
          />
        </ListItem>
        <ListItem>
          <Button
            fullWidth
            className={classes.largeButton}
            variant="contained"
            color="secondary"
          >
            SEARCH
          </Button>
        </ListItem>
        <ListItem />
        <Divider />
        <ListItem />
        <ListItem>
          <BrandAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"item"}
          />
        </ListItem>
        <ListItem>
          <ProgramAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"item"}
          />
        </ListItem>
        <ListItem>
          <ItemTypeAutoComplete
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
    </>
  );
};

FiltersItems.propTypes = {
  units: PropTypes.array.isRequired,
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  handleFilters: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  sequenceNum: PropTypes.string.isRequired,
  bindSequenceNum: PropTypes.object.isRequired,
};

export default FiltersItems;
