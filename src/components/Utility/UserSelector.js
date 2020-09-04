import React, { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import PropTypes from "prop-types";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

const UserSelector = () => {

  const fieldUsers = ["Field User 1", "Field User 2", "Field User 3"];

  const [user, updateUser] = useState(fieldUsers[0]);

  const handleChangeSelect = (evt) => {
    updateUser(evt.target.value);
  };

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
          {fieldUsers.map((user, index) => (
            <MenuItem value={user} key={index}>
              <Typography variant="body2">{user}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default React.memo(UserSelector);
