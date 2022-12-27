//============================================================+
//File name   : example_014.php
//Begin       : 2008-03-04
//Last Update : 2010-08-08
//
//Description : Example 014 for TCPDF class
//Javascript Form and user rights (only works on Adobe Acrobat)
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
//@abstract TCPDF - Example: Javascript Form and user rights (only works on Adobe Acrobat)
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
//IMPORTANT: disable font subsetting to allow users editing the document
//set font
//add a page
//It is possible to create text fields, combo boxes, check boxes and buttons.
//Fields are created at the current position and are given a name.
//This name allows to manipulate them via JavaScript in order to perform some validation for instance.
//set default form properties
//First name
//Last name
//Gender
//Drink
//$pdf->RadioButton('drink', 5, array('readonly' => 'true'), array(), 'Water');
//Newsletter
//Adress
//Listbox
//E-mail
//Date of the day
//Button to validate and print
//Reset Button
//Submit Button
//Form validation functions
//Add Javascript code
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
pdf.SetTitle("TCPDF Example 014");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 014", PDF_HEADER_STRING);
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
pdf.setFormDefaultProp({
	lineWidth: 1,
	borderStyle: "solid",
	fillColor: [255, 255, 200],
	strokeColor: [255, 128, 128]
});
pdf.SetFont("helvetica", "BI", 18);
pdf.Cell(0, 5, "Example of Form", 0, 1, "C");
pdf.Ln(10);
pdf.SetFont("helvetica", "", 12);
pdf.Cell(35, 5, "First name:");
pdf.TextField("firstname", 50, 5);
pdf.Ln(6);
pdf.Cell(35, 5, "Last name:");
pdf.TextField("lastname", 50, 5);
pdf.Ln(6);
pdf.Cell(35, 5, "Gender:");
pdf.ComboBox("gender", 30, 5, [["", "-"], ["M", "Male"], ["F", "Female"]]);
pdf.Ln(6);
pdf.Cell(35, 5, "Drink:");
pdf.RadioButton("drink", 5, Array(), Array(), "Water");
pdf.Cell(35, 5, "Water");
pdf.Ln(6);
pdf.Cell(35, 5, "");
pdf.RadioButton("drink", 5, Array(), Array(), "Beer", true);
pdf.Cell(35, 5, "Beer");
pdf.Ln(6);
pdf.Cell(35, 5, "");
pdf.RadioButton("drink", 5, Array(), Array(), "Wine");
pdf.Cell(35, 5, "Wine");
pdf.Ln(6);
pdf.Cell(35, 5, "");
pdf.RadioButton("drink", 5, Array(), Array(), "Milk");
pdf.Cell(35, 5, "Milk");
pdf.Ln(10);
pdf.Cell(35, 5, "Newsletter:");
pdf.CheckBox("newsletter", 5, true, Array(), Array(), "OK");
pdf.Ln(10);
pdf.Cell(35, 5, "Address:");
pdf.TextField("address", 60, 18, {
	multiline: true,
	lineWidth: 0,
	borderStyle: "none"
}, {
	v: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	dv: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
});
pdf.Ln(19);
pdf.Cell(35, 5, "List:");
pdf.ListBox("listbox", 60, 15, ["", "item1", "item2", "item3", "item4", "item5", "item6", "item7"], {
	multipleSelection: "true"
});
pdf.Ln(20);
pdf.Cell(35, 5, "E-mail:");
pdf.TextField("email", 50, 5);
pdf.Ln(6);
pdf.Cell(35, 5, "Date:");
pdf.TextField("date", 30, 5, Array(), {
	v: date("Y-m-d"),
	dv: date("Y-m-d")
});
pdf.Ln(10);
pdf.SetX(50);
pdf.Button("print", 30, 10, "Print", "Print()", {
	lineWidth: 2,
	borderStyle: "beveled",
	fillColor: [128, 196, 255],
	strokeColor: [64, 64, 64]
});
pdf.Button("reset", 30, 10, "Reset", {
	S: "ResetForm"
}, {
	lineWidth: 2,
	borderStyle: "beveled",
	fillColor: [128, 196, 255],
	strokeColor: [64, 64, 64]
});
pdf.Button("submit", 30, 10, "Submit", {
	S: "SubmitForm",
	F: "http://localhost/printvars.php",
	Flags: ["ExportFormat"]
}, {
	lineWidth: 2,
	borderStyle: "beveled",
	fillColor: [128, 196, 255],
	strokeColor: [64, 64, 64]
});
var js = `function CheckField(name,message) {\n\tvar f = getField(name);\n\tif(f.value == '') {\n\t    app.alert(message);\n\t    f.setFocus();\n\t    return false;\n\t}\n\treturn true;\n}\nfunction Print() {\n\tif(!CheckField('firstname','First name is mandatory')) {return;}\n\tif(!CheckField('lastname','Last name is mandatory')) {return;}\n\tif(!CheckField('gender','Gender is mandatory')) {return;}\n\tif(!CheckField('address','Address is mandatory')) {return;}\n\tprint();\n}\n`;
pdf.IncludeJS(js);
pdf.Output("example_014.pdf", "I");