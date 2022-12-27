//
//注文履歴一覧のView
//
//更新履歴：<br>
//2008/05/28 宮澤龍彦 作成
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
//注文一覧のView
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/05/28
//@uses OrderListViewBase
//@uses QuickFormUtil
//

require("view/Order/OrderListViewBase.php");

//
//検索フォームオブジェクト
//
//@var mixed
//@access private
//
//
//コンストラクタ <br>
//
//ローカル変数格納用配列宣言<br>
//
//@author houshiyama
//@since 2008/03/03
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
//CGIパラメータのチェックを行う<br>
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
//@author miyazawa
//@since 2008/05/30
//
//@param array $H_sess（CGIパラメータ）
//@param array $A_post（部署一覧）
//@param object $O_manage
//@param object $O_model
//@access public
//@return void
//@uses O_ManagementUtil
//@uses QuickFormUtil
//
//
//getDivisionAddModFormElement
//
//@author web
//@since 2013/10/04
//
//@access public
//@return void
//
//
//checkDivisionOfAuth
//
//@author web
//@since 2013/10/04
//
//@param mixed $model
//@access public
//@return void
//
//
//検索フォームのルール作成
//
//@author houshiyama
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
//@author miyazawa
//@since 2008/05/28
//
//@access public
//@return void
//
//
//配下のセッション消し
//
//@author houshiyama
//@since 2008/03/14
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
//
//ヘッダーフォームのデフォルト値を作成
//
//@author houshiyama
//@since 2008/03/06
//
//@param mixed $H_sess
//@access protected
//@return array
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
//@param array $H_sess（CGIパラメータ）
//@param array $A_data（一覧データ）
//@param array $A_auth（権限一覧）
//@param array $H_g_sess
//@param array $H_search（検索条件）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
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
//各ページ（管理）固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/03/03
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
//ダウンロード用にorderidのリストをディレクトリセッションに登録する <br>
//
//@author miyazawa
//@since 2008/11/14
//
//@param array $A_orderid
//@access public
//@return void
//
//
//セッションに英語化のtrue/falseを入れる
//
//@author miyazawa
//@since 2009/03/04
//
//@param boolean $eng
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
class OrderListMenuView extends OrderListViewBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.fncs = ["fnc_fjp_co", "fnc_tel_division"];
	}

	setDefaultSession() //年月セッションが無ければ作る
	{
		if (undefined !== this.H_Dir.search.cym == false) //$this->H_Dir["search"]["cym"] = date("Ym");
			//年月バーのデフォルトは「すべて」
			{
				this.H_Dir.search.cym = "all";
			}

		if (undefined !== this.H_Dir.search.current_postid == false) {
			this.H_Dir.search.current_postid = _SESSION.postid;
		}

		if (undefined !== this.H_Dir.search.posttarget == false) {
			this.H_Dir.search.posttarget = 0;
		}

		if (undefined !== this.H_Dir.search.limit == false) //クッキーに表示件数があればそれを使う
			{
				if (undefined !== _COOKIE.order_limit == true) {
					this.H_Dir.search.limit = _COOKIE.order_limit;
				} else {
					this.H_Dir.search.limit = 10;
				}
			}

		if (undefined !== this.H_Dir.search.sort == false) {
			this.H_Dir.search.sort = "0|a";
		}

		if (undefined !== this.H_Dir.search.offset == false) {
			this.H_Dir.search.offset = 1;
		}

		this.H_Local.receiptflg = undefined;
		this.setDefaultSessionPeculiar();
	}

	checkCGIParam() //年月の変更が実行された時
	//ページ変更以外はページを１に戻す
	//getパラメータは消す
	{
		this.setDefaultSession();

		if (undefined !== _GET.ym == true && (is_numeric(_GET.ym) == true || _GET.ym == "all")) {
			this.H_Dir.search.cym = _GET.ym;
		}

		if (undefined !== _GET.pid == true && is_numeric(_GET.pid) == true) {
			this.H_Dir.search.current_postid = _GET.pid;
		}

		if (undefined !== _POST.viewchange == true) {
			this.H_Dir.search.posttarget = _POST.posttarget;
		}

		if (undefined !== _POST.freesearch == true) {
			this.H_Dir.search.freeword = _POST.freeword;
		}

		if (undefined !== _POST.limit == true) {
			if (is_numeric(_POST.limit) == true && _POST.limit > 0) //クッキーセット
				{
					this.H_Dir.search.limit = _POST.limit;
					setcookie("order_limit", _POST.limit, mktime(0, 0, 0, 12, 31, 2020));
				} else {
				this.H_Dir.search.limit = 10;
				this.O_Sess.setPub(OrderListMenuView.PUB, this.H_Dir);
				MtExceptReload.raise(undefined);
			}
		}

		if (undefined !== _GET.s == true) {
			this.H_Dir.search.sort = _GET.s;
		}

		if (undefined !== _GET.p == true) {
			this.H_Dir.search.offset = _GET.p;
		}

		if (undefined !== _POST.search == true) {
			if (undefined !== _POST == true && _POST.length > 0) {
				this.H_Dir.search.post = _POST;
			}
		}

		if (undefined !== _POST.orderregist == true) {
			if (undefined !== _POST == true && _POST.length > 0) {
				this.H_Dir.search.post = _POST;
			}
		}

		if (undefined !== this.H_Dir.search.post.status == false && undefined !== this.H_Dir.search.post.carrier == false && undefined !== this.H_Dir.search.post.ordertype == false) //S179 注文履歴検索　デフォ値設定 20141218date
			{
				this.H_Dir.search.post.status = {
					0: "5,10",
					1: "7,20",
					4: "40,50,60,70,75,80,90,100,110,120,130,140,150,160,170"
				};
				delete this.H_Dir.search.post.search;
				this.H_Dir.search.post.carrier = {
					"0": "1",
					"1": "3",
					"2": "4",
					"3": "2",
					"4": "15",
					"6": "0"
				};
				this.H_Dir.search.post.ordertype = {
					"0": "N",
					"1": "Nmnp",
					"2": "C",
					"3": "S",
					"4": "Ppl",
					"5": "Pop",
					"6": "Pdc",
					"7": "D",
					"8": "A",
					"9": "M",
					"10": "B",
					"11": "Tpc,Tcp"
				};
			}

		if (true == _POST.receiptflg) {
			this.H_Local.receipt = _POST;
		}

		this.checkCGIParamPeculiar();

		if ((_POST.length > 0 || _GET.length > 0) && undefined !== this.H_Dir.search.offset == false) {
			this.H_Dir.search.offset = 1;
		}

		this.O_Sess.setPub(OrderListMenuView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);

		if (_GET.length > 0) {
			MtExceptReload.raise(undefined);
		}
	}

	makeSearchForm(H_sess: {} | any[], A_post: {} | any[], O_order: OrderUtil, O_model) //英語化権限 20090210miya
	//日付検索の最小年と最大年を調べる。
	//フォーム要素の配列作成
	{
		if (true == this.H_Dir.eng) {
			var chargerstr = "Requestor";
			var ordernostr = "Reception no.";
			var telnostr = "Mobile Number";
			var searchstr = "Search";
			var allcheckstr = "Select all";
			var alluncheckstr = "Clear";
			var registstr = "\u96FB\u8A71\u7BA1\u7406\u306B\u53CD\u6620\u3059\u308B";
		} else {
			chargerstr = "\u5165\u529B\u62C5\u5F53\u8005";
			ordernostr = "\u53D7\u4ED8\u756A\u53F7";
			telnostr = "\u643A\u5E2F\u756A\u53F7";
			searchstr = "\u3053 \u306E \u6761 \u4EF6 \u3067 \u691C \u7D22 \u3059 \u308B";
			allcheckstr = "\u5168\u3066\u9078\u629E";
			alluncheckstr = "\u9078\u629E\u89E3\u9664";
			registstr = "\u96FB \u8A71 \u7BA1 \u7406 \u306B \u53CD \u6620 \u3059 \u308B";
		}

		var year = date("Y");
		var month = date("m");
		var minYear = month == 12 ? year - 1 : year - 2;
		var maxYear = year;
		var A_formelement = [{
			name: "charger",
			label: chargerstr,
			inputtype: "text",
			options: {
				size: "45"
			}
		}, {
			name: "orderno",
			label: ordernostr,
			inputtype: "text",
			options: {
				size: "20"
			}
		}, {
			name: "telno",
			label: telnostr,
			inputtype: "text",
			options: {
				size: "20",
				maxlength: "20"
			}
		}, {
			name: "search",
			label: searchstr,
			inputtype: "submit"
		}, {
			name: "status_check",
			label: allcheckstr,
			inputtype: "button",
			options: {
				onClick: "javascript:setCheckBox(/status/,true)"
			}
		}, {
			name: "status_uncheck",
			label: alluncheckstr,
			inputtype: "button",
			options: {
				onClick: "javascript:setCheckBox(/status/,false)"
			}
		}, {
			name: "carrier_check",
			label: allcheckstr,
			inputtype: "button",
			options: {
				onClick: "javascript:setCheckBox(/carrier/,true)"
			}
		}, {
			name: "carrier_uncheck",
			label: alluncheckstr,
			inputtype: "button",
			options: {
				onClick: "javascript:setCheckBox(/carrier/,false)"
			}
		}, {
			name: "ordertype_check",
			label: allcheckstr,
			inputtype: "button",
			options: {
				onClick: "javascript:setCheckBox(/ordertype/,true)"
			}
		}, {
			name: "ordertype_uncheck",
			label: alluncheckstr,
			inputtype: "button",
			options: {
				onClick: "javascript:setCheckBox(/ordertype/,false)"
			}
		}, {
			name: "orderregist",
			label: registstr,
			inputtype: "submit"
		}, {
			name: "fromdate",
			inputtype: "date",
			data: {
				minYear: minYear,
				maxYear: maxYear,
				format: "Y \u5E74 m \u6708 d \u65E5",
				language: "ja",
				addEmptyOption: true,
				emptyOptionValue: "",
				emptyOptionText: "--"
			}
		}, {
			name: "todate",
			inputtype: "date",
			data: {
				minYear: minYear,
				maxYear: maxYear,
				format: "Y \u5E74 m \u6708 d \u65E5",
				addEmptyOption: true,
				emptyOptionValue: "",
				emptyOptionText: "--"
			}
		}];

		if (this.checkDivisionOfAuth(O_model)) {
			A_formelement = array_merge(A_formelement, this.getDivisionAddModFormElement());
			this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		}

		this.H_View.O_SearchFormUtil = new QuickFormUtil("searchform");
		this.H_View.O_SearchFormUtil.setFormElement(A_formelement);
		this.O_SearchForm = this.H_View.O_SearchFormUtil.makeFormObject();
	}

	getDivisionAddModFormElement() {
		var A_formelement = [{
			name: "division",
			label: "\u7528\u9014",
			inputtype: "select",
			data: {
				"": "\u3059\u3079\u3066\u8868\u793A",
				"1": "\u696D\u52D9\u7528",
				"2": "\u30C7\u30E2\u7528"
			},
			options: {
				id: "division"
			}
		}];
		return A_formelement;
	}

	checkDivisionOfAuth(model) {
		for (var fnc of Object.values(this.fncs)) {
			if (!(-1 !== model.A_Auth.indexOf(fnc))) {
				return false;
			}
		}

		return true;
	}

	makeSearchRule() //文言の英語対応はしてない
	//プルダウン
	{
		var H_rules = Array();
		H_rules.push({
			name: "fromdate",
			mess: "\u7533\u8ACB\u65E5from\u306E\u66F8\u5F0F\u304C\u9593\u9055\u3063\u3066\u3044\u307E\u3059",
			type: "QRCheckDate",
			format: undefined,
			validation: "client",
			reset: false,
			force: false
		});
		H_rules.push({
			name: "todate",
			mess: "\u7533\u8ACB\u65E5to\u306E\u66F8\u5F0F\u304C\u9593\u9055\u3063\u3066\u3044\u307E\u3059",
			type: "QRCheckDate",
			format: undefined,
			validation: "client",
			reset: false,
			force: false
		});
		H_rules.push({
			name: "telno",
			mess: "\u96FB\u8A71\u756A\u53F7\u691C\u7D22\u306F\u534A\u89D2\u82F1\u6570\u5B57\u306E\u307F\u6709\u52B9\u3067\u3059\u3002\u8A18\u53F7\u3067\u306E\u691C\u7D22\u306F\u3067\u304D\u307E\u305B\u3093",
			type: "QRalnumTel",
			format: undefined,
			validation: "client",
			reset: false,
			force: false
		});
		H_rules.push({
			name: "telno",
			mess: "\u96FB\u8A71\u756A\u53F7\u306E\u691C\u7D22\u306B\u306F3\u6841\u4EE5\u4E0A\u306E\u5165\u529B\u304C\u5FC5\u8981\u3067\u3059",
			type: "QRSearchTelLength",
			format: undefined,
			validation: "client",
			reset: false,
			force: false
		});

		if (H_rules.length > 0) //言語対応
			//登録
			{
				if ("ENG" == _SESSION.language) {
					this.H_View.O_SearchFormUtil.setDefaultWarningNoteEng();
				} else {
					this.H_View.O_SearchFormUtil.setDefaultWarningNote();
				}

				this.H_View.O_SearchFormUtil.makeFormRule(H_rules);
			}
	}

	makePankuzuLinkHash() //英語化権限 20090210miya
	{
		if (true == this.H_Dir.eng) {
			var H_link = {
				"": "Order History"
			};
		} else {
			H_link = {
				"": "\u6CE8\u6587\u5C65\u6B74"
			};
		}

		return H_link;
	}

	getHeaderJS() {
		var str = "<script language=\"Javascript\" src=\"/js/Order/order.js\"></script>";
		return str;
	}

	clearUnderSession() {
		this.clearLastForm();
		var A_exc = ["/MTOrderList/order_detail.php", "/MTOrder"];
		this.O_Sess.clearSessionListPub(A_exc);
	}

	checkParamError(H_sess, H_g_sess) //注文履歴基底のパラメータチェック
	{
		this.checkBaseParamError(H_sess, H_g_sess);
	}

	makeDefaultValue(H_sess: {} | any[]) {
		var H_default = Array();
		H_default = H_sess[OrderListMenuView.PUB];
		H_default.limit = H_sess.SELF.limit;
		return H_default;
	}

	displaySmarty(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], H_g_sess: {} | any[], H_search: {} | any[] = Array(), H_order: {} | any[]) //QuickFormとSmartyの合体
	//assaign
	//$this->get_Smarty()->assign( "monthly_bar", $this->H_View["monthly_bar"] );		年月バー廃止になりました S179注文履歴検索
	//ダウンロード権限があるかどうか
	//ダウンロードのシリアル番号
	//ページ固有の表示処理
	//$this->displaySmartyPeculiar( $H_sess, $A_data, $A_auth, $O_manage );
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_SearchForm.accept(O_renderer);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("current_script", _SERVER.PHP_SELF);
		this.get_Smarty().assign("H_sess", H_sess);
		this.get_Smarty().assign("page_link", this.H_View.page_link);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("list_cnt", A_data[0]);
		this.get_Smarty().assign("H_list", A_data[1]);
		this.get_Smarty().assign("cntall", A_data[1].length);
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("A_auth", A_auth);
		this.get_Smarty().assign("H_search", H_search);
		this.get_Smarty().assign("limit", this.H_Dir.search.limit);
		this.get_Smarty().assign("registbtn", H_order.disp);

		if (undefined !== H_order.message) {
			this.get_Smarty().assign("registmsg", H_order.message);
		}

		if ("" != H_sess.H_carcnt && true == Array.isArray(H_sess.H_carcnt)) //スマートフォンはその他に統合 S189 20150203
			//ドコモ
			//au
			//WILLCOM
			//vodafone
			//emobile
			//$count_smartphone = $H_sess["H_carcnt"]["28"];	// smartphone
			//$this->get_Smarty()->assign("count_smartphone",$count_smartphone);
			//その他キャリアの取得
			{
				var count_docomo = H_sess.H_carcnt["1"];
				var count_au = H_sess.H_carcnt["3"];
				var count_willcom = H_sess.H_carcnt["2"];
				var count_vodafone = H_sess.H_carcnt["4"];
				var count_emobile = H_sess.H_carcnt["15"];
				this.get_Smarty().assign("count_docomo", count_docomo);
				this.get_Smarty().assign("count_au", count_au);
				this.get_Smarty().assign("count_willcom", count_willcom);
				this.get_Smarty().assign("count_vodafone", count_vodafone);
				this.get_Smarty().assign("count_emobile", count_emobile);
				var car_list = [1, 3, 2, 4, 15];
				var count_other = 0;
				{
					let _tmp_0 = H_sess.H_carcnt;

					for (var key in _tmp_0) {
						var value = _tmp_0[key];

						if (!(-1 !== car_list.indexOf(key))) {
							count_other += value;
						}
					}
				}
				this.get_Smarty().assign("count_other", count_other);
			}

		this.get_Smarty().assign("down_flg", down_flg);
		this.get_Smarty().assign("tstamp", this.H_Dir.tstamp);

		if (undefined !== H_sess.SELF.checklist) {
			this.get_Smarty().assign("checklist", H_sess.SELF.checklist);
		} else {
			this.get_Smarty().assign("checklist", Array());
		}

		var smarty_template = "menu.tpl";
		this.get_Smarty().display(smarty_template);
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

	displaySmartyPeculiar(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], H_g_sess: {} | any[]) {}

	setOrderIdList(A_orderid = Array()) {
		this.H_Dir.A_orderid = A_orderid;

		if (!(undefined !== this.H_Dir.tstamp)) {
			this.H_Dir.tstamp = Date.now() / 1000;
		}

		this.O_Sess.SetPub(OrderListMenuView.PUB, this.H_Dir);
	}

	setEnglish(eng = false) {
		this.H_Dir.eng = eng;
		this.O_Sess.SetPub(OrderListMenuView.PUB, this.H_Dir);
	}

	__destruct() {
		super.__destruct();
	}

};