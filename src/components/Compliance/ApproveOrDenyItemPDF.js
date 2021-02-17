import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    Image,
    Font,
    StyleSheet,
} from "@react-pdf/renderer";


Font.register({
    family: "Roboto",
    src: "/fonts/Roboto-Regular.ttf",
});

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        alignItems: "center",
        justifyItems: "center",
        marginTop: 25,
    },
    text: {
        fontFamily: "Roboto",
        fontSize: 10,
    },
    sectionWrapper: {
        display: "flex",
        flexDirection: "column",
        width: 600,
        heigth: 230,
        alignItems: "center",
    },
    imageSection: {
        display: "flex",
        alignSelf: "flex-start",
        justifySelf: "flex-start",
        width: 195,
        marginLeft: 20,
    },
    image: {
        objectFit: "contain",
    },
    textSection: {
        width: 190,
        height: 225,
        lineHeight: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    },
});

const ApproveOrDenyItemPDF = ({ itemNumber, token, status, notes }) => {
    const date = new Date();
    const dateString = date.toDateString();
    const time = date.toLocaleTimeString();

    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                <View style={styles.imageSection}>
                    <Image
                        source="https://res.cloudinary.com/brandhub/image/upload/v1612467445/prod/gallo_logo_bxfey2.png"
                        style={styles.image}
                    />
                </View>
                <View style={styles.sectionWrapper}>
                    <View style={styles.textSection}>
                        <Text style={styles.text}>Gallo Item Number: {itemNumber}</Text>
                        <Text style={styles.text}>Compliance Status: {status}</Text>
                        <Text style={styles.text}>Verification number: {token}</Text>
                        <Text style={styles.text}>{status[0].toUpperCase() + status.slice(1)} on: {dateString}, {time}</Text>
                        <Text style={styles.text}>Notes: {notes}</Text>   
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ApproveOrDenyItemPDF;
