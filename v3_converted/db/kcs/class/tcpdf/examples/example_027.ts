//============================================================+
//File name   : example_027.php
//Begin       : 2008-03-04
//Last Update : 2011-09-22
//
//Description : Example 027 for TCPDF class
//1D Barcodes
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
//@abstract TCPDF - Example: 1D Barcodes.
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
//set a barcode on the page footer
//set font
//add a page
//print a message
//-----------------------------------------------------------------------------
//define barcode style
//PRINT VARIOUS 1D BARCODES
//CODE 39 - ANSI MH10.8M-1983 - USD-3 - 3 of 9.
//CODE 39 + CHECKSUM
//CODE 39 EXTENDED
//CODE 39 EXTENDED + CHECKSUM
//CODE 93 - USS-93
//Standard 2 of 5
//Standard 2 of 5 + CHECKSUM
//Interleaved 2 of 5
//Interleaved 2 of 5 + CHECKSUM
//add a page ----------
//CODE 128 AUTO
//CODE 128 A
//CODE 128 B
//CODE 128 C
//EAN 8
//EAN 13
//UPC-A
//UPC-E
//add a page ----------
//5-Digits UPC-Based Extention
//2-Digits UPC-Based Extention
//MSI
//MSI + CHECKSUM (module 11)
//CODABAR
//CODE 11
//PHARMACODE
//PHARMACODE TWO-TRACKS
//add a page ----------
//IMB - Intelligent Mail Barcode - Onecode - USPS-B-3200
//POSTNET
//PLANET
//RMS4CC (Royal Mail 4-state Customer Code) - CBC (Customer Bar Code)
//KIX (Klant index - Customer index)
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//TEST BARCODE ALIGNMENTS
//add a page
//set a background color
//Left position
//Center position
//Right position
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
//disable stretch
//disable fitwidth
//Left alignment
//Center alignment
//Right alignment
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
//disable stretch
//disable fitwidth
//Left alignment
//Center alignment
//Right alignment
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
//Left alignment
//Center alignment
//Right alignment
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//TEST BARCODE STYLE
//define barcode style
//CODE 39 EXTENDED + CHECKSUM
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
pdf.SetTitle("TCPDF Example 027");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 027", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.setBarcode(date("Y-m-d H:i:s"));
pdf.SetFont("helvetica", "", 11);
pdf.AddPage();
var txt = "You can also export 1D barcodes in other formats (PNG, SVG, HTML). Check the source code documentation of TCPDFBarcode class for further information.";
pdf.MultiCell(70, 50, txt, 0, "J", false, 1, 125, 30, true, 0, false, true, 0, "T", false);
pdf.SetY(30);
pdf.SetFont("helvetica", "", 10);
var style = {
	position: "",
	align: "C",
	stretch: false,
	fitwidth: true,
	cellfitalign: "",
	border: true,
	hpadding: "auto",
	vpadding: "auto",
	fgcolor: [0, 0, 0],
	bgcolor: false,
	text: true,
	font: "helvetica",
	fontsize: 8,
	stretchtext: 4
};
pdf.Cell(0, 0, "CODE 39 - ANSI MH10.8M-1983 - USD-3 - 3 of 9", 0, 1);
pdf.write1DBarcode("CODE 39", "C39", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "CODE 39 + CHECKSUM", 0, 1);
pdf.write1DBarcode("CODE 39 +", "C39+", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "CODE 39 EXTENDED", 0, 1);
pdf.write1DBarcode("CODE 39 E", "C39E", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "CODE 39 EXTENDED + CHECKSUM", 0, 1);
pdf.write1DBarcode("CODE 39 E+", "C39E+", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "CODE 93 - USS-93", 0, 1);
pdf.write1DBarcode("TEST93", "C93", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "Standard 2 of 5", 0, 1);
pdf.write1DBarcode("1234567", "S25", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "Standard 2 of 5 + CHECKSUM", 0, 1);
pdf.write1DBarcode("1234567", "S25+", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "Interleaved 2 of 5", 0, 1);
pdf.write1DBarcode("1234567", "I25", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "Interleaved 2 of 5 + CHECKSUM", 0, 1);
pdf.write1DBarcode("1234567", "I25+", "", "", "", 18, 0.4, style, "N");
pdf.AddPage();
pdf.Cell(0, 0, "CODE 128 AUTO", 0, 1);
pdf.write1DBarcode("CODE 128 AUTO", "C128", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "CODE 128 A", 0, 1);
pdf.write1DBarcode("CODE 128 A", "C128A", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "CODE 128 B", 0, 1);
pdf.write1DBarcode("CODE 128 B", "C128B", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "CODE 128 C", 0, 1);
pdf.write1DBarcode("0123456789", "C128C", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "EAN 8", 0, 1);
pdf.write1DBarcode("1234567", "EAN8", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "EAN 13", 0, 1);
pdf.write1DBarcode("1234567890128", "EAN13", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "UPC-A", 0, 1);
pdf.write1DBarcode("12345678901", "UPCA", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "UPC-E", 0, 1);
pdf.write1DBarcode("04210000526", "UPCE", "", "", "", 18, 0.4, style, "N");
pdf.AddPage();
pdf.Cell(0, 0, "5-Digits UPC-Based Extention", 0, 1);
pdf.write1DBarcode("51234", "EAN5", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "2-Digits UPC-Based Extention", 0, 1);
pdf.write1DBarcode("34", "EAN2", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "MSI", 0, 1);
pdf.write1DBarcode("80523", "MSI", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "MSI + CHECKSUM (module 11)", 0, 1);
pdf.write1DBarcode("80523", "MSI+", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "CODABAR", 0, 1);
pdf.write1DBarcode("123456789", "CODABAR", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "CODE 11", 0, 1);
pdf.write1DBarcode("123-456-789", "CODE11", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "PHARMACODE", 0, 1);
pdf.write1DBarcode("789", "PHARMA", "", "", "", 18, 0.4, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "PHARMACODE TWO-TRACKS", 0, 1);
pdf.write1DBarcode("105", "PHARMA2T", "", "", "", 18, 2, style, "N");
pdf.AddPage();
pdf.Cell(0, 0, "IMB - Intelligent Mail Barcode - Onecode - USPS-B-3200", 0, 1);
pdf.write1DBarcode("01234567094987654321-01234567891", "IMB", "", "", "", 15, 0.6, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "POSTNET", 0, 1);
pdf.write1DBarcode("98000", "POSTNET", "", "", "", 15, 0.6, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "PLANET", 0, 1);
pdf.write1DBarcode("98000", "PLANET", "", "", "", 15, 0.6, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "RMS4CC (Royal Mail 4-state Customer Code) - CBC (Customer Bar Code)", 0, 1);
pdf.write1DBarcode("SN34RD1A", "RMS4CC", "", "", "", 15, 0.6, style, "N");
pdf.Ln();
pdf.Cell(0, 0, "KIX (Klant index - Customer index)", 0, 1);
pdf.write1DBarcode("SN34RDX1A", "KIX", "", "", "", 15, 0.6, style, "N");
pdf.AddPage();
style.bgcolor = [255, 255, 240];
style.fgcolor = [127, 0, 0];
style.position = "L";
pdf.write1DBarcode("LEFT", "C128A", "", "", "", 15, 0.4, style, "N");
pdf.Ln(2);
style.position = "C";
pdf.write1DBarcode("CENTER", "C128A", "", "", "", 15, 0.4, style, "N");
pdf.Ln(2);
style.position = "R";
pdf.write1DBarcode("RIGHT", "C128A", "", "", "", 15, 0.4, style, "N");
pdf.Ln(2);
style.fgcolor = [0, 127, 0];
style.position = "";
style.stretch = false;
style.fitwidth = false;
style.align = "L";
pdf.write1DBarcode("LEFT", "C128A", "", "", "", 15, 0.4, style, "N");
pdf.Ln(2);
style.align = "C";
pdf.write1DBarcode("CENTER", "C128A", "", "", "", 15, 0.4, style, "N");
pdf.Ln(2);
style.align = "R";
pdf.write1DBarcode("RIGHT", "C128A", "", "", "", 15, 0.4, style, "N");
pdf.Ln(2);
style.fgcolor = [0, 64, 127];
style.position = "";
style.stretch = false;
style.fitwidth = true;
style.cellfitalign = "L";
pdf.write1DBarcode("LEFT", "C128A", 105, "", 90, 15, 0.4, style, "N");
pdf.Ln(2);
style.cellfitalign = "C";
pdf.write1DBarcode("CENTER", "C128A", 105, "", 90, 15, 0.4, style, "N");
pdf.Ln(2);
style.cellfitalign = "R";
pdf.write1DBarcode("RIGHT", "C128A", 105, "", 90, 15, 0.4, style, "N");
pdf.Ln(2);
style.fgcolor = [127, 0, 127];
style.position = "L";
pdf.write1DBarcode("LEFT", "C128A", "", "", "", 15, 0.4, style, "N");
pdf.Ln(2);
style.position = "C";
pdf.write1DBarcode("CENTER", "C128A", "", "", "", 15, 0.4, style, "N");
pdf.Ln(2);
style.position = "R";
pdf.write1DBarcode("RIGHT", "C128A", "", "", "", 15, 0.4, style, "N");
style = {
	position: "",
	align: "",
	stretch: true,
	fitwidth: false,
	cellfitalign: "",
	border: true,
	hpadding: "auto",
	vpadding: "auto",
	fgcolor: [0, 0, 128],
	bgcolor: [255, 255, 128],
	text: true,
	label: "CUSTOM LABEL",
	font: "helvetica",
	fontsize: 8,
	stretchtext: 4
};
pdf.Cell(0, 0, "CODE 39 EXTENDED + CHECKSUM", 0, 1);
pdf.SetLineStyle({
	width: 1,
	cap: "butt",
	join: "miter",
	dash: 0,
	color: [255, 0, 0]
});
pdf.write1DBarcode("CODE 39 E+", "C39E+", "", "", 120, 25, 0.4, style, "N");
pdf.Output("example_027.pdf", "I");