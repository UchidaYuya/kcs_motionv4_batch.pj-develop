//============================================================+
//File name   : example_009.php
//Begin       : 2008-03-04
//Last Update : 2010-12-04
//
//Description : Example 009 for TCPDF class
//Test Image
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
//@abstract TCPDF - Example: Test Image
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
//-------------------------------------------------------------------
//add a page
//set JPEG quality
//Image method signature:
//Image($file, $x='', $y='', $w=0, $h=0, $type='', $link='', $align='', $resize=false, $dpi=300, $palign='', $ismask=false, $imgmask=false, $border=0, $fitbox=false, $hidden=false, $fitonpage=false)
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//Example of Image from data stream ('PHP rules')
//The '@' character is used to indicate that follows an image data stream and not an image file name
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//Image example with resizing
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//test fitbox with all alignment combinations
//test all combinations of alignments
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//Stretching, position and alignment example
//-------------------------------------------------------------------
//Close and output PDF document
//============================================================+
//END OF FILE
//============================================================+

require("../config/lang/eng.php");

require("../tcpdf.php");

var pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, "UTF-8", false);
pdf.SetCreator(PDF_CREATOR);
pdf.SetAuthor("Nicola Asuni");
pdf.SetTitle("TCPDF Example 009");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 009", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.AddPage();
pdf.setJPEGQuality(75);
var imgdata = base64_decode("iVBORw0KGgoAAAANSUhEUgAAABwAAAASCAMAAAB/2U7WAAAABlBMVEUAAAD///+l2Z/dAAAASUlEQVR4XqWQUQoAIAxC2/0vXZDrEX4IJTRkb7lobNUStXsB0jIXIAMSsQnWlsV+wULF4Avk9fLq2r8a5HSE35Q3eO2XP1A1wQkZSgETvDtKdQAAAABJRU5ErkJggg==");
pdf.Image("@" + imgdata);
pdf.Image("../images/image_demo.jpg", 15, 140, 75, 113, "JPG", "http://www.tcpdf.org", "", true, 150, "", false, false, 1, false, false, false);
var horizontal_alignments = ["L", "C", "R"];
var vertical_alignments = ["T", "M", "B"];
var x = 15;
var y = 35;
var w = 30;
var h = 30;

for (var i = 0; i < 3; ++i) //new row
{
	var fitbox = horizontal_alignments[i] + " ";
	x = 15;

	for (var j = 0; j < 3; ++j) //new column
	{
		fitbox[1] = vertical_alignments[j];
		pdf.Rect(x, y, w, h, "F", Array(), [128, 255, 128]);
		pdf.Image("../images/image_demo.jpg", x, y, w, h, "JPG", "", "", false, 300, "", false, false, 0, fitbox, false, false);
		x += 32;
	}

	y += 32;
}

x = 115;
y = 35;
w = 25;
h = 50;

for (i = 0;; i < 3; ++i) //new row
{
	fitbox = horizontal_alignments[i] + " ";
	x = 115;

	for (j = 0;; j < 3; ++j) //new column
	{
		fitbox[1] = vertical_alignments[j];
		pdf.Rect(x, y, w, h, "F", Array(), [128, 255, 255]);
		pdf.Image("../images/image_demo.jpg", x, y, w, h, "JPG", "", "", false, 300, "", false, false, 0, fitbox, false, false);
		x += 27;
	}

	y += 52;
}

pdf.SetXY(110, 200);
pdf.Image("../images/image_demo.jpg", "", "", 40, 40, "", "", "T", false, 300, "", false, false, 1, false, false, false);
pdf.Image("../images/image_demo.jpg", "", "", 40, 40, "", "", "", false, 300, "", false, false, 1, false, false, false);
pdf.Output("example_009.pdf", "I");