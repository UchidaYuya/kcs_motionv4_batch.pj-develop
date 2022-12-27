//
//個別出荷用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author igarashi
//@since 2008/07/27
//@uses ShopOrderDetail
//
//
//
//個別出荷用Model
//
//@uses ModelBase
//@package Order
//@author igarashi
//@since 2008/07/27
//

require("MtMailUtil.php");

require("OrderUtil.php");

require("ShopOrderModelBase.php");

require("ShopOrderDetailModel.php");

//
//受注のサブステータスを取得する
//
//@author igarashi
//@since 2008/07/28
//
//@access public
//@return hash
//
//
//状況に応じたSQLを作成する
//
//@author igarashi
//@since 2008/08/23
//
//
//第4引数がtrueだとステータスによる電話管理反映のチェックが無効になる
//registflgでしかチェックしないことになるので注意
//(注文履歴からの電話管理反映対応。それ以外では必ずfalseで呼ぶこと)
//(registflgが実装された時点でステータスチェックなんていらない気もする)
//
//@access public
//@return array
//
//
//updateCancelTransfer
//
//@author igarashi
//@since 2009/05/26
//
//@param mixed $H_sess
//@param mixed $H_order
//@access public
//@return void
//
//
//orderid順に並び替えて返す
//
//@author igarashi
//@since 2008/10/30
//
//
//
//sub_tbの日時空欄を防ぐ<br>
//検索でよけいな空白をヒットさせないようにする
//
//@author igarashi
//@since 2009/03/12
//
//@param mixed $H_sss
//@param mixed $H_order
//@access protected
//@return void
//
//
//処理済み未満の受注を抽出して返す
//
//@author igarashi
//@since 2008/08/24
//
//
//
//@access protected
//@return hash
//
//
//売上とも振替えようとしている明細が過去に開通のみで振替えられているかチェックする
//
//@author igarashi
//@since 2008/11/22
//
//@param $H_info
//
//@access protected
//@return mixed
//
//
//操作中の販売店から過去に振替えられているかチェックする
//
//@author igarashi
//@since 2008/11/22
//
//@param $H_info
//@param $shopid
//
//@access protected
//@return mixed
//
//
//order_tbのupdate文を作成する(サブ用)
//
//@author igarashi
//@since 2008/08/22
//
//@param $H_order
//
//@access public
//@return array
//
//
//makeCancelTransferCount
//
//@author igarashi
//@since 2009/10/22
//
//@param mixed $H_order
//@access protected
//@return void
//
//
//makeTransferChargeCtrl
//
//@author igarashi
//@since 2009/10/09
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $H_order
//@access protected
//@return void
//
//
//makeInsertTransferChargeSQL
//
//@author igarashi
//@since 2009/10/09
//
//@access protected
//@return void
//
//
//makeUpdateTransferChargeSQL
//
//@author igarashi
//@since 2009/10/09
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $H_order
//@param mixed $type
//@access protected
//@return void
//
//
//makeDeleteTransferChargeCountFollowSQL
//
//@author igarashi
//@since 2009/10/09
//
//@param mixed $H_order
//@access protected
//@return void
//
//
//makeDeleteTransferChargeCountSql
//
//@author igarashi
//@since 2009/10/22
//
//@param mixed $H_order
//@access protected
//@return void
//
//
//makeRecoveryTransferChargeCountSql
//
//@author igarashi
//@since 2010/03/16
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $H_order
//@param mixed $H_permit
//@access private
//@return void
//
//
//getTransferChargeCount
//
//@author igarashi
//@since 2009/10/09
//
//@param mixed $orderid
//@param mixed $shopid
//@access protected
//@return void
//
//
//getDeleteTransferTarget
//
//@author igarashi
//@since 2008/01/01
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $sort
//@param mixed $H_view
//@access protected
//@return void
//
//
//makeCancelTransferSQL
//
//@author igarashi
//@since 2008/12/22
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $H_order
//@param mixed $sort
//
//@access public
//@return void
//
//
//部分振替用sqlを作成して返す
//
//
//@since 2008/09/15
//
//
//
//電話番号が入力済みの受注を抽出する
//
//@author igarashi
//@since 2008/08/24
//
//
//
//checkboxのsessionを成形する
//
//@author igarashi
//@since 2008/08/24
//
//@access public
//@return array
//
//
//更新するよう指定されていたらupdateに追加
//mt_order_teldetail_tb用
//
//@author igarashi
//@since 2008/08/22
//
//@param
//
//@access protected
//@return string
//
//
//更新するよう指定されていたらupdateに追加<br>
//mt_order_sub_tb用
//
//@author igarashi
//@since 2008/08/26
//
//@param
//
//@access protected
//@return string
//
//
//サブコメント更新用のsql(set句)を返す
//
//@author igarashi
//@since 2008/10/10
//
//
//
//
//
//
//納品日と処理日を更新するためのsql文(SET句)を返す
//
//@author igarashi
//@since 2008/10/10
//
//
//
//
//
//
//契約日と登録日の更新用sqlを返す
//
//@author igarashi
//@since 2008/09/00
//
//@oaram $H_order
//@param $H_permit
//@param $mode
//
//@access protected
//@return string
//
//
//sendTransferMail
//
//@author
//@since 2009/01/09
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $H_order
//@access public
//@return void
//
//
//sendCancelTransferMail
//
//@author igarashi
//@since 2009/01/09
//
//@param mixed $H_g_sess
//@param mixed $H_order
//@access public
//@return void
//
//
//getFromMailAddr
//
//@author igarashi
//@since 2009/01/09
//
//@param mixed $shopid
//@access protected
//@return void
//
//
//メールの内容を取得して返す
//
//@author igarashi
//@since 2008/10/02
//
//@param $H_g_sess
//@param $H_sess
//@param $H_mail
//
//@access protected
//@return hash
//
//
//getCancelTransferMailContents
//
//@author igarashi
//@since 2008/10/02
//
//@param mixed $H_g_sess
//@param mixed $H_mail
//@param mixed $frommail
//@access protected
//@return void
//
//
//QuickFormのデフォルト値を設定する
//
//@author igarashi
//@since 2009/07/16
//
//@param mixed $H_info
//@access public
//@return void
//
//
//入力された電話番号が重複していたらエラーを返す
//
//@author igarashi
//@since 2008/10/17
//
//@param $orderid
//@param $H_sess
//
//@access public
//@return mixed
//
//
//checkUserInputSerialno
//
//@author igarashi
//@since 2009/07/10
//
//@param mixed $orderid
//@param mixed $H_order
//@access public
//@return void
//
//
//checkUserInputSimno
//
//@author igarashi
//@since 2010/03/03
//
//@param mixed $H_sess
//@param mixed $H_order
//@param mixed $orderid
//@access public
//@return void
//
//
//登録日と契約日の日付の前後関係をチェックする
//
//@author igarashi
//@since 2008/10/21
//
//@param $H_sess
//
//@access public
//@return mixed
//
//
//出荷済みかどうか調べる
//
//@author igarashi
//@since 2008/10/25
//
//@param $nowstat
//@param $exestat
//
//@access public
//@return bool
//
//
//明細のステータス全て同じになれば「完納」にまで引き上げる
//
//@author igarashi
//@since 2009/01/11
//
//@param mixed $orderid
//@access public
//@return void
//
//
//cleanTransferCharge
//
//@author igarashi
//@since 2009/10/22
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//makeUniqueOrderData
//
//@author igarashi
//@since 2008/12/24
//
//@param mixed $H_view
//@access public
//@return void
//
//
//部分振替が全部消されたらmt_order_tbのカラムからも振替情報を消す
//
//@author igarashi
//@since 2008/12/24
//
//@param mixed $H_view
//@access public
//@return void
//
//
//振替削除対象の情報を削除前に確保しておく
//
//@author igarashi
//@since 2008/10/27
//
//@param $H_g_sess
//@param $H_sess
//
//@access public
//@return hash
//
//
//振替が行われたかどうかを判断するための変数を返す
//
//@author igarashi
//@since 2009/01/09
//
//@access public
//@return void
//
//
//getTargetNo
//
//@author igarashi
//@since 2009/07/01
//
//@access public
//@return void
//
//
//checkCancelTransfer
//
//@author igarashi
//@since 2009/07/01
//
//@param mixed $H_order
//@param mixed $H_target
//@param mixed $H_g_sess
//@param mixed $H_sess
//@access public
//@return void
//
//
//渡されたaridの電話情報がもっているdetail_sortを返す
//
//@author igarashi
//@since 2009/01/15
//
//@param mixed $A_arid
//@param mixed $orderid
//@access protected
//@return void
//
//
//checkInputDeliveryDate
//
//@author igarashi
//@since 2010/01/29
//
//@param mixed $H_sess
//@param mixed $H_order
//@access protected
//@return void
//
//
//checkInputExpectDate
//
//@author igarashi
//@since 2010/01/29
//
//@param mixed $H_sess
//@param mixed $H_order
//@access public
//@return void
//
//
//updateTransferChargeCountCancelStatus
//
//@author igarashi
//@since 2010/03/15
//
//@param mixed $H_sess
//@param mixed $H_order
//@access private
//@return void
//
//
//updateTransferChargeCountRecoveryStatus
//
//@author igarashi
//@since 2010/03/16
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $H_order
//@param mixed $H_permit
//@access private
//@return void
//
//
//getProcNumberTargetShopId
//
//@author igarashi
//@since 2010/03/16
//
//@param mixed $orderid
//@param mixed $sort
//@param mixed $level
//@access private
//@return void
//
//
//makeRegistFlgSQL
//
//@author
//@since 2010/10/05
//
//@param mixed $orderid
//@param mixed $detail_sort
//@access public
//@return void
//
//
//updateTelcnt
//
//@author web
//@since 2012/10/30
//
//@param mixed $H_sess
//@param mixed $debug
//@access public
//@return void
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/07/27
//
//@access public
//@return none
//
class ShopOrderSubStatusModel extends ShopOrderDetailModel {
	constructor(O_db0, H_g_sess) //parent::__construct($O_db0, $H_g_sess, self::SITE_SHOP); -> self::の原因で、変換できない
	{
		this.transferflg = false;
		this.canceltransferflg = false;
		this.A_target = this.O_order.A_empty;
		this.H_transcharge.maccnt = 0;
		this.H_transcharge.acccnt = 0;
		this.A_modsql;
		this.deletemaccnt = 0;
		this.deleteacccnt = 0;
		this.deletetelcnt = 0;
	}

	getOrderSubStatus() {
		var sql = "SELECT " + "status, forshop, forsub FROM mt_status_tb " + "WHERE " + "(shopflg=true AND subflg=TRUE) OR status=230 " + "ORDER BY sort";
		return this.get_DB().queryHash(sql);
	}

	makeUpdateSQLCtrl(H_g_sess, H_sess, H_order, post = false) //detail_sortを拾っておく(updateの条件に使うのだ)
	//新規なら電話管理に既存の情報がないか確認
	//選ばれていない明細は弾く
	//処理済み未満の受注を拾う
	//変更できる受注情報から電話番号だけ取得
	//日付取得
	//SQL作成処理開始
	{
		var A_deletetel = [this.O_order.type_del, this.O_order.type_mnp];
		H_permit.unperm = Array();
		var dupcnt = 0;
		var A_telno = Array();

		if (this.O_order.type_blp != H_order.order.order.ordertype) {
			var A_sort = H_sess.SELF.uptarget;
		} else {
			A_sort = this.getAreaToDetailSort(H_sess.SELF.uptarget, H_order.order.order.orderid);
		}

		if (this.O_order.type_new == H_order.order.order.ordertype) //入力済みの電話番号を抜き出す
			//電話管理から既存の電話情報を取得
			//処理済み移行はエラーに引っ掛けなくていいから検査対象から外しておく
			{
				A_telno = this.extractOrderColumn(H_order.order.machine, "telno", A_sort);
				var A_tempdup = this.getTelInfomation(A_telno, H_order.order);

				for (var val of Object.values(H_order.order.machine)) {
					if (this.O_order.st_sub_prcfin > val.substatus && this.O_order.st_cancel != H_sess.SELF.status) {
						if (true == (-1 !== A_tempdup.indexOf(val.telno))) {
							A_duptel[dupcnt] = val.telno;
							dupcnt++;
						}
					} else if (this.O_order.st_cancel == val.substatus && this.O_order.st_sub_prcfin <= H_sess.SELF.status && this.O_order.st_cancel != H_sess.SELF.status) {
						if (true == (-1 !== A_tempdup.indexOf(val.telno))) {
							A_duptel[dupcnt] = val.telno;
							dupcnt++;
						}
					}
				}

				if (H_sess.SELF.status >= this.O_order.st_sub_prcfin) //登録済みの電話はupdate対象から外す
					{
						var H_permit = this.checkOrderDuplication(A_telno, H_order.order.machine, H_order.order.order.pacttype, H_permit, A_duptel);

						if (this.O_ordertype_new == H_order.order.order.ordertype) //電話番号が入力済みか確認
							{
								H_permit = this.checkInputTelno(H_sess.SELF, H_permit);
							}

						H_permit = this.checkOrderInfoMasterData(H_order.order.order, H_permit);
					} else {
					H_permit.permit = H_order.order.machine;
				}
			} else if (this.O_order.type_chn == H_order.order.order.ordertype || this.O_order.type_shi == H_order.order.order.ordertype || this.O_order.type_mnp == H_order.order.order.ordertype || this.O_order.type_tpc == H_order.order.order.ordertype) {
			A_telno = this.extractOrderColumn(H_order.order.machine, "telno");
			var A_duptel = this.getTelInfomation(A_telno, H_order.order);
			H_permit = this.checkOrderNotDuplication(A_telno, H_order.order.machine, H_order.order.order.pacttype, H_permit, A_duptel);
			H_permit = this.checkStayPlanCont(H_order.order, H_permit);
			H_permit = this.checkOrderInfoMasterData(H_order.order.order, H_permit);
		} else {
			H_permit.permit = H_order.order.machine;
			H_permit = this.checkOrderInfoMasterData(H_order.order.order, H_permit);
		}

		{
			let _tmp_0 = H_permit.permit;

			for (var key in _tmp_0) {
				var val = _tmp_0[key];

				if (true == (-1 !== A_sort.indexOf(val.detail_sort))) {
					H_result[key] = val;
				} else {
					H_promote[val.substatus]++;
				}
			}
		}
		H_permit.permit = H_result;
		var H_result = Array();
		{
			let _tmp_1 = H_order.order.acce;

			for (var key in _tmp_1) {
				var val = _tmp_1[key];

				if (true == (-1 !== A_sort.indexOf(val.detail_sort))) {
					H_result[key] = val;
				}
			}
		}
		H_order.order.acce = H_result;
		H_permit = this.checkOrderStatus(H_g_sess, H_sess, H_permit, H_order.order.acce, H_order);
		A_telno = this.extractOrderColumn(H_permit.permit, "telno");
		var nowtime = MtDateUtil.getNow();
		var nowdate = this.O_order.today;

		if (0 < H_permit.permit.length) //処理台数を計算しなおす
			//管理ログを記録
			{
				var idx = 0;
				{
					let _tmp_2 = H_permit.permit;

					for (var key in _tmp_2) //detail_sortがあるものだけ処理すればよい
					{
						var val = _tmp_2[key];

						if (true == (-1 !== A_sort.indexOf(val.detail_sort))) //オーダー系
							{
								if (this.getShopUser()) {
									if (true != (undefined !== A_sql[val.orderid])) {
										A_sql[val.orderid] = this.makeOrderUpdateSQL(H_g_sess, H_sess, val, val.detail_sort, nowtime, idx, H_order);
									} else {
										A_sql[val.orderid] = array_merge(A_sql[val.orderid], this.makeOrderUpdateSQL(H_g_sess, H_sess, val, val.detail_sort, nowtime, idx, H_order));
									}
								} else {
									if (val.machineflg && true != (undefined !== A_sql[val.orderid])) {
										A_sql[val.orderid] = [this.makeRegistFlgSQL(val.orderid, val.detail_sort)];
									}
								}

								if (230 == H_sess.SELF.status) {
									A_sql[val.orderid] = array_merge(A_sql[val.orderid], this.releaseExtensionNo(H_order.order.order, val));
								}

								if (true == val.machineflg && this.O_order.st_cancel != H_sess.SELF.status) {
									if (!val.registflg && (this.checkEndSubStatus(H_sess.SELF.status, val.substatus, "proc") || true === post)) //電話管理更新SQL作成
										//端末管理を更新SQL作成
										//management_log_tbに記録
										{
											A_sql[val.orderid] = array_merge(A_sql[val.orderid], this.makeTelUpdateSQL(H_g_sess, H_sess, val, H_order.order.order, nowtime));
											A_sql[val.orderid] = array_merge(A_sql[val.orderid], this.makeAssetsUpdateSQL(H_sess.SELF, val, H_order.order, H_order.assets, nowtime));

											if (this.O_order.type_mnp != H_order.order.order.ordertype) {
												A_sql[val.orderid].push(this.makeManagementLogSQL(H_g_sess, H_sess, H_order.order.order, val, nowtime));
											}
										}
								}

								A_sql[val.orderid].push(this.makeTelManagementDateSQL(H_sess.SELF, H_order.order.order, val));
								idx++;
							}
					}
				}

				if (true == (undefined !== H_sess.SELF.status) && this.O_order.st_cancel == H_sess.SELF.status) {
					for (var val of Object.values(H_permit.permit)) {
						A_sql[H_order.order.order.orderid].push(this.updateTransferChargeCountCancelStatus(H_g_sess, H_sess, H_order, val));
					}
				} else if (true == (undefined !== H_sess.SELF.status)) {
					for (var val of Object.values(H_permit.permit)) {
						A_sql[H_order.order.order.orderid].push(this.updateTransferChargeCountRecoveryStatus(H_g_sess, H_sess, H_order, val));
					}
				}

				if (false == (undefined !== H_sess.SELF.status) || this.O_order.st_cancel != H_sess.SELF.status) {
					var bTrans = false;

					if (true == this.transferflg || true == this.canceltransferflg) {
						var H_tempsql = this.makeTransferChargeCtrl(H_g_sess, H_sess, H_order, H_permit.permit, nowtime);

						for (var updatesql of Object.values(H_tempsql)) {
							A_sql[H_order.order.order.orderid].push(updatesql);
							bTrans = true;
						}
					}

					if (bTrans) {
						var sql = "UPDATE mt_order_tb SET retransfer_from_shopid = null,retransfer_to_shopid = null" + " WHERE orderid=" + H_order.order.order.orderid;
						A_sql[H_order.order.order.orderid].push(sql);
					}
				}

				var orderid = this.get_DB().dbQuote(H_order.order.order.orderid, "integer", true);
				sql = "update mt_order_sub_tb" + " set deliverydate = (select deliverydate from mt_order_teldetail_tb where" + " orderid = " + orderid + " and substatus != 230" + " order by detail_sort limit 1 ) " + " where " + " orderid = " + orderid + " and ( select count(*) from mt_order_teldetail_tb where orderid = " + orderid + " and substatus != 230 ) > 0" + " and ordersubid = 0";
				A_sql[H_order.order.order.orderid].push(sql);
				A_sql[H_order.order.order.orderid].push(this.makeOrderLogSQL(H_permit.permit, H_order.order.order, A_sql, nowtime));
			}

		if (0 < H_permit.unperm.length) {
			if (false == Array.isArray(A_sql[H_order.order.order.orderid])) {
				A_sql[H_order.order.order.orderid] = Array();
			}

			{
				let _tmp_3 = H_permit.unperm;

				for (var key in _tmp_3) {
					var val = _tmp_3[key];
					val.telno = this.O_order.convertNoView(val.orderid);
					var datesql = this.makeTelManagementDateSQL(H_sess.SELF, H_order.order.order, val);

					if ("" != datesql) {
						A_sql[H_order.order.order.orderid].push(datesql);
						H_permit.unperm[key].err += "<br>&nbsp;&nbsp;(\u8CFC\u5165\u65E5\u3001\u5951\u7D04\u65E5\u306E\u5909\u66F4\u306F\u96FB\u8A71\u7BA1\u7406\u306B\u53CD\u6620\u3057\u307E\u3057\u305F)";
					}
				}
			}
		}

		if (this.O_order.type_acc == H_order.order.order.ordertype) {
			var A_dummysql = this.insertDummyDate(H_sess, H_order.order);
			A_sql[H_order.order.order.orderid].push(A_dummysql[0], A_dummysql[1]);
		}

		H_result.sql = A_sql;
		H_result.err = this.sortErrorArray(H_permit.unperm);
		return H_result;
	}

	updateCancelOrderTransfer(H_sess, H_order) {
		if ("trcancel" == H_sess.SELF.trswitch) {
			var trsql = this.deleteTransferType(H_order);
		}
	}

	sortErrorArray(H_data) {
		for (var val of Object.values(H_data)) {
			H_result[val.orderid] = val;
		}

		return H_result;
	}

	insertDummyDate(H_sess, H_order) //$subsql = "UPDATE " .self::ORD_SUB_TB. " SET ";
	//$detsql = "UPDATE " .self::ORD_DET_TB. " SET "; -> self::の原因で、変換できない
	{
		var upsql = "";
		var flg = false;

		if ("specifies" == H_sess.SELF.endsel && true == (undefined !== H_sess.SELF.deliverydate)) {
			flg = true;
			upsql += "deliverydate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.deliverydate, true), "date", false) + " ";
		}

		if ("desig" == H_sess.SELF.expectup && true == (undefined !== H_sess.SELF.expectdate)) {
			flg = true;
			upsql += this.sqlConnect(upsql, ", ") + "expectdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate, true), "date", false) + " ";
		}

		if (true == flg) {
			subsql += upsql + "WHERE orderid=" + H_order.order.orderid + " AND detail_sort=0";
			detsql += upsql + "WHERE orderid=" + H_order.order.orderid + " AND detail_sort=0";
			var A_sql = Array();
			A_sql.push(subsql, detsql);
			return A_sql;
		}

		return undefined;
	}

	checkOrderStatus(H_g_sess, H_sess, H_machine, H_acce, H_order) {
		H_permit.permit = Array();

		if (0 < H_machine.permit.length) {
			for (var val of Object.values(H_machine.permit)) //完了してたらステータスは更新できない
			{
				var errflg = false;

				if (this.O_order.st_complete == val.substatus && true == (undefined !== H_sess.SELF.status)) //履歴からの操作はチェックしない
					{
						if (this.getShopUser()) {
							errflg = true;

							if ("" != val.telno_view) {
								H_machine.unperm.push({
									keyname: "\u96FB\u8A71\u756A\u53F7\uFF1A",
									orderid: val.telno_view,
									err: "\u5B8C\u4E86\u304B\u3089\u306F\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u5909\u66F4\u3067\u304D\u307E\u305B\u3093"
								});
							} else {
								H_machine.unperm.push({
									keyname: "",
									orderid: val.detail_sort + "\u4EF6\u76EE",
									err: "\u5B8C\u4E86\u304B\u3089\u306F\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u5909\u66F4\u3067\u304D\u307E\u305B\u3093"
								});
							}
						}
					} else if (this.O_order.st_cancel == H_order.order.order.status && true == (undefined !== H_sess.SELF.status)) {
					errflg = true;

					if ("" != val.telno_view) {
						H_machine.unperm.push({
							keyname: "\u96FB\u8A71\u756A\u53F7\uFF1A",
							orderid: val.telno_view,
							err: "\u30AD\u30E3\u30F3\u30BB\u30EB\u304B\u3089\u306F\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u5909\u66F4\u3067\u304D\u307E\u305B\u3093"
						});
					} else {
						H_machine.unperm.push({
							keyname: "",
							orderid: val.detail_sort + "\u4EF6\u76EE",
							err: "\u30AD\u30E3\u30F3\u30BB\u30EB\u304B\u3089\u306F\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u5909\u66F4\u3067\u304D\u307E\u305B\u3093"
						});
					}
				} else if (this.O_order.st_prcfin <= val.substatus && true == (undefined !== H_sess.SELF.status) && this.O_order.st_sub_prcfin > +H_sess.SELF.status) //キャンセルからの変更を許可する
					{
						if (this.O_order.st_cancel != val.substatus) {
							errflg = true;

							if ("" != val.telno_view) {
								H_machine.unperm.push({
									keyname: "\u96FB\u8A71\u756A\u53F7\uFF1A",
									orderid: val.telno_view,
									err: "\u51FA\u8377\u6E08\u307F\u3088\u308A\u524D\u306B\u306F\u623B\u305B\u307E\u305B\u3093"
								});
							} else {
								H_machine.unperm.push({
									keyname: "",
									orderid: val.detail_sort + "\u4EF6\u76EE",
									err: "\u51FA\u8377\u6E08\u307F\u3088\u308A\u524D\u306B\u306F\u623B\u305B\u307E\u305B\u3093"
								});
							}
						}
					} else if (this.O_order.st_sub_prcfin <= val.substatus && true == (undefined !== H_sess.SELF.status) && this.O_order.st_sub_prcfin > +H_sess.SELF.status) {
					errflg = true;

					if ("" != val.telno_view) {
						H_machine.unperm.push({
							keyname: "\u96FB\u8A71\u756A\u53F7\uFF1A",
							orderid: val.telno_view,
							err: "\u51E6\u7406\u6E08\u307F\u3088\u308A\u524D\u306B\u306F\u623B\u305B\u307E\u305B\u3093"
						});
					} else {
						H_machine.unperm.push({
							keyname: "",
							orderid: val.detail_sort + "\u4EF6\u76EE",
							err: "\u51E6\u7406\u6E08\u307F\u3088\u308A\u524D\u306B\u306F\u623B\u305B\u307E\u305B\u3093"
						});
					}
				}

				if (true == (undefined !== H_sess.SELF.trans) && undefined != H_sess.SELF.trans) //ステータスが原因で振替不可
					{
						if (this.O_order.st_sub_prcfin <= val.substatus && this.O_order.st_loginpreq != val.substatus) {
							errflg = true;

							if ("" != val.telno_view) {
								H_machine.unperm.push({
									keyname: "\u96FB\u8A71\u756A\u53F7\uFF1A",
									orderid: val.telno_view,
									err: "\u51E6\u7406\u6E08\u4EE5\u964D\u306F\u632F\u66FF\u3067\u304D\u307E\u305B\u3093"
								});
							} else {
								H_machine.unperm.push({
									keyname: "",
									orderid: val.detail_sort + "\u4EF6\u76EE",
									err: "\u51E6\u7406\u6E08\u4EE5\u964D\u306F\u632F\u66FF\u3067\u304D\u307E\u305B\u3093"
								});
							}
						} else if (this.O_order.st_cancel == H_sess.SELF.status) {
							errflg = true;

							if ("" != val.telno_view) {
								H_machine.unperm.push({
									keyname: "\u96FB\u8A71\u756A\u53F7\uFF1A",
									orderid: val.telno_view,
									err: "\u30AD\u30E3\u30F3\u30BB\u30EB\u3068\u632F\u66FF\u306F\u540C\u6642\u306B\u884C\u3048\u307E\u305B\u3093"
								});
							} else {
								H_machine.unperm.push({
									keyname: "",
									orderid: val.detail_sort + "\u4EF6\u76EE",
									err: "\u30AD\u30E3\u30F3\u30BB\u30EB\u3068\u632F\u66FF\u306F\u540C\u6642\u306B\u884C\u3048\u307E\u305B\u3093"
								});
							}
						} else //開通のみで振替実績があれば売上ともでは振替えない
							{
								var temp = true;

								if ("both" == H_sess.SELF.transflg) {
									temp = this.checkTransferStatus(val);
								}

								if (true == Array.isArray(temp)) {
									errflg = true;
									H_machine.unperm.push(temp);
								} else //既に振替えられてたら振替えない
									{
										temp = this.checkPastTransfer(val, H_sess.SELF.trans);

										if (true == Array.isArray(temp)) {
											errflg = true;
											H_machine.unperm.push(temp);
										}
									}
							}
					} else if (true == (undefined !== H_sess.SELF.trswitch) && "trcancel" == H_sess.SELF.trswitch) {
					if (this.O_order.st_sub_prcfin <= val.substatus && this.O_order.st_loginpreq != val.substatus) {
						errflg = true;

						if ("" != val.telno_view) {
							H_machine.unperm.push({
								keyname: "\u96FB\u8A71\u756A\u53F7\uFF1A",
								orderid: val.telno_view,
								err: "\u51E6\u7406\u6E08\u4EE5\u964D\u306E\u632F\u66FF\u30AD\u30E3\u30F3\u30BB\u30EB\u306F\u3067\u304D\u307E\u305B\u3093"
							});
						} else {
							H_machine.unperm.push({
								keyname: "",
								orderid: val.detail_sort,
								err: "\u51E6\u7406\u6E08\u4EE5\u964D\u306E\u632F\u66FF\u30AD\u30E3\u30F3\u30BB\u30EB\u306F\u3067\u304D\u307E\u305B\u3093"
							});
						}
					} else if (this.O_order.st_cancel == H_sess.SELF.status) {
						errflg = true;

						if ("" != val.telno_view) {
							H_machine.unperm.push({
								keyname: "\u96FB\u8A71\u756A\u53F7\uFF1A",
								orderid: val.telno_view,
								err: "\u30AD\u30E3\u30F3\u30BB\u30EB\u3068\u632F\u66FF\u53D6\u6D88\u306F\u540C\u6642\u306B\u3067\u304D\u307E\u305B\u3093"
							});
						} else {
							H_machine.unperm.push({
								keyname: "",
								orderid: val.detail_sort,
								err: "\u30AD\u30E3\u30F3\u30BB\u30EB\u3068\u632F\u66FF\u53D6\u6D88\u306F\u540C\u6642\u306B\u3067\u304D\u307E\u305B\u3093"
							});
						}
					} else {
						temp = this.checkCancelTransfer(H_order, val, H_g_sess, H_sess);

						if (true == Array.isArray(temp)) {
							errflg = true;
							H_machine.unperm.push(temp);
						}
					}
				} else if (this.O_order.st_cancel == val.substatus && undefined !== H_sess.SELF.status && this.O_order.st_sub_prcfin <= +H_sess.SELF.status) {
					if (this.O_order.st_sub_prcfin <= H_sess.SELF.status && this.O_order.st_sub_shipfin >= H_sess.SELF.status) {
						var errmes = "\u30AD\u30E3\u30F3\u30BB\u30EB\u304B\u3089\u51E6\u7406\u6E08\u30FB\u51FA\u8377\u6E08\u306F\u76F4\u63A5\u9078\u629E\u51FA\u6765\u307E\u305B\u3093\u3002\u4E00\u5EA6\u51E6\u7406\u6E08\u4EE5\u524D\u306E\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u7D4C\u7531\u3057\u3066\u304F\u3060\u3055\u3044";

						if ("" != val.telno_view) {
							H_machine.unperm.push({
								keyname: "\u96FB\u8A71\u756A\u53F7\uFF1A",
								orderid: val.telno_view,
								err: errmes
							});
						} else {
							H_machine.unperm.push({
								keyname: "",
								orderid: val.detail_sort + "\u4EF6\u76EE",
								err: errmes
							});
						}
					}
				}

				if (false == errflg && undefined != val) {
					H_permit.permit.push(val);
				}
			}
		}

		if (0 < H_acce.length) //配列なら先頭のキーを保存
			{
				if (true == Array.isArray(H_acce)) {
					var arraykey = key(H_acce);
				}

				if (1 <= H_acce.length && undefined != H_acce[arraykey]) {
					for (var val of Object.values(H_acce)) {
						errflg = false;

						if (undefined != H_sess.SELF.status && this.O_order.st_sub_shipfin <= val.substatus && this.O_order.st_sub_shipfin > H_sess.SELF.status) {
							if (this.O_order.st_cancel != val.substatus) {
								errflg = true;

								if ("" != val.productname) {
									H_machine.unperm.push({
										keyname: "",
										orderid: val.productname,
										err: "\u51FA\u8377\u6E08\u307F\u3088\u308A\u524D\u306B\u306F\u623B\u305B\u307E\u305B\u3093"
									});
								} else {
									H_machine.unperm.push({
										keyname: "",
										orderid: val.detail_sort + "\u4EF6\u76EE",
										err: "\u51FA\u8377\u6E08\u307F\u3088\u308A\u524D\u306B\u306F\u623B\u305B\u307E\u305B\u3093"
									});
								}
							}
						} else if (true == (undefined !== H_sess.SELF.trans) && undefined != H_sess.SELF.trans) {
							if (this.O_order.st_sub_prcfin <= val.substatus) {
								errflg = true;

								if ("" != val.telno_view) {
									H_machine.unperm.push({
										keyname: "\u96FB\u8A71\u756A\u53F7\uFF1A",
										orderid: val.telno_view,
										err: "\u51E6\u7406\u6E08\u4EE5\u964D\u306F\u632F\u66FF\u3067\u304D\u307E\u305B\u3093"
									});
								} else {
									H_machine.unperm.push({
										keyname: "",
										orderid: val.detail_sort + "\u4EF6\u76EE",
										err: "\u51E6\u7406\u6E08\u4EE5\u964D\u306F\u632F\u66FF\u3067\u304D\u307E\u305B\u3093"
									});
								}
							} else if (this.O_order.st_cancel == H_sess.SELF.status) {
								errflg = true;

								if ("" != val.telno_view) {
									H_machine.unperm.push({
										keyname: "\u96FB\u8A71\u756A\u53F7\uFF1A",
										orderid: val.telno_view,
										err: "\u30AD\u30E3\u30F3\u30BB\u30EB\u3068\u632F\u66FF\u306F\u540C\u6642\u306B\u884C\u3048\u307E\u305B\u3093"
									});
								} else {
									H_machine.unperm.push({
										keyname: "",
										orderid: val.detail_sort + "\u4EF6\u76EE",
										err: "\u30AD\u30E3\u30F3\u30BB\u30EB\u3068\u632F\u66FF\u3048\u306F\u540C\u6642\u306B\u884C\u3048\u307E\u305B\u3093"
									});
								}
							} else {
								temp = false;

								if ("both" == H_sess.SELF.transflg) {
									temp = this.checkTransferStatus(val);
								}

								if (true == Array.isArray(temp)) {
									errflg = true;
									H_machine.unperm.push(temp);
								} else {
									temp = this.checkPastTransfer(val, H_sess.SELF.trans);

									if (true == Array.isArray(temp)) {
										errflg = true;
										H_machine.unperm.push(temp);
									}
								}
							}
						} else if ("trcancel" == H_sess.SELF.trswitch) {
							if (this.O_order.st_sub_prcfin <= val.substatus) {
								errflg = true;

								if ("" != val.productname) {
									H_machine.unperm.push({
										keyname: "\u5546\u54C1\u540D\uFF1A",
										orderid: val.productname,
										err: "\u51E6\u7406\u6E08\u4EE5\u964D\u306E\u632F\u66FF\u30AD\u30E3\u30F3\u30BB\u30EB\u306F\u3067\u304D\u307E\u305B\u3093"
									});
								} else {
									H_machine.unperm.push({
										keyname: "",
										orderid: val.detail_sort,
										err: "\u51E6\u7406\u6E08\u4EE5\u964D\u306E\u632F\u66FF\u30AD\u30E3\u30F3\u30BB\u30EB\u306F\u3067\u304D\u307E\u305B\u3093"
									});
								}
							} else if (this.O_order.st_cancel == H_sess.SELF.status) {
								errflg = true;

								if ("" != val.productname) {
									H_machine.unperm.push({
										keyname: "\u5546\u54C1\u540D\uFF1A",
										orderid: val.productname,
										err: "\u30AD\u30E3\u30F3\u30BB\u30EB\u3068\u632F\u66FF\u53D6\u6D88\u306F\u540C\u6642\u306B\u3067\u304D\u307E\u305B\u3093"
									});
								} else {
									H_machine.unperm.push({
										keyname: "",
										orderid: val.detail_sort,
										err: "\u30AD\u30E3\u30F3\u30BB\u30EB\u3068\u632F\u66FF\u53D6\u6D88\u306F\u540C\u6642\u306B\u3067\u304D\u307E\u305B\u3093"
									});
								}
							} else {
								temp = this.checkCancelTransfer(H_order, val, H_g_sess, H_sess);

								if (true == Array.isArray(temp)) {
									errflg = true;
									H_machine.unperm.push(temp);
								}
							}
						}

						if (false == errflg && undefined != val) {
							H_permit.permit.push(val);
						}
					}
				}
			}

		H_permit.unperm = H_machine.unperm;
		return H_permit;
	}

	checkTransferStatus(H_info) {
		var sql = "SELECT " + "count(transfer_status) " + "FROM " + "mt_transfer_tb " + "WHERE " + "orderid=" + H_info.orderid + " AND detail_sort=" + H_info.detail_sort + " AND transfer_status = 'work'";

		if (0 < this.get_DB().queryOne(sql)) {
			if ("" != H_info.telno_view) {
				var A_result = {
					keyname: "\u96FB\u8A71\u756A\u53F7\uFF1A",
					orderid: H_info.telno_view,
					err: "\u300C\u958B\u901A\u306E\u307F\u300D\u3067\u632F\u66FF\u3048\u3089\u308C\u305F\u53D7\u6CE8\u3092\u300C\u58F2\u4E0A\u3068\u3082\u300D\u3067\u632F\u66FF\u308B\u3053\u3068\u306F\u51FA\u6765\u307E\u305B\u3093"
				};
			} else if ("" != H_info.productname) {
				A_result = {
					keyname: "",
					orderid: H_info.productname,
					err: "\u300C\u958B\u901A\u306E\u307F\u300D\u3067\u632F\u66FF\u3048\u3089\u308C\u305F\u53D7\u6CE8\u3092\u300C\u58F2\u4E0A\u3068\u3082\u300D\u3067\u632F\u66FF\u308B\u3053\u3068\u306F\u51FA\u6765\u307E\u305B\u3093"
				};
			} else {
				A_result = {
					keyname: "",
					orderid: H_info.detail_sort + "\u4EF6\u76EE",
					err: "\u300C\u958B\u901A\u306E\u307F\u300D\u3067\u632F\u66FF\u3048\u3089\u308C\u305F\u53D7\u6CE8\u3092\u300C\u58F2\u4E0A\u3068\u3082\u300D\u3067\u632F\u66FF\u308B\u3053\u3068\u306F\u51FA\u6765\u307E\u305B\u3093"
				};
			}
		} else {
			return true;
		}

		return A_result;
	}

	checkPastTransfer(H_info, shopid) {
		var sql = "SELECT " + "count(fromshopid) " + "FROM " + "mt_transfer_tb " + "WHERE " + "orderid=" + H_info.orderid + " AND detail_sort=" + H_info.detail_sort + " AND fromshopid=" + shopid;
		var shopsql = "SELECT shopid FROM mt_order_tb WHERE orderid=" + H_info.orderid;

		if (0 < this.get_DB().queryOne(sql)) {
			if ("" != H_info.telno_view) {
				var A_result = {
					keyname: "\u96FB\u8A71\u756A\u53F7\uFF1A",
					orderid: H_info.telno_view,
					err: "\u65E2\u306B\u632F\u66FF\u3048\u3089\u308C\u3066\u3044\u307E\u3059"
				};
			} else if ("" != H_info.productname) {
				A_result = {
					keyname: "",
					orderid: H_info.productname,
					err: "\u65E2\u306B\u632F\u66FF\u3048\u3089\u308C\u3066\u3044\u307E\u3059"
				};
			} else {
				A_result = {
					keyname: "",
					orderid: H_info.detail_sort + "\u4EF6\u76EE",
					err: "\u65E2\u306B\u632F\u66FF\u3048\u3089\u308C\u3066\u3044\u307E\u3059"
				};
			}
		} else if (this.get_DB().queryOne(shopsql) == shopid) {
			A_result = {
				keyname: "",
				orderid: H_info.detail_sort + "\u4EF6\u76EE",
				err: "\u53D7\u6CE8\u5143\u306E\u8CA9\u58F2\u5E97\u306B\u632F\u66FF\u3048\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093"
			};
		} else {
			return true;
		}

		return A_result;
	}

	makeOrderUpdateSQL(H_g_sess, H_sess, H_order, sort, nowtime, idx, H_view) //mt_order_sub_tb
	//$subsql = "UPDATE ". self::ORD_SUB_TB. " ".
	//"SET ";  -> self::の原因で、変換できない
	//mt_order_teldetail_tb
	//$detsql = "UPDATE " .self::ORD_DET_TB. " ".    -> self::の原因で、変換できない
	//order_tb
	{
		var A_sql = Array();
		var where = " WHERE " + "orderid=" + H_order.orderid + " AND ordersubid=" + H_order.ordersubid + " AND detail_sort=" + sort;
		var status = undefined;

		if (undefined != H_sess.SELF.status) {
			status = H_sess.SELF.status;
		} else {
			status = H_order.substatus;
		}

		var H_stctag = this.getUpdateStockValue(H_sess.SELF.stock);

		if (undefined != status) {
			subsql += "substatus=" + this.get_DB().dbQuote(status, "int", true) + ", ";
		}

		if (true == H_stctag.upflg) {
			subsql += "stockflg=" + this.get_DB().dbQuote(H_stctag.target, "bool", false) + ", ";
		}

		if ("230" == H_sess.SELF.status) //指定された商品を0個に
			//端末がキャンセルされたら、付属品を1個減らす
			{
				subsql += "number=0, ";

				if (H_order.machineflg) {
					if ("230" != H_order.substatus) //$accereduce = "UPDATE ".self::ORD_SUB_TB." SET number=number-1 WHERE machineflg=false AND orderid=".$this->get_DB()->dbQuote($H_order["orderid"], "int", true); -> self::の原因で、変換できない
						{
							this.deletetelcnt++;
							this.deleteacccnt++;
						}
				}
			}

		subsql += "fixdate=" + this.get_DB().dbQuote(nowtime, "date", true);
		var tmp = this.addUpdateSubColumn(H_sess.SELF, H_order, where, H_view.user_auth);
		subsql += this.sqlConnect(tmp, ", ") + tmp + where;
		"SET ";

		if (undefined != status) {
			detsql += "substatus=" + this.get_DB().dbQuote(status, "int", true) + ", ";
		}

		if (true == H_stctag.upflg) {
			detsql += "stockflg=" + this.get_DB().dbQuote(H_stctag.target, "bool", false) + ", ";
		}

		if (this.checkProcFinish(H_order.substatus, H_sess.SELF.status)) {
			if (this.getRegistType()) {
				if (this.O_order.st_cancel != H_sess.SELF.status) {
					detsql += "registflg=true, ";
				} else {
					detsql += "registflg=false, ";
				}
			} else {
				detsql += "registflg=false, ";
			}
		}

		detsql += "fixdate=" + this.get_DB().dbQuote(nowtime, "date", true);
		tmp = this.addUpdateTelDetailColumn(H_sess.SELF, H_order, H_view.order.order, where, H_view.user_auth);
		detsql += this.sqlConnect(tmp, ", ") + tmp + where;

		if (0 == idx) //$sql = "UPDATE ". self::ORD_TB. " ".    -> self::の原因で、変換できない
			//2015-07-23
			//サブステータスで一番大きい値を取得する（キャンセルは除く）
			//if((null != $status) && ($this->O_order->st_cancel != $status)){
			{
				"SET ";
				var order_status = 0;
				{
					let _tmp_4 = H_view.order.machine;

					for (var m_i in _tmp_4) {
						var m_v = _tmp_4[m_i];

						if (!(-1 !== H_sess.SELF.uptarget.indexOf(m_i)) && this.O_order.st_cancel != m_v.substatus && order_status < m_v.substatus) {
							order_status = m_v.substatus;
						}
					}
				}

				if (undefined != status && this.O_order.st_cancel != status && order_status <= status) {
					sql += "status=" + this.get_DB().dbQuote(status, "int", true) + ", ";
				}

				sql += "fixdate=" + this.get_DB().dbQuote(nowtime, "date", true) + " ";

				if (true == (undefined !== H_sess.SELF.trans) && "" != H_sess.SELF.trans) {
					sql += this.sqlConnectEx(sql, "transfer_type=" + this.get_DB().dbQuote("part", "text", false), ", ", true) + " ";
				}

				sql += "WHERE " + "orderid=" + H_order.orderid;
			}

		if ("trexec" == H_sess.SELF.trswitch) {
			if (true == (undefined !== H_sess.SELF.trans) && "" != H_sess.SELF.trans) {
				var trnsql = this.makeTransferSQL(H_g_sess, H_sess, H_order, sort, nowtime, H_view);

				if (false != trnsql) {
					this.transferflg = true;
				}
			}
		} else if ("trcancel" == H_sess.SELF.trswitch) {
			trnsql = this.makeCancelTransferSQL(H_g_sess, H_sess, H_order, sort, H_view);
			this.makeCancelTransferCount(H_order);

			if (false != trnsql) {
				this.canceltransferflg = true;
			}
		}

		if (this.O_order.type_acc == H_view.order.order.ordertype) //$accesql = "UPDATE " .self::ORD_SUB_TB. " SET ";    -> self::の原因で、変換できない
			{
				accesql += this.addDeliveryAndExpectDateColumn(H_sess.SELF, H_order, "sub", H_view.user_auth);
				accesql += " WHERE " + "orderid=" + this.get_DB().dbQuote(H_order.orderid, "int", true) + " AND detail_sort=0";
			}

		A_sql.push(subsql, detsql, sql, trnsql, accesql);

		if (undefined !== accereduce && !!accereduce) {
			A_sql.push(accereduce);
		}

		return A_sql;
	}

	makeCancelTransferCount(H_order) {
		if (true == H_order.machineflg) {
			this.H_transcharge.maccnt++;
		} else {
			this.H_transcharge.acccnt += H_order.number;
		}
	}

	makeTransferChargeCtrl(H_g_sess, H_sess, H_order, H_permit, nowtime) {
		if (true == this.transferflg) {
			var inssql = this.makeInsertTransferChargeSQL(H_order, nowtime);
			var upsql = this.makeUpdateTransferChargeCountSQL(H_order);
			return [inssql, upsql, ""];
		} else if (true == this.canceltransferflg) {
			var result = this.O_order.A_empty;
			var minsql = this.O_order.A_empty;

			for (var val of Object.values(H_permit)) {
				result.push(this.makeDeleteTransferChargeCountFollowSQL(H_g_sess, H_sess, H_order, val));
				minsql.push(this.makeDeleteTransferChargeCountSql(H_g_sess, H_sess, H_order, val));
			}

			for (var val of Object.values(minsql)) {
				result.push(val);
			}

			return result;
		}
	}

	makeInsertTransferChargeSQL(H_order, nowtime) {
		var sql = "SELECT COUNT(orderid) " + "FROM " + "mt_transfer_charge_shop_tb " + "WHERE " + "orderid=" + this.get_DB().dbQuote(H_order.order.order.orderid, "int", true) + " AND shopid=" + this.get_DB().dbQuote(this.H_transcharge.toshop, "int", true);
		var reccnt = this.get_DB().queryOne(sql);

		if (0 == reccnt) {
			sql = "INSERT INTO mt_transfer_charge_shop_tb (orderid, shopid, maccnt, acccnt, recdate) " + "VALUES(" + this.get_DB().dbQuote(H_order.order.order.orderid, "int", true) + ", " + this.get_DB().dbQuote(this.H_transcharge.toshop, "int", true) + ", " + this.get_DB().dbQuote(this.H_transcharge.maccnt, "int", true) + ", " + this.get_DB().dbQuote(this.H_transcharge.acccnt, "int", true) + ", " + this.get_DB().dbQuote(nowtime, "date", true) + ")";
		} else if (1 == reccnt) {
			var H_target = this.getTransferChargeCount(H_order.order.order.orderid, this.H_transcharge.toshop);
			sql = "UPDATE mt_transfer_charge_shop_tb " + "SET " + "maccnt=" + (H_target.maccnt + this.H_transcharge.maccnt) + ", " + "acccnt=" + (H_target.acccnt + this.H_transcharge.acccnt) + " " + "WHERE " + "orderid=" + this.get_DB().dbQuote(H_order.order.order.orderid, "int", true) + " AND shopid=" + this.get_DB().dbQuote(this.H_transcharge.toshop, "int", true);
		}

		return sql;
	}

	makeUpdateTransferChargeCountSQL(H_order) {
		if (undefined == H_target.maccnt || "" == H_target.maccnt) {
			H_target.maccnt = 0;
		}

		if (undefined == H_target.acccnt || "" == H_target.acccnt) {
			H_target.acccnt = 0;
		}

		var sql = "UPDATE mt_transfer_charge_shop_tb " + "SET " + "maccnt=(maccnt - " + this.H_transcharge.maccnt + "), " + "acccnt=(acccnt - " + this.H_transcharge.acccnt + ") " + "WHERE " + "orderid=" + this.get_DB().dbQuote(H_order.order.order.orderid, "int", true) + " AND shopid=" + this.get_DB().dbQuote(this.H_transcharge.fromshop, "int", true);
		return sql;
	}

	makeDeleteTransferChargeCountFollowSQL(H_g_sess, H_sess, H_order, H_permit) //削除されたら元の販売店の台数増やす
	{
		var target = this.getDeleteTransferTarget(H_g_sess, H_sess, H_permit.detail_sort, H_order);
		var shopid = this.getProcNumberTargetShopId(H_order.order.order, H_permit.detail_sort, target);
		var A_cnt = this.getTransferChargeCount(H_order.order.order.orderid, shopid);

		if (H_permit.machineflg) {
			var plusql = "UPDATE mt_transfer_charge_shop_tb " + "SET " + "maccnt=(maccnt + 1) ";
		} else {
			plusql = "UPDATE mt_transfer_charge_shop_tb " + "SET " + "acccnt=(acccnt + " + this.get_DB().dbQuote(H_permit.number, "int", true) + ") ";
		}

		plusql += "WHERE " + "orderid=" + H_order.order.order.orderid + " AND shopid=" + this.H_transcharge.fromshop;
		return plusql;
	}

	makeDeleteTransferChargeCountSql(H_g_sess, H_sess, H_order, H_permit) {
		var acce;
		var target = this.getDeleteTransferTarget(H_g_sess, H_sess, H_permit.detail_sort, H_order);
		var shopid = this.getProcNumberTargetShopId(H_order.order.order, H_permit.detail_sort, target);
		var chksql = "SELECT maccnt, acccnt FROM mt_transfer_charge_shop_tb WHERE " + "orderid=" + this.get_DB().dbQuote(H_order.order.order.orderid, "int", true) + " AND shopid=" + this.get_DB().dbQuote(shopid, "int", true);
		var cntData = this.get_DB().queryRowHash(chksql);
		var machine = acce = 0;

		if (true == H_permit.machineflg) {
			this.deletemaccnt++;
		} else {
			acce = H_permit.number;
			this.deleteacccnt += acce;
		}

		machine = cntData.maccnt - this.deletemaccnt;
		acce = cntData.acccnt - this.deleteacccnt;

		if (0 > cntData.maccnt - this.deletemaccnt) {
			machine = 0;
		}

		if (0 > cntData.acccnt - this.deleteacccnt) {
			acce = 0;
		}

		var sql = "UPDATE mt_transfer_charge_shop_tb " + "SET " + "maccnt=" + machine + ", " + "acccnt=" + acce + " " + "WHERE " + "orderid=" + this.get_DB().dbQuote(H_order.order.order.orderid, "int", true) + " AND shopid=" + this.get_DB().dbQuote(shopid, "int", true);
		return sql;
	}

	makeRecoveryTransferChargeCountSql(H_g_sess, H_sess, H_order, H_permit) {
		var acce;
		var target = this.getDeleteTransferTarget(H_g_sess, H_sess, H_permit.detail_sort, H_order);
		var shopid = this.getProcNumberTargetShopId(H_order.order.order, H_permit.detail_sort, target);
		var machine = acce = 0;

		if (true == H_permit.machineflg) {
			machine = 1;
		} else {
			acce = H_permit.number;
		}

		var sql = "UPDATE mt_transfer_charge_shop_tb " + "SET " + "maccnt=(maccnt + " + this.get_DB().dbQuote(machine, "int", true) + "), " + "acccnt=(acccnt + " + this.get_DB().dbQuote(acce, "int", true) + ") " + "WHERE " + "orderid=" + this.get_DB().dbQuote(H_order.order.order.orderid, "int", true) + " AND shopid=" + this.get_DB().dbQuote(shopid, "int", true);
		return sql;
	}

	getTransferChargeCount(orderid, shopid) {
		var sql = "SELECT maccnt, acccnt " + "FROM " + "mt_transfer_charge_shop_tb " + "WHERE " + "orderid=" + this.get_DB().dbQuote(orderid, "int", true) + " AND shopid=" + this.get_DB().dbQuote(shopid, "int", true);
		return this.get_DB().queryRowHash(sql);
	}

	getDeleteTransferTarget(H_g_sess, H_sess, sort, H_view) //通常の販売店はこっち
	{
		if (false == H_view.unify) //$sql = "SELECT ".
			//"transfer_level, fromshopid, toshopid ".
			//"FROM ".
			//"mt_transfer_tb ".
			//"WHERE ".
			//"orderid=" .$H_sess[self::PUB]["orderid"].
			//" AND detail_sort=" .$sort.
			//" AND fromshopid=" .$H_g_sess["shopid"]; -> self::の原因で、変換できない
			{
				var H_result = this.get_DB().queryRowHash(sql);
				var target = H_result.transfer_level;
				this.H_transcharge.fromshop = H_result.fromshopid;
				this.H_transcharge.toshop = H_result.toshopid;
			} else //配下の販売店で一番末端の振替情報を拾う
			//$sql = "SELECT ".
			//"max(transfer_level) ".
			//"FROM ".
			//"mt_transfer_tb ".
			//"WHERE ".
			//"orderid=" .$H_sess[self::PUB]["orderid"].
			//" AND detail_sort=" .$sort.
			//" AND fromshopid IN (" .implode(", ", $H_view["keyshop"]). ")";   -> self::の原因で、変換できない
			{
				target = this.get_DB().queryOne(sql);

				if (undefined != target) //$sql = "SELECT ".
					//"fromshopid, toshopid ".
					//"FROM ".
					//"mt_transfer_tb ".
					//"WHERE ".
					//"orderid=" .$H_sess[self::PUB]["orderid"].
					//" AND detail_sort=" .$sort.
					//" AND transfer_level=" .$target;
					//$H_result = $this->get_DB()->queryRowHash($sql);
					//$this->H_transcharge["fromshop"] = $H_result["fromshopid"];
					//$this->H_transcharge["toshop"] = $H_result["toshopid"];  -> self::の原因で、変換できない
					{} else {
					this.H_transcharge.fromshop = H_view.order.order.shopid;
					this.H_transcharge.toshop = 0;
				}
			}

		if (undefined == target) {
			target = 0;
		}

		return target;
	}

	makeCancelTransferSQL(H_g_sess, H_sess, H_order, sort, H_view) {
		var target = this.getDeleteTransferTarget(H_g_sess, H_sess, sort, H_view);
		this.A_target.push(target);

		if (undefined != target) //$result = "DELETE FROM mt_transfer_tb ".
			//"WHERE ".
			//"orderid=" .$H_sess[self::PUB]["orderid"].
			//" AND detail_sort=" .$sort.
			//" AND transfer_level>=" .$target;       -> self::の原因で、変換できない
			{}

		return result;
	}

	makeTransferSQL(H_g_sess, H_sess, H_order, sort, nowtime, H_view) //transfer_tb
	//$sql = "SELECT ".
	//"fromshopid, toshopid, transfer_level ".
	//"FROM ".
	//"mt_transfer_tb ".
	//"WHERE ".
	//"orderid=" .$H_sess[self::PUB]["orderid"]. " ".
	//"AND detail_sort=" .$sort. " ".
	//"ORDER BY ".
	//"transfer_level, fromshopid";  -> self::の原因で、変換できない
	//振替履歴があれば振替回数取得＆操作済みかをチェック
	{
		var temp = this.get_DB().queryHash(sql);
		var maxlevel = 0;

		if (0 < temp.length) {
			for (var key in temp) {
				var val = temp[key];

				if (false == (-1 !== H_view.keyshop.indexOf(val.fromshopid))) {
					maxlevel = val.transfer_level;
					var maxshop = val.fromshopid;
					var toshop = val.toshopid;
				} else {
					if (true == H_view.unify && true == (-1 !== H_view.keyshop.indexOf(val.fromshopid))) {
						maxlevel = val.transfer_level;
						maxshop = val.fromshopid;
						toshop = val.toshopid;
					} else {
						return false;
					}
				}
			}
		}

		if (true == H_view.unify) {
			if (true == (undefined !== maxshop)) {
				if (H_g_sess.shopid == toshop) {
					var transhopid = toshop;
				} else {
					transhopid = maxshop;
				}
			} else {
				transhopid = H_view.order.order.shopid;
			}
		} else {
			transhopid = H_g_sess.shopid;
		}

		if (true == H_order.machineflg) {
			this.H_transcharge.maccnt++;
		} else {
			this.H_transcharge.acccnt += H_order.number;
		}

		this.H_transcharge.toshop = H_sess.SELF.trans;
		this.H_transcharge.fromshop = transhopid;
		this.H_transcharge.level = maxlevel;
		var sql = "INSERT INTO mt_transfer_tb " + "(orderid, ordersubid, detail_sort, fromshopid, toshopid, transfer_status, transfer_date, " + "transfer_level, transfer_type) " + "VALUES(" + this.get_DB().dbQuote(H_order.orderid, "int", true) + ", " + this.get_DB().dbQuote(H_order.ordersubid, "int", true) + ", " + this.get_DB().dbQuote(sort, "int", true) + ", " + this.get_DB().dbQuote(transhopid, "int", true) + ", " + this.get_DB().dbQuote(H_sess.SELF.trans, "int", true) + ", " + this.get_DB().dbQuote(H_sess.SELF.transflg, "text", true) + ", " + this.get_DB().dbQuote(nowtime, "date", true) + ", " + this.get_DB().dbQuote(maxlevel + 1, "int", true) + ", " + this.get_DB().dbQuote(2, "int", true) + " " + ")";
		return sql;
	}

	checkInputTelno(H_sess, H_order) {
		H_result.permit = Array();

		for (var val of Object.values(H_order.permit)) {
			if (this.O_order.st_sub_shipfin >= H_sess.status) {
				if (true == (undefined !== val.telno) && "" != val.telno) {
					H_result.permit.push(val);
				} else //指定されていない枝番は無視していい
					{
						if (true == (undefined !== H_sess.execno[val.detail_sort])) {
							H_order.unperm.push({
								keyname: "",
								orderid: val.detail_sort + 1 + "\u4EF6\u76EE",
								err: "\u96FB\u8A71\u756A\u53F7\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093"
							});
						}
					}
			} else {
				H_result.permit.push(val);
			}
		}

		H_result.unperm = H_order.unperm;
		return H_result;
	}

	convCheckBoxKeyArray(H_sess, key = "subid") {
		var A_result = Array();

		for (var val of Object.values(H_sess)) {
			A_result.push(+val[key]);
		}

		return A_result;
	}

	addUpdateTelDetailColumn(H_sess, H_order, H_view, where, user_auth) //納品日用のsqlを取得
	//契約日
	//登録日
	{
		var A_sql = Array();
		var sql = "";
		sql = this.addDeliveryAndExpectDateColumn(H_sess, H_order, "detail", user_auth);

		if ("1" == H_sess.contractup) {
			if ("" != H_sess.contractdate.Y && "" != H_sess.contractdate.m && H_sess.contractdate.d) {
				var tmpsql = "contractdate='" + H_sess.contractdate.Y + "-" + str_pad(H_sess.contractdate.m, 2, "0", STR_PAD_LEFT) + "-" + str_pad(H_sess.contractdate.d, 2, "0", STR_PAD_LEFT) + "' ";
				sql += this.sqlConnectEx(sql, tmpsql, ", ", true);
			}
		} else if ("C" == H_view.ordertype || is_null(H_order.contractdate) || !H_order.contractdate) {
			if (!!H_sess.expectdate.Y && !!H_sess.expectdate.m && !!H_sess.expectdate.d) {
				tmpsql = "contractdate='" + H_sess.expectdate.Y + "-" + str_pad(H_sess.expectdate.m, 2, "0", STR_PAD_LEFT) + "-" + str_pad(H_sess.expectdate.d, 2, "0", STR_PAD_LEFT) + "' ";
				sql += this.sqlConnectEx(sql, tmpsql, ", ", true);
			}
		}

		tmpsql = "";

		if ("1" == H_sess.registup) {
			if (!!H_sess.registdate.Y && !!H_sess.registdate.m && !!H_sess.registdate.d) {
				tmpsql = "registdate='" + H_sess.registdate.Y + "-" + str_pad(H_sess.registdate.m, 2, "0", STR_PAD_LEFT) + "-" + str_pad(H_sess.registdate.d, 2, "0", STR_PAD_LEFT) + "' ";
				sql += this.sqlConnectEx(sql, tmpsql, ", ", true);
			}
		} else if ("undesid" == H_sess.registup) {
			tmpsql = "registdate=" + this.get_DB().dbQuote("1999-01-01", "date", false);
			sql += this.sqlConnectEx(sql, tmpsql, ", ", true);
		} else if ("C" == H_view.ordertype || is_null(H_order.registdate) || !H_order.registdate) {
			if (!!H_sess.expectdate.Y && !!H_sess.expectdate.m && !!H_sess.expectdate.d) {
				tmpsql = "registdate='" + H_sess.expectdate.Y + "-" + str_pad(H_sess.expectdate.m, 2, "0", STR_PAD_LEFT) + "-" + str_pad(H_sess.expectdate.d, 2, "0", STR_PAD_LEFT) + "' ";
				sql += this.sqlConnectEx(sql, tmpsql, ", ", true);
			}
		}

		sql += this.sqlConnectEx(sql, this.addSubCommentColumn(H_sess, H_order, where), ", ", true);
		return sql;
	}

	addUpdateSubColumn(H_sess, H_order, where, user_auth) //納品日用のsqlを取得
	{
		var A_sql = Array();
		var sql = "";
		sql = this.addDeliveryAndExpectDateColumn(H_sess, H_order, "sub", user_auth);
		sql += this.sqlConnectEx(sql, this.addSubCommentColumn(H_sess, H_order, where), ", ", true);
		return sql;
	}

	addSubCommentColumn(H_sess, H_order, where) //コメント
	{
		if (true == (undefined !== H_sess.subcomment) && "" != H_sess.subcomment) {
			if (false == (undefined !== H_sess.comflg)) {
				if (true == H_order.machineflg) //$tag_tb = self::ORD_DET_TB;   -> self::の原因で、変換できない
					{} else //$tag_tb = self::ORD_SUB_TB;    -> self::の原因で、変換できない
					{}

				var sql = "SELECT subcomment FROM " + tag_tb + " " + where;
				var comment = this.get_DB().queryOne(sql) + H_sess.subcomment;
				sql = "subcomment=" + this.get_DB().dbQuote(comment, "text", false) + " ";
			} else {
				sql = "subcomment='" + H_sess.subcomment + "'";
			}
		}

		return sql;
	}

	addDeliveryAndExpectDateColumn(H_sess, H_order, table, user_auth) //納品日の受取り権限あると確定日の場合はメール受取れない date
	{
		var update_deliverydate = true;

		if (-1 !== user_auth.indexOf("fnc_recv_delivery_mail")) //納品日が確定になっている場合は更新を行わない
			{
				if (H_order.deliverydate_type == 2) {
					update_deliverydate = false;
				}
			}

		if (update_deliverydate == true && true == (undefined !== H_sess.endsel)) {
			if ("not_update" == H_sess.endsel) //納品日は更新しない、何もしない
				{} else if ("specifies" == H_sess.endsel) //指定するを選択した場合
				{
					var tmpsql = "deliverydate='" + H_sess.deliverydate.Y + "-" + str_pad(H_sess.deliverydate.m, 2, "0", STR_PAD_LEFT) + "-" + str_pad(H_sess.deliverydate.d, 2, "0", STR_PAD_LEFT) + " " + str_pad(H_sess.deliverydate.H, 2, "0", STR_PAD_LEFT) + ":00:00' ";
					sql += this.sqlConnect(sql, ", ") + tmpsql;
				} else if ("after" == H_sess.endsel) //未定
				{
					tmpsql = "deliverydate='1999-01-01 00:00:00' ";
					sql += this.sqlConnect(sql, ", ") + tmpsql;
				}
		}

		if (true == (undefined !== H_sess.expectup)) {
			if ("not_update" == H_sess.expectup) //納品日は更新しない、何もしない
				{} else if ("desig" == H_sess.expectup) {
				var str_date = H_sess.expectdate.Y + "-" + str_pad(H_sess.expectdate.m, 2, "0", STR_PAD_LEFT) + "-" + str_pad(H_sess.expectdate.d, 2, "0", STR_PAD_LEFT) + " " + str_pad(H_sess.expectdate.H, 2, "0", STR_PAD_LEFT) + ":00:00";
				tmpsql = "expectdate=" + this.get_DB().dbQuote(str_date, "date", false);

				if (true == this.checkEndOutStatus(H_order.substatus)) {
					tmpsql += ", finishdate=" + this.get_DB().dbQuote(str_date, "date", false);
				}

				sql += this.sqlConnect(sql, ", ") + tmpsql;
			} else if ("undecid" == H_sess.expectup) {
				tmpsql = "expectdate=NULL ";
				sql += this.sqlConnect(sql, ", ") + tmpsql;
			}
		}

		if ("detail" == table) //契約日
			//購入日
			{
				if (true == (undefined !== H_sess.contractup) && "1" == H_sess.contractup) {
					str_date = H_sess.contractdate.Y + "-" + str_pad(H_sess.contractdate.m, 2, "0", STR_PAD_LEFT) + "-" + str_pad(H_sess.contractdate.d, 2, "0", STR_PAD_LEFT);
					tmpsql = "telcontractdate=" + this.get_DB().dbQuote(str_date, "date", false);
					sql += this.sqlConnect(sql, ", ") + tmpsql;
				} else {
					tmpsql = "telcontractdate=NULL ";
					sql += this.sqlConnect(sql, ", ") + tmpsql;
				}

				if (true == (undefined !== H_sess.registup) && "1" == H_sess.registup) {
					str_date = H_sess.registdate.Y + "-" + str_pad(H_sess.registdate.m, 2, "0", STR_PAD_LEFT) + "-" + str_pad(H_sess.registdate.d, 2, "0", STR_PAD_LEFT);
					tmpsql = "telorderdate=" + this.get_DB().dbQuote(str_date, "date", false);
					sql += this.sqlConnect(sql, ", ") + tmpsql;
				} else {
					tmpsql = "telorderdate=NULL ";
					sql += this.sqlConnect(sql, ", ") + tmpsql;
				}
			}

		return sql;
	}

	makeTelManagementDateSQL(H_sess, H_order, H_permit) //telnoがなければupdateできない
	//追加
	{
		if ("" == H_permit.telno.replace(/-/g, "")) {
			return "";
		}

		if (this.O_order.type_mnp == H_order.ordertype && this.O_order.st_sub_prcfin > H_permit.substatus) {
			if (true == (undefined !== H_permit.formercarid)) {
				var carid = H_permit.formercarid;
			} else //$carid = $this->get_DB()->queryOne("SELECT formercarid FROM " .self::ORD_DET_TB. " WHERE orderid=" .$H_order["orderid"]);   -> self::の原因で、変換できない
				{}
		} else {
			carid = H_order.carid;
		}

		var sql = "SELECT " + "telno " + "FROM " + "tel_tb " + "WHERE " + "pactid=" + H_order.pactid + " AND carid=" + carid + " AND telno='" + H_permit.telno + "'";

		if (undefined == this.get_DB().queryOne(sql)) //return "";
			{}

		var header = "UPDATE " + "tel_tb " + "SET ";
		sql = "";

		if ("1" == H_sess.contractup) {
			if ("" != H_sess.contractdate.Y && "" != H_sess.contractdate.m && "" != H_sess.contractdate.d) {
				var indate = H_sess.contractdate.Y + "-" + H_sess.contractdate.m + "-" + H_sess.contractdate.d;
				sql += "contractdate=" + this.get_DB().dbQuote(indate, "date", "false") + " ";
			}
		}

		if ("1" == H_sess.registup) {
			if ("" != H_sess.registdate.Y && "" != H_sess.registdate.m && "" != H_sess.registdate.d) {
				indate = H_sess.registdate.Y + "-" + H_sess.registdate.m + "-" + H_sess.registdate.d;
				sql += this.sqlConnectEx(sql, "orderdate=" + this.get_DB().dbQuote(indate, "date", "false"), ", ", true) + " ";
			}
		}

		var footer = "WHERE " + "pactid=" + H_order.pactid + " AND carid=" + carid + " AND telno='" + H_permit.telno + "'";

		if ("" != sql) {
			sql = header + sql + footer;
		}

		return sql;
	}

	sendTransferMail(H_g_sess, H_sess, H_order) //振替先の販売店名、メンバー名、メアドを取得
	//振替元のメアドを取得
	{
		var O_mail = new MtMailUtil();
		var sql = "SELECT " + "shop.name, shmem.name as memname, shmem.mail " + "FROM " + "shop_tb shop " + "INNER JOIN shop_member_tb shmem ON shop.memid=shmem.memid " + "WHERE " + "shop.shopid=" + H_sess.SELF.trans;
		H_mail.addr = this.get_DB().queryRowHash(sql);
		H_mail.cont = this.getTransferMailContents(H_g_sess, H_sess, H_mail.cont);
		var frommail = this.getFromMailAddr(H_g_sess.shopid);
		O_mail = new MtMailUtil();
		O_mail.send(H_mail.addr.mail, H_mail.cont.message, frommail, H_mail.cont.subj, H_g_sess.shopname, H_mail.addr.name);
		return true;
	}

	sendCancelTransferMail(H_g_sess, H_order) {
		var frommail = this.getFromMailAddr(H_g_sess.shopid);
		var H_mail = this.getCancelTransferMailContents(H_g_sess, H_order, frommail);
	}

	getFromMailAddr(shopid) {
		var sql = "SELECT " + "shmem.mail " + "FROM " + "shop_tb shop " + "INNER JOIN shop_member_tb shmem ON shop.memid=shmem.memid " + "WHERE " + "shop.shopid=" + shopid;
		var frommail = this.get_DB().queryOne(sql);
		return frommail;
	}

	getTransferMailContents(H_g_sess, H_sess, H_mail) {
		var A_contents = file(KCS_DIR + "/conf_sync/mail_template/v3transfer.txt");

		if ("work" == H_sess.SELF.transflg) {
			var trnstype = "\u958B\u901A\u4F5C\u696D\u306E\u307F";
		} else if ("both" == H_sess.SELF.transflg) {
			trnstype = "\u958B\u901A\u4F5C\u696D\u3068\u58F2\u4E0A\u3068\u3082";
		}

		var lpmax = A_contents.length;
		var O_grp = new GroupModel(O_db);

		for (var cnt = 0; cnt < lpmax; cnt++) //$A_contents[$cnt] = preg_replace("/ORDERCNT/", count($H_sess["SELF"]["execno"]), $A_contents[$cnt]);
		//明細件数じゃなくてオーダー件数なので固定で1
		//$A_contents[$cnt] = preg_replace("/ORDERNO/",  implode($this->getTransferMailInfo(array($H_sess[self::PUB]["orderid"]))). " (部分)", $A_contents[$cnt]);   -> self::の原因で、変換できない
		{
			A_contents[cnt] = A_contents[cnt].replace(/FROMSHOP/g, H_g_sess.shopname);
			A_contents[cnt] = A_contents[cnt].replace(/TRANTYPE/g, trnstype);
			A_contents[cnt] = A_contents[cnt].replace(/ORDERCNT/g, "1");
			A_contents[cnt] = A_contents[cnt].replace(/SHOPURL/g, this.getReturnURL(this.O_Sess.groupid, "shop", mailContents.type, O_grp.getGroupName(this.O_Sess.groupid)));
			A_contents[cnt] = A_contents[cnt].replace(/SYSTEMNAME/g, this.getSystemName(this.O_Sess.groupid, "JPN", mailContents.type));
		}

		H_cont.subj = rtrim(A_contents.shift());
		H_cont.message = A_contents.join("");
		return H_cont;
	}

	getCancelTransferMailContents(H_g_sess, H_mail, frommail) //メールテンプレートの読み込み
	{
		var O_mail = new MtMailUtil();
		var O_grp = new GroupModel(O_db);

		for (var key in H_mail) //メアドがなければ処理しない
		{
			var val = H_mail[key];

			if (undefined != val.mail) //本文の変数を置き換える
				//for($y=0; $y<$cnt; $y++){  ---> forの中に変換できない
				//$A_mailbody[$y] = preg_replace("/FROMSHOP/", $val["fromname"], $A_mailbody[$y]);
				////				$A_mailbody[$y] = preg_replace("/ORDERNO/", $val["orderid"], $A_mailbody[$y]);
				//$A_mailbody[$y] = preg_replace("/ORDERNO/",  implode($this->getTransferMailInfo(array($val["orderid"]))). " (部分)", $A_mailbody[$y]);
				//$A_mailbody[$y] = preg_replace("/SHOPURL/", $this->getReturnURL(
				//$this->O_Sess->groupid, "shop", $mailContents["type"], $O_grp->getGroupName($this->O_Sess->groupid)), $A_mailbody[$y]);
				//$A_mailbody[$y] = preg_replace("/SYSTEMNAME/", $this->getSystemName($mailContents["groupid"], "JPN", $mailContens["type"]), $A_mailbody[$y]);
				//}
				//件名と本文を分ける
				{
					var A_mailbody = file(KCS_DIR + "/conf_sync/mail_template/v3transfer_cancel_part.txt");
					var cnt = A_mailbody.length;
					var mailContents = this.getMailContents(H_mail[0].orderid, H_g_sess.shopid);
					var subject = rtrim(A_mailbody.shift());
					var message = join("", A_mailbody);
				}

			O_mail.send(val.mail, message, frommail, subject, H_g_sess.shopname, val.name);
		}

		return {
			subject: subject,
			message: message
		};
	}

	getDefaultsForm(H_info) //購入日
	//契約日
	//納品日
	//$deliveryflg = "specifies";
	//if("1999-01-01 00:00:00" == $H_info["order"]["machine"][0]["deliverydate"]){
	//$deliveryflg = "after";
	//}
	//処理日
	//デフォルトは更新しない
	//$expectflg = "desig";
	//radiobottun
	//在庫
	{
		var nowtime = MtDateUtil.getNow();

		if (!!H_info.order.machine[0].registdate) {
			var H_regist = this.makeDateHash(H_info.order.machine[0].registdate, false);
		} else if (undefined != H_info.orderdate[H_info.order.machine[0].telno].orderdate || "" != H_info.orderdate[H_info.order.machine[0].telno].orderdate) {
			H_regist = this.makeDateHash(H_info.orderdate[H_info.order.machine[0].telno].orderdate, false);
		} else {
			H_regist = this.makeDateHash(nowtime, false);
		}

		if (!!H_info.order.machine[0].contractdate) {
			var H_contract = this.makeDateHash(H_info.order.machine[0].contractdate, false);
		} else if (undefined != H_info.contractdate[H_info.order.machine[0].telno].contractdate || "" != H_info.orderdate[H_info.order.machine[0].telno].orderdate) {
			H_contract = this.makeDateHash(H_info.orderdate[H_info.order.machine[0].telno].contractdate, false);
		} else {
			H_contract = this.makeDateHash(nowtime, false);
		}

		var deliveryflg = "not_update";

		if (undefined != H_info.order.machine[0].deliverydate || "" != H_info.order.machine[0].deliverydate) {
			var H_delivery = this.makeDateHash(H_info.order.machine[0].deliverydate, true);
		} else if (undefined != H_info.order.acce[0].deliverydate || "" != H_info.order.acce[0].deliverydate) {
			H_delivery = this.makeDateHash(H_info.order.acce[0].deliverydate, true);
		} else //$deliveryflg = "after";
			{
				H_delivery = this.makeDateHash(nowtime, false);
			}

		var expectflg = "not_update";

		if ("reserve" == H_info.order.order.dateradio) {
			var H_expect = this.makeDateHash(this.getReserveDate("reserve", H_info.order.order.dateto, nowtime), true);
		} else if (undefined != H_info.order.machine[0].expectdate || "" != H_info.order.machine[0].expectdate) {
			H_expect = this.makeDateHash(H_info.order.machine[0].expectdate, true);
		} else if (undefined != H_info.order.acce[0].expectdate || "" != H_info.order.acce[0].expectdate) {
			H_expect = this.makeDateHash(H_info.order.acce[0].expectdate, true);
		} else //$expectflg = "undecid";
			{
				if (undefined == H_expect) {
					H_expect = this.makeDateHash(nowtime, false);
				}
			}

		var H_def = {
			transflg: "work",
			registdate: {
				Y: H_regist.y,
				m: H_regist.m,
				d: H_regist.d
			},
			contractdate: {
				Y: H_contract.y,
				m: H_contract.m,
				d: H_contract.d
			},
			deliverydate: {
				Y: H_delivery.y,
				m: H_delivery.m,
				d: H_delivery.d,
				H: H_delivery.h
			},
			expectdate: {
				Y: H_expect.y,
				m: H_expect.m,
				d: H_expect.d,
				H: H_expect.h
			}
		};
		H_def.endsel = deliveryflg;
		H_def.expectup = expectflg;

		switch (this.getStockSelected(H_info)) {
			case "mixed":
				H_def.stock = "stcindi";
				break;

			case "regular":
				H_def.stock = "regular";
				break;

			case "reserve":
				H_def.stock = "reserve";
				break;

			default:
				H_def.stock = "stcindi";
				break;
		}

		return H_def;
	}

	checkUserInputTelno(H_sess, orderid, H_order) //指定された受注明細から電話番号を取得
	//$sql = "SELECT detail_sort, telno FROM " .self::ORD_DET_TB. " ".
	//"WHERE orderid=" .$orderid.
	//" AND substatus<" .$this->O_order->st_sub_prcfin.
	//" AND detail_sort IN (" .implode(", ", $A_sort). ")";    -> self::の原因で、変換できない
	//全て未入力ならそのまま返す
	//重複がなければそのまま返す
	{
		var A_sort = Array();

		for (var val of Object.values(H_order.workdetail)) {
			A_sort.push(val.sort);
		}

		var A_telno = this.get_DB().queryAssoc(sql);
		var i = 0;

		for (var val of Object.values(A_telno)) {
			if (undefined == val) //新規で処理済以降だけチェック
				{
					if (this.O_order.type_new == H_order.order.ordertype && H_sess.status >= this.O_order.st_sub_prcfin) //更新対象に選ばれた端末だけチェック
						{
							for (var val of Object.values(H_sess.uptarget)) {
								if (true == H_order.machine[val] && undefined == H_order.machine[val].telno) {
									return "\u96FB\u8A71\u756A\u53F7\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\u53D7\u6CE8\u8A73\u7D30\u753B\u9762\u3067\u96FB\u8A71\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
								}
							}
						}

					i++;
				}
		}

		if (A_telno.length == i) {
			var result = "";
		} else {
			var A_tel = Array();

			for (var val of Object.values(A_telno)) {
				if (undefined != val) {
					A_tel.push(val);
				}
			}

			A_tel = array_count_values(A_tel);

			for (var val of Object.values(A_tel)) {
				if (1 < val) {
					result = "\u96FB\u8A71\u756A\u53F7\u304C\u91CD\u8907\u3057\u3066\u3044\u307E\u3059\u3002\u53D7\u6CE8\u8A73\u7D30\u753B\u9762\u304B\u3089\u5165\u529B\u3057\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
					return result;
				}
			}
		}

		if (this.O_order.A_empty != A_telno) {
			var sql = "SELECT telno FROM tel_tb " + "WHERE pactid=" + H_order.order.pactid + " AND carid=" + H_order.order.carid + " AND telno IN ('" + A_telno.join("', '") + "')";
			var A_dup = this.get_DB().queryCol(sql);

			for (var val of Object.values(A_dup)) {
				result += "\u65E2\u306B\u540C\u3058\u96FB\u8A71\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u53D7\u6CE8\u8A73\u7D30\u753B\u9762\u304B\u3089\u5165\u529B\u3057\u76F4\u3057\u3066\u304F\u3060\u3055\u3044(" + val + ")";
			}
		}

		return result;
	}

	checkUserInputSerialno(H_sess, orderid, H_order) //指定された受注明細から製造番号を取得
	//$sql = "SELECT serialno FROM " .self::ORD_DET_TB. " ".
	//"WHERE orderid=" .$orderid.
	//" AND substatus<" .$this->O_order->st_sub_prcfin.
	//" AND detail_sort IN (" .implode(", ", $A_sort). ")";
	//$A_serno = $this->get_DB()->queryHash($sql);   -> self::の原因で、変換できない
	//$A_ordno = $this->get_DB()->queryAssoc($sql);
	//		// 資産管理テーブルから製造番号を取得
	//        $sql = "SELECT d.detail_sort, a.serialno " .
	//                "FROM " .
	//                    self::ORD_TB. " o ".
	//                "INNER JOIN " .self::ORD_DET_TB. " d ON o.orderid=d.orderid ".
	//                "INNER JOIN tel_rel_assets_tb r ON o.pactid=r.pactid AND o.carid=r.carid AND d.telno=r.telno AND main_flg=true ".
	//                "INNER JOIN assets_tb a ON a.assetsid=r.assetsid ".
	//                "WHERE " .
	//                    "o.orderid=" .$this->get_DB()->dbQuote($orderid, "int", true);
	//		$A_orgno = $this->get_DB()->queryAssoc($sql);
	//		foreach($A_ordno as $sortno=>$serno){
	//			if(empty($serno) && isset($A_orgno[$sortno])){
	//				$A_serno[$sortno] = $A_orgno[$sortno];
	//			}else{
	//				$A_serno[$sortno] = $serno;
	//			}
	//		}
	//全て未入力ならそのまま返す
	{
		var A_sort = Array();

		if (this.O_order.A_empty == H_sess.uptarget) {
			for (var val of Object.values(H_order.workdetail)) {
				A_sort.push(val.sort);
			}
		} else {
			for (var val of Object.values(H_sess.uptarget)) {
				A_sort.push(val);
			}
		}

		var i = 0;
		var arrayserial = Array();

		for (var val of Object.values(A_serno)) {
			if (!val) {
				i++;
			}

			arrayserial.push(val.serialno);
		}

		if (A_serno.length == i) {
			return "";
		} else //処理済以降に更新するとき、製造番号の桁数とluhn formulaチェック
			{
				if (true == (undefined !== H_sess.status) && this.O_order.st_sub_prcfin <= H_sess.status) {
					var result = this.checkSerialRegulation(A_serno, H_order.order);
				}

				if ("" == result) {
					var A_serial = Array();

					for (var val of Object.values(A_serno)) {
						if (undefined != val.serialno) {
							A_serial.push(val.serialno);
						}
					}

					if (Array() == A_serial) {
						A_serial = array_count_values(A_serial);

						for (var val of Object.values(A_serial)) {
							if (1 < val) {
								result = "\u88FD\u9020\u756A\u53F7\u304C\u91CD\u8907\u3057\u3066\u3044\u307E\u3059\u3002\u53D7\u6CE8\u8A73\u7D30\u753B\u9762\u304B\u3089\u5165\u529B\u3057\u76F4\u3057\u3066\u304F\u3060\u3055\u3044";
								return result;
							}
						}
					}
				}
			}

		if (this.O_order.A_empty != arrayserial) {
			var sql = "SELECT assetsno FROM assets_tb " + "WHERE assetstypeid=1" + " AND pactid=" + H_order.order.pactid + " AND assetsno IN ('" + arrayserial.join("', '") + "')";
			var A_dup = this.get_DB().queryCol(sql);

			for (var val of Object.values(A_dup)) {
				result += "\u65E2\u306B\u540C\u3058\u88FD\u9020\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u53D7\u6CE8\u8A73\u7D30\u753B\u9762\u304B\u3089\u5165\u529B\u3057\u76F4\u3057\u3066\u304F\u3060\u3055\u3044(" + val + ")";
			}
		}

		return result;
	}

	checkUserInputSimno(H_sess, H_order, orderid) //指定された受注明細から電話番号を取得
	//$sql = "SELECT detail_sort, simcardno FROM " .self::ORD_DET_TB. " ".
	//"WHERE orderid=" .$orderid.
	//" AND substatus<" .$this->O_order->st_sub_prcfin.
	//" AND detail_sort IN (" .implode(", ", $A_sort). ")";
	//$A_serno["simno"] = $this->get_DB()->queryAssoc($sql); -> self::の原因で、変換できない
	{
		var A_sort = Array();

		if (this.O_order.A_empty == H_sess.uptarget) {
			for (var val of Object.values(H_order.workdetail)) {
				A_sort.push(val.sort);
			}
		} else {
			for (var val of Object.values(H_sess.uptarget)) {
				A_sort.push(val);
			}
		}

		A_serno.status = H_sess.status;
		return super.checkUserInputSimno(A_serno, H_order);
	}

	checkDateRelated(H_sess) {
		var errmsg = "";
		var regist = H_sess.registdate.Y + "-" + H_sess.registdate.m + "-" + H_sess.registdate.d;
		var cont = H_sess.contractdate.Y + "-" + H_sess.contractdate.m + "-" + H_sess.contractdate.d;

		if (regist < cont) {
			errmsg = "\u8CFC\u5165\u65E5\u306F\u5951\u7D04\u65E5\u3088\u308A\u672A\u6765\u306E\u65E5\u4ED8\u306B\u3057\u3066\u4E0B\u3055\u3044";
		}

		return errmsg;
	}

	checkProcFinish(nowstat, exestat) //出荷済み以下orすでに出荷済み以降なら処理しない
	{
		if (+(exestat <= this.O_order.st_sub_prcfin) || +(nowstat > this.O_order.st_sub_prcfin)) {
			return false;
		}

		return true;
	}

	autoPromoteSQL(orderid) //取得したステータスがsub、teldetailともに1つだったら完納に進める
	{
		var addwhere = "";
		var sql = "SELECT ordertype FROM mt_order_tb WHERE orderid = " + orderid;

		if (this.O_order.type_acc == this.get_DB().queryOne(sql)) {
			addwhere = " AND ordersubid != 0";
		}

		var dettemp = this.get_DB().queryCol(sql);

		if (1 == subtemp.length && 1 == dettemp.length && undefined != dettemp) {
			var status = 0;

			if (this.O_order.st_sub_prcfin == subtemp[0]) {
				status = this.O_order.st_prcfin;
			} else if (this.O_order.st_sub_shipfin == subtemp[0]) {
				status = this.O_order.st_shipfin;
			} else if (this.O_order.st_sub_trchkcmp == subtemp[0]) {
				status = this.O_order.st_trchkcmp;
			}
		}

		if (0 != status) {
			var A_sql = Array();
			var temp = "";

			if (status >= 140 and status <= 210) {
				temp = ", finishdate = (select max(expectdate) from (select expectdate from mt_order_sub_tb where orderid = " + orderid + " union select expectdate from mt_order_teldetail_tb where orderid = " + orderid + ") as a)";
			}

			A_sql.push(ordsql, subsql, detsql);
			return A_sql;
		}
	}

	cleanTransferCharge(H_sess) //受注を受けた販売店は消さない
	//$sql = "DELETE ".
	//"FROM ".
	//"mt_transfer_charge_shop_tb ".
	//"WHERE ".
	//"orderid=" .$this->get_DB()->dbQuote($H_sess[self::PUB]["orderid"], "int", true).
	//" AND maccnt<=0 AND acccnt<=0";
	//if($this->O_order->A_empty != $shopid){
	//$sql .= " AND shopid NOT IN (" .implode(", ", $shopid). ")";
	//}    -> self::の原因で、変換できない
	{
		if ("trcancel" != H_sess.SELF.trswitch) {
			return "";
		}

		var shopid = this.get_DB().queryCol(sql);
		var sql = "SELECT " + "shopid " + "FROM " + "mt_order_tb " + "WHERE " + "orderid=" + this.get_DB().dbQuote(H_sess[ShopOrderSubStatusModel.PUB].orderid, "int", true);

		if (Array.isArray(shopid)) {
			shopid.push(this.get_DB().queryOne(sql));
		} else {
			shopid = [this.get_DB().queryOne(sql)];
		}

		return [sql];
	}

	makeUniqueOrderData(H_view) {
		var A_result = Array();
		var A_temp = Array();

		for (var key in H_view) {
			var val = H_view[key];

			if (false == (-1 !== A_temp.indexOf(val.detail_sort))) {
				A_result.push(val);
				A_temp.push(val.detail_sort);
			}
		}

		return A_result;
	}

	deleteTransferType(H_view) {
		var sql = "SELECT orderid FROM mt_transfer_tb WHERE orderid=" + H_view.order.order.orderid;
		var result = undefined;

		if (Array() == this.get_DB().queryCol(sql)) {
			result = "UPDATE mt_order_tb SET transfer_type=NULL WHERE orderid=" + H_view.order.order.orderid;
		}

		if (undefined != result) {
			this.get_DB().exec(result);
		}
	}

	readyTransferCancelMail(H_g_sess, orderid) //$sql = "SELECT ".
	//"trans.orderid, shop.shopid, trans.toshopid, trans.fromshopid, trans.transfer_status, mem.mail, ".
	//"pact.compname, shop.name, cir.cirname, car.carname, ord.ordertype, ptn.shoptypename, shnam.name as fromname ".
	//"FROM ".
	//"mt_transfer_tb trans ".
	//"INNER JOIN " .self::ORD_TB. " ord ON trans.orderid=ord.orderid ".
	//"INNER JOIN shop_tb shop ON trans.toshopid=shop.shopid ".
	//"INNER JOIN shop_tb shnam ON trans.fromshopid=shnam.shopid ".
	//"INNER JOIN shop_member_tb mem ON shop.memid=mem.memid ".
	//"INNER JOIN circuit_tb cir ON ord.cirid=cir.cirid ".
	//"INNER JOIN carrier_tb car ON ord.carid=car.carid ".
	//"INNER JOIN pact_tb pact ON ord.pactid=pact.pactid ".
	//"INNER JOIN mt_order_pattern_tb ptn ON ord.carid=ptn.carid AND ord.cirid=ptn.cirid AND ord.ordertype=ptn.type ".
	//"WHERE ".
	//"trans.orderid=" .$orderid.
	//" AND trans.transfer_level IN (" .implode(", ", $this->A_target). ") ".
	//"GROUP BY ".
	//"trans.orderid, shop.shopid, trans.toshopid, trans.fromshopid, trans.transfer_status, mem.mail, ".
	//"pact.compname, shop.name, cir.cirname, car.carname, ord.ordertype, ptn.shoptypename, fromname";    -> self::の原因で、変換できない
	{
		var H_addr = this.get_DB().queryHash(sql);
		return H_addr;
	}

	getTransferFlag() {
		return {
			trans: this.transferflg,
			cancel: this.canceltransferflg
		};
	}

	getTargetNo() {
		return this.A_target;
	}

	checkCancelTransfer(H_order, H_target, H_g_sess, H_sess) {
		var sql = "SELECT count(orderid) FROM mt_transfer_tb " + "WHERE " + "fromshopid IN (" + H_order.keyshop.join(", ") + ")" + " AND orderid=" + H_target.orderid + " AND detail_sort=" + H_target.detail_sort;
		var A_result = true;

		if (1 > this.get_DB().queryOne(sql)) {
			A_result = {
				keyname: "",
				orderid: H_target.detail_sort + 1 + "\u4EF6\u76EE",
				err: "\u632F\u66FF\u3048\u3089\u308C\u3066\u3044\u307E\u305B\u3093"
			};
		}

		return A_result;
	}

	getAreaToDetailSort(A_arid, orderid) //$sql = "SELECT ".
	//"detail_sort ".
	//"FROM ".
	//self::ORD_DET_TB. " ".
	//"WHERE ".
	//"orderid=" .$orderid.
	//" AND arid IN (" .implode(", ", $A_arid). ")"; -> self::の原因で、変換できない
	{
		return this.get_DB().queryCol(sql);
	}

	checkInputDeliveryDate(H_sess, H_order) {
		var A_ordertype = [this.O_order.type_pln, this.O_order.type_opt, this.O_order.type_dsc, this.O_order.type_blp, this.O_order.type_del, this.O_order.type_mis, this.O_order.type_tpc, this.O_order.type_tcp, this.O_order.type_tcc];

		if (true == (-1 !== A_ordertype.indexOf(H_order.order.ordertype))) {
			return "";
		}

		if (this.O_order.type_acc == H_order.order.ordertype) {
			var macnt = 1;
		} else {
			macnt = H_order.machine.length;
		}

		if (true == (undefined !== H_sess.status)) {
			for (var val of Object.values(H_sess.uptarget)) {
				var cnt = val - macnt;

				if (true == (undefined !== H_order.machine[val])) {
					if (true == this.checkEndSubStatus(H_sess.status, H_order.machine[val].substatus, "proc")) {
						if (undefined == H_order.machine[val].deliverydate || "1999-01-01 00:00:00" == H_order.machine[val].deliverydate) {
							if ("specifies" != H_sess.endsel) {
								var result = "\u7D0D\u54C1\u65E5\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093";
							}
						}
					}
				} else if (true == (undefined !== H_order.acce[cnt])) {
					if (true == this.checkEndSubStatus(H_sess.status, H_order.acce[cnt].substatus, "proc")) {
						if (undefined == H_order.acce[cnt].deliverydate || "1999-01-01 00:00:00" == H_order.acce[cnt].deliverydate) {
							if ("specifies" != H_sess.endsel) {
								result = "\u7D0D\u54C1\u65E5\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093";
							}
						}
					}
				}
			}
		}

		return result;
	}

	checkInputExpectDate(H_sess, H_order) {
		if (this.O_order.type_acc == H_order.order.ordertype) {
			var macnt = 1;
		} else {
			macnt = H_order.machine.length;
		}

		if (true == (undefined !== H_sess.status)) {
			for (var val of Object.values(H_sess.uptarget)) {
				var cnt = val - macnt;

				if (true == (undefined !== H_order.machine[val])) {
					if (true == this.checkEndSubStatus(H_sess.status, H_order.machine[val].substatus, "proc")) {
						if (is_null(H_order.machine[val].expectdate) || "1999-01-01 00:00:00" == H_order.machine[val].expectdate || "undecid" == H_sess.expectup) {
							if ("desig" != H_sess.expectup) {
								var result = "\u51E6\u7406\u65E5\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093";
							}
						}
					}
				} else if (true == (undefined !== H_order.acce[cnt])) {
					if (true == this.checkEndSubStatus(H_sess.status, H_order.acce[cnt].substatus, "proc")) {
						if (is_null(H_order.acce[cnt].expectdate) || "1999-01-01 00:00:00" == H_order.acce[cnt].expectdate || "undecid" == H_sess.expectup) {
							if ("desig" != H_sess.expectup) {
								result = "\u51E6\u7406\u65E5\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093";
							}
						}
					}
				}
			}
		}

		return result;
	}

	updateTransferChargeCountCancelStatus(H_g_sess, H_sess, H_order, H_permit) //キャンセル以外から変更なら減算
	{
		if (this.O_order.st_cancel != H_permit.substatus) {
			return this.makeDeleteTransferChargeCountSql(H_g_sess, H_sess, H_order, H_permit);
		}

		return undefined;
	}

	updateTransferChargeCountRecoveryStatus(H_g_sess, H_sess, H_order, H_permit) //キャンセルからの変更なら加算
	{
		if (this.O_order.st_cancel == H_permit.substatus) {
			return this.makeRecoveryTransferChargeCountSQL(H_g_sess, H_sess, H_order, H_permit);
		}

		return undefined;
	}

	getProcNumberTargetShopId(H_order, sort, level) //多重振替用に配列取得してたけど、処理台数は重複しない（2店にまたがらない)のでORDER BY足してOneに変更
	//$shopid = $this->get_DB()->queryCol($sql);
	{
		var sql = "SELECT " + "toshopid " + "FROM " + "mt_transfer_tb " + "WHERE " + "orderid=" + this.get_DB().dbQuote(H_order.orderid, "int", true) + " AND detail_sort=" + this.get_DB().dbQuote(sort, "int", true) + " AND transfer_level>=" + this.get_DB().dbQuote(level, "int", true) + " " + "ORDER BY " + "transfer_level DESC";
		var result = this.get_DB().queryOne(sql);

		if (undefined == result) {
			return H_order.shopid;
		}

		return result;
	}

	makeRegistFlgSQL(orderid, detail_sort) //$sql = "UPDATE " .self::ORD_DET_TB. " " .
	//"SET ".
	//"registflg=true ".
	//"WHERE ".
	//"orderid=" .$this->get_DB()->dbQuote($orderid, "int", true).
	//" AND detail_sort=" .$this->get_DB()->dbQuote($detail_sort, "int", true);  -> self::の原因で、変換できない
	{
		return sql;
	}

	updateTelcnt(H_sess, H_data, debug) {
		if ("230" == H_sess.SELF.status) {
			if (0 < this.deletetelcnt) {
				var sql = "UPDATE mt_order_sub_tb " + "SET " + "number=(number - " + this.deletetelcnt + ") " + "WHERE " + "machineflg=true" + " AND orderid=" + this.get_DB().dbQuote(H_data.order.orderid, "int", true);

				if (!debug) {
					this.get_DB().exec(sql);
					sql = "UPDATE mt_order_sub_tb SET number=0 WHERE number < 0 AND orderid=" + this.get_DB().dbQuote(H_data.order.orderid, "int", true);
					this.get_DB().exec(sql);
				}

				sql = "UPDATE mt_order_tb " + "SET " + "telcnt=(telcnt - " + this.deletetelcnt + ") " + "WHERE " + "orderid=" + this.get_DB().dbQuote(H_data.order.orderid, "int", true);

				if (!debug) {
					this.get_DB().exec(sql);
				}
			}
		} else {
			if (!debug) {
				var execSql = Array();

				if ("A" != H_data.order.ordertype && "M" != H_data.order.ordertype) {
					sql = "SELECT machineflg, number " + "FROM " + "mt_order_teldetail_tb " + "WHERE " + "orderid=" + this.get_DB().dbQuote(H_data.order.orderid, "int", true) + " AND machineflg=true" + " AND substatus != 230";
					var orderRow = this.get_DB().queryHash(sql);
					var tCnt = orderRow.length;
					execSql.push("UPDATE mt_order_sub_tb " + "SET " + "number=" + this.get_DB().dbQuote(tCnt, "int", true) + " " + "WHERE " + "orderid=" + this.get_DB().dbQuote(H_data.order.orderid, "int", true));
					execSql.push("UPDATE mt_order_tb " + "SET " + "telcnt=" + this.get_DB().dbQuote(tCnt, "int", true) + " " + "WHERE " + "orderid=" + this.get_DB().dbQuote(H_data.order.orderid, "int", true));
				} else {
					if (!(undefined !== H_data.acce)) {
						if ("A" == H_data.order.ordertype) {
							sql = "SELECT detail_sort FROM mt_order_sub_tb " + "WHERE orderid=" + this.get_DB().dbQuote(H_data.order.orderid, "int", true) + " AND machineflg=false";
							H_data.acce = this.get_DB().queryHash(sql);
						} else if ("M" == H_data.order.ordertype) {
							H_data.acce = {
								0: {
									detail_sort: 0
								}
							};
						}
					}

					for (var acceVal of Object.values(H_data.acce)) {
						sql = "SELECT orgnumber " + "FROM " + "mt_order_sub_tb " + "WHERE " + "orderid=" + this.get_DB().dbQuote(H_data.order.orderid, "int", true) + " AND detail_sort=" + acceVal.detail_sort;
						tCnt = this.get_DB().queryOne(sql);
						execSql.push("UPDATE mt_order_sub_tb " + "SET " + "number=" + this.get_DB().dbQuote(tCnt, "int", true) + " " + "WHERE " + "orderid=" + this.get_DB().dbQuote(H_data.order.orderid, "int", true) + " AND detail_sort=" + acceVal.detail_sort);
					}
				}

				for (var eSql of Object.values(execSql)) {
					this.get_DB().exec(eSql);
				}
			}
		}
	}

	__destruct() {
		super.__destruct();
	}

};