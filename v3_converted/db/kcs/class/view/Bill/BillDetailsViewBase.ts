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
//@since 2008/04/23
//
//@access public
//@return void
//@uses BillUtil
//
//
//セッションが無い時デフォルト値を入れる
//
//年月セッションが無ければ作る（デフォルトは今月）<br>
//年月セッションが短ければ長くする
//表示条件セッションが無ければ作る（デフォルトは今月）<br>
//カレント部署がセッションが無ければ作る（デフォルトは自部署）<br>
//部署の絞込条件セッションが無ければ作る（デフォルトは対象部署のみ）<br>
//表示件数セッションが無ければ作る（デフォルトは10）<br>
//ソート条件セッションが無ければ作る（デフォルトは部署降順）<br>
//カレントページがセッションに無ければ作る<br>
//
//@author houshiyama
//@since 2008/04/23
//
//@access private
//@return void
//
//
//各ページ固有のsetDefaultSession
//
//@author houshiyama
//@since 2008/04/23
//
//@abstract
//@access protected
//@return void
//
//
//明細画面共通のCGIパラメータのチェックを行う<br>
//
//デフォルト値を入れる<br>
//
//表示年月の変更がされたら配列に入れる <br>
//表示件数が変更されたら配列に入れるCookieも書き換える） <br>
//ソート条件が変更されたら配列に入れる<br>
//ページが変更されたら配列に入れる <br>
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
//@since 2008/04/23
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
//@since 2008/04/23
//
//@protected
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/04/23
//
//@abstract
//@access public
//@return void
//
//
//パラメータチェック <br>
//
//@author houshiyama
//@since 2008/04/23
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
//@since 2008/04/23
//
//@param mixed $H_sess
//@access protected
//@return array
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
//@since 2008/04/23
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
//@since 2008/04/23
//
//@access public
//@return void
//
class BillDetailsViewBase extends BillViewBase {
	constructor() {
		super();
	}

	setDefaultSession() //年月セッションが無ければ作る
	//表示条件が無ければ作る
	{
		if (undefined !== this.H_Dir.cym === false) {
			this.H_Dir.cym = date("Ym");
		} else {
			if (this.H_Dir.cym.length === 5) {
				this.H_Dir.cym = this.H_Dir.cym.substr(0, 4) + str_pad(this.H_Dir.cym.substr(4), 2, "0", STR_PAD_LEFT);
			}
		}

		if (undefined !== this.H_Local.mode === false) {
			this.H_Local.mode = "0";
		}

		if (undefined !== this.H_Dir.current_postid === false) {
			this.H_Dir.current_postid = _SESSION.postid;
		}

		if (undefined !== this.H_Local.limit === false) //クッキーに表示件数があればそれを使う
			{
				if (undefined !== _COOKIE.bill_detail_limit === true) {
					this.H_Local.limit = _COOKIE.bill_limit;

					if (is_numeric(this.H_Local.limit) == false) {
						this.H_Local.limit = "30";
					}
				} else {
					this.H_Local.limit = "30";
				}
			}

		if (undefined !== this.H_Local.sort === false) {
			this.H_Local.sort = "0,a";
		}

		if (undefined !== this.H_Local.hsort === false) {
			this.H_Local.hsort = "0,a";
		}

		if (undefined !== this.H_Local.detailoffset === false) {
			this.H_Local.detailoffset = "1";
		}

		this.setDefaultSessionPeculiar();
	}

	checkCGIParam() //年月の変更が実行された時
	//ページ変更以外はページを１に戻す
	//getパラメータは消す
	{
		this.setDefaultSession();

		if (undefined !== _GET.ym === true && is_numeric(_GET.ym) === true) //未集計に対応 20100916miya
			{
				this.H_Dir.cym = _GET.ym;
			} else if (undefined !== _GET.ym === true && "current" == _GET.ym) {
			this.H_Dir.cym = "current";
		}

		if (undefined !== _POST.limit === true) {
			if (is_numeric(_POST.limit) === true && _POST.limit > 0 && preg_match("/\\./", _POST.limit) == false) //クッキーセット
				{
					this.H_Local.limit = _POST.limit;
					setcookie("bill_detail_limit", _POST.limit, mktime(0, 0, 0, 12, 31, 2020));
				} else {
				this.H_Local.limit = 10;
				this.O_Sess.setSelfAll(this.H_Local);
				MtExceptReload.raise(undefined);
			}
		}

		if (undefined !== _GET.s === true) {
			this.H_Local.sort = _GET.s;
		}

		if (undefined !== _GET.hs === true) {
			this.H_Local.hsort = _GET.hs;
		}

		if (undefined !== _GET.p === true) {
			this.H_Local.detailoffset = _GET.p;
		}

		this.checkCGIParamPeculiar();

		if ((_POST.length > 0 || _GET.length > 0) && undefined !== _GET.p === false) {
			this.H_Local.detailoffset = "1";
		}

		this.O_Sess.setPub(BillDetailsViewBase.PUB, this.H_Dir);
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

		if (true == is_numeric(H_sess[BillDetailsViewBase.PUB].cym)) {
			year = H_sess[BillDetailsViewBase.PUB].cym.substr(0, 4);
			month = H_sess[BillDetailsViewBase.PUB].cym.substr(4, 2);
		}

		var A_formelement = [{
			name: "postid",
			inputtype: "hidden",
			data: H_sess[BillDetailsViewBase.PUB].current_postid
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

		return H_default;
	}

	checkLocation(A_auth) {}

	displaySmarty(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], O_model) //QuickFormとSmartyの合体
	//年月変数
	//未集計に対応 20100916miya
	//assaign
	//権限系のフラグをassign
	//ページ固有の表示処理
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_SearchForm.accept(O_renderer);
		var O_rec_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_RecalcForm.accept(O_rec_renderer);

		if ("current" == H_sess[BillDetailsViewBase.PUB].cym) {
			var month = "";
			var year = "";
			var use_year = "";
			var use_month = "";
		} else //使用年月（管理情報参照用）最新月を表示する
			//$tmpcym = date("Ym");
			//			$tmpyear = substr( $tmpcym, 0, 4 );
			//			$tmpmonth = substr( $tmpcym, 4, 2 );
			//			$use_year = date( "Y", mktime( 0, 0, 0, $tmpmonth-1, 1, $tmpyear ) );
			//			$use_month = date( "n", mktime( 0, 0, 0, $tmpmonth-1, 1, $tmpyear ) );
			{
				year = H_sess[BillDetailsViewBase.PUB].cym.substr(0, 4);
				month = H_sess[BillDetailsViewBase.PUB].cym.substr(4, 2);
				use_year = date("Y", mktime(0, 0, 0, month - 1, 1, year));
				use_month = date("n", mktime(0, 0, 0, month - 1, 1, year));
			}

		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("current_postid", H_sess[BillDetailsViewBase.PUB].current_postid);
		this.get_Smarty().assign("ym_bar", this.H_View.monthly_bar);
		this.get_Smarty().assign("page_link", this.H_View.page_link);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("O_formRecalc", O_rec_renderer.toArray());
		this.get_Smarty().assign("list_cnt", A_data[0]);
		this.get_Smarty().assign("H_list", A_data[1]);
		this.get_Smarty().assign("purchcoid", A_data[1][0].purchcoid);
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("thismonthflg", this.getThisMonthFlg(H_sess[BillDetailsViewBase.PUB].cym));
		this.get_Smarty().assign("person", person);
		this.get_Smarty().assign("year", year);
		this.get_Smarty().assign("month", month);
		this.get_Smarty().assign("use_year", use_year);
		this.get_Smarty().assign("use_month", use_month);
		this.get_Smarty().assign("post_tree", this.H_View.post_tree);
		this.get_Smarty().assign("history_addr", "./bill_history.php?year=" + year + "&month=" + month);
		this.get_Smarty().assign("cym", H_sess[BillDetailsViewBase.PUB].cym);
		this.get_Smarty().assign("one_past_cym", date("Ym", mktime(0, 0, 0, date("m") - 12, date("n"), date("Y"))));
		this.assignAuthFlag(A_auth);
		this.displaySmartyPeculiar(H_sess, A_data, A_auth, O_model);
		var tpl = this.getDefaultTemplate();
		this.get_Smarty().display(tpl);
	}

	assignAuthFlag(A_auth) //ダウンロード権限
	//夜間営業
	{
		var auth_download = false;

		if (-1 !== A_auth.indexOf("fnc_download") === true) {
			auth_download = true;
		}

		this.get_Smarty().assign("auth_download", auth_download);
		this.get_Smarty().assign("extend", "normal");
	}

	getBillType() {
		return "";
	}

	__destruct() {
		super.__destruct();
	}

};