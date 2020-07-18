import React from "react";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import StarBorderIcon from "@material-ui/icons/StarBorder";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  itemGridContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingBottom: "20px",
  },
  previewImg: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    "&:hover": {
      cursor: "pointer",
    },
  },
  singleItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "10px",
  },
  itemControl: {
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
  },
}));
const OrderPreGridView = (props) => {
  const { currentItems, handlePreview } = props;
  const classes = useStyles();
  return (
    <Container>
      <br />
      <div className={classes.titleBar}>
        <Typography className={classes.titleText} variant="h5">
          Monthly Pre Order
        </Typography>
      </div>
      <br />
      <br />
      <br />
      <Grid container spacing={7} className={classes.itemGridContainer}>
        {currentItems.map((item) => (
          <Grid
            className={classes.singleItem}
            item
            lg={3}
            md={4}
            sm={6}
            xs={12}
            key={item.itemNumber}
            component={Paper}
          >
            <img
              id={item.itemNumber}
              className={classes.previewImg}
              src={item.imgUrl}
              alt={item.itemType}
              onClick={handlePreview}
            />
            <br />
            <Typography className={classes.headerText}>
              {`${item.brand} ${item.itemType}`}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {`#${item.itemNumber} | ${item.qty}`}
            </Typography>
            <br />
            <br />
            <div className={classes.itemControl}>
              <IconButton>
                <StarBorderIcon />
              </IconButton>
              <Button
                variant="contained"
                color="primary"
                id={`${item.itemNumber}`}
              >
                <Tooltip title="Add to Cart">
                  <AddShoppingCartIcon color="secondary" />
                </Tooltip>
              </Button>
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OrderPreGridView;
