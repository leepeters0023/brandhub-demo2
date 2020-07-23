import React, { useState } from "react";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import MoreVertIcon from "@material-ui/icons/MoreVert";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const ItemOptions = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Options">
        <IconButton
          style={{padding: 0}}
          aria-owns={anchorEl ? "options-menu" : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <div style={{ display: "flex" }}>
            <PictureAsPdfIcon />
            <Typography color="textPrimary" variant="body2">
              Add to PDF
            </Typography>
          </div>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <div style={{ display: "flex" }}>
            <DeleteForeverIcon />
            <Typography color="textPrimary" variant="body2">
              Remove
            </Typography>
          </div>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ItemOptions;
