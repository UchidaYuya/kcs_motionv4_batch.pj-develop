//============================================================+
//File name   : example_029.php
//Begin       : 2008-06-09
//Last Update : 2010-08-08
//
//Description : Example 029 for TCPDF class
//Set PDF viewer display preferences.
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
//@abstract TCPDF - Example: Set PDF viewer display preferences.
//@author Nicola Asuni
//@since 2008-06-09
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
//set array for viewer preferences
//Check the example n. 60 for advanced page settings
//set pdf viewer preferences
//set font
//add a page
//print a line
//add a page
//print a line
//add a page
//print a line
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
pdf.SetTitle("TCPDF Example 029");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 029", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
var preferences = {
	HideToolbar: true,
	HideMenubar: true,
	HideWindowUI: true,
	FitWindow: true,
	CenterWindow: true,
	DisplayDocTitle: true,
	NonFullScreenPageMode: "UseNone",
	ViewArea: "CropBox",
	ViewClip: "CropBox",
	PrintArea: "CropBox",
	PrintClip: "CropBox",
	PrintScaling: "AppDefault",
	Duplex: "DuplexFlipLongEdge",
	PickTrayByPDFSize: true,
	PrintPageRange: [1, 1, 2, 3],
	NumCopies: 2
};
pdf.setViewerPreferences(preferences);
pdf.SetFont("times", "", 14);
pdf.AddPage();
pdf.Cell(0, 12, "DISPLAY PREFERENCES - PAGE 1", 1, 1, "C");
pdf.Ln(5);
pdf.Write(0, "You can use the setViewerPreferences() method to change viewer preferences.", "", 0, "L", true, 0, false, false, 0);
pdf.AddPage();
pdf.Cell(0, 12, "DISPLAY PREFERENCES - PAGE 2", 0, 0, "C");
pdf.AddPage();
pdf.Cell(0, 12, "DISPLAY PREFERENCES - PAGE 3", 0, 0, "C");
pdf.Output("example_029.pdf", "I");