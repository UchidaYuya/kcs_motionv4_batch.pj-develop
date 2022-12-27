//============================================================+
//File name   : example_040.php
//Begin       : 2008-10-28
//Last Update : 2010-08-31
//
//Description : Example 040 for TCPDF class
//Booklet mode (double-sided pages)
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
//@abstract TCPDF - Example: Booklet mode (double-sided pages)
//@author Nicola Asuni
//@since 2008-10-28
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
//set display mode
//set pdf viewer preferences
//set booklet mode
//set core font
//add a page (left page)
//print a line using Cell()
//add a page (right page)
//print a line using Cell()
//add a page (left page)
//print a line using Cell()
//add a page (right page)
//print a line using Cell()
//---------------------------------------------------------
//Close and output PDF document
//============================================================+
//END OF FILE
//============================================================+
var zoom, layout, mode;

require("../config/lang/eng.php");

require("../tcpdf.php");

var pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, "UTF-8", false);
pdf.SetCreator(PDF_CREATOR);
pdf.SetAuthor("Nicola Asuni");
pdf.SetTitle("TCPDF Example 040");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 040", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetDisplayMode(zoom = "fullpage", layout = "TwoColumnRight", mode = "UseNone");
pdf.setViewerPreferences({
  Duplex: "DuplexFlipLongEdge"
});
pdf.SetBooklet(true, 10, 30);
pdf.SetFont("helvetica", "", 18);
pdf.AddPage();
pdf.Write(0, "Example of booklet mode", "", 0, "L", true, 0, false, false, 0);
pdf.Cell(0, 0, "PAGE 1", 1, 1, "C");
pdf.AddPage();
pdf.Cell(0, 0, "PAGE 2", 1, 1, "C");
pdf.AddPage();
pdf.Cell(0, 0, "PAGE 3", 1, 1, "C");
pdf.AddPage();
pdf.Cell(0, 0, "PAGE 4", 1, 1, "C");
pdf.Output("example_040.pdf", "I");