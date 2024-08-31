# GetNFePDF4Gmail™

**GetNFePDF4Gmail** is a Google Apps Script designed to automate the extraction, processing, and organization of PDF files containing electronic invoices (DANFE or NF-e) from Gmail. The script efficiently handles large volumes of emails and attachments, ensuring that each invoice is properly categorized and easily accessible.

## Features

-   **Automated PDF Extraction:** Scans Gmail for emails with attachments that contain electronic invoices (NF-e or DANFE).
-   **Supplier and Client Identification:** Identifies suppliers and clients based on predefined lists.
-   **File Renaming:** Renames PDF files using a structured format: `SUPPLIER-NF-DANFE.pdf`.
-   **Organization:** Organizes PDF files into corresponding folders within Google Drive.
-   **Robust Processing:** Handles large volumes of emails, with mechanisms to pause and resume processing.

## Developed By

-   **Takk™ Innovate Studio**
-   **TeleologyHI™**
-   **David C Cavalcante**

## Script Functions

### `loadSuppliersList()`

Loads the list of predefined suppliers used to identify the sender of the invoices.

### `extractDanfe(Object filename)`

Extracts and processes the DANFE (Documento Auxiliar da Nota Fiscal Eletrônica) from the provided filename.

**Arguments:**

-   **filename:** `Object` - The filename object to be processed.

### `saveProgress(Object threadId, Object messageId, Object attachmentIndex, Object date)`

Saves the current processing state, allowing the script to resume later if needed.

**Arguments:**

-   **threadId:** `Object` - The ID of the email thread being processed.
-   **messageId:** `Object` - The ID of the specific email message.
-   **attachmentIndex:** `Object` - The index of the attachment being processed.
-   **date:** `Object` - The date of the email or attachment.

### `extractTextFromPDF(Object pdfFile)`

Extracts text content from the provided PDF file for further processing.

**Arguments:**

-   **pdfFile:** `Object` - The PDF file object to extract text from.

### `shouldPause()`

Checks if the processing should be paused based on certain conditions (e.g., volume of emails processed).

### `loadClientList()`

Loads the list of predefined clients used to identify the recipient of the invoices.

### `identifySupplier(Object pdfContent, Object suppliersList)`

Identifies the supplier from the PDF content using the predefined suppliers list.

**Arguments:**

-   **pdfContent:** `Object` - The text content extracted from the PDF.
-   **suppliersList:** `Object` - The list of predefined suppliers.

### `getOrCreateFolder(Object parentFolder, Object folderName)`

Creates a folder with the specified name within the parent folder, or retrieves it if it already exists.

**Arguments:**

-   **parentFolder:** `Object` - The parent folder where the new folder should be created.
-   **folderName:** `Object` - The name of the folder to create or retrieve.

### `startProcessing()`

Begins the processing of emails and PDF attachments according to the script's logic.

### `processAndOrganizePDFs()`

Processes each PDF attachment found in the emails, organizes them into folders, and renames them as per the defined structure.

### `identifyClient(Object pdfContent, Object clientList)`

Identifies the client from the PDF content using the predefined client list.

**Arguments:**

-   **pdfContent:** `Object` - The text content extracted from the PDF.
-   **clientList:** `Object` - The list of predefined clients.

### `processAttachment(Object attachment, Object clientList, Object suppliersList, Object pdfFolder, Object noNameFolder)`

Processes an individual attachment, identifies the supplier and client, renames the file, and organizes it into the appropriate folder.

**Arguments:**

-   **attachment:** `Object` - The attachment object to process.
-   **clientList:** `Object` - The list of predefined clients.
-   **suppliersList:** `Object` - The list of predefined suppliers.
-   **pdfFolder:** `Object` - The folder where the renamed PDF should be saved.
-   **noNameFolder:** `Object` - The fallback folder for unidentified PDFs.

### `renameFileWithDanfe(Object originalFilename, Object supplier)`

Renames the PDF file using the supplier's name and a structured format.

**Arguments:**

-   **originalFilename:** `Object` - The original filename of the PDF.
-   **supplier:** `Object` - The identified supplier for the PDF.

This script is a powerful tool for automating invoice management in Google Workspace, enhancing productivity by reducing manual processing time.

## Licence

This project is licensed under the CC0 1.0 Universal, CC-BY-4.0 Licence, and Apache-2.0.

## About Takk™ Innovate Studio

Leading the Digital Revolution as the Pioneering 100% Artificial Intelligence Team.

-   Author: [David C Cavalcante](mailto:davcavalcante@proton.me)
-   LinkedIn: [linkedin.com/in/hellodav](https://www.linkedin.com/in/hellodav/)
-   X: [@Takk8IS](https://twitter.com/takk8is/)
-   Medium: [takk8is.medium.com](https://takk8is.medium.com/)
-   Website: [takk.ag](https://takk.ag/)
