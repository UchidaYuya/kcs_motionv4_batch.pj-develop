//
//資産変更用モデル
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/06/10
//@uses ManagementAssetsModel
//
//
//
//資産変更用モデル
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/06/10
//@uses ManagementAssetsModel
//

require("model/Management/Assets/ManagementAssetsModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/06/10
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param MtOutput $O_manage
//@access public
//@return void
//
//
//指定されたＩＤの資産情報を取得（最初のアクセス時） <br>
//テーブル名の決定 <br>
//指定されたＩＤの資産情報を取得 <br>
//前月分の該当データのシステムIDを取得（当月変更時のみ） <br>
//
//@author houshiyama
//@since 2008/06/10
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//更新文を作成する
//
//@author houshiyama
//@since 2008/06/10
//
//@param mixed $H_sess
//@param mixed $assetsid
//@param boolean $pre
//@access public
//@return string
//public function makeModManageSQL( $H_sess, $assetsid, $pre=false ){
//if( true == $pre ){
//$tb = $this->H_Tb["pre_assets_tb"];
//}
//else{
//$tb = $this->H_Tb["assets_tb"];
//}
//
//$sql = $this->makeUpdateAssetsSQL( $H_sess["SELF"], $assetsid, $tb );
//
//return $sql;
//}
//
//
//管理記録用insert文作成
//
//@author houshiyama
//@since 2008/06/10
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
//@since 2008/06/10
//
//@param mixed $H_sess
//@param mixed $O_form
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/06/10
//
//@access public
//@return void
//
class AssetsModModel extends ManagementAssetsModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getManageInfo(H_sess: {} | any[]) //テーブル名の決定
	//データ取得
	//対象が無ければエラー
	{
		this.setTableName(H_sess[AssetsModModel.PUB].cym);
		var H_row = this.get_db().queryRowHash(this.makeAssetsSelectOneSQL(H_sess.SELF.get.manageno));

		if (Array.isArray(H_row) === false) {
			this.errorOut(19, "\u51E6\u7406\u5BFE\u8C61\u304C\u7121\u3044", false, "./menu.php");
			throw die();
		}

		var A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, H_sess[AssetsModModel.PUB].current_postid, this.H_Tb.tableno);

		if (-1 !== A_post.indexOf(H_row.postid) === false) {
			this.errorOut(19, "\u51E6\u7406\u5BFE\u8C61\u304C\u914D\u4E0B\u306B\u7121\u3044", false, "./menu.php");
			throw die();
		}

		if (undefined !== H_sess.SELF.post.modsubmit == false) //データ取得
			//ajax用のhidden要素に値を入れる
			//初期値作成
			//キャリアと回線とシリーズと機種と色
			//productidがありsearchcaridが空
			//プルダウン優先
			{
				H_row = this.get_db().queryRowHash(this.makeAssetsSelectOneSQL(H_sess.SELF.get.manageno));

				for (var key in H_row) {
					var val = H_row[key];

					if (preg_match("/id$/", key) == true) {
						var ajkey = key.replace(/id$/g, "aj");
						H_row[ajkey] = val;
					}
				}

				H_sess.SELF.post = array_merge(H_sess.SELF.post, H_row);

				if ((H_sess.SELF.post.productid != undefined || H_sess.SELF.post.productid != "") && (H_sess.SELF.post.searchcarid == undefined || H_sess.SELF.post.searchcarid == "")) {
					var O_model = new ProductModel();
					H_sess.SELF.post.searchcarid = O_model.getSearchcaridFromProductid(H_sess.SELF.post.productid);
				}

				if ((H_sess.SELF.post.productid != undefined || H_sess.SELF.post.productid != "") && (H_sess.SELF.post.searchcirid == undefined || H_sess.SELF.post.searchcirid == "")) {
					O_model = new ProductModel();
					H_sess.SELF.post.searchcirid = O_model.getSearchciridFromProductid(H_sess.SELF.post.productid);
					H_sess.SELF.post.searchciraj = H_sess.SELF.post.searchcirid;
				}

				if ((H_sess.SELF.post.productid != undefined || H_sess.SELF.post.productid != "") && (H_sess.SELF.post.seriesid == undefined || H_sess.SELF.post.seriesid == "")) {
					O_model = new ProductModel();
					H_sess.SELF.post.seriesid = O_model.getSeriesnameFromProductid(H_sess.SELF.post.productid);
					H_sess.SELF.post.seriesaj = H_sess.SELF.post.seriesid;
					H_sess.SELF.post.seriesname = H_sess.SELF.post.seriesid;
				}

				H_sess.SELF.post.searchcarid = H_sess.SELF.post.search_carid;
				H_sess.SELF.post.searchcaraj = H_sess.SELF.post.search_caraj;
				H_sess.SELF.post.searchcirid = H_sess.SELF.post.search_cirid;
				H_sess.SELF.post.searchciraj = H_sess.SELF.post.search_ciraj;
				H_sess.SELF.post.seriesid = H_sess.SELF.post.seriesname;
				H_sess.SELF.post.seriesaj = H_sess.SELF.post.seriesname;

				if (H_sess.SELF.post.productid != "") {
					H_sess.SELF.post.productid = H_sess.SELF.post.productid + ":" + H_sess.SELF.post.productname;
					H_sess.SELF.post.productname = "";
				}

				if (H_sess.SELF.post.branchid != "") {
					H_sess.SELF.post.branchid = H_sess.SELF.post.branchid + ":" + H_sess.SELF.post.property;
					H_sess.SELF.post.property = "";
				}

				H_sess.SELF.post.recogpostid = H_row.postid;
			}

		H_sess.SELF.tableno = this.H_Tb.tableno;
	}

	makeModLogSQL(H_post: {} | any[]) {
		if ("" == H_post.recogpostname) {
			H_post.recogpostname = this.getPostName(H_post.recogpostid);
		}

		var A_val = [AssetsModModel.ASSMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_post.assetsno, H_post.assetsno, H_post.assetstypeid, "\u8CC7\u7523\u5909\u66F4", "Change assets", H_post.recogpostid, "", H_post.recogpostname, "", this.H_G_Sess.joker, "\u5909\u66F4", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	checkInputError(H_sess, O_form, chgflg) //既に登録済みかチェック（キー変更時）
	{
		this.setTableName(H_sess[AssetsModModel.PUB].cym);

		if (undefined !== H_sess.SELF.post.modsubmit == true && chgflg == true) {
			if (this.checkAssetsNoExist(H_sess.SELF.post.assetsno) == true) {
				if (this.H_G_Sess.language == "ENG") {
					O_form.setElementErrorWrapper("assetsno", "Management No. has already been registered.");
				} else {
					O_form.setElementErrorWrapper("assetsno", "\u767B\u9332\u6E08\u307F\u306E\u7BA1\u7406\u756A\u53F7\u3067\u3059");
				}
			}
		}

		if (undefined !== H_sess.SELF.post.modsubmit == true && undefined !== H_sess.SELF.post.pastflg == true && H_sess.SELF.post.pastflg == 1) //配下の部署一覧
			//存在チェック
			{
				var A_prepostid = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_Tb.pretableno);
				var cnt = this.checkPreAssetsAuth(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, A_prepostid);

				if (cnt < 1) {
					if (this.H_G_Sess.language == "ENG") {
						O_form.setElementErrorWrapper("pastflg", "Property does not exist in the previous month.Uncheck the change for the previous month.");
					} else {
						O_form.setElementErrorWrapper("pastflg", "\u524D\u6708\u306B\u5B58\u5728\u3057\u306A\u3044\u8CC7\u7523\u3067\u3059\u3002\u524D\u6708\u5206\u3082\u5909\u66F4\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044");
					}
				}
			}
	}

	__destruct() {
		super.__destruct();
	}

};