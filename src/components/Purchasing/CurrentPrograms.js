import React from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";

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
    alignItems: "center",
  },
}));

const CurrentPrograms = ({ userType, currentPrograms, filtersOpen }) => {
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
                    {`Budget: ${formatMoney(
                      Math.floor(Math.random() * 1000000 + 1000000), false
                    )}`}
                  </Typography>
                </div>
                {userType === "field1" && (
                  <div className={classes.itemControl}>
                    {userType === "field1" && (
                      <Tooltip title="Place Pre-Order">
                        <span>
                          <IconButton
                            component={Link}
                            to={`/orders/open/preorder#${prog.id}`}
                          >
                            <ExitToAppIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    )}
                  </div>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

CurrentPrograms.propTypes = {
  userType: PropTypes.string.isRequired,
  currentPrograms: PropTypes.array.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default CurrentPrograms;
