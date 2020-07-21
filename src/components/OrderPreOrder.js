import React from "react";

import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  itemGridContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "20px",
  },
  programImg: {
    width: "200px",
    height: "200px",
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
    height: "350px",
  },
}));
const OrderPreOrder = (props) => {
  const { currentPrograms, handleProgram } = props;
  const classes = useStyles();
  return (
    <Container>
      <Typography className={classes.titleText}>Current Programs</Typography>
      <br />
      <br />
      <Grid container spacing={10} className={classes.itemGridContainer}>
        {currentPrograms.map((prog) => (
          <Grid className={classes.singleItem} item lg={4} md={6} key={prog.id}>
            <img
              id={prog.id}
              className={classes.programImg}
              src={prog.imgUrl}
              alt={prog.name}
              onClick={handleProgram}
            />
            <br />
            <Typography className={classes.headerText}>{prog.name}</Typography>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OrderPreOrder;
