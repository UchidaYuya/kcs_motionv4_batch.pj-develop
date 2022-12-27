//============================================================+
//File name   : example_012.php
//Begin       : 2008-03-04
//Last Update : 2010-08-08
//
//Description : Example 012 for TCPDF class
//Graphic Functions
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
//@abstract TCPDF - Example: Graphic Functions
//@author Nicola Asuni
//@since 2008-03-04
//
//create new PDF document
//set document information
//disable header and footer
//set default monospaced font
//set margins
//set auto page breaks
//set image scale factor
//set some language-dependent strings
//---------------------------------------------------------
//set font
//add a page
//Line
//Rect
//Curve
//Circle and ellipse
//Polygon
//Polygonal Line
//Regular polygon
//Star polygon
//Rounded rectangle
//Arrows
//- . - . - . - . - . - . - . - . - . - . - . - . - . - . -
//ellipse
//add a page
//center of ellipse
//X Y axis
//ellipse axis
//ellipse
//ellipse arc
//---------------------------------------------------------
//Close and output PDF document
//============================================================+
//END OF FILE
//============================================================+
var x0, y0, x1, y1, head_style, arm_size, arm_angle, rx, ry, angle, astart, afinish, line_style, fill_color, nc;

require("../config/lang/eng.php");

require("../tcpdf.php");

var pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, "UTF-8", false);
pdf.SetCreator(PDF_CREATOR);
pdf.SetAuthor("Nicola Asuni");
pdf.SetTitle("TCPDF Example 012");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.setPrintHeader(false);
pdf.setPrintFooter(false);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "", 10);
pdf.AddPage();
var style = {
  width: 0.5,
  cap: "butt",
  join: "miter",
  dash: "10,20,5,10",
  phase: 10,
  color: [255, 0, 0]
};
var style2 = {
  width: 0.5,
  cap: "butt",
  join: "miter",
  dash: 0,
  color: [255, 0, 0]
};
var style3 = {
  width: 1,
  cap: "round",
  join: "round",
  dash: "2,10",
  color: [255, 0, 0]
};
var style4 = {
  L: 0,
  T: {
    width: 0.25,
    cap: "butt",
    join: "miter",
    dash: "20,10",
    phase: 10,
    color: [100, 100, 255]
  },
  R: {
    width: 0.5,
    cap: "round",
    join: "miter",
    dash: 0,
    color: [50, 50, 127]
  },
  B: {
    width: 0.75,
    cap: "square",
    join: "miter",
    dash: "30,10,5,10"
  }
};
var style5 = {
  width: 0.25,
  cap: "butt",
  join: "miter",
  dash: 0,
  color: [0, 64, 128]
};
var style6 = {
  width: 0.5,
  cap: "butt",
  join: "miter",
  dash: "10,10",
  color: [0, 128, 0]
};
var style7 = {
  width: 0.5,
  cap: "butt",
  join: "miter",
  dash: 0,
  color: [255, 128, 0]
};
pdf.Text(5, 4, "Line examples");
pdf.Line(5, 10, 80, 30, style);
pdf.Line(5, 10, 5, 30, style2);
pdf.Line(5, 10, 80, 10, style3);
pdf.Text(100, 4, "Rectangle examples");
pdf.Rect(100, 10, 40, 20, "DF", style4, [220, 220, 200]);
pdf.Rect(145, 10, 40, 20, "D", {
  all: style3
});
pdf.Text(5, 34, "Curve examples");
pdf.Curve(5, 40, 30, 55, 70, 45, 60, 75, undefined, style6);
pdf.Curve(80, 40, 70, 75, 150, 45, 100, 75, "F", style6);
pdf.Curve(140, 40, 150, 55, 180, 45, 200, 75, "DF", style6, [200, 220, 200]);
pdf.Text(5, 79, "Circle and ellipse examples");
pdf.SetLineStyle(style5);
pdf.Circle(25, 105, 20);
pdf.Circle(25, 105, 10, 90, 180, undefined, style6);
pdf.Circle(25, 105, 10, 270, 360, "F");
pdf.Circle(25, 105, 10, 270, 360, "C", style6);
pdf.SetLineStyle(style5);
pdf.Ellipse(100, 103, 40, 20);
pdf.Ellipse(100, 105, 20, 10, 0, 90, 180, undefined, style6);
pdf.Ellipse(100, 105, 20, 10, 0, 270, 360, "DF", style6);
pdf.SetLineStyle(style5);
pdf.Ellipse(175, 103, 30, 15, 45);
pdf.Ellipse(175, 105, 15, 7.5, 45, 90, 180, undefined, style6);
pdf.Ellipse(175, 105, 15, 7.5, 45, 270, 360, "F", style6, [220, 200, 200]);
pdf.Text(5, 129, "Polygon examples");
pdf.SetLineStyle({
  width: 0.5,
  cap: "butt",
  join: "miter",
  dash: 0,
  color: [0, 0, 0]
});
pdf.Polygon([5, 135, 45, 135, 15, 165]);
pdf.Polygon([60, 135, 80, 135, 80, 155, 70, 165, 50, 155], "DF", [style6, style7, style7, 0, style6], [220, 200, 200]);
pdf.Polygon([120, 135, 140, 135, 150, 155, 110, 155], "D", [style6, 0, style7, style6]);
pdf.Polygon([160, 135, 190, 155, 170, 155, 200, 160, 160, 165], "DF", {
  all: style6
}, [220, 220, 220]);
pdf.SetLineStyle({
  width: 0.5,
  cap: "butt",
  join: "miter",
  dash: 0,
  color: [0, 0, 164]
});
pdf.PolyLine([80, 165, 90, 160, 100, 165, 110, 160, 120, 165, 130, 160, 140, 165], "D", Array(), Array());
pdf.Text(5, 169, "Regular polygon examples");
pdf.SetLineStyle(style5);
pdf.RegularPolygon(20, 190, 15, 6, 0, 1, "F");
pdf.RegularPolygon(55, 190, 15, 6);
pdf.RegularPolygon(55, 190, 10, 6, 45, 0, "DF", [style6, 0, style7, 0, style7, style7]);
pdf.RegularPolygon(90, 190, 15, 3, 0, 1, "DF", {
  all: style5
}, [200, 220, 200], "F", [255, 200, 200]);
pdf.RegularPolygon(125, 190, 15, 4, 30, 1, undefined, {
  all: style5
}, undefined, undefined, style6);
pdf.RegularPolygon(160, 190, 15, 10);
pdf.Text(5, 209, "Star polygon examples");
pdf.SetLineStyle(style5);
pdf.StarPolygon(20, 230, 15, 20, 3, 0, 1, "F");
pdf.StarPolygon(55, 230, 15, 12, 5);
pdf.StarPolygon(55, 230, 7, 12, 5, 45, 0, "DF", {
  all: style7
}, [220, 220, 200], "F", [255, 200, 200]);
pdf.StarPolygon(90, 230, 15, 20, 6, 0, 1, "DF", {
  all: style5
}, [220, 220, 200], "F", [255, 200, 200]);
pdf.StarPolygon(125, 230, 15, 5, 2, 30, 1, undefined, {
  all: style5
}, undefined, undefined, style6);
pdf.StarPolygon(160, 230, 15, 10, 3);
pdf.StarPolygon(160, 230, 7, 50, 26);
pdf.Text(5, 249, "Rounded rectangle examples");
pdf.SetLineStyle({
  width: 0.5,
  cap: "butt",
  join: "miter",
  dash: 0,
  color: [0, 0, 0]
});
pdf.RoundedRect(5, 255, 40, 30, 3.5, "1111", "DF");
pdf.RoundedRect(50, 255, 40, 30, 6.5, "1000");
pdf.RoundedRect(95, 255, 40, 30, 10, "1111", undefined, style6);
pdf.RoundedRect(140, 255, 40, 30, 8, "0101", "DF", style6, [200, 200, 200]);
pdf.Text(185, 249, "Arrows");
pdf.SetLineStyle(style5);
pdf.SetFillColor(255, 0, 0);
pdf.Arrow(x0 = 200, y0 = 280, x1 = 185, y1 = 266, head_style = 0, arm_size = 5, arm_angle = 15);
pdf.Arrow(x0 = 200, y0 = 280, x1 = 190, y1 = 263, head_style = 1, arm_size = 5, arm_angle = 15);
pdf.Arrow(x0 = 200, y0 = 280, x1 = 195, y1 = 261, head_style = 2, arm_size = 5, arm_angle = 15);
pdf.Arrow(x0 = 200, y0 = 280, x1 = 200, y1 = 260, head_style = 3, arm_size = 5, arm_angle = 15);
pdf.AddPage();
pdf.Cell(0, 0, "Arc of Ellipse");
var xc = 100;
var yc = 100;
pdf.SetDrawColor(200, 200, 200);
pdf.Line(xc - 50, yc, xc + 50, yc);
pdf.Line(xc, yc - 50, xc, yc + 50);
pdf.SetDrawColor(200, 220, 255);
pdf.Line(xc - 50, yc - 50, xc + 50, yc + 50);
pdf.Line(xc - 50, yc + 50, xc + 50, yc - 50);
pdf.SetDrawColor(200, 255, 200);
pdf.Ellipse(xc, yc, rx = 30, ry = 15, angle = 45, astart = 0, afinish = 360, style = "D", line_style = Array(), fill_color = Array(), nc = 2);
pdf.SetDrawColor(255, 0, 0);
pdf.Ellipse(xc, yc, rx = 30, ry = 15, angle = 45, astart = 45, afinish = 90, style = "D", line_style = Array(), fill_color = Array(), nc = 2);
pdf.Output("example_012.pdf", "I");