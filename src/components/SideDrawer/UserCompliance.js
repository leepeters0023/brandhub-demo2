import React from "react";
import { Link } from "@reach/router";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import AccountBoxIcon from "@material-ui/icons/AccountBox";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import DateRangeIcon from "@material-ui/icons/DateRange";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import HelpIcon from "@material-ui/icons/Help";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles((theme) => ({
  user: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "20px",
    width: "200px",
  },
  avatar: {
    height: theme.spacing(7),
    width: theme.spacing(7),
  },
}));

const UserCompliance = ({ handleDrawer, handleLogout }) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.user}>
        <Avatar className={classes.avatar} />
        <Typography>User</Typography>
      </div>
      <Divider />
      <List>
        <ListItem
          button
          component={Link}
          to="/account"
          onClick={() => {
            handleDrawer(false);
          }}
        >
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary="My Account" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/reports"
          onClick={() => {
            handleDrawer(false);
          }}
        >
          <ListItemIcon>
            <InsertChartIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/calendar"
          onClick={() => {
            handleDrawer(false);
          }}
        >
          <ListItemIcon>
            <DateRangeIcon />
          </ListItemIcon>
          <ListItemText primary="Calendar" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/compliance"
          onClick={() => {
            handleDrawer(false);
          }}
        >
          <ListItemIcon>
            <AssignmentTurnedInIcon />
          </ListItemIcon>
          <ListItemText primary="Compliance" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/help"
          onClick={() => {
            handleDrawer(false);
          }}
        >
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Help" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/"
          onClick={() => {
            handleLogout()
            handleDrawer(false);
          }}
        >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </>
  );
};

export default UserCompliance;