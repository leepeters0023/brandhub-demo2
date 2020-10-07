import React from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
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
        <List className={classes.navList}>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ className: classes.headerText }}
              primary="Place an Order:"
            />
          </ListItem>
          {role === "field1" && (
            <ListItem
              button
              onClick={handleDrawerClose}
              component={Link}
              to="/orders/open/preorder"
            >
              <ListItemText primary="Quarterly Pre-Order" />
            </ListItem>
          )}
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/orders/items/inStock"
          >
            <ListItemText primary="In-Stock Order" />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/orders/items/onDemand"
          >
            <ListItemText primary="On-Demand Order" />
          </ListItem>
          {role !== "field1" && (
            <ListItem
              button
              onClick={handleDrawerClose}
              component={Link}
              to="/coupons"
            >
              <ListItemText
                primaryTypographyProps={{ style: { fontStyle: "italic" } }}
                primary="* Create Coupons"
              />
            </ListItem>
          )}
        </List>
      </Grid>
      {role === "field1" && <Grid item sm={1} xs={12} />}
      <Grid item sm={role === "field1" ? 4 : 3} xs={12}>
        <List className={classes.navList}>
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
      <Grid item sm={role === "field1" ? 4 : 3} xs={12}>
        <List className={classes.navList}>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{ className: classes.headerText }}
              primary="Order History:"
            />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/orders/history"
          >
            <ListItemText primary="By Order" />
          </ListItem>
          <ListItem
            button
            onClick={handleDrawerClose}
            component={Link}
            to="/orders/history"
          >
            <ListItemText
              primary="* By Item"
              primaryTypographyProps={{ style: { fontStyle: "italic" } }}
            />
          </ListItem>
        </List>
      </Grid>
      {role !== "field1" && (
        <Grid item sm={3} xs={12}>
          <List className={classes.navList}>
            <ListItem>
              <ListItemText
                primaryTypographyProps={{ className: classes.headerText }}
                primary="Order Review:"
              />
            </ListItem>
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
          </List>
        </Grid>
      )}
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
