//============================================================+
//File name   : tcpdf_parser.php
//Version     : 1.0.001
//Begin       : 2011-05-23
//Last Update : 2012-05-03
//Author      : Nicola Asuni - Tecnick.com LTD - Manor Coach House, Church Hill, Aldershot, Hants, GU12 4RQ, UK - www.tecnick.com - info@tecnick.com
//License     : http://www.tecnick.com/pagefiles/tcpdf/LICENSE.TXT GNU-LGPLv3
//-------------------------------------------------------------------
//Copyright (C) 2011-2012  Nicola Asuni - Tecnick.com LTD
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
//You should have received a copy of the License
//along with TCPDF. If not, see
//<http://www.tecnick.com/pagefiles/tcpdf/LICENSE.TXT>.
//
//See LICENSE.TXT file for more information.
//-------------------------------------------------------------------
//
//Description : This is a PHP class for parsing PDF documents.
//
//============================================================+
//
//@file
//This is a PHP class for parsing PDF documents.<br>
//@package com.tecnick.tcpdf
//@author Nicola Asuni
//@version 1.0.001
//
//include class for decoding filters
//
//@class TCPDF_PARSER
//This is a PHP class for parsing PDF documents.<br>
//@package com.tecnick.tcpdf
//@brief This is a PHP class for parsing PDF documents..
//@version 1.0.001
//@author Nicola Asuni - info@tecnick.com
//
//END OF TCPDF_PARSER CLASS
//============================================================+
//END OF FILE
//============================================================+

require(dirname(__filename) + "/tcpdf_filters.php");

//
//Raw content of the PDF document.
//@private
//
//
//XREF data.
//@protected
//
//
//Array of PDF objects.
//@protected
//
//
//Class object for decoding filters.
//@private
//
//-----------------------------------------------------------------------------
//
//Parse a PDF document an return an array of objects.
//@param $data (string) PDF data to parse.
//@public
//@since 1.0.000 (2011-05-24)
//
//
//Return an array of parsed PDF document objects.
//@return (array) Array of parsed PDF document objects.
//@public
//@since 1.0.000 (2011-06-26)
//
//
//Get xref (cross-reference table) and trailer data from PDF document data.
//@param $offset (int) xref offset (if know).
//@param $xref (array) previous xref array (if any).
//@return Array containing xref and trailer data.
//@protected
//@since 1.0.000 (2011-05-24)
//
//
//Get object type, raw value and offset to next object
//@param $offset (int) Object offset.
//@return array containing object type, raw value and offset to next object
//@protected
//@since 1.0.000 (2011-06-20)
//
//
//Get content of indirect object.
//@param $obj_ref (string) Object number and generation number separated by underscore character.
//@param $offset (int) Object offset.
//@param $decoding (boolean) If true decode streams.
//@return array containing object data.
//@protected
//@since 1.0.000 (2011-05-24)
//
//
//Get the content of object, resolving indect object reference if necessary.
//@param $obj (string) Object value.
//@return array containing object data.
//@protected
//@since 1.0.000 (2011-06-26)
//
//
//Decode the specified stream.
//@param $sdic (array) Stream's dictionary array.
//@param $stream (string) Stream to decode.
//@return array containing decoded stream data and remaining filters.
//@protected
//@since 1.0.000 (2011-06-22)
//
//
//This method is automatically called in case of fatal error; it simply outputs the message and halts the execution.
//@param $msg (string) The error message
//@public
//@since 1.0.000 (2011-05-23)
//
class TCPDF_PARSER {
	constructor(data) //get length
	//initialize class for decoding filters
	//get xref and trailer data
	//parse all document objects
	//release some memory
	{
		this.pdfdata = "";
		this.xref = Array();
		this.objects = Array();

		if (!data) {
			this.Error("Empty PDF data.");
		}

		this.pdfdata = data;
		var pdflen = this.pdfdata.length;
		this.FilterDecoders = new TCPDF_FILTERS();
		this.xref = this.getXrefData();
		this.objects = Array();
		{
			let _tmp_0 = this.xref.xref;

			for (var obj in _tmp_0) {
				var offset = _tmp_0[obj];

				if (!(undefined !== this.objects[obj])) {
					this.objects[obj] = this.getIndirectObject(obj, offset, true);
				}
			}
		}
		delete this.pdfdata;
		this.pdfdata = "";
	}

	getParsedData() {
		return [this.xref, this.objects];
	}

	getXrefData(offset = 0, xref = Array()) //check xref position
	//initialize object number
	//get trailer data
	{
		if (offset == 0) //find last startxref
			{
				if (preg_match_all("/[\r\n]startxref[\\s]*[\r\n]+([0-9]+)[\\s]*[\r\n]+%%EOF/i", this.pdfdata, matches, PREG_SET_ORDER, offset) == 0) {
					this.Error("Unable to find startxref");
				}

				var matches = matches.pop();
				var startxref = matches[1];
			} else //get the first xref at the specified offset
			{
				if (preg_match("/[\r\n]startxref[\\s]*[\r\n]+([0-9]+)[\\s]*[\r\n]+%%EOF/i", this.pdfdata, matches, PREG_OFFSET_CAPTURE, offset) == 0) {
					this.Error("Unable to find startxref");
				}

				startxref = matches[1][0];
			}

		if (strpos(this.pdfdata, "xref", startxref) != startxref) {
			this.Error("Unable to find xref");
		}

		var xoffset = startxref + 5;
		var obj_num = 0;
		offset = xoffset;

		while (preg_match("/^([0-9]+)[\\s]([0-9]+)[\\s]?([nf]?)/im", this.pdfdata, matches, PREG_OFFSET_CAPTURE, offset) > 0) {
			offset = matches[0][0].length + matches[0][1];

			if (matches[3][0] == "n") //create unique object index: [object number]_[generation number]
				//check if object already exist
				{
					var index = obj_num + "_" + Math.round(matches[2][0]);

					if (!(undefined !== xref.xref[index])) //store object offset position
						{
							xref.xref[index] = Math.round(matches[1][0]);
						}

					++obj_num;
					offset += 2;
				} else if (matches[3][0] == "f") {
				++obj_num;
				offset += 2;
			} else //object number (index)
				{
					obj_num = Math.round(matches[1][0]);
				}
		}

		if (preg_match("/trailer[\\s]*<<(.*)>>[\\s]*[\r\n]+startxref[\\s]*[\r\n]+/isU", this.pdfdata, matches, PREG_OFFSET_CAPTURE, xoffset) > 0) {
			var trailer_data = matches[1][0];

			if (!(undefined !== xref.trailer)) //get only the last updated version
				//parse trailer_data
				{
					xref.trailer = Array();

					if (preg_match("/Size[\\s]+([0-9]+)/i", trailer_data, matches) > 0) {
						xref.trailer.size = Math.round(matches[1]);
					}

					if (preg_match("/Root[\\s]+([0-9]+)[\\s]+([0-9]+)[\\s]+R/i", trailer_data, matches) > 0) {
						xref.trailer.root = Math.round(matches[1]) + "_" + Math.round(matches[2]);
					}

					if (preg_match("/Encrypt[\\s]+([0-9]+)[\\s]+([0-9]+)[\\s]+R/i", trailer_data, matches) > 0) {
						xref.trailer.encrypt = Math.round(matches[1]) + "_" + Math.round(matches[2]);
					}

					if (preg_match("/Info[\\s]+([0-9]+)[\\s]+([0-9]+)[\\s]+R/i", trailer_data, matches) > 0) {
						xref.trailer.info = Math.round(matches[1]) + "_" + Math.round(matches[2]);
					}

					if (preg_match("/ID[\\s]*[\\[][\\s]*[<]([^>]*)[>][\\s]*[<]([^>]*)[>]/i", trailer_data, matches) > 0) {
						xref.trailer.id = Array();
						xref.trailer.id[0] = matches[1];
						xref.trailer.id[1] = matches[2];
					}
				}

			if (preg_match("/Prev[\\s]+([0-9]+)/i", trailer_data, matches) > 0) //get previous xref
				{
					xref = this.getXrefData(Math.round(matches[1]), xref);
				}
		} else {
			this.Error("Unable to find trailer");
		}

		return xref;
	}

	getRawObject(offset = 0) //object type to be returned
	//object value to be returned
	//skip initial white space chars: \x00 null (NUL), \x09 horizontal tab (HT), \x0A line feed (LF), \x0C form feed (FF), \x0D carriage return (CR), \x20 space (SP)
	//get first char
	//get object type
	{
		var objtype = "";
		var objval = "";
		offset += strspn(this.pdfdata, "\\x00\\x09\\x0a\\x0c\\x0d\\x20", offset);
		var char = this[`${pdfdata}${offset}`];

		switch (char) {
			case "%":
				//\x25 PERCENT SIGN
				//skip comment and search for next token
				{
					var next = strcspn(this.pdfdata, "\r\n", offset);

					if (next > 0) {
						offset += next;
						return this.getRawObject(this.pdfdata, offset);
					}

					break;
				}

			case "/":
				//\x2F SOLIDUS
				//name object
				{
					objtype = char;
					++offset;

					if (preg_match("/^([^\\x00\\x09\\x0a\\x0c\\x0d\\x20\\s\\x28\\x29\\x3c\\x3e\\x5b\\x5d\\x7b\\x7d\\x2f\\x25]+)/", this.pdfdata.substr(offset, 256), matches) == 1) //unescaped value
						{
							objval = matches[1];
							offset += objval.length;
						}

					break;
				}

			case "(":
			case ")":
				//\x29 RIGHT PARENTHESIS
				//literal string object
				{
					objtype = char;
					++offset;
					var strpos = offset;

					if (char == "(") {
						var open_bracket = 1;

						while (open_bracket > 0) {
							if (!(undefined !== this[`${pdfdata}${strpos}`])) {
								break;
							}

							var ch = this[`${pdfdata}${strpos}`];

							switch (ch) {
								case "\\":
									//REVERSE SOLIDUS (5Ch) (Backslash)
									//skip next character
									{
										++strpos;
										break;
									}

								case "(":
									//LEFT PARENHESIS (28h)
									{
										++open_bracket;
										break;
									}

								case ")":
									//RIGHT PARENTHESIS (29h)
									{
										--open_bracket;
										break;
									}
							}

							++strpos;
						}

						objval = this.pdfdata.substr(offset, strpos - offset - 1);
						offset = strpos;
					}

					break;
				}

			case "[":
			case "]":
				//\x5D RIGHT SQUARE BRACKET
				//array object
				{
					objtype = char;
					++offset;

					if (char == "[") //get array content
						{
							objval = Array();

							do //get element
							{
								var element = this.getRawObject(offset);
								offset = element[2];
								objval.push(element);
							} while (element[0] != "]");

							objval.pop();
						}

					break;
				}

			case "<":
			case ">":
				//\x3E GREATER-THAN SIGN
				{
					if (undefined !== this[`${pdfdata}${offset + 1}`] and this[`${pdfdata}${offset + 1}`] == char) //dictionary object
						{
							objtype = char + char;
							offset += 2;

							if (char == "<") //get array content
								{
									objval = Array();

									do //get element
									{
										element = this.getRawObject(offset);
										offset = element[2];
										objval.push(element);
									} while (element[0] != ">>");

									objval.pop();
								}
						} else //hexadecimal string object
						{
							objtype = char;
							++offset;

							if (char == "<" and preg_match("/^([0-9A-Fa-f]+)[>]/iU", this.pdfdata.substr(offset), matches) == 1) {
								objval = matches[1];
								offset += matches[0].length;
							}
						}

					break;
				}

			default:
				{
					if (this.pdfdata.substr(offset, 6) == "endobj") //indirect object
						{
							objtype = "endobj";
							offset += 6;
						} else if (this.pdfdata.substr(offset, 4) == "null") //null object
						{
							objtype = "null";
							offset += 4;
							objval = "null";
						} else if (this.pdfdata.substr(offset, 4) == "true") //boolean true object
						{
							objtype = "boolean";
							offset += 4;
							objval = "true";
						} else if (this.pdfdata.substr(offset, 5) == "false") //boolean false object
						{
							objtype = "boolean";
							offset += 5;
							objval = "false";
						} else if (this.pdfdata.substr(offset, 6) == "stream") //start stream object
						{
							objtype = "stream";
							offset += 6;

							if (preg_match("/^[\r\n]+(.*)[\r\n]*endstream/isU", this.pdfdata.substr(offset), matches) == 1) {
								objval = matches[1];
								offset += matches[0].length;
							}
						} else if (this.pdfdata.substr(offset, 9) == "endstream") //end stream object
						{
							objtype = "endstream";
							offset += 9;
						} else if (preg_match("/^([0-9]+)[\\s]+([0-9]+)[\\s]+R/iU", this.pdfdata.substr(offset, 33), matches) == 1) //indirect object reference
						{
							objtype = "ojbref";
							offset += matches[0].length;
							objval = Math.round(matches[1]) + "_" + Math.round(matches[2]);
						} else if (preg_match("/^([0-9]+)[\\s]+([0-9]+)[\\s]+obj/iU", this.pdfdata.substr(offset, 33), matches) == 1) //object start
						{
							objtype = "ojb";
							objval = Math.round(matches[1]) + "_" + Math.round(matches[2]);
							offset += matches[0].length;
						} else if ((numlen = strspn(this.pdfdata, "+-.0123456789", offset)) > 0) //numeric object
						{
							objtype = "numeric";
							objval = this.pdfdata.substr(offset, numlen);
							offset += numlen;
						}

					break;
				}
		}

		return [objtype, objval, offset];
	}

	getIndirectObject(obj_ref, offset = 0, decoding = true) //get array of object content
	//object main index
	//return raw object content
	{
		var obj = obj_ref.split("_");

		if (obj === false or obj.length != 2) {
			this.Error("Invalid object reference: " + obj);
			return;
		}

		var objref = obj[0] + " " + obj[1] + " obj";

		if (strpos(this.pdfdata, objref, offset) != offset) //an indirect reference to an undefined object shall be considered a reference to the null object
			{
				return ["null", "null", offset];
			}

		offset += objref.length;
		var objdata = Array();
		var i = 0;

		do //get element
		//decode stream using stream's dictionary information
		{
			var element = this.getRawObject(offset);
			offset = element[2];

			if (decoding and element[0] == "stream" and undefined !== objdata[i - 1][0] and objdata[i - 1][0] == "<<") {
				element[3] = this.decodeStream(objdata[i - 1][1], element[1].substr(1));
			}

			objdata[i] = element;
			++i;
		} while (element[0] != "endobj");

		objdata.pop();
		return objdata;
	}

	getObjectVal(obj) {
		if (obj[0] == "objref") //reference to indirect object
			{
				if (undefined !== this.objects[obj[1]]) //this object has been already parsed
					{
						return this.objects[obj[1]];
					} else if (undefined !== this.xref[obj[1]]) //parse new object
					{
						this.objects[obj[1]] = this.getIndirectObject(obj[1], this.xref[obj[1]], false);
						return this.objects[obj[1]];
					}
			}

		return obj;
	}

	decodeStream(sdic, stream) //get stream lenght and filters
	//decode the stream
	{
		var slength = stream.length;
		var filters = Array();

		for (var k in sdic) {
			var v = sdic[k];

			if (v[0] == "/") {
				if (v[1] == "Length" and undefined !== sdic[k + 1] and sdic[k + 1][0] == "numeric") //get declared stream lenght
					{
						var declength = Math.round(sdic[k + 1][1]);

						if (declength < slength) {
							stream = stream.substr(0, declength);
							slength = declength;
						}
					} else if (v[1] == "Filter" and undefined !== sdic[k + 1]) //resolve indirect object
					{
						var objval = this.getObjectVal(sdic[k + 1]);

						if (objval[0] == "/") //single filter
							{
								filters.push(objval[1]);
							} else if (objval[0] == "[") //array of filters
							{
								for (var flt of Object.values(objval[1])) {
									if (flt[0] == "/") {
										filters.push(flt[1]);
									}
								}
							}
					}
			}
		}

		var remaining_filters = Array();

		for (var filter of Object.values(filters)) {
			if (-1 !== this.FilterDecoders.getAvailableFilters().indexOf(filter)) {
				stream = this.FilterDecoders.decodeFilter(filter, stream);
			} else //add missing filter to array
				{
					remaining_filters.push(filter);
				}
		}

		return [stream, remaining_filters];
	}

	Error(msg) //exit program and print error
	{
		throw die("<strong>TCPDF_PARSER ERROR: </strong>" + msg);
	}

};