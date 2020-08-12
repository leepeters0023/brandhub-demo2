import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import StarBorderIcon from "@material-ui/icons/StarBorder";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

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

  const { type, currentItems, handlePreview, handleAddProgramItem } = props;
  const classes = useStyles();

  return (
    <Container>
      <br />
      <Grid container spacing={10} className={classes.itemGridContainer}>
        {currentItems.map((item) => (
          <Grid
            className={classes.singleItem}
            item
            lg={4}
            md={6}
            key={item.itemNumber}
          >
            <div className={classes.singleItemWrapper}>
              <Tooltip placement="top-start" title="Favorite">
                <IconButton className={classes.favorite}>
                  <StarBorderIcon />
                </IconButton>
              </Tooltip>
              <img
                id={item.itemNumber}
                className={classes.previewImg}
                src={item.imgUrl}
                alt={item.itemType}
                onClick={handlePreview}
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
              <Tooltip title="Add to PDF">
                <span>
                  <Button
                    variant="contained"
                    color="secondary"
                    id={`${item.itemNumber}`}
                  >
                    <PictureAsPdfIcon className={classes.navIcon} />
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="Add to Cart">
                <span>
                  <Button
                    variant="contained"
                    color="secondary"
                    id={`${item.itemNumber}`}
                    onClick={()=>handleAddProgramItem(item)}
                  >
                    <AddShoppingCartIcon className={classes.navIcon} />
                  </Button>
                </span>
              </Tooltip>
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
  handleAddProgramItem: PropTypes.func.isRequired,
  handleAddAllProgramItems: PropTypes.func.isRequired,
};

export default OrderItemGridView;
