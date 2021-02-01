import React, { useState } from "react";
import PropTypes from "prop-types";

import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";
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
        {role !== "read-only" && (
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
              ]}
            />
          </div>
        )}
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
      </Menu>
    </>
  );
};

DrawerReportsNav.propTypes = {
  classes: PropTypes.object.isRequired,
  role: PropTypes.string.isRequired,
};

export default DrawerReportsNav;
