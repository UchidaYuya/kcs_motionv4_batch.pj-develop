//============================================================+
//File name   : example_064.php
//Begin       : 2010-10-13
//Last Update : 2010-10-15
//
//Description : Example 064 for TCPDF class
//No-write page regions
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
//@abstract TCPDF - Example: No-write page regions
//@author Nicola Asuni
//@since 2010-10-14
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
//define some html content for testing
//add a page
//print some graphic content
//define some graphic styles
//write a trapezoid with some information about no-write page regions
//write a trapezoid with some information about no-write page regions
//reset x,y position
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//define no-write page regions to avoid text overlapping images
//'page' => page number or empy for current page
//	'xt' => X top
//	'yt' => Y top
//	'yb' => Y bottom
//	'side' => page side ('L' = left or 'R' = right)
//set page regions, check also getPageRegions(), addPageRegion() and removePageRegion()
//write html text
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//set a circular no-write region on the second page
//define some html content for testing
//write text
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
pdf.SetTitle("TCPDF Example 064");
pdf.SetSubject("TCPDF Tutorial");
pdf.SetKeywords("TCPDF, PDF, example, test, guide");
pdf.SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE + " 064", PDF_HEADER_STRING);
pdf.setHeaderFont([PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN]);
pdf.setFooterFont([PDF_FONT_NAME_DATA, "", PDF_FONT_SIZE_DATA]);
pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
pdf.SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
pdf.SetHeaderMargin(PDF_MARGIN_HEADER);
pdf.SetFooterMargin(PDF_MARGIN_FOOTER);
pdf.SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
pdf.setLanguageArray(l);
pdf.SetFont("helvetica", "", 8);
var txt = "<p style=\"text-align:justify;color:blue;font-size:12pt;\"><span style=\"color:red;font-size:14pt;font-weight:bold;\">TEST PAGE REGIONS:</span> <span style=\"color:green;\">A no-write region is a portion of the page with a rectangular or trapezium shape that will not be covered when writing text or html code. A region is always aligned on the left or right side of the page ad is defined using a vertical segment. You can set multiple regions for the same page. You can combine several adjacent regions to aproximate curved shapes.</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed imperdiet lectus. Phasellus quis velit velit, non condimentum quam. Sed neque urna, ultrices ac volutpat vel, laoreet vitae augue. Sed vel velit erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras eget velit nulla, eu sagittis elit. Nunc ac arcu est, in lobortis tellus. Praesent condimentum rhoncus sodales. In hac habitasse platea dictumst. Proin porta eros pharetra enim tincidunt dignissim nec vel dolor. Cras sapien elit, ornare ac dignissim eu, ultricies ac eros. Maecenas augue magna, ultrices a congue in, mollis eu nulla. Nunc venenatis massa at est eleifend faucibus. Vivamus sed risus lectus, nec interdum nunc.\nFusce et felis vitae diam lobortis sollicitudin. Aenean tincidunt accumsan nisi, id vehicula quam laoreet elementum. Phasellus egestas interdum erat, et viverra ipsum ultricies ac. Praesent sagittis augue at augue volutpat eleifend. Cras nec orci neque. Mauris bibendum posuere blandit. Donec feugiat mollis dui sit amet pellentesque. Sed a enim justo. Donec tincidunt, nisl eget elementum aliquam, odio ipsum ultrices quam, eu porttitor ligula urna at lorem. Donec varius, eros et convallis laoreet, ligula tellus consequat felis, ut ornare metus tellus sodales velit. Duis sed diam ante. Ut rutrum malesuada massa, vitae consectetur ipsum rhoncus sed. Suspendisse potenti. Pellentesque a congue massa.\nInteger non sem eget neque mattis accumsan. Maecenas eu nisl mauris, sit amet interdum ipsum. In pharetra erat vel lectus venenatis elementum. Nulla non elit ligula, sit amet mollis urna. Morbi ut gravida est. Mauris tincidunt sem et turpis molestie malesuada. Curabitur vel nulla risus, sed mollis erat. Suspendisse vehicula accumsan purus nec varius. Donec fermentum lorem id felis sodales dictum. Quisque et dolor ipsum. Nam luctus consectetur dui vitae fermentum. Curabitur sodales consequat augue, id ultricies augue tempor ac. Aliquam ac magna id ipsum vehicula bibendum. Sed elementum congue tristique. <img src=\"../images/image_demo.jpg\" width=\"5mm\" height=\"5mm\" /> Phasellus vel lorem eu lectus porta sodales. Etiam neque tortor, sagittis id pharetra quis, laoreet vel arcu.\nCras quam mi, ornare laoreet laoreet vel, vehicula at lacus. Maecenas a lacus accumsan augue convallis sagittis sed quis odio. Morbi sit amet turpis diam, dictum convallis urna. Cras eget interdum augue. Cras eu nisi sit amet dolor faucibus porttitor. Suspendisse potenti. Nunc vitae dolor risus, at cursus libero. Suspendisse bibendum tellus non nibh hendrerit tristique. Mauris eget orci elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam porta libero non ante laoreet semper. Proin volutpat sodales mi, ac fermentum erat sagittis in. Vivamus at viverra felis. Ut pretium facilisis ante et pharetra.\nNulla facilisi. Cras varius quam eget libero aliquam vitae tincidunt leo rutrum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Pellentesque a nisl massa, quis pretium urna. Proin vel porttitor tortor. Cras rhoncus congue velit in bibendum. Donec pharetra semper augue id lacinia. Quisque magna quam, hendrerit eu aliquam et, pellentesque ut tellus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Maecenas nulla quam, rutrum eu feugiat at, elementum eu libero. Maecenas ullamcorper leo et turpis rutrum ac laoreet eros faucibus. Phasellus condimentum lorem quis neque imperdiet quis molestie enim iaculis. Phasellus risus est, vestibulum ut convallis ultrices, dignissim nec erat. Etiam congue lobortis laoreet. Nulla ut neque sed velit dapibus semper. Quisque nec dolor id nibh eleifend iaculis. Vivamus vitae fermentum odio. Etiam malesuada quam in nulla aliquam sed convallis dui feugiat.</p>";
pdf.AddPage();
pdf.Image("../images/image_demo.jpg", 155, 30, 40, 40, "JPG", "", "", true);
pdf.Image("../images/image_demo.jpg", 15, 230, 40, 40, "JPG", "", "", true);
var styleA = {
  width: 0.254,
  cap: "butt",
  join: "miter",
  dash: 0,
  color: [255, 0, 0]
};
var styleB = {
  width: 0.254,
  cap: "butt",
  join: "miter",
  dash: 3,
  color: [127, 127, 127]
};
pdf.SetFillColor(220, 255, 220);
pdf.Polygon([15, 90, 57, 90, 67, 140, 15, 140], "DF", [styleB, styleA, styleB, styleB]);
pdf.SetXY(15, 90);
pdf.Cell(42, 0, "xt,yt", 0, 0, "R", false, "", 0, false, "T", "T");
pdf.SetXY(15, 140);
pdf.Cell(52, 0, "xb,yb", 0, 0, "R", false, "", 0, false, "B", "B");
pdf.SetXY(15, 115);
pdf.Cell(40, 0, "side", 0, 0, "R", false, "", 0, false, "B", "B");
pdf.SetLineStyle({
  width: 0.254,
  cap: "butt",
  join: "miter",
  dash: 0,
  color: [0, 0, 0]
});
pdf.Arrow(60, 115, 35, 115, 2, 5, 15);
pdf.Polygon([145, 130, 195, 130, 195, 180, 155, 180], "DF", [styleB, styleB, styleB, styleA]);
pdf.SetXY(145, 130);
pdf.Cell(42, 0, "xt,yt", 0, 0, "L", false, "", 0, false, "T", "T");
pdf.SetXY(155, 180);
pdf.Cell(52, 0, "xb,yb", 0, 0, "L", false, "", 0, false, "B", "B");
pdf.SetXY(160, 155);
pdf.Cell(30, 0, "side", 0, 0, "L", false, "", 0, false, "B", "B");
pdf.SetLineStyle({
  width: 0.254,
  cap: "butt",
  join: "miter",
  dash: 0,
  color: [0, 0, 0]
});
pdf.Arrow(155, 155, 180, 155, 2, 5, 15);
pdf.SetXY(15, 30);
var regions = [{
  page: "",
  xt: 153,
  yt: 30,
  xb: 153,
  yb: 70,
  side: "R"
}, {
  page: "",
  xt: 60,
  yt: 90,
  xb: 70,
  yb: 140,
  side: "L"
}, {
  page: "",
  xt: 143,
  yt: 130,
  xb: 153,
  yb: 180,
  side: "R"
}, {
  page: "",
  xt: 58,
  yt: 230,
  xb: 58,
  yb: 270,
  side: "L"
}];
pdf.setPageRegions(regions);
pdf.writeHTML(txt, true, false, true, false, "");
regions = [{
  page: 2,
  xt: 195,
  yt: 110,
  xb: 179.693,
  yb: 113.045,
  side: "R"
}, {
  page: 2,
  xt: 179.693,
  yt: 113.045,
  xb: 166.716,
  yb: 121.716,
  side: "R"
}, {
  page: 2,
  xt: 166.716,
  yt: 121.716,
  xb: 158.045,
  yb: 134.693,
  side: "R"
}, {
  page: 2,
  xt: 158.045,
  yt: 134.693,
  xb: 155,
  yb: 150,
  side: "R"
}, {
  page: 2,
  xt: 155,
  yt: 150,
  xb: 158.045,
  yb: 165.307,
  side: "R"
}, {
  page: 2,
  xt: 158.045,
  yt: 165.307,
  xb: 166.716,
  yb: 178.284,
  side: "R"
}, {
  page: 2,
  xt: 166.716,
  yt: 178.284,
  xb: 179.693,
  yb: 186.955,
  side: "R"
}, {
  page: 2,
  xt: 179.693,
  yt: 186.955,
  xb: 195,
  yb: 190,
  side: "R"
}];
pdf.setPageRegions(regions);
pdf.Polygon([195, 110, 179.693, 113.045, 166.716, 121.716, 158.045, 134.693, 155, 150, 158.045, 165.307, 166.716, 178.284, 179.693, 186.955, 195, 190], "DF");
pdf.Ln(15);
txt = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed imperdiet lectus. Phasellus quis velit velit, non condimentum quam. Sed neque urna, ultrices ac volutpat vel, laoreet vitae augue. Sed vel velit erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras eget velit nulla, eu sagittis elit. Nunc ac arcu est, in lobortis tellus. Praesent condimentum rhoncus sodales. In hac habitasse platea dictumst. Proin porta eros pharetra enim tincidunt dignissim nec vel dolor. Cras sapien elit, ornare ac dignissim eu, ultricies ac eros. Maecenas augue magna, ultrices a congue in, mollis eu nulla. Nunc venenatis massa at est eleifend faucibus. Vivamus sed risus lectus, nec interdum nunc. Fusce et felis vitae diam lobortis sollicitudin. Aenean tincidunt accumsan nisi, id vehicula quam laoreet elementum. Phasellus egestas interdum erat, et viverra ipsum ultricies ac. Praesent sagittis augue at augue volutpat eleifend. Cras nec orci neque. Mauris bibendum posuere blandit. Donec feugiat mollis dui sit amet pellentesque. Sed a enim justo. Donec tincidunt, nisl eget elementum aliquam, odio ipsum ultrices quam, eu porttitor ligula urna at lorem. Donec varius, eros et convallis laoreet, ligula tellus consequat felis, ut ornare metus tellus sodales velit. Duis sed diam ante. Ut rutrum malesuada massa, vitae consectetur ipsum rhoncus sed. Suspendisse potenti. Pellentesque a congue massa. Integer non sem eget neque mattis accumsan. Maecenas eu nisl mauris, sit amet interdum ipsum. In pharetra erat vel lectus venenatis elementum. Nulla non elit ligula, sit amet mollis urna. Morbi ut gravida est. Mauris tincidunt sem et turpis molestie malesuada. Curabitur vel nulla risus, sed mollis erat. Suspendisse vehicula accumsan purus nec varius. Donec fermentum lorem id felis sodales dictum. Quisque et dolor ipsum. Nam luctus consectetur dui vitae fermentum. Curabitur sodales consequat augue, id ultricies augue tempor ac. Aliquam ac magna id ipsum vehicula bibendum. Sed elementum congue tristique. Phasellus vel lorem eu lectus porta sodales. Etiam neque tortor, sagittis id pharetra quis, laoreet vel arcu. Cras quam mi, ornare laoreet laoreet vel, vehicula at lacus. Maecenas a lacus accumsan augue convallis sagittis sed quis odio. Morbi sit amet turpis diam, dictum convallis urna. Cras eget interdum augue. Cras eu nisi sit amet dolor faucibus porttitor. Suspendisse potenti. Nunc vitae dolor risus, at cursus libero. Suspendisse bibendum tellus non nibh hendrerit tristique. Mauris eget orci elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam porta libero non ante laoreet semper. Proin volutpat sodales mi, ac fermentum erat sagittis in. Vivamus at viverra felis. Ut pretium facilisis ante et pharetra. Nulla facilisi. Cras varius quam eget libero aliquam vitae tincidunt leo rutrum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Pellentesque a nisl massa, quis pretium urna. Proin vel porttitor tortor. Cras rhoncus congue velit in bibendum. Donec pharetra semper augue id lacinia. Quisque magna quam, hendrerit eu aliquam et, pellentesque ut tellus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Maecenas nulla quam, rutrum eu feugiat at, elementum eu libero. Maecenas ullamcorper leo et turpis rutrum ac laoreet eros faucibus. Phasellus condimentum lorem quis neque imperdiet quis molestie enim iaculis. Phasellus risus est, vestibulum ut convallis ultrices, dignissim nec erat. Etiam congue lobortis laoreet. Nulla ut neque sed velit dapibus semper. Quisque nec dolor id nibh eleifend iaculis. Vivamus vitae fermentum odio. Etiam malesuada quam in nulla aliquam sed convallis dui feugiat." + "\n";
pdf.MultiCell(0, 0, txt, 0, "J", false, 1, "", "", true, 0, false, true, 0, "T", false);
pdf.Output("example_064.pdf", "I");