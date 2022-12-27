//============================================================+
//File name   : example_045.php
//Begin       : 2008-03-04
//Last Update : 2011-04-15
//
//Description : Example 045 for TCPDF class
//Bookmarks and Table of Content
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
//@abstract TCPDF - Example: Bookmarks and Table of Content
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
//set a bookmark for the current position
//print a line using Cell()
//add some pages and bookmarks
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
//add a new page for TOC
//write the TOC title
//add a simple Table Of Content at first page
//(check the example n. 59 for the HTML version)
//end of TOC page
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
pdf.SetTitle("TCPDF Example 045");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 045", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("times", "B", 20);
pdf.AddPage();
pdf.Bookmark("Chapter 1", 0, 0, "", "B", [0, 64, 128]);
pdf.Cell(0, 10, "Chapter 1", 0, 1, "L");
pdf.AddPage();
pdf.Bookmark("Paragraph 1.1", 1, 0, "", "", [128, 0, 0]);
pdf.Cell(0, 10, "Paragraph 1.1", 0, 1, "L");
pdf.AddPage();
pdf.Bookmark("Paragraph 1.2", 1, 0, "", "", [128, 0, 0]);
pdf.Cell(0, 10, "Paragraph 1.2", 0, 1, "L");
pdf.AddPage();
pdf.Bookmark("Sub-Paragraph 1.2.1", 2, 0, "", "I", [0, 128, 0]);
pdf.Cell(0, 10, "Sub-Paragraph 1.2.1", 0, 1, "L");
pdf.AddPage();
pdf.Bookmark("Paragraph 1.3", 1, 0, "", "", [128, 0, 0]);
pdf.Cell(0, 10, "Paragraph 1.3", 0, 1, "L");

for (var i = 2; i < 12; i++) {
  pdf.AddPage();
  pdf.Bookmark("Chapter " + i, 0, 0, "", "B", [0, 64, 128]);
  pdf.Cell(0, 10, "Chapter " + i, 0, 1, "L");
}

pdf.addTOCPage();
pdf.SetFont("times", "B", 16);
pdf.MultiCell(0, 0, "Table Of Content", 0, "C", 0, 1, "", "", true, 0);
pdf.Ln();
pdf.SetFont("dejavusans", "", 12);
pdf.addTOC(1, "courier", ".", "INDEX", "B", [128, 0, 0]);
pdf.endTOCPage();
pdf.Output("example_045.pdf", "I");