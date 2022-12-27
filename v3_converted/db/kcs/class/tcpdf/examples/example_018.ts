//============================================================+
//File name   : example_018.php
//Begin       : 2008-03-06
//Last Update : 2011-10-01
//
//Description : Example 018 for TCPDF class
//RTL document with Persian language
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
//@abstract TCPDF - Example: RTL document with Persian language
//@author Nicola Asuni
//@since 2008-03-06
//
//create new PDF document
//set document information
//set default header data
//set header and footer fonts
//set default monospaced font
//set margins
//set auto page breaks
//set image scale factor
//set some language dependent data:
//set some language-dependent strings
//---------------------------------------------------------
//set font
//add a page
//Persian and English content
//set LTR direction for english translation
//print newline
//Persian and English content
//Restore RTL direction
//set font
//print newline
//Arabic and English content
//set LTR direction for english translation
//print newline
//Arabic and English content
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
pdf.SetTitle("TCPDF Example 018");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 018", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
var lg = Array();
lg.a_meta_charset = "UTF-8";
lg.a_meta_dir = "rtl";
lg.a_meta_language = "fa";
lg.w_page = "page";
pdf.setLanguageArray(lg);
pdf.SetFont("dejavusans", "", 12);
pdf.AddPage();
var htmlpersian = "<span color=\"#660000\">Persian example:</span><br />\u0633\u0644\u0627\u0645 \u0628\u0627\u0644\u0627\u062E\u0631\u0647 \u0645\u0634\u06A9\u0644 PDF \u0641\u0627\u0631\u0633\u06CC \u0628\u0647 \u0637\u0648\u0631 \u06A9\u0627\u0645\u0644 \u062D\u0644 \u0634\u062F. \u0627\u06CC\u0646\u0645 \u06CC\u06A9 \u0646\u0645\u0648\u0646\u0634.<br />\u0645\u0634\u06A9\u0644 \u062D\u0631\u0641 \"\u0698\" \u062F\u0631 \u0628\u0639\u0636\u06CC \u06A9\u0644\u0645\u0627\u062A \u0645\u0627\u0646\u0646\u062F \u06A9\u0644\u0645\u0647 \u0648\u06CC\u0698\u0647 \u0646\u06CC\u0632 \u0628\u0631 \u0637\u0631\u0641 \u0634\u062F.<br />\u0646\u06AF\u0627\u0631\u0634 \u062D\u0631\u0648\u0641 \u0644\u0627\u0645 \u0648 \u0627\u0644\u0641 \u067E\u0634\u062A \u0633\u0631 \u0647\u0645 \u0646\u06CC\u0632 \u062A\u0635\u062D\u06CC\u062D \u0634\u062F.<br />\u0628\u0627 \u062A\u0634\u06A9\u0631 \u0627\u0632  \"Asuni Nicola\" \u0648 \u0645\u062D\u0645\u062F \u0639\u0644\u06CC \u06AF\u0644 \u06A9\u0627\u0631 \u0628\u0631\u0627\u06CC \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0632\u0628\u0627\u0646 \u0641\u0627\u0631\u0633\u06CC.";
pdf.WriteHTML(htmlpersian, true, 0, true, 0);
pdf.setRTL(false);
pdf.SetFontSize(10);
pdf.Ln();
var htmlpersiantranslation = "<span color=\"#0000ff\">Hi, At last Problem of Persian PDF Solved completely. This is a example for it.<br />Problem of \"jeh\" letter in some word like \"\u0648\u06CC\u0698\u0647\" (=special) fix too.<br />The joining of laa and alf letter fix now.<br />Special thanks to \"Nicola Asuni\" and \"Mohamad Ali Golkar\" for Persian support.</span>";
pdf.WriteHTML(htmlpersiantranslation, true, 0, true, 0);
pdf.setRTL(true);
pdf.SetFont("aefurat", "", 18);
pdf.Ln();
pdf.Cell(0, 12, "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650", 0, 1, "C");
var htmlcontent = "\u062A\u0645\u0651\u064E \u0628\u0650\u062D\u0645\u062F \u0627\u0644\u0644\u0647 \u062D\u0644\u0651 \u0645\u0634\u0643\u0644\u0629 \u0627\u0644\u0643\u062A\u0627\u0628\u0629 \u0628\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0641\u064A \u0645\u0644\u0641\u0627\u062A \u0627\u0644\u0640<span color=\"#FF0000\">PDF</span> \u0645\u0639 \u062F\u0639\u0645 \u0627\u0644\u0643\u062A\u0627\u0628\u0629 <span color=\"#0000FF\">\u0645\u0646 \u0627\u0644\u064A\u0645\u064A\u0646 \u0625\u0644\u0649 \u0627\u0644\u064A\u0633\u0627\u0631</span> \u0648<span color=\"#009900\">\u0627\u0644\u062D\u0631\u0643\u064E\u0627\u062A</span> .<br />\u062A\u0645 \u0627\u0644\u062D\u0644 \u0628\u0648\u0627\u0633\u0637\u0629 <span color=\"#993399\">\u0635\u0627\u0644\u062D \u0627\u0644\u0645\u0637\u0631\u0641\u064A \u0648 Asuni Nicola</span>  . ";
pdf.WriteHTML(htmlcontent, true, 0, true, 0);
pdf.setRTL(false);
pdf.Ln();
pdf.SetFont("aealarabiya", "", 18);
var htmlcontent2 = "<span color=\"#0000ff\">This is Arabic \"\u0627\u0644\u0639\u0631\u0628\u064A\u0629\" Example With TCPDF.</span>";
pdf.WriteHTML(htmlcontent2, true, 0, true, 0);
pdf.Output("example_018.pdf", "I");