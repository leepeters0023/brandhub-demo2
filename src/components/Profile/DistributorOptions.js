import React from "react";

import FavoriteDistributors from "./FavoriteDistributors";
import DistributorAttnTable from "./DistributorAttnTable";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

//mockdata
import { distributorList } from "../../assets/mockdata/dataGenerator";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

/*
*TODO tie to api functionality, currently all logic is local, calls to api,
loading states, and errors need to be handled when calls are available
*/

const DistributorOptions = () => {
  const classes = useStyles();

  return (
    <>
      <Typography className={classes.titleText}>
        Edit Attention Lines
      </Typography>
      <br />
      <DistributorAttnTable distributors={distributorList} isLoading={false} />
      <br />
      <Divider />
      <br />
      <Typography className={classes.titleText}>
        FavoriteDistributors
      </Typography>
      <br />
      <FavoriteDistributors />
      <br />
    </>
  )  
}

export default DistributorOptions;