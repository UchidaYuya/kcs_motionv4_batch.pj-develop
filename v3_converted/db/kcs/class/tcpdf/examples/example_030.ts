//============================================================+
//File name   : example_030.php
//Begin       : 2008-06-09
//Last Update : 2010-08-08
//
//Description : Example 030 for TCPDF class
//Colour gradients
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
//@abstract TCPDF - Example: Colour gradients
//@author Nicola Asuni
//@since 2008-06-09
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
//--- first page ------------------------------------------
//add a page
//set colors for gradients (r,g,b) or (grey 0-255)
//set the coordinates x1,y1,x2,y2 of the gradient (see linear_gradient_coords.jpg)
//paint a linear gradient
//write label
//set the coordinates fx,fy,cx,cy,r of the gradient (see radial_gradient_coords.jpg)
//paint a radial gradient
//write label
//paint a coons patch mesh with default coordinates
//write label
//set the coordinates for the cubic B�zier points x1,y1 ... x12, y12 of the patch (see coons_patch_mesh_coords.jpg)
//lower left
//minimum value of the coordinates
//maximum value of the coordinates
//paint a coons patch gradient with the above coordinates
//write label
//--- second page -----------------------------------------
//first patch: f = 0
//second patch - above the other: f = 2
//third patch - right of the above: f = 3
//fourth patch - below the above, which means left(?) of the above: f = 1
//write label
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
pdf.SetTitle("TCPDF Example 030");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 030", PDF_HEADER_STRING);
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
pdf.Cell(0, 0, "TCPDF Gradients", 0, 1, "C", 0, "", 0, false, "T", "M");
var red = [255, 0, 0];
var blue = [0, 0, 200];
var yellow = [255, 255, 0];
var green = [0, 255, 0];
var white = [255];
var black = [0];
var coords = [0, 0, 1, 0];
pdf.LinearGradient(20, 45, 80, 80, red, blue, coords);
pdf.Text(20, 130, "LinearGradient()");
coords = [0.5, 0.5, 1, 1, 1.2];
pdf.RadialGradient(110, 45, 80, 80, white, black, coords);
pdf.Text(110, 130, "RadialGradient()");
pdf.CoonsPatchMesh(20, 155, 80, 80, yellow, blue, green, red);
pdf.Text(20, 240, "CoonsPatchMesh()");
coords = [0, 0, 0.33, 0.2, 0.67, 0, 1, 0, 0.8, 0.33, 0.8, 0.67, 1, 1, 0.67, 0.8, 0.33, 1, 0, 1, 0.2, 0.67, 0, 0.33];
var coords_min = 0;
var coords_max = 1;
pdf.CoonsPatchMesh(110, 155, 80, 80, yellow, blue, green, red, coords, coords_min, coords_max);
pdf.Text(110, 240, "CoonsPatchMesh()");
pdf.AddPage();
patch_array[0].f = 0;
patch_array[0].points = [0, 0, 0.33, 0, 0.67, 0, 1, 0, 1, 0.33, 0.8, 0.67, 1, 1, 0.67, 0.8, 0.33, 1.8, 0, 1, 0, 0.67, 0, 0.33];
patch_array[0].colors[0] = {
	r: 255,
	g: 255,
	b: 0
};
patch_array[0].colors[1] = {
	r: 0,
	g: 0,
	b: 255
};
patch_array[0].colors[2] = {
	r: 0,
	g: 255,
	b: 0
};
patch_array[0].colors[3] = {
	r: 255,
	g: 0,
	b: 0
};
patch_array[1].f = 2;
patch_array[1].points = [0, 1.33, 0, 1.67, 0, 2, 0.33, 2, 0.67, 2, 1, 2, 1, 1.67, 1.5, 1.33];
patch_array[1].colors[0] = {
	r: 0,
	g: 0,
	b: 0
};
patch_array[1].colors[1] = {
	r: 255,
	g: 0,
	b: 255
};
patch_array[2].f = 3;
patch_array[2].points = [1.33, 0.8, 1.67, 1.5, 2, 1, 2, 1.33, 2, 1.67, 2, 2, 1.67, 2, 1.33, 2];
patch_array[2].colors[0] = {
	r: 0,
	g: 255,
	b: 255
};
patch_array[2].colors[1] = {
	r: 0,
	g: 0,
	b: 0
};
patch_array[3].f = 1;
patch_array[3].points = [2, 0.67, 2, 0.33, 2, 0, 1.67, 0, 1.33, 0, 1, 0, 1, 0.33, 0.8, 0.67];
patch_array[3].colors[0] = {
	r: 0,
	g: 0,
	b: 0
};
patch_array[3].colors[1] = {
	r: 0,
	g: 0,
	b: 255
};
coords_min = 0;
coords_max = 2;
pdf.CoonsPatchMesh(10, 45, 190, 200, "", "", "", "", patch_array, coords_min, coords_max);
pdf.Text(10, 250, "CoonsPatchMesh()");
pdf.Output("example_030.pdf", "I");