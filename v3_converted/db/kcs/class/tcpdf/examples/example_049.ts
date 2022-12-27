//============================================================+
//File name   : example_049.php
//Begin       : 2009-04-03
//Last Update : 2011-05-12
//
//Description : Example 049 for TCPDF class
//WriteHTML with TCPDF callback functions
//
//Author: Nicola Asuni
//
//(c) Copyright:
//Nicola Asuni
//Tecnick.com LTD
//Manor Coach House, Church Hill
//Aldershot, Hants, GU12 4RQ
//UK
//www.tecnick.com
//info@tecnick.com
//============================================================+
//
//Creates an example PDF TEST document using TCPDF
//@package com.tecnick.tcpdf
//@abstract TCPDF - Example: WriteHTML with TCPDF callback functions
//@author Nicola Asuni
//@since 2008-03-04
//
//create new PDF document
//set document information
//set default header data
//set header and footer fonts
//set default monospaced font
//set margins
//set auto page breaks
//set image scale factor
//set some language-dependent strings
//---------------------------------------------------------
//set font
//add a page
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//IMPORTANT:
//If you are printing user-generated content, tcpdf tag can be unsafe.
//You can disable this tag by setting to false the K_TCPDF_CALLS_IN_HTML
//constant on TCPDF configuration file.
//For security reasons, the parameters for the 'params' attribute of TCPDF 
//tag must be prepared as an array and encoded with the 
//serializeTCPDFtagParameters() method (see the example below).
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//output the HTML content
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//reset pointer to the last page
//---------------------------------------------------------
//Close and output PDF document
//============================================================+
//END OF FILE
//============================================================+

require("../config/lang/eng.php");

require("../tcpdf.php");

var pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, "UTF-8", false);
pdf.SetCreator(PDF_CREATOR);
pdf.SetAuthor("Nicola Asuni");
pdf.SetTitle("TCPDF Example 049");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 049", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "", 10);
pdf.AddPage();
var html = "<h1>Test TCPDF Methods in HTML</h1>\n<h2 style=\"color:red;\">IMPORTANT:</h2>\n<span style=\"color:red;\">If you are printing user-generated content, tcpdf tag can be unsafe.<br />\nYou can disable this tag by setting to false the <b>K_TCPDF_CALLS_IN_HTML</b> constant on TCPDF configuration file.</span>\n<h2>write1DBarcode method in HTML</h2>";
var params = pdf.serializeTCPDFtagParameters(["CODE 39", "C39", "", "", 80, 30, 0.4, {
  position: "S",
  border: true,
  padding: 4,
  fgcolor: [0, 0, 0],
  bgcolor: [255, 255, 255],
  text: true,
  font: "helvetica",
  fontsize: 8,
  stretchtext: 4
}, "N"]);
html += "<tcpdf method=\"write1DBarcode\" params=\"" + params + "\" />";
params = pdf.serializeTCPDFtagParameters(["CODE 128", "C128", "", "", 80, 30, 0.4, {
  position: "S",
  border: true,
  padding: 4,
  fgcolor: [0, 0, 0],
  bgcolor: [255, 255, 255],
  text: true,
  font: "helvetica",
  fontsize: 8,
  stretchtext: 4
}, "N"]);
html += "<tcpdf method=\"write1DBarcode\" params=\"" + params + "\" />";
html += "<tcpdf method=\"AddPage\" /><h2>Graphic Functions</h2>";
params = pdf.serializeTCPDFtagParameters([0]);
html += "<tcpdf method=\"SetDrawColor\" params=\"" + params + "\" />";
params = pdf.serializeTCPDFtagParameters([50, 50, 40, 10, "DF", Array(), [0, 128, 255]]);
html += "<tcpdf method=\"Rect\" params=\"" + params + "\" />";
pdf.writeHTML(html, true, 0, true, 0);
pdf.lastPage();
pdf.Output("example_049.pdf", "I");