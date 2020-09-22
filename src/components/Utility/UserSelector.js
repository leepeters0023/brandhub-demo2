import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import PropTypes from "prop-types";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

const UserSelector = () => {
  const [currentUsers, updateCurrentUsers] = useState([]);
  const [user, updateUser] = useState("");

  const fieldUsers = useSelector((state) => state.user.managedUsers);
  const currentUser = useSelector((state) => state.user);

  const handleChangeSelect = (evt) => {
    updateUser(evt.target.value);
  };

  useEffect(() => {
    if (currentUsers.length === 0 && fieldUsers && currentUser) {
      let userArray = fieldUsers.concat([
        {
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          id: currentUser.id,
        },
      ]);
      updateCurrentUsers(userArray);
      updateUser(userArray[userArray.length - 1].id);
    }
  }, [currentUsers, currentUser, fieldUsers]);

  return (
    <>
      <FormControl variant="outlined" size="small" style={{ margin: "0 5px" }}>
        <Select
          name="user"
          labelId="user-select"
          id="user"
          value={user}
          onChange={handleChangeSelect}
        >
          {currentUsers.map((user, index) => (
            <MenuItem value={user.id} key={index}>
              <Typography variant="body2">{user.name}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default React.memo(UserSelector);
