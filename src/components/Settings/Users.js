import React, { useState, useEffect } from "react";

import { useInitialFilters } from "../../hooks/UtilityHooks";
import { useSelector, useDispatch } from "react-redux";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useInput } from "../../hooks/InputHooks";

import {
  setFilterType,
  setDefaultFilters,
  updateMultipleFilters,
  setSorted,
} from "../../redux/slices/filterSlice";

import UserTable from "./UserTable";
import EditUserModal from "./EditUserModal";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

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

  const { value: search, bind: bindSearch } = useInput("");

  const [modal, handleModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const currentUserRole = useSelector((state) => state.user.role);
  const retainFilters = useSelector((state) => state.filters.retainFilters);

  const handleBottomScroll = () => {
    // if (nextLink && !isNextLoading) {
    //   if (scrollRef.current.scrollTop !== 0) {
    //     dispatch(fetchNextUsers(nextLink));
    //   }
    // }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll);

  const handleUserClick = (user) => {
    setCurrentUserId(user);
    handleModal(true);
  };

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
    dispatch(setFilterType({ type: "user-settings" }));
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

  //Todo handle fetch in filter drawer
  useInitialFilters(
    "user-settings",
    defaultFilters,
    retainFilters,
    dispatch,
    undefined,
    currentUserRole
  )

  return (
    <>
      {modal && (
        <EditUserModal
          handleModalClose={handleModalClose}
          modal={modal}
          currentUserId={currentUserId}
        />
      )}
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
