//============================================================+
//File name   : datamatrix.php
//Version     : 1.0.004
//Begin       : 2010-06-07
//Last Update : 2012-11-19
//Author      : Nicola Asuni - Tecnick.com LTD - Manor Coach House, Church Hill, Aldershot, Hants, GU12 4RQ, UK - www.tecnick.com - info@tecnick.com
//License     : GNU-LGPL v3 (http://www.gnu.org/copyleft/lesser.html)
//-------------------------------------------------------------------
//Copyright (C) 2010-2012  Nicola Asuni - Tecnick.com LTD
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
//DESCRIPTION :
//
//Class to create DataMatrix ECC 200 barcode arrays for TCPDF class.
//DataMatrix (ISO/IEC 16022:2006) is a 2-dimensional bar code.
//============================================================+
//
//@file
//Class to create DataMatrix ECC 200 barcode arrays for TCPDF class.
//DataMatrix (ISO/IEC 16022:2006) is a 2-dimensional bar code.
//
//@package com.tecnick.tcpdf
//@author Nicola Asuni
//@version 1.0.004
//custom definitions
//
//C40 encoding: Upper-case alphanumeric (3/2 bytes per CW)
//
//TEXT encoding: Lower-case alphanumeric (3/2 bytes per CW)
//
//X12 encoding: ANSI X12 (3/2 byte per CW)
//
//EDIFACT encoding: ASCII character 32 to 94 (4/3 bytes per CW)
//
//BASE 256 encoding: ASCII character 0 to 255 (1 byte per CW)
//
//ASCII extended encoding: ASCII character 128 to 255 (1/2 byte per CW)
//
//ASCII number encoding: ASCII digits (2 bytes per CW)
//
//@class Datamatrix
//Class to create DataMatrix ECC 200 barcode arrays for TCPDF class.
//DataMatrix (ISO/IEC 16022:2006) is a 2-dimensional bar code.
//
//@package com.tecnick.tcpdf
//@author Nicola Asuni
//@version 1.0.004
//end DataMatrix class
//============================================================+
//END OF FILE
//============================================================+

if (!("undefined" !== typeof DATAMATRIXDEFS)) //
	//Indicate that definitions for this class are set
	//
	//-----------------------------------------------------
	{
		const DATAMATRIXDEFS = true;
	}

const ENC_ASCII = 0;
const ENC_C40 = 1;
const ENC_TXT = 2;
const ENC_X12 = 3;
const ENC_EDF = 4;
const ENC_BASE256 = 5;
const ENC_ASCII_EXT = 6;
const ENC_ASCII_NUM = 7;

//
//Barcode array to be returned which is readable by TCPDF.
//@protected
//
//
//Store last used encoding for data codewords.
//@protected
//
//
//Table of Data Matrix ECC 200 Symbol Attributes:<ul>
//<li>total matrix rows (including finder pattern)</li>
//<li>total matrix cols (including finder pattern)</li>
//<li>total matrix rows (without finder pattern)</li>
//<li>total matrix cols (without finder pattern)</li>
//<li>region data rows (with finder pattern)</li>
//<li>region data col (with finder pattern)</li>
//<li>region data rows (without finder pattern)</li>
//<li>region data col (without finder pattern)</li>
//<li>horizontal regions</li>
//<li>vertical regions</li>
//<li>regions</li>
//<li>data codewords</li>
//<li>error codewords</li>
//<li>blocks</li>
//<li>data codewords per block</li>
//<li>error codewords per block</li>
//</ul>
//@protected
//
//
//Map encodation modes whit character sets.
//@protected
//
//
//Basic set of characters for each encodation mode.
//@protected
//
//-----------------------------------------------------------------------------
//
//This is the class constructor.
//Creates a datamatrix object
//@param $code (string) Code to represent using Datamatrix.
//@public
//
//
//Returns a barcode array which is readable by TCPDF
//@return array barcode array readable by TCPDF;
//@public
//
//
//Product of two numbers in a Power-of-Two Galois Field
//@param $a (int) first number to multiply.
//@param $b (int) second number to multiply.
//@param $log (array) Log table.
//@param $alog (array) Anti-Log table.
//@param $gf (array) Number of Factors of the Reed-Solomon polynomial.
//@return int product
//@protected
//
//
//Add error correction codewords to data codewords array (ANNEX E).
//@param $wd (array) Array of datacodewords.
//@param $nb (int) Number of blocks.
//@param $nd (int) Number of data codewords per block.
//@param $nc (int) Number of correction codewords per block.
//@param $gf (int) numner of fields on log/antilog table (power of 2).
//@param $pp (int) The value of its prime modulus polynomial (301 for ECC200).
//@return array data codewords + error codewords
//@protected
//
//
//Return the 253-state codeword
//@param $cwpad (int) Pad codeword.
//@param $cwpos (int) Number of data codewords from the beginning of encoded data.
//@return pad codeword
//@protected
//
//
//Return the 255-state codeword
//@param $cwpad (int) Pad codeword.
//@param $cwpos (int) Number of data codewords from the beginning of encoded data.
//@return pad codeword
//@protected
//
//
//Returns true if the char belongs to the selected mode
//@param $chr (int) Character (byte) to check.
//@param $mode (int) Current encoding mode.
//@return boolean true if the char is of the selected mode.
//@protected
//
//
//The look-ahead test scans the data to be encoded to find the best mode (Annex P - steps from J to S).
//@param $data (string) data to encode
//@param $pos (int) current position
//@param $mode (int) current encoding mode
//@return int encoding mode
//@protected
//
//
//Get the switching codeword to a new encoding mode (latch codeword)
//@param $mode (int) New encoding mode.
//@return (int) Switch codeword.
//@protected
//
//
//Choose the minimum matrix size and return the max number of data codewords.
//@param $numcw (int) Number of current codewords.
//@return number of data codewords in matrix
//@protected
//
//
//Get high level encoding using the minimum symbol data characters for ECC 200
//@param $data (string) data to encode
//@return array of codewords
//@protected
//
//
//Places "chr+bit" with appropriate wrapping within array[].
//(Annex F - ECC 200 symbol character placement)
//@param $marr (array) Array of symbols.
//@param $nrow (int) Number of rows.
//@param $ncol (int) Number of columns.
//@param $row (int) Row number.
//@param $col (int) Column number.
//@param $chr (int) Char byte.
//@param $bit (int) Bit.
//@return array
//@protected
//
//
//Places the 8 bits of a utah-shaped symbol character.
//(Annex F - ECC 200 symbol character placement)
//@param $marr (array) Array of symbols.
//@param $nrow (int) Number of rows.
//@param $ncol (int) Number of columns.
//@param $row (int) Row number.
//@param $col (int) Column number.
//@param $chr (int) Char byte.
//@return array
//@protected
//
//
//Places the 8 bits of the first special corner case.
//(Annex F - ECC 200 symbol character placement)
//@param $marr (array) Array of symbols.
//@param $nrow (int) Number of rows.
//@param $ncol (int) Number of columns.
//@param $chr (int) Char byte.
//@return array
//@protected
//
//
//Places the 8 bits of the second special corner case.
//(Annex F - ECC 200 symbol character placement)
//@param $marr (array) Array of symbols.
//@param $nrow (int) Number of rows.
//@param $ncol (int) Number of columns.
//@param $chr (int) Char byte.
//@return array
//@protected
//
//
//Places the 8 bits of the third special corner case.
//(Annex F - ECC 200 symbol character placement)
//@param $marr (array) Array of symbols.
//@param $nrow (int) Number of rows.
//@param $ncol (int) Number of columns.
//@param $chr (int) Char byte.
//@return array
//@protected
//
//
//Places the 8 bits of the fourth special corner case.
//(Annex F - ECC 200 symbol character placement)
//@param $marr (array) Array of symbols.
//@param $nrow (int) Number of rows.
//@param $ncol (int) Number of columns.
//@param $chr (int) Char byte.
//@return array
//@protected
//
//
//Build a placement map.
//(Annex F - ECC 200 symbol character placement)
//@param $nrow (int) Number of rows.
//@param $ncol (int) Number of columns.
//@return array
//@protected
//
class Datamatrix {
	constructor(code) //number of data codewords
	//check size
	//initialize empty arrays
	//get placement map
	//fill the grid with data
	//region data row max index
	//region data column max index
	//for each vertical region
	{
		this.barcode_array = Array();
		this.last_enc = ENC_ASCII;
		this.symbattr = [[10, 10, 8, 8, 10, 10, 8, 8, 1, 1, 1, 3, 5, 1, 3, 5], [12, 12, 10, 10, 12, 12, 10, 10, 1, 1, 1, 5, 7, 1, 5, 7], [14, 14, 12, 12, 14, 14, 12, 12, 1, 1, 1, 8, 10, 1, 8, 10], [16, 16, 14, 14, 16, 16, 14, 14, 1, 1, 1, 12, 12, 1, 12, 12], [18, 18, 16, 16, 18, 18, 16, 16, 1, 1, 1, 18, 14, 1, 18, 14], [20, 20, 18, 18, 20, 20, 18, 18, 1, 1, 1, 22, 18, 1, 22, 18], [22, 22, 20, 20, 22, 22, 20, 20, 1, 1, 1, 30, 20, 1, 30, 20], [24, 24, 22, 22, 24, 24, 22, 22, 1, 1, 1, 36, 24, 1, 36, 24], [26, 26, 24, 24, 26, 26, 24, 24, 1, 1, 1, 44, 28, 1, 44, 28], [32, 32, 28, 28, 16, 16, 14, 14, 2, 2, 4, 62, 36, 1, 62, 36], [36, 36, 32, 32, 18, 18, 16, 16, 2, 2, 4, 86, 42, 1, 86, 42], [40, 40, 36, 36, 20, 20, 18, 18, 2, 2, 4, 114, 48, 1, 114, 48], [44, 44, 40, 40, 22, 22, 20, 20, 2, 2, 4, 144, 56, 1, 144, 56], [48, 48, 44, 44, 24, 24, 22, 22, 2, 2, 4, 174, 68, 1, 174, 68], [52, 52, 48, 48, 26, 26, 24, 24, 2, 2, 4, 204, 84, 2, 102, 42], [64, 64, 56, 56, 16, 16, 14, 14, 4, 4, 16, 280, 112, 2, 140, 56], [72, 72, 64, 64, 18, 18, 16, 16, 4, 4, 16, 368, 144, 4, 92, 36], [80, 80, 72, 72, 20, 20, 18, 18, 4, 4, 16, 456, 192, 4, 114, 48], [88, 88, 80, 80, 22, 22, 20, 20, 4, 4, 16, 576, 224, 4, 144, 56], [96, 96, 88, 88, 24, 24, 22, 22, 4, 4, 16, 696, 272, 4, 174, 68], [104, 104, 96, 96, 26, 26, 24, 24, 4, 4, 16, 816, 336, 6, 136, 56], [120, 120, 108, 108, 20, 20, 18, 18, 6, 6, 36, 1050, 408, 6, 175, 68], [132, 132, 120, 120, 22, 22, 20, 20, 6, 6, 36, 1304, 496, 8, 163, 62], [144, 144, 132, 132, 24, 24, 22, 22, 6, 6, 36, 1558, 620, 10, 156, 62], [8, 18, 6, 16, 8, 18, 6, 16, 1, 1, 1, 5, 7, 1, 5, 7], [8, 32, 6, 28, 8, 16, 6, 14, 1, 2, 2, 10, 11, 1, 10, 11], [12, 26, 10, 24, 12, 26, 10, 24, 1, 1, 1, 16, 14, 1, 16, 14], [12, 36, 10, 32, 12, 18, 10, 16, 1, 2, 2, 12, 18, 1, 12, 18], [16, 36, 14, 32, 16, 18, 14, 16, 1, 2, 2, 32, 24, 1, 32, 24], [16, 48, 14, 44, 16, 24, 14, 22, 1, 2, 2, 49, 28, 1, 49, 28]];
		this.chset_id = {
			[ENC_C40]: "C40",
			[ENC_TXT]: "TXT",
			[ENC_X12]: "X12"
		};
		this.chset = {
			C40: {
				S1: 0,
				S2: 1,
				S3: 2,
				32: 3,
				48: 4,
				49: 5,
				50: 6,
				51: 7,
				52: 8,
				53: 9,
				54: 10,
				55: 11,
				56: 12,
				57: 13,
				65: 14,
				66: 15,
				67: 16,
				68: 17,
				69: 18,
				70: 19,
				71: 20,
				72: 21,
				73: 22,
				74: 23,
				75: 24,
				76: 25,
				77: 26,
				78: 27,
				79: 28,
				80: 29,
				81: 30,
				82: 31,
				83: 32,
				84: 33,
				85: 34,
				86: 35,
				87: 36,
				88: 37,
				89: 38,
				90: 39
			},
			TXT: {
				S1: 0,
				S2: 1,
				S3: 2,
				32: 3,
				48: 4,
				49: 5,
				50: 6,
				51: 7,
				52: 8,
				53: 9,
				54: 10,
				55: 11,
				56: 12,
				57: 13,
				97: 14,
				98: 15,
				99: 16,
				100: 17,
				101: 18,
				102: 19,
				103: 20,
				104: 21,
				105: 22,
				106: 23,
				107: 24,
				108: 25,
				109: 26,
				110: 27,
				111: 28,
				112: 29,
				113: 30,
				114: 31,
				115: 32,
				116: 33,
				117: 34,
				118: 35,
				119: 36,
				120: 37,
				121: 38,
				122: 39
			},
			SH1: {
				0: 0,
				1: 1,
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: 6,
				7: 7,
				8: 8,
				9: 9,
				10: 10,
				11: 11,
				12: 12,
				13: 13,
				14: 14,
				15: 15,
				16: 16,
				17: 17,
				18: 18,
				19: 19,
				20: 20,
				21: 21,
				22: 22,
				23: 23,
				24: 24,
				25: 25,
				26: 26,
				27: 27,
				28: 28,
				29: 29,
				30: 30,
				31: 31
			},
			SH2: {
				33: 0,
				34: 1,
				35: 2,
				36: 3,
				37: 4,
				38: 5,
				39: 6,
				40: 7,
				41: 8,
				42: 9,
				43: 10,
				44: 11,
				45: 12,
				46: 13,
				47: 14,
				58: 15,
				59: 16,
				60: 17,
				61: 18,
				62: 19,
				63: 20,
				64: 21,
				91: 22,
				92: 23,
				93: 24,
				94: 25,
				95: 26,
				F1: 27,
				US: 30
			},
			S3C: {
				96: 0,
				97: 1,
				98: 2,
				99: 3,
				100: 4,
				101: 5,
				102: 6,
				103: 7,
				104: 8,
				105: 9,
				106: 10,
				107: 11,
				108: 12,
				109: 13,
				110: 14,
				111: 15,
				112: 16,
				113: 17,
				114: 18,
				115: 19,
				116: 20,
				117: 21,
				118: 22,
				119: 23,
				120: 24,
				121: 25,
				122: 26,
				123: 27,
				124: 28,
				125: 29,
				126: 30,
				127: 31
			},
			S3T: {
				96: 0,
				65: 1,
				66: 2,
				67: 3,
				68: 4,
				69: 5,
				70: 6,
				71: 7,
				72: 8,
				73: 9,
				74: 10,
				75: 11,
				76: 12,
				77: 13,
				78: 14,
				79: 15,
				80: 16,
				81: 17,
				82: 18,
				83: 19,
				84: 20,
				85: 21,
				86: 22,
				87: 23,
				88: 24,
				89: 25,
				90: 26,
				123: 27,
				124: 28,
				125: 29,
				126: 30,
				127: 31
			},
			X12: {
				13: 0,
				42: 1,
				62: 2,
				32: 3,
				48: 4,
				49: 5,
				50: 6,
				51: 7,
				52: 8,
				53: 9,
				54: 10,
				55: 11,
				56: 12,
				57: 13,
				65: 14,
				66: 15,
				67: 16,
				68: 17,
				69: 18,
				70: 19,
				71: 20,
				72: 21,
				73: 22,
				74: 23,
				75: 24,
				76: 25,
				77: 26,
				78: 27,
				79: 28,
				80: 29,
				81: 30,
				82: 31,
				83: 32,
				84: 33,
				85: 34,
				86: 35,
				87: 36,
				88: 37,
				89: 38,
				90: 39
			}
		};
		var barcode_array = Array();

		if (is_null(code) or code == "\\0" or code == "") {
			return false;
		}

		var cw = this.getHighLevelEncoding(code);
		var nd = cw.length;

		if (nd > 1558) {
			return false;
		}

		for (var params of Object.values(this.symbattr)) {
			if (params[11] >= nd) {
				break;
			}
		}

		if (params[11] < nd) //too much data
			{
				return false;
			} else if (params[11] > nd) //add padding
			{
				if (this.last_enc == ENC_EDF) //switch to ASCII encoding
					{
						cw.push(124);
						++nd;
					} else if (this.last_enc != ENC_ASCII and this.last_enc != ENC_BASE256) //switch to ASCII encoding
					{
						cw.push(254);
						++nd;
					}

				if (params[11] > nd) //add first pad
					//add remaining pads
					{
						cw.push(129);
						++nd;

						for (var i = nd; i < params[11]; ++i) {
							cw.push(this.get253StateCodeword(129, i));
						}
					}
			}

		cw = this.getErrorCorrection(cw, params[13], params[14], params[15]);
		var grid = array_fill(0, params[2] * params[3], 0);
		var places = this.getPlacementMap(params[2], params[3]);
		grid = Array();
		i = 0;
		var rdri = params[4] - 1;
		var rdci = params[5] - 1;

		for (var vr = 0; vr < params[9]; ++vr) //for each row on region
		{
			for (var r = 0; r < params[4]; ++r) //get row
			//for each horizontal region
			{
				var row = vr * params[4] + r;

				for (var hr = 0; hr < params[8]; ++hr) //for each column on region
				{
					for (var c = 0; c < params[5]; ++c) //get column
					//braw bits by case
					{
						var col = hr * params[5] + c;

						if (r == 0) //top finder pattern
							{
								if (c % 2) {
									grid[row][col] = 0;
								} else {
									grid[row][col] = 1;
								}
							} else if (r == rdri) //bottom finder pattern
							{
								grid[row][col] = 1;
							} else if (c == 0) //left finder pattern
							{
								grid[row][col] = 1;
							} else if (c == rdci) //right finder pattern
							{
								if (r % 2) {
									grid[row][col] = 1;
								} else {
									grid[row][col] = 0;
								}
							} else //data bit
							{
								if (places[i] < 2) {
									grid[row][col] = places[i];
								} else //codeword ID
									//codeword BIT mask
									{
										var cw_id = Math.floor(places[i] / 10) - 1;
										var cw_bit = Math.pow(2, 8 - places[i] % 10);
										grid[row][col] = (cw[cw_id] & cw_bit) == 0 ? 0 : 1;
									}

								++i;
							}
					}
				}
			}
		}

		this.barcode_array.num_rows = params[0];
		this.barcode_array.num_cols = params[1];
		this.barcode_array.bcode = grid;
	}

	getBarcodeArray() {
		return this.barcode_array;
	}

	getGFProduct(a, b, log, alog, gf) {
		if (a == 0 or b == 0) {
			return 0;
		}

		return alog[(log[a] + log[b]) % (gf - 1)];
	}

	getErrorCorrection(wd, nb, nd, nc, gf = 256, pp = 301) //generate the log ($log) and antilog ($alog) tables
	//generate the polynomial coefficients (c)
	//total number of data codewords
	//total number of error codewords
	//for each block
	//reorder codewords
	{
		log[0] = 0;
		alog[0] = 1;

		for (var i = 1; i < gf; ++i) {
			alog[i] = alog[i - 1] * 2;

			if (alog[i] >= gf) {
				alog[i] ^= pp;
			}

			log[alog[i]] = i;
		}

		ksort(log);
		var c = array_fill(0, nc + 1, 0);
		c[0] = 1;

		for (i = 1;; i <= nc; ++i) {
			c[i] = c[i - 1];

			for (var j = i - 1; j >= 1; --j) {
				c[j] = c[j - 1] ^ this.getGFProduct(c[j], alog[i], log, alog, gf);
			}

			c[0] = this.getGFProduct(c[0], alog[i], log, alog, gf);
		}

		ksort(c);
		var num_wd = nb * nd;
		var num_we = nb * nc;

		for (var b = 0; b < nb; ++b) //create interleaved data block
		//initialize error codewords
		//calculate error correction codewords for this block
		//add error codewords at the end of data codewords
		{
			var block = Array();

			for (var n = b; n < num_wd; n += nb) {
				block.push(wd[n]);
			}

			var we = array_fill(0, nc + 1, 0);

			for (i = 0;; i < nd; ++i) {
				var k = we[0] ^ block[i];

				for (j = 0;; j < nc; ++j) {
					we[j] = we[j + 1] ^ this.getGFProduct(k, c[nc - j - 1], log, alog, gf);
				}
			}

			j = 0;

			for (i = b;; i < num_we; i += nb) {
				wd[num_wd + i] = we[j];
				++j;
			}
		}

		ksort(wd);
		return wd;
	}

	get253StateCodeword(cwpad, cwpos) {
		var pad = cwpad + (149 * cwpos % 253 + 1);

		if (pad > 254) {
			pad -= 254;
		}

		return pad;
	}

	get255StateCodeword(cwpad, cwpos) {
		var pad = cwpad + (149 * cwpos % 255 + 1);

		if (pad > 255) {
			pad -= 256;
		}

		return pad;
	}

	isCharMode(chr, mode) {
		var status = false;

		switch (mode) {
			case ENC_ASCII:
				//ASCII character 0 to 127
				{
					status = chr >= 0 and chr <= 127;
					break;
				}

			case ENC_C40:
				//Upper-case alphanumeric
				{
					status = chr == 32 or (chr >= 48 and chr <= 57) or (chr >= 65 and chr <= 90);
					break;
				}

			case ENC_TXT:
				//Lower-case alphanumeric
				{
					status = chr == 32 or (chr >= 48 and chr <= 57) or (chr >= 97 and chr <= 122);
					break;
				}

			case ENC_X12:
				//ANSI X12
				{
					status = chr == 13 or chr == 42 or chr == 62;
					break;
				}

			case ENC_EDF:
				//ASCII character 32 to 94
				{
					status = chr >= 32 and chr <= 94;
					break;
				}

			case ENC_BASE256:
				//Function character (FNC1, Structured Append, Reader Program, or Code Page)
				{
					status = chr == 232 or chr == 233 or chr == 234 or chr == 241;
					break;
				}

			case ENC_ASCII_EXT:
				//ASCII character 128 to 255
				{
					status = chr >= 128 and chr <= 255;
					break;
				}

			case ENC_ASCII_NUM:
				//ASCII digits
				{
					status = chr >= 48 and chr <= 57;
					break;
				}
		}

		return status;
	}

	lookAheadTest(data, pos, mode) //count processed chars
	//STEP J
	//end of while
	{
		var data_length = data.length;

		if (pos >= data_length) {
			return mode;
		}

		var charscount = 0;

		if (mode == ENC_ASCII) {
			var numch = [0, 1, 1, 1, 1, 1.25];
		} else {
			numch = [1, 2, 2, 2, 2, 2.25];
			numch[mode] = 0;
		}

		while (true) //STEP K
		//STEP L
		//STEP M
		//STEP N
		//STEP O
		//STEP P
		//STEP Q
		//STEP R
		{
			if (pos + charscount == data_length) {
				if (numch[ENC_ASCII] <= Math.ceil(Math.min(numch[ENC_C40], numch[ENC_TXT], numch[ENC_X12], numch[ENC_EDF], numch[ENC_BASE256]))) {
					return ENC_ASCII;
				}

				if (numch[ENC_BASE256] < Math.ceil(Math.min(numch[ENC_ASCII], numch[ENC_C40], numch[ENC_TXT], numch[ENC_X12], numch[ENC_EDF]))) {
					return ENC_BASE256;
				}

				if (numch[ENC_EDF] < Math.ceil(Math.min(numch[ENC_ASCII], numch[ENC_C40], numch[ENC_TXT], numch[ENC_X12], numch[ENC_BASE256]))) {
					return ENC_EDF;
				}

				if (numch[ENC_TXT] < Math.ceil(Math.min(numch[ENC_ASCII], numch[ENC_C40], numch[ENC_X12], numch[ENC_EDF], numch[ENC_BASE256]))) {
					return ENC_TXT;
				}

				if (numch[ENC_X12] < Math.ceil(Math.min(numch[ENC_ASCII], numch[ENC_C40], numch[ENC_TXT], numch[ENC_EDF], numch[ENC_BASE256]))) {
					return ENC_X12;
				}

				return ENC_C40;
			}

			var chr = data.charCodeAt(pos + charscount);
			charscount++;

			if (this.isCharMode(chr, ENC_ASCII_NUM)) {
				numch[ENC_ASCII] += 1 / 2;
			} else if (this.isCharMode(chr, ENC_ASCII_EXT)) {
				numch[ENC_ASCII] = Math.ceil(numch[ENC_ASCII]);
				numch[ENC_ASCII] += 2;
			} else {
				numch[ENC_ASCII] = Math.ceil(numch[ENC_ASCII]);
				numch[ENC_ASCII] += 1;
			}

			if (this.isCharMode(chr, ENC_C40)) {
				numch[ENC_C40] += 2 / 3;
			} else if (this.isCharMode(chr, ENC_ASCII_EXT)) {
				numch[ENC_C40] += 8 / 3;
			} else {
				numch[ENC_C40] += 4 / 3;
			}

			if (this.isCharMode(chr, ENC_TXT)) {
				numch[ENC_TXT] += 2 / 3;
			} else if (this.isCharMode(chr, ENC_ASCII_EXT)) {
				numch[ENC_TXT] += 8 / 3;
			} else {
				numch[ENC_TXT] += 4 / 3;
			}

			if (this.isCharMode(chr, ENC_X12) or this.isCharMode(chr, ENC_C40)) {
				numch[ENC_X12] += 2 / 3;
			} else if (this.isCharMode(chr, ENC_ASCII_EXT)) {
				numch[ENC_X12] += 13 / 3;
			} else {
				numch[ENC_X12] += 10 / 3;
			}

			if (this.isCharMode(chr, ENC_EDF)) {
				numch[ENC_EDF] += 3 / 4;
			} else if (this.isCharMode(chr, ENC_ASCII_EXT)) {
				numch[ENC_EDF] += 17 / 4;
			} else {
				numch[ENC_EDF] += 13 / 4;
			}

			if (this.isCharMode(chr, ENC_BASE256)) {
				numch[ENC_BASE256] += 4;
			} else {
				numch[ENC_BASE256] += 1;
			}

			if (charscount >= 4) {
				if (numch[ENC_ASCII] + 1 <= Math.min(numch[ENC_C40], numch[ENC_TXT], numch[ENC_X12], numch[ENC_EDF], numch[ENC_BASE256])) {
					return ENC_ASCII;
				}

				if (numch[ENC_BASE256] + 1 <= numch[ENC_ASCII] or numch[ENC_BASE256] + 1 < Math.min(numch[ENC_C40], numch[ENC_TXT], numch[ENC_X12], numch[ENC_EDF])) {
					return ENC_BASE256;
				}

				if (numch[ENC_EDF] + 1 < Math.min(numch[ENC_ASCII], numch[ENC_C40], numch[ENC_TXT], numch[ENC_X12], numch[ENC_BASE256])) {
					return ENC_EDF;
				}

				if (numch[ENC_TXT] + 1 < Math.min(numch[ENC_ASCII], numch[ENC_C40], numch[ENC_X12], numch[ENC_EDF], numch[ENC_BASE256])) {
					return ENC_TXT;
				}

				if (numch[ENC_X12] + 1 < Math.min(numch[ENC_ASCII], numch[ENC_C40], numch[ENC_TXT], numch[ENC_EDF], numch[ENC_BASE256])) {
					return ENC_X12;
				}

				if (numch[ENC_C40] + 1 < Math.min(numch[ENC_ASCII], numch[ENC_TXT], numch[ENC_EDF], numch[ENC_BASE256])) {
					if (numch[ENC_C40] < numch[ENC_X12]) {
						return ENC_C40;
					}

					if (numch[ENC_C40] == numch[ENC_X12]) {
						var k = pos + charscount + 1;

						while (k < data_length) {
							var tmpchr = data.charCodeAt(k);

							if (this.isCharMode(tmpchr, ENC_X12)) {
								return ENC_X12;
							} else if (!(this.isCharMode(tmpchr, ENC_X12) or this.isCharMode(tmpchr, ENC_C40))) {
								break;
							}

							++k;
						}

						return ENC_C40;
					}
				}
			}
		}
	}

	getSwitchEncodingCodeword(mode) {
		switch (mode) {
			case ENC_ASCII:
				//ASCII character 0 to 127
				{
					var cw = 254;
					break;
				}

			case ENC_C40:
				//Upper-case alphanumeric
				{
					cw = 230;
					break;
				}

			case ENC_TXT:
				//Lower-case alphanumeric
				{
					cw = 239;
					break;
				}

			case ENC_X12:
				//ANSI X12
				{
					cw = 238;
					break;
				}

			case ENC_EDF:
				//ASCII character 32 to 94
				{
					cw = 240;
					break;
				}

			case ENC_BASE256:
				//Function character (FNC1, Structured Append, Reader Program, or Code Page)
				{
					cw = 231;
					break;
				}
		}

		return cw;
	}

	getMaxDataCodewords(numcw) {
		{
			let _tmp_0 = this.symbattr;

			for (var key in _tmp_0) {
				var matrix = _tmp_0[key];

				if (matrix[11] >= numcw) {
					return matrix[11];
				}
			}
		}
		return 0;
	}

	getHighLevelEncoding(data) //STEP A. Start in ASCII encodation.
	//current encoding mode
	//current position
	//array of codewords to be returned
	//number of data codewords
	//number of chars
	//end of while
	//set last used encoding
	{
		var enc = ENC_ASCII;
		var pos = 0;
		var cw = Array();
		var cw_num = 0;
		var data_lenght = data.length;

		while (pos < data_lenght) {
			switch (enc) {
				case ENC_ASCII:
					//STEP B. While in ASCII encodation
					{
						if (data_lenght > 1 and pos < data_lenght - 1 and (this.isCharMode(data.charCodeAt(pos), ENC_ASCII_NUM) and this.isCharMode(data.charCodeAt(pos + 1), ENC_ASCII_NUM))) //1. If the next data sequence is at least 2 consecutive digits, encode the next two digits as a double digit in ASCII mode.
							{
								cw.push(Math.round(data.substr(pos, 2)) + 130);
								++cw_num;
								pos += 2;
							} else //2. If the look-ahead test (starting at step J) indicates another mode, switch to that mode.
							{
								var newenc = this.lookAheadTest(data, pos, enc);

								if (newenc != enc) //switch to new encoding
									{
										enc = newenc;
										cw.push(this.getSwitchEncodingCodeword(enc));
										++cw_num;
									} else //get new byte
									{
										var chr = data.charCodeAt(pos);
										++pos;

										if (this.isCharMode(chr, ENC_ASCII_EXT)) //3. If the next data character is extended ASCII (greater than 127) encode it in ASCII mode first using the Upper Shift (value 235) character.
											{
												cw.push(235);
												cw.push(chr - 127);
												cw_num += 2;
											} else //4. Otherwise process the next data character in ASCII encodation.
											{
												cw.push(chr + 1);
												++cw_num;
											}
									}
							}

						break;
					}

				case ENC_C40:
				case ENC_TXT:
				case ENC_X12:
					//ANSI X12
					//get charset ID
					//get basic charset for current encoding
					{
						var temp_cw = Array();
						var p = 0;
						var epos = pos;
						var set_id = this.chset_id[enc];
						var charset = this.chset[set_id];

						do //2. process the next character in C40 encodation.
						//check for extended character
						{
							chr = data.charCodeAt(epos);
							++epos;

							if (chr & 128) //shift 2
								//upper shift
								{
									if (enc == ENC_X12) {
										return false;
									}

									chr = chr & 127;
									temp_cw.push(1);
									temp_cw.push(30);
									p += 2;
								}

							if (undefined !== charset[chr]) {
								temp_cw.push(charset[chr]);
								++p;
							} else {
								if (undefined !== this.chset.SH1[chr]) //shift 1
									{
										temp_cw.push(0);
										var shiftset = this.chset.SH1;
									} else if (undefined !== chr && undefined !== this.chset.SH2[chr]) //shift 2
									{
										temp_cw.push(1);
										shiftset = this.chset.SH2;
									} else if (enc == ENC_C40 and undefined !== this.chset.S3C[chr]) //shift 3
									{
										temp_cw.push(2);
										shiftset = this.chset.S3C;
									} else if (enc == ENC_TXT and undefined !== this.chset.S3T[chr]) //shift 3
									{
										temp_cw.push(2);
										shiftset = this.chset.S3T;
									} else {
									return false;
								}

								temp_cw.push(shiftset[chr]);
								p += 2;
							}

							if (p >= 3) //1. If the C40 encoding is at the point of starting a new double symbol character and if the look-ahead test (starting at step J) indicates another mode, switch to that mode.
								{
									var c1 = temp_cw.shift();
									var c2 = temp_cw.shift();
									var c3 = temp_cw.shift();
									p -= 3;
									var tmp = 1600 * c1 + 40 * c2 + c3 + 1;
									cw.push(tmp >> 8);
									cw.push(tmp % 256);
									cw_num += 2;
									pos = epos;
									newenc = this.lookAheadTest(data, pos, enc);

									if (newenc != enc) {
										enc = newenc;
										cw.push(this.getSwitchEncodingCodeword(enc));
										++cw_num;
										pos -= p;
										p = 0;
										break;
									}
								}
						} while (p > 0 and epos < data_lenght);

						if (p > 0) //get remaining number of data symbols
							{
								var cwr = this.getMaxDataCodewords(cw_num + 2) - cw_num;

								if (cwr == 1 and p == 1) //d. If one symbol character remains and one C40 value (data character) remains to be encoded
									{
										c1 = temp_cw.shift();
										--p;
										cw.push(c1 + 1);
										++cw_num;
									} else if (cwr == 2 and p == 1) //c. If two symbol characters remain and only one C40 value (data character) remains to be encoded
									{
										c1 = temp_cw.shift();
										--p;
										cw.push(254);
										cw.push(c1 + 1);
										cw_num += 2;
									} else if (cwr == 2 and p == 2) //b. If two symbol characters remain and two C40 values remain to be encoded
									{
										c1 = temp_cw.shift();
										c2 = temp_cw.shift();
										p -= 2;
										tmp = 1600 * c1 + 40 * c2 + 1;
										cw.push(tmp >> 8);
										cw.push(tmp % 256);
										cw_num += 2;
									} else //switch to ASCII encoding
									{
										if (enc != ENC_ASCII) {
											enc = ENC_ASCII;
											cw.push(this.getSwitchEncodingCodeword(enc));
											++cw_num;
										}
									}
							}

						break;
					}

				case ENC_EDF:
					//F. While in EDIFACT (EDF) encodation
					//initialize temporary array with 0 lenght
					{
						temp_cw = Array();
						epos = pos;
						var field_lenght = 0;
						newenc = enc;

						do //2. process the next character in EDIFACT encodation.
						{
							chr = data.charCodeAt(epos);

							if (this.isCharMode(chr, ENC_EDF)) {
								++epos;
								temp_cw.push(chr);
								++field_lenght;
							}

							if (field_lenght == 4 or epos == data_lenght or !this.isCharMode(chr, ENC_EDF)) {
								if (field_lenght < 4) //set unlatch character
									//fill empty characters
									{
										echo(field_lenght + "\n");
										temp_cw.push(31);
										++field_lenght;

										for (var i = field_lenght; i < 4; ++i) {
											temp_cw.push(0);
										}

										enc = ENC_ASCII;
									}

								var tcw = ((temp_cw[0] & 63) << 2) + ((temp_cw[1] & 48) >> 4);

								if (tcw > 0) {
									cw.push(tcw);
									cw_num++;
								}

								tcw = ((temp_cw[1] & 15) << 4) + ((temp_cw[2] & 60) >> 2);

								if (tcw > 0) {
									cw.push(tcw);
									cw_num++;
								}

								tcw = ((temp_cw[2] & 3) << 6) + (temp_cw[3] & 63);

								if (tcw > 0) {
									cw.push(tcw);
									cw_num++;
								}

								temp_cw = Array();
								pos = epos;
								field_lenght = 0;

								if (enc == ENC_ASCII) //exit from EDIFACT mode
									{
										break;
									}
							}
						} while (epos < data_lenght);

						break;
					}

				case ENC_BASE256:
					//G. While in Base 256 (B256) encodation
					//initialize temporary array with 0 lenght
					//set field lenght
					{
						temp_cw = Array();
						field_lenght = 0;

						while (pos < data_lenght and field_lenght <= 1555) {
							newenc = this.lookAheadTest(data, pos, enc);

							if (newenc != enc) //1. If the look-ahead test (starting at step J) indicates another mode, switch to that mode.
								//exit from B256 mode
								{
									enc = newenc;
									cw.push(this.getSwitchEncodingCodeword(enc));
									++cw_num;
									break;
								} else //2. Otherwise, process the next character in Base 256 encodation.
								{
									chr = data.charCodeAt(pos);
									++pos;
									temp_cw.push(chr);
									++field_lenght;
								}
						}

						if (field_lenght <= 249) {
							cw.push(field_lenght);
							++cw_num;
						} else {
							cw.push(Math.floor(field_lenght / 250) + 249);
							cw.push(field_lenght % 250);
							cw_num += 2;
						}

						if (!!temp_cw) //add B256 field
							{
								for (var p in temp_cw) {
									var cht = temp_cw[p];
									cw.push(this.get255StateCodeword(chr, cw_num + p));
								}
							}

						break;
					}
			}
		}

		this.last_enc = enc;
		return cw;
	}

	placeModule(marr, nrow, ncol, row, col, chr, bit) {
		if (row < 0) {
			row += nrow;
			col += 4 - (nrow + 4) % 8;
		}

		if (col < 0) {
			col += ncol;
			row += 4 - (ncol + 4) % 8;
		}

		marr[row * ncol + col] = 10 * chr + bit;
		return marr;
	}

	placeUtah(marr, nrow, ncol, row, col, chr) {
		marr = this.placeModule(marr, nrow, ncol, row - 2, col - 2, chr, 1);
		marr = this.placeModule(marr, nrow, ncol, row - 2, col - 1, chr, 2);
		marr = this.placeModule(marr, nrow, ncol, row - 1, col - 2, chr, 3);
		marr = this.placeModule(marr, nrow, ncol, row - 1, col - 1, chr, 4);
		marr = this.placeModule(marr, nrow, ncol, row - 1, col, chr, 5);
		marr = this.placeModule(marr, nrow, ncol, row, col - 2, chr, 6);
		marr = this.placeModule(marr, nrow, ncol, row, col - 1, chr, 7);
		marr = this.placeModule(marr, nrow, ncol, row, col, chr, 8);
		return marr;
	}

	placeCornerA(marr, nrow, ncol, chr) {
		marr = this.placeModule(marr, nrow, ncol, nrow - 1, 0, chr, 1);
		marr = this.placeModule(marr, nrow, ncol, nrow - 1, 1, chr, 2);
		marr = this.placeModule(marr, nrow, ncol, nrow - 1, 2, chr, 3);
		marr = this.placeModule(marr, nrow, ncol, 0, ncol - 2, chr, 4);
		marr = this.placeModule(marr, nrow, ncol, 0, ncol - 1, chr, 5);
		marr = this.placeModule(marr, nrow, ncol, 1, ncol - 1, chr, 6);
		marr = this.placeModule(marr, nrow, ncol, 2, ncol - 1, chr, 7);
		marr = this.placeModule(marr, nrow, ncol, 3, ncol - 1, chr, 8);
		return marr;
	}

	placeCornerB(marr, nrow, ncol, chr) {
		marr = this.placeModule(marr, nrow, ncol, nrow - 3, 0, chr, 1);
		marr = this.placeModule(marr, nrow, ncol, nrow - 2, 0, chr, 2);
		marr = this.placeModule(marr, nrow, ncol, nrow - 1, 0, chr, 3);
		marr = this.placeModule(marr, nrow, ncol, 0, ncol - 4, chr, 4);
		marr = this.placeModule(marr, nrow, ncol, 0, ncol - 3, chr, 5);
		marr = this.placeModule(marr, nrow, ncol, 0, ncol - 2, chr, 6);
		marr = this.placeModule(marr, nrow, ncol, 0, ncol - 1, chr, 7);
		marr = this.placeModule(marr, nrow, ncol, 1, ncol - 1, chr, 8);
		return marr;
	}

	placeCornerC(marr, nrow, ncol, chr) {
		marr = this.placeModule(marr, nrow, ncol, nrow - 3, 0, chr, 1);
		marr = this.placeModule(marr, nrow, ncol, nrow - 2, 0, chr, 2);
		marr = this.placeModule(marr, nrow, ncol, nrow - 1, 0, chr, 3);
		marr = this.placeModule(marr, nrow, ncol, 0, ncol - 2, chr, 4);
		marr = this.placeModule(marr, nrow, ncol, 0, ncol - 1, chr, 5);
		marr = this.placeModule(marr, nrow, ncol, 1, ncol - 1, chr, 6);
		marr = this.placeModule(marr, nrow, ncol, 2, ncol - 1, chr, 7);
		marr = this.placeModule(marr, nrow, ncol, 3, ncol - 1, chr, 8);
		return marr;
	}

	placeCornerD(marr, nrow, ncol, chr) {
		marr = this.placeModule(marr, nrow, ncol, nrow - 1, 0, chr, 1);
		marr = this.placeModule(marr, nrow, ncol, nrow - 1, ncol - 1, chr, 2);
		marr = this.placeModule(marr, nrow, ncol, 0, ncol - 3, chr, 3);
		marr = this.placeModule(marr, nrow, ncol, 0, ncol - 2, chr, 4);
		marr = this.placeModule(marr, nrow, ncol, 0, ncol - 1, chr, 5);
		marr = this.placeModule(marr, nrow, ncol, 1, ncol - 3, chr, 6);
		marr = this.placeModule(marr, nrow, ncol, 1, ncol - 2, chr, 7);
		marr = this.placeModule(marr, nrow, ncol, 1, ncol - 1, chr, 8);
		return marr;
	}

	getPlacementMap(nrow, ncol) //initialize array with zeros
	//set starting values
	{
		var marr = array_fill(0, nrow * ncol, 0);
		var chr = 1;
		var row = 4;
		var col = 0;

		do //repeatedly first check for one of the special corner cases, then
		//& then sweep downward diagonally, inserting successive characters,...
		//... until the entire array is scanned
		{
			if (row == nrow and col == 0) {
				marr = this.placeCornerA(marr, nrow, ncol, chr);
				++chr;
			}

			if (row == nrow - 2 and col == 0 and ncol % 4) {
				marr = this.placeCornerB(marr, nrow, ncol, chr);
				++chr;
			}

			if (row == nrow - 2 and col == 0 and ncol % 8 == 4) {
				marr = this.placeCornerC(marr, nrow, ncol, chr);
				++chr;
			}

			if (row == nrow + 4 and col == 2 and !(ncol % 8)) {
				marr = this.placeCornerD(marr, nrow, ncol, chr);
				++chr;
			}

			do {
				if (row < nrow and col >= 0 and !marr[row * ncol + col]) {
					marr = this.placeUtah(marr, nrow, ncol, row, col, chr);
					++chr;
				}

				row -= 2;
				col += 2;
			} while (row >= 0 and col < ncol);

			++row;
			col += 3;

			do {
				if (row >= 0 and col < ncol and !marr[row * ncol + col]) {
					marr = this.placeUtah(marr, nrow, ncol, row, col, chr);
					++chr;
				}

				row += 2;
				col -= 2;
			} while (row < nrow and col >= 0);

			row += 3;
			++col;
		} while (row < nrow or col < ncol);

		if (!marr[nrow * ncol - 1]) {
			marr[nrow * ncol - 1] = 1;
			marr[nrow * ncol - ncol - 2] = 1;
		}

		return marr;
	}

};