import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Carousel from "react-material-ui-carousel";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

import ApproveOrDenyItemPDF from '../components/Compliance/ApproveOrDenyItemPDF'

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import ImageWrapper from "../components/Utility/ImageWrapper";
import Logo from "../assets/RTA_Logo_Stacked.png";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { fetchApproveOrDenyItemSlice } from "../redux/slices/approveOrDenyItemSlice.js";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  logo: {
    height: "58px",
    width: "auto",
    marginLeft: "25px",
  },
  previewImage: {
    maxHeight: "500px",
    width: "auto",
    objectFit: "contain",
  },
}));

const ApproveOrDenyItem = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [itemNumber, setItemNumber] = useState("");
  const [token, setToken] = useState("");
  const [notes, setNotes] = useState("");
  const [imgs, setImgs] = useState([]);
  const status = useSelector((state) => state.itemApprovedOrDenied.status);
  const isError = useSelector((state) => state.itemApprovedOrDenied.error);
  const isLoading = useSelector(
    (state) => state.itemApprovedOrDenied.isLoading
  );

  let paramSample = 'v1612997323/prod/Gallo/nrcgldork0kjwjehgrlk.jpg,v1612919514/prod/Gallo/ptlsixxizcsav5wd1hqt.jpg,v1612815444/prod/Gallo/oggeqqyppbpnsaxukpfu.jpg,v1612804011/prod/Gallo/ycvfdraiirwirqwkoghi.jpg'

  useEffect(() => {
    setImgs(paramSample.split(","))
  }, [])

  const handleNotes = (e) => {
    setNotes(e.target.value)
  }
  useEffect(() => {
    const params = new URLSearchParams(document.location.search.substring(1));
    setToken(params.get("token"));
    setItemNumber(params.get("item_number"));
    //setImgs(params.get('cloudinary_ids').split(","))
  }, []);

  return (
    <>
      <Helmet>
        <title>RTA | Approve or Deny</title>
      </Helmet>
      <Container className={classes.mainWrapper}>
        <ImageWrapper
          imgUrl={Logo}
          alt={"Logo"}
          imgClass={classes.logo}
          id={"logo"}
        />
        <div
          style={{
            height: "85vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Carousel
            autoPlay=""
            classes={{ root: classes.imgCarousel }}
            navButtonsAlwaysInvisible={
              imgs && imgs.length === 1 ? true : false
            }
          >
            {imgs &&
              imgs.map((cloudinaryId, index) => (
                <ImageWrapper
                  key={index}
                  imgUrl={`https://res.cloudinary.com/brandhub/image/upload/${cloudinaryId}`}
                  alt={`compliance-image${index}`}
                  imgClass={classes.previewImage}
                  id={`compliance-image${cloudinaryId}`}
                />
              ))}
          </Carousel>
          <br />
          <Typography className={classes.titleText} variant="h5">
            Please approve or deny item: {itemNumber}
          </Typography>
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Button
              disabled={!status && !isError ? false : true}
              className={classes.largeButton}
              style={{ width: "150px", margin: "10px" }}
              variant="contained"
              onClick={() =>
                dispatch(fetchApproveOrDenyItemSlice(token, "approved"))
              }
            >
              Approve
            </Button>
            <Button
              disabled={!status && !isError ? false : true}
              className={classes.largeButton}
              style={{ width: "150px", margin: "10px" }}
              variant="contained"
              onClick={() =>
                dispatch(fetchApproveOrDenyItemSlice(token, "denied"))
              }
            >
              Deny
            </Button>
          </div>
          <br></br>
          <TextField
            disabled={!status && !isError ? false : true}
            id="notes-input"
            style={{ width: "400px" }}
            variant="outlined"
            color="secondary"
            type="text"
            label="Notes (for your reference only)"
            onChange={(e) => handleNotes(e)}
          />
          {isLoading && <CircularProgress />}
          <br></br>
          {isError && (
            <Typography className={classes.headerText} variant="h5">
              There was an issue with your request, please contact us at:
              help@readytoactivate.com. Error message: {isError}
            </Typography>
          )}
          {(status === "approved" || status === "denied") && (
            <>
              <Typography className={classes.titleText} variant="h5">
                You have {status === "approved" ? "approved" : "denied"} item:{" "}
                {itemNumber}. No further action is needed.
              </Typography>
              <br></br>
              <Typography className={classes.headerText} variant="h5">
                You may close this window.
              </Typography>
              <br></br>
              <Typography className={classes.headerText}>Download for your records</Typography>
              <Tooltip
                title="Download as PDF"
                PopperProps={{ style: { zIndex: "16000" } }}
                placement="right"
              >
                <span>
                  <PDFDownloadLink
                    document={
                      <ApproveOrDenyItemPDF
                        itemNumber={itemNumber}
                        token={token}
                        status={status}
                        isLoading={isLoading}
                        notes={notes}
                      />
                    }
                    fileName={`Gallo-item-compliance-${itemNumber}`}
                  >
                    {({ loading, error }) =>
                      loading ? (
                        <div
                          style={{
                            width: "58.99px",
                            height: "58.99px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CircularProgress />
                        </div>
                      ) : (
                          <IconButton>
                            <PictureAsPdfIcon
                              fontSize="large"
                              color="secondary"
                            />
                          </IconButton>
                        )
                    }
                  </PDFDownloadLink>
                </span>
              </Tooltip>
            </>
          )}
        </div>
        <Typography
          className={classes.headerText}
          style={{ bottom: "0", float: "right" }}
          variant="h5"
        >
          need help? Email us: help@readytoactivate.com
        </Typography>
      </Container>
    </>
  );
};

ApproveOrDenyItem.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default ApproveOrDenyItem;
