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
  inStockOrderId,
  onDemandOrderId,
  role,
  handleCouponModal,
  classes,
}) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
    evt.stopPropagation();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={(evt) => {
          handleOpen(evt);
          evt.stopPropagation();
        }}
      >
        <Typography variant="h5" className={classes.navigationText}>
          Order
        </Typography>
        <ExpandMoreIcon fontSize="large" className={classes.expandMoreIcon} />
      </IconButton>
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
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {role !== "read-only" && (
          <MenuItem
            button
            onClick={handleClose}
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
          onClick={handleClose}
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
          onClick={handleClose}
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
        {(role === "purchaser" || role === "super") && (
          <div>
            <MenuItem
              button
              onClick={handleClose}
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
              onClick={handleClose}
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
          </div>
        )}
        {role !== "field1" && role !== "read-only" && (
          <MenuItem
            button
            onClick={() => {
              handleClose();
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
        <Divider className={classes.divider} />
        <NestedMenuItem
          className={classes.headerListItem}
          parentMenuOpen={Boolean(anchorEl)}
          onClick={handleClose}
          label="Draft Orders"
        >
          <MenuItem
            button
            onClick={handleClose}
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
            onClick={handleClose}
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
        </NestedMenuItem>
        <Divider className={classes.divider} key="divider1" />
        {(role === "field2" || role === "super" || role === "read-only") && (
          <div>
            <NestedMenuItem
              className={classes.headerListItem}
              parentMenuOpen={Boolean(anchorEl)}
              onClick={handleClose}
              label="Order Review"
            >
              <MenuItem
                button
                onClick={handleClose}
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
                onClick={handleClose}
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
            </NestedMenuItem>
          </div>
        )}
        {(role === "purchaser" || role === "super") && (
          <div>
            <Divider className={classes.divider} key="divider2" />
            <NestedMenuItem
              className={classes.headerListItem}
              parentMenuOpen={Boolean(anchorEl)}
              onClick={handleClose}
              label="Purchase Orders"
            >
              <MenuItem
                button
                onClick={handleClose}
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
                onClick={handleClose}
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
            </NestedMenuItem>
            <Divider className={classes.divider} key="divider3" />
            <NestedMenuItem
              className={classes.headerListItem}
              parentMenuOpen={Boolean(anchorEl)}
              onClick={handleClose}
              label="Request for Quotes"
            >
              <MenuItem
                button
                onClick={handleClose}
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
              <Divider className={classes.divider} key="divider4" />
              <MenuItem
                button
                onClick={handleClose}
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
            </NestedMenuItem>
          </div>
        )}
      </Menu>
    </>
  );
};

DrawerOrdersNav.propTypes = {
  classes: PropTypes.object.isRequired,
  inStockOrderId: PropTypes.string,
  onDemandOrderId: PropTypes.string,
  role: PropTypes.string.isRequired,
};

export default DrawerOrdersNav;
