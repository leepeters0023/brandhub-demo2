import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { fetchFilteredUsers } from "../../redux/slices/userUpdateSlice";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

const PurchaserAutoComplete = ({
  classes,
  handleChange,
  reset,
  setReset,
  filterType,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("");
  const [currentUsers, setCurrentUsers] = useState([]);

  const isLoading = useSelector((state) => state.userUpdate.isLoading);
  const options = useSelector((state) => state.userUpdate.userList);
  const currentFiltersUser = useSelector((state) => state.filters.user);
  const currentUserRole = useSelector((state) => state.user.role);
  const isGlobalLoading = useSelector((state) => state.globalLoad.isLoading);

  const loading = open && isLoading;

  const debounce = useRef(null);

  const handleUsers = (value) => {
    setCurrentUsers(value);
  };

  const handleQuery = useCallback(() => {
    clearTimeout(debounce.current);

    debounce.current = setTimeout(() => {
      dispatch(fetchFilteredUsers(user, currentUserRole));
    }, 250);
  }, [user, currentUserRole, dispatch]);

  useEffect(() => {
    if (user.length >= 1) {
      handleQuery();
    }
  }, [user, handleQuery, dispatch]);

  useEffect(() => {
    if (currentFiltersUser.length !== currentUsers.length) {
      setCurrentUsers(currentFiltersUser);
    }
  }, [currentFiltersUser, currentUsers.length]);

  useEffect(() => {
    if (reset) {
      setUser("");
      setCurrentUsers([]);
      setReset(false);
    }
  }, [reset, setUser, setReset]);

  return (
    <>
      <Autocomplete
        multiple
        freeSolo
        renderTags={() => null}
        fullWidth
        className={classes.queryField}
        classes={{
          popper: classes.liftedPopper,
        }}
        id="purchaser-auto-complete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={user}
        onInputChange={(_evt, value) => setUser(value)}
        onChange={(_evt, value) => {
          handleChange(value, "purchaser", filterType);
          handleUsers(value);
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={currentUsers}
        disabled={isGlobalLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Purchaser"
            id="purchaser-auto-search"
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
              autoComplete: "new-password",
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
    </>
  );
};

PurchaserAutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  filterType: PropTypes.string.isRequired,
};

export default PurchaserAutoComplete;
