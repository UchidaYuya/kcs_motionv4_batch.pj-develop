//
//管理情報一覧の基底クラス
//
//更新履歴：<br>
//2008/02/20 宝子山浩平 作成
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2008/02/20
//@filesource
//@uses BillViewBase
//@uses Post
//
//
//error_reporting(E_ALL);
//
//管理情報一覧の基底クラス
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2008/02/20
//@uses BillViewBase
//

require("view/Bill/BillViewBase.php");

require("Post.php");

require(_SERVER.DOCUMENT_ROOT + "/Bill/tab.php");

//
//ヘッダーフォームオブジェクト
//
//@var mixed
//@access protected
//
//
//検索フォームオブジェクト
//
//@var mixed
//@access private
//
//
//表示に使う要素を格納する配列
//
//@var mixed
//@access protected
//
//
//コンストラクタ <br>
//
//@author houshiyama
//@since 2008/03/03
//
//@access public
//@return void
//@uses BillUtil
//
//
//セッションが無い時デフォルト値を入れる
//
//年月セッションが無ければ作る（デフォルトは今月）<br>
//カレント部署がセッションが無ければ作る（デフォルトは自部署）<br>
//部署の絞込条件セッションが無ければ作る（デフォルトは対象部署のみ）<br>
//表示件数セッションが無ければ作る（デフォルトは10）<br>
//検索条件がセッションに無ければ作る（デフォルトは空配列）<br>
//表示条件がセッションに無ければ作る（デフォルトは部署単位）<br>
//ソート条件セッションが無ければ作る（デフォルトは部署降順）<br>
//カレントページがセッションに無ければ作る<br>
//
//@author houshiyama
//@since 2008/03/04
//
//@access private
//@return void
//
//
//各ページ固有のsetDefaultSession
//
//@author houshiyama
//@since 2008/03/10
//
//@abstract
//@access protected
//@return void
//
//
//メーニュー画面共通のCGIパラメータのチェックを行う<br>
//
//デフォルト値を入れる<br>
//
//表示年月の変更がされたら配列に入れる <br>
//部署選択がされたら配列に入れる <br>
//他のタブから来たらそのしるしを配列に入れる <br>
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
//各ページ（管理）固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/03/03
//
//@abstract
//@access protected
//@return void
//
//
//再計算用フォーム作成
//
//@author houshiyama
//@since 2008/04/16
//
//@param mixed $H_sess
//@access private
//@return void
//
//
//パンくずリンクを作成し返す
//
//@author houshiyama
//@since 2008/03/03
//
//@protected
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/03/07
//
//@abstract
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
//各ページ固有のmakeDefaultValue
//
//@author houshiyama
//@since 2008/05/19
//
//@abstract
//@access protected
//@return void
//
//
//検索フォームの表示・非表示を返す
//
//@author houshiyama
//@since 2008/03/07
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//検索条件があるか調べる <br>
//（trueあり、falseなし） <br>
//
//@author houshiyama
//@since 2008/04/18
//
//@param array $H_post
//@access protected
//@return void
//
//
//管理が唯一ならばタブを出さずにそのページへ移動する <br>
//全て一覧のみ継承で使用する <br>
//
//@author houshiyama
//@since 2008/04/04
//
//@param mixed $A_auth
//@access public
//@return void
//
//
//Smartyを用いた画面表示<br>
//
//QuickFormとSmartyを合体<br>
//各データをSmartyにassign<br>
//各ページ固有の表示処理<br>
//Smartyで画面表示<br>
//
//@author houshiyama
//@since 2008/02/20
//
//@param array $H_sesstion（CGIパラメータ）
//@param array $A_data（一覧データ）
//@param array $A_auth（権限一覧）
//@param array $O_model（modelオブジェクト）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//権限系のフラグをassignする
//
//@author houshiyama
//@since 2008/04/16
//
//@param mixed $A_auth
//@access private
//@return void
//
//
//各ページ（管理）固有のdisplaySmarty
//
//@author houshiyama
//@since 2008/03/03
//
//@protected
//@access protected
//@return void
//
//
//請求タイプを返す
//
//@author miyazawa
//@since 2010/09/16
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
class BillMenuViewBase extends BillViewBase {
	constructor() {
		super();
	}

	setDefaultSession() //年月セッションが無ければ作る
	//数字でもcurrentでもないときも異常なので作り直す（どこかでcurrentが変にsubstrされて「curren」になっている可能性があるため） 20100917
	{
		if (undefined !== this.H_Dir.cym === false || undefined !== this.H_Dir.cym === true && false == is_numeric(this.H_Dir.cym) && "current" != this.H_Dir.cym) {
			this.H_Dir.cym = date("Ym");
		}

		if (undefined !== this.H_Dir.current_postid === false) {
			this.H_Dir.current_postid = _SESSION.postid;
		}

		if (undefined !== this.H_Local.limit === false) //クッキーに表示件数があればそれを使う
			{
				if (undefined !== _COOKIE.bill_limit === true) {
					this.H_Local.limit = _COOKIE.bill_limit;
				} else {
					this.H_Local.limit = "30";
				}
			}

		if (undefined !== this.H_Local.post === false) {
			this.H_Local.post = Array();
		}

		if (undefined !== this.H_Local.mode === false) {
			this.H_Local.mode = "0";
		}

		if (undefined !== this.H_Local.sort === false) {
			this.H_Local.sort = "00,a";
		}

		if (undefined !== this.H_Local.offset === false) {
			this.H_Local.offset = 1;
		}

		this.setDefaultSessionPeculiar();
	}

	checkCGIParam() //年月の変更が実行された時
	//表示形式が変更された時
	//ページ変更以外はページを１に戻す
	//getパラメータは消す
	{
		this.setDefaultSession();

		if (undefined !== _GET.ym === true && is_numeric(_GET.ym) === true) //未集計に対応 20100916miya
			{
				var yyyy = _GET.ym.substr(0, 4);

				var mm = str_pad(_GET.ym.substr(4, 2), 2, "0", STR_PAD_LEFT);
				this.H_Dir.cym = yyyy + mm;
			} else if (undefined !== _GET.ym === true && "current" == _GET.ym) {
			this.H_Dir.cym = "current";
		}

		if (undefined !== _GET.postid === true && is_numeric(_GET.postid) === true) {
			this.H_Dir.current_postid = _GET.postid;
			this.O_Sess.setGlobal("current_postid", _GET.postid);
			this.H_Local.mode = "0";
		}

		if (undefined !== _GET.pid === true && is_numeric(_GET.pid) === true) {
			this.H_Dir.current_postid = _GET.pid;
			this.O_Sess.setGlobal("current_postid", _GET.pid);
			this.H_Local.mode = "0";
		}

		if (undefined !== _GET.tab === true) //未集計対応 20100917miya
			{
				if ("current" == this.H_Dir.cym) {
					yyyy = _GET.ym.substr(0, 4);
					mm = str_pad(_GET.ym.substr(4, 2), 2, "0", STR_PAD_LEFT);
					this.H_Dir.cym = yyyy + mm;
				}

				this.H_Dir.tab = _GET.tab;
			}

		if (undefined !== _POST.limit === true) {
			if (is_numeric(_POST.limit) === true && _POST.limit > 0 && preg_match("/\\./", _POST.limit) == false) //クッキーセット
				{
					this.H_Local.limit = _POST.limit;
					setcookie("bill_limit", _POST.limit, mktime(0, 0, 0, 12, 31, 2020));
				} else {
				this.H_Local.limit = 10;
				this.O_Sess.setSelfAll(this.H_Local);
				MtExceptReload.raise(undefined);
			}
		}

		if (undefined !== _GET.s === true) {
			this.H_Local.sort = _GET.s;
		}

		if (undefined !== _POST.search === true) {
			this.H_Local.post = _POST;
			this.H_Local.mode = "1";
			this.H_Local.sort = "0,a";
		} else {
			delete this.H_Local.post.search;
		}

		if (undefined !== _POST.mode === true) {
			this.H_Local.mode = _POST.mode;
			this.H_Local.sort = "0,a";
		} else if (undefined !== _GET.mode === true) {
			this.H_Local.mode = _GET.mode;
			this.H_Local.sort = "0,a";
		}

		if (undefined !== _GET.p === true) {
			this.H_Local.offset = _GET.p;
		}

		if (this.H_Local.mode == "0") {
			this.H_Local.post = Array();
		}

		this.checkCGIParamPeculiar();

		if ((_POST.length > 0 || _GET.length > 0) && undefined !== _GET.p === false && undefined !== _GET.keep === false) {
			this.H_Local.offset = 1;
		}

		this.O_Sess.setPub(BillMenuViewBase.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);

		if (_GET.length > 0) {
			MtExceptReload.raise(undefined);
		}
	}

	makeRecalcForm(H_sess) //未集計に対応 20100916miya
	//クイックフォームオブジェクト生成
	{
		var year = "";
		var month = "";

		if (true == is_numeric(H_sess[BillMenuViewBase.PUB].cym)) {
			year = H_sess[BillMenuViewBase.PUB].cym.substr(0, 4);
			month = H_sess[BillMenuViewBase.PUB].cym.substr(4, 2);
		}

		var A_formelement = [{
			name: "postid",
			inputtype: "hidden",
			data: H_sess[BillMenuViewBase.PUB].current_postid
		}, {
			name: "year",
			inputtype: "hidden",
			data: year
		}, {
			name: "month",
			inputtype: "hidden",
			data: month
		}, {
			name: "submitButton",
			inputtype: "submit",
			data: "\u518D\u8A08\u7B97",
			options: {
				class: "csButtonAdmin",
				tabIndex: "-1"
			}
		}];
		this.H_View.O_recalcFormUtil = new QuickFormUtil("formRecalc", "post", "./bill_recalc.php");
		this.H_View.O_recalcFormUtil.setFormElement(A_formelement);
		this.O_RecalcForm = this.H_View.O_recalcFormUtil.makeFormObject();
	}

	clearUnderSession() {
		this.clearLastForm();
		var A_exc = [BillMenuViewBase.PUB, "/Bill/menu.php", "/Bill/Tel/menu.php", "/Bill/ETC/menu.php", "/Bill/Purchase/menu.php"];
		this.O_Sess.clearSessionExcludeListPub(A_exc);
	}

	checkParamError(H_sess, H_g_sess) //管理情報基底のパラメータチェック
	{
		this.checkBaseParamError(H_sess, H_g_sess);
	}

	makeDefaultValue(H_sess: {} | any[]) //検索値
	//表示件数
	//表示形式
	{
		var H_default = Array();
		H_default = H_sess.SELF.post;
		H_default.limit = H_sess.SELF.limit;

		if ("0" === H_sess.SELF.mode) {
			H_default.mode = "0";
		} else {
			H_default.mode = "1";
		}

		this.makeDefaultValuePeculiar(H_sess, H_default);
		return H_default;
	}

	getShowForm(H_post: {} | any[]) {
		if (this.checkSearchExist(H_post) === true) {
			return "block";
		}

		return "none";
	}

	checkSearchExist(H_post: {} | any[]) {
		for (var key in H_post) {
			var val = H_post[key];

			if (key != "search" && key != "kamokuprice_condition") {
				if (val != "") {
					return true;
				}
			}
		}

		return false;
	}

	checkLocation(A_auth) {}

	displaySmarty(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], O_model) //QuickFormとSmartyの合体
	//年月変数
	//未集計に対応 20100916miya
	//当月のデータがなければ前月へ移動
	//権限系のフラグをassign
	//ページ固有の表示処理
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_SearchForm.accept(O_renderer);
		var O_rec_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_RecalcForm.accept(O_rec_renderer);

		if ("current" == H_sess[BillMenuViewBase.PUB].cym) //使用年月（管理情報に行く用）最新月を表示する
			{
				var year = "";
				var month = "";
				var tmpcym = date("Ym");
				var tmpyear = tmpcym.substr(0, 4);
				var tmpmonth = tmpcym.substr(4, 2);
				var usecym = date("Ym", mktime(0, 0, 0, tmpmonth, 1, tmpyear));
			} else //使用年月（管理情報に行く用）
			{
				year = H_sess[BillMenuViewBase.PUB].cym.substr(0, 4);
				month = H_sess[BillMenuViewBase.PUB].cym.substr(4, 2);
				usecym = date("Ym", mktime(0, 0, 0, month - 1, 1, year));
			}

		if (0 === A_data[0] && H_sess[BillMenuViewBase.PUB].cym === date("Ym") && undefined !== H_sess[BillMenuViewBase.PUB].tab === false && preg_match("/\\/Menu\\/menu.php/", _SERVER.HTTP_REFERER) == true) {
			this.H_Dir.cym = usecym;
			this.O_Sess.setPub(BillMenuViewBase.PUB, this.H_Dir);
			MtExceptReload.raise(undefined);
		}

		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("current_postid", H_sess[BillMenuViewBase.PUB].current_postid);
		this.get_Smarty().assign("ym_bar", this.H_View.monthly_bar);
		this.get_Smarty().assign("showform", this.getShowForm(H_sess.SELF.post));
		this.get_Smarty().assign("page_link", this.H_View.page_link);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("O_formRecalc", O_rec_renderer.toArray());
		this.get_Smarty().assign("list_cnt", A_data[0]);
		this.get_Smarty().assign("H_list", A_data[1]);
		this.get_Smarty().assign("H_sum", A_data[2]);
		this.get_Smarty().assign("mode", H_sess.SELF.mode);
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("thismonthflg", this.getThisMonthFlg(H_sess[BillMenuViewBase.PUB].cym));
		this.get_Smarty().assign("person", person);
		this.get_Smarty().assign("cym", H_sess[BillMenuViewBase.PUB].cym);
		this.get_Smarty().assign("usecym", usecym);
		this.get_Smarty().assign("year", year);
		this.get_Smarty().assign("month", month);
		this.get_Smarty().assign("post_tree", this.H_View.post_tree);
		this.get_Smarty().assign("history_addr", "./bill_history.php?year=" + year + "&month=" + month);
		this.get_Smarty().assign("last_history", O_model.getRecalcDateTime(year, month));
		this.assignAuthFlag(A_auth);
		this.displaySmartyPeculiar(H_sess, A_data, A_auth, O_model, this.get_Smarty(), O_rec_renderer);
	}

	assignAuthFlag(A_auth) //再計算権限
	//ダウンロード権限
	//ASP表示権限
	//夜間営業
	//汎用ダウンロード権限
	{
		var auth_recalc = false;

		if (-1 !== A_auth.indexOf("fnc_recalc") === true) {
			auth_recalc = true;
		}

		this.get_Smarty().assign("auth_recalc", auth_recalc);
		var auth_download = false;

		if (-1 !== A_auth.indexOf("fnc_download") === true) {
			auth_download = true;
		}

		this.get_Smarty().assign("auth_download", auth_download);
		var auth_asp = false;

		if (-1 !== A_auth.indexOf("fnc_asp") === true) {
			auth_asp = true;
		}

		this.get_Smarty().assign("auth_asp", auth_asp);
		this.get_Smarty().assign("extend", "normal");
		var auth_vdl = false;

		if (-1 !== A_auth.indexOf("fnc_vdl_download") === true) {
			auth_vdl = true;
		}

		this.get_Smarty().assign("auth_vdl", auth_vdl);
	}

	getBillType() {
		return "";
	}

	__destruct() {
		super.__destruct();
	}

};