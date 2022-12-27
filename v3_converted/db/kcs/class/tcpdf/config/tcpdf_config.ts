//============================================================+
//File name   : tcpdf_config.php
//Begin       : 2004-06-11
//Last Update : 2013-02-06
//
//Description : Configuration file for TCPDF.
//Author      : Nicola Asuni - Tecnick.com LTD - Manor Coach House, Church Hill, Aldershot, Hants, GU12 4RQ, UK - www.tecnick.com - info@tecnick.com
//License     : GNU-LGPL v3 (http://www.gnu.org/copyleft/lesser.html)
//-------------------------------------------------------------------
//Copyright (C) 2004-2013  Nicola Asuni - Tecnick.com LTD
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
//============================================================+
//
//Configuration file for TCPDF.
//@author Nicola Asuni
//@package com.tecnick.tcpdf
//@version 4.9.005
//@since 2004-10-27
//
//If you define the constant K_TCPDF_EXTERNAL_CONFIG, the following settings will be ignored.

if (!("undefined" !== typeof K_TCPDF_EXTERNAL_CONFIG)) //DOCUMENT_ROOT fix for IIS Webserver
	//Automatic calculation for the following K_PATH_MAIN constant
	//Automatic calculation for the following K_PATH_URL constant
	//default value for console mode
	//
	//path for PDF fonts
	//use K_PATH_MAIN.'fonts/old/' for old non-UTF8 fonts
	//
	//
	//cache directory for temporary files (full path)
	//
	//
	//cache directory for temporary files (url path)
	//
	//
	//images directory
	//
	//
	//blank image
	//
	//
	//page format
	//
	//
	//page orientation (P=portrait, L=landscape)
	//
	//
	//document creator
	//
	//
	//document author
	//
	//
	//header title
	//
	//
	//header description string
	//
	//
	//image logo
	//
	//
	//header logo image width [mm]
	//
	//
	//document unit of measure [pt=point, mm=millimeter, cm=centimeter, in=inch]
	//
	//
	//header margin
	//
	//
	//footer margin
	//
	//
	//top margin
	//
	//
	//bottom margin
	//
	//
	//left margin
	//
	//
	//right margin
	//
	//
	//default main font name
	//
	//
	//default main font size
	//
	//
	//default data font name
	//
	//
	//default data font size
	//
	//
	//default monospaced font name
	//
	//
	//ratio used to adjust the conversion of pixels to user units
	//
	//
	//magnification factor for titles
	//
	//
	//height of cell respect font height
	//
	//
	//title magnification respect main font size
	//
	//
	//reduction factor for small font
	//
	//
	//set to true to enable the special procedure used to avoid the overlappind of symbols on Thai language
	//
	//
	//if true allows to call TCPDF methods using HTML syntax
	//IMPORTANT: For security reason, disable this feature if you are printing user HTML content.
	//
	//
	//if true adn PHP version is greater than 5, then the Error() method throw new exception instead of terminating the execution.
	//
	{
		if (!(undefined !== _SERVER.DOCUMENT_ROOT) or !_SERVER.DOCUMENT_ROOT) {
			if (undefined !== _SERVER.SCRIPT_FILENAME) {
				_SERVER.DOCUMENT_ROOT = str_replace("\\", "/", _SERVER.SCRIPT_FILENAME.substr(0, 0 - _SERVER.PHP_SELF.length));
			} else if (undefined !== _SERVER.PATH_TRANSLATED) {
				_SERVER.DOCUMENT_ROOT = str_replace("\\", "/", str_replace("\\\\", "\\", _SERVER.PATH_TRANSLATED).substr(0, 0 - _SERVER.PHP_SELF.length));
			} else //define here your DOCUMENT_ROOT path if the previous fails (e.g. '/var/www')
				{
					_SERVER.DOCUMENT_ROOT = "/";
				}
		}

		_SERVER.DOCUMENT_ROOT = str_replace("//", "/", _SERVER.DOCUMENT_ROOT + "/");
		var k_path_main = str_replace("\\", "/", realpath(dirname(__filename).substr(0, 0 - "config".length)));

		if (k_path_main.substr(-1) != "/") {
			k_path_main += "/";
		}

		const K_PATH_MAIN = k_path_main;
		var k_path_url = k_path_main;

		if (undefined !== _SERVER.HTTP_HOST and !!_SERVER.HTTP_HOST) {
			if (undefined !== _SERVER.HTTPS and !!_SERVER.HTTPS and _SERVER.HTTPS.toLowerCase() != "off") {
				k_path_url = "https://";
			} else {
				k_path_url = "http://";
			}

			k_path_url += _SERVER.HTTP_HOST;
			k_path_url += str_replace("\\", "/", K_PATH_MAIN.substr(_SERVER.DOCUMENT_ROOT.length - 1));
		}

		const K_PATH_URL = k_path_url;
		const K_PATH_FONTS = K_PATH_MAIN + "fonts/";
		const K_PATH_CACHE = K_PATH_MAIN + "cache/";
		const K_PATH_URL_CACHE = K_PATH_URL + "cache/";
		const K_PATH_IMAGES = K_PATH_MAIN + "images/";
		const K_BLANK_IMAGE = K_PATH_IMAGES + "_blank.png";
		const PDF_PAGE_FORMAT = "A4";
		const PDF_PAGE_ORIENTATION = "P";
		const PDF_CREATOR = "TCPDF";
		const PDF_AUTHOR = "TCPDF";
		const PDF_HEADER_TITLE = "TCPDF Example";
		const PDF_HEADER_STRING = "by Nicola Asuni - Tecnick.com\nwww.tcpdf.org";
		const PDF_HEADER_LOGO = "tcpdf_logo.jpg";
		const PDF_HEADER_LOGO_WIDTH = 30;
		const PDF_UNIT = "mm";
		const PDF_MARGIN_HEADER = 5;
		const PDF_MARGIN_FOOTER = 10;
		const PDF_MARGIN_TOP = 27;
		const PDF_MARGIN_BOTTOM = 25;
		const PDF_MARGIN_LEFT = 15;
		const PDF_MARGIN_RIGHT = 15;
		const PDF_FONT_NAME_MAIN = "helvetica";
		const PDF_FONT_SIZE_MAIN = 10;
		const PDF_FONT_NAME_DATA = "helvetica";
		const PDF_FONT_SIZE_DATA = 8;
		const PDF_FONT_MONOSPACED = "courier";
		const PDF_IMAGE_SCALE_RATIO = 1.25;
		const HEAD_MAGNIFICATION = 1.1;
		const K_CELL_HEIGHT_RATIO = 1.25;
		const K_TITLE_MAGNIFICATION = 1.3;
		const K_SMALL_RATIO = 2 / 3;
		const K_THAI_TOPCHARS = true;
		const K_TCPDF_CALLS_IN_HTML = true;
		const K_TCPDF_THROW_EXCEPTION_ERROR = false;
	}