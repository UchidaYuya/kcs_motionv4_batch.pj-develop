require("model/script/ImportPriceList/ReadSheetBase.php");

//
//sort_cnt
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
class ReadSheetWillcom extends ReadSheetBase {
	constructor(O_excel, sheetnumber, groupid) //$this->sort_cnt = 1;
	{
		super(O_excel, sheetnumber, groupid);
		this.H_error_stack.LINE = Array();
		this.carid = 2;
		this.ppid = 7;
		this.sort_cnt = 10;
	}

	readListLine(A_line, cirid) //選択無し 新規
	//$this->sort_cnt++;
	{
		var H_ret = Array();

		if (undefined !== A_line[3] == true && is_numeric(A_line[3]) == true) {
			var H_detail = this.getBaseDetail();
			H_detail.onepay = A_line[3];
			H_detail.totalprice = A_line[3];
			H_detail.buyselid = 4;
			H_ret.push(H_detail);
		}

		if (undefined !== A_line[4] == true && is_numeric(A_line[4]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.buytype1 = 6;
			H_detail.buytype2 = 9;
			H_detail.onepay = A_line[4];
			H_detail.totalprice = A_line[4];
			H_detail.buyselid = 4;
			H_ret.push(H_detail);
		}

		if (undefined !== A_line[5] == true && is_numeric(A_line[5]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.buytype1 = 10;
			H_detail.buytype2 = 100;
			H_detail.onepay = A_line[5];
			H_detail.totalprice = A_line[5];
			H_detail.buyselid = 4;
			H_ret.push(H_detail);
		}

		H_ret.sort = this.sort_cnt;

		if (undefined !== A_line[6] == true) {
			H_ret.memo = A_line[6];
		} else {
			H_ret.memo = undefined;
		}

		this.sort_cnt += 10;
		return H_ret;
	}

	__destruct() {}

};