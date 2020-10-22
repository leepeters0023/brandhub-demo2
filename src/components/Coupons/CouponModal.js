import React, { useState } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { updateCouponValue } from "../../redux/slices/couponSlice";

import BrandScopeSelector from "./BrandScopeSelector";
import BUSelector from "./BUSelector";
import BrandSelector from "./BrandSelector";
import ItemTypeSelector from "./ItemTypeSelector";
import ProgramSelector from "./ProgramSelector";
import CouponTypeSelector from "./CouponTypeSelector";
import OfferTypeSelector from "./OfferTypeSelector";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  selectedButton: {
    fontWeight: "600",
    fontSize: "1rem",
    textAlign: "center",
    color: "#737373",
  },
  innerCouponWrapper: {
    width: "100%",
    height: "100%",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
  },
  fieldWrapper: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  couponField: {
    width: "49%",
    margin: "5px 0",
  },
  popper: {
    zIndex: "16000",
  },
}));

const CouponModal = ({ handleCouponModal, couponsOpen }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [progOffer, setProgOffer] = useState("yes");

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={couponsOpen}
        onClose={handleCouponModal}
        disableScrollLock
        fullWidth
        maxWidth="lg"
        style={{ zIndex: "15000" }}
      >
        <DialogContent>
          <IconButton
            className={classes.closeButton}
            onClick={() => {
              handleCouponModal();
            }}
          >
            <CancelIcon fontSize="large" color="secondary" />
          </IconButton>
          <div className={classes.innerCouponWrapper}>
            <Typography className={classes.titleText}>New Coupon</Typography>
            <br />
            <BrandScopeSelector classes={classes} />
            <br />
            <br />
            <div className={classes.fieldWrapper}>
              <BUSelector classes={classes} />
              <BrandSelector classes={classes} />
              <ItemTypeSelector classes={classes} />
              <ProgramSelector classes={classes} />
              <CouponTypeSelector classes={classes} />
              <OfferTypeSelector classes={classes} />
            </div>
            <br />
            <Typography className={classes.headerText}>
              Progressive Offer:
            </Typography>
            <br />
            <div style={{ width: "30%" }}>
              <ButtonGroup
                fullWidth
                color="secondary"
                aria-label="progressive-offer-selector"
              >
                <Button
                  className={
                    progOffer === "yes"
                      ? classes.largeButton
                      : classes.selectedButton
                  }
                  variant={progOffer === "yes" ? "contained" : "outlined"}
                  onClick={() => {
                    setProgOffer("yes");
                    dispatch(
                      updateCouponValue({
                        key: "progressiveOffer",
                        value: "yes",
                      })
                    );
                  }}
                >
                  YES
                </Button>
                <Button
                  className={
                    progOffer === "NO"
                      ? classes.largeButton
                      : classes.selectedButton
                  }
                  variant={progOffer === "NO" ? "contained" : "outlined"}
                  onClick={() => {
                    setProgOffer("NO");
                    dispatch(
                      updateCouponValue({
                        key: "progressiveOffer",
                        value: "NO",
                      })
                    );
                  }}
                >
                  NO
                </Button>
              </ButtonGroup>
            </div>
            <br />
            <Button
              className={classes.largeButton}
              variant="contained"
              color="secondary"
              style={{
                width: "50%",
              }}
            >
              CREATE COUPON
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

CouponModal.propTypes = {
  handleCouponModal: PropTypes.func.isRequired,
  couponsOpen: PropTypes.bool.isRequired,
};

export default React.memo(CouponModal);
