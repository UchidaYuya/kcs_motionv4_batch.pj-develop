//
//ReadSheetBase
//
//@abstract
//@package
//@author katsushi
//@since 2008/11/07
//

require("Spreadsheet/Excel/reader.php");

require("MtSetting.php");

require("model/ProductModel.php");

//
//O_excel
//
//@var mixed
//@access protected
//
//
//O_ini
//
//@var mixed
//@access protected
//
//
//O_product
//
//@var mixed
//@access protected
//
//
//sheetnumber
//
//@var mixed
//@access protected
//
//
//groupid
//
//@var mixed
//@access protected
//
//
//pricename
//
//@var mixed
//@access protected
//
//
//datefrom
//
//@var mixed
//@access protected
//
//
//dateto
//
//@var mixed
//@access protected
//
//
//listheader
//
//@var mixed
//@access protected
//
//
//listfooter
//
//@var mixed
//@access protected
//
//
//defaultflg
//
//@var mixed
//@access protected
//
//
//mailstatus
//
//@var mixed
//@access protected
//
//
//H_error_stack
//
//@var mixed
//@access protected
//
//
//startlist
//
//@var mixed
//@access protected
//
//
//carid
//
//@var mixed
//@access protected
//
//
//ppid
//
//@var mixed
//@access protected
//
//
//sortcomment(中間コメントの出現順)
//
//@var mixed
//@access protected
//
//
//listcomment(中間コメントの内容)
//
//@var mixed
//@access protected
//
//
//H_price_detail
//
//@var mixed
//@access protected
//
//
//__construct
//
//@author katsushi
//@since 2008/11/07
//
//@param mixed $O_excel
//@param mixed $sheetnumber
//@param mixed $groupid
//@access public
//@return void
//
//
//readListLine
//
//@author katsushi
//@since 2008/11/07
//
//@param mixed $A_line
//@param int $cirid 5G対応 20200610 hanashima
//@abstract
//@access protected
//@return void
//
//
//readSheet
//
//@author katsushi
//@since 2008/11/07
//
//@access public
//@return void
//
//
//readListLine
//
//@author katsushi
//@since 2008/11/07
//
//@param mixed $A_line
//@access protected
//@return void
//
//
//getLine
//
//@author katsushi
//@since 2008/11/07
//
//@param mixed $A_line
//@param mixed $name
//@param mixed @col
//@access protected
//@return void
//
//
//getLineYesNo
//
//@author katsushi
//@since 2008/11/07
//
//@param mixed $A_line
//@param mixed $name
//@access protected
//@return void
//
//
//getLineIndispensable
//
//@author katsushi
//@since 2008/11/07
//
//@param mixed $A_line
//@param mixed $name
//@access protected
//@return void
//
//
//getLineDate
//
//@author katsushi
//@since 2008/11/07
//
//@param mixed $A_line
//@param mixed $name
//@access protected
//@return void
//
//
//dateCheck
//
//@author katsushi
//@since 2008/11/19
//
//@access protected
//@return void
//
//
//getPriceListBase
//
//@author katsushi
//@since 2008/11/07
//
//@access public
//@return void
//
//
//getPriceDetail
//
//@author katsushi
//@since 2008/11/07
//
//@access public
//@return void
//
//
//getBaseDetail
//
//@author katsushi
//@since 2008/11/07
//
//@access protected
//@return void
//
//
//getErrorStack
//
//@author katsushi
//@since 2008/11/11
//
//@access public
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/11/06
//
//@access public
//@return void
//
class ReadSheetBase {
	constructor(O_excel, sheetnumber, groupid) //読み取り実行
	//$this->readSheet();
	{
		this.O_excel = O_excel;
		this.O_product = new ProductModel();
		this.sheetnumber = sheetnumber;
		this.groupid = groupid;
		this.O_ini = MtSetting.singleton();
		this.O_ini.loadConfig("pricelist_import");
		this.pricename = undefined;
		this.listheader = undefined;
		this.listfooter = undefined;
		this.datefrom = undefined;
		this.dateto = undefined;
		this.defaultflg = false;
		this.mailstatus = 0;
		this.carid = undefined;
		this.ppid = undefined;
		this.sortcomment = undefined;
		this.listcomment = undefined;
		this.H_price_detail = Array();
		this.H_error_stack = Array();
		this.startlist = false;
	}

	readSheet() {
		if (Array.isArray(this.O_excel.sheets[this.sheetnumber].cells) == false || this.O_excel.sheets[this.sheetnumber].cells.length < 1) {
			return false;
		}

		{
			let _tmp_0 = this.O_excel.sheets[this.sheetnumber].cells;

			for (var row in _tmp_0) //リスト行の読み込み
			{
				var val = _tmp_0[row];

				if (this.startlist == true) {
					var productid = this.getProductid(val);

					if (productid !== undefined) //5G対応 hanashima 20200610
						{
							var cirid = this.O_product.getSearchciridFromProductid(productid);
							this.H_price_detail[productid] = this.readListLine(val, cirid);
						}

					continue;
				}

				if (val[1] == this.O_ini.pl_pricename) {
					this.getLineIndispensable(val, "pricename");
					continue;
				}

				if (val[1] == this.O_ini.pl_listheader) {
					this.getLine(val, "listheader");
					continue;
				}

				if (val[1] == this.O_ini.pl_listfooter) {
					this.getLine(val, "listfooter");
					continue;
				}

				if (val[1] == this.O_ini.pl_datefrom) {
					this.getLineDate(val, "datefrom");
					continue;
				}

				if (val[1] == this.O_ini.pl_dateto) {
					this.getLineDate(val, "dateto");
					continue;
				}

				if (val[1] == this.O_ini.pl_defaultflg) {
					this.getLineYesNo(val, "defaultflg");

					if (this.defaultflg == true) {
						this.dateto = undefined;
						delete this.H_error_stack.dateto;
					} else {
						this.dateCheck();
					}

					continue;
				}

				if (val[1] == this.O_ini.pl_mailstatus) {
					this.getLineYesNo(val, "mailstatus");

					if (this.mailstatus == true) {
						this.mailstatus = 1;
					}
				}

				if (val[1] == this.O_ini.pl_comment) {
					this.getLine(val, "sortcomment");
					this.getLine(val, "listcomment", 4);
					if (!(undefined !== this.sortcomment) || !is_numeric(this.sortcomment)) this.sortcomment = undefined;
				}

				if (val[1] == this.O_ini.pl_startlist) {
					this.startlist = true;
					continue;
				}
			}
		}
	}

	getProductid(A_line) //productidがあればそちらで検索
	{
		if ((undefined !== A_line[2] == false || is_numeric(A_line[2].trim()) == false) && (undefined !== A_line[1] == false || A_line[1].trim() == "")) {
			return undefined;
		}

		var productid = undefined;

		if (undefined !== A_line[2] == true && is_numeric(A_line[2].trim()) == true) {
			if (this.O_product.chkProductId(this.groupid, A_line[2].trim(), this.ppid) == true) {
				productid = +A_line[2].trim();
			}
		}

		if (productid === undefined && undefined !== A_line[1] == true && A_line[1].trim() != "") {
			var A_prodid = this.O_product.getProductIdFromName(this.groupid, A_line[1].trim(), this.ppid);

			if (A_prodid.length == 1) {
				productid = A_prodid.shift();
			} else if (A_prodid.length > 1) {
				this.H_error_stack.LINE.push("[" + A_line[1] + "]\u306F\u8907\u6570\u306E\u5546\u54C1\u304C\u767B\u9332\u3055\u308C\u3066\u308B\u306E\u3067\u5546\u54C1ID\u3067\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044");
				return undefined;
			}
		}

		if (undefined !== this.H_price_detail[productid] == true) {
			this.H_error_stack.LINE.push("[" + A_line[1] + A_line[2] + "]\u306F\u91CD\u8907\u3057\u3066\u3044\u307E\u3059\uFF08\u6700\u521D\u306E\u884C\u304C\u512A\u5148\u3055\u308C\u307E\u3059\uFF09");
			return undefined;
		}

		if (productid == undefined) {
			this.H_error_stack.LINE.push("[" + A_line[1] + A_line[2] + "]\u306F\u5546\u54C1\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
			return undefined;
		}

		return productid;
	}

	getLine(A_line, name, col = 3) {
		if (undefined !== A_line[3] == true && A_line[col] != "") {
			this[name] = A_line[col];
		}
	}

	getLineYesNo(A_line, name) {
		if (undefined !== A_line[3] == true && (A_line[3] == "\u3059\u308B" || preg_match("/^(yes|y)$/i", A_line[3]) == true)) {
			this[name] = true;
		}
	}

	getLineIndispensable(A_line, name) {
		if (undefined !== A_line[3] == false || A_line[3].trim() == "") {
			this.H_error_stack[name] = A_line[1] + "\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093";
		} else {
			this[name] = A_line[3].trim();
		}
	}

	getLineDate(A_line, name) {
		if (undefined !== A_line[3] == false || A_line[3] == "") {
			this.H_error_stack[name] = A_line[1] + "\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093";
		} else //$A_date = explode("/", $A_line[3]);
			//			if(count($A_date) != 3 || checkdate($A_date[1], $A_date[2], $A_date[0]) == false){
			//				$this->H_error_stack[$name] = $A_line[1] . "の日付が不正です";
			//			}
			//			else{
			//				$this->{$name} = str_pad($A_date[0], 4, "0", STR_PAD_LEFT) . "-" .
			//								 str_pad($A_date[1], 2, "0", STR_PAD_LEFT) . "-" .
			//								 str_pad($A_date[2], 2, "0", STR_PAD_LEFT) . " " .
			//								 "00:00:00";
			//			}
			{
				this[name] = date("Y-m-d H:i:s", mktime(0, 0, 0, 1, A_line[3] - 1, 1900));
			}
	}

	dateCheck() {
		var from = +str_replace("-", "", this.datefrom.substr(0, 10));
		var to = +str_replace("-", "", this.dateto.substr(0, 10));

		if (from >= to) {
			this.H_error_stack.dateto = this.O_ini.pl_dateto + "\u304C" + this.O_ini.pl_datefrom + "\u3088\u308A\u524D\u306B\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059";
		}
	}

	getPriceListBase() {
		return {
			shopid: "",
			carid: this.carid,
			ppid: this.ppid,
			pricename: this.pricename,
			datefrom: this.datefrom,
			dateto: this.dateto,
			listheader: this.listheader,
			listfooter: this.listfooter,
			groupid: this.groupid,
			defaultflg: this.defaultflg,
			mailstatus: this.mailstatus,
			author: "",
			sortcomment: this.sortcomment,
			listcomment: this.listcomment
		};
	}

	getPriceDetail() {
		return this.H_price_detail;
	}

	getBaseDetail() {
		return {
			buytype1: 0,
			buytype2: 0,
			paycnt: 1,
			downmoney: 0,
			onepay: 0,
			totalprice: 0,
			buyselid: 0
		};
	}

	getErrorStack() {
		return this.H_error_stack;
	}

	__destruct() {}

};