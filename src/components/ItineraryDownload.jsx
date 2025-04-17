import React from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#0B3D20",
  },
  section: {
    marginBottom: 12,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 4,
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
  return text.replace(/\*\*(.*?)\*\*/g, "$1");  // Remove all **bold** syntax
};

const parseItineraryToLines = (text) => {
  const cleanedText = cleanItineraryText(text);
  const lines = cleanedText.split("\n").filter(line => line.trim() !== "");

  return lines.map((line, index) => {
    if (/^\* Day \d+/.test(line.trim())) {
      return (
        <View key={index} style={{ marginTop: 30, marginBottom: 10 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#0B3D20',
            }}
          >
            {line.replace(/^\* /, "")}
          </Text>
        </View>
      );
    }
    if (line.trim().startsWith("* ")) {
      return (
        <View key={index} style={{ flexDirection: 'row', marginBottom: 6 }}>
          <Text style={{ marginRight: 6 }}>•</Text>
          <Text>{line.replace("* ", "")}</Text>
        </View>
      );
    }
    return (
      <Text key={index} style={{ marginBottom: 6 }}>
        {line}
      </Text>
    );
  });
};





// PDF Document
const ItineraryDocument = ({ itinerary }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Your Personalized Travel Itinerary</Text>
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
        className="bg-[#295b42] text-white px-6 py-2 rounded hover:bg-[#0B3D20]"
      >
        {({ loading }) =>
          loading ? "Preparing document..." : "Download Your Itinerary 📄"
        }
      </PDFDownloadLink>
    </div>
  );
};



export default ItineraryDownload;
