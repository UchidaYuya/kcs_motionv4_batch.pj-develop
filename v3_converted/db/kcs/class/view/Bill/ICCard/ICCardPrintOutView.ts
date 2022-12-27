//
//交通費申請画面View
//
//更新履歴：<br>
//2008/03/14 宝子山浩平 作成
//
//@package ICCard
//@subpackage View
//@author miyazawa
//@since 2010/04/27
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//交通費申請画面View
//
//@package ICCard
//@subpackage View
//@author miyazawa
//@since 2010/04/27
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

//
//ディレクトリ名
//
//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//ディレクトリ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//ページ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//表示に使う要素を格納する配列
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
//ユーザ設定項目
//
//@var mixed
//@access protected
//
//
//日付
//
//@var mixed
//@access protected
//
//
//コンストラクタ <br>
//
//@author miyazawa
//@since 2010/04/27
//
//@access public
//@return void
//
//
//checkCGIParam
//
//@author iga
//@since 2011/01/14
//
//@access protected
//@return void
//
//
//getViewUserId
//
//@author
//@since 2011/01/14
//
//@access public
//@return void
//
//
//セッションのpactidを返す
//
//@author miyazawa
//@since 2010/04/27
//
//@access public
//@return void
//
//
//セッションのpostidを返す
//
//@author miyazawa
//@since 2010/04/27
//
//@access public
//@return void
//
//
//ローカルセッションを取得する
//
//@author miyazawa
//@since 2010/04/27
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author miyazawa
//@since 2010/04/27
//
//@access public
//@return mixed
//
//
//最低限必要なセッション情報が無ければエラー表示
//
//@author miyazawa
//@since 2010/04/27
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//明細データの整形
//
//@author miyazawa
//@since 2010/04/27
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//Smartyを用いた画面表示<br>
//
//各データをSmartyにassign<br>
//各ページ固有の表示処理<br>
//Smartyで画面表示<br>
//
//@author miyazawa
//@since 2010/05/10
//
//@param $H_g_sess
//@param $H_modified
//@param $H_sess
//
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//デストラクタ
//
//@author miyazawa
//@since 2010/04/27
//
//@access public
//@return void
//
class ICCardPrintOutView extends ViewSmarty {
	static PUB = "/Bill/ICCard";

	constructor() {
		this.O_Sess = MtSession.singleton();
		var H_param = Array();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.H_Dir = this.O_Sess.getPub(ICCardPrintOutView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();
		this.Now = this.getDateUtil().getNow();
		this.Today = this.getDateUtil().getToday();
		this.A_Time = split("-| |:", this.Now);
		this.YM = this.A_Time[0] + this.A_Time[1];

		if (is_numeric(this.O_Sess.pactid) == true) {
			this.O_Auth = MtAuthority.singleton(this.O_Sess.pactid);
		} else {
			this.errorOut(10, "\u30BB\u30C3\u30B7\u30E7\u30F3\u306Bpactid\u304C\u7121\u3044", false);
		}
	}

	checkCGIParam() {
		var H_sess = this.O_Sess.getSelfAll();

		if (undefined !== _POST.view_userid) {
			this.view_userid = +_POST.view_userid;
			H_local.view_userid = this.view_userid;
			this.O_Sess.setSelfAll(H_local);
		} else if (undefined !== H_sess.view_userid) {
			this.view_userid = H_sess.view_userid;
		}

		if (!this.view_userid || !is_numeric(this.view_userid)) {
			this.getOut().errorOut(5, "\u51FA\u529B\u5BFE\u8C61\u306E\u30E6\u30FC\u30B6\u30FC\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}
	}

	getViewUserId() {
		return this.view_userid;
	}

	get_Pactid() {
		return this.pactid;
	}

	get_Postid() {
		return this.postid;
	}

	getLocalSession() //交通費個人別請求画面から渡されるセッション
	{
		var H_sess = {
			[ICCardPrintOutView.PUB]: this.O_Sess.getPub(ICCardPrintOutView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		H_sess.table_no = this.O_Sess.getPub(_SERVER.PHP_SELF + ",table_no");
		H_sess.sort_key = this.O_Sess.getPub(_SERVER.PHP_SELF + ",sort_key");
		H_sess.sort_desc = this.O_Sess.getPub(_SERVER.PHP_SELF + ",sort_desc");
		H_sess.cy = this.O_Sess.getPub(ICCardPrintOutView.PUB + "/menu.php,cy");
		H_sess.cm = this.O_Sess.getPub(ICCardPrintOutView.PUB + "/menu.php,cm");
		return H_sess;
	}

	get_View() {
		return this.H_View;
	}

	checkBaseParamError(H_sess, H_g_sess) //最低限必要なセッションが無ければエラー
	{
		if (undefined !== H_sess[ICCardPrintOutView.PUB].cym == false || undefined !== H_sess[ICCardPrintOutView.PUB].current_postid == false || undefined !== H_sess[ICCardPrintOutView.PUB].posttarget == false) {
			this.errorOut(8, "session\u304C\u7121\u3044", false);
			throw die();
		}
	}

	modHistory(H_hist = Array()) //ページ単位に切り分ける
	//1ページ目は23行、2ページ目以降は27行
	{
		var H_modified = Array();
		var histcnt = H_hist.length;

		if (histcnt <= 23) {
			H_modified[0] = H_hist;
		} else //23行目まで
			//25行目以降
			//25行目以降件数
			//25行目以降ページ数
			//その余り
			//余りがあったら+1ページする
			//ページごとに切り分け
			{
				var H_histtemp = Array();
				H_modified[0] = H_hist.slice(0, 23);
				var H_hist_remain = H_hist.slice(23);
				var remaincnt = H_hist_remain.length;
				var remain_page = remaincnt / 27;
				var remain_amari = remaincnt % 27;

				if (remain_amari != 0) {
					remain_page++;
				}

				remain_page = Math.floor(remain_page);

				for (var i = 1; i <= remain_page; i++) {
					H_modified[i] = H_hist_remain.slice((i - 1) * 27, 27);
				}
			}

		return H_modified;
	}

	displaySmarty(H_g_sess, H_modified, H_sess, H_UserData) //合計額
	//日付
	//日付指定フォーム
	//会社名の後ろにつける文言（pactid=85対応） 20101028miya
	//初期値
	//タイトル、月、申請日が来たら印刷用フォーマットに適用、全部揃ってたら印刷フォーマットにGO
	//assign
	//会社名
	//部署名
	//$this->get_Smarty()->assign("username", $H_g_sess["loginname"]);	// 氏名
	//氏名	// 20110114iga
	//データ
	//合計額
	//日付（和暦）
	//日付（月）
	//日付（日）
	//月
	//タイトル
	//エラーメッセージ
	//Render関連の設定
	//display
	{
		var sum = 0;

		for (var page of Object.values(H_modified)) {
			for (var value of Object.values(page)) {
				sum += +value.charge;
			}
		}

		var today = date("Y,n,j", mktime(0, 0, 0, date("n"), date("j"), date("Y")));
		var A_tod = preg_split("/,/", today);
		var H_def_year = {
			minYear: Math.round(A_tod[0]) - 1,
			maxYear: Math.round(A_tod[0]) + 1,
			addEmptyOption: false
		};
		var O_form = new HTML_QuickForm("form", "POST");
		O_form.addElement("select", "docmonth", "\u7533\u8ACB\u6708", {
			1: 1,
			2: 2,
			3: 3,
			4: 4,
			5: 5,
			6: 6,
			7: 7,
			8: 8,
			9: 9,
			10: 10,
			11: 11,
			12: 12
		});
		var A_doctitle_radio = Array();
		A_doctitle_radio.push(O_form.createElement("radio", undefined, undefined, "", "sl", "onClick=disableDoctitle()"));
		A_doctitle_radio.push(O_form.createElement("radio", undefined, undefined, "", "wr", "onClick=disableDoctitle()"));
		O_form.addGroup(A_doctitle_radio, "doctitle_radio", "\u30C9\u30AD\u30E5\u30E1\u30F3\u30C8\u30BF\u30A4\u30C8\u30EB", "<br />");

		if (85 == H_g_sess.pactid) {
			var H_title = {
				"\u4EA4\u901A\u8CBB\u7CBE\u7B97\u66F8": "\u4EA4\u901A\u8CBB\u7CBE\u7B97\u66F8",
				"\u51FA\u5F35\u7CBE\u7B97\u66F8": "\u51FA\u5F35\u7CBE\u7B97\u66F8"
			};
			var deftitle = "\u4EA4\u901A\u8CBB\u7CBE\u7B97\u66F8";
		} else {
			H_title = {
				"\u4EA4\u901A\u8CBB\u8ACB\u6C42\u66F8": "\u4EA4\u901A\u8CBB\u8ACB\u6C42\u66F8",
				"\u51FA\u5F35\u7CBE\u7B97\u66F8": "\u51FA\u5F35\u7CBE\u7B97\u66F8"
			};
			deftitle = "\u4EA4\u901A\u8CBB\u8ACB\u6C42\u66F8";
		}

		O_form.addElement("select", "doctitle", "\u30C9\u30AD\u30E5\u30E1\u30F3\u30C8\u30BF\u30A4\u30C8\u30EB", H_title);
		O_form.addElement("text", "doctitle_free", "\u30C9\u30AD\u30E5\u30E1\u30F3\u30C8\u30BF\u30A4\u30C8\u30EB", {
			size: 20,
			maxlength: 12
		});
		O_form.addElement("date", "printdate", "\u7533\u8ACB\u65E5", {
			emptyOptionText: "&nbsp;",
			format: "Y \u5E74 m \u6708 d \u65E5"
		} + H_def_year);
		O_form.addRule("printdate", "\u7533\u8ACB\u65E5\u306E\u65E5\u4ED8\u304C\u7121\u52B9\u3067\u3059", new CheckdateRule(), undefined, "client");
		O_form.addElement("submit", "submitName", "\u3000\uFF2F\u3000\uFF2B\u3000");
		O_form.setJsWarnings("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");

		if ("" == H_sess.table_no) //未申請はテーブルNoがない
			//現在の月
			{
				var cm = date("n");
			} else //月指定は-1ヶ月
			{
				if ("" != H_sess.cm) {
					cm = H_sess.cm - 1;

					if (1 > cm) {
						cm = 12;
					}
				} else {
					cm = date("n");
				}
			}

		O_form.setDefaults({
			doctitle: deftitle
		});
		O_form.setDefaults({
			doctitle_radio: "sl"
		});
		O_form.setDefaults({
			docmonth: cm
		});
		O_form.setDefaults({
			printdate: {
				Y: A_tod[0],
				m: A_tod[1],
				d: A_tod[2]
			}
		});
		var docmonth = undefined;
		var doctitle = undefined;
		var p_wareki = undefined;
		var p_month = undefined;
		var p_day = undefined;
		var printout_go = false;

		if (true == (undefined !== _POST.docmonth)) {
			docmonth = _POST.docmonth;
		}

		if ("sl" == _POST.doctitle_radio) {
			doctitle = _POST.doctitle;
		} else if ("wr" == _POST.doctitle_radio) {
			doctitle = _POST.doctitle_free;
		}

		if (true == (undefined !== _POST.printdate) && true == Array.isArray(_POST.printdate)) //和暦（平成）
			{
				p_wareki = _POST.printdate.Y - 1988;
				p_month = _POST.printdate.m;
				p_day = _POST.printdate.d;
			}

		var err_msg = "";

		if (undefined != docmonth && undefined != doctitle && undefined != p_wareki && undefined != p_month && undefined != p_day) {
			printout_go = true;
		} else {
			if (true == 0 < _POST.length && undefined == doctitle) {
				err_msg = "\u30C9\u30AD\u30E5\u30E1\u30F3\u30C8\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
			}
		}

		this.get_Smarty().assign("compname", H_g_sess.compname);
		this.get_Smarty().assign("postname", H_g_sess.postname);
		this.get_Smarty().assign("username", H_UserData.username);
		this.get_Smarty().assign("H_modified", H_modified);
		this.get_Smarty().assign("sum", sum);
		this.get_Smarty().assign("p_wareki", p_wareki);
		this.get_Smarty().assign("p_month", p_month);
		this.get_Smarty().assign("p_day", p_day);
		this.get_Smarty().assign("cm", docmonth);
		this.get_Smarty().assign("doctitle", doctitle);
		this.get_Smarty().assign("err_msg", err_msg);
		var renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		O_form.accept(renderer);
		this.get_Smarty().assign("O_form", renderer.toArray());

		if (true == printout_go) {
			if (true == file_exists(this.get_Smarty().template_dir + "/PrintOut/" + H_g_sess.pactid + "/printout.tpl")) {
				this.get_Smarty().display("PrintOut/" + H_g_sess.pactid + "/printout.tpl");
			} else {
				this.get_Smarty().display("PrintOut/printout.tpl");
			}
		} else {
			this.get_Smarty().display("PrintOut/printdate.tpl");
		}
	}

	__destruct() {
		super.__destruct();
	}

};