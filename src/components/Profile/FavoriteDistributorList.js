import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useInput } from "../../hooks/InputHooks";

import { fetchUserDistributors } from "../../redux/slices/distributorSlice";
import {
  setDistributors,
  updateDistributorListName,
  deleteDistributorList,
} from "../../redux/slices/userSlice";

import DistributorTable from "./DistributorTable";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import DeleteIcon from "@material-ui/icons/Delete";

const MemoNameInput = React.memo(
  ({ dispatch, id }) => {
    const currentValue = useSelector(
      (state) =>
        state.user.favoriteDistributors.find((distList) => distList.id === id)
          .name
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
          dispatch(updateDistributorListName({ id: id, value: name }))
        }
      />
    );
  },
  (prev, next) => prev.id === next.id
);

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const FavoriteDistributorList = ({ id, index }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  let styleObject =
    index % 2 === 0
      ? {
          padding: "10px",
          boxSizing: "border-box",
          marginBottom: "20px",
          backgroundColor: "white",
        }
      : {
          padding: "10px",
          boxSizing: "border-box",
          marginBottom: "20px",
          backgroundColor: "#f2f2f2",
        };

  const [open, setOpen] = useState(false);
  const [distributor, setDistributor] = useState("");
  const [currentDistributors, setCurrentDistributors] = useState([]);

  const isLoading = useSelector((state) => state.distributors.isLoading);
  const options = useSelector((state) => state.distributors.distributorList);
  const userDistributors = useSelector(
    (state) =>
      state.user.favoriteDistributors.find((distList) => distList.id === id)
        .distributors
  );

  const loading = open && isLoading;

  const handleDistributors = (value) => {
    setCurrentDistributors(value);
    dispatch(setDistributors({ distributors: value, id: id }));
  };

  const handleDeleteList = () => {
    dispatch(deleteDistributorList({ id: id }));
  };

  useEffect(() => {
    if (distributor.length >= 1) {
      dispatch(fetchUserDistributors(distributor));
    }
  }, [distributor, dispatch]);

  useEffect(() => {
    if (userDistributors.length !== currentDistributors.length) {
      setCurrentDistributors(userDistributors);
    }
  }, [currentDistributors, userDistributors]);

  return (
    <div style={styleObject}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <MemoNameInput dispatch={dispatch} id={id} />
        <Autocomplete
          style={{ width: "45%" }}
          multiple
          freeSolo
          renderTags={() => null}
          className={classes.queryField}
          id="distributor-auto-complete"
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
              label="Add Distributor"
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
        isLoading={false}
        id={id}
      />
      <br />
    </div>
  );
};

export default FavoriteDistributorList;
