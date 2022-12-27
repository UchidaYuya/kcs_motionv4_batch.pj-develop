//
//エクセルファイル生成View
//
//更新履歴：<br>
//2008/06/25 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/06/25
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//エクセルファイル生成View
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/06/25
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("Spreadsheet/Excel/Writer.php");

require("HTML/Progress2.php");

//
//ディレクトリ名
//
//
//ETCカード会社
//
//
//購買会社
//
//
//各MID（種別ID）
//
//
//コピー機メーカー
//
//
//運送会社
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
//データ行数
//
//@var mixed
//@access private
//
//
//列数
//
//@var mixed
//@access private
//
//
//金額の列数
//
//@var mixed
//@access private
//
//
//1ページの行数
//
//@var mixed
//@access private
//
//
//表紙の行数
//
//@var mixed
//@access private
//
//
//コンストラクタ <br>
//
//@author houshiyama
//@since 2008/06/25
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//セッションが無い時デフォルト値を入れる
//
//カレント部署がセッションが無ければ作る（デフォルトは自部署）<br>
//セッションのカレント部署とこのページのカレント部署が違っていたら同期してリロード
//
//@author houshiyama
//@since 2008/06/25
//
//@access private
//@return void
//
//
//CGIパラメータのチェックを行う<br>
//
//GETパラメータ（シリアル）を配列に入れる<br>
//
//配列をセッションに入れる<br>
//
//@author houshiyama
//@since 2008/06/25
//
//@access public
//@return void
//@uses MtExceptReload
//
//
//ローカルセッションを取得する
//
//@author houshiyama
//@since 2008/06/25
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author houshiyama
//@since 2008/06/25
//
//@access public
//@return mixed
//
//
//パラメータチェック <br>
//
//@author houshiyama
//@since 2008/06/25
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//
//UTF-8をSJISに変換する
//
//@author houshiyama
//@since 2008/06/25
//
//@param mixed $var
//@access public
//@return void
//
//
//スプレッドシートのフォーマットを追加する
//
//@author houshiyama
//@since 2008/06/25
//
//@param mixed $O_book
//Excelブック
//@param mixed $H_format
//作成済みのフォーマット
//フォーマットの名称から、フォーマットインスタンスへのハッシュである。
//@param mixed $format_name
//新規に作成するフォーマットの名称
//この名前で、$H_formatにフォーマットを追加する。
//@param mixed $H_param
//フォーマットの内容
//以下のキーワードから、該当する値へのハッシュである。
//numFormatが存在しなければ#,##0が有効になる。
//left		セル左側の線幅(1なら細線、2なら太線)
//right		セル右側の線幅
//top			セル上側の線幅
//bottom		セル下側の線幅
//all			セルの四辺の線幅
//pattern		網掛けパターン(通常は2か4を使用するが、色々ある)
//size		フォントサイズ
//align		centerなら中央寄せなど
//bold		太字なら1
//numformat	数値フォーマット(#.##0など)
//@access public
//@return void
//
//
//プログレスバー処理
//
//@author houshiyama
//@since 2008/06/25
//
//@access public
//@return void
//
//
//スプレッドシートのインスタンス生成
//
//種別によってファイル名を決める
//
//@author houshiyama
//@since 2008/06/25
//
//@param mixed $type
//@access public
//@return void
//
//
//writeCell
//セルの書き込み
//@author date
//@since 2016/09/09
//
//@param mixed $y
//@param mixed $x
//@param mixed $value
//@param mixed $isText
//@access private
//@return void
//
//
//makeBookCoverForAddBill
//追加請求用
//@author date
//@since 2016/09/09
//
//@access public
//@return void
//
//
//表紙作成
//
//表示用月作成（何となくここで）
//会社固有の表紙作成
//
//@author houshiyama
//@since 2008/06/25
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $H_postdata
//@param mixed $O_model
//@access public
//@return void
//
//
//スプレッドシートのフォーマットを作る
//
//@author houshiyama
//@since 2008/06/25
//
//@access public
//@return void
//
//
//シートを作る
//
//@author houshiyama
//@since 2008/06/25
//
//@access public
//@return void
//
//
//Smartyを用いた画面表示<br>
//
//各データをSmartyにassign<br>
//jsもここでassignしています<br>
//Smartyで画面表示<br>
//
//@author houshiyama
//@since 2008/06/25
//
//@param array $A_auth（権限一覧）
//@param array $H_data（表示データ）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//表示作成（SUO）
//
//@author houshiyama
//@since 2008/06/30
//
//@param array $H_sess
//@param array $H_postdata
//@param object $O_model
//@access protected
//@return void
//
//
//データ行の一行目の書き出し
//
//@author houshiyama
//@since 2008/07/02
//
//@access public
//@return void
//
//
//請求明細データ行の書き出し（リスナー）
//このメソッドは直接モデルに渡され
//データ取得する毎に書き出す
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $A_data
//@param mixed $mtype
//@access public
//@return void
//
//
//請求明細データ行の書き出し（ETC）
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $A_data
//@access private
//@return void
//
//
//請求明細データ行の書き出し（購買）
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $A_data
//@access private
//@return void
//
//
//請求明細データ行の書き出し（コピー機）
//
//@author houshiyama
//@since 2008/07/23
//
//@param mixed $A_data
//@access private
//@return void
//
//
//次のページまで空行で埋める
//
//@author houshiyama
//@since 2008/07/03
//
//@access public
//@return void
//
//
//利用明細データ行の書き出し（リスナー）
//このメソッドは直接モデルに渡され
//データ取得する毎に書き出す
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $A_data
//@param mixed $mtype
//@access public
//@return void
//
//
//利用明細データ行の書き出し（ETC）
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $A_data
//@access private
//@return void
//
//
//利用明細データ行の書き出し（購買）
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $A_data
//@access private
//@return void
//
//
//データ行の書き出し（コピー機）
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $A_data
//@access private
//@return void
//
//
//writeTransitUseDataLine
//
//@author igarashi
//@since 2010/02/26
//
//@param mixed $A_data
//@access private
//@return void
//
//
//完了画面js出力<br>
//
//各データをSmartyにassign<br>
//jsもここでassignしています<br>
//Smartyで画面表示<br>
//
//@author houshiyama
//@since 2008/06/25
//
//@param array $A_auth（権限一覧）
//@param array $H_data（表示データ）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//適切なフォーマット取得
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $row_no
//@param mixed $col_no
//@param mixed $pos
//@access private
//@return void
//
//
//getTransitTotalFormat
//
//@author igarashi
//@since 2010/03/09
//
//@param mixed $col_no
//@param string $pos
//@access private
//@return void
//
//
//データ数を取得（プログレスバー用、モデルから呼ばれる）
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $cnt
//@access private
//@return void
//
//
//overNumberFormat
//
//@author igarashi
//@since 2010/03/12
//
//@param mixed $val
//@param mixed $flg
//@access private
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
class CreateDLFileView extends ViewSmarty {
	static PUB = "/ExcelDL";
	static UFJNICOSCOID = 8;
	static PARK24COSCOID = 27;
	static ASKULCOID = 1;
	static KAUNETCOID = 2;
	static ALPHACOID = 3;
	static MONOTAROCOID = 4;
	static ETCMID = "2";
	static PURCHMID = "3";
	static COPYMID = "4";
	static SATMID = "103";
	static ADDBILLMID = "243";
	static RICOHCOID = 1;
	static XEROXCOID = 4;
	static CANONCOID = 3;
	static FUKUYAMACOID = 1;

	constructor() //データ行の開始行
	//設定ファイル読込
	//if( $this->O_Sess->pactid == "99" || $this->O_Sess->pactid == "2304" || $this->O_Sess->pactid == "53" ){
	//}
	//↑別にすべての会社でSUO_excelを読めてもいいと思うんだ。伊達
	{
		super();
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(CreateDLFileView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();
		this.row_no = 0;
		this.limit_col = 25;
		this.charge_col_1 = 16;
		this.charge_col_2 = 24;
		this.limit_row = 70;
		this.O_Set.loadConfig("SUO_excel");
	}

	setDefaultSession() {}

	checkCGIParam() //最初のアクセス時
	{
		this.setDefaultSession();

		if (undefined !== _GET.serial === true) //請求のモデルで使うのでキー名はpostで
			{
				this.H_Local.post = _GET;
				this.H_Local.dlmode = "0";
				this.O_Sess.setSelfAll(this.H_Local);
				MtExceptReload.raise(undefined);
			}
	}

	getLocalSession() {
		var H_sess = {
			[CreateDLFileView.PUB]: this.O_Sess.getPub(CreateDLFileView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	get_View() {
		return this.H_View;
	}

	checkParamError(H_sess, H_g_sess) //必要なセッション情報が無い
	{
		if (undefined !== H_sess[CreateDLFileView.PUB].current_postid === false || "" === H_sess[CreateDLFileView.PUB].current_postid || (undefined !== H_sess.SELF.post.serial === false || "" === H_sess.SELF.post.serial) || (undefined !== H_sess.SELF.post.cym === false || "" === H_sess.SELF.post.cym) || (undefined !== H_sess.SELF.post.postid === false || "" === H_sess.SELF.post.postid) || (undefined !== H_sess.SELF.post.posttarget === false || "" === H_sess.SELF.post.posttarget) || (undefined !== H_sess.SELF.post.mtype === false || "" === H_sess.SELF.post.mtype) || (undefined !== H_sess.SELF.dlmode === false || "" === H_sess.SELF.dlmode)) {
			this.errorOut(8, "session\u304C\u7121\u3044", false, "javascript:window.close();", "\u9589\u3058\u308B");
			throw die();
		}
	}

	toSjis(var) {
		var = var.trim();
		return mb_convert_encoding(var, "SJIS-win", "UTF-8");
	}

	addFormat(O_book, H_format, format_name, H_param) //すでに登録されているフォーマットなら何もしない
	//文字をMS P ゴシックに
	//フォーマットを設定する
	{
		if (undefined !== H_format[format_name] === true) {
			return;
		}

		H_format[format_name] = O_book.addFormat();
		H_format[format_name]._font_name = mb_convert_encoding("\uFF2D\uFF33 \uFF30\u30B4\u30B7\u30C3\u30AF", "shift_jis");

		for (var key in H_param) {
			var value = H_param[key];

			switch (key) {
				case "left":
					H_format[format_name].setLeft(value);
					break;

				case "right":
					H_format[format_name].setRight(value);
					break;

				case "top":
					H_format[format_name].setTop(value);
					break;

				case "bottom":
					H_format[format_name].setBottom(value);
					break;

				case "all":
					H_format[format_name].setLeft(value);
					H_format[format_name].setRight(value);
					H_format[format_name].setTop(value);
					H_format[format_name].setBottom(value);
					break;

				case "pattern":
					H_format[format_name].setPattern(value);
					break;

				case "align":
					H_format[format_name].setAlign(value);
					break;

				case "size":
					H_format[format_name].setSize(value);
					break;

				case "bold":
					if (value) H_format[format_name].setBold();
					break;

				case "numformat":
					H_format[format_name].setNumFormat(value);
					break;
			}
		}
	}

	makeProgressBar() //プログレスバーを表示する
	{
		this.H_View.O_bar = new HTML_Progress2();
		this.H_View.O_bar.setAnimSpeed(0);
		this.H_View.O_bar.setIncrement(1);
		this.H_View.O_bar.setValue(0);
		this.H_View.bar_style = this.H_View.O_bar.getStyle(false);
		this.H_View.bar_script = this.H_View.O_bar.getScript(false);
		this.H_View.bar_html = this.H_View.O_bar.toHtml();
		this.H_View.bar_pos = 0;
	}

	makeBookInstance(type) //種別によってファイル名を決定
	{
		if ("1" === type) {
			var pre = "tel_";
		} else if ("2" === type) {
			pre = "etc_";
		} else if ("3" === type) {
			pre = "purchase_";
		} else if ("4" === type) {
			pre = "copy_";
		} else if (CreateDLFileView.SATMID === type) {
			pre = "SAT_";
		} else if ("5" === type) {
			pre = "transit_";
		} else if ("243" === type) {
			pre = "addbill_";
		}

		this.H_View.fname = tempnam(this.O_Set.KCS_DIR + "/files/", this.O_Sess.pactid + "-" + this.O_Sess.userid + "-" + pre + date("YmjHis"));
		var fpath = basename(this.H_View.fname);
		this.H_View.fkey = preg_replace("/" + this.O_Sess.pactid + "-" + this.O_Sess.userid + "-/", "", fpath);
		this.H_View.O_book = new Spreadsheet_Excel_Writer(this.H_View.fname);
		this.H_View.H_format = Array();
	}

	writeCell(x, y, value, __format = "empty", isText = true) //文字コード変換
	//フォーマット
	//文字列があれば出力
	{
		var str = this.toSjis(value);

		if ("string" === typeof __format) //名前を指定されたらこっち
			{
				var format = this.H_View.H_format[__format];
			} else //実体を渡されたらこっち
			{
				format = __format;
			}

		if (str != "") {
			if (isText === true) {
				var res = this.H_View.O_sheet.writeString(y, x, str, format);
			} else {
				res = this.H_View.O_sheet.writeNumber(y, x, str, format);
			}
		} else {
			res = this.H_View.O_sheet.writeBlank(y, x, format);
		}
	}

	makeBookCoverForAddBill(H_sess: {} | any[], H_postdata: {} | any[], O_model) //種別一覧の取得
	//makeSUOBookCoverがアルティメットカオスだったので新しく作った
	//$this->H_View["O_sheet"]->setRow( $rcnt, 12.75 );
	//1行目
	//--------------------------------------------------------------------
	//日付書く
	//--------------------------------------------------------------------
	//住所
	//--------------------------------------------------------------------
	//積水梅田の住所とか
	//--------------------------------------------------------------------
	//言葉
	//--------------------------------------------------------------------
	//御中
	//--------------------------------------------------------------------
	//色々な線
	//縦線
	//横線
	//種別の請求額の表示
	//どうやら75が1ページの容量らしい
	//--------------------------------------------------------------------
	//注意書き
	//$this->writeCell( 1,$this->cover_row -3,"※消費税は、課税、非課税、内税がありますので、必ずしも8%にはなりません。" );
	{
		var colist = O_model.getAddBillCoList();
		this.H_View.O_sheet.setRow(0, 25.5);
		this.writeCell(0, 0, "\u8ACB\u6C42\u660E\u7D30", "title1");
		this.writeCell(7, 0, "(" + colist.join("/") + ")");
		var str = "\u65E5\u4ED8\uFF1A" + this.getDateUtil().getToday().replace(/-/g, "/");
		this.writeCell(this.limit_col, 1, str, "pos_right_middle");
		this.writeCell(0, 3, H_postdata.zip, "top_left_coner");
		this.writeCell(0, 4, H_postdata.addr1 + H_postdata.addr2, "left_line");
		this.writeCell(0, 5, H_postdata.building, "left_line");
		this.writeCell(0, 7, H_postdata.postname + " \u5FA1\u4E2D", "left_line");
		this.writeCell(1, 3, H_postdata.userpostid, "top_line");
		this.writeCell(1, 8, H_postdata.userpostid, "bottom_line");
		var tantou = "";

		if (this.O_Set.existsKey("suo_addbill_tantou")) {
			tantou = this.O_Set.suo_addbill_tantou;
		}

		this.writeCell(19, 3, "\u7A4D\u6C34\u30CF\u30A6\u30B9\u6885\u7530\u30AA\u30DA\u30EC\u30FC\u30B7\u30E7\u30F3\u682A\u5F0F\u4F1A\u793E", "middle");
		this.writeCell(19, 4, "\u30AA\u30D5\u30A3\u30B9\u30B5\u30FC\u30D3\u30B9\u4E8B\u696D\u90E8", "middle");
		this.writeCell(24, 5, "\u62C5\u5F53\uFF1A" + tantou, "pos_right_middle");
		this.writeCell(19, 6, "\u5927\u962A\u5E9C\u5927\u962A\u5E02\u5317\u533A\u5927\u6DC0\u4E2D\uFF11\u4E01\u76EE\uFF11\u756A\uFF18\uFF18\u53F7", "middle");
		this.writeCell(19, 7, "\uFF08\u6885\u7530\u30B9\u30AB\u30A4\u30D3\u30EB\u30BF\u30EF\u30FC\u30A4\u30FC\u30B9\u30C823\u968E\uFF09", "middle");
		this.writeCell(19, 8, "TEL:06-6440-3904\u3000FAX:06-6440-3980", "middle");
		this.writeCell(1, 10, "\u62DD\u5553\u3001\u65E5\u9803\u3088\u308A\u683C\u5225\u306E\u3054\u9AD8\u914D\u306B\u9810\u304B\u308A\u539A\u304F\u5FA1\u793C\u7533\u3057\u4E0A\u3052\u307E\u3059\u3002");
		this.writeCell(1, 11, "\u3055\u3066\u4ECA\u6708\u306E\u540D\u523A/\u5C01\u7B52\u306E\u5229\u7528\u660E\u7D30\u3092\u9001\u4ED8\u3055\u305B\u3066\u9802\u304D\u307E\u3059\u306E\u3067\u3001\u5B9C\u3057\u304F\u3054\u67FB\u8A3C\u4E0B\u3055\u3044\u307E\u3059\u3088\u3046");
		this.writeCell(1, 12, "\u304A\u9858\u3044\u7533\u3057\u4E0A\u3052\u307E\u3059\u3002");
		this.H_View.O_sheet.setRow(14, 21);
		this.writeCell(1, 14, H_postdata.postname + " \u5FA1\u4E2D", "title2");
		this.writeCell(0, 8, "", "bottom_left_coner");
		this.writeCell(17, 3, "", "top_right_coner");
		this.writeCell(17, 8, "", "bottom_right_coner");
		this.writeCell(0, 6, "", "left_line");

		for (var y = 4; y <= 7; y++) {
			this.writeCell(17, y, "", "right_line");
		}

		for (var x = 2; x <= 16; x++) {
			this.writeCell(x, 3, "", "top_line");
			this.writeCell(x, 8, "", "bottom_line");
		}

		var post = H_sess.SELF.post;
		var cobill_sum = O_model.getAddBillCoBillSum(post.cym, this.O_Sess.pactid, post.postid);
		var basey = 16;

		for (var key in colist) //各種別の請求金額
		//4隅の線
		//縦の線
		//横線
		{
			var value = colist[key];

			if (undefined !== cobill_sum[key]) {
				var price = cobill_sum[key].price + cobill_sum[key].tax;
			} else {
				price = 0;
			}

			this.writeCell(1, basey + 1, value);
			this.writeCell(14, basey + 1, "\u8ACB\u6C42\u984D");
			this.writeCell(24, basey + 1, price, "empty", false);
			this.writeCell(14, basey + 2, "\u53E3\u5EA7\u632F\u66FF\u624B\u6570\u6599");
			this.writeCell(14, basey + 4, "\u5408\u8A08");
			this.writeCell(24, basey + 4, price, "empty", false);
			this.writeCell(0, basey, "", "top_left_coner_bold");
			this.writeCell(0, basey + 8, "", "bottom_left_coner_bold");
			this.writeCell(this.limit_col, basey, "", "top_right_coner_bold");
			this.writeCell(this.limit_col, basey + 8, "", "bottom_right_coner_bold");

			for (var _y = 1; _y <= 7; _y++) {
				y = basey + _y;
				this.writeCell(0, y, "", "left_line_bold");
				this.writeCell(this.limit_col, y, "", "right_line_bold");
			}

			for (x = 1;; x < this.limit_col; x++) {
				this.writeCell(x, basey, "", "top_line_bold");
				this.writeCell(x, basey + 8, "", "bottom_line_bold");
			}

			basey += 10;
		}

		this.limit_row = 75;
		this.cover_row = this.limit_row - 1;
		this.writeCell(1, this.cover_row - 3, "\u203B\u6D88\u8CBB\u7A0E\u306F\u3001\u8AB2\u7A0E\u3001\u975E\u8AB2\u7A0E\u3001\u5185\u7A0E\u304C\u3042\u308A\u307E\u3059\u306E\u3067\u3001\u5FC5\u305A\u3057\u3082\u7A0E\u7387\u3067\u8A08\u7B97\u3057\u305F\u5024\u306B\u306F\u306A\u308A\u307E\u305B\u3093\u3002");
		this.row_no = this.cover_row = 74;
	}

	writeAddBillUseDataLine(A_data) //運賃
	//保険金
	//消費税
	//1行目
	////	部署名書く
	//		for( $ccnt = 0; $ccnt <= $this->limit_col; $ccnt++ ){
	//			switch( $ccnt ){
	//			case 0:		$str = "事業所名:";	break;
	//			default:	$str = "";			break;
	//			}
	//			$format = $this->getFormat( $this->row_no, $ccnt, "second" );
	//			$this->writeCell( $ccnt,$this->row_no,$str,$format);
	//		}
	//		$this->row_no++;
	//項目の書き込み
	//列でループ
	//データ書き込み
	//値
	//終了行
	//空白2行
	//プログレスバーを進める
	{
		var charge = 0;
		var insurance = 0;
		var excise = 0;

		for (var ccnt = 0; ccnt <= this.limit_col; ccnt++) {
			switch (ccnt) {
				case 0:
					var str = "\u90E8\u7F72ID\uFF1A" + A_data[0].userpostid;
					break;

				case 8:
					str = "\u90E8\u7F72\u540D\uFF1A" + A_data[0].postname;
					break;

				default:
					str = "";
					break;
			}

			var format = this.getFormat(this.row_no, ccnt, "top");
			this.writeCell(ccnt, this.row_no, str, format);
		}

		this.row_no++;

		for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
		//行ごとの処理
		{
			format = this.getFormat(this.row_no, ccnt);

			switch (ccnt) {
				case 0:
					str = "\u7D0D\u54C1\u65E5";
					break;

				case 3:
					str = "\u7A2E\u5225";
					break;

				case 5:
					str = "\u5546\u54C1\u540D";
					break;

				case 10:
					str = "\u540D\u523A\u8A18\u8F09\u6C0F\u540D";
					break;

				case 14:
					str = "\u6570\u91CF";
					break;

				case 16:
					str = "\u91D1\u984D";
					break;

				case 18:
					str = "\u6D88\u8CBB\u7A0E";
					break;

				case 19:
					str = "\u5099\u8003";
					break;

				case 24:
					str = "\u53D7\u4ED8\u756A\u53F7";
					break;

				default:
					str = "";
					break;
			}

			this.writeCell(ccnt, this.row_no, str, format);
		}

		this.row_no++;
		var price_sum = 0;
		var tax_sum = 0;

		for (var value of Object.values(A_data)) //1行ごとにやっていく
		//行加算
		{
			for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
			{
				format = this.getFormat(this.row_no, ccnt);
				var isText = true;

				switch (ccnt) {
					case 0:
						str = value.deliverydate.substr(0, 10);
						break;

					case 3:
						str = value.coname;
						break;

					case 5:
						str = value.productname;
						break;

					case 10:
						str = value.card_name;
						break;

					case 14:
						str = value.num;
						break;

					case 16:
						str = value.price;
						isText = false;
						break;

					case 18:
						str = value.tax;
						isText = false;
						break;

					case 19:
						str = value.comment;
						break;

					case 24:
						str = value.addbillid;
						break;

					default:
						str = "";
						break;
				}

				this.writeCell(ccnt, this.row_no, str, format, isText);
			}

			price_sum += value.price;
			tax_sum += value.tax;
			this.row_no++;
		}

		for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) {
			isText = true;

			switch (ccnt) {
				case 10:
					str = "\u5408\u8A08";
					break;

				case 16:
					str = price_sum;
					isText = false;
					break;

				case 18:
					str = tax_sum;
					isText = false;
					break;

				default:
					str = "";
					break;
			}

			format = this.getFormat(this.row_no, ccnt, "second");
			this.writeCell(ccnt, this.row_no, str, format, isText);
		}

		this.row_no++;

		for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) {
			format = this.getFormat(this.row_no, ccnt, "bottom");
			this.writeCell(ccnt, this.row_no, "", format);
		}

		this.row_no++;

		for (var y = 0; y < 2; y++) {
			for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) {
				format = this.getFormat(this.row_no, ccnt);
				this.writeCell(ccnt, this.row_no, "", format);
			}

			this.row_no++;
		}

		if (this.H_View.bar_pos < 0) {
			this.H_View.bar_pos = 0;
		} else if (this.H_View.bar_pos > 100) {
			this.H_View.bar_pos = 100;
		}

		var step = 100 / this.H_View.data_cnt;
		this.H_View.bar_pos = this.H_View.bar_pos + step;
		this.H_View.O_bar.moveStep(+this.H_View.bar_pos);
	}

	makeBookCover(H_g_sess: {} | any[], H_sess: {} | any[], H_postdata: {} | any[], O_model) //表示用利用月
	//種別によって処理変える
	{
		this.H_View.usemonth_view = H_sess.SELF.post.cym.substr(0, 4) + "\u5E74" + H_sess.SELF.post.cym.substr(4, 2) + "\u6708";

		if (H_sess.SELF.post.mtype === CreateDLFileView.ADDBILLMID) //追加請求用(名刺/封筒)
			//makeSUOBookCoverがごちゃごちゃしてるので作り直した
			{
				this.cover_row = 69;
				this.H_View.O_sheet.setVPagebreaks([this.cover_row]);
				this.makeBookCoverForAddBill(H_sess, H_postdata, O_model);
			} else {
			switch (H_g_sess.pactid) {
				case "99":
				case "2304":
					this.cover_row = 69;
					this.H_View.O_sheet.setVPagebreaks([this.cover_row]);
					this.makeSUOBookCover(H_sess, H_postdata, O_model);
					break;

				case "53":
					this.cover_row = 69;
					this.H_View.O_sheet.setVPagebreaks([this.cover_row]);
					this.makeSUOBookCover(H_sess, H_postdata, O_model);
					break;
			}
		}
	}

	makeBookFormat() //使用するフォーマットを作成する
	//指定無し
	//太字
	//結合
	//タイトルその1
	//タイトルその2
	//中文字
	//中央
	//左寄せ
	//右寄せ
	//右寄せ中文字
	//上枠付
	//下枠付
	//左枠付
	//右枠付
	//左枠付太字
	//右枠付太字
	//上枠付（太）
	//下枠付（太）
	//左枠付（太）
	//右枠付（太）
	//左上枠付
	//左下枠付
	//右上枠付
	//右下枠付
	//左上枠付（太）
	//左下枠付（太）
	//右上枠付（太）
	//右下枠付（太）
	//右寄せ上枠付き
	//右寄せ下枠付き
	//網掛け
	//網掛け太字
	//網掛け上枠付
	//網掛け下枠付
	//網掛け左枠付
	//網掛け右枠付
	//網掛け左枠付
	//網掛け右枠付
	//網掛け右寄せ
	//網掛け右寄せ
	//網掛け右寄せ上枠付き
	//網掛け右寄せ下枠付き
	//左上枠付
	//左下枠付
	//右上枠付
	//右下枠付
	{
		var H_format = Array();
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "empty", {
			numformat: "###,###,###,##0",
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "bold", {
			bold: 1,
			numformat: "###,###,###,##0",
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "merge", {
			align: "merge",
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "title1", {
			bold: 1,
			size: 22
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "title2", {
			bold: 1,
			size: 18
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "middle", {
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "pos_center", {
			align: "center",
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "pos_left", {
			align: "left",
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "pos_right", {
			align: "right",
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "pos_right_middle", {
			align: "right",
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "top_line", {
			bold: 1,
			top: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "bottom_line", {
			bottom: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "left_line", {
			left: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "right_line", {
			right: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "left_line_bold_font", {
			bold: 1,
			left: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "right_line_bold_font", {
			bold: 1,
			right: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "top_line_bold", {
			top: 2,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "bottom_line_bold", {
			bottom: 2,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "left_line_bold", {
			left: 2,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "right_line_bold", {
			right: 2,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "top_left_coner", {
			bold: 1,
			top: 1,
			left: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "bottom_left_coner", {
			bottom: 1,
			left: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "top_right_coner", {
			bold: 1,
			top: 1,
			right: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "bottom_right_coner", {
			bottom: 1,
			right: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "top_left_coner_bold", {
			top: 2,
			left: 2,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "bottom_left_coner_bold", {
			bottom: 2,
			left: 2,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "top_right_coner_bold", {
			top: 2,
			right: 2,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "bottom_right_coner_bold", {
			bottom: 2,
			right: 2,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "pos_right_top_line", {
			bold: 1,
			align: "right",
			top: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "pos_right_bottom_line", {
			align: "right",
			bottom: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "ami1", {
			pattern: 4,
			numformat: "###,###,###,##0",
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "ami1_bold", {
			bold: 1,
			pattern: 4,
			numformat: "###,###,###,##0",
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "ami_top_line", {
			pattern: 4,
			bold: 1,
			top: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "ami_bottom_line", {
			pattern: 4,
			bottom: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "ami_left_line", {
			pattern: 4,
			left: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "ami_right_line", {
			pattern: 4,
			right: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "ami_left_line_bold", {
			bold: 1,
			pattern: 4,
			left: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "ami_right_line_bold", {
			bold: 1,
			pattern: 4,
			right: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "ami_pos_right", {
			pattern: 4,
			align: "right",
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "ami_pos_right", {
			pattern: 4,
			align: "right",
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "ami_pos_right_top_line", {
			pattern: 4,
			align: "right",
			bold: 1,
			top: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "ami_pos_right_bottom_line", {
			pattern: 4,
			align: "right",
			bottom: 1,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "ami_top_left_coner", {
			bold: 1,
			top: 1,
			left: 1,
			pattern: 4,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "ami_bottom_left_coner", {
			bottom: 1,
			left: 1,
			pattern: 4,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "ami_top_right_coner", {
			bold: 1,
			top: 1,
			right: 1,
			pattern: 4,
			size: 9
		});
		this.addFormat(this.H_View.O_book, this.H_View.H_format, "ami_bottom_right_coner", {
			bottom: 1,
			right: 1,
			pattern: 4,
			size: 9
		});
	}

	makeSheet() //シートを追加して、用紙設定をする
	//シートの上下左右にマージンを設定する
	//ヘッダ・フッタを取り除く
	//ページの向きを縦に
	//印刷時の改ページ
	//$this->H_View["O_sheet"]->fitToPages( 1, 1 );
	//セルの区切り線が印刷されないようにする
	//しかし、addFormatで明示的に追加した線は印刷される
	//列の幅を設定する(最初の列,最後の列,セルの幅[,列全体のフォーマット])
	//追加請求の場合は横幅かえる
	//金額
	{
		this.H_View.O_sheet = this.H_View.O_book.addWorksheet(this.toSjis("\u30B7\u30FC\u30C81"));
		this.H_View.O_sheet.setMarginTop(0.6);
		this.H_View.O_sheet.setMarginBottom(0.6);
		this.H_View.O_sheet.setMarginRight(0.6);
		this.H_View.O_sheet.setMarginLeft(0.6);
		this.H_View.O_sheet.setHeader("", 0);
		this.H_View.O_sheet.setFooter("", 0);
		this.H_View.O_sheet.setPortrait();
		this.H_View.O_sheet.setVPagebreaks([this.limit_col + 1]);
		this.H_View.O_sheet.hideGridlines();

		if (this.H_Local.post.mtype == CreateDLFileView.ADDBILLMID) //消費税
			{
				this.H_View.O_sheet.setColumn(18, 18, 8);
			}

		this.H_View.O_sheet.setColumn(0, this.charge_col_1 - 1, 3);
		this.H_View.O_sheet.setColumn(this.charge_col_1, this.charge_col_1, 8);
		this.H_View.O_sheet.setColumn(this.charge_col_1 + 1, this.charge_col_2 - 1, 3);
		this.H_View.O_sheet.setColumn(this.charge_col_2, this.charge_col_2, 10);
		this.H_View.O_sheet.setColumn(this.limit_col, this.limit_col, 2);
	}

	displaySmarty() //assaign
	//display
	{
		this.get_Smarty().assign("bar_style", this.H_View.bar_style);
		this.get_Smarty().assign("bar_script", this.H_View.bar_script);
		this.get_Smarty().assign("bar_html", this.H_View.bar_html);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	makeSUOBookCover(H_sess: {} | any[], H_postdata: {} | any[], O_model) //名前が長くなるので
	//種別
	//表紙に使用した行数
	{
		var H_format = this.H_View.H_format;
		var mtype = H_sess.SELF.post.mtype;

		if (mtype === "1") {} else if (mtype === "2") {
			var mname = "ETC/\u99D0\u8ECA\u5834";
		} else if (mtype === "3") {
			mname = "\u8CFC\u8CB7";
		} else if (mtype === "4") {
			mname = "\u30B3\u30D4\u30FC\u6A5F";
		} else if (mtype === CreateDLFileView.SATMID) {
			mname = "SAT/MonotaRo";
		} else if ("5" === mtype) {
			mname = "\u904B\u9001";
		}

		for (var rcnt = 0; rcnt < this.cover_row; rcnt++) //列でループ
		{
			for (var ccnt = 0; ccnt <= this.limit_col; ccnt++) //内容がintのセルはこれをtrueに
			//請求の会社数をここに記録・・
			//文字列があれば出力
			{
				var str = "";
				var intcol = false;
				var format = H_format.empty;
				this.H_View.O_sheet.setRow(rcnt, 12.75);
				var co_cnt = 1;

				if ("2" === mtype || "3" === mtype || CreateDLFileView.SATMID === mtype) {
					co_cnt = 2;
				} else if ("4" === mtype) {
					co_cnt = 3;
				}

				switch (rcnt) {
					case 0:
						this.H_View.O_sheet.setRow(rcnt, 25.5);

						switch (ccnt) {
							case 0:
								str = "\u8ACB\u6C42\u660E\u7D30";
								format = H_format.title1;
								break;

							case 7:
								str = "\uFF08" + mname + "\uFF09";
								break;

							default:
								str = "";
								break;
						}

						break;

					case 1:
						switch (ccnt) {
							case this.limit_col:
								str = "\u65E5\u4ED8\uFF1A" + this.getDateUtil().getToday().replace(/-/g, "/");
								format = H_format.pos_right_middle;
								break;

							default:
								str = "";
								break;
						}

						break;

					case 3:
						switch (ccnt) {
							case 0:
								str = H_postdata.zip;
								format = H_format.top_left_coner;
								break;

							case ccnt >= 1 && ccnt <= 16:
								format = H_format.top_line;
								break;

							case 17:
								format = H_format.top_right_coner;
								break;

							case 19:
								if (CreateDLFileView.SATMID === mtype) {
									str = "\u7A4D\u6C34\u30CF\u30A6\u30B9\u6885\u7530\u30AA\u30DA\u30EC\u30FC\u30B7\u30E7\u30F3\u682A\u5F0F\u4F1A\u793E";
								} else {
									str = "\u7A4D\u6C34\u30CF\u30A6\u30B9\u6885\u7530\u30AA\u30DA\u30EC\u30FC\u30B7\u30E7\u30F3\u682A\u5F0F\u4F1A\u793E";
								}

								format = H_format.middle;
								break;

							default:
								str = "";
								break;
						}

						break;

					case 4:
						switch (ccnt) {
							case 0:
								str = H_postdata.addr1 + H_postdata.addr2;
								format = H_format.left_line;
								break;

							case 17:
								format = H_format.right_line;
								break;

							case 19:
								if (CreateDLFileView.SATMID === mtype) {
									str = "\u30AA\u30D5\u30A3\u30B9\u30B5\u30FC\u30D3\u30B9\u4E8B\u696D\u90E8";
								} else {
									str = "\u30AA\u30D5\u30A3\u30B9\u30B5\u30FC\u30D3\u30B9\u4E8B\u696D\u90E8";
								}

								format = H_format.middle;
								break;

							default:
								str = "";
								break;
						}

						break;

					case 5:
						switch (ccnt) {
							case 0:
								str = H_postdata.building;
								format = H_format.left_line;
								break;

							case 17:
								format = H_format.right_line;
								break;

							case 24:
								if (CreateDLFileView.ETCMID === mtype) {
									str = "\u62C5\u5F53\uFF1A" + this.O_Set.suo_etc_tantou;
								} else if (CreateDLFileView.PURCHMID === mtype) {
									str = "\u62C5\u5F53\uFF1A" + this.O_Set.suo_purchase_tantou;
								} else if (CreateDLFileView.COPYMID === mtype) {
									str = "\u62C5\u5F53\uFF1A" + this.O_Set.suo_copy_tantou;
								} else if (CreateDLFileView.SATMID === mtype) {
									str = "\u62C5\u5F53\uFF1A" + this.O_Set.suo_sat_tantou;
								} else {
									str = "\u62C5\u5F53\uFF1A\u897F\u672C\u3001\u91CE\u6751";
								}

								format = H_format.pos_right_middle;
								break;

							default:
								str = "";
								break;
						}

						break;

					case 6:
						switch (ccnt) {
							case 0:
								format = H_format.left_line;
								break;

							case 17:
								format = H_format.right_line;
								break;

							case 19:
								if (CreateDLFileView.SATMID === mtype) {
									str = "\u5927\u962A\u5E9C\u5927\u962A\u5E02\u5317\u533A\u5927\u6DC0\u4E2D\uFF11\u4E01\u76EE\uFF11\u756A\uFF18\uFF18\u53F7";
								} else {
									str = "\u5927\u962A\u5E9C\u5927\u962A\u5E02\u5317\u533A\u5927\u6DC0\u4E2D\uFF11\u4E01\u76EE\uFF11\u756A\uFF18\uFF18\u53F7";
								}

								format = H_format.middle;
								break;

							default:
								str = "";
								break;
						}

						break;

					case 7:
						switch (ccnt) {
							case 0:
								str = H_postdata.postname + " \u5FA1\u4E2D";
								format = H_format.left_line;
								break;

							case 17:
								format = H_format.right_line;
								break;

							case 19:
								if (CreateDLFileView.SATMID === mtype) {
									str = "\uFF08\u6885\u7530\u30B9\u30AB\u30A4\u30D3\u30EB\u30BF\u30EF\u30FC\u30A4\u30FC\u30B9\u30C823\u968E\uFF09";
								} else {
									str = "\uFF08\u6885\u7530\u30B9\u30AB\u30A4\u30D3\u30EB\u30BF\u30EF\u30FC\u30A4\u30FC\u30B9\u30C823\u968E\uFF09";
								}

								format = H_format.middle;
								break;

							default:
								str = "";
								break;
						}

						break;

					case 8:
						switch (ccnt) {
							case 0:
								format = H_format.bottom_left_coner;
								break;

							case 1:
								str = H_postdata.userpostid;
								format = H_format.bottom_line;
								break;

							case ccnt >= 2 && ccnt <= 16:
								format = H_format.bottom_line;
								break;

							case 17:
								format = H_format.bottom_right_coner;
								break;

							case 19:
								if (CreateDLFileView.SATMID === mtype) {
									str = "TEL:06-6440-3904\u3000FAX:06-6440-3980";
								} else {
									str = "TEL:06-6440-3904\u3000FAX:06-6440-3980";
								}

								format = H_format.middle;
								break;

							default:
								str = "";
								break;
						}

						break;

					case 10:
						switch (ccnt) {
							case 1:
								str = "\u62DD\u5553\u3001\u65E5\u9803\u3088\u308A\u683C\u5225\u306E\u3054\u9AD8\u914D\u306B\u9810\u304B\u308A\u539A\u304F\u5FA1\u793C\u7533\u3057\u4E0A\u3052\u307E\u3059\u3002";
								break;

							default:
								str = "";
								break;
						}

						break;

					case 11:
						switch (ccnt) {
							case 1:
								str = "\u3055\u3066\u4ECA\u6708\u306E" + mname + "\u306E\u5229\u7528\u660E\u7D30\u3092\u9001\u4ED8\u3055\u305B\u3066\u9802\u304D\u307E\u3059\u306E\u3067\u3001\u5B9C\u3057\u304F\u3054\u67FB\u8A3C\u4E0B\u3055\u3044\u307E\u3059\u3088\u3046";
								break;

							default:
								str = "";
								break;
						}

						break;

					case 12:
						switch (ccnt) {
							case 1:
								str = "\u304A\u9858\u3044\u7533\u3057\u4E0A\u3052\u307E\u3059\u3002";
								break;

							default:
								str = "";
								break;
						}

						break;

					case 14:
						this.H_View.O_sheet.setRow(rcnt, 21);

						switch (ccnt) {
							case 0:
								str = H_postdata.postname + " \u5FA1\u4E2D";
								format = H_format.title2;
								break;

							default:
								str = "";
								break;
						}

						break;

					case 16 === rcnt || 2 <= co_cnt && 26 == rcnt || 3 <= co_cnt && 36 === rcnt:
						switch (ccnt) {
							case 0:
								format = H_format.top_left_coner_bold;
								break;

							case ccnt >= 1 && ccnt <= this.limit_col - 1:
								format = H_format.top_line_bold;
								break;

							case this.limit_col:
								format = H_format.top_right_coner_bold;
								break;

							default:
								str = "";
								break;
						}

						break;

					case 17 === rcnt || 2 <= co_cnt && 27 == rcnt || 3 <= co_cnt && 37 === rcnt:
						switch (ccnt) {
							case 0:
								format = H_format.left_line_bold;
								break;

							case 1:
								if ("2" === mtype) {
									if (17 === rcnt) {
										str = "UFJ NICOS";
									} else if (27 === rcnt) {
										str = "\u30D1\u30FC\u30AF\uFF12\uFF14";
									}
								} else if ("3" === mtype) {
									if (17 === rcnt) {
										str = "ASKUL";
									} else if (27 === rcnt) {
										str = "kaunet";
									}
								} else if ("4" === mtype) {
									if (17 === rcnt) {
										str = "RICOH";
									} else if (27 === rcnt) {
										str = "\u30BC\u30ED\u30C3\u30AF\u30B9";
									} else if (37 === rcnt) {
										str = "CANON";
									}
								} else if (CreateDLFileView.SATMID === mtype) {
									if (17 === rcnt) {
										str = "SAT";
									} else if (27 === rcnt) {
										str = "MonotaRO";
									}
								} else if ("5" === mtype) {
									str = "\u798F\u5C71\u901A\u904B";
								}

								break;

							case 14:
								str = "\u8ACB\u6C42\u984D";
								break;

							case 24:
								intcol = true;

								if ("2" === mtype) {
									if (17 === rcnt) {
										str = O_model.getSUOCoverEtcSum(H_sess.SELF.post, CreateDLFileView.UFJNICOSCOID);
									} else if (27 === rcnt) {
										str = O_model.getSUOCoverEtcSum(H_sess.SELF.post, CreateDLFileView.PARK24COSCOID);
									}
								} else if ("3" === mtype) {
									if (17 === rcnt) {
										str = O_model.getSUOCoverPurchaseSum(H_sess.SELF.post, CreateDLFileView.ASKULCOID);
									} else if (27 === rcnt) {
										str = O_model.getSUOCoverPurchaseSum(H_sess.SELF.post, CreateDLFileView.KAUNETCOID);
									}
								} else if ("4" === mtype) {
									if (17 === rcnt) {
										str = O_model.getSUOCoverCopySum(H_sess.SELF.post, CreateDLFileView.RICOHCOID);
									} else if (27 === rcnt) {
										str = O_model.getSUOCoverCopySum(H_sess.SELF.post, CreateDLFileView.XEROXCOID);
									} else if (37 === rcnt) {
										str = O_model.getSUOCoverCopySum(H_sess.SELF.post, CreateDLFileView.CANONCOID);
									}
								} else if (CreateDLFileView.SATMID === mtype) {
									if (17 === rcnt) {
										str = O_model.getSUOCoverPurchaseSum(H_sess.SELF.post, CreateDLFileView.ALPHACOID);
									} else if (27 === rcnt) {
										str = O_model.getSUOCoverPurchaseSum(H_sess.SELF.post, CreateDLFileView.MONOTAROCOID);
									}
								} else if ("5" === mtype) {
									str = O_model.getSUOCoverTransitSum(H_sess.SELF.post, CreateDLFileView.FUKUYAMACOID);
								}

								break;

							case this.limit_col:
								format = H_format.right_line_bold;
								break;

							default:
								str = "";
								break;
						}

						break;

					case 18 === rcnt || 2 <= co_cnt && 28 == rcnt || 3 <= co_cnt && 38 === rcnt:
						switch (ccnt) {
							case 0:
								format = H_format.left_line_bold;
								break;

							case 14:
								str = "\u53E3\u5EA7\u632F\u66FF\u624B\u6570\u6599";
								break;

							case this.limit_col:
								format = H_format.right_line_bold;
								break;

							default:
								str = "";
								break;
						}

						break;

					case 19 === rcnt || 2 <= co_cnt && 29 == rcnt || 3 <= co_cnt && 39 === rcnt:
						switch (ccnt) {
							case 0:
								format = H_format.left_line_bold;
								break;

							case this.limit_col:
								format = H_format.right_line_bold;
								break;

							default:
								str = "";
								break;
						}

						break;

					case 20 === rcnt || 2 <= co_cnt && 30 == rcnt || 3 <= co_cnt && 40 === rcnt:
						switch (ccnt) {
							case 0:
								format = H_format.left_line_bold;
								break;

							case 14:
								str = "\u5408\u8A08";
								break;

							case 24:
								intcol = true;

								if ("2" === mtype) {
									if (20 === rcnt) {
										str = O_model.getSUOCoverEtcSum(H_sess.SELF.post, CreateDLFileView.UFJNICOSCOID);
									} else if (30 === rcnt) {
										str = O_model.getSUOCoverEtcSum(H_sess.SELF.post, CreateDLFileView.PARK24COSCOID);
									}
								} else if ("3" === mtype) {
									if (20 === rcnt) {
										str = O_model.getSUOCoverPurchaseSum(H_sess.SELF.post, CreateDLFileView.ASKULCOID);
									} else if (30 === rcnt) {
										str = O_model.getSUOCoverPurchaseSum(H_sess.SELF.post, CreateDLFileView.KAUNETCOID);
									}
								} else if ("4" === mtype) {
									if (20 === rcnt) {
										str = O_model.getSUOCoverCopySum(H_sess.SELF.post, CreateDLFileView.RICOHCOID);
									} else if (30 === rcnt) {
										str = O_model.getSUOCoverCopySum(H_sess.SELF.post, CreateDLFileView.XEROXCOID);
									} else if (40 === rcnt) {
										str = O_model.getSUOCoverCopySum(H_sess.SELF.post, CreateDLFileView.CANONCOID);
									}
								} else if (CreateDLFileView.SATMID === mtype) {
									if (20 === rcnt) {
										str = O_model.getSUOCoverPurchaseSum(H_sess.SELF.post, CreateDLFileView.ALPHACOID);
									} else if (30 === rcnt) {
										str = O_model.getSUOCoverPurchaseSum(H_sess.SELF.post, CreateDLFileView.MONOTAROCOID);
									}
								} else if ("5" === mtype) {
									str = O_model.getSUOCoverTransitSum(H_sess.SELF.post, CreateDLFileView.FUKUYAMACOID);
								}

								break;

							case this.limit_col:
								format = H_format.right_line_bold;
								break;

							default:
								str = "";
								break;
						}

						break;

					case 21 === rcnt || 2 <= co_cnt && 31 == rcnt || 3 <= co_cnt && 41 === rcnt:
						switch (ccnt) {
							case 0:
								format = H_format.left_line_bold;
								break;

							case this.limit_col:
								format = H_format.right_line_bold;
								break;

							default:
								str = "";
								break;
						}

						break;

					case 22 === rcnt || 2 <= co_cnt && 32 == rcnt || 3 <= co_cnt && 42 === rcnt:
						switch (ccnt) {
							case 0:
								format = H_format.left_line_bold;
								break;

							case this.limit_col:
								format = H_format.right_line_bold;
								break;

							default:
								str = "";
								break;
						}

						break;

					case 23 === rcnt || 2 <= co_cnt && 33 == rcnt || 3 <= co_cnt && 43 === rcnt:
						switch (ccnt) {
							case 0:
								format = H_format.left_line_bold;
								break;

							case this.limit_col:
								format = H_format.right_line_bold;
								break;

							default:
								str = "";
								break;
						}

						break;

					case 24 === rcnt || 2 <= co_cnt && 34 == rcnt || 3 <= co_cnt && 44 === rcnt:
						switch (ccnt) {
							case 0:
								format = H_format.bottom_left_coner_bold;
								break;

							case ccnt >= 1 && ccnt <= this.limit_col - 1:
								format = H_format.bottom_line_bold;
								break;

							case this.limit_col:
								format = H_format.bottom_right_coner_bold;
								break;

							default:
								str = "";
								break;
						}

						break;

					case this.cover_row - 3:
						switch (ccnt) {
							case 1:
								str = "\u203B\u6D88\u8CBB\u7A0E\u306F\u3001\u8AB2\u7A0E\u3001\u975E\u8AB2\u7A0E\u3001\u5185\u7A0E\u304C\u3042\u308A\u307E\u3059\u306E\u3067\u3001\u5FC5\u305A\u3057\u3082\u7A0E\u7387\u3067\u8A08\u7B97\u3057\u305F\u5024\u306B\u306F\u306A\u308A\u307E\u305B\u3093\u3002";
								break;

							default:
								str = "";
								break;
						}

						break;

					default:
						str = "";
						break;
				}

				str = this.toSjis(str);

				if (str != "") {
					if (intcol === true) {
						var res = this.H_View.O_sheet.writeNumber(rcnt, ccnt, str, format);
					} else {
						res = this.H_View.O_sheet.writeString(rcnt, ccnt, str, format);
					}
				} else {
					res = this.H_View.O_sheet.writeBlank(rcnt, ccnt, format);
				}
			}
		}

		this.row_no = this.cover_row;
	}

	writeStartDataLine() //列でループ
	//行数カウントアップ
	{
		for (var ccnt = 0; ccnt <= this.limit_col; ccnt++) //適切なフォーマット決定（一行おきに網掛け）
		//行ごとの処理
		//文字列があれば出力
		{
			var format = this.getFormat(this.row_no, ccnt, "top");

			switch (ccnt) {
				case 0:
					var str = this.H_View.usemonth_view + "\u3054\u8ACB\u6C42\u5206";
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				var res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;
	}

	writeBillDataLine(A_data, mtype) {
		if ("2" === mtype) {
			this.writeEtcBillDataLine(A_data);
		} else if ("3" === mtype || CreateDLFileView.SATMID === mtype) {
			this.writePurchaseBillDataLine(A_data);
		} else if ("4" === mtype) {
			this.writeCopyBillDataLine(A_data);
		}
	}

	writeEtcBillDataLine(A_data) //カード単位のヘッダー行1
	//列でループ
	//行数カウントアップ
	//カード単位のヘッダー行2
	//列でループ
	//行数カウントアップ
	//カード単位のヘッダー行
	//列でループ
	//行数カウントアップ
	//空行を入れるので＋１多くループ
	//プログレスバーを進める
	{
		for (var ccnt = 0; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
		//行ごとの処理
		//文字列があれば出力
		{
			var format = this.getFormat(this.row_no, ccnt, "top");

			switch (ccnt) {
				case 0:
					var str = "\u30AB\u30FC\u30C9\u756A\u53F7:" + A_data[0].cardno_view;
					break;

				case 8:
					str = "\u30AB\u30FC\u30C9\u756A\u53F72:" + A_data[0].bill_cardno_view;
					break;

				case 17:
					str = "\u30AB\u30FC\u30C9\u4F1A\u793E:" + A_data[0].cardconame;
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				var res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
		//行ごとの処理
		//文字列があれば出力
		{
			format = this.getFormat(this.row_no, ccnt, "second");

			switch (ccnt) {
				case 0:
					str = "\u30AB\u30FC\u30C9\u540D\u7FA9:" + A_data[0].card_meigi;
					break;

				case 8:
					str = "\u4F7F\u7528\u8005\u540D:" + A_data[0].username;
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
		//行ごとの処理
		//文字列があれば出力
		{
			format = this.getFormat(this.row_no, ccnt);

			switch (ccnt) {
				case 0:
					str = "\u5185\u8A33";
					break;

				case 9:
					str = "\u5229\u7528\u56DE\u6570";
					break;

				case this.charge_col_1:
					str = "\u91D1\u984D";
					break;

				case this.charge_col_2:
					str = "\u88DC\u52A9\u9805\u76EE";
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (var cnt = 0; cnt < A_data.length + 1; cnt++) //列でループ
		//行数カウントアップ
		{
			for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //フォーマット取得最後の行
			//行ごとの処理
			//文字列があれば出力
			{
				if (cnt == A_data.length) {
					format = this.getFormat(this.row_no, ccnt, "bottom");
				} else {
					if (CreateDLFileView.UFJNICOSCOID != A_data[0].cardcoid && "\u5408\u8A08" == A_data[cnt].codename || CreateDLFileView.UFJNICOSCOID == A_data[0].cardcoid && "\u8ACB\u6C42\u91D1\u984D" == A_data[cnt].codename) {
						format = this.getFormat(this.row_no, ccnt, "second");
					} else {
						format = this.getFormat(this.row_no, ccnt);
					}
				}

				switch (ccnt) {
					case 0:
						str = A_data[cnt].codename;
						break;

					case 9:
						str = A_data[cnt].usecnt;
						break;

					case this.charge_col_1:
						str = A_data[cnt].charge;
						break;

					default:
						str = "";
						break;
				}

				str = this.toSjis(str);

				if (str != "") {
					if (this.charge_col_1 === ccnt || 9 === ccnt) {
						res = this.H_View.O_sheet.writeNumber(this.row_no, ccnt, str, format);
					} else {
						res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
					}
				} else {
					res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
				}
			}

			this.row_no++;
		}

		if (this.H_View.bar_pos < 0) {
			this.H_View.bar_pos = 0;
		} else if (this.H_View.bar_pos > 100) {
			this.H_View.bar_pos = 100;
		}

		var step = 100 / (this.H_View.data_cnt * 2);
		this.H_View.bar_pos = this.H_View.bar_pos + step;
		this.H_View.O_bar.moveStep(+this.H_View.bar_pos);
	}

	writePurchaseBillDataLine(A_data) //購買ID単位のヘッダー行1
	//列でループ
	//行数カウントアップ
	//行数カウントアップ
	//購買ID単位のヘッダー行2
	//列でループ
	//行数カウントアップ
	//購買ID単位のヘッダー行
	//列でループ
	//行数カウントアップ
	//空行を入れるので＋１多くループ
	//プログレスバーを進める
	{
		for (var ccnt = 0; ccnt <= this.limit_col; ccnt++) //適切なフォーマット決定（一行おきに網掛け）
		//行ごとの処理
		//文字列があれば出力
		{
			var format = this.getFormat(this.row_no, ccnt, "top");

			switch (ccnt) {
				case 0:
					var str = "\u30ED\u30B0\u30A4\u30F3ID:" + A_data[0].purchid;
					break;

				case 8:
					str = "\u8ACB\u6C42\u5143:" + A_data[0].purchconame;
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				var res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //適切なフォーマット決定（一行おきに網掛け）
		//行ごとの処理
		//文字列があれば出力
		{
			format = this.getFormat(this.row_no, ccnt, "second");

			switch (ccnt) {
				case 0:
					str = "\u4E8B\u696D\u6240\u540D:" + A_data[0].postname;
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
		//行ごとの処理
		//文字列があれば出力
		{
			format = this.getFormat(this.row_no, ccnt);

			switch (ccnt) {
				case 0:
					str = "\u5185\u8A33";
					break;

				case 9:
					str = "\u74B0\u5883\u5BFE\u5FDC\u5546\u54C1";
					break;

				case 13:
					str = "\u6570\u91CF";
					break;

				case 16:
					str = "\u88DC\u52A9\u9805\u76EE";
					break;

				case this.charge_col_2:
					str = "\u91D1\u984D";
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (var cnt = 0; cnt < A_data.length + 1; cnt++) //列でループ
		//行数カウントアップ
		{
			for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //フォーマット取得最後の行
			//行ごとの処理
			//文字列があれば出力
			{
				if (cnt == A_data.length) {
					format = this.getFormat(this.row_no, ccnt, "bottom");
				} else {
					format = this.getFormat(this.row_no, ccnt);
				}

				switch (ccnt) {
					case 0:
						str = A_data[cnt].itemname;
						break;

					case 9:
						str = "";

						if (A_data[cnt].green == true) {
							str = "\u25CF";
						}

						break;

					case 13:
						str = A_data[cnt].itemsum;
						break;

					case 16:
						str = "";
						break;

					case this.charge_col_2:
						str = A_data[cnt].charge;
						break;

					default:
						str = "";
						break;
				}

				str = this.toSjis(str);

				if (str != "") {
					if (this.charge_col_2 === ccnt || 9 === ccnt) {
						res = this.H_View.O_sheet.writeNumber(this.row_no, ccnt, str, format);
					} else {
						res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
					}
				} else {
					res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
				}
			}

			this.row_no++;
		}

		if (this.H_View.bar_pos < 0) {
			this.H_View.bar_pos = 0;
		} else if (this.H_View.bar_pos > 100) {
			this.H_View.bar_pos = 100;
		}

		var step = 100 / (this.H_View.data_cnt * 2);
		this.H_View.bar_pos = this.H_View.bar_pos + step;
		this.H_View.O_bar.moveStep(+this.H_View.bar_pos);
	}

	writeCopyBillDataLine(A_data) //コピー機ID単位のヘッダー行
	//列でループ
	//行数カウントアップ
	//コピー機ID単位のヘッダー行
	//列でループ
	//行数カウントアップ
	//空行を入れるので＋１多くループ
	//プログレスバーを進める
	{
		for (var ccnt = 0; ccnt <= this.limit_col; ccnt++) //適切なフォーマット決定（一行おきに網掛け）
		//行ごとの処理
		//文字列があれば出力
		{
			var format = this.getFormat(this.row_no, ccnt, "top");

			switch (ccnt) {
				case 0:
					var str = "\u30B3\u30D4\u30FC\u6A5FID:" + A_data[0].copyid;
					break;

				case 7:
					str = "\u6A5F\u7A2E:" + A_data[0].copyname;
					break;

				case 15:
					str = "\u30E1\u30FC\u30AB\u30FC:" + A_data[0].copyconame;
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				var res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
		//行ごとの処理
		//文字列があれば出力
		{
			format = this.getFormat(this.row_no, ccnt);

			switch (ccnt) {
				case 0:
					str = "\u5185\u8A33";
					break;

				case this.charge_col_1:
					str = "\u30AB\u30A6\u30F3\u30C8\u6570";
					break;

				case this.charge_col_2:
					str = "\u91D1\u984D";
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (var cnt = 0; cnt < A_data.length + 1; cnt++) //列でループ
		//行数カウントアップ
		{
			for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //フォーマット取得最後の行
			//行ごとの処理
			//文字列があれば出力
			{
				if (cnt == A_data.length) {
					format = this.getFormat(this.row_no, ccnt, "bottom");
				} else {
					if ("\u5408\u8A08" == A_data[cnt].codename) {
						format = this.getFormat(this.row_no, ccnt, "second");
					} else {
						format = this.getFormat(this.row_no, ccnt);
					}
				}

				switch (ccnt) {
					case 0:
						str = A_data[cnt].codename;
						break;

					case this.charge_col_1:
						str = A_data[cnt].printcount;
						break;

					case this.charge_col_2:
						str = A_data[cnt].charge;
						break;

					default:
						str = "";
						break;
				}

				str = this.toSjis(str);

				if (str != "") {
					if (this.charge_col_1 === ccnt || this.charge_col_2 === ccnt) {
						res = this.H_View.O_sheet.writeNumber(this.row_no, ccnt, str, format);
					} else {
						res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
					}
				} else {
					res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
				}
			}

			this.row_no++;
		}

		if (this.H_View.bar_pos < 0) {
			this.H_View.bar_pos = 0;
		} else if (this.H_View.bar_pos > 100) {
			this.H_View.bar_pos = 100;
		}

		var step = 100 / (this.H_View.data_cnt * 2);
		this.H_View.bar_pos = this.H_View.bar_pos + step;
		this.H_View.O_bar.moveStep(+this.H_View.bar_pos);
	}

	writeBrankToNextPage() //次のページの開始行
	//ループして空行で埋める
	{
		var next = Math.ceil((this.row_no - this.cover_row) / this.limit_row) * this.limit_row;
		next = next + this.cover_row;

		for (var cnt = this.row_no; cnt < next; cnt++) //列でループ
		//行数カウントアップ
		{
			for (var ccnt = 0; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
			{
				var format = this.getFormat(this.row_no, ccnt);
				var res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}

			this.row_no++;
		}
	}

	writeUseDataLine(A_data, mtype) {
		if ("2" === mtype) {
			this.writeEtcUseDataLine(A_data);
		} else if ("3" === mtype || CreateDLFileView.SATMID === mtype) {
			this.writePurchaseUseDataLine(A_data);
		} else if ("4" === mtype) {
			this.writeCopyUseDataLine(A_data);
		} else if ("5" === mtype) {
			this.writeTransitUseDataLine(A_data);
		}
	}

	writeEtcUseDataLine(A_data) //カード単位のヘッダー行1
	//列でループ
	//行数カウントアップ
	//カード単位のヘッダー行2
	//列でループ
	//行数カウントアップ
	//カード単位のヘッダー行
	//列でループ
	//行数カウントアップ
	//空行を入れるので＋１多くループ
	//プログレスバーを進める
	{
		for (var ccnt = 0; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
		//行ごとの処理
		//文字列があれば出力
		{
			var format = this.getFormat(this.row_no, ccnt, "top");

			switch (ccnt) {
				case 0:
					var str = "\u30AB\u30FC\u30C9\u756A\u53F7:" + A_data[0].cardno_view;
					break;

				case 8:
					str = "\u30AB\u30FC\u30C9\u756A\u53F72:" + A_data[0].bill_cardno_view;
					break;

				case 17:
					str = "\u30AB\u30FC\u30C9\u4F1A\u793E:" + A_data[0].cardconame;
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				var res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
		//行ごとの処理
		//文字列があれば出力
		{
			format = this.getFormat(this.row_no, ccnt, "second");

			switch (ccnt) {
				case 0:
					str = "\u30AB\u30FC\u30C9\u540D\u7FA9:" + A_data[0].card_meigi;
					break;

				case 8:
					str = "\u4F7F\u7528\u8005\u540D:" + A_data[0].username;
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
		//行ごとの処理
		//文字列があれば出力
		{
			format = this.getFormat(this.row_no, ccnt);

			switch (ccnt) {
				case 0:
					str = "\u5229\u7528\u5E74\u6708";
					break;

				case 6:
					str = "\u5229\u7528\u533A\u9593";
					break;

				case 16:
					str = "\u5229\u7528\u533A\u5206";
					break;

				case this.charge_col_2:
					str = "\u91D1\u984D";
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (var cnt = 0; cnt < A_data.length + 1; cnt++) //列でループ
		//行数カウントアップ
		{
			for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //フォーマット取得最後の行
			//行ごとの処理
			//文字列があれば出力
			{
				if (cnt == A_data.length) {
					format = this.getFormat(this.row_no, ccnt, "bottom");
				} else {
					if ("\u5408\u8A08" == A_data[cnt].note) {
						format = this.getFormat(this.row_no, ccnt, "second");
					} else {
						format = this.getFormat(this.row_no, ccnt);
					}
				}

				switch (ccnt) {
					case 0:
						str = A_data[cnt].date;
						break;

					case 6:
						str = "";

						if (A_data[cnt].in_name != "") {
							str += A_data[cnt].in_name + "-";
						}

						if (A_data[cnt].out_name != "") {
							str += A_data[cnt].out_name;
						}

						break;

					case 16:
						str = A_data[cnt].note;
						break;

					case this.charge_col_2:
						str = A_data[cnt].charge;
						break;

					default:
						str = "";
						break;
				}

				str = this.toSjis(str);

				if (str != "") {
					if (this.charge_col_2 === ccnt) {
						res = this.H_View.O_sheet.writeNumber(this.row_no, ccnt, str, format);
					} else {
						res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
					}
				} else {
					res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
				}
			}

			this.row_no++;
		}

		if (this.H_View.bar_pos < 0) {
			this.H_View.bar_pos = 0;
		} else if (this.H_View.bar_pos > 100) {
			this.H_View.bar_pos = 100;
		}

		var step = 100 / (this.H_View.data_cnt * 2);
		this.H_View.bar_pos = this.H_View.bar_pos + step;
		this.H_View.O_bar.moveStep(+this.H_View.bar_pos);
	}

	writePurchaseUseDataLine(A_data) //購買ID単位のヘッダー行1
	//列でループ
	//行数カウントアップ
	//購買ID単位のヘッダー行2
	//列でループ
	//行数カウントアップ
	//購買ID単位のヘッダー行
	//列でループ
	//行数カウントアップ
	//空行を入れるので＋１多くループ
	//プログレスバーを進める
	{
		for (var ccnt = 0; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
		//行ごとの処理
		//文字列があれば出力
		{
			var format = this.getFormat(this.row_no, ccnt, "top");

			switch (ccnt) {
				case 0:
					var str = "\u30ED\u30B0\u30A4\u30F3ID:" + A_data[0].purchid;
					break;

				case 8:
					str = "\u8ACB\u6C42\u5143:" + A_data[0].purchconame;
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				var res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
		//行ごとの処理
		//文字列があれば出力
		{
			format = this.getFormat(this.row_no, ccnt, "second");

			switch (ccnt) {
				case 0:
					str = "\u4E8B\u696D\u6240\u540D:" + A_data[0].postname;
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
		//行ごとの処理
		//文字列があれば出力
		{
			format = this.getFormat(this.row_no, ccnt);

			switch (ccnt) {
				case 0:
					str = "\u65E5\u4ED8";
					break;

				case 3:
					str = "\u660E\u7D30\u756A\u53F7";
					break;

				case 6:
					str = "\u5546\u54C1\u30B3\u30FC\u30C9";
					break;

				case 9:
					str = "\u5546\u54C1\u540D";
					break;

				case 18:
					str = "\u88DC\u52A9\u9805\u76EE";
					break;

				case 20:
					str = "\u74B0\u5883\u5BFE\u5FDC\u5546\u54C1";
					break;

				case 23:
					str = "\u6570\u91CF";
					break;

				case this.charge_col_2:
					str = "\u91D1\u984D";
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (var cnt = 0; cnt < A_data.length + 1; cnt++) //列でループ
		//行数カウントアップ
		{
			for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //フォーマット取得最後の行
			//行ごとの処理
			//文字列があれば出力
			{
				if (cnt == A_data.length) {
					format = this.getFormat(this.row_no, ccnt, "bottom");
				} else //伝票計、合計を太字
					{
						if ("SUX" == A_data[cnt].code || "\u5408\u8A08" == A_data[cnt].itemname) {
							format = this.getFormat(this.row_no, ccnt, "second");
						} else {
							format = this.getFormat(this.row_no, ccnt);
						}
					}

				switch (ccnt) {
					case 0:
						str = A_data[cnt].buydate.substr(0, 10);
						str = str.replace(/-/g, "/");
						break;

					case 3:
						str = A_data[cnt].slipno;
						break;

					case 6:
						str = A_data[cnt].itemcode;
						break;

					case 9:
						str = A_data[cnt].itemname;
						break;

					case 18:
						str = A_data[cnt].comment;
						break;

					case 22:
						str = "";

						if (A_data[cnt].green == true) {
							str = "\u25CF";
						}

						break;

					case 23:
						str = A_data[cnt].itemsum;
						break;

					case this.charge_col_2:
						if ("1" == A_data[cnt].codetype && 0 == A_data[cnt].charge) {
							str = "";
						} else {
							str = A_data[cnt].charge;
						}

						break;

					default:
						str = "";
						break;
				}

				str = this.toSjis(str);

				if (str != "") {
					if (this.charge_col_2 === ccnt || 23 === ccnt) {
						res = this.H_View.O_sheet.writeNumber(this.row_no, ccnt, str, format);
					} else {
						res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
					}
				} else {
					res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
				}
			}

			this.row_no++;
		}

		if (this.H_View.bar_pos < 0) {
			this.H_View.bar_pos = 0;
		} else if (this.H_View.bar_pos > 100) {
			this.H_View.bar_pos = 100;
		}

		var step = 100 / this.H_View.data_cnt;
		this.H_View.bar_pos = this.H_View.bar_pos + step;
		this.H_View.O_bar.moveStep(+this.H_View.bar_pos);
	}

	writeCopyUseDataLine(A_data) //コピー機ID単位のヘッダー行
	//列でループ
	//行数カウントアップ
	//空行を入れるので＋１多くループ
	//プログレスバーを進める
	{
		for (var ccnt = 0; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
		//行ごとの処理
		//文字列があれば出力
		{
			var format = this.getFormat(this.row_no, ccnt, "top");

			switch (ccnt) {
				case 0:
					var str = "\u30B3\u30D4\u30FC\u6A5FID:" + A_data[0].copyid;
					break;

				case 7:
					str = "\u6A5F\u7A2E:" + A_data[0].copyname;
					break;

				case 15:
					str = "\u30E1\u30FC\u30AB\u30FC:" + A_data[0].copyconame;
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				var res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (var cnt = 0; cnt < A_data.length + 1; cnt++) //列でループ
		//行数カウントアップ
		{
			for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //フォーマット取得最後の行
			//行ごとの処理
			//文字列があれば出力
			{
				if (cnt == A_data.length) {
					format = this.getFormat(this.row_no, ccnt, "bottom");
				} else {
					if ("\u5408\u8A08\uFF08\u7A0E\u8FBC\u307F\uFF09" == A_data[cnt].text1) {
						format = this.getFormat(this.row_no, ccnt, "second");
					} else {
						format = this.getFormat(this.row_no, ccnt);
					}
				}

				switch (ccnt) {
					case 0:
						str = A_data[cnt].text1;
						break;

					case 9:
						str += A_data[cnt].text2;
						break;

					case 16:
						str = A_data[cnt].text3;
						break;

					case this.charge_col_2 - 2:
						str = A_data[cnt].text4;
						break;

					default:
						str = "";
						break;
				}

				str = this.toSjis(str);

				if (str != "") {
					res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
				} else {
					res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
				}
			}

			this.row_no++;
		}

		if (this.H_View.bar_pos < 0) {
			this.H_View.bar_pos = 0;
		} else if (this.H_View.bar_pos > 100) {
			this.H_View.bar_pos = 100;
		}

		var step = 100 / (this.H_View.data_cnt * 2);
		this.H_View.bar_pos = this.H_View.bar_pos + step;
		this.H_View.O_bar.moveStep(+this.H_View.bar_pos);
	}

	writeTransitUseDataLine(A_data) //運賃
	//保険金
	//消費税
	//購買ID単位のヘッダー行1
	//列でループ
	//行数カウントアップ
	//購買ID単位のヘッダー行2
	//列でループ
	//行数カウントアップ
	//購買ID単位のヘッダー行
	//列でループ
	//行数カウントアップ
	//合計行と空行を入れるので+2多くループ
	//プログレスバーを進める
	{
		var charge = 0;
		var insurance = 0;
		var excise = 0;
		var A_numcol = [16, 17, 18, 19, 21];

		for (var ccnt = 0; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
		//行ごとの処理
		//文字列があれば出力
		{
			var format = this.getFormat(this.row_no, ccnt, "top");

			switch (ccnt) {
				case 0:
					var str = "\u904B\u9001ID:" + A_data[0].tranid;
					break;

				case 8:
					str = "\u8ACB\u6C42\u5143:" + A_data[0].tranconame;
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				var res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
		//行ごとの処理
		//文字列があれば出力
		{
			format = this.getFormat(this.row_no, ccnt, "second");

			switch (ccnt) {
				case 0:
					str = "\u4E8B\u696D\u6240\u540D:" + A_data[0].postname;
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;

		for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //一行おきに網掛け
		//行ごとの処理
		//文字列があれば出力
		{
			format = this.getFormat(this.row_no, ccnt);

			switch (ccnt) {
				case 0:
					str = "\u65E5\u4ED8";
					break;

				case 3:
					str = "\u4F1D\u7968\u756A\u53F7";
					break;

				case 6:
					str = "\u8377\u53D7\u4EBA\u3082\u3057\u304F\u306F\u8377\u53D7\u5148\u90FD\u9053\u5E9C\u770C";
					break;

				case 13:
					str = "\u8377\u53D7\u4EBATEL";
					break;

				case 17:
					str = "\u500B\u6570";
					break;

				case 18:
					str = "\u91CD\u91CF";
					break;

				case 16:
					str = "\u904B\u8CC3";
					break;

				case 19:
					str = "\u4FDD\u967A\u91D1";
					break;

				case 21:
					str = "\u6D88\u8CBB\u7A0E";
					break;

				case 24:
					str = "\u5099\u8003";
					break;

				default:
					str = "";
					break;
			}

			str = this.toSjis(str);

			if (str != "") {
				res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
			} else {
				res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
			}
		}

		this.row_no++;
		var maxcnt = A_data.length;
		var endline = maxcnt + 1;
		var spaceline = maxcnt + 2;

		for (var cnt = 0; cnt < spaceline + 2; cnt++) //列でループ
		//行数カウントアップ
		{
			var transtype = A_data[cnt].slipno.substr(0, 1);

			for (ccnt = 0;; ccnt <= this.limit_col; ccnt++) //フォーマット取得最後の行
			//行ごとの処理
			//文字列があれば出力
			{
				if (cnt == endline) {
					format = this.getFormat(this.row_no, ccnt, "bottom");
				} else //伝票計、合計を太字
					{
						if (cnt == maxcnt) //$format = $this->getTransitTotalFormat($ccnt, "second");
							{
								format = this.getFormat(this.row_no, ccnt, "second");
							} else {
							format = this.getFormat(this.row_no, ccnt);
						}
					}

				switch (ccnt) {
					case 0:
						str = A_data[cnt].senddate.substr(0, 10);
						str = str.replace(/-/g, "/");
						break;

					case 3:
						str = A_data[cnt].slipno;
						break;

					case 6:
						if (cnt != maxcnt) {
							str = A_data[cnt].to_name;
						} else {
							str = "\u5408\u8A08";
						}

						break;

					case 13:
						str = A_data[cnt].to_telno;
						break;

					case 17:
						str = A_data[cnt].sendcount;
						break;

					case 18:
						if ("9" != transtype) {
							str = A_data[cnt].weight;
						} else {
							str = "";
						}

						break;

					case 16:
						if (cnt != maxcnt) {
							str = this.overNumberFormat(A_data[cnt].charge);
							charge += +A_data[cnt].charge;
						} else {
							str = this.overNumberFormat(charge);
						}

						break;

					case 19:
						if (cnt != maxcnt) {
							str = this.overNumberFormat(A_data[cnt].insurance);
							insurance += +A_data[cnt].insurance;
						} else {
							str = this.overNumberFormat(insurance);
						}

						break;

					case 21:
						if (cnt != maxcnt) {
							str = this.overNumberFormat(A_data[cnt].excise);
							excise += +A_data[cnt].excise;
						} else {
							str = this.overNumberFormat(excise);
						}

						break;

					case 24:
						str = A_data[cnt].comment;
						break;

					default:
						str = "";
						break;
				}

				str = this.toSjis(str);

				if (str != "") {
					if (true == (-1 !== A_numcol.indexOf(ccnt))) {
						res = this.H_View.O_sheet.writeNumber(this.row_no, ccnt, str, format);
					} else {
						res = this.H_View.O_sheet.writeString(this.row_no, ccnt, str, format);
					}
				} else {
					res = this.H_View.O_sheet.writeBlank(this.row_no, ccnt, format);
				}
			}

			this.row_no++;
		}

		if (this.H_View.bar_pos < 0) {
			this.H_View.bar_pos = 0;
		} else if (this.H_View.bar_pos > 100) {
			this.H_View.bar_pos = 100;
		}

		var step = 100 / this.H_View.data_cnt;
		this.H_View.bar_pos = this.H_View.bar_pos + step;
		this.H_View.O_bar.moveStep(+this.H_View.bar_pos);
	}

	displaySmartyEnd() //プログレスバーを終わりまで進める
	{
		this.H_View.O_bar.moveStep(100);
		var str = "<script type=\"text/javascript\">\n\t\t\t\t<!--\n\t\t\t\tdocument.cookie = \"dataDownloadRun=2; path=/\";\n\t\t\t\tdocument.all.progMsg1.innerHTML = '\u30D5\u30A1\u30A4\u30EB\u306E\u751F\u6210\u304C\u7D42\u4E86\u3057\u307E\u3057\u305F\u3002';\n\t\t\t\tdocument.all.progMsg2.innerHTML = '\u3053\u306E\u30A6\u30A3\u30F3\u30C9\u30A6\u3092\u9589\u3058\u3066\u4E0B\u3055\u3044\u3002';\n\t\t\t\tdocument.all.progMsg3.innerHTML = '<form name=\"finish\" method=\"post\" action=\"ExcelDownload.php?serial=" + date("YmdHis") + "\">'\n\t\t\t\t\t\t\t\t\t\t\t\t + '<input type=\"hidden\" name=\"fkey\" value=\"" + this.H_View.fkey + "\">'\n\t\t\t\t\t\t\t\t\t\t\t\t + '<input type=\"submit\" value=\"\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\">'\n\t\t\t\t\t\t\t\t\t\t\t\t + '</form>';\n\t\t\t\tdocument.closeForm.closeButton.value = '\u9589\u3058\u308B';\n\t\t\t\t//-->\n\t\t\t\t</script>\n\t\t\t\t</body>\n\t\t\t\t</html>";
		echo(str);
	}

	getFormat(row_no, col_no, pos = "normal") //表紙の行数を抜く
	//一行おきに網掛け
	//偶数行
	{
		var row = row_no - this.cover_row;
		var format = this.H_View.H_format.empty;

		if (this.row_no % 2 === 0) //各対象単位の最初の行
			{
				if ("top" == pos) {
					switch (col_no) {
						case 0:
							format = this.H_View.H_format.ami_top_left_coner;
							break;

						case this.charge_col_2:
							format = this.H_View.H_format.ami_pos_right_top_line;
							break;

						case this.limit_col:
							format = this.H_View.H_format.ami_top_right_coner;
							break;

						default:
							format = this.H_View.H_format.ami_top_line;
							break;
					}
				} else if ("bottom" == pos) {
					switch (col_no) {
						case 0:
							format = this.H_View.H_format.ami_bottom_left_coner;
							break;

						case this.limit_col:
							format = this.H_View.H_format.ami_bottom_right_coner;
							break;

						default:
							format = this.H_View.H_format.ami_bottom_line;
							break;
					}
				} else if ("second" == pos) {
					switch (col_no) {
						case 0:
							format = this.H_View.H_format.ami_left_line_bold;
							break;

						case this.limit_col:
							format = this.H_View.H_format.ami_right_line_bold;
							break;

						default:
							format = this.H_View.H_format.ami1_bold;
							break;
					}
				} else {
					switch (col_no) {
						case 0:
							format = this.H_View.H_format.ami_left_line;
							break;

						case this.limit_col:
							format = this.H_View.H_format.ami_right_line;
							break;

						default:
							format = this.H_View.H_format.ami1;
							break;
					}
				}
			} else //各対象単位の最初の行
			{
				if ("top" == pos) {
					switch (col_no) {
						case 0:
							format = this.H_View.H_format.top_left_coner;
							break;

						case ccnt === this.charge_col_2:
							format = this.H_View.H_format.pos_right_top_line;
							break;

						case this.limit_col:
							format = this.H_View.H_format.top_right_coner;
							break;

						default:
							format = this.H_View.H_format.top_line;
							break;
					}
				} else if ("bottom" == pos) {
					switch (col_no) {
						case 0:
							format = this.H_View.H_format.bottom_left_coner;
							break;

						case this.limit_col:
							format = this.H_View.H_format.bottom_right_coner;
							break;

						default:
							format = this.H_View.H_format.bottom_line;
							break;
					}
				} else if ("second" == pos) {
					switch (col_no) {
						case 0:
							format = this.H_View.H_format.left_line_bold_font;
							break;

						case this.limit_col:
							format = this.H_View.H_format.right_line_bold_font;
							break;

						default:
							format = this.H_View.H_format.bold;
							break;
					}
				} else {
					switch (col_no) {
						case 0:
							format = this.H_View.H_format.left_line;
							break;

						case this.limit_col:
							format = this.H_View.H_format.right_line;
							break;

						default:
							format = this.H_View.H_format.empty;
							break;
					}
				}
			}

		return format;
	}

	getTransitTotalFormat(col_no, pos = "normal") //表紙の行数を抜く
	//一行おきに網掛け
	//偶数行
	{
		var row = this.row_no - this.cover_row;
		var format = this.H_View.H_format.empty;

		if (this.row_no % 2 === 0) //各対象単位の最初の行
			{
				if ("top" == pos) {
					switch (col_no) {
						case 0:
							format = this.H_View.H_format.ami_top_left_coner;
							break;

						case this.charge_col_2:
							format = this.H_View.H_format.ami_pos_right_top_line;
							break;

						case this.limit_col:
							format = this.H_View.H_format.ami_top_right_coner;
							break;

						default:
							format = this.H_View.H_format.ami_top_line;
							break;
					}
				} else if ("bottom" == pos) {
					switch (col_no) {
						case 0:
							format = this.H_View.H_format.ami_bottom_left_coner;
							break;

						case this.limit_col:
							format = this.H_View.H_format.ami_bottom_right_coner;
							break;

						default:
							format = this.H_View.H_format.ami_bottom_line;
							break;
					}
				} else if ("second" == pos) {
					switch (col_no) {
						case 0:
							format = this.H_View.H_format.ami_left_line_bold;
							break;

						case this.limit_col:
							format = this.H_View.H_format.ami_right_line_bold;
							break;

						default:
							format = this.H_View.H_format.ami1;
							break;
					}
				} else {
					switch (col_no) {
						case 0:
							format = this.H_View.H_format.ami_left_line;
							break;

						case this.limit_col:
							format = this.H_View.H_format.ami_right_line;
							break;

						default:
							format = this.H_View.H_format.ami1;
							break;
					}
				}
			} else //各対象単位の最初の行
			{
				if ("top" == pos) {
					switch (col_no) {
						case 0:
							format = this.H_View.H_format.top_left_coner;
							break;

						case ccnt === this.charge_col_2:
							format = this.H_View.H_format.pos_right_top_line;
							break;

						case this.limit_col:
							format = this.H_View.H_format.top_right_coner;
							break;

						default:
							format = this.H_View.H_format.top_line;
							break;
					}
				} else if ("bottom" == pos) {
					switch (col_no) {
						case 0:
							format = this.H_View.H_format.bottom_left_coner;
							break;

						case this.limit_col:
							format = this.H_View.H_format.bottom_right_coner;
							break;

						default:
							format = this.H_View.H_format.bottom_line;
							break;
					}
				} else if ("second" == pos) {
					switch (col_no) {
						case 0:
							format = this.H_View.H_format.left_line_bold_font;
							break;

						case this.limit_col:
							format = this.H_View.H_format.right_line_bold_font;
							break;

						default:
							format = this.H_View.H_format.empty;
							break;
					}
				} else {
					switch (col_no) {
						case 0:
							format = this.H_View.H_format.left_line;
							break;

						case this.limit_col:
							format = this.H_View.H_format.right_line;
							break;

						default:
							format = this.H_View.H_format.empty;
							break;
					}
				}
			}

		return format;
	}

	setDataCnt(cnt) {
		this.H_View.data_cnt = cnt;
	}

	overNumberFormat(val, flg = false) {
		if ("" == val) {
			return "";
		}

		if (true == flg) {
			return number_format(val);
		}

		return val;
	}

	__destruct() {
		super.__destruct();
	}

};