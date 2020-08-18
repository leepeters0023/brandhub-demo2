import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";

import CurrentPrograms from "../components/Purchasing/CurrentPrograms";
import SelectorMenus from "../components/Utility/SelectorMenus";

import ProgramFilter from "../components/Utility/ProgramFilter";
import ProgramSort from "../components/Utility/ProgramSort";

import { useProgramSort } from "../hooks/UtilityHooks";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

//mockdata
import items from "../assets/mockdata/Items";

const brands = items.map((item) => item.brand);
const focusMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const units = ["Compass", "Popular", "Renaissance", "Spirits"];

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Programs = () => {
  const classes = useStyles();
  const [programFilters, setProgramFilters] = useCallback(useState([]));
  const [sortOption, setSortOption] = useCallback(useState("brand"));
  let activePrograms = useSelector((state) => state.programs.programs);
  const currentPrograms = useProgramSort(
    activePrograms,
    sortOption,
    programFilters
  );

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText} variant="h5">
            Programs
          </Typography>

          <div className={classes.configButtons}>
            <div className={classes.innerConfigDiv}>
              <SelectorMenus type="regions" />
            </div>
          </div>
        </div>
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <ProgramFilter
            brands={brands}
            focusMonths={focusMonths}
            units={units}
            setProgramFilters={setProgramFilters}
          />
          <ProgramSort setSortOption={setSortOption} />
        </div>
        <br />
        {currentPrograms.length === 0 ? (
          <CircularProgress />
        ) : (
          <CurrentPrograms currentPrograms={currentPrograms} />
        )}
      </Container>
    </>
  );
};

export default Programs;
