//============================================================+
//File name   : example_019.php
//Begin       : 2008-03-07
//Last Update : 2010-08-08
//
//Description : Example 019 for TCPDF class
//Non unicode with alternative config file
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
//@abstract TCPDF - Example: Non unicode with alternative config file
//@author Nicola Asuni
//@since 2008-03-04
//
//load alternative config file
//create new PDF document
//Set document information dictionary in unicode mode
//set document information
//set default header data
//set header and footer fonts
//set default monospaced font
//set margins
//set auto page breaks
//set image scale factor
//set some language dependent data:
//set some language-dependent strings
//---------------------------------------------------------
//set font
//add a page
//set color for background
//print some text
//---------------------------------------------------------
//Close and output PDF document
//============================================================+
//END OF FILE
//============================================================+

require("../config/lang/eng.php");

require("../config/tcpdf_config_alt.php");

const K_TCPDF_EXTERNAL_CONFIG = true;

require("../tcpdf.php");

var pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, false, "ISO-8859-1", false);
pdf.SetDocInfoUnicode(true);
pdf.SetCreator(PDF_CREATOR);
pdf.SetAuthor("Nicola Asuni [\u20AC]");
pdf.SetTitle("TCPDF Example 019");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 019", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
var lg = Array();
lg.a_meta_charset = "ISO-8859-1";
lg.a_meta_dir = "ltr";
lg.a_meta_language = "en";
lg.w_page = "page";
pdf.setLanguageArray(lg);
pdf.SetFont("helvetica", "", 12);
pdf.AddPage();
pdf.SetFillColor(200, 255, 200);
var txt = "An alternative configuration file is used on this example.\nCheck the definition of the K_TCPDF_EXTERNAL_CONFIG constant on the source code.";
pdf.MultiCell(0, 0, txt + "\n", 1, "J", 1, 1, "", "", true, 0, false, true, 0);
pdf.Output("example_019.pdf", "I");