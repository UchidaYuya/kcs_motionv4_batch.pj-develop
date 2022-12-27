//============================================================+
//File name   : example_054.php
//Begin       : 2009-09-07
//Last Update : 2010-08-08
//
//Description : Example 054 for TCPDF class
//XHTML Forms
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
//@abstract TCPDF - Example: XHTML Forms
//@author Nicola Asuni
//@since 2009-09-07
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
//IMPORTANT: disable font subsetting to allow users editing the document
//set font
//add a page
//create some HTML content
//output the HTML content
//reset pointer to the last page
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
pdf.SetTitle("TCPDF Example 054");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 054", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.setFontSubsetting(false);
pdf.SetFont("helvetica", "", 10, "", false);
pdf.AddPage();
var html = `<h1>XHTML Form Example</h1>\n<form method="post" action="http://localhost/printvars.php" enctype="multipart/form-data">\n<label for="name">name:</label> <input type="text" name="name" value="" size="20" maxlength="30" /><br />\n<label for="password">password:</label> <input type="password" name="password" value="" size="20" maxlength="30" /><br /><br />\n<label for="infile">file:</label> <input type="file" name="userfile" size="20" /><br /><br />\n<input type="checkbox" name="agree" value="1" checked="checked" /> <label for="agree">I agree </label><br /><br />\n<input type="radio" name="radioquestion" id="rqa" value="1" /> <label for="rqa">one</label><br />\n<input type="radio" name="radioquestion" id="rqb" value="2" checked="checked"/> <label for="rqb">two</label><br />\n<input type="radio" name="radioquestion" id="rqc" value="3" /> <label for="rqc">three</label><br /><br />\n<label for="selection">select:</label>\n<select name="selection" size="0">\n\t<option value="0">zero</option>\n\t<option value="1">one</option>\n\t<option value="2">two</option>\n\t<option value="3">three</option>\n</select><br /><br />\n<label for="selection">select:</label>\n<select name="multiselection" size="2" multiple="multiple">\n\t<option value="0">zero</option>\n\t<option value="1">one</option>\n\t<option value="2">two</option>\n\t<option value="3">three</option>\n</select><br /><br /><br />\n<label for="text">text area:</label><br />\n<textarea cols="40" rows="3" name="text">line one\nline two</textarea><br />\n<br /><br /><br />\n<input type="reset" name="reset" value="Reset" />\n<input type="submit" name="submit" value="Submit" />\n<input type="button" name="print" value="Print" onclick="print()" />\n<input type="hidden" name="hiddenfield" value="OK" />\n<br />\n</form>\n`;
pdf.writeHTML(html, true, 0, true, 0);
pdf.lastPage();
pdf.Output("example_054.pdf", "I");