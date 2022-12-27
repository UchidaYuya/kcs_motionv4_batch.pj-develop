//============================================================+
//File name   : example_001.php
//Begin       : 2008-03-04
//Last Update : 2012-07-25
//
//Description : Example 001 for TCPDF class
//Default Header and Footer
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
//@abstract TCPDF - Example: Default Header and Footer
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
//set default font subsetting mode
//Set font
//dejavusans is a UTF-8 Unicode font, if you only need to
//print standard ASCII chars, you can use core fonts like
//helvetica or times to reduce file size.
//Add a page
//This method has several options, check the source code documentation for more information.
//set text shadow effect
//Set some content to print
//Print text using writeHTMLCell()
//---------------------------------------------------------
//Close and output PDF document
//This method has several options, check the source code documentation for more information.
//============================================================+
//END OF FILE
//============================================================+
var tc, lc, w, h, x, y, border, ln, fill, reseth, align, autopadding;

require("../config/lang/eng.php");

require("../tcpdf.php");

var pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, "UTF-8", false);
pdf.SetCreator(PDF_CREATOR);
pdf.SetAuthor("Nicola Asuni");
pdf.SetTitle("TCPDF Example 001");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 001", PDF_HEADER_STRING, [0, 64, 255], [0, 64, 128]);
pdf.setFooterData(tc = [0, 64, 0], lc = [0, 64, 128]);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.setFontSubsetting(true);
pdf.SetFont("dejavusans", "", 14, "", true);
pdf.AddPage();
pdf.setTextShadow({
  enabled: true,
  depth_w: 0.2,
  depth_h: 0.2,
  color: [196, 196, 196],
  opacity: 1,
  blend_mode: "Normal"
});
var html = `<h1>Welcome to <a href="http://www.tcpdf.org" style="text-decoration:none;background-color:#CC0000;color:black;">&nbsp;<span style="color:black;">TC</span><span style="color:white;">PDF</span>&nbsp;</a>!</h1>\n<i>This is the first example of TCPDF library.</i>\n<p>This text is printed using the <i>writeHTMLCell()</i> method but you can also use: <i>Multicell(), writeHTML(), Write(), Cell() and Text()</i>.</p>\n<p>Please check the source code documentation and other examples for further information.</p>\n<p style="color:#CC0000;">TO IMPROVE AND EXPAND TCPDF I NEED YOUR SUPPORT, PLEASE <a href="http://sourceforge.net/donate/index.php?group_id=128076">MAKE A DONATION!</a></p>\n`;
pdf.writeHTMLCell(w = 0, h = 0, x = "", y = "", html, border = 0, ln = 1, fill = 0, reseth = true, align = "", autopadding = true);
pdf.Output("example_001.pdf", "I");