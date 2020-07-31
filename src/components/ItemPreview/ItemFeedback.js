import React from "react";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  inline: {
    display: "inline",
  },
}));

const ItemFeedback = () => {
  const classes = useStyles();
  return (
    <>
      <Container className={classes.modalTabContainer}>
        <Grid container spacing={2}>
          <Grid item md={6} sm={12}>
            <List>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>JD</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Looks Great!"
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        Josh Downs
                      </Typography>
                      {" — Easy to set up, great custome feedback!"}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>CD</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Missing Pieces"
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        Carlton Dunn
                      </Typography>
                      {" — Was missing parts when it showed up"}
                    </React.Fragment>
                  }
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item md={6} sm={12}>
            <Typography className={classes.headerText}>
              Submit your Feedback:
            </Typography>
            <br />
            <TextField
              color="secondary"
              multiline
              fullWidth
              variant="outlined"
              size="small"
              rows="5"
            />
            <br />
            <br />
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <Button
                className={classes.largeButton}
                variant="contained"
                color="secondary"
              >
                Submit
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ItemFeedback;
