import React from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { setClear } from "../../redux/slices/filterSlice";

import BrandAutoComplete from "../Utility/BrandAutoComplete";
import ItemTypeAutoComplete from "../Utility/ItemTypeAutoComplete";
import ProgramAutoComplete from "../Utility/ProgramAutoComplete";
import BUAutoComplete from "../Utility/BUAutoComplete";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const FiltersItems = ({
  reset,
  setReset,
  handleFilters,
  classes,
  itemNumber,
  bindSequenceNum,
  itemDesc,
  bindItemDesc,
  handleSearch,
}) => {
  const dispatch = useDispatch();

  const favoriteItems = useSelector((state) => state.user.favoriteItems);
  const isLoading = useSelector((state) => state.globalLoad.isLoading);

  return (
    <>
      <List>
        <ListItem>
          <TextField
            color="secondary"
            fullWidth
            name="itemNumber"
            type="text"
            label="Sequence #"
            variant="outlined"
            size="small"
            value={itemNumber}
            {...bindSequenceNum}
            disabled={isLoading}
          />
        </ListItem>
        <ListItem>
          <TextField
            color="secondary"
            fullWidth
            name="itemNumber"
            type="text"
            label="Item Description"
            variant="outlined"
            size="small"
            value={itemDesc}
            {...bindItemDesc}
            disabled={isLoading}
          />
        </ListItem>
        <ListItem>
          <Button
            fullWidth
            className={classes.largeButton}
            variant="contained"
            color="secondary"
            onClick={handleSearch}
            disabled={isLoading}
          >
            SEARCH
          </Button>
        </ListItem>
        <ListItem />
        <Divider />
        <ListItem />
        <ListItem>
          <Button
            fullWidth
            className={classes.largeButton}
            variant="contained"
            color="secondary"
            disabled={favoriteItems.length === 0 || isLoading}
            onClick={() =>
              handleFilters([...favoriteItems], "favItems", "item-all")
            }
          >
            FILTER FAVORITES
          </Button>
        </ListItem>
        <ListItem>
          <BrandAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"item-all"}
          />
        </ListItem>
        <ListItem>
          <ProgramAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"item-all"}
          />
        </ListItem>
        <ListItem>
          <ItemTypeAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"item-all"}
          />
        </ListItem>
        <ListItem>
          <BUAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"item-all"}
          />
        </ListItem>
        <Divider />
        <ListItem />
        <ListItem>
          <Button
            fullWidth
            className={classes.largeButton}
            variant="contained"
            color="secondary"
            onClick={() => {
              dispatch(setClear());
            }}
            disabled={isLoading}
          >
            CLEAR FILTERS
          </Button>
        </ListItem>
      </List>
    </>
  );
};

FiltersItems.propTypes = {
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  handleFilters: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  itemNumber: PropTypes.string.isRequired,
  bindSequenceNum: PropTypes.object.isRequired,
};

export default FiltersItems;
