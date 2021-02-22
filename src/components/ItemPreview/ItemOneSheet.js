import React from "react";

import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const ItemOneSheet = () => {
  const classes = useStyles();
  return (
    <>
      <Container className={classes.modalTabContainer}>
        <img
          src="https://res.cloudinary.com/joshdowns-dev/image/upload/v1596482051/Select/sample_one_sheet.png"
          style={{ width: "auto", maxHeight: "600px" }}
          alt="One Sheet"
        />
      </Container>
    </>
  );
};

export default ItemOneSheet;
