import React from "react";
import { Link } from "@reach/router";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import { makeStyles } from "@material-ui/core/styles";

//mockdata
import programs from "../../assets/mockdata/Programs";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  ...theme.dashboard,
}));

const DashboardCompliance = () => {
  const classes = useStyles();
  return (
    <>
      <Grid
        container
        spacing={2}
        alignItems="stretch"
      >
        <Grid item md={8} sm={12}>
          <Grid
            item
            container
            spacing={2}
            direction="column"
            justify="space-between"
          >
            <Grid item sm>
              <Paper className={classes.paper}>
                <Typography variant="h4" className={classes.subTitle}>
                  Notifications
                </Typography>
                <br />
                <Typography variant="h5" className={classes.content}>
                  New Orders Pending Approval:
                </Typography>
                <br />
                <Typography variant="h5" className={classes.content}>
                  New Compliance Rules:
                </Typography>
                <br />
                <Typography variant="h5" className={classes.content}>
                  New Items:
                </Typography>
                <br />
              </Paper>
            </Grid>
            <Grid item sm>
              <Paper className={classes.paper}>
                <Typography variant="h4" className={classes.subTitle}>
                  Current Programs
                </Typography>
                <br />
                <GridList className={classes.gridList} cols={2.5}>
                  {programs.map((program) => (
                    <GridListTile key={program.id}>
                      <img src={program.imgUrl} alt={program.name} />
                      <GridListTileBar
                        title={program.name}
                        classes={{
                          root: classes.gridTitleBar,
                          title: classes.title,
                        }}
                      />
                    </GridListTile>
                  ))}
                </GridList>
                <br />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h4" className={classes.subTitle}>
              Actions
            </Typography>
            <br />
            <br />
            <div className={classes.buttons}>
            <Typography variant="h5" className={classes.content}>
                Approvals:
              </Typography>
              <br />
              <Button
                className={classes.largeButton}
                color="primary"
                variant="contained"
                component={Link}
                to="/approval#pending"
              >
                PENDING
              </Button>
              <br />
              <Button
                className={classes.largeButton}
                color="primary"
                variant="contained"
                component={Link}
                to="/approval#prior"
              >
                APPROVAL HISTORY
              </Button>
              <br />
              <Typography variant="h5" className={classes.content}>
                Compliance Rules:
              </Typography>
              <br />
              <Button
                className={classes.largeButton}
                color="primary"
                variant="contained"
                component={Link}
                to="/rules"
              >
                RULES BY STATE
              </Button>
              <br />
              <Button
                className={classes.largeButton}
                color="primary"
                variant="contained"
                component={Link}
                to="/classifications"
              >
                POS CLASSIFICATION
              </Button>
              <br />
              <Typography variant="h5" className={classes.content}>
                Contacts:
              </Typography>
              <br />
              <Button
                className={classes.largeButton}
                color="primary"
                variant="contained"
                component={Link}
                to="/compliance-contacts"
              >
                STATE CONTACTS
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardCompliance;