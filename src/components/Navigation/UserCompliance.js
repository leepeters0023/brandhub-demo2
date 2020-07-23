import React from "react";
import { Link } from "@reach/router";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { makeStyles } from "@material-ui/core/styles";

import AccountBoxIcon from "@material-ui/icons/AccountBox";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import DateRangeIcon from "@material-ui/icons/DateRange";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import HelpIcon from "@material-ui/icons/Help";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const UserCompliance = ({ handleLogout }) => {
  const classes = useStyles();
  return (
    <>
      <List className={classes.navList}>
        <div>
          <ListItem className={classes.navItem} button component={Link} to="/compliance">
            <ListItemIcon className={classes.navItem}>
              <AssignmentTurnedInIcon fontSize="large" color="primary" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{className: classes.navText}} primary="Compliance" />
          </ListItem>
          <ListItem className={classes.navItem} button component={Link} to="/reports">
            <ListItemIcon className={classes.navItem}>
              <InsertChartIcon fontSize="large" color="primary" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{className: classes.navText}} primary="Reports" />
          </ListItem>
          <ListItem className={classes.navItem} button component={Link} to="/calendar">
            <ListItemIcon className={classes.navItem}>
              <DateRangeIcon fontSize="large" color="primary" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{className: classes.navText}} primary="Calendar" />
          </ListItem>
        </div>
        <div>
          <ListItem className={classes.navItem} button component={Link} to="/account">
            <ListItemIcon className={classes.navItem}>
              <AccountBoxIcon fontSize="large" color="primary" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{className: classes.navText}} primary="Account" />
          </ListItem>
          <ListItem className={classes.navItem} button component={Link} to="/help">
            <ListItemIcon className={classes.navItem}>
              <HelpIcon fontSize="large" color="primary" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{className: classes.navText}} primary="Help" />
          </ListItem>
          <ListItem className={classes.navItem} button onClick={handleLogout} component={Link} to="/">
            <ListItemIcon className={classes.navItem}>
              <ExitToAppIcon fontSize="large" color="primary" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{className: classes.navText}} primary="Logout" />
          </ListItem>
        </div>
      </List>
    </>
  );
};

export default UserCompliance;
