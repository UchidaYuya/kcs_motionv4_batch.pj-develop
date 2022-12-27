//
//利用状況グラフviewクラス
//
//更新履歴：<br>
//2008/12/18 宝子山浩平 作成
//
//@package Graph
//@subpackage View
//@author houshiyama
//@since 2008/12/18
//@filesource
//@uses ViewSmarty
//
//
//error_reporting(E_ALL);
//
//利用状況グラフviewクラス
//
//@package Graph
//@subpackage View
//@author houshiyama
//@since 2008/12/18
//@uses ViewSmarty
//

require("view/Graph/GraphViewBase.php");

require("MtPostUtil.php");

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
//フォームの要素
//
//@var mixed
//@access protected
//
//
//コンストラクタ <br>
//
//@author houshiyama
//@since 2008/12/18
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//自身のセッションを取得する
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return array
//
//
//セッションが無い時デフォルト値を入れる
//
//@author houshiyama
//@since 2008/12/18
//
//@access private
//@return void
//
//
//パラメータのチェックを行う<br>
//
//@author houshiyama
//@since 2008/12/18
//
//@access public
//@return void
//@uses MtExceptReload
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/12/18
//
//@access public
//@return void
//
//
//パラメータチェック <br>
//
//@author houshiyama
//@since 2008/12/18
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//
//グラフ表示ボタンのフォーム
//
//@author houshiyama
//@since 2008/12/22
//
//@access public
//@return void
//
//
//チャートのURL生成
//
//@author houshiyama
//@since 2008/12/19
//
//@param mixed $H_param
//@access public
//@return void
//
//
//パンくずリンクを返す
//
//@author nakanita
//@since 2008/05/22
//
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
//@since 2008/12/19
//
//@param array $H_sess
//@param array $H_data
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/12/18
//
//@access public
//@return void
//
class RecomUseGraphView extends GraphViewBase {
	static PUB = "/Graph";

	constructor(H_param) {
		super(H_param);
		this.H_Local = this.O_Sess.getSelfAll();
		this.GraphWidth = 600;
		this.GraphHeight = 300;
		this.ChartURLTuwa = "/Graph/RecomUseGraphChart.php?mode=1";
		this.ChartURLPacket = "/Graph/RecomUseGraphChart.php?mode=2";
		this.HiddenValTuwa = "0";
		this.HiddenValPacket = "0";

		if (this.O_Sess.language === "ENG") {
			this.ButtonLabelTuwa = "Display duration chart";
			this.ButtonLabelPacket = "Display packet count chart";
		} else {
			this.ButtonLabelTuwa = "\u901A\u8A71\u6642\u9593\u30B0\u30E9\u30D5\u3092\u8868\u793A";
			this.ButtonLabelPacket = "\u30D1\u30B1\u30C3\u30C8\u6570\u30B0\u30E9\u30D5\u3092\u8868\u793A";
		}
	}

	getSelfSession() {
		var H_sess = this.O_Sess.getSelfAll();

		if (H_sess == undefined) {
			H_sess = Array();
		}

		return H_sess;
	}

	setDefaultSession() //範囲の指定が無ければ配下部署
	//パケットグラフ表示（デフォルトは非表示）
	{
		if (undefined !== this.H_Local.range == false) {
			this.H_Local.range = "all";
		}

		if (undefined !== this.H_Local.hidden_val_tuwa == false) {
			this.H_Local.hidden_val_tuwa = this.HiddenValTuwa;
		}

		if ("0" == this.H_Local.hidden_val_tuwa) {
			this.H_Local.is_chart_tuwa = false;
		} else {
			this.H_Local.is_chart_tuwa = true;
		}

		if (undefined !== this.H_Local.hidden_val_packet == false) {
			this.H_Local.hidden_val_packet = this.HiddenValPacket;
		}

		if ("0" == this.H_Local.hidden_val_packet) {
			this.H_Local.is_chart_packet = false;
		} else {
			this.H_Local.is_chart_packet = true;
		}
	}

	checkCGIParam() //範囲の指定があれば入れる
	{
		this.setDefaultSession();
		var from_flg = false;

		if (undefined !== _POST.range == true) {
			this.H_Local.range = _POST.range;
			from_flg = true;
		}

		if (undefined !== _POST.carid == true) {
			this.H_Local.carid = _POST.carid;
			this.H_Local.carname = _POST.carname;
			from_flg = true;
		}

		if (undefined !== _POST.telno == true) {
			this.H_Local.telno = _POST.telno;
			from_flg = true;
		}

		if (undefined !== _POST.viewbutton_tuwa == true) //表示
			{
				if ("0" == _POST.hidden_val_tuwa) {
					this.H_Local.is_chart_tuwa = true;

					if (this.O_Sess.language === "ENG") {
						this.H_Local.viewbutton_tuwa = "Hide duration chart";
						this.ButtonLabelTuwa = "Hide duration chart";
					} else {
						this.H_Local.viewbutton_tuwa = "\u901A\u8A71\u6642\u9593\u30B0\u30E9\u30D5\u3092\u975E\u8868\u793A";
						this.ButtonLabelTuwa = "\u901A\u8A71\u6642\u9593\u30B0\u30E9\u30D5\u3092\u975E\u8868\u793A";
					}

					this.HiddenValTuwa = "1";
				} else {
					this.H_Local.is_chart_tuwa = false;

					if (this.O_Sess.language === "ENG") {
						this.H_Local.viewbutton_tuwa = "Display duration chart";
						this.ButtonLabelTuwa = "Display duration chart";
					} else {
						this.H_Local.viewbutton_tuwa = "\u901A\u8A71\u6642\u9593\u30B0\u30E9\u30D5\u3092\u8868\u793A";
						this.ButtonLabelTuwa = "\u901A\u8A71\u6642\u9593\u30B0\u30E9\u30D5\u3092\u8868\u793A";
					}

					this.HiddenValTuwa = "0";
				}

				this.H_Local.hidden_val_packet = _POST.hidden_val_packet;

				if ("1" == this.H_Local.hidden_val_packet) {
					if (this.O_Sess.language === "ENG") {
						this.H_Local.viewbutton_packet = "Hide packet count chart";
						this.ButtonLabelPacket = "Hide packet count chart";
					} else {
						this.H_Local.viewbutton_packet = "\u30D1\u30B1\u30C3\u30C8\u6570\u30B0\u30E9\u30D5\u3092\u975E\u8868\u793A";
						this.ButtonLabelPacket = "\u30D1\u30B1\u30C3\u30C8\u6570\u30B0\u30E9\u30D5\u3092\u975E\u8868\u793A";
					}

					this.H_Local.is_chart_packet = true;
				} else {
					if (this.O_Sess.language === "ENG") {
						this.H_Local.viewbutton_packet = "Display packet count chart";
						this.ButtonLabelPacket = "Display packet count chart";
					} else {
						this.H_Local.viewbutton_packet = "\u30D1\u30B1\u30C3\u30C8\u6570\u30B0\u30E9\u30D5\u3092\u8868\u793A";
						this.ButtonLabelPacket = "\u30D1\u30B1\u30C3\u30C8\u6570\u30B0\u30E9\u30D5\u3092\u8868\u793A";
					}

					this.H_Local.is_chart_packet = false;
				}

				_POST.viewbutton_tuwa = this.ButtonLabelTuwa;
				_POST.hidden_val_tuwa = this.HiddenValTuwa;
				_POST.viewbutton_packet = this.H_Local.viewbutton_packet;
			} else if (undefined !== _POST.viewbutton_packet == true) //表示
			{
				if ("0" == _POST.hidden_val_packet) {
					this.H_Local.is_chart_packet = true;

					if (this.O_Sess.language === "ENG") {
						this.H_Local.viewbutton_packet = "Hide packet count chart";
						this.ButtonLabelPacket = "Hide packet count chart";
					} else {
						this.H_Local.viewbutton_packet = "\u30D1\u30B1\u30C3\u30C8\u6570\u30B0\u30E9\u30D5\u3092\u975E\u8868\u793A";
						this.ButtonLabelPacket = "\u30D1\u30B1\u30C3\u30C8\u6570\u30B0\u30E9\u30D5\u3092\u975E\u8868\u793A";
					}

					this.HiddenValPacket = "1";
				} else {
					this.H_Local.is_chart_packet = false;

					if (this.O_Sess.language === "ENG") {
						this.H_Local.viewbutton_packet = "Display packet count chart";
						this.ButtonLabelPacket = "Display packet count chart";
					} else {
						this.H_Local.viewbutton_packet = "\u30D1\u30B1\u30C3\u30C8\u6570\u30B0\u30E9\u30D5\u3092\u8868\u793A";
						this.ButtonLabelPacket = "\u30D1\u30B1\u30C3\u30C8\u6570\u30B0\u30E9\u30D5\u3092\u8868\u793A";
					}

					this.HiddenValPacket = "0";
				}

				this.H_Local.hidden_val_tuwa = _POST.hidden_val_tuwa;

				if ("1" == this.H_Local.hidden_val_tuwa) {
					if (this.O_Sess.language === "ENG") {
						this.H_Local.viewbutton_tuwa = "Hide duration chart";
						this.ButtonLabelTuwa = "Hide duration chart";
					} else {
						this.H_Local.viewbutton_tuwa = "\u901A\u8A71\u6642\u9593\u30B0\u30E9\u30D5\u3092\u975E\u8868\u793A";
						this.ButtonLabelTuwa = "\u901A\u8A71\u6642\u9593\u30B0\u30E9\u30D5\u3092\u975E\u8868\u793A";
					}

					this.H_Local.is_chart_tuwa = true;
				} else {
					if (this.O_Sess.language === "ENG") {
						this.H_Local.viewbutton_tuwa = "Display duration chart";
						this.ButtonLabelTuwa = "Display duration chart";
					} else {
						this.H_Local.viewbutton_tuwa = "\u901A\u8A71\u6642\u9593\u30B0\u30E9\u30D5\u3092\u8868\u793A";
						this.ButtonLabelTuwa = "\u901A\u8A71\u6642\u9593\u30B0\u30E9\u30D5\u3092\u8868\u793A";
					}

					this.H_Local.is_chart_tuwa = false;
				}

				_POST.viewbutton_packet = this.ButtonLabelPacket;
				_POST.hidden_val_packet = this.HiddenValPacket;
				_POST.viewbutton_tuwa = this.H_Local.viewbutton_tuwa;
			}

		this.O_Sess.setSelfAll(this.H_Local);

		if (true == from_flg) {
			MtExceptReload.raise(undefined);
		}
	}

	getHeaderJS() {}

	checkParamError(H_sess, H_g_sess) {}

	makeViewForm() //ボタンだけのフォーム作成（ラベル、値はおのおの設定）
	//クイックフォームオブジェクト生成
	{
		var A_formelement = [{
			name: "viewbutton_tuwa",
			label: this.ButtonLabelTuwa,
			inputtype: "submit"
		}, {
			name: "hidden_val_tuwa",
			inputtype: "hidden",
			data: this.HiddenValTuwa
		}, {
			name: "viewbutton_packet",
			label: this.ButtonLabelPacket,
			inputtype: "submit"
		}, {
			name: "hidden_val_packet",
			inputtype: "hidden",
			data: this.HiddenValPacket
		}];
		this.H_View.O_FormUtil = new QuickFormUtil("form");
		this.H_View.O_FormUtil.setFormElement(A_formelement);
		this.O_Form = this.H_View.O_FormUtil.makeFormObject();
	}

	makeChartLinkURL(H_param) {}

	makePankuzuLink() {
		var O_link = new MakePankuzuLink();

		if (this.O_Sess.language === "ENG") {
			var H_link = {
				"/Recom3/menu.php": "Plan simulation",
				"": "Utilization status chart"
			};
			return O_link.makePankuzuLinkHTMLEng(H_link);
		} else {
			H_link = {
				"/Recom3/menu.php": "\u6599\u91D1\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3",
				"": "\u5229\u7528\u72B6\u6CC1\u30B0\u30E9\u30D5"
			};
			return O_link.makePankuzuLinkHTML(H_link);
		}
	}

	displaySmartyPeculiar(H_sess: {} | any[], H_data: {} | any[]) //通話グラフ表示ならば
	{
		var O_post = new MtPostUtil();
		H_sess.postname = O_post.getPostTreeBand(this.O_Sess.pactid, this.O_Sess.postid, this.O_Sess.current_postid, "", " -> ", "", 1, true, false);
		this.get_Smarty().assign("H_sess", H_sess);
		this.get_Smarty().assign("is_chart_tuwa", H_sess.is_chart_tuwa);
		this.get_Smarty().assign("is_chart_packet", H_sess.is_chart_packet);

		if (this.O_Sess.language === "ENG") {
			this.get_Smarty().assign("graph_title_tuwa", "Change in average duration");
			this.get_Smarty().assign("graph_title_packet", "Change in average packet count");
		} else {
			this.get_Smarty().assign("graph_title_tuwa", "\u5E73\u5747\u901A\u8A71\u6642\u9593\u306E\u63A8\u79FB");
			this.get_Smarty().assign("graph_title_packet", "\u5E73\u5747\u30D1\u30B1\u30C3\u30C8\u6570\u306E\u63A8\u79FB");
		}

		if (true == H_sess.is_chart_tuwa) {
			this.get_Smarty().assign("chart_url_tuwa", this.ChartURLTuwa);
			this.get_Smarty().assign("chart_width", this.GraphWidth);
			this.get_Smarty().assign("chart_height", this.GraphHeight);
		}

		if (true == H_sess.is_chart_packet) {
			this.get_Smarty().assign("chart_url_packet", this.ChartURLPacket);
			this.get_Smarty().assign("chart_width", this.GraphWidth);
			this.get_Smarty().assign("chart_height", this.GraphHeight);
		}

		if (this.O_Sess.language === "ENG") {
			this.get_Smarty().assign("title", "Utilization status chart");
		} else {
			this.get_Smarty().assign("title", "\u5229\u7528\u72B6\u6CC1\u30B0\u30E9\u30D5");
		}
	}

	__destruct() {
		super.__destruct();
	}

};