//============================================================+
//File name   : example_057.php
//Begin       : 2010-04-03
//Last Update : 2010-10-05
//
//Description : Example 057 for TCPDF class
//Cell vertical alignments
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
//@abstract TCPDF - Example: Cell vertical alignments
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
//set font
//add a page
//set border width
//set color for cell border
//text on center
//text on top
//text on bottom
//draw some reference lines
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//Print an image to explain cell measures
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//CELL BORDERS
//add a page
//set border width
//set color for cell border
//set filling color
//set cell height ratio
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//ADVANCED SETTINGS FOR CELL BORDERS
//add a page
//set border width
//set color for cell border
//set filling color
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//reset pointer to the last page
//---------------------------------------------------------
//Close and output PDF document
//============================================================+
//END OF FILE
//============================================================+
var ln;

require("../config/lang/eng.php");

require("../tcpdf.php");

var pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, "UTF-8", false);
pdf.SetCreator(PDF_CREATOR);
pdf.SetAuthor("Nicola Asuni");
pdf.SetTitle("TCPDF Example 057");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 057", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "B", 20);
pdf.AddPage();
pdf.Write(0, "Example of alignment options for Cell()", "", 0, "L", true, 0, false, false, 0);
pdf.SetFont("helvetica", "", 11);
pdf.SetLineWidth(0.7);
pdf.SetDrawColor(0, 128, 255);
pdf.setCellHeightRatio(3);
pdf.SetXY(15, 60);
pdf.Cell(30, 0, "Top-Center", 1, ln = 0, "C", 0, "", 0, false, "T", "C");
pdf.Cell(30, 0, "Center-Center", 1, ln = 0, "C", 0, "", 0, false, "C", "C");
pdf.Cell(30, 0, "Bottom-Center", 1, ln = 0, "C", 0, "", 0, false, "B", "C");
pdf.Cell(30, 0, "Ascent-Center", 1, ln = 0, "C", 0, "", 0, false, "A", "C");
pdf.Cell(30, 0, "Baseline-Center", 1, ln = 0, "C", 0, "", 0, false, "L", "C");
pdf.Cell(30, 0, "Descent-Center", 1, ln = 0, "C", 0, "", 0, false, "D", "C");
pdf.SetXY(15, 90);
pdf.Cell(30, 0, "Top-Top", 1, ln = 0, "C", 0, "", 0, false, "T", "T");
pdf.Cell(30, 0, "Center-Top", 1, ln = 0, "C", 0, "", 0, false, "C", "T");
pdf.Cell(30, 0, "Bottom-Top", 1, ln = 0, "C", 0, "", 0, false, "B", "T");
pdf.Cell(30, 0, "Ascent-Top", 1, ln = 0, "C", 0, "", 0, false, "A", "T");
pdf.Cell(30, 0, "Baseline-Top", 1, ln = 0, "C", 0, "", 0, false, "L", "T");
pdf.Cell(30, 0, "Descent-Top", 1, ln = 0, "C", 0, "", 0, false, "D", "T");
pdf.SetXY(15, 120);
pdf.Cell(30, 0, "Top-Bottom", 1, ln = 0, "C", 0, "", 0, false, "T", "B");
pdf.Cell(30, 0, "Center-Bottom", 1, ln = 0, "C", 0, "", 0, false, "C", "B");
pdf.Cell(30, 0, "Bottom-Bottom", 1, ln = 0, "C", 0, "", 0, false, "B", "B");
pdf.Cell(30, 0, "Ascent-Bottom", 1, ln = 0, "C", 0, "", 0, false, "A", "B");
pdf.Cell(30, 0, "Baseline-Bottom", 1, ln = 0, "C", 0, "", 0, false, "L", "B");
pdf.Cell(30, 0, "Descent-Bottom", 1, ln = 0, "C", 0, "", 0, false, "D", "B");
var linestyle = {
  width: 0.1,
  cap: "butt",
  join: "miter",
  dash: "",
  phase: 0,
  color: [255, 0, 0]
};
pdf.Line(15, 60, 195, 60, linestyle);
pdf.Line(15, 90, 195, 90, linestyle);
pdf.Line(15, 120, 195, 120, linestyle);
pdf.Image("../images/tcpdf_cell.png", 15, 160, 100, 100, "PNG", "", "", false, 300, "", false, false, 0, false, false, false);
var legend = "LEGEND:\n\nX: cell x top-left origin (top-right for RTL)\nY: cell y top-left origin (top-right for RTL)\nCW: cell width\nCH: cell height\nLW: line width\nNRL: normal line position\nEXT: external line position\nINT: internal line position\nML: margin left\nMR: margin right\nMT: margin top\nMB: margin bottom\nPL: padding left\nPR: padding right\nPT: padding top\nPB: padding bottom\nTW: text width\nFA: font ascent\nFB: font baseline\nFD: font descent";
pdf.SetFont("helvetica", "", 10);
pdf.setCellHeightRatio(1.25);
pdf.MultiCell(0, 0, legend, 0, "L", false, 1, 125, 160, true, 0, false, true, 0, "T", false);
pdf.AddPage();
pdf.SetFont("helvetica", "B", 20);
pdf.Write(0, "Example of borders for Cell()", "", 0, "L", true, 0, false, false, 0);
pdf.SetFont("helvetica", "", 11);
pdf.SetLineWidth(0.508);
pdf.SetDrawColor(0, 128, 255);
pdf.SetFillColor(255, 255, 128);
pdf.setCellHeightRatio(3);
pdf.Cell(30, 0, "1", 1, 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(2);
pdf.Cell(30, 0, "LTRB", "LTRB", 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(2);
pdf.Cell(30, 0, "LTR", "LTR", 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(2);
pdf.Cell(30, 0, "TRB", "TRB", 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(2);
pdf.Cell(30, 0, "LRB", "LRB", 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(2);
pdf.Cell(30, 0, "LTB", "LTB", 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(2);
pdf.Cell(30, 0, "LT", "LT", 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(2);
pdf.Cell(30, 0, "TR", "TR", 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(2);
pdf.Cell(30, 0, "RB", "RB", 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(2);
pdf.Cell(30, 0, "LB", "LB", 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(2);
pdf.Cell(30, 0, "LR", "LR", 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(2);
pdf.Cell(30, 0, "TB", "TB", 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(2);
pdf.Cell(30, 0, "L", "L", 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(2);
pdf.Cell(30, 0, "T", "T", 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(2);
pdf.Cell(30, 0, "R", "R", 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(2);
pdf.Cell(30, 0, "B", "B", 1, "C", 1, "", 0, false, "T", "C");
pdf.AddPage();
pdf.SetFont("helvetica", "B", 20);
pdf.Write(0, "Example of advanced border settings for Cell()", "", 0, "L", true, 0, false, false, 0);
pdf.SetFont("helvetica", "", 11);
pdf.SetLineWidth(1);
pdf.SetDrawColor(0, 128, 255);
pdf.SetFillColor(255, 255, 128);
var border = {
  LTRB: {
    width: 2,
    cap: "butt",
    join: "miter",
    dash: 0,
    color: [255, 0, 0]
  }
};
pdf.Cell(30, 0, "LTRB", border, 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(5);
border = {
  L: {
    width: 2,
    cap: "square",
    join: "miter",
    dash: 0,
    color: [255, 0, 0]
  },
  R: {
    width: 2,
    cap: "square",
    join: "miter",
    dash: 0,
    color: [255, 0, 255]
  },
  T: {
    width: 2,
    cap: "square",
    join: "miter",
    dash: 0,
    color: [0, 255, 0]
  },
  B: {
    width: 2,
    cap: "square",
    join: "miter",
    dash: 0,
    color: [0, 0, 255]
  }
};
pdf.Cell(30, 0, "LTRB", border, 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(5);
border = {
  mode: "ext",
  LTRB: {
    width: 2,
    cap: "butt",
    join: "miter",
    dash: 0,
    color: [255, 0, 0]
  }
};
pdf.Cell(30, 0, "LTRB EXT", border, 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(5);
border = {
  mode: "int",
  LTRB: {
    width: 2,
    cap: "butt",
    join: "miter",
    dash: 0,
    color: [255, 0, 0]
  }
};
pdf.Cell(30, 0, "LTRB INT", border, 1, "C", 1, "", 0, false, "T", "C");
pdf.Ln(5);
pdf.lastPage();
pdf.Output("example_057.pdf", "I");