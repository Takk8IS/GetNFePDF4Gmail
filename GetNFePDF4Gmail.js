// GetNFePDF4Gmail.js
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

var EXECUTION_TIME_LIMIT = 5 * 60 * 1000;
var START_TIME;

function startProcessing() {
    var scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty("lastProcessedDate", "");
    scriptProperties.setProperty("lastProcessedThreadId", "");
    scriptProperties.setProperty("lastProcessedMessageId", "");
    scriptProperties.setProperty("lastProcessedAttachmentIndex", "");

    processAndOrganizePDFs();
}

function processAndOrganizePDFs() {
    START_TIME = new Date().getTime();

    var scriptProperties = PropertiesService.getScriptProperties();
    var lastProcessedDate =
        scriptProperties.getProperty("lastProcessedDate") || "";
    var lastProcessedThreadId =
        scriptProperties.getProperty("lastProcessedThreadId") || "";
    var lastProcessedMessageId =
        scriptProperties.getProperty("lastProcessedMessageId") || "";
    var lastProcessedAttachmentIndex = parseInt(
        scriptProperties.getProperty("lastProcessedAttachmentIndex") || "-1",
    );

    try {
        var clientList = loadClientList();
        var suppliersList = loadSuppliersList();
        var downloadsFolder = getOrCreateFolder(
            DriveApp.getRootFolder(),
            "Downloads",
        );
        var pdfFolder = getOrCreateFolder(downloadsFolder, "PDF");
        var noNameFolder = getOrCreateFolder(pdfFolder, "NO NAME");

        var searchQuery =
            'subject:(DANFE OR "Nota Fiscal Eletrônica" OR "NF-e" OR NFe) has:attachment after:' +
            (lastProcessedDate || "2000/01/01");
        var threads = GmailApp.search(searchQuery);

        for (var i = 0; i < threads.length; i++) {
            var thread = threads[i];
            if (thread.getId() < lastProcessedThreadId) continue;

            var messages = thread.getMessages();
            for (var j = 0; j < messages.length; j++) {
                var message = messages[j];
                if (
                    thread.getId() === lastProcessedThreadId &&
                    message.getId() < lastProcessedMessageId
                )
                    continue;

                var attachments = message.getAttachments();
                for (
                    var k =
                        thread.getId() === lastProcessedThreadId &&
                        message.getId() === lastProcessedMessageId
                            ? lastProcessedAttachmentIndex + 1
                            : 0;
                    k < attachments.length;
                    k++
                ) {
                    var attachment = attachments[k];

                    if (attachment.getContentType() === "application/pdf") {
                        processAttachment(
                            attachment,
                            clientList,
                            suppliersList,
                            pdfFolder,
                            noNameFolder,
                        );
                    }

                    if (shouldPause()) {
                        saveProgress(
                            thread.getId(),
                            message.getId(),
                            k,
                            message.getDate().toISOString().split("T")[0],
                        );
                        ScriptApp.newTrigger("processAndOrganizePDFs")
                            .timeBased()
                            .after(1000 * 60)
                            .create();
                        return;
                    }
                }

                lastProcessedAttachmentIndex = -1;
            }

            lastProcessedMessageId = "";
        }

        Logger.log("Processing completed successfully.");
        scriptProperties.deleteAllProperties();
    } catch (error) {
        Logger.log("Error processing: " + error.message);
        saveProgress(
            lastProcessedThreadId,
            lastProcessedMessageId,
            lastProcessedAttachmentIndex,
            lastProcessedDate,
        );
        ScriptApp.newTrigger("processAndOrganizePDFs")
            .timeBased()
            .after(1000 * 60)
            .create();
    }
}

function processAttachment(
    attachment,
    clientList,
    suppliersList,
    pdfFolder,
    noNameFolder,
) {
    var pdfContent = extractTextFromPDF(attachment);
    var client = identifyClient(pdfContent, clientList);
    var supplier = identifySupplier(pdfContent, suppliersList);

    var targetFolder;
    var originalFilename = attachment.getName();

    if (client) {
        var clientFolder = getOrCreateFolder(pdfFolder, client);
        if (supplier) {
            targetFolder = getOrCreateFolder(clientFolder, supplier);
        } else {
            targetFolder = getOrCreateFolder(clientFolder, "Unknown Supplier");
        }
    } else {
        targetFolder = noNameFolder;
    }

    var file = targetFolder.createFile(attachment.copyBlob());
    var newFilename = renameFileWithDanfe(originalFilename, supplier);
    file.setName(newFilename);

    if (client && supplier) {
        Logger.log(
            "Saved in: " + client + "/" + supplier + " - File: " + newFilename,
        );
    } else if (client) {
        Logger.log(
            "Saved in: " + client + "/Unknown Supplier - File: " + newFilename,
        );
    } else {
        Logger.log("Saved in: NO NAME - File: " + newFilename);
    }
}

function renameFileWithDanfe(originalFilename, supplier) {
    var danfe = extractDanfe(originalFilename);
    if (danfe) {
        return supplier
            ? supplier + "-NF-" + danfe + ".pdf"
            : "UNKNOWN-NF-" + danfe + ".pdf";
    }
    // Keep the original name if you can't extract DANFE
    return originalFilename;
}

function extractDanfe(filename) {
    var match = filename.match(/(\d{9})[-\.]?[^.]*\.pdf$/);
    return match ? match[1] : null;
}

function shouldPause() {
    return new Date().getTime() - START_TIME > EXECUTION_TIME_LIMIT;
}

function saveProgress(threadId, messageId, attachmentIndex, date) {
    var scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty("lastProcessedThreadId", threadId);
    scriptProperties.setProperty("lastProcessedMessageId", messageId);
    scriptProperties.setProperty(
        "lastProcessedAttachmentIndex",
        attachmentIndex.toString(),
    );
    scriptProperties.setProperty("lastProcessedDate", date);
}

function extractTextFromPDF(pdfFile) {
    return pdfFile.getDataAsString();
}

function identifyClient(pdfContent, clientList) {
    var unformattedContent = pdfContent.replace(/[.\-\/]/g, "");

    for (var cnpj in clientList) {
        var unformattedCNPJ = cnpj.replace(/[.\-\/]/g, "");
        if (unformattedContent.includes(unformattedCNPJ)) {
            return clientList[cnpj];
        }
    }

    for (var cnpj in clientList) {
        var unformattedCNPJ = cnpj.replace(/[.\-\/]/g, "");
        if (unformattedContent.includes(unformattedCNPJ.substring(0, 8))) {
            return clientList[cnpj];
        }
    }

    return null;
}

function identifySupplier(pdfContent, suppliersList) {
    var unformattedContent = pdfContent.replace(/[.\-\/]/g, "");

    for (var cnpj in suppliersList) {
        var unformattedCNPJ = cnpj.replace(/[.\-\/]/g, "");
        if (unformattedContent.includes(unformattedCNPJ)) {
            return suppliersList[cnpj];
        }
    }

    for (var cnpj in suppliersList) {
        var unformattedCNPJ = cnpj.replace(/[.\-\/]/g, "");
        if (unformattedContent.includes(unformattedCNPJ.substring(0, 8))) {
            return suppliersList[cnpj];
        }
    }

    var supplierMatch = pdfContent.match(/supplier\s*:\s*([A-Za-z0-9\s]+)/i);
    if (supplierMatch) {
        return supplierMatch[1].trim();
    }

    var alternateMatch = pdfContent.match(/issuer\s*:\s*([A-Za-z0-9\s]+)/i);
    return alternateMatch ? alternateMatch[1].trim() : null;
}

function getOrCreateFolder(parentFolder, folderName) {
    var subFolders = parentFolder.getFoldersByName(folderName);
    if (subFolders.hasNext()) {
        return subFolders.next();
    } else {
        return parentFolder.createFolder(folderName);
    }
}

function loadClientList() {
    return ClientsList;
}

function loadSuppliersList() {
    return SuppliersList;
}
