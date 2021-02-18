import React, { useState, useRef } from "react";

import { useInitialFilters } from "../../hooks/UtilityHooks";
import { useSelector, useDispatch } from "react-redux";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useDetailedInput } from "../../hooks/InputHooks";

import {
  updateMultipleFilters,
  setSorted,
} from "../../redux/slices/filterSlice";
import {
  fetchNextFilteredUsers,
  fetchFilteredUsers,
  setUpdateSuccess,
  clearCurrentUser,
} from "../../redux/slices/userUpdateSlice";

import UserTable from "./UserTable";
import EditUserModal from "./EditUserModal";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

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

  const [modal, handleModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const currentUserRole = useSelector((state) => state.user.role);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const isLoading = useSelector((state) => state.userUpdate.isLoading);
  const isNextLoading = useSelector((state) => state.userUpdate.isNextLoading);
  const nextLink = useSelector((state) => state.userUpdate.nextLink);
  const currentUsers = useSelector((state) => state.userUpdate.userList);

  const handleBottomScroll = () => {
    if (nextLink && !isNextLoading) {
      if (scrollRef.current.scrollTop !== 0) {
        dispatch(fetchNextFilteredUsers(nextLink));
      }
    }
  };

  const scrollRef = useBottomScrollListener(handleBottomScroll, 300);
  const debounce = useRef(null);

  const handleUserClick = (user) => {
    setCurrentUserId(user);
    handleModal(true);
  };

  const handleModalClose = () => {
    handleModal(false);
    dispatch(setUpdateSuccess({ updateStatus: false }));
    dispatch(clearCurrentUser());
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

  const handleSearch = (value, _type, _filter) => {
    clearTimeout(debounce.current);

    debounce.current = setTimeout(() => {
      dispatch(fetchFilteredUsers(value));
    }, 250);
  };

  const { value: search, bind: bindSearch } = useDetailedInput(
    "",
    handleSearch
  );

  useInitialFilters(
    "user-settings",
    defaultFilters,
    retainFilters,
    dispatch,
    undefined,
    currentUserRole
  );

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
        users={currentUsers}
        isUsersLoading={isLoading}
        handleSort={handleSort}
        scrollRef={scrollRef}
      />
    </>
  );
};

export default Users;
