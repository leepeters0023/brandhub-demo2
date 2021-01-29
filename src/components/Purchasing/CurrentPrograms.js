import React from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import ImageWrapper from "../Utility/ImageWrapper";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

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
    filter: "sepia(50%)",
    transition: "all .25s ease",
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
    alignItems: "center",
  },
}));

const CurrentPrograms = ({ currentPrograms, filtersOpen }) => {
  const classes = useStyles();

  const currentUserRole = useSelector((state) => state.user.role);

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
            Current Pre-Order Programs
          </Typography>
        </div>
        <br />
        <br />
        <Grid container spacing={2} justify="center" alignItems="stretch">
          {currentPrograms.map((prog) => (
            <Grid
              item
              lg={filtersOpen ? 3 : 2}
              md={filtersOpen ? 4 : 3}
              sm={filtersOpen ? 6 : 4}
              xs={filtersOpen ? 12 : 6}
              key={prog.id}
            >
              <Paper className={classes.singleItem}>
                <Link to={`/program/${prog.id}#details`}>
                  <ImageWrapper
                    id={prog.id}
                    imgClass={classes.programImg}
                    alt={prog.name}
                    imgUrl={prog.imgUrl}
                  />
                </Link>
                <Typography className={classes.headerText}>
                  {`${prog.name}`}
                </Typography>
                <div>
                  {prog.brand.length > 1 ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <Tooltip
                        placement="left"
                        title={`Brand(s): ${prog.brand.join(", ")}`}
                      >
                        <span style={{ display: "flex" }}>
                          <Typography
                            className={classes.headerText}
                          >{`${prog.brand[0]}`}</Typography>
                          <MoreHorizIcon
                            fontSize="small"
                            color="inherit"
                            style={{ marginLeft: "5px" }}
                          />
                        </span>
                      </Tooltip>
                    </div>
                  ) : (
                    <Typography
                      className={classes.headerText}
                    >{`Brand(s): ${prog.brand[0]}`}</Typography>
                  )}
                  <Typography variant="body2" color="textSecondary">
                    {`Focus Month: ${prog.focusMonth}`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {`Order Window: ${prog.orderWindowOpen} - ${prog.orderWindowClose}`}
                  </Typography>
                </div>
                {currentUserRole !== "compliance" &&
                  currentUserRole !== "read-only" && (
                    <div className={classes.itemControl}>
                      <Tooltip title="Place Pre-Order">
                        <span>
                          <Button
                            component={Link}
                            to={`/orders/open/preorder#${prog.id}`}
                            className={classes.largeButton}
                            variant="contained"
                            color="secondary"
                            style={{ marginBottom: "10px" }}
                            startIcon={<ExitToAppIcon />}
                          >
                            ORDER
                          </Button>
                        </span>
                      </Tooltip>
                    </div>
                  )}
                {(currentUserRole === "compliance" ||
                  currentUserRole === "read-only") && <div></div>}
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
  filtersOpen: PropTypes.bool.isRequired,
};

export default CurrentPrograms;
