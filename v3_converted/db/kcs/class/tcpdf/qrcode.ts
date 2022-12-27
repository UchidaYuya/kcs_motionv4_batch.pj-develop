//============================================================+
//File name   : qrcode.php
//Version     : 1.0.010
//Begin       : 2010-03-22
//Last Update : 2012-07-25
//Author      : Nicola Asuni - Tecnick.com LTD - Manor Coach House, Church Hill, Aldershot, Hants, GU12 4RQ, UK - www.tecnick.com - info@tecnick.com
//License     : GNU-LGPL v3 (http://www.gnu.org/copyleft/lesser.html)
//-------------------------------------------------------------------
//Copyright (C) 2010-2012 Nicola Asuni - Tecnick.com LTD
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
//Class to create QR-code arrays for TCPDF class.
//QR Code symbol is a 2D barcode that can be scanned by
//handy terminals such as a mobile phone with CCD.
//The capacity of QR Code is up to 7000 digits or 4000
//characters, and has high robustness.
//This class supports QR Code model 2, described in
//JIS (Japanese Industrial Standards) X0510:2004
//or ISO/IEC 18004.
//Currently the following features are not supported:
//ECI and FNC1 mode, Micro QR Code, QR Code model 1,
//Structured mode.
//
//This class is derived from the following projects:
//---------------------------------------------------------
//"PHP QR Code encoder"
//License: GNU-LGPLv3
//Copyright (C) 2010 by Dominik Dzienia <deltalab at poczta dot fm>
//http://phpqrcode.sourceforge.net/
//https://sourceforge.net/projects/phpqrcode/
//
//The "PHP QR Code encoder" is based on
//"C libqrencode library" (ver. 3.1.1)
//License: GNU-LGPL 2.1
//Copyright (C) 2006-2010 by Kentaro Fukuchi
//http://megaui.net/fukuchi/works/qrencode/index.en.html
//
//Reed-Solomon code encoder is written by Phil Karn, KA9Q.
//Copyright (C) 2002-2006 Phil Karn, KA9Q
//
//QR Code is registered trademark of DENSO WAVE INCORPORATED
//http://www.denso-wave.com/qrcode/index-e.html
//---------------------------------------------------------
//============================================================+
//
//@file
//Class to create QR-code arrays for TCPDF class.
//QR Code symbol is a 2D barcode that can be scanned by handy terminals such as a mobile phone with CCD.
//The capacity of QR Code is up to 7000 digits or 4000 characters, and has high robustness.
//This class supports QR Code model 2, described in JIS (Japanese Industrial Standards) X0510:2004 or ISO/IEC 18004.
//Currently the following features are not supported: ECI and FNC1 mode, Micro QR Code, QR Code model 1, Structured mode.
//
//This class is derived from "PHP QR Code encoder" by Dominik Dzienia (http://phpqrcode.sourceforge.net/) based on "libqrencode C library 3.1.1." by Kentaro Fukuchi (http://megaui.net/fukuchi/works/qrencode/index.en.html), contains Reed-Solomon code written by Phil Karn, KA9Q. QR Code is registered trademark of DENSO WAVE INCORPORATED (http://www.denso-wave.com/qrcode/index-e.html).
//Please read comments on this class source file for full copyright and license information.
//
//@package com.tecnick.tcpdf
//@author Nicola Asuni
//@version 1.0.010
//
//definitions
//end QRcode class
//============================================================+
//END OF FILE
//============================================================+

if (!("undefined" !== typeof QRCODEDEFS)) //
	//Indicate that definitions for this class are set
	//
	//-----------------------------------------------------
	//Encoding modes (characters which can be encoded in QRcode)
	//
	//Encoding mode
	//
	//
	//Encoding mode numeric (0-9). 3 characters are encoded to 10bit length. In theory, 7089 characters or less can be stored in a QRcode.
	//
	//
	//Encoding mode alphanumeric (0-9A-Z $%*+-./:) 45characters. 2 characters are encoded to 11bit length. In theory, 4296 characters or less can be stored in a QRcode.
	//
	//
	//Encoding mode 8bit byte data. In theory, 2953 characters or less can be stored in a QRcode.
	//
	//
	//Encoding mode KANJI. A KANJI character (multibyte character) is encoded to 13bit length. In theory, 1817 characters or less can be stored in a QRcode.
	//
	//
	//Encoding mode STRUCTURED (currently unsupported)
	//
	//-----------------------------------------------------
	//Levels of error correction.
	//QRcode has a function of an error correcting for miss reading that white is black.
	//Error correcting is defined in 4 level as below.
	//
	//Error correction level L : About 7% or less errors can be corrected.
	//
	//
	//Error correction level M : About 15% or less errors can be corrected.
	//
	//
	//Error correction level Q : About 25% or less errors can be corrected.
	//
	//
	//Error correction level H : About 30% or less errors can be corrected.
	//
	//-----------------------------------------------------
	//Version. Size of QRcode is defined as version.
	//Version is from 1 to 40.
	//Version 1 is 21*21 matrix. And 4 modules increases whenever 1 version increases.
	//So version 40 is 177*177 matrix.
	//
	//Maximum QR Code version.
	//
	//
	//Maximum matrix size for maximum version (version 40 is 177*177 matrix).
	//
	//-----------------------------------------------------
	//
	//Matrix index to get width from $capacity array.
	//
	//
	//Matrix index to get number of words from $capacity array.
	//
	//
	//Matrix index to get remainder from $capacity array.
	//
	//
	//Matrix index to get error correction level from $capacity array.
	//
	//-----------------------------------------------------
	//Structure (currently usupported)
	//
	//Number of header bits for structured mode
	//
	//
	//Max number of symbols for structured mode
	//
	//-----------------------------------------------------
	//Masks
	//
	//Down point base value for case 1 mask pattern (concatenation of same color in a line or a column)
	//
	//
	//Down point base value for case 2 mask pattern (module block of same color)
	//
	//
	//Down point base value for case 3 mask pattern (1:1:3:1:1(dark:bright:dark:bright:dark)pattern in a line or a column)
	//
	//
	//Down point base value for case 4 mask pattern (ration of dark modules in whole)
	//
	//-----------------------------------------------------
	//Optimization settings
	//
	//if true, estimates best mask (spec. default, but extremally slow; set to false to significant performance boost but (propably) worst quality code
	//
	//
	//if false, checks all masks available, otherwise value tells count of masks need to be checked, mask id are got randomly
	//
	//
	//when QR_FIND_BEST_MASK === false
	//
	//-----------------------------------------------------
	{
		const QRCODEDEFS = true;
		const QR_MODE_NL = -1;
		const QR_MODE_NM = 0;
		const QR_MODE_AN = 1;
		const QR_MODE_8B = 2;
		const QR_MODE_KJ = 3;
		const QR_MODE_ST = 4;
		const QR_ECLEVEL_L = 0;
		const QR_ECLEVEL_M = 1;
		const QR_ECLEVEL_Q = 2;
		const QR_ECLEVEL_H = 3;
		const QRSPEC_VERSION_MAX = 40;
		const QRSPEC_WIDTH_MAX = 177;
		const QRCAP_WIDTH = 0;
		const QRCAP_WORDS = 1;
		const QRCAP_REMINDER = 2;
		const QRCAP_EC = 3;
		const STRUCTURE_HEADER_BITS = 20;
		const MAX_STRUCTURED_SYMBOLS = 16;
		const N1 = 3;
		const N2 = 3;
		const N3 = 40;
		const N4 = 10;
		const QR_FIND_BEST_MASK = true;
		const QR_FIND_FROM_RANDOM = 2;
		const QR_DEFAULT_MASK = 2;
	}

if (!("function" === typeof str_split)) //
	//Convert a string to an array (needed for PHP4 compatibility)
	//@param $string (string) The input string.
	//@param $split_length (int) Maximum length of the chunk.
	//@return  If the optional split_length  parameter is specified, the returned array will be broken down into chunks with each being split_length  in length, otherwise each chunk will be one character in length. FALSE is returned if split_length is less than 1. If the split_length length exceeds the length of string , the entire string is returned as the first (and only) array element.
	//
	{
		function str_split(string, split_length = 1) {
			if (string.length > split_length or !split_length) {
				do {
					var c = string.length;
					parts.push(string.substr(0, split_length));
					string = string.substr(split_length);
				} while (string !== false);
			} else {
				var parts = [string];
			}

			return parts;
		};
	}

//
//Barcode array to be returned which is readable by TCPDF.
//@protected
//
//
//QR code version. Size of QRcode is defined as version. Version is from 1 to 40. Version 1 is 21*21 matrix. And 4 modules increases whenever 1 version increases. So version 40 is 177*177 matrix.
//@protected
//
//
//Levels of error correction. See definitions for possible values.
//@protected
//
//
//Encoding mode.
//@protected
//
//
//Boolean flag, if true the input string will be converted to uppercase.
//@protected
//
//
//Structured QR code (not supported yet).
//@protected
//
//
//Mask data.
//@protected
//
//FrameFiller
//
//Width.
//@protected
//
//
//Frame.
//@protected
//
//
//X position of bit.
//@protected
//
//
//Y position of bit.
//@protected
//
//
//Direction.
//@protected
//
//
//Single bit value.
//@protected
//
//---- QRrawcode ----
//
//Data code.
//@protected
//
//
//Error correction code.
//@protected
//
//
//Blocks.
//@protected
//
//
//Reed-Solomon blocks.
//@protected
//
//of RSblock
//
//Counter.
//@protected
//
//
//Data length.
//@protected
//
//
//Error correction length.
//@protected
//
//
//Value b1.
//@protected
//
//---- QRmask ----
//
//Run length.
//@protected
//
//---- QRsplit ----
//
//Input data string.
//@protected
//
//
//Input items.
//@protected
//
//Reed-Solomon items
//
//Reed-Solomon items.
//@protected
//
//
//Array of frames.
//@protected
//
//
//Alphabet-numeric convesion table.
//@protected
//
//
//Array Table of the capacity of symbols.
//See Table 1 (pp.13) and Table 12-16 (pp.30-36), JIS X0510:2004.
//@protected
//
//
//Array Length indicator.
//@protected
//
//
//Array Table of the error correction code (Reed-Solomon block).
//See Table 12-16 (pp.30-36), JIS X0510:2004.
//@protected
//
//
//Array Positions of alignment patterns.
//This array includes only the second and the third position of the alignment patterns. Rest of them can be calculated from the distance between them.
//See Table 1 in Appendix E (pp.71) of JIS X0510:2004.
//@protected
//
//
//Array Version information pattern (BCH coded).
//See Table 1 in Appendix D (pp.68) of JIS X0510:2004.
//size: [QRSPEC_VERSION_MAX - 6]
//@protected
//
//
//Array Format information
//@protected
//
//-------------------------------------------------
//-------------------------------------------------
//
//This is the class constructor.
//Creates a QRcode object
//@param $code (string) code to represent using QRcode
//@param $eclevel (string) error level: <ul><li>L : About 7% or less errors can be corrected.</li><li>M : About 15% or less errors can be corrected.</li><li>Q : About 25% or less errors can be corrected.</li><li>H : About 30% or less errors can be corrected.</li></ul>
//@public
//@since 1.0.000
//
//
//Returns a barcode array which is readable by TCPDF
//@return array barcode array readable by TCPDF;
//@public
//
//
//Convert the frame in binary form
//@param $frame (array) array to binarize
//@return array frame in binary form
//
//
//Encode the input string to QR code
//@param $string (string) input string to encode
//
//
//Encode mask
//@param $mask (int) masking mode
//
//- - - - - - - - - - - - - - - - - - - - - - - - -
//FrameFiller
//
//Set frame value at specified position
//@param $at (array) x,y position
//@param $val (int) value of the character to set
//
//
//Get frame value at specified position
//@param $at (array) x,y position
//@return value at specified position
//
//
//Return the next frame position
//@return array of x,y coordinates
//
//- - - - - - - - - - - - - - - - - - - - - - - - -
//QRrawcode
//
//Initialize code.
//@param $spec (array) array of ECC specification
//@return 0 in case of success, -1 in case of error
//
//
//Return Reed-Solomon block code.
//@return array rsblocks
//
//- - - - - - - - - - - - - - - - - - - - - - - - -
//QRmask
//
//Write Format Information on frame and returns the number of black bits
//@param $width (int) frame width
//@param $frame (array) frame
//@param $mask (array) masking mode
//@param $level (int) error correction level
//@return int blacks
//
//
//mask0
//@param $x (int) X position
//@param $y (int) Y position
//@return int mask
//
//
//mask1
//@param $x (int) X position
//@param $y (int) Y position
//@return int mask
//
//
//mask2
//@param $x (int) X position
//@param $y (int) Y position
//@return int mask
//
//
//mask3
//@param $x (int) X position
//@param $y (int) Y position
//@return int mask
//
//
//mask4
//@param $x (int) X position
//@param $y (int) Y position
//@return int mask
//
//
//mask5
//@param $x (int) X position
//@param $y (int) Y position
//@return int mask
//
//
//mask6
//@param $x (int) X position
//@param $y (int) Y position
//@return int mask
//
//
//mask7
//@param $x (int) X position
//@param $y (int) Y position
//@return int mask
//
//
//Return bitmask
//@param $maskNo (int) mask number
//@param $width (int) width
//@param $frame (array) frame
//@return array bitmask
//
//
//makeMaskNo
//@param $maskNo (int)
//@param $width (int)
//@param $s (int)
//@param $d (int)
//@param $maskGenOnly (boolean)
//@return int b
//
//
//makeMask
//@param $width (int)
//@param $frame (array)
//@param $maskNo (int)
//@param $level (int)
//@return array mask
//
//
//calcN1N3
//@param $length (int)
//@return int demerit
//
//
//evaluateSymbol
//@param $width (int)
//@param $frame (array)
//@return int demerit
//
//
//mask
//@param $width (int)
//@param $frame (array)
//@param $level (int)
//@return array best mask
//
//- - - - - - - - - - - - - - - - - - - - - - - - -
//QRsplit
//
//Return true if the character at specified position is a number
//@param $str (string) string
//@param $pos (int) characted position
//@return boolean true of false
//
//
//Return true if the character at specified position is an alphanumeric character
//@param $str (string) string
//@param $pos (int) characted position
//@return boolean true of false
//
//
//identifyMode
//@param $pos (int)
//@return int mode
//
//
//eatNum
//@return int run
//
//
//eatAn
//@return int run
//
//
//eatKanji
//@return int run
//
//
//eat8
//@return int run
//
//
//splitString
//@return (int)
//
//
//toUpper
//
//- - - - - - - - - - - - - - - - - - - - - - - - -
//QRinputItem
//
//newInputItem
//@param $mode (int)
//@param $size (int)
//@param $data (array)
//@param $bstream (array)
//@return array input item
//
//
//encodeModeNum
//@param $inputitem (array)
//@param $version (int)
//@return array input item
//
//
//encodeModeAn
//@param $inputitem (array)
//@param $version (int)
//@return array input item
//
//
//encodeMode8
//@param $inputitem (array)
//@param $version (int)
//@return array input item
//
//
//encodeModeKanji
//@param $inputitem (array)
//@param $version (int)
//@return array input item
//
//
//encodeModeStructure
//@param $inputitem (array)
//@return array input item
//
//
//encodeBitStream
//@param $inputitem (array)
//@param $version (int)
//@return array input item
//
//- - - - - - - - - - - - - - - - - - - - - - - - -
//QRinput
//
//Append data to an input object.
//The data is copied and appended to the input object.
//@param $items (arrray) input items
//@param $mode (int) encoding mode.
//@param $size (int) size of data (byte).
//@param $data (array) array of input data.
//@return items
//
//
//
//insertStructuredAppendHeader
//@param $items (array)
//@param $size (int)
//@param $index (int)
//@param $parity (int)
//@return array items
//
//
//calcParity
//@param $items (array)
//@return int parity
//
//
//checkModeNum
//@param $size (int)
//@param $data (array)
//@return boolean true or false
//
//
//Look up the alphabet-numeric convesion table (see JIS X0510:2004, pp.19).
//@param $c (int) character value
//@return value
//
//
//checkModeAn
//@param $size (int)
//@param $data (array)
//@return boolean true or false
//
//
//estimateBitsModeNum
//@param $size (int)
//@return int number of bits
//
//
//estimateBitsModeAn
//@param $size (int)
//@return int number of bits
//
//
//estimateBitsMode8
//@param $size (int)
//@return int number of bits
//
//
//estimateBitsModeKanji
//@param $size (int)
//@return int number of bits
//
//
//checkModeKanji
//@param $size (int)
//@param $data (array)
//@return boolean true or false
//
//
//Validate the input data.
//@param $mode (int) encoding mode.
//@param $size (int) size of data (byte).
//@param $data (array) data to validate
//@return boolean true in case of valid data, false otherwise
//
//
//estimateBitStreamSize
//@param $items (array)
//@param $version (int)
//@return int bits
//
//
//estimateVersion
//@param $items (array)
//@return int version
//
//
//lengthOfCode
//@param $mode (int)
//@param $version (int)
//@param $bits (int)
//@return int size
//
//
//createBitStream
//@param $items (array)
//@return array of items and total bits
//
//
//convertData
//@param $items (array)
//@return array items
//
//
//Append Padding Bit to bitstream
//@param $bstream (array)
//@return array bitstream
//
//
//mergeBitStream
//@param $items (array) items
//@return array bitstream
//
//
//Returns a stream of bits.
//@param $items (int)
//@return array padded merged byte stream
//
//
//Pack all bit streams padding bits into a byte array.
//@param $items (int)
//@return array padded merged byte stream
//
//- - - - - - - - - - - - - - - - - - - - - - - - -
//QRbitstream
//
//Return an array with zeros
//@param $setLength (int) array size
//@return array
//
//
//Return new bitstream from number
//@param $bits (int) number of bits
//@param $num (int) number
//@return array bitstream
//
//
//Return new bitstream from bytes
//@param $size (int) size
//@param $data (array) bytes
//@return array bitstream
//
//
//Append one bitstream to another
//@param $bitstream (array) original bitstream
//@param $append (array) bitstream to append
//@return array bitstream
//
//
//Append one bitstream created from number to another
//@param $bitstream (array) original bitstream
//@param $bits (int) number of bits
//@param $num (int) number
//@return array bitstream
//
//
//Append one bitstream created from bytes to another
//@param $bitstream (array) original bitstream
//@param $size (int) size
//@param $data (array) bytes
//@return array bitstream
//
//
//Convert bitstream to bytes
//@param $bstream (array) original bitstream
//@return array of bytes
//
//- - - - - - - - - - - - - - - - - - - - - - - - -
//QRspec
//
//Replace a value on the array at the specified position
//@param $srctab (array)
//@param $x (int) X position
//@param $y (int) Y position
//@param $repl (string) value to replace
//@param $replLen (int) length of the repl string
//@return array srctab
//
//
//Return maximum data code length (bytes) for the version.
//@param $version (int) version
//@param $level (int) error correction level
//@return int maximum size (bytes)
//
//
//Return maximum error correction code length (bytes) for the version.
//@param $version (int) version
//@param $level (int) error correction level
//@return int ECC size (bytes)
//
//
//Return the width of the symbol for the version.
//@param $version (int) version
//@return int width
//
//
//Return the numer of remainder bits.
//@param $version (int) version
//@return int number of remainder bits
//
//
//Return a version number that satisfies the input code length.
//@param $size (int) input code length (bytes)
//@param $level (int) error correction level
//@return int version number
//
//
//Return the size of length indicator for the mode and version.
//@param $mode (int) encoding mode
//@param $version (int) version
//@return int the size of the appropriate length indicator (bits).
//
//
//Return the maximum length for the mode and version.
//@param $mode (int) encoding mode
//@param $version (int) version
//@return int the maximum length (bytes)
//
//
//Return an array of ECC specification.
//@param $version (int) version
//@param $level (int) error correction level
//@param $spec (array) an array of ECC specification contains as following: {# of type1 blocks, # of data code, # of ecc code, # of type2 blocks, # of data code}
//@return array spec
//
//
//Put an alignment marker.
//@param $frame (array) frame
//@param $ox (int) X center coordinate of the pattern
//@param $oy (int) Y center coordinate of the pattern
//@return array frame
//
//
//Put an alignment pattern.
//@param $version (int) version
//@param $frame (array) frame
//@param $width (int) width
//@return array frame
//
//
//Return BCH encoded version information pattern that is used for the symbol of version 7 or greater. Use lower 18 bits.
//@param $version (int) version
//@return BCH encoded version information pattern
//
//
//Return BCH encoded format information pattern.
//@param $mask (array)
//@param $level (int) error correction level
//@return BCH encoded format information pattern
//
//
//Put a finder pattern.
//@param $frame (array) frame
//@param $ox (int) X center coordinate of the pattern
//@param $oy (int) Y center coordinate of the pattern
//@return array frame
//
//
//Return a copy of initialized frame.
//@param $version (int) version
//@return Array of unsigned char.
//
//
//Set new frame for the specified version.
//@param $version (int) version
//@return Array of unsigned char.
//
//
//Return block number 0
//@param $spec (array)
//@return int value
//
//
//Return block number 1
//@param $spec (array)
//@return int value
//
//
//Return data codes 1
//@param $spec (array)
//@return int value
//
//
//Return ecc codes 1
//@param $spec (array)
//@return int value
//
//
//Return block number 2
//@param $spec (array)
//@return int value
//
//
//Return data codes 2
//@param $spec (array)
//@return int value
//
//
//Return ecc codes 2
//@param $spec (array)
//@return int value
//
//
//Return data length
//@param $spec (array)
//@return int value
//
//
//Return ecc length
//@param $spec (array)
//@return int value
//
//- - - - - - - - - - - - - - - - - - - - - - - - -
//QRrs
//
//Initialize a Reed-Solomon codec and add it to existing rsitems
//@param $symsize (int) symbol size, bits
//@param $gfpoly (int)  Field generator polynomial coefficients
//@param $fcr (int)  first root of RS code generator polynomial, index form
//@param $prim (int)  primitive element to generate polynomial roots
//@param $nroots (int) RS code generator polynomial degree (number of roots)
//@param $pad (int)  padding bytes at front of shortened block
//@return array Array of RS values:<ul><li>mm = Bits per symbol;</li><li>nn = Symbols per block;</li><li>alpha_to = log lookup table array;</li><li>index_of = Antilog lookup table array;</li><li>genpoly = Generator polynomial array;</li><li>nroots = Number of generator;</li><li>roots = number of parity symbols;</li><li>fcr = First consecutive root, index form;</li><li>prim = Primitive element, index form;</li><li>iprim = prim-th root of 1, index form;</li><li>pad = Padding bytes in shortened block;</li><li>gfpoly</ul>.
//
//- - - - - - - - - - - - - - - - - - - - - - - - -
//QRrsItem
//
//modnn
//@param $rs (array) RS values
//@param $x (int) X position
//@return int X osition
//
//
//Initialize a Reed-Solomon codec and returns an array of values.
//@param $symsize (int) symbol size, bits
//@param $gfpoly (int)  Field generator polynomial coefficients
//@param $fcr (int)  first root of RS code generator polynomial, index form
//@param $prim (int)  primitive element to generate polynomial roots
//@param $nroots (int) RS code generator polynomial degree (number of roots)
//@param $pad (int)  padding bytes at front of shortened block
//@return array Array of RS values:<ul><li>mm = Bits per symbol;</li><li>nn = Symbols per block;</li><li>alpha_to = log lookup table array;</li><li>index_of = Antilog lookup table array;</li><li>genpoly = Generator polynomial array;</li><li>nroots = Number of generator;</li><li>roots = number of parity symbols;</li><li>fcr = First consecutive root, index form;</li><li>prim = Primitive element, index form;</li><li>iprim = prim-th root of 1, index form;</li><li>pad = Padding bytes in shortened block;</li><li>gfpoly</ul>.
//
//
//Encode a Reed-Solomon codec and returns the parity array
//@param $rs (array) RS values
//@param $data (array) data
//@param $parity (array) parity
//@return parity array
//
class QRcode {
	constructor(code, eclevel = "L") {
		this.barcode_array = Array();
		this.version = 0;
		this.level = QR_ECLEVEL_L;
		this.hint = QR_MODE_8B;
		this.casesensitive = true;
		this.structured = 0;
		this.datacode = Array();
		this.ecccode = Array();
		this.rsblocks = Array();
		this.runLength = Array();
		this.dataStr = "";
		this.rsitems = Array();
		this.frames = Array();
		this.anTable = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 36, -1, -1, -1, 37, 38, -1, -1, -1, -1, 39, 40, -1, 41, 42, 43, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 44, -1, -1, -1, -1, -1, -1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
		this.capacity = [[0, 0, 0, [0, 0, 0, 0]], [21, 26, 0, [7, 10, 13, 17]], [25, 44, 7, [10, 16, 22, 28]], [29, 70, 7, [15, 26, 36, 44]], [33, 100, 7, [20, 36, 52, 64]], [37, 134, 7, [26, 48, 72, 88]], [41, 172, 7, [36, 64, 96, 112]], [45, 196, 0, [40, 72, 108, 130]], [49, 242, 0, [48, 88, 132, 156]], [53, 292, 0, [60, 110, 160, 192]], [57, 346, 0, [72, 130, 192, 224]], [61, 404, 0, [80, 150, 224, 264]], [65, 466, 0, [96, 176, 260, 308]], [69, 532, 0, [104, 198, 288, 352]], [73, 581, 3, [120, 216, 320, 384]], [77, 655, 3, [132, 240, 360, 432]], [81, 733, 3, [144, 280, 408, 480]], [85, 815, 3, [168, 308, 448, 532]], [89, 901, 3, [180, 338, 504, 588]], [93, 991, 3, [196, 364, 546, 650]], [97, 1085, 3, [224, 416, 600, 700]], [101, 1156, 4, [224, 442, 644, 750]], [105, 1258, 4, [252, 476, 690, 816]], [109, 1364, 4, [270, 504, 750, 900]], [113, 1474, 4, [300, 560, 810, 960]], [117, 1588, 4, [312, 588, 870, 1050]], [121, 1706, 4, [336, 644, 952, 1110]], [125, 1828, 4, [360, 700, 1020, 1200]], [129, 1921, 3, [390, 728, 1050, 1260]], [133, 2051, 3, [420, 784, 1140, 1350]], [137, 2185, 3, [450, 812, 1200, 1440]], [141, 2323, 3, [480, 868, 1290, 1530]], [145, 2465, 3, [510, 924, 1350, 1620]], [149, 2611, 3, [540, 980, 1440, 1710]], [153, 2761, 3, [570, 1036, 1530, 1800]], [157, 2876, 0, [570, 1064, 1590, 1890]], [161, 3034, 0, [600, 1120, 1680, 1980]], [165, 3196, 0, [630, 1204, 1770, 2100]], [169, 3362, 0, [660, 1260, 1860, 2220]], [173, 3532, 0, [720, 1316, 1950, 2310]], [177, 3706, 0, [750, 1372, 2040, 2430]]];
		this.lengthTableBits = [[10, 12, 14], [9, 11, 13], [8, 16, 16], [8, 10, 12]];
		this.eccTable = [[[0, 0], [0, 0], [0, 0], [0, 0]], [[1, 0], [1, 0], [1, 0], [1, 0]], [[1, 0], [1, 0], [1, 0], [1, 0]], [[1, 0], [1, 0], [2, 0], [2, 0]], [[1, 0], [2, 0], [2, 0], [4, 0]], [[1, 0], [2, 0], [2, 2], [2, 2]], [[2, 0], [4, 0], [4, 0], [4, 0]], [[2, 0], [4, 0], [2, 4], [4, 1]], [[2, 0], [2, 2], [4, 2], [4, 2]], [[2, 0], [3, 2], [4, 4], [4, 4]], [[2, 2], [4, 1], [6, 2], [6, 2]], [[4, 0], [1, 4], [4, 4], [3, 8]], [[2, 2], [6, 2], [4, 6], [7, 4]], [[4, 0], [8, 1], [8, 4], [12, 4]], [[3, 1], [4, 5], [11, 5], [11, 5]], [[5, 1], [5, 5], [5, 7], [11, 7]], [[5, 1], [7, 3], [15, 2], [3, 13]], [[1, 5], [10, 1], [1, 15], [2, 17]], [[5, 1], [9, 4], [17, 1], [2, 19]], [[3, 4], [3, 11], [17, 4], [9, 16]], [[3, 5], [3, 13], [15, 5], [15, 10]], [[4, 4], [17, 0], [17, 6], [19, 6]], [[2, 7], [17, 0], [7, 16], [34, 0]], [[4, 5], [4, 14], [11, 14], [16, 14]], [[6, 4], [6, 14], [11, 16], [30, 2]], [[8, 4], [8, 13], [7, 22], [22, 13]], [[10, 2], [19, 4], [28, 6], [33, 4]], [[8, 4], [22, 3], [8, 26], [12, 28]], [[3, 10], [3, 23], [4, 31], [11, 31]], [[7, 7], [21, 7], [1, 37], [19, 26]], [[5, 10], [19, 10], [15, 25], [23, 25]], [[13, 3], [2, 29], [42, 1], [23, 28]], [[17, 0], [10, 23], [10, 35], [19, 35]], [[17, 1], [14, 21], [29, 19], [11, 46]], [[13, 6], [14, 23], [44, 7], [59, 1]], [[12, 7], [12, 26], [39, 14], [22, 41]], [[6, 14], [6, 34], [46, 10], [2, 64]], [[17, 4], [29, 14], [49, 10], [24, 46]], [[4, 18], [13, 32], [48, 14], [42, 32]], [[20, 4], [40, 7], [43, 22], [10, 67]], [[19, 6], [18, 31], [34, 34], [20, 61]]];
		this.alignmentPattern = [[0, 0], [0, 0], [18, 0], [22, 0], [26, 0], [30, 0], [34, 0], [22, 38], [24, 42], [26, 46], [28, 50], [30, 54], [32, 58], [34, 62], [26, 46], [26, 48], [26, 50], [30, 54], [30, 56], [30, 58], [34, 62], [28, 50], [26, 50], [30, 54], [28, 54], [32, 58], [30, 58], [34, 62], [26, 50], [30, 54], [26, 52], [30, 56], [34, 60], [30, 58], [34, 62], [30, 54], [24, 50], [28, 54], [32, 58], [26, 54], [30, 58]];
		this.versionPattern = [31892, 34236, 39577, 42195, 48118, 51042, 55367, 58893, 63784, 68472, 70749, 76311, 79154, 84390, 87683, 92361, 96236, 102084, 102881, 110507, 110734, 117786, 119615, 126325, 127568, 133589, 136944, 141498, 145311, 150283, 152622, 158308, 161089, 167017];
		this.formatInfo = [[30660, 29427, 32170, 30877, 26159, 25368, 27713, 26998], [21522, 20773, 24188, 23371, 17913, 16590, 20375, 19104], [13663, 12392, 16177, 14854, 9396, 8579, 11994, 11245], [5769, 5054, 7399, 6608, 1890, 597, 3340, 2107]];
		var barcode_array = Array();

		if (is_null(code) or code == "\\0" or code == "") {
			return false;
		}

		this.level = array_search(eclevel, ["L", "M", "Q", "H"]);

		if (this.level === false) {
			this.level = QR_ECLEVEL_L;
		}

		if (this.hint != QR_MODE_8B and this.hint != QR_MODE_KJ) {
			return false;
		}

		if (this.version < 0 or this.version > QRSPEC_VERSION_MAX) {
			return false;
		}

		this.items = Array();
		this.encodeString(code);

		if (is_null(this.data)) {
			return false;
		}

		var qrTab = this.binarize(this.data);
		var size = qrTab.length;
		barcode_array.num_rows = size;
		barcode_array.num_cols = size;
		barcode_array.bcode = Array();

		for (var line of Object.values(qrTab)) {
			var arrAdd = Array();

			for (var char of Object.values(str_split(line))) {
				arrAdd.push(char == "1" ? 1 : 0);
			}

			barcode_array.bcode.push(arrAdd);
		}

		this.barcode_array = barcode_array;
	}

	getBarcodeArray() {
		return this.barcode_array;
	}

	binarize(frame) //the frame is square (width = height)
	{
		var len = frame.length;

		for (var frameLine of Object.values(frame)) {
			for (var i = 0; i < len; i++) {
				frameLine[i] = frameLine.charCodeAt(i) & 1 ? "1" : "0";
			}
		}

		return frame;
	}

	encodeString(string) {
		this.dataStr = string;

		if (!this.casesensitive) {
			this.toUpper();
		}

		var ret = this.splitString();

		if (ret < 0) {
			return undefined;
		}

		this.encodeMask(-1);
	}

	encodeMask(mask) //inteleaved data and ecc codes
	//remainder bits
	//masking
	{
		var spec = [0, 0, 0, 0, 0];
		this.datacode = this.getByteStream(this.items);

		if (is_null(this.datacode)) {
			return undefined;
		}

		spec = this.getEccSpec(this.version, this.level, spec);
		this.b1 = this.rsBlockNum1(spec);
		this.dataLength = this.rsDataLength(spec);
		this.eccLength = this.rsEccLength(spec);
		this.ecccode = array_fill(0, this.eccLength, 0);
		this.blocks = this.rsBlockNum(spec);
		var ret = this.init(spec);

		if (ret < 0) {
			return undefined;
		}

		this.count = 0;
		this.width = this.getWidth(this.version);
		this.frame = this.newFrame(this.version);
		this.x = this.width - 1;
		this.y = this.width - 1;
		this.dir = -1;
		this.bit = -1;

		for (var i = 0; i < this.dataLength + this.eccLength; i++) {
			var code = this.getCode();
			var bit = 128;

			for (var j = 0; j < 8; j++) {
				var addr = this.getNextPosition();
				this.setFrameAt(addr, 2 | (bit & code) != 0);
				bit = bit >> 1;
			}
		}

		j = this.getRemainder(this.version);

		for (i = 0;; i < j; i++) {
			addr = this.getNextPosition();
			this.setFrameAt(addr, 2);
		}

		this.runLength = array_fill(0, QRSPEC_WIDTH_MAX + 1, 0);

		if (mask < 0) {
			if (QR_FIND_BEST_MASK) {
				var masked = this.mask(this.width, this.frame, this.level);
			} else {
				masked = this.makeMask(this.width, this.frame, Math.round(QR_DEFAULT_MASK) % 8, this.level);
			}
		} else {
			masked = this.makeMask(this.width, this.frame, mask, this.level);
		}

		if (masked == undefined) {
			return undefined;
		}

		this.data = masked;
	}

	setFrameAt(at, val) {
		this.frame[at.y][at.x] = String.fromCharCode(val);
	}

	getFrameAt(at) {
		return this.frame[at.y].charCodeAt(at.x);
	}

	getNextPosition() {
		do {
			if (this.bit == -1) {
				this.bit = 0;
				return {
					x: this.x,
					y: this.y
				};
			}

			var x = this.x;
			var y = this.y;
			var w = this.width;

			if (this.bit == 0) {
				x--;
				this.bit++;
			} else {
				x++;
				y += this.dir;
				this.bit--;
			}

			if (this.dir < 0) {
				if (y < 0) {
					y = 0;
					x -= 2;
					this.dir = 1;

					if (x == 6) {
						x--;
						y = 9;
					}
				}
			} else {
				if (y == w) {
					y = w - 1;
					x -= 2;
					this.dir = -1;

					if (x == 6) {
						x--;
						y -= 8;
					}
				}
			}

			if (x < 0 or y < 0) {
				return undefined;
			}

			this.x = x;
			this.y = y;
		} while (this.frame[y].charCodeAt(x) & 128);

		return {
			x: x,
			y: y
		};
	}

	init(spec) {
		var dl = this.rsDataCodes1(spec);
		var el = this.rsEccCodes1(spec);
		var rs = this.init_rs(8, 285, 0, 1, el, 255 - dl - el);
		var blockNo = 0;
		var dataPos = 0;
		var eccPos = 0;
		var endfor = this.rsBlockNum1(spec);

		for (var i = 0; i < endfor; ++i) {
			var ecc = this.ecccode.slice(eccPos);
			this.rsblocks[blockNo] = Array();
			this.rsblocks[blockNo].dataLength = dl;
			this.rsblocks[blockNo].data = this.datacode.slice(dataPos);
			this.rsblocks[blockNo].eccLength = el;
			ecc = this.encode_rs_char(rs, this.rsblocks[blockNo].data, ecc);
			this.rsblocks[blockNo].ecc = ecc;
			this.ecccode = array_merge(this.ecccode.slice(0, eccPos), ecc);
			dataPos += dl;
			eccPos += el;
			blockNo++;
		}

		if (this.rsBlockNum2(spec) == 0) {
			return 0;
		}

		dl = this.rsDataCodes2(spec);
		el = this.rsEccCodes2(spec);
		rs = this.init_rs(8, 285, 0, 1, el, 255 - dl - el);

		if (rs == undefined) {
			return -1;
		}

		endfor = this.rsBlockNum2(spec);

		for (i = 0;; i < endfor; ++i) {
			ecc = this.ecccode.slice(eccPos);
			this.rsblocks[blockNo] = Array();
			this.rsblocks[blockNo].dataLength = dl;
			this.rsblocks[blockNo].data = this.datacode.slice(dataPos);
			this.rsblocks[blockNo].eccLength = el;
			ecc = this.encode_rs_char(rs, this.rsblocks[blockNo].data, ecc);
			this.rsblocks[blockNo].ecc = ecc;
			this.ecccode = array_merge(this.ecccode.slice(0, eccPos), ecc);
			dataPos += dl;
			eccPos += el;
			blockNo++;
		}

		return 0;
	}

	getCode() {
		if (this.count < this.dataLength) {
			var row = this.count % this.blocks;
			var col = this.count / this.blocks;

			if (col >= this.rsblocks[0].dataLength) {
				row += this.b1;
			}

			var ret = this.rsblocks[row].data[col];
		} else if (this.count < this.dataLength + this.eccLength) {
			row = (this.count - this.dataLength) % this.blocks;
			col = (this.count - this.dataLength) / this.blocks;
			ret = this.rsblocks[row].ecc[col];
		} else {
			return 0;
		}

		this.count++;
		return ret;
	}

	writeFormatInformation(width, frame, mask, level) {
		var blacks = 0;
		var format = this.getFormatInfo(mask, level);

		for (var i = 0; i < 8; ++i) {
			if (format & 1) {
				blacks += 2;
				var v = 133;
			} else {
				v = 132;
			}

			frame[8][width - 1 - i] = String.fromCharCode(v);

			if (i < 6) {
				frame[i][8] = String.fromCharCode(v);
			} else {
				frame[i + 1][8] = String.fromCharCode(v);
			}

			format = format >> 1;
		}

		for (i = 0;; i < 7; ++i) {
			if (format & 1) {
				blacks += 2;
				v = 133;
			} else {
				v = 132;
			}

			frame[width - 7 + i][8] = String.fromCharCode(v);

			if (i == 0) {
				frame[8][7] = String.fromCharCode(v);
			} else {
				frame[8][6 - i] = String.fromCharCode(v);
			}

			format = format >> 1;
		}

		return blacks;
	}

	mask0(x, y) {
		return x + y & 1;
	}

	mask1(x, y) {
		return y & 1;
	}

	mask2(x, y) {
		return x % 3;
	}

	mask3(x, y) {
		return (x + y) % 3;
	}

	mask4(x, y) {
		return +(y / 2) + +(x / 3) & 1;
	}

	mask5(x, y) {
		return (x * y & 1) + x * y % 3;
	}

	mask6(x, y) {
		return (x * y & 1) + x * y % 3 & 1;
	}

	mask7(x, y) {
		return x * y % 3 + (x + y & 1) & 1;
	}

	generateMaskNo(maskNo, width, frame) {
		var bitMask = array_fill(0, width, array_fill(0, width, 0));

		for (var y = 0; y < width; ++y) {
			for (var x = 0; x < width; ++x) {
				if (frame[y].charCodeAt(x) & 128) {
					bitMask[y][x] = 0;
				} else {
					var maskFunc = call_user_func([this, "mask" + maskNo], x, y);
					bitMask[y][x] = maskFunc == 0 ? 1 : 0;
				}
			}
		}

		return bitMask;
	}

	makeMaskNo(maskNo, width, s, d, maskGenOnly = false) {
		var b = 0;
		var bitMask = Array();
		bitMask = this.generateMaskNo(maskNo, width, s, d);

		if (maskGenOnly) {
			return;
		}

		d = s;

		for (var y = 0; y < width; ++y) {
			for (var x = 0; x < width; ++x) {
				if (bitMask[y][x] == 1) {
					d[y][x] = String.fromCharCode(s[y].charCodeAt(x) ^ +bitMask[y][x]);
				}

				b += +(d[y].charCodeAt(x) & 1);
			}
		}

		return b;
	}

	makeMask(width, frame, maskNo, level) {
		var masked = array_fill(0, width, str_repeat("\\0", width));
		this.makeMaskNo(maskNo, width, frame, masked);
		this.writeFormatInformation(width, masked, maskNo, level);
		return masked;
	}

	calcN1N3(length) {
		var demerit = 0;

		for (var i = 0; i < length; ++i) {
			if (this.runLength[i] >= 5) {
				demerit += N1 + (this.runLength[i] - 5);
			}

			if (i & 1) {
				if (i >= 3 and i < length - 2 and this.runLength[i] % 3 == 0) {
					var fact = +(this.runLength[i] / 3);

					if (this.runLength[i - 2] == fact and this.runLength[i - 1] == fact and this.runLength[i + 1] == fact and this.runLength[i + 2] == fact) {
						if (this.runLength[i - 3] < 0 or this.runLength[i - 3] >= 4 * fact) {
							demerit += N3;
						} else if (i + 3 >= length or this.runLength[i + 3] >= 4 * fact) {
							demerit += N3;
						}
					}
				}
			}
		}

		return demerit;
	}

	evaluateSymbol(width, frame) {
		var head = 0;
		var demerit = 0;

		for (var y = 0; y < width; ++y) {
			head = 0;
			this.runLength[0] = 1;
			var frameY = frame[y];

			if (y > 0) {
				var frameYM = frame[y - 1];
			}

			for (var x = 0; x < width; ++x) {
				if (x > 0 and y > 0) {
					var b22 = frameY.charCodeAt(x) & frameY.charCodeAt(x - 1) & frameYM.charCodeAt(x) & frameYM.charCodeAt(x - 1);
					var w22 = frameY.charCodeAt(x) | frameY.charCodeAt(x - 1) | frameYM.charCodeAt(x) | frameYM.charCodeAt(x - 1);

					if ((b22 | w22 ^ 1) & 1) {
						demerit += N2;
					}
				}

				if (x == 0 and frameY.charCodeAt(x) & 1) {
					this.runLength[0] = -1;
					head = 1;
					this.runLength[head] = 1;
				} else if (x > 0) {
					if ((frameY.charCodeAt(x) ^ frameY.charCodeAt(x - 1)) & 1) {
						head++;
						this.runLength[head] = 1;
					} else {
						this.runLength[head]++;
					}
				}
			}

			demerit += this.calcN1N3(head + 1);
		}

		for (x = 0;; x < width; ++x) {
			head = 0;
			this.runLength[0] = 1;

			for (y = 0;; y < width; ++y) {
				if (y == 0 and frame[y].charCodeAt(x) & 1) {
					this.runLength[0] = -1;
					head = 1;
					this.runLength[head] = 1;
				} else if (y > 0) {
					if ((frame[y].charCodeAt(x) ^ frame[y - 1].charCodeAt(x)) & 1) {
						head++;
						this.runLength[head] = 1;
					} else {
						this.runLength[head]++;
					}
				}
			}

			demerit += this.calcN1N3(head + 1);
		}

		return demerit;
	}

	mask(width, frame, level) {
		var minDemerit = PHP_INT_MAX;
		var bestMaskNum = 0;
		var bestMask = Array();
		var checked_masks = [0, 1, 2, 3, 4, 5, 6, 7];

		if (QR_FIND_FROM_RANDOM !== false) {
			var howManuOut = 8 - QR_FIND_FROM_RANDOM % 9;

			for (var i = 0; i < howManuOut; ++i) {
				var remPos = rand(0, checked_masks.length - 1);
				delete checked_masks[remPos];
				checked_masks = Object.values(checked_masks);
			}
		}

		bestMask = frame;

		for (var i of Object.values(checked_masks)) {
			var mask = array_fill(0, width, str_repeat("\\0", width));
			var demerit = 0;
			var blacks = 0;
			blacks = this.makeMaskNo(i, width, frame, mask);
			blacks += this.writeFormatInformation(width, mask, i, level);
			blacks = +(100 * blacks / (width * width));
			demerit = + +(Math.abs(blacks - 50) / 5 * N4);
			demerit += this.evaluateSymbol(width, mask);

			if (demerit < minDemerit) {
				minDemerit = demerit;
				bestMask = mask;
				bestMaskNum = i;
			}
		}

		return bestMask;
	}

	isdigitat(str, pos) {
		if (pos >= str.length) {
			return false;
		}

		return str.charCodeAt(pos) >= "0".charCodeAt(0) && str.charCodeAt(pos) <= "9".charCodeAt(0);
	}

	isalnumat(str, pos) {
		if (pos >= str.length) {
			return false;
		}

		return this.lookAnTable(str.charCodeAt(pos)) >= 0;
	}

	identifyMode(pos) {
		if (pos >= this.dataStr.length) {
			return QR_MODE_NL;
		}

		var c = this.dataStr[pos];

		if (this.isdigitat(this.dataStr, pos)) {
			return QR_MODE_NM;
		} else if (this.isalnumat(this.dataStr, pos)) {
			return QR_MODE_AN;
		} else if (this.hint == QR_MODE_KJ) {
			if (pos + 1 < this.dataStr.length) {
				var d = this.dataStr[pos + 1];
				var word = c.charCodeAt(0) << 8 | d.charCodeAt(0);

				if (word >= 33088 && word <= 40956 or word >= 57408 && word <= 60351) {
					return QR_MODE_KJ;
				}
			}
		}

		return QR_MODE_8B;
	}

	eatNum() {
		var ln = this.lengthIndicator(QR_MODE_NM, this.version);
		var p = 0;

		while (this.isdigitat(this.dataStr, p)) {
			p++;
		}

		var run = p;
		var mode = this.identifyMode(p);

		if (mode == QR_MODE_8B) //- 4 - l8
			{
				var dif = this.estimateBitsModeNum(run) + 4 + ln + this.estimateBitsMode8(1) - this.estimateBitsMode8(run + 1);

				if (dif > 0) {
					return this.eat8();
				}
			}

		if (mode == QR_MODE_AN) //- 4 - la
			{
				dif = this.estimateBitsModeNum(run) + 4 + ln + this.estimateBitsModeAn(1) - this.estimateBitsModeAn(run + 1);

				if (dif > 0) {
					return this.eatAn();
				}
			}

		this.items = this.appendNewInputItem(this.items, QR_MODE_NM, run, str_split(this.dataStr));
		return run;
	}

	eatAn() {
		var la = this.lengthIndicator(QR_MODE_AN, this.version);
		var ln = this.lengthIndicator(QR_MODE_NM, this.version);
		var p = 1;

		while (this.isalnumat(this.dataStr, p)) {
			if (this.isdigitat(this.dataStr, p)) //- 4 - la
				{
					var q = p;

					while (this.isdigitat(this.dataStr, q)) {
						q++;
					}

					var dif = this.estimateBitsModeAn(p) + this.estimateBitsModeNum(q - p) + 4 + ln - this.estimateBitsModeAn(q);

					if (dif < 0) {
						break;
					} else {
						p = q;
					}
				} else {
				p++;
			}
		}

		var run = p;

		if (!this.isalnumat(this.dataStr, p)) //- 4 - l8
			{
				dif = this.estimateBitsModeAn(run) + 4 + la + this.estimateBitsMode8(1) - this.estimateBitsMode8(run + 1);

				if (dif > 0) {
					return this.eat8();
				}
			}

		this.items = this.appendNewInputItem(this.items, QR_MODE_AN, run, str_split(this.dataStr));
		return run;
	}

	eatKanji() {
		var p = 0;

		while (this.identifyMode(p) == QR_MODE_KJ) {
			p += 2;
		}

		this.items = this.appendNewInputItem(this.items, QR_MODE_KJ, p, str_split(this.dataStr));
		return run;
	}

	eat8() {
		var la = this.lengthIndicator(QR_MODE_AN, this.version);
		var ln = this.lengthIndicator(QR_MODE_NM, this.version);
		var p = 1;
		var dataStrLen = this.dataStr.length;

		while (p < dataStrLen) {
			var mode = this.identifyMode(p);

			if (mode == QR_MODE_KJ) {
				break;
			}

			if (mode == QR_MODE_NM) //- 4 - l8
				{
					var q = p;

					while (this.isdigitat(this.dataStr, q)) {
						q++;
					}

					var dif = this.estimateBitsMode8(p) + this.estimateBitsModeNum(q - p) + 4 + ln - this.estimateBitsMode8(q);

					if (dif < 0) {
						break;
					} else {
						p = q;
					}
				} else if (mode == QR_MODE_AN) //- 4 - l8
				{
					q = p;

					while (this.isalnumat(this.dataStr, q)) {
						q++;
					}

					dif = this.estimateBitsMode8(p) + this.estimateBitsModeAn(q - p) + 4 + la - this.estimateBitsMode8(q);

					if (dif < 0) {
						break;
					} else {
						p = q;
					}
				} else {
				p++;
			}
		}

		var run = p;
		this.items = this.appendNewInputItem(this.items, QR_MODE_8B, run, str_split(this.dataStr));
		return run;
	}

	splitString() {
		while (this.dataStr.length > 0) {
			var mode = this.identifyMode(0);

			switch (mode) {
				case QR_MODE_NM:
					{
						var length = this.eatNum();
						break;
					}

				case QR_MODE_AN:
					{
						length = this.eatAn();
						break;
					}

				case QR_MODE_KJ:
					{
						if (hint == QR_MODE_KJ) {
							length = this.eatKanji();
						} else {
							length = this.eat8();
						}

						break;
					}

				default:
					{
						length = this.eat8();
						break;
					}
			}

			if (length == 0) {
				return 0;
			}

			if (length < 0) {
				return -1;
			}

			this.dataStr = this.dataStr.substr(length);
		}

		return 0;
	}

	toUpper() {
		var stringLen = this.dataStr.length;
		var p = 0;

		while (p < stringLen) {
			var mode = this.identifyMode(this.dataStr.substr(p), this.hint);

			if (mode == QR_MODE_KJ) {
				p += 2;
			} else {
				if (this.dataStr.charCodeAt(p) >= "a".charCodeAt(0) and this.dataStr.charCodeAt(p) <= "z".charCodeAt(0)) {
					this.dataStr[p] = String.fromCharCode(this.dataStr.charCodeAt(p) - 32);
				}

				p++;
			}
		}

		return this.dataStr;
	}

	newInputItem(mode, size, data, bstream = undefined) {
		var setData = data.slice(0, size);

		if (setData.length < size) {
			setData = array_merge(setData, array_fill(0, size - setData.length, 0));
		}

		if (!this.check(mode, size, setData)) {
			return undefined;
		}

		var inputitem = Array();
		inputitem.mode = mode;
		inputitem.size = size;
		inputitem.data = setData;
		inputitem.bstream = bstream;
		return inputitem;
	}

	encodeModeNum(inputitem, version) {
		var words = +(inputitem.size / 3);
		inputitem.bstream = Array();
		var val = 1;
		inputitem.bstream = this.appendNum(inputitem.bstream, 4, val);
		inputitem.bstream = this.appendNum(inputitem.bstream, this.lengthIndicator(QR_MODE_NM, version), inputitem.size);

		for (var i = 0; i < words; ++i) {
			val = (inputitem.data.charCodeAt(i * 3) - "0".charCodeAt(0)) * 100;
			val += (inputitem.data.charCodeAt(i * 3 + 1) - "0".charCodeAt(0)) * 10;
			val += inputitem.data.charCodeAt(i * 3 + 2) - "0".charCodeAt(0);
			inputitem.bstream = this.appendNum(inputitem.bstream, 10, val);
		}

		if (inputitem.size - words * 3 == 1) {
			val = inputitem.data.charCodeAt(words * 3) - "0".charCodeAt(0);
			inputitem.bstream = this.appendNum(inputitem.bstream, 4, val);
		} else if (inputitem.size - words * 3 == 2) {
			val = (inputitem.data.charCodeAt(words * 3) - "0".charCodeAt(0)) * 10;
			val += inputitem.data.charCodeAt(words * 3 + 1) - "0".charCodeAt(0);
			inputitem.bstream = this.appendNum(inputitem.bstream, 7, val);
		}

		return inputitem;
	}

	encodeModeAn(inputitem, version) {
		var words = +(inputitem.size / 2);
		inputitem.bstream = Array();
		inputitem.bstream = this.appendNum(inputitem.bstream, 4, 2);
		inputitem.bstream = this.appendNum(inputitem.bstream, this.lengthIndicator(QR_MODE_AN, version), inputitem.size);

		for (var i = 0; i < words; ++i) {
			var val = +(this.lookAnTable(inputitem.data.charCodeAt(i * 2)) * 45);
			val += +this.lookAnTable(inputitem.data.charCodeAt(i * 2 + 1));
			inputitem.bstream = this.appendNum(inputitem.bstream, 11, val);
		}

		if (inputitem.size & 1) {
			val = this.lookAnTable(inputitem.data.charCodeAt(words * 2));
			inputitem.bstream = this.appendNum(inputitem.bstream, 6, val);
		}

		return inputitem;
	}

	encodeMode8(inputitem, version) {
		inputitem.bstream = Array();
		inputitem.bstream = this.appendNum(inputitem.bstream, 4, 4);
		inputitem.bstream = this.appendNum(inputitem.bstream, this.lengthIndicator(QR_MODE_8B, version), inputitem.size);

		for (var i = 0; i < inputitem.size; ++i) {
			inputitem.bstream = this.appendNum(inputitem.bstream, 8, inputitem.data.charCodeAt(i));
		}

		return inputitem;
	}

	encodeModeKanji(inputitem, version) {
		inputitem.bstream = Array();
		inputitem.bstream = this.appendNum(inputitem.bstream, 4, 8);
		inputitem.bstream = this.appendNum(inputitem.bstream, this.lengthIndicator(QR_MODE_KJ, version), +(inputitem.size / 2));

		for (var i = 0; i < inputitem.size; i += 2) {
			var val = inputitem.data.charCodeAt(i) << 8 | inputitem.data.charCodeAt(i + 1);

			if (val <= 40956) {
				val -= 33088;
			} else {
				val -= 49472;
			}

			var h = (val >> 8) * 192;
			val = (val & 255) + h;
			inputitem.bstream = this.appendNum(inputitem.bstream, 13, val);
		}

		return inputitem;
	}

	encodeModeStructure(inputitem) {
		inputitem.bstream = Array();
		inputitem.bstream = this.appendNum(inputitem.bstream, 4, 3);
		inputitem.bstream = this.appendNum(inputitem.bstream, 4, inputitem.data.charCodeAt(1) - 1);
		inputitem.bstream = this.appendNum(inputitem.bstream, 4, inputitem.data.charCodeAt(0) - 1);
		inputitem.bstream = this.appendNum(inputitem.bstream, 8, inputitem.data.charCodeAt(2));
		return inputitem;
	}

	encodeBitStream(inputitem, version) {
		inputitem.bstream = Array();
		var words = this.maximumWords(inputitem.mode, version);

		if (inputitem.size > words) {
			var st1 = this.newInputItem(inputitem.mode, words, inputitem.data);
			var st2 = this.newInputItem(inputitem.mode, inputitem.size - words, inputitem.data.slice(words));
			st1 = this.encodeBitStream(st1, version);
			st2 = this.encodeBitStream(st2, version);
			inputitem.bstream = Array();
			inputitem.bstream = this.appendBitstream(inputitem.bstream, st1.bstream);
			inputitem.bstream = this.appendBitstream(inputitem.bstream, st2.bstream);
		} else {
			switch (inputitem.mode) {
				case QR_MODE_NM:
					{
						inputitem = this.encodeModeNum(inputitem, version);
						break;
					}

				case QR_MODE_AN:
					{
						inputitem = this.encodeModeAn(inputitem, version);
						break;
					}

				case QR_MODE_8B:
					{
						inputitem = this.encodeMode8(inputitem, version);
						break;
					}

				case QR_MODE_KJ:
					{
						inputitem = this.encodeModeKanji(inputitem, version);
						break;
					}

				case QR_MODE_ST:
					{
						inputitem = this.encodeModeStructure(inputitem);
						break;
					}

				default:
					{
						break;
					}
			}
		}

		return inputitem;
	}

	appendNewInputItem(items, mode, size, data) {
		var newitem = this.newInputItem(mode, size, data);

		if (!!newitem) {
			items.push(newitem);
		}

		return items;
	}

	insertStructuredAppendHeader(items, size, index, parity) {
		if (size > MAX_STRUCTURED_SYMBOLS) {
			return -1;
		}

		if (index <= 0 or index > MAX_STRUCTURED_SYMBOLS) {
			return -1;
		}

		var buf = [size, index, parity];
		var entry = this.newInputItem(QR_MODE_ST, 3, buf);
		items.unshift(entry);
		return items;
	}

	calcParity(items) {
		var parity = 0;

		for (var item of Object.values(items)) {
			if (item.mode != QR_MODE_ST) {
				for (var i = item.size - 1; i >= 0; --i) {
					parity ^= item.data[i];
				}
			}
		}

		return parity;
	}

	checkModeNum(size, data) {
		for (var i = 0; i < size; ++i) {
			if (data.charCodeAt(i) < "0".charCodeAt(0) or data.charCodeAt(i) > "9".charCodeAt(0)) {
				return false;
			}
		}

		return true;
	}

	lookAnTable(c) {
		return c > 127 ? -1 : this.anTable[c];
	}

	checkModeAn(size, data) {
		for (var i = 0; i < size; ++i) {
			if (this.lookAnTable(data.charCodeAt(i)) == -1) {
				return false;
			}
		}

		return true;
	}

	estimateBitsModeNum(size) {
		var w = +(size / 3);
		var bits = w * 10;

		switch (size - w * 3) {
			case 1:
				{
					bits += 4;
					break;
				}

			case 2:
				{
					bits += 7;
					break;
				}
		}

		return bits;
	}

	estimateBitsModeAn(size) //(size / 2 ) * 11
	{
		var bits = +(size * 5.5);

		if (size & 1) {
			bits += 6;
		}

		return bits;
	}

	estimateBitsMode8(size) {
		return +(size * 8);
	}

	estimateBitsModeKanji(size) //(size / 2 ) * 13
	{
		return +(size * 6.5);
	}

	checkModeKanji(size, data) {
		if (size & 1) {
			return false;
		}

		for (var i = 0; i < size; i += 2) {
			var val = data.charCodeAt(i) << 8 | data.charCodeAt(i + 1);

			if (val < 33088 or (val > 40956 and val < 57408) or val > 60351) {
				return false;
			}
		}

		return true;
	}

	check(mode, size, data) {
		if (size <= 0) {
			return false;
		}

		switch (mode) {
			case QR_MODE_NM:
				{
					return this.checkModeNum(size, data);
				}

			case QR_MODE_AN:
				{
					return this.checkModeAn(size, data);
				}

			case QR_MODE_KJ:
				{
					return this.checkModeKanji(size, data);
				}

			case QR_MODE_8B:
				{
					return true;
				}

			case QR_MODE_ST:
				{
					return true;
				}

			default:
				{
					break;
				}
		}

		return false;
	}

	estimateBitStreamSize(items, version) {
		var bits = 0;

		if (version == 0) {
			version = 1;
		}

		for (var item of Object.values(items)) {
			switch (item.mode) {
				case QR_MODE_NM:
					{
						bits = this.estimateBitsModeNum(item.size);
						break;
					}

				case QR_MODE_AN:
					{
						bits = this.estimateBitsModeAn(item.size);
						break;
					}

				case QR_MODE_8B:
					{
						bits = this.estimateBitsMode8(item.size);
						break;
					}

				case QR_MODE_KJ:
					{
						bits = this.estimateBitsModeKanji(item.size);
						break;
					}

				case QR_MODE_ST:
					{
						return STRUCTURE_HEADER_BITS;
					}

				default:
					{
						return 0;
					}
			}

			var l = this.lengthIndicator(item.mode, version);
			var m = 1 << l;
			var num = +((item.size + m - 1) / m);
			bits += num * (4 + l);
		}

		return bits;
	}

	estimateVersion(items) {
		var version = 0;
		var prev = 0;

		do {
			prev = version;
			var bits = this.estimateBitStreamSize(items, prev);
			version = this.getMinimumVersion(+((bits + 7) / 8), this.level);

			if (version < 0) {
				return -1;
			}
		} while (version > prev);

		return version;
	}

	lengthOfCode(mode, version, bits) {
		var payload = bits - 4 - this.lengthIndicator(mode, version);

		switch (mode) {
			case QR_MODE_NM:
				{
					var chunks = +(payload / 10);
					var remain = payload - chunks * 10;
					var size = chunks * 3;

					if (remain >= 7) {
						size += 2;
					} else if (remain >= 4) {
						size += 1;
					}

					break;
				}

			case QR_MODE_AN:
				{
					chunks = +(payload / 11);
					remain = payload - chunks * 11;
					size = chunks * 2;

					if (remain >= 6) {
						++size;
					}

					break;
				}

			case QR_MODE_8B:
				{
					size = +(payload / 8);
					break;
				}

			case QR_MODE_KJ:
				{
					size = +(payload / 13 * 2);
					break;
				}

			case QR_MODE_ST:
				{
					size = +(payload / 8);
					break;
				}

			default:
				{
					size = 0;
					break;
				}
		}

		var maxsize = this.maximumWords(mode, version);

		if (size < 0) {
			size = 0;
		}

		if (size > maxsize) {
			size = maxsize;
		}

		return size;
	}

	createBitStream(items) {
		var total = 0;

		for (var key in items) {
			var item = items[key];
			items[key] = this.encodeBitStream(item, this.version);
			var bits = items[key].bstream.length;
			total += bits;
		}

		return [items, total];
	}

	convertData(items) {
		var ver = this.estimateVersion(items);

		if (ver > this.version) {
			this.version = ver;
		}

		while (true) {
			var cbs = this.createBitStream(items);
			items = cbs[0];
			var bits = cbs[1];

			if (bits < 0) {
				return -1;
			}

			ver = this.getMinimumVersion(+((bits + 7) / 8), this.level);

			if (ver < 0) {
				return -1;
			} else if (ver > this.version) {
				this.version = ver;
			} else {
				break;
			}
		}

		return items;
	}

	appendPaddingBit(bstream) {
		if (is_null(bstream)) {
			return undefined;
		}

		var bits = bstream.length;
		var maxwords = this.getDataLength(this.version, this.level);
		var maxbits = maxwords * 8;

		if (maxbits == bits) {
			return bstream;
		}

		if (maxbits - bits < 5) {
			return this.appendNum(bstream, maxbits - bits, 0);
		}

		bits += 4;
		var words = +((bits + 7) / 8);
		var padding = Array();
		padding = this.appendNum(padding, words * 8 - bits + 4, 0);
		var padlen = maxwords - words;

		if (padlen > 0) {
			var padbuf = Array();

			for (var i = 0; i < padlen; ++i) {
				padbuf[i] = i & 1 ? 17 : 236;
			}

			padding = this.appendBytes(padding, padlen, padbuf);
		}

		return this.appendBitstream(bstream, padding);
	}

	mergeBitStream(items) {
		items = this.convertData(items);

		if (!Array.isArray(items)) {
			return undefined;
		}

		var bstream = Array();

		for (var item of Object.values(items)) {
			bstream = this.appendBitstream(bstream, item.bstream);
		}

		return bstream;
	}

	getBitStream(items) {
		var bstream = this.mergeBitStream(items);
		return this.appendPaddingBit(bstream);
	}

	getByteStream(items) {
		var bstream = this.getBitStream(items);
		return this.bitstreamToByte(bstream);
	}

	allocate(setLength) {
		return array_fill(0, setLength, 0);
	}

	newFromNum(bits, num) {
		var bstream = this.allocate(bits);
		var mask = 1 << bits - 1;

		for (var i = 0; i < bits; ++i) {
			if (num & mask) {
				bstream[i] = 1;
			} else {
				bstream[i] = 0;
			}

			mask = mask >> 1;
		}

		return bstream;
	}

	newFromBytes(size, data) {
		var bstream = this.allocate(size * 8);
		var p = 0;

		for (var i = 0; i < size; ++i) {
			var mask = 128;

			for (var j = 0; j < 8; ++j) {
				if (data[i] & mask) {
					bstream[p] = 1;
				} else {
					bstream[p] = 0;
				}

				p++;
				mask = mask >> 1;
			}
		}

		return bstream;
	}

	appendBitstream(bitstream, append) {
		if (!Array.isArray(append) or append.length == 0) {
			return bitstream;
		}

		if (bitstream.length == 0) {
			return append;
		}

		return Object.values(array_merge(bitstream, append));
	}

	appendNum(bitstream, bits, num) {
		if (bits == 0) {
			return 0;
		}

		var b = this.newFromNum(bits, num);
		return this.appendBitstream(bitstream, b);
	}

	appendBytes(bitstream, size, data) {
		if (size == 0) {
			return 0;
		}

		var b = this.newFromBytes(size, data);
		return this.appendBitstream(bitstream, b);
	}

	bitstreamToByte(bstream) {
		if (is_null(bstream)) {
			return undefined;
		}

		var size = bstream.length;

		if (size == 0) {
			return Array();
		}

		var data = array_fill(0, +((size + 7) / 8), 0);
		var bytes = +(size / 8);
		var p = 0;

		for (var i = 0; i < bytes; i++) {
			var v = 0;

			for (var j = 0; j < 8; j++) {
				v = v << 1;
				v |= bstream[p];
				p++;
			}

			data[i] = v;
		}

		if (size & 7) {
			v = 0;

			for (j = 0;; j < (size & 7); j++) {
				v = v << 1;
				v |= bstream[p];
				p++;
			}

			data[bytes] = v;
		}

		return data;
	}

	qrstrset(srctab, x, y, repl, replLen = false) {
		srctab[y] = substr_replace(srctab[y], replLen !== false ? repl.substr(0, replLen) : repl, x, replLen !== false ? replLen : repl.length);
		return srctab;
	}

	getDataLength(version, level) {
		return this.capacity[version][QRCAP_WORDS] - this.capacity[version][QRCAP_EC][level];
	}

	getECCLength(version, level) {
		return this.capacity[version][QRCAP_EC][level];
	}

	getWidth(version) {
		return this.capacity[version][QRCAP_WIDTH];
	}

	getRemainder(version) {
		return this.capacity[version][QRCAP_REMINDER];
	}

	getMinimumVersion(size, level) //the size of input data is greater than QR capacity, try to lover the error correction mode
	{
		for (var i = 1; i <= QRSPEC_VERSION_MAX; ++i) {
			var words = this.capacity[i][QRCAP_WORDS] - this.capacity[i][QRCAP_EC][level];

			if (words >= size) {
				return i;
			}
		}

		return -1;
	}

	lengthIndicator(mode, version) {
		if (mode == QR_MODE_ST) {
			return 0;
		}

		if (version <= 9) {
			var l = 0;
		} else if (version <= 26) {
			l = 1;
		} else {
			l = 2;
		}

		return this.lengthTableBits[mode][l];
	}

	maximumWords(mode, version) {
		if (mode == QR_MODE_ST) {
			return 3;
		}

		if (version <= 9) {
			var l = 0;
		} else if (version <= 26) {
			l = 1;
		} else {
			l = 2;
		}

		var bits = this.lengthTableBits[mode][l];
		var words = (1 << bits) - 1;

		if (mode == QR_MODE_KJ) //the number of bytes is required
			{
				words *= 2;
			}

		return words;
	}

	getEccSpec(version, level, spec) {
		if (spec.length < 5) {
			spec = [0, 0, 0, 0, 0];
		}

		var b1 = this.eccTable[version][level][0];
		var b2 = this.eccTable[version][level][1];
		var data = this.getDataLength(version, level);
		var ecc = this.getECCLength(version, level);

		if (b2 == 0) {
			spec[0] = b1;
			spec[1] = +(data / b1);
			spec[2] = +(ecc / b1);
			spec[3] = 0;
			spec[4] = 0;
		} else {
			spec[0] = b1;
			spec[1] = +(data / (b1 + b2));
			spec[2] = +(ecc / (b1 + b2));
			spec[3] = b2;
			spec[4] = spec[1] + 1;
		}

		return spec;
	}

	putAlignmentMarker(frame, ox, oy) {
		var finder = ["\\xa1\\xa1\\xa1\\xa1\\xa1", "\\xa1\\xa0\\xa0\\xa0\\xa1", "\\xa1\\xa0\\xa1\\xa0\\xa1", "\\xa1\\xa0\\xa0\\xa0\\xa1", "\\xa1\\xa1\\xa1\\xa1\\xa1"];
		var yStart = oy - 2;
		var xStart = ox - 2;

		for (var y = 0; y < 5; y++) {
			frame = this.qrstrset(frame, xStart, yStart + y, finder[y]);
		}

		return frame;
	}

	putAlignmentPattern(version, frame, width) {
		if (version < 2) {
			return frame;
		}

		var d = this.alignmentPattern[version][1] - this.alignmentPattern[version][0];

		if (d < 0) {
			var w = 2;
		} else {
			w = +((width - this.alignmentPattern[version][0]) / d + 2);
		}

		if (w * w - 3 == 1) {
			var x = this.alignmentPattern[version][0];
			var y = this.alignmentPattern[version][0];
			frame = this.putAlignmentMarker(frame, x, y);
			return frame;
		}

		var cx = this.alignmentPattern[version][0];
		var wo = w - 1;

		for (x = 1;; x < wo; ++x) {
			frame = this.putAlignmentMarker(frame, 6, cx);
			frame = this.putAlignmentMarker(frame, cx, 6);
			cx += d;
		}

		var cy = this.alignmentPattern[version][0];

		for (y = 0;; y < wo; ++y) {
			cx = this.alignmentPattern[version][0];

			for (x = 0;; x < wo; ++x) {
				frame = this.putAlignmentMarker(frame, cx, cy);
				cx += d;
			}

			cy += d;
		}

		return frame;
	}

	getVersionPattern(version) {
		if (version < 7 or version > QRSPEC_VERSION_MAX) {
			return 0;
		}

		return this.versionPattern[version - 7];
	}

	getFormatInfo(mask, level) {
		if (mask < 0 or mask > 7) {
			return 0;
		}

		if (level < 0 or level > 3) {
			return 0;
		}

		return this.formatInfo[level][mask];
	}

	putFinderPattern(frame, ox, oy) {
		var finder = ["\\xc1\\xc1\\xc1\\xc1\\xc1\\xc1\\xc1", "\\xc1\\xc0\\xc0\\xc0\\xc0\\xc0\\xc1", "\\xc1\\xc0\\xc1\\xc1\\xc1\\xc0\\xc1", "\\xc1\\xc0\\xc1\\xc1\\xc1\\xc0\\xc1", "\\xc1\\xc0\\xc1\\xc1\\xc1\\xc0\\xc1", "\\xc1\\xc0\\xc0\\xc0\\xc0\\xc0\\xc1", "\\xc1\\xc1\\xc1\\xc1\\xc1\\xc1\\xc1"];

		for (var y = 0; y < 7; y++) {
			frame = this.qrstrset(frame, ox, oy + y, finder[y]);
		}

		return frame;
	}

	createFrame(version) //Finder pattern
	//Separator
	//Format info
	//Timing pattern
	//Alignment pattern
	//Version information
	{
		var width = this.capacity[version][QRCAP_WIDTH];
		var frameLine = str_repeat("\\0", width);
		var frame = array_fill(0, width, frameLine);
		frame = this.putFinderPattern(frame, 0, 0);
		frame = this.putFinderPattern(frame, width - 7, 0);
		frame = this.putFinderPattern(frame, 0, width - 7);
		var yOffset = width - 7;

		for (var y = 0; y < 7; ++y) {
			frame[y][7] = "\\xc0";
			frame[y][width - 8] = "\\xc0";
			frame[yOffset][7] = "\\xc0";
			++yOffset;
		}

		var setPattern = str_repeat("\\xc0", 8);
		frame = this.qrstrset(frame, 0, 7, setPattern);
		frame = this.qrstrset(frame, width - 8, 7, setPattern);
		frame = this.qrstrset(frame, 0, width - 8, setPattern);
		setPattern = str_repeat("\\x84", 9);
		frame = this.qrstrset(frame, 0, 8, setPattern);
		frame = this.qrstrset(frame, width - 8, 8, setPattern, 8);
		yOffset = width - 8;

		for (y = 0;; y < 8; ++y, ++yOffset) {
			frame[y][8] = "\\x84";
			frame[yOffset][8] = "\\x84";
		}

		var wo = width - 15;

		for (var i = 1; i < wo; ++i) {
			frame[6][7 + i] = String.fromCharCode(144 | i & 1);
			frame[7 + i][6] = String.fromCharCode(144 | i & 1);
		}

		frame = this.putAlignmentPattern(version, frame, width);

		if (version >= 7) {
			var vinf = this.getVersionPattern(version);
			var v = vinf;

			for (var x = 0; x < 6; ++x) {
				for (y = 0;; y < 3; ++y) {
					frame[width - 11 + y][x] = String.fromCharCode(136 | v & 1);
					v = v >> 1;
				}
			}

			v = vinf;

			for (y = 0;; y < 6; ++y) {
				for (x = 0;; x < 3; ++x) {
					frame[y][x + (width - 11)] = String.fromCharCode(136 | v & 1);
					v = v >> 1;
				}
			}
		}

		frame[width - 8][8] = "\\x81";
		return frame;
	}

	newFrame(version) {
		if (version < 1 or version > QRSPEC_VERSION_MAX) {
			return undefined;
		}

		if (!(undefined !== this.frames[version])) {
			this.frames[version] = this.createFrame(version);
		}

		if (is_null(this.frames[version])) {
			return undefined;
		}

		return this.frames[version];
	}

	rsBlockNum(spec) {
		return spec[0] + spec[3];
	}

	rsBlockNum1(spec) {
		return spec[0];
	}

	rsDataCodes1(spec) {
		return spec[1];
	}

	rsEccCodes1(spec) {
		return spec[2];
	}

	rsBlockNum2(spec) {
		return spec[3];
	}

	rsDataCodes2(spec) {
		return spec[4];
	}

	rsEccCodes2(spec) {
		return spec[2];
	}

	rsDataLength(spec) {
		return spec[0] * spec[1] + spec[3] * spec[4];
	}

	rsEccLength(spec) {
		return (spec[0] + spec[3]) * spec[2];
	}

	init_rs(symsize, gfpoly, fcr, prim, nroots, pad) {
		for (var rs of Object.values(this.rsitems)) {
			if (rs.pad != pad or rs.nroots != nroots or rs.mm != symsize or rs.gfpoly != gfpoly or rs.fcr != fcr or rs.prim != prim) {
				continue;
			}

			return rs;
		}

		var rs = this.init_rs_char(symsize, gfpoly, fcr, prim, nroots, pad);
		this.rsitems.unshift(rs);
		return rs;
	}

	modnn(rs, x) {
		while (x >= rs.nn) {
			x -= rs.nn;
			x = (x >> rs.mm) + (x & rs.nn);
		}

		return x;
	}

	init_rs_char(symsize, gfpoly, fcr, prim, nroots, pad) //Based on Reed solomon encoder by Phil Karn, KA9Q (GNU-LGPLv2)
	//Check parameter ranges
	//PHP style macro replacement ;)
	//Generate Galois field lookup tables
	//log(zero) = -inf
	//alpha**-inf = 0
	//Find prim-th root of 1, used in decoding
	//convert rs->genpoly[] to index form for quicker encoding
	{
		var rs = undefined;

		if (symsize < 0 or symsize > 8) {
			return rs;
		}

		if (fcr < 0 or fcr >= 1 << symsize) {
			return rs;
		}

		if (prim <= 0 or prim >= 1 << symsize) {
			return rs;
		}

		if (nroots < 0 or nroots >= 1 << symsize) {
			return rs;
		}

		if (pad < 0 or pad >= (1 << symsize) - 1 - nroots) {
			return rs;
		}

		rs = Array();
		rs.mm = symsize;
		rs.nn = (1 << symsize) - 1;
		rs.pad = pad;
		rs.alpha_to = array_fill(0, rs.nn + 1, 0);
		rs.index_of = array_fill(0, rs.nn + 1, 0);
		var NN = rs.nn;
		var A0 = NN;
		rs.index_of[0] = A0;
		rs.alpha_to[A0] = 0;
		var sr = 1;

		for (var i = 0; i < rs.nn; ++i) {
			rs.index_of[sr] = i;
			rs.alpha_to[i] = sr;
			sr <<= 1;

			if (sr & 1 << symsize) {
				sr ^= gfpoly;
			}

			sr &= rs.nn;
		}

		if (sr != 1) //field generator polynomial is not primitive!
			{
				return undefined;
			}

		rs.genpoly = array_fill(0, nroots + 1, 0);
		rs.fcr = fcr;
		rs.prim = prim;
		rs.nroots = nroots;
		rs.gfpoly = gfpoly;

		for (var iprim = 1; iprim % prim != 0; iprim += rs.nn) {}

		rs.iprim = +(iprim / prim);
		rs.genpoly[0] = 1;

		for (i = 0, root = fcr * prim; i < nroots; i++, root += prim) //Multiply rs->genpoly[] by  @**(root + x)
		//rs->genpoly[0] can never be zero
		{
			rs.genpoly[i + 1] = 1;

			for (var j = i; j > 0; --j) {
				if (rs.genpoly[j] != 0) {
					rs.genpoly[j] = rs.genpoly[j - 1] ^ rs.alpha_to[this.modnn(rs, rs.index_of[rs.genpoly[j]] + root)];
				} else {
					rs.genpoly[j] = rs.genpoly[j - 1];
				}
			}

			rs.genpoly[0] = rs.alpha_to[this.modnn(rs, rs.index_of[rs.genpoly[0]] + root)];
		}

		for (i = 0;; i <= nroots; ++i) {
			rs.genpoly[i] = rs.index_of[rs.genpoly[i]];
		}

		return rs;
	}

	encode_rs_char(rs, data, parity) //bits per symbol
	//the total number of symbols in a RS block
	//the address of an array of NN elements to convert Galois field elements in index (log) form to polynomial form
	//the address of an array of NN elements to convert Galois field elements in polynomial form to index (log) form
	//an array of NROOTS+1 elements containing the generator polynomial in index form
	//the number of roots in the RS code generator polynomial, which is the same as the number of parity symbols in a block
	//first consecutive root, index form
	//primitive element, index form
	//prim-th root of 1, index form
	//the number of pad symbols in a block
	{
		var MM = rs.mm;
		var NN = rs.nn;
		var ALPHA_TO = rs.alpha_to;
		var INDEX_OF = rs.index_of;
		var GENPOLY = rs.genpoly;
		var NROOTS = rs.nroots;
		var FCR = rs.fcr;
		var PRIM = rs.prim;
		var IPRIM = rs.iprim;
		var PAD = rs.pad;
		var A0 = NN;
		parity = array_fill(0, NROOTS, 0);

		for (var i = 0; i < NN - NROOTS - PAD; i++) {
			var feedback = INDEX_OF[data[i] ^ parity[0]];

			if (feedback != A0) //feedback term is non-zero
				//This line is unnecessary when GENPOLY[NROOTS] is unity, as it must
				//always be for the polynomials constructed by init_rs()
				{
					feedback = this.modnn(rs, NN - GENPOLY[NROOTS] + feedback);

					for (var j = 1; j < NROOTS; ++j) {
						parity[j] ^= ALPHA_TO[this.modnn(rs, feedback + GENPOLY[NROOTS - j])];
					}
				}

			parity.shift();

			if (feedback != A0) {
				parity.push(ALPHA_TO[this.modnn(rs, feedback + GENPOLY[0])]);
			} else {
				parity.push(0);
			}
		}

		return parity;
	}

};