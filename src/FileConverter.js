import React, { useState } from "react";
import { create } from "xmlbuilder2";
import * as XLSX from "xlsx";
import { getDocument } from "pdfjs-dist/legacy/build/pdf";

import FileIcon from "./FileIcon";
import Loader from "./Loader";

const FileConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage("");
    }
  };

  const convertExcelToXML = (data) => {
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const xmlObj = {
      root: { rows: jsonData.map((row) => ({ row })) },
    };

    return create(xmlObj).end({ prettyPrint: true });
  };

  const convertPDFToXML = async (data) => {
    const pdf = await getDocument({ data }).promise;
    const pages = await Promise.all(
      Array.from({ length: pdf.numPages }, (_, i) =>
        pdf.getPage(i + 1).then((page) => page.getTextContent())
      )
    );

    const extractedText = pages.map((content) =>
      content.items.map((item) => item.str).join(" ")
    );

    const xmlObj = { root: { pages: extractedText } };
    return create(xmlObj).end({ prettyPrint: true });
  };

  const handleConversion = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file to convert.");
      return;
    }

    setIsConverting(true);
    try {
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        let xmlString = "";

        if (selectedFile.name.endsWith(".xlsx")) {
          xmlString = convertExcelToXML(data);
        } else if (selectedFile.name.endsWith(".pdf")) {
          xmlString = await convertPDFToXML(data);
        } else {
          throw new Error("Unsupported file type. Please upload a PDF or Excel file.");
        }

        const blob = new Blob([xmlString], { type: "application/xml" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "converted.xml";
        link.click();
        URL.revokeObjectURL(link.href);
      };

      fileReader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsConverting(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setErrorMessage("");
    document.getElementById("fileInput").value = null;
  };

  return (
    <div className="container">
      <h2 className="title">File Converter</h2>

      <label htmlFor="fileInput" className="file-label">
        <FileIcon />
        <span>Choose File</span>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".pdf, .xlsx"
        />
      </label>

      {selectedFile && <span className="selected-file">{selectedFile.name}</span>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="action-btn">
        <button
          className="convert-btn"
          onClick={handleConversion}
          disabled={isConverting}
          aria-busy={isConverting}
        >
          {isConverting ? <Loader /> : "Convert"}
        </button>
        <button className="clear-btn" onClick={handleClear} disabled={isConverting}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default FileConverter;
