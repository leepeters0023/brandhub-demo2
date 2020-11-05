import React, { useEffect} from "react";

import { useSelector, useDispatch } from "react-redux";

import { createNewFavoriteDistList } from "../../redux/slices/userSlice";

import FavoriteDistributorList from "./FavoriteDistributorList";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

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

  const currentDistributorLists = useSelector(state => state.user.favoriteDistributors);
  console.log(currentDistributorLists)
  useEffect(() => {
    if (currentDistributorLists.length === 0) {
      dispatch(createNewFavoriteDistList({id: (Math.floor(Math.random() * 100 + 1000)).toString()}))
    }
  }, [currentDistributorLists.length, dispatch])

  if (currentDistributorLists.length === 0) {
    return <CircularProgress />
  }

  return (
    <>
      {currentDistributorLists.map((distList, index) => (
        <FavoriteDistributorList key={distList.id} id={distList.id} index={index}/>
      ))}
      <Button
        className={classes.largeButton}
        variant="contained"
        color="secondary"
        onClick={()=>{
          dispatch(createNewFavoriteDistList({id: (Math.floor(Math.random() * 100 + 1000)).toString()}))
        }}
      >ADD NEW LIST</Button>
    </>
  )
}

export default FavoriteDistributors;