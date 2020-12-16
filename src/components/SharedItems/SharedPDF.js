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
    justifyContent: "space-around",
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 12,
  },
  section: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: 600,
    height: 225,
  },
  imageSection: {
    width: 360,
  },
  image: {
    objectFit: "contain",
  },
  textSection: {
    width: 240,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

const SharedPDF = ({ items }) => {
  return (
    <Document>
      {items.map((group, index) => (
        <Page key={index} size="LETTER" style={styles.page}>
          {group.map((item, i) => (
            <View key={`${index}-${i}`} style={styles.section}>
              <View style={styles.imageSection}>
                <Image
                  source={{
                    uri: item.imgUrlLg,
                    method: "get",
                    headers: {
                      "Access-Control-Allow-Origin": "*",
                      crossOrigin: "anonymous",
                    },
                  }}
                  cache="reload"
                  allowDangerousPaths={true}
                  style={styles.image}
                />
              </View>
              <View style={styles.textSection}>
                <Text style={styles.text}>{`#${item.sequenceNum}`}</Text>
                <Text style={styles.text}>{`Brand(s):  ${item.brand}`}</Text>
                <Text style={styles.text}>
                  {`Program:  ${item.program} Winter 2021`}
                </Text>
                <Text style={styles.text}>
                  {`Item Type:  ${item.itemType}`}
                </Text>
                <Text style={styles.text}>
                  {`Item Description:  ${item.itemDescription}`}
                </Text>
                <Text style={styles.text}>
                  {`In Market: ${item.inMarketDate}`}
                </Text>
              </View>
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};

export default SharedPDF;
