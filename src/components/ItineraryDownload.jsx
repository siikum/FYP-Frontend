import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import logo from "../assets/images/logo.png";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
    backgroundColor: "#dfece2", // Soft green background
  },
  logoContainer: {
    marginBottom: 10,
    textAlign: "center",
  },
  logoImage: {
    width: 150,
    height: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: "#0B3D20",
  },
  separator: {
    borderBottom: "1 solid #0B3D20",
    marginVertical: 10,
    marginBottom: 20,
  },
  section: {
    marginBottom: 14,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bulletSymbol: {
    marginRight: 6,
    color: "#0B3D20",
  },
  bulletText: {
    flex: 1,
  },
});

// Helper to clean up Markdown (**bold**) from text
const cleanItineraryText = (text) => {
  return text.replace(/\*\*(.*?)\*\*/g, "$1"); // Remove all **bold** syntax
};

const parseItineraryToLines = (text) => {
  const cleanedText = cleanItineraryText(text);
  const lines = cleanedText.split("\n").filter((line) => line.trim() !== "");

  return lines.map((line, index) => {
    if (/^\* Day \d+/.test(line.trim())) {
      return (
        <View key={index} style={{ marginTop: 20, marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "#0B3D20",
            }}
          >
            {line.replace(/^\* /, "")}
          </Text>
        </View>
      );
    }
    if (line.trim().startsWith("* ")) {
      return (
        <View key={index} style={{ flexDirection: "row", marginBottom: 6 }}>
          <Text style={{ marginRight: 6 }}>•</Text>
          <Text>{line.replace("* ", "")}</Text>
        </View>
      );
    }
    return (
      <Text key={index} style={{ marginBottom: 8 }}>
        {line}
      </Text>
    );
  });
};

// PDF Document
const ItineraryDocument = ({ itinerary }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image style={styles.logoImage} src={logo} />
      </View>

      {/* Title */}
      <Text style={styles.title}>Your Personalized Travel Itinerary</Text>

      {/* Separator Line */}
      <View style={styles.separator} />

      {/* Itinerary Content */}
      {parseItineraryToLines(itinerary)}
    </Page>
  </Document>
);

// Component
const ItineraryDownload = ({ itinerary }) => {
  return (
    <div className="flex justify-center mt-4">
      <PDFDownloadLink
        document={<ItineraryDocument itinerary={itinerary} />}
        fileName="itinerary.pdf"
        className=" bg-[#295b42] text-white px-6 py-2 rounded hover:bg-[#0B3D20]"
      >
        {({ loading }) =>
          loading ? "Preparing document..." : "Download Your Itinerary 📄"
        }
      </PDFDownloadLink>
    </div>
  );
};

export default ItineraryDownload;
