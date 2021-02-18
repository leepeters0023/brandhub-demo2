import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const UserAutoComplete = ({
  classes,
  handleChange,
  reset,
  setReset,
  filterType,
  id,
}) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("");
  const [currentUsers, setCurrentUsers] = useState([]);
  const [currentUserList, setCurrentUserList] = useState([]);

  const fieldUsers = useSelector((state) => state.user.managedUsers);
  const currentUser = useSelector((state) => state.user);
  const currentFiltersUser = useSelector((state) => state.filters.user);
  const isGlobalLoading = useSelector((state) => state.globalLoad.isLoading);

  const handleUsers = (value) => {
    setCurrentUsers(value);
  };

  useEffect(() => {
    if (currentUserList.length === 0 && fieldUsers && currentUser) {
      let userArray = fieldUsers.concat([
        {
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          id: currentUser.id,
        },
      ]);
      setCurrentUserList(userArray);
    }
  }, [currentUserList, currentUser, fieldUsers]);

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
        classes={{
          popper: classes.liftedPopper,
        }}
        fullWidth
        className={classes.queryField}
        id={id ? id : "field-auto-complete"}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={user}
        onInputChange={(_evt, value) => setUser(value)}
        onChange={(_evt, value) => {
          handleChange(value, "user", filterType);
          handleUsers(value);
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(user) => user.name}
        options={currentUserList}
        value={currentUsers}
        disabled={isGlobalLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Person"
            id="user-auto-search"
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
              autoComplete: "new-password",
              endAdornment: <>{params.InputProps.endAdornment}</>,
            }}
          />
        )}
      />
    </>
  );
};

UserAutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  filterType: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export default UserAutoComplete;
