//
//電話削除用Model
//
//更新履歴：<br>
//2008/06/18 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/08/12
//@uses ManagementTelModel
//@uses AssetsDelModel
//@uses ExtensionTelModel
//
//
//
//電話削除用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/08/12
//@uses ManagementTelModel
//

require("model/Management/Tel/ManagementTelModel.php");

require("model/Management/Assets/AssetsDelModel.php");

require("model/ExtensionTelModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/08/12
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//削除用sql文作成
//
//@author houshiyama
//@since 2008/08/12
//
//@param array $H_post
//@param array $A_data
//@param mixed $cym
//@access public
//@return void
//
//
//DBが必要な入力チェック
//
//@author houshiyama
//@since 2008/08/12
//
//@param string $H_post
//@param mixed $O_form
//@access public
//@return void
//
//
//移動時の権限チェック
//
//@author houshiyama
//@since 2008/08/12
//
//@param array $H_sess
//@param array $A_data
//@access public
//@return void
//
//
//削除予約log用sql文作成
//
//@author houshiyama
//@since 2008/03/17
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/08/12
//
//@access public
//@return void
//
class TelDelModel extends ManagementTelModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makeDelSQLProc(H_post: {} | any[], A_data: {} | any[], cym) //端末用クラスオブジェクトの生成
	//今月１日
	//削除日（現在削除）
	//DB書き込み用
	//削除日が未来（予約）
	//重複したsqlを削除
	{
		var O_assets = new AssetsModModel(this.O_db, this.H_G_Sess, this.O_Manage);
		O_assets.setTableName(cym);
		var A_sql = Array();
		var firstdate = this.YM + "01";
		var today = this.Today.replace(/-/g, "");

		if (undefined !== H_post.deldate === true) {
			var deldate = this.O_Manage.convertDatetime(H_post.deldate, "");
		} else {
			deldate = cym + "01";
		}

		var deldate_db = deldate.substr(0, 4) + "-" + deldate.substr(4, 2) + "-" + deldate.substr(6, 2) + " 00:00:00";

		if (undefined !== H_post.deldate === true && today < deldate) {
			for (var cnt = 0; cnt < A_data.length; cnt++) //既に削除予約があるか調べる
			//端末も削除を指定又は端末管理してない会社は端末も削除
			//tel_reserve_tb更新
			//tel_mnglog_tb更新
			{
				var H_val = A_data[cnt];
				H_val.recogpostid = H_val.postid;
				H_val.reserve_date = deldate;
				H_val.add_edit_flg = TelDelModel.DELMODE;
				var A_reserve = this.getTelReserveList(A_data[cnt].telno, A_data[cnt].carid, undefined, TelDelModel.DELMODE);

				if (A_reserve.length > 0) {
					var A_delres = this.deleteReserveProc(A_reserve, "\u96FB\u8A71\u524A\u9664\u4E88\u7D04\u306B\u3088\u308B\u4E88\u7D04\u524A\u9664", "Reservation deletion due to reservation of telephone deletion", "\u4E88\u7D04\u524A\u9664");

					if (A_delres.length > 0) {
						A_sql = array_merge(A_sql, A_delres);
					}
				}

				A_reserve = this.getTelReserveList(A_data[cnt].telno, A_data[cnt].carid, deldate);

				if (A_reserve.length > 0) {
					A_delres = this.deleteReserveProc(A_reserve, "\u96FB\u8A71\u524A\u9664\u4E88\u7D04\u306B\u3088\u308B\u4E88\u7D04\u524A\u9664", "Reservation deletion due to reservation of telephone deletion", "\u4E88\u7D04\u524A\u9664");

					if (A_delres.length > 0) {
						A_sql = array_merge(A_sql, A_delres);
					}
				}

				A_sql = array_unique(A_sql);

				if (undefined !== H_post.delmethod == true && H_post.delmethod == "all" || -1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_co") == false) {
					H_val.delete_type = 1;
				} else {
					H_val.delete_type = 0;
				}

				A_sql.push(this.makeInsertTelReserveSQL(H_val));
				A_sql.push(this.makeTelDelReserveLogSQL(H_val, H_post, cym));
			}
		} else {
			for (cnt = 0;; cnt < A_data.length; cnt++) //現在削除なら予約があるか調べる
			//あれば削除
			//tel_X_tbから削除
			//tel_mnglog_tb更新
			//内線番号の値があればそれを削除
			{
				if (undefined !== H_post.deldate === true) {
					A_reserve = this.getTelReserveList(A_data[cnt].telno, A_data[cnt].carid);

					if (A_reserve.length > 0) //あれば予約も削除
						{
							A_delres = this.deleteReserveProc(A_reserve, "\u96FB\u8A71\u524A\u9664\u306B\u3088\u308B\u4E88\u7D04\u524A\u9664", "Reservation deletion due to phone deletion", "\u4E88\u7D04\u524A\u9664");

							if (A_delres.length > 0) {
								A_sql = array_merge(A_sql, A_delres);
							}
						}
				}

				var A_assetsid = this.getRelationAssetsId(A_data[cnt].telno, A_data[cnt].carid);

				if (A_assetsid.length > 0) //ひとつづつ端末を削除
					{
						for (var acnt = 0; acnt < A_assetsid.length; acnt++) //端末も削除を指定又は端末管理してない会社は端末も削除
						{
							if (undefined !== H_post.delmethod == true && H_post.delmethod == "all" || -1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_co") == false) //この端末を使っている紐付きを全て削除
								{
									var A_relassets = this.getTelRelAssetsList(A_assetsid[acnt].assetsid);

									if (A_relassets.length > 0) {
										for (var lcnt = 0; lcnt < A_relassets.length; lcnt++) {
											A_sql.push(this.makeDelTelRelAssetsSQL(A_relassets[lcnt].telno, A_relassets[lcnt].carid, A_relassets[lcnt].assetsid));
										}
									}

									A_sql.push(O_assets.makeDelManageSQL(A_assetsid[acnt]));
								} else //紐付き削除
								//他で使われている端末か調べる
								{
									A_sql.push(this.makeDelTelRelAssetsSQL(A_data[cnt].telno, A_data[cnt].carid, A_assetsid[acnt].assetsid));

									if (this.checkUsedTerminal(A_data[cnt].telno, A_data[cnt].carid, A_assetsid[acnt].assetsid) === false) //どの回線にも使われていないのでダミー電話番号作成
										//tel_rel_assets_tbへのインサート文作成
										{
											var dummy_telno = this.makeDummyTelNo();
											A_sql.push(this.makeDummyTelSQL(A_data[cnt], dummy_telno));
											var H_tmp = A_data[cnt];
											H_tmp.telno = dummy_telno;
											A_sql.push(this.makeAddRelationAssetsSQL(H_tmp, A_assetsid[acnt].assetsid));
										}
								}
						}
					}

				var A_reltel = this.getTelRelTelList(A_data[cnt].telno, A_data[cnt].carid);

				if (A_reltel.length > 0) {
					for (var rcnt = 0; rcnt < A_reltel.length; rcnt++) {
						A_sql.push(this.makeDelTelRelTelSQL(A_reltel[rcnt].telno, A_reltel[rcnt].carid, A_reltel[rcnt].rel_telno, A_reltel[rcnt].rel_carid));
					}
				}

				A_sql.push(this.updateDelteldateSQL(A_data[cnt], deldate_db));
				A_sql.push(this.makeTelDelSQL(A_data[cnt]));
				A_sql.push(this.makeTelDelLogSQL(A_data[cnt], H_post, cym));

				if (A_data[cnt].extensionno != "") {
					var O_extension = this.getExtensionTelModel();
					A_sql.push(O_extension.makeDisactivateExtensionNoSQL(this.H_G_Sess.pactid, A_data[cnt].extensionno));
				}
			}
		}

		A_sql = array_unique(A_sql);
		return A_sql;
	}

	checkInputError(H_post, O_form) {}

	checkDelAuth(H_sess, A_data) //親番号は削除できないので削除対象に含まれていないか調べる
	//全てが親番号ならばエラー
	{
		var H_post = H_sess.SELF.post;
		var A_prtelno = this.getPrtelno();
		var alert_cnt = 0;

		for (var cnt = 0; cnt < A_data.length; cnt++) {
			var telno = this.O_Manage.convertNoView(A_data[cnt].telno);
			var carid = A_data[cnt].carid;

			for (var pcnt = 0; pcnt < A_prtelno.length; pcnt++) //削除対象に含まれていたらアラート表示
			{
				var prtelno = this.O_Manage.convertNoView(A_prtelno[pcnt].prtelno);
				var prcarid = A_prtelno[pcnt].carid;

				if (telno == prtelno && carid == prcarid) //表示言語分岐
					{
						if (this.H_G_Sess.language == "ENG") {
							A_data[cnt].alert = "<font color=\"red\">Unable to delete a parent number</font>";
						} else {
							A_data[cnt].alert = "<font color=\"red\">\u89AA\u756A\u53F7\u306E\u305F\u3081\u524A\u9664\u4E0D\u53EF</font>";
						}

						alert_cnt++;
					}
			}
		}

		if (alert_cnt == A_data.length) //表示言語分岐
			{
				var O_err = new ViewError();

				if (this.H_G_Sess.language == "ENG") {
					O_err.display("No deletion target<br> (selected numbers are all parent numbers)", 0, "./menu.php", "\u623B\u308B");
				} else {
					O_err.display("\u524A\u9664\u5BFE\u8C61\u304C\u3042\u308A\u307E\u305B\u3093\u3002<br>\uFF08\u9078\u629E\u3057\u305F\u96FB\u8A71\u304C\u5168\u3066\u89AA\u756A\u53F7\u3067\u3059\uFF09", 0, "./menu.php", "\u623B\u308B");
				}

				throw die();
			}

		if (undefined !== H_post.delsubmit === true && undefined !== H_post.deldate === true) //削除日
			{
				var deldate = this.O_Manage.convertDatetime(H_post.deldate, "");
			}
	}

	makeTelDelReserveLogSQL(H_data: {} | any[], H_post: {} | any[], cym) {
		var reservedate_view = H_post.deldate.Y + "\u5E74" + str_pad(H_post.deldate.m, 2, "0", STR_PAD_LEFT) + "\u6708" + str_pad(H_post.deldate.d, 2, "0", STR_PAD_LEFT) + "\u65E5";
		var A_val = [TelDelModel.TELMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.telno, H_data.telno_view, H_data.carid, "\u524A\u9664\u4E88\u7D04\uFF08" + reservedate_view + "\uFF09", "Reservation of phone deletion(" + reservedate_view + ")", H_data.postid, undefined, H_data.postname, undefined, this.H_G_Sess.joker, "\u79FB\u52D5", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	__destruct() {
		super.__destruct();
	}

};