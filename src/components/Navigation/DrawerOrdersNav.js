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

import NestedMenuItem from "./NestedMenuItem.js";

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
        classes={{ paper: classes.menuBackground }}
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
          anchorEl={anchorEl}
          handleClose={handleClose}
          label="Draft Orders"
          classes={classes}
          childItems={[
            {
              link: onDemandOrderId ? `/orders/open/${onDemandOrderId}` : "/orders/open/onDemand", // how to set disabled={!onDemandOrderId} on this?
              primary: "On-Demand",
            },
            {
              link: inStockOrderId ? `/orders/open/${inStockOrderId}` : "/orders/open/inStock",
              primary: "In-Stock",
            },
          ]}
        />
        <Divider className={classes.divider} key="divider1" />
        {(role === "field2" || role === "super" || role === "read-only") && (
            <NestedMenuItem
              anchorEl={anchorEl}
              handleClose={handleClose}
              label="Order Review"
              classes={classes}
              childItems={[
                {
                  link: "/rollup",
                  primary: "Quarterly Rollup",
                },
                {
                  link: "/orders/approvals",
                  primary: "On Demand / Inventory Order",
                },
              ]}
            />
        )}
        {(role === "purchaser" || role === "super") && (
          <div>
            <Divider className={classes.divider} key="divider2" />
            <NestedMenuItem
              anchorEl={anchorEl}
              handleClose={handleClose}
              label="Purchase Orders"
              classes={classes}
              childItems={[
                {
                  link: "/purchasing/poHistory/current",
                  primary: "Current",
                },
                {
                  link: "/purchasing/poHistory/all",
                  primary: "History",
                },
              ]}
            />
            <Divider className={classes.divider} key="divider3" />
            <NestedMenuItem
              anchorEl={anchorEl}
              handleClose={handleClose}
              label="Request for Quotes"
              classes={classes}
              childItems={[
                {
                  link: "/purchasing/rfqHistory/current",
                  primary: "Current",
                },
                {
                  link: "/purchasing/rfqHistory/all",
                  primary: "History",
                },
              ]}
            />
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
