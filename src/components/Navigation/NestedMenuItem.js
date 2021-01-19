import React, { useState } from 'react'
import ArrowRight from '@material-ui/icons/ArrowRight'
import Menu from "@material-ui/core/Menu";
import { Link } from "@reach/router";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";

const NestedMenuItem = ({ anchorEl, label, childItems, classes, handleClose }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)
  const [subAnchorEl, setSubAnchorEl] = useState(null);
 
  const handleMouseEnter = (evt) => {
    setIsSubMenuOpen(true);
    setSubAnchorEl(evt.target);
  }
  const handleMouseLeave = () => { 
    setIsSubMenuOpen(false); 
  }
 
  const open = isSubMenuOpen && anchorEl
  
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{paddingTop: "10px", paddingBottom: "10px"}}
    >
      <MenuItem
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", }}
        className={classes.headerListItem}
      >
        {label}
        <ArrowRight />
      </MenuItem>
      <Menu
        classes={{ paper: classes.menuBackground }}
        transitionDuration={{enter : 500, exit: 0 }}
        // Set pointer events to 'none' to prevent the invisible Popover div
        // from capturing events for clicks and hovers
        style={{ pointerEvents: 'none', zIndex: "3001" }}
        anchorEl={subAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        open={Boolean(open)}
        autoFocus={false}
        disableAutoFocus
        disableEnforceFocus
        onClose={() => {
          setIsSubMenuOpen(false)
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          {childItems.filter(item => item.link && item.primary).map((item, i) => (
            <MenuItem
              key={i}
              button
              component={Link}
              onClick={handleClose}
              to={item.link}
              disabled={item.disabled}
            >
              <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary={item.primary} />
            </MenuItem>
          ))}
        </div>
      </Menu>
    </div>
  )
}

NestedMenuItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default NestedMenuItem