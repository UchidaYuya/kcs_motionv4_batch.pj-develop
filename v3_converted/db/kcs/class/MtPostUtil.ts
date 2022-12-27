//
//部署関連のユーティリティ
//
//更新履歴：<br>
//2008/04/02 上杉勝史 作成
//
//@filesource
//@package Base
//@subpackage Post
//@author katsushi
//@since 2008/04/02
//@uses MtOutput
//@uses PostModel
//@uses MtHtmlUtil
//
//
//
//部署関連のユーティリティクラス
//
//@package Base
//@subpackage Post
//@author katsushi
//@since 2008/04/02
//

require("MtOutput.php");

require("model/PostModel.php");

require("MtHtmlUtil.php");

//
//O_Out
//
//@var mixed
//@access private
//
//
//O_PostModel
//
//@var mixed
//@access private
//
//
//O_Html
//
//@var mixed
//@access private
//
//
//コンストラクタ
//
//@author katsushi
//@since 2008/04/02
//
//@access private
//@return void
//
//
//getOut
//
//@author katsushi
//@since 2008/04/02
//
//@access public
//@return void
//
//
//$this->O_PostModelを返す
//
//@author katsushi
//@since 2008/04/02
//
//@access public
//@return object
//
//
//gHtml
//
//@author katsushi
//@since 2008/04/02
//
//@access public
//@return object
//
//
//getPosttreeband
//
//@author katsushi
//@since 2008/04/02
//
//@param integer $pactid
//@param integer $postid
//@param integer $target_postid
//@param string $tableno
//@param string $joint
//@param string $cssclass
//@param boolean $userpostid default 1
//@param boolean $errout
//@param boolean $link（linkツリーにするか否か）
//@param boolean $parent_view（親部署も表示するか否か）
//@access public
//@return string
//
//<code>
//$userpostid 引数の種別
//0 : ユーザー部署コードをつけない
//1 : (ユーザー部署コード)
//2 : [ユーザー部署コード]
//3 : <ユーザー部署コード>
//</code>
//
//
//getTargetLevelPostid
//
//@author katsushi
//@since 2008/04/02
//
//@param mixed $target_postid
//@param mixed $level default 0
//@param mixed $tableno
//@access public
//@return void
//
//
//getTargetLevelPostidFromTel
//
//@author katsushi
//@since 2008/04/09
//
//@param mixed $telno_view
//@param mixed $pactid
//@param mixed $carid
//@param int $level
//@param string $tableno
//@access public
//@return void
//
//
//デストラクタ
//
//@author katsushi
//@since 2008/04/02
//
//@access public
//@return void
//
class MtPostUtil {
	constructor() //$this->O_Html = new MtHtmlUtil();
	{
		this.O_Out = MtOutput.singleton();
		this.O_PostModel = new PostModel();
	}

	getOut() {
		return this.O_Out;
	}

	gPost() {
		return this.O_PostModel;
	}

	gHtml() {
		return this.O_Html;
	}

	getPostTreeBand(pactid, postid, target_postid, tableno = "", joint = " -> ", cssclass = "", userpostid = 1, errout = true, link = true, parent_view = false) //入力パラメータのエラーチェック
	//ユーザー部署コードの種別判定
	//自分の所属部署以下を加えるためのフラグ
	{
		if (is_numeric(pactid) == false) {
			this.getOut().errorOut(0, "MtPostUtil::getPostTreeBand() pactid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		if (is_numeric(postid) == false) {
			this.getOut().errorOut(0, "MtPostUtil::getPostTreeBand() postid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		if (is_numeric(target_postid) == false) {
			this.getOut().errorOut(0, "MtPostUtil::getPostTreeBand() target_postid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		var A_parent_list = this.gPost().getParentList(target_postid, tableno);

		if (A_parent_list == false) {
			return false;
		}

		if (-1 !== A_parent_list.indexOf(postid) == false) {
			if (errout == true) {
				this.getOut().errorOut(12, "MtPostUtil::getPostTreeBand() target_postid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
			} else {
				return false;
			}
		}

		var H_parent_data = this.gPost().getPostDataList(A_parent_list, tableno);

		switch (userpostid) {
			case 0:
				var bracket_s = false;
				var bracket_e = false;
				break;

			case 1:
				bracket_s = "(";
				bracket_e = ")";
				break;

			case 2:
				bracket_s = "[";
				bracket_e = "]";
				break;

			case 3:
				bracket_s = "<";
				bracket_e = ">";
				break;

			default:
				bracket_s = "(";
				bracket_e = ")";
		}

		var A_str = Array();
		var writeflg = false;

		if (true == parent_view) {
			writeflg = true;
		}

		for (var i = 0; i < A_parent_list.length; i++) //自分の所属部署が出てきたら書き込み開始
		{
			if (postid == A_parent_list[i] && parent_view == false) {
				writeflg = true;
			}

			if (true === writeflg) //ユーザー部署コードを整形
				//対象部署はリンクを張らない
				{
					if (userpostid == 0) {
						var linksrc = H_parent_data[A_parent_list[i]].postname;
					} else {
						linksrc = H_parent_data[A_parent_list[i]].postname + bracket_s + H_parent_data[A_parent_list[i]].userpostid + bracket_e;
					}

					if (A_parent_list[i] == target_postid || link == false) {
						var htmlstr = linksrc;
					} else {
						htmlstr = MtHtmlUtil.makePostLink(A_parent_list[i], linksrc);
					}

					A_str.push(htmlstr);
				}
		}

		return A_str.join(joint);
	}

	getTargetLevelPostid(target_postid, level = 0, tableno = "") {
		if (is_numeric(target_postid) == false) {
			this.getOut().errorOut(0, "MtPostUtil::getTargetLevelPostid() target_postid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		var A_parent_list = this.gPost().getParentList(target_postid, tableno);

		if (A_parent_list == false) {
			return false;
		}

		if (undefined !== A_parent_list[level] == false) //↓このエラー処理は末端で実装するように変更
			//$this->getOut()->warningOut(0, "MtPostUtil::getTargetLevelPostid() 指定された階層の部署は見つかりません");
			{
				return false;
			}

		return A_parent_list[level];
	}

	getTargetLevelPostidFromTel(telno_view, pactid, carid, level = 0, tableno = "") {
		if (telno_view == "") {
			this.getOut().errorOut(0, "MtPostUtil::getTargetLevelPostidFromTel() telno_view\u304C\u3042\u308A\u307E\u305B\u3093", false);
		}

		if (is_numeric(pactid) == false) {
			this.getOut().errorOut(0, "MtPostUtil::getTargetLevelPostidFromTel() pactid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		if (is_numeric(carid) == false) {
			this.getOut().errorOut(0, "MtPostUtil::getTargetLevelPostidFromTel() carid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		var target_postid = this.gPost().getPostIdFromTel(telno_view, pactid, carid, tableno);
		return this.getTargetLevelPostid(target_postid, level, tableno);
	}

	getTargetLevelPostidFromUser(userid, pactid, level = 0) {
		if (userid == "") {
			this.getOut().errorOut(0, "MtPostUtil::getTargetLevelPostidFromUser() userid\u304C\u3042\u308A\u307E\u305B\u3093", false);
		}

		if (is_numeric(userid) == false) {
			this.getOut().errorOut(0, "MtPostUtil::getTargetLevelPostidFromUser() userid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		if (is_numeric(pactid) == false) {
			this.getOut().errorOut(0, "MtPostUtil::getTargetLevelPostidFromUser() pactid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		var target_postid = this.gPost().getPostidFromUser(userid, pactid);
		return this.getTargetLevelPostid(target_postid, level);
	}

	__destruct() {}

};