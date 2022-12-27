//============================================================+
//File name   : example_015.php
//Begin       : 2008-03-04
//Last Update : 2013-01-28
//
//Description : Example 015 for TCPDF class
//Bookmarks (Table of Content)
//and Named Destinations.
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
//@abstract TCPDF - Example: Bookmarks (Table of Content)
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
//Bookmark($txt, $level=0, $y=-1, $page='', $style='', $color=array(0,0,0))
//set font
//add a page
//set a bookmark for the current position
//print a line using Cell()
//add other pages and bookmarks
//add a named destination so you can open this document at this page using the link: "example_015.pdf#chapter2"
//add a bookmark that points to a named destination
//attach an external file TXT file
//attach an external file
//add a bookmark that points to an embedded file
//NOTE: prefix the file name with the * character for generic file and with % character for PDF file
//add a bookmark that points to an embedded file
//NOTE: prefix the file name with the * character for generic file and with % character for PDF file
//add a bookmark that points to an external URL
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
pdf.SetTitle("TCPDF Example 015");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 015", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("times", "B", 20);
pdf.AddPage();
pdf.Bookmark("Chapter 1", 0, 0, "", "B", [0, 64, 128]);
pdf.Cell(0, 10, "Chapter 1", 0, 1, "L");
pdf.SetFont("times", "I", 14);
pdf.Write(0, "You can set PDF Bookmarks using the Bookmark() method.\nYou can set PDF Named Destinations using the setDestination() method.");
pdf.SetFont("times", "B", 20);
pdf.AddPage();
pdf.Bookmark("Paragraph 1.1", 1, 0, "", "", [0, 0, 0]);
pdf.Cell(0, 10, "Paragraph 1.1", 0, 1, "L");
pdf.AddPage();
pdf.Bookmark("Paragraph 1.2", 1, 0, "", "", [0, 0, 0]);
pdf.Cell(0, 10, "Paragraph 1.2", 0, 1, "L");
pdf.AddPage();
pdf.Bookmark("Sub-Paragraph 1.2.1", 2, 0, "", "I", [0, 0, 0]);
pdf.Cell(0, 10, "Sub-Paragraph 1.2.1", 0, 1, "L");
pdf.AddPage();
pdf.Bookmark("Paragraph 1.3", 1, 0, "", "", [0, 0, 0]);
pdf.Cell(0, 10, "Paragraph 1.3", 0, 1, "L");
pdf.AddPage();
pdf.setDestination("chapter2", 0, "");
pdf.Bookmark("Chapter 2", 0, 0, "", "BI", [128, 0, 0], -1, "#chapter2");
pdf.Cell(0, 10, "Chapter 2", 0, 1, "L");
pdf.SetFont("times", "I", 14);
pdf.Write(0, "Once saved, you can open this document at this page using the link: \"example_015.pdf#chapter2\".");
pdf.AddPage();
pdf.setDestination("chapter3", 0, "");
pdf.SetFont("times", "B", 20);
pdf.Bookmark("Chapter 3", 0, 0, "", "B", [0, 64, 128]);
pdf.Cell(0, 10, "Chapter 3", 0, 1, "L");
pdf.AddPage();
pdf.setDestination("chapter4", 0, "");
pdf.SetFont("times", "B", 20);
pdf.Bookmark("Chapter 4", 0, 0, "", "B", [0, 64, 128]);
pdf.Cell(0, 10, "Chapter 4", 0, 1, "L");
pdf.AddPage();
pdf.Bookmark("Chapter 5", 0, 0, "", "B", [0, 128, 0]);
pdf.Cell(0, 10, "Chapter 5", 0, 1, "L");
var txt = "Example of File Attachment.\nDouble click on the icon to open the attached file.";
pdf.SetFont("helvetica", "", 10);
pdf.Write(0, txt, "", 0, "L", true, 0, false, false, 0);
pdf.Annotation(20, 50, 5, 5, "TXT file", {
  Subtype: "FileAttachment",
  Name: "PushPin",
  FS: "../cache/utf8test.txt"
});
pdf.Annotation(50, 50, 5, 5, "PDF file", {
  Subtype: "FileAttachment",
  Name: "PushPin",
  FS: "example_012.pdf"
});
pdf.Bookmark("TXT file", 0, 0, "", "B", [128, 0, 255], -1, "*utf8test.txt");
pdf.Bookmark("PDF file", 0, 0, "", "B", [128, 0, 255], -1, "%example_012.pdf");
pdf.Bookmark("External URL", 0, 0, "", "B", [0, 0, 255], -1, "http://www.tcpdf.org");
pdf.Output("example_015.pdf", "I");