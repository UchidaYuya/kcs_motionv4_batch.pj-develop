//============================================================+
//File name   : example_056.php
//Begin       : 2010-03-26
//Last Update : 2011-12-10
//
//Description : Example 056 for TCPDF class
//Crop marks and color registration bars
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
//@abstract TCPDF - Example: Crop marks and color registration bars
//@author Nicola Asuni
//@since 2010-03-26
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
//color registration bars
//corner crop marks
//various crop marks
//registration marks
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
pdf.SetTitle("TCPDF Example 056");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 056", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "", 20);
pdf.AddPage();
pdf.Write(0, "Example of Crop Marks and Color Registration Bars", "", 0, "L", true, 0, false, false, 0);
pdf.Ln(5);
pdf.colorRegistrationBar(50, 70, 40, 40, true, false, "A,R,G,B,C,M,Y,K");
pdf.colorRegistrationBar(90, 70, 40, 40, true, true, "A,R,G,B,C,M,Y,K");
pdf.colorRegistrationBar(50, 115, 80, 5, false, true, "A,W,R,G,B,C,M,Y,K");
pdf.colorRegistrationBar(135, 70, 5, 50, false, false, "A,W,R,G,B,C,M,Y,K");
pdf.cropMark(50, 70, 10, 10, "TL", [0, 0, 0]);
pdf.cropMark(140, 70, 10, 10, "TR", [0, 0, 0]);
pdf.cropMark(50, 120, 10, 10, "BL", [0, 0, 0]);
pdf.cropMark(140, 120, 10, 10, "BR", [0, 0, 0]);
pdf.cropMark(95, 65, 5, 5, "LEFT,TOP,RIGHT", [255, 0, 0]);
pdf.cropMark(95, 125, 5, 5, "LEFT,BOTTOM,RIGHT", [255, 0, 0]);
pdf.cropMark(45, 95, 5, 5, "TL,BL", [0, 255, 0]);
pdf.cropMark(145, 95, 5, 5, "TR,BR", [0, 255, 0]);
pdf.cropMark(95, 140, 5, 5, "A,D", [0, 0, 255]);
pdf.registrationMark(40, 60, 5, false, [0, 0, 0], [255, 255, 255]);
pdf.registrationMark(150, 60, 5, true, [0, 0, 0], [255, 255, 0]);
pdf.registrationMark(40, 130, 5, true, [0, 0, 0], [255, 255, 0]);
pdf.registrationMark(150, 130, 5, false, [0, 0, 0], [255, 255, 255]);
pdf.Output("example_056.pdf", "I");