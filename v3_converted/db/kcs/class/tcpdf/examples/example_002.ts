//============================================================+
//File name   : example_002.php
//Begin       : 2008-03-04
//Last Update : 2010-08-08
//
//Description : Example 002 for TCPDF class
//Removing Header and Footer
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
//@abstract TCPDF - Example: Removing Header and Footer
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
//add a page
//set some text to print
//print a block of text using Write()
//---------------------------------------------------------
//Close and output PDF document
//============================================================+
//END OF FILE
//============================================================+
var h, link, fill, align, ln, stretch, firstline, firstblock, maxh;

require("../config/lang/eng.php");

require("../tcpdf.php");

var pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, "UTF-8", false);
pdf.SetCreator(PDF_CREATOR);
pdf.SetAuthor("Nicola Asuni");
pdf.SetTitle("TCPDF Example 002");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.setPrintHeader(false);
pdf.setPrintFooter(false);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("times", "BI", 20);
pdf.AddPage();
var txt = `TCPDF Example 002\n\nDefault page header and footer are disabled using setPrintHeader() and setPrintFooter() methods.\n`;
pdf.Write(h = 0, txt, link = "", fill = 0, align = "C", ln = true, stretch = 0, firstline = false, firstblock = false, maxh = 0);
pdf.Output("example_002.pdf", "I");