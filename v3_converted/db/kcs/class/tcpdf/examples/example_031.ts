//============================================================+
//File name   : example_031.php
//Begin       : 2008-06-09
//Last Update : 2010-08-08
//
//Description : Example 031 for TCPDF class
//Pie Chart
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
//@abstract TCPDF - Example: Pie Chart
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
//set font
//add a page
//write labels
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
pdf.SetTitle("TCPDF Example 031");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 031", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "B", 20);
pdf.AddPage();
pdf.Write(0, "Example of PieSector() method.");
var xc = 105;
var yc = 100;
var r = 50;
pdf.SetFillColor(0, 0, 255);
pdf.PieSector(xc, yc, r, 20, 120, "FD", false, 0, 2);
pdf.SetFillColor(0, 255, 0);
pdf.PieSector(xc, yc, r, 120, 250, "FD", false, 0, 2);
pdf.SetFillColor(255, 0, 0);
pdf.PieSector(xc, yc, r, 250, 20, "FD", false, 0, 2);
pdf.SetTextColor(255, 255, 255);
pdf.Text(105, 65, "BLUE");
pdf.Text(60, 95, "GREEN");
pdf.Text(120, 115, "RED");
pdf.Output("example_031.pdf", "I");