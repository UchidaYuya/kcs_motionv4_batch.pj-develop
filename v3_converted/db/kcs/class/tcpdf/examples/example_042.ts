//============================================================+
//File name   : example_042.php
//Begin       : 2008-12-23
//Last Update : 2010-08-08
//
//Description : Example 042 for TCPDF class
//Test Image with alpha channel
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
//@abstract TCPDF - Example: Test Image with alpha channel
//@author Nicola Asuni
//@since 2008-12-23
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
//set JPEG quality
//$pdf->setJPEGQuality(75);
//add a page
//create background text
//--- Method (A) ------------------------------------------
//the Image() method recognizes the alpha channel embedded on the image:
//--- Method (B) ------------------------------------------
//provide image + separate 8-bit mask
//first embed mask image (w, h, x and y will be ignored, the image will be scaled to the target image's size)
//embed image, masked with previously embedded mask
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
pdf.SetTitle("TCPDF Example 042");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 042", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "", 18);
pdf.AddPage();
var background_text = str_repeat("TCPDF test PNG Alpha Channel ", 50);
pdf.MultiCell(0, 5, background_text, 0, "J", 0, 2, "", "", true, 0, false);
pdf.Image("../images/image_with_alpha.png", 50, 50, 100, "", "", "http://www.tcpdf.org", "", false, 300);
var mask = pdf.Image("../images/alpha.png", 50, 140, 100, "", "", "", "", false, 300, "", true);
pdf.Image("../images/img.png", 50, 140, 100, "", "", "http://www.tcpdf.org", "", false, 300, "", false, mask);
pdf.Output("example_042.pdf", "I");