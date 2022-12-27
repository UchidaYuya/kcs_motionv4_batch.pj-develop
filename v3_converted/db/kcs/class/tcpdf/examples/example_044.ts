//============================================================+
//File name   : example_044.php
//Begin       : 2009-01-02
//Last Update : 2010-08-08
//
//Description : Example 044 for TCPDF class
//Move, copy and delete pages
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
//@abstract TCPDF - Example: Move, copy and delete pages
//@author Nicola Asuni
//@since 2009-01-02
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
//print a line using Cell()
//add some vertical space
//print some text
//Move page 7 to page 3
//Delete page 6
//copy the second page
//NOTE: to insert a page to a previous position, you can add a new page to the end of document and then move it using movePage().
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
pdf.SetTitle("TCPDF Example 044");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 044", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "B", 40);
pdf.AddPage();
pdf.Cell(0, 10, "PAGE: A", 0, 1, "L");
pdf.Ln(10);
pdf.SetFont("times", "I", 16);
var txt = "TCPDF allows you to Copy, Move and Delete pages.";
pdf.Write(0, txt, "", 0, "L", true, 0, false, false, 0);
pdf.SetFont("helvetica", "B", 40);
pdf.AddPage();
pdf.Cell(0, 10, "PAGE: B", 0, 1, "L");
pdf.AddPage();
pdf.Cell(0, 10, "PAGE: D", 0, 1, "L");
pdf.AddPage();
pdf.Cell(0, 10, "PAGE: E", 0, 1, "L");
pdf.AddPage();
pdf.Cell(0, 10, "PAGE: E-2", 0, 1, "L");
pdf.AddPage();
pdf.Cell(0, 10, "PAGE: F", 0, 1, "L");
pdf.AddPage();
pdf.Cell(0, 10, "PAGE: C", 0, 1, "L");
pdf.AddPage();
pdf.Cell(0, 10, "PAGE: G", 0, 1, "L");
pdf.movePage(7, 3);
pdf.deletePage(6);
pdf.AddPage();
pdf.Cell(0, 10, "PAGE: H", 0, 1, "L");
pdf.copyPage(2);
pdf.Output("example_044.pdf", "I");