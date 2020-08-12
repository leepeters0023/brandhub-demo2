import React, { useState, useCallback } from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import AddItemConfirmation from "./AddItemConfirmation";

import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/programTableSlice";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

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
    width: "175px",
    height: "175px",
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
    height: "360px",
    marginBottom: "40px",
    padding: "10px",
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

  const handleConfirmClose = () => {
    setConfirmOpen(false);
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
      {currentOrder.program && (
        <AddItemConfirmation
          itemArray={currentOrder.items}
          program={currentOrder.program}
          confirmOpen={confirmOpen}
          handleConfirmClose={handleConfirmClose}
        />
      )}
      <Container style={{ textAlign: "center", maxWidth: "2000px" }}>
        <Typography className={classes.titleText}>Current Programs</Typography>
        <br />
        <div
          className={classes.allItemButtons}
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <Button
            style={{ margin: "0 5px" }}
            variant="contained"
            color="secondary"
            className={classes.largeButton}
            onClick={() => {
              handleAddAllPrograms();
            }}
          >
            ADD ALL ITEMS TO CART
          </Button>
          <Button
            style={{ margin: "0 5px" }}
            variant="contained"
            color="secondary"
            className={classes.largeButton}
          >
            ADD ALL ITEMS TO PDF
          </Button>
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
                <Typography variant="body2" color="textSecondary">
                  {`Focus Month: ${prog.focusMonth}`}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {`Business Unit: ${prog.unit}`}
                </Typography>
                <div className={classes.itemControl}>
                  <Tooltip title="Add All Items to PDF">
                    <span>
                      <Button
                        variant="contained"
                        color="secondary"
                        id={`${prog.id}`}
                        
                      >
                        <PictureAsPdfIcon className={classes.navIcon} />
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip title="Add All Items to Cart">
                    <span>
                      <Button
                        variant="contained"
                        color="secondary"
                        id={`${prog.id}`}
                        
                        onClick={() => handleAddAllProgram(prog.id)}
                      >
                        <AddShoppingCartIcon className={classes.navIcon} />
                      </Button>
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
