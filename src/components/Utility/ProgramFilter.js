import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import FilterChipList from "./FilterChipList";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import Menu from "@material-ui/core/Menu";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";

import SearchIcon from "@material-ui/icons/Search";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import FilterListIcon from "@material-ui/icons/FilterList";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  filterControl: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: "350px",
    marginRight: "15px",
  },
  filterList: {
    display: "flex",
    overflowX: "auto",
    width: "Calc(100% - 390px)",
  },
}));

const ProgramFilter = (props) => {
  const classes = useStyles();

  const { brands, focusMonths, units, setProgramFilters } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [focusMonthsOpen, setFocusMonthsOpen] = useState(false);
  const [unitsOpen, setUnitsOpen] = useState(false);

  const [brandsChecked, setBrandsChecked] = useState([]);
  const [focusMonthsChecked, setFocusMonthsChecked] = useState([]);
  const [unitsChecked, setUnitsChecked] = useState([]);
  const [allFilters, setAllFilters] = useState([]);

  const handleCheckToggle = (value, array, func) => {
    const currentIndex = array.indexOf(value);
    const newChecked = [...array];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    func(newChecked);
  };

  const handleChipClick = (type, value) => {
    if (type === "brand") {
      handleCheckToggle(value, brandsChecked, setBrandsChecked);
    } else if (type === "focusMonth") {
      handleCheckToggle(value, focusMonthsChecked, setFocusMonthsChecked);
    } else if (type === "unit") {
      handleCheckToggle(value, unitsChecked, setUnitsChecked);
    }
  };

  const handleListToggle = (open, func) => {
    func(!open);
  };

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const currentFilters = [];
    brandsChecked.forEach((brand) =>
      currentFilters.push({ type: "brand", value: brand })
    );
    focusMonthsChecked.forEach((focusMonth) =>
      currentFilters.push({ type: "focusMonth", value: focusMonth })
    );
    unitsChecked.forEach((unit) =>
      currentFilters.push({ type: "unit", value: unit })
    );
    setAllFilters(currentFilters);
    setProgramFilters(currentFilters);
  }, [brandsChecked, focusMonthsChecked, unitsChecked, setProgramFilters]);

  const brandsList = (listItems) => {
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
                handleCheckToggle(item, brandsChecked, setBrandsChecked);
              }}
            >
              <ListItemIcon>
                <Checkbox
                  color="secondary"
                  edge="start"
                  checked={brandsChecked.indexOf(item) !== -1}
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
  };

  const focusMonthsList = (listItems) => {
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
                  focusMonthsChecked,
                  setFocusMonthsChecked
                );
              }}
            >
              <ListItemIcon>
                <Checkbox
                  color="secondary"
                  edge="start"
                  checked={focusMonthsChecked.indexOf(item) !== -1}
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
  };

  const unitsList = (listItems) => {
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
                handleCheckToggle(item, unitsChecked, setUnitsChecked);
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
  };

  return (
    <div className={classes.filterList}>
      <div className={classes.filterControl}>
        <Tooltip title="Filter Items">
          <IconButton
            aria-owns={anchorEl ? "filters" : undefined}
            aria-haspopup="true"
            onClick={handleOpen}
          >
            <FilterListIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Menu
          name="filters"
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <List
            style={{
              width: "300px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <ListItem
              button
              onClick={() => {
                handleListToggle(brandsOpen, setBrandsOpen);
              }}
            >
              <ListItemText primary="Brand" />
              {brandsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={brandsOpen} timeout="auto" unmountOnExit>
              {brandsList(brands)}
            </Collapse>
            <Divider />
            <ListItem
              button
              onClick={() => {
                handleListToggle(focusMonthsOpen, setFocusMonthsOpen);
              }}
            >
              <ListItemText primary="Focus Month" />
              {focusMonthsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={focusMonthsOpen} timeout="auto" unmountOnExit>
              {focusMonthsList(focusMonths)}
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
            <Collapse in={unitsOpen} timeout="auto" unmountOnExit>
              {unitsList(units)}
            </Collapse>
            <Divider />
          </List>
        </Menu>
        <TextField
          style={{ margin: 0 }}
          size="small"
          color="secondary"
          variant="outlined"
          margin="normal"
          id="search"
          label="Search"
          name="search"
        />
        <Button variant="contained" color="secondary" style={{ width: "50px", height: "40px" }}>
          <SearchIcon className={classes.navIcon} />
        </Button>
      </div>
      <FilterChipList filters={allFilters} handleChipClick={handleChipClick} />
    </div>
  );
};

ProgramFilter.propTypes = {
  brands: PropTypes.array.isRequired,
  focusMonths: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  setProgramFilters: PropTypes.func.isRequired,
};

export default ProgramFilter;
