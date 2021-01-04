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
                <ListItemText primaryTypographyProps={{ className: classes.headerListItemNew}} primary="+ Quarterly Pre-Order" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/orders/items/onDemand"
              >
                <ListItemText primaryTypographyProps={{ className: classes.headerListItemNew }} primary="+ New On-Demand Order" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/orders/items/inStock"
              >
                <ListItemText primaryTypographyProps={{ className: classes.headerListItemNew }} primary="+ New Inventory Order" />
              </ListItem>
              {role !== "field1" && (
                <ListItem
                  button
                  onClick={() => {
                    handleDrawerClose()
                    handleCouponModal()
                  }}
                >
                  <ListItemText primaryTypographyProps={{ className: classes.headerListItemNew }} 
                    primary="+ New Coupon"
                  />
                </ListItem>
              )}
            </List>
          </Grid>
          <Grid item sm={role === "super" ? 2 : 3} xs={12}>
            <List className={classes.navList}>
              <ListItem>
                <ListItemText
                  primaryTypographyProps={{ className: classes.navHeaderText }}
                  primary="Draft Orders:"
                />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                disabled={!onDemandOrderId}
                to={
                  onDemandOrderId
                    ? `/orders/open/${onDemandOrderId}`
                    : "/orders/open/onDemand"
                }
              >
                <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="On-Demand" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                disabled={!inStockOrderId}
                to={
                  inStockOrderId
                    ? `/orders/open/${inStockOrderId}`
                    : "/orders/open/inStock"
                }
              >
                <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="In-Stock" />
              </ListItem>
            </List>
          </Grid>
          {(role === "field2" || role === "super") && (
            <Grid item sm={role === "super" ? 2 : 3} xs={12}>
              <List className={classes.navList}>
                <ListItem>
                  <ListItemText
                    primaryTypographyProps={{ className: classes.navHeaderText }}
                    primary="Order Review:"
                  />
                </ListItem>
                <ListItem
                  button
                  onClick={handleDrawerClose}
                  component={Link}
                  to="/rollup"
                >
                  <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Quarterly Rollup" />
                </ListItem>
                <ListItem
                  button
                  onClick={handleDrawerClose}
                  component={Link}
                  to="/orders/approvals"
                >
                  <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="On Demand / Inventory Order" />
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
                  primaryTypographyProps={{ className: classes.navHeaderText }}
                  primary="Purchase Orders:"
                />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/poRollup"
              >
                <ListItemText primaryTypographyProps={{ className: classes.headerListItemNew }}primary="+ New Purchase Order" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/poHistory/current"
              >
                <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Current" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/poHistory/all"
              >
                <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="History" />
              </ListItem>
            </List>
          </Grid>
          <Grid item sm={role === "super" ? 2 : 3} xs={12}>
            <List className={classes.navList}>
              <ListItem>
                <ListItemText
                  primaryTypographyProps={{ className: classes.navHeaderText }}
                  primary="Request for Quotes:"
                />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/rfqRollup"
              >
                <ListItemText primaryTypographyProps={{ className: classes.headerListItemNew }}primary="+ New RFQ" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/rfqHistory/current"
              >
                <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Current" />
              </ListItem>
              <ListItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/rfqHistory/all"
              >
                <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="History" />
              </ListItem>
            </List>
          </Grid>
          </>
          )}
          {role === "field1" && <Grid item sm={3} xs={12} />}
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
