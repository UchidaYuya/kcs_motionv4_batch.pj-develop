//============================================================+
//File name   : example_052.php
//Begin       : 2009-05-07
//Last Update : 2011-07-06
//
//Description : Example 052 for TCPDF class
//Certification Signature (experimental)
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
//@abstract TCPDF - Example: Certification Signature (experimental)
//@author Nicola Asuni
//@since 2009-05-07
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
//NOTES:
// - To create self-signed signature: openssl req -x509 -nodes -days 365000 -newkey rsa:1024 -keyout tcpdf.crt -out tcpdf.crt
// - To export crt to p12: openssl pkcs12 -export -in tcpdf.crt -out tcpdf.p12
// - To convert pfx certificate to pem: openssl pkcs12 -in tcpdf.pfx -out tcpdf.crt -nodes
//set certificate file
//set additional information
//set document signature
//set font
//add a page
//print a line of text
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// set signature appearance ***
//create content for signature (image and/or text)
//define active area for signature appearance
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// set an empty signature appearance ***
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
pdf.SetTitle("TCPDF Example 052");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 052", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
var certificate = "file://../tcpdf.crt";
var info = {
  Name: "TCPDF",
  Location: "Office",
  Reason: "Testing TCPDF",
  ContactInfo: "http://www.tcpdf.org"
};
pdf.setSignature(certificate, certificate, "tcpdfdemo", "", 2, info);
pdf.SetFont("helvetica", "", 12);
pdf.AddPage();
var text = "This is a <b color=\"#FF0000\">digitally signed document</b> using the default (example) <b>tcpdf.crt</b> certificate.<br />To validate this signature you have to load the <b color=\"#006600\">tcpdf.fdf</b> on the Arobat Reader to add the certificate to <i>List of Trusted Identities</i>.<br /><br />For more information check the source code of this example and the source code documentation for the <i>setSignature()</i> method.<br /><br /><a href=\"http://www.tcpdf.org\">www.tcpdf.org</a>";
pdf.writeHTML(text, true, 0, true, 0);
pdf.Image("../images/tcpdf_signature.png", 180, 60, 15, 15, "PNG");
pdf.setSignatureAppearance(180, 60, 15, 15);
pdf.addEmptySignatureAppearance(180, 80, 15, 15);
pdf.Output("example_052.pdf", "I");