//
//注文履歴一覧トップページ用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author miyazawa
//@since 2008/05/22
//@uses OrderListModelBase
//@uses OrderUtil
//
//
//
//注文履歴一覧トップページ用Model
//
//@package Order
//@subpackage Model
//@author miyazawa
//@since 2008/05/22
//@uses ManagementModel
//

require("MtSession.php");

require("OrderUtil.php");

require("model/Order/OrderListMenuModel.php");

require("model/Order/OrderModelBase.php");

//
//コンストラクター
//
//@author igarashi
//@since 2008/06/23
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_order
//@access public
//@return void
//
//
//操作中の管理者が所属するグループのshopidを取得する
//
//@author igarashi
//@since 2008/10/19
//
//@param $groupid
//
//@access public
//@return hash
//
//
//ショップの一覧に「全て」を追加する
//
//@author igarashi
//@since 2008/10/19
//
//@param $H_shopid
//
//@access public
//@return hash
//
//
//表示する受注件数の種類を選択
//
//@author igarashi
//@since 2008/10/19
//
//@access public
//@return array
//
//
//表示する受注集計にを区別する
//
//@author igarashi
//@since 2008/10/19
//
//@param $H_sess
//@param $A_shopid
//
//@access public
//@return hash
//
//
//集計対象のshopidをSESSIONからとるか包括配下からとるか選ぶ
//
//@author igarashi
//@since 2008/10/21
//
//@param $H_sess
//@param $A_shopid
//
//@access public
//@return array
//
//
//受注件数を取得する
//
//@author igarashi
//@since 2008/10/19
//
//@param $H_sess
//@param $A_shopid
//
//@access public
//@return hash
//
//
//受注集計。実際の処理台数を取得する
//
//@author igarashi
//@since 2008/10/21
//
//@param $H_sess
//@param $A_shopid
//
//
//
//
//getOrderCount
//
//@author web
//@since 2008/10/21
//
//@param mixed $H_sess
//@param mixed $H_data
//@param mixed $A_shopid
//@access protected
//@return void
//
//
//changeOtherName
//
//@author web
//@since 2012/10/09
//
//@param mixed $H_res
//@param mixed $type
//@access protected
//@return void
//
//
//getOrderProcCount
//
//@author web
//@since 2008/10/19
//
//@param mixed $H_sess
//@param mixed $H_data
//@param mixed $A_shopid
//@access protected
//@return void
//
//
//期の開始月を返す
//
//@author igarashi
//@since 2008/10/19
//
//@param $shopid
//
//@access public
//@return hash
//
//
//期の開始月から12ヶ月分を返す
//
//@author igarashi
//@since 2008/10/19
//
//@access public
//@return array
//
//
//期の年度を返す
//
//@author igarashi
//@since 2008/10/19
//
//@param $fiscal
//
//
//@access public
//@return array
//
//
//取得した受注件数を表示用に更新する
//
//@author igarashi
//@since 2008/10/19
//
//@param $H_amount
//
//@access public
//@return hash
//
//
//管理ログに記録する
//
//@author igarashi
//@since 2009/02/25
//
//@param mixed $O_view
//@param mixed $H_sess
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class AdminOrderListModel extends ModelBase {
	static SITE_SHOP = 1;
	static SITE_ADMIN = 2;

	constructor(O_db0) {
		this.siteflg = AdminOrderListModel.SITE_ADMIN;
		this.O_Sess = MtSession.singleton();
		this.O_order = OrderUtil.singleton();
		super(O_db0);
		this.othertypesort = {
			N: "998",
			D: "999"
		};
		this.carids = [this.getSetting().car_docomo, this.getSetting().car_willcom, this.getSetting().car_au, this.getSetting().car_softbank, this.getSetting().car_emobile, this.getSetting().car_smartphone];
	}

	getGroupShopID(groupid) {
		var sql = "SELECT shopid, name FROM shop_tb " + "WHERE type='S' AND groupid=" + groupid + " " + "ORDER BY shopid";
		return this.get_DB().queryKeyAssoc(sql);
	}

	makeShopSelect(H_shopid) {
		var H_result = {
			0: "\u30B0\u30EB\u30FC\u30D7\u5185\u5168\u3066\u306E\u8CA9\u58F2\u5E97"
		};

		for (var key in H_shopid) {
			var val = H_shopid[key];
			H_result[key] = val;
		}

		return H_result;
	}

	getDispModeSelect() {
		return {
			"1": "\u53D7\u6CE8\u4EF6\u6570",
			"2": "\u5B9F\u969B\u306E\u51E6\u7406\u4EF6\u6570"
		};
	}

	getOrderListCtrl(H_sess, A_shopid, shopid = 0, flg = "admin") {
		var A_selshop = this.getWhereShopID(H_sess, A_shopid, shopid, flg);

		if ("1" == H_sess.modesel) {
			var H_data = this.getOrderCountMaterial(H_sess, A_selshop);
		} else {
			H_data = this.getOrderProcCountMaterial(H_sess, A_selshop);
		}

		return H_data;
	}

	getWhereShopID(H_sess, A_shopid, shopid = 0, flg = "admin") {
		if ("0" == H_sess.shopsel && "admin" == flg) {
			var A_selshop = Object.keys(A_shopid);
		} else {
			A_selshop = [+H_sess.shopsel];
		}

		return A_selshop;
	}

	getOrderCountMaterial(H_sess, A_shopid) {
		if (undefined == A_shopid) {
			return undefined;
		}

		var sql = "SELECT " + "extract(year from ord.finishdate) as year, " + "extract(month from ord.finishdate) as month, " + "ord.carid || '-' || ord.ordertype || '-' || ord.cirid as orderjointype, " + "car.carname || ' ' || ptn.shoptypename as shoptypename, " + "cir.cirname, " + "ord.ordertype, " + "ord.cirid, " + "ord.carid " + "FROM " + "mt_order_tb ord " + "INNER JOIN circuit_tb cir ON ord.cirid=cir.cirid AND ord.carid=cir.carid " + "INNER JOIN carrier_tb car ON ord.carid=car.carid " + "INNER JOIN mt_order_pattern_tb ptn ON ord.ordertype=ptn.type AND ord.carid=ptn.carid AND ord.cirid=ptn.cirid " + "INNER JOIN shop_tb shop ON ord.shopid=shop.shopid " + "LEFT JOIN mt_transfer_tb trans ON ord.orderid=trans.orderid " + "WHERE " + "ord.finishdate IS NOT NULL " + "AND (ord.status >= " + this.O_order.st_shipfin + " AND ord.status NOT IN(" + this.O_order.st_delete + ", " + this.O_order.st_cancel + ")) " + "AND ord.ordertype IN ('" + this.O_order.type_new + "', '" + this.O_order.type_mnp + "', '" + this.O_order.type_chn + "', '" + this.O_order.type_del + "', '" + this.O_order.type_shi + "') ";

		if (true == (undefined !== H_sess.pactsel) && 0 != H_sess.pactsel) {
			sql += " AND ord.pactid=" + H_sess.pactsel + " ";
		}

		sql += "AND (ord.shopid IN (" + A_shopid.join(", ") + ") " + "OR (trans.toshopid IN (" + A_shopid.join(", ") + ") AND trans.transfer_status='both')) " + "GROUP BY " + "ptn.ptn_order," + "year," + "month," + "orderjointype," + "car.carname || ' ' || shoptypename, " + "cir.cirname," + "ord.ordertype," + "ord.carid, " + "car.carname, " + "ord.cirid " + "ORDER BY " + "ptn.ptn_order," + "year DESC," + "month DESC";
		temp += "AND (shop.shopid IN (" + A_shopid.join(", ") + ") " + "OR (trans.toshopid IN (" + A_shopid.join(", ") + ") AND trans.transfer_status='both')) ";
		return H_data = this.getOrderCount(H_sess, this.get_DB().queryHash(sql), A_shopid);
	}

	getOrderProcCountMaterial(H_sess, A_shopid) {
		if (undefined == A_shopid) {
			return undefined;
		}

		var sql = "SELECT " + "extract(year from det.finishdate) as year, " + "extract(month from det.finishdate) as month, " + "ord.carid || '-' || ord.ordertype || '-' || ord.cirid as orderjointype, " + "car.carname || ' ' || ptn.shoptypename as shoptypename, " + "cir.cirname, " + "ord.ordertype, " + "ord.cirid, " + "ord.carid " + "FROM " + "mt_order_tb ord " + "INNER JOIN mt_order_teldetail_tb det ON ord.orderid=det.orderid " + "INNER JOIN circuit_tb cir ON ord.cirid=cir.cirid AND ord.carid=cir.carid " + "INNER JOIN carrier_tb car ON ord.carid=car.carid " + "INNER JOIN mt_order_pattern_tb ptn ON ord.ordertype=ptn.type AND ord.carid=ptn.carid AND ord.cirid=ptn.cirid " + "INNER JOIN shop_tb shop ON ord.shopid=shop.shopid " + "LEFT JOIN mt_transfer_tb trans ON ord.orderid=trans.orderid " + "WHERE " + "det.finishdate IS NOT NULL " + "AND (det.substatus >= " + this.O_order.st_sub_shipfin + " AND det.substatus NOT IN(" + this.O_order.st_delete + ", " + this.O_order.st_cancel + ")) " + "AND ord.ordertype IN ('" + this.O_order.type_new + "', '" + this.O_order.type_mnp + "', '" + this.O_order.type_chn + "', '" + this.O_order.type_del + "', '" + this.O_order.type_shi + "') ";

		if (true == (undefined !== H_sess.pactsel) && 0 != H_sess.pactsel) {
			sql += " AND ord.pactid=" + H_sess.pactsel + " ";
		}

		sql += "AND (shop.shopid IN (" + A_shopid.join(", ") + ") " + "OR (trans.toshopid IN (" + A_shopid.join(", ") + ") AND trans.transfer_status='both')) " + "GROUP BY " + "ptn.ptn_order," + "year," + "month," + "orderjointype," + "car.carname || ' ' || shoptypename, " + "cir.cirname," + "ord.ordertype," + "ord.carid, " + "car.carname, " + "ord.cirid " + "ORDER BY " + "ptn.ptn_order," + "year DESC," + "month DESC";
		return this.getOrderProcCount(H_sess, this.get_DB().queryHash(sql), A_shopid);
	}

	getOrderCount(H_sess, H_data, A_shopid) //その他を一番下にする
	{
		if (undefined == A_shopid || H_data == undefined) {
			return undefined;
		}

		for (var key in H_data) {
			var val = H_data[key];

			if (12 == val.month) {
				var nyear = String(+(val.year + 1));
				var nmonth = "01";
			} else {
				nyear = String(+val.year);
				nmonth = String(+(val.month + 1));
			}

			var sql = "SELECT " + "ord.orderid " + "FROM " + "mt_order_tb ord " + "LEFT JOIN mt_transfer_tb trans ON ord.orderid=trans.orderid " + "WHERE " + "(ord.status>=" + this.O_order.st_sub_shipfin + " AND ord.status != " + this.O_order.st_delete + ") " + "AND (ord.shopid IN (" + A_shopid.join(", ") + ") OR trans.toshopid IN (" + A_shopid.join(", ") + "))" + "AND ord.carid=" + val.carid + " " + "AND ord.cirid=" + val.cirid + " " + "AND ord.ordertype='" + val.ordertype + "' " + "AND (ord.finishdate>='" + val.year + "-" + val.month + "-01' AND ord.finishdate<'" + nyear + "-" + nmonth + "-01') ";

			if (true == (undefined !== H_sess.pactsel) && 0 != H_sess.pactsel) {
				sql += " AND ord.pactid=" + H_sess.pactsel + " ";
			}

			sql += "GROUP BY " + "ord.orderid";
			var total = this.get_DB().queryCol(sql).length;

			if (-1 !== this.carids.indexOf(val.carid)) {
				H_result[key] = H_data[key];

				if (0 == total) {
					H_result[key].total = "-";
				} else {
					H_result[key].total = total;
				}
			} else {
				if (!(undefined !== other[val.ordertype])) {
					H_result[this.othertypesort[val.ordertype]] = H_data[key];
					H_result[this.othertypesort[val.ordertype]].total = total;
					this.changeOtherName(H_result[this.othertypesort[val.ordertype]], val.ordertype);
				} else {
					if (is_numeric(H_result[this.othertypesort[val.ordertype]].total)) {
						H_result[this.othertypesort[val.ordertype]].total += total;
					} else {
						H_result[this.othertypesort[val.ordertype]].total = total;
					}

					if (is_numeric(H_result[this.othertypesort[val.ordertype]].total) && 0 == H_result[this.othertypesort[val.ordertype]].total) {
						H_result[this.othertypesort[val.ordertype]].total = "-";
					}
				}
			}
		}

		ksort(H_result);
		return H_result;
	}

	changeOtherName(H_res, type) {
		var sql = "SELECT p.shoptypename, a.carname, i.cirname " + "FROM " + "mt_order_pattern_tb p " + "INNER JOIN carrier_tb a ON p.carid=a.carid " + "INNER JOIN circuit_tb i ON p.cirid=i.cirid " + "WHERE " + "p.carid=" + this.get_DB().dbQuote(this.getSetting().car_other, "int", true) + " AND p.type=" + this.get_DB().dbQuote(type, "text", true);
		var row = this.get_DB().queryRowHash(sql);
		H_res.shoptypename = row.carname + " " + row.shoptypename;
		H_res.cirname = row.cirname;
		return H_res;
	}

	getOrderProcCount(H_sess, H_data, A_shopid) {
		if (undefined == A_shopid || H_data == undefined) {
			return undefined;
		}

		for (var key in H_data) {
			var val = H_data[key];

			if (12 == val.month) {
				var nyear = String(+(val.year + 1));
				var nmonth = "01";
			} else {
				nyear = String(+val.year);
				nmonth = String(+(val.month + 1));
			}

			var sql = "SELECT " + "ord.orderid " + "FROM " + "mt_order_tb ord " + "LEFT JOIN mt_transfer_tb trans ON ord.orderid=trans.orderid " + "WHERE " + "(ord.status>=" + this.O_order.st_sub_shipfin + " AND ord.status != " + this.O_order.st_delete + ") " + "AND (ord.shopid IN (" + A_shopid.join(", ") + ") OR trans.toshopid IN (" + A_shopid.join(", ") + "))" + "AND ord.carid=" + val.carid + " " + "AND ord.cirid=" + val.cirid + " " + "AND ord.ordertype='" + val.ordertype + "' " + "AND (ord.finishdate>='" + val.year + "-" + val.month + "-01' AND ord.finishdate<'" + nyear + "-" + nmonth + "-01') ";

			if (true == (undefined !== H_sess.pactsel) && 0 != H_sess.pactsel) {
				sql += " AND ord.pactid=" + H_sess.pactsel + " ";
			}

			sql += "GROUP BY " + "ord.orderid";
			var A_order = this.get_DB().queryCol(sql);

			if (this.O_order.A_empty != A_order) {
				sql = "SELECT " + "COUNT(detail_sort) " + "FROM " + "mt_order_teldetail_tb det " + "WHERE " + "det.orderid IN (" + A_order.join(", ") + ")";
				var total = this.get_DB().queryOne(sql);
			} else {
				total = 0;
			}

			if (-1 !== this.carids.indexOf(val.carid)) {
				H_result[key] = H_data[key];

				if (0 == total) {
					H_result[key].total = "-";
				} else {
					H_result[key].total = total;
				}
			} else {
				if (!(undefined !== other[val.ordertype])) {
					H_result[this.othertypesort[val.ordertype]] = H_data[key];
					H_result[this.othertypesort[val.ordertype]].total = total;
					this.changeOtherName(H_result[this.othertypesort[val.ordertype]], val.ordertype);
				} else {
					if (is_numeric(H_result[this.othertypesort[val.ordertype]].total)) {
						H_result[this.othertypesort[val.ordertype]].total += total;
					} else {
						H_result[this.othertypesort[val.ordertype]].total = total;
					}

					if (is_numeric(H_result[this.othertypesort[val.ordertype]].total) && 0 == H_result[this.othertypesort[val.ordertype]].total) {
						H_result[this.othertypesort[val.ordertype]].total = "-";
					}
				}
			}
		}

		ksort(H_result);
		return H_result;
	}

	getFiscalMonth(shopid = 0) {
		var result = 4;

		if (0 != shopid) {
			var sql = "SELECT fiscalmonth FROM shop_tb " + "WHERE shopid=" + shopid;
			result = this.get_DB().queryOne(sql);
		}

		return result;
	}

	makeMonthTree(fiscal = 4) {
		var A_datetree = Array();

		for (var i = 0; i < 12; i++) {
			var mon = fiscal + i;

			if (mon > 12) {
				mon = mon - 12;
			}

			A_datetree.push(mon);
		}

		return A_datetree;
	}

	getKisyo(fiscal = 4) {
		var current_month = date("n");

		if (fiscal <= current_month) {
			var A_kisyo = [+date("Y"), fiscal, date("Y") - 1];
		} else {
			A_kisyo = [+(date("Y") - 1), fiscal, date("Y") - 2];
		}

		return A_kisyo;
	}

	makeOutputData(H_amount, A_kisyo) {
		var H_allamount = Array();

		for (var i in H_amount) {
			var amount = H_amount[i];

			if (!(undefined !== amount)) {
				continue;
			}

			if (Array.isArray(H_allamount[amount.orderjointype]) == false) {
				[H_allamount[amount.orderjointype]];

				if (amount.type == "S") {
					if (amount.cirid == 1) {
						H_allamount[amount.orderjointype].ptnname = amount.shoptypename + "\u30FB\u30E0\u30FC\u30D0\u2192FOMA";
					} else if (amount.cirid == 2) {
						H_allamount[amount.orderjointype].ptnname = amount.shoptypename + "\u30FBFOMA\u2192\u30E0\u30FC\u30D0";
					} else if (amount.cirid == 8) {
						H_allamount[amount.orderjointype].ptnname = amount.shoptypename + "\u30FBWIN\u2192CDMA1x";
					} else if (amount.cirid == 9) {
						H_allamount[amount.orderjointype].ptnname = amount.shoptypename + "\u30FBCDMA1x\u2192WIN";
					}
				} else {
					H_allamount[amount.orderjointype].ptnname = amount.shoptypename + "\u30FB" + amount.cirname;
				}

				delete amount.shoptypename;
				delete amount.cirname;
				delete amount.type;
				delete amount.cirid;
			}

			if (amount.year > A_kisyo[0] || amount.year >= A_kisyo[0] && amount.month >= A_kisyo[1]) {
				H_allamount[amount.orderjointype].current[amount.month] = amount;
				H_allamount[amount.orderjointype].current.total += amount.total;
				H_allamount[amount.orderjointype].current.number += amount.number;
			} else {
				H_allamount[amount.orderjointype].last[amount.month] = amount;
				H_allamount[amount.orderjointype].last.total += amount.total;
				H_allamount[amount.orderjointype].last.number += amount.number;
			}
		}

		return H_allamount;
	}

	writeAdminMngLog(O_view, H_sess) {
		var shopname = "";

		if (0 != H_sess) {
			shopname = this.get_DB().queryOne("SELECT name FROM shop_tb WHERE shopid=" + H_sess.shopsel);
		}

		if ("" != shopname) {
			var comment = shopname + "\u306EV3\u53D7\u6CE8\u96C6\u8A08\u3092\u95B2\u89A7";
		} else {
			comment = "V3\u53D7\u6CE8\u96C6\u8A08\u3092\u95B2\u89A7";
		}

		var H_data = {
			shopid: O_view.gSess().admin_shopid,
			shopname: O_view.gSess().admin_name,
			username: O_view.gSess().admin_personname,
			kind: "MTOrder",
			type: "V3\u53D7\u6CE8\u96C6\u8A08",
			comment: comment
		};
		this.getOut().writeAdminMngLog(H_data);
	}

	__destruct() {
		super.__destruct();
	}

};