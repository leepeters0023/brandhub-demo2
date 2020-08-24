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
  console.log(currentPrograms);

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
                src={`${currentPrograms[3].imgUrl}`}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${currentPrograms[3].brand}-${currentPrograms[3].focusMonth}`}
              secondary={
                <>
                  <Typography
                    component="span"
                    className={classes.bodyText}
                    style={{ display: "inline" }}
                    color="textSecondary"
                  >
                    {`${currentPrograms[3].goals}`}
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
                src={`${currentPrograms[7].imgUrl}`}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${currentPrograms[7].brand}-${currentPrograms[7].focusMonth}`}
              secondary={
                <>
                  <Typography
                    component="span"
                    className={classes.bodyText}
                    style={{ display: "inline" }}
                    color="textSecondary"
                  >
                    {`${currentPrograms[7].goals}`}
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
