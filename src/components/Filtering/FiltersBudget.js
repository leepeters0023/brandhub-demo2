import React from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { setClear } from "../../redux/slices/filterSlice";

import BrandAutoComplete from "../Utility/BrandAutoComplete";
import TerritoryAutoComplete from "../Utility/TerritoryAutoComplete";
import UserAutoComplete from "../Utility/UserAutoComplete";
import StateAutoComplete from "../Utility/StateAutoComplete";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

const FiltersBudget = ({
  reset,
  setReset,
  handleFilters,
  classes,
  budgetType,
}) => {
  const dispatch = useDispatch();

  const currentUserRole = useSelector((state) => state.user.role);

  return (
    <>
      <List>
        {currentUserRole !== "field1" && budgetType !== "ytod" && (
          <ListItem>
            <UserAutoComplete
              classes={classes}
              handleChange={handleFilters}
              reset={reset}
              setReset={setReset}
              filterType={"budget"}
            />
          </ListItem>
        )}
        <ListItem>
          <StateAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"budget"}
          />
        </ListItem>
        <ListItem>
          <TerritoryAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"budget"}
          />
        </ListItem>
        <ListItem>
          <BrandAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"budget"}
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

FiltersBudget.propTypes = {
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  handleFilters: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  budgetType: PropTypes.string.isRequired,
};

export default FiltersBudget;
