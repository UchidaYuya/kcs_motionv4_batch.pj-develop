//
//注文用Model基底クラス
//
//更新履歴：<br>
//2008/07/02 igarashi 作成
//
//@package Order
//@subpackage Model
//@author igarashi
//@filesource
//@since 2008/07/02
//
//
//
//注文フォーム用Model基底クラス
//
//@uses ModelBase
//@package
//@author miyazawa
//@since 2008/04/01
//

require("model/ModelBase.php");

require("MtAuthority.php");

require("MtTableUtil.php");

require("Post.php");

require("TreeAJAX.php");

require("ListAJAX.php");

require("view/ViewError.php");

require("OrderUtil.php");

require("model/GroupModel.php");

require("MtTax.php");

//
//ディレクトリ名
//
//
//注文共通の関数集オブジェクト
//
//@var mixed
//@access protected
//
//protected $O_Order;
//
//権限オブジェクト
//
//@var mixed
//@access protected
//
//
//セッティングオブジェクト
//
//@var mixed
//@access protected
//
//
//権限一覧
//
//@var mixed
//@access protected
//
//
//グローバルセッション
//
//@var mixed
//@access protected
//
//
//orderByCategoryFlag
//
//@var mixed
//@access public
//
//
//orderByCategoryPattern
//
//@var mixed
//@access public
//
//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param MtSetting $O_Set0
//@param array $H_g_sess
//@param objrct $O_order
//@access public
//@return void
//
//
//権限一覧を取得する
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return array
//
//
//販売店用権限一覧を取得する
//
//@author igarashi
//@since 2008/07/02
//
//@param $H_param 受注変更画面から使われるときはその注文のpactidを含むパラメータが来るので$this->H_G_Sessに入れる（RecogFormProcから呼ばれる）
//
//@access public
//@return array
//
//
//渡されたcaridからキャリア名を取得
//
//@author igarashi
//@since 2008/07/16
//
//@param $carid
//
//@access public
//@return integer
//
//
//権限一覧のゲッター
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
//tel_detail_tbとsub_tbをマージする
//
// @author igarashi
// @since 2008/07/17
//
// @param $H_detail(mt_order_teldetail_tb)
// @param $H_sub(mt_order_sub_tb)
//
// @access public
// @return hash
//
//小計と小計から税額を計算する<br>
//小数点は切り捨て.税率はiniファイルから取得
//
//@author igarashi
//@since 2008/08/11
//
//@param $H_order
//
//@access public
//@return hash
//
//
//参考金額と請求額から税額を求める
//
//@author igarashi
//@since 2008/08/11
//
//@param $H_order
//
//@access public
//@return hash
//
//
//参考金額を計算する
//
//@author date
//@since 2014/08/28
//
//@param $H_order
//
//@access public
//@return hash
//
//
//請求金額を計算する
//
//@author igarashi
//@since 2014/08/28
//
//@param $H_order
//
//@access public
//@return hash
//
//
//サブオーダー毎に指定された仕様ポイントをまとめる
//
//@author igarashi
//@since 2008/08/11
//
//@param $H_order
//
//@access public
//@return integer
//
//
//渡された注文情報の中から、金額に関するカラムを3桁区切りにした値を追加して返す<br>
//追加して返すだけなのでもとの情報は変わらない<br>
//変換されるカラム名はgetMoneyColumnで生成される<br>
//変換された値はf_カラム名で新しく追加される
//
//@author igarashi
//@since 2008/08/11
//
//@param $H_order
//
//@access public
//@return hash
//
//
//金額が入るカラム名を配列で返す
//
//@author igarashi
//@since 2008/08/11
//
//@access protected
//@return array
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
//販売店の地域会社取得
//
//@author miyazawa
//@since 2008/11/06
//
//@param int $shopid
//@param int $carid
//@access public
//@return int
//
//
//convertSmartPhoneTypeId
//
//@author
//@since 2011/01/21
//
//@param mixed $name
//@access public
//@return void
//
//
//getSmartPhoneTypeName
//
//@author
//@since 2011/01/21
//
//@param mixed $productid
//@access public
//@return void
//
//
//getSmartPhoneType
//
//@author
//@since 2011/02/02
//
//@param mixed $smpcirid
//@access public
//@return void
//
//
//getSmartPhoneTypeList
//
//@author web
//@since 2012/10/01
//
//@access public
//@return void
//
//
//getAssetsID
//
//@author igarashi
//@since 2009/11/26
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $pactid
//@access protected
//@return void
//
//
//getSerialNo
//
//@author igarashi
//@since 2011/03/23
//
//@param mixed $assetsid
//@access protected
//@return void
//
//
//getSimNo
//
//@author igarashi
//@since 2011/03/24
//
//@param mixed $assetsid
//@access protected
//@return void
//
//
//getSystemName
//
//@author igarashi
//@since 2011/10/11
//
//@param mixed $groupid
//@access protected
//@return void
//
//
//setValidateAuthority
//
//@author web
//@since 2013/10/02
//
//@param ValidateAuthorityInterface $validater
//@access public
//@return void
//
//
//checkOrderByCategory
//
//@author web
//@since 2013/10/02
//
//@access public
//@return void
//
//
//setOrderByCategoryFlag
//
//@author web
//@since 2013/09/27
//
//@param mixed $pattern
//@access public
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
class OrderModelBase extends ModelBase {
	static PUB = "/MTOrder";
	static SITE_USER = 0;
	static SITE_SHOP = 1;
	static ORD_TB = "mt_order_tb";
	static ORD_SUB_TB = "mt_order_sub_tb";
	static ORD_DET_TB = "mt_order_teldetail_tb";
	static PRIVATE_RECOG_STAT = 5;
	static PRIVATE_HOLD_STAT = 7;
	static FUNC_EXTENSION = 158;

	constructor(O_db0, H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		super(O_db0);
		this.H_G_Sess = H_g_sess;
		this.O_order = OrderUtil.singleton();
		this.NowTime = this.get_db().getNow();
		this.O_Set = MtSetting.singleton();

		if (OrderModelBase.SITE_USER == site_flg) {
			global.MT_SITE = "user";
			this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
			this.setAllAuthIni();
		} else if (OrderModelBase.SITE_SHOP == site_flg) {
			global.MT_SITE = "shop";
			this.O_Auth = MtShopAuthority.singleton(this.H_G_Sess.shopid);
			this.setShopAllAuthIni();
		}
	}

	setAllAuthIni() {
		var super = false;

		if (undefined !== this.H_G_Sess.su == true && this.H_G_Sess.su == 1) {
			super = true;
		}

		if (undefined !== this.H_G_Sess.joker == true && this.H_G_Sess.joker == 1) //成り代わりだったら権限の時間制限を見ない
			{
				var A_userauth = this.O_Auth.getUserFuncIni(this.H_G_Sess.userid, "all");
				var A_pactauth = this.O_Auth.getPactFuncIni("all");
			} else {
			A_userauth = this.O_Auth.getUserFuncIni(this.H_G_Sess.userid);
			A_pactauth = this.O_Auth.getPactFuncIni();
		}

		this.A_Auth = array_merge(A_userauth, A_pactauth);
	}

	setShopAllAuthIni(H_param = undefined) {
		if (true == Array.isArray(H_param) && true == 0 < H_param.length) {
			this.H_G_Sess = H_param;
		}

		var super = false;

		if (undefined !== this.H_G_Sess.su == true && this.H_G_Sess.su == 1) {
			super = true;
		}

		var A_userauth = this.O_Auth.getUserFuncIni(this.H_G_Sess.memid);
		var A_shopauth = this.O_Auth.getShopFuncIni(this.H_G_Sess.shopid);
		var A_pactauth = Array();

		if ("" != this.H_G_Sess.pactid) {
			var O_PactAuth = MtAuthority.singleton(this.H_G_Sess.pactid);
			A_pactauth = O_PactAuth.getPactFuncIni();
		}

		this.A_Auth = array_merge(A_userauth, A_shopauth, A_pactauth);
	}

	convCarrierID(carid) {
		var sql = "SELECT carname FROM carrier_tb WHERE carid=" + carid;
		return this.get_DB().queryOne(sql);
	}

	get_AuthIni() {
		return this.A_Auth;
	}

	mergeOrderData(H_detail, H_sub, ordertype = "N", site_flg = OrderModelBase.SITE_USER) //echo "大改変。取得した注文情報について確認すること OrderModelBase::mergeOrderData 20080828iga";
	{
		var subcnt = H_sub.length;
		var detmax = H_detail.length;
		var A_machine = Array();
		var A_acce = Array();
		var A_log = Array();
		var A_maclog = Array();

		for (var idx = 0; idx < detmax; idx++) {
			for (var loop = 0; loop < subcnt; loop++) //subidが一緒ならマージしても大丈夫
			{
				if (H_sub[loop].ordersubid == H_detail[idx].ordersubid) {
					A_machine.push(H_detail[idx] + H_sub[loop]);
					A_maclog.push(H_detail[idx].detail_sort);
				} else {
					if (false == (-1 !== A_log.indexOf(H_sub[loop].ordersubid))) {
						A_acce.push(H_sub[loop]);
						A_log.push(H_sub[loop].ordersubid);
					}

					if (OrderModelBase.SITE_SHOP == site_flg) {
						if (false == (-1 !== A_maclog.indexOf(H_detail[idx].detail_sort))) {
							A_machine.push(H_detail[idx]);
							A_maclog.push(H_detail[idx].detail_sort);
						}
					}
				}
			}
		}

		if ("A" != ordertype) {
			return array_merge(A_machine, A_acce);
		} else {
			return array_merge(A_acce);
		}
	}

	calcSubTotal(H_order) {
		var rate = this.O_Set.excise_tax;
		var H_result = Array();

		for (var key in H_order) {
			var val = H_order[key];
			H_result[key] = val;
			H_result[key].subtotal = val.anspassprice * val.number;
			H_result[key].fixedsubtotal = val.saleprice * val.number;
		}

		for (var key in H_result) {
			var val = H_result[key];
			H_result[key].taxprice = +(val.subtotal * rate);
			H_result[key].fixedtaxprice = +(val.fixedsubtotal * rate);
		}

		return H_result;
	}

	calcTotalTax(H_order) //$H_order["refercharge_notax"] = (int)($H_order["refercharge"] / (1 + $rate));   // 税抜き価格 20090729miya
	//$H_order["taxrefercharger"] = (int)($H_order["refercharge"] * $rate);   // これは税を二重にかけてるのでいらなくなるはず 20090729miya
	//不本意ながら、なぜ必要かわからないため用意
	//$H_order["taxbilltotal"] = (int)($H_order["billtotal"] * $rate);
	{
		var rate = this.O_Set.excise_tax;
		H_order.refercharge_notax = MtTax.priceWithoutTax(H_order.refercharge);
		H_order.taxrefercharger = MtTax.tax(H_order.refercharge);
		H_order.taxbilltotal = MtTax.tax(H_order.billtotal);
		return H_order;
	}

	calcReferTotal(H_order, H_sub = undefined) //勢抜き合計価格
	//不本意ながら、なぜ必要かわからないため用意
	{
		H_order.taxrefercharger_2 = MtTax.tax(H_order.refercharge);

		if (undefined !== H_sub) {
			H_order.refercharge_notax_2 = 0;
			H_order.refercharge_2 = 0;

			for (var tmp of Object.values(H_sub)) //キャンセルチェック
			{
				if (tmp.substatus == 230) continue;

				if (undefined !== tmp.anspassprice) {
					var price = MtTax.priceWithoutTax(tmp.anspassprice);
					H_order.refercharge_notax_2 += price * tmp.number;
					H_order.refercharge_2 += tmp.anspassprice * tmp.number;
				}
			}
		} else {
			H_order.refercharge_notax_2 = MtTax.priceWithoutTax(H_order.refercharge);
		}

		return H_order;
	}

	calcBillTotal(H_order, H_sub = undefined) {
		if (undefined !== H_sub) {
			H_order.taxbilltotal_2 = 0;
			H_order.billtotal_2 = 0;
			H_order.billtotal2_2 = 0;

			for (var tmp of Object.values(H_sub)) //キャンセルチェック
			{
				if (tmp.substatus == 230) {
					continue;
				}

				if (H_order.ordertype == this.O_order.type_acc && tmp.machineflg == true) {
					continue;
				}

				H_order.billtotal_2 += (tmp.saleprice_2 - tmp.shoppoint) * tmp.number;
				H_order.taxbilltotal_2 += Math.round(MtTax.tax(tmp.saleprice_2 - tmp.shoppoint)) * tmp.number;
				H_order.billtotal2_2 += Math.round(tmp.saleprice_2 + MtTax.tax(tmp.saleprice_2)) * tmp.number;
				H_order.billtotal2_2 -= tmp.shoppoint2 * tmp.number;
			}
		} else {
			H_order.taxbilltotal_2 = MtTax.tax(H_order.billtotal);
		}

		return H_order;
	}

	calcUsePoint(H_order) {
		var result = 0;

		for (var key in H_order) //付属品は台数をかける 20091120miya
		{
			var val = H_order[key];

			if (false == val.machineflg) {
				result += +(val.shoppoint + +val.shoppoint2) * +val.number;
			} else {
				result += +(val.shoppoint + +val.shoppoint2);
			}
		}

		return +result;
	}

	setMoneyFormat(H_order, flg = false) {
		var A_money = this.getMoneyColumn();

		for (var key in H_order) {
			var val = H_order[key];

			for (var name in val) //税込価格で入ってきている単価を税抜価格にする 20090729miya
			{
				var cont = val[name];
				var rate = this.O_Set.excise_tax;

				if (true == (-1 !== ["anspassprice"].indexOf(name))) //$H_order[$key]["notax_" . $name] = ($cont / (1 + $rate));
					{
						H_order[key]["notax_" + name] = MtTax.priceWithoutTax(cont);
					}

				if (undefined != A_money[1][name]) {
					H_order[key]["tin_" + name] = number_format(cont + H_order[key][A_money[1][name]]);
				}

				if (-1 !== A_money[2].indexOf(name)) {
					if (!is_null(H_order[key].number)) {
						var numbercnt = H_order[key].number;
					} else {
						numbercnt = H_order[key].telcnt;
					}

					H_order[key]["tin_" + name] = number_format(MtTax.priceWithTax(H_order[key].saleprice) * numbercnt);
				}

				if (-1 !== A_money[3].indexOf(name)) {
					if (!is_null(H_order[key].number)) {
						numbercnt = H_order[key].number;
					} else {
						numbercnt = H_order[key].telcnt;
					}

					H_order[key]["tin_" + name] = number_format(MtTax.priceWithTax(H_order[key].saleprice_2) * numbercnt);
				}

				if (true == (-1 !== A_money[0].indexOf(name))) {
					if (999 < +cont) {
						H_order[key]["f_" + name] = number_format(cont);
					} else {
						H_order[key]["f_" + name] = cont;
					}
				}
			}
		}

		if (true != flg) {
			return H_order;
		} else {
			return H_order[0];
		}
	}

	getMoneyColumn() {
		var H_result = [["saleprice", "anspassprice", "totalprice", "fixedtotal", "taxprice", "subtotal", "fixedtaxprice", "fixedsubtotal", "refercharger", "applyprice", "costprice", "paymentprice", "shoppoint", "point", "pay_point", "tin_subtotal", "tin_fixedsubtotal", "usepoint", "billtotal", "tin_billtotal", "taxrefercharger", "taxbilltotal", "pay_monthly_sum", "saleprice_2", "billtotal_2", "tin_billtotal_2", "taxrefercharger_2", "taxbilltotal_2", "fixedsubtotal_2", "tin_fixedsubtotal_2"], {
			subtotal: "taxprice",
			refercharger: "taxrefercharger",
			billtotal: "taxbilltotal",
			refercharger_2: "taxrefercharger_2",
			billtotal_2: "taxbilltotal_2"
		}, ["fixedsubtotal"], ["fixedsubtotal_2"]];
		return H_result;
	}

	getTodayHash() {
		var temp = this.getDateUtil().getNow();
		H_date.y = temp.substr(0, 4);
		H_date.m = temp.substr(5, 2);
		H_date.d = temp.substr(8, 2);
		H_date.h = temp.substr(11, 2);
		return H_date;
	}

	getShopArea(shopid, carid) {
		var sql = "SELECT arid FROM shop_carrier_tb " + "WHERE shopid=" + shopid + " AND carid=" + carid;
		return this.get_DB().queryOne(sql);
	}

	convertSmartPhoneTypeId(productid) {
		var sql = "SELECT " + "smpcirid " + "FROM " + "smart_circuit_tb " + "WHERE " + "smpcirname=" + this.get_DB().dbQuote(this.getSmartType(productid), "text", false);
		return this.get_DB().queryOne(sql);
	}

	getSmartType(productid) {
		if (is_numeric(productid)) {
			var sql = "SELECT smart_type FROM product_tb WHERE productid=" + this.get_DB().dbQuote(productid, "int", true);
			return this.get_DB().queryOne(sql);
		}

		return undefined;
	}

	getSmartPhoneType(smpcirid) {
		if (is_numeric(smpcirid)) {
			var sql = "SELECT smpcirname FROM smart_circuit_tb WHERE smpcirid=" + this.get_DB().dbQuote(smpcirid, "int", true);
			return this.get_DB().queryOne(sql);
		}

		return undefined;
	}

	getSmartPhoneTypeList(selflag = false, language = "JPN") {
		var colname = "smpcirname";
		var seldefault = "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";

		if ("ENG" == language) {
			colname = "smpcirname_eng";
			seldefault = "--please select--";
		}

		var sql = "SELECT smpcirid, " + colname + " FROM smart_circuit_tb ORDER BY sort";
		var rel = this.get_DB().queryAssoc(sql);

		if (selflag) {
			return {
				"": seldefault
			} + rel;
		}

		return rel;
	}

	getAssetsID(telno, carid, pactid) {
		var result = undefined;

		if (!!telno && !!carid && !!pactid) {
			var sql = "SELECT assetsid FROM tel_rel_assets_tb " + "WHERE " + "telno=" + this.get_DB().dbQuote(telno, "text", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND main_flg=true";
			result = this.get_DB().queryOne(sql);
		}

		return result;
	}

	getSerialNo(assetsid) {
		var result = undefined;

		if (!!assetsid) {
			var sql = "SELECT serialno FROM assets_tb WHERE assetsid=" + this.get_DB().dbQuote(assetsid, "int", true);
			result = this.get_DB().queryOne(sql);
		}

		return result;
	}

	getSimNo(telno, carid, pactid) {
		var result = undefined;

		if (!!telno && !!carid && !!pactid) {
			var sql = "SELECT simcardno FROM tel_tb " + "WHERE " + "telno=" + this.get_DB().dbQuote(telno, "text", true) + " " + "AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " " + "AND pactid=" + this.get_DB().dbQuote(pactid, "int", true);
			result = this.get_DB().queryOne(sql);
		}

		return result;
	}

	getSystemName(groupid, language = "JPN", pacttype = "M") //文字列長が異なる＝マルチバイト入り＝日本語と判断
	{
		var O_group = new GroupModel(O_db0);
		var systemname = O_group.getGroupSystemname(groupid);

		if (systemname.length != mb_strlen(systemname) || !systemname) {
			if ("ENG" == language) //$O_conf->loadConfig("group");
				{
					var O_conf = MtSetting.singleton();
					systemname = "";

					if (O_conf.existsKey("grouptitle_" + groupid + "_" + pacttype + "_ENG")) {
						systemname = O_group.getGroupTitle(groupid, PACTTYPE, language);
					}
				}
		}

		return systemname;
	}

	setValidateAuthority(validater: ValidateAuthorityInterface) {
		this.validater = validater;
	}

	checkOrderByCategory() {
		return this.validater.fire(this.A_Auth);
	}

	setOrderByCategoryFlag(pattern) {
		this.orderByCategoryFlag = true;
		this.orderByCategoryPatternName = pattern;

		switch (pattern) {
			case "business":
				this.orderByCategoryPattern = 1;
				break;

			case "demo":
				this.orderByCategoryPattern = 2;
				break;
		}
	}

	__destruct() {
		super.__destruct();
	}

};