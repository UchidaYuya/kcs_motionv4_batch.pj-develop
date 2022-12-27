//
//コピー機ＩＤ変更用モデル
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/05/14
//@uses ManagementCopyModel
//
//
//
//モデル実装のサンプル
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/05/14
//@uses ManagementCopyModel
//

require("model/Management/Copy/ManagementCopyModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/05/14
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
//指定されたＩＤのコピー機ＩＤを取得（最初のアクセス時） <br>
//フォームの初期値作成 <br>
//部署ID決定 <br>
//取得したデータが配下のものではなかったらエラー終了 <br>
//
//@author houshiyama
//@since 2008/05/14
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//更新文を作成する
//
//@author houshiyama
//@since 2008/05/14
//
//@param mixed $H_sess
//@param boolean $pre
//@access public
//@return string
//
//
//管理記録用insert文作成
//
//@author houshiyama
//@since 2008/05/14
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
//@author houshiyama
//@since 2008/05/14
//
//@param mixed $H_sess
//@param mixed $O_form
//@access public
//@return void
//
//
//指定したコピー機を削除（変更画面専用）<br>
//
//キー変更時に使用されるので元のキーを指定<br>
//
//@author houshiyama
//@since 2008/05/14
//
//@param mixed $H_get
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/05/14
//
//@access public
//@return void
//
class CopyModModel extends ManagementCopyModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getManageInfo(H_sess: {} | any[]) //テーブル名の決定
	//データ取得
	//対象が無ければエラー
	{
		this.setTableName(H_sess[CopyModModel.PUB].cym);
		var H_row = this.get_db().queryRowHash(this.makeCopySelectOneSQL(H_sess.SELF.get.manageno, H_sess.SELF.get.coid));

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

		var A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, H_sess[CopyModModel.PUB].current_postid, this.H_Tb.tableno);

		if (-1 !== A_post.indexOf(H_row.postid) === false) {
			this.errorOut(19, "\u51E6\u7406\u5BFE\u8C61\u304C\u914D\u4E0B\u306B\u7121\u3044", false, "./menu.php");
			throw die();
		}

		H_sess.SELF.tableno = this.H_Tb.tableno;
	}

	makeModManageSQL(H_sess, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_copy_tb;
		} else {
			tb = this.H_Tb.copy_tb;
		}

		var sql = this.makeUpdateCopySQL(H_sess.SELF, tb);
		return sql;
	}

	makeModLogSQL(H_post: {} | any[]) {
		if ("" == H_post.recogpostname) {
			H_post.recogpostname = this.getPostName(H_post.recogpostid);
		}

		var A_val = [CopyModModel.COPYMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_post.copyid, H_post.copyid, H_post.copycoid, "\u30B3\u30D4\u30FC\u6A5F\u5909\u66F4", "Change copyID", H_post.recogpostid, "", H_post.recogpostname, "", this.H_G_Sess.joker, "\u5909\u66F4", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	checkInputError(H_sess, O_form, chgflg) //既に登録済みかチェック（キー変更時）
	{
		this.setTableName(H_sess[CopyModModel.PUB].cym);

		if (undefined !== H_sess.SELF.post.modsubmit == true && chgflg == true) {
			if (this.checkCopyExist(H_sess.SELF.post.copyid, H_sess.SELF.post.copycoid) == true) {
				O_form.setElementErrorWrapper("copyid", "\u767B\u9332\u6E08\u307F\u306E\u30B3\u30D4\u30FC\u6A5F\uFF29\uFF24\u3067\u3059");
			}
		}

		if (undefined !== H_sess.SELF.post.modsubmit == true && undefined !== H_sess.SELF.post.pastflg == true && H_sess.SELF.post.pastflg == 1) //配下の部署一覧
			//存在チェック
			{
				var A_prepostid = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_Tb.pretableno);
				var cnt = this.checkPreCopyAuth(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, A_prepostid);

				if (cnt < 1) {
					O_form.setElementErrorWrapper("pastflg", "\u524D\u6708\u306B\u5B58\u5728\u3057\u306A\u3044\u30B3\u30D4\u30FC\u6A5F\u3067\u3059\u3002\u524D\u6708\u5206\u3082\u5909\u66F4\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044");
				}
			}
	}

	makeDelPreManageSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_copy_tb;
		} else {
			tb = this.H_Tb.copy_tb;
		}

		var sql = this.makeDelCopySQL(H_post.pre_copyid, H_post.pre_copycoid, tb);
		return sql;
	}

	__destruct() {
		super.__destruct();
	}

};