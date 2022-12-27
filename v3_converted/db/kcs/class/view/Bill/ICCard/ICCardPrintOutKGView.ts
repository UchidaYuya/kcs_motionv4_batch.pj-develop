//error_reporting(E_ALL);
//TCPDFの読み込み
//
//ICCardPrintOutPersonalView
//交通費PDF出力
//@uses ViewSmarty
//@package
//@author date
//@since 2015/11/02
//

require("view/ViewSmarty.php");

require("tcpdf/config/lang/jpn.php");

require("tcpdf/tcpdf.php");

//
//getLocalSession
//ローカルセッションの取得
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
//
//
//outputPDF
//PDFの出力をするぽよ
//@author web
//@since 2015/11/09
//
//@param mixed $H_data
//@param mixed $A_userinfo
//@access public
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class ICCardPrintOutKGView extends ViewSmarty {
	static PUB = "/Bill";

	constructor() {
		super();
		this.O_Sess = MtSession.singleton();
	}

	getLocalSession() {
		var H_sess = {
			[ICCardPrintOutKGView.PUB]: this.O_Sess.getPub(ICCardPrintOutKGView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	checkCGIParam() //中身は空っぽ
	{}

	createTitle(docmonth) {
		return "\n<table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n\t<tr>\n\t\t<td width=\"4%\">&nbsp;</td>\n\t\t<td width=\"53%\">\n\t\t\t<table style=\"border-bottom-style:dotted\">\n\t\t\t\t<tr>\n\t\t\t\t\t<td width=\"160\" align=\"center\">\n\t\t\t\t\t\t<font size=\"12\">\n\t\t\t\t\t\t" + docmonth + "\u6708\u5206\u4EA4\u901A\u8CBB\u7CBE\u7B97\u66F8\n\t\t\t\t\t\t</font>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</table>\n\t\t</td>\n\t\t<td width=\"24%\">\n\t\t\t<table border=\"1\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n\t\t\t<tr>\n\t\t\t\t<td align=\"center\">\n\t\t\t\t\t<div style=\"font-size:8\">\n\t\t\t\t\t\t\u67FB\u7167\u5370\n\t\t\t\t\t</div>\n\t\t\t\t</td>\n\t\t\t\t<td align=\"center\">\n\t\t\t\t\t<div style=\"font-size:8\">\n\t\t\t\t\t\t\u627F\u8A8D\u5370\n\t\t\t\t\t</div>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td height=\"63.5\">&nbsp;</td>\n\t\t\t\t<td>&nbsp;</td>\n\t\t\t</tr>\n\t\t\t</table>\n\t\t</td>\n\t\t<td width=\"19%\">&nbsp;</td>\n\t</tr>\n</table>\n";
	}

	createDate(date) {
		setlocale(LC_TIME, "ja_JP.utf8", "Japanese_Japan.932");
		var text = strftime("%EC%Ey\u5E74%B%#d\u65E5", strtotime(date));
		return "\t\n<table border=\"0\" width=\"100%\">\n<tr>\n\t<td width=\"5%\">&nbsp;</td>\n\t<td align=\"left\">\n\t\t<div style=\"font-size:8\">\n\t\t\t" + text + "\n\t\t</div>\n\t</td>\n</tr>\n</table>";
	}

	createName(username) {
		return "\n<table border=\"0\" width=\"100%\">\n\t<tr>\n\t\t<td width=\"90%\" align=\"right\">\n\t\t\t<div style=\"font-size:12\"></div>\n\t\t</td>\n\t\t<td width=\"10%\" rowspan=\"3\">&nbsp;</td>\n\t</tr>\n\t<tr>\n\t\t<td height=\"3.52777777778\">&nbsp;</td>\n\t</tr>\n\t<tr>\n\t\t<td align=\"right\">\n\t\t\t<div style=\"font-size:12\">\n\t\t\t\t" + username + "\n\t\t\t\t&nbsp;&nbsp;&nbsp;&#12958;\n\t\t\t</div>\n\t\t</td>\n\t</tr>\n</table>\n<br><br>\n";
	}

	createHeader() {
		return "\n<font size=\"8\">\n<table border=\"1\">\n<tr>\n\t<th align=\"center\" width=\"4%\">No</th>\n\t<th align=\"center\" width=\"5%\">\u533A\u5206</th>\n\t<th align=\"center\" width=\"10%\">\u4F7F\u7528\u65E5</th>\n\t<th align=\"center\" width=\"5%\">\u66DC\u65E5</th>\n\t<th align=\"center\" width=\"20%\">\u4F7F\u7528\u533A\u9593</th>\n\t<th align=\"center\" width=\"13%\">\u4EA4\u901A\u6A5F\u95A2</th>\n\t<th align=\"center\" width=\"10%\">\u4F7F\u7528\u6599\u91D1</th>\n\t<th align=\"center\" width=\"15%\">\u8A2A\u554F\u5148</th>\n\t<th align=\"center\" width=\"0\">\u5099\u8003</th>\n</tr>\n</table>\n</font>";
	}

	createLine(no, data) //使用区間
	//交通機関
	{
		var use_range = data.history_tb_start + "\u21D2" + data.history_tb_destination;
		var facility = data.history_tb_in_facility;

		if (data.history_tb_in_facility != data.history_tb_out_facility) {
			facility += "<br>" + data.history_tb_out_facility;
		}

		var week = "";

		switch (data.history_tb_dow) {
			case 1:
				week = "\u6708";
				break;

			case 2:
				week = "\u706B";
				break;

			case 3:
				week = "\u6C34";
				break;

			case 4:
				week = "\u6728";
				break;

			case 5:
				week = "\u91D1";
				break;

			case 6:
				week = "\u571F";
				break;

			case 0:
				week = "\u65E5";
				break;
		}

		var charge = number_format(data.history_tb_charge);
		return "\n<table border=\"1\" cellpadding=\"2\">\n<tr>\n\t<th align=\"center\" width=\"4%\">" + no + "</th>\n\t<th align=\"center\" width=\"5%\">" + data.history_tb_iccardtype + "</th>\n\t<th align=\"center\" width=\"10%\">" + data.history_tb_date + "</th>\n\t<th align=\"center\" width=\"5%\">" + week + "<br></th>\n\t<th align=\"center\" width=\"20%\">" + use_range + "</th>\n\t<th align=\"center\" width=\"13%\">" + facility + "</th>\n\t<th align=\"right\" width=\"10%\">" + charge + "</th>\n\t<th align=\"left\" width=\"15%\">" + data.history_tb_visit + "</th>\n\t<th align=\"left\" width=\"0\">" + data.history_tb_note + "</th>\n</tr>\n</table>";
	}

	createBlankLine() {
		return "\n<table border=\"1\" cellpadding=\"2\">\n<tr>\n\t<th align=\"center\" width=\"4%\"></th>\n\t<th align=\"center\" width=\"5%\"></th>\n\t<th align=\"center\" width=\"10%\"></th>\n\t<th align=\"center\" width=\"5%\"><br><br></th>\n\t<th align=\"center\" width=\"20%\"></th>\n\t<th align=\"center\" width=\"13%\"></th>\n\t<th align=\"center\" width=\"10%\"></th>\n\t<th align=\"left\" width=\"15%\"></th>\n\t<th align=\"left\" width=\"0\"></th>\n</tr>\n</table>";
	}

	createNotBill() {
		return "\n<table border=\"1\">\n<tr>\n\t<td style=\"font-size:14\"></td>\n</tr>\n</table>";
	}

	createBill(bill) {
		bill = number_format(bill);
		return "\n<table>\n<tr>\n\t<td align=\"center\" style=\"font-size:14\">\n\t\t\u5408\u8A08\u91D1\u984D\n\t</td>\n\t<td align=\"center\" style=\"font-size:14\">\n\t\t\uFFE5&nbsp;" + bill + "\n\t</td>\n</tr>\n\n</table>";
	}

	createFooter(page, page_max) {
		page = page + "/" + page_max;
		var compname = "\u682A\u5F0F\u4F1A\u793E \u5E84\u7530\u5546\u4E8B";
		return "\n\t\t\t<br/>\n\t\t\t<br/>\n\t\t\t<table border=\"0\" width=\"100%\">\n\t\t\t\t<tr>\n\t\t\t\t\t<td width=\"50%\" align=\"left\">\n\t\t\t\t\t\t<div style=\"font-size:8\">" + page + "</div>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td width=\"50%\" align=\"right\">\n\t\t\t\t\t\t<img src=\"/images/kg.png\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</table>";
	}

	outputPDF(H_data, A_userinfo, printdate, docmonth) //PDF オブジェクトを作成し、以降の処理で操作します
	//$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true);
	//set document information
	//$pdf->SetCreator(PDF_CREATOR);
	//$pdf->SetAuthor('Nicola Asuni');
	//$pdf->SetSubject('TCPDF Tutorial');
	//$pdf->SetKeywords('TCPDF, PDF, example, test, guide');
	//ヘッダーとフッタを消す
	//set default monospaced font
	//set margins
	//$pdf->SetMargins(PDF_MARGIN_LEFT, 0, PDF_MARGIN_RIGHT);
	//$pdf->SetMargins(0, 0, 5);
	//set auto page breaks
	//$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
	//set image scale factor
	//セルの行間
	//set font
	//$pdf->SetFont("arialunicid0", "", 20);
	//$pdf->SetFont("kozminproregular", "", 20);
	//$font = $pdf->addTTFfont("/kcs/class/tcpdf_new/fonts/ipag.ttf");
	//		$pdf->SetFont($font, "", 20);
	//$pdf->SetFont("ipag", "", 20);
	//$this->order_detail = $this->getOrderDetail( $H_view );
	//templateの取得
	//ページカウント用
	//請求
	//$max_y = 268;
	//データを書き込んでいく
	//ブランクデータで空白を埋める
	//書き込み用のhtml作成
	//金額枠
	//金額
	//フッターを描く
	//PDF を出力します
	{
		var pdf = new TCPDF("P", PDF_UNIT, "A4", true);
		pdf.SetTitle("\u4EA4\u901A\u8CBB\u6E05\u7B97\u66F8");
		pdf.setPrintHeader(false);
		pdf.setPrintFooter(false);
		pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
		pdf.SetMargins(8, 15, 8);
		pdf.SetAutoPageBreak(false);
		pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
		pdf.setCellHeightRatio(1.2);
		pdf.SetCellPadding(0);
		pdf.SetFont("kozgopromedium", "", 8);
		var O_setting = this.getSetting();
		var template_path = O_setting.KCS_DIR + "/template/Bill/ICCard/";
		var pageno = 0;
		var bill = 0;
		var max_y = 260;

		if (!H_data) //データがない場合はこっち
			//ページの追加
			//タイトルと判子
			//日付
			//名前
			//ヘッダー
			//フラグをオフにする
			//ページ数
			{
				pdf.AddPage();
				var html = this.createTitle(docmonth);
				pdf.writeHTML(html, true, false, true, false, "");
				html = this.createDate(printdate);
				pdf.writeHTML(html, false, false, true, false, "");
				html = this.createName(A_userinfo.username);
				pdf.writeHTML(html, false, false, true, false, "");
				html = this.createHeader();
				pdf.writeHTML(html, false, false, true, false, "");
				var add_page_flag = false;
				pageno++;
			} else //データがある場合はこっち
			//ページ追加フラグ
			{
				add_page_flag = true;

				for (var key in H_data) //書き込むデータhtmlの作成
				//書き込み用のhtml作成
				//現在値を取得
				{
					var value = H_data[key];
					bill += value.history_tb_charge;
					var data_html = this.createLine(key + 1, value);
					var y = pdf.getY();

					if (y + pdf.getNumLines(data_html) >= max_y) //271以上であれば、次のページへ進むようにする
						//文末書き込み
						//新規ページ追加フラグを立てる
						{
							html = this.createNotBill();
							pdf.writeHTML(html, false, false, false, false, "");
							add_page_flag = true;
						}

					if (add_page_flag) //ページの追加
						//最初のページにはタイトルつける
						//フラグをオフにする
						//ページ数
						{
							pdf.AddPage();

							if (pageno == 0) //タイトルと判子
								//日付
								//名前
								{
									html = this.createTitle(docmonth);
									pdf.writeHTML(html, true, false, true, false, "");
									html = this.createDate(printdate);
									pdf.writeHTML(html, false, false, true, false, "");
									html = this.createName(A_userinfo.username);
									pdf.writeHTML(html, false, false, true, false, "");
								}

							html = this.createHeader();
							pdf.writeHTML(html, false, false, true, false, "");
							add_page_flag = false;
							pageno++;
						}

					pdf.writeHTML(data_html, false, false, false, false, "");
				}
			}

		var blank_html = this.createBlankLine();
		var add_y = pdf.getNumLines(data_html);

		do //現在値を取得
		//書き込むデータhtmlの作成
		{
			y = pdf.getY();

			if (y + add_y >= max_y) //271以上であれば、次のページへ進むようにする
				//文末書き込み
				//末尾にきたら終わり
				{
					html = this.createNotBill();
					pdf.writeHTML(html, false, false, false, false, "");
					break;
				}

			pdf.writeHTML(blank_html, false, false, false, false, "");
		} while (1);

		y = pdf.GetY();
		html = this.createNotBill();
		pdf.writeHTML(html, false, false, false, false, "");
		pdf.SetY(y);
		html = this.createBill(bill);
		pdf.writeHTML(html, false, false, false, false, "");

		for (var i = 0; i < pageno; i++) //ページ設定する
		//フッター書く
		{
			var page = i + 1;
			pdf.SetPage(page);
			pdf.SetY(save_y[page]);
			pdf.SetY(270);

			if (page < pageno) {
				html = this.createFooter(page, pageno);
			} else //最後のページはここ
				{
					html = this.createFooter(page, pageno);
				}

			pdf.writeHTML(html, false, false, false, false, "");
		}

		pdf.Output("\u4EA4\u901A\u8CBB\u6E05\u7B97\u66F8.pdf", "I");
	}

	__destruct() {
		super.__destruct();
	}

};