//
//受注一括更新用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author igarashi
//@since 2008/08/07
//@uses ShopOrderDetail
//
//
//
//受注一括更新用Model
//
//@uses ModelBase
//@package Order
//@author igarashi
//@since 2008/08/07
//

require("OrderUtil.php");

require("ShopOrderDetailModel.php");

require("MtDateUtil.php");

//
//受注情報を取得
//
//@author igarashi
//@since 2008/08/07
//
//@param $H_info
//@return hash
//
//
//一括変更で指定できるステータスを取得する<br>
//
//@author igarashi
//@since 2008/08/08
//
//@access public
//@return hash
//
//
//ステータス変更が可能かチェックする
//
//@author igarashi
//@since 2008/08/07
//
//@param
//
//@access public
//@return boolean
//
//
//渡されたオーダーの履歴から申請者と承認者のメールアドレスを取得する
//
//@author igarashi
//@since 2008/08/11
//
//@param $H_orderid(orderidの入った配列)
//
//@access public
//@return hash
//
//
//受注更新者で選ばれたIDからメンバー名を取得
//
//@authre igarashi
//@since 2008/08/12
//
//@param $H_sess
//@param $H_name(Formの選択項目として使用された連想配列)
//
//@access public
//@return string
//
//
//渡されたオーダーの販売店担当者メールアドレスを取得する
//
//@author igarashi
//@since 2008/08/12
//
//@param $H_orderid(orderidの入った配列)
//
//@access public
//@return hash
//
//
//getShopMemberName
//
//@author
//@since 2010/08/11
//
//@param mixed $memid
//@access public
//@return void
//
//
//一括ステータス変更のupdate文を作成する
//
//@author igarashi
//@since 2008/08/11
//
//@access public
//@return array
//
//
//出荷済みに変更するよう選択されても、プラン・オプション・解約は処理済みにする<br>
//処理済みに変更するよう選択されても、新規、MNP、機種変、移行は出荷済みにする
//
//@author igarashi
//@since 2008/08/14
//
//@param $status
//@param $type
//
//@access protected
//@return hash
//
//
//order_history_tbのinsert文を作る
//
//@author igarashi
//@since 2008/08/12
//
//@param $H_g_sess
//@param $H_sess
//@param $H_mail (販売店担当者、申請者、承認者のメアド)
//@param $H_orderid (orderid)
//
//@access public
//@return array
//
//
//フォームに入れるデフォルト値を取得する
//
//@author igarashi
//@since 2008/08/12
//
//@param $shopid
//
//@access public
//@return hash
//
//
//checkDuplicateAssetsNo
//
//@author igarashi
//@since 2011/10/25
//
//@param mixed $info
//@access protected
//@return void
//
//
//処理済以降で処理日が未入力なら更新させない
//
//@author
//@since 2010/08/06
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//メール送信
//
//@author igarashi
//@since 2008/08/14
//
//@param $H_mail
//
//@access public
//@return none
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/08/07
//
//@access public
//@return none
//
class ShopOrderChangeStatusModel extends ShopOrderDetailModel {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess, ShopOrderChangeStatusModel.SITE_SHOP);
	}

	getOrderInfoLump(H_info) {
		var sql = "SELECT " + "ord.status, ord.carid, ord.cirid, det.arid, stat.forshop, ord.ordertype, ord.postname, ord.ansdate, sub.expectdate, " + "sub.fixdate, ord.orderid, stat.forshop, car.carname, pat.ptnname, ord.pactid, ord.postid, ord.postname, " + "shmem.name, sub.expectdate, ord.ansdate, stat.forshop, pact.compname, det.telno, sub.machineflg, ord.pacttype " + "FROM " + ShopOrderChangeStatusModel.ORD_TB + " ord " + "INNER JOIN " + ShopOrderChangeStatusModel.ORD_SUB_TB + " sub ON sub.orderid=ord.orderid " + "INNER JOIN " + ShopOrderChangeStatusModel.ORD_DET_TB + " det ON det.orderid=ord.orderid " + "INNER JOIN mt_status_tb stat ON ord.status=stat.status " + "INNER JOIN carrier_tb car ON car.carid=ord.carid " + "INNER JOIN mt_order_pattern_tb pat ON pat.type=ord.ordertype AND ord.carid=pat.carid AND ord.cirid=pat.cirid " + "INNER JOIN shop_member_tb shmem ON ord.shopmemid=shmem.memid " + "INNER JOIN pact_tb pact ON ord.pactid=pact.pactid " + "WHERE " + "ord.orderid in (" + H_info.join(", ") + ") AND " + "sub.ordersubid=0 " + "GROUP BY " + "ord.status, ord.carid, ord.cirid, det.arid, stat.forshop, ord.ordertype, ord.postname, ord.ansdate, sub.expectdate, " + "sub.fixdate, ord.orderid, stat.forshop, car.carname, pat.ptnname, ord.pactid, ord.postid, ord.postname, " + "shmem.name, sub.expectdate, ord.ansdate, stat.forshop, pact.compname, det.telno, sub.machineflg, ord.pacttype " + "ORDER BY " + "ord.orderid ";
		return this.get_DB().queryHash(sql);
	}

	getSelectStatus(flg = false) {
		var H_result = this.O_order.A_empty;

		if (true == flg) {
			H_result[""] = "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
		}

		var sql = "SELECT " + "status, forshop " + "FROM " + "mt_status_tb " + "WHERE subflg=false AND shopflg=true " + "AND status NOT IN (190, 200) " + "ORDER BY status";
		H_result = H_result + this.get_DB().queryAssoc(sql);
		return H_result;
	}

	checkChangeStatPossible(H_info, H_sess) //orderid毎にまとめる
	{
		H_result.unperm = this.O_order.A_empty;
		H_result.permit = this.O_order.A_empty;
		H_result.permitorder = this.O_order.A_empty;
		H_sess.lumpstatus = +H_sess.lumpstatus;
		var idx = 0;

		for (var key in H_info) //ステータス変更できないものを取り出す
		//ステータスがキャンセルor完了
		{
			var val = H_info[key];

			if (this.O_order.st_complete <= val.status) {
				H_result.unperm.push({
					orderid: val.orderid,
					info: val,
					err: "\u30B9\u30C6\u30FC\u30BF\u30B9\u304C\u300C\u5B8C\u4E86\u300D\u300C\u30AD\u30E3\u30F3\u30BB\u30EB\u300D\u4EE5\u964D\u306E\u3082\u306E\u306F\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093"
				});
			} else //新規はこっち
				{
					if (this.O_order.type_new == val.ordertype) {
						if (this.O_order.st_sub_shipfin <= H_sess.lumpstatus && this.O_order.st_delete >= H_sess.lumpstatus) {
							H_result.unperm.push({
								orderid: val.orderid,
								info: val,
								err: "\u65B0\u898F\u6CE8\u6587\u306F\u51FA\u8377\u6E08(\u90E8\u5206\uFF09\u4EE5\u964D\u306B\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093"
							});
						} else if (0 != H_sess.lumpstatus && H_sess.lumpstatus <= val.status) //今の状態より戻す事はできない
							{
								H_result.unperm.push({
									orderid: val.orderid,
									info: val,
									err: "\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u904E\u53BB\u306B\u623B\u3059\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093"
								});
							} else {
							H_result.permit.push(val);
							H_result.permitorder.push(val.orderid);
						}
					} else if (this.O_order.type_chn == val.ordertype || this.O_order.type_mnp == val.ordertype) {
						if (0 != H_sess.lumpstatus && H_sess.lumpstatus <= val.status) //今の状態より戻す事はできない
							{
								H_result.unperm.push({
									orderid: val.orderid,
									info: val,
									err: "\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u904E\u53BB\u306B\u623B\u3059\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093"
								});
							} else if (this.checkDuplicateAssetsNo(val)) {
							H_result.permit.push(val);
							H_result.permitorder.push(val.orderid);
						} else {
							H_result.unperm.push({
								orderid: val.orderid,
								info: val,
								err: "\u767B\u9332\u6E08\u306E\u88FD\u9020\u756A\u53F7\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002"
							});
						}
					} else if (this.O_order.type_blp == val.ordertype) {
						if (this.O_order.st_prcfin <= H_sess.lumpstatus && this.O_order.st_delete >= H_sess.lumpstatus) {
							H_result.unperm.push({
								orderid: val.orderid,
								info: val,
								err: "\u4E00\u62EC\u30D7\u30E9\u30F3\u5909\u66F4\u306F\u51E6\u7406\u6E08(\u90E8\u5206\uFF09\u4EE5\u964D\u306B\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093"
							});
						} else if (0 != H_sess.lumpstatus && H_sess.lumpstatus <= val.status) //今の状態より戻す事はできない
							{
								H_result.unperm.push({
									orderid: val.orderid,
									info: val,
									err: "\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u904E\u53BB\u306B\u623B\u3059\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093"
								});
							} else {
							H_result.permit.push(val);
							H_result.permitorder.push(val.orderid);
						}
					} else if (H_sess.lumpstatus == val.status) {
						H_result.unperm.push({
							orderid: val.orderid,
							err: "\u73FE\u5728\u306E\u30B9\u30C6\u30FC\u30BF\u30B9\u3068\u540C\u3058\u3067\u3059"
						});
					} else if (0 != H_sess.lumpstatus && H_sess.lumpstatus <= val.status) //今の状態より戻す事はできない
						{
							H_result.unperm.push({
								orderid: val.orderid,
								info: val,
								err: "\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u904E\u53BB\u306B\u623B\u3059\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093"
							});
						} else //20100809
						{
							if (this.O_order.st_prcfin <= H_sess.lumpstatus && this.O_order.st_delete >= H_sess.lumpstatus) //20100809
								{
									if (val.status < this.O_order.st_prcfin && !H_sess.expectdate) {
										H_result.unperm.push({
											orderid: val.orderid,
											info: val,
											err: "\u51E6\u7406\u65E5\u3092\u5165\u529B\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059"
										});
									} else {
										H_result.permit.push(val);
										H_result.permitorder.push(val.orderid);
									}
								} else {
								H_result.permit.push(val);
								H_result.permitorder.push(val.orderid);
							}
						}
				}
		}

		if (0 != H_result.permit.length) {
			var A_id = this.O_order.A_empty;
			var A_temp = this.O_order.A_empty;

			for (var val of Object.values(H_result.permit)) {
				if (false == (undefined !== A_id[val.orderid])) {
					A_id[val.orderid] = true;
					A_temp.push(val);
				}
			}

			H_result.permit = A_temp;
		}

		if (0 != H_result.unperm.length) {
			A_id = this.O_order.A_empty;
			A_temp = this.O_order.A_empty;

			for (var val of Object.values(H_result.unperm)) {
				if (false == (undefined !== A_id[val.orderid])) {
					A_id[val.orderid] = true;
					A_temp.push(val);
				}
			}

			H_result.unperm = A_temp;
		}

		return H_result;
	}

	getHistoryMailAddr(H_orderid) {
		var sql = "SELECT " + "hi.orderid, hi.chname, ord.chargername, ord.postname, hi.chpostname " + "FROM " + "mt_order_history_tb hi inner join order_tb ord on hi.orderid=ord.orderid " + "WHERE " + "hi.chpostid IS NOT NULL AND hi.orderid IN (" + H_orderid.join(", ") + ") ORDER BY hi.chdate";
		return this.get_DB().queryHash(sql);
	}

	convShopMemberID(H_sess, H_name) {
		return H_name[H_sess.SELF.memselect];
	}

	getShopMemberMailAddr(H_orderid) {
		var sql = "SELECT " + "ord.orderid, mem.name, mem.mail " + "FROM " + ShopOrderChangeStatusModel.ORD_TB + " ord " + "INNER JOIN shop_member_tb mem ON ord.shopmemid=mem.memid " + "WHERE " + "ord.orderid IN (" + H_orderid.join(", ") + ")";
		return this.get_DB().queryHash(sql);
	}

	getShopMemberName(memid) {
		var sql = "SELECT name FROM shop_member_tb WHERE memid=" + this.get_DB().dbQuote(H_sess.memselect, "int", true);
		return this.get_DB().queryOne(sql);
	}

	makeUpdateOrderSQL(H_sess, H_order) //処理時間を取得
	{
		var nowdate = MtDateUtil.getNow();
		var A_sql = this.O_order.A_empty;

		for (var val of Object.values(H_order)) //order_tb
		//order_sub
		//予定日時【入荷後】なら固定値を入れる
		//order_teldetail
		//新規、機種変、移行、MNPだけ処理
		{
			var sql = "UPDATE " + ShopOrderChangeStatusModel.ORD_TB + " " + "SET " + "status=" + this.autoChangeOrderStatus(H_sess.lumpstatus, val.ordertype) + ", " + "fixdate='" + nowdate + "' " + "WHERE " + "orderid=" + val.orderid;
			var subsql = "UPDATE " + ShopOrderChangeStatusModel.ORD_SUB_TB + " SET ";

			if ("arrival" == H_sess.dayswitch) {
				var expectsql = "expectdate='1999-01-01 00:00:00+09', ";
			}

			subsql += "substatus=" + this.autoChangeOrderStatus(H_sess.lumpstatus, val.ordertype) + ", " + "fixdate='" + nowdate + "' " + "WHERE " + "orderid=" + val.orderid;

			if (true == (-1 !== this.O_order.A_machinebuy.indexOf(val.ordertype))) {
				if (false != (undefined !== H_sess.deliverydate) && undefined != H_sess.deliverydate) {
					var telsql = "UPDATE " + ShopOrderChangeStatusModel.ORD_DET_TB + " SET " + "deliverydate='" + H_sess.deliverydate.Y + "-" + H_sess.deliverydate.m + "-" + H_sess.deliverydate.d + " " + H_sess.deliverydate.h + ":00:00, " + "fixdate='" + nowdate + "' " + "WHERE " + "orderid=" + val.orderid;
				}
			}

			H_sql[val.orderid] = [sql, subsql, telsql];
		}

		return H_sql;
	}

	autoChangeOrderStatus(status, type) {
		var result = status;

		if (this.O_Order.st_shipfin == status) {
			if (true == (-1 !== this.O_order.A_contractchng.indexOf(type))) {
				result = this.O_order.st_prcfin;
			}
		} else if (this.O_order.st_prcfin == status) {
			if (true == (-1 !== this.O_order.A_machinebuy.indexOf(type)) || type == this.O_order.type_acc) {
				result = this.O_order.st_shipfin;
			}
		}

		if (this.O_order.type_shi == type && result == this.O_order.st_prcfin) {
			result = this.O_order.st_shipfin;
		}

		return result;
	}

	makeInsertOrderHistorySQL(H_g_sess, H_sess, H_orderid, H_sql) //$H_sql = array();
	{
		var nowdate = MtDateUtil.getNow();

		for (var val of Object.values(H_orderid)) {
			var sql = "INSERT INTO mt_order_history_tb (orderid, shopid, shopname, shopperson, shopcomment, chdate) " + "VALUES(" + val + ", " + H_g_sess.shopid + ", '" + H_g_sess.shopname + "', '" + H_sess.memname + "', '" + H_sess.comment + "', '" + nowdate + "'" + ")";
			H_sql[val].push(sql);
		}

		return H_sql;
	}

	getDefaultsForm(H_sess) {
		var H_date = this.getTodayHash();
		var H_def_form = {
			memselect: H_sess.memid,
			lumpstatus: 1,
			dayswitch: "spec",
			deliverydate: {
				Y: H_date.y,
				m: H_date.m,
				d: H_date.d,
				h: H_date.h
			},
			expectdate: {
				Y: H_date.y,
				m: H_date.m,
				d: H_date.d
			}
		};
		return H_def_form;
	}

	checkDuplicateAssetsNo(info) {
		var sql = "select serialno from mt_order_teldetail_tb where orderid=" + info.orderid;
		var serialinfo = this.get_DB().queryCol(sql);

		for (var serial of Object.values(serialinfo)) {
			sql = "select count(*) from assets_tb where pactid=99 and assetstypeid=1 and assetsno='" + serial + "'";

			if (0 != this.get_DB().queryOne(sql)) {
				return false;
			}
		}

		return true;
	}

	checkInputExpectDate(H_sess) {}

	sendProcEndMail(H_mail) //var_dump($H_mail);
	{}

	__destruct() {
		super.__destruct();
	}

};