import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "@reach/router";

import { fetchInitialPrograms } from "../redux/slices/programsSlice";

import CurrentPrograms from "../components/Purchasing/CurrentPrograms";
//import RegionSelector from "../components/Utility/RegionSelector";

import ProgramFilter from "../components/Utility/ProgramFilter";
import ProgramSort from "../components/Utility/ProgramSort";

import { useProgramSort } from "../hooks/UtilityHooks";

import Container from "@material-ui/core/Container";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
//import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

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

const Programs = ({ userType }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [programFilters, setProgramFilters] = useCallback(useState([]));
  const [sortOption, setSortOption] = useCallback(useState("brand"));
  const [currentBrands, setCurrentBrands] = useCallback(useState([]));
  const [currentMonths, setCurrentMonths] = useCallback(useState([]));

  let activePrograms = useSelector((state) => state.programs.programs);
  const isLoading = useSelector((state) => state.programs.isLoading);
  const currentTerritory = useSelector((state) => state.user.currentTerritory);

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
    if (currentBrands.length === 0 && currentPrograms.length !== 0) {
      let currentBrandArray = [];
      currentPrograms.forEach((prog) => {
        prog.brand.forEach((brand) => {
          if (!currentBrandArray.includes(brand)) {
            currentBrandArray.push(brand);
          }
        });
      });
      setCurrentBrands(currentBrandArray);
    }
  }, [
    currentBrands.length,
    currentBrands,
    currentPrograms.length,
    currentPrograms,
    setCurrentBrands,
  ]);

  useEffect(() => {
    if (currentMonths.length === 0 && currentPrograms.length !== 0) {
      let currentMonthArray = [];
      currentPrograms.forEach((prog) => {
        if (!currentMonthArray.includes(prog.focusMonth)) {
          currentMonthArray.push(prog.focusMonth);
        }
      });
      setCurrentMonths(currentMonthArray);
    }
  }, [
    currentMonths.length,
    currentMonths,
    currentPrograms.length,
    currentPrograms,
    setCurrentMonths,
  ]);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText} variant="h5">
            Pre-Orders
          </Typography>

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
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <ProgramFilter
            brands={currentBrands}
            focusMonths={focusMonths}
            units={units}
            setProgramFilters={setProgramFilters}
          />
          <ProgramSort setSortOption={setSortOption} />
        </div>
        <br />
        {isLoading ? (
          <CircularProgress color="inherit" />
        ) : (
          <CurrentPrograms currentPrograms={currentPrograms} />
        )}
      </Container>
    </>
  );
};

export default Programs;
