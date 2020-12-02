import React, { useState } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

const AddToPOMenu = ({
  classes,
  draftPOs,
  isLoading,
  itemSelected,
  handleAddToPO,
}) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        className={classes.largeButton}
        variant="contained"
        color="secondary"
        aria-controls="draft-purchase-orders"
        aria-haspopup="true"
        disabled={true/*isLoading || !itemSelected || draftPOs.length === 0*/}
        style={{ marginRight: "20px" }}
        onClick={handleClick}
      >
        ADD TO DRAFT PO
      </Button>
      {draftPOs.length > 0 && !isLoading && (
        <Menu
          id="draft-purchase-orders"
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          style={{ marginTop: "10px", width: "100%" }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {[
            ...new Set(draftPOs.map((po) => `${po.poNum} - ${po.supplier}`)),
          ].map((name, index) => {
            if (
              index !==
              [...new Set(draftPOs.map((po) => po.poNum))].length - 1
            ) {
              return [
                <MenuItem
                  key={index}
                  onClick={() => {
                    handleClose();
                    handleAddToPO(name.split(" - ")[0]);
                  }}
                >
                  <ListItemText primary={`PO #${name}`} />
                </MenuItem>,
                <Divider />,
              ];
            } else {
              return (
                <MenuItem
                  key={index}
                  onClick={() => {
                    handleClose();
                    handleAddToPO(name.split(" - ")[0]);
                  }}
                >
                  <ListItemText primary={`PO #${name}`} />
                </MenuItem>
              );
            }
          })}
        </Menu>
      )}
    </>
  );
};

AddToPOMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  draftPOs: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  itemSelected: PropTypes.bool.isRequired,
};

export default React.memo(AddToPOMenu);
