import React from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

//TODO get actual number of each status to display from redux (mock only)

const DrawerOrdersNav = ({
  handleDrawerClose,
  classes,
}) => {
  return (
    <Grid container spacing={2} justify="space-around">
      <Grid item sm={3} xs={12}>
        <List className={classes.navList}>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/purchasing/poHistory#new"
          >
            <ListItemAvatar>
              <Avatar>
                5
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="New" />
          </ListItem>
        </List>
      </Grid>
      <Grid item sm={3} xs={12}>
        <List className={classes.navList}>
        <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/purchasing/poHistory#current"
          >
            <ListItemAvatar>
              <Avatar>
                10
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="In Progress" />
          </ListItem>
        </List>
      </Grid>
      <Grid item sm={3} xs={12}>
        <List className={classes.navList}>
        <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/purchasing/poHistory#hold"
          >
            <ListItemAvatar>
              <Avatar>
                2
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Shipping Hold" />
          </ListItem>
        </List>
      </Grid>
      <Grid item sm={3} xs={12}>
        <List className={classes.navList}>
        <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/purchasing/poHistory#all"
          >
            <ListItemText primary="History" />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
};

DrawerOrdersNav.propTypes = {
  handleDrawerClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default DrawerOrdersNav;