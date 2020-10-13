import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { setClear } from "../../redux/slices/filterSlice";

import BrandAutoComplete from "../Utility/BrandAutoComplete";
import ProgramAutoComplete from "../Utility/ProgramAutoComplete";
import ItemTypeAutoComplete from "../Utility/ItemTypeAutoComplete";

import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

const FiltersItemRollup = ({
  reset,
  setReset,
  handleFilters,
  classes,
  sequenceNum,
  bindSequenceNum,
  handleSearch,
  itemTypes,
}) => {
  const dispatch = useDispatch();
  const [value, setValue] = useCallback(useState("on-demand"));

  return (
    <>
      <List>
        <ListItem
          style={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Typography className={classes.headerText}>Order Type:</Typography>
          <br />
          <ButtonGroup
            orientation="vertical"
            fullWidth
            color="secondary"
            aria-label="order-item-type"
          >
            <Button
              className={
                value === "on-demand"
                  ? classes.largeButton
                  : classes.selectedButton
              }
              variant={value === "on-demand" ? "contained" : "outlined"}
              onClick={() => {
                setValue("on-demand");
                handleFilters("on-demand", "orderType", "itemRollup");
              }}
            >
              ON-DEMAND
            </Button>
            <Button
              className={
                value === "pre-order"
                  ? classes.largeButton
                  : classes.selectedButton
              }
              variant={value === "pre-order" ? "contained" : "outlined"}
              onClick={() => {
                setValue("pre-order");
                handleFilters("pre-order", "orderType", "itemRollup");
              }}
            >
              PRE-ORDER
            </Button>
          </ButtonGroup>
        </ListItem>
        <ListItem />
        <Divider />
        <ListItem />
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
        <ListItem />
        <Divider />
        <ListItem />
        <ListItem>
          <BrandAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"itemRollup"}
          />
        </ListItem>
        <ListItem>
          <ProgramAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"itemRollup"}
          />
        </ListItem>
        <ListItem>
          <ItemTypeAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"itemRollup"}
          />
        </ListItem>
        <ListItem />
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

FiltersItemRollup.propTypes = {
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  handleFilters: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  sequenceNum: PropTypes.string.isRequired,
  bindSequenceNum: PropTypes.object.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default FiltersItemRollup;
