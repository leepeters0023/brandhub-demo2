import React, { useState } from "react";

import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";

import SearchIcon from "@material-ui/icons/Search";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  navBreak: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "0",
  },
}));

const ItemFilter = (props) => {
  const classes = useStyles();

  const { brands, itemTypes } = props;
  const units = ["Unit 1", "Unit 2", "Unit 3"];

  const [brandsOpen, setBrandsOpen] = useState(false);
  const [itemTypesOpen, setItemTypesOpen] = useState(false);
  const [unitsOpen, setUnitsOpen] = useState(false);
  const [favItemChecked, setFavItemChecked] = useState(false);

  const [brandsChecked, setBrandsChecked] = useState([]);
  const [itemTypesChecked, setItemTypesChecked] = useState([]);
  const [unitsChecked, setUnitsChecked] = useState([]);

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

  const handleListToggle = (open, func) => {
    func(!open);
  };

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

  const itemTypesList = (listItems) => {
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
                handleCheckToggle(item, itemTypesChecked, setItemTypesChecked);
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
    <>
      <Typography className={classes.headerText}>Filter Items</Typography>
      <TextField
        fullWidth
        size="small"
        color="secondary"
        variant="outlined"
        margin="normal"
        id="search"
        label="Search"
        name="search"
      />
      <br />
      <Button
        variant="contained"
        color="secondary"
        style={{width: "100%"}}
      >
        <SearchIcon color="primary" />
      </Button>
      <List>
        <br />
        <ListItem>
          <FormControlLabel
            control={
              <Checkbox
                checked={favItemChecked}
                onChange={() => setFavItemChecked(!favItemChecked)}
                name="viewFavorites"
                color="secondary"
              />
            }
            label=" Favorites"
          />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            handleListToggle(brandsOpen, setBrandsOpen);
          }}
        >
          <ListItemText primary="Brands" />
          {brandsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={brandsOpen} timeout="auto" unmountOnExit>
          {brandsList(brands)}
        </Collapse>
        <Divider />
        <ListItem
          button
          onClick={() => {
            handleListToggle(itemTypesOpen, setItemTypesOpen);
          }}
        >
          <ListItemText primary="Item Types" />
          {itemTypesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={itemTypesOpen} timeout="auto" unmountOnExit>
          {itemTypesList(itemTypes)}
        </Collapse>
        <Divider />
        <ListItem
          button
          onClick={() => {
            handleListToggle(unitsOpen, setUnitsOpen);
          }}
        >
          <ListItemText primary="Units" />
          {unitsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={unitsOpen} timeout="auto" unmountOnExit>
          {unitsList(units)}
        </Collapse>
      </List>
    </>
  );
};

export default ItemFilter;
