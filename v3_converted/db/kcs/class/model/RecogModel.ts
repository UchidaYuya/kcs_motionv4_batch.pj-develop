//
//承認に関する情報を取得するモデル
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author katsushi
//@since 2008/04/07
//
//
//
//承認に関する情報を取得するモデル
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author katsushi
//@since 2008/04/07
//

require("MtDBUtil.php");

require("MtOutput.php");

require("MtTableUtil.php");

require("model/ModelBase.php");

require("model/TelModel.php");

//
//コンストラクタ
//
//@author katsushi
//@since 2008/04/07
//
//@param object $O_db
//@access public
//@return void
//
//
//指定されたpostidの承認先postidを取得する
//
//@author katsushi
//@since 2008/04/02
//
//@param integer $postid
//@param integer $pactid
//@access public
//@return integer
//
//
//指定されたpostidに承認先があるか調べる
//
//@author katsushi
//@since 2008/04/10
//
//@param integer $postid
//@param integer $pactid
//@access public
//@return boolean
//
//
//デストラクタ
//
//@author katsushi
//@since 2008/04/07
//
//@access public
//@return void
//
class RecogModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getRecogPostid(postid, pactid) {
		if (is_numeric(postid) == false) {
			this.getOut().errorOut(0, "RecogModel::getRecogPostid() postid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		if (is_numeric(pactid) == false) {
			this.getOut().errorOut(0, "RecogModel::getRecogPostid() pactid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		var sql = "select " + "recognize_tb.postidto " + "from " + "recognize_tb inner join user_tb on recognize_tb.postidto=user_tb.postid " + "where " + "recognize_tb.postidfrom = " + postid + " " + "and user_tb.pactid = " + pactid;
		return this.getDB().queryOne(sql);
	}

	chkRecog(postid, pactid) {
		if (is_numeric(this.getRecogPostid(postid, pactid)) == true) {
			return true;
		}

		return false;
	}

	__destruct() {
		super.__destruct();
	}

};