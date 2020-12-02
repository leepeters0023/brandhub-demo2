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
  handleCouponModal,
}) => {
  return (
    <>
      {role !== "compliance" && (
        <Grid container spacing={1} justify="space-around">
          <Grid item sm={role === "super" ? 2 : 3} xs={12}>
            <List className={classes.navList}>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/orders/open/preorder"
              >
                <ListItemText primary="+ Quarterly Pre-Order" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/orders/items/onDemand"
              >
                <ListItemText primary="+ New On-Demand Order" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/orders/items/inStock"
              >
                <ListItemText primary="+ New Inventory Order" />
              </ListItem>
              {role !== "field1" && (
                <ListItem
                  button
                  onClick={() => {
                    handleDrawerClose()
                    handleCouponModal()
                  }}
                >
                  <ListItemText
                    primary="+ New Coupon"
                  />
                </ListItem>
              )}
            </List>
          </Grid>
          {role === "field1" && <Grid item sm={1} xs={12} />}
          <Grid item sm={role === "super" ? 2 : 3} xs={12}>
            <List className={classes.navList}>
              <ListItem>
                <ListItemText
                  primaryTypographyProps={{ className: classes.headerText }}
                  primary="Draft Orders:"
                />
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
            </List>
          </Grid>
          {(role === "field2" || role === "super") && (
            <Grid item sm={role === "super" ? 2 : 3} xs={12}>
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
                  <ListItemText primary="On Demand / Inventory Order" />
                </ListItem>
              </List>
            </Grid>
          )}
          {(role === "purchaser"  || role === "super") && (
            <>
            <Grid item sm={role === "super" ? 2 : 3} xs={12}>
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
                <ListItemText primary="+ New Purchase Order" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/poHistory/current"
              >
                <ListItemText primary="Current" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/poHistory/all"
              >
                <ListItemText primary="History" />
              </ListItem>
            </List>
          </Grid>
          <Grid item sm={role === "super" ? 2 : 3} xs={12}>
            <List className={classes.navList}>
              <ListItem>
                <ListItemText
                  primaryTypographyProps={{ className: classes.headerText }}
                  primary="Request for Quotes:"
                />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/rfqRollup"
              >
                <ListItemText primary="+ New RFQ" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/rfqHistory/current"
              >
                <ListItemText primary="Current" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/rfqHistory/all"
              >
                <ListItemText primary="History" />
              </ListItem>
            </List>
          </Grid>
          </>
          )}
        </Grid>
      )}
    </>
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
