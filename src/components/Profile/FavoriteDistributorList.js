import React, { useState, useEffect, useCallback, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useInput } from "../../hooks/InputHooks";

import {
  fetchUserDistributors,
  deleteFavoriteDistributorList,
  updateFavoriteDistributorList,
} from "../../redux/slices/distributorSlice";

import DistributorTable from "./DistributorTable";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import DeleteIcon from "@material-ui/icons/Delete";

const MemoNameInput = React.memo(
  ({ dispatch, id, territoryId }) => {
    const currentValue = useSelector(
      (state) =>
        state.distributors.favoriteDistributors.find(
          (distList) => distList.id === id
        ).name
    );
    const userDistributors = useSelector(
      (state) =>
        state.distributors.favoriteDistributors.find(
          (distList) => distList.id === id
        ).distributors
    );
    const { value: name, bind: bindName } = useInput(currentValue);
    return (
      <TextField
        style={{ width: "45%" }}
        size="small"
        variant="outlined"
        color="secondary"
        name="listName"
        type="text"
        label="List Name"
        value={name}
        {...bindName}
        onBlur={() =>
          dispatch(
            updateFavoriteDistributorList(
              id,
              name,
              userDistributors,
              territoryId
            )
          )
        }
      />
    );
  },
  (prev, next) => prev.id === next.id
);

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const FavoriteDistributorList = ({ id }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [distributor, setDistributor] = useState("");
  const [currentDistributors, setCurrentDistributors] = useState([]);

  const isLoading = useSelector((state) => state.distributors.isLoading);
  const territoryId = useSelector((state) => state.user.currentTerritory);
  const userStates = useSelector((state) => state.user.states);
  const options = useSelector((state) => state.distributors.distributorList);
  const userDistributors = useSelector(
    (state) =>
      state.distributors.favoriteDistributors.find(
        (distList) => distList.id === id
      ).distributors
  );
  const name = useSelector(
    (state) =>
      state.distributors.favoriteDistributors.find(
        (distList) => distList.id === id
      ).name
  );

  const loading = open && isLoading;

  const debounce = useRef(null);

  const handleDistributors = (value) => {
    setCurrentDistributors(value);
    dispatch(updateFavoriteDistributorList(id, name, value, territoryId));
  };

  const handleDeleteList = () => {
    dispatch(deleteFavoriteDistributorList(id));
  };

  const handleQuery = useCallback(() => {
    clearTimeout(debounce.current);

    debounce.current = setTimeout(() => {
      dispatch(
        fetchUserDistributors(
          distributor,
          territoryId,
          userStates.map((state) => state.id).join(",")
        )
      );
    }, 250);
  }, [distributor, territoryId, userStates, dispatch]);

  useEffect(() => {
    if (distributor.length >= 1) {
      handleQuery();
    }
  }, [distributor, handleQuery, dispatch]);

  useEffect(() => {
    if (userDistributors.length !== currentDistributors.length) {
      setCurrentDistributors(userDistributors);
    }
  }, [currentDistributors, userDistributors]);

  return (
    <div
      style={{
        padding: "10px",
        width: "97%",
        boxSizing: "border-box",
        // marginBottom: "20px",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <MemoNameInput dispatch={dispatch} id={id} territoryId={territoryId} />
        <Autocomplete
          style={{ width: "45%" }}
          multiple
          freeSolo
          renderTags={() => null}
          className={classes.queryField}
          id={`distributor-auto-complete-${id}`}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          inputValue={distributor}
          onInputChange={(_evt, value) => setDistributor(value)}
          onChange={(_evt, value) => {
            handleDistributors(value);
          }}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => option.name}
          options={options}
          loading={loading}
          value={currentDistributors}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add Distributor (Name / ABN)"
              variant="outlined"
              size="small"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={15} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        <Tooltip title="Delete List">
          <IconButton onClick={handleDeleteList}>
            <DeleteIcon color="inherit" />
          </IconButton>
        </Tooltip>
      </div>
      <br />
      <DistributorTable
        distributors={userDistributors}
        name={name}
        isLoading={false}
        id={id}
      />
      <br />
    </div>
  );
};

export default FavoriteDistributorList;
