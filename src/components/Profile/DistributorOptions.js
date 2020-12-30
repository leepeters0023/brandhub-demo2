import React, { useEffect } from "react";

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

/*
 *TODO tie to api functionality for editing attn
 */

const DistributorOptions = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { value: distName, bind: bindDistName } = useInput("");

  const currentDistributors = useSelector(
    (state) => state.distributors.editAttnList
  );
  const isLoading = useSelector((state) => state.distributors.attnIsLoading);

  useEffect(() => {
    if (distName.length >= 1) {
      dispatch(fetchUserDistributors(distName, true));
    }
  }, [distName, dispatch]);

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
