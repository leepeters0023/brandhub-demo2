import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import General from "../components/Settings/General";
import Users from "../components/Settings/Users";
import Billing from "../components/Settings/Billing";
import Budgets from "../components/Settings/Budgets";
import Programs from "../components/Settings/Programs";
import AddressBook from "../components/User/AddressBook";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  borderRight: {
    paddingRight: "10px",
    borderRight: "1px solid #4C4C4C",
    minWidth: "150px",
  },
}));

const Settings = ({ userType, handleFiltersClosed }) => {
  const classes = useStyles();

  const [setting, setSetting] = useState("general");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClick = (type, index) => {
    setSetting(type);
    setSelectedIndex(index);
    window.location.hash = `#${type}`;
  };

  useEffect(() => {
    if (window.location.hash === "#general") {
      setSetting("general");
      setSelectedIndex(0);
    } else if (window.location.hash === "#addressBook") {
      setSetting("addressBook");
      setSelectedIndex(1);
    } else if (window.location.hash === "#billing") {
      setSetting("billing");
      setSelectedIndex(2);
    } else if (window.location.hash === "#budgets") {
      setSetting("budgets");
      setSelectedIndex(3);
    } else if (window.location.hash === "#users") {
      setSetting("users");
      setSelectedIndex(4);
    } else if (window.location.hash === "#programs") {
      setSetting("programs");
      setSelectedIndex(5);
    }
  }, []);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <Grid container spacing={2} alignItems="stretch" wrap="nowrap">
          <Grid item md={1} xs={false} />
          <Grid item md={2} xs={2} className={classes.borderRight}>
            <List component="nav" aria-label="settings options">
              <ListItem
                button
                selected={selectedIndex === 0}
                onClick={() => {
                  handleClick("general", 0);
                }}
              >
                <ListItemText primary="General" />
              </ListItem>
              <Divider />
              <ListItem
                button
                selected={selectedIndex === 1}
                onClick={() => {
                  handleClick("addressBook", 1);
                }}
              >
                <ListItemText primary="Address Book" />
              </ListItem>
              <Divider />
              <ListItem
                button
                selected={selectedIndex === 2}
                onClick={() => {
                  handleClick("billing", 2);
                }}
              >
                <ListItemText primary="Billing" />
              </ListItem>
              <Divider />
              {userType === "super" && (
                <>
                  <ListItem
                    button
                    selected={selectedIndex === 3}
                    onClick={() => {
                      handleClick("budgets", 3);
                    }}
                  >
                    <ListItemText primary="Budgets" />
                  </ListItem>
                  <Divider />
                  <ListItem
                    button
                    selected={selectedIndex === 4}
                    onClick={() => {
                      handleClick("users", 4);
                    }}
                  >
                    <ListItemText primary="Users" />
                  </ListItem>
                  <Divider />
                  {/* <ListItem
                    button
                    selected={selectedIndex === 5}
                    onClick={() => {
                      handleClick("programs", 5);
                    }}
                  >
                    <ListItemText primary="Programs" />
                  </ListItem>
                  <Divider /> */}
                </>
              )}
            </List>
          </Grid>
          <Grid item md={8} xs={10} style={{ paddingLeft: "20px" }}>
            {setting === "general" && <General />}
            {setting === "addressBook" && <AddressBook />}
            {setting === "billing" && <Billing />}
            {setting === "budgets" && <Budgets />}
            {setting === "users" && <Users />}
            {setting === "programs" && <Programs />}
          </Grid>
          <Grid item md={1} xs={false} />
        </Grid>
      </Container>
      <br />
    </>
  );
};

Settings.propTypes = {
  userType: PropTypes.string,
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default Settings;
