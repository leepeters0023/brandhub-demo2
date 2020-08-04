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
    width: "100%",
  },
  programImg: {
    width: "225px",
    height: "225px",
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
    marginBottom: "80px",
  },
}));
const OrderPreOrder = (props) => {
  const { currentPrograms } = props;
  const classes = useStyles();
  return (
    <Container style={{ textAlign: "center", maxWidth: "2000px" }}>
      <Typography className={classes.titleText}>Current Programs</Typography>
      <br />
      <br />
      <Grid container className={classes.itemGridContainer}>
        {currentPrograms.map((prog) => (
          <Grid className={classes.singleItem} item lg={3} md={4} key={prog.id}>
            <a href={`/program/${prog.id}#details`}>
              <img
                id={prog.id}
                className={classes.programImg}
                src={prog.imgUrl}
                alt={prog.name}
              />
            </a>
            <br />
            <Typography className={classes.headerText}>{prog.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              MM/DD/YYYY - MM/DD/YYYY
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OrderPreOrder;
