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
//displaySmarty
//displaySmarty
//@author date
//@since 2015/11/02
//
//@param array $H_sess
//@param array $A_data
//@param array $A_auth
//@param ManagementUtil $O_manage
//@access public
//@return void
//
//
//subArray
//配列の抜き出しをするよ
//@author web
//@since 2015/11/09
//
//@param mixed $H_data
//@param mixed $entry
//@param mixed $view_count
//@access private
//@return void
//
//
//calcTotal
//料金の合計を求める
//@author web
//@since 2015/11/09
//
//@param mixed $H_data
//@access private
//@return void
//
//
//split_br
//指定した行で文字いれる
//@author web
//@since 2015/11/10
//
//@param mixed $str
//@param mixed $len
//@access private
//@return void
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
class ICCardPrintOutResortView extends ViewSmarty {
	static PUB = "/Bill";

	constructor() {
		super();
		this.O_Sess = MtSession.singleton();
	}

	getLocalSession() {
		var H_sess = {
			[ICCardPrintOutResortView.PUB]: this.O_Sess.getPub(ICCardPrintOutResortView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	checkCGIParam() //中身は空っぽ
	{}

	fetchSmarty(H_data, A_userinfo, printdate, total, pageno) //表示を返す・・・
	//$this->get_Smarty()->display( $template );
	//exit;
	{
		this.get_Smarty().assign("H_data", H_data);
		this.get_Smarty().assign("A_userinfo", A_userinfo);
		this.get_Smarty().assign("pageno", pageno + 1);
		this.get_Smarty().assign("total", total);
		this.get_Smarty().assign("printdate", printdate);
		this.get_Smarty().assign("line_height", 23);
		this.get_Smarty().assign("num_size", 10);
		this.get_Smarty().assign("money_width", 90);
		var tplno = pageno;

		if (tplno > 1) {
			tplno = 1;
		}

		var O_setting = this.getSetting();
		var template = O_setting.KCS_DIR + "/template/Bill/ICCard/iccard_resort_" + tplno + ".tpl";
		return this.get_Smarty().fetch(template);
	}

	subArray(H_data, entry, view_count) //表示する明細があるかどうか
	{
		var ret = Array();
		var cnt = H_data.length;

		if (entry >= cnt) //もう表示するものがない
			{
				return ret;
			}

		for (var i = 0; i < view_count; i++) {
			var idx = entry + i;

			if (idx >= cnt) {
				break;
			}

			ret.push(H_data[idx]);
		}

		return ret;
	}

	calcTotal(H_data) {
		var res = {
			0: 0,
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			total: 0
		};

		for (var key in H_data) {
			var value = H_data[key];
			res[value.charge_type] += value.history_tb_charge;
			res.total += value.history_tb_charge;
		}

		return res;
	}

	insert_br(str, len) {
		var encode = mb_detect_encoding(str);
		var res = "";
		var entry = 0;

		do {
			var temp = mb_substr(str, entry, len, encode);

			if (!temp) {
				break;
			}

			entry += len;

			if (res != "") {
				res += "<br>";
			}

			res += temp;
		} while (1);

		return res;
	}

	outputPDF(H_data, A_userinfo, printdate) //PDF オブジェクトを作成し、以降の処理で操作します
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
	//set font
	//$pdf->SetFont("arialunicid0", "", 20);
	//$pdf->SetFont("kozminproregular", "", 20);
	//$font = $pdf->addTTFfont("/kcs/class/tcpdf_new/fonts/ipag.ttf");
	//		$pdf->SetFont($font, "", 20);
	//$pdf->SetFont("ipag", "", 20);
	//$this->order_detail = $this->getOrderDetail( $H_view );
	//納品書作成
	//通勤経路、20文字ごとに改行いれる
	{
		var pdf = new TCPDF("L", PDF_UNIT, "A3", true);
		pdf.SetTitle("\u4EA4\u901A\u8CBB\u6E05\u7B97\u66F8");
		pdf.setPrintHeader(false);
		pdf.setPrintFooter(false);
		pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
		pdf.SetMargins(2, 1, 2);
		pdf.SetAutoPageBreak(false);
		pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
		pdf.SetFont("kozgopromedium", "", 20);
		var entry = 0;
		var pageno = 0;
		var view_count = 24;
		var total = this.calcTotal(H_data);
		A_userinfo.building = this.insert_br(A_userinfo.building, 20);

		do //データ修正
		//1ページ目以降で表示するデータがなければ終わり
		//次に備える
		{
			var data = this.subArray(H_data, entry, view_count);

			for (var key in data) //訪問先(顧客名)を12文字にする
			//宿泊施設名を12文字にする
			//乗車区間乗車
			//乗車区間降車
			//交通機関の文字数制限
			{
				var value = data[key];
				var encode = mb_detect_encoding(value.history_tb_visit);
				var temp = mb_substr(value.history_tb_visit, 0, 12, encode);
				data[key].history_tb_visit = temp;
				encode = mb_detect_encoding(value.history_tb_note);
				temp = mb_substr(value.history_tb_note, 0, 12, encode);
				data[key].history_tb_note = temp;
				encode = mb_detect_encoding(value.history_tb_start);

				if (mb_strlen(value.history_tb_start) < 16) {
					data[key].history_tb_start_2 = "";
				} else {
					data[key].history_tb_start = mb_substr(value.history_tb_start, 0, 16, encode);
					data[key].history_tb_start_2 = mb_substr(value.history_tb_start, 16, 16, encode);
				}

				encode = mb_detect_encoding(value.history_tb_destination);

				if (mb_strlen(value.history_tb_destination) < 16) {
					data[key].history_tb_destination_2 = "";
				} else {
					data[key].history_tb_destination = mb_substr(value.history_tb_destination, 0, 16, encode);
					data[key].history_tb_destination_2 = mb_substr(value.history_tb_destination, 16, 16, encode);
				}

				encode = mb_detect_encoding(value.facility);

				if (mb_strlen(value.facility, encode) < 6) {
					data[key].facility = value.facility;
				} else {
					data[key].facility = mb_substr(value.facility, 0, 6, encode);
				}
			}

			if (!data && pageno != 0) {
				break;
			}

			pdf.AddPage();
			var html = this.fetchSmarty(data, A_userinfo, printdate, total, pageno);
			pdf.writeHTML(html, true, false, true, false, "");
			entry += view_count;
			view_count = 39;
			pageno++;
		} while (true);

		pdf.Output("\u4EA4\u901A\u8CBB\u6E05\u7B97\u66F8.pdf", "I");
	}

	__destruct() {
		super.__destruct();
	}

};