import React from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const DrawerFulfillmentNav = ({ handleDrawerClose, classes }) => {
  return (
    <Grid container spacing={2}>
      <Grid item sm={3} xs={12}>
        <Button
          fullWidth
          onClick={handleDrawerClose}
          component={Link}
          to="/"
          className={classes.largeButton}
          variant="contained"
          color="secondary"
          style={{ fontStyle: "italic" }}
        >
          CREATE PO
        </Button>
        <br />
        <br />
        <Button
          fullWidth
          onClick={handleDrawerClose}
          component={Link}
          to="/"
          className={classes.largeButton}
          variant="contained"
          color="secondary"
          style={{ fontStyle: "italic" }}
        >
          COMPLIANCE
        </Button>
      </Grid>
      <Grid item sm={1} xs={12} />
      <Grid item sm={4} xs={12}>
        <List>
          <ListItem button onClick={handleDrawerClose} component={Link} to="/">
            <ListItemText
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
              primary="Open POs"
            />
          </ListItem>
        </List>
      </Grid>
      <Grid item sm={4} xs={12}></Grid>
    </Grid>
  );
};

DrawerFulfillmentNav.propTypes = {
  handleDrawerClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default DrawerFulfillmentNav;
