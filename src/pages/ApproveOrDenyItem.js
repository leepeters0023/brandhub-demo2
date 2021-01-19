import React, { useState } from "react";
import PropTypes from "prop-types";
import Logo from "../assets/RTA_Logo_Stacked.png";

import ImageWrapper from "../components/Utility/ImageWrapper";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    ...theme.global,
    logo: {
        height: "58px",
        width: "auto",
        marginLeft: "25px",
    },
}));


const ApproveOrDenyItem = ({}) => {
    const classes = useStyles();
    const [isApproved, setIsApproved] = useState(false);
    const [isDenied, setIsDenied] = useState(false)

    const handleApprove = () => {
        setIsApproved(true)
        // some stuff here that approves the item
    };

    const handleDeny = () => {
        setIsDenied(true)
        // some stuff here that denies the item
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
                        Please approve or deny this item
                     </Typography>
                    <br />
                    {(!isApproved && !isDenied) && (
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
                    {isApproved && (
                    <>
                        <Typography className={classes.titleText} variant="h5">
                            You have approved this item. No further action is needed.
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
                            You have denied this item. No further action is needed.
                        </Typography>
                         <Typography className={classes.headerText} variant="h5">
                         You may close this window.
                        </Typography>
                    </>
                    )}
                    </Grid>
                </Grid>
            </div>
            <Typography className={classes.headerText} style={{ bottom: "0",float: "right" }} variant="h5">
            need help? Email us: support@brandhub.com
            </Typography>
        </Container>
    </>
    );
};

ApproveOrDenyItem.propTypes = {
    handleFiltersClosed: PropTypes.func.isRequired,
};

export default ApproveOrDenyItem;
