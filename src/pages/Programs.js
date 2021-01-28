import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, navigate } from "@reach/router";
import Helmet from "react-helmet";

import { useSelector, useDispatch } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

import CurrentPrograms from "../components/Purchasing/CurrentPrograms";

import FilterChipList from "../components/Filtering/FilterChipList";

import { useProgramSort } from "../hooks/UtilityHooks";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import TuneIcon from "@material-ui/icons/Tune";
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
  const sortOption = useSelector((state) => state.filters.sortProgramsBy);
  const buFilters = useSelector((state) => state.filters.bu);
  const monthFilters = useSelector((state) => state.filters.month);
  const brandFilter = useSelector((state) => state.filters.brand);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const currentUserRole = useSelector((state) => state.user.role);
  const error = useSelector((state) => state.programs.error);

  const currentPrograms = useProgramSort(
    activePrograms,
    sortOption,
    programFilters
  );

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

  useEffect(() => {
    if (error) {
      navigate("/whoops");
    }
  }, [error]);

  return (
    <>
      <Helmet><title>RTA | Programs</title></Helmet>
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
                  disabled={activePrograms.length === 0}
                >
                  PLACE ORDERS
                </Button>
              </div>
            </div>
          )}
        </div>
        <br />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            marginBottom: "10px",
          }}
        >
          <div
            className={classes.showHideFilters}
            onClick={() => {
              handleFilterDrawer(!filtersOpen);
            }}
          >
            <TuneIcon fontSize="small" color="secondary" />
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ margin: "10px 10px" }}
            >
              {filtersOpen ? "Hide Filters" : "Show Filters"}
            </Typography>
          </div>
          <FilterChipList classes={classes} />
          <br />
        </div>
        {isLoading && <CircularProgress color="inherit" />}
        {!isLoading && activePrograms.length > 0 && (
          <CurrentPrograms
            currentUserRole={currentUserRole}
            currentPrograms={currentPrograms}
            filtersOpen={filtersOpen}
          />
        )}
        {!isLoading && activePrograms.length === 0 && (
          <div style={{width: "100%", height: "80vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Typography className={classes.headerText}>
              There are currently no active Pre Order Programs ...
            </Typography>
          </div>
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
