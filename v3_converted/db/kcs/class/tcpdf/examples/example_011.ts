//============================================================+
//File name   : example_011.php
//Begin       : 2008-03-04
//Last Update : 2010-08-08
//
//Description : Example 011 for TCPDF class
//Colored Table
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
//@abstract TCPDF - Example: Colored Table
//@author Nicola Asuni
//@since 2008-03-04
//
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
//Column titles
//Data loading
//print colored table
//---------------------------------------------------------
//Close and output PDF document
//============================================================+
//END OF FILE
//============================================================+

require("../config/lang/eng.php");

require("../tcpdf.php");

//Load table data from file
//Colored table
class MYPDF extends TCPDF {
	LoadData(file) //Read file lines
	{
		var lines = file(file);
		var data = Array();

		for (var line of Object.values(lines)) {
			data.push(chop(line).split(";"));
		}

		return data;
	}

	ColoredTable(header, data) //Colors, line width and bold font
	//Header
	//Color and font restoration
	//Data
	{
		this.SetFillColor(255, 0, 0);
		this.SetTextColor(255);
		this.SetDrawColor(128, 0, 0);
		this.SetLineWidth(0.3);
		this.SetFont("", "B");
		var w = [40, 35, 40, 45];
		var num_headers = header.length;

		for (var i = 0; i < num_headers; ++i) {
			this.Cell(w[i], 7, header[i], 1, 0, "C", 1);
		}

		this.Ln();
		this.SetFillColor(224, 235, 255);
		this.SetTextColor(0);
		this.SetFont("");
		var fill = 0;

		for (var row of Object.values(data)) {
			this.Cell(w[0], 6, row[0], "LR", 0, "L", fill);
			this.Cell(w[1], 6, row[1], "LR", 0, "L", fill);
			this.Cell(w[2], 6, number_format(row[2]), "LR", 0, "R", fill);
			this.Cell(w[3], 6, number_format(row[3]), "LR", 0, "R", fill);
			this.Ln();
			fill = !fill;
		}

		this.Cell(array_sum(w), 0, "", "T");
	}

};

var pdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, "UTF-8", false);
pdf.SetCreator(PDF_CREATOR);
pdf.SetAuthor("Nicola Asuni");
pdf.SetTitle("TCPDF Example 011");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 011", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "", 12);
pdf.AddPage();
var header = ["Country", "Capital", "Area (sq km)", "Pop. (thousands)"];
var data = pdf.LoadData("../cache/table_data_demo.txt");
pdf.ColoredTable(header, data);
pdf.Output("example_011.pdf", "I");