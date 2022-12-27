//============================================================+
//File name   : example_051.php
//Begin       : 2009-04-16
//Last Update : 2011-06-01
//
//Description : Example 051 for TCPDF class
//Full page background
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
//@abstract TCPDF - Example: Full page background
//@author Nicola Asuni
//@since 2009-04-16
//
//Extend the TCPDF class to create custom Header and Footer
//create new PDF document
//set document information
//set header and footer fonts
//set default monospaced font
//set margins
//remove default footer
//set auto page breaks
//set image scale factor
//set some language-dependent strings
//---------------------------------------------------------
//set font
//add a page
//Print a text
//add a page
//Print a text
//--- example with background set on page ---
//remove default header
//add a page
//-- set new background ---
//get the current page break margin
//get current auto-page-break mode
//disable auto-page-break
//set bacground image
//restore auto-page-break status
//set the starting point for the page content
//Print a text
//---------------------------------------------------------
//Close and output PDF document
//============================================================+
//END OF FILE
//============================================================+

require("../config/lang/eng.php");

require("../tcpdf.php");

//Page header
class MYPDF extends TCPDF {
	Header() //get the current page break margin
	//get current auto-page-break mode
	//disable auto-page-break
	//set bacground image
	//restore auto-page-break status
	//set the starting point for the page content
	{
		var bMargin = this.getBreakMargin();
		var auto_page_break = this.AutoPageBreak;
		this.SetAutoPageBreak(false, 0);
		var img_file = K_PATH_IMAGES + "image_demo.jpg";
		this.Image(img_file, 0, 0, 210, 297, "", "", "", false, 300, "", false, false, 0);
		this.SetAutoPageBreak(auto_page_break, bMargin);
		this.setPageMark();
	}

};

var pdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, "UTF-8", false);
pdf.SetCreator(PDF_CREATOR);
pdf.SetAuthor("Nicola Asuni");
pdf.SetTitle("TCPDF Example 051");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(0);
pdf.SetFooterMargin(0);
pdf.setPrintFooter(false);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("times", "", 48);
pdf.AddPage();
var html = "<span style=\"background-color:yellow;color:blue;\">&nbsp;PAGE 1&nbsp;</span>\n<p stroke=\"0.2\" fill=\"true\" strokecolor=\"yellow\" color=\"blue\" style=\"font-family:helvetica;font-weight:bold;font-size:26pt;\">You can set a full page background.</p>";
pdf.writeHTML(html, true, false, true, false, "");
pdf.AddPage();
html = "<span style=\"background-color:yellow;color:blue;\">&nbsp;PAGE 2&nbsp;</span>";
pdf.writeHTML(html, true, false, true, false, "");
pdf.setPrintHeader(false);
pdf.AddPage();
var bMargin = pdf.getBreakMargin();
var auto_page_break = pdf.getAutoPageBreak();
pdf.SetAutoPageBreak(false, 0);
var img_file = K_PATH_IMAGES + "image_demo.jpg";
pdf.Image(img_file, 0, 0, 210, 297, "", "", "", false, 300, "", false, false, 0);
pdf.SetAutoPageBreak(auto_page_break, bMargin);
pdf.setPageMark();
html = "<span style=\"color:white;text-align:center;font-weight:bold;font-size:80pt;\">PAGE 3</span>";
pdf.writeHTML(html, true, false, true, false, "");
pdf.Output("example_051.pdf", "I");