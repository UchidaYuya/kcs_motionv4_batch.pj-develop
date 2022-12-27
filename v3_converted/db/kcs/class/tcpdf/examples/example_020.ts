//============================================================+
//File name   : example_020.php
//Begin       : 2008-03-04
//Last Update : 2010-08-08
//
//Description : Example 020 for TCPDF class
//Two columns composed by MultiCell of different
//heights
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
//@abstract TCPDF - Example: Two columns composed by MultiCell of different heights
//@author Nicola Asuni
//@since 2008-03-04
//extend TCPF with custom functions
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
//$pdf->SetCellPadding(0);
//$pdf->SetLineWidth(2);
//set color for background
//print some rows just as example
//reset pointer to the last page
//---------------------------------------------------------
//Close and output PDF document
//============================================================+
//END OF FILE
//============================================================+

require("../config/lang/eng.php");

require("../tcpdf.php");

class MYPDF extends TCPDF {
	MultiRow(left, right) //MultiCell($w, $h, $txt, $border=0, $align='J', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0)
	//write the left cell
	//write the right cell
	//set the new row position by case
	{
		var page_start = this.getPage();
		var y_start = this.GetY();
		this.MultiCell(40, 0, left, 1, "R", 1, 2, "", "", true, 0);
		var page_end_1 = this.getPage();
		var y_end_1 = this.GetY();
		this.setPage(page_start);
		this.MultiCell(0, 0, right, 1, "J", 0, 1, this.GetX(), y_start, true, 0);
		var page_end_2 = this.getPage();
		var y_end_2 = this.GetY();

		if (Math.max(page_end_1, page_end_2) == page_start) {
			var ynew = Math.max(y_end_1, y_end_2);
		} else if (page_end_1 == page_end_2) {
			ynew = Math.max(y_end_1, y_end_2);
		} else if (page_end_1 > page_end_2) {
			ynew = y_end_1;
		} else {
			ynew = y_end_2;
		}

		this.setPage(Math.max(page_end_1, page_end_2));
		this.SetXY(this.GetX(), ynew);
	}

};

var pdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, "UTF-8", false);
pdf.SetCreator(PDF_CREATOR);
pdf.SetAuthor("Nicola Asuni");
pdf.SetTitle("TCPDF Example 020");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 020", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "", 20);
pdf.AddPage();
pdf.Write(0, "Example of text layout using Multicell()", "", 0, "L", true, 0, false, false, 0);
pdf.Ln(5);
pdf.SetFont("times", "", 9);
pdf.SetFillColor(255, 255, 200);
var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed imperdiet lectus. Phasellus quis velit velit, non condimentum quam. Sed neque urna, ultrices ac volutpat vel, laoreet vitae augue. Sed vel velit erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras eget velit nulla, eu sagittis elit. Nunc ac arcu est, in lobortis tellus. Praesent condimentum rhoncus sodales. In hac habitasse platea dictumst. Proin porta eros pharetra enim tincidunt dignissim nec vel dolor. Cras sapien elit, ornare ac dignissim eu, ultricies ac eros. Maecenas augue magna, ultrices a congue in, mollis eu nulla. Nunc venenatis massa at est eleifend faucibus. Vivamus sed risus lectus, nec interdum nunc.\n\nFusce et felis vitae diam lobortis sollicitudin. Aenean tincidunt accumsan nisi, id vehicula quam laoreet elementum. Phasellus egestas interdum erat, et viverra ipsum ultricies ac. Praesent sagittis augue at augue volutpat eleifend. Cras nec orci neque. Mauris bibendum posuere blandit. Donec feugiat mollis dui sit amet pellentesque. Sed a enim justo. Donec tincidunt, nisl eget elementum aliquam, odio ipsum ultrices quam, eu porttitor ligula urna at lorem. Donec varius, eros et convallis laoreet, ligula tellus consequat felis, ut ornare metus tellus sodales velit. Duis sed diam ante. Ut rutrum malesuada massa, vitae consectetur ipsum rhoncus sed. Suspendisse potenti. Pellentesque a congue massa.";

for (var i = 0; i < 10; ++i) {
	pdf.MultiRow("Row " + (i + 1), text + "\n");
}

pdf.lastPage();
pdf.Output("example_020.pdf", "I");