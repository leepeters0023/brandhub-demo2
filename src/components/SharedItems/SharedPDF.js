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

import { formatMoney } from "../../utility/utilityFunctions";

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
    fontSize: 10,
  },
  sectionWrapper: {
    display: "flex",
    flexDirection: "column",
    width: 600,
    heigth: 230,
    alignItems: "center",
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
    width: 300,
    padding: 20,
  },
  image: {
    objectFit: "contain",
  },
  textSection: {
    width: 300,
    height: 225,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  pageBreak: {
    width: 600,
    height: 2,
    marginTop: 10,
    backgroundColor: "black",
  },
});

const SharedPDF = ({ items }) => {
  return (
    <Document>
      {items.map((group, index) => (
        <Page key={index} size="LETTER" style={styles.page}>
          {group.map((item, i) => (
            <View key={`${index}-${i}`} style={styles.sectionWrapper}>
              <View style={styles.section}>
                <View style={styles.imageSection}>
                  <Image
                    source={{
                      uri: item.imgUrlLg[0],
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
                  <Text style={styles.text}>{`#${item.itemNumber}`}</Text>
                  <Text style={styles.text}>{`Brand(s):  ${item.brand}`}</Text>
                  <Text style={styles.text}>{`Program:  ${item.program}`}</Text>
                  <Text style={styles.text}>
                    {`Item Type:  ${item.itemType}`}
                  </Text>
                  <Text style={styles.text}>
                    {`Item Description:  ${item.itemDescription}`}
                  </Text>
                  <Text style={styles.text}>
                    {`Pack Size: ${item.packSize}`}
                  </Text>
                  <Text style={styles.text}>
                    {`Est Cost: ${formatMoney(item.estCost)}`}
                  </Text>
                  <Text style={styles.text}>
                    {`In Market: ${item.inMarketDate}`}
                  </Text>
                </View>
              </View>
              {i !== group.length - 1 && <View style={styles.pageBreak} />}
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};

export default SharedPDF;
