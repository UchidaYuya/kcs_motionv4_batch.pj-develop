//
//移動用Model
//
//更新履歴：<br>
//2008/02/27 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/03/17
//@uses ManagementModel
//
//
//
//移動用Model
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
//@since 2008/03/17
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
//@since 2008/03/24
//
//@param array $A_data
//@param array $A_prepostid
//@access public
//@return void
//
//
//前月に指定の電話があるかチェック
//
//@author houshiyama
//@since 2008/03/24
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $A_prepost
//@access private
//@return void
//
//
//前月に指定のETCカードがあるかチェック
//
//@author houshiyama
//@since 2008/03/24
//
//@param mixed $cardno
//@param mixed $cardno_view
//@param mixed $A_prepost
//@access private
//@return void
//
//
//前月に指定の購買IDがあるかチェック
//
//@author houshiyama
//@since 2008/03/24
//
//@param mixed $purchid
//@param mixed $purchcoid
//@param mixed $A_prepost
//@access private
//@return void
//
//
//前月に指定のコピー機があるかチェック
//
//@author houshiyama
//@since 2008/08/24
//
//@param mixed $copyid
//@param mixed $copycoid
//@param mixed $A_prepost
//@access private
//@return void
//
//
//前月に指定の資産があるかチェック
//
//@author houshiyama
//@since 2008/08/24
//
//@param mixed $assetsid
//@param mixed $A_prepost
//@access private
//@return void
//
//
//前月に指定の運送IDがあるかチェック
//
//@author houshiyama
//@since 2010/03/03
//
//@param mixed $tranid
//@param mixed $trancoid
//@param mixed $A_prepost
//@access private
//@return void
//
//
//前月に指定のEV IDがあるかチェック
//
//@author maeda
//@since 2010/08/09
//
//@param mixed $evid
//@param mixed $evcoid
//@param mixed $A_prepost
//@access private
//@return void
//
//
//前月に指定のヘルスケアIDがあるかチェック
//
//@author houshiyama
//@since 2010/03/03
//
//@param mixed $tranid
//@param mixed $trancoid
//@param mixed $A_prepost
//@access private
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
class ManagementMoveModel extends ManagementModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makeMoveSQLProc(H_post: {} | any[], A_data: {} | any[], cym) {
		var A_sql = Array();

		if (undefined !== _POST.pastflg == true && _POST.pastflg == 1) {
			var A_prepost = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_Tb.pre_tableno);
		}

		for (var cnt = 0; cnt < A_data.length; cnt++) //対象が電話
		{
			if (A_data[cnt].mid == ManagementMoveModel.TELMID) //操作可能な電話かチェック
				//資産管理権限無し	20090408houshi
				{
					A_data[cnt].telno = A_data[cnt].manageno;
					A_data[cnt].telno_view = A_data[cnt].manageno_view;
					A_data[cnt].carid = A_data[cnt].coid;
					A_sql.push(this.makeTelMoveSQL(H_post.recogpostid, A_data[cnt]));

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

					if (cym == this.YM) //予約があるか調べる
						{
							var A_reserve = this.getTelReserveList(A_data[cnt].telno, A_data[cnt].carid);

							if (A_reserve.length > 0) {
								for (var rcnt = 0; rcnt < A_reserve.length; rcnt++) //移動予約は削除
								{
									if (A_reserve[rcnt].add_edit_flg === ManagementMoveModel.MOVEMODE) //管理記録
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
						}

					if (undefined !== _POST.pastflg == true && _POST.pastflg == 1) //権限チェック
						//資産管理権限無し	20090408houshi
						{
							this.checkPreTelAuth(A_data[cnt].telno, A_data[cnt].telno_view, A_data[cnt].carid, A_prepost);
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
						}

					A_sql.push(this.makeTelMoveLogSQL(A_data[cnt], H_post, cym));
				}

			if (A_data[cnt].mid == ManagementMoveModel.ETCMID) //操作可能なETCかチェック
				//過去分も移動
				{
					A_data[cnt].cardno = A_data[cnt].manageno;
					A_data[cnt].cardno_view = A_data[cnt].manageno_view;
					A_data[cnt].cardcoid = A_data[cnt].coid;
					A_sql.push(this.makeEtcMoveSQL(H_post.recogpostid, A_data[cnt]));

					if (undefined !== _POST.pastflg == true && _POST.pastflg == 1) //権限チェック
						{
							this.checkPreEtcAuth(A_data[cnt].cardno, A_data[cnt].cardno_view, A_prepost);
							A_sql.push(this.makeEtcMoveSQL(H_post.recogpostid, A_data[cnt], true));
						}

					A_sql.push(this.makeEtcMoveLogSQL(A_data[cnt], H_post, cym));
				}

			if (A_data[cnt].mid == ManagementMoveModel.PURCHMID) //操作可能な購買IDかチェック
				//過去分も移動
				{
					A_data[cnt].purchid = A_data[cnt].manageno;
					A_data[cnt].purchcoid = A_data[cnt].coid;
					A_sql.push(this.makePurchMoveSQL(H_post.recogpostid, A_data[cnt]));

					if (undefined !== _POST.pastflg == true && _POST.pastflg == 1) //権限チェック
						{
							this.checkPrePurchAuth(A_data[cnt].purchid, A_data[cnt].purchcoid, A_prepost);
							A_sql.push(this.makePurchMoveSQL(H_post.recogpostid, A_data[cnt], true));
						}

					A_sql.push(this.makePurchMoveLogSQL(A_data[cnt], H_post, cym));
				}

			if (A_data[cnt].mid == ManagementMoveModel.COPYMID) //操作可能なコピー機かチェック
				//過去分も移動
				{
					A_data[cnt].copyid = A_data[cnt].manageno;
					A_data[cnt].copycoid = A_data[cnt].coid;
					A_sql.push(this.makeCopyMoveSQL(H_post.recogpostid, A_data[cnt]));

					if (undefined !== _POST.pastflg == true && _POST.pastflg == 1) //権限チェック
						{
							this.checkPreCopyAuth(A_data[cnt].copyid, A_data[cnt].copycoid, A_prepost);
							A_sql.push(this.makeCopyMoveSQL(H_post.recogpostid, A_data[cnt], true));
						}

					A_sql.push(this.makeCopyMoveLogSQL(A_data[cnt], H_post, cym));
				}

			if (A_data[cnt].mid == ManagementMoveModel.ASSMID) //操作可能なコピー機かチェック
				//過去分も移動
				{
					A_data[cnt].assetsid = A_data[cnt].coid;
					A_sql.push(this.makeAssetsMoveSQL(H_post.recogpostid, A_data[cnt]));

					if (undefined !== _POST.pastflg == true && _POST.pastflg == 1) //権限チェック
						{
							this.checkPreAssetsAuth(A_data[cnt].assetsid, A_prepost);
							A_sql.push(this.makeAssetsMoveSQL(H_post.recogpostid, A_data[cnt], true));
						}

					A_sql.push(this.makeAssetsMoveLogSQL(A_data[cnt], H_post, cym));
				}

			if (A_data[cnt].mid == ManagementMoveModel.TRANMID) //操作可能なコピー機かチェック
				//過去分も移動
				{
					A_data[cnt].tranid = A_data[cnt].manageno;
					A_data[cnt].trancoid = A_data[cnt].coid;
					A_sql.push(this.makeTranMoveSQL(H_post.recogpostid, A_data[cnt]));

					if (undefined !== _POST.pastflg == true && _POST.pastflg == 1) //権限チェック
						{
							this.checkPreTranAuth(A_data[cnt].tranid, A_data[cnt].trancoid, A_prepost);
							A_sql.push(this.makeTranMoveSQL(H_post.recogpostid, A_data[cnt], true));
						}

					A_sql.push(this.makeTranMoveLogSQL(A_data[cnt], H_post, cym));
				}

			if (A_data[cnt].mid == ManagementMoveModel.EVMID) //操作可能なコピー機かチェック
				//過去分も移動
				{
					A_data[cnt].evid = A_data[cnt].manageno;
					A_data[cnt].evcoid = A_data[cnt].coid;
					A_sql.push(this.makeEvMoveSQL(H_post.recogpostid, A_data[cnt]));

					if (undefined !== _POST.pastflg == true && _POST.pastflg == 1) //権限チェック
						{
							this.checkPreEvAuth(A_data[cnt].evid, A_data[cnt].evcoid, A_prepost);
							A_sql.push(this.makeEvMoveSQL(H_post.recogpostid, A_data[cnt], true));
						}

					A_sql.push(this.makeEvMoveLogSQL(A_data[cnt], H_post, cym));
				}

			if (A_data[cnt].mid == ManagementMoveModel.HEALTHMID) //操作可能なコピー機かチェック
				//過去分も移動
				{
					A_data[cnt].healthid = A_data[cnt].manageno;
					A_data[cnt].healthcoid = A_data[cnt].coid;
					A_sql.push(this.makeHealthcareMoveSQL(H_post.recogpostid, A_data[cnt]));

					if (undefined !== _POST.pastflg == true && _POST.pastflg == 1) //権限チェック
						{
							this.checkPreHealthAuth(A_data[cnt].healthid, A_data[cnt].healthcoid, A_prepost);
							A_sql.push(this.makeHealthcareMoveSQL(H_post.recogpostid, A_data[cnt], true));
						}

					A_sql.push(this.makeHealthMoveLogSQL(A_data[cnt], H_post, cym));
				}
		}

		return A_sql;
	}

	checkPreTrgManageAuth(A_data: {} | any[], A_prepostid: {} | any[]) {
		for (var cnt = 0; cnt < A_data.length; cnt++) //対象が電話
		{
			if (A_data[cnt].mid == ManagementMoveModel.TELMID) //権限チェック
				{
					this.checkPreTelAuth(A_data[cnt].manageno, A_data[cnt].manageno_view, A_data[cnt].coid, A_prepostid);
				}

			if (A_data[cnt].mid == ManagementMoveModel.ETCMID) //権限チェック
				{
					this.checkPreEtcAuth(A_data[cnt].manageno, A_data[cnt].manageno_view, A_prepostid);
				}

			if (A_data[cnt].mid == ManagementMoveModel.PURCHMID) //権限チェック
				{
					this.checkPrePurchAuth(A_data[cnt].manageno, A_data[cnt].coid, A_prepostid);
				}

			if (A_data[cnt].mid == ManagementMoveModel.COPYMID) //操作可能なコピー機かチェック
				{
					this.checkPreCopyAuth(A_data[cnt].manageno, A_data[cnt].coid, A_prepostid);
				}

			if (A_data[cnt].mid == ManagementMoveModel.ASSMID) //操作可能なコピー機かチェック
				{
					this.checkPreAssetsAuth(A_data[cnt].coid, A_prepostid);
				}

			if (A_data[cnt].mid == ManagementMoveModel.TRANMID) //操作可能なコピー機かチェック
				{
					this.checkPreTranAuth(A_data[cnt].manageno, A_data[cnt].coid, A_prepostid);
				}

			if (A_data[cnt].mid == ManagementMoveModel.EVMID) //操作可能なコピー機かチェック
				{
					this.checkPreEvAuth(A_data[cnt].manageno, A_data[cnt].coid, A_prepostid);
				}

			if (A_data[cnt].mid == ManagementMoveModel.HEALTHMID) //操作可能なコピー機かチェック
				{
					this.checkPreHealthAuth(A_data[cnt].manageno, A_data[cnt].coid, A_prepostid);
				}
		}

		return A_sql;
	}

	checkPreTelAuth(telno, telno_view, carid, A_prepost) //前月に無い
	{
		var sql = "select count(telno) from " + this.H_Tb.pre_tel_tb + " where " + " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and telno=" + this.get_db().dbQuote(telno, "text", true) + " and carid=" + this.get_db().dbQuote(carid, "integer", true) + " and postid in (" + A_prepost.join(",") + ")";

		if (this.get_db().queryOne(sql) < 1) {
			var O_err = new ViewError();

			if (this.H_G_Sess.language == "ENG") {
				O_err.display("Phone number not existing in the previous month is included. " + telno_view + "<BR>Uncheck the change for the previous month.", 0, _SERVER.PHP_SELF, "Back");
			} else {
				O_err.display("\u524D\u6708\u306B\u5B58\u5728\u3057\u306A\u3044\u96FB\u8A71\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002" + telno_view + "<BR>\u524D\u6708\u5206\u3082\u79FB\u52D5\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
			}

			throw die();
		}
	}

	checkPreEtcAuth(cardno, cardno_view, A_prepost) //前月に無い
	{
		var sql = "select count(cardno) from " + this.H_Tb.pre_card_tb + " where " + " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and cardno=" + this.get_db().dbQuote(cardno, "text", true) + " and postid in (" + A_prepost.join(",") + ")" + " and delete_flg=false";

		if (this.get_db().queryOne(sql) < 1) {
			var O_err = new ViewError();
			O_err.display("\u524D\u6708\u306B\u5B58\u5728\u3057\u306A\u3044ETC\u30AB\u30FC\u30C9\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002" + cardno_view + "<BR>\u524D\u6708\u5206\u3082\u79FB\u52D5\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
			throw die();
		}
	}

	checkPrePurchAuth(purchid, purchcoid, A_prepost) //前月に無い
	{
		var sql = "select count(purchid) from " + this.H_Tb.pre_purchase_tb + " where " + " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and purchid=" + this.get_db().dbQuote(purchid, "text", true) + " and purchcoid=" + this.get_db().dbQuote(purchcoid, "integer", true) + " and postid in (" + A_prepost.join(",") + ")" + " and delete_flg=false";

		if (this.get_db().queryOne(sql) < 1) {
			var O_err = new ViewError();
			O_err.display("\u524D\u6708\u306B\u5B58\u5728\u3057\u306A\u3044\u8CFC\u8CB7ID\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002" + purchid + "<BR>\u524D\u6708\u5206\u3082\u79FB\u52D5\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
			throw die();
		}
	}

	checkPreCopyAuth(copyid, copycoid, A_prepost) //前月に無い
	{
		var sql = "select count(copyid) from " + this.H_Tb.pre_copy_tb + " where " + " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and copyid=" + this.get_db().dbQuote(copyid, "text", true) + " and copycoid=" + this.get_db().dbQuote(copycoid, "integer", true) + " and postid in (" + A_prepost.join(",") + ")" + " and delete_flg=false";

		if (this.get_db().queryOne(sql) < 1) {
			var O_err = new ViewError();
			O_err.display("\u524D\u6708\u306B\u5B58\u5728\u3057\u306A\u3044\u30B3\u30D4\u30FC\u6A5F\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002" + copyid + "<BR>\u524D\u6708\u5206\u3082\u79FB\u52D5\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
			throw die();
		}
	}

	checkPreAssetsAuth(assetsid, A_prepost) //前月に無い
	{
		var sql = "select count(assetsid) from " + this.H_Tb.pre_assets_tb + " where " + " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and assetsid=" + this.get_db().dbQuote(assetsid, "integer", true) + " and postid in (" + A_prepost.join(",") + ")" + " and delete_flg=false";

		if (this.get_db().queryOne(sql) < 1) {
			var O_err = new ViewError();

			if (this.H_G_Sess.language == "ENG") {
				O_err.display("\u2605\u524D\u6708\u306B\u5B58\u5728\u3057\u306A\u3044\u8CC7\u7523\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002" + assetsno + "<BR>\u524D\u6708\u5206\u3082\u79FB\u52D5\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
			} else {
				O_err.display("\u524D\u6708\u306B\u5B58\u5728\u3057\u306A\u3044\u8CC7\u7523\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002" + assetsno + "<BR>\u524D\u6708\u5206\u3082\u79FB\u52D5\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
			}

			throw die();
		}
	}

	checkPreTranAuth(tranid, trancoid, A_prepost) //前月に無い
	{
		var sql = "select count(tranid) from " + this.H_Tb.pre_transit_tb + " where " + " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and tranid=" + this.get_db().dbQuote(tranid, "text", true) + " and trancoid=" + this.get_db().dbQuote(trancoid, "integer", true) + " and postid in (" + A_prepost.join(",") + ")" + " and delete_flg=false";

		if (this.get_db().queryOne(sql) < 1) {
			var O_err = new ViewError();
			O_err.display("\u524D\u6708\u306B\u5B58\u5728\u3057\u306A\u3044\u904B\u9001ID\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002" + tranid + "<BR>\u524D\u6708\u5206\u3082\u79FB\u52D5\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
			throw die();
		}
	}

	checkPreEvAuth(evid, evcoid, A_prepost) //前月に無い
	{
		var sql = "select count(evid) from " + this.H_Tb.pre_ev_tb + " where " + " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and evid=" + this.get_db().dbQuote(evid, "text", true) + " and evcoid=" + this.get_db().dbQuote(evcoid, "integer", true) + " and postid in (" + A_prepost.join(",") + ")" + " and delete_flg=false";

		if (this.get_db().queryOne(sql) < 1) {
			var O_err = new ViewError();
			O_err.display("\u524D\u6708\u306B\u5B58\u5728\u3057\u306A\u3044EV ID\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002" + evid + "<BR>\u524D\u6708\u5206\u3082\u79FB\u52D5\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
			throw die();
		}
	}

	checkPreHealthAuth(healthid, healthcoid, A_prepost) //前月に無い
	{
		var sql = "select count(healthid) from " + this.H_Tb.pre_healthcare_tb + " where " + " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and healthid=" + this.get_db().dbQuote(healthid, "text", true) + " and healthcoid=" + this.get_db().dbQuote(healthcoid, "integer", true) + " and postid in (" + A_prepost.join(",") + ")" + " and delete_flg=false";

		if (this.get_db().queryOne(sql) < 1) {
			var O_err = new ViewError();
			O_err.display("\u524D\u6708\u306B\u5B58\u5728\u3057\u306A\u3044\u30D8\u30EB\u30B9\u30B1\u30A2ID\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002" + tranid + "<BR>\u524D\u6708\u5206\u3082\u79FB\u52D5\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
			throw die();
		}
	}

	__destruct() {
		super.__destruct();
	}

};