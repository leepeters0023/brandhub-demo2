import React from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const DrawerOrdersNav = ({
  handleDrawerClose,
  classes,
  inStockOrderId,
  onDemandOrderId,
  role,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item sm={3} xs={12}>
        <Button
          fullWidth
          onClick={handleDrawerClose}
          component={Link}
          to="/orders/open/preorder"
          className={classes.largeButton}
          variant="contained"
          color="secondary"
        >
          QUARTERLY PRE-ORDER
        </Button>
        <br />
        <br />
        <Button
          fullWidth
          onClick={handleDrawerClose}
          component={Link}
          to="/orders/items/inStock"
          className={classes.largeButton}
          variant="contained"
          color="secondary"
        >
          IN-STOCK
        </Button>
        <br />
        <br />
        <Button
          fullWidth
          onClick={handleDrawerClose}
          component={Link}
          to="/orders/items/onDemand"
          className={classes.largeButton}
          variant="contained"
          color="secondary"
        >
          ON-DEMAND
        </Button>
      </Grid>
      <Grid item sm={1} xs={12} />
      <Grid item sm={4} xs={12}>
        <List>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ className: classes.headerText }}
              primary="Open Orders:"
            />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to={
              inStockOrderId
                ? `/orders/open/${inStockOrderId}`
                : "/orders/open/inStock"
            }
          >
            <ListItemText primary="In-Stock" />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to={
              onDemandOrderId
                ? `/orders/open/${onDemandOrderId}`
                : "/orders/open/onDemand"
            }
          >
            <ListItemText primary="On-Demand" />
          </ListItem>
        </List>
      </Grid>
      <Grid item sm={4} xs={12}>
        <List>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/orders/history"
          >
            <ListItemText primary="Order History" />
          </ListItem>
          {role !== "field1" && (
            <>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/rollup"
              >
                <ListItemText primary="Quarterly Rollup" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/orders/approvals"
              >
                <ListItemText primary="Approvals" />
              </ListItem>
            </>
          )}
        </List>
      </Grid>
    </Grid>
  );
};

DrawerOrdersNav.propTypes = {
  handleDrawerClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  inStockOrderId: PropTypes.string,
  onDemandOrderId: PropTypes.string,
  role: PropTypes.string.isRequired,
};

export default DrawerOrdersNav;
