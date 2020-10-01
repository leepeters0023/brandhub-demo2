import React from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const DrawerAssetsNav = ({ handleDrawerClose, classes }) => {
  return (
    <Grid container spacing={2}>
      <Grid item sm={3} xs={12}>
        <Button
          fullWidth
          onClick={handleDrawerClose}
          component={Link}
          to="/items"
          className={classes.largeButton}
          variant="contained"
          color="secondary"
        >
          ITEM CATALOG
        </Button>
        <br />
        <br />
        <Button
          fullWidth
          onClick={handleDrawerClose}
          component={Link}
          to="/programs"
          className={classes.largeButton}
          variant="contained"
          color="secondary"
        >
          PRE-ORDER PROGRAMS
        </Button>
      </Grid>
      <Grid item sm={1} xs={12} />
      <Grid item sm={4} xs={12}>
        <List>
          <ListItem button onClick={handleDrawerClose} component={Link} to="/">
            <ListItemText
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
              primary="Current PDF"
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
