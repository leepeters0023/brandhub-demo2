import React, { useState, useRef, useImperativeHandle } from 'react'
import ArrowRight from '@material-ui/icons/ArrowRight'
import Menu from "@material-ui/core/Menu";
import { Link } from "@reach/router";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";

const NestedMenuItem = ({ anchorEl, label, childItems, classes, handleClose, ref, }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)
  const handleFocus = (event) => {setIsSubMenuOpen(true)}
  const handleMouseEnter = (event) => {setIsSubMenuOpen(true)}
  const handleMouseLeave = (event) => {setIsSubMenuOpen(false)}

  const open = isSubMenuOpen && anchorEl
  const menuItemRef = useRef(null)
  const menuContainerRef = useRef(null)
  useImperativeHandle(ref, () => menuItemRef.current)

  return (
    <div
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MenuItem
        ref={menuItemRef}
        className={classes.headerListItem}
      >
        {label}
        <ArrowRight />
      </MenuItem>
      <Menu
        classes={{ paper: classes.menuBackground }}
        style={{ pointerEvents: 'none' }}
        anchorEl={menuItemRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        open={open}
        autoFocus={false}
        disableAutoFocus
        disableEnforceFocus
        onClose={() => {
          setIsSubMenuOpen(false)
        }}
      >
        <div ref={menuContainerRef} style={{ pointerEvents: 'auto' }}>
          {childItems.map((item, i) => (
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