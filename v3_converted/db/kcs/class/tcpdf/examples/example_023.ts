//============================================================+
//File name   : example_023.php
//Begin       : 2008-03-04
//Last Update : 2010-08-08
//
//Description : Example 023 for TCPDF class
//Page Groups
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
//@abstract TCPDF - Example: Page Groups.
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
//Start First Page Group
//add a page
//set some text to print
//print a block of text using Write()
//add second page
//Start Second Page Group
//add some pages
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
pdf.SetTitle("TCPDF Example 023");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 023", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("times", "BI", 14);
pdf.startPageGroup();
pdf.AddPage();
var txt = `Example of page groups.\nCheck the page numbers on the page footer.\n\nThis is the first page of group 1.\n`;
pdf.Write(0, txt, "", 0, "L", true, 0, false, false, 0);
pdf.AddPage();
pdf.Cell(0, 10, "This is the second page of group 1", 0, 1, "L");
pdf.startPageGroup();
pdf.AddPage();
pdf.Cell(0, 10, "This is the first page of group 2", 0, 1, "L");
pdf.AddPage();
pdf.Cell(0, 10, "This is the second page of group 2", 0, 1, "L");
pdf.AddPage();
pdf.Cell(0, 10, "This is the third page of group 2", 0, 1, "L");
pdf.AddPage();
pdf.Cell(0, 10, "This is the fourth page of group 2", 0, 1, "L");
pdf.Output("example_023.pdf", "I");