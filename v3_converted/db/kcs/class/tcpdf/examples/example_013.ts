//============================================================+
//File name   : example_013.php
//Begin       : 2008-03-04
//Last Update : 2010-08-08
//
//Description : Example 013 for TCPDF class
//Graphic Transformations
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
//@abstract TCPDF - Example: Graphic Transformations
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
//set font
//--- Scaling ---------------------------------------------
//Start Transformation
//Scale by 150% centered by (50,80) which is the lower left corner of the rectangle
//Stop Transformation
//--- Translation -----------------------------------------
//Start Transformation
//Translate 7 to the right, 5 to the bottom
//Stop Transformation
//--- Rotation --------------------------------------------
//Start Transformation
//Rotate 20 degrees counter-clockwise centered by (70,110) which is the lower left corner of the rectangle
//Stop Transformation
//--- Skewing ---------------------------------------------
//Start Transformation
//skew 30 degrees along the x-axis centered by (125,110) which is the lower left corner of the rectangle
//Stop Transformation
//--- Mirroring horizontally ------------------------------
//Start Transformation
//mirror horizontally with axis of reflection at x-position 70 (left side of the rectangle)
//Stop Transformation
//--- Mirroring vertically --------------------------------
//Start Transformation
//mirror vertically with axis of reflection at y-position 140 (bottom side of the rectangle)
//Stop Transformation
//--- Point reflection ------------------------------------
//Start Transformation
//point reflection at the lower left point of rectangle
//Stop Transformation
//--- Mirroring against a straigth line described by a point (120, 120) and an angle -20°
//just for visualisation: the straight line to mirror against
//Start Transformation
//mirror against the straight line
//Stop Transformation
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
pdf.SetTitle("TCPDF Example 013");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 013", PDF_HEADER_STRING);
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
pdf.Write(0, "Graphic Transformations", "", 0, "C", 1, 0, false, false, 0);
pdf.SetFont("helvetica", "", 10);
pdf.SetDrawColor(200);
pdf.SetTextColor(200);
pdf.Rect(50, 70, 40, 10, "D");
pdf.Text(50, 66, "Scale");
pdf.SetDrawColor(0);
pdf.SetTextColor(0);
pdf.StartTransform();
pdf.ScaleXY(150, 50, 80);
pdf.Rect(50, 70, 40, 10, "D");
pdf.Text(50, 66, "Scale");
pdf.StopTransform();
pdf.SetDrawColor(200);
pdf.SetTextColor(200);
pdf.Rect(125, 70, 40, 10, "D");
pdf.Text(125, 66, "Translate");
pdf.SetDrawColor(0);
pdf.SetTextColor(0);
pdf.StartTransform();
pdf.Translate(7, 5);
pdf.Rect(125, 70, 40, 10, "D");
pdf.Text(125, 66, "Translate");
pdf.StopTransform();
pdf.SetDrawColor(200);
pdf.SetTextColor(200);
pdf.Rect(70, 100, 40, 10, "D");
pdf.Text(70, 96, "Rotate");
pdf.SetDrawColor(0);
pdf.SetTextColor(0);
pdf.StartTransform();
pdf.Rotate(20, 70, 110);
pdf.Rect(70, 100, 40, 10, "D");
pdf.Text(70, 96, "Rotate");
pdf.StopTransform();
pdf.SetDrawColor(200);
pdf.SetTextColor(200);
pdf.Rect(125, 100, 40, 10, "D");
pdf.Text(125, 96, "Skew");
pdf.SetDrawColor(0);
pdf.SetTextColor(0);
pdf.StartTransform();
pdf.SkewX(30, 125, 110);
pdf.Rect(125, 100, 40, 10, "D");
pdf.Text(125, 96, "Skew");
pdf.StopTransform();
pdf.SetDrawColor(200);
pdf.SetTextColor(200);
pdf.Rect(70, 130, 40, 10, "D");
pdf.Text(70, 126, "MirrorH");
pdf.SetDrawColor(0);
pdf.SetTextColor(0);
pdf.StartTransform();
pdf.MirrorH(70);
pdf.Rect(70, 130, 40, 10, "D");
pdf.Text(70, 126, "MirrorH");
pdf.StopTransform();
pdf.SetDrawColor(200);
pdf.SetTextColor(200);
pdf.Rect(125, 130, 40, 10, "D");
pdf.Text(125, 126, "MirrorV");
pdf.SetDrawColor(0);
pdf.SetTextColor(0);
pdf.StartTransform();
pdf.MirrorV(140);
pdf.Rect(125, 130, 40, 10, "D");
pdf.Text(125, 126, "MirrorV");
pdf.StopTransform();
pdf.SetDrawColor(200);
pdf.SetTextColor(200);
pdf.Rect(70, 160, 40, 10, "D");
pdf.Text(70, 156, "MirrorP");
pdf.SetDrawColor(0);
pdf.SetTextColor(0);
pdf.StartTransform();
pdf.MirrorP(70, 170);
pdf.Rect(70, 160, 40, 10, "D");
pdf.Text(70, 156, "MirrorP");
pdf.StopTransform();
var angle = -20;
var px = 120;
var py = 170;
pdf.SetDrawColor(200);
pdf.Line(px - 1, py - 1, px + 1, py + 1);
pdf.Line(px - 1, py + 1, px + 1, py - 1);
pdf.StartTransform();
pdf.Rotate(angle, px, py);
pdf.Line(px - 5, py, px + 60, py);
pdf.StopTransform();
pdf.SetDrawColor(200);
pdf.SetTextColor(200);
pdf.Rect(125, 160, 40, 10, "D");
pdf.Text(125, 156, "MirrorL");
pdf.SetDrawColor(0);
pdf.SetTextColor(0);
pdf.StartTransform();
pdf.MirrorL(angle, px, py);
pdf.Rect(125, 160, 40, 10, "D");
pdf.Text(125, 156, "MirrorL");
pdf.StopTransform();
pdf.Output("example_013.pdf", "I");