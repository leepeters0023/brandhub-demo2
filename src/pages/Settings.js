import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

import { useWindowHash } from "../hooks/UtilityHooks";

//import General from "../components/Settings/General";
import Users from "../components/Settings/Users";
import Territories from "../components/Settings/Territories";
import OrderPatchLoading from "../components/Utility/OrderPatchLoading";

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
  const tabs = ["#users", "#territories"];
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleChangeTab = useWindowHash(tabs, setSelectedIndex);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title> Settings</title>
      </Helmet>
      <Container className={classes.mainWrapper}>
        <Grid container spacing={2} alignItems="stretch" wrap="nowrap">
          <Grid item md={1} xs={false} />
          <Grid item md={2} xs={2} className={classes.borderRight}>
            <List component="nav" aria-label="settings options">
              {/* <ListItem
                button
                selected={selectedIndex === 1}
                onClick={(evt) => {
                  handleChangeTab(evt, 1);
                }}
              >
                <ListItemText primary="General" />
              </ListItem> */}
              {userType !== "field1" && (
                <>
                  <Divider />
                  <ListItem
                    button
                    selected={selectedIndex === 1}
                    onClick={(evt) => {
                      handleChangeTab(evt, 1);
                    }}
                  >
                    <ListItemText primary="Users" />
                  </ListItem>
                  <Divider />
                  <ListItem
                    button
                    selected={selectedIndex === 2}
                    onClick={(evt) => {
                      handleChangeTab(evt, 2);
                    }}
                  >
                    <ListItemText primary="Territories" />
                  </ListItem>
                </>
              )}
            </List>
          </Grid>
          <Grid item md={8} xs={10} style={{ paddingLeft: "20px" }}>
            {selectedIndex === 1 && <Users />}
            {selectedIndex === 2 && <Territories />}
          </Grid>
          <Grid item md={1} xs={false} />
        </Grid>
      </Container>
      <br />
      <OrderPatchLoading />
    </>
  );
};

Settings.propTypes = {
  userType: PropTypes.string,
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default Settings;
