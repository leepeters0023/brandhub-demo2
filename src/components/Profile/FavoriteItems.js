import React from "react";
import { Link } from "@reach/router";

import { useSelector, useDispatch } from "react-redux";

import { addToFavoriteItems } from "../../redux/slices/userSlice";

import ItemTable from "./ItemTable";

import Typography from "@material-ui/core/Typography";

const FavoriteItems = ({ classes }) => {
  const dispatch = useDispatch();
  const userItems = useSelector((state) => state.user.favoriteItems);
  const isLoading = useSelector((state) => state.user.isUpdateLoading);

  const handleDelete = (id) => {
    const newIdArray = userItems
      .map((item) => item.id)
      .filter((itemId) => itemId !== id);
    dispatch(addToFavoriteItems(newIdArray));
  };

  return (
    <>
      <div
        style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
      >
        <Typography
          className={classes.bodyText}
          component={Link}
          to="/items/all"
        >
          Add Items
        </Typography>
      </div>
      <br />
      <ItemTable
        items={userItems}
        isLoading={isLoading}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default FavoriteItems;
