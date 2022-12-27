//============================================================+
//File name   : example_050.php
//Begin       : 2009-04-09
//Last Update : 2011-09-22
//
//Description : Example 050 for TCPDF class
//2D Barcodes
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
//@abstract TCPDF - Example: 2D barcodes.
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
//NOTE: 2D barcode algorithms must be implemented on 2dbarcode.php class file.
//set font
//add a page
//print a message
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//set style for barcode
//write RAW 2D Barcode
//write RAW2 2D Barcode
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//set style for barcode
//QRCODE,L : QR-CODE Low error correction
//QRCODE,M : QR-CODE Medium error correction
//QRCODE,Q : QR-CODE Better error correction
//QRCODE,H : QR-CODE Best error correction
//-------------------------------------------------------------------
//PDF417 (ISO/IEC 15438:2006)
//The $type parameter can be simple 'PDF417' or 'PDF417' followed by a
// number of comma-separated options:
// 'PDF417,a,e,t,s,f,o0,o1,o2,o3,o4,o5,o6'
// Possible options are:
// 	a  = aspect ratio (width/height);
// 	e  = error correction level (0-8);
// 	Macro Control Block options:
// 	t  = total number of macro segments;
// 	s  = macro segment index (0-99998);
// 	f  = file ID;
// 	o0 = File Name (text);
// 	o1 = Segment Count (numeric);
// 	o2 = Time Stamp (numeric);
// 	o3 = Sender (text);
// 	o4 = Addressee (text);
// 	o5 = File Size (numeric);
// 	o6 = Checksum (numeric).
// Parameters t, s and f are required for a Macro Control Block, all other parametrs are optional.
// To use a comma character ',' on text options, replace it with the character 255: "\xff".
//-------------------------------------------------------------------
//DATAMATRIX (ISO/IEC 16022:2006)
//-------------------------------------------------------------------
//new style
//QRCODE,H : QR-CODE Best error correction
//new style
//QRCODE,H : QR-CODE Best error correction
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
pdf.SetTitle("TCPDF Example 050");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 050", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "", 11);
pdf.AddPage();
var txt = "You can also export 2D barcodes in other formats (PNG, SVG, HTML). Check the source code documentation of TCPDF2DBarcode class for further information.";
pdf.MultiCell(70, 50, txt, 0, "J", false, 1, 125, 30, true, 0, false, true, 0, "T", false);
pdf.SetFont("helvetica", "", 10);
var style = {
  border: true,
  vpadding: "auto",
  hpadding: "auto",
  fgcolor: [0, 0, 0],
  bgcolor: false,
  module_width: 1,
  module_height: 1
};
var code = "111011101110111,010010001000010,010011001110010,010010000010010,010011101110010";
pdf.write2DBarcode(code, "RAW", 80, 30, 30, 20, style, "N");
code = "[111011101110111][010010001000010][010011001110010][010010000010010][010011101110010]";
pdf.write2DBarcode(code, "RAW2", 80, 60, 30, 20, style, "N");
style = {
  border: 2,
  vpadding: "auto",
  hpadding: "auto",
  fgcolor: [0, 0, 0],
  bgcolor: false,
  module_width: 1,
  module_height: 1
};
pdf.write2DBarcode("www.tcpdf.org", "QRCODE,L", 20, 30, 50, 50, style, "N");
pdf.Text(20, 25, "QRCODE L");
pdf.write2DBarcode("www.tcpdf.org", "QRCODE,M", 20, 90, 50, 50, style, "N");
pdf.Text(20, 85, "QRCODE M");
pdf.write2DBarcode("www.tcpdf.org", "QRCODE,Q", 20, 150, 50, 50, style, "N");
pdf.Text(20, 145, "QRCODE Q");
pdf.write2DBarcode("www.tcpdf.org", "QRCODE,H", 20, 210, 50, 50, style, "N");
pdf.Text(20, 205, "QRCODE H");
pdf.write2DBarcode("www.tcpdf.org", "PDF417", 80, 90, 0, 30, style, "N");
pdf.Text(80, 85, "PDF417 (ISO/IEC 15438:2006)");
pdf.write2DBarcode("http://www.tcpdf.org", "DATAMATRIX", 80, 150, 50, 50, style, "N");
pdf.Text(80, 145, "DATAMATRIX (ISO/IEC 16022:2006)");
style = {
  border: 2,
  padding: "auto",
  fgcolor: [0, 0, 255],
  bgcolor: [255, 255, 64]
};
pdf.write2DBarcode("www.tcpdf.org", "QRCODE,H", 80, 210, 50, 50, style, "N");
pdf.Text(80, 205, "QRCODE H - COLORED");
style = {
  border: false,
  padding: 0,
  fgcolor: [128, 0, 0],
  bgcolor: false
};
pdf.write2DBarcode("www.tcpdf.org", "QRCODE,H", 140, 210, 50, 50, style, "N");
pdf.Text(140, 205, "QRCODE H - NO PADDING");
pdf.Output("example_050.pdf", "I");