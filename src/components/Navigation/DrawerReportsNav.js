import React, { useState } from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import NestedMenuItem from "./NestedMenuItem.js";

const DrawerReportsNav = ({ classes, role }) => {
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
        style={{ padding: 0 }}
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
        classes={{ paper: classes.menuBackground }}
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
          marginTop: "10px",
          zIndex: "3000",
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div />
        <MenuItem
          button
          onClick={handleClose}
          component={Link}
          to="project-status"
        >
          <ListItemText
            primaryTypographyProps={{
              className: classes.headerListItemNew,
            }}
            primary="Project Status"
          />
        </MenuItem>
        <MenuItem
          button
          onClick={handleClose}
          component={Link}
          to="field-intelligence"
        >
          <ListItemText
            primaryTypographyProps={{
              className: classes.headerListItemNew,
            }}
            primary="Field Intelligence"
          />
        </MenuItem>
        <Divider className={classes.divider} />
        {(role !== "finance" || role !== "compliance") && (
          <NestedMenuItem
            anchorEl={anchorEl}
            handleClose={handleClose}
            label="Order History"
            classes={classes}
            childItems={[
              {
                link: "/orders/history/group/byOrder",
                primary: "By Order",
              },
              {
                link: "/orders/history/group/byItem",
                primary: "By Item",
              },
            ]}
          />
        )}
        {/* {role !== "read-only" && (
          <div>
            <Divider className={classes.divider} key="divider1" />
            <NestedMenuItem
              anchorEl={anchorEl}
              handleClose={handleClose}
              label="Reporting"
              classes={classes}
              childItems={[
                {
                  link: "/reports/wrap-up",
                  primary: "Wrap Up",
                },
                {
                  link: "/reports/order-history-detail",
                  primary: "Order History Detail",
                },
                {
                  link: "/reports/focus-summary",
                  primary: "Focus Summary",
                  disabled: role === "field1" || role === "field2"
                }
              ]}
            />
          </div>
        )} */}
        {role !== "compliance" && (
          <div>
            <Divider className={classes.divider} key="divider2" />
            <NestedMenuItem
              anchorEl={anchorEl}
              handleClose={handleClose}
              label="Budgets"
              classes={classes}
              childItems={[
                {
                  link: "/budgets/ytod",
                  primary: "Budget vs Spend",
                  disabled: true,
                },
              ]}
            />
          </div>
        )}
        <div>
          <Divider className={classes.divider} key="divider3" />
          <NestedMenuItem
            anchorEl={anchorEl}
            handleClose={handleClose}
            label="Calendars"
            classes={classes}
            childItems={[
              {
                link: "/calendar",
                primary: "2020 Calendar",
              },
            ]}
          />
        </div>
      </Menu>
    </>
  );
};

DrawerReportsNav.propTypes = {
  classes: PropTypes.object.isRequired,
  role: PropTypes.string.isRequired,
};

export default DrawerReportsNav;
