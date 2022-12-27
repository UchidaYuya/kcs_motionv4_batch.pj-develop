//
//注文・受注系用汎用関数集
//
//更新履歴：<br>
//2008/04/16 igarashi
//
//@package Base
//@subpackage Order
//@author igarashi
//@filesource
//@since 2008/04/16
//
///**
//
//注文・受注系用汎用関数集
//
//更新履歴：<br>
//2008/04/16 igarashi
//
//@package Base
//@subpackage Order
//@author igarashi
//@since 2008/04/16
//@uses MtDBUtil
//
//

require("MtUtil.php");

require("MtDateUtil.php");

//新規
//機種変更
//移行
//プラン変更
//オプション変更
//割引変更
//MNP
//解約
//付属品
//その他
//一括プラン変
//名義変更 個→法
//名義変更 法→個
//名義変更 法→法
//未処理
//注文確認中
//振替確認依頼(親)
//振替確認済
//準備中
//振替確認依頼(子)
//振替確認済
//処理中
//保留
//処理済
//出荷済
//処理済
//出荷済
//物流入力依頼
//物流入力済(部分)
//物流入力済
//受領確認依頼
//受領確認済
//完了
//取消
//キャンセル
//端末管理権限
//
//MtSettingオブジェクト
//
//@var mixed
//@access private
//
//
//注文可能なキャリア
//
//@var mixed
//@access private
//
//
//コンストラクタ<br>
//
//DBオブジェクト・セッティングオブジェクト取得
//
//@author igarashi
//@since 2008/04/16
//
//@access public
//@return void
//
//
//singleton
//
//@author igarashi
//@since 2009/07/01
//
//@access public
//@return void
//
//
//日時文字列をタイムスタンプにして返す<br>
//
//
//@author igarashi
//@since 2008/05/21
//
//@access public
//@return string
//
//
//渡された$strを下$digit桁で返す
//$sepdigitが指定されていれば$sepdigit + 1桁目に$sepstrを入れて返す
//$strの型等のチェックをしないので、前提として半角数字とする
//それ以外の値がきた時の動作は保証しない
//
//@author igarashi
//@since 2010/02/03
//
//@param mixed $str
//@param int $digit
//@param string $sepa
//@access public
//@return void
//
//
//makeUnderMaskTelno
//
//@author igarashi
//@since 2010/02/04
//
//@param mixed $str
//@param int $digit
//@param string $mask
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class OrderUtil extends MtUtil {
	static O_Instance = undefined;

	constructor() {
		super();
		this.type_new = "N";
		this.type_chn = "C";
		this.type_shi = "S";
		this.type_pln = "Ppl";
		this.type_opt = "Pop";
		this.type_dsc = "Pdc";
		this.type_mnp = "Nmnp";
		this.type_del = "D";
		this.type_acc = "A";
		this.type_mis = "M";
		this.type_blp = "B";
		this.type_tpc = "Tpc";
		this.type_tcp = "Tcp";
		this.type_tcc = "Tcc";
		this.st_unsest = 50;
		this.st_unchk = 60;
		this.st_trchkreq = 70;
		this.st_trchkcmp = 75;
		this.st_unpre = 80;
		this.st_sub_trchkreq = 90;
		this.st_sub_trchkcmp = 95;
		this.st_unproc = 100;
		this.st_stay = 110;
		this.st_sub_prcfin = 120;
		this.st_sub_shipfin = 130;
		this.st_prcfin = 140;
		this.st_shipfin = 150;
		this.st_loginpreq = 160;
		this.st_loginpfinpart = 170;
		this.st_loginpfin = 180;
		this.st_receiptreq = 190;
		this.st_receiptfin = 200;
		this.st_complete = 210;
		this.st_delete = 220;
		this.st_cancel = 230;
		this.asets_fnc = 130;
		this.buy_unset = 0;
		this.buy_loan = 1;
		this.buy_not_loan = 2;
		this.A_empty = Array();
		this.O_set = MtSetting.singleton();
		this.today = MtDateUtil.getToday();
		this.A_ordcarid = [this.O_set.car_docomo, this.O_set.car_willcom, this.O_set.car_au, this.O_set.car_softbank, this.O_set.car_emobile];
		this.A_contractchng = [this.type_chn, this.type_pln, this.type_opt, this.type_shi, this.type_dsc];
		this.A_delmanagementtype = [this.type_mnp, this.type_del, this.type_chn, this.type_shi, this.type_tcp];
		this.A_machinebuy = [this.type_new, this.type_mnp, this.type_shi, this.type_chn];
		this.A_machinebuyview = [this.type_new, this.type_mnp, this.type_shi, this.type_chn, this.type_acc];
		this.A_register = [this.type_new, this.type_mnp, this.type_shi, this.type_chn, this.type_acc];
		this.A_machineadd = [this.type_new, this.type_mnp, this.type_shi, this.type_chn, this.type_tpc, this.type_tcc];
		this.A_teladd = [this.type_new, this.type_chn, this.type_mnp, this.type_tpc, this.type_tcc];
		this.A_cops = [this.type_cnh, this.type_opt, this.type_pln, this.type_shi];
		this.A_plancourse = [this.type_pln, this.type_opt, this.type_dsc, this.type_del, this.type_blp, this.type_tpc, this.type_tcp, this.type_tcc, this.type_mis];
		this.A_mobilecarrier = [this.O_set.car_docomo, this.O_set.car_willcom, this.O_set.car_au, this.O_set.car_softbank, this.O_set.car_emobile, this.O_set.car_smartphone];
	}

	singleton() {
		if (undefined == OrderUtil.O_Instance) {
			OrderUtil.O_Instance = new OrderUtil();
		}

		return OrderUtil.O_Instance;
	}

	adjustdate(year, month, day, hr = "00:00") {
		var timestamp = mktime(hr, 0, 0, month, day, year);
		timestamp = date("Y-m-d H:i:s", timestamp);
		return timestamp;
	}

	makeDigitUnderTelno(str, digit = 6, sepdigit = 2, sepstr = "-") {
		var length = str.length;

		if (length < digit) {
			return str;
		}

		var start = length - digit;

		if (0 == sepdigit) {
			return str.substr(start);
		} else {
			var result = str.substr(start, sepdigit);
			result += sepstr + str.substr(start + sepdigit);
			return result;
		}

		return str;
	}

	makeUnderMaskTelno(str, digit = 6, mask = "*") {
		var length = str.length;

		if (length < digit) {
			return str;
		}

		var start = length - digit;
		mask = str_pad(mask, start, mask, STR_PAD_LEFT);
		return mask + str.substr(start);
	}

	__destruct() {
		super.__destruct();
	}

};