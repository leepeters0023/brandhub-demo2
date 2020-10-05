import React from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
//import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const DrawerFulfillmentNav = ({ handleDrawerClose, classes }) => {
  return (
    <Grid container spacing={2}>
      <Grid item sm={3} xs={12}>
        <List className={classes.navList}>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ className: classes.headerText }}
              primary="Purchase Orders:"
            />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/purchasing/PORollup"
          >
            <ListItemText primary="Create PO" />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component={Link} to="/">
            <ListItemText
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
              primary="* Current POs"
            />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component={Link} to="/">
            <ListItemText
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
              primary="* PO History"
            />
          </ListItem>
        </List>
      </Grid>
      <Grid item sm={3} xs={12}>
        <List className={classes.navList}>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ className: classes.headerText }}
              primary="Bids:"
            />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component={Link} to="/purchasing/bidRollup">
            <ListItemText
              primary="Create Bid"
            />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component={Link} to="/">
            <ListItemText
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
              primary="* Current Bids"
            />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component={Link} to="/">
            <ListItemText
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
              primary="* Bid History"
            />
          </ListItem>
        </List>
      </Grid>
      <Grid item sm={3} xs={12}>
      <List className={classes.navList}>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ className: classes.headerText }}
              primary="Compliance:"
            />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component={Link} to="/">
            <ListItemText
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
              primary="* Dashboard"
            />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component={Link} to="/">
            <ListItemText
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
              primary="* Compliance View"
            />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component={Link} to="/">
            <ListItemText
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
              primary="* Compliance View"
            />
          </ListItem>
        </List>
      </Grid>
      <Grid item sm={3} xs={12}>
      <List className={classes.navList}>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ className: classes.headerText }}
              primary="Budgets:"
            />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component={Link} to="/">
            <ListItemText
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
              primary="* Budget View"
            />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component={Link} to="/">
            <ListItemText
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
              primary="* Budget View"
            />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component={Link} to="/">
            <ListItemText
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
              primary="* Budget View"
            />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
};

DrawerFulfillmentNav.propTypes = {
  handleDrawerClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default DrawerFulfillmentNav;
