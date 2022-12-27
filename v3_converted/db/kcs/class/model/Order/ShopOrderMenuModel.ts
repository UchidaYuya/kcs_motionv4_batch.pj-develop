//
//受注一覧用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author igarashi
//@since 2008/05/22
//@uses OrderListModelBase
//@uses OrderUtil
//
//
//
//受注一覧用Model
//
//@package Order
//@subpackage Model
//@author igarashi
//@since 2008/05/22
//@uses ManagementModel
//

require("model/Order/OrderListMenuModel.php");

require("model/Order/OrderModelBase.php");

require("OrderUtil.php");

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
//注文履歴一覧取得時のSQL文のselect句作成
//
//@author igarashi
//@since 2008/05/29
//
//@access protected
//@return array
//
//
//Group By句のSQL文を作成する
//
//@author igarashi
//@since 2008/05/29
//
//@param mixed $sort
//@access private
//@return string
//
//
//オーダー句のSQL文を作成する
//
//@author igarashi
//@since 2008/05/29
//
//@param mixed $sort
//@access private
//@return string
//
//
//振替先を取得する
//
//@author igarashi
//@since 2008/06/24
//
//@param shopid
//
//@access public
//@return hash
//
//
//受注一覧で検索条件に指定できるキャリアの一覧を作成
//@author igarashi
//@since 2008/06/24
//
//@access public
//@return hash
//
//
//受注一覧で検索条件に指定できるキャリアの一覧を作成
//@author date
//@since 2015/03/12
//
//@access public
//@return hash
//
//
//受注一覧で検索条件に指定できるキャリアの一覧を作成
//@author date
//@since 2015/03/12
//
//@access public
//@return hash
//
//
//getCarrierInfo
//
//@author igarashi
//@since 2009/10/07
//
//@access public
//@return void
//
//
//受注一覧で検索条件に指定できる購入方式の一覧を作成
//@author igarashi
//@since 2008/06/24
//
//@access public
//@return hash
//
//
//受注一覧で検索条件に指定できる受領確認状態の一覧を作成
//@author igarashi
//@since 2008/06/24
//
//@access public
//@return hash
//
//
//販売店で表示するオーダーステータスを表示する
//
//@author igarashi
//@since 2008/06/24
//
//@access public
//@return hash
//
//
//getStatusInfo
//
//@author igarashi
//@since 2009/10/07
//
//@access public
//@return void
//
//
//getTransferShopId
//
//@author igarashi
//@since 2009/10/07
//
//@param mixed $shopid
//@access public
//@return void
//
//
//getChargeCount
//
//@author igarashi
//@since 2009/10/08
//
//@param mixed $shopid
//@access public
//@return void
//
//
//受注一覧で使用する発注種別を取得する<br>
//返す値は画面表示順にソートして返す<br>
//ソート順は関数内で定義される配列(A_sortkey)による<br>
//
//@author igarashi
//@since 2008/06/25
//
//@access public
//@return hash
//
//
//部門コードを取得する<br>
//統括販売店でしか使わない
//
//@author igarashi
//@since 2008/06/24
//
//@access public
//@return hash
//
//
//指定された検索条件にそったSELECT文を作る
//
//@author igarashi
//@since 2008/06/25
//
//@param $H_sess
//@param $H_box
//
//@access public
//@return hash
//
//
//検索用SQLのFROM句
//
//@author igarashi
//@since 2008/06/25
//
//@access public
//@return string
//
//
//where句を作成する
//
//@author igarashi
//@since 2008/06/24
//
//@access public
//@return hash
//
//
//デフォルトの検索条件を返す
//
//@author igarashi
//@since 2008/08/01
//
//@param $shopid
//
//@access public
//@return string
//
//
//sql文にANDが必要ならつける<br>
//ShopOrderModelBaseに引っ越し 2008/08/26
//
//@author igarashi
//@since 2008/06/26
//
//@access public
//@return mixed
//
//
//sqlConnect拡張版
//
//@author igarashi
//@since 2008/08/01
//
//@param mixed $sql
//@param mixed $second
//@param string $separate
//@param mixed $flg
//@access public
//@return void
//
//検索用sqlのwhere句を作る
//
//@author igarashi
//@since 2008/06/26
//
//@access public
//@return string
//
//検索用sqlのwhere句を作る
//
// @author igarashi
// @since 2008/06/26
//
// @access public
// @return string
//検索用sqlのwhere句を作る
//
// @author igarashi
// @since 2008/06/26
//
// @access public
// @return strig
//
//「処理中」を検索条件に指定した時、<br>
//「処理中」「振替確認依頼」を検索する様に補完する<br>
//補完したい条件が追加されたら追記する
//
//@author igarashi
//@since 2008/10/01
//
//@param $H_temp
//@param $type
//
//@access private
//@return array
//
//検索用sqlのwhere句を作る
//
// @author igarashi
// @since 2008/06/26
//
// @access public
// @return string
//検索用sqlのwhere句を作る
//
// @author igarashi
// @since 2008/06/26
//
// @access public
// @return string
// sqlを実行し、hashを返す
//
// @author igarashi
// @since 2008/07/9
//
// @param $sql
// @return hash
//
//検索結果の件数を取得する
//
//@auther igarashi
//@since 2008/09/05
//
//@param $sql
//
//@access public
//@return int
//
//
//端末以外の注文台数を取得する<br>
//
//@author igarashi
//@since 2008/08/01
//
//@access public
//@erturn hash
//
//
//日付を配列に入れてかえす
//
//@author igarashi
//@since 2008/06/30
//
//@access public
//@return  hash
//
//
//検索したデータを表示用に成形する<br>
//1. 重複したorderidをまとめる<br>
//2. 日付は最新の日付を表示させる<br>
//3. 重複したorderidで日付が異なれば、「分納」を表示する<br>
//
//4. flgがtrueならただorderidでまとめる。
//
//@author igarashi
//@since 2008/09/04
//
//@access public
//@return hash
//
//
//getLinkFlag
//
//@author igarashi
//@since 2010/01/25
//
//@param mixed $checkdate
//@access public
//@return void
//
//
//SQLじゃoffsetできないからPHPでやる
//
//@author igarashi
//@since 2008/09/05
//
//
//
//
//
//ページリンクを作成して返す
//
//@author igarashi
//@since 2008/09/05
//
//@param $O_order(OrderUtil Object)
//@param $H_sess
//@param $cnt(検索結果件数)
//
//@access public
//@return string
//
//
//統括販売店かチェック<br>
//統括販売店ならtrue。それ以外ならfalse
//
//@param $shopid
//
//@author igarashi
//@since 2008/06/24
//
//@access public
//@return boolean
//
//
//包括販売店なら配下の販売店idを返す
//
//@author igarashi
//@since 2008/10/21
//
//@param $shopid
//@param $flg
//
//@access public
//@return array
//
//
//販売店一覧を取得する
//
//@author igarashi
//@since 2008/09/--
//
//@access public
//@return hash
//
//
//一覧のデータに振替情報を追加する
//
//@param $H_data
//@param $A_order
//@param $shopid
//
//@access public
//@return hash
//
//
//操作中のメンバーがDL権限を持っているか
//
//@author igarashi
//@since 2008/11/17
//
//@param public
//@return integer
//
//
//setOrderID
//
//@author
//@since 2010/10/18
//
//@param mixed $H_data
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
class ShopOrderMenuModel extends OrderListMenuModel {
	constructor(O_db0, H_g_sess) {
		this.siteflg = OrderListModelBase.SITE_SHOP;
		super(O_db0, H_g_sess);
		this.O_ordshpmodel = new ShopOrderModelBase(O_db0, H_g_sess, ShopOrderMenuModel.SITE_SHOP);
	}

	makeOrderSelectSQL() {
		var A_col = ["ord.orderid", "ord.pacttype", "ord.status", "ord.ordertype", "ord.transfer", "ord.carid", "sub.productname", "sub.property", "ord.buyselid", "ord.postname", "ord.ansdate", "ord.telcnt", "ord.receipt", "ptn.ptnname", "det.contractor", "sub.expectdate", "sub.deliverydate", "sub.fixdate", "shmem.name as memname", "ord.misctype", "sub.machineflg", "ord.completedate", "ord.attachedfile", "ord.attachedshop", "ord.addr1", "ord.division"];
		return A_col.join(",");
	}

	makeGroupBySQL() {
		var A_col = ["ord.orderid", "ord.transfer", "ord.status", "ord.carid", "ptn.ptnname", "det.contractor", "shmem.name", "ord.ansdate", "sub.expectdate", "pact.type", "sub.productname", "sub.property", "ord.ordertype", "ord.pacttype", "ord.buyselid", "ord.ansdate", "ord.recdate", "ord.receipt", "sub.expectdate", "sub.deliverydate", "sub.fixdate", "ord.telcnt", "ord.postname", "ord.misctype", "sub.machineflg", "sub.ordersubid", "ord.completedate", "ord.attachedfile", "ord.attachedshop", "ord.addr1", "ord.division"];
		return " GROUP BY " + A_col.join(",");
	}

	makeOrderBySQL(H_sess) //状態、申請内容、申請部署、入力担当者、申請日、次の回答部署、予定日時、受領確認、最終更新日、受付番号
	//注文日付のソート付加
	{
		var A_col = ["ord.status", "ord.carid,ptn.ptnname", "sub.productname", "sub.property", "ord.telcnt", "det.contractor", "memname", "ord.ansdate", "sub.expectdate", "sub.deliverydate", "sub.fixdate", "ord.orderid", "ord.division"];
		var A_key = preg_split("/\\|/", H_sess.sort);

		if (A_key[1] == "a") {
			var asc = " asc";
		} else {
			asc = " desc";
		}

		var sql = " ORDER BY " + A_col[A_key[0]] + asc;
		sql += " ,ord.ansdate desc, ord.orderid, sub.ordersubid";
		return sql;
	}

	getTransfer(H_g_sess, A_shopid) {
		var temp = new ShopOrderModelBase(O_db0, H_g_sess, ShopOrderMenuModel.SITE_SHOP);
		var H_trans = temp.getTransfer(A_shopid, 0);
		return H_trans;
	}

	getOrderCarrier() {
		var H_car = [{
			name: "docomo",
			carid: this.O_Set.car_docomo
		}, {
			name: "Y!mobile(\u65E7WILLCOM)",
			carid: this.O_Set.car_willcom
		}, {
			name: "au",
			carid: this.O_Set.car_au
		}, {
			name: "softbank",
			carid: this.O_Set.car_softbank
		}, {
			name: "Y!mobile(\u65E7EMOBILE)",
			carid: this.O_Set.car_emobile
		}, {
			name: "smart phone",
			carid: this.O_Set.car_smartphone
		}, {
			name: "other",
			carid: this.O_Set.car_other
		}];
		return H_car;
	}

	getOrderDeliveryDateType() {
		var H_deliverydate_type = [{
			name: "\u672A\u5B9A",
			deliverydate_type: 0
		}, {
			name: "\u4E88\u5B9A\u65E5\u3042\u308A",
			deliverydate_type: 1
		}, {
			name: "\u51FA\u8377\u5B8C\u4E86",
			deliverydate_type: 2
		}];
		return H_deliverydate_type;
	}

	getOrderSendDeliveryDateFlg() {
		var H_deliverydate_type = [{
			name: "\u672A\u9001\u4FE1\u3042\u308A",
			send_deliverydate_flg: 0
		}, {
			name: "\u9001\u4FE1",
			send_deliverydate_flg: 1
		}];
		return H_deliverydate_type;
	}

	getCarrierInfo() //"WHERE carid IN (" .$this->O_Set->car_docomo. ", " .$this->O_Set->car_willcom. ", " .$this->O_Set->car_au. ", " .$this->O_Set->car_softbank. ", ".
	//$this->O_Set->car_emobile. ", " .$this->O_Set->car_smartphone. ")";
	{
		var sql = "SELECT carid, carname FROM carrier_tb ";
		return this.get_DB().queryKeyAssoc(sql);
	}

	getOrderBuySelID() {
		var H_rec = [{
			name: "\u65B0\u65B9\u5F0F(\u30D0\u30EA\u30E5\u30FC)",
			buyselid: "1"
		}, {
			name: "\u65E7\u65B9\u5F0F(\u30D9\u30FC\u30B7\u30C3\u30AF)",
			buyselid: "2"
		}, {
			name: "\u305D\u306E\u4ED6",
			buyselid: "3"
		}];
		return H_rec;
	}

	getOrderReceive() {
		var H_rec = [{
			name: "\u672A\u8A2D\u5B9A",
			receipt: 0
		}, {
			name: "\u78BA\u8A8D\u4E2D",
			receipt: "1"
		}, {
			name: "\u78BA\u8A8D\u6E08",
			receipt: "2"
		}];
		return H_rec;
	}

	getOrderStatus(A_except = Array()) {
		var sql = "SELECT forshop, status FROM mt_status_tb WHERE shopflg=true ";

		if (0 < A_except.length) {
			var where = "AND status NOT IN (" + A_except.join(", ") + ") ";
		}

		var orderby = "ORDER BY sort";
		return this.get_DB().queryHash(sql + where + orderby);
	}

	getStatusInfo() {
		var sql = "SELECT status, forshop, shopcolor " + "FROM " + "mt_status_tb " + "WHERE " + "status>=" + this.O_order.st_unsest;
		return this.get_DB().queryKeyAssoc(sql);
	}

	getTransferShopId(shopid, H_shoplist, type) {
		if ("from" == type) {
			var column = "fromshopid";
			var material = "toshopid";
		} else {
			column = "toshopid";
			material = "fromshopid";
		}

		var sql = "SELECT " + material + " " + "FROM " + "mt_transfer_tb " + "WHERE " + column + " IN (" + shopid.join(", ") + ") " + "GROUP BY " + material;
		var A_trans = this.get_DB().queryCol(sql);

		for (var val of Object.values(shopid)) {
			if (false == (-1 !== A_trans.indexOf(val))) {
				A_trans.push(val);
			}
		}

		sql = "SELECT orderid, " + column + " AS shopid " + "FROM " + "mt_transfer_tb " + "WHERE " + material + " IN (" + A_trans.join(", ") + ") " + "ORDER BY detail_sort, transfer_level";
		var H_temp = this.get_DB().queryHash(sql);

		if (this.O_order.A_empty == H_temp) {
			return H_temp;
		}

		for (var val of Object.values(H_temp)) {
			H_shop[val.orderid][val.shopid] = val.shopid;
		}

		for (var key in H_shop) {
			var val = H_shop[key];

			for (var id of Object.values(val)) {
				H_result[key] += H_shoplist[id] + "<br>";
			}
		}

		return H_result;
	}

	getChargeCount(shopid) {
		var sql = "SELECT o.orderid, o.ordertype, t.maccnt, t.acccnt " + "FROM " + "mt_transfer_charge_shop_tb t " + "INNER JOIN mt_order_tb o ON t.orderid=o.orderid " + "WHERE " + "t.shopid IN (" + shopid.join(", ") + ")";
		var H_temp = this.get_DB().queryHash(sql);

		for (var val of Object.values(H_temp)) {
			if (this.O_order.type_acc != val.ordertype) {
				H_result[val.orderid].maccnt += val.maccnt;
			} else {
				H_result[val.orderid].maccnt = 0;
			}

			H_result[val.orderid].acccnt += val.acccnt;
		}

		return H_result;
	}

	getOrderType() //買い増しは機種変と同じなので外す order_tbでは発注種別はordertypeになるので別名をつける
	//array_push($H_result, array("ordertype"=>"Ppl", "name"=>"プラン変更"));
	//		array_push($H_result, array("ordertype"=>"Pop", "name"=>"オプション変更"));
	//		array_push($H_result, array("ordertype"=>"Pdc", "name"=>"割引サービス変更"));
	//		array_push($H_result, array("ordertype"=>"Tpc", "name"=>"名義変更(個->法)"));
	//		array_push($H_result, array("ordertype"=>"Tcp", "name"=>"名義変更(法->個)"));
	//		array_push($H_result, array("ordertype"=>"Tcc", "name"=>"名義変更(法->法)"));
	//keyの付け替え前と要素数が違ってたらfalse
	{
		var sql = "SELECT type AS ordertype, shoptypename as name FROM mt_order_pattern_tb " + "WHERE shoptypename != '\u8CB7\u3044\u5897\u3057' AND type != 'P' AND type != 'T' AND type != 'Dsimple' " + "GROUP BY type, shoptypename";
		var H_result = this.get_DB().queryHash(sql);

		for (var key in H_result) {
			var val = H_result[key];

			if ("Tpc" == val.ordertype) {
				H_result[key].name = "\u540D\u7FA9\u5909\u66F4(\u500B->\u6CD5)";
			} else if ("Tcp" == val.ordertype) {
				H_result[key].name = "\u540D\u7FA9\u5909\u66F4(\u6CD5->\u500B)";
			} else if ("Tcc" == val.ordertype) {
				H_result[key].name = "\u540D\u7FA9\u5909\u66F4(\u6CD5->\u6CD5)";
			}
		}

		var idx = 0;
		var max = H_result.length;
		var A_sortkey = ["\u65B0\u898F\u767A\u6CE8", "\u65B0\u898F\u767A\u6CE8(MNP)", "\u6A5F\u7A2E\u5909\u66F4", "\u5951\u7D04\u5909\u66F4", "\u30D7\u30E9\u30F3\u5909\u66F4", "\u30AA\u30D7\u30B7\u30E7\u30F3\u5909\u66F4", "\u5272\u5F15\u30B5\u30FC\u30D3\u30B9\u5909\u66F4", "\u89E3\u7D04", "\u4ED8\u5C5E\u54C1", "\u305D\u306E\u4ED6", "\u4E00\u62EC\u30D7\u30E9\u30F3\u5909\u66F4", "\u540D\u7FA9\u5909\u66F4(\u6CD5->\u500B)", "\u540D\u7FA9\u5909\u66F4(\u500B->\u6CD5)", "\u540D\u7FA9\u5909\u66F4(\u6CD5->\u6CD5)"];

		for (var key in H_result) {
			var val = H_result[key];

			for (var loop = 0; loop <= max; loop++) {
				if (val.name == A_sortkey[loop]) {
					H_type[loop] = val;
					idx++;
					loop = max;
				}
			}
		}

		if (H_type.length != max) {
			this.O_Out.errorOut(0, "ShopOrderMenuModel::DB\u3068PG\u4E0A\u3067\u767A\u6CE8\u7A2E\u5225\u306E\u6570\u306F\u5408\u3063\u3066\u308B\u304B\uFF1F", false);
			return false;
		}

		ksort(H_type, SORT_NUMERIC);
		return H_type;
	}

	getSectionCode(A_shopid) {
		var sql = "SELECT shopid, '['||postcode||']'||name FROM shop_tb WHERE shopid IN (" + A_shopid.join(",") + ") ORDER BY postcode";
		var H_temp = {
			0: "\u9078\u629E\u306A\u3057"
		};
		return H_temp + this.get_DB().queryAssoc(sql);
	}

	makeSearchSql(H_sess, H_box, shopid) //包括販売店で配下の販売店が選択されていたらshopidをしぼる
	//var_dump($this->searchwhere);
	{
		if (true == H_box.unify) {
			if (true == (undefined !== H_sess[ShopOrderMenuModel.PUB].sctcode) && undefined != H_sess[ShopOrderMenuModel.PUB].sctcode && "0" != H_sess[ShopOrderMenuModel.PUB].sctcode) {
				shopid = [H_sess[ShopOrderMenuModel.PUB].sctcode];
			}
		}

		this.searchwhere = this.makeSearchWhere(H_sess[ShopOrderMenuModel.PUB], H_box, shopid);
		var orderby = this.makeOrderBySQL(H_sess[ShopOrderMenuModel.PUB]);
		var sql = "SELECT " + this.makeOrderSelectSQL() + this.makeOrderTableSQL(shopid) + this.searchwhere + this.makeGroupBySQL() + orderby;
		H_sql.down.where = this.searchwhere;
		H_sql.down.orderby = orderby;
		H_sql.search = sql;
		return H_sql;
	}

	makeOrderTableSQL(shopid) {
		var sql = " FROM " + ShopOrderMenuModel.ORD_TB + " ord " + "INNER JOIN " + ShopOrderMenuModel.ORD_SUB_TB + " sub on ord.orderid=sub.orderid " + "LEFT JOIN " + ShopOrderMenuModel.ORD_DET_TB + " det on ord.orderid=det.orderid " + "LEFT JOIN mt_transfer_tb trans ON (ord.orderid=trans.orderid AND (det.detail_sort=trans.detail_sort OR sub.detail_sort=trans.detail_sort)) " + "INNER JOIN mt_transfer_charge_shop_tb trch ON (ord.orderid=trch.orderid AND trch.shopid IN (" + shopid.join(", ") + ")) " + "INNER JOIN mt_order_pattern_tb ptn ON ord.ordertype=ptn.type AND ord.carid=ptn.carid AND ord.cirid=ptn.cirid " + "INNER JOIN pact_tb pact ON ord.pactid=pact.pactid " + "LEFT JOIN shop_member_tb shmem ON ord.shopmemid=shmem.memid ";
		return sql;
	}

	makeSearchWhere(H_sess, H_box, A_shopid) //文字列(そのままwhere句に入れるもの)
	//ステータス
	//今日やるボタンの場合 要望により検索対象を処理日から納品日(nullと未定は含まない）に変更
	//何もチェックされてない項目は-1で検索
	//納品日関連を検索する場合は、権限を確認する
	{
		var planesql = this.sqlConnect(sql, "AND ") + this.makePlaneSearchWhere(A_shopid, "search");
		var A_string = ["contractor", "orderid", "telno"];
		var A_checkbox = ["status", "ordertype", "carid", "buyselid", "deliverydate_type", "send_deliverydate_flg"];

		if (true == (undefined !== H_sess.expectsub)) {
			var targetdate = "deliverydate";

			if ("2" == H_sess.expectexec.dotoday) {
				targetdate = "expectdate";
			}

			var month = str_pad(H_sess.expectexec.m, 2, "0", STR_PAD_LEFT);
			var day = str_pad(H_sess.expectexec.d, 2, "0", STR_PAD_LEFT);

			if (true == checkdate(month, day, H_sess.expectexec.Y)) {
				var expectsql = "((sub." + targetdate + " >= '" + H_sess.expectexec.Y + "-" + month + "-" + day + " 00:00:00'" + " AND sub." + targetdate + " <= '" + H_sess.expectexec.Y + "-" + month + "-" + day + " 23:59:59') OR " + "(det." + targetdate + " >= '" + H_sess.expectexec.Y + "-" + month + "-" + day + " 00:00:00'" + " AND det." + targetdate + " <= '" + H_sess.expectexec.Y + "-" + month + "-" + day + " 23:59:59'))";
			} else {
				expectsql = "ord.carid='0'";
			}
		}

		var empsql = "";

		for (var val of Object.values(A_checkbox)) {
			if (undefined == H_sess.post[val]) {
				if (val == "deliverydate_type" || val == "send_deliverydate_flg") {
					continue;
				}

				if ("ordertype" != val) {
					empsql += this.sqlConnect(empsql, "AND ") + "ord." + val + "=-1 ";
				} else {
					empsql += this.sqlConnect(empsql, "AND ") + "ord." + val + "='' ";
				}
			}
		}

		if (undefined != H_sess.post) {
			{
				let _tmp_0 = H_sess.post;

				for (var key in _tmp_0) {
					var val = _tmp_0[key];
					var tmp = "";

					if ("fromy" == key) {
						sql += this.sqlConnect(sql, "AND ") + this.makeSearchSqlDate(H_sess.post.fromy, H_sess.post.toy, H_sess.post.seldate, H_sess.post.dateflg);
					} else if ("trans" == key) {
						tmp = this.makeSearchSqlTrans(A_shopid, val);

						if ("" != tmp) {
							sql += this.sqlConnect(sql, "AND ") + tmp;
						}
					} else if ("pref" == key) {
						if (!!val) {
							tmp = "ord.addr1=" + this.get_DB().dbQuote(val, "text", false);
							sql += this.sqlConnect(sql, "AND ") + tmp;
						}
					} else if (true == (-1 !== A_checkbox.indexOf(key))) {
						sql += this.sqlConnectEx(sql, this.makeSearchSqlCheckBox(val, key, H_box[key], A_shopid), "AND ", true);
					} else if (true == (-1 !== A_string.indexOf(key))) {
						sql += this.makeSearchSqlString(key, val, sql);
					}
				}
			}
		}

		if ("" != expectsql) {
			var sql = this.makePlaneSearchWhere(A_shopid, "expect") + "AND " + expectsql;
		} else //未入力項目があれば他のwhere句と結合
			{
				if ("" != sql) {
					sql = planesql + this.sqlConnect(planesql, "AND ") + sql;
				} else {
					sql = planesql;
				}

				if ("" != empsql) {
					sql += this.sqlConnect(sql, "AND ") + empsql;
				}
			}

		if (H_sess.post.deliverydate_type != undefined || H_sess.post.send_deliverydate_flg != undefined) {
			var pact_deliverydate_mail = this.get_DB().queryCol("select pactid from fnc_relation_tb where userid=0 and fncid=233");

			if (pact_deliverydate_mail.length > 0) //権限のある会社のみ調べる
				{
					sql += this.sqlConnect(sql, "AND ") + " ord.pactid IN ( " + pact_deliverydate_mail.join(",") + " )";
				} else //権限を持っている会社がないので、一覧の表示を行わないようにする
				{
					sql += this.sqlConnect(sql, "AND ") + " ord.pactid = -1";
				}
		}

		return sql;
	}

	makePlaneSearchWhere(shopid, mode = "search") {
		if ("search" == mode) //$sql = "WHERE ord.status>=50 AND (ord.shopid IN (" .implode(", ", $shopid). ") OR trans.toshopid IN (" .implode(", ", $shopid). ")) ";
			{
				var sql = "WHERE ord.status>=50 AND (ord.shopid IN (" + shopid.join(", ") + ") OR trch.shopid IN (" + shopid.join(", ") + ")) ";
			} else if ("expect" == mode) {
			sql = "WHERE ord.status>=50 AND ord.status NOT IN (210, 220, 230)" + " AND (ord.shopid IN (" + shopid.join(", ") + ") OR trch.shopid IN (" + shopid.join(", ") + ")) ";
		}

		return sql;
	}

	sqlConnect(sql, separate = "AND ") {
		return this.O_ordshpmodel.sqlConnect(sql, separate);
	}

	sqlConnectEx(sql, second, separate = "AND ", flg = false) {
		return this.O_ordshpmodel.sqlConnectEx(sql, second, separate, flg);
	}

	makeSearchSqlDate(H_from, H_to, seldate, err) //配列を文字列に変換
	//日付が正しくなければ検索条件から除外
	{
		var sql = "";

		if (seldate == "ansdate") //受注日
			{
				seldate = "ord.ansdate";
			} else if (seldate == "deliverydate") //納品日
			{
				seldate = "sub.deliverydate";
				var detdate = "det.deliverydate";
			} else if (seldate == "expectdate") //処理日
			{
				seldate = "sub.expectdate";
				detdate = "det.expectdate";
			}

		for (var key in H_from) {
			var val = H_from[key];

			if (1 == val.length) {
				H_from[key] = str_pad(val, 2, "0", STR_PAD_LEFT);
			}

			if (1 == H_to[key].length) {
				H_to[key] = str_pad(H_to[key], 2, "0", STR_PAD_LEFT);
			}
		}

		var from = join("-", H_from);
		var to = join("-", H_to);

		if ("err" != err) {
			if ("from" == err || "double" == err) //日付が指定されてなかったり10桁じゃなければ除外
				{
					if ("--" != from && 10 == from.length) {
						sql += " " + seldate + ">='" + from + " 00:00:00' ";
						detail += detdate + ">='" + from + " 00:00:00' ";
					}
				}

			if ("to" == err || "double" == err) {
				if ("--" != to && 10 == to.length) {
					if (sql != "") {
						sql += "AND";
					}

					sql += " " + seldate + "<='" + to + " 23:59:59' ";

					if (detail != "") {
						detail += "AND";
					}

					detail += " " + detdate + "<='" + to + " 23:59:59' ";
				}
			}

			if ("" != detdate && "" != detail) {
				if ("double" != err) {
					sql = "((" + sql + ") OR (" + detail + ")) ";
				} else {
					sql = "((" + sql + ") AND (" + detail + ")) ";
				}
			}
		} else {
			sql += " ord.carid=0 ";
		}

		return sql;
	}

	makeSearchSqlTrans(A_shopid, trans) {
		var sql = "";

		if ("" != trans && 0 != trans) //$sql .= "trch.shopid=" .$trans. " ";
			{
				var parent = "SELECT parentshop FROM support_shop_tb WHERE childshop=" + this.get_DB().dbQuote(trans, "int", true);
				var A_parent = this.get_DB().queryCol(parent);
				A_parent.push(+trans);
				sql += "(trans.toshopid IN (" + A_parent.join(", ") + ") AND trans.fromshopid IN (" + A_shopid.join(", ") + ")) ";
			}

		return sql;
	}

	makeSearchSqlCheckBox(H_status, type, H_box, A_shopid) //検索条件を補完する
	{
		var sql = "";
		var idx = 0;

		if ("buyselid" == type) //新方式(バリュー)
			{
				var A_none = this.O_order.A_empty;
				var A_new = this.O_order.A_empty;
				var A_old = this.O_order.A_empty;
				var flg = false;

				if (1 == H_status[0]) {
					sql = "SELECT buyselid FROM buyselect_tb WHERE loanflg=1";
					A_new = this.get_DB().queryCol(sql);
					flg = true;
				}

				if (1 == H_status[1]) {
					sql = "SELECT buyselid FROM buyselect_tb WHERE loanflg=2";
					A_old = this.get_DB().queryCol(sql);
					flg = true;
				}

				if (1 == H_status[2]) {
					sql = "SELECT buyselid FROM buyselect_tb WHERE loanflg=0";
					A_none = this.get_DB().queryCol(sql);
					flg = true;
				}

				var A_temp = array_merge(A_none, A_new, A_old);
				var buysel = " OR ord.buyselid IS NULL ";
			} else if ("carid" == type) {
			if ("" != H_status) {
				for (var key in H_status) {
					var val = H_status[key];
					A_temp[idx] = H_box[key][type];
					idx++;
				}
			}

			if (-1 !== A_temp.indexOf(this.O_Set.car_other)) //全キャリア出すバージョン
				//				$sql = "SELECT a.carid ".
				//				"FROM carrier_tb a INNER JOIN circuit_tb i ON a.carid=i.carid ".
				//				"WHERE a.carid NOT IN (".
				//					$this->O_Set->car_docomo.", ".
				//					$this->O_Set->car_willcom.", ".
				//					$this->O_Set->car_au.", ".
				//					$this->O_Set->car_softbank.", ".
				//					$this->O_Set->car_emobile.", ".
				//					$this->O_Set->car_smartphone.", ".
				//					$this->O_Set->car_other.") ".
				//				"GROUP BY a.carid ".
				//				"ORDER BY a.carid";
				{
					sql = "SELECT carid " + "FROM shop_carrier_tb " + "WHERE carid NOT IN (" + this.O_Set.car_docomo + ", " + this.O_Set.car_willcom + ", " + this.O_Set.car_au + ", " + this.O_Set.car_softbank + ", " + this.O_Set.car_emobile + ", " + this.O_Set.car_smartphone + ", " + this.O_Set.car_other + ") " + " AND shopid IN (" + ", ".join(A_shopid) + ") " + "GROUP BY carid " + "ORDER BY carid";
					var otherList = this.get_DB().queryCol(sql);

					for (var id of Object.values(otherList)) {
						A_temp[idx] = id;
						idx++;
					}
				}
		} else {
			if ("" != H_status) {
				for (var key in H_status) {
					var val = H_status[key];
					A_temp[idx] = H_box[key][type];
					idx++;
				}
			}
		}

		A_temp = this.correctSearchCondition(A_temp, type);
		sql = "";

		if (0 < A_temp.length) {
			if (true == is_numeric(A_temp[0])) {
				sql = "ord." + type + " in (" + A_temp.join(", ") + ") ";
			} else {
				sql = "ord." + type + " in ('" + A_temp.join("', '") + "') ";
			}
		}

		if ("buyselid" == type && true == flg) {
			sql = " (" + sql + buysel + ") ";
		}

		return sql;
	}

	correctSearchCondition(A_temp, type) {
		if (1 > A_temp.length) {
			return A_temp;
		}

		if ("status" == type) //ループ用にコピーしておく
			{
				var A_samp = A_temp;

				for (var key in A_samp) //100 = forsub:処理中
				{
					var val = A_samp[key];

					if (100 == val || 70 == val) //90 = forsub:振替確認依頼
						{
							A_temp.push(90);
						}
				}
			}

		return A_temp;
	}

	makeSearchSqlNum() {}

	makeSearchSqlString(key, val, str) {
		if ("" == val) {
			return val;
		} else {
			var sql = this.sqlConnect(str, "AND ");
		}

		if (true == (-1 !== ["orderid", "telno"].indexOf(key))) {
			val = this.O_order.checkNumeric(val);
		}

		if ("orderid" == key) {
			val = +ltrim(val, 0);
		}

		if (true == (-1 !== ["telno", "contractor"].indexOf(key))) {
			sql += "det." + key + " like '%" + val + "%' ";
		} else if ("orderid" == key) {
			sql += "ord." + key + "=" + val + " ";
		} else {
			sql += "ord." + key + "='" + val + "' ";
		}

		return sql;
	}

	getSearchResult(sql, O_view) //var_dump($sql);
	{
		if (!O_view.getSearchMode()) {
			return this.get_DB().queryHash(sql);
		}

		return Array();
	}

	getSearchCount(data) //検索結果取得(limitを外したもの)
	//$H_temp =  $this->get_DB()->queryHash($sql);
	//orderidでまとめる
	//$H_temp = $this->makeListData($data, true);
	{
		return data.length;
	}

	getOrderNumber(H_order) {
		if (1 > H_order.length) {
			return H_order;
		}

		var H_key = Object.keys(H_order);
		var sql = "SELECT sub.orderid, sum(sub.number) AS accnum FROM " + ShopOrderMenuModel.ORD_SUB_TB + " sub " + "WHERE sub.orderid IN (" + H_key.join(", ") + ") " + "AND sub.machineflg=false " + "GROUP BY sub.orderid";
		var H_num = this.get_DB().queryKeyAssoc(sql);

		for (var key in H_order) //付属品は電話件数を数えません
		{
			var val = H_order[key];

			if (true == (undefined !== H_num[key])) {
				H_order[key].accnum = H_num[key];
			} else {
				H_order[key].accnum = 0;
			}

			if ("A" == val.ordertype && this.O_Set.car_smartphone != val.carid) {
				H_order[key].telcnt--;
			}
		}

		return H_order;
	}

	getTodayHash() {
		var temp = this.getDateUtil().getNow();
		H_date.y = temp.substr(0, 4);
		H_date.m = temp.substr(5, 2);
		H_date.d = temp.substr(8, 2);
		H_date.h = temp.substr(11, 2);
		return H_date;
	}

	makeListData(H_data, flg = false) //詳細バージョン
	{
		var H_result = this.O_order.A_empty;

		if (is_null(H_data)) {
			return H_result;
		}

		if (true == flg) {
			for (var val of Object.values(H_data)) {
				if (true != (undefined !== H_result[val.orderid])) {
					H_result[val.orderid] = val;
				}
			}

			return H_result;
		}

		var nowdate = this.getDateUtil().getToday();

		for (var val of Object.values(H_data)) {
			if (true == (undefined !== H_result[val.orderid])) {
				if (!H_result[val.orderid].fixdate) {
					H_result[val.orderid].fixdate = val.fixdate;
				}

				if (H_result[val.orderid].deliverydate != val.deliverydate) //日付が未来に近いものを優先して表示
					{
						if (H_result[val.orderid].deliverydate < val.deliverydate) {
							H_result[val.orderid].deliverydate = val.deliverydate;
						}

						H_result[val.orderid].deliflg = true;
					}

				if (H_result[val.orderid].expectdate != val.expectdate) {
					if (H_result[val.orderid].expectdate < val.expectdate) {
						H_result[val.orderid].expectdate = val.expectdate;
					}

					H_result[val.orderid].expectflg = true;
				}

				if (true == val.machineflg) {
					if (this.O_order.type_acc != val.ordertype) {
						H_result[val.orderid].productname = val.productname;
					}
				} else {
					if (undefined != val.productname && undefined == H_result[val.orderid].productname) {
						H_result[val.orderid].productname = val.productname;
					}
				}

				if (undefined != val.property && undefined == H_result[val.orderid].property) //if($this->O_order->type_acc != $val["ordertype"]){
					//}
					{
						H_result[val.orderid].property = val.property;
					}
			} else {
				H_result[val.orderid] = val;
				H_result[val.orderid].deliflg = false;
				H_result[val.orderid].expectflg = false;
				H_result[val.orderid].linkflag = this.getLinkFlag(nowdate, val.completedate);

				if (this.O_Set.car_smartphone == val.carid) {
					H_result[val.orderid].property = undefined;
				}
			}
		}

		return H_result;
	}

	getLinkFlag(nowdate, checkdate) {
		if (undefined != checkdate && nowdate > checkdate) {
			return false;
		}

		return true;
	}

	offsetListData(H_sess, H_data) {
		var max;
		var idx = max = 0;
		var offset = (H_sess[ShopOrderMenuModel.PUB].offset - 1) * H_sess[ShopOrderMenuModel.PUB].limit;

		for (var key in H_data) {
			var val = H_data[key];

			if (offset <= idx && H_sess[ShopOrderMenuModel.PUB].limit > max) //$temp = $this->getOrderNumber(array($val["orderid"] => $val));
				//$H_result[$key] = $temp[$key];
				{
					H_result[key] = val;
					max++;
				}

			idx++;
		}

		return H_result;
	}

	getPageLink(H_sess, cnt) {
		return this.O_order.getPageLink(cnt, H_sess[ShopOrderMenuModel.PUB].limit, H_sess[ShopOrderMenuModel.PUB].offset);
	}

	checkUnifyShop(shopid) {
		var sql = "SELECT COUNT(parentshop) FROM support_shop_tb WHERE parentshop=" + shopid;

		if (0 < this.get_DB().queryOne(sql)) {
			return true;
		}

		return false;
	}

	getChildShopID(shopid, shopname, flg, opt = true) {
		var A_shopid = {
			[shopid]: shopname
		};

		if (true == flg) //配下のshopidを取得
			//shpnameを取得
			//必要なら操作中の販売店を含めて返す
			{
				var sql = "SELECT childshop FROM support_shop_tb " + "WHERE parentshop=" + shopid;
				A_shopid = this.get_DB().queryCol(sql);
				sql = "SELECT shopid, name FROM shop_tb " + "WHERE shopid IN (" + A_shopid.join(", ") + ")";
				A_shopid = this.get_DB().queryKeyAssoc(sql);

				if (true == opt) {
					A_shopid = {
						[shopid]: shopname
					} + A_shopid;
				}
			} else {
			sql = "SELECT shopid, name FROM shop_tb WHERE shopid=" + shopid;
			A_shopid = this.get_DB().queryKeyAssoc(sql);
		}

		return A_shopid;
	}

	getShopList(groupid) {
		var sql = "SELECT shopid, '['||postcode||']'||name " + "FROM " + "shop_tb";
		"WHERE groupid=" + groupid;
		return this.get_DB().queryAssoc(sql);
	}

	addTransferInfo(H_data, A_order, shopid) //操作中の販売店に振替えられた受注を取得
	//操作中の販売店が振替えた受注を取得
	//return $H_data;
	{
		var sql = "SELECT " + "orderid, fromshopid, toshopid, transfer_status, transfer_type " + "FROM " + "mt_transfer_tb " + "WHERE " + "toshopid IN (" + shopid.join(", ") + ")" + " AND orderid IN (" + A_order.join(", ") + ") " + "ORDER BY transfer_level DESC";
		var A_in = this.get_DB().queryKeyAssoc(sql);
		sql = "SELECT " + "orderid, fromshopid, toshopid, transfer_status, transfer_type " + "FROM " + "mt_transfer_tb " + "WHERE " + "fromshopid IN (" + shopid.join(", ") + ")" + " AND orderid IN (" + A_order.join(", ") + ") " + "ORDER BY transfer_level DESC";
		var A_out = this.get_DB().queryKeyAssoc(sql);

		for (var key in H_data) {
			var val = H_data[key];

			if (true == (undefined !== A_in[val.orderid])) {
				H_data[key].tr_in = 1;
				H_data[key].tr_instat = A_in[val.orderid].transfer_status;
				H_data[key].tr_intype = A_in[val.orderid].transfer_type;
				H_data[key].tr_fromshopid = A_in[val.orderid].fromshopid;
			} else {
				H_data[key].tr_in = 0;
				H_data[key].tr_instat = "none";
				H_data[key].tr_intype = "0";
				H_data[key].tr_fromshopid = A_in[val.orderid].fromshopid;
			}

			if (true == (undefined !== A_out[val.orderid])) {
				H_data[key].tr_out = 1;
				H_data[key].tr_outstat = A_out[val.orderid].transfer_status;
				H_data[key].tr_outtype = A_out[val.orderid].transfer_type;
				H_data[key].tr_toshopid = A_out[val.orderid].toshopid;
			} else {
				H_data[key].tr_out = 0;
				H_data[key].tr_outstat = "none";
				H_data[key].tr_outtype = "0";
				H_data[key].tr_toshopid = A_out[val.orderid].toshopid;
			}
		}
	}

	getDLAuth(H_g_sess) {
		var sql = "SELECT " + "rel.fncid " + "FROM " + "shop_fnc_relation_tb rel " + "INNER JOIN shop_function_tb fnc ON rel.fncid=fnc.fncid " + "WHERE " + "rel.shopid=" + H_g_sess.shopid + " AND rel.memid=" + H_g_sess.memid + " AND fnc.ininame='fnc_shop_download'";
		return this.get_DB().queryOne(sql);
	}

	setOrderID(H_data, H_sql) //$H_sql["down"]["where"] = $this->searchwhere;
	{
		if (this.O_order.A_empty != H_data) {
			var A_orderid = Object.keys(H_data);
		} else {
			A_orderid = [0];
		}

		H_sql.down.where = "where ord.orderid IN (" + A_orderid.join(", ") + ") ";
	}

	__destruct() {
		super.__destruct();
	}

};