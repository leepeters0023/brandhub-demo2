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
}) => {
  const [user, setUser] = useState(null);
  const [currentUsers, setCurrentUsers] = useState([]);

  const fieldUsers = useSelector((state) => state.user.managedUsers);
  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUsers.length === 0 && fieldUsers && currentUser) {
      let userArray = fieldUsers.concat([
        {
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          id: currentUser.id,
        },
      ]);
      setCurrentUsers(userArray);
    }
  }, [currentUsers, currentUser, fieldUsers]);

  useEffect(() => {
    if (reset) {
      setUser(null);
      setReset(false);
    }
  }, [reset, setUser, setReset]);

  return (
    <>
      <Autocomplete
        fullWidth
        className={classes.queryField}
        id="field-auto-complete"
        value={user}
        onChange={(_evt, value) => {
          setUser(value);
          handleChange(value, "user", filterType);
        }}
        options={currentUsers}
        getOptionLabel={(user) => user.name}
        renderInput={(params) => (
          <TextField
            id="user-auto-search"
            color="secondary"
            {...params}
            label="User"
            variant="outlined"
            size="small"
            type="text"
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
};

export default UserAutoComplete;
