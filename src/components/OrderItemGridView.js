import React from "react";

import Grid from "@material-ui/core/Grid";
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
  },
  itemControl: {
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
  },
}));
const OrderItemGridView = (props) => {
  const { type, currentItems, handlePreview } = props;
  const classes = useStyles();
  return (
    <Container>
      <Grid container spacing={10} className={classes.itemGridContainer}>
        {currentItems.map((item) => (
          <Grid
            className={classes.singleItem}
            item
            lg={4}
            md={6}
            key={item.itemNumber}
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
            {type === "inStock" && (
              <Typography variant="body1" color="textSecondary">
                {`Available: ${Math.floor(Math.random() * 10 + 1) * 5}`}
              </Typography>
            )}
            <br />
            <div className={classes.itemControl}>
              <IconButton>
                <StarBorderIcon />
              </IconButton>
              <Button
                variant="contained"
                color="secondary"
                id={`${item.itemNumber}`}
              >
                <Tooltip title="Add to Cart">
                  <AddShoppingCartIcon color="primary" />
                </Tooltip>
              </Button>
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OrderItemGridView;