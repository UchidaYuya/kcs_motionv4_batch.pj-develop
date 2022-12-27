//============================================================+
//File name   : barcodes.php
//Version     : 1.0.025
//Begin       : 2008-06-09
//Last Update : 2012-09-11
//Author      : Nicola Asuni - Tecnick.com LTD - Manor Coach House, Church Hill, Aldershot, Hants, GU12 4RQ, UK - www.tecnick.com - info@tecnick.com
//License     : GNU-LGPL v3 (http://www.gnu.org/copyleft/lesser.html)
//-------------------------------------------------------------------
//Copyright (C) 2008-2012  Nicola Asuni - Tecnick.com LTD
//
//This file is part of TCPDF software library.
//
//TCPDF is free software: you can redistribute it and/or modify it
//under the terms of the GNU Lesser General Public License as
//published by the Free Software Foundation, either version 3 of the
//License, or (at your option) any later version.
//
//TCPDF is distributed in the hope that it will be useful, but
//WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
//See the GNU Lesser General Public License for more details.
//
//You should have received a copy of the GNU Lesser General Public License
//along with TCPDF.  If not, see <http://www.gnu.org/licenses/>.
//
//See LICENSE.TXT file for more information.
//-------------------------------------------------------------------
//
//Description : PHP class to creates array representations for
//common 1D barcodes to be used with TCPDF.
//
//============================================================+
//
//@file
//PHP class to creates array representations for common 1D barcodes to be used with TCPDF.
//@package com.tecnick.tcpdf
//@author Nicola Asuni
//@version 1.0.025
//
//
//@class TCPDFBarcode
//PHP class to creates array representations for common 1D barcodes to be used with TCPDF (http://www.tcpdf.org).<br>
//@package com.tecnick.tcpdf
//@version 1.0.025
//@author Nicola Asuni
//
//end of class
//============================================================+
//END OF FILE
//============================================================+

//
//Array representation of barcode.
//@protected
//
//
//This is the class constructor.
//Return an array representations for common 1D barcodes:<ul>
//<li>$arrcode['code'] code to be printed on text label</li>
//<li>$arrcode['maxh'] max barcode height</li>
//<li>$arrcode['maxw'] max barcode width</li>
//<li>$arrcode['bcode'][$k] single bar or space in $k position</li>
//<li>$arrcode['bcode'][$k]['t'] bar type: true = bar, false = space.</li>
//<li>$arrcode['bcode'][$k]['w'] bar width in units.</li>
//<li>$arrcode['bcode'][$k]['h'] bar height in units.</li>
//<li>$arrcode['bcode'][$k]['p'] bar top position (0 = top, 1 = middle)</li></ul>
//@param $code (string) code to print
//@param $type (string) type of barcode: <ul><li>C39 : CODE 39 - ANSI MH10.8M-1983 - USD-3 - 3 of 9.</li><li>C39+ : CODE 39 with checksum</li><li>C39E : CODE 39 EXTENDED</li><li>C39E+ : CODE 39 EXTENDED + CHECKSUM</li><li>C93 : CODE 93 - USS-93</li><li>S25 : Standard 2 of 5</li><li>S25+ : Standard 2 of 5 + CHECKSUM</li><li>I25 : Interleaved 2 of 5</li><li>I25+ : Interleaved 2 of 5 + CHECKSUM</li><li>C128 : CODE 128</li><li>C128A : CODE 128 A</li><li>C128B : CODE 128 B</li><li>C128C : CODE 128 C</li><li>EAN2 : 2-Digits UPC-Based Extention</li><li>EAN5 : 5-Digits UPC-Based Extention</li><li>EAN8 : EAN 8</li><li>EAN13 : EAN 13</li><li>UPCA : UPC-A</li><li>UPCE : UPC-E</li><li>MSI : MSI (Variation of Plessey code)</li><li>MSI+ : MSI + CHECKSUM (modulo 11)</li><li>POSTNET : POSTNET</li><li>PLANET : PLANET</li><li>RMS4CC : RMS4CC (Royal Mail 4-state Customer Code) - CBC (Customer Bar Code)</li><li>KIX : KIX (Klant index - Customer index)</li><li>IMB: Intelligent Mail Barcode - Onecode - USPS-B-3200</li><li>CODABAR : CODABAR</li><li>CODE11 : CODE 11</li><li>PHARMA : PHARMACODE</li><li>PHARMA2T : PHARMACODE TWO-TRACKS</li></ul>
//@public
//
//
//Return an array representations of barcode.
//@return array
//@public
//
//
//Send barcode as SVG image object to the standard output.
//@param $w (int) Minimum width of a single bar in user units.
//@param $h (int) Height of barcode in user units.
//@param $color (string) Foreground color (in SVG format) for bar elements (background is transparent).
//@public
//
//
//Return a SVG string representation of barcode.
//@param $w (int) Minimum width of a single bar in user units.
//@param $h (int) Height of barcode in user units.
//@param $color (string) Foreground color (in SVG format) for bar elements (background is transparent).
//@return string SVG code.
//@public
//
//
//Return an HTML representation of barcode.
//@param $w (int) Width of a single bar element in pixels.
//@param $h (int) Height of a single bar element in pixels.
//@param $color (string) Foreground color for bar elements (background is transparent).
//@return string HTML code.
//@public
//
//
//Return a PNG image representation of barcode (requires GD or Imagick library).
//@param $w (int) Width of a single bar element in pixels.
//@param $h (int) Height of a single bar element in pixels.
//@param $color (array) RGB (0-255) foreground color for bar elements (background is transparent).
//@return image or false in case of error.
//@public
//
//
//Set the barcode.
//@param $code (string) code to print
//@param $type (string) type of barcode: <ul><li>C39 : CODE 39 - ANSI MH10.8M-1983 - USD-3 - 3 of 9.</li><li>C39+ : CODE 39 with checksum</li><li>C39E : CODE 39 EXTENDED</li><li>C39E+ : CODE 39 EXTENDED + CHECKSUM</li><li>C93 : CODE 93 - USS-93</li><li>S25 : Standard 2 of 5</li><li>S25+ : Standard 2 of 5 + CHECKSUM</li><li>I25 : Interleaved 2 of 5</li><li>I25+ : Interleaved 2 of 5 + CHECKSUM</li><li>C128 : CODE 128</li><li>C128A : CODE 128 A</li><li>C128B : CODE 128 B</li><li>C128C : CODE 128 C</li><li>EAN2 : 2-Digits UPC-Based Extention</li><li>EAN5 : 5-Digits UPC-Based Extention</li><li>EAN8 : EAN 8</li><li>EAN13 : EAN 13</li><li>UPCA : UPC-A</li><li>UPCE : UPC-E</li><li>MSI : MSI (Variation of Plessey code)</li><li>MSI+ : MSI + CHECKSUM (modulo 11)</li><li>POSTNET : POSTNET</li><li>PLANET : PLANET</li><li>RMS4CC : RMS4CC (Royal Mail 4-state Customer Code) - CBC (Customer Bar Code)</li><li>KIX : KIX (Klant index - Customer index)</li><li>IMB: Intelligent Mail Barcode - Onecode - USPS-B-3200</li><li>CODABAR : CODABAR</li><li>CODE11 : CODE 11</li><li>PHARMA : PHARMACODE</li><li>PHARMA2T : PHARMACODE TWO-TRACKS</li></ul>
//@return array barcode array
//@public
//
//
//CODE 39 - ANSI MH10.8M-1983 - USD-3 - 3 of 9.
//General-purpose code in very wide use world-wide
//@param $code (string) code to represent.
//@param $extended (boolean) if true uses the extended mode.
//@param $checksum (boolean) if true add a checksum to the code.
//@return array barcode representation.
//@protected
//
//
//Encode a string to be used for CODE 39 Extended mode.
//@param $code (string) code to represent.
//@return encoded string.
//@protected
//
//
//Calculate CODE 39 checksum (modulo 43).
//@param $code (string) code to represent.
//@return char checksum.
//@protected
//
//
//CODE 93 - USS-93
//Compact code similar to Code 39
//@param $code (string) code to represent.
//@return array barcode representation.
//@protected
//
//
//Calculate CODE 93 checksum (modulo 47).
//@param $code (string) code to represent.
//@return string checksum code.
//@protected
//
//
//Checksum for standard 2 of 5 barcodes.
//@param $code (string) code to process.
//@return int checksum.
//@protected
//
//
//MSI.
//Variation of Plessey code, with similar applications
//Contains digits (0 to 9) and encodes the data only in the width of bars.
//@param $code (string) code to represent.
//@param $checksum (boolean) if true add a checksum to the code (modulo 11)
//@return array barcode representation.
//@protected
//
//
//Standard 2 of 5 barcodes.
//Used in airline ticket marking, photofinishing
//Contains digits (0 to 9) and encodes the data only in the width of bars.
//@param $code (string) code to represent.
//@param $checksum (boolean) if true add a checksum to the code
//@return array barcode representation.
//@protected
//
//
//Convert binary barcode sequence to TCPDF barcode array.
//@param $seq (string) barcode as binary sequence.
//@param $bararray (array) barcode array.
//òparam array $bararray TCPDF barcode array to fill up
//@return array barcode representation.
//@protected
//
//
//Interleaved 2 of 5 barcodes.
//Compact numeric code, widely used in industry, air cargo
//Contains digits (0 to 9) and encodes the data in the width of both bars and spaces.
//@param $code (string) code to represent.
//@param $checksum (boolean) if true add a checksum to the code
//@return array barcode representation.
//@protected
//
//
//C128 barcodes.
//Very capable code, excellent density, high reliability; in very wide use world-wide
//@param $code (string) code to represent.
//@param $type (string) barcode type: A, B, C or empty for automatic switch (AUTO mode)
//@return array barcode representation.
//@protected
//
//
//Split text code in A/B sequence for 128 code
//@param $code (string) code to split.
//@return array sequence
//@protected
//
//
//EAN13 and UPC-A barcodes.
//EAN13: European Article Numbering international retail product code
//UPC-A: Universal product code seen on almost all retail products in the USA and Canada
//UPC-E: Short version of UPC symbol
//@param $code (string) code to represent.
//@param $len (string) barcode type: 6 = UPC-E, 8 = EAN8, 13 = EAN13, 12 = UPC-A
//@return array barcode representation.
//@protected
//
//
//UPC-Based Extentions
//2-Digit Ext.: Used to indicate magazines and newspaper issue numbers
//5-Digit Ext.: Used to mark suggested retail price of books
//@param $code (string) code to represent.
//@param $len (string) barcode type: 2 = 2-Digit, 5 = 5-Digit
//@return array barcode representation.
//@protected
//
//
//POSTNET and PLANET barcodes.
//Used by U.S. Postal Service for automated mail sorting
//@param $code (string) zip code to represent. Must be a string containing a zip code of the form DDDDD or DDDDD-DDDD.
//@param $planet (boolean) if true print the PLANET barcode, otherwise print POSTNET
//@return array barcode representation.
//@protected
//
//
//RMS4CC - CBC - KIX
//RMS4CC (Royal Mail 4-state Customer Code) - CBC (Customer Bar Code) - KIX (Klant index - Customer index)
//RM4SCC is the name of the barcode symbology used by the Royal Mail for its Cleanmail service.
//@param $code (string) code to print
//@param $kix (boolean) if true prints the KIX variation (doesn't use the start and end symbols, and the checksum) - in this case the house number must be sufficed with an X and placed at the end of the code.
//@return array barcode representation.
//@protected
//
//
//CODABAR barcodes.
//Older code often used in library systems, sometimes in blood banks
//@param $code (string) code to represent.
//@return array barcode representation.
//@protected
//
//
//CODE11 barcodes.
//Used primarily for labeling telecommunications equipment
//@param $code (string) code to represent.
//@return array barcode representation.
//@protected
//
//
//Pharmacode
//Contains digits (0 to 9)
//@param $code (string) code to represent.
//@return array barcode representation.
//@protected
//
//
//Pharmacode two-track
//Contains digits (0 to 9)
//@param $code (string) code to represent.
//@return array barcode representation.
//@protected
//
//
//IMB - Intelligent Mail Barcode - Onecode - USPS-B-3200
//(requires PHP bcmath extension)
//Intelligent Mail barcode is a 65-bar code for use on mail in the United States.
//The fields are described as follows:<ul><li>The Barcode Identifier shall be assigned by USPS to encode the presort identification that is currently printed in human readable form on the optional endorsement line (OEL) as well as for future USPS use. This shall be two digits, with the second digit in the range of 0–4. The allowable encoding ranges shall be 00–04, 10–14, 20–24, 30–34, 40–44, 50–54, 60–64, 70–74, 80–84, and 90–94.</li><li>The Service Type Identifier shall be assigned by USPS for any combination of services requested on the mailpiece. The allowable encoding range shall be 000http://it2.php.net/manual/en/function.dechex.php–999. Each 3-digit value shall correspond to a particular mail class with a particular combination of service(s). Each service program, such as OneCode Confirm and OneCode ACS, shall provide the list of Service Type Identifier values.</li><li>The Mailer or Customer Identifier shall be assigned by USPS as a unique, 6 or 9 digit number that identifies a business entity. The allowable encoding range for the 6 digit Mailer ID shall be 000000- 899999, while the allowable encoding range for the 9 digit Mailer ID shall be 900000000-999999999.</li><li>The Serial or Sequence Number shall be assigned by the mailer for uniquely identifying and tracking mailpieces. The allowable encoding range shall be 000000000–999999999 when used with a 6 digit Mailer ID and 000000-999999 when used with a 9 digit Mailer ID. e. The Delivery Point ZIP Code shall be assigned by the mailer for routing the mailpiece. This shall replace POSTNET for routing the mailpiece to its final delivery point. The length may be 0, 5, 9, or 11 digits. The allowable encoding ranges shall be no ZIP Code, 00000–99999,  000000000–999999999, and 00000000000–99999999999.</li></ul>
//@param $code (string) code to print, separate the ZIP (routing code) from the rest using a minus char '-' (BarcodeID_ServiceTypeID_MailerID_SerialNumber-RoutingCode)
//@return array barcode representation.
//@protected
//
//
//Convert large integer number to hexadecimal representation.
//(requires PHP bcmath extension)
//@param $number (string) number to convert specified as a string
//@return string hexadecimal representation
//
//
//Convert large hexadecimal number to decimal representation (string).
//(requires PHP bcmath extension)
//@param $hex (string) hexadecimal number to convert specified as a string
//@return string hexadecimal representation
//
//
//Intelligent Mail Barcode calculation of Frame Check Sequence
//@param $code_arr (string) array of hexadecimal values (13 bytes holding 102 bits right justified).
//@return int 11 bit Frame Check Sequence as integer (decimal base)
//@protected
//
//
//Reverse unsigned short value
//@param $num (int) value to reversr
//@return int reversed value
//@protected
//
//
//generate Nof13 tables used for Intelligent Mail Barcode
//@param $n (int) is the type of table: 2 for 2of13 table, 5 for 5of13table
//@param $size (int) size of table (78 for n=2 and 1287 for n=5)
//@return array requested table
//@protected
//
class TCPDFBarcode {
	constructor(code, type) {
		this.setBarcode(code, type);
	}

	getBarcodeArray() {
		return this.barcode_array;
	}

	getBarcodeSVG(w = 2, h = 30, color = "black") //send headers
	//HTTP/1.1
	//Date in the past
	//header('Content-Length: '.strlen($code));
	{
		var code = this.getBarcodeSVGcode(w, h, color);
		header("Content-Type: application/svg+xml");
		header("Cache-Control: public, must-revalidate, max-age=0");
		header("Pragma: public");
		header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
		header("Last-Modified: " + gmdate("D, d M Y H:i:s") + " GMT");
		header("Content-Disposition: inline; filename=\"" + md5(code) + ".svg\";");
		echo(code);
	}

	getBarcodeSVGcode(w = 2, h = 30, color = "black") //replace table for special characters
	//print bars
	{
		var repstr = {
			"\\0": "",
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;"
		};
		var svg = "<" + "?" + "xml version=\"1.0\" standalone=\"no\"" + "?" + ">" + "\n";
		svg += "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">" + "\n";
		svg += "<svg width=\"" + Math.round(this.barcode_array.maxw * w, 3) + "\" height=\"" + h + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">" + "\n";
		svg += "\t" + "<desc>" + strtr(this.barcode_array.code, repstr) + "</desc>" + "\n";
		svg += "\t" + "<g id=\"bars\" fill=\"" + color + "\" stroke=\"none\">" + "\n";
		var x = 0;
		{
			let _tmp_0 = this.barcode_array.bcode;

			for (var k in _tmp_0) {
				var v = _tmp_0[k];
				var bw = Math.round(v.w * w, 3);
				var bh = Math.round(v.h * h / this.barcode_array.maxh, 3);

				if (v.t) //draw a vertical bar
					{
						var y = Math.round(v.p * h / this.barcode_array.maxh, 3);
						svg += "\t\t" + "<rect x=\"" + x + "\" y=\"" + y + "\" width=\"" + bw + "\" height=\"" + bh + "\" />" + "\n";
					}

				x += bw;
			}
		}
		svg += "\t" + "</g>" + "\n";
		svg += "</svg>" + "\n";
		return svg;
	}

	getBarcodeHTML(w = 2, h = 30, color = "black") //print bars
	{
		var html = "<div style=\"font-size:0;position:relative;width:" + this.barcode_array.maxw * w + "px;height:" + h + "px;\">" + "\n";
		var x = 0;
		{
			let _tmp_1 = this.barcode_array.bcode;

			for (var k in _tmp_1) {
				var v = _tmp_1[k];
				var bw = Math.round(v.w * w, 3);
				var bh = Math.round(v.h * h / this.barcode_array.maxh, 3);

				if (v.t) //draw a vertical bar
					{
						var y = Math.round(v.p * h / this.barcode_array.maxh, 3);
						html += "<div style=\"background-color:" + color + ";width:" + bw + "px;height:" + bh + "px;position:absolute;left:" + x + "px;top:" + y + "px;\">&nbsp;</div>" + "\n";
					}

				x += bw;
			}
		}
		html += "</div>" + "\n";
		return html;
	}

	getBarcodePNG(w = 2, h = 30, color = [0, 0, 0]) //calculate image size
	//print bars
	//send headers
	//HTTP/1.1
	//Date in the past
	{
		var width = this.barcode_array.maxw * w;
		var height = h;

		if ("function" === typeof imagecreate) //GD library
			{
				var imagick = false;
				var png = imagecreate(width, height);
				var bgcol = imagecolorallocate(png, 255, 255, 255);
				imagecolortransparent(png, bgcol);
				var fgcol = imagecolorallocate(png, color[0], color[1], color[2]);
			} else if (extension_loaded("imagick")) {
			imagick = true;
			bgcol = new imagickpixel("rgb(255,255,255");
			fgcol = new imagickpixel("rgb(" + color[0] + "," + color[1] + "," + color[2] + ")");
			png = new Imagick();
			png.newImage(width, height, "none", "png");
			var bar = new imagickdraw();
			bar.setfillcolor(fgcol);
		} else {
			return false;
		}

		var x = 0;
		{
			let _tmp_2 = this.barcode_array.bcode;

			for (var k in _tmp_2) {
				var v = _tmp_2[k];
				var bw = Math.round(v.w * w, 3);
				var bh = Math.round(v.h * h / this.barcode_array.maxh, 3);

				if (v.t) //draw a vertical bar
					{
						var y = Math.round(v.p * h / this.barcode_array.maxh, 3);

						if (imagick) {
							bar.rectangle(x, y, x + bw - 1, y + bh - 1);
						} else {
							imagefilledrectangle(png, x, y, x + bw - 1, y + bh - 1, fgcol);
						}
					}

				x += bw;
			}
		}
		header("Content-Type: image/png");
		header("Cache-Control: public, must-revalidate, max-age=0");
		header("Pragma: public");
		header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
		header("Last-Modified: " + gmdate("D, d M Y H:i:s") + " GMT");

		if (imagick) {
			png.drawimage(bar);
			echo(png);
		} else {
			imagepng(png);
			imagedestroy(png);
		}
	}

	setBarcode(code, type) {
		switch (type.toUpperCase()) {
			case "C39":
				//CODE 39 - ANSI MH10.8M-1983 - USD-3 - 3 of 9.
				{
					var arrcode = this.barcode_code39(code, false, false);
					break;
				}

			case "C39+":
				//CODE 39 with checksum
				{
					arrcode = this.barcode_code39(code, false, true);
					break;
				}

			case "C39E":
				//CODE 39 EXTENDED
				{
					arrcode = this.barcode_code39(code, true, false);
					break;
				}

			case "C39E+":
				//CODE 39 EXTENDED + CHECKSUM
				{
					arrcode = this.barcode_code39(code, true, true);
					break;
				}

			case "C93":
				//CODE 93 - USS-93
				{
					arrcode = this.barcode_code93(code);
					break;
				}

			case "S25":
				//Standard 2 of 5
				{
					arrcode = this.barcode_s25(code, false);
					break;
				}

			case "S25+":
				//Standard 2 of 5 + CHECKSUM
				{
					arrcode = this.barcode_s25(code, true);
					break;
				}

			case "I25":
				//Interleaved 2 of 5
				{
					arrcode = this.barcode_i25(code, false);
					break;
				}

			case "I25+":
				//Interleaved 2 of 5 + CHECKSUM
				{
					arrcode = this.barcode_i25(code, true);
					break;
				}

			case "C128":
				//CODE 128
				{
					arrcode = this.barcode_c128(code, "");
					break;
				}

			case "C128A":
				//CODE 128 A
				{
					arrcode = this.barcode_c128(code, "A");
					break;
				}

			case "C128B":
				//CODE 128 B
				{
					arrcode = this.barcode_c128(code, "B");
					break;
				}

			case "C128C":
				//CODE 128 C
				{
					arrcode = this.barcode_c128(code, "C");
					break;
				}

			case "EAN2":
				//2-Digits UPC-Based Extention
				{
					arrcode = this.barcode_eanext(code, 2);
					break;
				}

			case "EAN5":
				//5-Digits UPC-Based Extention
				{
					arrcode = this.barcode_eanext(code, 5);
					break;
				}

			case "EAN8":
				//EAN 8
				{
					arrcode = this.barcode_eanupc(code, 8);
					break;
				}

			case "EAN13":
				//EAN 13
				{
					arrcode = this.barcode_eanupc(code, 13);
					break;
				}

			case "UPCA":
				//UPC-A
				{
					arrcode = this.barcode_eanupc(code, 12);
					break;
				}

			case "UPCE":
				//UPC-E
				{
					arrcode = this.barcode_eanupc(code, 6);
					break;
				}

			case "MSI":
				//MSI (Variation of Plessey code)
				{
					arrcode = this.barcode_msi(code, false);
					break;
				}

			case "MSI+":
				//MSI + CHECKSUM (modulo 11)
				{
					arrcode = this.barcode_msi(code, true);
					break;
				}

			case "POSTNET":
				//POSTNET
				{
					arrcode = this.barcode_postnet(code, false);
					break;
				}

			case "PLANET":
				//PLANET
				{
					arrcode = this.barcode_postnet(code, true);
					break;
				}

			case "RMS4CC":
				//RMS4CC (Royal Mail 4-state Customer Code) - CBC (Customer Bar Code)
				{
					arrcode = this.barcode_rms4cc(code, false);
					break;
				}

			case "KIX":
				//KIX (Klant index - Customer index)
				{
					arrcode = this.barcode_rms4cc(code, true);
					break;
				}

			case "IMB":
				//IMB - Intelligent Mail Barcode - Onecode - USPS-B-3200
				{
					arrcode = this.barcode_imb(code);
					break;
				}

			case "CODABAR":
				//CODABAR
				{
					arrcode = this.barcode_codabar(code);
					break;
				}

			case "CODE11":
				//CODE 11
				{
					arrcode = this.barcode_code11(code);
					break;
				}

			case "PHARMA":
				//PHARMACODE
				{
					arrcode = this.barcode_pharmacode(code);
					break;
				}

			case "PHARMA2T":
				//PHARMACODE TWO-TRACKS
				{
					arrcode = this.barcode_pharmacode2t(code);
					break;
				}

			default:
				{
					this.barcode_array = false;
					arrcode = false;
					break;
				}
		}

		this.barcode_array = arrcode;
	}

	barcode_code39(code, extended = false, checksum = false) {
		chr["0"] = "111331311";
		chr["1"] = "311311113";
		chr["2"] = "113311113";
		chr["3"] = "313311111";
		chr["4"] = "111331113";
		chr["5"] = "311331111";
		chr["6"] = "113331111";
		chr["7"] = "111311313";
		chr["8"] = "311311311";
		chr["9"] = "113311311";
		chr.A = "311113113";
		chr.B = "113113113";
		chr.C = "313113111";
		chr.D = "111133113";
		chr.E = "311133111";
		chr.F = "113133111";
		chr.G = "111113313";
		chr.H = "311113311";
		chr.I = "113113311";
		chr.J = "111133311";
		chr.K = "311111133";
		chr.L = "113111133";
		chr.M = "313111131";
		chr.N = "111131133";
		chr.O = "311131131";
		chr.P = "113131131";
		chr.Q = "111111333";
		chr.R = "311111331";
		chr.S = "113111331";
		chr.T = "111131331";
		chr.U = "331111113";
		chr.V = "133111113";
		chr.W = "333111111";
		chr.X = "131131113";
		chr.Y = "331131111";
		chr.Z = "133131111";
		chr["-"] = "131111313";
		chr["."] = "331111311";
		chr[" "] = "133111311";
		chr["$"] = "131313111";
		chr["/"] = "131311131";
		chr["+"] = "131113131";
		chr["%"] = "111313131";
		chr["*"] = "131131311";
		code = code.toUpperCase();

		if (extended) //extended mode
			{
				code = this.encode_code39_ext(code);
			}

		if (code === false) {
			return false;
		}

		if (checksum) //checksum
			{
				code += this.checksum_code39(code);
			}

		code = "*" + code + "*";
		var bararray = {
			code: code,
			maxw: 0,
			maxh: 1,
			bcode: Array()
		};
		var k = 0;
		var clen = code.length;

		for (var i = 0; i < clen; ++i) //intercharacter gap
		{
			var char = code[i];

			if (!(undefined !== chr[char])) //invalid character
				{
					return false;
				}

			for (var j = 0; j < 9; ++j) {
				if (j % 2 == 0) //bar
					{
						var t = true;
					} else //space
					{
						t = false;
					}

				var w = chr[char][j];
				bararray.bcode[k] = {
					t: t,
					w: w,
					h: 1,
					p: 0
				};
				bararray.maxw += w;
				++k;
			}

			bararray.bcode[k] = {
				t: false,
				w: 1,
				h: 1,
				p: 0
			};
			bararray.maxw += 1;
			++k;
		}

		return bararray;
	}

	encode_code39_ext(code) {
		var encode = {
			[String.fromCharCode(0)]: "%U",
			[String.fromCharCode(1)]: "$A",
			[String.fromCharCode(2)]: "$B",
			[String.fromCharCode(3)]: "$C",
			[String.fromCharCode(4)]: "$D",
			[String.fromCharCode(5)]: "$E",
			[String.fromCharCode(6)]: "$F",
			[String.fromCharCode(7)]: "$G",
			[String.fromCharCode(8)]: "$H",
			[String.fromCharCode(9)]: "$I",
			[String.fromCharCode(10)]: "$J",
			[String.fromCharCode(11)]: "\xA3K",
			[String.fromCharCode(12)]: "$L",
			[String.fromCharCode(13)]: "$M",
			[String.fromCharCode(14)]: "$N",
			[String.fromCharCode(15)]: "$O",
			[String.fromCharCode(16)]: "$P",
			[String.fromCharCode(17)]: "$Q",
			[String.fromCharCode(18)]: "$R",
			[String.fromCharCode(19)]: "$S",
			[String.fromCharCode(20)]: "$T",
			[String.fromCharCode(21)]: "$U",
			[String.fromCharCode(22)]: "$V",
			[String.fromCharCode(23)]: "$W",
			[String.fromCharCode(24)]: "$X",
			[String.fromCharCode(25)]: "$Y",
			[String.fromCharCode(26)]: "$Z",
			[String.fromCharCode(27)]: "%A",
			[String.fromCharCode(28)]: "%B",
			[String.fromCharCode(29)]: "%C",
			[String.fromCharCode(30)]: "%D",
			[String.fromCharCode(31)]: "%E",
			[String.fromCharCode(32)]: " ",
			[String.fromCharCode(33)]: "/A",
			[String.fromCharCode(34)]: "/B",
			[String.fromCharCode(35)]: "/C",
			[String.fromCharCode(36)]: "/D",
			[String.fromCharCode(37)]: "/E",
			[String.fromCharCode(38)]: "/F",
			[String.fromCharCode(39)]: "/G",
			[String.fromCharCode(40)]: "/H",
			[String.fromCharCode(41)]: "/I",
			[String.fromCharCode(42)]: "/J",
			[String.fromCharCode(43)]: "/K",
			[String.fromCharCode(44)]: "/L",
			[String.fromCharCode(45)]: "-",
			[String.fromCharCode(46)]: ".",
			[String.fromCharCode(47)]: "/O",
			[String.fromCharCode(48)]: "0",
			[String.fromCharCode(49)]: "1",
			[String.fromCharCode(50)]: "2",
			[String.fromCharCode(51)]: "3",
			[String.fromCharCode(52)]: "4",
			[String.fromCharCode(53)]: "5",
			[String.fromCharCode(54)]: "6",
			[String.fromCharCode(55)]: "7",
			[String.fromCharCode(56)]: "8",
			[String.fromCharCode(57)]: "9",
			[String.fromCharCode(58)]: "/Z",
			[String.fromCharCode(59)]: "%F",
			[String.fromCharCode(60)]: "%G",
			[String.fromCharCode(61)]: "%H",
			[String.fromCharCode(62)]: "%I",
			[String.fromCharCode(63)]: "%J",
			[String.fromCharCode(64)]: "%V",
			[String.fromCharCode(65)]: "A",
			[String.fromCharCode(66)]: "B",
			[String.fromCharCode(67)]: "C",
			[String.fromCharCode(68)]: "D",
			[String.fromCharCode(69)]: "E",
			[String.fromCharCode(70)]: "F",
			[String.fromCharCode(71)]: "G",
			[String.fromCharCode(72)]: "H",
			[String.fromCharCode(73)]: "I",
			[String.fromCharCode(74)]: "J",
			[String.fromCharCode(75)]: "K",
			[String.fromCharCode(76)]: "L",
			[String.fromCharCode(77)]: "M",
			[String.fromCharCode(78)]: "N",
			[String.fromCharCode(79)]: "O",
			[String.fromCharCode(80)]: "P",
			[String.fromCharCode(81)]: "Q",
			[String.fromCharCode(82)]: "R",
			[String.fromCharCode(83)]: "S",
			[String.fromCharCode(84)]: "T",
			[String.fromCharCode(85)]: "U",
			[String.fromCharCode(86)]: "V",
			[String.fromCharCode(87)]: "W",
			[String.fromCharCode(88)]: "X",
			[String.fromCharCode(89)]: "Y",
			[String.fromCharCode(90)]: "Z",
			[String.fromCharCode(91)]: "%K",
			[String.fromCharCode(92)]: "%L",
			[String.fromCharCode(93)]: "%M",
			[String.fromCharCode(94)]: "%N",
			[String.fromCharCode(95)]: "%O",
			[String.fromCharCode(96)]: "%W",
			[String.fromCharCode(97)]: "+A",
			[String.fromCharCode(98)]: "+B",
			[String.fromCharCode(99)]: "+C",
			[String.fromCharCode(100)]: "+D",
			[String.fromCharCode(101)]: "+E",
			[String.fromCharCode(102)]: "+F",
			[String.fromCharCode(103)]: "+G",
			[String.fromCharCode(104)]: "+H",
			[String.fromCharCode(105)]: "+I",
			[String.fromCharCode(106)]: "+J",
			[String.fromCharCode(107)]: "+K",
			[String.fromCharCode(108)]: "+L",
			[String.fromCharCode(109)]: "+M",
			[String.fromCharCode(110)]: "+N",
			[String.fromCharCode(111)]: "+O",
			[String.fromCharCode(112)]: "+P",
			[String.fromCharCode(113)]: "+Q",
			[String.fromCharCode(114)]: "+R",
			[String.fromCharCode(115)]: "+S",
			[String.fromCharCode(116)]: "+T",
			[String.fromCharCode(117)]: "+U",
			[String.fromCharCode(118)]: "+V",
			[String.fromCharCode(119)]: "+W",
			[String.fromCharCode(120)]: "+X",
			[String.fromCharCode(121)]: "+Y",
			[String.fromCharCode(122)]: "+Z",
			[String.fromCharCode(123)]: "%P",
			[String.fromCharCode(124)]: "%Q",
			[String.fromCharCode(125)]: "%R",
			[String.fromCharCode(126)]: "%S",
			[String.fromCharCode(127)]: "%T"
		};
		var code_ext = "";
		var clen = code.length;

		for (var i = 0; i < clen; ++i) {
			if (code.charCodeAt(i) > 127) {
				return false;
			}

			code_ext += encode[code[i]];
		}

		return code_ext;
	}

	checksum_code39(code) {
		var chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "-", ".", " ", "$", "/", "+", "%"];
		var sum = 0;
		var clen = code.length;

		for (var i = 0; i < clen; ++i) {
			var k = Object.keys(chars, code[i]);
			sum += k[0];
		}

		var j = sum % 43;
		return chars[j];
	}

	barcode_code93(code) //0
	//1
	//2
	//3
	//4
	//5
	//6
	//7
	//8
	//9
	//A
	//B
	//C
	//D
	//E
	//F
	//G
	//H
	//I
	//J
	//K
	//L
	//M
	//N
	//O
	//P
	//Q
	//R
	//S
	//T
	//U
	//V
	//W
	//X
	//Y
	//Z
	//-
	//.
	//
	//$
	///
	//+
	//%
	//($)
	//(/)
	//(+)
	//(%)
	//start-stop
	//checksum
	//add start and stop codes
	{
		chr[48] = "131112";
		chr[49] = "111213";
		chr[50] = "111312";
		chr[51] = "111411";
		chr[52] = "121113";
		chr[53] = "121212";
		chr[54] = "121311";
		chr[55] = "111114";
		chr[56] = "131211";
		chr[57] = "141111";
		chr[65] = "211113";
		chr[66] = "211212";
		chr[67] = "211311";
		chr[68] = "221112";
		chr[69] = "221211";
		chr[70] = "231111";
		chr[71] = "112113";
		chr[72] = "112212";
		chr[73] = "112311";
		chr[74] = "122112";
		chr[75] = "132111";
		chr[76] = "111123";
		chr[77] = "111222";
		chr[78] = "111321";
		chr[79] = "121122";
		chr[80] = "131121";
		chr[81] = "212112";
		chr[82] = "212211";
		chr[83] = "211122";
		chr[84] = "211221";
		chr[85] = "221121";
		chr[86] = "222111";
		chr[87] = "112122";
		chr[88] = "112221";
		chr[89] = "122121";
		chr[90] = "123111";
		chr[45] = "121131";
		chr[46] = "311112";
		chr[32] = "311211";
		chr[36] = "321111";
		chr[47] = "112131";
		chr[43] = "113121";
		chr[37] = "211131";
		chr[128] = "121221";
		chr[129] = "311121";
		chr[130] = "122211";
		chr[131] = "312111";
		chr[42] = "111141";
		code = code.toUpperCase();
		var encode = {
			[String.fromCharCode(0)]: String.fromCharCode(131) + "U",
			[String.fromCharCode(1)]: String.fromCharCode(128) + "A",
			[String.fromCharCode(2)]: String.fromCharCode(128) + "B",
			[String.fromCharCode(3)]: String.fromCharCode(128) + "C",
			[String.fromCharCode(4)]: String.fromCharCode(128) + "D",
			[String.fromCharCode(5)]: String.fromCharCode(128) + "E",
			[String.fromCharCode(6)]: String.fromCharCode(128) + "F",
			[String.fromCharCode(7)]: String.fromCharCode(128) + "G",
			[String.fromCharCode(8)]: String.fromCharCode(128) + "H",
			[String.fromCharCode(9)]: String.fromCharCode(128) + "I",
			[String.fromCharCode(10)]: String.fromCharCode(128) + "J",
			[String.fromCharCode(11)]: "\xA3K",
			[String.fromCharCode(12)]: String.fromCharCode(128) + "L",
			[String.fromCharCode(13)]: String.fromCharCode(128) + "M",
			[String.fromCharCode(14)]: String.fromCharCode(128) + "N",
			[String.fromCharCode(15)]: String.fromCharCode(128) + "O",
			[String.fromCharCode(16)]: String.fromCharCode(128) + "P",
			[String.fromCharCode(17)]: String.fromCharCode(128) + "Q",
			[String.fromCharCode(18)]: String.fromCharCode(128) + "R",
			[String.fromCharCode(19)]: String.fromCharCode(128) + "S",
			[String.fromCharCode(20)]: String.fromCharCode(128) + "T",
			[String.fromCharCode(21)]: String.fromCharCode(128) + "U",
			[String.fromCharCode(22)]: String.fromCharCode(128) + "V",
			[String.fromCharCode(23)]: String.fromCharCode(128) + "W",
			[String.fromCharCode(24)]: String.fromCharCode(128) + "X",
			[String.fromCharCode(25)]: String.fromCharCode(128) + "Y",
			[String.fromCharCode(26)]: String.fromCharCode(128) + "Z",
			[String.fromCharCode(27)]: String.fromCharCode(131) + "A",
			[String.fromCharCode(28)]: String.fromCharCode(131) + "B",
			[String.fromCharCode(29)]: String.fromCharCode(131) + "C",
			[String.fromCharCode(30)]: String.fromCharCode(131) + "D",
			[String.fromCharCode(31)]: String.fromCharCode(131) + "E",
			[String.fromCharCode(32)]: " ",
			[String.fromCharCode(33)]: String.fromCharCode(129) + "A",
			[String.fromCharCode(34)]: String.fromCharCode(129) + "B",
			[String.fromCharCode(35)]: String.fromCharCode(129) + "C",
			[String.fromCharCode(36)]: String.fromCharCode(129) + "D",
			[String.fromCharCode(37)]: String.fromCharCode(129) + "E",
			[String.fromCharCode(38)]: String.fromCharCode(129) + "F",
			[String.fromCharCode(39)]: String.fromCharCode(129) + "G",
			[String.fromCharCode(40)]: String.fromCharCode(129) + "H",
			[String.fromCharCode(41)]: String.fromCharCode(129) + "I",
			[String.fromCharCode(42)]: String.fromCharCode(129) + "J",
			[String.fromCharCode(43)]: String.fromCharCode(129) + "K",
			[String.fromCharCode(44)]: String.fromCharCode(129) + "L",
			[String.fromCharCode(45)]: "-",
			[String.fromCharCode(46)]: ".",
			[String.fromCharCode(47)]: String.fromCharCode(129) + "O",
			[String.fromCharCode(48)]: "0",
			[String.fromCharCode(49)]: "1",
			[String.fromCharCode(50)]: "2",
			[String.fromCharCode(51)]: "3",
			[String.fromCharCode(52)]: "4",
			[String.fromCharCode(53)]: "5",
			[String.fromCharCode(54)]: "6",
			[String.fromCharCode(55)]: "7",
			[String.fromCharCode(56)]: "8",
			[String.fromCharCode(57)]: "9",
			[String.fromCharCode(58)]: String.fromCharCode(129) + "Z",
			[String.fromCharCode(59)]: String.fromCharCode(131) + "F",
			[String.fromCharCode(60)]: String.fromCharCode(131) + "G",
			[String.fromCharCode(61)]: String.fromCharCode(131) + "H",
			[String.fromCharCode(62)]: String.fromCharCode(131) + "I",
			[String.fromCharCode(63)]: String.fromCharCode(131) + "J",
			[String.fromCharCode(64)]: String.fromCharCode(131) + "V",
			[String.fromCharCode(65)]: "A",
			[String.fromCharCode(66)]: "B",
			[String.fromCharCode(67)]: "C",
			[String.fromCharCode(68)]: "D",
			[String.fromCharCode(69)]: "E",
			[String.fromCharCode(70)]: "F",
			[String.fromCharCode(71)]: "G",
			[String.fromCharCode(72)]: "H",
			[String.fromCharCode(73)]: "I",
			[String.fromCharCode(74)]: "J",
			[String.fromCharCode(75)]: "K",
			[String.fromCharCode(76)]: "L",
			[String.fromCharCode(77)]: "M",
			[String.fromCharCode(78)]: "N",
			[String.fromCharCode(79)]: "O",
			[String.fromCharCode(80)]: "P",
			[String.fromCharCode(81)]: "Q",
			[String.fromCharCode(82)]: "R",
			[String.fromCharCode(83)]: "S",
			[String.fromCharCode(84)]: "T",
			[String.fromCharCode(85)]: "U",
			[String.fromCharCode(86)]: "V",
			[String.fromCharCode(87)]: "W",
			[String.fromCharCode(88)]: "X",
			[String.fromCharCode(89)]: "Y",
			[String.fromCharCode(90)]: "Z",
			[String.fromCharCode(91)]: String.fromCharCode(131) + "K",
			[String.fromCharCode(92)]: String.fromCharCode(131) + "L",
			[String.fromCharCode(93)]: String.fromCharCode(131) + "M",
			[String.fromCharCode(94)]: String.fromCharCode(131) + "N",
			[String.fromCharCode(95)]: String.fromCharCode(131) + "O",
			[String.fromCharCode(96)]: String.fromCharCode(131) + "W",
			[String.fromCharCode(97)]: String.fromCharCode(130) + "A",
			[String.fromCharCode(98)]: String.fromCharCode(130) + "B",
			[String.fromCharCode(99)]: String.fromCharCode(130) + "C",
			[String.fromCharCode(100)]: String.fromCharCode(130) + "D",
			[String.fromCharCode(101)]: String.fromCharCode(130) + "E",
			[String.fromCharCode(102)]: String.fromCharCode(130) + "F",
			[String.fromCharCode(103)]: String.fromCharCode(130) + "G",
			[String.fromCharCode(104)]: String.fromCharCode(130) + "H",
			[String.fromCharCode(105)]: String.fromCharCode(130) + "I",
			[String.fromCharCode(106)]: String.fromCharCode(130) + "J",
			[String.fromCharCode(107)]: String.fromCharCode(130) + "K",
			[String.fromCharCode(108)]: String.fromCharCode(130) + "L",
			[String.fromCharCode(109)]: String.fromCharCode(130) + "M",
			[String.fromCharCode(110)]: String.fromCharCode(130) + "N",
			[String.fromCharCode(111)]: String.fromCharCode(130) + "O",
			[String.fromCharCode(112)]: String.fromCharCode(130) + "P",
			[String.fromCharCode(113)]: String.fromCharCode(130) + "Q",
			[String.fromCharCode(114)]: String.fromCharCode(130) + "R",
			[String.fromCharCode(115)]: String.fromCharCode(130) + "S",
			[String.fromCharCode(116)]: String.fromCharCode(130) + "T",
			[String.fromCharCode(117)]: String.fromCharCode(130) + "U",
			[String.fromCharCode(118)]: String.fromCharCode(130) + "V",
			[String.fromCharCode(119)]: String.fromCharCode(130) + "W",
			[String.fromCharCode(120)]: String.fromCharCode(130) + "X",
			[String.fromCharCode(121)]: String.fromCharCode(130) + "Y",
			[String.fromCharCode(122)]: String.fromCharCode(130) + "Z",
			[String.fromCharCode(123)]: String.fromCharCode(131) + "P",
			[String.fromCharCode(124)]: String.fromCharCode(131) + "Q",
			[String.fromCharCode(125)]: String.fromCharCode(131) + "R",
			[String.fromCharCode(126)]: String.fromCharCode(131) + "S",
			[String.fromCharCode(127)]: String.fromCharCode(131) + "T"
		};
		var code_ext = "";
		var clen = code.length;

		for (var i = 0; i < clen; ++i) {
			if (code.charCodeAt(i) > 127) {
				return false;
			}

			code_ext += encode[code[i]];
		}

		code_ext += this.checksum_code93(code_ext);
		code = "*" + code_ext + "*";
		var bararray = {
			code: code,
			maxw: 0,
			maxh: 1,
			bcode: Array()
		};
		var k = 0;
		clen = code.length;

		for (i = 0;; i < clen; ++i) {
			var char = code.charCodeAt(i);

			if (!(undefined !== chr[char])) //invalid character
				{
					return false;
				}

			for (var j = 0; j < 6; ++j) {
				if (j % 2 == 0) //bar
					{
						var t = true;
					} else //space
					{
						t = false;
					}

				var w = chr[char][j];
				bararray.bcode[k] = {
					t: t,
					w: w,
					h: 1,
					p: 0
				};
				bararray.maxw += w;
				++k;
			}
		}

		bararray.bcode[k] = {
			t: true,
			w: 1,
			h: 1,
			p: 0
		};
		bararray.maxw += 1;
		++k;
		return bararray;
	}

	checksum_code93(code) //translate special characters
	//calculate check digit C
	//calculate check digit K
	//resto respecial characters
	{
		var chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "-", ".", " ", "$", "/", "+", "%", "<", "=", ">", "?"];
		code = strtr(code, String.fromCharCode(128) + String.fromCharCode(131) + String.fromCharCode(129) + String.fromCharCode(130), "<=>?");
		var len = code.length;
		var p = 1;
		var check = 0;

		for (var i = len - 1; i >= 0; --i) {
			var k = Object.keys(chars, code[i]);
			check += k[0] * p;
			++p;

			if (p > 20) {
				p = 1;
			}
		}

		check %= 47;
		var c = chars[check];
		code += c;
		p = 1;
		check = 0;

		for (i = len;; i >= 0; --i) {
			k = Object.keys(chars, code[i]);
			check += k[0] * p;
			++p;

			if (p > 15) {
				p = 1;
			}
		}

		check %= 47;
		k = chars[check];
		var checksum = c + k;
		checksum = strtr(checksum, "<=>?", String.fromCharCode(128) + String.fromCharCode(131) + String.fromCharCode(129) + String.fromCharCode(130));
		return checksum;
	}

	checksum_s25(code) {
		var len = code.length;
		var sum = 0;

		for (var i = 0; i < len; i += 2) {
			sum += code[i];
		}

		sum *= 3;

		for (i = 1;; i < len; i += 2) {
			sum += code[i];
		}

		var r = sum % 10;

		if (r > 0) {
			r = 10 - r;
		}

		return r;
	}

	barcode_msi(code, checksum = false) //left guard
	//right guard
	{
		chr["0"] = "100100100100";
		chr["1"] = "100100100110";
		chr["2"] = "100100110100";
		chr["3"] = "100100110110";
		chr["4"] = "100110100100";
		chr["5"] = "100110100110";
		chr["6"] = "100110110100";
		chr["7"] = "100110110110";
		chr["8"] = "110100100100";
		chr["9"] = "110100100110";
		chr.A = "110100110100";
		chr.B = "110100110110";
		chr.C = "110110100100";
		chr.D = "110110100110";
		chr.E = "110110110100";
		chr.F = "110110110110";

		if (checksum) //add checksum
			{
				var clen = code.length;
				var p = 2;
				var check = 0;

				for (var i = clen - 1; i >= 0; --i) {
					check += hexdec(code[i]) * p;
					++p;

					if (p > 7) {
						p = 2;
					}
				}

				check %= 11;

				if (check > 0) {
					check = 11 - check;
				}

				code += check;
			}

		var seq = "110";
		clen = code.length;

		for (i = 0;; i < clen; ++i) {
			var digit = code[i];

			if (!(undefined !== chr[digit])) //invalid character
				{
					return false;
				}

			seq += chr[digit];
		}

		seq += "1001";
		var bararray = {
			code: code,
			maxw: 0,
			maxh: 1,
			bcode: Array()
		};
		return this.binseq_to_array(seq, bararray);
	}

	barcode_s25(code, checksum = false) {
		chr["0"] = "10101110111010";
		chr["1"] = "11101010101110";
		chr["2"] = "10111010101110";
		chr["3"] = "11101110101010";
		chr["4"] = "10101110101110";
		chr["5"] = "11101011101010";
		chr["6"] = "10111011101010";
		chr["7"] = "10101011101110";
		chr["8"] = "10101110111010";
		chr["9"] = "10111010111010";

		if (checksum) //add checksum
			{
				code += this.checksum_s25(code);
			}

		if (code.length % 2 != 0) //add leading zero if code-length is odd
			{
				code = "0" + code;
			}

		var seq = "11011010";
		var clen = code.length;

		for (var i = 0; i < clen; ++i) {
			var digit = code[i];

			if (!(undefined !== chr[digit])) //invalid character
				{
					return false;
				}

			seq += chr[digit];
		}

		seq += "1101011";
		var bararray = {
			code: code,
			maxw: 0,
			maxh: 1,
			bcode: Array()
		};
		return this.binseq_to_array(seq, bararray);
	}

	binseq_to_array(seq, bararray) {
		var len = seq.length;
		var w = 0;
		var k = 0;

		for (var i = 0; i < len; ++i) {
			w += 1;

			if (i == len - 1 or (i < len - 1 and seq[i] != seq[i + 1])) {
				if (seq[i] == "1") //bar
					{
						var t = true;
					} else //space
					{
						t = false;
					}

				bararray.bcode[k] = {
					t: t,
					w: w,
					h: 1,
					p: 0
				};
				bararray.maxw += w;
				++k;
				w = 0;
			}
		}

		return bararray;
	}

	barcode_i25(code, checksum = false) {
		chr["0"] = "11221";
		chr["1"] = "21112";
		chr["2"] = "12112";
		chr["3"] = "22111";
		chr["4"] = "11212";
		chr["5"] = "21211";
		chr["6"] = "12211";
		chr["7"] = "11122";
		chr["8"] = "21121";
		chr["9"] = "12121";
		chr.A = "11";
		chr.Z = "21";

		if (checksum) //add checksum
			{
				code += this.checksum_s25(code);
			}

		if (code.length % 2 != 0) //add leading zero if code-length is odd
			{
				code = "0" + code;
			}

		code = "AA" + code.toLowerCase() + "ZA";
		var bararray = {
			code: code,
			maxw: 0,
			maxh: 1,
			bcode: Array()
		};
		var k = 0;
		var clen = code.length;

		for (var i = 0; i < clen; i = i + 2) {
			var char_bar = code[i];
			var char_space = code[i + 1];

			if (!(undefined !== chr[char_bar]) or !(undefined !== chr[char_space])) //invalid character
				{
					return false;
				}

			var seq = "";
			var chrlen = chr[char_bar].length;

			for (var s = 0; s < chrlen; s++) {
				seq += chr[char_bar][s] + chr[char_space][s];
			}

			var seqlen = seq.length;

			for (var j = 0; j < seqlen; ++j) {
				if (j % 2 == 0) //bar
					{
						var t = true;
					} else //space
					{
						t = false;
					}

				var w = seq[j];
				bararray.bcode[k] = {
					t: t,
					w: w,
					h: 1,
					p: 0
				};
				bararray.maxw += w;
				++k;
			}
		}

		return bararray;
	}

	barcode_c128(code, type = "") //ASCII characters for code A (ASCII 00 - 95)
	//ASCII characters for code B (ASCII 32 - 127)
	//special codes
	//array of symbols
	//lenght of the code
	//add check character
	//add stop sequence
	//add start code at the beginning
	//build barcode array
	{
		var chr = ["212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213", "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132", "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211", "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313", "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331", "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111", "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214", "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111", "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141", "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141", "114131", "311141", "411131", "211412", "211214", "211232", "233111", "200000"];
		var keys_a = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_";
		keys_a += chr(0) + chr(1) + chr(2) + chr(3) + chr(4) + chr(5) + chr(6) + chr(7) + chr(8) + chr(9);
		keys_a += chr(10) + chr(11) + chr(12) + chr(13) + chr(14) + chr(15) + chr(16) + chr(17) + chr(18) + chr(19);
		keys_a += chr(20) + chr(21) + chr(22) + chr(23) + chr(24) + chr(25) + chr(26) + chr(27) + chr(28) + chr(29);
		keys_a += chr(30) + chr(31);
		var keys_b = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~" + chr(127);
		var fnc_a = {
			241: 102,
			242: 97,
			243: 96,
			244: 101
		};
		var fnc_b = {
			241: 102,
			242: 97,
			243: 96,
			244: 100
		};
		var code_data = Array();
		var len = code.length;

		switch (type.toUpperCase()) {
			case "A":
				//MODE A
				{
					var startid = 103;

					for (var i = 0; i < len; ++i) {
						var char = code[i];
						var char_id = char.charCodeAt(0);

						if (char_id >= 241 and char_id <= 244) {
							code_data.push(fnc_a[char_id]);
						} else if (char_id >= 0 and char_id <= 95) {
							code_data.push(strpos(keys_a, char));
						} else {
							return false;
						}
					}

					break;
				}

			case "B":
				//MODE B
				{
					startid = 104;

					for (i = 0;; i < len; ++i) {
						char = code[i];
						char_id = char.charCodeAt(0);

						if (char_id >= 241 and char_id <= 244) {
							code_data.push(fnc_b[char_id]);
						} else if (char_id >= 32 and char_id <= 127) {
							code_data.push(strpos(keys_b, char));
						} else {
							return false;
						}
					}

					break;
				}

			case "C":
				//MODE C
				{
					startid = 105;

					if (code.charCodeAt(0) == 241) {
						code_data.push(102);
						code = code.substr(1);
						--len;
					}

					if (len % 2 != 0) //the length must be even
						{
							return false;
						}

					for (i = 0;; i < len; i += 2) {
						var chrnum = code[i] + code[i + 1];

						if (preg_match("/([0-9]{2})/", chrnum) > 0) {
							code_data.push(Math.round(chrnum));
						} else {
							return false;
						}
					}

					break;
				}

			default:
				//MODE AUTO
				//split code into sequences
				//get numeric sequences (if any)
				//process the sequence
				{
					var sequence = Array();
					var numseq = Array();
					preg_match_all("/([0-9]{4,})/", code, numseq, PREG_OFFSET_CAPTURE);

					if (undefined !== numseq[1] and !!numseq[1]) {
						var end_offset = 0;

						for (var val of Object.values(numseq[1])) {
							var offset = val[1];

							if (offset > end_offset) //non numeric sequence
								{
									sequence = array_merge(sequence, this.get128ABsequence(code.substr(end_offset, offset - end_offset)));
								}

							var slen = val[0].length;

							if (slen % 2 != 0) //the length must be even
								{
									--slen;
								}

							sequence.push(["C", code.substr(offset, slen), slen]);
							end_offset = offset + slen;
						}

						if (end_offset < len) {
							sequence = array_merge(sequence, this.get128ABsequence(code.substr(end_offset)));
						}
					} else //text code (non C mode)
						{
							sequence = array_merge(sequence, this.get128ABsequence(code));
						}

					for (var key in sequence) {
						var seq = sequence[key];

						switch (seq[0]) {
							case "A":
								{
									if (key == 0) {
										startid = 103;
									} else if (sequence[key - 1][0] != "A") {
										if (seq[2] == 1 and key > 0 and sequence[key - 1][0] == "B" and !(undefined !== sequence[key - 1][3])) //single character shift
											//mark shift
											{
												code_data.push(98);
												sequence[key][3] = true;
											} else if (!(undefined !== sequence[key - 1][3])) {
											code_data.push(101);
										}
									}

									for (i = 0;; i < seq[2]; ++i) {
										char = seq[1][i];
										char_id = char.charCodeAt(0);

										if (char_id >= 241 and char_id <= 244) {
											code_data.push(fnc_a[char_id]);
										} else {
											code_data.push(strpos(keys_a, char));
										}
									}

									break;
								}

							case "B":
								{
									if (key == 0) {
										var tmpchr = seq[1].charCodeAt(0);

										if (seq[2] == 1 and tmpchr >= 241 and tmpchr <= 244 and undefined !== sequence[key + 1] and sequence[key + 1][0] != "B") {
											switch (sequence[key + 1][0]) {
												case "A":
													{
														startid = 103;
														sequence[key][0] = "A";
														code_data.push(fnc_a[tmpchr]);
														break;
													}

												case "C":
													{
														startid = 105;
														sequence[key][0] = "C";
														code_data.push(fnc_a[tmpchr]);
														break;
													}
											}

											break;
										} else {
											startid = 104;
										}
									} else if (sequence[key - 1][0] != "B") {
										if (seq[2] == 1 and key > 0 and sequence[key - 1][0] == "A" and !(undefined !== sequence[key - 1][3])) //single character shift
											//mark shift
											{
												code_data.push(98);
												sequence[key][3] = true;
											} else if (!(undefined !== sequence[key - 1][3])) {
											code_data.push(100);
										}
									}

									for (i = 0;; i < seq[2]; ++i) {
										char = seq[1][i];
										char_id = char.charCodeAt(0);

										if (char_id >= 241 and char_id <= 244) {
											code_data.push(fnc_b[char_id]);
										} else {
											code_data.push(strpos(keys_b, char));
										}
									}

									break;
								}

							case "C":
								{
									if (key == 0) {
										startid = 105;
									} else if (sequence[key - 1][0] != "C") {
										code_data.push(99);
									}

									for (i = 0;; i < seq[2]; i += 2) {
										chrnum = seq[1][i] + seq[1][i + 1];
										code_data.push(Math.round(chrnum));
									}

									break;
								}
						}
					}
				}
		}

		var sum = startid;

		for (var key in code_data) {
			var val = code_data[key];
			sum += val * (key + 1);
		}

		code_data.push(sum % 103);
		code_data.push(106);
		code_data.push(107);
		code_data.unshift(startid);
		var bararray = {
			code: code,
			maxw: 0,
			maxh: 1,
			bcode: Array()
		};

		for (var val of Object.values(code_data)) {
			var seq = chr[val];

			for (var j = 0; j < 6; ++j) {
				if (j % 2 == 0) //bar
					{
						var t = true;
					} else //space
					{
						t = false;
					}

				var w = seq[j];
				bararray.bcode.push({
					t: t,
					w: w,
					h: 1,
					p: 0
				});
				bararray.maxw += w;
			}
		}

		return bararray;
	}

	get128ABsequence(code) //get A sequences (if any)
	{
		var len = code.length;
		var sequence = Array();
		var numseq = Array();
		preg_match_all("/([\\0-\\31])/", code, numseq, PREG_OFFSET_CAPTURE);

		if (undefined !== numseq[1] and !!numseq[1]) {
			var end_offset = 0;

			for (var val of Object.values(numseq[1])) {
				var offset = val[1];

				if (offset > end_offset) //B sequence
					{
						sequence.push(["B", code.substr(end_offset, offset - end_offset), offset - end_offset]);
					}

				var slen = val[0].length;
				sequence.push(["A", code.substr(offset, slen), slen]);
				end_offset = offset + slen;
			}

			if (end_offset < len) {
				sequence.push(["B", code.substr(end_offset), len - end_offset]);
			}
		} else //only B sequence
			{
				sequence.push(["B", code, len]);
			}

		return sequence;
	}

	barcode_eanupc(code, len = 13) //Padding
	//calculate check digit
	//left guard bar
	{
		var upce = false;

		if (len == 6) //UPC-A
			//UPC-E mode
			{
				len = 12;
				upce = true;
			}

		var data_len = len - 1;
		code = str_pad(code, data_len, "0", STR_PAD_LEFT);
		var code_len = code.length;
		var sum_a = 0;

		for (var i = 1; i < data_len; i += 2) {
			sum_a += code[i];
		}

		if (len > 12) {
			sum_a *= 3;
		}

		var sum_b = 0;

		for (i = 0;; i < data_len; i += 2) {
			sum_b += code[i];
		}

		if (len < 13) {
			sum_b *= 3;
		}

		var r = (sum_a + sum_b) % 10;

		if (r > 0) {
			r = 10 - r;
		}

		if (code_len == data_len) //add check digit
			{
				code += r;
			} else if (r !== Math.round(code[data_len])) //wrong checkdigit
			{
				return false;
			}

		if (len == 12) //UPC-A
			{
				code = "0" + code;
				++len;
			}

		if (upce) //convert UPC-A to UPC-E
			{
				var tmp = code.substr(4, 3);

				if (tmp == "000" or tmp == "100" or tmp == "200") //manufacturer code ends in 000, 100, or 200
					{
						var upce_code = code.substr(2, 2) + code.substr(9, 3) + code.substr(4, 1);
					} else {
					tmp = code.substr(5, 2);

					if (tmp == "00") //manufacturer code ends in 00
						{
							upce_code = code.substr(2, 3) + code.substr(10, 2) + "3";
						} else {
						tmp = code.substr(6, 1);

						if (tmp == "0") //manufacturer code ends in 0
							{
								upce_code = code.substr(2, 4) + code.substr(11, 1) + "4";
							} else //manufacturer code does not end in zero
							{
								upce_code = code.substr(2, 5) + code.substr(11, 1);
							}
					}
				}
			}

		var codes = {
			A: {
				"0": "0001101",
				"1": "0011001",
				"2": "0010011",
				"3": "0111101",
				"4": "0100011",
				"5": "0110001",
				"6": "0101111",
				"7": "0111011",
				"8": "0110111",
				"9": "0001011"
			},
			B: {
				"0": "0100111",
				"1": "0110011",
				"2": "0011011",
				"3": "0100001",
				"4": "0011101",
				"5": "0111001",
				"6": "0000101",
				"7": "0010001",
				"8": "0001001",
				"9": "0010111"
			},
			C: {
				"0": "1110010",
				"1": "1100110",
				"2": "1101100",
				"3": "1000010",
				"4": "1011100",
				"5": "1001110",
				"6": "1010000",
				"7": "1000100",
				"8": "1001000",
				"9": "1110100"
			}
		};
		var parities = {
			"0": ["A", "A", "A", "A", "A", "A"],
			"1": ["A", "A", "B", "A", "B", "B"],
			"2": ["A", "A", "B", "B", "A", "B"],
			"3": ["A", "A", "B", "B", "B", "A"],
			"4": ["A", "B", "A", "A", "B", "B"],
			"5": ["A", "B", "B", "A", "A", "B"],
			"6": ["A", "B", "B", "B", "A", "A"],
			"7": ["A", "B", "A", "B", "A", "B"],
			"8": ["A", "B", "A", "B", "B", "A"],
			"9": ["A", "B", "B", "A", "B", "A"]
		};
		var upce_parities = Array();
		upce_parities[0] = {
			"0": ["B", "B", "B", "A", "A", "A"],
			"1": ["B", "B", "A", "B", "A", "A"],
			"2": ["B", "B", "A", "A", "B", "A"],
			"3": ["B", "B", "A", "A", "A", "B"],
			"4": ["B", "A", "B", "B", "A", "A"],
			"5": ["B", "A", "A", "B", "B", "A"],
			"6": ["B", "A", "A", "A", "B", "B"],
			"7": ["B", "A", "B", "A", "B", "A"],
			"8": ["B", "A", "B", "A", "A", "B"],
			"9": ["B", "A", "A", "B", "A", "B"]
		};
		upce_parities[1] = {
			"0": ["A", "A", "A", "B", "B", "B"],
			"1": ["A", "A", "B", "A", "B", "B"],
			"2": ["A", "A", "B", "B", "A", "B"],
			"3": ["A", "A", "B", "B", "B", "A"],
			"4": ["A", "B", "A", "A", "B", "B"],
			"5": ["A", "B", "B", "A", "A", "B"],
			"6": ["A", "B", "B", "B", "A", "A"],
			"7": ["A", "B", "A", "B", "A", "B"],
			"8": ["A", "B", "A", "B", "B", "A"],
			"9": ["A", "B", "B", "A", "B", "A"]
		};
		var k = 0;
		var seq = "101";

		if (upce) //right guard bar
			{
				var bararray = {
					code: upce_code,
					maxw: 0,
					maxh: 1,
					bcode: Array()
				};
				var p = upce_parities[code[1]][r];

				for (i = 0;; i < 6; ++i) {
					seq += codes[p[i]][upce_code[i]];
				}

				seq += "010101";
			} else //center guard bar
			//right guard bar
			{
				bararray = {
					code: code,
					maxw: 0,
					maxh: 1,
					bcode: Array()
				};
				var half_len = Math.round(Math.ceil(len / 2));

				if (len == 8) {
					for (i = 0;; i < half_len; ++i) {
						seq += codes.A[code[i]];
					}
				} else {
					p = parities[code[0]];

					for (i = 1;; i < half_len; ++i) {
						seq += codes[p[i - 1]][code[i]];
					}
				}

				seq += "01010";

				for (i = half_len;; i < len; ++i) {
					seq += codes.C[code[i]];
				}

				seq += "101";
			}

		var clen = seq.length;
		var w = 0;

		for (i = 0;; i < clen; ++i) {
			w += 1;

			if (i == clen - 1 or (i < clen - 1 and seq[i] != seq[i + 1])) {
				if (seq[i] == "1") //bar
					{
						var t = true;
					} else //space
					{
						t = false;
					}

				bararray.bcode[k] = {
					t: t,
					w: w,
					h: 1,
					p: 0
				};
				bararray.maxw += w;
				++k;
				w = 0;
			}
		}

		return bararray;
	}

	barcode_eanext(code, len = 5) //Padding
	//calculate check digit
	//Convert digits to bars
	//left guard bar
	{
		code = str_pad(code, len, "0", STR_PAD_LEFT);

		if (len == 2) {
			var r = code % 4;
		} else if (len == 5) {
			r = 3 * (code[0] + code[2] + code[4]) + 9 * (code[1] + code[3]);
			r %= 10;
		} else {
			return false;
		}

		var codes = {
			A: {
				"0": "0001101",
				"1": "0011001",
				"2": "0010011",
				"3": "0111101",
				"4": "0100011",
				"5": "0110001",
				"6": "0101111",
				"7": "0111011",
				"8": "0110111",
				"9": "0001011"
			},
			B: {
				"0": "0100111",
				"1": "0110011",
				"2": "0011011",
				"3": "0100001",
				"4": "0011101",
				"5": "0111001",
				"6": "0000101",
				"7": "0010001",
				"8": "0001001",
				"9": "0010111"
			}
		};
		var parities = Array();
		parities[2] = {
			"0": ["A", "A"],
			"1": ["A", "B"],
			"2": ["B", "A"],
			"3": ["B", "B"]
		};
		parities[5] = {
			"0": ["B", "B", "A", "A", "A"],
			"1": ["B", "A", "B", "A", "A"],
			"2": ["B", "A", "A", "B", "A"],
			"3": ["B", "A", "A", "A", "B"],
			"4": ["A", "B", "B", "A", "A"],
			"5": ["A", "A", "B", "B", "A"],
			"6": ["A", "A", "A", "B", "B"],
			"7": ["A", "B", "A", "B", "A"],
			"8": ["A", "B", "A", "A", "B"],
			"9": ["A", "A", "B", "A", "B"]
		};
		var p = parities[len][r];
		var seq = "1011";
		seq += codes[p[0]][code[0]];

		for (var i = 1; i < len; ++i) //separator
		{
			seq += "01";
			seq += codes[p[i]][code[i]];
		}

		var bararray = {
			code: code,
			maxw: 0,
			maxh: 1,
			bcode: Array()
		};
		return this.binseq_to_array(seq, bararray);
	}

	barcode_postnet(code, planet = false) //bar lenght
	//calculate checksum
	//start bar
	//end bar
	{
		if (planet) {
			var barlen = {
				0: [1, 1, 2, 2, 2],
				1: [2, 2, 2, 1, 1],
				2: [2, 2, 1, 2, 1],
				3: [2, 2, 1, 1, 2],
				4: [2, 1, 2, 2, 1],
				5: [2, 1, 2, 1, 2],
				6: [2, 1, 1, 2, 2],
				7: [1, 2, 2, 2, 1],
				8: [1, 2, 2, 1, 2],
				9: [1, 2, 1, 2, 2]
			};
		} else {
			barlen = {
				0: [2, 2, 1, 1, 1],
				1: [1, 1, 1, 2, 2],
				2: [1, 1, 2, 1, 2],
				3: [1, 1, 2, 2, 1],
				4: [1, 2, 1, 1, 2],
				5: [1, 2, 1, 2, 1],
				6: [1, 2, 2, 1, 1],
				7: [2, 1, 1, 1, 2],
				8: [2, 1, 1, 2, 1],
				9: [2, 1, 2, 1, 1]
			};
		}

		var bararray = {
			code: code,
			maxw: 0,
			maxh: 2,
			bcode: Array()
		};
		var k = 0;
		code = str_replace("-", "", code);
		code = str_replace(" ", "", code);
		var len = code.length;
		var sum = 0;

		for (var i = 0; i < len; ++i) {
			sum += Math.round(code[i]);
		}

		var chkd = sum % 10;

		if (chkd > 0) {
			chkd = 10 - chkd;
		}

		code += chkd;
		len = code.length;
		bararray.bcode[k++] = {
			t: 1,
			w: 1,
			h: 2,
			p: 0
		};
		bararray.bcode[k++] = {
			t: 0,
			w: 1,
			h: 2,
			p: 0
		};
		bararray.maxw += 2;

		for (i = 0;; i < len; ++i) {
			for (var j = 0; j < 5; ++j) {
				var h = barlen[code[i]][j];
				var p = Math.floor(1 / h);
				bararray.bcode[k++] = {
					t: 1,
					w: 1,
					h: h,
					p: p
				};
				bararray.bcode[k++] = {
					t: 0,
					w: 1,
					h: 2,
					p: 0
				};
				bararray.maxw += 2;
			}
		}

		bararray.bcode[k++] = {
			t: 1,
			w: 1,
			h: 2,
			p: 0
		};
		bararray.maxw += 1;
		return bararray;
	}

	barcode_rms4cc(code, kix = false) //bar mode
	//1 = pos 1, length 2
	//2 = pos 1, length 3
	//3 = pos 2, length 1
	//4 = pos 2, length 2
	{
		var notkix = !kix;
		var barmode = {
			"0": [3, 3, 2, 2],
			"1": [3, 4, 1, 2],
			"2": [3, 4, 2, 1],
			"3": [4, 3, 1, 2],
			"4": [4, 3, 2, 1],
			"5": [4, 4, 1, 1],
			"6": [3, 1, 4, 2],
			"7": [3, 2, 3, 2],
			"8": [3, 2, 4, 1],
			"9": [4, 1, 3, 2],
			A: [4, 1, 4, 1],
			B: [4, 2, 3, 1],
			C: [3, 1, 2, 4],
			D: [3, 2, 1, 4],
			E: [3, 2, 2, 3],
			F: [4, 1, 1, 4],
			G: [4, 1, 2, 3],
			H: [4, 2, 1, 3],
			I: [1, 3, 4, 2],
			J: [1, 4, 3, 2],
			K: [1, 4, 4, 1],
			L: [2, 3, 3, 2],
			M: [2, 3, 4, 1],
			N: [2, 4, 3, 1],
			O: [1, 3, 2, 4],
			P: [1, 4, 1, 4],
			Q: [1, 4, 2, 3],
			R: [2, 3, 1, 4],
			S: [2, 3, 2, 3],
			T: [2, 4, 1, 3],
			U: [1, 1, 4, 4],
			V: [1, 2, 3, 4],
			W: [1, 2, 4, 3],
			X: [2, 1, 3, 4],
			Y: [2, 1, 4, 3],
			Z: [2, 2, 3, 3]
		};
		code = code.toUpperCase();
		var len = code.length;
		var bararray = {
			code: code,
			maxw: 0,
			maxh: 3,
			bcode: Array()
		};

		if (notkix) //table for checksum calculation (row,col)
			{
				var checktable = {
					"0": [1, 1],
					"1": [1, 2],
					"2": [1, 3],
					"3": [1, 4],
					"4": [1, 5],
					"5": [1, 0],
					"6": [2, 1],
					"7": [2, 2],
					"8": [2, 3],
					"9": [2, 4],
					A: [2, 5],
					B: [2, 0],
					C: [3, 1],
					D: [3, 2],
					E: [3, 3],
					F: [3, 4],
					G: [3, 5],
					H: [3, 0],
					I: [4, 1],
					J: [4, 2],
					K: [4, 3],
					L: [4, 4],
					M: [4, 5],
					N: [4, 0],
					O: [5, 1],
					P: [5, 2],
					Q: [5, 3],
					R: [5, 4],
					S: [5, 5],
					T: [5, 0],
					U: [0, 1],
					V: [0, 2],
					W: [0, 3],
					X: [0, 4],
					Y: [0, 5],
					Z: [0, 0]
				};
				var row = 0;
				var col = 0;

				for (var i = 0; i < len; ++i) {
					row += checktable[code[i]][0];
					col += checktable[code[i]][1];
				}

				row %= 6;
				col %= 6;
				var chk = Object.keys(checktable, [row, col]);
				code += chk[0];
				++len;
			}

		var k = 0;

		if (notkix) //start bar
			{
				bararray.bcode[k++] = {
					t: 1,
					w: 1,
					h: 2,
					p: 0
				};
				bararray.bcode[k++] = {
					t: 0,
					w: 1,
					h: 2,
					p: 0
				};
				bararray.maxw += 2;
			}

		for (i = 0;; i < len; ++i) {
			for (var j = 0; j < 4; ++j) {
				switch (barmode[code[i]][j]) {
					case 1:
						{
							var p = 0;
							var h = 2;
							break;
						}

					case 2:
						{
							p = 0;
							h = 3;
							break;
						}

					case 3:
						{
							p = 1;
							h = 1;
							break;
						}

					case 4:
						{
							p = 1;
							h = 2;
							break;
						}
				}

				bararray.bcode[k++] = {
					t: 1,
					w: 1,
					h: h,
					p: p
				};
				bararray.bcode[k++] = {
					t: 0,
					w: 1,
					h: 2,
					p: 0
				};
				bararray.maxw += 2;
			}
		}

		if (notkix) //stop bar
			{
				bararray.bcode[k++] = {
					t: 1,
					w: 1,
					h: 3,
					p: 0
				};
				bararray.maxw += 1;
			}

		return bararray;
	}

	barcode_codabar(code) {
		var chr = {
			"0": "11111221",
			"1": "11112211",
			"2": "11121121",
			"3": "22111111",
			"4": "11211211",
			"5": "21111211",
			"6": "12111121",
			"7": "12112111",
			"8": "12211111",
			"9": "21121111",
			"-": "11122111",
			"$": "11221111",
			":": "21112121",
			"/": "21211121",
			".": "21212111",
			"+": "11222221",
			A: "11221211",
			B: "12121121",
			C: "11121221",
			D: "11122211"
		};
		var bararray = {
			code: code,
			maxw: 0,
			maxh: 1,
			bcode: Array()
		};
		var k = 0;
		var w = 0;
		var seq = "";
		code = "A" + code.toUpperCase() + "A";
		var len = code.length;

		for (var i = 0; i < len; ++i) {
			if (!(undefined !== chr[code[i]])) {
				return false;
			}

			seq = chr[code[i]];

			for (var j = 0; j < 8; ++j) {
				if (j % 2 == 0) //bar
					{
						var t = true;
					} else //space
					{
						t = false;
					}

				w = seq[j];
				bararray.bcode[k] = {
					t: t,
					w: w,
					h: 1,
					p: 0
				};
				bararray.maxw += w;
				++k;
			}
		}

		return bararray;
	}

	barcode_code11(code) //calculate check digit C
	{
		var chr = {
			"0": "111121",
			"1": "211121",
			"2": "121121",
			"3": "221111",
			"4": "112121",
			"5": "212111",
			"6": "122111",
			"7": "111221",
			"8": "211211",
			"9": "211111",
			"-": "112111",
			S: "112211"
		};
		var bararray = {
			code: code,
			maxw: 0,
			maxh: 1,
			bcode: Array()
		};
		var k = 0;
		var w = 0;
		var seq = "";
		var len = code.length;
		var p = 1;
		var check = 0;

		for (var i = len - 1; i >= 0; --i) {
			var digit = code[i];

			if (digit == "-") {
				var dval = 10;
			} else {
				dval = Math.round(digit);
			}

			check += dval * p;
			++p;

			if (p > 10) {
				p = 1;
			}
		}

		check %= 11;

		if (check == 10) {
			check = "-";
		}

		code += check;

		if (len > 10) //calculate check digit K
			{
				p = 1;
				check = 0;

				for (i = len;; i >= 0; --i) {
					digit = code[i];

					if (digit == "-") {
						dval = 10;
					} else {
						dval = Math.round(digit);
					}

					check += dval * p;
					++p;

					if (p > 9) {
						p = 1;
					}
				}

				check %= 11;
				code += check;
				++len;
			}

		code = "S" + code + "S";
		len += 3;

		for (i = 0;; i < len; ++i) {
			if (!(undefined !== chr[code[i]])) {
				return false;
			}

			seq = chr[code[i]];

			for (var j = 0; j < 6; ++j) {
				if (j % 2 == 0) //bar
					{
						var t = true;
					} else //space
					{
						t = false;
					}

				w = seq[j];
				bararray.bcode[k] = {
					t: t,
					w: w,
					h: 1,
					p: 0
				};
				bararray.maxw += w;
				++k;
			}
		}

		return bararray;
	}

	barcode_pharmacode(code) {
		var seq = "";
		code = Math.round(code);

		while (code > 0) {
			if (code % 2 == 0) {
				seq += "11100";
				code -= 2;
			} else {
				seq += "100";
				code -= 1;
			}

			code /= 2;
		}

		seq = seq.substr(0, -2);
		seq = strrev(seq);
		var bararray = {
			code: code,
			maxw: 0,
			maxh: 1,
			bcode: Array()
		};
		return this.binseq_to_array(seq, bararray);
	}

	barcode_pharmacode2t(code) {
		var seq = "";
		code = Math.round(code);

		do {
			switch (code % 3) {
				case 0:
					{
						seq += "3";
						code = (code - 3) / 3;
						break;
					}

				case 1:
					{
						seq += "1";
						code = (code - 1) / 3;
						break;
					}

				case 2:
					{
						seq += "2";
						code = (code - 2) / 3;
						break;
					}
			}
		} while (code != 0);

		seq = strrev(seq);
		var k = 0;
		var bararray = {
			code: code,
			maxw: 0,
			maxh: 2,
			bcode: Array()
		};
		var len = seq.length;

		for (var i = 0; i < len; ++i) {
			switch (seq[i]) {
				case "1":
					{
						var p = 1;
						var h = 1;
						break;
					}

				case "2":
					{
						p = 0;
						h = 1;
						break;
					}

				case "3":
					{
						p = 0;
						h = 2;
						break;
					}
			}

			bararray.bcode[k++] = {
				t: 1,
				w: 1,
				h: h,
				p: p
			};
			bararray.bcode[k++] = {
				t: 0,
				w: 1,
				h: 2,
				p: 0
			};
			bararray.maxw += 2;
		}

		delete bararray.bcode[k - 1];
		--bararray.maxw;
		return bararray;
	}

	barcode_imb(code) //Conversion of Routing Code
	//convert to hexadecimal
	//pad to get 13 bytes
	//convert string to array of bytes
	//calculate frame check sequence
	//exclude first 2 bits from first byte
	//convert binary data to codewords
	//convert codewords to characters
	//build bars
	{
		var asc_chr = [4, 0, 2, 6, 3, 5, 1, 9, 8, 7, 1, 2, 0, 6, 4, 8, 2, 9, 5, 3, 0, 1, 3, 7, 4, 6, 8, 9, 2, 0, 5, 1, 9, 4, 3, 8, 6, 7, 1, 2, 4, 3, 9, 5, 7, 8, 3, 0, 2, 1, 4, 0, 9, 1, 7, 0, 2, 4, 6, 3, 7, 1, 9, 5, 8];
		var dsc_chr = [7, 1, 9, 5, 8, 0, 2, 4, 6, 3, 5, 8, 9, 7, 3, 0, 6, 1, 7, 4, 6, 8, 9, 2, 5, 1, 7, 5, 4, 3, 8, 7, 6, 0, 2, 5, 4, 9, 3, 0, 1, 6, 8, 2, 0, 4, 5, 9, 6, 7, 5, 2, 6, 3, 8, 5, 1, 9, 8, 7, 4, 0, 2, 6, 3];
		var asc_pos = [3, 0, 8, 11, 1, 12, 8, 11, 10, 6, 4, 12, 2, 7, 9, 6, 7, 9, 2, 8, 4, 0, 12, 7, 10, 9, 0, 7, 10, 5, 7, 9, 6, 8, 2, 12, 1, 4, 2, 0, 1, 5, 4, 6, 12, 1, 0, 9, 4, 7, 5, 10, 2, 6, 9, 11, 2, 12, 6, 7, 5, 11, 0, 3, 2];
		var dsc_pos = [2, 10, 12, 5, 9, 1, 5, 4, 3, 9, 11, 5, 10, 1, 6, 3, 4, 1, 10, 0, 2, 11, 8, 6, 1, 12, 3, 8, 6, 4, 4, 11, 0, 6, 1, 9, 11, 5, 3, 7, 3, 10, 7, 11, 8, 2, 10, 3, 5, 8, 0, 3, 12, 11, 8, 4, 5, 1, 3, 0, 7, 12, 9, 8, 10];
		var code_arr = code.split("-");
		var tracking_number = code_arr[0];

		if (undefined !== code_arr[1]) {
			var routing_code = code_arr[1];
		} else {
			routing_code = "";
		}

		switch (routing_code.length) {
			case 0:
				{
					var binary_code = 0;
					break;
				}

			case 5:
				{
					binary_code = bcadd(routing_code, "1");
					break;
				}

			case 9:
				{
					binary_code = bcadd(routing_code, "100001");
					break;
				}

			case 11:
				{
					binary_code = bcadd(routing_code, "1000100001");
					break;
				}

			default:
				{
					return false;
					break;
				}
		}

		binary_code = bcmul(binary_code, 10);
		binary_code = bcadd(binary_code, tracking_number[0]);
		binary_code = bcmul(binary_code, 5);
		binary_code = bcadd(binary_code, tracking_number[1]);
		binary_code += tracking_number.substr(2, 18);
		binary_code = this.dec_to_hex(binary_code);
		binary_code = str_pad(binary_code, 26, "0", STR_PAD_LEFT);
		var binary_code_arr = chunk_split(binary_code, 2, "\r");
		binary_code_arr = binary_code_arr.substr(0, -1);
		binary_code_arr = binary_code_arr.split("\r");
		var fcs = this.imb_crc11fcs(binary_code_arr);
		var first_byte = sprintf("%2s", dechex(hexdec(binary_code_arr[0]) << 2 >> 2));
		var binary_code_102bit = first_byte + binary_code.substr(2);
		var codewords = Array();
		var data = this.hex_to_dec(binary_code_102bit);
		codewords[0] = bcmod(data, 636) * 2;
		data = bcdiv(data, 636);

		for (var i = 1; i < 9; ++i) {
			codewords[i] = bcmod(data, 1365);
			data = bcdiv(data, 1365);
		}

		codewords[9] = data;

		if (fcs >> 10 == 1) {
			codewords[9] += 659;
		}

		var table2of13 = this.imb_tables(2, 78);
		var table5of13 = this.imb_tables(5, 1287);
		var characters = Array();
		var bitmask = 512;

		for (var k in codewords) {
			var val = codewords[k];

			if (val <= 1286) {
				var chrcode = table5of13[val];
			} else {
				chrcode = table2of13[val - 1287];
			}

			if ((fcs & bitmask) > 0) //bitwise invert
				{
					chrcode = ~chrcode & 8191;
				}

			characters.push(chrcode);
			bitmask /= 2;
		}

		characters = characters.reverse();
		var k = 0;
		var bararray = {
			code: code,
			maxw: 0,
			maxh: 3,
			bcode: Array()
		};

		for (i = 0;; i < 65; ++i) {
			var asc = (characters[asc_chr[i]] & Math.pow(2, asc_pos[i])) > 0;
			var dsc = (characters[dsc_chr[i]] & Math.pow(2, dsc_pos[i])) > 0;

			if (asc and dsc) //full bar (F)
				{
					var p = 0;
					var h = 3;
				} else if (asc) //ascender (A)
				{
					p = 0;
					h = 2;
				} else if (dsc) //descender (D)
				{
					p = 1;
					h = 2;
				} else //tracker (T)
				{
					p = 1;
					h = 1;
				}

			bararray.bcode[k++] = {
				t: 1,
				w: 1,
				h: h,
				p: p
			};
			bararray.bcode[k++] = {
				t: 0,
				w: 1,
				h: 2,
				p: 0
			};
			bararray.maxw += 2;
		}

		delete bararray.bcode[k - 1];
		--bararray.maxw;
		return bararray;
	}

	dec_to_hex(number) //return implode($hex); -->implode::の原因、変換できない
	{
		var i = 0;
		var hex = Array();

		if (number == 0) {
			return "00";
		}

		while (number > 0) {
			if (number == 0) {
				hex.push("0");
			} else {
				hex.push(dechex(bcmod(number, "16")).toUpperCase());
				number = bcdiv(number, "16", 0);
			}
		}

		hex = hex.reverse();
	}

	hex_to_dec(hex) {
		var dec = 0;
		var bitval = 1;
		var len = hex.length;

		for (var pos = len - 1; pos >= 0; --pos) {
			dec = bcadd(dec, bcmul(hexdec(hex[pos]), bitval));
			bitval = bcmul(bitval, 16);
		}

		return dec;
	}

	imb_crc11fcs(code_arr) //generator polynomial
	//Frame Check Sequence
	//do most significant byte skipping the 2 most significant bits
	//do rest of bytes
	{
		var genpoly = 3893;
		var fcs = 2047;
		var data = hexdec(code_arr[0]) << 5;

		for (var bit = 2; bit < 8; ++bit) {
			if ((fcs ^ data) & 1024) {
				fcs = fcs << 1 ^ genpoly;
			} else {
				fcs = fcs << 1;
			}

			fcs &= 2047;
			data <<= 1;
		}

		for (var byte = 1; byte < 13; ++byte) {
			data = hexdec(code_arr[byte]) << 3;

			for (bit = 0;; bit < 8; ++bit) {
				if ((fcs ^ data) & 1024) {
					fcs = fcs << 1 ^ genpoly;
				} else {
					fcs = fcs << 1;
				}

				fcs &= 2047;
				data <<= 1;
			}
		}

		return fcs;
	}

	imb_reverse_us(num) {
		var rev = 0;

		for (var i = 0; i < 16; ++i) {
			rev <<= 1;
			rev |= num & 1;
			num >>= 1;
		}

		return rev;
	}

	imb_tables(n, size) //LUT lower index
	//LUT upper index
	{
		var table = Array();
		var lli = 0;
		var lui = size - 1;

		for (var count = 0; count < 8192; ++count) //if we don't have the right number of bits on, go on to the next value
		{
			var bit_count = 0;

			for (var bit_index = 0; bit_index < 13; ++bit_index) {
				bit_count += Math.round((count & 1 << bit_index) != 0);
			}

			if (bit_count == n) //if the reverse is less than count, we have already visited this pair before
				{
					var reverse = this.imb_reverse_us(count) >> 3;

					if (reverse >= count) //If count is symmetric, place it at the first free slot from the end of the list.
						//Otherwise, place it at the first free slot from the beginning of the list AND place $reverse ath the next free slot from the beginning of the list
						{
							if (reverse == count) {
								table[lui] = count;
								--lui;
							} else {
								table[lli] = count;
								++lli;
								table[lli] = reverse;
								++lli;
							}
						}
				}
		}

		return table;
	}

};