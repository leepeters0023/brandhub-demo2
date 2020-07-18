import React from "react";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const ItemFeedback = () => {
  const classes = useStyles();
  return (
    <div>
      <Container className={classes.modalTabContainer}>
        <Typography className={classes.headerText}>
          Item Feedback:
        </Typography>
        <Typography className={classes.bodyText}>
          Do minim reprehenderit officia Lorem et deserunt. Aliquip eu sit do
          labore duis tempor consequat non est aute elit. Dolor Lorem qui
          exercitation cillum incididunt est ex non fugiat.
        </Typography>
      </Container>
    </div>
  );
};

export default ItemFeedback;