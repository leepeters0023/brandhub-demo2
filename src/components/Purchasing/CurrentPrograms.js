import React from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

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
    width: "85px",
    height: "85px",
    marginTop: "15px",
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
    height: "275px",
    marginBottom: "40px",
    padding: "10px",
    backgroundColor: "whitesmoke",
  },
  itemControl: {
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center"
  },
}));

const CurrentPrograms = ({ currentPrograms }) => {
  const classes = useStyles();

  return (
    <>
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
          <Tooltip title="Add All Items to PDF">
            <span>
              <IconButton>
                <PictureAsPdfIcon />
              </IconButton>
            </span>
          </Tooltip>
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
                  {`${prog.name} - ${prog.focusMonth}`}
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
                  <Button
                  size="small"
                    color="primary"
                    variant="contained"
                    component={Link}
                    to={`/orders/open/preorder#${prog.id}`}
                  >Pre-Order</Button>
                  <Tooltip title="Add All Items to PDF">
                    <span>
                      <IconButton id={`${prog.id}`}>
                        <PictureAsPdfIcon />
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

CurrentPrograms.propTypes = {
  currentPrograms: PropTypes.array.isRequired,
};

export default CurrentPrograms;
