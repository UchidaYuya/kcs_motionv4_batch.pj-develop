//
//EV ID変更用モデル
//
//@package Management
//@subpackage Model
//@filesource
//@author maeda
//@since 2010/07/23
//@uses ManagementEvModel
//
//
//
//モデル実装のサンプル
//
//@package Management
//@subpackage Model
//@author maeda
//@since 2010/07/23
//@uses ManagementEvModel
//

require("model/Management/Ev/ManagementEvModel.php");

//
//コンストラクター
//
//@author maeda
//@since 2010/07/23
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param MtOutput $O_manage
//@access public
//@return void
//
//
//変更用データ取得 <br>
//
//テーブル名の決定 <br>
//指定されたＩＤのEV IDを取得（最初のアクセス時） <br>
//フォームの初期値作成 <br>
//部署ID決定 <br>
//取得したデータが配下のものではなかったらエラー終了 <br>
//
//@author maeda
//@since 2010/07/23
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//更新文を作成する
//
//@author maeda
//@since 2010/08/04
//
//@param mixed $H_sess
//@param boolean $pre
//@access public
//@return string
//
//
//管理記録用insert文作成
//
//@author maeda
//@since 2010/08/04
//
//@param array $H_post
//@access public
//@return string
//
//
//DBが必要なエラーチェック <br>
//既に登録済みかチェック（キー変更時） <br>
//前月に存在するかチェック（前月も変更時） <br>
//
//@author maeda
//@since 2010/07/23
//
//@param mixed $H_sess
//@param mixed $O_form
//@access public
//@return void
//
//
//指定したEV IDを削除（変更画面専用）<br>
//
//キー変更時に使用されるので元のキーを指定<br>
//
//@author maeda
//@since 2010/08/04
//
//@param mixed $H_get
//@access protected
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2010/07/23
//
//@access public
//@return void
//
class EvModModel extends ManagementEvModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getManageInfo(H_sess: {} | any[]) //テーブル名の決定
	//データ取得
	//対象が無ければエラー
	//キャリア情報を渡す 2010/08/12 maeda
	{
		this.setTableName(H_sess[EvModModel.PUB].cym);
		var H_row = this.get_db().queryRowHash(this.makeEvSelectOneSQL(H_sess.SELF.get.manageno, H_sess.SELF.get.coid));

		if (Array.isArray(H_row) === false) {
			this.errorOut(19, "\u51E6\u7406\u5BFE\u8C61\u304C\u7121\u3044", false, "./menu.php");
			throw die();
		}

		if (undefined !== H_sess.SELF.post.modsubmit == false) //初期値作成
			//部署ID設定
			{
				H_sess.SELF.post = array_merge(H_sess.SELF.post, H_row);
				H_sess.SELF.post.recogpostid = H_row.postid;
			}

		var A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, H_sess[EvModModel.PUB].current_postid, this.H_Tb.tableno);

		if (-1 !== A_post.indexOf(H_row.postid) === false) {
			this.errorOut(19, "\u51E6\u7406\u5BFE\u8C61\u304C\u914D\u4E0B\u306B\u7121\u3044", false, "./menu.php");
			throw die();
		}

		H_sess.SELF.tableno = this.H_Tb.tableno;
		H_sess.SELF.carrier = this.getEvCoData();
	}

	makeModManageSQL(H_sess, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_ev_tb;
		} else {
			tb = this.H_Tb.ev_tb;
		}

		var sql = this.makeUpdateEvSQL(H_sess.SELF, tb);
		return sql;
	}

	makeModLogSQL(H_post: {} | any[], cym) {
		if ("" == H_post.recogpostname) {
			H_post.recogpostname = this.getPostName(H_post.recogpostid);
		}

		var pastflg_view = "";

		if (undefined !== H_post.pastflg == true && 1 == H_post.pastflg) {
			pastflg_view = "\uFF08\u524D\u6708\u5206\u3082\u5909\u66F4\uFF09";
			var pastflg_view_eng = "\uFF08Change last month\uFF09";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [EvModModel.EVMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_post.evid, H_post.evid, H_post.evcoid, "EV ID\u5909\u66F4" + str + pastflg_view, "Change evid" + str_eng + pastflg_view_eng, H_post.recogpostid, "", H_post.recogpostname, "", this.H_G_Sess.joker, "\u5909\u66F4", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	checkInputError(H_sess, O_form, chgflg) //既に登録済みかチェック（キー変更時）
	{
		this.setTableName(H_sess[EvModModel.PUB].cym);

		if (undefined !== H_sess.SELF.post.modsubmit == true && chgflg == true) {
			if (this.checkEvExist(H_sess.SELF.post.evid, H_sess.SELF.post.evcoid) == true) {
				O_form.setElementErrorWrapper("evid", "\u767B\u9332\u6E08\u307F\u306EID\u3067\u3059");
			}

			if (1 == H_sess.SELF.post.pastflg) {
				if (this.checkEvExist(H_sess.SELF.post.evid, H_sess.SELF.post.evcoid, true) == true) {
					O_form.setElementErrorWrapper("evid", "\u524D\u6708\u3067\u767B\u9332\u6E08\u307F\u306EID\u3067\u3059\u3002\u524D\u6708\u5206\u3082\u5909\u66F4\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
				}
			}
		}

		if (undefined !== H_sess.SELF.post.modsubmit == true && undefined !== H_sess.SELF.post.pastflg == true && H_sess.SELF.post.pastflg == 1) //配下の部署一覧
			//存在チェック
			{
				var A_prepostid = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_Tb.pretableno);
				var cnt = this.checkPreEvAuth(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, A_prepostid);

				if (cnt < 1) {
					O_form.setElementErrorWrapper("pastflg", "\u524D\u6708\u306B\u5B58\u5728\u3057\u306A\u3044ID\u3067\u3059\u3002\u524D\u6708\u5206\u3082\u5909\u66F4\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
				}
			}
	}

	makeDelPreManageSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_ev_tb;
		} else {
			tb = this.H_Tb.ev_tb;
		}

		var sql = this.makeDelEvSQL(H_post.pre_evid, H_post.pre_evcoid, tb);
		return sql;
	}

	__destruct() {
		super.__destruct();
	}

};