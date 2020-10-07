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
            to="/purchasing/poRollup"
          >
            <ListItemText primary="Create PO" />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/purchasing/poHistory#current"
          >
            <ListItemText
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
              primary="* Current POs"
            />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/purchasing/poHistory#all"
          >
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
              primary="RFQs:"
            />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/purchasing/rfqRollup"
          >
            <ListItemText primary="Create RFQ" />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/purchasing/rfqHistory#current"
          >
            <ListItemText
              primary="Current RFQ"
            />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/purchasing/rfqHistory#all"
          >
            <ListItemText
              primary="RFQ History"
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
          <ListItem button onClick={handleDrawerClose} component={Link} to="/compliance/items">
            <ListItemText
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
              primary="* Item Compliance"
            />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component={Link} to="/compliance/rules">
            <ListItemText
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
              primary="* Rules"
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
