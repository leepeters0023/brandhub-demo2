import React, { useState } from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import Box from "@material-ui/core/Box"
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import NestedMenuItem from "material-ui-nested-menu-item";

const DrawerReportsNav = ({ classes, currentUserRole }) => {
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
          Reports
        </Typography>
        <ExpandMoreIcon fontSize="large" className={classes.expandMoreIcon} />
      </IconButton>
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
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <>
          {(currentUserRole !== "finance" || currentUserRole !== "compliance") && (
            <>
              <NestedMenuItem
                className={classes.headerListItem}
                parentMenuOpen={anchorEl}
                onClick={handleClose}
                label="History"
              >
                <MenuItem
                  button
                  onClick={handleClose}
                  component={Link}
                  to="/orders/history/group/byOrder"
                >
                  <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="By Order" />
                </MenuItem>
                <MenuItem
                  button
                  onClick={handleClose}
                  component={Link}
                  to="/orders/history/group/byItem"
                >
                  <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="By Item" />
                </MenuItem>
              </NestedMenuItem>
              <Divider className={classes.divider} key="divider2" />
            </>
          )}
          <NestedMenuItem
            className={classes.headerListItem}
            parentMenuOpen={anchorEl}
            onClick={handleClose}
            label="Reporting"
          >
            <MenuItem
              button
              onClick={handleClose}
              component={Link}
              to="/reports/wrap-up"
            >
              <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Wrap Up" />
            </MenuItem>
            <MenuItem button onClick={handleClose} component={Link} to="">
              <Box fontStyle="italic">
                <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="*TBD" />
              </Box>
            </MenuItem>
          </NestedMenuItem>
          {currentUserRole !== "compliance" && (
            <>
              <Divider className={classes.divider} key="divider2" />
              <NestedMenuItem
                className={classes.headerListItem}
                parentMenuOpen={anchorEl}
                onClick={handleClose}
                label="Budgets"
              >
                <MenuItem
                  button
                  onClick={handleClose}
                  component={Link}
                  to="/budgets/ytod"
                >
                  <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Budget vs Spend" />
                </MenuItem>
                <MenuItem
                  button
                  onClick={handleClose}
                  component={Link}
                  to=""
                >
                  <Box fontStyle="italic">
                    <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="*TBD" />
                  </Box>
                </MenuItem>
              </NestedMenuItem>
            </>
          )}
          {/* {currentUserRole === "field1" && <Grid item sm={3} xs={12} />} */}
        </>
      </Menu>
    </>
  );
};

DrawerReportsNav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default DrawerReportsNav;
