//============================================================+
//File name   : example_010.php
//Begin       : 2008-03-04
//Last Update : 2011-04-26
//
//Description : Example 010 for TCPDF class
//Text on multiple columns
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
//@abstract TCPDF - Example: Text on multiple columns
//@author Nicola Asuni
//@since 2008-03-04
//
//
//Extend TCPDF to work with multiple columns
//
//end of extended class
//---------------------------------------------------------
//EXAMPLE
//---------------------------------------------------------
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
//print TEXT
//print HTML
//---------------------------------------------------------
//Close and output PDF document
//============================================================+
//END OF FILE
//============================================================+

require("../config/lang/eng.php");

require("../tcpdf.php");

//
//Print chapter
//@param $num (int) chapter number
//@param $title (string) chapter title
//@param $file (string) name of the file containing the chapter body
//@param $mode (boolean) if true the chapter body is in HTML, otherwise in simple text.
//@public
//
//
//Set chapter title
//@param $num (int) chapter number
//@param $title (string) chapter title
//@public
//
//
//Print chapter body
//@param $file (string) name of the file containing the chapter body
//@param $mode (boolean) if true the chapter body is in HTML, otherwise in simple text.
//@public
//
class MC_TCPDF extends TCPDF {
	PrintChapter(num, title, file, mode = false) //add a new page
	//disable existing columns
	//print chapter title
	//set columns
	//print chapter body
	{
		this.AddPage();
		this.resetColumns();
		this.ChapterTitle(num, title);
		this.setEqualColumns(3, 57);
		this.ChapterBody(file, mode);
	}

	ChapterTitle(num, title) {
		this.SetFont("helvetica", "", 14);
		this.SetFillColor(200, 220, 255);
		this.Cell(180, 6, "Chapter " + num + " : " + title, 0, 1, "", 1);
		this.Ln(4);
	}

	ChapterBody(file, mode = false) //get esternal file content
	//set font
	//print content
	{
		this.selectColumn();
		var content = file_get_contents(file, false);
		this.SetFont("times", "", 9);
		this.SetTextColor(50, 50, 50);

		if (mode) //------ HTML MODE ------
			{
				this.writeHTML(content, true, false, true, false, "J");
			} else //------ TEXT MODE ------
			{
				this.Write(0, content, "", 0, "J", true, 0, false, true, 0);
			}

		this.Ln();
	}

};

var pdf = new MC_TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, "UTF-8", false);
pdf.SetCreator(PDF_CREATOR);
pdf.SetAuthor("Nicola Asuni");
pdf.SetTitle("TCPDF Example 010");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 010", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.PrintChapter(1, "LOREM IPSUM [TEXT]", "../cache/chapter_demo_1.txt", false);
pdf.PrintChapter(2, "LOREM IPSUM [HTML]", "../cache/chapter_demo_2.txt", true);
pdf.Output("example_010.pdf", "I");