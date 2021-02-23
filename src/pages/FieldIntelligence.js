import React, { useState, useCallback, useEffect } from "react";
// import { Link } from "@reach/router";

import Helmet from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
// import { useInitialFilters } from "../hooks/UtilityHooks";
// import { fetchInitialPrograms } from "../redux/slices/programsSlice";
//import { useProgramSort } from "../hooks/UtilityHooks";

import Container from "@material-ui/core/Container";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import FieldIntelDetailModal from "./FieldIntelDetailModal";
// import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import fakeData from "../fakeData";

// const defaultFilters = {
//   bu: [],
//   month: [],
//   brand: [],
//   sortProgramsBy: "brand",
// };

const useStyles = makeStyles((theme) => ({
    ...theme.global,
    itemGridContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: "20px",
      width: "100%",
    },
    programImg: {
      width: "85px",
      height: "85px",
      marginTop: "15px",
      borderRadius: "20%",
      objectFit: "cover",
      transition: "all .5s ease",
      "&:hover": {
        cursor: "pointer",
      },
    },
    singleItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      textAlign: "center",
      height: "275px",
      marginBottom: "40px",
      padding: "10px",
      backgroundColor: "whitesmoke",
    },
    itemControl: {
      width: "100%",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
    },
  }));

const MarketIntel = ({ userType, currentPrograms, filtersOpen }) => {
    const classes = useStyles();
    const [previewModal, handlePreviewModal] = useState(false);

    const handleModalClose = () => {
        handlePreviewModal(false);
      };
      const handleModalOpen = () => {
        handlePreviewModal(true);
      };
    return (
      <>
      <Helmet>
        <title> Field Intelligence</title>
      </Helmet>
      {previewModal && (
          <FieldIntelDetailModal
          handleClose={handleModalClose}
          previewModal={previewModal}
          />
      )}
        <Container style={{ textAlign: "center", maxWidth: "2000px" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography className={classes.titleText}>
              Current Programs
            </Typography>
          </div>
          <br />
          <br />
          <Grid container spacing={2} justify="center" alignItems="stretch">
            {currentPrograms.map((prog) => (
              <Grid
                item
                lg={filtersOpen ? 3 : 2}
                md={filtersOpen ? 4 : 3}
                sm={filtersOpen ? 6 : 4}
                xs={filtersOpen ? 12 : 6}
                key={prog.id}
              >
                <Paper className={classes.singleItem}>
                    <Tooltip title="Details" placement="top">
                      <img
                        id={prog.id}
                        className={classes.programImg}
                        src={prog.imgUrlThumb}
                        alt={prog.name}
                        onClick={() => handleModalOpen()}
                      />
                    </Tooltip>
                  <Typography className={classes.headerText}>
                    {`${prog.name} - ${prog.focusMonth}`}
                  </Typography>
                  <div>
                    <Typography variant="body2" color="textSecondary">
                      {``}
                    </Typography>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </>
    );
  };


const FieldIntelligence = ({ userType, handleFilterDrawer, filtersOpen }) => {
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
  const retainFilters = useSelector((state) => state.filters.retainFilters);

  const currentPrograms = fakeData; 
//   useProgramSort(
//     activePrograms,
//     sortOption,
//     programFilters
//   );

//   useEffect(() => {
//     if (activePrograms.length === 0 && userType && currentTerritory) {
//       dispatch(fetchInitialPrograms(currentTerritory));
//     }
//   }, [userType, dispatch, activePrograms, currentTerritory]);

//   useInitialFilters(
//     "program",
//     defaultFilters,
//     retainFilters,
//     dispatch,
//     handleFilterDrawer,
//     userType
//   );

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
          <Typography className={classes.titleText}>Field Intelligence</Typography>
        </div>
        <br />
        {isLoading ? (
          <CircularProgress color="inherit" />
        ) : (
          <MarketIntel
            userType={userType}
            currentPrograms={currentPrograms}
            filtersOpen={false}
          />
        )}
      </Container>
    </>
  );
};

export default FieldIntelligence;
