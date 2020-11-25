import React from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";

const DrawerReportsNav = ({ handleDrawerClose, classes, role }) => {
  const currentUserRole = useSelector((state) => state.user.role);

  return (
    <Grid container spacing={2}>
       {(currentUserRole !== "finance" || currentUserRole !== "compliance") && (
        <>
          <Grid item sm={currentUserRole  === "super" ? 2 : 3} xs={12}>
            <List className={classes.navList}>
              <ListItem>
                <ListItemText
                  primaryTypographyProps={{ className: classes.headerText }}
                  primary="Order History"
                />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/orders/history"
              >
                <ListItemText primary="By Order" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/orders/history"
              //TODO handler filters for /byOrder and /byItem
              >
                <ListItemText primary="By Item" />
              </ListItem>
            </List>
          </Grid>
        </>
      )}
      {currentUserRole !== "field1" && (
        <>
          <Grid item sm={3} xs={12}>
            <List className={classes.navList}>
              <ListItem>
                <ListItemText
                  primaryTypographyProps={{ className: classes.headerText }}
                  primary="Reporting:"
                />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to=""
              >
                <Box fontStyle="italic"><ListItemText primary="various reports based on user role, TBD" /></Box>
              </ListItem>
            </List>
          </Grid>
        </>
      )}
      {currentUserRole !== "compliance" && (
        <>
          <Grid item sm={3} xs={12}>
            <List className={classes.navList}>
              <ListItem>
                <ListItemText
                  primaryTypographyProps={{ className: classes.headerText }}
                  primary="Budgets"
                />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/budgets/ytod"
              >
                <ListItemText primary="Budget vs Spend" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to=""
              >
                <Box fontStyle="italic"><ListItemText primary="various reports based on user role, TBD" /></Box>
              </ListItem>
            </List>
          </Grid>
        </>
      )}

    </Grid>
  );
};

DrawerReportsNav.propTypes = {
  handleDrawerClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default DrawerReportsNav;
