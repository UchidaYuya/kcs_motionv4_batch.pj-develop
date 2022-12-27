//
//シミュレーション結果表示のＶｉｅｗ
//
//更新履歴：<br>
//2008/07/25 中西達夫 作成
//
//@uses ViewSmarty
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/07/17
//
//
//error_reporting(E_ALL);
//require_once("view/QuickFormUtil.php");
//require_once("HTML/QuickForm/Renderer/ArraySmarty.php");
//ページリンクを作る
//function makePageLinkHTML( $cnt, $limit, $offset, $view=10 )
//
//シミュレーション結果表示のＶｉｅｗ
//
//@uses ViewSmarty
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/07/25
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

require("view/ViewFinish.php");

require("view/MakePageLink.php");

//
//ディレクトリ名
//
//
//デフォルトの1ページ表示数
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
//フォームオブジェクト
//
//@var mixed
//@access protected
//
//
//カラムの表示順序を記載した配列
//
//@var mixed
//@access private
//
//
//どのカラムを表示するかを記載した配列
//
//@var mixed
//@access private
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param MtSetting $O_Set0 共通設定オブジェクト
//@param MtOutput $O_Out0 共通出力オブジェクト
//@access public
//@return void
//
//
//ディレクトリ固有のセッションを取得する
//
//@author nakanita
//@since 2008/07/29
//
//@access public
//@return void
//
//
//自身のセッションを取得する
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return mixed
//
//
//ログインのチェックを行う
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//protected function checkLogin(){
//// ログインチェックを行わないときには、何もしないメソッドで親を上書きする
//}
//
//CGIパラメータのチェックを行う
//
//セッションにCGIパラメーターを付加する<br/>
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//
//上限金額、削減金額をセッションから消す<br>
//金額が範囲を超えてしまった場合に使用する。
//
//@author nakanita
//@since 2008/10/31
//
//@access public
//@return void
//
//
//"YYYYMM"で与えられた文字列をパブリックセッションに付ける
//
//@author nakanita
//@since 2009/02/02
//
//@param string $yyyy
//@param string $mm
//@access private
//@return void
//
//
//キャリア情報をパブリックセッションに付ける
//
//@author nakanita
//@since 2009/02/02
//
//@param integer $carid
//@param string $carname
//@access private
//@return void
//
//
//パラメーターのチェックを行う
//
//@author nakanita
//@since 2008/07/23
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//
//パンくずリンクを返す
//
//@author nakanita
//@since 2008/09/18
//
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return void
//
//
//表示カラムの順序を並べ替える
//
//@author nakanita
//@since 2008/08/15
//
//@access public
//@return void
//
//
//表示ヘッダの順序を並べ替える
//
//@author nakanita
//@since 2008/10/08
//
//@param mixed $mm
//@access private
//@return void
//
//
//表示カラムと順序を整形する
//
//@author nakanita
//@since 2008/10/08
//
//@param mixed $H_p_sess
//@access public
//@return void
//
//
//手入力で値がとびとびになった配列を整形する
//
//@author nakanita
//@since 2008/10/08
//
//@param array $A_arrange
//@access private
//@return array
//
//
//Smartyを用いた画面表示
//
//@author nakanita
//@since 2008/02/08
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return void
//
class RecomResultView extends ViewSmarty {
	static PUB = "/Recom3";
	static DEF_LIMIT = 30;

	constructor(H_param: {} | any[] = Array()) //デフォルトの並び順
	{
		this.O_Sess = MtSession.singleton();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.H_Dir = this.O_Sess.getPub(RecomResultView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.A_Arrange = [0, 1, 2, 3, 4, 5, 6];
		this.H_Dispcol = {
			postname: "on",
			cirname: "on",
			telno_view: "on",
			username: 0,
			employeecode: 0,
			buyselname: "on",
			planname: "on",
			recbuyselname: "on",
			recplanname: "on",
			mass_target_1: "on",
			avecharge: "on",
			diffcharge: "on",
			penalty_money: "on",
			penalty_monthcnt: "on",
			order: "on",
			division: "on",
			alert: "on"
		};
	}

	getPubSession() {
		return this.H_Dir;
	}

	getSelfSession() {
		var H_sess = this.O_Sess.getSelfAll();
		return H_sess;
	}

	getView() {
		return this.H_View;
	}

	checkCGIParam() //通常のパラメーターはPOSTで飛ばしている
	//削減額指定方法の選択
	{
		var sess_flg = false;

		if (undefined !== _POST.range == true && _POST.range != "") //POSTでrangeが飛んでくるときを初回と見なす。
			//この初回に限り注意書きを出すようにする。
			{
				this.H_Local.post.range = _POST.range;
				sess_flg = true;
				this.H_Local.post.is_first = 1;
			}

		if (undefined !== _POST.period == true && _POST.period != "") {
			this.H_Local.post.period = _POST.period;
			sess_flg = true;
		}

		if (undefined !== _POST.telno == true && _POST.telno != "") {
			this.H_Local.post.telno = _POST.telno;
			sess_flg = true;
		}

		if (undefined !== _POST.carid == true && _POST.carid != "") {
			this.H_Local.post.carid = _POST.carid;
			sess_flg = true;
		}

		if (undefined !== _POST.reset_skip_telno && _POST.reset_skip_telno) {
			var session_key = "/Recom3/skip_telno.php";
			delete _SESSION[session_key];
		}

		if (undefined !== _POST.division == true && _POST.division != "") {
			this.H_Local.post.division = _POST.division;
			sess_flg = true;
		}

		if (undefined !== _POST.buysel_post == true) //確実に送られるbuysel_postを見る
			//条件指定シミュレーション時はbuysel_postの値から取得する
			{
				if (undefined !== _POST.disp_point == true && _POST.disp_point != 0) {
					if (_POST.buysel_post == 1) {
						this.H_Local.post.buysel = "on";
					} else {
						this.H_Local.post.buysel = "";
					}
				} else //通常の場合はPOSTから取得する
					{
						this.H_Local.post.buysel = _POST.buysel;
					}

				sess_flg = true;
			}

		if (undefined !== _POST.pakefree == true && _POST.pakefree.length) {
			this.H_Local.post.pakefree = _POST.pakefree;
			sess_flg = true;
		}

		if (undefined !== _POST.disp_point == true) //&& $_POST["disp_point"] != "" ){
			//disp_point が空でやってきたときはクリアーする
			//disp_point が入っているときは条件指定の結果表示
			//そのときはパラメータ値をパブリックセッションに付ける
			{
				this.H_Local.post.disp_point = _POST.disp_point;
				sess_flg = true;

				if (_POST.disp_point != "" && _POST.disp_point != 0) //部署ＩＤ、current_postid を取得する
					{
						this.setYYYYMMSession(_POST.year, _POST.month);
						this.setCarrierInfo(_POST.carid, _POST.carname);
						this.H_Local.post.postid = _POST.postid;
						this.H_Local.post.postname = _POST.postname;
					}
			}

		if (_POST.limit != "") //ページを初期化する
			{
				var limit = +_POST.limit;

				if (is_numeric(limit) === false || limit <= 0) //異常値
					//デフォルト値をセット
					{
						limit = RecomResultView.DEF_LIMIT;
					}

				setcookie("recom_list_limit", limit, Date.now() / 1000 + 60 * 60 * 24 * 30, "/");
				delete this.H_Local.get.p;
				this.H_Local.ptn.limit = limit;
				sess_flg = true;
			} else //デフォルト値
			{
				if (_COOKIE.recom_list_limit < 1) {
					_COOKIE.recom_list_limit = RecomResultView.DEF_LIMIT;
				}

				this.H_Local.ptn.limit = _COOKIE.recom_list_limit;
			}

		if (_POST.border_sel != "") //削減値を指定'on'/全て'all'
			{
				this.H_Local.ptn.border_sel = _POST.border_sel;
				sess_flg = true;
			} else if (false === (undefined !== this.H_Local.ptn.border_sel)) //デフォルト値は"on"
			{
				this.H_Local.ptn.border_sel = "on";
				sess_flg = true;
			}

		if (_POST.border != "") //削減値を指定した場合
			{
				if (is_numeric(_POST.border)) //数字チェック
					{
						this.H_Local.ptn.border = _POST.border;
					} else //数字ではない -- デフォルト値を代入.
					{
						this.H_Local.ptn.border = 1;
					}

				sess_flg = true;
			} else if (false === (undefined !== this.H_Local.ptn.border)) //デフォルトは1.
			{
				this.H_Local.ptn.border = 1;
				sess_flg = true;
			}

		if (_POST.slash != "") //上限値を指定した場合
			{
				if (is_numeric(_POST.slash)) //数字チェック
					{
						this.H_Local.ptn.slash = _POST.slash;
					} else //数字ではない -- デフォルト値は空＝指定なし
					{
						this.H_Local.ptn.slash = "";
					}

				sess_flg = true;
			} else if (undefined !== _POST.slash && _POST.slash === "") //空白文字が指定されていたら
			{
				this.H_Local.ptn.slash = "";
				sess_flg = true;
			}

		if (_GET.p != "") {
			this.H_Local.get.p = _GET.p;
			sess_flg = true;
		} else if (false === (undefined !== this.H_Local.get.p)) //デフォルトページは1
			{
				this.H_Local.get.p = 1;
				sess_flg = true;
			}

		if (_GET.s != "") //ページをデフォルトの1に戻す
			{
				this.H_Local.get.s = _GET.s;
				this.H_Local.get.p = 1;
				sess_flg = true;
			} else if (false === (undefined !== this.H_Local.get.s)) //デフォルトソート
			{
				this.H_Local.get.s = "0|a";
				sess_flg = true;
			}

		if (sess_flg == true) {
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}
	}

	resetBorderSlash() {
		delete this.H_Local.ptn.border;
		delete this.H_Local.ptn.slash;
		this.O_Sess.setSelfAll(this.H_Local);
	}

	setYYYYMMSession(yyyy, mm) {
		this.H_Dir.year = yyyy;
		this.H_Dir.month = mm;
		this.O_Sess.setPub(RecomResultView.PUB, this.H_Dir);
	}

	setCarrierInfo(carid, carname) {
		this.H_Dir.carid = carid;
		this.H_Dir.carname = carname;
		this.O_Sess.setPub(RecomResultView.PUB, this.H_Dir);
	}

	checkParamError(H_sess, H_g_sess) //直打ち対策、必須パラメータチェック
	{
		if (H_g_sess.pactid == "" || H_sess.post.range == "" || H_sess.post.period == "" || H_sess.post.carid == "") {
			this.errorOut(15, "\u5FC5\u9808\u30D1\u30E9\u30E1\u30FC\u30BF\u30FC\u304C\u7121\u3044");
		}

		var year = +this.H_Dir.year;
		var month = +this.H_Dir.month;

		if (year < 2000) {
			this.errorOut(8, "\u30D1\u30D6\u30EA\u30C3\u30AF\u30BB\u30C3\u30B7\u30E7\u30F3\u306B\u5E74(year)\u306E\u6307\u5B9A\u304C\u7121\u3044.");
		}

		if (month < 1 && 12 < month) {
			this.errorOut(8, "\u30D1\u30D6\u30EA\u30C3\u30AF\u30BB\u30C3\u30B7\u30E7\u30F3\u306B\u6708(month)\u306E\u6307\u5B9A\u304C\u7121\u3044");
		}
	}

	makePankuzuLink() {
		var O_link = new MakePankuzuLink();
		var method = "makePankuzuLinkHTML";

		switch (this.getSiteMode()) {
			case ViewBaseHtml.SITE_SHOP:
				var H_link = {
					"../list.php": "\u304A\u5BA2\u69D8\u4E00\u89A7\u30FB\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3",
					"": "\u6599\u91D1\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3"
				};
				var type = "shop";
				break;

			case ViewBaseHtml.SITE_USER:
			default:
				if (this.O_Sess.language === "ENG") {
					H_link = {
						"menu.php": "Plan simulation",
						"": "Simulation result"
					};
					method = "makePankuzuLinkHTMLEng";
				} else {
					H_link = {
						"menu.php": "\u6599\u91D1\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3",
						"": "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u7D50\u679C"
					};
				}

				type = "user";
				break;
		}

		return O_link[method](H_link, type, true);
	}

	getHeaderJS() // ToDo * まだ使っていない
	{}

	arrangeColumn() {
		var idx_i = 0;

		for (var A_table of Object.values(this.H_View.H_table)) //userpostid が空でなければ付加する
		//A_Arrangeに従って順序を付け替えたカラムを付加する
		{
			if (A_table.userpostid != "") {
				var userpost = "<br>(" + A_table.userpostid + ")";
			} else {
				userpost = "";
			}

			if (this.O_Sess.language === "ENG") //本来の順序に並んでいる配列
				{
					var A_cols = [A_table.postname + userpost, A_table.cirname_eng, A_table.telno_view, A_table.username, A_table.employeecode, A_table.buyselname_eng, A_table.planname_eng + "<br>" + A_table.packetname_eng];
				} else //本来の順序に並んでいる配列
				{
					A_cols = [A_table.postname + userpost, A_table.cirname, A_table.telno_view, A_table.username, A_table.employeecode, A_table.buyselname, A_table.planname + "<br>" + A_table.packetname];
				}

			var idx_j = 0;

			for (var arr of Object.values(this.A_Arrange)) {
				var col = "col_" + arr;
				this.H_View.H_table[idx_i][col] = A_cols[idx_j];
				idx_j++;
			}

			idx_i++;
		}
	}

	arrangeHeader(mm) //本来の順序に並んでいるヘッダ内容
	//本来の順番に並んでいる配列
	//A_Arrangeに従って順序を付け替えたカラムを付加する
	{
		if (this.O_Sess.language === "ENG") {
			var A_cols = ["Department<br><a href=\"?s=0|a\" class=\"csPathLink\">\u25B2</a>name<a href=\"?s=0|d\" class=\"csPathLink\">\u25BC</a>", "Service<br><a href=\"?s=1|a\" class=\"csPathLink\">\u25B2</a>type<a href=\"?s=1|d\" class=\"csPathLink\">\u25BC</a>", "Telephone<br><a href=\"?s=2|a\" class=\"csPathLink\">\u25B2</a>number<a href=\"?s=2|d\" class=\"csPathLink\">\u25BC</a>", "User", "Employee<br>number", "Current<br>purchase<br>method", "<a href=\"?s=3|a\" class=\"csPathLink\">\u25B2</a>" + "<span onmouseover=\"return overlib(" + "'" + "Billing plan as of the end of " + date("F", strtotime("2000-" + mm + "-1")) + "'" + ");\" onmouseout=\"nd();\">Plan</span><a href=\"?s=3|d\" class=\"csPathLink\">\u25BC</a><br/>" + "<a href=\"?s=4|a\" class=\"csPathLink\">\u25B2</a>" + "<span onmouseover=\"return overlib(" + "'" + "Packet as of the end of " + date("F", strtotime("2000-" + mm + "-1")) + "'" + ");\" onmouseout=\"nd();\">Packet</span><a href=\"?s=4|d\" class=\"csPathLink\">\u25BC</a>"];
		} else {
			A_cols = ["<a href=\"?s=0|a\" class=\"csPathLink\">\u25B2</a>\u90E8\u7F72\u540D<a href=\"?s=0|d\" class=\"csPathLink\">\u25BC</a>", "\u56DE\u7DDA<br><a href=\"?s=1|a\" class=\"csPathLink\">\u25B2</a>\u7A2E\u5225<a href=\"?s=1|d\" class=\"csPathLink\">\u25BC</a>", "<a href=\"?s=2|a\" class=\"csPathLink\">\u25B2</a>\u96FB\u8A71\u756A\u53F7<a href=\"?s=2|d\" class=\"csPathLink\">\u25BC</a>", "\u4F7F\u7528\u8005", "\u793E\u54E1\u756A\u53F7", "\u73FE\u884C<br/>\u8CFC\u5165\u65B9\u5F0F", "<a href=\"?s=3|a\" class=\"csPathLink\">\u25B2</a>" + "<span onmouseover=\"return overlib(" + "'" + mm + "\u6708\u672B\u65E5\u6642\u70B9\u3067\u306E\u6599\u91D1\u30D7\u30E9\u30F3\u3067\u3059" + "'" + ");\" onmouseout=\"nd();\">\u6599\u91D1\u30D7\u30E9\u30F3</span><a href=\"?s=3|d\" class=\"csPathLink\">\u25BC</a><br/>" + "<a href=\"?s=4|a\" class=\"csPathLink\">\u25B2</a>" + "<span onmouseover=\"return overlib(" + "'" + mm + "\u6708\u672B\u65E5\u6642\u70B9\u3067\u306E\u30D1\u30B1\u30C3\u30C8\u3067\u3059" + "'" + ");\" onmouseout=\"nd();\">\u30D1\u30B1\u30C3\u30C8</span><a href=\"?s=4|d\" class=\"csPathLink\">\u25BC</a>"];
		}

		var A_dispcols = ["postname", "cirname", "telno_view", "username", "employeecode", "buyselname", "planname"];
		var idx = 0;

		for (var arr of Object.values(this.A_Arrange)) //指定の順番にヘッダの表示内容を入れる
		//H_Dispcolに順序を入れ替えたカラムの表示/非表示を追加する
		{
			var col = "hd_" + arr;
			this.H_View.H_header[col] = A_cols[idx];
			var dispcol = "disp_" + idx;
			this.H_Dispcol[dispcol] = this.H_Dispcol[A_dispcols[arr]];
			idx++;
		}
	}

	arrangeDisp(H_p_sess) //セッションに値があれば上書きする
	{
		if (H_p_sess.A_arrange != undefined && Array.isArray(H_p_sess.A_arrange)) //セッション値は１始まり、必要なのは０始まり。
			//セッション値は単純な数値入力なので、何が入っているかわからない。
			//いったんソートして数を振り直す必要がある。
			{
				this.A_Arrange = this.arrangeIlligalArray(H_p_sess.A_arrange);
			}

		if (H_p_sess.H_dispcol != undefined && Array.isArray(H_p_sess.H_dispcol)) {
			this.H_Dispcol = H_p_sess.H_dispcol;
		}

		var mm = +H_p_sess.month;
		this.arrangeColumn();
		this.arrangeHeader(mm);
	}

	arrangeIlligalArray(A_arrange) //値でソートする
	//キーだけを返す
	{
		var H_sort = Array();
		var idx = 0;

		for (var item of Object.values(A_arrange)) //連想配列に値を付けて
		{
			H_sort[idx] = item;
			idx++;
		}

		asort(H_sort);
		return Object.keys(H_sort);
	}

	displaySmarty() //表示に必要な項目を設定
	//最初のページを表す
	//初回であることを表す
	//初回フラグだけは特別に、表示を終えたら毎回セッションから消す
	//ここでセッション再設定している
	//フォームを表示
	//var_dump( $this->H_View["H_table"] );
	//var_dump( $this->H_Dispcol );
	//SQL条件文、エンコードして付加する
	//var_dump( $this->H_View["H_header"] );	// * DEBUG *
	//var_dump( $this->H_View["H_table"] );	// * DEBUG *
	//表示
	{
		if (this.getSiteMode() == ViewBaseHtml.SITE_SHOP) //ショップの場合、ショップ名、メンバー名を表示する
			{
				var page_path = "shop_submenu";
				var shop_person = this.O_Sess.name + " " + this.O_Sess.personname;
				this.get_Smarty().assign("shop_person", shop_person);
			} else {
			page_path = "page_path";
		}

		this.get_Smarty().assign(page_path, this.H_View.page_path);
		this.get_Smarty().assign("post_path", this.H_View.post_path);
		this.get_Smarty().assign("page_link", this.H_View.page_link);
		this.get_Smarty().assign("current", this.H_View.current);
		this.get_Smarty().assign("is_first", this.H_View.is_first);
		this.H_Local.post.is_first = 0;
		this.O_Sess.setSelfAll(this.H_Local);
		this.get_Smarty().assign("H_sim", this.H_View.H_sim);
		this.get_Smarty().assign("H_sum", this.H_View.H_sum);
		this.get_Smarty().assign("H_header", this.H_View.H_header);
		this.get_Smarty().assign("H_table", this.H_View.H_table);
		this.get_Smarty().assign("H_dispcol", this.H_Dispcol);
		this.get_Smarty().assign("fromsql", str_rot13(base64_encode(this.H_View.fromsql)));
		this.get_Smarty().assign("wheresql", str_rot13(base64_encode(this.H_View.wheresql)));
		this.get_Smarty().assign("bordersql", str_rot13(base64_encode(this.H_View.bordersql)));
		this.get_Smarty().assign("limit", this.H_View.limit);
		this.get_Smarty().assign("border_sel", this.H_View.border_sel);
		this.get_Smarty().assign("border", this.H_View.border);
		this.get_Smarty().assign("border_msg", this.H_View.border_msg);

		if (this.H_View.slash != 0) {
			this.get_Smarty().assign("slash", this.H_View.slash);
		} else //0 の場合は空文字に戻す
			{
				this.get_Smarty().assign("slash", "");
			}

		this.get_Smarty().assign("fnc_tel_vw", this.H_View.fnc_tel_vw);
		this.get_Smarty().assign("fnc_recom_download", this.H_View.fnc_recom_download);
		this.get_Smarty().assign("fnc_sim_order", this.H_View.fnc_sim_order);
		this.get_Smarty().assign("fnc_tel_division", this.H_View.fnc_tel_division);
		this.get_Smarty().assign("fnc_show_admonition", this.H_View.fnc_show_admonition);
		this.get_Smarty().assign("telno_serial_all", this.H_View.telno_serial_all);
		this.get_Smarty().assign("telno_skip_all", this.H_View.telno_skip_all);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};