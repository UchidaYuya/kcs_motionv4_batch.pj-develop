//============================================================+
//File name   : example_063.php
//Begin       : 2010-09-29
//Last Update : 2012-06-21
//
//Description : Example 063 for TCPDF class
//Text stretching and spacing (tracking)
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
//@abstract TCPDF - Example: Text stretching and spacing (tracking)
//@author Nicola Asuni
//@since 2010-09-29
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
//add a page
//create several cells to display all cases of stretching and spacing combinations.
//Test all cases using direct stretching/spacing methods
//Test all cases using CSS stretching/spacing properties
//reset font stretching
//reset font spacing
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
pdf.SetTitle("TCPDF Example 063");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 063", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "B", 16);
pdf.AddPage();
pdf.Write(0, "Example of Text Stretching and Spacing (tracking)", "", 0, "L", true, 0, false, false, 0);
pdf.Ln(5);
var fonts = ["times", "dejavuserif"];
var alignments = {
	L: "LEFT",
	C: "CENTER",
	R: "RIGHT",
	J: "JUSTIFY"
};

for (var fkey in fonts) {
	var font = fonts[fkey];
	pdf.SetFont(font, "", 14);

	for (var align_mode in alignments) {
		var align_name = alignments[align_mode];

		for (var stretching = 90; stretching <= 110; stretching += 10) {
			for (var spacing = -0.254; spacing <= 0.254; spacing += 0.254) {
				pdf.setFontStretching(stretching);
				pdf.setFontSpacing(spacing);
				var txt = align_name + " | Stretching = " + stretching + "% | Spacing = " + sprintf("%+.3F", spacing) + "mm";
				pdf.Cell(0, 0, txt, 1, 1, align_mode);
			}
		}
	}

	pdf.AddPage();
}

for (var fkey in fonts) {
	var font = fonts[fkey];
	pdf.SetFont(font, "", 11);

	for (var align_mode in alignments) {
		var align_name = alignments[align_mode];

		for (stretching = 90;; stretching <= 110; stretching += 10) {
			for (spacing = -0.254;; spacing <= 0.254; spacing += 0.254) {
				var html = "<span style=\"font-stretch:" + stretching + "%;letter-spacing:" + spacing + "mm;\"><span style=\"color:red;\">" + align_name + "</span> | <span style=\"color:green;\">Stretching = " + stretching + "%</span> | <span style=\"color:blue;\">Spacing = " + sprintf("%+.3F", spacing) + "mm</span><br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed imperdiet lectus. Phasellus quis velit velit, non condimentum quam. Sed neque urna, ultrices ac volutpat vel, laoreet vitae augue. Sed vel velit erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</span>";
				pdf.writeHTMLCell(0, 0, "", "", html, 1, 1, false, true, align_mode, false);
			}
		}

		if (!(fkey == 1 and align_mode == "J")) {
			pdf.AddPage();
		}
	}
}

pdf.setFontStretching(100);
pdf.setFontSpacing(0);
pdf.Output("example_063.pdf", "I");