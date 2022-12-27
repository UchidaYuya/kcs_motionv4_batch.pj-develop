//============================================================+
//File name   : example_062.php
//Begin       : 2010-08-25
//Last Update : 2011-08-04
//
//Description : Example 062 for TCPDF class
//XObject Template
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
//@abstract TCPDF - Example: XObject Template
//@author Nicola Asuni
//@since 2010-08-25
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
// An XObject Template is a PDF block that is a self-contained
// description of any sequence of graphics objects (including path
// objects, text objects, and sampled images).
// An XObject Template may be painted multiple times, either on
// several pages or at several locations on the same page and produces
// the same results each time, subject only to the graphics state at
// the time it is invoked.
//start a new XObject Template and set transparency group option
//create Template content
//...................................................................
//Start Graphic Transformation
//set clipping mask
//draw jpeg image to be clipped
//Stop Graphic Transformation
//print a text
//...................................................................
//end the current Template
//print the selected Template various times using various transparencies
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
pdf.SetTitle("TCPDF Example 062");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 062", PDF_HEADER_STRING);
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
pdf.Write(0, "XObject Templates", "", 0, "C", 1, 0, false, false, 0);
var template_id = pdf.startTemplate(60, 60, true);
pdf.StartTransform();
pdf.StarPolygon(30, 30, 29, 10, 3, 0, 1, "CNZ");
pdf.Image("../images/image_demo.jpg", 0, 0, 60, 60, "", "", "", true, 72, "", false, false, 0, false, false, false);
pdf.StopTransform();
pdf.SetXY(0, 0);
pdf.SetFont("times", "", 40);
pdf.SetTextColor(255, 0, 0);
pdf.Cell(60, 60, "Template", 0, 0, "C", false, "", 0, false, "T", "M");
pdf.endTemplate();
pdf.SetAlpha(0.4);
pdf.printTemplate(template_id, 15, 50, 20, 20, "", "", false);
pdf.SetAlpha(0.6);
pdf.printTemplate(template_id, 27, 62, 40, 40, "", "", false);
pdf.SetAlpha(0.8);
pdf.printTemplate(template_id, 55, 85, 60, 60, "", "", false);
pdf.SetAlpha(1);
pdf.printTemplate(template_id, 95, 125, 80, 80, "", "", false);
pdf.Output("example_062.pdf", "I");