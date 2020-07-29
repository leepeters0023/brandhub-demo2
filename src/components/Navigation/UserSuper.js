import React from "react";
import { Link } from "@reach/router";

import OrdersMenu from "./OrdersMenu";
import ComplianceMenu from "./ComplianceMenu";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { makeStyles } from "@material-ui/core/styles";

import DashboardIcon from "@material-ui/icons/Dashboard";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import InsertChartIcon from "@material-ui/icons/InsertChart";
//import DateRangeIcon from "@material-ui/icons/DateRange";
import HelpIcon from "@material-ui/icons/Help";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const UserSuper = () => {
  const classes = useStyles();
  return (
    <>
      <List className={classes.navList}>
        <div>
          <ListItem className={classes.navItem} button component={Link} to="/">
            <ListItemIcon className={classes.navItem}>
              <DashboardIcon fontSize="large" color="primary" />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ className: classes.navText }}
              primary="Dashboard"
            />
          </ListItem>
          <OrdersMenu />
          <ListItem
            className={classes.navItem}
            button
            component={Link}
            to="/budget#regional"
          >
            <ListItemIcon className={classes.navItem}>
              <MonetizationOnIcon fontSize="large" color="primary" />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ className: classes.navText }}
              primary="Budget"
            />
          </ListItem>
          <ListItem
            className={classes.navItem}
            button
            component={Link}
            to="/reports"
          >
            <ListItemIcon className={classes.navItem}>
              <InsertChartIcon fontSize="large" color="primary" />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ className: classes.navText }}
              primary="Reports"
            />
          </ListItem>
          <ComplianceMenu />
          {/* <ListItem
            className={classes.navItem}
            button
            component={Link}
            to="/calendar"
          >
            <ListItemIcon className={classes.navItem}>
              <DateRangeIcon fontSize="large" color="primary" />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ className: classes.navText }}
              primary="Calendar"
            />
          </ListItem> */}
        </div>
        <div>
          <ListItem
            className={classes.navItem}
            button
            component={Link}
            to="/help"
          >
            <ListItemIcon className={classes.navItem}>
              <HelpIcon fontSize="large" color="primary" />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ className: classes.navText }}
              primary="Help"
            />
          </ListItem>
        </div>
      </List>
    </>
  );
};

export default UserSuper;
