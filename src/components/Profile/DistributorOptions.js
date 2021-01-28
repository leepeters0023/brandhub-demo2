import React, { useEffect, useCallback, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useInput } from "../../hooks/InputHooks";

import { fetchUserDistributors } from "../../redux/slices/distributorSlice";

import FavoriteDistributors from "./FavoriteDistributors";
import DistributorAttnTable from "./DistributorAttnTable";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const DistributorOptions = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { value: distName, bind: bindDistName } = useInput("");

  const currentDistributors = useSelector(
    (state) => state.distributors.editAttnList
  );
  const territoryId = useSelector((state) => state.user.currentTerritory);
  const userStates = useSelector((state) => state.user.states);
  const isLoading = useSelector((state) => state.distributors.attnIsLoading);
  const currentUserRole = useSelector((state) => state.user.role);

  const debounce = useRef(null);

  const handleQuery = useCallback(() => {
    clearTimeout(debounce.current);

    debounce.current = setTimeout(() => {
      currentUserRole !== "super" &&
      currentUserRole !== "purchaser" &&
      currentUserRole !== "select-purchaser"
        ? dispatch(
            fetchUserDistributors(
              distName,
              territoryId,
              userStates.map((state) => state.id).join(","),
              true
            )
          )
        : dispatch(fetchUserDistributors(distName, false, false, true));
    }, 250);
  }, [distName, territoryId, userStates, currentUserRole, dispatch]);

  useEffect(() => {
    if (distName.length >= 1) {
      handleQuery();
    }
  }, [distName, handleQuery, dispatch]);

  return (
    <>
      <div className={classes.titleBar}>
        <Typography className={classes.titleText}>
          Edit Attention Lines
        </Typography>
        <TextField
          size="small"
          label="Distributor Name / ABN"
          variant="outlined"
          value={distName}
          {...bindDistName}
        />
      </div>
      <br />
      <DistributorAttnTable
        distributors={currentDistributors}
        isLoading={isLoading}
      />
      <br />
      <Divider />
      <br />
      <Typography className={classes.titleText}>
        Favorite Distributors
      </Typography>
      <br />
      <FavoriteDistributors />
      <br />
    </>
  );
};

export default DistributorOptions;
