//
//削除用Model
//
//更新履歴：<br>
//2008/02/27 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/03/21
//@filesource
//@uses ManagementModel
//
//
//
//削除用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/03/21
//@uses ManagementModel
//

require("model/Management/ManagementModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/02/21
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
//@since 2008/03/21
//
//@param array $H_post
//@param array $A_data
//@param mixed $cym
//@access public
//@return void
//
//
//請求があればtrue <br>
//請求が無ければfalse <br>
//
//@author houshiyama
//@since 2008/03/26
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//指定したIDの請求数を取得
//
//@author houshiyama
//@since 2008/03/26
//
//@param mixed $mid
//@param mixed $manageno
//@param mixed $coid
//@access protected
//@return void
//
//
//削除不可能なレコードがあればfalse（削除画面用） <br>
//
//@author houshiyama
//@since 2011/03/10
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/21
//
//@access public
//@return void
//
class ManagementDelModel extends ManagementModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makeDelSQL(H_post: {} | any[], A_data: {} | any[], cym) {
		var A_sql = Array();

		for (var cnt = 0; cnt < A_data.length; cnt++) //対象が電話
		{
			if (A_data[cnt].mid == ManagementDelModel.TELMID) //操作可能な電話かチェック
				//あれば削除
				//tel_X_tbから削除
				//tel_mnglog_tb更新
				{
					A_data[cnt].telno = A_data[cnt].manageno;
					A_data[cnt].telno_view = A_data[cnt].manageno_view;
					A_data[cnt].carid = A_data[cnt].coid;

					if (cym == this.YM) //予約があるか調べる
						{
							var A_reserve = this.getTelReserveList(A_data[cnt].telno, A_data[cnt].carid);

							if (A_reserve.length > 0) {
								var A_delres = this.deleteReserveProc(A_reserve, "\u96FB\u8A71\u524A\u9664\u306B\u3088\u308B\u4E88\u7D04\u524A\u9664", "\u2605\u96FB\u8A71\u524A\u9664\u306B\u3088\u308B\u4E88\u7D04\u524A\u9664", "\u4E88\u7D04\u524A\u9664");

								if (A_delres.length > 0) {
									A_sql = array_merge(A_sql, A_delres);
								}
							}
						}

					var A_assetsid = this.getRelationAssetsId(A_data[cnt].telno, A_data[cnt].carid);

					if (A_assetsid.length > 0) //ひとつづつ削除
						{
							for (var acnt = 0; acnt < A_assetsid.length; acnt++) //端末管理してない会社は端末も削除
							{
								if (-1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_co") == false) //この端末を使っている紐付きを全て削除
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
												H_tmp.telno = telno;
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

					A_sql.push(this.updateDelteldateSQL(A_data[cnt], this.Now));
					A_sql.push(this.makeTelDelSQL(A_data[cnt]));
					A_sql.push(this.makeTelDelLogSQL(A_data[cnt], H_post, cym));
				}

			if (A_data[cnt].mid == ManagementDelModel.ETCMID) //操作可能なETCかチェック
				{
					A_data[cnt].cardno = A_data[cnt].manageno;
					A_data[cnt].cardno_view = A_data[cnt].manageno_view;
					A_data[cnt].cardcoid = A_data[cnt].coid;
					A_sql.push(this.makeEtcDelSQL(A_data[cnt]));
					A_sql.push(this.makeEtcDelLogSQL(A_data[cnt], H_post, cym));
				}

			if (A_data[cnt].mid == ManagementDelModel.PURCHMID) //操作可能な購買IDかチェック
				{
					A_data[cnt].purchid = A_data[cnt].manageno;
					A_data[cnt].purchcoid = A_data[cnt].coid;
					A_sql.push(this.makePurchDelSQL(A_data[cnt]));
					A_sql.push(this.makePurchDelLogSQL(A_data[cnt], H_post, cym));
				}

			if (A_data[cnt].mid == ManagementDelModel.COPYMID) //操作可能なコピー機かチェック
				{
					A_data[cnt].copyid = A_data[cnt].manageno;
					A_data[cnt].copycoid = A_data[cnt].coid;
					A_sql.push(this.makeCopyDelSQL(A_data[cnt]));
					A_sql.push(this.makeCopyDelLogSQL(A_data[cnt], H_post, cym));
				}

			if (A_data[cnt].mid == ManagementDelModel.ASSMID) //操作可能な資産かチェック
				//携帯端末ならば紐付きも削除
				//予約があれば予約一覧取得（資産予約テーブル）
				//あれば削除
				//あれば削除
				{
					A_data[cnt].assetsno = A_data[cnt].manageno;
					A_data[cnt].assetsid = A_data[cnt].coid;
					var A_rel = this.getAllTelRelAssetsList(A_data[cnt].assetsid);

					if (A_rel.length > 0) {
						for (lcnt = 0;; lcnt < A_rel.length; lcnt++) {
							A_sql.push(this.makeDelTelRelAssetsSQL(A_rel[lcnt].telno, A_rel[lcnt].carid, A_rel[lcnt].assetsid));
						}
					}

					A_sql.push(this.makeAssetsDelSQL(A_data[cnt]));
					A_reserve = this.getAllAssetsReserveList(A_data[cnt].assetsid);

					if (A_reserve.length > 0) {
						for (acnt = 0;; acnt < A_reserve.length; acnt++) {
							A_sql.push(this.makeDelAssetsReserveSQL(A_reserve[acnt].assetsid, A_reserve[acnt].reserve_date, A_reserve[acnt].add_edit_flg));
						}
					}

					var A_relreserve = this.getAllTelRelAssetsReserveList(A_data[cnt].assetsid);

					if (A_relreserve.length > 0) {
						for (rcnt = 0;; rcnt < A_relreserve.length; rcnt++) {
							A_sql.push(this.makeDelTelRelAssetsReserveSQL(A_relreserve[rcnt].telno, A_relreserve[rcnt].carid, A_relreserve[rcnt].assetsid, A_relreserve[rcnt].reserve_date, A_relreserve[rcnt].add_edit_flg));
						}
					}

					A_sql.push(this.makeAssetsDelLogSQL(A_data[cnt], H_post, cym));
				}

			if (A_data[cnt].mid == ManagementDelModel.TRANMID) //操作可能な運送IDかチェック
				{
					A_data[cnt].tranid = A_data[cnt].manageno;
					A_data[cnt].trancoid = A_data[cnt].coid;
					A_sql.push(this.makeTranDelSQL(A_data[cnt]));
					A_sql.push(this.makeTranDelLogSQL(A_data[cnt], H_post, cym));
				}

			if (A_data[cnt].mid == ManagementDelModel.EVMID) //操作可能なEV IDかチェック
				{
					A_data[cnt].evid = A_data[cnt].manageno;
					A_data[cnt].evcoid = A_data[cnt].coid;
					A_sql.push(this.makeEvDelSQL(A_data[cnt]));
					A_sql.push(this.makeEvDelLogSQL(A_data[cnt], H_post, cym));
				}

			if (A_data[cnt].mid == ManagementDelModel.HEALTHMID) //操作可能なEV IDかチェック
				{
					A_data[cnt].healthid = A_data[cnt].manageno;
					A_data[cnt].healthcoid = A_data[cnt].coid;
					A_sql.push(this.makeHealthDelSQL(A_data[cnt]));
					A_sql.push(this.makeHealthDelLogSQL(A_data[cnt], H_post, cym));
				}
		}

		return A_sql;
	}

	checkBillExist(H_sess) //テーブル名の決定
	//対象が今月
	{
		this.setTableName(H_sess[ManagementDelModel.PUB].cym);
		var billflg = false;

		if (date("Ym") == H_sess[ManagementDelModel.PUB].cym) //スルー
			{} else //削除の時
			{
				if (undefined !== H_sess.SELF.trg_list === true) {
					billflg = false;
					{
						let _tmp_0 = H_sess.SELF.trg_list;

						for (var key in _tmp_0) {
							var val = _tmp_0[key];

							if (preg_match("/^id/", key) == true) //ひとつでも請求があればエラー
								{
									var A_val = split(":", val);

									if (this.getBillCnt(A_val[1], A_val[3], A_val[2]) > 0) {
										billflg = true;
										break;
									}
								}
						}
					}
				}
			}

		return billflg;
	}

	getBillCnt(mid, manageno, coid) //電話
	{
		if (mid == ManagementDelModel.TELMID) {
			var tb = this.H_Tb.tel_details_tb;
			var where = " telno='" + manageno + "' and carid=" + coid;
		} else if (mid == ManagementDelModel.ETCMID) {
			tb = this.H_Tb.card_details_tb;
			where = " cardno='" + manageno + "'";

			if (coid != "") {
				where += " and cardcoid=" + coid;
			}
		} else if (mid == ManagementDelModel.PURCHMID) {
			tb = this.H_Tb.purchase_details_tb;
			where = " purchid='" + manageno + "' and purchcoid=" + coid;
		} else if (mid == ManagementDelModel.COPYMID) {
			tb = this.H_Tb.copy_details_tb;
			where = " copyid='" + manageno + "' and copycoid=" + coid;
		} else if (mid == ManagementDelModel.TRANMID) {
			tb = this.H_Tb.transit_details_tb;
			where = " tranid='" + manageno + "' and trancoid=" + coid;
		} else if (mid == ManagementDelModel.EVMID) {
			tb = this.H_Tb.ev_details_tb;
			where = " evid='" + manageno + "' and evcoid=" + coid;
		} else if (mid == ManagementDelModel.HEALTHMID) {
			tb = this.H_Tb.healthcare_rechistory_tb;
			where = " healthid='" + manageno + "' and healthcoid=" + coid;
		}

		if (where == "") {
			return 0;
		}

		var sql = "select count(pactid) from " + tb + " where " + where;
		return this.get_db().queryOne(sql);
	}

	checkDeleteAuth(H_sess) //電話削除権限が無い
	{
		if (-1 !== this.A_Auth.indexOf("fnc_tel_telmod") == false) //削除の時
			{
				if (undefined !== H_sess.SELF.trg_list === true) {
					var billflg = false;
					{
						let _tmp_1 = H_sess.SELF.trg_list;

						for (var key in _tmp_1) {
							var val = _tmp_1[key];

							if (preg_match("/^id/", key) == true) //電話
								{
									var A_val = split(":", val);

									if (A_val[1] == ManagementDelModel.TELMID) {
										return false;
									}
								}
						}
					}
				}
			}

		return true;
	}

	__destruct() {
		super.__destruct();
	}

};