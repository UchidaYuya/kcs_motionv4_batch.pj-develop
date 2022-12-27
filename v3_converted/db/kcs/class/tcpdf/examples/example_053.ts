//============================================================+
//File name   : example_053.php
//Begin       : 2009-09-02
//Last Update : 2010-08-08
//
//Description : Example 053 for TCPDF class
//Javascript example.
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
//@abstract TCPDF - Example: Javascript example.
//@author Nicola Asuni
//@since 2009-09-02
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
//print a some of text
//write some JavaScript code
//force print dialog
//set javascript
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
pdf.SetTitle("TCPDF Example 053");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 053", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("times", "", 14);
pdf.AddPage();
var text = "This is an example of <strong>JavaScript</strong> usage on PDF documents.<br /><br />For more information check the source code of this example, the source code documentation for the <i>IncludeJS()</i> method and the <i>JavaScript for Acrobat API Reference</i> guide.<br /><br /><a href=\"http://www.tcpdf.org\">www.tcpdf.org</a>";
pdf.writeHTML(text, true, 0, true, 0);
var js = `app.alert('JavaScript Popup Example', 3, 0, 'Welcome');\nvar cResponse = app.response({\n\tcQuestion: 'How are you today?',\n\tcTitle: 'Your Health Status',\n\tcDefault: 'Fine',\n\tcLabel: 'Response:'\n});\nif (cResponse == null) {\n\tapp.alert('Thanks for trying anyway.', 3, 0, 'Result');\n} else {\n\tapp.alert('You responded, "'+cResponse+'", to the health question.', 3, 0, 'Result');\n}\n`;
js += "print(true);";
pdf.IncludeJS(js);
pdf.Output("example_053.pdf", "I");