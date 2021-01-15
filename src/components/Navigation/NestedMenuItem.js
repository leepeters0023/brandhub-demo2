import React, { useState } from 'react'
import ArrowRight from '@material-ui/icons/ArrowRight'
import Menu from "@material-ui/core/Menu";
import { Link } from "@reach/router";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";

const NestedMenuItem = ({ anchorEl, label, childItems, classes, handleClose}) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)
  const [subAnchorEl, setSubAnchorEl] = useState(null);
  const handleFocus = (evt) => {
    setIsSubMenuOpen(true);
    setSubAnchorEl(evt.target);
  }
  const handleMouseEnter = (evt) => {
    setIsSubMenuOpen(true);
    setSubAnchorEl(evt.target);
  }
  const handleMouseLeave = () => { setIsSubMenuOpen(false) }

  const open = isSubMenuOpen && anchorEl
  //const menuItemRef = useRef(null)
  
  return (
    <div
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MenuItem
        style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", }}
        className={classes.headerListItem}
      >
        {label}
        <ArrowRight />
      </MenuItem>
      <Menu
        classes={{ paper: classes.menuBackground }}
        style={{ pointerEvents: 'none' }}
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
              onClick={handleClose}
              component={Link}
              to={item.link}
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