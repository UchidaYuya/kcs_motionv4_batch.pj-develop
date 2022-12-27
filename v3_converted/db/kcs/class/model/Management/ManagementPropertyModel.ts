//
//移動用Model基底クラス
//
//更新履歴：<br>
//2008/02/27 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/03/17
//@filesource
//@uses ManagementModel
//
//
//
//移動用Model基底クラス
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/03/17
//@uses ManagementModel
//

require("model/Management/ManagementModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/02/21
//
//@param MtSetting $O_Set0
//@param MtOutput $O_Out0
//@param objrct $O_db0
//@param objrct $pactid
//@param objrct $O_manage
//@access public
//@return void
//
//
//元の設定項目を取得 <br>
//初期は管理権限がある項目の中で一番小さいIDのものを取得する <br>
//参照で受け取ったポスト入力値に合体させる
//
//@author houshiyama
//@since 2008/03/19
//
//@param mixed $H_post
//@access public
//@return void
//
//
//getSort
//ソートの値を取得する
//@author 伊達
//@since 2019/01/24
//
//@access protected
//@return void
//
//
//項目設定用sql文作成
//
//@author houshiyama
//@since 2008/03/17
//
//@param array $H_g_sess
//@param array $H_post
//@access public
//@return void
//
//
//カラム名取得
//
//@author houshiyama
//@since 2008/03/19
//
//@access private
//@return void
//
//
//management_property_tbへの削除用SQL文作成
//
//@author houshiyama
//@since 2008/03/19
//
//@param mixed $mid
//@access private
//@return void
//
//
//元のデータを削除する（nullに更新）
//
//@author houshiyama
//@since 2008/03/19
//
//@param mixed $tb
//@param mixed $key
//@access private
//@return void
//
//
//管理記録用insert文作成
//
//@author houshiyama
//@since 2008/03/21
//
//@param mixed $mid
//@access private
//@return void
//
//
//makeDefaultForm
//
//@author igarashi
//@since 2009/06/24
//
//@param mixed $H_post
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/17
//
//@access public
//@return void
//
class ManagementPropertyModel extends ManagementModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getProperty(H_sess) //最初アクセス時
	//NULLじゃなければまーじする 20190124 伊達
	{
		var H_data = undefined;

		if (undefined !== H_sess.SELF.post.mid == false) //$H_data = $this->getManagementProperty( $H_sess["SELF"]["post"]["mid"] );
			{
				var H_mid = this.getUsableManagementType();

				for (var id in H_mid) {
					var name = H_mid[id];
					var mid = id;
					break;
				}

				H_sess.SELF.post.mid = mid;
				H_data = this.getManagementPropertyForEdit(H_sess.SELF.post.mid);
			} else {
			if (undefined !== H_sess.SELF.post.addsubmit == false) //$H_data = $this->getManagementProperty( $H_sess["SELF"]["post"]["mid"] );
				{
					H_data = this.getManagementPropertyForEdit(H_sess.SELF.post.mid);
				}
		}

		if (!is_null(H_data)) //まーじする
			{
				for (var key in H_data) //1000以上は自動設定された値なので、画面には表示したくない
				{
					var value = H_data[key];

					if (value.sort >= 1000) {
						H_data[key].sort = undefined;
					}
				}

				H_sess.SELF.post = array_merge(H_sess.SELF.post, H_data);
			}
	}

	getSort(key, sort) //ソートについて・・・値が設定されていれば使う
	//値が設定されてなければ、デフォルト値を使う
	{
		var cols = Array();
		cols.push({
			name: "text",
			sort: 1000
		});
		cols.push({
			name: "int",
			sort: 2000
		});
		cols.push({
			name: "date",
			sort: 3000
		});
		cols.push({
			name: "mail",
			sort: 4000
		});
		cols.push({
			name: "url",
			sort: 5000
		});
		cols.push({
			name: "select",
			sort: 6000
		});
		var res = undefined;

		if (is_numeric(sort)) //値が設定されているので使う
			{
				res = sort;
			} else //値がないのでデフォルト値いれる
			{
				for (var value of Object.values(cols)) //text1なら、1000 + 1として使う
				//select1なら、6000 + 1として使う
				{
					if (preg_match("/^" + value.name + "/", key)) //列挙値取得
						//基本値 + 列挙値を加算
						//終わり
						{
							var idx = Math.round(str_replace(value.name, "", key));
							res = value.sort + idx;
							break;
						}
				}
			}

		return res;
	}

	doAddPropertySQL(H_g_sess: {} | any[], H_post: {} | any[]) //トランザクションの開始
	//元あるデータを消す
	//管理項目の追加
	{
		this.get_db().beginTransaction();
		var res = this.get_db().exec(this.makeDeleteSQL(H_post.mid));
		var set_null_keys = Array();
		var ins_keys = Array();

		for (var key in H_post) {
			var value = H_post[key];

			if (preg_match("/^text|^int|^date|^mail|^url|^select|^description/", key) == true) //設定があるものは更新
				{
					if ("" != value) //クオートの自動的エスケープ(magic quotes gpc)を無効にする処理を追加 2010/08/12 maeda
						//説明文の場合、ordviewflgをtrueにする S225 hanashima 20201023
						{
							if (get_magic_quotes_gpc() == true) {
								var value = stripslashes(value);
							}

							var sort = this.getSort(key, H_post["sort" + key]);

							if (preg_match("/^description/", key) == true) {
								H_post["cb" + key] = true;
							}

							ins_keys.push("(" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + "," + this.get_db().dbQuote(H_post.mid, "integer", true) + "," + this.get_db().dbQuote(key, "text", true) + "," + this.get_db().dbQuote(value, "text", true) + "," + this.get_db().dbQuote(H_post["cb" + key], "bool", false) + "," + this.get_db().dbQuote(H_post["cbreq" + key], "bool", false) + "," + this.get_db().dbQuote(sort, "integer", false) + "," + this.get_db().dbQuote(H_post["cbreqorder" + key], "bool", false) + "," + this.get_db().dbQuote(H_post["cbhide" + key], "bool", false) + ")");
						} else {
						set_null_keys.push(key);
					}
				}
		}

		if (!!ins_keys) //追加する
			{
				var sql = "insert into management_property_tb (" + this.makePropertyCol().join(",") + ") values ";
				sql += ins_keys.join(",");

				if (this.get_db().exec(sql) != ins_keys.length) {
					this.get_db().rollback();
					return false;
				}
			}

		var tb = undefined;

		switch (H_post.mid) {
			case ManagementPropertyModel.TELMID:
				tb = "tel_tb";
				break;

			case ManagementPropertyModel.ETCMID:
				tb = "card_tb";
				break;

			case ManagementPropertyModel.PURCHMID:
				tb = "purchase_tb";
				break;

			case ManagementPropertyModel.COPYMID:
				tb = "copy_tb";
				break;

			case ManagementPropertyModel.ASSMID:
				tb = "assets_tb";
				break;

			case ManagementPropertyModel.TRANMID:
				tb = "transit_tb";
				break;

			case ManagementPropertyModel.EVMID:
				tb = "ev_tb";
				break;

			default:
				tb = undefined;
				break;
		}

		if (!is_null(tb) && !!set_null_keys) {
			this.get_db().exec(this.makeUpdateNullSQL(tb, set_null_keys));
		}

		if (this.get_db().exec(this.makePropertyLogSQL(H_post.mid)) != 1) {
			this.get_db().rollback();
			return false;
		}

		this.get_db().commit();
		return true;
	}

	makePropertyCol() {
		var A_col = ["pactid", "mid", "col", "colname", "ordviewflg", "requiredflg", "sort", "ordrequiredflg", "telhide"];
		return A_col;
	}

	makeDeleteSQL(mid) {
		var sql = "delete from management_property_tb " + " where pactid=" + this.H_G_Sess.pactid + " and mid=" + mid;
		return sql;
	}

	makeUpdateNullSQL(tb, key) //keyが複数設定されていたら複数設定するぽよ
	{
		var sql_set = "";

		if (Array.isArray(key)) //つなげていく・・
			{
				var sep = "";

				for (var _key of Object.values(key)) {
					sql_set += sep + _key + "=NULL";
					sep = ",";
				}
			} else //設定・・
			{
				sql_set = key + "=NULL";
			}

		var sql = "update " + tb + " set " + sql_set + " where" + " pactid=" + this.H_G_Sess.pactid;
		return sql;
	}

	makePropertyLogSQL(mid) {
		var A_val = [mid, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, "\u7BA1\u7406\u9805\u76EE\u8A2D\u5B9A", "\u7BA1\u7406\u9805\u76EE\u8A2D\u5B9A", undefined, "\u7BA1\u7406\u9805\u76EE\u8A2D\u5B9A", "\u2605\u7BA1\u7406\u9805\u76EE\u8A2D\u5B9A", this.H_G_Sess.postid, undefined, this.H_G_Sess.postname, "", this.H_G_Sess.joker, "\u7BA1\u7406\u9805\u76EE\u8A2D\u5B9A", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeDefaultForm(H_post) //S225 cbreqorderとcbhide追加 hanashima 20201026
	{
		for (var key in H_post) {
			var val = H_post[key];

			if (true == preg_match("/^text|^int|^date|^mail|^url|^select|^description/", key)) {
				if (true == Array.isArray(val)) {
					H_result.reldata[key] = val.colname;
					H_result.ordata["cb" + key] = val.ordviewflg;
					H_result.required["cbreq" + key] = val.requiredflg;
					H_result.required["sort" + key] = val.sort;
					H_result.required["cbreqorder" + key] = val.ordrequiredflg;
					H_result.ordata["cbhide" + key] = val.telhide;
				} else {
					H_result.reldata[key] = val;
				}
			} else {
				H_result.reldata[key] = val;
			}
		}

		return H_result;
	}

	__destruct() {
		super.__destruct();
	}

};