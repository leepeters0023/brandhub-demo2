import React, { useState } from "react";
import { Link } from "@reach/router";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";

import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import GavelIcon from '@material-ui/icons/Gavel';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import CategoryIcon from '@material-ui/icons/Category';

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const ComplianceMenu = () => {
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
          <AssignmentTurnedInIcon fontSize="large" color="secondary" />
        </ListItemIcon>
        <ListItemText
              primaryTypographyProps={{ className: classes.navText }}
              primary="Compliance"
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
          to="/approval#prior"
          onClick={() => {
            handleClose();
          }}
        >
          <ListItemIcon>
            <PlaylistAddCheckIcon fontSize="large" color="primary" />
          </ListItemIcon>
          <ListItemText primary="Approvals" />
        </MenuItem>
        <Divider />
        <MenuItem
          component={Link}
          to="/rules"
          onClick={() => {
            handleClose();
          }}
        >
          <ListItemIcon>
            <GavelIcon fontSize="large" color="primary" />
          </ListItemIcon>
          <ListItemText primary="State Rules" />
        </MenuItem>
        <Divider />
        <MenuItem
          component={Link}
          to="/compliance-contacts"
          onClick={() => {
            handleClose();
          }}
        >
          <ListItemIcon>
            <ContactMailIcon fontSize="large" color="primary" />
          </ListItemIcon>
          <ListItemText primary="Contacts" />
        </MenuItem>
        <Divider />
        <MenuItem
          component={Link}
          to="/classifications"
          onClick={() => {
            handleClose();
          }}
        >
          <ListItemIcon>
            <CategoryIcon fontSize="large" color="primary" />
          </ListItemIcon>
          <ListItemText primary="POS Classifications" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default ComplianceMenu;