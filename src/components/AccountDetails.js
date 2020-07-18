import React from "react";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

import EditIcon from "@material-ui/icons/Edit";
import EditAttributesIcon from "@material-ui/icons/EditAttributes";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  avatar: {
    height: theme.spacing(15),
    width: theme.spacing(15),
  },
  accountInfo: {
    display: "flex",
    alignItems: "center",
  },
  accountDetais: {
    marginLeft: "20px",
  },
}));

const AccountDetails = () => {
  const classes = useStyles();
  return (
    <div>
      <Container className={classes.tabContainer}>
        <Typography className={classes.titleText}>
          Profile Information
        </Typography>
        <br />
        <br />
        <div className={classes.accountInfo}>
          <Avatar className={classes.avatar} />
          <div className={classes.accountDetais}>
            <div className={classes.accountInfo}>
              <Typography className={classes.titleText}>
                Firstname Lastname
              </Typography>
              <Tooltip title="Edit Info">
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </div>
            <div className={classes.accountInfo}>
              <Tooltip title="Email">
                <EmailIcon />
              </Tooltip>
              <Typography variant="body1" color="textSecondary">
                : email@email.com
              </Typography>
            </div>
            <div className={classes.accountInfo}>
              <Tooltip title="Telephone Number">
                <PhoneIcon />
              </Tooltip>
              <Typography variant="body1" color="textSecondary">
                : 999.999.9999 ext: 1234
              </Typography>
            </div>
            <div className={classes.accountInfo}>
              <Typography variant="body2" color="textSecondary">
                Upate Password
              </Typography>
              <Tooltip title="Update Password">
                <IconButton>
                  <EditAttributesIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AccountDetails;
