import React from "react";
import { Link } from "@reach/router";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import HistoryIcon from "@material-ui/icons/History";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import DateRangeIcon from "@material-ui/icons/DateRange";
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
  midBreak: {
    marginTop: "10px",
  }
}));

const UserBDM = ({ handleDrawer, handleLogout }) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.user}>
        <Avatar className={classes.avatar} />
        <Typography>User</Typography>
      </div>
      <Divider />
      <List>
        <ListItem>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            component={Link}
            to="/order"
            onClick={() => {
              handleDrawer(false);
            }}
          >
            PLACE AN ORDER
          </Button>
        </ListItem>
        <ListItem>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            component={Link}
            to="/coupons"
            onClick={() => {
              handleDrawer(false);
            }}
          >
            CREATE COUPONS
          </Button>
        </ListItem>
        <Divider className={classes.midBreak}/>
        <ListItem
          button
          component={Link}
          to="/order-history"
          onClick={() => {
            handleDrawer(false);
          }}
        >
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="Order History" />
        </ListItem>
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
          to="/budget"
          onClick={() => {
            handleDrawer(false);
          }}
        >
          <ListItemIcon>
            <MonetizationOnIcon />
          </ListItemIcon>
          <ListItemText primary="Budget" />
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

export default UserBDM;