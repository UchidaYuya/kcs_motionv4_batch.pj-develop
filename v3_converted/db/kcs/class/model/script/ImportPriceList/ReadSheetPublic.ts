require("model/script/ImportPriceList/ReadSheetBase.php");

require("model/PriceModel.php");

require("model/BuySelectModel.php");

//
//sort_cnt
//
//@var mixed
//@access protected
//
//
//buyselid
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
//@access protected
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/11/07
//
//@access public
//@return void
//
class ReadSheetPublic extends ReadSheetBase {
	constructor(O_excel, sheetnumber, groupid, buyselid, ppid) {
		super(O_excel, sheetnumber, groupid);
		this.H_error_stack.LINE = Array();
		this.ppid = 0;
		this.carid = 99;
		this.buyselid = 0;
		var O_bs = new BuySelectModel();
		var buyselname = O_bs.getBuySelectName(buyselid);

		if (buyselname !== undefined) {
			this.buyselid = buyselid;
		}

		if (is_numeric(ppid) == true) {
			var O_pp = new PriceModel();
			var carid = O_pp.getCaridFromPPID(ppid);

			if (carid !== undefined) {
				this.ppid = ppid;
				this.carid = carid;
			}
		}

		this.sort_cnt = 10;
	}

	readListLine(A_line, cirid) //付属品汎用
	//$this->sort_cnt++;
	{
		var H_ret = Array();

		if (undefined !== A_line[3] == true && is_numeric(A_line[3]) == true) {
			var H_detail = this.getBaseDetail();
			H_detail.onepay = A_line[3];
			H_detail.totalprice = A_line[3];
			H_detail.buyselid = this.buyselid;
			H_ret.push(H_detail);
		}

		H_ret.sort = this.sort_cnt;

		if (undefined !== A_line[4] == true) {
			H_ret.memo = A_line[4];
		} else {
			H_ret.memo = undefined;
		}

		this.sort_cnt += 10;
		return H_ret;
	}

	__destruct() {}

};