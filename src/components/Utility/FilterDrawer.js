import React from "react";
import PropTypes from "prop-types";

import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  drawer: {
    width: "300px",
    flexShrink: 0,
  },
  drawerPaper: {
    width: "300px",
  },
}));

const FilterDrawer = ({ open, handleDrawerClose }) => {
  const classes = useStyles();
  return (
    <>
      
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      ></Drawer>
    </>
  );
};

FilterDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDrawerClose: PropTypes.func.isRequired,
};

export default FilterDrawer;
