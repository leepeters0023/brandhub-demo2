import React, { useState } from "react";

import EditAccountModal from "./EditAccountModal";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

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

  const [info, setInfo] = useState({
    first: "Firstname",
    last: "Lastname",
    email: "email@email.com",
    phone: "999-999-9999",
  });

  const onSubmit = (first, last, email, phone) => {
    setInfo({ first, last, email, phone });
  };

  return (
    <>
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
                {`${info.first} ${info.last}`}
              </Typography>
              <EditAccountModal
                onSubmit={onSubmit}
                currentFirst={info.first}
                currentLast={info.last}
                currentEmail={info.email}
                currentPhone={info.phone}
              />
            </div>
            <div className={classes.accountInfo}>
              <Tooltip title="Email">
                <EmailIcon />
              </Tooltip>
              <Typography variant="body1" color="textSecondary">
                {`: ${info.email}`}
              </Typography>
            </div>
            <div className={classes.accountInfo}>
              <Tooltip title="Telephone Number">
                <PhoneIcon />
              </Tooltip>
              <Typography variant="body1" color="textSecondary">
                {`: ${info.phone}`}
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
    </>
  );
};

export default AccountDetails;
