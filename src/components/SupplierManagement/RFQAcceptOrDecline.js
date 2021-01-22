import React, { useEffect } from "react";
import { formatMoney } from "../../utility/utilityFunctions";

import { useMoneyInput, useInput } from "../../hooks/InputHooks";
import { useDispatch, useSelector } from "react-redux";

import {
  updateCurrentBidNote,
  updateCurrentBidPrice,
  acceptCurrentBid,
  declineCurrentBid,
} from "../../redux/slices/rfqSlice";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  controlGrid: {
    display: "flex",
  },
}));

const MoneyCell = ({ quote, status }) => {
  const { value: cost, bind: bindCost } = useMoneyInput(
    quote,
    updateCurrentBidPrice,
    false,
    true
  );
  return (
    <TextField
      value={cost}
      variant="outlined"
      size="small"
      fullWidth
      disabled={status !== "sent"}
      {...bindCost}
    />
  );
};

const RFQAcceptOrDecline = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const supplierId = useSelector((state) => state.user.supplierId);
  const currentBid = useSelector((state) => state.rfq.currentRFQ.bids).find(
    (bid) => bid.supplierId === supplierId
  );
  console.log(currentBid);
  const { value: note, bind: bindNote, setValue: setNote } = useInput("");

  const currentBidPrice = useSelector((state) => state.rfq.currentBidPrice);
  const currentBidNote = useSelector((state) => state.rfq.currentBidNote);

  const handleSubmit = () => {
    dispatch(acceptCurrentBid(currentBid.id, currentBidPrice, currentBidNote));
  };

  const handleDecline = () => {
    dispatch(declineCurrentBid(currentBid.id));
  };

  useEffect(() => {
    if (currentBid && currentBid.note && currentBid.note.length > 0) {
      setNote(currentBid.note);
    }
  }, [currentBid, setNote]);

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="stretch"
      style={{ width: "50%", minWidth: "600px" }}
      spacing={5}
    >
      <Grid sm={8} item>
        <Typography>Accept or Decline RFQ</Typography>
      </Grid>
      <Grid sm={12} item>
        <MoneyCell quote={formatMoney(currentBid.price, true)} status={currentBid.status}/>
      </Grid>
      <Grid sm={12} item>
        <TextField
          label="Return Note"
          color="secondary"
          multiline
          fullWidth
          variant="outlined"
          size="small"
          rows="4"
          disabled={currentBid.status !== "sent"}
          {...bindNote}
          onBlur={() => {
            dispatch(updateCurrentBidNote({ note: note }));
          }}
        />
      </Grid>
      {currentBid.status === "sent" && (
        <Grid sm={10} item style={{ alignSelf: "flex-end" }}>
          <Button
            className={classes.largeButton}
            variant="contained"
            color="secondary"
            onClick={() => {
              handleDecline();
            }}
          >
            Decline
          </Button>
          <Button
            style={{ marginLeft: "10px" }}
            className={classes.largeButton}
            variant="contained"
            color="secondary"
            onClick={() => {
              handleSubmit();
            }}
          >
            Accept and Submit
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default React.memo(RFQAcceptOrDecline);
