import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import { useSelector, useDispatch } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

import { fetchInitialPrograms } from "../redux/slices/programsSlice";

import CurrentPrograms from "../components/Purchasing/CurrentPrograms";

import FilterChipList from "../components/Filtering/FilterChipList";

import { useProgramSort } from "../hooks/UtilityHooks";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const defaultFilters = {
  bu: [],
  month: [],
  brand: [],
  sortProgramsBy: "brand",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Programs = ({ handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [programFilters, setProgramFilters] = useCallback(useState([]));

  const activePrograms = useSelector((state) => state.programs.programs);
  const isLoading = useSelector((state) => state.programs.isLoading);
  const currentTerritory = useSelector((state) => state.user.currentTerritory);
  const sortOption = useSelector((state) => state.filters.sortProgramsBy);
  const buFilters = useSelector((state) => state.filters.bu);
  const monthFilters = useSelector((state) => state.filters.month);
  const brandFilter = useSelector((state) => state.filters.brand);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const isPrograms = useSelector((state) => state.programs.isPrograms);
  const currentUserRole = useSelector((state) => state.user.role);

  const currentPrograms = useProgramSort(
    activePrograms,
    sortOption,
    programFilters
  );

  useEffect(() => {
    if (
      activePrograms.length === 0 &&
      !isPrograms &&
      currentUserRole &&
      currentTerritory
    ) {
      dispatch(fetchInitialPrograms(currentTerritory));
    }
  }, [currentUserRole, dispatch, activePrograms, currentTerritory, isPrograms]);

  useInitialFilters(
    "program",
    defaultFilters,
    retainFilters,
    dispatch,
    handleFilterDrawer,
    currentUserRole
  );

  useEffect(() => {
    if (
      brandFilter.length === 0 &&
      buFilters.length === 0 &&
      monthFilters.length === 0
    ) {
      setProgramFilters([]);
    } else {
      setProgramFilters(
        brandFilter
          .map((a) => ({ type: "brand", value: a.name }))

          .concat(buFilters.map((b) => ({ type: "unit", value: b })))
          .concat(monthFilters.map((c) => ({ type: "focusMonth", value: c })))
      );
    }
  }, [brandFilter, buFilters, monthFilters, setProgramFilters]);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>Pre-Orders</Typography>

          {currentUserRole !== "compliance" && currentUserRole !== "read-only" && (
            <div className={classes.configButtons}>
              <div className={classes.innerConfigDiv}>
                <Button
                  className={classes.largeButton}
                  variant="contained"
                  color="secondary"
                  startIcon={<ExitToAppIcon />}
                  component={Link}
                  to="/orders/open/preorder"
                >
                  PLACE ORDERS
                </Button>
              </div>
            </div>
          )}
        </div>
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
        <br />
        {isLoading ? (
          <CircularProgress color="inherit" />
        ) : (
          <CurrentPrograms
            currentUserRole={currentUserRole}
            currentPrograms={currentPrograms}
            filtersOpen={filtersOpen}
          />
        )}
      </Container>
    </>
  );
};

Programs.propTypes = {
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default Programs;
