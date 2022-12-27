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

require("view/Graph/GraphChartViewBase.php");

//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//縦軸のタイトル
//
//@var mixed
//@access private
//
//
//通話時間か？パケットか？
//
//@var mixed
//@access private
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
//表示に使用する物を格納する配列を返す
//
//@author houshiyama
//@since 2008/12/19
//
//@access public
//@return mixed
//
//
//グラフの元生成
//
//@author houshiyama
//@since 2008/12/19
//
//@access private
//@return void
//
//
//グラフ生成、表示
//
//@param array $H_sess
//@param array $H_data
//@access public
//@return void
//
//
//グラフにデータをセット
//
//@author houshiyama
//@since 2008/12/19
//
//@param mixed $H_data
//@param mixed $O_plotarea
//@param mixed $A_tick
//@access private
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
class RecomUseGraphChartView extends GraphChartViewBase {
	constructor(H_param) //元ページのURL
	{
		super(H_param);
		this.H_Local = this.O_Sess.getSelfAll();
		this.ParentURL = "/Graph/RecomUseGraph.php";
	}

	checkCGIParam() //表示モード取得（メンバー変数にもセット）
	{
		if (undefined !== _GET.mode == true) {
			this.H_Local.mode = _GET.mode;
			this.ViewMode = _GET.mode;
		}

		this.O_Sess.setSelfAll(this.H_Local);
	}

	checkParamError(H_sess, H_g_sess) {}

	get_View() {
		return this.H_View;
	}

	setGraphBase() //グラフ要素セット
	{
		this.GraphWidth = 600;
		this.GraphHeight = 300;

		if ("1" == this.ViewMode) {
			this.H_Setting = {
				tuwasum: {
					color: "blue",
					label: "\u901A\u8A71\u6642\u9593"
				}
			};
		} else {
			this.H_Setting = {
				packetsum: {
					color: "red",
					label: "\u30D1\u30B1\u30C3\u30C8\u6570"
				}
			};
		}
	}

	displayChart(H_sess: {} | any[], H_data: {} | any[]) //縦軸のタイトル決定
	//グラフの元作成
	//チャートのインスタンス作成
	//フォントを設定する
	//描画区域を作る
	//描画領域の周囲に余白を追加する
	//水平の区切り線を引く
	//データを設定する
	//X軸の区切りを付ける値
	//X軸を付ける
	//Y軸を付ける
	//凡例を付ける
	//$O_legend->setPlotarea( $O_plotarea );
	//グラフを表示する
	{
		if ("1" == this.ViewMode) {
			if (this.O_Sess.language === "ENG") {
				this.YTitle = "Second\u3000";
			} else {
				this.YTitle = "\u3000\u3000\u3000\u3000\u79D2";
			}
		} else {
			if (this.O_Sess.language === "ENG") {
				this.YTitle = "Packet count\u3000\u3000";
			} else {
				this.YTitle = "\u30D1\u30B1\u30C3\u30C8\u6570";
			}
		}

		this.setGraphBase();
		var O_chart = Image_Graph.factory("graph", [this.GraphWidth, this.GraphHeight]);
		var O_font = O_chart.addNew("font", _SERVER.DOCUMENT_ROOT + "/Bill/ipag.ttf");
		O_font.setSize(9);
		O_chart.setFont(O_font);
		var O_plotarea = Image_Graph.factory("plotarea", ["Image_Graph_Axis", "Image_Graph_Axis"]);
		O_plotarea.setAxisPadding(10, "top");
		O_plotarea.setAxisPadding(10, "right");
		O_plotarea.addNew("line_grid", false, IMAGE_GRAPH_AXIS_Y);
		var A_tick = Array();
		this.setGraphData(H_data, O_plotarea, A_tick);
		var O_axis_x = O_plotarea.getAxis(IMAGE_GRAPH_AXIS_X);

		if (this.O_Sess.language === "ENG") {
			O_axis_x.setTitle("\nMonth");
		} else {
			O_axis_x.setTitle("\n\u6708");
		}

		O_axis_x.setLabelOption("dateformat", "y\nn");
		O_axis_x.setLabelInterval(A_tick);
		var O_axis_percent = O_plotarea.getAxis(IMAGE_GRAPH_AXIS_Y);
		O_axis_percent.setTitle(this.YTitle, "horizontal");
		var O_legend = Image_Graph.factory("legend");
		O_chart.add(Image_Graph.vertical(O_plotarea, O_legend, 90));
		O_chart.done();
		throw die();
	}

	setGraphData(H_data, O_plotarea, A_tick) //系列毎にデータセットを登録する
	{
		{
			let _tmp_0 = this.H_Setting;

			for (var type in _tmp_0) //データセットを作る
			//データをループ
			//線を描画領域に追加する
			//線のスタイルを設定する
			//ここで消さないと何故か初期化されない
			{
				var method = _tmp_0[type];
				var O_dataset = Image_Graph.factory("dataset");
				var H_setting = this.H_Setting[type];
				var color = H_setting.color;
				var label = H_setting.label;
				ksort(H_data);

				for (var ym in H_data) {
					var H_val = H_data[ym];
					var ym_sec = strtotime(ym.substr(0, 4) + "-" + ym.substr(4, 2) + "-1 00:00:00");
					var ym_key = ym.substr(0, 4) + "\\n" + ym.substr(4, 2);

					if (undefined !== H_val[type] == true && is_numeric(H_val[type]) == true) //データポイントを入れる
						{
							O_dataset.addPoint(ym_sec, H_val[type]);
						} else //データポイントを入れる
						{
							O_dataset.addPoint(ym_sec, undefined);
						}

					if (-1 !== A_tick.indexOf(ym_sec) == false) {
						A_tick.push(ym_sec);
					}
				}

				A_tick.sort();
				var O_plot = O_plotarea.addNew("line", O_dataset);
				O_plot.setTitle(label);
				var O_marker = Image_Graph.factory("Image_Graph_Marker_Circle");
				O_marker.setLineColor(color);
				O_marker.setFillColor(color);
				O_marker.setSize(3);
				O_plot.setMarker(O_marker);
				O_plot.setLineColor(color);
				delete O_marker;
			}
		}
	}

	__destruct() {
		super.__destruct();
	}

};