//============================================================+
//File name   : example_006.php
//Begin       : 2008-03-04
//Last Update : 2010-11-20
//
//Description : Example 006 for TCPDF class
//WriteHTML and RTL support
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
//@abstract TCPDF - Example: WriteHTML and RTL support
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
//writeHTML($html, $ln=true, $fill=false, $reseth=false, $cell=false, $align='')
//writeHTMLCell($w, $h, $x, $y, $html='', $border=0, $ln=0, $fill=0, $reseth=true, $align='', $autopadding=true)
//create some HTML content
//output the HTML content
//output some RTL HTML content
//test some inline CSS
//reset pointer to the last page
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//Print a table
//add a page
//create some HTML content
//output the HTML content
//Print some HTML Cells
//reset pointer to the last page
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//Print a table
//add a page
//create some HTML content
//output the HTML content
//reset pointer to the last page
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//Print all HTML colors
//add a page
//output the HTML content
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//Test word-wrap
//create some HTML content
//output the HTML content
//Test fonts nesting
//output the HTML content
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//test pre tag
//add a page
//output the HTML content
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//test custom bullet points for list
//add a page
//output the HTML content
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
pdf.SetTitle("TCPDF Example 006");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 006", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("dejavusans", "", 10);
pdf.AddPage();
var html = "<h1>HTML Example</h1>\nSome special characters: &lt; \u20AC &euro; &#8364; &amp; \xE8 &egrave; &copy; &gt; \\slash \\\\double-slash \\\\\\triple-slash\n<h2>List</h2>\nList example:\n<ol>\n\t<li><img src=\"../images/logo_example.png\" alt=\"test alt attribute\" width=\"30\" height=\"30\" border=\"0\" /> test image</li>\n\t<li><b>bold text</b></li>\n\t<li><i>italic text</i></li>\n\t<li><u>underlined text</u></li>\n\t<li><b>b<i>bi<u>biu</u>bi</i>b</b></li>\n\t<li><a href=\"http://www.tecnick.com\" dir=\"ltr\">link to http://www.tecnick.com</a></li>\n\t<li>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.<br />Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</li>\n\t<li>SUBLIST\n\t\t<ol>\n\t\t\t<li>row one\n\t\t\t\t<ul>\n\t\t\t\t\t<li>sublist</li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\t\t\t<li>row two</li>\n\t\t</ol>\n\t</li>\n\t<li><b>T</b>E<i>S</i><u>T</u> <del>line through</del></li>\n\t<li><font size=\"+3\">font + 3</font></li>\n\t<li><small>small text</small> normal <small>small text</small> normal <sub>subscript</sub> normal <sup>superscript</sup> normal</li>\n</ol>\n<dl>\n\t<dt>Coffee</dt>\n\t<dd>Black hot drink</dd>\n\t<dt>Milk</dt>\n\t<dd>White cold drink</dd>\n</dl>\n<div style=\"text-align:center\">IMAGES<br />\n<img src=\"../images/logo_example.png\" alt=\"test alt attribute\" width=\"100\" height=\"100\" border=\"0\" /><img src=\"../images/tiger.ai\" alt=\"test alt attribute\" width=\"100\" height=\"100\" border=\"0\" /><img src=\"../images/logo_example.jpg\" alt=\"test alt attribute\" width=\"100\" height=\"100\" border=\"0\" />\n</div>";
pdf.writeHTML(html, true, false, true, false, "");
html = "<div style=\"text-align:center\">The words &#8220;<span dir=\"rtl\">&#1502;&#1494;&#1500; [mazel] &#1496;&#1493;&#1489; [tov]</span>&#8221; mean &#8220;Congratulations!&#8221;</div>";
pdf.writeHTML(html, true, false, true, false, "");
html = "<p>This is just an example of html code to demonstrate some supported CSS inline styles.\n<span style=\"font-weight: bold;\">bold text</span>\n<span style=\"text-decoration: line-through;\">line-trough</span>\n<span style=\"text-decoration: underline line-through;\">underline and line-trough</span>\n<span style=\"color: rgb(0, 128, 64);\">color</span>\n<span style=\"background-color: rgb(255, 0, 0); color: rgb(255, 255, 255);\">background color</span>\n<span style=\"font-weight: bold;\">bold</span>\n<span style=\"font-size: xx-small;\">xx-small</span>\n<span style=\"font-size: x-small;\">x-small</span>\n<span style=\"font-size: small;\">small</span>\n<span style=\"font-size: medium;\">medium</span>\n<span style=\"font-size: large;\">large</span>\n<span style=\"font-size: x-large;\">x-large</span>\n<span style=\"font-size: xx-large;\">xx-large</span>\n</p>";
pdf.writeHTML(html, true, false, true, false, "");
pdf.lastPage();
pdf.AddPage();
var subtable = "<table border=\"1\" cellspacing=\"6\" cellpadding=\"4\"><tr><td>a</td><td>b</td></tr><tr><td>c</td><td>d</td></tr></table>";
html = "<h2>HTML TABLE:</h2>\n<table border=\"1\" cellspacing=\"3\" cellpadding=\"4\">\n\t<tr>\n\t\t<th>#</th>\n\t\t<th align=\"right\">RIGHT align</th>\n\t\t<th align=\"left\">LEFT align</th>\n\t\t<th>4A</th>\n\t</tr>\n\t<tr>\n\t\t<td>1</td>\n\t\t<td bgcolor=\"#cccccc\" align=\"center\" colspan=\"2\">A1 ex<i>amp</i>le <a href=\"http://www.tcpdf.org\">link</a> column span. One two tree four five six seven eight nine ten.<br />line after br<br /><small>small text</small> normal <sub>subscript</sub> normal <sup>superscript</sup> normal  bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla<ol><li>first<ol><li>sublist</li><li>sublist</li></ol></li><li>second</li></ol><small color=\"#FF0000\" bgcolor=\"#FFFF00\">small small small small small small small small small small small small small small small small small small small small</small></td>\n\t\t<td>4B</td>\n\t</tr>\n\t<tr>\n\t\t<td>" + subtable + "</td>\n\t\t<td bgcolor=\"#0000FF\" color=\"yellow\" align=\"center\">A2 \u20AC &euro; &#8364; &amp; \xE8 &egrave;<br/>A2 \u20AC &euro; &#8364; &amp; \xE8 &egrave;</td>\n\t\t<td bgcolor=\"#FFFF00\" align=\"left\"><font color=\"#FF0000\">Red</font> Yellow BG</td>\n\t\t<td>4C</td>\n\t</tr>\n\t<tr>\n\t\t<td>1A</td>\n\t\t<td rowspan=\"2\" colspan=\"2\" bgcolor=\"#FFFFCC\">2AA<br />2AB<br />2AC</td>\n\t\t<td bgcolor=\"#FF0000\">4D</td>\n\t</tr>\n\t<tr>\n\t\t<td>1B</td>\n\t\t<td>4E</td>\n\t</tr>\n\t<tr>\n\t\t<td>1C</td>\n\t\t<td>2C</td>\n\t\t<td>3C</td>\n\t\t<td>4F</td>\n\t</tr>\n</table>";
pdf.writeHTML(html, true, false, true, false, "");
html = "<span color=\"red\">red</span> <span color=\"green\">green</span> <span color=\"blue\">blue</span><br /><span color=\"red\">red</span> <span color=\"green\">green</span> <span color=\"blue\">blue</span>";
pdf.SetFillColor(255, 255, 0);
pdf.writeHTMLCell(0, 0, "", "", html, "LRTB", 1, 0, true, "L", true);
pdf.writeHTMLCell(0, 0, "", "", html, "LRTB", 1, 1, true, "C", true);
pdf.writeHTMLCell(0, 0, "", "", html, "LRTB", 1, 0, true, "R", true);
pdf.lastPage();
pdf.AddPage();
html = "<h1>Image alignments on HTML table</h1>\n<table cellpadding=\"1\" cellspacing=\"1\" border=\"1\" style=\"text-align:center;\">\n<tr><td><img src=\"../images/logo_example.png\" border=\"0\" height=\"41\" width=\"41\" /></td></tr>\n<tr style=\"text-align:left;\"><td><img src=\"../images/logo_example.png\" border=\"0\" height=\"41\" width=\"41\" align=\"top\" /></td></tr>\n<tr style=\"text-align:center;\"><td><img src=\"../images/logo_example.png\" border=\"0\" height=\"41\" width=\"41\" align=\"middle\" /></td></tr>\n<tr style=\"text-align:right;\"><td><img src=\"../images/logo_example.png\" border=\"0\" height=\"41\" width=\"41\" align=\"bottom\" /></td></tr>\n<tr><td style=\"text-align:left;\"><img src=\"../images/logo_example.png\" border=\"0\" height=\"41\" width=\"41\" align=\"top\" /></td></tr>\n<tr><td style=\"text-align:center;\"><img src=\"../images/logo_example.png\" border=\"0\" height=\"41\" width=\"41\" align=\"middle\" /></td></tr>\n<tr><td style=\"text-align:right;\"><img src=\"../images/logo_example.png\" border=\"0\" height=\"41\" width=\"41\" align=\"bottom\" /></td></tr>\n</table>";
pdf.writeHTML(html, true, false, true, false, "");
pdf.lastPage();
pdf.AddPage();

require("../htmlcolors.php");

var textcolors = "<h1>HTML Text Colors</h1>";
var bgcolors = "<hr /><h1>HTML Background Colors</h1>";

for (var k in webcolor) {
	var v = webcolor[k];
	textcolors += "<span color=\"#" + v + "\">" + v + "</span> ";
	bgcolors += "<span bgcolor=\"#" + v + "\" color=\"#333333\">" + v + "</span> ";
}

pdf.writeHTML(textcolors, true, false, true, false, "");
pdf.writeHTML(bgcolors, true, false, true, false, "");
html = "<hr />\n<h1>Various tests</h1>\n<a href=\"#2\">link to page 2</a><br />\n<font face=\"courier\"><b>thisisaverylongword</b></font> <font face=\"helvetica\"><i>thisisanotherverylongword</i></font> <font face=\"times\"><b>thisisaverylongword</b></font> thisisanotherverylongword <font face=\"times\">thisisaverylongword</font> <font face=\"courier\"><b>thisisaverylongword</b></font> <font face=\"helvetica\"><i>thisisanotherverylongword</i></font> <font face=\"times\"><b>thisisaverylongword</b></font> thisisanotherverylongword <font face=\"times\">thisisaverylongword</font> <font face=\"courier\"><b>thisisaverylongword</b></font> <font face=\"helvetica\"><i>thisisanotherverylongword</i></font> <font face=\"times\"><b>thisisaverylongword</b></font> thisisanotherverylongword <font face=\"times\">thisisaverylongword</font> <font face=\"courier\"><b>thisisaverylongword</b></font> <font face=\"helvetica\"><i>thisisanotherverylongword</i></font> <font face=\"times\"><b>thisisaverylongword</b></font> thisisanotherverylongword <font face=\"times\">thisisaverylongword</font> <font face=\"courier\"><b>thisisaverylongword</b></font> <font face=\"helvetica\"><i>thisisanotherverylongword</i></font> <font face=\"times\"><b>thisisaverylongword</b></font> thisisanotherverylongword <font face=\"times\">thisisaverylongword</font>";
pdf.writeHTML(html, true, false, true, false, "");
var html1 = "Default <font face=\"courier\">Courier <font face=\"helvetica\">Helvetica <font face=\"times\">Times <font face=\"dejavusans\">dejavusans </font>Times </font>Helvetica </font>Courier </font>Default";
var html2 = "<small>small text</small> normal <small>small text</small> normal <sub>subscript</sub> normal <sup>superscript</sup> normal";
var html3 = "<font size=\"10\" color=\"#ff7f50\">The</font> <font size=\"10\" color=\"#6495ed\">quick</font> <font size=\"14\" color=\"#dc143c\">brown</font> <font size=\"18\" color=\"#008000\">fox</font> <font size=\"22\"><a href=\"http://www.tcpdf.org\">jumps</a></font> <font size=\"22\" color=\"#a0522d\">over</font> <font size=\"18\" color=\"#da70d6\">the</font> <font size=\"14\" color=\"#9400d3\">lazy</font> <font size=\"10\" color=\"#4169el\">dog</font>.";
html = html1 + "<br />" + html2 + "<br />" + html3 + "<br />" + html3 + "<br />" + html2;
pdf.writeHTML(html, true, false, true, false, "");
pdf.AddPage();
html = `<div style="background-color:#880000;color:white;">\nHello World!<br />\nHello\n</div>\n<pre style="background-color:#336699;color:white;">\nint main() {\n    printf("HelloWorld");\n    return 0;\n}\n</pre>\n<tt>Monospace font</tt>, normal font, <tt>monospace font</tt>, normal font.\n<br />\n<div style="background-color:#880000;color:white;">DIV LEVEL 1<div style="background-color:#008800;color:white;">DIV LEVEL 2</div>DIV LEVEL 1</div>\n<br />\n<span style="background-color:#880000;color:white;">SPAN LEVEL 1 <span style="background-color:#008800;color:white;">SPAN LEVEL 2</span> SPAN LEVEL 1</span>\n`;
pdf.writeHTML(html, true, false, true, false, "");
pdf.AddPage();
html = `<h1>Test custom bullet image for list items</h1>\n<ul style="font-size:14pt;list-style-type:img|png|4|4|../images/logo_example.png">\n\t<li>test custom bullet image</li>\n\t<li>test custom bullet image</li>\n\t<li>test custom bullet image</li>\n\t<li>test custom bullet image</li>\n<ul>\n`;
pdf.writeHTML(html, true, false, true, false, "");
pdf.lastPage();
pdf.Output("example_006.pdf", "I");