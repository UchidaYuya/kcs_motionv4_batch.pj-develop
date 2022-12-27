//
//承認履歴一覧のView
//
//更新履歴：<br>
//2008/06/03 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/06/03
//@filesource
//@uses OrderListMenuView
//@uses QuickFormUtil
//
//
//error_reporting(E_ALL);
//
//承認履歴一覧のView
//
//@package Order
//@subpackage View
//@since 2008/06/03
//@uses OrderListMenuView
//@uses QuickFormUtil
//

require("view/Order/OrderListMenuView.php");

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
//セッションが無い時デフォルト値を入れる	/////承認用に変更する
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
//承認履歴一覧の検索フォームを作成する<br>
//
//フォーム要素の配列を作成<br>
//検索フォームのオブジェクト生成<br>
//契約日用のグループの配列作成<br>
//契約日用のグループを検索フォームオブジェクトに追加<br>
//
//@author miyazawa
//@since 2008/06/03
//
//@param array $H_sess（CGIパラメータ）
//@param array $A_post（部署一覧）
//@param object $O_order
//@param object $O_model
//@access public
//@return void
//@uses OrderUtil
//@uses QuickFormUtil
//
//
//検索フォームのルール作成 	/////承認用に変更する
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
//ヘッダーに埋め込むjavascriptを返す 	/////承認用に変更する
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
//パラメータチェック <br>	/////承認用に変更する
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
//ヘッダーフォームのデフォルト値を作成 	/////承認用に変更する
//
//@author houshiyama
//@since 2008/03/06
//
//@param mixed $H_sess
//@access protected
//@return array
//
//
//Smartyを用いた画面表示<br>	/////承認用に変更する
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
//@param array $H_g_sess
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
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class RecogMenuView extends OrderListMenuView {
	constructor() {
		super();
	}

	setDefaultSession() //年月セッションが無ければ作る（「すべて」）
	{
		if (undefined !== this.H_Dir.search.cym == false) {
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

		this.setDefaultSessionPeculiar();
	}

	checkCGIParam() //年月の変更が実行された時
	//ページが変更された時
	//ページ変更以外はページを１に戻す
	//getパラメータは消す
	{
		this.setDefaultSession();

		if (undefined !== _GET.ym == true) {
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
				this.O_Sess.setPub(RecogMenuView.PUB, this.H_Dir);
				MtExceptReload.raise(undefined);
			}
		}

		if (undefined !== _GET.s == true) {
			this.H_Dir.search.sort = _GET.s;
		}

		if (undefined !== _POST.search == true) {
			this.H_Dir.search.post = _POST;
		} else {
			if (undefined !== _POST.limit == false && undefined !== this.H_Dir.search.post.status == false) {
				this.H_Dir.search.post.status = {
					0: "10",
					1: "20"
				};
				delete this.H_Dir.search.post.search;
			}
		}

		if (undefined !== _GET.p == true) {
			this.H_Dir.search.offset = _GET.p;
		}

		this.checkCGIParamPeculiar();

		if ((_POST.length > 0 || _GET.length > 0) && undefined !== this.H_Dir.search.offset == false) {
			this.H_Dir.search.offset = 1;
		}

		this.O_Sess.setPub(RecogMenuView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);

		if (_GET.length > 0) {
			MtExceptReload.raise(undefined);
		}
	}

	makeSearchForm(H_sess: {} | any[], A_post: {} | any[], O_order: OrderUtil, O_model) //英語化権限 20090210miya
	//フォーム要素の配列作成
	{
		if (true == this.H_Dir.eng) {
			var postcdstr = "\u2606\u767B\u9332\u90E8\u7F72";
			var chargerstr = "Requestor";
			var ordernostr = "Reception no.";
			var telnostr = "Phone Number";
			var searchstr = "Search";
			var allcheckstr = "Select all";
			var alluncheckstr = "Clear";
		} else {
			postcdstr = "\u767B\u9332\u90E8\u7F72";
			chargerstr = "\u5165\u529B\u62C5\u5F53\u8005";
			ordernostr = "\u53D7\u4ED8\u756A\u53F7";
			telnostr = "\u96FB\u8A71\u756A\u53F7";
			searchstr = "\u3053 \u306E \u6761 \u4EF6 \u3067 \u691C \u7D22 \u3059 \u308B";
			allcheckstr = "\u5168\u3066\u9078\u629E";
			alluncheckstr = "\u9078\u629E\u89E3\u9664";
		}

		var A_formelement = [{
			name: "postcd",
			label: postcdstr,
			inputtype: "text",
			options: {
				size: "20",
				maxlength: "20"
			}
		}, {
			name: "charger",
			label: chargerstr,
			inputtype: "text",
			options: {
				size: "20"
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
			name: "allcheck",
			label: allcheckstr,
			inputtype: "button",
			options: {
				onClick: "javascript:AllCheck()"
			}
		}, {
			name: "alluncheck",
			label: alluncheckstr,
			inputtype: "button",
			options: {
				onClick: "javascript:AllunCheck()"
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

	makeSearchRule() {}

	makePankuzuLinkHash() //英語化権限 20090210miya
	{
		if (true == this.H_Dir.eng) {
			var H_link = {
				"": "Approval"
			};
		} else {
			H_link = {
				"": "\u627F\u8A8D"
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
		var A_exc = ["/Recog/recog_form.php", "/Recog/recog_detail.php"];
		this.O_Sess.clearSessionExcludeListPub(A_exc);
	}

	checkParamError(H_sess, H_g_sess) //注文履歴基底のパラメータチェック
	{
		this.checkBaseParamError(H_sess, H_g_sess);
	}

	makeDefaultValue(H_sess: {} | any[]) {
		var H_default = Array();
		H_default = H_sess[RecogMenuView.PUB];
		H_default.limit = H_sess.SELF.limit;
		return H_default;
	}

	displaySmarty(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], H_g_sess: {} | any[], H_search: {} | any[] = Array(), H_order = Array()) //QuickFormとSmartyの合体
	//assaign
	//ページ固有の表示処理
	//$this->displaySmartyPeculiar( $H_sess, $A_data, $A_auth, $O_manage );
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_SearchForm.accept(O_renderer);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("current_script", _SERVER.PHP_SELF);
		this.get_Smarty().assign("H_sess", H_sess);
		this.get_Smarty().assign("monthly_bar", this.H_View.monthly_bar);
		this.get_Smarty().assign("page_link", this.H_View.page_link);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("list_cnt", A_data[0]);
		this.get_Smarty().assign("H_list", A_data[1]);
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("A_auth", A_auth);
		this.get_Smarty().assign("H_search", H_search);
		this.get_Smarty().assign("limit", this.H_Dir.search.limit);
		this.get_Smarty().assign("postid", H_g_sess.postid);
		this.get_Smarty().assign("userid", H_g_sess.userid);
		this.get_Smarty().assign("su", H_g_sess.su);
		var smarty_template = "menu.tpl";
		this.get_Smarty().display(smarty_template);
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

	displaySmartyPeculiar(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], H_g_sess: {} | any[]) {}

	__destruct() {
		super.__destruct();
	}

};