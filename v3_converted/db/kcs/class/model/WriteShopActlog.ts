//
//V2用　販売店管理記録書き込み用クラス
//
//注意！V3側は、MtOutput付属の関数群をご利用下さい
//
//@package Shop
//@subpackage Actlog
//@users MtDBUtil
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2009/01/09
//
//
//
//価格表種別型
//
//注意！V3側は、MtOutput付属の関数群をご利用下さい
//
//@package Shop
//@subpackage Actlog
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2009/01/09
//

require("MtDBUtil.php");

//
//自分自身
//
//@var mixed
//@access private
//
//
//O_db
//
//@var mixed
//@access private
//
//
//err_code
//
//@var mixed
//@access private
//
//
//__construct
//
//@author ishizaki
//@since 2008/12/11
//
//@access public
//@return void
//
//
//&singleton
//
//@author ishizaki
//@since 2008/12/11
//
//@static
//@access public
//@return void
//
//
//shop_mnglog_tbへの書き込み
//
//@author ishizaki
//@since 2009/01/08
//
//引数の$H_dataの連想配列
//<code>
//$H_data = array("shopid" => int,
//"groupid" => int,
//"memid" => int,
//"name" => string,
//"postcode" => string,
//"comment1" => string,
//"comment2" => string,
//"kind" => string, //各機能のディレクトリ名を入れよう
//"type" => string,
//"joker_flag" => int
//);
//</code>
//MtOutputの同じ関数をV2側でも使えるように
//
//@param array $H_data
//@access public
//@return boolean
//
//
//getErrorCode
//
//@author ishizaki
//@since 2009/01/09
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/12/11
//
//@access public
//@return void
//
class WriteShopActlog {
	static myself = undefined;

	constructor() {
		this.O_db = MtDBUtil.singleton();
		this.err_code = undefined;
	}

	static singleton() {
		if (true == is_null(WriteShopActlog.myself)) {
			WriteShopActlog.myself = new WriteShopActlog();
		}

		return WriteShopActlog.myself;
	}

	writeShopMnglog(H_data: {} | any[]) {
		if (undefined !== H_data.shopid == false || is_numeric(H_data.shopid) == false) {
			this.err_code = "shop_mnglog\u306B\u306Fshopid\u304C\u5FC5\u8981";
			return false;
		}

		if (undefined !== H_data.groupid == false || is_numeric(H_data.groupid) == false) {
			this.err_code = "shop_mnglog\u306B\u306Fgroupid\u304C\u5FC5\u8981";
			return false;
		}

		if (undefined !== H_data.memid == false || is_numeric(H_data.memid) == false) {
			this.err_code = "shop_mnglog\u306B\u306Fmemid\u304C\u5FC5\u8981";
			return false;
		}

		if (undefined !== H_data.name == false) {
			this.err_code = "shop_mnglog\u306B\u306Fname\u304C\u5FC5\u8981";
			return false;
		}

		if (undefined !== H_data.comment1 == false) {
			this.err_code = "shop_mnglog\u306B\u306Fcomment1\u304C\u5FC5\u8981";
			return false;
		}

		if (undefined !== H_data.kind == false) {
			this.err_code = "shop_mnglog\u306B\u306Fkind\u304C\u5FC5\u8981";
			return false;
		}

		if (undefined !== H_data.type == false) {
			this.err_code = "shop_mnglog\u306B\u306Ftype\u304C\u5FC5\u8981";
			return false;
		}

		var H_default = {
			shopid: undefined,
			groupid: undefined,
			memid: undefined,
			name: undefined,
			postcode: undefined,
			comment1: undefined,
			comment2: undefined,
			kind: undefined,
			type: undefined,
			joker_flag: 0
		};
		H_data = array_merge(H_default, H_data);

		if (H_data.joker_flag == "") {
			H_data.joker_flag = 0;
		}

		var sql = "insert into shop_mnglog_tb(" + "shopid," + "groupid," + "memid," + "name," + "postcode," + "recdate," + "comment1," + "comment2," + "kind," + "type," + "joker_flag " + ") values(" + this.O_db.dbQuote(H_data.shopid, "integer", true) + "," + this.O_db.dbQuote(H_data.groupid, "integer", true) + "," + this.O_db.dbQuote(H_data.memid, "integer", true) + "," + this.O_db.dbQuote(H_data.name, "string", true) + "," + this.O_db.dbQuote(H_data.postcode, "string") + "," + this.O_db.dbQuote(date("Y-m-d H:i:s"), "timestamp") + "," + this.O_db.dbQuote(H_data.comment1, "string", true) + "," + this.O_db.dbQuote(H_data.comment2, "string") + "," + this.O_db.dbQuote(H_data.kind, "string", true) + "," + this.O_db.dbQuote(H_data.type, "string", true) + "," + this.O_db.dbQuote(H_data.joker_flag, "integer") + ")";
		var cnt = this.O_db.exec(sql);

		if (cnt < 1) {
			this.err_code = "shop_mnglog\u3078\u306E\u66F8\u304D\u8FBC\u307F\u5931\u6557";
			return false;
		}

		return true;
	}

	getErrorCode() {
		return this.err_code;
	}

	__destruct() {}

};