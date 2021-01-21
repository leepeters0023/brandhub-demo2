import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import ImageWrapper from "../components/Utility/ImageWrapper";
import Logo from "../assets/RTA_Logo_Stacked.png";
import Typography from "@material-ui/core/Typography";

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
    const [item, setItem] = useState("")
    const [isApproved, setIsApproved] = useState(false);
    const [isDenied, setIsDenied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        // let url = window.location.pathname
        let url = '?token=B77dWv3cRFI2-RahFxQkxayHD6ONidoO&item_id=123&item_type_id=123'
        let hash;
        let itemObj = {};
        let hashes = url.slice(url.indexOf('?') + 1).split('&');
        for (let i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            itemObj[hash[0]] = hash[1];
        }
        setItem(itemObj)
    }, [])

    console.log(item)

    const handleApprove = async () => {
        setIsLoading(true)
        const response = { status: "", error: null };
        await axios
            .post("/public/approve_or_deny",
                {
                    token: item.token,
                    approve_or_deny: "approved"
                })
            .then((res) => {
                console.log(res.data);
                response.status = "ok";
                setIsLoading(false)
                setIsApproved(true)
            })
            .catch((err) => {
                setIsLoading(false)
                setIsError(true)
                console.log(err)
                response.status = "error";
                //response.error = err.response.data.errors[0].title;
            })
    };

    const handleDeny = async () => {
        setIsLoading(true)
        const response = { status: "", error: null };
        await axios
            .post("/public/approve_or_deny",
                {
                    token: item.token,
                    approve_or_deny: "in-violation"
                })
            .then((res) => {
                console.log(res.data);
                response.status = "ok";
                setIsLoading(false)
                setIsDenied(true)
            })
            .catch((err) => {
                setIsLoading(false)
                setIsError(true)
                console.log(err)
                response.status = "error";
                //response.error = err.response.data.errors[0].title;
            })
    }

    return (
        <>
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
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Grid container>
                        <Grid item sm={2} xs={1} />
                        <Grid item sm={8} xs={10} style={{ textAlign: "center" }}>
                            <Typography className={classes.titleText} variant="h5">
                                Please approve or deny item: {item.item_id}
                            </Typography>
                            <br />
                            {!isLoading && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                    }}>
                                    <Button
                                        className={classes.largeButton}
                                        style={{ width: "150px", margin: "10px" }}
                                        variant="contained"
                                        onClick={handleApprove}
                                    >
                                        Approve
                                </Button>
                                    <Button
                                        className={classes.largeButton}
                                        style={{ width: "150px", margin: "10px" }}
                                        variant="contained"
                                        onClick={handleDeny}
                                    >
                                        Deny
                                </Button>
                                </div>
                            )}
                            <br></br>
                            {isLoading && (<CircularProgress />)}
                             <br></br>
                            {isError && (
                                <Typography className={classes.headerText} variant="h5">
                                    There was an issue with your request, please contact us at: help@readytoactivate.com
                                </Typography>
                            )}

                            {isApproved && (
                                <>
                                    <Typography className={classes.titleText} variant="h5">
                                        You have approved item: {item.item_id}. No further action is needed.
                            </Typography>
                                    <Typography className={classes.headerText} variant="h5">
                                        You may close this window.
                            </Typography>
                                    <br></br>
                                </>
                            )}

                            {isDenied && (
                                <>
                                    <Typography className={classes.titleText} variant="h5">
                                        You have denied item: {item.item_id}. No further action is needed.
                            </Typography>
                                    <Typography className={classes.headerText} variant="h5">
                                        You may close this window.
                            </Typography>
                                </>
                            )}
                        </Grid>
                    </Grid>
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
