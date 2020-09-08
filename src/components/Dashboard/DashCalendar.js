import React from "react";
import { Link } from "@reach/router";

import { useSelector } from "react-redux";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  ...theme.dashboard,
}));

const DashCalendar = () => {
  const classes = useStyles();

  const currentPrograms = useSelector((state) => state.programs.programs);
 

  return (
    <>
      <Paper variant="outlined" style={{height: "Calc(100% - 44px)", padding: "10px"}}>
        <br />
        <Typography className={classes.headerText}>
          Upcoming Programs
        </Typography>
        <List>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                className={classes.dashboardAvatar}
                alt="program"
                src={`${currentPrograms[0].imgUrl}`}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${currentPrograms[0].brand}-${currentPrograms[0].focusMonth}`}
              secondary={
                <>
                  <Typography
                    component="span"
                    className={classes.bodyText}
                    style={{ display: "inline" }}
                    color="textSecondary"
                  >
                    {`${currentPrograms[0].goals}`}
                  </Typography>
                </>
              }
            />
          </ListItem>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                className={classes.dashboardAvatar}
                alt="program"
                src={`${currentPrograms[1].imgUrl}`}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${currentPrograms[1].brand}-${currentPrograms[1].focusMonth}`}
              secondary={
                <>
                  <Typography
                    component="span"
                    className={classes.bodyText}
                    style={{ display: "inline" }}
                    color="textSecondary"
                  >
                    {`${currentPrograms[1].goals}`}
                  </Typography>
                </>
              }
            />
          </ListItem>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                className={classes.dashboardAvatar}
                alt="program"
                src={`${currentPrograms[2].imgUrl}`}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${currentPrograms[2].name}-${currentPrograms[2].focusMonth}`}
              secondary={
                <>
                  <Typography
                    component="span"
                    className={classes.bodyText}
                    style={{ display: "inline" }}
                    color="textSecondary"
                  >
                    {`${currentPrograms[2].goals}`}
                  </Typography>
                </>
              }
            />
          </ListItem>
        </List>
        <br />
        <Button
          className={classes.largeButton}
          color="secondary"
          variant="contained"
          component={Link}
          to="/programs"
        >
          VIEW CURRENT PROGRAMS
        </Button>
        <br />
        <Typography
          className={classes.bodyText}
          color="textSecondary"
          style={{ marginTop: "5px" }}
        >
          * Current order window ends in 10 days
        </Typography>
        <br />
      </Paper>
    </>
  );
};

export default DashCalendar;
