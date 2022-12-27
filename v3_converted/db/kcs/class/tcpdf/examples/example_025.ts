//============================================================+
//File name   : example_025.php
//Begin       : 2008-03-04
//Last Update : 2010-08-08
//
//Description : Example 025 for TCPDF class
//Object Transparency
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
//@abstract TCPDF - Example: Object Transparency
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
// setAlpha() gives transparency support. You can set the
// alpha channel from 0 (fully transparent) to 1 (fully
// opaque). It applies to all elements (text, drawings,
// images).
//draw opaque red square
//set alpha to semi-transparency
//draw green square
//draw blue square
//draw jpeg image
//restore full opacity
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
pdf.SetTitle("TCPDF Example 025");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 025", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "", 12);
pdf.AddPage();
var txt = "You can set the transparency of PDF objects using the setAlpha() method.";
pdf.Write(0, txt, "", 0, "", true, 0, false, false, 0);
pdf.SetLineWidth(2);
pdf.SetFillColor(255, 0, 0);
pdf.SetDrawColor(127, 0, 0);
pdf.Rect(30, 40, 60, 60, "DF");
pdf.SetAlpha(0.5);
pdf.SetFillColor(0, 255, 0);
pdf.SetDrawColor(0, 127, 0);
pdf.Rect(50, 60, 60, 60, "DF");
pdf.SetFillColor(0, 0, 255);
pdf.SetDrawColor(0, 0, 127);
pdf.Rect(70, 80, 60, 60, "DF");
pdf.Image("../images/image_demo.jpg", 90, 100, 60, 60, "", "http://www.tcpdf.org", "", true, 72);
pdf.SetAlpha(1);
pdf.Output("example_025.pdf", "I");