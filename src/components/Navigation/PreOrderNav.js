import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import Menu from "@material-ui/core/Menu";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

import DashboardIcon from "@material-ui/icons/Dashboard";

const PreOrderNav = ({ setSelected, selected }) => {
  const [anchorEl, setAnchorEl] = useCallback(useState(null));

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Pre-Order">
        <IconButton
          aria-owns={anchorEl ? "pre-order" : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
        >
          <DashboardIcon
            fontSize="large"
            color={selected === "preOrder" ? "primary" : "inherit"}
          />
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
        style={{ marginTop: "10px" }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <List style={{width: "200px"}}>
          <ListItem
            button
            onClick={()=>{
              setSelected("preOrder")
              handleClose()
            }}
            component={Link}
            to="/programs"
          >
            <ListItemText primary="Pre-Order Programs" />
          </ListItem>
          <ListItem
            button
            onClick={()=>{
              setSelected("preOrder")
              handleClose()
            }}
            component={Link}
            to="/orders/open/preorder"
          >
            <ListItemText primary="Place Pre-Order" />
          </ListItem>
        </List>
      </Menu>
    </>
  );
};

PreOrderNav.propTypes = {
  setSelected: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
};

export default PreOrderNav;
