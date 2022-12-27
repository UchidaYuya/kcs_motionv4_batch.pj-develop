//
//受注詳細印刷用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author igarashi
//@since 2008/04/01
//@uses OrderModel
//@uses OrderUtil
//
//
//require_once("model/Management/Tel/ManagementTelModel.php");
//require_once("model/Shop/Product/ShopProductModel.php");
//require_once("model/Price/UserPriceModel.php");
//
//受注詳細印刷用Model
//
//@uses ModelBase
//@package Order
//@author igarashi
//@since 2008/04/01
//

require("MtDateUtil.php");

require("ManagementUtil.php");

require("MtDateUtil.php");

require("OrderUtil.php");

require("model/Order/ShopOrderDetailModel.php");

require("model//Price/UserPriceModel.php");

require("model/Shop/Product/ShopProductModel.php");

//
//コンストラクター
//
//@author igarashi
//@since 2008/07/02
//
//@param objrct $O_db0
//@param array $H_g_sess
//@access public
//@return void
//
//
//販売店の部門コードを返す
//
//@author igarashi
//@since 2008/09/12
//
//
//
//
//入力された値から印刷用の価格
//
//@author igarashi
//@since 2008/09/30
//
//@param $H_regist
//
//@access public
//@return array
//
//
//電話詳細情報を表示／非表示を判定するフラグを返す
//
//@author igarashi
//@since 2008/09/30
//
//@param $type
//
//@access public
//@return bool
//
//
//現在の時間を取得して返す
//
//@author igarashi
//@since 2008/10/01
//
//@access public
//@return string
//
//
//振替先の販売店ポストコードを入れる
//
//@author igarashi
//@since 2009/01/28
//
//@param mixed $H_order
//@access public
//@return void
//
//
//印刷が面を開いた時にステータスが未処理なら
//注文確認中に更新する
//
//@author igarashi
//@since 2008/12/25
//
//@param mixed $H_view
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/07/04
//
//@access public
//@return void
//
class ShopOrderPrintOutModel extends ShopOrderDetailModel {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess, ShopOrderPrintOutModel.SITE_SHOP);
	}

	getShopPostCode(shopid) {
		var sql = "SELECT postcode FROM shop_tb WHERE shopid=" + shopid;
		return this.get_DB().queryOne(sql);
	}

	mathRegister(H_view) {
		MtTax.setDate(H_view.order.finishdate);
		A_math.indiv.machine = this.O_order.A_empty;
		A_math.indiv.acce = this.O_order.A_empty;

		if (1 > H_view.regist.length) {
			return this.O_order.A_empty;
		}

		var roundflg = "down";

		if (this.O_Set.car_emobile == H_view.order.carid) {
			roundflg = "round";
		}

		{
			let _tmp_0 = H_view.machine;

			for (var key in _tmp_0) //$H_temp["anspassprice"] = (int)$this->correctNumeric(($val["anspassprice"] / ($this->O_Set->excise_tax + 1)), "up");
			//$H_temp["subtotal"] = $this->correctNumeric(($val["saleprice"] - $val["shoppoint"]), $roundflg);		// 小計
			//$H_temp["tax"] = (int)$this->correctNumeric(($H_temp["subtotal"] * $this->O_Set->excise_tax), $roundflg);	// 税額
			//$H_temp["total"] = $this->correctNumeric(($H_temp["subtotal"] + $H_temp["tax"] - $val["shoppoint2"]), $roundflg);			// 税込小計
			//$H_temp["number"] = 1;
			//$point += $this->correctNumeric($val["shoppoint"], $roundflg); // ポイント合計
			//小計
			//税額
			//税込小計
			//ポイント合計
			//ポイント合計
			//以下は全て台数込
			//$H_temp["allprice"] = $this->correctNumeric($val["saleprice"], $roundflg);			// 価格
			//$H_temp["allpoint"] = $this->correctNumeric($val["shoppoint"], $roundflg);			// 価格
			//$H_temp["allpoint2"] = $this->correctNumeric($val["shoppoint2"], $roundflg);			// 価格
			//$H_temp["allsubtotal"] = $this->correctNumeric(($val["saleprice"] - $val["shoppoint"]), $roundflg);	// 小計
			//$H_temp["alltax"] = (int)$this->correctNumeric(($H_temp["subtotal"] * $this->O_Set->excise_tax), $roundflg);	// 税額
			//$H_temp["alltotal"] = $this->correctNumeric(($H_temp["subtotal"] + $H_temp["tax"]), $roundflg);			// 税込小計
			//価格
			//価格
			//価格
			//小計
			//税額
			//税込小計
			{
				var val = _tmp_0[key];
				H_temp.anspassprice = MtTax.priceWithoutTax(val.anspassprice);
				H_temp.subtotal = MtRounding.tweek(val.saleprice - val.shoppoint);
				H_temp.tax = MtTax.taxPrice(H_temp.subtotal);
				H_temp.total = MtRounding.tweek(H_temp.subtotal + H_temp.tax - val.shoppoint2);
				H_temp.point2 = MtRounding.tweek(val.shoppoint2);
				H_temp.number = 1;
				point += MtRounding.tweek(val.shoppoint);
				H_temp.allprice = MtRounding.tweek(val.saleprice);
				H_temp.allpoint = MtRounding.tweek(val.shoppoint);
				H_temp.allpoint2 = MtRounding.tweek(val.shoppoint2);
				H_temp.allsubtotal = MtRounding.tweek(val.saleprice - val.shoppoint);
				H_temp.alltax = MtTax.taxPrice(H_temp.subtotal);
				H_temp.alltotal = MtRounding.tweek(H_temp.subtotal - val.shoppoint2 + H_temp.tax);
				A_math.indiv.machine.push(H_temp);
				var H_temp = this.O_order.A_empty;
			}
		}
		{
			let _tmp_1 = H_view.acce;

			for (var key in _tmp_1) //$H_temp["anspassprice"] = (int)$this->correctNumeric(($val["anspassprice"] / ($this->O_Set->excise_tax + 1)), "up");
			//$H_temp["subtotal"] = $this->correctNumeric(($val["saleprice"] - $val["shoppoint"]), $roundflg);		// 小計
			//$H_temp["tax"] = (int)$this->correctNumeric(($H_temp["subtotal"] * $this->O_Set->excise_tax), $roundflg);	// 税額
			//$H_temp["total"] = $this->correctNumeric(($H_temp["subtotal"] + $H_temp["tax"] - $val["shoppoint2"]), $roundflg);			// 税込小計
			//$H_temp["point2"] = $this->correctNumeric($val["shoppoint2"], $roundflg);	// ポイント合計
			//$point += $this->correctNumeric($val["shoppoint"], $roundflg);		// ポイント合計
			//小計
			//税額
			//税込小計
			//ポイント合計
			//ポイント合計
			//以下は全て台数込
			//$H_temp["allprice"] = $this->correctNumeric(($val["saleprice"] * $val["number"]), $roundflg);			// 価格
			//$H_temp["allpoint"] = $this->correctNumeric(($val["shoppoint"] * $val["number"]), $roundflg);			// 価格
			//$H_temp["allpoint2"] = $this->correctNumeric(($val["shoppoint2"] * $val["number"]), $roundflg);			// 価格
			//$H_temp["allsubtotal"] = $this->correctNumeric((($val["saleprice"] - $val["shoppoint"]) * $val["number"]), $roundflg);	// 小計
			//$H_temp["alltax"] = (int)$this->correctNumeric((($H_temp["subtotal"] * $this->O_Set->excise_tax) * $val["number"]), $roundflg);	// 税額
			//$H_temp["alltotal"] = $this->correctNumeric((($H_temp["subtotal"] - $val["shoppoint2"] + $H_temp["tax"]) * $val["number"]), $roundflg);			// 税込小計
			//価格
			//価格
			//価格
			//小計
			//税額
			//税込小計
			{
				var val = _tmp_1[key];
				H_temp.anspassprice = MtTax.priceWithoutTax(val.anspassprice);
				H_temp.subtotal = MtRounding.tweek(val.saleprice - val.shoppoint);
				H_temp.tax = MtTax.taxPrice(H_temp.subtotal);
				H_temp.total = MtRounding.tweek(H_temp.subtotal + H_temp.tax - val.shoppoint2);
				H_temp.point2 = MtRounding.tweek(val.shoppoint2);
				point += MtRounding.tweek(val.shoppoint);
				H_temp.number = val.number;
				H_temp.allprice = MtRounding.tweek(val.saleprice * val.number);
				H_temp.allpoint = MtRounding.tweek(val.shoppoint * val.number);
				H_temp.allpoint2 = MtRounding.tweek(val.shoppoint2 * val.number);
				H_temp.allsubtotal = MtRounding.tweek((val.saleprice - val.shoppoint) * val.number);
				H_temp.alltax = MtTax.taxPrice(H_temp.subtotal) * val.number;
				H_temp.alltotal = MtRounding.tweek((H_temp.subtotal - val.shoppoint2 + H_temp.tax) * val.number);
				A_math.indiv.acce.push(H_temp);
				H_temp = this.O_order.A_empty;
			}
		}
		H_temp = this.O_order.A_empty;
		{
			let _tmp_2 = A_math.indiv;

			for (var key in _tmp_2) {
				var goodstype = _tmp_2[key];

				for (var val of Object.values(goodstype)) {
					H_temp.fixpoint += val.point;
					H_temp.fixanstotal += val.allprice;
					H_temp.fixsubtotal += val.subtotal;
					H_temp.fixtax += val.tax;
					H_temp.fixpoint2 += val.point2;
					H_temp.fixtotal += val.total;
					H_temp.fixnumber += val.number;
					H_temp.fixallprice += val.allprice;
					H_temp.fixallpoint += val.allpoint;
					H_temp.fixallsubtotal += val.allsubtotal;
					H_temp.fixalltax += val.alltax;
					H_temp.fixallpoint2 += val.allpoint2;
					H_temp.fixalltotal += val.alltotal;
				}
			}
		}
		var paypoint = this.get_DB().queryOne("SELECT pay_point FROM " + ShopOrderPrintOutModel.ORD_TB + " WHERE orderid=" + H_view.order.orderid);
		H_temp.fixallpoint += paypoint;
		H_temp.fixpoint = point;
		A_math.total = H_temp;
		return A_math;
	}

	getTelViewFlag(type) {
		var flag = true;

		if (this.O_order.type_acc == type) {
			flag = false;
		}

		return flag;
	}

	getNowTime() {
		return MtDateUtil.getNow();
	}

	convDisplayData(H_data) //var_dump($H_data);
	{
		H_data.user.knowledge = preg_replace("/\r\n|\r|\n/", "\u3000", H_data.user.knowledge);
		H_data.user.certificate = preg_replace("/\r\n|\r|\n/", "\u3000", H_data.user.certificate);
		H_data.user.shopnote = preg_replace("/\r\n|\r|\n/", "\u3000", H_data.user.shopnote);
		return H_data;
	}

	getDetailTransferShopCode(H_order, orderid) {
		var A_sqlsort = this.O_order.A_empty;

		for (var val of Object.values(H_order)) {
			A_sqlsort.push(val.detail_sort);
		}

		var sql = "SELECT trns.transfer_level, trns.detail_sort, shop.postcode " + "FROM " + "mt_transfer_tb trns " + "INNER JOIN shop_tb shop ON trns.toshopid=shop.shopid " + "WHERE " + "trns.orderid=" + orderid + " AND trns.detail_sort IN (" + A_sqlsort.join(", ") + ")";
		var H_data = this.get_DB().queryHash(sql);

		for (var val of Object.values(H_data)) {
			H_post[val.transfer_level][val.postcode][val.detail_sort] = val.detail_sort;
		}

		var A_sort = this.O_order.A_empty;
		var A_data = this.O_order.A_empty;

		for (var key in H_order) {
			var val = H_order[key];

			if (false == (-1 !== A_sort.indexOf(val.detail_sort))) {
				A_sort.push(val.detail_sort);
				A_data.push(val);
			}
		}

		if (0 < H_post.length) {
			for (var level in H_post) {
				var A_code = H_post[level];

				for (var code in A_code) {
					var sort = A_code[code];

					for (var key in A_data) {
						var val = A_data[key];

						if (sort[val.detail_sort] == val.detail_sort) {
							A_data[key].detailpost = code;
						}
					}
				}
			}
		}

		return A_data;
	}

	updateStatus(H_view) {
		if (this.O_order.st_unsest == H_view.order.status) //where句作っておく
			//mt_order_tb
			//mt_order_sub_tb
			//mt_order_teldetail_tb
			//付属品はteldetailに書かない
			{
				var A_sql = this.O_order.A_empty;
				var where = " WHERE " + "orderid=" + H_view.order.orderid;
				var sql = "UPDATE " + ShopOrderPrintOutModel.ORD_TB + " SET " + "status=" + this.get_DB().dbQuote(this.O_order.st_unchk, "int", true);
				A_sql.push(sql + where);
				var sub = "UPDATE " + ShopOrderPrintOutModel.ORD_SUB_TB + " SET " + "substatus=" + this.get_DB().dbQuote(this.O_order.st_unchk, "int", true);
				A_sql.push(sub + where);

				if (this.O_order.type_acc != H_view.order.ordertype) {
					var det = "UPDATE " + ShopOrderPrintOutModel.ORD_DET_TB + " SET " + "substatus=" + this.get_DB().dbQuote(this.O_order.st_unchk, "int", true);
					A_sql.push(det + where);
				}
			}

		return A_sql;
	}

	__destruct() {
		super.__destruct();
	}

};