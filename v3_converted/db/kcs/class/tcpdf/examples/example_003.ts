//============================================================+
//File name   : example_003.php
//Begin       : 2008-03-04
//Last Update : 2010-08-08
//
//Description : Example 003 for TCPDF class
//Custom Header and Footer
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
//@abstract TCPDF - Example: Custom Header and Footer
//@author Nicola Asuni
//@since 2008-03-04
//
//Extend the TCPDF class to create custom Header and Footer
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

//Page header
//Page footer
class MYPDF extends TCPDF {
	Header() //Logo
	//Set font
	//Title
	{
		var image_file = K_PATH_IMAGES + "logo_example.jpg";
		this.Image(image_file, 10, 10, 15, "", "JPG", "", "T", false, 300, "", false, false, 0, false, false, false);
		this.SetFont("helvetica", "B", 20);
		this.Cell(0, 15, "<< TCPDF Example 003 >>", 0, false, "C", 0, "", 0, false, "M", "M");
	}

	Footer() //Position at 15 mm from bottom
	//Set font
	//Page number
	{
		this.SetY(-15);
		this.SetFont("helvetica", "I", 8);
		this.Cell(0, 10, "Page " + this.getAliasNumPage() + "/" + this.getAliasNbPages(), 0, false, "C", 0, "", 0, false, "T", "M");
	}

};

var pdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, "UTF-8", false);
pdf.SetCreator(PDF_CREATOR);
pdf.SetAuthor("Nicola Asuni");
pdf.SetTitle("TCPDF Example 003");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE, PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("times", "BI", 12);
pdf.AddPage();
var txt = `TCPDF Example 003\n\nCustom page header and footer are defined by extending the TCPDF class and overriding the Header() and Footer() methods.\n`;
pdf.Write(h = 0, txt, link = "", fill = 0, align = "C", ln = true, stretch = 0, firstline = false, firstblock = false, maxh = 0);
pdf.Output("example_003.pdf", "I");