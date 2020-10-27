import React from "react";
import { Link } from "@reach/router";

import { useSelector } from "react-redux";

import ItemTable from "./ItemTable";

import Typography from "@material-ui/core/Typography";

const FavoriteItems = ({ classes }) => {
  const userItems = useSelector(state => state.user.favoriteItems);

  //TODO handle loading state

  return (
    <>
      <div style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
        <Typography className={classes.bodyText} component={Link} to="/items/all">
          Add Items
        </Typography>
      </div>
      <br />
      <ItemTable items={userItems} isLoading={false} />
    </>
  )
}

export default FavoriteItems;