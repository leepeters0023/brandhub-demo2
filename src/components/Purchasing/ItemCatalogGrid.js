import React from "react";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

import Loading from "../Utility/Loading";

import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  paperWrapper: {
    backgroundColor: "whitesmoke",
    width: "95%",
    height: "100%",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemGridContainer: {
    maxWidth: "2000px",
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
  singleItemWrapper: {
    position: "relative",
    width: "auto",
    height: "auto",
    padding: "0 5px",
  },
}));

const OrderItemGridView = (props) => {
  const { currentItems, handlePreview, catalogType, isItemsLoading } = props;
  const classes = useStyles();

  if (isItemsLoading) {
    return <Loading />
  }

  return (
    <Container className={classes.mainWrapper}>
      <br />
      <Grid container spacing={10} className={classes.itemGridContainer}>
        {currentItems.map((item) => (
          <Grid
            className={classes.singleItem}
            item
            lg={3}
            md={4}
            sm={6}
            xs={12}
            key={item.id}
          >
            <Paper className={classes.paperWrapper}>
              <div className={classes.singleItemWrapper}>
                <img
                  id={item.itemNumber}
                  className={classes.previewImg}
                  src={item.imgUrl}
                  alt={item.itemType}
                  onClick={() => handlePreview(item.itemNumber)}
                />
              </div>
              <br />
              <Typography className={classes.headerText}>
                {`${item.brand} ${item.itemType}`}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {`#${item.itemNumber} | ${item.packSize}`}
              </Typography>
              {catalogType === "inStock" && (
                <Typography variant="body1" color="textSecondary">
                  {`Available: ${item.stock}`}
                </Typography>
              )}
              <br />
              <Typography className={classes.headerText}>
                {`${formatMoney(item.estCost)}`}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

OrderItemGridView.propTypes = {
  currentItems: PropTypes.array,
  handlePreview: PropTypes.func.isRequired,
};

export default OrderItemGridView;
