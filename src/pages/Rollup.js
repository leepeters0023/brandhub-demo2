import React, { useEffect, useState, useCallback } from "react";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

import { useSelector, useDispatch } from "react-redux";

import {
  fetchFilteredPreOrders,
  fetchNextFilteredPreOrders,
} from "../redux/slices/rollupSlice";

import { useInput } from "../hooks/UtilityHooks";

import RollupOverviewTable from "../components/Reports/RollupOverviewTable";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import PrintIcon from "@material-ui/icons/Print";
import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  queryRow: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginLeft: "0%",
      display: "flex",
    },
    [theme.breakpoints.up("md")]: {
      width: "85%",
      marginLeft: "15%",
      display: "flex",
    },
    [theme.breakpoints.up("lg")]: {
      width: "65%",
      marginLeft: "35%",
      display: "flex",
    },
  },
  gridItemContainer: {
    display: "flex",
    alignItems: "center",
  },
}));

const Rollup = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [currentFilters, setCurrentFilters] = useState({
    user: "",
    program: "",
    sequenceNum: "",
    sortOrder: "asc",
    sortOrderBy: "user"
  })

  const handleUser = useCallback((value) => {
    setCurrentFilters({
      ...currentFilters,
      user: value
    })
  }, [currentFilters])

  const handleProgram = useCallback((value) => {
    setCurrentFilters({
      ...currentFilters,
      program: value
    })
  }, [currentFilters])
  
  const handleSequence = useCallback((value) => {
    setCurrentFilters({
      ...currentFilters,
      sequenceNum: value
    })
  }, [currentFilters])

  const { value: user, bind: bindUser } = useInput("", handleUser);
  const { value: program, bind: bindProgram } = useInput("", handleProgram);
  const { value: sequenceNum, bind: bindSequenceNum } = useInput("", handleSequence);

  const currentPreOrders = useSelector((state) => state.rollup.preOrders);
  const isPreOrdersLoading = useSelector((state) => state.rollup.isLoading);
  const nextLink = useSelector((state) => state.rollup.nextLink)
  const isNextPreOrdersLoading = useSelector(
    (state) => state.rollup.isNextLoading
  );
  const currentUserRoll = useSelector((state) => state.user.role);
  
  const handleBottomScroll = () => {
    if (nextLink && !isNextPreOrdersLoading) {
      dispatch(fetchNextFilteredPreOrders(nextLink));
    }
  };
  
  const scrollRef = useBottomScrollListener(handleBottomScroll);

  const handleSearch = (sortBy = undefined) => {
    let filterObject;
    if (sortBy.order) {
      console.log(sortBy);
      filterObject = {
        ...currentFilters,
        sortOrder: sortBy.order,
        sortOrderBy: sortBy.orderBy,
      };
    } else {
      console.log(currentFilters);
      filterObject = { ...currentFilters };
    }
    console.log("searching");
    dispatch(fetchFilteredPreOrders(filterObject));
  };

  const handleSort = (sortObject) => {
    setCurrentFilters({
      ...currentFilters,
      sortOrder: sortObject.order,
      sortOrderBy: sortObject.orderBy,
    });
    handleSearch(sortObject);
  };

  useEffect(() => {
    if (currentPreOrders.length === 0 && currentUserRoll.length > 0) {
      dispatch(fetchFilteredPreOrders());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleBar}>
          <Typography className={classes.titleText}>
            Quarterly Rollup
          </Typography>
          <div
            style={{
              display: "flex",
              width: "150px",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip title="Print Order History">
              <IconButton>
                <PrintIcon color="secondary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export CSV">
              {/* <CSVLink data={currentOrders} headers={csvHeaders}> */}
              <IconButton>
                <GetAppIcon color="secondary" />
              </IconButton>
              {/* </CSVLink> */}
            </Tooltip>
          </div>
        </div>
        <br />
        <div className={classes.queryRow}>
          <Grid container spacing={2}>
            <Grid item md={3} sm={3} className={classes.gridItemContainer}>
              <TextField
                color="secondary"
                fullWidth
                name="user"
                type="text"
                label="User"
                variant="outlined"
                size="small"
                value={user}
                {...bindUser}
              />
            </Grid>
            <Grid item md={3} sm={3} className={classes.gridItemContainer}>
              <TextField
                color="secondary"
                fullWidth
                name="program"
                type="text"
                label="Program"
                variant="outlined"
                size="small"
                value={program}
                {...bindProgram}
              />
            </Grid>
            <Grid item md={3} sm={3} className={classes.gridItemContainer}>
              <TextField
                color="secondary"
                fullWidth
                name="sequenceNum"
                type="text"
                label="Sequence #"
                variant="outlined"
                size="small"
                value={sequenceNum}
                {...bindSequenceNum}
              />
            </Grid>
            <Grid item md={3} sm={3} className={classes.gridItemContainer}>
              <Button
                fullWidth
                className={classes.largeButton}
                variant="contained"
                color="secondary"
                onClick={handleSearch}
              >
                SEARCH
              </Button>
            </Grid>
          </Grid>
        </div>
        <br />
        <br />
        <RollupOverviewTable
          rollupData={currentPreOrders}
          handleSort={handleSort}
          isRollupLoading={isPreOrdersLoading}
          scrollRef={scrollRef}
        />
        {isNextPreOrdersLoading && (
          <div style={{ width: "100%" }}>
            <LinearProgress />
          </div>
        )}
      </Container>
    </>
  );
};

export default Rollup;
