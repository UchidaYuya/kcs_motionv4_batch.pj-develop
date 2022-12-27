//============================================================+
//File name   : example_035.php
//Begin       : 2008-07-22
//Last Update : 2010-08-08
//
//Description : Example 035 for TCPDF class
//Line styles with cells and multicells
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
//@abstract TCPDF - Example: Line styles with cells and multicells
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
pdf.SetTitle("TCPDF Example 035");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 035", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("times", "BI", 16);
pdf.AddPage();
pdf.Write(0, "Example of SetLineStyle() method", "", 0, "L", true, 0, false, false, 0);
pdf.Ln();
pdf.SetLineStyle({
  width: 0.5,
  cap: "butt",
  join: "miter",
  dash: 4,
  color: [255, 0, 0]
});
pdf.SetFillColor(255, 255, 128);
pdf.SetTextColor(0, 0, 128);
var text = "DUMMY";
pdf.Cell(0, 0, text, 1, 1, "L", 1, 0);
pdf.Ln();
pdf.SetLineStyle({
  width: 0.5,
  cap: "butt",
  join: "miter",
  dash: 0,
  color: [0, 0, 255]
});
pdf.SetFillColor(255, 255, 0);
pdf.SetTextColor(0, 0, 255);
pdf.MultiCell(60, 4, text, 1, "C", 1, 0);
pdf.SetLineStyle({
  width: 0.5,
  cap: "butt",
  join: "miter",
  dash: 0,
  color: [255, 255, 0]
});
pdf.SetFillColor(0, 0, 255);
pdf.SetTextColor(255, 255, 0);
pdf.MultiCell(60, 4, text, "TB", "C", 1, 0);
pdf.SetLineStyle({
  width: 0.5,
  cap: "butt",
  join: "miter",
  dash: 0,
  color: [255, 0, 255]
});
pdf.SetFillColor(0, 255, 0);
pdf.SetTextColor(255, 0, 255);
pdf.MultiCell(60, 4, text, 1, "C", 1, 1);
pdf.Output("example_035.pdf", "I");