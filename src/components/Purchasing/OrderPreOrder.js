import React, { useState, useCallback } from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import AddItemConfirmation from "./AddItemConfirmation";

import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/programTableSlice";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

import AddBoxIcon from "@material-ui/icons/AddBox";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import CancelIcon from "@material-ui/icons/Cancel";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  itemGridContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "20px",
    width: "100%",
  },
  programImg: {
    width: "125px",
    height: "125px",
    borderRadius: "50%",
    objectFit: "cover",
    filter: "sepia(100%)",
    transition: "all .5s ease",
    "&:hover": {
      cursor: "pointer",
      filter: "sepia(0%)",
    },
  },
  singleItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
    height: "325px",
    marginBottom: "40px",
    padding: "10px",
    backgroundColor: "whitesmoke",
  },
  itemControl: {
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
  },
}));

const OrderPreOrder = ({ currentPrograms }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [currentOrder, setCurrentOrder] = useCallback(useState({}));
  const [confirmOpen, setConfirmOpen] = useCallback(useState(false));
  const [confirmAllOpen, setConfirmAllOpen] = useCallback(useState(false));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setConfirmAllOpen(false);
  };

  const handleAddAllPrograms = () => {
    currentPrograms.forEach((prog) => {
      dispatch(addItems({ program: prog.id, items: prog.items }));
    });
  };

  const handleAddAllProgram = (id) => {
    const activeProgram = currentPrograms.find((program) => program.id === id);
    setCurrentOrder({ program: id, items: activeProgram.items });
    setConfirmOpen(true);
  };

  return (
    <>
      <div className={classes.relativeContainer}>
        <Dialog
          open={confirmAllOpen}
          onClose={handleConfirmClose}
          fullWidth
          maxWidth="sm"
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DialogContent>
            <IconButton
              className={classes.closeButton}
              onClick={handleConfirmClose}
            >
              <CancelIcon fontSize="large" color="secondary" />
            </IconButton>
            <br />
            <br />
            <Typography className={classes.headerText}>
              Items successfully added to your order
            </Typography>
            <br />
            <br />
          </DialogContent>
        </Dialog>
      </div>
      {currentOrder.program && (
        <AddItemConfirmation
          itemArray={currentOrder.items}
          program={currentOrder.program}
          confirmOpen={confirmOpen}
          handleConfirmClose={handleConfirmClose}
        />
      )}
      <Container style={{ textAlign: "center", maxWidth: "2000px" }}>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography className={classes.titleText}>
            Current Programs
          </Typography>
          <Tooltip title="Program Options">
            <IconButton
            aria-owns={anchorEl ? "program-options" : undefined}
            aria-haspopup="true"
            onClick={handleOpen}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Menu
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            handleAddAllPrograms();
              setConfirmAllOpen(true);
          }}
        >
          <ListItemIcon>
            <AddBoxIcon color="secondary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{variant: "body2" }} primary="Add All Items to Order" />
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleClose();
          }}
        >
          <ListItemIcon>
            <PictureAsPdfIcon color="secondary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{variant: "body2" }} primary="Add All Items to PDF" />
        </MenuItem>
      </Menu>
        </div>
        <br />
        <br />
        <Grid container className={classes.itemGridContainer} spacing={2}>
          {currentPrograms.map((prog) => (
            <Grid item lg={2} md={3} key={prog.id}>
              <Paper className={classes.singleItem}>
                <Link to={`/program/${prog.id}#details`}>
                  <Tooltip title="Program Details" placement="top">
                    <img
                      id={prog.id}
                      className={classes.programImg}
                      src={prog.imgUrl}
                      alt={prog.name}
                    />
                  </Tooltip>
                </Link>
                <Typography className={classes.headerText}>
                  {prog.name}
                </Typography>
                <div>
                  <Typography variant="body2" color="textSecondary">
                    {`Focus Month: ${prog.focusMonth}`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {`Business Unit: ${prog.unit}`}
                  </Typography>
                </div>
                <div className={classes.itemControl}>
                  <Tooltip title="Add All Items to PDF">
                    <span>
                      <IconButton id={`${prog.id}`}>
                        <PictureAsPdfIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Add All Items to Order">
                    <span>
                      <IconButton
                        id={`${prog.id}`}
                        onClick={() => handleAddAllProgram(prog.id)}
                      >
                        <AddBoxIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

OrderPreOrder.propTypes = {
  currentPrograms: PropTypes.array.isRequired,
};

export default OrderPreOrder;
