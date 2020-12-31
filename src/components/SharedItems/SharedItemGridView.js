import React from "react";
import PropTypes from "prop-types";

import ImageWrapper from "../Utility/ImageWrapper";
import Loading from "../Utility/Loading";

import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  ...theme.itemGrid,
}));

const SharedItemGridView = ({ items, handlePreview, isItemsLoading }) => {
  const classes = useStyles();

  if (isItemsLoading) {
    return <Loading />;
  }

  return (
    <Container className={classes.mainWrapper}>
      <br />
      <Grid
        container
        spacing={10}
        className={classes.itemGridContainer}
        style={{
          maxHeight: "Calc(100vh - 250px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {items.length === 0 && (
          <Typography className={classes.headerText}>
            {`There are no items items shared..`}
          </Typography>
        )}
        {items.length > 0 &&
          items.map((item) => (
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
                  <ImageWrapper
                    id={item.id}
                    imgClass={classes.previewImg}
                    alt={item.itemType}
                    imgUrl={item.imgUrlThumb}
                    handlClick={() => handlePreview(item.id)}
                  />
                </div>
                <br />
                <Typography className={classes.headerText}>
                  {`Brand(s): ${item.brand}`}
                </Typography>
                <Typography className={classes.headerText}>
                  {`Program(s): ${item.program}`}
                </Typography>
                <Typography className={classes.headerText}>
                  {item.itemType}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {`#${item.itemNumber}`}
                </Typography>
                <br />
                <Typography className={classes.bodyText}>
                  {item.description}
                </Typography>
                <Typography className={classes.bodyText}>
                  {`In Market: ${item.inMarketDate}`}
                </Typography>
              </Paper>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

SharedItemGridView.propTypes = {
  items: PropTypes.array,
  isItemsLoading: PropTypes.bool.isRequired,
  handlePreview: PropTypes.func.isRequired,
};

export default SharedItemGridView;
