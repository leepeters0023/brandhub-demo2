import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
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
        //let url = window.location.pathname
        let url = '?token=TZBbCeN8IWQd_jryXKNIwAyug3gIfdsP&item_id=123&item_type_id=123'
        //new token for testing deny= nnzjkUP8WMdCMiUg6l772p_6wcojww8O
        let hash;
        let itemObj = {};
        let hashes = url.slice(url.indexOf('?') + 1).split('&');
        for (let i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            itemObj[hash[0]] = hash[1];
        }
        setItem(itemObj)
    }, [])

    const handleAction = async (status) => {
        setIsLoading(true)
        await(axios)
            .post("/public/update-status",
            {
                token: item.token,
                status: status
               })
            .then((response) => {
                console.log(response);
                setIsLoading(false);
                if (status === "approved") {
                    setIsApproved(true);
                } else if (status === "denied") {
                    setIsDenied(true);
                }
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
                setIsError(true);
            })
    };
      
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
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                            <Typography className={classes.titleText} variant="h5">
                                Please approve or deny item: {item.item_id}
                            </Typography>
                            <br />
                            {(!isLoading && !isError) && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                    }}>
                                    <Button
                                        disabled={(isApproved || isDenied) ? true : false}
                                        className={classes.largeButton}
                                        style={{ width: "150px", margin: "10px" }}
                                        variant="contained"
                                        onClick={() => handleAction("approved")}
                                    >
                                        Approve
                                </Button>
                                    <Button
                                        disabled={(isApproved || isDenied) ? true : false}
                                        className={classes.largeButton}
                                        style={{ width: "150px", margin: "10px" }}
                                        variant="contained"
                                        onClick={() => handleAction("denied")}
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

                            {(isApproved || isDenied) && (
                                <>
                                <Typography className={classes.titleText} variant="h5">
                                        You have {isApproved ? "approved" : "denied"} item: {item.item_id}. No further action is needed.
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
