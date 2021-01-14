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
      {role !== "compliance" && ( //handle this at higher level component?
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
          classes={{ root: 'menuBackground' }} // this sometimes works
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <>
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
          <Divider className={classes.divider} />
          <NestedMenuItem
            className={classes.headerListItem}
            parentMenuOpen={anchorEl}
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
            <>
              <NestedMenuItem
                className={classes.headerListItem}
                parentMenuOpen={anchorEl}
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
            </>
          )}
          {(role === "purchaser" || role === "super") && (
            <>
              <Divider className={classes.divider} key="divider2" />
              <NestedMenuItem
                className={classes.headerText}
                parentMenuOpen={anchorEl}
                onClick={handleClose}
                label="Purchase Orders"
              >
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
                className={classes.headerText}
                parentMenuOpen={anchorEl}
                onClick={handleClose}
                label="Request for Quotes"
              >

              </NestedMenuItem>
              <Divider key="divider3" />
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

            </>
          )}
          {/* {role === "field1" && <Grid item sm={3} xs={12} />} */}
          {/* unsure of line 370's purpose */}
          </>
        </Menu>
      )}
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
