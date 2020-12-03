import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import {
  newFavoriteDistList,
  fetchFavDistributors,
} from "../../redux/slices/distributorSlice";

import FavoriteDistributorList from "./FavoriteDistributorList";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

/*
*TODO tie to api functionality, currently all logic is local, calls to api,
loading states, and errors need to be handled when calls are available
*/

const FavoriteDistributors = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const currentDistributorLists = useSelector(
    (state) => state.distributors.favoriteDistributors
  );
  const isDistListLoading = useSelector(
    (state) => state.distributors.distListIsLoading
  );

  useEffect(() => {
    if (currentDistributorLists.length === 0) {
      dispatch(fetchFavDistributors());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {currentDistributorLists.length > 0 &&
        currentDistributorLists.map((distList, index) => (
          <FavoriteDistributorList
            key={distList.id}
            id={distList.id}
            index={index}
          />
        ))}
      {isDistListLoading && <CircularProgress />}
      {!isDistListLoading && currentDistributorLists.length === 0 && (
        <Typography
          className={classes.headerText}
          style={{ marginBottom: "20px" }}
        >
          You currently do not have any Favorite Distributor Lists....
        </Typography>
      )}
      <Button
        className={classes.largeButton}
        variant="contained"
        color="secondary"
        onClick={() => {
          dispatch(newFavoriteDistList(currentDistributorLists.length));
        }}
      >
        ADD NEW LIST
      </Button>
    </>
  );
};

export default FavoriteDistributors;
