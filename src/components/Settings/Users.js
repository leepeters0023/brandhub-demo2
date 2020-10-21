import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useInput } from "../../hooks/InputHooks";

import {
  setFilterType,
  setDefaultFilters,
  updateMultipleFilters,
  setSorted,
  setClear,
} from "../../redux/slices/filterSlice";

import UserTable from "./UserTable";
import EditUserModal from "./EditUserModal";
import UserRoleSelect from "./UserRoleSelect";

import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

import { regions } from "../../utility/constants";

//mock data
const createData = (id, name, email, phone, role, regions) => {
  return {
    id: id,
    name: name,
    email: email,
    phone: phone,
    role: role,
    territories: regions,
  };
};

const userList = [
  createData(
    Math.floor(Math.random() * 10000 + 1).toString(),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random() * 10000 + 1).toString(),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random() * 10000 + 1).toString(),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random() * 10000 + 1).toString(),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random() * 10000 + 1).toString(),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random() * 10000 + 1).toString(),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random() * 10000 + 1).toString(),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random() * 10000 + 1).toString(),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random() * 10000 + 1).toString(),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random() * 10000 + 1).toString(),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
];

const defaultFilters = {
  userName: "",
  sortOrder: "asc",
  sortOrderBy: "name",
};

const TerritorySelector = React.memo(
  ({ classes, handleTerritories }) => (
    <div className={classes.inputRow}>
      <Autocomplete
        multiple
        fullWidth
        id="tags-standard"
        options={regions}
        getOptionLabel={(option) => option.name}
        onChange={(_evt, value) => handleTerritories(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Territory"
            size="small"
          />
        )}
      />
    </div>
  ),
  (prev, next) => {
    return (
      Object.keys(prev.classes).length === Object.keys(next.classes).length
    );
  }
);

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  userForm: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  inputField: {
    marginBottom: "15px",
    width: "48%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

const Users = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { value: firstName, bind: bindFirstName } = useInput("");
  const { value: lastName, bind: bindLastName } = useInput("");
  const { value: email, bind: bindEmail } = useInput("");
  const { value: phone, bind: bindPhone } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");
  const { value: search, bind: bindSearch, reset: resetSearch } = useInput("");

  const [modal, handleModal] = useState(false);
  const [currentTerritories, setCurrentTerritories] = useCallback(useState([]));
  const [currentUserId, setCurrentUserId] = useState(null);
  const [role, setRole] = useState("field1");

  const currentUserRole = useSelector((state) => state.user.role);

  const handleBottomScroll = () => {
    // if (nextLink && !isNextLoading) {
    //   if (scrollRef.current.scrollTop !== 0) {
    //     dispatch(fetchNextUsers(nextLink));
    //   }
    // }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll);

  const handleFormSubmit = (evt) => {
    evt.preventDefault();
    console.log(evt.target.id);
    resetSearch();
    //temporarily removing unused vars so build will work on netlify, not permenant
    console.log(
      firstName,
      lastName,
      email,
      phone,
      password,
      currentTerritories
    );
  };

  const handleUserClick = (user) => {
    setCurrentUserId(user);
    handleModal(true);
  };

  const handleTerritories = useCallback(
    (value) => {
      setCurrentTerritories(value);
    },
    [setCurrentTerritories]
  );

  const handleModalClose = () => {
    handleModal(false);
  };

  const handleSort = (sortObject) => {
    scrollRef.current.scrollTop = 0;
    dispatch(
      updateMultipleFilters({
        filterObject: {
          sortOrder: sortObject.order,
          sortOrderBy: sortObject.orderBy,
        },
      })
    );
    dispatch(setSorted());
  };

  useEffect(() => {
    dispatch(setFilterType({ type: "history-orders" }));
    dispatch(
      setDefaultFilters({
        filterObject: defaultFilters,
      })
    );
    dispatch(
      updateMultipleFilters({
        filterObject: defaultFilters,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentUserRole.length > 0) {
      dispatch(setClear());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {modal && (
        <EditUserModal
          handleModalClose={handleModalClose}
          modal={modal}
          currentUserId={currentUserId}
        />
      )}

      <Typography className={classes.titleText}>Add New User</Typography>
      <br />
      <form className={classes.userForm}>
        <TextField
          size="small"
          className={classes.inputField}
          variant="outlined"
          color="secondary"
          name="firstName"
          type="text"
          label="FirstName"
          value={firstName}
          {...bindFirstName}
        />
        <TextField
          size="small"
          className={classes.inputField}
          variant="outlined"
          color="secondary"
          name="lastName"
          type="text"
          label="LastName"
          value={lastName}
          {...bindLastName}
        />
        <TextField
          size="small"
          className={classes.inputField}
          variant="outlined"
          color="secondary"
          name="email"
          type="email"
          label="Email"
          value={email}
          {...bindEmail}
        />
        <TextField
          size="small"
          className={classes.inputField}
          variant="outlined"
          color="secondary"
          name="phone"
          type="text"
          label="Phone"
          value={phone}
          {...bindPhone}
        />
        <TextField
          size="small"
          className={classes.inputField}
          variant="outlined"
          color="secondary"
          name="password"
          type="text"
          label="Password"
          value={password}
          {...bindPassword}
        />
        <br />
        <br />
      </form>
      <Typography
        className={classes.headerText}
        style={{ marginBottom: "15px" }}
      >
        User Role
      </Typography>
      <UserRoleSelect role={role} setRole={setRole} />
      <br />
      <br />
      <Typography
        className={classes.headerText}
        style={{ marginBottom: "15px" }}
      >
        Region / Key Acct. Assignment
      </Typography>
      <TerritorySelector
        classes={classes}
        handleTerritories={handleTerritories}
      />
      <br />
      <br />
      <Button
        className={classes.largeButton}
        variant="contained"
        color="secondary"
        id="profile"
        onClick={handleFormSubmit}
      >
        SUBMIT
      </Button>

      <br />
      <br />
      <Divider />
      <br />
      <br />
      <Typography className={classes.titleText}>Edit Users</Typography>
      <br />
      <TextField
        size="small"
        className={classes.inputField}
        variant="outlined"
        color="secondary"
        name="search"
        type="text"
        label="Search"
        value={search}
        {...bindSearch}
      />

      <UserTable
        handleUserClick={handleUserClick}
        users={userList}
        isUsersLoading={false}
        handleSort={handleSort}
        scrollRef={scrollRef}
      />
    </>
  );
};

export default Users;
