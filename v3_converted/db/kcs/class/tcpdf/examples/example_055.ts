//============================================================+
//File name   : example_055.php
//Begin       : 2009-10-21
//Last Update : 2011-01-01
//
//Description : Example 055 for TCPDF class
//Display all characters available on core fonts.
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
//Display all characters available on core fonts.
//@package com.tecnick.tcpdf
//@abstract TCPDF - Example: XHTML Forms
//@author Nicola Asuni
//@since 2009-10-21
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
//array of font names
//set fill color
//create one HTML table for each core font
//---------------------------------------------------------
//Close and output PDF document
//============================================================+
//END OF FILE                                               //============================================================+

require("../config/lang/eng.php");

require("../tcpdf.php");

var pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, "UTF-8", false);
pdf.SetCreator(PDF_CREATOR);
pdf.SetAuthor("Nicola Asuni");
pdf.SetTitle("TCPDF Example 055");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 055", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "", 14);
var core_fonts = ["courier", "courierB", "courierI", "courierBI", "helvetica", "helveticaB", "helveticaI", "helveticaBI", "times", "timesB", "timesI", "timesBI", "symbol", "zapfdingbats"];
pdf.SetFillColor(221, 238, 255);

for (var font of Object.values(core_fonts)) //add a page
//Cell($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='', $stretch=0, $ignore_min_height=false, $calign='T', $valign='M')
//set font for title
//print font name
//set font for chars
//print each character
//print a pangram
{
	pdf.AddPage();
	pdf.SetFont("helvetica", "B", 16);
	pdf.Cell(0, 10, "FONT: " + font, 1, 1, "C", true, "", 0, false, "T", "M");
	pdf.SetFont(font, "", 16);

	for (var i = 0; i < 256; ++i) {
		if (i > 0 and i % 16 == 0) {
			pdf.Ln();
		}

		pdf.Cell(11.25, 11.25, pdf.unichr(i), 1, 0, "C", false, "", 0, false, "T", "M");
	}

	pdf.Ln(20);
	pdf.Cell(0, 0, "The quick brown fox jumps over the lazy dog", 0, 1, "C", false, "", 0, false, "T", "M");
}

pdf.Output("example_055.pdf", "I");