import React from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const DrawerItemsNav = ({ userType, handleDrawerClose, classes }) => {
  return (
    <Grid container spacing={2} justify="space-around">
      <Grid item sm={3} xs={12}>
        <List className={classes.navList}>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ className: classes.navHeaderText }}
              primary="Item Catalog:"
            />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/items/all"
          >
            <ListItemText
              primaryTypographyProps={{ className: classes.headerListItem }}
              primary="Current"
            />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/items/archive"
          >
            <ListItemText
              primaryTypographyProps={{ className: classes.headerListItem }}
              primary="Archive"
            />
          </ListItem>
        </List>
      </Grid>
      <Grid item sm={3} xs={12}>
        <List className={classes.navList}>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ className: classes.navHeaderText }}
              primary="Programs:"
            />
          </ListItem>
          {(userType === "field2" || userType === "super") && (
            <ListItem
              button
              onClick={handleDrawerClose}
              component={Link}
              to="/programs/new"
            >
              <ListItemText
                primaryTypographyProps={{ className: classes.headerListItem }}
                primary="Create Ad Hoc Program"
              />
            </ListItem>
          )}
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/programs"
          >
            <ListItemText
              primaryTypographyProps={{ className: classes.headerListItem }}
              primary="Pre-Order Programs"
            />
          </ListItem>
        </List>
      </Grid>
      <Grid item sm={3} xs={12}>
        <List className={classes.navList}>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ className: classes.navHeaderText }}
              primary="Compliance:"
            />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/compliance/items"
            // accurate that we should be showing this to all users?
          >
            <ListItemText
              primaryTypographyProps={{ className: classes.headerListItem }}
              primary="Item Rules"
            />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/compliance/rules"
            // accurate that we should be showing this to all users?
          >
            <ListItemText
              primaryTypographyProps={{ className: classes.headerListItem }}
              primary="General Rules"
            />
          </ListItem>
          {(userType === "compliance" ||
            userType === "super" ||
            userType === "read-only") && (
            <ListItem
              button
              onClick={handleDrawerClose}
              component={Link}
              to="/compliance/contacts"
            >
              <ListItemText
                primaryTypographyProps={{ className: classes.headerListItem }}
                primary="Contacts"
              />
            </ListItem>
          )}
        </List>
      </Grid>
    </Grid>
  );
};

DrawerItemsNav.propTypes = {
  handleDrawerClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default DrawerItemsNav;
