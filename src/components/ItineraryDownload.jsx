import React from "react";
import { jsPDF } from "jspdf";

const ItineraryDownload = ({ itinerary }) => {
  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    const margin = 15;
    const maxWidth = 180; 
    const lineHeight = 8;
    let yPosition = 20; 

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Your Travel Itinerary", margin, yPosition);
    yPosition += 12; 

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // ✅ FIX: Proper bullet formatting & no extra '*'
    const formatText = (text) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, "\n@@BOLD@@$1@@/BOLD@@\n") 
        .replace(/\*(?!\s)(.*?)\*/g, "\n@@ITALIC@@$1@@/ITALIC@@\n") 
        .replace(/^\s*\*\s(.*)/gm, "@@BULLET@@$1"); 
    };

    const textLines = formatText(itinerary).split("\n");

    textLines.forEach((line) => {
      if (line.startsWith("@@BOLD@@")) {
        doc.setFont("helvetica", "bold");
        doc.text(line.replace(/@@BOLD@@|@@\/BOLD@@/g, ""), margin, yPosition, { maxWidth });
      } else if (line.startsWith("@@ITALIC@@")) {
        doc.setFont("helvetica", "italic");
        doc.text(line.replace(/@@ITALIC@@|@@\/ITALIC@@/g, ""), margin, yPosition, { maxWidth });
      } else if (line.startsWith("@@BULLET@@")) {
        doc.setFont("helvetica", "normal");
        doc.text("• " + line.replace("@@BULLET@@", ""), margin, yPosition, { maxWidth });
      } else {
        doc.setFont("helvetica", "normal");
        doc.text(line, margin, yPosition, { maxWidth });
      }

      yPosition += lineHeight;
      if (yPosition + lineHeight > 280) {
        doc.addPage();
        yPosition = margin;
      }
    });

    doc.save("itinerary.pdf");
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handleDownload}
        className="bg-[#295b42] text-white px-6 py-2 rounded hover:bg-[#0B3D20]"
      >
        Download Your Itinerary 📄
      </button>
    </div>
  );
};

export default ItineraryDownload;
