import React, { useState } from "react";
import { Link } from "@reach/router";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";

import StoreIcon from "@material-ui/icons/Store";
import ShopIcon from "@material-ui/icons/Shop";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import HistoryIcon from "@material-ui/icons/History";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const OrdersMenu = () => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ListItem
        className={classes.navItem}
        button
        onClick={handleOpen}
        aria-controls="orders"
        aria-haspopup="true"
      >
        <ListItemIcon className={classes.navItem}>
          <StoreIcon fontSize="large" className={classes.navIcon} />
        </ListItemIcon>
        <ListItemText
              primaryTypographyProps={{ className: classes.navText }}
              primary="Orders"
            />
      </ListItem>
      <Menu
        id="orders"
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose()}
      >
        <MenuItem
          component={Link}
          to="/order#pre"
          onClick={() => {
            handleClose();
          }}
        >
          <ListItemIcon>
            <ShopIcon fontSize="large" color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Place an Order" />
        </MenuItem>
        <Divider />
        <MenuItem
          component={Link}
          to="/coupons"
          onClick={() => {
            handleClose();
          }}
        >
          <ListItemIcon>
            <CardGiftcardIcon fontSize="large" color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Coupons" />
        </MenuItem>
        <Divider />
        <MenuItem
          component={Link}
          to="/orders#current"
          onClick={() => {
            handleClose();
          }}
        >
          <ListItemIcon>
            <TrackChangesIcon fontSize="large" color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Current Orders" />
        </MenuItem>
        <Divider />
        <MenuItem
          component={Link}
          to="/orders#past"
          onClick={() => {
            handleClose();
          }}
        >
          <ListItemIcon>
            <HistoryIcon fontSize="large" color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Past Orders" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default OrdersMenu;
