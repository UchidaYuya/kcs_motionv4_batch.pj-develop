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
class ReadSheetDocomo extends ReadSheetBase {
	constructor(O_excel, sheetnumber, groupid) //$this->sort_cnt = 1;
	{
		super(O_excel, sheetnumber, groupid);
		this.H_error_stack.LINE = Array();
		this.carid = 1;
		this.ppid = 1;
		this.sort_cnt = 10;
	}

	readListLine(A_line, cirid) //5G対応 hanashima 20200610
	//5G:93
	//バリュー: 2
	//新規バリュー一括
	//新規バリュー12回
	//MNPバリュー一括
	//機種変12ヶ月超バリュー一括
	//契約変更12ヶ月バリュー一括
	//$this->sort_cnt++;
	{
		var H_ret = Array();
		var buyselid = cirid == 96 ? 93 : 2;

		if (undefined !== A_line[3] == true && is_numeric(A_line[3]) == true) {
			var H_detail = this.getBaseDetail();
			H_detail.onepay = A_line[3];
			H_detail.totalprice = A_line[3];
			H_detail.buyselid = buyselid;
			H_ret.push(H_detail);
		}

		var downmoney = undefined !== A_line[4] ? +A_line[4] : undefined;

		if (undefined !== A_line[5] == true && is_numeric(A_line[5]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.paycnt = 12;
			H_detail.downmoney = downmoney;
			H_detail.onepay = A_line[5];
			H_detail.totalprice = A_line[5] * 12 + downmoney;
			H_detail.buyselid = buyselid;
			H_ret.push(H_detail);
		}

		if (undefined !== A_line[6] == true && is_numeric(A_line[6]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.paycnt = 24;
			H_detail.downmoney = downmoney;
			H_detail.onepay = A_line[6];
			H_detail.totalprice = A_line[6] * 24 + downmoney;
			H_detail.buyselid = buyselid;
			H_ret.push(H_detail);
		}

		if (undefined !== A_line[7] == true && is_numeric(A_line[7]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.paycnt = 36;
			H_detail.downmoney = downmoney;
			H_detail.onepay = A_line[7];
			H_detail.totalprice = A_line[7] * 36 + downmoney;
			H_detail.buyselid = buyselid;
			H_ret.push(H_detail);
		}

		downmoney = undefined !== A_line[9] ? +A_line[9] : undefined;

		if (undefined !== A_line[8] == true && is_numeric(A_line[8]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.buytype2 = 100;
			H_detail.onepay = A_line[8];
			H_detail.totalprice = A_line[8];
			H_detail.buyselid = buyselid;
			H_ret.push(H_detail);
		}

		if (undefined !== A_line[10] == true && is_numeric(A_line[10]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.buytype2 = 100;
			H_detail.paycnt = 12;
			H_detail.downmoney = downmoney;
			H_detail.onepay = A_line[10];
			H_detail.totalprice = A_line[10] * 12 + downmoney;
			H_detail.buyselid = buyselid;
			H_ret.push(H_detail);
		}

		if (undefined !== A_line[11] == true && is_numeric(A_line[11]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.buytype2 = 100;
			H_detail.paycnt = 24;
			H_detail.downmoney = downmoney;
			H_detail.onepay = A_line[11];
			H_detail.totalprice = A_line[11] * 24 + downmoney;
			H_detail.buyselid = buyselid;
			H_ret.push(H_detail);
		}

		if (undefined !== A_line[12] == true && is_numeric(A_line[12]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.buytype2 = 100;
			H_detail.paycnt = 36;
			H_detail.downmoney = downmoney;
			H_detail.onepay = A_line[12];
			H_detail.totalprice = A_line[12] * 36 + downmoney;
			H_detail.buyselid = buyselid;
			H_ret.push(H_detail);
		}

		downmoney = undefined !== A_line[14] ? +A_line[14] : 0;

		if (undefined !== A_line[13] == true && is_numeric(A_line[13]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.buytype1 = 13;
			H_detail.buytype2 = 100;
			H_detail.onepay = A_line[13];
			H_detail.totalprice = A_line[13];
			H_detail.buyselid = buyselid;
			H_ret.push(H_detail);
		}

		if (undefined !== A_line[15] == true && is_numeric(A_line[15]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.buytype1 = 13;
			H_detail.buytype2 = 100;
			H_detail.paycnt = 12;
			H_detail.downmoney = downmoney;
			H_detail.onepay = A_line[15];
			H_detail.totalprice = A_line[15] * 12 + downmoney;
			H_detail.buyselid = buyselid;
			H_ret.push(H_detail);
		}

		if (undefined !== A_line[16] == true && is_numeric(A_line[16]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.buytype1 = 13;
			H_detail.buytype2 = 100;
			H_detail.paycnt = 24;
			H_detail.downmoney = downmoney;
			H_detail.onepay = A_line[16];
			H_detail.totalprice = A_line[16] * 24 + downmoney;
			H_detail.buyselid = buyselid;
			H_ret.push(H_detail);
		}

		if (undefined !== A_line[17] == true && is_numeric(A_line[17]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.buytype1 = 13;
			H_detail.buytype2 = 100;
			H_detail.paycnt = 36;
			H_detail.downmoney = downmoney;
			H_detail.onepay = A_line[17];
			H_detail.totalprice = A_line[17] * 36 + downmoney;
			H_detail.buyselid = buyselid;
			H_ret.push(H_detail);
		}

		downmoney = undefined !== A_line[19] ? +A_line[19] : 0;

		if (undefined !== A_line[18] == true && is_numeric(A_line[18]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.buytype1 = 1;
			H_detail.buytype2 = 12;
			H_detail.onepay = A_line[18];
			H_detail.totalprice = A_line[18];
			H_detail.buyselid = buyselid;
			H_ret.push(H_detail);
		}

		if (undefined !== A_line[20] == true && is_numeric(A_line[20]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.buytype1 = 1;
			H_detail.buytype2 = 12;
			H_detail.paycnt = 12;
			H_detail.downmoney = downmoney;
			H_detail.onepay = A_line[20];
			H_detail.totalprice = A_line[20] * 12 + downmoney;
			H_detail.buyselid = buyselid;
			H_ret.push(H_detail);
		}

		if (undefined !== A_line[21] == true && is_numeric(A_line[21]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.buytype1 = 1;
			H_detail.buytype2 = 12;
			H_detail.paycnt = 24;
			H_detail.downmoney = downmoney;
			H_detail.onepay = A_line[21];
			H_detail.totalprice = A_line[21] * 24 + downmoney;
			H_detail.buyselid = buyselid;
			H_ret.push(H_detail);
		}

		if (undefined !== A_line[22] == true && is_numeric(A_line[22]) == true) {
			H_detail = this.getBaseDetail();
			H_detail.buytype1 = 1;
			H_detail.buytype2 = 12;
			H_detail.paycnt = 36;
			H_detail.downmoney = downmoney;
			H_detail.onepay = A_line[22];
			H_detail.totalprice = A_line[22] * 36 + downmoney;
			H_detail.buyselid = buyselid;
			H_ret.push(H_detail);
		}

		H_ret.sort = this.sort_cnt;

		if (undefined !== A_line[23] == true) {
			H_ret.memo = A_line[23];
		} else {
			H_ret.memo = undefined;
		}

		this.sort_cnt += 10;
		return H_ret;
	}

	__destruct() {}

};