import React from "react";

import { useSelector } from "react-redux";

import ItemTable from "./ItemTable";

const FavoriteItems = () => {
  const userItems = useSelector(state => state.user.favoriteItems);

  //TODO handle loading state

  return (
    <>
      <ItemTable items={userItems} isLoading={false} />
    </>
  )
}

export default FavoriteItems;