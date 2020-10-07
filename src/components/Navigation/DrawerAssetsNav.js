import React from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const DrawerAssetsNav = ({ handleDrawerClose, classes }) => {
  return (
    <Grid container spacing={2}>
      <Grid item sm={3} xs={12}>
        <List className={classes.navList}>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ className: classes.headerText }}
              primary="Item Catalog:"
            />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/items#inStock"
          >
            <ListItemText primary="In-Stock" />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/items#onDemand"
          >
            <ListItemText primary="On-Demand" />
          </ListItem>
        </List>
      </Grid>
      <Grid item sm={3} xs={12}>
        <List className={classes.navList}>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ className: classes.headerText }}
              primary="Programs:"
            />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/programs"
          >
            <ListItemText primary="Pre-Order Programs" />
          </ListItem>
        </List>
      </Grid>
      <Grid item sm={3} xs={12}>
        <List className={classes.navList}>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ className: classes.headerText }}
              primary="PDF Creation:"
            />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component={Link} to="/">
            <ListItemText
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
              primary="* Current PDF"
            />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
};

DrawerAssetsNav.propTypes = {
  handleDrawerClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default DrawerAssetsNav;
