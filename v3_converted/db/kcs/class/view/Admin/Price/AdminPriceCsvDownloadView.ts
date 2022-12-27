//
//価格表CSVダウンロードビュー
//
//@package Admin
//@subpackage Price
//@author kitamura
//@since 2009/09/08
//@filesource
//@uses ViewBaseHtml
//
//
//価格表CSVダウンロードビュー
//
//@package Admin
//@subpackage Price
//@author kitamura
//@since 2009/09/08
//@uses ViewBaseHtml
//

require("view/ViewBaseHtml.php");

//
//価格表ID
//
//@var integer
//@access protected
//
//
//H_list
//
//@var array
//@access protected
//
//
//A_detail
//
//@var array
//@access protected
//
//
//A_memo
//
//@var array
//@access protected
//
//
//コンストラクタ
//
//@author kitamura
//@since 2009/09/08
//
//@access public
//@return void
//
//
//画面表示
//
//@author kitamura
//@since 2009/09/08
//
//@access public
//@return void
//
//
//パラメータの検証
//
//@author kitamura
//@since 2009/09/08
//
//@access public
//@return void
//
//
//価格表の設定
//
//@author kitamura
//@since 2009/09/08
//
//@param array $H_list
//@access public
//@return void
//
//
//価格表の取得
//
//@author kitamura
//@since 2009/09/08
//
//@access public
//@return array
//
//
//価格表詳細の設定
//
//@author kitamura
//@since 2009/09/08
//
//@param array $A_detail
//@access public
//@return void
//
//
//価格表詳細の取得
//
//@author kitamura
//@since 2009/09/08
//
//@access public
//@return array
//
//
//価格表メモの設定
//
//@author kitamura
//@since 2009/09/08
//
//@param array $A_memo
//@access public
//@return void
//
//
//価格表メモの取得
//
//@author kitamura
//@since 2009/09/08
//
//@access public
//@return array
//
//
//価格表IDの取得
//
//@author kitamura
//@since 2009/09/08
//
//@access public
//@return integer
//
//
//グループIDの取得
//
//@author kitamura
//@since 2009/09/08
//
//@access public
//@return integer
//
//
//出力用価格表データの取得
//
//@author kitamura
//@since 2009/09/08
//
//@access protected
//@return mixed
//
//
//出力用価格表の取得
//
//@author kitamura
//@since 2009/09/08
//
//@access protected
//@return array
//
//
//出力用価格表詳細を取得
//
//@author kitamura
//@since 2009/09/09
//
//@access protected
//@return array
//
//
//ppid別価格表詳細を取得
//
//@author kitamura
//@since 2009/09/09
//
//@access protected
//@return array
//
//
//価格表詳細のカラム数を数える
//
//@author kitamura
//@since 2009/09/09
//
//@param mixed $H_order
//@access protected
//@return integer
//
//
//価格表詳細のカラム順序を取得
//
//@author kitamura
//@since 2009/09/09
//
//@param mixed $ppid
//@access protected
//@return array
//
class AdminPriceCsvDownloadView extends ViewBaseHtml {
	constructor(site = undefined) {
		if (true == is_null(site)) {
			site = ViewBaseHtml.SITE_ADMIN;
		}

		super({
			site: site
		});
	}

	display() //出力用データの取得
	//出力データの整形
	//出力
	{
		var A_data = this.getPriceListData();

		if (false == Array.isArray(A_data)) {
			this.errorOut(1, "\u51FA\u529B\u7528\u4FA1\u683C\u8868\u30C7\u30FC\u30BF\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093", false);
		}

		var filename = mb_convert_encoding(A_data[0][1], "sjis-win", "utf-8") + date("_YmdHi") + ".csv";
		var csv_data = "";

		for (var A_line of Object.values(A_data)) {
			for (var key in A_line) {
				var value = A_line[key];
				A_line[key] = str_replace("\"", "\"\"", value);
			}

			csv_data += mb_convert_encoding("\"" + A_line.join("\",\"") + "\"", "sjis-win", "utf-8") + "\r\n";
		}

		header("Cache-Control: private");
		header("Pragma: private");
		header("Content-type: applicatioin/octet-stream; charset=shift-jis");
		header("Content-Disposition: attachment; filename=\"" + filename + "\"");
		header("Content-Length: " + csv_data.length);
		header("Content-Transfer-Encoding: binary");
		ob_clean();
		echo(csv_data);
		throw die();
	}

	checkCGIParam() {
		if (false == (undefined !== _POST.pricelistid) || false == ctype_digit(String(_POST.pricelistid))) {
			this.errorOut(15, "pricelistid\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		this.pricelistid = +_POST.pricelistid;
	}

	setPriceList(H_list) {
		this.H_list = H_list;
	}

	getPriceList() {
		if (false == (undefined !== this.H_list)) {
			this.errorOut(11, "\u4FA1\u683C\u8868\u306E\u5024\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		return this.H_list;
	}

	setPriceDetail(A_detail) {
		this.A_detail = A_detail;
	}

	getPriceDetail() {
		if (false == (undefined !== this.A_detail)) {
			this.errorOut(11, "\u4FA1\u683C\u8868\u8A73\u7D30\u306E\u5024\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		return this.A_detail;
	}

	setPriceMemo(A_memo) {
		this.A_memo = A_memo;
	}

	getPriceMemo() {
		if (false == (undefined !== this.A_memo)) {
			this.errorOut(11, "\u4FA1\u683C\u8868\u30E1\u30E2\u306E\u5024\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		return this.A_memo;
	}

	getPriceListId() {
		return this.pricelistid;
	}

	getGroupId() {
		return this.gSess().admin_groupid;
	}

	getPriceListData() //価格表データの取得
	{
		var A_list = this.getFilteringPriceList();
		var A_detail = this.getFilteringPriceDetail();
		var A_data = undefined;

		if (A_list.length > 0 && A_detail.length > 0) {
			A_data = array_merge([A_list], A_detail);
		}

		return A_data;
	}

	getFilteringPriceList() {
		var H_list = this.getPriceList();
		return [H_list.ppid, H_list.pricename, H_list.listheader, H_list.listfooter, str_replace("-", "/", H_list.datefrom), str_replace("-", "/", H_list.dateto), true == H_list.defaultflg ? "\u3059\u308B" : "\u3057\u306A\u3044", 0 != H_list.mailstatus ? "\u3059\u308B" : "\u3057\u306A\u3044", undefined !== H_list.sortcomment ? H_list.sortcomment : "", undefined !== H_list.listcomment ? H_list.listcomment : ""];
	}

	getFilteringPriceDetail() //価格表詳細のカラム順序を取得
	{
		var H_list = this.getPriceList();
		var A_detail = this.getPriceDetail();
		var A_memo = this.getPriceMemo();
		var H_order = this.getPriceDetailColumnOrder(H_list.ppid);
		var count = this.getPriceDetailColumnCount(H_order);

		if (count < 1) {
			this.errorOut(19, "\u4FA1\u683C\u8868\u8A73\u7D30\u306E\u30AB\u30E9\u30E0\u6570\u304C1\u672A\u6E80\u3067\u3059");
		}

		var A_fil_detail = Array();

		for (var productid in A_memo) {
			var H_memo = A_memo[productid];
			A_fil_detail.push(array_merge([H_memo.productname, productid], this.getFilteringPriceDetailLine(productid, A_detail, H_order, count), [H_memo.memo]));
		}

		return A_fil_detail;
	}

	getFilteringPriceDetailLine(productid, A_detail, H_order, count) //価格表詳細の整形
	{
		var A_fil_detail = array_fill(0, count, undefined);

		for (var H_detail of Object.values(A_detail)) {
			var A_base = [H_detail.buytype1, H_detail.buytype2, H_detail.paycnt, H_detail.buyselid];
			var order_key = vsprintf("%02d-%03d-%02d-%02d", A_base);

			if (H_detail.productid != productid || false == (undefined !== H_order[order_key])) {
				continue;
			}

			var key = H_order[order_key].key;
			var downmoney = true == (undefined !== H_order[order_key].downmoney) ? H_order[order_key].downmoney : undefined;

			if (true == (undefined !== downmoney)) {
				A_fil_detail[downmoney] = H_detail.downmoney;
			}

			A_fil_detail[key] = H_detail.onepay;
		}

		return A_fil_detail;
	}

	getPriceDetailColumnCount(H_order) {
		if (false == Array.isArray(H_order) || H_order.length < 1) {
			return 0;
		}

		var max = 0;

		for (var H_value of Object.values(H_order)) {
			if (false == (undefined !== H_value.key) || false == ctype_digit(String(H_value.key))) {
				return 0;
			}

			if (max < H_value.key) {
				max = H_value.key;
			}
		}

		return ++max;
	}

	getPriceDetailColumnOrder(ppid = undefined) //printf("%02d-%03d-%02d-%02d", buytype1, buytype2, paycnt, buyselid)をキーとした配列
	{
		var A_order = {
			1: {
				"00-000-01-02": {
					key: 0
				},
				"00-000-12-02": {
					key: 2,
					downmoney: 1
				},
				"00-000-24-02": {
					key: 3,
					downmoney: 1
				},
				"00-000-36-02": {
					key: 4,
					downmoney: 1
				},
				"00-100-01-02": {
					key: 5
				},
				"00-100-12-02": {
					key: 7,
					downmoney: 6
				},
				"00-100-24-02": {
					key: 8,
					downmoney: 6
				},
				"00-100-36-02": {
					key: 9,
					downmoney: 6
				},
				"13-100-01-02": {
					key: 10
				},
				"13-100-12-02": {
					key: 12,
					downmoney: 11
				},
				"13-100-24-02": {
					key: 13,
					downmoney: 11
				},
				"13-100-36-02": {
					key: 14,
					downmoney: 11
				},
				"01-012-01-02": {
					key: 15
				},
				"01-012-12-02": {
					key: 17,
					downmoney: 16
				},
				"01-012-24-02": {
					key: 18,
					downmoney: 16
				},
				"01-012-36-02": {
					key: 19,
					downmoney: 16
				},
				"00-000-01-93": {
					key: 0
				},
				"00-000-12-93": {
					key: 2,
					downmoney: 1
				},
				"00-000-24-93": {
					key: 3,
					downmoney: 1
				},
				"00-000-36-93": {
					key: 4,
					downmoney: 1
				},
				"00-100-01-93": {
					key: 5
				},
				"00-100-12-93": {
					key: 7,
					downmoney: 6
				},
				"00-100-24-93": {
					key: 8,
					downmoney: 6
				},
				"00-100-36-93": {
					key: 9,
					downmoney: 6
				},
				"13-100-01-93": {
					key: 10
				},
				"13-100-12-93": {
					key: 12,
					downmoney: 11
				},
				"13-100-24-93": {
					key: 13,
					downmoney: 11
				},
				"13-100-36-93": {
					key: 14,
					downmoney: 11
				},
				"01-012-01-93": {
					key: 15
				},
				"01-012-12-93": {
					key: 17,
					downmoney: 16
				},
				"01-012-24-93": {
					key: 18,
					downmoney: 16
				},
				"01-012-36-93": {
					key: 19,
					downmoney: 16
				}
			},
			2: {
				"00-000-01-01": {
					key: 0
				}
			},
			3: {
				"00-000-01-08": {
					key: 0
				},
				"00-100-01-08": {
					key: 1
				},
				"01-100-01-08": {
					key: 2
				},
				"00-000-01-94": {
					key: 0
				},
				"00-100-01-94": {
					key: 1
				},
				"01-100-01-94": {
					key: 2
				}
			},
			4: {
				"00-000-01-07": {
					key: 0
				}
			},
			5: {
				"00-993-01-11": {
					key: 0
				},
				"00-994-24-11": {
					key: 1
				},
				"00-995-01-12": {
					key: 2
				},
				"00-000-01-12": {
					key: 3
				},
				"01-997-01-11": {
					key: 4
				},
				"01-998-24-11": {
					key: 5
				},
				"24-101-01-12": {
					key: 6
				},
				"24-100-01-12": {
					key: 7
				},
				"18-023-01-12": {
					key: 8
				},
				"12-017-01-12": {
					key: 9
				},
				"03-011-01-12": {
					key: 10
				}
			},
			6: {
				"00-000-01-10": {
					key: 0
				}
			},
			7: {
				"00-000-01-04": {
					key: 0
				},
				"06-009-01-04": {
					key: 1
				},
				"10-100-01-04": {
					key: 2
				}
			},
			8: {
				"00-000-01-04": {
					key: 0
				}
			},
			9: {
				"00-000-01-18": {
					key: 0
				},
				"00-000-01-51": {
					key: 1
				},
				"00-000-01-52": {
					key: 2
				},
				"00-000-01-89": {
					key: 3
				},
				"00-000-01-90": {
					key: 4
				},
				"00-000-01-91": {
					key: 5
				},
				"01-100-01-18": {
					key: 6
				},
				"01-100-01-51": {
					key: 7
				},
				"01-100-01-52": {
					key: 8
				},
				"01-100-01-89": {
					key: 9
				},
				"01-100-01-90": {
					key: 10
				},
				"01-100-01-91": {
					key: 11
				}
			},
			10: {
				"00-000-01-13": {
					key: 0
				}
			},
			11: {
				"00-000-01-19": {
					key: 0
				}
			},
			12: {
				"00-000-01-19": {
					key: 0
				}
			}
		};

		if (true == is_null(ppid)) {
			return A_order;
		} else if (true == (undefined !== A_order[ppid])) {
			return A_order[ppid];
		} else {
			return undefined;
		}
	}

};