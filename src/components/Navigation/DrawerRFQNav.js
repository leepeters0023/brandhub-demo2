import React from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

//TODO get actual number of each status to display from redux (mock only), add correct statuses

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
            to="/purchasing/rfqHistory/current"
          >
            <ListItemAvatar>
              <Avatar>
                8
              </Avatar>
            </ListItemAvatar>
            <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="New" />
          </ListItem>
        </List>
      </Grid>
      <Grid item sm={3} xs={12}>
        <List className={classes.navList}>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/purchasing/rfqHistory/current"
          >
            <ListItemAvatar>
              <Avatar>
                15
              </Avatar>
            </ListItemAvatar>
            <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="In Progress" />
          </ListItem>
        </List>
      </Grid>
      <Grid item sm={3} xs={12}>
        <List className={classes.navList}>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/purchasing/rfqHistory/all"
          >
            <ListItemAvatar>
              <Avatar>
                25
              </Avatar>
            </ListItemAvatar>
            <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Awarded" />
          </ListItem>
        </List>
      </Grid>
      <Grid item sm={3} xs={12}>
        <List className={classes.navList}>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/purchasing/rfqHistory/all"
          >
            <ListItemAvatar>
              <Avatar>
                0
              </Avatar>
            </ListItemAvatar>
            <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="History" />
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