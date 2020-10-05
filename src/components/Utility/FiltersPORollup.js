import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { setClear } from "../../redux/slices/filterSlice";

import BrandAutoComplete from "../Utility/BrandAutoComplete";

import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";

const FiltersPORollup = ({
  reset,
  setReset,
  handleFilters,
  classes,
  sequenceNum,
  bindSequenceNum,
  program,
  bindProgram,
  handleSearch,
}) => {
  const dispatch = useDispatch();
  const [value, setValue] = useCallback(useState("on-demand"));

  return (
    <>
      <br />
      <Typography className={classes.headerText}>Order Item Type:</Typography>
      <br />
      <ButtonGroup
        orientation="vertical"
        fullWidth
        color="secondary"
        aria-label="order-item-type"
      >
        <Button
          className={
            value === "on-demand" ? classes.largeButton : classes.selectedButton
          }
          variant={value === "on-demand" ? "contained" : "outlined"}
          onClick={() => {
            setValue("on-demand");
            handleFilters("on-demand", "sortProgramsBy", "program");
          }}
        >
          ON-DEMAND
        </Button>
        <Button
          className={
            value === "pre-order" ? classes.largeButton : classes.selectedButton
          }
          variant={value === "pre-order" ? "contained" : "outlined"}
          onClick={() => {
            setValue("pre-order");
            handleFilters("pre-order", "sortProgramsBy", "program");
          }}
        >
          PRE-ORDER
        </Button>
      </ButtonGroup>
      <br />
      <br />
      <List>
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

FiltersPORollup.propTypes = {
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

export default FiltersPORollup;
