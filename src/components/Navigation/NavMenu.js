import React, { useState } from "react";
import { Link } from "@reach/router";

import Menu from "@material-ui/core/Menu";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import { makeStyles } from "@material-ui/core/styles";

import MenuIcon from "@material-ui/icons/Menu";
import DashboardIcon from "@material-ui/icons/Dashboard";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import HelpIcon from "@material-ui/icons/Help";
import StoreIcon from "@material-ui/icons/Store";
import ShopIcon from "@material-ui/icons/Shop";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import HistoryIcon from "@material-ui/icons/History";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import GavelIcon from "@material-ui/icons/Gavel";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import CategoryIcon from "@material-ui/icons/Category";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const NavMenu = ({ userType }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [complianceOpen, setComplianceOpen] = useState(false);

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOrders = () => {
    setOrdersOpen(!ordersOpen);
  };

  const handleCompliance = () => {
    setComplianceOpen(!complianceOpen);
  };

  return (
    <>
      <Tooltip title="Navigation">
        <IconButton
          aria-owns={anchorEl ? "navigation" : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
        >
          <MenuIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      <Menu
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <List style={{ width: "250px" }}>
          <div>
            <ListItem button onClick={handleClose} component={Link} to="/">
              <ListItemIcon>
                <DashboardIcon fontSize="large" color="secondary" />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            {userType === "super" && (
              <>
                <ListItem button onClick={handleOrders}>
                  <ListItemIcon>
                    <StoreIcon fontSize="large" />
                  </ListItemIcon>
                  <ListItemText primary="Orders" />
                  {ordersOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={ordersOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem
                      button
                      onClick={handleClose}
                      component={Link}
                      to="/order#pre"
                      className={classes.nested}
                    >
                      <ListItemIcon>
                        <ShopIcon fontSize="large" color="secondary" />
                      </ListItemIcon>
                      <ListItemText primary="Place an Order" />
                    </ListItem>
                    <ListItem
                      button
                      onClick={handleClose}
                      component={Link}
                      to="/orders/open"
                      className={classes.nested}
                    >
                      <ListItemIcon>
                        <TrackChangesIcon fontSize="large" color="secondary" />
                      </ListItemIcon>
                      <ListItemText primary="Open Orders" />
                    </ListItem>
                    <ListItem
                      button
                      onClick={handleClose}
                      component={Link}
                      to="/orders/past#byorder"
                      className={classes.nested}
                    >
                      <ListItemIcon>
                        <HistoryIcon fontSize="large" color="secondary" />
                      </ListItemIcon>
                      <ListItemText primary="Order History" />
                    </ListItem>
                  </List>
                </Collapse>
                <ListItem
                  button
                  onClick={handleClose}
                  component={Link}
                  to="/coupons"
                >
                  <ListItemIcon>
                    <CardGiftcardIcon fontSize="large" color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="Coupons" />
                </ListItem>
                <ListItem button onClick={handleCompliance}>
                  <ListItemIcon>
                    <AssignmentTurnedInIcon fontSize="large" />
                  </ListItemIcon>
                  <ListItemText primary="Compliance" />
                  {complianceOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={complianceOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem
                      button
                      onClick={handleClose}
                      component={Link}
                      to="/approval#pending"
                      className={classes.nested}
                    >
                      <ListItemIcon>
                        <PlaylistAddCheckIcon
                          fontSize="large"
                          color="secondary"
                        />
                      </ListItemIcon>
                      <ListItemText primary="Approvals" />
                    </ListItem>
                    <ListItem
                      button
                      onClick={handleClose}
                      component={Link}
                      to="/rules"
                      className={classes.nested}
                    >
                      <ListItemIcon>
                        <GavelIcon fontSize="large" color="secondary" />
                      </ListItemIcon>
                      <ListItemText primary="State Rules" />
                    </ListItem>
                    <ListItem
                      button
                      onClick={handleClose}
                      component={Link}
                      to="/compliance-contacts"
                      className={classes.nested}
                    >
                      <ListItemIcon>
                        <ContactMailIcon fontSize="large" color="secondary" />
                      </ListItemIcon>
                      <ListItemText primary="Contacts" />
                    </ListItem>
                    <ListItem
                      button
                      onClick={handleClose}
                      component={Link}
                      to="/classifications"
                      className={classes.nested}
                    >
                      <ListItemIcon>
                        <CategoryIcon fontSize="large" color="secondary" />
                      </ListItemIcon>
                      <ListItemText primary="POS Classifications" />
                    </ListItem>
                  </List>
                </Collapse>
                <ListItem
                  button
                  onClick={handleClose}
                  component={Link}
                  to="/reports"
                >
                  <ListItemIcon>
                    <InsertChartIcon fontSize="large" color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="Reports" />
                </ListItem>
              </>
            )}
            {(userType === "field1" || userType === "field2") && (
              <>
                <ListItem
                  button
                  onClick={handleClose}
                  component={Link}
                  to="/order#pre"
                >
                  <ListItemIcon>
                    <ShopIcon fontSize="large" color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="Place an Order" />
                </ListItem>
                <ListItem
                  button
                  onClick={handleClose}
                  component={Link}
                  to="/orders/open"
                >
                  <ListItemIcon>
                    <TrackChangesIcon fontSize="large" color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="Open Orders" />
                </ListItem>
                <ListItem
                  button
                  onClick={handleClose}
                  component={Link}
                  to="/orders/past#byorder"
                >
                  <ListItemIcon>
                    <HistoryIcon fontSize="large" color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="Order History" />
                </ListItem>
                <ListItem
                  button
                  onClick={handleClose}
                  component={Link}
                  to="/coupons"
                >
                  <ListItemIcon>
                    <CardGiftcardIcon fontSize="large" color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="Coupons" />
                </ListItem>
              </>
            )}
            {userType === "compliance" && (
              <>
                <ListItem
                  button
                  onClick={handleClose}
                  component={Link}
                  to="/approval#pending"
                >
                  <ListItemIcon>
                    <PlaylistAddCheckIcon fontSize="large" color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="Approvals" />
                </ListItem>
                <ListItem
                  button
                  onClick={handleClose}
                  component={Link}
                  to="/rules"
                >
                  <ListItemIcon>
                    <GavelIcon fontSize="large" color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="State Rules" />
                </ListItem>
                <ListItem
                  button
                  onClick={handleClose}
                  component={Link}
                  to="/compliance-contacts"
                >
                  <ListItemIcon>
                    <ContactMailIcon fontSize="large" color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="Contacts" />
                </ListItem>
                <ListItem
                  button
                  onClick={handleClose}
                  component={Link}
                  to="/classifications"
                >
                  <ListItemIcon>
                    <CategoryIcon fontSize="large" color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="POS Classifications" />
                </ListItem>
              </>
            )}
          </div>
          <div>
            <ListItem button onClick={handleClose} component={Link} to="/help">
              <ListItemIcon>
                <HelpIcon fontSize="large" color="secondary" />
              </ListItemIcon>
              <ListItemText primary="Help" />
            </ListItem>
          </div>
        </List>
      </Menu>
    </>
  );
};

export default NavMenu;
