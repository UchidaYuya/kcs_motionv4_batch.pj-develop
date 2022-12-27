//============================================================+
//File name   : example_061.php
//Begin       : 2010-05-24
//Last Update : 2010-08-08
//
//Description : Example 061 for TCPDF class
//XHTML + CSS
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
//@abstract TCPDF - Example: XHTML + CSS
//@author Nicola Asuni
//@since 2010-05-25
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
//NOTE:
// *********************************************************
// You can load external XHTML using :
//
// $html = file_get_contents('/path/to/your/file.html');
//
// External CSS files will be automatically loaded.
// Sometimes you need to fix the path of the external CSS.
// *********************************************************
//define some HTML content with style
//output the HTML content
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
//HTML TIPS & TRICKS
//
//REMOVE CELL PADDING
//
//$pdf->SetCellPadding(0);
//
//This is used to remove any additional vertical space inside a
//single cell of text.
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//REMOVE TAG TOP AND BOTTOM MARGINS
//
//$tagvs = array('p' => array(0 => array('h' => 0, 'n' => 0), 1 => array('h' => 0, 'n' => 0)));
//$pdf->setHtmlVSpace($tagvs);
//
//Since the CSS margin command is not yet implemented on TCPDF, you
//need to set the spacing of block tags using the following method.
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//SET LINE HEIGHT
//
//$pdf->setCellHeightRatio(1.25);
//
//You can use the following method to fine tune the line height
//(the number is a percentage relative to font height).
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//CHANGE THE PIXEL CONVERSION RATIO
//
//$pdf->setImageScale(0.47);
//
//This is used to adjust the conversion ratio between pixels and
//document units. Increase the value to get smaller objects.
//Since you are using pixel unit, this method is important to set the
//right zoom factor.
//
//Suppose that you want to print a web page larger 1024 pixels to
//fill all the available page width.
//An A4 page is larger 210mm equivalent to 8.268 inches, if you
//subtract 13mm (0.512") of margins for each side, the remaining
//space is 184mm (7.244 inches).
//The default resolution for a PDF document is 300 DPI (dots per
//inch), so you have 7.244 * 300 = 2173.2 dots (this is the maximum
//number of points you can print at 300 DPI for the given width).
//The conversion ratio is approximatively 1024 / 2173.2 = 0.47 px/dots
//If the web page is larger 1280 pixels, on the same A4 page the
//conversion ratio to use is 1280 / 2173.2 = 0.59 pixels/dots
//
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
pdf.SetTitle("TCPDF Example 061");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 061", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "", 10);
pdf.AddPage();
var html = `<!-- EXAMPLE OF CSS STYLE -->\n<style>\n\th1 {\n\t\tcolor: navy;\n\t\tfont-family: times;\n\t\tfont-size: 24pt;\n\t\ttext-decoration: underline;\n\t}\n\tp.first {\n\t\tcolor: #003300;\n\t\tfont-family: helvetica;\n\t\tfont-size: 12pt;\n\t}\n\tp.first span {\n\t\tcolor: #006600;\n\t\tfont-style: italic;\n\t}\n\tp#second {\n\t\tcolor: rgb(00,63,127);\n\t\tfont-family: times;\n\t\tfont-size: 12pt;\n\t\ttext-align: justify;\n\t}\n\tp#second > span {\n\t\tbackground-color: #FFFFAA;\n\t}\n\ttable.first {\n\t\tcolor: #003300;\n\t\tfont-family: helvetica;\n\t\tfont-size: 8pt;\n\t\tborder-left: 3px solid red;\n\t\tborder-right: 3px solid #FF00FF;\n\t\tborder-top: 3px solid green;\n\t\tborder-bottom: 3px solid blue;\n\t\tbackground-color: #ccffcc;\n\t}\n\ttd {\n\t\tborder: 2px solid blue;\n\t\tbackground-color: #ffffee;\n\t}\n\ttd.second {\n\t\tborder: 2px dashed green;\n\t}\n\tdiv.test {\n\t\tcolor: #CC0000;\n\t\tbackground-color: #FFFF66;\n\t\tfont-family: helvetica;\n\t\tfont-size: 10pt;\n\t\tborder-style: solid solid solid solid;\n\t\tborder-width: 2px 2px 2px 2px;\n\t\tborder-color: green #FF00FF blue red;\n\t\ttext-align: center;\n\t}\n</style>\n\n<h1 class="title">Example of <i style="color:#990000">XHTML + CSS</i></h1>\n\n<p class="first">Example of paragraph with class selector. <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed imperdiet lectus. Phasellus quis velit velit, non condimentum quam. Sed neque urna, ultrices ac volutpat vel, laoreet vitae augue. Sed vel velit erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras eget velit nulla, eu sagittis elit. Nunc ac arcu est, in lobortis tellus. Praesent condimentum rhoncus sodales. In hac habitasse platea dictumst. Proin porta eros pharetra enim tincidunt dignissim nec vel dolor. Cras sapien elit, ornare ac dignissim eu, ultricies ac eros. Maecenas augue magna, ultrices a congue in, mollis eu nulla. Nunc venenatis massa at est eleifend faucibus. Vivamus sed risus lectus, nec interdum nunc.</span></p>\n\n<p id="second">Example of paragraph with ID selector. <span>Fusce et felis vitae diam lobortis sollicitudin. Aenean tincidunt accumsan nisi, id vehicula quam laoreet elementum. Phasellus egestas interdum erat, et viverra ipsum ultricies ac. Praesent sagittis augue at augue volutpat eleifend. Cras nec orci neque. Mauris bibendum posuere blandit. Donec feugiat mollis dui sit amet pellentesque. Sed a enim justo. Donec tincidunt, nisl eget elementum aliquam, odio ipsum ultrices quam, eu porttitor ligula urna at lorem. Donec varius, eros et convallis laoreet, ligula tellus consequat felis, ut ornare metus tellus sodales velit. Duis sed diam ante. Ut rutrum malesuada massa, vitae consectetur ipsum rhoncus sed. Suspendisse potenti. Pellentesque a congue massa.</span></p>\n\n<div class="test">example of DIV with border and fill.<br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed imperdiet lectus.</div>\n\n<br />\n\n<table class="first" cellpadding="4" cellspacing="6">\n <tr>\n  <td width="30" align="center"><b>No.</b></td>\n  <td width="140" align="center" bgcolor="#FFFF00"><b>XXXX</b></td>\n  <td width="140" align="center"><b>XXXX</b></td>\n  <td width="80" align="center"> <b>XXXX</b></td>\n  <td width="80" align="center"><b>XXXX</b></td>\n  <td width="45" align="center"><b>XXXX</b></td>\n </tr>\n <tr>\n  <td width="30" align="center">1.</td>\n  <td width="140" rowspan="6" class="second">XXXX<br />XXXX<br />XXXX<br />XXXX<br />XXXX<br />XXXX<br />XXXX<br />XXXX</td>\n  <td width="140">XXXX<br />XXXX</td>\n  <td width="80">XXXX<br />XXXX</td>\n  <td width="80">XXXX</td>\n  <td align="center" width="45">XXXX<br />XXXX</td>\n </tr>\n <tr>\n  <td width="30" align="center" rowspan="3">2.</td>\n  <td width="140" rowspan="3">XXXX<br />XXXX</td>\n  <td width="80">XXXX<br />XXXX</td>\n  <td width="80">XXXX<br />XXXX</td>\n  <td align="center" width="45">XXXX<br />XXXX</td>\n </tr>\n <tr>\n  <td width="80">XXXX<br />XXXX<br />XXXX<br />XXXX</td>\n  <td width="80">XXXX<br />XXXX</td>\n  <td align="center" width="45">XXXX<br />XXXX</td>\n </tr>\n <tr>\n  <td width="80" rowspan="2" >XXXX<br />XXXX<br />XXXX<br />XXXX<br />XXXX<br />XXXX<br />XXXX<br />XXXX</td>\n  <td width="80">XXXX<br />XXXX</td>\n  <td align="center" width="45">XXXX<br />XXXX</td>\n </tr>\n <tr>\n  <td width="30" align="center">3.</td>\n  <td width="140">XXXX<br />XXXX</td>\n  <td width="80">XXXX<br />XXXX</td>\n  <td align="center" width="45">XXXX<br />XXXX</td>\n </tr>\n <tr bgcolor="#FFFF80">\n  <td width="30" align="center">4.</td>\n  <td width="140" bgcolor="#00CC00" color="#FFFF00">XXXX<br />XXXX</td>\n  <td width="80">XXXX<br />XXXX</td>\n  <td width="80">XXXX<br />XXXX</td>\n  <td align="center" width="45">XXXX<br />XXXX</td>\n </tr>\n</table>\n`;
pdf.writeHTML(html, true, false, true, false, "");
pdf.lastPage();
pdf.Output("example_061.pdf", "I");