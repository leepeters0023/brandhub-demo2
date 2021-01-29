import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import ImageWrapper from "../components/Utility/ImageWrapper";
import Logo from "../assets/RTA_Logo_Stacked.png";
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
}));

const ApproveOrDenyItem = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [itemNumber, setItemNumber] = useState("");
    const [token, setToken] = useState("");
    const status = useSelector((state) => state.itemApprovedOrDenied.status);
    const isError = useSelector((state) => state.itemApprovedOrDenied.error)
    const isLoading = useSelector((state) => state.itemApprovedOrDenied.isLoading);

    useEffect(() => {
        const params = new URLSearchParams(document.location.search.substring(1));
        setToken(params.get("token"));
        setItemNumber(params.get("item_number"));
    }, [])

    return (
        <>
        <Helmet><title>RTA | Approve or Deny</title>
        <script type="text/javascript">{`Beacon('close')`}</script>
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
                    <Typography className={classes.titleText} variant="h5">
                        Please approve or deny item: {itemNumber}
                    </Typography>
                    <br />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}>
                        <Button
                            disabled={(!status && !isError) ? false : true}
                            className={classes.largeButton}
                            style={{ width: "150px", margin: "10px" }}
                            variant="contained"
                            onClick={() => dispatch(fetchApproveOrDenyItemSlice(token, "approved"))}
                        >
                            Approve
                        </Button>
                        <Button
                            disabled={(!status && !isError) ? false : true}
                            className={classes.largeButton}
                            style={{ width: "150px", margin: "10px" }}
                            variant="contained"
                            onClick={() => dispatch(fetchApproveOrDenyItemSlice(token, "denied"))}
                        >
                            Deny
                        </Button>
                    </div>
                    <br></br>
                    {isLoading && (<CircularProgress />)}
                    <br></br>
                    {isError && (
                        <Typography className={classes.headerText} variant="h5">
                            There was an issue with your request, please contact us at: help@readytoactivate.com.
                            Error message: {isError}
                        </Typography>
                    )}
                    {(status === "approved" || status === "denied") && (
                        <>
                            <Typography className={classes.titleText} variant="h5">
                                You have {status === "approved" ? "approved" : "denied"} item: {itemNumber}. No further action is needed.
                            </Typography>
                            <Typography className={classes.headerText} variant="h5">
                                You may close this window.
                            </Typography>
                        </>
                    )}
                </div>
                <Typography className={classes.headerText} style={{ bottom: "0", float: "right" }} variant="h5">
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
