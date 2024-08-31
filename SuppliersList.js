// SuppliersList.js
//
// Project: GetNFePDF4Gmail
// Version: 1.0.0
// License: Apache-2.0
// This project is licensed by Takk™ Innovate Studio, TeleologyHI™, and David C Cavalcante.
//
// Description: This Google Apps Script automates the extraction, processing, and organization of PDF files containing electronic invoices (DANFE or NF-e) from Gmail. It scans emails for attachments, identifies the sender (supplier) and recipient (client) based on predefined lists, and renames the PDF files using a structured format: SUPPLIER-NF-DANFE.pdf. The script organizes the files into corresponding folders within Google Drive, ensuring that each invoice is properly categorized and easily accessible. The process is efficient, with built-in mechanisms to handle large volumes of emails and attachments, ensuring continuity even when processing must be paused and resumed.
//
// Author: David C Cavalcante
// LinkedIn: https://www.linkedin.com/in/hellodav/
// Company: Takk™ Innovate Studio
// URL: https://github.com/Takk8IS/
// Donation: USDT (TRC-20) `TGpiWetnYK2VQpxNGPR27D9vfM6Mei5vNA`

function loadSuppliersList() {
    return {
        23897013000100: "SUPPLIER NAME BUSINESS LTDA",
        58724236000150: "SUPPLIER NAME BUSINESS SA",
    };
}
