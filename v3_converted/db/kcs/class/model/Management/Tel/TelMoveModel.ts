//
//電話移動用Model
//
//更新履歴：<br>
//2008/06/16 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/06/16
//@filesource
//@uses ManagementTelModel
//
//
//
//電話移動用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/06/16
//@uses ManagementTelModel
//

require("model/Management/Tel/ManagementTelModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/06/16
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//移動用sql文作成
//
//@author houshiyama
//@since 2008/06/16
//
//@param array $H_post
//@param array $A_data
//@param mixed $cym
//@access public
//@return void
//
//
//選択された対象の前月分が権限下にいるかチェック
//
//@author houshiyama
//@since 2008/06/16
//
//@param array $A_data
//@param array $A_prepostid
//@access public
//@return void
//
//
//移動予約log用sql文作成
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
//按分用テーブル（change_post_tb）へのインサート文作成
//
//@author houshiyama
//@since 2008/08/06
//
//@param mixed $H_data
//@param mixed $H_post
//@param mixed $movedate
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/06/16
//
//@access public
//@return void
//
class TelMoveModel extends ManagementTelModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makeMoveSQLProc(H_post: {} | any[], A_data: {} | any[], cym) //今月１日
	//部署一覧
	//移動日
	//DB書き込み用
	//移動日が未来（予約）
	{
		var A_sql = Array();
		var firstdate = this.YM + "01";
		var today = this.Today.replace(/-/g, "");
		var A_postid = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_Tb.tableno);

		if (undefined !== H_post.movetype === true && "shitei" === H_post.movetype) {
			var movedate = this.O_Manage.convertDatetime(H_post.movedate, "");
		} else {
			movedate = cym + "01";
		}

		var movedate_db = movedate.substr(0, 4) + "-" + movedate.substr(4, 2) + "-" + movedate.substr(6, 2) + " 00:00:00";

		if (undefined !== H_post.movetype === true && "shitei" === H_post.movetype && today < movedate) //関連電話どうしで重複がある可能性があるので
			{
				for (var cnt = 0; cnt < A_data.length; cnt++) //足り無いカラムの補足
				//移動予約日より未来に予約があるか調べる
				//管理記録
				//関連項目も移動（関連項目が存在するか調べて）
				{
					A_data[cnt].recogpostid = A_data[cnt].postid;
					A_data[cnt].reserve_date = movedate_db;
					A_data[cnt].add_edit_flg = TelMoveModel.MOVEMODE;
					A_data[cnt].movepostid = H_post.recogpostid;
					var A_reserve = this.getTelReserveList(A_data[cnt].telno, A_data[cnt].carid);

					if (A_reserve.length > 0) {
						for (var rcnt = 0; rcnt < A_reserve.length; rcnt++) //移動予約は削除
						{
							if (A_reserve[rcnt].add_edit_flg === TelMoveModel.MOVEMODE) //管理記録
								//#69ありえない日付が入っている。一旦削除することに・・もしかしたら復活するかも
								//array_push( $A_sql, $this->makeTelReserveMoveLogSQL( $A_reserve[$rcnt], $H_post, $cym, true, true ) );
								{
									A_sql.push(this.makeTelDelSQL(A_reserve[rcnt], false, "reserve"));
									echo("move<br>");
								} else {
								var reservedate = A_reserve[rcnt].reserve_date.replace(/-/g, "");

								if (reservedate > movedate) //管理記録
									//array_push( $A_sql, $this->makeTelReserveMoveLogSQL( $A_reserve[$rcnt], $H_post, $cym, false, true ) );
									{
										A_sql.push(this.makeTelMoveSQL(H_post.recogpostid, A_reserve[rcnt], false, "reserve"));
										echo("move___<br>");
									}
							}
						}
					}

					A_sql.push(this.makeInsertTelReserveSQL(A_data[cnt]));
					A_sql.push(this.makeTelMoveReserveLogSQL(A_data[cnt], H_post, cym));

					if ("all" === H_post.movemethod && this.checkRelTelExist(A_data[cnt].telno, A_data[cnt].carid) === true) {
						for (rcnt = 0;; rcnt < A_data[cnt].rel_tel.length; rcnt++) //名前が長いので・・・
						//足り無い項目追加
						//関連電話の移動予約日より未来に予約があるか調べる
						//管理記録
						{
							var H_tmp = A_data[cnt].rel_tel[rcnt];
							var H_tel = this.get_DB().queryRowHash(this.makeTelSelectOneSQL(H_tmp.telno, H_tmp.carid));
							H_tel.recogpostid = A_data[cnt].postid;
							H_tel.recogpostname = A_data[cnt].postname;
							H_tel.reserve_date = A_data[cnt].reserve_date;
							H_tel.add_edit_flg = A_data[cnt].add_edit_flg;
							H_tel.movepostid = H_post.recogpostid;
							A_reserve = this.getTelReserveList(H_tel.telno, H_tel.carid);

							if (A_reserve.length > 0) {
								for (var lcnt = 0; lcnt < A_reserve.length; lcnt++) //移動予約は削除
								{
									if (A_reserve[lcnt].add_edit_flg === TelMoveModel.MOVEMODE) //関連電話どうしで重複がある可能性があるので既に同じsqlがあるか調べる
										{
											var del_sql = this.makeTelDelSQL(A_reserve[lcnt], false, "reserve");

											if (-1 !== A_sql.indexOf(del_sql) == false) //管理記録
												{
													A_sql.push(del_sql);
													A_sql.push(this.makeTelReserveMoveLogSQL(A_reserve[lcnt], H_tel, cym, true, true));
												}
										} else {
										reservedate = A_reserve[lcnt].reserve_date.replace(/-/g, "");

										if (reservedate > movedate) //関連電話どうしで重複がある可能性があるので既に同じsqlがあるか調べる
											{
												var mod_sql = this.makeTelMoveSQL(H_post.recogpostid, A_reserve[lcnt], false, "reserve");

												if (-1 !== A_sql.indexOf(mod_sql) == false) //管理記録
													{
														A_sql.push(mod_sql);
														A_sql.push(this.makeTelReserveMoveLogSQL(A_reserve[lcnt], H_tel, cym, false, true));
													}
											}
									}
								}
							}

							A_sql.push(this.makeInsertTelReserveSQL(H_tel));
							A_sql.push(this.makeTelMoveReserveLogSQL(H_tel, H_post, cym));
						}
					}
				}

				A_sql = array_unique(A_sql);
			} else {
			for (cnt = 0;; cnt < A_data.length; cnt++) //change_post_tb更新
			//予約があるか調べる
			//管理記録
			//資産管理権限無し	20090408houshi
			{
				A_sql.push(this.makeInsertChangePostSQL(A_data[cnt], H_post, movedate_db));
				A_reserve = this.getTelReserveList(A_data[cnt].telno, A_data[cnt].carid);

				if (A_reserve.length > 0) {
					for (rcnt = 0;; rcnt < A_reserve.length; rcnt++) //移動予約は削除
					{
						if (A_reserve[rcnt].add_edit_flg === TelMoveModel.MOVEMODE) //管理記録
							{
								A_sql.push(this.makeTelDelSQL(A_reserve[rcnt], false, "reserve"));
								A_sql.push(this.makeTelReserveMoveLogSQL(A_reserve[rcnt], H_post, cym, true));
							} else //管理記録
							{
								A_sql.push(this.makeTelMoveSQL(H_post.recogpostid, A_reserve[rcnt], false, "reserve"));
								A_sql.push(this.makeTelReserveMoveLogSQL(A_reserve[rcnt], H_post, cym));
							}
					}
				}

				A_sql.push(this.makeTelMoveSQL(H_post.recogpostid, A_data[cnt]));
				A_sql.push(this.makeTelMoveLogSQL(A_data[cnt], H_post, cym));

				if (this.O_Auth.chkPactFuncIni("fnc_assets_manage_adm_co") == false) //この電話に紐付く端末一覧取得
					{
						var A_assetsid = this.getRelationAssetsId(A_data[cnt].telno, A_data[cnt].carid);

						if (A_assetsid.length > 0) //ひとつづつ端末を移動
							{
								for (var acnt = 0; acnt < A_assetsid.length; acnt++) {
									A_sql.push(this.makeAssetsMoveSQL(H_post.recogpostid, A_assetsid[acnt]));
								}
							}
					}

				if ("all" === H_post.movemethod && this.checkRelTelExist(A_data[cnt].telno, A_data[cnt].carid) === true) {
					for (rcnt = 0;; rcnt < A_data[cnt].rel_tel.length; rcnt++) //関連電話の部署ID取得
					//権限下にあるものだけ処理（権限下以外は飛ばす）
					{
						var rel_postid = this.get_DB().queryOne("select postid from " + this.H_Tb.tel_tb + " where " + this.makeCommonTelWhere(A_data[cnt].rel_tel[rcnt].telno, A_data[cnt].rel_tel[rcnt].carid));

						if (-1 !== A_postid.indexOf(rel_postid) == true) //名前が長いので・・・
							//change_post_tb更新
							//関連項目に予約があるか調べる
							//管理記録
							//資産管理権限無し	20090408houshi
							{
								H_tmp = A_data[cnt].rel_tel[rcnt];
								H_tel = this.get_DB().queryRowHash(this.makeTelSelectOneSQL(H_tmp.telno, H_tmp.carid));
								A_sql.push(this.makeInsertChangePostSQL(H_tel, H_post, movedate_db));

								if (this.checkTelReserveExist(H_tmp.telno, H_tmp.carid) === true) //あれば予約も移動
									//管理記録
									{
										A_sql.push(this.makeTelMoveSQL(H_post.recogpostid, H_tel, false, "reserve"));
										A_sql.push(this.makeTelReserveMoveLogSQL(H_tel, H_post, cym));
									}

								A_sql.push(this.makeTelMoveSQL(H_post.recogpostid, H_tel));
								A_sql.push(this.makeTelMoveLogSQL(H_tel, H_post, cym));

								if (this.O_Auth.chkPactFuncIni("fnc_assets_manage_adm_co") == false) //この電話に紐付く端末一覧取得
									{
										A_assetsid = this.getRelationAssetsId(H_tmp.telno, H_tmp.carid);

										if (A_assetsid.length > 0) //ひとつづつ端末を移動
											{
												for (acnt = 0;; acnt < A_assetsid.length; acnt++) {
													A_sql.push(this.makeAssetsMoveSQL(H_post.recogpostid, A_assetsid[acnt]));
												}
											}
									}
							}
					}
				}

				if (undefined !== H_post.movetype === true && "shitei" === H_post.movetype && firstdate > movedate) //tel_X_tb更新
					//資産管理権限無し	20090408houshi
					{
						A_sql.push(this.makeTelMoveSQL(H_post.recogpostid, A_data[cnt], true));

						if (this.O_Auth.chkPactFuncIni("fnc_assets_manage_adm_co") == false) //この電話に紐付く端末一覧取得
							{
								A_assetsid = this.getRelationAssetsId(A_data[cnt].telno, A_data[cnt].carid, true);

								if (A_assetsid.length > 0) //ひとつづつ端末を移動
									{
										for (acnt = 0;; acnt < A_assetsid.length; acnt++) {
											A_sql.push(this.makeAssetsMoveSQL(H_post.recogpostid, A_assetsid[acnt], true));
										}
									}
							}

						if ("all" === H_post.movemethod && this.checkRelTelExist(A_data[cnt].telno, A_data[cnt].carid, true) === true) {
							for (rcnt = 0;; rcnt < A_data[cnt].rel_tel.length; rcnt++) //change_post_tb更新
							//tel_X_tb更新
							//管理記録
							//資産管理権限無し	20090408houshi
							{
								H_tel = this.get_DB().queryRowHash(this.makeTelSelectOneSQL(A_data[cnt].rel_tel[rcnt].telno, A_data[cnt].rel_tel[rcnt].carid, true));
								A_sql.push(this.makeInsertChangePostSQL(H_tel, H_post, movedate_db));
								A_sql.push(this.makeTelMoveSQL(H_post.recogpostid, A_data[cnt]));
								A_sql.push(this.makeTelMoveLogSQL(H_tel, H_post, cym));

								if (this.O_Auth.chkPactFuncIni("fnc_assets_manage_adm_co") == false) //この電話に紐付く端末一覧取得
									{
										A_assetsid = this.getRelationAssetsId(A_data[cnt].rel_tel[rcnt].telno, A_data[cnt].rel_tel[rcnt].carid, true);

										if (A_assetsid.length > 0) //ひとつづつ端末を移動
											{
												for (acnt = 0;; acnt < A_assetsid.length; acnt++) {
													A_sql.push(this.makeAssetsMoveSQL(H_post.recogpostid, A_assetsid[acnt], true));
												}
											}
									}
							}
						}
					}
			}
		}

		return A_sql;
	}

	checkPreTrgManageAuth(A_data: {} | any[], A_prepostid: {} | any[]) {
		for (var cnt = 0; cnt < A_data.length; cnt++) //存在チェック
		{
			var res = this.checkPreTelAuth(A_data[cnt].telno, A_data[cnt].carid, A_prepostid);

			if (res < 1) {
				var O_err = new ViewError();

				if (this.H_G_Sess.language == "ENG") {
					O_err.display("Phone number does not exist in the previous month.  Uncheck the change for the previous month.", 0, _SERVER.PHP_SELF, "Back");
				} else {
					O_err.display("\u524D\u6708\u306B\u5B58\u5728\u3057\u306A\u3044\u96FB\u8A71\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002<BR>\u79FB\u52D5\u65E5\u3092\u4ECA\u6708\u4EE5\u964D\u306B\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
				}

				throw die();
			}
		}

		return A_sql;
	}

	makeTelMoveReserveLogSQL(H_data: {} | any[], H_post: {} | any[], cym) {
		var reservedate_view = H_post.movedate.Y + "\u5E74" + str_pad(H_post.movedate.m, 2, "0", STR_PAD_LEFT) + "\u6708" + str_pad(H_post.movedate.d, 2, "0", STR_PAD_LEFT) + "\u65E5";
		var reservedate_view_eng = H_post.movedate.Y + "-" + str_pad(H_post.movedate.m, 2, "0", STR_PAD_LEFT) + "-" + str_pad(H_post.movedate.d, 2, "0", STR_PAD_LEFT);
		var A_val = [TelMoveModel.TELMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.telno, H_data.telno_view, H_data.carid, "\u79FB\u52D5\u4E88\u7D04\uFF08" + reservedate_view + "\uFF09", "Reservation of phone shift(" + reservedate_view_eng + ")", H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u79FB\u52D5", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeInsertChangePostSQL(H_data, H_post, movedate) {
		var sql = "insert into change_post_tb (" + "pactid,postid,postname,postidaft,postnameaft,telno,carid,status,date,recdate,fixdate " + ") values (" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + "," + this.get_DB().dbQuote(H_data.postid, "integer", true) + "," + this.get_DB().dbQuote(H_data.postname, "text", true) + "," + this.get_DB().dbQuote(H_post.recogpostid, "integer", true) + "," + this.get_DB().dbQuote(H_post.recogpostname, "text", true) + "," + this.get_DB().dbQuote(H_data.telno, "text", true) + "," + this.get_DB().dbQuote(H_data.carid, "integer", true) + "," + this.get_DB().dbQuote("MT", "text", true) + "," + this.get_DB().dbQuote(movedate, "timestamp", true) + "," + this.get_DB().dbQuote(this.NowTime, "timestamp", true) + "," + this.get_DB().dbQuote(this.NowTime, "timestamp", true) + ")";
		return sql;
	}

	__destruct() {
		super.__destruct();
	}

};