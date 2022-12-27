//
//受注一覧View
//
//更新履歴：<br>
//2008/05/28 igarashi
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/05/28
//@filesource
//@uses OrderListViewBase
//@uses QuickFormUtil
//
//
//error_reporting(E_ALL);
//
//受注一覧View
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/05/28
//@uses OrderListViewBase
//@uses QuickFormUtil
//

require("view/Order/OrderListMenuView.php");

require("OrderUtil.php");

//
//検索フォームのデフォルトセット
//
//
//フラグ保持hash
//
//
//コンストラクタ <br>
//
//ローカル変数格納用配列宣言<br>
//
//@author igarashi
//@since 2008/03/03
//
//@access public
//@return void
//
//
//SESSIONオブジェクトを返す
//
//@author igarashi
//@since 2009/02/20
//
//@access public
//@return void
//
//
//セッションが無い時デフォルト値を入れる
//
//年月セッションが無ければ作る（デフォルトは今月）<br>
//カレント部署がセッションが無ければ作る（デフォルトは自部署）<br>
//部署の絞込条件セッションが無ければ作る（デフォルトは対象部署のみ）<br>
//表示件数セッションが無ければ作る（デフォルトは10）<br>
//ソート条件セッションが無ければ作る（デフォルトは部署降順）<br>
//検索条件がセッションに無ければ作る（デフォルトはAND）<br>
//カレントページがセッションに無ければ作る<br>
//
//@author houshiyama
//@since 2008/03/04
//
//@access private
//@return void
//
//
//前メニュー共通のCGIパラメータのチェックを行う<br>
//
//デフォルト値を入れる<br>
//
//表示年月の変更がされたら配列に入れる <br>
//部署の絞込み条件が変更されたら配列に入れる<br>
//部署選択がされたら配列に入れる <br>
//フリーワード検索が実行されたらフリーワードを配列に入れる<br>
//表示件数が変更されたら配列に入れるCookieも書き換える） <br>
//ソート条件が変更されたら配列に入れる<br>
//検索が実行されたら配列に入れる<br>
//カレントページが変更されたら配列に入れる<br>
//
//ページが指定された時以外はページを１に戻す<br>
//配列をセッションに入れる<br>
//
//@author houshiyama
//@since 2008/02/22
//
//@access public
//@return void
//@uses MtExceptReload
//
//
//注文履歴一覧の検索フォームを作成する<br>
//
//フォーム要素の配列を作成<br>
//検索フォームのオブジェクト生成<br>
//契約日用のグループの配列作成<br>
//契約日用のグループを検索フォームオブジェクトに追加<br>
//
//@author igarashi
//@since 2008/06/24
//
//@param array $H_sess（CGIパラメータ）
//@param array $A_post（部署一覧）
//@param object $O_manage
//@param object $O_model
//@access public
//@return void
//@uses O_OrderUtil
//@uses QuickFormUtil
//
//
//検索フォームのdefault値をセット
//
//@author igarashi
//@since 2008/06/27
//
//@access public
//@return none
//
//
//検索フォームのdefault値を生成
//
//@author igarashi
//@since 2008/06/27
//
//@access public
//@return hash
//
// 初回表示時の検索条件をセット
//
// @author igarashi
// @since 2008/07/08
//
// @access public
// @return hash
//
//checkboxの検索フォームを作成
//
//@author igarashi
//@since 2008/06/24
//
//@access public
//@return array
//
//
//検索フォームのルール作成
//
//@author igarashi
//@since 2008/04/08
//
//@access public
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author miyazawa
//@since 2008/05/28
//
//@access public
//@return array
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author igarashi
//@since 2008/06/23
//
//@access public
//@return void
//
//
//配下のセッション消し
//
//@author igarashi
//@since 2008/06/23
//
//@access public
//@return void
//
//
//パラメータチェック <br>
//
//@author houshiyama
//@since 2008/03/18
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//検索条件のルールチェック
//
// @author igarashi
// @since 2008/07/09
//
// @param $H_sess
// @access public
//
// @return none
//
//最低限必要なセッション情報が無ければエラー表示
//
//@author igarashi
//@since 2008/07/09
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//where句をdownload用に保存しておく
//
//@author igarashi
//@since 2008/10/13
//
//
//
//Smartyを用いた画面表示<br>
//
//QuickFormとSmartyを合体<br>
//各データをSmartyにassign<br>
//各ページ固有の表示処理<br>
//Smartyで画面表示<br>
//
//@author miyazawa
//@since 2008/05/29
//
//@param array $H_sesstion（CGIパラメータ）
//@param array $A_data（一覧データ）
//@param array $A_auth（権限一覧）
//@param array $O_order（関数集オブジェクト）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//public function displaySmarty(array $H_sess, array $A_data){
//
//各ページ固有のsetDefaultSession
//
//@author houshiyama
//@since 2008/03/10
//
//@access protected
//@return void
//
//
//各ページ固有のdisplaySmarty
//
//@author miyazawa
//@since 2008/05/29
//
//@protected
//@access protected
//@return void
//
//
//グローバルセッション以外を消す<br>
//基底のを呼んでるだけ。
//
//
//
//
//
//getSearchMode
//
//@author web
//@since 2013/01/04
//
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
class ShopOrderMenuView extends OrderListMenuView {
	static INI_NAME = "order_by_category";

	constructor(H_param: {} | any[] = Array()) //統括販売店フラグ　trueなら統括販売店
	//検索動作モード　trueなら「今日やるボタン」
	{
		H_param.site = ViewBaseHTML.SITE_SHOP;
		super(H_param);
		this.O_order = OrderUtil.singleton();
		this.H_flg.unify = false;
		this.H_flg.expect = false;
	}

	get_O_Sess() {
		return this.O_Sess;
	}

	setDefaultSession() //表示件数がセッションに無ければ作る
	{
		if (false == (undefined !== this.H_Dir.limit)) //クッキーに表示件数があればそれを使う
			{
				if (true == (undefined !== _COOKIE.shoporder_limit)) {
					this.H_Dir.limit = _COOKIE.shoporder_limit;
				} else {
					this.H_Dir.limit = 30;
				}
			}

		if (undefined !== this.H_Dir.sort == false) {
			this.H_Dir.sort = "0|a";
		}

		if (undefined !== this.H_Dir.offset == false) {
			this.H_Dir.offset = 1;
		}

		if (false == (undefined !== this.H_Local.post)) {
			this.H_Local.post = this.H_def_form;
		}

		this.setDefaultSessionPeculiar();
	}

	checkCGIParam() //検索が実行された時
	//getパラメータは消す
	{
		var A_sortcol = ["fromy", "toy", "seldate", "trans", "status", "ordertype", "carid", "buyselid", "contractor", "orderid", "telno", "sctcode", "pref", "deliverydate_type", "send_deliverydate_flg"];
		this.setDefaultSession();
		var sess = this.getLocalSession();

		if (undefined !== _POST.search == true) {
			for (var val of Object.values(A_sortcol)) {
				if (true == (undefined !== _POST[val])) {
					if ("telno" == val) {
						var telno = _POST.telno.replace(/[^0-9a-zA-Z]/g, "");

						this.H_Dir[val] = telno;
					} else if ("orderid" == val) {
						var orderid = _POST.orderid.replace(/[^0-9]/g, "");

						this.H_Dir[val] = orderid;
					} else {
						this.H_Dir[val] = _POST[val];
					}
				} else {
					this.H_Dir[val] = "";
				}
			}

			if ("" != this.H_Dir.fromy.Y && "" != this.H_Dir.fromy.m && "" != this.H_Dir.fromy.d) {
				if (true == checkdate(this.H_Dir.fromy.m, this.H_Dir.fromy.d, this.H_Dir.fromy.Y)) {
					this.H_Dir.dateflg = "from";
				} else {
					this.H_Dir.dateflg = "err";
				}
			}

			if ("" != this.H_Dir.toy.Y && "" != this.H_Dir.toy.m && "" != this.H_Dir.toy.d) {
				if ("err" != this.H_Dir.dateflg) {
					if (true == checkdate(this.H_Dir.toy.m, this.H_Dir.toy.d, this.H_Dir.toy.Y)) {
						if ("from" == this.H_Dir.dateflg) {
							this.H_Dir.dateflg = "double";
						} else {
							this.H_Dir.dateflg = "to";
						}
					} else {
						this.H_Dir.dateflg = "err";
					}
				}
			}

			this.H_Dir.post = "search";
			delete this.H_Dir.expectsub;
			this.H_Dir.searchLight = false;
		}

		if (true == (undefined !== _POST.view) && "" != _POST.view) {
			if (true == (undefined !== _POST.limit) && true == is_numeric(_POST.limit) && _POST.limit > 0) //クッキーセット
				{
					this.H_Dir.limit = _POST.limit;
					setcookie("shoporder_limit", _POST.limit, mktime(0, 0, 0, 12, 31, 2020));
				} else {
				this.H_Dir.limit = 30;
				this.O_Sess.setSelfAll(this.H_Local);
				MtExceptReload.raise(undefined);
			}
		} else if (false == (undefined !== _POST.limit) || "" == _POST.limit) //初回表示でpostに値が入るとdefault値が入らない
			{
				if (0 < _POST.length) {
					_POST.limit = this.H_Dir.limit;
				}
			}

		if (undefined !== _GET.s == true) {
			this.H_Dir.sort = _GET.s;
		} else if (true == (undefined !== sess.SELF.sort)) {
			this.H_Dir.sort = sess.sort;
		}

		if (true == (undefined !== _POST.expectsub) && "" != _POST.expectsub) {
			this.H_Dir.expectsub = _POST.expectsub;
			delete this.H_Dir.post;
			this.H_Dir.searchLight = false;
		}

		if ("" != _POST.expectY && "" != _POST.expectm && "" != _POST.expectd) {
			this.H_Dir.expectexec.Y = _POST.expectY;
			this.H_Dir.expectexec.m = _POST.expectm;
			this.H_Dir.expectexec.d = _POST.expectd;
			this.H_Dir.expectexec.dotoday = _POST.dotoday;
		}

		if (undefined !== _GET.p == true) {
			this.H_Dir.offset = _GET.p;
		}

		if ((_POST.length > 0 || _GET.length > 0) && undefined !== _GET.p == false) {
			this.H_Dir.offset = 1;
		}

		if (undefined !== _GET.mode && "light" == _GET.mode) {
			this.H_Dir.searchLight = true;
		}

		this.O_Sess.setPub(ShopOrderMenuView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);

		if (_GET.length > 0) {
			MtExceptReload.raise(undefined);
		}
	}

	makeSearchForm(H_box, H_select) //DBから取って来れない初期データを作る
	//フォーム要素の配列作成
	//統括部署なら部門コード検索させる
	//k76
	//k76
	//クイックフォームオブジェクト生成
	{
		var A_baseday = {
			ansdate: ["\u53D7\u6CE8\u65E5"],
			deliverydate: ["\u7D0D\u54C1\u65E5"],
			expectdate: ["\u51E6\u7406\u65E5"]
		};
		var A_form = [{
			name: "expectexec",
			label: "\u5E74",
			inputtype: "date",
			data: this.O_order.getDateFormat(1, 1)
		}, {
			name: "expectsub",
			label: "\u691C\u7D22",
			inputtype: "button",
			options: {
				id: "search",
				onClick: "fwdExpectSearch()"
			}
		}, {
			name: "fromy",
			label: "\u5E74",
			inputtype: "date",
			data: this.O_order.getDateFormat(2, 1)
		}, {
			name: "toy",
			label: "\u5E74",
			inputtype: "date",
			data: this.O_order.getDateFormat(2, 1)
		}, {
			name: "seldate",
			label: "",
			inputtype: "radio",
			data: A_baseday,
			options: {
				id: "seldate"
			}
		}, {
			name: "trans",
			label: "",
			inputtype: "select",
			data: H_select.trans
		}, {
			name: "contractor",
			label: "\u767A\u6CE8\u5143",
			inputtype: "text",
			options: {
				size: "50",
				maxlength: "80"
			}
		}, {
			name: "orderid",
			label: "\u53D7\u4ED8\u756A\u53F7",
			inputtype: "text",
			options: {
				size: "20",
				maxlength: "12"
			}
		}, {
			name: "telno",
			label: "\u96FB\u8A71\u756A\u53F7",
			inputtype: "text",
			options: {
				size: "30",
				maxlength: "18"
			}
		}, {
			name: "statonbtn",
			label: "\u5168\u3066\u9078\u629E",
			inputtype: "button",
			options: {
				onClick: "onCheckStatusForm(" + H_box.status.length + ")"
			}
		}, {
			name: "statoffbtn",
			label: "\u9078\u629E\u89E3\u9664",
			inputtype: "button",
			options: {
				onClick: "offCheckStatusForm(" + H_box.status.length + ")"
			}
		}, {
			name: "ordertypeonbtn",
			label: "\u5168\u3066\u9078\u629E",
			inputtype: "button",
			options: {
				onClick: "onCheckTypeForm(" + H_box.ordertype.length + ")"
			}
		}, {
			name: "ordertypeoffbtn",
			label: "\u9078\u629E\u89E3\u9664",
			inputtype: "button",
			options: {
				onClick: "offCheckTypeForm(" + H_box.ordertype.length + ")"
			}
		}, {
			name: "caronbtn",
			label: "\u5168\u3066\u9078\u629E",
			inputtype: "button",
			options: {
				onClick: "onCheckCarrierForm(" + H_box.carid.length + ")"
			}
		}, {
			name: "caroffbtn",
			label: "\u9078\u629E\u89E3\u9664",
			inputtype: "button",
			options: {
				onClick: "offCheckCarrierForm(" + H_box.carid.length + ")"
			}
		}, {
			name: "deliverydate_typeonbtn",
			label: "\u5168\u3066\u9078\u629E",
			inputtype: "button",
			options: {
				onClick: "onCheckDeliveryDateTypeForm(" + H_box.deliverydate_type.length + ")"
			}
		}, {
			name: "deliverydate_typeoffbtn",
			label: "\u9078\u629E\u89E3\u9664",
			inputtype: "button",
			options: {
				onClick: "offCheckDeliveryDateTypeForm(" + H_box.deliverydate_type.length + ")"
			}
		}, {
			name: "send_deliverydate_flgonbtn",
			label: "\u5168\u3066\u9078\u629E",
			inputtype: "button",
			options: {
				onClick: "onCheckSendDeliveryDateFlgForm(" + H_box.send_deliverydate_flg.length + ")"
			}
		}, {
			name: "send_deliverydate_flgoffbtn",
			label: "\u9078\u629E\u89E3\u9664",
			inputtype: "button",
			options: {
				onClick: "offCheckSendDeliveryDateFlgForm(" + H_box.send_deliverydate_flg.length + ")"
			}
		}, {
			name: "search",
			label: "\u691C\u7D22",
			inputtype: "submit",
			options: {
				id: "search",
				onClick: "fwdNormalSearch()"
			}
		}, {
			name: "statchng",
			label: "\u72B6\u614B\u306E\u4E00\u62EC\u66F4\u65B0",
			inputtype: "button",
			options: {
				onclick: "checkForward(\"changestatus.php\")"
			}
		}, {
			name: "lumptrans",
			label: "\u632F\u66FF",
			inputtype: "button",
			options: {
				onclick: "checkForward(\"transfer.php\")"
			}
		}, {
			name: "transcancel",
			label: "\u632F\u66FF\u306E\u53D6\u308A\u6D88\u3057",
			inputtype: "button",
			options: {
				onclick: "checkForward(\"canceltransfer.php\")"
			}
		}, {
			name: "view",
			label: "\u8868\u793A",
			inputtype: "button",
			options: {
				onclick: "fwdLimitSearch()"
			}
		}, {
			name: "limit",
			label: "",
			inputtype: "text",
			options: {
				size: "2",
				maxlength: "3"
			}
		}, {
			name: "dotoday",
			label: "",
			inputtype: "select",
			data: {
				1: "\u7D0D\u54C1\u4E88\u5B9A\u65E5",
				2: "\u51E6\u7406\u4E88\u5B9A\u65E5"
			}
		}, {
			name: "pref",
			label: "",
			inputtype: "select",
			data: H_select.pref
		}];

		if (true == H_box.unify) //統括部門用が増えたら足して
			{
				var A_unify = [{
					name: "sctcode",
					label: "",
					inputtype: "select",
					data: H_select.section
				}];
				A_form = array_merge(A_form, A_unify);
			}

		var A_status = this.makeSearchFormCheckBox(H_box.status, "status", "forshop");
		var A_car = this.makeSearchFormCheckBox(H_box.carid, "carid", "name");
		var A_type = this.makeSearchFormCheckBox(H_box.ordertype, "ordertype", "name");
		var A_buy = this.makeSearchFormCheckBox(H_box.buyselid, "buyselid", "name");
		var A_rec = this.makeSearchFormCheckBox(H_box.receipt, "receipt", "name");
		var A_deliverydate_type = this.makeSearchFormCheckBox(H_box.deliverydate_type, "deliverydate_type", "name");
		var A_send_deliverydate_flg = this.makeSearchFormCheckBox(H_box.send_deliverydate_flg, "send_deliverydate_flg", "name");
		A_form = array_merge(A_form, A_status, A_car, A_type, A_buy, A_rec, A_deliverydate_type, A_send_deliverydate_flg);
		this.H_View.O_SearchFormUtil = new QuickFormUtil("searchform");
		this.H_View.O_SearchFormUtil.setFormElement(A_form);
		this.O_SearchForm = this.H_View.O_SearchFormUtil.makeFormObject();
	}

	setSearchFormDefault(H_sess, H_date) //今日やるボタンの日付が指定されていたら引き継ぐ
	{
		if (true == (undefined !== H_sess.expectsub)) {
			H_date.y = H_sess.expectexec.Y;
			H_date.m = H_sess.expectexec.m;
			H_date.d = H_sess.expectexec.d;
			H_date.dotoday = H_sess.dotoday;
		}

		if (undefined == H_sess.post.post) {
			this.setDefaultSearch(H_date);
		} else {
			this.H_def_form = H_sess.post;
		}

		this.H_View.O_SearchFormUtil.setDefaultsWrapper(this.H_def_form);
	}

	setDefaultSearch(H_date) {
		this.H_def_form = {
			expectexec: {
				Y: H_date.y,
				m: H_date.m,
				d: H_date.d
			},
			seldate: "ansdate",
			"status[0]": "1",
			"status[1]": "1",
			"status[2]": "1",
			"status[3]": "1",
			"status[4]": "1",
			"status[11]": "1",
			"status[15]": "1",
			"ordertype[0]": "1",
			"ordertype[1]": "1",
			"ordertype[2]": "1",
			"ordertype[3]": "1",
			"ordertype[4]": "1",
			"ordertype[5]": "1",
			"ordertype[6]": "1",
			"ordertype[7]": "1",
			"ordertype[8]": "1",
			"ordertype[9]": "1",
			"ordertype[10]": "1",
			"ordertype[11]": "1",
			"ordertype[12]": "1",
			"ordertype[13]": "1",
			"ordertype[14]": "1",
			"carid[0]": "1",
			"carid[1]": "1",
			"carid[2]": "1",
			"carid[3]": "1",
			"carid[4]": "1",
			"carid[5]": "1",
			"carid[6]": "1",
			"buyselid[0]": "1",
			"buyselid[1]": "1",
			"buyselid[2]": "1",
			"receipt[0]": "1",
			"receipt[1]": "1",
			"receipt[2]": "1",
			sctcode: "0",
			limit: this.H_Dir.limit
		};
	}

	setDefaultSearchSession(H_sess, H_date) //$H_sess["deliverydate_type"] = array("1", "1", "1");
	//$H_sess["send_deliverydate_flg"] = array("1","1");
	{
		if (undefined != H_sess.post) {
			return H_sess;
		}

		H_sess.expectexec = {
			Y: H_date.y,
			m: H_date.m,
			d: H_date.d
		};
		H_sess.seldate = "ansdate";
		var H_status = [0, 1, 2, 3, 4, 11, 15];

		for (var val of Object.values(H_status)) {
			H_sess.status[val] = "1";
		}

		H_sess.ordertype = ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"];
		H_sess.carid = ["1", "1", "1", "1", "1", "1", "1"];
		H_sess.buyselid = ["1", "1", "1"];
		H_sess.receipt = ["1", "1", "1"];
		return H_sess;
	}

	makeSearchFormCheckBox(H_box, name, label) {
		var idx = 0;
		var A_form = Array();

		for (var val of Object.values(H_box)) {
			A_form[idx] = {
				name: name + "[" + idx + "]",
				label: val[label],
				inputtype: "checkbox",
				options: {
					id: name + "[" + idx + "]"
				}
			};
			idx++;
		}

		return A_form;
	}

	makeSearchRule(H_sess) {
		if (true == (undefined !== H_sess.expectexec)) {
			this.H_flg.expect = true;
		}
	}

	makePankuzuLinkHash() {
		var H_link = {
			"": "\u53D7\u6CE8\u4E00\u89A7"
		};
		return H_link;
	}

	getHeaderJS() {
		var str = "<script language=\"Javascript\" src=\"/js/Shop/Order/order.js\"></script>";
		return str;
	}

	clearUnderSession() {
		this.clearLastForm();
		var A_exc = [ShopOrderMenuView.PUB, "/Shop/Order/order_detail.php"];
		this.O_Sess.clearSessionExcludeListPub(A_exc);
	}

	checkParamError(H_sess, H_g_sess) //注文履歴基底のパラメータチェック
	{
		this.checkBaseParamError(H_sess, H_g_sess);
	}

	checkSearchRule(H_sess) //電話番号の入力は3桁以上
	{
		if (3 > H_sess.telno.length) {
			this.H_flg.telno = false;
		}
	}

	checkBaseParamError(H_sess, H_g_sess) //最低限必要なセッションが無ければエラー
	//必須条件が判明するまでスルー　shopmemid,shopid,権限は必須？
	//		if((false == isset($H_g_sess["shopid"])) || (false == isset($H_g_sess["userid"]))){
	//			$this->errorOut( 8, "sessionが無い", false );
	//			exit();
	//		}
	{}

	setSearchWhere(H_sql) {
		var temp = this.getLocalSession();
		temp[ShopOrderMenuView.PUB].down.where = H_sql.where;
		temp[ShopOrderMenuView.PUB].down.orderby = H_sql.orderby;
		this.O_Sess.setPub(ShopOrderMenuView.PUB, temp[ShopOrderMenuView.PUB]);
	}

	displaySmarty(H_g_sess, H_data, H_flg, limit, cnt, pagelink, pankuzu, H_shoplist, H_info) //QuickFormとSmartyの合体
	//assaign
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_SearchForm.accept(O_renderer);
		var a = MtSetting.singleton();

		try {
			a.loadConfig(ShopOrderMenuView.INI_NAME);
			this.get_Smarty().assign("division", true);
		} catch (e) {
			this.get_Smarty().assign("division", false);
		}

		this.get_Smarty().assign("shop_person", H_g_sess.shopname + " " + H_g_sess.personname);
		this.get_Smarty().assign("shop_name", H_g_sess.shopname);
		this.get_Smarty().assign("shop_submenu", pankuzu);
		this.get_Smarty().assign("title", "\u53D7\u6CE8\u4E00\u89A7");
		this.get_Smarty().assign("current_script", _SERVER.PHP_SELF);
		this.get_Smarty().assign("page_link", pagelink);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("H_data", H_data);
		this.get_Smarty().assign("datacnt", cnt);
		this.get_Smarty().assign("limit", limit);
		this.get_Smarty().assign("unify", H_flg.unify);
		this.get_Smarty().assign("dlauth", H_flg.dlauth);
		this.get_Smarty().assign("myshopid", H_g_sess.shopid);
		this.get_Smarty().assign("viewlimit", this.H_Dir.limit);
		this.get_Smarty().assign("H_carrier", H_info.carrier);
		this.get_Smarty().assign("H_status", H_info.status);
		this.get_Smarty().assign("H_tr_from", H_info.fromshop);
		this.get_Smarty().assign("H_tr_to", H_info.toshop);
		this.get_Smarty().assign("H_chargecnt", H_info.chargecnt);

		if (_SERVER.REMOTE_ADDR == "61.192.221.92" || _SERVER.REMOTE_ADDR == "192.168.99.57") {
			this.get_Smarty().assign("hiddenLink", "on");
		}

		this.get_Smarty().display(this.getDefaultTemplate());
	}

	setDefaultSessionPeculiar() {}

	displaySmartyPeculiar(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], H_g_sess: {} | any[]) {}

	clearSessionMenu() {
		this.O_Sess.clearSessionMenu();
	}

	getSearchMode() {
		return this.H_Dir.searchLight;
	}

	__destruct() {
		super.__destruct();
	}

};