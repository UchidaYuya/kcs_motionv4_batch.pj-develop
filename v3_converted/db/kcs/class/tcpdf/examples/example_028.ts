//============================================================+
//File name   : example_028.php
//Begin       : 2008-03-04
//Last Update : 2010-08-08
//
//Description : Example 028 for TCPDF class
//Changing page formats
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
//@abstract TCPDF - Example: changing page formats
//@author Nicola Asuni
//@since 2008-03-04
//
//create new PDF document
//set document information
//remove default header/footer
//set default monospaced font
//set margins
//set auto page breaks
//set image scale factor
//set some language-dependent strings
//---------------------------------------------------------
//set font
//--- test backward editing ---
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
pdf.SetTitle("TCPDF Example 028");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.setPrintHeader(false);
pdf.setPrintFooter(false);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(10, PDF_MARGIN_TOP, 10);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetDisplayMode("fullpage", "SinglePage", "UseNone");
pdf.SetFont("times", "B", 20);
pdf.AddPage("P", "A4");
pdf.Cell(0, 0, "A4 PORTRAIT", 1, 1, "C");
pdf.AddPage("L", "A4");
pdf.Cell(0, 0, "A4 LANDSCAPE", 1, 1, "C");
pdf.AddPage("P", "A5");
pdf.Cell(0, 0, "A5 PORTRAIT", 1, 1, "C");
pdf.AddPage("L", "A5");
pdf.Cell(0, 0, "A5 LANDSCAPE", 1, 1, "C");
pdf.AddPage("P", "A6");
pdf.Cell(0, 0, "A6 PORTRAIT", 1, 1, "C");
pdf.AddPage("L", "A6");
pdf.Cell(0, 0, "A6 LANDSCAPE", 1, 1, "C");
pdf.AddPage("P", "A7");
pdf.Cell(0, 0, "A7 PORTRAIT", 1, 1, "C");
pdf.AddPage("L", "A7");
pdf.Cell(0, 0, "A7 LANDSCAPE", 1, 1, "C");
pdf.setPage(1, true);
pdf.SetY(50);
pdf.Cell(0, 0, "A4 test", 1, 1, "C");
pdf.setPage(2, true);
pdf.SetY(50);
pdf.Cell(0, 0, "A4 test", 1, 1, "C");
pdf.setPage(3, true);
pdf.SetY(50);
pdf.Cell(0, 0, "A5 test", 1, 1, "C");
pdf.setPage(4, true);
pdf.SetY(50);
pdf.Cell(0, 0, "A5 test", 1, 1, "C");
pdf.setPage(5, true);
pdf.SetY(50);
pdf.Cell(0, 0, "A6 test", 1, 1, "C");
pdf.setPage(6, true);
pdf.SetY(50);
pdf.Cell(0, 0, "A6 test", 1, 1, "C");
pdf.setPage(7, true);
pdf.SetY(40);
pdf.Cell(0, 0, "A7 test", 1, 1, "C");
pdf.setPage(8, true);
pdf.SetY(40);
pdf.Cell(0, 0, "A7 test", 1, 1, "C");
pdf.lastPage();
pdf.Output("example_028.pdf", "I");