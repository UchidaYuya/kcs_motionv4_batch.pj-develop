//============================================================+
//File name   : example_048.php
//Begin       : 2009-03-20
//Last Update : 2010-08-08
//
//Description : Example 048 for TCPDF class
//HTML tables and table headers
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
//@abstract TCPDF - Example: HTML tables and table headers
//@author Nicola Asuni
//@since 2009-03-20
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
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//Table with rowspans and THEAD
//-----------------------------------------------------------------------------
//NON-BREAKING TABLE (nobr="true")
//-----------------------------------------------------------------------------
//NON-BREAKING ROWS (nobr="true")
//-----------------------------------------------------------------------------
//Close and output PDF document
//============================================================+
//END OF FILE
//============================================================+

require("../config/lang/eng.php");

require("../tcpdf.php");

var pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, "UTF-8", false);
pdf.SetCreator(PDF_CREATOR);
pdf.SetAuthor("Nicola Asuni");
pdf.SetTitle("TCPDF Example 048");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 048", PDF_HEADER_STRING);
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
pdf.Write(0, "Example of HTML tables", "", 0, "L", true, 0, false, false, 0);
pdf.SetFont("helvetica", "", 8);
var tbl = `<table cellspacing="0" cellpadding="1" border="1">\n    <tr>\n        <td rowspan="3">COL 1 - ROW 1<br />COLSPAN 3</td>\n        <td>COL 2 - ROW 1</td>\n        <td>COL 3 - ROW 1</td>\n    </tr>\n    <tr>\n    \t<td rowspan="2">COL 2 - ROW 2 - COLSPAN 2<br />text line<br />text line<br />text line<br />text line</td>\n    \t<td>COL 3 - ROW 2</td>\n    </tr>\n    <tr>\n       <td>COL 3 - ROW 3</td>\n    </tr>\n  \n</table>\n`;
pdf.writeHTML(tbl, true, false, false, false, "");
tbl = `<table cellspacing="0" cellpadding="1" border="1">\n    <tr>\n        <td rowspan="3">COL 1 - ROW 1<br />COLSPAN 3<br />text line<br />text line<br />text line<br />text line<br />text line<br />text line</td>\n        <td>COL 2 - ROW 1</td>\n        <td>COL 3 - ROW 1</td>\n    </tr>\n    <tr>\n    \t<td rowspan="2">COL 2 - ROW 2 - COLSPAN 2<br />text line<br />text line<br />text line<br />text line</td>\n    \t <td>COL 3 - ROW 2</td>\n    </tr>\n    <tr>\n       <td>COL 3 - ROW 3</td>\n    </tr>\n  \n</table>\n`;
pdf.writeHTML(tbl, true, false, false, false, "");
tbl = `<table cellspacing="0" cellpadding="1" border="1">\n    <tr>\n        <td rowspan="3">COL 1 - ROW 1<br />COLSPAN 3<br />text line<br />text line<br />text line<br />text line<br />text line<br />text line</td>\n        <td>COL 2 - ROW 1</td>\n        <td>COL 3 - ROW 1</td>\n    </tr>\n    <tr>\n    \t<td rowspan="2">COL 2 - ROW 2 - COLSPAN 2<br />text line<br />text line<br />text line<br />text line</td>\n    \t <td>COL 3 - ROW 2<br />text line<br />text line</td>\n    </tr>\n    <tr>\n       <td>COL 3 - ROW 3</td>\n    </tr>\n  \n</table>\n`;
pdf.writeHTML(tbl, true, false, false, false, "");
tbl = `<table border="1">\n<tr>\n<th rowspan="3">Left column</th>\n<th colspan="5">Heading Column Span 5</th>\n<th colspan="9">Heading Column Span 9</th>\n</tr>\n<tr>\n<th rowspan="2">Rowspan 2<br />This is some text that fills the table cell.</th>\n<th colspan="2">span 2</th>\n<th colspan="2">span 2</th>\n<th rowspan="2">2 rows</th>\n<th colspan="8">Colspan 8</th>\n</tr>\n<tr>\n<th>1a</th>\n<th>2a</th>\n<th>1b</th>\n<th>2b</th>\n<th>1</th>\n<th>2</th>\n<th>3</th>\n<th>4</th>\n<th>5</th>\n<th>6</th>\n<th>7</th>\n<th>8</th>\n</tr>\n</table>\n`;
pdf.writeHTML(tbl, true, false, false, false, "");
tbl = `<table border="1" cellpadding="2" cellspacing="2">\n<thead>\n <tr style="background-color:#FFFF00;color:#0000FF;">\n  <td width="30" align="center"><b>A</b></td>\n  <td width="140" align="center"><b>XXXX</b></td>\n  <td width="140" align="center"><b>XXXX</b></td>\n  <td width="80" align="center"> <b>XXXX</b></td>\n  <td width="80" align="center"><b>XXXX</b></td>\n  <td width="45" align="center"><b>XXXX</b></td>\n </tr>\n <tr style="background-color:#FF0000;color:#FFFF00;">\n  <td width="30" align="center"><b>B</b></td>\n  <td width="140" align="center"><b>XXXX</b></td>\n  <td width="140" align="center"><b>XXXX</b></td>\n  <td width="80" align="center"> <b>XXXX</b></td>\n  <td width="80" align="center"><b>XXXX</b></td>\n  <td width="45" align="center"><b>XXXX</b></td>\n </tr>\n</thead>\n <tr>\n  <td width="30" align="center">1.</td>\n  <td width="140" rowspan="6">XXXX<br />XXXX<br />XXXX<br />XXXX<br />XXXX<br />XXXX<br />XXXX<br />XXXX</td>\n  <td width="140">XXXX<br />XXXX</td>\n  <td width="80">XXXX<br />XXXX</td>\n  <td width="80">XXXX</td>\n  <td align="center" width="45">XXXX<br />XXXX</td>\n </tr>\n <tr>\n  <td width="30" align="center" rowspan="3">2.</td>\n  <td width="140" rowspan="3">XXXX<br />XXXX</td>\n  <td width="80">XXXX<br />XXXX</td>\n  <td width="80">XXXX<br />XXXX</td>\n  <td align="center" width="45">XXXX<br />XXXX</td>\n </tr>\n <tr>\n  <td width="80">XXXX<br />XXXX<br />XXXX<br />XXXX</td>\n  <td width="80">XXXX<br />XXXX</td>\n  <td align="center" width="45">XXXX<br />XXXX</td>\n </tr>\n <tr>\n  <td width="80" rowspan="2" >RRRRRR<br />XXXX<br />XXXX<br />XXXX<br />XXXX<br />XXXX<br />XXXX<br />XXXX</td>\n  <td width="80">XXXX<br />XXXX</td>\n  <td align="center" width="45">XXXX<br />XXXX</td>\n </tr>\n <tr>\n  <td width="30" align="center">3.</td>\n  <td width="140">XXXX1<br />XXXX</td>\n  <td width="80">XXXX<br />XXXX</td>\n  <td align="center" width="45">XXXX<br />XXXX</td>\n </tr>\n <tr>\n  <td width="30" align="center">4.</td>\n  <td width="140">XXXX<br />XXXX</td>\n  <td width="80">XXXX<br />XXXX</td>\n  <td width="80">XXXX<br />XXXX</td>\n  <td align="center" width="45">XXXX<br />XXXX</td>\n </tr>\n</table>\n`;
pdf.writeHTML(tbl, true, false, false, false, "");
pdf.writeHTML(tbl, true, false, false, false, "");
tbl = `<table border="1" cellpadding="2" cellspacing="2" nobr="true">\n <tr>\n  <th colspan="3" align="center">NON-BREAKING TABLE</th>\n </tr>\n <tr>\n  <td>1-1</td>\n  <td>1-2</td>\n  <td>1-3</td>\n </tr>\n <tr>\n  <td>2-1</td>\n  <td>3-2</td>\n  <td>3-3</td>\n </tr>\n <tr>\n  <td>3-1</td>\n  <td>3-2</td>\n  <td>3-3</td>\n </tr>\n</table>\n`;
pdf.writeHTML(tbl, true, false, false, false, "");
tbl = `<table border="1" cellpadding="2" cellspacing="2" align="center">\n <tr nobr="true">\n  <th colspan="3">NON-BREAKING ROWS</th>\n </tr>\n <tr nobr="true">\n  <td>ROW 1<br />COLUMN 1</td>\n  <td>ROW 1<br />COLUMN 2</td>\n  <td>ROW 1<br />COLUMN 3</td>\n </tr>\n <tr nobr="true">\n  <td>ROW 2<br />COLUMN 1</td>\n  <td>ROW 2<br />COLUMN 2</td>\n  <td>ROW 2<br />COLUMN 3</td>\n </tr>\n <tr nobr="true">\n  <td>ROW 3<br />COLUMN 1</td>\n  <td>ROW 3<br />COLUMN 2</td>\n  <td>ROW 3<br />COLUMN 3</td>\n </tr>\n</table>\n`;
pdf.writeHTML(tbl, true, false, false, false, "");
pdf.Output("example_048.pdf", "I");