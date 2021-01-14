import React, { useState } from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import NestedMenuItem from "material-ui-nested-menu-item";

const DrawerOrdersNav = ({
  handleDrawerClose,
  inStockOrderId,
  onDemandOrderId,
  role,
  handleCouponModal,
  classes,
}) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={(evt) => {
          handleOpen(evt);
        }}
      >
        <Typography variant="h5" className={classes.navigationText}>
          Order
        </Typography>
        <ExpandMoreIcon fontSize="large" className={classes.expandMoreIcon} />
      </IconButton>
      {role !== "compliance" && (
        <Menu
          disableScrollLock
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          style={{
            marginTop: "10px"
            //TODO remove padding from MuiList-root MuiMenu-list MuiList-padding
          }}
          classes={{ root: 'menuBackground' }} // this sometimes works
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <>
            {role !== "read-only" && (
              <MenuItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/orders/open/preorder"
              >
                <ListItemText
                  primaryTypographyProps={{
                    className: classes.headerListItemNew,
                  }}
                  primary="+ Quarterly Pre-Order"
                />
              </MenuItem>
            )}
            <MenuItem
              button
              onClick={handleDrawerClose}
              component={Link}
              to="/orders/items/onDemand"
            >
              <ListItemText
                primaryTypographyProps={{
                  className: classes.headerListItemNew,
                }}
                primary="+ New On-Demand Order"
              />
            </MenuItem>
            <MenuItem
              button
              onClick={handleDrawerClose}
              component={Link}
              to="/orders/items/inStock"
            >
              <ListItemText
                primaryTypographyProps={{
                  className: classes.headerListItemNew,
                }}
                primary="+ New Inventory Order"
              />
            </MenuItem>
            {role !== "field1" && role !== "read-only" && (
              <MenuItem
                button
                onClick={() => {
                  handleDrawerClose();
                  handleCouponModal();
                }}
              >
                <ListItemText
                  primaryTypographyProps={{
                    className: classes.headerListItemNew,
                  }}
                  primary="+ New Coupon"
                />
              </MenuItem>
            )}
            <ListItemText
              primaryTypographyProps={{ className: classes.headerText }}
              primary="Draft Orders:"
            />
            <Divider key="divider1" />
            <MenuItem
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
              <ListItemText
                primaryTypographyProps={{ className: classes.headerListItem }}
                primary="On-Demand"
              />
            </MenuItem>
            <MenuItem
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
              <ListItemText
                primaryTypographyProps={{ className: classes.headerListItem }}
                primary="In-Stock"
              />
            </MenuItem>
          </>
          {(role === "field2" || role === "super" || role === "read-only") && (
            <>
              <ListItemText
                primaryTypographyProps={{
                  className: classes.headerText,
                }}
                primary="Order Review:"
              />
              <Divider key="divider2" />
              <MenuItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/rollup"
              >
                <ListItemText
                  primaryTypographyProps={{
                    className: classes.headerListItem,
                  }}
                  primary="Quarterly Rollup"
                />
              </MenuItem>
              <MenuItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/orders/approvals"
              >
                <ListItemText
                  primaryTypographyProps={{
                    className: classes.headerListItem,
                  }}
                  primary="On Demand / Inventory Order"
                />
              </MenuItem>
            </>
          )}
          {(role === "purchaser" || role === "super") && (
            <>
              <ListItemText
                primaryTypographyProps={{
                  className: classes.headerText,
                }}
                primary="Purchase Orders:"
              />
              <Divider key="divider2" />
              <MenuItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/poRollup"
              >
                <ListItemText
                  primaryTypographyProps={{
                    className: classes.headerListItemNew,
                  }}
                  primary="+ New Purchase Order"
                />
              </MenuItem>
              <MenuItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/poHistory/current"
              >
                <ListItemText
                  primaryTypographyProps={{
                    className: classes.headerListItem,
                  }}
                  primary="Current"
                />
              </MenuItem>
              <MenuItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/poHistory/all"
              >
                <ListItemText
                  primaryTypographyProps={{
                    className: classes.headerListItem,
                  }}
                  primary="History"
                />
              </MenuItem>
              <ListItemText
                primaryTypographyProps={{
                  className: classes.headerText,
                }}
                primary="Request for Quotes:"
              />
              <Divider key="divider3" />
              <MenuItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/rfqRollup"
              >
                <ListItemText
                  primaryTypographyProps={{
                    className: classes.headerListItemNew,
                  }}
                  primary="+ New RFQ"
                />
              </MenuItem>
              <MenuItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/rfqHistory/current"
              >
                <ListItemText
                  primaryTypographyProps={{
                    className: classes.headerListItem,
                  }}
                  primary="Current"
                />
              </MenuItem>
              <MenuItem
                button
                onClick={handleDrawerClose}
                component={Link}
                to="/purchasing/rfqHistory/all"
              >
                <ListItemText
                  primaryTypographyProps={{
                    className: classes.headerListItem,
                  }}
                  primary="History"
                />
              </MenuItem>

            </>
          )}
          {/* {role === "field1" && <Grid item sm={3} xs={12} />} */}
          {/* unsure of line 370's purpose */}
        </Menu>
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
