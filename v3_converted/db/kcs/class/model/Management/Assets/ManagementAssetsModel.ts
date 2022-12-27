//
//資産管理用モデル
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/06/06
//@uses ManagementModelBase
//@uses AssetsCoModel
//
//
//
//資産管理用モデル
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/06/06
//@uses ManagementModelBase
//@uses AssetsTypeModel
//

require("model/Management/ManagementModelBase.php");

require("model/AssetsTypeModel.php");

require("model/ProductModel.php");

require("model/AssetsTypeModel.php");

require("model/CarrierModel.php");

require("model/CircuitModel.php");

//
//電話管理プルダウン初期値
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/06/06
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_Out0
//@access public
//@return void
//
//
//資産種別一覧データ取得
//
//@author houshiyama
//@since 2008/06/06
//
//@access public
//@return array
//@uses AssetsTypeModel
//
//
//電話会社一覧データ取得
//
//@author houshiyama
//@since 2008/08/19
//
//@access public
//@return array
//@uses CarrierModel
//
//
//回線種別一覧データ取得
//
//@author houshiyama
//@since 2008/08/19
//
//@param mixed $carid
//@access public
//@return array
//@uses CircuitModel
//
//
//資産一覧データ取得（使用中のみ）
//
//資産種別配列取得（使用中）
//
//@author houshiyama
//@since 2008/06/06
//
//@param array $A_post（部署一覧）
//@param mixed $cym
//@param array $H_post（CGIパラメータ）
//@access public
//@return void
//
//
//指定したIDの資産情報取得SQL文作成
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $assetsid
//@access public
//@return void
//
//
//assets_tbへの固定的なwhere句作成
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $assetsid
//@param mixed $delflg
//@access protected
//@return void
//
//
//assets_tbへの固定的なwhere句作成（assetsnoで検索）
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $assetsid
//@param mixed $delflg
//@access protected
//@return void
//
//
//前月に資産があるかチェック
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//DBにその資産があるかチェック
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $assetsid
//@param mixed $pre（前月チェックフラグ）
//@access public
//@return void
//
//
//DBにその管理番号があるかチェック
//
//@author houshiyama
//@since 2008/07/28
//
//@param mixed $assetsno
//@param mixed $pre（前月チェックフラグ）
//@access public
//@return void
//
//
//削除済みで同じIDがあるかチェック
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $H_post
//@param mixed $pre
//@access protected
//@return void
//
//
//削除済みIDがあるかチェック
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $assetsid
//@param mixed $pre
//@access private
//@return void
//
//
//削除済みで同じ管理番号があるかチェック
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $H_post
//@param mixed $pre
//@access protected
//@return void
//
//
//削除済み管理番号があるかチェック
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $assetsid
//@param mixed $pre
//@access private
//@return void
//
//
//登録時に必要なSQL文を作る <br>
//
//テーブル名決定 <br>
//削除済みに無いかチェック <br>
//SQL文作成 <br>
//前月に登録する時 <br>
//前月に無いかチェック <br>
//前月用SQL文作成 <br>
//
//@author houshiyama
//@since 2008/03/18
//
//@param mixed $H_sess
//@access public
//@return array
//
//
//インサート文を作成する
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $H_post（フォーム入力値）
//@param mixed $assetsid（シーケンス番号）
//@param boolean $pre（前月フラグ）
//@access public
//@return void
//
//
//アップデート文を作成する
//
//@author houshiyama
//@since 2008/08/05
//
//@param mixed $H_post（フォーム入力値）
//@param mixed $assetsid（シーケンス番号）
//@param boolean $pre（前月フラグ）
//@access public
//@return void
//
//
//指定した資産を削除
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $H_get
//@access protected
//@return void
//
//
//資産のインサート文作成
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $H_post（フォームの入力値）
//@param mixed $assetsid（シーケンス番号）
//@param mixed $tb（対象テーブル）
//@access public
//@return void
//
//
//資産のインサート文作成（予約用、電話管理から呼ばれる）
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $H_post（フォームの入力値）
//@param mixed $assetsid（シーケンス番号）
//@param mixed $tb（対象テーブル）
//@access public
//@return void
//
//
//資産のupdate文作成
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $H_post（フォームの入力値）
//@param mixed $tb（対象テーブル）
//@access public
//@return void
//
//
//現在テーブルから資産を削除 <br>
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $assetsid
//@param mixed $assetstypeid
//@access public
//@return void
//
//
//現在テーブルから資産を削除 <br>
//（削除済みに対して使うのでフラグではなく実際に削除） <br>
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $assetsid
//@param mixed $assetstypeid
//@access public
//@return void
//
//
//select句作成
//
//@author houshiyama
//@since 2008/06/06
//
//@access public
//@return string
//
//
//更新に使うカラム決定
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $type
//@access protected
//@return $A_col
//
//
//更新に使うvalue決定
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $H_post
//@param mixed $assetsid
//@param mixed $type
//@access protected
//@return $A_val
//
//
//一覧データ取得（移動・削除画面用メソッド）
//
//@author houshiyama
//@since 2008/06/06
//
//@param array $H_sess
//@param array $H_trg
//@param array $A_post
//@access public
//@return void
//
//
//配列の各要素を分解
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $H_trg
//@access protected
//@return $A_rows
//
//
//移動、削除画面用一覧のwhere句作成
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $H_row
//@access protected
//@return void
//
//
//変更時に必要なSQL文を作る <br>
//本来はdelete、insertするのだが（他管理）
//資産は請求も無く紐付きの外部参照もあるのでそのままupdateします <br>
//
//@author houshiyama
//@since 2008/03/26
//
//@param array $H_sess
//@param mixed $cym
//@access public
//@return void
//
//
//請求があればtrue <br>
//請求が無ければfalse <br>
//
//対象が今月ならば前月をチェック <br>
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//指定したIDの請求数を取得
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $assetsid
//@param mixed $assetstypeid
//@param mixed $pre
//@access protected
//@return void
//
//
//前月に指定の資産があるかチェック
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $assetsid
//@param mixed $assetstypeid
//@param mixed $A_prepost
//@access protected
//@return void
//
//
//インサート時に使用するassetsidのシーケンス番号を取得
//
//@author houshiyama
//@since 2008/06/09
//
//@access public
//@return void
//
//
//電話会社一覧データ取得（使用中のもののみ）
//
//@author houshiyama
//@since 2008/05/21
//
//@param array $A_post（部署一覧）
//@param mixed $cym
//@param array $H_post（CGIパラメータ）
//@access public
//@return void
//
//
//シリーズ一覧データ取得
//
//@author houshiyama
//@since 2008/07/25
//
//@param mixed $carid
//@param mixed $cirid
//@access public
//@return array
//@uses PlanModel
//
//
//機種一覧データ取得
//
//@author houshiyama
//@since 2008/08/08
//
//@param mixed $carid
//@param mixed $cirid
//@param string $seriesname
//@access public
//@return void
//
//
//色一覧データ取得
//
//@author houshiyama
//@since 2008/08/08
//
//@param string $productid
//@access public
//@return void
//
//
//付属品一覧データ取得
//
//@author houshiyama
//@since 2008/08/08
//
//@param string $productid
//@access protected
//@return void
//
//
//マスターデータを生成する <br>
//
//@author houshiyama
//@since 2008/05/28
//
//@param array $H_sess（CGIパラメータ）
//@param array $A_post（部署ID）
//@param mixed $dounload
//@access private
//@return string
//
//
//指定した管理番号の端末予約一覧を取得
//
//@author houshiyama
//@since 2008/08/14
//
//@param mixed $assetsid
//@param mixed $date
//@param mixed $flg
//@access public
//@return void
//
//
//DBにその管理番号の予約があるかチェック
//
//@author houshiyama
//@since 2008/08/26
//
//@param mixed $assetsno
//@param mixed $date（予約日）
//@param mixed $flg
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/06/06
//
//@access public
//@return void
//
class ManagementAssetsModel extends ManagementModelBase {
	static ASS_SELECT_TOP = "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--";
	static ASS_SELECT_TOP_ENG = "--Please select--";
	static ASS_SELECT_DEFAULT = "--\u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--";
	static ASS_SELECT_DEFAULT_ENG = "--Please select carrier--";

	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getAssetsTypeData() {
		var O_model = new AssetsTypeModel();

		if (this.H_G_Sess.language == "ENG") {
			var A_data = {
				"": ManagementAssetsModel.ASS_SELECT_TOP_ENG
			};
		} else {
			A_data = {
				"": ManagementAssetsModel.SELECT_TOP
			};
		}

		A_data += O_model.getAssetsTypeKeyHash(this.H_G_Sess.pactid);
		return A_data;
	}

	getCarrierData() {
		var O_model = new CarrierModel();

		if (this.H_G_Sess.language == "ENG") {
			var H_data = {
				"": ManagementAssetsModel.ASS_SELECT_TOP_ENG
			};
			var H_res = O_model.getPactCarrierEngKeyHash(this.H_G_Sess.pactid);
		} else {
			H_data = {
				"": ManagementAssetsModel.SELECT_TOP
			};
			H_res = O_model.getPactCarrierKeyHash(this.H_G_Sess.pactid);
		}

		H_data += H_res;
		return H_data;
	}

	getCircuitData(carid) {
		if (carid != "") {
			var O_model = new CircuitModel();

			if (this.H_G_Sess.language == "ENG") {
				var H_data = {
					"": ManagementAssetsModel.ASS_SELECT_TOP_ENG
				};
				var H_res = O_model.getCircuitEngKeyHash(carid);
			} else {
				H_data = {
					"": ManagementAssetsModel.SELECT_TOP
				};
				H_res = O_model.getCircuitKeyHash(carid);
			}

			H_data += H_res;
		} else {
			if (this.H_G_Sess.language == "ENG") {
				H_data = {
					"": ManagementAssetsModel.ASS_SELECT_DEFAULT_ENG
				};
			} else {
				H_data = {
					"": ManagementAssetsModel.SELECT_TOP
				};
			}
		}

		return H_data;
	}

	getUseAssetsTypeData(A_post, cym, H_post) //テーブル名決定
	//検索値があれば加える
	{
		var A_data = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
		};
		this.setTableName(cym);
		var assetstypeid = undefined;

		if (undefined !== H_post.assetstypeid == true && H_post.assetstypeid != "") {
			assetstypeid = H_post.assetstypeid;
		}

		var O_model = new AssetsTypeModel();
		var A_res = O_model.getUseAssetsTypeKeyHash(this.H_G_Sess.pactid, A_post, this.H_Tb.assets_tb, assetstypeid);
		A_data += A_res;
		return A_data;
	}

	makeAssetsSelectOneSQL(assetsid) {
		var sql = "select " + this.makeAssetsSelectSQL() + " from " + this.makeAssetsFromSQL() + " where " + " ass.pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and ass.assetsid=" + this.get_db().dbQuote(assetsid, "integer", true) + " and ass.delete_flg=false";
		return sql;
	}

	makeCommonAssetsWhere(assetsid, delflg = "false") {
		var sql = " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and assetsid=" + this.get_db().dbQuote(assetsid, "integer", true);

		if (delflg != undefined) {
			sql += " and delete_flg=" + delflg;
		}

		return sql;
	}

	makeCommonAssetsNoWhere(assetsno, delflg = "false") {
		var sql = " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and assetsno=" + this.get_db().dbQuote(assetsno, "text", true);

		if (delflg != undefined) {
			sql += " and delete_flg=" + delflg;
		}

		return sql;
	}

	checkPastExist(H_post: {} | any[]) {
		var res = this.checkAssetsExist(H_post.assetsid, true);
		return res;
	}

	checkAssetsExist(assetsid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_assets_tb;
		} else {
			tb = this.H_Tb.assets_tb;
		}

		var sql = "select count(assetsid) from " + tb + " where " + this.makeCommonAssetsWhere(assetsid, undefined);

		if (this.get_db().queryOne(sql) < 1) {
			return false;
		} else {
			return true;
		}
	}

	checkAssetsNoExist(assetsno, type = "add", pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_assets_tb;
		} else {
			tb = this.H_Tb.assets_tb;
		}

		var sql = "select count(assetsid) from " + tb + " where " + " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and " + " assetsno='" + assetsno + "'" + " and " + " delete_flg=false";
		var count = this.get_db().queryOne(sql);

		if (type === "add" && count > 0) {
			return true;
		} else if (type === "mod" && count > 1) {
			return true;
		} else {
			return false;
		}
	}

	checkDeleteExist(H_post, pre = false) {
		var res = this.checkDeleteAssetsExist(H_post.assetsid, pre);
		return res;
	}

	checkDeleteAssetsExist(assetsid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_assets_tb;
		} else {
			tb = this.H_Tb.assets_tb;
		}

		var sql = "select count(assetsid) from " + tb + " where " + this.makeCommonAssetsWhere(assetsid, "true");

		if (this.get_db().queryOne(sql) > 0) {
			return true;
		} else {
			return false;
		}
	}

	checkDeleteNoExist(H_post, pre = false) {
		var res = this.checkDeleteAssetsNoExist(H_post.assetsno, pre);
		return res;
	}

	checkDeleteAssetsNoExist(assetsno, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_assets_tb;
		} else {
			tb = this.H_Tb.assets_tb;
		}

		var sql = "select count(assetsid) from " + tb + " where " + this.makeCommonAssetsNoWhere(assetsno, "true");

		if (this.get_db().queryOne(sql) > 0) {
			return true;
		} else {
			return false;
		}
	}

	makeAddSQL(H_sess: {} | any[]) //ここでしか呼べないので
	//名前が長いので・・・
	//現在に既に削除フラグが立った同一キーがあるかチェック
	//assets_tbへのinsert文
	//資産種別が携帯端末ならばダミー電話も登録
	{
		require("model/Management/Tel/ManagementTelModel.php");

		var H_post = H_sess.SELF.post;
		var A_sql = Array();
		this.setTableName(this.YM);

		if (this.checkDeleteNoExist(H_post) == true) {
			A_sql.push(this.makeDelAssetsNoSQL(H_post.assetsno));
		}

		var assetsid = this.getNextAssetsid();
		H_post.assetsid = assetsid;
		A_sql.push(this.makeAddManageSQL(H_post, assetsid));

		if (H_post.assetstypeid == "1") //携帯端末なのでダミー電話番号作成
			//ダミー電話登録
			//tel_rel_assets_tbへのインサート文作成
			//予約があるか調べる
			//あれば削除
			{
				var O_telmodel = new ManagementTelModel(this.O_db, this.H_G_Sess, this.O_Manage);
				O_telmodel.setTableName(this.YM);
				var telno = O_telmodel.makeDummyTelNo();
				A_sql.push(O_telmodel.makeDummyTelSQL(H_post, telno));
				H_post.telno = telno;
				H_post.telno_view = telno;
				H_post.carid = ManagementAssetsModel.DUMMY_TEL_CARID;
				H_post.main_flg = "true";
				A_sql.push(this.makeAddRelationAssetsSQL(H_post, assetsid));
				var A_reserve = this.getAssetsNoReserveList(H_post.assetsno);

				if (A_reserve.length > 0) {
					for (var acnt = 0; acnt < A_reserve.length; acnt++) //予約があれば予約一覧取得（電話資産関連予約テーブル）
					//あれば削除
					{
						A_sql.push(this.makeDelAssetsReserveSQL(A_reserve[acnt].assetsid, A_reserve[acnt].reserve_date, A_reserve[acnt].add_edit_flg));
						var A_relreserve = this.getAllTelRelAssetsReserveList(A_reserve[acnt].assetsid);

						if (A_relreserve.length > 0) {
							for (var rcnt = 0; rcnt < A_relreserve.length; rcnt++) {
								A_sql.push(this.makeDelTelRelAssetsReserveSQL(A_relreserve[rcnt].telno, A_relreserve[rcnt].carid, A_relreserve[rcnt].assetsid, A_relreserve[rcnt].reserve_date, A_relreserve[rcnt].add_edit_flg));
							}
						}

						A_sql.push(this.makeDelAssetsReserveLogSQL(A_reserve[acnt], "\u643A\u5E2F\u7AEF\u672B\u65B0\u898F\u767B\u9332\u306B\u3088\u308B\u4E88\u7D04\u524A\u9664", "Reservation deletion due to new handset registration", "\u65B0\u898F"));
					}
				}
			}

		if (this.O_Set.manage_clamp_date > this.A_Time[2] && this.checkAssetsNoExist(H_post.assetsno, "add", true) == false) //前月に無ければ前月にも登録
			{
				H_post.assetsid = assetsid;

				if (this.checkPastExist(H_post) == false && this.O_Post.checkPostExist(H_post.recogpostid, this.H_Tb.pre_post_tb) == true) //前月に既に削除フラグが立った同一キーがあるかチェック
					//資産種別ならばダミー電話も登録
					{
						if (this.checkDeleteNoExist(H_post, true) == true) {
							A_sql.push(this.makeDelAssetsNoSQL(H_post.assetsno, true));
						}

						A_sql.push(this.makeAddManageSQL(H_post, assetsid, true));

						if (H_post.assetstypeid == "1") //携帯端末なのでダミー電話番号作成
							//tel_rel_assets_tbへのインサート文作成
							{
								A_sql.push(O_telmodel.makeDummyTelSQL(H_post, telno, true));
								H_post.telno_view = telno;
								A_sql.push(this.makeAddRelationAssetsSQL(H_post, assetsid, true));
							}
					}
			}

		A_sql.push(this.makeAddLogSQL(H_post));
		return A_sql;
	}

	makeAddManageSQL(H_post, assetsid = undefined, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_assets_tb;
		} else {
			tb = this.H_Tb.assets_tb;
		}

		if (assetsid == undefined) {
			assetsid = H_post.assetsid;
		}

		var sql = this.makeInsertAssetsSQL(H_post, assetsid, tb);
		return sql;
	}

	makeModManageSQL(H_sess, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_assets_tb;
		} else {
			tb = this.H_Tb.assets_tb;
		}

		var sql = this.makeUpdateAssetsSQL(H_sess.SELF.post, tb);
		return sql;
	}

	makeDelManageSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_assets_tb;
		} else {
			tb = this.H_Tb.assets_tb;
		}

		var sql = this.makeDelAssetsSQL(H_post.assetsid, tb);
		return sql;
	}

	makeInsertAssetsSQL(H_post, assetsid, tb) {
		var sql = "insert into " + tb + " (" + this.makeColumns().join(",") + ") values (" + this.makeValues(H_post, assetsid).join(",") + ")";
		return sql;
	}

	makeInsertAssetsReserveSQL(H_post, assetsid) {
		var sql = "insert into " + this.H_Tb.assets_reserve_tb + " (" + this.makeColumns("reserve").join(",") + ") values (" + this.makeValues(H_post, assetsid, "reserve").join(",") + ")";
		return sql;
	}

	makeUpdateAssetsSQL(H_post, tb) {
		var sql = "update " + tb + " set " + this.makeUpdateSetSQL(this.makeColumns("update"), this.makeValues(H_post, H_post.assetsid, "update")) + " where " + this.makeCommonAssetsWhere(H_post.assetsid, "false");
		return sql;
	}

	makeDelAssetsSQL(assetsid, tb) {
		var sql = "delete from " + tb + " where " + this.makeCommonAssetsWhere(assetsid, undefined);
		return sql;
	}

	makeDelAssetsNoSQL(assetsno, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_assets_tb;
		} else {
			tb = this.H_Tb.assets_tb;
		}

		var sql = "delete from " + tb + " where " + this.makeCommonAssetsNoWhere(assetsno, undefined) + " and delete_flg=true";
		return sql;
	}

	makeAssetsSelectSQL() {
		var A_col = ["ass.assetsid", "ass.postid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "ass.assetsno", "ass.assetstypeid", "case when att1.assetstypeid is not null then att1.assetstypename else att2.assetstypename end as assetstypename", "ass.serialno", "ass.seriesname", "ass.productid", "ass.productname", "ass.branchid", "ass.property", "ass.search_carid", "carrier_tb.carname", "ass.search_cirid", "circuit_tb.cirname", "ass.bought_date", "ass.bought_price", "ass.pay_startdate", "ass.pay_frequency", "ass.pay_monthly_sum", "ass.firmware", "ass.version", "ass.smpcirid", "smart_circuit_tb.smpcirname", "ass.accessory", "ass.username", "ass.employeecode", "ass.memo as note", "ass.text1", "ass.text2", "ass.text3", "ass.text4", "ass.text5", "ass.text6", "ass.text7", "ass.text8", "ass.text9", "ass.text10", "ass.text11", "ass.text12", "ass.text13", "ass.text14", "ass.text15", "ass.int1", "ass.int2", "ass.int3", "ass.int4", "ass.int5", "ass.int6", "ass.date1", "ass.date2", "ass.date3", "ass.date4", "ass.date5", "ass.date6", "ass.mail1", "ass.mail2", "ass.mail3", "ass.url1", "ass.url2", "ass.url3"];
		return A_col.join(",");
	}

	makeColumns(type = "insert") //新規のみの項目
	{
		var A_col = ["assetsno", "assetstypeid", "serialno", "seriesname", "productid", "productname", "branchid", "property", "search_carid", "search_cirid", "bought_date", "bought_price", "pay_startdate", "pay_frequency", "pay_monthly_sum", "firmware", "version", "smpcirid", "accessory", "username", "employeecode", "memo", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "int4", "int5", "int6", "date1", "date2", "date3", "date4", "date5", "date6", "mail1", "mail2", "mail3", "url1", "url2", "url3", "fixdate", "pre_assetsno", "pre_assetstypeid", "receiptdate"];

		if ("insert" == type) {
			A_col.push("pactid");
			A_col.push("postid");
			A_col.push("assetsid");
			A_col.push("recdate");
		} else if ("reserve" == type) {
			A_col.push("pactid");
			A_col.push("postid");
			A_col.push("assetsid");
			A_col.push("recdate");
			A_col.push("reserve_date");
			A_col.push("add_edit_flg");
			A_col.push("exe_state");
			A_col.push("rel_flg");
		}

		return A_col;
	}

	makeValues(H_post, assetsid, type = "insert") //ユーザ設定項目
	//契約日整形
	//機種と色はプルダウン優先
	//S185 受領日入力 date
	//シリーズ名（AJAX等の都合で末尾全てidで統一しているので戻す）
	//S185 受領日date
	//新規のみの項目
	{
		H_post = this.makePropValue(H_post);
		H_post.bought_date = this.O_Manage.convertDatetime(H_post.bought_date);
		H_post.pay_startdate = this.O_Manage.convertDatetime(H_post.pay_startdate);

		for (var cnt = 1; cnt <= 6; cnt++) {
			H_post["date" + cnt] = this.O_Manage.convertDatetime(H_post["date" + cnt]);
		}

		if ("" != H_post.productid) {
			var A_product = split(":", H_post.productid);
			var productid = A_product[0];
			var productname = A_product[1];
		} else {
			productid = "";
			productname = H_post.productname;
		}

		if ("" != H_post.branchid) {
			var A_branch = split(":", H_post.branchid);
			var branchid = A_branch[0];
			var property = A_branch[1];
		} else {
			branchid = "";
			property = H_post.property;
		}

		if (undefined !== H_post.receiptdate) {
			if (H_post.receiptdate.Y == "" && H_post.receiptdate.m == "" && H_post.receiptdate.d == "") {
				var receiptdate = undefined;
			} else {
				receiptdate = H_post.receiptdate.Y + "-" + H_post.receiptdate.m + "-" + H_post.receiptdate.d;
			}
		} else {
			receiptdate = undefined;
		}

		H_post.seriesname = H_post.seriesid;
		var A_val = [this.get_db().dbQuote(H_post.assetsno, "text"), this.get_db().dbQuote(H_post.assetstypeid, "integer", true), this.get_db().dbQuote(H_post.serialno, "text"), this.get_db().dbQuote(H_post.seriesname, "text"), this.get_db().dbQuote(productid, "integer"), this.get_db().dbQuote(productname, "text"), this.get_db().dbQuote(branchid, "integer"), this.get_db().dbQuote(property, "text"), this.get_db().dbQuote(H_post.searchcarid, "integer"), this.get_db().dbQuote(H_post.searchcirid, "integer"), this.get_db().dbQuote(H_post.bought_date, "text"), this.get_db().dbQuote(H_post.bought_price, "integer"), this.get_db().dbQuote(H_post.pay_startdate, "text"), this.get_db().dbQuote(H_post.pay_frequency, "text"), this.get_db().dbQuote(H_post.pay_monthly_sum, "text"), this.get_db().dbQuote(H_post.firmware, "text"), this.get_db().dbQuote(H_post.version, "text"), this.get_db().dbQuote(H_post.smpcirid, "integer"), this.get_db().dbQuote(H_post.accessory, "text"), this.get_db().dbQuote(H_post.username, "text"), this.get_db().dbQuote(H_post.employeecode, "text"), this.get_db().dbQuote(H_post.note, "text"), this.get_db().dbQuote(H_post.text1, "text"), this.get_db().dbQuote(H_post.text2, "text"), this.get_db().dbQuote(H_post.text3, "text"), this.get_db().dbQuote(H_post.text4, "text"), this.get_db().dbQuote(H_post.text5, "text"), this.get_db().dbQuote(H_post.text6, "text"), this.get_db().dbQuote(H_post.text7, "text"), this.get_db().dbQuote(H_post.text8, "text"), this.get_db().dbQuote(H_post.text9, "text"), this.get_db().dbQuote(H_post.text10, "text"), this.get_db().dbQuote(H_post.text11, "text"), this.get_db().dbQuote(H_post.text12, "text"), this.get_db().dbQuote(H_post.text13, "text"), this.get_db().dbQuote(H_post.text14, "text"), this.get_db().dbQuote(H_post.text15, "text"), this.get_db().dbQuote(H_post.int1, "integer"), this.get_db().dbQuote(H_post.int2, "integer"), this.get_db().dbQuote(H_post.int3, "integer"), this.get_db().dbQuote(H_post.int4, "integer"), this.get_db().dbQuote(H_post.int5, "integer"), this.get_db().dbQuote(H_post.int6, "integer"), this.get_db().dbQuote(H_post.date1, "timestamp"), this.get_db().dbQuote(H_post.date2, "timestamp"), this.get_db().dbQuote(H_post.date3, "timestamp"), this.get_db().dbQuote(H_post.date4, "timestamp"), this.get_db().dbQuote(H_post.date5, "timestamp"), this.get_db().dbQuote(H_post.date6, "timestamp"), this.get_db().dbQuote(H_post.mail1, "text"), this.get_db().dbQuote(H_post.mail2, "text"), this.get_db().dbQuote(H_post.mail3, "text"), this.get_db().dbQuote(H_post.url1, "text"), this.get_db().dbQuote(H_post.url2, "text"), this.get_db().dbQuote(H_post.url3, "text"), this.get_db().dbQuote(this.NowTime, "timestamp", true), this.get_db().dbQuote(H_post.pre_assetsid, "text"), this.get_db().dbQuote(H_post.pre_assetstypeid, "text"), this.get_db().dbQuote(receiptdate, "date")];

		if ("insert" == type) {
			A_val.push(this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true));
			A_val.push(this.get_db().dbQuote(H_post.recogpostid, "integer", true));
			A_val.push(this.get_db().dbQuote(assetsid + "", "integer", true));
			A_val.push(this.get_db().dbQuote(this.NowTime, "timestamp", true));
		} else if ("reserve" == type) {
			A_val.push(this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true));
			A_val.push(this.get_db().dbQuote(H_post.recogpostid, "integer", true));
			A_val.push(this.get_db().dbQuote(assetsid + "", "integer", true));
			A_val.push(this.get_db().dbQuote(this.NowTime, "timestamp", true));
			A_val.push(this.get_DB().dbQuote(H_post.reserve_date, "timestamp", true));
			A_val.push(this.get_DB().dbQuote(H_post.add_edit_flg, "integer", true));
			A_val.push(this.get_DB().dbQuote(0, "integer", true));
			A_val.push(this.get_DB().dbQuote(H_post.rel_flg, "integer", true));
		}

		return A_val;
	}

	getList(H_sess: {} | any[], H_trg: {} | any[], A_post: {} | any[]) //menuからの値を配列に整形
	//配下の対象が無ければエラー
	{
		this.setTableName(H_sess.cym);
		var A_data = Array();
		var A_rows = this.splitArrrayRow(H_trg);

		for (var cnt = 0; cnt < A_rows.length; cnt++) {
			var A_res = this.get_db().queryRowHash(this.makeAssetsListSQL(A_post, A_rows[cnt]));

			if (A_res !== undefined) {
				A_data.push(A_res);
			}
		}

		if (A_data.length === 0) {
			this.errorOut(19, "\u51E6\u7406\u5BFE\u8C61\u304C\u914D\u4E0B\u306B\u7121\u3044", false, "./menu.php");
			throw die();
		}

		return A_data;
	}

	splitArrrayRow(H_trg: {} | any[]) {
		var A_rows = Array();

		for (var key in H_trg) {
			var value = H_trg[key];
			var A_line = Array();

			if (preg_match("/^id/", key) == true) {
				var A_tmp = split(":", value);
				A_line.postid = A_tmp[0];
				A_line.assetsid = A_tmp[1];
				A_line.assetsno = A_tmp[2];
				A_rows.push(A_line);
			}
		}

		return A_rows;
	}

	makeAssetsWhereSQL(H_row, delflg = "false") {
		var sql = " and " + "ass.assetsid=" + this.get_db().dbQuote(H_row.assetsid, "text", true);

		if (delflg != undefined) {
			sql += " and ass.delete_flg=" + delflg;
		}

		return sql;
	}

	makeDelInsertSQL(H_sess: {} | any[]) {
		var A_sql = this.makeModSQL(H_sess);
		return A_sql;
	}

	checkBillExist(H_sess) //テーブル名の決定
	//資産に請求は無いので常にfalseを返す
	//		// 対象が今月
	//		if( $this->YM == $H_sess[self::PUB]["cym"] ){
	//			// 前月も変更のフラグあり
	//			if( isset( $H_sess["SELF"]["post"]["pastflg"] ) == true && 1 == $H_sess["SELF"]["post"]["pastflg"] ){
	//				// 前月の請求無し
	//				if( $this->getBillCnt( $H_sess["SELF"]["get"]["manageno"], $H_sess["SELF"]["get"]["coid"], true ) == 0 ){
	//					$billflg = false;
	//				}
	//				// 前月の請求あり
	//				else{
	//					$billflg = true;
	//				}
	//			}
	//		}
	//		// 対象が過去
	//		else{
	//			// 請求無し
	//			if( $this->getBillCnt( $H_sess["SELF"]["get"]["manageno"], $H_sess["SELF"]["get"]["coid"] ) == 0 ){
	//				$billflg = false;
	//			}
	//			// 請求あり
	//			else{
	//				$billflg = true;
	//			}
	//		}
	{
		this.setTableName(H_sess[ManagementAssetsModel.PUB].cym);
		var billflg = false;
		return billflg;
	}

	getBillCnt(assetsid, assetstypeid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_assets_details_tb;
		} else {
			tb = this.H_Tb.assets_details_tb;
		}

		var sql = "select count(assetsid) from " + tb + " where " + this.makeCommonAssetsWhere(assetsid, assetstypeid, undefined);
		return this.get_db().queryOne(sql);
	}

	checkPreAssetsAuth(assetsid, assetstypeid, A_prepost) {
		var sql = "select count(assetsid) from " + this.H_Tb.pre_assets_tb + " where " + this.makeCommonAssetsWhere(assetsid, "false");

		if (A_prepost.length > 0) {
			sql += " and " + " postid in (" + A_prepost.join(",") + ")";
		}

		return this.get_db().queryOne(sql);
	}

	getNextAssetsid() {
		var assetsid = this.get_db().queryOne("select nextval('assets_parent_tb_assetsid_seq')");
		return assetsid;
	}

	getUseCarrierData(A_post, cym, H_post) //テーブル名決定
	//検索値があれば加える
	{
		var H_data = {
			"": ManagementAssetsModel.SELECT_TOP
		};
		this.setTableName(cym);
		var carid = undefined;

		if (undefined !== H_post.searchcarid == true && H_post.searchcarid != "") {
			var searchcarid = H_post.searchcarid;
		}

		var O_model = new CarrierModel();
		var H_res = O_model.getUseCarrierFromAssetsTbKeyHash(this.H_G_Sess.pactid, A_post, this.H_Tb.assets_tb, searchcarid);
		H_data += H_res;
		return H_data;
	}

	getProductSeriesData(carid, cirid) {
		if (carid != "" && cirid != "") {
			var O_model = new ProductModel();

			if (this.H_G_Sess.language == "ENG") {
				var H_data = {
					"": ManagementAssetsModel.ASS_SELECT_TOP_ENG
				};
			} else {
				H_data = {
					"": ManagementAssetsModel.ASS_SELECT_TOP
				};
			}

			var H_res = O_model.getSeriesHash(this.H_G_Sess.groupid, carid, cirid);
			H_data += H_res;
		} else {
			if (this.H_G_Sess.language == "ENG") {
				H_data = {
					"": "--Please select a service type--"
				};
			} else {
				H_data = {
					"": "--\u56DE\u7DDA\u7A2E\u5225\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
				};
			}
		}

		return H_data;
	}

	getProductIdNameData(carid, cirid, seriesname = "") {
		if (seriesname != "") {
			var O_model = new ProductModel();

			if (this.H_G_Sess.language == "ENG") {
				var H_data = {
					"": ManagementAssetsModel.ASS_SELECT_TOP_ENG
				};
			} else {
				H_data = {
					"": ManagementAssetsModel.SELECT_TOP
				};
			}

			var H_res = O_model.getProductIdNameKeyHash(this.H_G_Sess.groupid, carid, cirid, seriesname);
			H_data += H_res;
		} else {
			if (this.H_G_Sess.language == "ENG") {
				H_data = {
					"": "--Please select a series--"
				};
			} else {
				H_data = {
					"": "--\u30B7\u30EA\u30FC\u30BA\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
				};
			}
		}

		return H_data;
	}

	getBranchIdNameData(productid = "") {
		if (productid != "") {
			var O_model = new ProductModel();

			if (this.H_G_Sess.language == "ENG") {
				var H_data = {
					"": ManagementAssetsModel.ASS_SELECT_TOP_ENG
				};
			} else {
				H_data = {
					"": ManagementAssetsModel.SELECT_TOP
				};
			}

			var H_res = O_model.getBranchIdNameKeyHash(productid);
			H_data += H_res;
		} else {
			if (this.H_G_Sess.language == "ENG") {
				H_data = {
					"": "--Please select a product name--"
				};
			} else {
				H_data = {
					"": "--\u88FD\u54C1\u540D\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
				};
			}
		}

		return H_data;
	}

	getAccessoryData(productid = "") {
		if (productid != "") {
			var H_data = {
				"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
			};
			var O_model = new ProductModel();
			var H_res = O_model.getAccessoryKeyHash(productid);
			H_data += H_res;
		} else {
			H_data = {
				"": "--\u6A5F\u7A2E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
			};
		}

		return H_data;
	}

	getMastersList(H_sess) //キャリアと回線
	//シリーズ
	//機種
	//シリーズ取得
	//シリーズ取得
	//機種取得
	//色取得
	//付属品取得
	{
		var H_data = Array();
		var carid = H_sess.SELF.post.searchcarid;
		var cirid = H_sess.SELF.post.searchcirid;
		var seriesid = H_sess.SELF.post.seriesid;
		var productid = H_sess.SELF.post.productid;
		H_data.searchcirid = this.getCircuitData(carid);
		H_data.seriesid = this.getProductSeriesData(carid, cirid);
		H_data.productid = this.getProductIdNameData(carid, cirid, seriesid);
		H_data.branchid = this.getBranchIdNameData(productid);
		H_data.accessory = this.getAccessoryData(productid);
		return H_data;
	}

	getAssetsNoReserveList(assetsno) {
		var sql = "select postid,assetsid,reserve_date,add_edit_flg " + " from " + this.H_Tb.assets_reserve_tb + " where " + this.makeCommonAssetsNoWhere(assetsno) + " and exe_state=0";
		var H_res = this.get_DB().queryHash(sql);
		return H_res;
	}

	checkAssetsReserveExist(assetsno, date = "", flg = "") //予約日
	{
		var sql = "select count(assetsno) from " + this.H_Tb.assets_reserve_tb + " where " + this.makeCommonAssetsNoWhere(assetsno) + " and " + " assetstypeid=1" + " and " + " exe_state=0";

		if (date != "") {
			sql += " and " + " reserve_date=" + this.get_DB().dbQuote(date, "timestamp", true);
		}

		if (flg != "") {
			sql += " and " + " add_edit_flg=" + this.get_DB().dbQuote(flg, "integer", true);
		}

		if (this.get_DB().queryOne(sql) < 1) {
			return false;
		} else {
			return true;
		}
	}

	__destruct() {
		super.__destruct();
	}

};