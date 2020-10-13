import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { setClear } from "../../redux/slices/filterSlice";

import BrandAutoComplete from "../Utility/BrandAutoComplete";
import ProgramAutoComplete from "../Utility/ProgramAutoComplete";
import StatusSelector from "../Utility/StatusSelector";
import RuleTypeAutoComplete from "../Utility/RuleTypeAutoComplete";
import ItemTypeAutoComplete from "../Utility/ItemTypeAutoComplete";

import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

const FiltersCompliance = ({
  reset,
  setReset,
  handleFilters,
  classes,
  sequenceNum,
  bindSequenceNum,
  handleSearch,
  complianceType,
}) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useCallback(useState("all"));

  return (
    <>
      <List>
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
              <StatusSelector
                handleStatus={handleFilters}
                status={status}
                setStatus={setStatus}
                classes={classes}
                filterType={"compliance"}
              />
            </ListItem>
            <ListItem>
              <ProgramAutoComplete
                classes={classes}
                handleChange={handleFilters}
                reset={reset}
                setReset={setReset}
                filterType={"compliance"}
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
              <ItemTypeAutoComplete
                classes={classes}
                handleChange={handleFilters}
                reset={reset}
                setReset={setReset}
                filterType={"compliance"}
              />
            </ListItem>
          </>
        )}
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
        <ListItem>
          <RuleTypeAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"compliance"}
          />
        </ListItem>
        <Divider />
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

FiltersCompliance.propTypes = {
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  handleFilters: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  sequenceNum: PropTypes.string.isRequired,
  bindSequenceNum: PropTypes.object.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default FiltersCompliance;
