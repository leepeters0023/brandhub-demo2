import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { getIframeUrl, clearCoupon } from "../../redux/slices/couponSlice";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
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
  paperRoot: {
    minHeight: "75vh",
    maxHeight: "75vh",
  }
}));

const CouponModal = ({ handleCouponModal, couponsOpen }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  //const isCouponLoading = useSelector((state) => state.coupons.isLoading);
  const isLinkLoading = useSelector((state) => state.coupons.isLinkLoading);
  const iframeId = useSelector((state) => state.coupons.iframeId);
  const iframeLink = useSelector((state) => state.coupons.iframeLink);
  const currentEmail = useSelector((state) => state.user.email);
  const territoryId = useSelector((state) => state.user.currentTerritory);
  const userId = useSelector((state) => state.user.id);

  useEffect(() => {
    dispatch(clearCoupon());
    dispatch(getIframeUrl(currentEmail, territoryId, userId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={couponsOpen}
        onClose={handleCouponModal}
        disableScrollLock
        fullWidth
        maxWidth="xl"
        classes={{ paper: classes.paperRoot }}
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
            {(!iframeLink || isLinkLoading) && <CircularProgress />}
            {iframeLink && iframeId && !isLinkLoading && (
              <div
                style={{ display: "table-row", height: "100%", width: "100%" }}
              >
                <iframe
                  src={iframeLink}
                  title="Create a Coupon"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    padding: "0",
                    margin: "0",
                    display: "block",
                  }}
                />
              </div>
            )}
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
