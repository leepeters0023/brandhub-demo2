import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import {
  newFavoriteDistList,
  fetchFavDistributors,
} from "../../redux/slices/distributorSlice";

import FavoriteDistributorList from "./FavoriteDistributorList";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const FavoriteDistributors = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [lists, setLists] = useState(null);
  const [currentList, setCurrentList] = useState(false);

  const currentDistributorLists = useSelector(
    (state) => state.distributors.favoriteDistributors
  );
  const isDistListLoading = useSelector(
    (state) => state.distributors.distListIsLoading
  );
  const currentTerritory = useSelector((state) => state.user.currentTerritory);

  const handleExpand = (id) => (evt, isExpanded) => {
    setCurrentList(isExpanded ? id : false);
  };

  useEffect(() => {
    if (
      (!lists && currentDistributorLists.length > 0) ||
      (lists && lists.length !== currentDistributorLists.length)
    ) {
      setLists(currentDistributorLists);
      setCurrentList(currentDistributorLists[currentDistributorLists.length - 1].id);
    }
  }, [lists, currentDistributorLists]);

  useEffect(() => {
    if (currentDistributorLists.length === 0) {
      dispatch(fetchFavDistributors(currentTerritory));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {currentDistributorLists.length > 0 &&
        currentDistributorLists.map((distList, index) => (
          <Accordion
            key={distList.id}
            expanded={currentList === distList.id}
            onChange={handleExpand(distList.id)}
            style={{
              marginBottom:
                index === currentDistributorLists.length - 1 ? "20px" : "0px",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={distList.name}
              id={`${distList.name}-${distList.id}`}
            >
              <Typography className={classes.headerText}>
                {distList.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails style={{ width: "100%" }}>
              <FavoriteDistributorList id={distList.id} />
            </AccordionDetails>
          </Accordion>
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
          dispatch(newFavoriteDistList(currentDistributorLists.length, currentTerritory));
        }}
      >
        ADD NEW LIST
      </Button>
    </>
  );
};

export default FavoriteDistributors;
