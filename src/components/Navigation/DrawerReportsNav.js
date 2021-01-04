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
    <Grid container spacing={2} justify="space-around">
      {(currentUserRole !== "finance" || currentUserRole !== "compliance") && (
        <>
          <Grid item sm={3} xs={12}>
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
                to="/orders/history/group/byOrder"
              >
                <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="By Order" />
              </ListItem>
              <ListItem
                
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/orders/history/group/byItem"
              >
                <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="By Item" />
              </ListItem>
            </List>
          </Grid>
        </>
      )}
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
                to="/reports/wrap-up"
              >
                <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Wrap Up" />
              </ListItem>
          <ListItem button onClick={handleDrawerClose} component={Link} to="">
            <Box fontStyle="italic">
              <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="*TBD" />
            </Box>
          </ListItem>
        </List>
      </Grid>
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
                <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Budget vs Spend" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to=""
              >
                <Box fontStyle="italic">
                  <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="*TBD" />
                </Box>
              </ListItem>
            </List>
          </Grid>
        </>
      )}
      {currentUserRole === "field1" && <Grid item sm={3} xs={12} />}
    </Grid>
  );
};

DrawerReportsNav.propTypes = {
  handleDrawerClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default DrawerReportsNav;
