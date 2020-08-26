import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
//import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

//import StarBorderIcon from "@material-ui/icons/StarBorder";
import AddBoxIcon from "@material-ui/icons/AddBox";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
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
    currentProgram,
    handleAddItem,
  } = props;
  const classes = useStyles();

  //nounused vars (current program not needed yet until api integration)
  console.log(currentProgram);

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
            key={item.itemNumber}
          >
            <div className={classes.singleItemWrapper}>
              {/* <Tooltip placement="top-start" title="Favorite">
                <IconButton className={classes.favorite}>
                  <StarBorderIcon />
                </IconButton>
              </Tooltip> */}
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
              {`#${item.itemNumber} | ${item.qty}`}
            </Typography>
            {type === "inStock" && (
              <Typography variant="body1" color="textSecondary">
                {`Available: ${Math.floor(Math.random() * 10 + 1) * 5}`}
              </Typography>
            )}
            <br />
            <div className={classes.itemControl}>
              <Button
                variant="contained"
                color="secondary"
                id={`${item.itemNumber}`}
              >
                <PictureAsPdfIcon className={classes.navIcon} />
              </Button>

              {type !== "program" && (
                <Button
                  variant="contained"
                  color="secondary"
                  id={`${item.itemNumber}`}
                  onClick={() => handleAddItem(item, 1)}
                >
                  <AddBoxIcon className={classes.navIcon} />
                </Button>
              )}
            </div>
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
  currentProgram: PropTypes.string,
  handleAddItem: PropTypes.func.isRequired,
};

export default OrderItemGridView;
