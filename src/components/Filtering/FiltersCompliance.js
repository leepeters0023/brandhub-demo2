import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { setClear, updateSingleFilter } from "../../redux/slices/filterSlice";

import BrandAutoComplete from "../Utility/BrandAutoComplete";
import StatusSelector from "../Utility/StatusSelector";

import { useSelector } from "react-redux";

import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const ItemTypesList = React.memo(
  ({ listItems, handleCheckToggle, itemTypesChecked, setItemTypesChecked }) => {
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
                handleCheckToggle(
                  item,
                  itemTypesChecked,
                  setItemTypesChecked,
                  "itemType"
                );
              }}
            >
              <ListItemIcon>
                <Checkbox
                  color="secondary"
                  edge="start"
                  checked={itemTypesChecked.indexOf(item) !== -1}
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
const RuleTypesList = React.memo(
  ({ listItems, handleCheckToggle, ruleTypesChecked, setRuleTypesChecked }) => {
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
                handleCheckToggle(
                  item,
                  ruleTypesChecked,
                  setRuleTypesChecked,
                  "ruleType"
                );
              }}
            >
              <ListItemIcon>
                <Checkbox
                  color="secondary"
                  edge="start"
                  checked={ruleTypesChecked.indexOf(item) !== -1}
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

const FiltersCompliance = ({
  reset,
  setReset,
  handleFilters,
  classes,
  sequenceNum,
  bindSequenceNum,
  program,
  bindProgram,
  handleSearch,
  itemTypes,
  ruleTypes,
  complianceType,
}) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useCallback(useState("all"));
  const [itemTypesOpen, setItemTypesOpen] = useCallback(useState(false));
  const [itemTypesChecked, setItemTypesChecked] = useCallback(useState([]));
  const [ruleTypesOpen, setRuleTypesOpen] = useCallback(useState(false));
  const [ruleTypesChecked, setRuleTypesChecked] = useCallback(useState([]));

  const currentItemTypeFilter = useSelector((state) => state.filters.itemType);
  const currentRuleTypeFilter = useSelector((state) => state.filters.ruleType);

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
      }
    },
    [dispatch]
  );

  const handleListToggle = (open, func) => {
    func(!open);
  };

  useEffect(() => {
    if (currentItemTypeFilter.length !== itemTypesChecked.length) {
      if (itemTypesChecked.length > currentItemTypeFilter.length) {
        let missingFilter;
        itemTypesChecked.forEach((unit) => {
          if (currentItemTypeFilter.filter((u) => u === unit).length === 0) {
            missingFilter = unit;
          }
        });
        handleCheckToggle(
          missingFilter,
          itemTypesChecked,
          setItemTypesChecked,
          "itemType",
          true
        );
      }
    }
  }, [
    currentItemTypeFilter,
    itemTypesChecked,
    setItemTypesChecked,
    handleCheckToggle,
  ]);

  useEffect(() => {
    if (currentRuleTypeFilter.length !== ruleTypesChecked.length) {
      if (ruleTypesChecked.length > currentRuleTypeFilter.length) {
        let missingFilter;
        ruleTypesChecked.forEach((unit) => {
          if (currentRuleTypeFilter.filter((u) => u === unit).length === 0) {
            missingFilter = unit;
          }
        });
        handleCheckToggle(
          missingFilter,
          ruleTypesChecked,
          setRuleTypesChecked,
          "ruleType",
          true
        );
      }
    }
  }, [
    currentRuleTypeFilter,
    ruleTypesChecked,
    setRuleTypesChecked,
    handleCheckToggle,
  ]);

  return (
    <>
      <List>
        <ListItem>
          <TextField
            className={classes.queryField}
            color="secondary"
            fullWidth
            name="tag"
            type="text"
            label="Tag"
            variant="outlined"
            size="small"
            //TODO this will be autocomplete!
          />
        </ListItem>
        {complianceType === "items" && (
          <>
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
              <BrandAutoComplete
                classes={classes}
                handleChange={handleFilters}
                reset={reset}
                setReset={setReset}
                filterType={"compliance"}
              />
            </ListItem>
            <ListItem>
              <StatusSelector
                handleStatus={handleFilters}
                status={status}
                setStatus={setStatus}
                classes={classes}
                filterType={"compliance"}
              />
            </ListItem>
            <ListItem />
            <ListItem
              button
              onClick={() => {
                handleListToggle(itemTypesOpen, setItemTypesOpen);
              }}
            >
              <ListItemText primary="Item Type" />
              {itemTypesOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={itemTypesOpen}
              timeout={{ appear: 400, enter: 400, exit: 0 }}
            >
              <ItemTypesList
                listItems={itemTypes}
                handleCheckToggle={handleCheckToggle}
                itemTypesChecked={itemTypesChecked}
                setItemTypesChecked={setItemTypesChecked}
              />
            </Collapse>
            <Divider />
          </>
        )}
        <ListItem
          button
          onClick={() => {
            handleListToggle(ruleTypesOpen, setRuleTypesOpen);
          }}
        >
          <ListItemText primary="Rule Type" />
          {ruleTypesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse
          in={ruleTypesOpen}
          timeout={{ appear: 400, enter: 400, exit: 0 }}
        >
          <RuleTypesList
            listItems={ruleTypes}
            handleCheckToggle={handleCheckToggle}
            ruleTypesChecked={ruleTypesChecked}
            setRuleTypesChecked={setRuleTypesChecked}
          />
        </Collapse>
        <Divider />
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

FiltersCompliance.propTypes = {
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  handleFilters: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  sequenceNum: PropTypes.string.isRequired,
  bindSequenceNum: PropTypes.object.isRequired,
  program: PropTypes.string.isRequired,
  bindProgram: PropTypes.object.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default FiltersCompliance;
