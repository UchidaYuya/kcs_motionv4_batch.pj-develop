//============================================================+
//File name   : example_047.php
//Begin       : 2009-03-19
//Last Update : 2010-08-08
//
//Description : Example 047 for TCPDF class
//Transactions
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
//@abstract TCPDF - Example: Transactions
//@author Nicola Asuni
//@since 2009-03-19
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
//start transaction
//restarts transaction
//rolls back to the last (re)start
//start transaction
//commit transaction (actually just frees memory)
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
pdf.SetTitle("TCPDF Example 047");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 047", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "", 16);
pdf.AddPage();
var txt = "Example of Transactions.\nTCPDF allows you to undo some operations using the Transactions.\nCheck the source code for further information.";
pdf.Write(0, txt, "", 0, "L", true, 0, false, false, 0);
pdf.Ln(5);
pdf.SetFont("times", "", 12);
pdf.startTransaction();
pdf.Write(0, "LINE 1\n");
pdf.Write(0, "LINE 2\n");
pdf.startTransaction();
pdf.Write(0, "LINE 3\n");
pdf.Write(0, "LINE 4\n");
pdf = pdf.rollbackTransaction();
pdf.Write(0, "LINE 5\n");
pdf.Write(0, "LINE 6\n");
pdf.startTransaction();
pdf.Write(0, "LINE 7\n");
pdf.commitTransaction();
pdf.Output("example_047.pdf", "I");