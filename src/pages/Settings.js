import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import GalloLogo from "../assets/gallologo.png";

import General from "../components/Settings/General";
import Users from "../components/Settings/Users";
import Billing from "../components/Settings/Billing";
import Budgets from "../components/Settings/Budgets";
import Programs from "../components/Settings/Programs";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
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

const Settings = ({ userType }) => {
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
    } else if (window.location.hash === "#billing") {
      setSetting("billing");
      setSelectedIndex(1);
    } else if (window.location.hash === "#budgets") {
      setSetting("budgets");
      setSelectedIndex(2);
    } else if (window.location.hash === "#users") {
      setSetting("users");
      setSelectedIndex(3);
    } else if (window.location.hash === "#programs") {
      setSetting("programs");
      setSelectedIndex(4);
    }
  }, []);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Settings
          </Typography>
        </div>
        <br />
        <Divider className={classes.pageBreak} />
        <br />
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
                  handleClick("billing", 1);
                }}
              >
                <ListItemText primary="Billing" />
              </ListItem>
              <Divider />
              {userType === "super" && (
                <>
                <ListItem
                    button
                    selected={selectedIndex === 2}
                    onClick={() => {
                      handleClick("budgets", 2);
                    }}
                  >
                    <ListItemText primary="Budgets" />
                  </ListItem>
                  <Divider />
                  <ListItem
                    button
                    selected={selectedIndex === 3}
                    onClick={() => {
                      handleClick("users", 3);
                    }}
                  >
                    <ListItemText primary="Users" />
                  </ListItem>
                  <Divider />
                  {/* <ListItem
                    button
                    selected={selectedIndex === 4}
                    onClick={() => {
                      handleClick("programs", 4);
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
  userType: PropTypes.string
}

export default Settings;
