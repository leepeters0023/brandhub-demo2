import React from "react";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import AddBoxIcon from "@material-ui/icons/AddBox";
import CancelIcon from "@material-ui/icons/Cancel";
import ShareIcon from "@material-ui/icons/Share";

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
  itemControl: {
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
  },
  singleItemWrapper: {
    position: "relative",
    width: "auto",
    height: "auto",
    padding: "0 5px",
  },
  favorite: {
    position: "absolute",
    top: "0px",
    right: "0px",
    padding: "0px",
  },
}));

const OrderItemGridView = (props) => {
  const {
    type,
    currentItems,
    handlePreview,
    handleAddItem,
    setCurrentItemAdded,
  } = props;
  const classes = useStyles();

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
                  onClick={() => {
                    handlePreview(item.itemNumber);
                    setCurrentItemAdded(null);
                  }}
                />
              </div>
              <br />
              <Typography className={classes.headerText}>
                {`${item.brand} ${item.itemType}`}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {`#${item.itemNumber} | ${item.packSize}`}
              </Typography>
              {type === "inStock" && (
                <Typography variant="body1" color="textSecondary">
                  {`Available: ${item.stock}`}
                </Typography>
              )}
              <Typography variant="body1" color="textSecondary">
                {`${formatMoney(item.estCost)}`}
              </Typography>
              <br />
              <div className={classes.itemControl}>
                {type !== "new-program" && type !== "new-program-current" && (
                  <IconButton id={`${item.itemNumber}`}>
                    <ShareIcon />
                  </IconButton>
                )}

                {type !== "program" && type !== "new-program-current" && (
                  <>
                    <IconButton
                      id={`${item.id}`}
                      onClick={() => {
                        handleAddItem(item);
                      }}
                    >
                      <AddBoxIcon />
                    </IconButton>
                  </>
                )}
                {type === "new-program-current" && (
                  <>
                    <IconButton
                      id={`${item.id}`}
                      onClick={() => {
                        handleAddItem(item, true);
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </>
                )}
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

OrderItemGridView.propTypes = {
  type: PropTypes.string.isRequired,
  currentItems: PropTypes.array.isRequired,
  handlePreview: PropTypes.func.isRequired,
  handleAddItem: PropTypes.func.isRequired,
  setCurrentItemAdded: PropTypes.func.isRequired,
};

export default OrderItemGridView;
