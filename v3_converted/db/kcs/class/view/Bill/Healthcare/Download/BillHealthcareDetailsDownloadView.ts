//
//コピー機管理ダウンロードのView
//
//更新履歴：<br>
//2010/03/05 宝子山浩平 作成
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2010/03/05
//@filesource
//@uses BillDownloadViewBase
//
//
//error_reporting(E_ALL);
//
//全て一覧用ダウンロードのView
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2010/03/05
//@uses BillDownloadViewBase
//

require("view/Bill/BillDownloadViewBase.php");

//
//コンストラクタ <br>
//
//@author houshiyama
//@since 2010/03/05
//
//@access public
//@return void
//@uses BillUtil
//
//
//CGIパラメータのチェックを行う<br>
//
//@author houshiyama
//@since 2010/03/05
//
//@access public
//@return void
//
//
//menu画面のセッションを取得
//
//@author houshiyama
//@since 2010/03/05
//
//@access public
//@return void
//
//
//ヘッダー行の項目決定
//
//@author houshiyama
//@since 2010/03/05
//
//@param array $H_kamoku
//@param array $A_auth
//@param array $H_sess
//@param $mode
//@access public
//@return void
//
//
//ファイル名決定
//
//@author houshiyama
//@since 2010/03/05
//
//@param $mode
//@access public
//@return void
//
//
//各ページ固有のヘッダー行出力
//
//@author houshiyama
//@since 2010/03/05
//
//@param array $A_head
//@param array $H_sess
//@access protected
//@return void
//
//
//データ行の出力（請求明細）
//
//@author houshiyama
//@since 2010/03/05
//
//@param array $A_data
//@access protected
//@return void
//
//public function outputDataLine( array $A_data ){
//		for( $cnt = 0; $cnt < count( $A_data ); $cnt++ ){
//			foreach( $A_data[$cnt] as $key => $val ){
//				$A_data[$cnt][$key] = $this->H_View["H_dlprop"]["qt"] . strtr( $val, $this->H_View["H_dlprop"]["H_strtr"] ) . $this->H_View["H_dlprop"]["qt"];
//			}
//			$A_str = array( 
//							$A_data[$cnt]["userpostid"],
//							$A_data[$cnt]["postname"],
//							$A_data[$cnt]["tranid"],
//							$A_data[$cnt]["tranconame"],
//							$A_data[$cnt]["code"],
//							$A_data[$cnt]["codename"],
//							$A_data[$cnt]["sendcount"],
//							$A_data[$cnt]["weight"],
//							$A_data[$cnt]["charge"],
//							$A_data[$cnt]["taxkubun"]
//							);
//			$str = implode( $this->H_View["H_dlprop"]["separator1"], $A_str ) . $this->H_View["H_dlprop"]["RC"];
//			if( self::DEBUG != "on" ){
//				print $this->mbConvertEncodingDL( $str );
//			}
//			else{
//				print $str . "<br>";
//			}
//		}
//	}
//
//データ行の出力（利用明細用）
//
//@author houshiyama
//@since 2010/03/05
//
//@param array $A_data
//@access protected
//@return void
//
//
//Download出力<br>
//
//ヘッダー設定<br>
//ヘッダー行CSV出力<br>
//部署単位の時はカレント部署情報出力<br>
//残りのヘッダーとデータ行出力<br>
//
//@author houshiyama
//@since 2010/03/05
//
//@param array $A_auth（権限一覧）
//@param array $H_kamoku（科目情報行）
//@param array $H_sess（CGI）
//@param array $A_head（ヘッダー行）
//@param array $O_model
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/03/05
//
//@access public
//@return void
//
class BillHealthcareDetailsDownloadView extends BillDownloadViewBase {
	constructor() {
		super();
	}

	checkCGIParam() //モードを受け取る
	//getパラメータは消す
	{
		if (undefined !== _GET.dlmode == true && is_numeric(_GET.dlmode) == true) {
			this.H_Local.dlmode = _GET.dlmode;
		}

		this.O_Sess.setSelfAll(this.H_Local);

		if (_GET.length > 0) {
			MtExceptReload.raise(undefined);
		}
	}

	getLocalSession() //呼び出しページのセッションも取得し合体
	{
		var H_sess = {
			[BillHealthcareDetailsDownloadView.PUB]: this.O_Sess.getPub(BillHealthcareDetailsDownloadView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		var pare_dir = dirname(_SERVER.PHP_SELF).replace(/\/Download/g, "");

		if (H_sess.SELF.dlmode === "0" || H_sess.SELF.dlmode === "1") {
			var key = pare_dir + "/menu.php";
		} else {
			key = pare_dir + "/BillHealthcareDetails.php";
		}

		var H_pare_sess = this.O_Sess.getPub(key);
		H_sess.SELF = H_sess.SELF + H_pare_sess;
		return H_sess;
	}

	getHeaderLine(H_kamoku: {} | any[], A_auth: {} | any[], H_sess: {} | any[]) //if( "0" === $H_sess["dlmode"] || "2" === $H_sess["dlmode"] ){
	//			$this->H_View["A_head"] = array( "部署ID",
	//											"部署名",
	//											"運送ID",
	//											"会社",
	//											"内訳コード",
	//											"内訳",
	//											"数量",
	//											"重量",
	//											"金額",
	//											"税区分"
	//											);
	//		}
	//		else{
	//			$this->H_View["A_head"] = array( "部署ID",
	//											"部署名",
	//											"運送ID",
	//											"会社",
	//											"発送日",
	//											"伝票番号",
	//											"荷受人もしくは荷受先都道府県",
	//											"荷受人TEL",
	//											"個数",
	//											"重量",
	//											"運賃",
	//											"保険料",
	//											"消費税",
	//											"備考"
	//											);
	//		}
	{
		this.H_View.A_head = ["\u90E8\u7F72ID", "\u90E8\u7F72\u540D", "\u30D8\u30EB\u30B9\u30B1\u30A2ID", "\u4F1A\u793E", "\u6D3B\u52D5\u65E5\u6642", "\u6B69\u6570", "\u6D88\u8CBB\u30AB\u30ED\u30EA\u30FC(kcal)", "\u79FB\u52D5\u8DDD\u96E2(km)"];
	}

	getFileName(mode) {
		if (0 == mode) {
			this.H_View.filename = "allhealthcare_details_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
		} else {
			this.H_View.filename = "healthcare_details_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
		}
	}

	outputHeaderLinePeculiar(A_head: {} | any[], H_sess: {} | any[], O_model) {
		print("\u8ACB\u6C42\u660E\u7D30" + this.H_View.H_dlprop.separator1);

		if (BillHealthcareDetailsDownloadView.DEBUG != "on") {
			print(this.mbConvertEncodingDL(str));
		} else {
			print(str + "<br>");
		}
	}

	outputHistoryDataLine(A_data: {} | any[]) {
		for (var cnt = 0; cnt < A_data.length; cnt++) {
			{
				let _tmp_0 = A_data[cnt];

				for (var key in _tmp_0) {
					var val = _tmp_0[key];
					A_data[cnt][key] = this.H_View.H_dlprop.qt + strtr(val, this.H_View.H_dlprop.H_strtr) + this.H_View.H_dlprop.qt;
				}
			}
			var A_str = [A_data[cnt].userpostid, A_data[cnt].postname, A_data[cnt].healthid, A_data[cnt].healthconame, A_data[cnt].datadate, A_data[cnt].steps, A_data[cnt].calories, A_data[cnt].move];
			var str = A_str.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC;

			if (BillHealthcareDetailsDownloadView.DEBUG != "on") {
				print(this.mbConvertEncodingDL(str));
			} else {
				print(str + "<br>");
			}
		}
	}

	displayCSV(A_auth: {} | any[], H_kamoku: {} | any[], H_sess: {} | any[], A_data: {} | any[], O_model) {
		if (BillHealthcareDetailsDownloadView.DEBUG != "on") {
			header("Pragma: private");
			header("Content-disposition: attachment; filename=" + this.H_View.filename);
			header("Content-type: application/octet-stream; name=" + this.H_View.filename);
		}

		if ("write" == this.H_View.H_dlprop.title) {
			this.outputHeaderLine(this.H_View.A_head);
		}

		if ("0" === H_sess.dlmode || "2" === H_sess.dlmode) {
			this.outputDataLine(A_data);
		} else {
			this.outputHistoryDataLine(A_data);
		}

		throw die();
	}

	__destruct() {
		super.__destruct();
	}

};