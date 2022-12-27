//============================================================+
//File name   : 2dbarcodes.php
//Version     : 1.0.014
//Begin       : 2009-04-07
//Last Update : 2012-04-30
//Author      : Nicola Asuni - Tecnick.com LTD - Manor Coach House, Church Hill, Aldershot, Hants, GU12 4RQ, UK - www.tecnick.com - info@tecnick.com
//License     : GNU-LGPL v3 (http://www.gnu.org/copyleft/lesser.html)
//-------------------------------------------------------------------
//Copyright (C) 2009-2012  Nicola Asuni - Tecnick.com LTD
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
//2D barcodes to be used with TCPDF.
//
//============================================================+
//
//@file
//PHP class to creates array representations for 2D barcodes to be used with TCPDF.
//@package com.tecnick.tcpdf
//@author Nicola Asuni
//@version 1.0.014
//
//
//@class TCPDF2DBarcode
//PHP class to creates array representations for 2D barcodes to be used with TCPDF (http://www.tcpdf.org).
//@package com.tecnick.tcpdf
//@version 1.0.014
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
//Return an array representations for 2D barcodes:<ul>
//<li>$arrcode['code'] code to be printed on text label</li>
//<li>$arrcode['num_rows'] required number of rows</li>
//<li>$arrcode['num_cols'] required number of columns</li>
//<li>$arrcode['bcode'][$r][$c] value of the cell is $r row and $c column (0 = transparent, 1 = black)</li></ul>
//@param $code (string) code to print
//@param $type (string) type of barcode: <ul><li>DATAMATRIX : Datamatrix (ISO/IEC 16022)</li><li>PDF417 : PDF417 (ISO/IEC 15438:2006)</li><li>PDF417,a,e,t,s,f,o0,o1,o2,o3,o4,o5,o6 : PDF417 with parameters: a = aspect ratio (width/height); e = error correction level (0-8); t = total number of macro segments; s = macro segment index (0-99998); f = file ID; o0 = File Name (text); o1 = Segment Count (numeric); o2 = Time Stamp (numeric); o3 = Sender (text); o4 = Addressee (text); o5 = File Size (numeric); o6 = Checksum (numeric). NOTES: Parameters t, s and f are required for a Macro Control Block, all other parametrs are optional. To use a comma character ',' on text options, replace it with the character 255: "\xff".</li><li>QRCODE : QRcode Low error correction</li><li>QRCODE,L : QRcode Low error correction</li><li>QRCODE,M : QRcode Medium error correction</li><li>QRCODE,Q : QRcode Better error correction</li><li>QRCODE,H : QR-CODE Best error correction</li><li>RAW: raw mode - comma-separad list of array rows</li><li>RAW2: raw mode - array rows are surrounded by square parenthesis.</li><li>TEST : Test matrix</li></ul>
//
//
//Return an array representations of barcode.
//@return array
//
//
//Send barcode as SVG image object to the standard output.
//@param $w (int) Width of a single rectangle element in user units.
//@param $h (int) Height of a single rectangle element in user units.
//@param $color (string) Foreground color (in SVG format) for bar elements (background is transparent).
//@public
//
//
//Return a SVG string representation of barcode.
//@param $w (int) Width of a single rectangle element in user units.
//@param $h (int) Height of a single rectangle element in user units.
//@param $color (string) Foreground color (in SVG format) for bar elements (background is transparent).
//@return string SVG code.
//@public
//
//
//Return an HTML representation of barcode.
//@param $w (int) Width of a single rectangle element in pixels.
//@param $h (int) Height of a single rectangle element in pixels.
//@param $color (string) Foreground color for bar elements (background is transparent).
//@return string HTML code.
//@public
//
//
//Return a PNG image representation of barcode (requires GD or Imagick library).
//@param $w (int) Width of a single rectangle element in pixels.
//@param $h (int) Height of a single rectangle element in pixels.
//@param $color (array) RGB (0-255) foreground color for bar elements (background is transparent).
//@return image or false in case of error.
//@public
//
//
//Set the barcode.
//@param $code (string) code to print
//@param $type (string) type of barcode: <ul><li>DATAMATRIX : Datamatrix (ISO/IEC 16022)</li><li>PDF417 : PDF417 (ISO/IEC 15438:2006)</li><li>PDF417,a,e,t,s,f,o0,o1,o2,o3,o4,o5,o6 : PDF417 with parameters: a = aspect ratio (width/height); e = error correction level (0-8); t = total number of macro segments; s = macro segment index (0-99998); f = file ID; o0 = File Name (text); o1 = Segment Count (numeric); o2 = Time Stamp (numeric); o3 = Sender (text); o4 = Addressee (text); o5 = File Size (numeric); o6 = Checksum (numeric). NOTES: Parameters t, s and f are required for a Macro Control Block, all other parametrs are optional. To use a comma character ',' on text options, replace it with the character 255: "\xff".</li><li>QRCODE : QRcode Low error correction</li><li>QRCODE,L : QRcode Low error correction</li><li>QRCODE,M : QRcode Medium error correction</li><li>QRCODE,Q : QRcode Better error correction</li><li>QRCODE,H : QR-CODE Best error correction</li><li>RAW: raw mode - comma-separad list of array rows</li><li>RAW2: raw mode - array rows are surrounded by square parenthesis.</li><li>TEST : Test matrix</li></ul>
//@return array
//
class TCPDF2DBarcode {
	constructor(code, type) {
		this.barcode_array = false;
		this.setBarcode(code, type);
	}

	getBarcodeArray() {
		return this.barcode_array;
	}

	getBarcodeSVG(w = 3, h = 3, color = "black") //send headers
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

	getBarcodeSVGcode(w = 3, h = 3, color = "black") //replace table for special characters
	//print barcode elements
	//for each row
	{
		var repstr = {
			"\\0": "",
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;"
		};
		var svg = "<" + "?" + "xml version=\"1.0\" standalone=\"no\"" + "?" + ">" + "\n";
		svg += "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">" + "\n";
		svg += "<svg width=\"" + Math.round(this.barcode_array.num_cols * w, 3) + "\" height=\"" + Math.round(this.barcode_array.num_rows * h, 3) + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">" + "\n";
		svg += "\t" + "<desc>" + strtr(this.barcode_array.code, repstr) + "</desc>" + "\n";
		svg += "\t" + "<g id=\"elements\" fill=\"" + color + "\" stroke=\"none\">" + "\n";
		var y = 0;

		for (var r = 0; r < this.barcode_array.num_rows; ++r) //for each column
		{
			var x = 0;

			for (var c = 0; c < this.barcode_array.num_cols; ++c) {
				if (this.barcode_array.bcode[r][c] == 1) //draw a single barcode cell
					{
						svg += "\t\t" + "<rect x=\"" + x + "\" y=\"" + y + "\" width=\"" + w + "\" height=\"" + h + "\" />" + "\n";
					}

				x += w;
			}

			y += h;
		}

		svg += "\t" + "</g>" + "\n";
		svg += "</svg>" + "\n";
		return svg;
	}

	getBarcodeHTML(w = 10, h = 10, color = "black") //print barcode elements
	//for each row
	{
		var html = "<div style=\"font-size:0;position:relative;width:" + w * this.barcode_array.num_cols + "px;height:" + h * this.barcode_array.num_rows + "px;\">" + "\n";
		var y = 0;

		for (var r = 0; r < this.barcode_array.num_rows; ++r) //for each column
		{
			var x = 0;

			for (var c = 0; c < this.barcode_array.num_cols; ++c) {
				if (this.barcode_array.bcode[r][c] == 1) //draw a single barcode cell
					{
						html += "<div style=\"background-color:" + color + ";width:" + w + "px;height:" + h + "px;position:absolute;left:" + x + "px;top:" + y + "px;\">&nbsp;</div>" + "\n";
					}

				x += w;
			}

			y += h;
		}

		html += "</div>" + "\n";
		return html;
	}

	getBarcodePNG(w = 3, h = 3, color = [0, 0, 0]) //calculate image size
	//print barcode elements
	//for each row
	//send headers
	//HTTP/1.1
	//Date in the past
	{
		var width = this.barcode_array.num_cols * w;
		var height = this.barcode_array.num_rows * h;

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

		var y = 0;

		for (var r = 0; r < this.barcode_array.num_rows; ++r) //for each column
		{
			var x = 0;

			for (var c = 0; c < this.barcode_array.num_cols; ++c) {
				if (this.barcode_array.bcode[r][c] == 1) //draw a single barcode cell
					{
						if (imagick) {
							bar.rectangle(x, y, x + w - 1, y + h - 1);
						} else {
							imagefilledrectangle(png, x, y, x + w - 1, y + h - 1, fgcol);
						}
					}

				x += w;
			}

			y += h;
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
		var mode = type.split(",");
		var qrtype = mode[0].toUpperCase();

		switch (qrtype) {
			case "DATAMATRIX":
				//DATAMATRIX (ISO/IEC 16022)
				{
					require(dirname(__filename) + "/datamatrix.php");

					var qrcode = new Datamatrix(code);
					this.barcode_array = qrcode.getBarcodeArray();
					this.barcode_array.code = code;
					break;
				}

			case "PDF417":
				//PDF417 (ISO/IEC 15438:2006)
				//set macro block
				{
					require(dirname(__filename) + "/pdf417.php");

					if (!(undefined !== mode[1]) or mode[1] === "") //default aspect ratio (width / height)
						{
							var aspectratio = 2;
						} else {
						aspectratio = +mode[1];
					}

					if (!(undefined !== mode[2]) or mode[2] === "") //default error correction level (auto)
						{
							var ecl = -1;
						} else {
						ecl = Math.round(mode[2]);
					}

					var macro = Array();

					if (undefined !== mode[3] and mode[3] !== "" and undefined !== mode[4] and mode[4] !== "" and undefined !== mode[5] and mode[5] !== "") {
						macro.segment_total = Math.round(mode[3]);
						macro.segment_index = Math.round(mode[4]);
						macro.file_id = strtr(mode[5], "\\xff", ",");

						for (var i = 0; i < 7; ++i) {
							var o = i + 6;

							if (undefined !== mode[o] and mode[o] !== "") //add option
								{
									macro["option_" + i] = strtr(mode[o], "\\xff", ",");
								}
						}
					}

					qrcode = new PDF417(code, ecl, aspectratio, macro);
					this.barcode_array = qrcode.getBarcodeArray();
					this.barcode_array.code = code;
					break;
				}

			case "QRCODE":
				//QR-CODE
				{
					require(dirname(__filename) + "/qrcode.php");

					if (!(undefined !== mode[1]) or !(-1 !== ["L", "M", "Q", "H"].indexOf(mode[1]))) //Ddefault: Low error correction
						{
							mode[1] = "L";
						}

					qrcode = new QRcode(code, mode[1].toUpperCase());
					this.barcode_array = qrcode.getBarcodeArray();
					this.barcode_array.code = code;
					break;
				}

			case "RAW":
			case "RAW2":
				//RAW MODE
				//remove spaces
				{
					code = code.replace(/[\s]*/gsi, "");

					if (code.length < 3) {
						break;
					}

					if (qrtype == "RAW") //comma-separated rows
						{
							var rows = code.split(",");
						} else //RAW2
						//rows enclosed in square parentheses
						{
							code = code.substr(1, -1);
							rows = code.split("][");
						}

					this.barcode_array.num_rows = rows.length;
					this.barcode_array.num_cols = rows[0].length;
					this.barcode_array.bcode = Array();

					for (var r of Object.values(rows)) {
						this.barcode_array.bcode.push(str_split(r, 1));
					}

					this.barcode_array.code = code;
					break;
				}

			case "TEST":
				//TEST MODE
				{
					this.barcode_array.num_rows = 5;
					this.barcode_array.num_cols = 15;
					this.barcode_array.bcode = [[1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1], [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0], [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0], [0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0]];
					this.barcode_array.code = code;
					break;
				}

			default:
				{
					this.barcode_array = false;
				}
		}
	}

};