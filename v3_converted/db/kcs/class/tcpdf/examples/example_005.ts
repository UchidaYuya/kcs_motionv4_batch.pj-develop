//============================================================+
//File name   : example_005.php
//Begin       : 2008-03-04
//Last Update : 2010-10-04
//
//Description : Example 005 for TCPDF class
//Multicell
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
//@abstract TCPDF - Example: Multicell
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
//set cell padding
//set cell margins
//set color for background
//MultiCell($w, $h, $txt, $border=0, $align='J', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0)
//set some text for example
//Multicell test
//set color for background
//Vertical alignment
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//set color for background
//set some text for example
//print a blox of text using multicell()
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//AUTO-FITTING
//set color for background
//Fit text on cell by reducing font size
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//CUSTOM PADDING
//set color for background
//set font
//set cell padding
//move pointer to last page
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
pdf.SetTitle("TCPDF Example 005");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 005", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("times", "", 10);
pdf.AddPage();
pdf.setCellPaddings(1, 1, 1, 1);
pdf.setCellMargins(1, 1, 1, 1);
pdf.SetFillColor(255, 255, 127);
var txt = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
pdf.MultiCell(55, 5, "[LEFT] " + txt, 1, "L", 1, 0, "", "", true);
pdf.MultiCell(55, 5, "[RIGHT] " + txt, 1, "R", 0, 1, "", "", true);
pdf.MultiCell(55, 5, "[CENTER] " + txt, 1, "C", 0, 0, "", "", true);
pdf.MultiCell(55, 5, "[JUSTIFY] " + txt + "\n", 1, "J", 1, 2, "", "", true);
pdf.MultiCell(55, 5, "[DEFAULT] " + txt, 1, "", 0, 1, "", "", true);
pdf.Ln(4);
pdf.SetFillColor(220, 255, 220);
pdf.MultiCell(55, 40, "[VERTICAL ALIGNMENT - TOP] " + txt, 1, "J", 1, 0, "", "", true, 0, false, true, 40, "T");
pdf.MultiCell(55, 40, "[VERTICAL ALIGNMENT - MIDDLE] " + txt, 1, "J", 1, 0, "", "", true, 0, false, true, 40, "M");
pdf.MultiCell(55, 40, "[VERTICAL ALIGNMENT - BOTTOM] " + txt, 1, "J", 1, 1, "", "", true, 0, false, true, 40, "B");
pdf.Ln(4);
pdf.SetFillColor(215, 235, 255);
txt = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed imperdiet lectus. Phasellus quis velit velit, non condimentum quam. Sed neque urna, ultrices ac volutpat vel, laoreet vitae augue. Sed vel velit erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras eget velit nulla, eu sagittis elit. Nunc ac arcu est, in lobortis tellus. Praesent condimentum rhoncus sodales. In hac habitasse platea dictumst. Proin porta eros pharetra enim tincidunt dignissim nec vel dolor. Cras sapien elit, ornare ac dignissim eu, ultricies ac eros. Maecenas augue magna, ultrices a congue in, mollis eu nulla. Nunc venenatis massa at est eleifend faucibus. Vivamus sed risus lectus, nec interdum nunc.\n\nFusce et felis vitae diam lobortis sollicitudin. Aenean tincidunt accumsan nisi, id vehicula quam laoreet elementum. Phasellus egestas interdum erat, et viverra ipsum ultricies ac. Praesent sagittis augue at augue volutpat eleifend. Cras nec orci neque. Mauris bibendum posuere blandit. Donec feugiat mollis dui sit amet pellentesque. Sed a enim justo. Donec tincidunt, nisl eget elementum aliquam, odio ipsum ultrices quam, eu porttitor ligula urna at lorem. Donec varius, eros et convallis laoreet, ligula tellus consequat felis, ut ornare metus tellus sodales velit. Duis sed diam ante. Ut rutrum malesuada massa, vitae consectetur ipsum rhoncus sed. Suspendisse potenti. Pellentesque a congue massa.";
pdf.MultiCell(80, 5, txt + "\n", 1, "J", 1, 1, "", "", true);
pdf.SetFillColor(255, 235, 235);
pdf.MultiCell(55, 60, "[FIT CELL] " + txt + "\n", 1, "J", 1, 1, 125, 145, true, 0, false, true, 60, "M", true);
pdf.SetFillColor(255, 255, 215);
pdf.SetFont("helvetica", "", 8);
pdf.setCellPaddings(2, 4, 6, 8);
txt = "CUSTOM PADDING:\nLeft=2, Top=4, Right=6, Bottom=8\nLorem ipsum dolor sit amet, consectetur adipiscing elit. In sed imperdiet lectus. Phasellus quis velit velit, non condimentum quam. Sed neque urna, ultrices ac volutpat vel, laoreet vitae augue.\n";
pdf.MultiCell(55, 5, txt, 1, "J", 1, 2, 125, 210, true);
pdf.lastPage();
pdf.Output("example_005.pdf", "I");