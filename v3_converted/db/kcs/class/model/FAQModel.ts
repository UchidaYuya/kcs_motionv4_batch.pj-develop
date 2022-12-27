//
//お問い合わせの基底モデル
//
//更新履歴
//2008/08/27	石崎公久	作成
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//
//
//
//お問い合わせの基底モデル
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//

require("model/ModelBase.php");

//
//コンストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@return void
//
//
//会社権限のfncidリストを受け取りキャリア注文権限だけ抜き出してハッシュで返す
//
//@author ishizaki
//@since 2008/08/28
//
//@param mixed $A_auth
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@return void
//
class FAQModel extends ModelBase {
	constructor() {
		super();
	}

	getOrderable(A_auth) {
		var H_auth = Array();

		if (true == (-1 !== A_auth.indexOf(26))) {
			H_auth["26"] = {
				fncid: 26,
				fncname: "docomo"
			};
		}

		if (true == (-1 !== A_auth.indexOf(27))) {
			H_auth["27"] = {
				fncid: 27,
				fncname: "au"
			};
		}

		if (true == (-1 !== A_auth.indexOf(28))) {
			H_auth["28"] = {
				fncid: 28,
				fncname: "\u30BD\u30D5\u30C8\u30D0\u30F3\u30AF"
			};
		}

		if (true == (-1 !== A_auth.indexOf(85))) {
			H_auth["85"] = {
				fncid: 85,
				fncname: "EMOBILE"
			};
		}

		if (true == (-1 !== A_auth.indexOf(39))) {
			H_auth["39"] = {
				fncid: 39,
				fncname: "WILLCOM"
			};
		}

		if (true == (-1 !== A_auth.indexOf(138))) {
			H_auth["138"] = {
				fncid: 138,
				fncname: "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3"
			};
		}

		return H_auth;
	}

	__destruct() {
		super.__destruct();
	}

};