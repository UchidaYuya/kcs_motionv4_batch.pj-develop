//============================================================+
//File name   : example_022.php
//Begin       : 2008-03-04
//Last Update : 2010-08-08
//
//Description : Example 022 for TCPDF class
//CMYK colors
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
//@abstract TCPDF - Example: CMYK colors.
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
//check also the following methods:
//SetDrawColorArray()
//SetFillColorArray()
//SetTextColorArray()
//set font
//add a page
//define style for border
//--- CMYK ------------------------------------------------
//--- RGB -------------------------------------------------
//--- GRAY ------------------------------------------------
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
pdf.SetTitle("TCPDF Example 022");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 022", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "B", 18);
pdf.AddPage();
pdf.Write(0, "Example of CMYK, RGB and Grayscale colours", "", 0, "L", true, 0, false, false, 0);
var border_style = {
  all: {
    width: 2,
    cap: "square",
    join: "miter",
    dash: 0,
    phase: 0
  }
};
pdf.SetDrawColor(50, 0, 0, 0);
pdf.SetFillColor(100, 0, 0, 0);
pdf.SetTextColor(100, 0, 0, 0);
pdf.Rect(30, 60, 30, 30, "DF", border_style);
pdf.Text(30, 92, "Cyan");
pdf.SetDrawColor(0, 50, 0, 0);
pdf.SetFillColor(0, 100, 0, 0);
pdf.SetTextColor(0, 100, 0, 0);
pdf.Rect(70, 60, 30, 30, "DF", border_style);
pdf.Text(70, 92, "Magenta");
pdf.SetDrawColor(0, 0, 50, 0);
pdf.SetFillColor(0, 0, 100, 0);
pdf.SetTextColor(0, 0, 100, 0);
pdf.Rect(110, 60, 30, 30, "DF", border_style);
pdf.Text(110, 92, "Yellow");
pdf.SetDrawColor(0, 0, 0, 50);
pdf.SetFillColor(0, 0, 0, 100);
pdf.SetTextColor(0, 0, 0, 100);
pdf.Rect(150, 60, 30, 30, "DF", border_style);
pdf.Text(150, 92, "Black");
pdf.SetDrawColor(255, 127, 127);
pdf.SetFillColor(255, 0, 0);
pdf.SetTextColor(255, 0, 0);
pdf.Rect(30, 110, 30, 30, "DF", border_style);
pdf.Text(30, 142, "Red");
pdf.SetDrawColor(127, 255, 127);
pdf.SetFillColor(0, 255, 0);
pdf.SetTextColor(0, 255, 0);
pdf.Rect(70, 110, 30, 30, "DF", border_style);
pdf.Text(70, 142, "Green");
pdf.SetDrawColor(127, 127, 255);
pdf.SetFillColor(0, 0, 255);
pdf.SetTextColor(0, 0, 255);
pdf.Rect(110, 110, 30, 30, "DF", border_style);
pdf.Text(110, 142, "Blue");
pdf.SetDrawColor(191);
pdf.SetFillColor(127);
pdf.SetTextColor(127);
pdf.Rect(30, 160, 30, 30, "DF", border_style);
pdf.Text(30, 192, "Gray");
pdf.Output("example_022.pdf", "I");