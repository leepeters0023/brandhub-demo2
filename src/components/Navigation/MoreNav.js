import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import Menu from "@material-ui/core/Menu";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
//import { makeStyles } from "@material-ui/core/styles";

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

// const useStyles = makeStyles((theme) => ({
//   ...theme.global,
//   nested: {
//     paddingLeft: theme.spacing(4),
//   },
// }));

const MoreNav = ({ setSelected, selected }) => {
  //const classes = useStyles();

  const [anchorEl, setAnchorEl] = useCallback(useState(null));

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="More">
        <IconButton
          aria-owns={anchorEl ? "more" : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
        >
          <MoreHorizIcon
            fontSize="large"
            color={selected === "more" ? "primary" : "inherit"}
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
        style={{ marginTop: "10px"}}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <List style={{ width: "200px" }}>
        <ListItem
            button
            onClick={()=>{
              setSelected("more")
              handleClose()
            }}
            component={Link}
            to="/reports"
          >
            <ListItemText primary="Reports" />
          </ListItem>
          <ListItem
            button
            onClick={()=>{
              setSelected("more")
              handleClose()
            }}
            // component={Link}
            // to="/compliance"
          >
            <ListItemText primary="Compliance" />
          </ListItem>
        </List>
      </Menu>
    </>
  )
}

MoreNav.propTypes = {
  setSelected: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
};

export default MoreNav;