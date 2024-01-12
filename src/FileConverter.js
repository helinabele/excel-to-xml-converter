import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { create } from 'xmlbuilder2';

const FileConverter = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleConversion = () => {
        if (selectedFile) {
            const fileReader = new FileReader();

            fileReader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                const xmlObj = {
                    root: {
                        rows: jsonData.map((row) => ({ row })),
                    },
                };

                const xmlString = create(xmlObj).end({ prettyPrint: true });

                // Create a Blob object from the XML string
                const blob = new Blob([xmlString], { type: 'application/xml' });

                // Create a download URL for the Blob
                const downloadUrl = URL.createObjectURL(blob);

                // Create a temporary <a> element and set the download attributes
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = 'converted.xml';

                // Programmatically click the link to trigger the download
                link.click();

                // Clean up the temporary <a> element and the download URL
                URL.revokeObjectURL(downloadUrl);
            };

            fileReader.readAsArrayBuffer(selectedFile);
        }
    };

    return (
        <div className="container">
            <h2 className="title">Excel to XML Converter</h2>

            <label htmlFor="fileInput" className="file-label">
                <span className="file-label-text">Choose File</span>
                <input type="file" id="fileInput" onChange={handleFileChange} style={{ display: 'none' }} />

            </label>
            {selectedFile && <span className="selected-file">{selectedFile.name}</span>}
            <button className="convert-btn" onClick={handleConversion}>
                Convert
            </button>
        </div>
    );
};

export default FileConverter;