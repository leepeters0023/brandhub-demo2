import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "@reach/router";

import { fetchInitialPrograms } from "../redux/slices/programsSlice";

import {
  setFilterType,
  setDefaultFilters,
  updateMultipleFilters,
  setClear,
} from "../redux/slices/filterSlice";

import CurrentPrograms from "../components/Purchasing/CurrentPrograms";

import FilterChipList from "../components/Filtering/FilterChipList";

import { useProgramSort } from "../hooks/UtilityHooks";

import Container from "@material-ui/core/Container";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

const defaultFilters = {
  bu: [],
  month: [],
  brand: [],
  sortProgramsBy: "brand",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Programs = ({ userType, handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [programFilters, setProgramFilters] = useCallback(useState([]));

  let activePrograms = useSelector((state) => state.programs.programs);
  const isLoading = useSelector((state) => state.programs.isLoading);
  const currentTerritory = useSelector((state) => state.user.currentTerritory);
  const sortOption = useSelector((state) => state.filters.sortProgramsBy);
  const buFilters = useSelector((state) => state.filters.bu);
  const monthFilters = useSelector((state) => state.filters.month);
  const brandFilter = useSelector((state) => state.filters.brand);

  const currentPrograms = useProgramSort(
    activePrograms,
    sortOption,
    programFilters
  );

  useEffect(() => {
    if (activePrograms.length === 0 && userType && currentTerritory) {
      dispatch(fetchInitialPrograms(currentTerritory));
    }
  }, [userType, dispatch, activePrograms, currentTerritory]);

  useEffect(() => {
    dispatch(setFilterType({ type: "program" }));
    dispatch(
      setDefaultFilters({
        filterObject: defaultFilters,
      })
    );
    dispatch(
      updateMultipleFilters({
        filterObject: defaultFilters,
      })
    );
    handleFilterDrawer(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userType.length > 0) {
      dispatch(setClear());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!brandFilter && buFilters.length === 0 && monthFilters.length === 0) {
      setProgramFilters([]);
    } else {
      setProgramFilters(
        brandFilter
          ? [{ type: "brand", value: brandFilter.name }]
              .concat(buFilters.map((a) => ({ type: "unit", value: a })))
              .concat(
                monthFilters.map((b) => ({ type: "focusMonth", value: b }))
              )
          : buFilters
              .map((a) => ({ type: "unit", value: a }))
              .concat(
                monthFilters.map((a) => ({ type: "focusMonth", value: a }))
              )
      );
    }
  }, [brandFilter, buFilters, monthFilters, setProgramFilters]);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>Pre-Orders</Typography>

          <div className={classes.configButtons}>
            <div className={classes.innerConfigDiv}>
              <Tooltip title="Place Pre-Orders">
                <IconButton component={Link} to={`/orders/open/preorder`}>
                  <ExitToAppIcon fontSize="large" color="inherit" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add All Items to PDF">
                <span>
                  <IconButton>
                    <PictureAsPdfIcon fontSize="large" color="inherit" />
                  </IconButton>
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
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
            currentPrograms={currentPrograms}
            filtersOpen={filtersOpen}
          />
        )}
      </Container>
    </>
  );
};

export default Programs;
