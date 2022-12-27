//
//お問い合わせベースプロック
//
//更新履歴：<br>
//2008/08/27 石崎 作成
//
//@uses ProcessBaseHtml
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//@filesource
//
//
//error_reporting(E_ALL|E_STRICT);
//
//お問い合わせメニュー
//
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//

require("process/ProcessBaseHtml.php");

//
//O_view
//
//@var mixed
//@access protected
//
//
//trueだとdisplayFinishを呼ぶ
//
//@var boolean
//@access private
//
//
//H_param
//
//@var mixed
//@access protected
//
//
//コンストラクト
//
//@author ishizaki
//@since 2008/06/26
//
//@param array $H_param
//@access public
//@return void
//
//
//setFinishFlag
//
//@author ishizaki
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//継承先でViewを選択
//
//@author ishizaki
//@since 2008/10/16
//
//@abstract
//@access protected
//@return void
//
//
//継承先でModelを選択
//
//@author ishizaki
//@since 2008/10/16
//
//@abstract
//@access protected
//@return void
//
//
//addNewClass
//
//@author ishizaki
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//selfProcessHead 現在未使用
//
//@author ishizaki
//@since 2008/10/16
//
//@param array $H_param
//@access protected
//@return void
//
//
//selfProcessBody 継承先の個別のプロセス
//
//@author ishizaki
//@since 2008/10/16
//
//@param array $H_param
//@access protected
//@return void
//
//
//selfProcessFoot 現在未使用
//
//@author ishizaki
//@since 2008/10/16
//
//@param array $H_param
//@access protected
//@return void
//
//
//doExecute
//
//@author ishizaki
//@since 2008/08/27
//
//@param array $H_param
//@access public
//@return void
//
//
//filteringFunctionOrder
//
//@author ishizaki
//@since 2008/08/27
//
//@access protected
//@return void
//
//
//filteringFunction
//
//@author ishizaki
//@since 2008/08/27
//
//@param mixed $H_auth
//@access protected
//@return void
//
//
//デストラクト
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
class FAQBaseProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.H_param = H_param;
		this.getView();
		this.getModel();
		this.addNewClass();
		this.finishFlag = false;
		this.getSetting().loadConfig("H_fnc_car");
	}

	setFinishFlag() {
		this.finishFlag = true;
	}

	addNewClass() {}

	selfProcessHead(H_param) {}

	selfProcessBody(H_param) {}

	selfProcessFoot(H_param) {}

	doExecute(H_param: {} | any[] = Array()) //ログインチェック
	//継承先プロセス
	//画面表示
	{
		this.O_view.startCheck();
		this.selfProcessBody(H_param);

		if (true === this.finishFlag) {
			this.O_view.displayFinish();
		} else {
			this.O_view.displayHTML();
		}
	}

	filteringFunctionOrder(A_car, type = true, O_auth = undefined) {
		if (true == is_null(O_auth)) {
			O_auth = this.O_view.getAuthObject();
		}

		if (false == O_auth.chkUserFuncIni(this.O_view.gSess().userid, "fnc_mt_order_adm")) {
			return false;
		}

		var A_auth = this.O_view.getAuthPact();

		if (false === type) {
			var A_temp = this.O_model.getOrderable(A_auth, A_car);

			if (A_temp === false) {
				return Array();
			}

			return Object.keys(this.O_model.getOrderable(A_auth, A_car));
		}

		return this.O_model.getOrderable(A_auth, A_car);
	}

	filteringFunction(H_auth, type = true) //親子関係の精査
	//メニューリストの生成
	//その他を足す
	{
		for (var fncid in H_auth) {
			var H_val = H_auth[fncid];

			if (H_val.parent != "") {
				if (H_val.parent in H_auth == true) {
					delete H_auth[fncid];
				}
			}
		}

		for (var fncid in H_auth) {
			var H_val = H_auth[fncid];

			for (var i = 2; i <= 6; i++) {
				if (-1 !== this.getSetting()["A_group" + i].indexOf(fncid) == true) //array_chunkで、ハッシュキーが消えてしまうので避難
					{
						if (undefined !== H_menu[i] == false) {
							H_menu[i] = Array();
						}

						H_menu[i][fncid] = H_val;
						H_menu[i][fncid].fncid = fncid;
						break;
					}
			}
		}

		var H_tmp = Array();

		for (var value of Object.values(H_menu)) {
			H_tmp += value;
		}

		H_tmp["0"] = {
			fncname: "\u305D\u306E\u4ED6",
			fncid: 0
		};

		if (type === false) {
			return Object.keys(H_tmp);
		}

		var cnt = 3 - H_tmp.length % 3;

		if (3 != cnt) {
			for (var x = 0; x < cnt; x++) {
				H_tmp.push(Array());
			}
		}

		return array_chunk(H_tmp, 3);
	}

	__destruct() {
		super.__destruct();
	}

};