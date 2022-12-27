//
//電話管理ダウンロードView
//
//更新履歴：<br>
//2008/03/21 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/04/02
//@filesource
//@uses ManagementDownloadViewBase
//
//
//error_reporting(E_ALL);
//
//電話管理ダウンロードView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/04/02
//@uses ManagementDownloadViewBase
//

require("view/Management/ManagementDownloadViewBase.php");

//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2008/04/02
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//電話ダウンロードのCGIパラメータのチェックを行う<br>
//
//デフォルト値を入れる<br>
//
//確認画面へが実行されたら配列に入れる<br>
//部署変更が実行されたら配列を書換え<br>
//リセットが実行されたら配列を消してリロード<br>
//
//配列をセッションに入れる<br>
//
//@author houshiyama
//@since 2008/03/13
//
//@access public
//@return void
//
//
//ヘッダー行の項目決定
//
//@author houshiyama
//@since 2008/04/02
//
//@param array $A_auth
//@param array $H_prop
//@param array $H_sess
//@access public
//@return void
//
//
//ファイル名決定
//
//@author houshiyama
//@since 2008/04/02
//
//@access public
//@return void
//
//
//データ行の出力
//
//@author houshiyama
//@since 2008/04/02
//
//@param array $A_auth
//@param array $A_data
//@param array $H_prop
//@param array $H_sess
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/02
//
//@access public
//@return void
//
class TelDownloadView extends ManagementDownloadViewBase {
	static AUTO_NAME = "auto";
	static AUTO_VALUE = "\u81EA\u52D5\u66F4\u65B0\u3059\u308B";
	static MANUAL_NAME = "manual";
	static MANUAL_VALUE = "\u81EA\u52D5\u5909\u66F4\u3057\u306A\u3044";
	static BUSINESS_NAME = 1;
	static BUSINESS_VALUE = "\u696D\u52D9\u7528";
	static DEMO_NAME = 2;
	static DEMO_VALUE = "\u30C7\u30E2\u7528";

	constructor() {
		super();
	}

	checkCGIParam() //リセットが実行されたらCGIパラメータを消してリロード
	{
		if (undefined !== _GET.dlmode == true) {
			this.H_Local.get = _GET;
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}
	}

	getHeaderLine(A_auth: {} | any[], H_prop: {} | any[], H_sess: {} | any[]) //表示言語分岐
	{
		if (this.O_Sess.language == "ENG") //内線番号管理権限がある時
			//請求閲覧権限がある時
			//予約ダウンロードのみの項目追加
			{
				this.H_View.A_head = Array();
				this.H_View.A_head.push("System department ID");
				this.H_View.A_head.push("Department ID");
				this.H_View.A_head.push("Department name");
				this.H_View.A_head.push("Phone number");
				this.H_View.A_head.push("Phone number(without hyphens or parentheses)");

				if (-1 !== A_auth.indexOf("fnc_extension_tel_co") == true) {
					this.H_View.A_head.push("Extension number");
				}

				this.H_View.A_head.push("E-mail address");
				this.H_View.A_head.push("Telephone carrier");
				this.H_View.A_head.push("Telephone carrier ID");
				this.H_View.A_head.push("Service type");
				this.H_View.A_head.push("Service type ID");
				this.H_View.A_head.push("Payment method");
				this.H_View.A_head.push("Payment method ID");
				this.H_View.A_head.push("\u56DE\u7DDA\u533A\u5206");
				this.H_View.A_head.push("Billing plan");
				this.H_View.A_head.push("Billing plan ID");
				this.H_View.A_head.push("Packetpack");
				this.H_View.A_head.push("Packetpack ID");
				this.H_View.A_head.push("Point service");
				this.H_View.A_head.push("Point service ID");
				this.H_View.A_head.push("Region");
				this.H_View.A_head.push("Region ID");
				this.H_View.A_head.push("Discount service");
				this.H_View.A_head.push("Option");
				this.H_View.A_head.push("Safeguarding");
				this.H_View.A_head.push("Contracted date");
				this.H_View.A_head.push("Purchased date of your cuurent phone  ");
				this.H_View.A_head.push("USIM number");
				this.H_View.A_head.push("User");
				this.H_View.A_head.push("Employee number");
				this.H_View.A_head.push("Memo");

				if (-1 !== A_auth.indexOf("fnc_card_billperson") == true) {
					this.H_View.A_head.push("Billing viewer ID");
					this.H_View.A_head.push("Billing viewer");
				}

				if (-1 !== A_auth.indexOf("fnc_fjp_co") == true) //用途区分
					//FJP2018
					{
						var temps = ["\u627F\u8A8D\u8005\u540D", "\u627F\u8A8D\u8005\u30B3\u30FC\u30C9", "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236\u540D", "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9", "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236\u540D", "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9", "\u8CFC\u5165\u30AA\u30FC\u30C0", "\u901A\u4FE1\u8CBB\u30AA\u30FC\u30C0", "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5909\u66F4\u30D5\u30E9\u30B0"];

						for (var temp of Object.values(temps)) {
							this.H_View.A_head.push(temp);
						}

						if (-1 !== A_auth.indexOf("fnc_tel_division") == true) {
							this.H_View.A_head.push("\u7528\u9014");
						}

						this.H_View.A_head.push("\u793E\u54E1\u533A\u5206");
						this.H_View.A_head.push("\u5E79\u90E8\u793E\u54E1\u5F93\u696D\u54E1\u756A\u53F7");
						this.H_View.A_head.push("\u5E79\u90E8\u793E\u54E1\u6C0F\u540D");
						this.H_View.A_head.push("\u5E79\u90E8\u793E\u54E1\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9");
						this.H_View.A_head.push("\u7D66\u4E0E\u8CA0\u62C5\u5143\u8077\u5236\u540D");
						this.H_View.A_head.push("\u7D66\u4E0E\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9");
						this.H_View.A_head.push("\u4E8B\u696D\u6240\u30B3\u30FC\u30C9");
						this.H_View.A_head.push("\u4E8B\u696D\u6240\u540D");
						this.H_View.A_head.push("\u30D3\u30EB\u540D");
					}

				for (var key in H_prop) {
					var val = H_prop[key];
					this.H_View.A_head.push(val);
				}

				var A_asscol = ["Admin number", "IMEI number", "Model", "Model ID", "Color", "Color ID", "Purchase date", "Purchase cost", "First month of installment month", "At the time of installment payment", "Payment of monthly installment", "Firmware", "Version", "Handset type", "Smartphone type ID", "Accessories", "Memo", "Active"];
				this.H_View.A_head = array_merge(this.H_View.A_head, A_asscol);

				if (undefined !== H_sess.get.dlmode == true && H_sess.get.dlmode == "reserve") //予約表示モード
					{
						if (H_sess.post.r_mode == "0") {
							var A_rescol1 = ["Reserve date"];
						} else {
							A_rescol1 = ["Implemented date"];
						}

						var A_rescol2 = ["Reserve type", "Department ID of reservation registrant", "Department of reservation registrant", "ID of reservation registrant", "Name of reservation registrant"];
						var A_rescol = array_merge(A_rescol1, A_rescol2);
						this.H_View.A_head = array_merge(this.H_View.A_head, A_rescol);
					}

				if (-1 !== A_auth.indexOf("fnc_receipt") == true) {
					this.H_View.A_head.push("\u53D7\u9818\u65E5");
				}
			} else //内線番号管理権限がある時
			//請求閲覧権限がある時
			//予約ダウンロードのみの項目追加
			{
				this.H_View.A_head = Array();
				this.H_View.A_head.push("\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72ID");
				this.H_View.A_head.push("\u90E8\u7F72ID");
				this.H_View.A_head.push("\u90E8\u7F72\u540D");
				this.H_View.A_head.push("\u96FB\u8A71\u756A\u53F7");
				this.H_View.A_head.push("\u96FB\u8A71\u756A\u53F7\uFF08\u30CF\u30A4\u30D5\u30F3\u3001\u30AB\u30C3\u30B3\u7121\u3057\uFF09");

				if (-1 !== A_auth.indexOf("fnc_extension_tel_co") == true) {
					this.H_View.A_head.push("\u5185\u7DDA\u756A\u53F7");
				}

				this.H_View.A_head.push("\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9");
				this.H_View.A_head.push("\u96FB\u8A71\u4F1A\u793E\u540D\u79F0");
				this.H_View.A_head.push("\u96FB\u8A71\u4F1A\u793EID");
				this.H_View.A_head.push("\u96FB\u8A71\u7A2E\u5225\u540D\u79F0");
				this.H_View.A_head.push("\u96FB\u8A71\u7A2E\u5225ID");
				this.H_View.A_head.push("\u8CFC\u5165\u65B9\u5F0F\u540D\u79F0");
				this.H_View.A_head.push("\u8CFC\u5165\u65B9\u5F0FID");
				this.H_View.A_head.push("\u56DE\u7DDA\u533A\u5206");
				this.H_View.A_head.push("\u6599\u91D1\u30D7\u30E9\u30F3\u540D\u79F0");
				this.H_View.A_head.push("\u6599\u91D1\u30D7\u30E9\u30F3ID");
				this.H_View.A_head.push("\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\u540D\u79F0");
				this.H_View.A_head.push("\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AFID");
				this.H_View.A_head.push("\u30DD\u30A4\u30F3\u30C8\u30B5\u30FC\u30D3\u30B9\u540D\u79F0");
				this.H_View.A_head.push("\u30DD\u30A4\u30F3\u30C8\u30B5\u30FC\u30D3\u30B9ID");
				this.H_View.A_head.push("\u5730\u57DF\u4F1A\u793E\u540D\u79F0");
				this.H_View.A_head.push("\u5730\u57DF\u4F1A\u793EID");
				this.H_View.A_head.push("\u5272\u5F15\u30B5\u30FC\u30D3\u30B9");
				this.H_View.A_head.push("\u30AA\u30D7\u30B7\u30E7\u30F3");
				this.H_View.A_head.push("\u30A6\u30A7\u30D6\u5B89\u5FC3\u30B5\u30FC\u30D3\u30B9");
				this.H_View.A_head.push("\u5951\u7D04\u65E5");
				this.H_View.A_head.push("\u6700\u65B0\u8CFC\u5165\u65E5");
				this.H_View.A_head.push("SIM\u30AB\u30FC\u30C9\u756A\u53F7");
				this.H_View.A_head.push("\u4F7F\u7528\u8005");
				this.H_View.A_head.push("\u793E\u54E1\u756A\u53F7");
				this.H_View.A_head.push("\u30E1\u30E2");

				if (-1 !== A_auth.indexOf("fnc_card_billperson") == true) {
					this.H_View.A_head.push("\u30B7\u30B9\u30C6\u30E0\u8ACB\u6C42\u95B2\u89A7\u8005ID");
					this.H_View.A_head.push("\u8ACB\u6C42\u95B2\u89A7\u8005");
				}

				if (-1 !== A_auth.indexOf("fnc_fjp_co") == true) //用途区分
					//FJP2018
					{
						temps = ["\u627F\u8A8D\u8005\u540D", "\u627F\u8A8D\u8005\u30B3\u30FC\u30C9", "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236\u540D", "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9", "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236\u540D", "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9", "\u8CFC\u5165\u30AA\u30FC\u30C0", "\u901A\u4FE1\u8CBB\u30AA\u30FC\u30C0", "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5909\u66F4\u30D5\u30E9\u30B0"];

						for (var temp of Object.values(temps)) {
							this.H_View.A_head.push(temp);
						}

						if (-1 !== A_auth.indexOf("fnc_tel_division") == true) {
							this.H_View.A_head.push("\u7528\u9014");
						}

						this.H_View.A_head.push("\u793E\u54E1\u533A\u5206");
						this.H_View.A_head.push("\u5E79\u90E8\u793E\u54E1\u5F93\u696D\u54E1\u756A\u53F7");
						this.H_View.A_head.push("\u5E79\u90E8\u793E\u54E1\u6C0F\u540D");
						this.H_View.A_head.push("\u5E79\u90E8\u793E\u54E1\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9");
						this.H_View.A_head.push("\u7D66\u4E0E\u8CA0\u62C5\u5143\u8077\u5236\u540D");
						this.H_View.A_head.push("\u7D66\u4E0E\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9");
						this.H_View.A_head.push("\u4E8B\u696D\u6240\u30B3\u30FC\u30C9");
						this.H_View.A_head.push("\u4E8B\u696D\u6240\u540D");
						this.H_View.A_head.push("\u30D3\u30EB\u540D");
					}

				for (var key in H_prop) {
					var val = H_prop[key];
					this.H_View.A_head.push(val);
				}

				A_asscol = ["\u7BA1\u7406\u756A\u53F7", "\u88FD\u9020\u756A\u53F7", "\u6A5F\u7A2E\u540D\u79F0", "\u6A5F\u7A2EID", "\u8272\u540D\u79F0", "\u8272ID", "\u6A5F\u7A2E\u8CFC\u5165\u65E5", "\u53D6\u5F97\u4FA1\u683C", "\u5272\u8CE6\u958B\u59CB\u6708", "\u5272\u8CE6\u56DE\u6570", "\u5272\u8CE6\u6708\u984D", "\u30D5\u30A1\u30FC\u30E0\u30A6\u30A7\u30A2", "\u30D0\u30FC\u30B8\u30E7\u30F3", "\u7AEF\u672B\u7A2E\u5225\u540D\u79F0", "\u7AEF\u672B\u7A2E\u5225ID", "\u4ED8\u5C5E\u54C1", "\u7AEF\u672B\u30E1\u30E2", "\u6A5F\u7A2E\u4F7F\u7528\u4E2D"];
				this.H_View.A_head = array_merge(this.H_View.A_head, A_asscol);

				if (undefined !== H_sess.get.dlmode == true && H_sess.get.dlmode == "reserve") //予約表示モード
					{
						if (H_sess.post.r_mode == "0") {
							A_rescol1 = ["\u4E88\u7D04\u65E5"];
						} else {
							A_rescol1 = ["\u5B9F\u884C\u65E5"];
						}

						A_rescol2 = ["\u4E88\u7D04\u7A2E\u5225", "\u4E88\u7D04\u767B\u9332\u8005\u90E8\u7F72ID", "\u4E88\u7D04\u767B\u9332\u8005\u90E8\u7F72\u540D", "\u4E88\u7D04\u767B\u9332\u8005ID", "\u4E88\u7D04\u767B\u9332\u8005\u540D"];
						A_rescol = array_merge(A_rescol1, A_rescol2);
						this.H_View.A_head = array_merge(this.H_View.A_head, A_rescol);
					}

				if (-1 !== A_auth.indexOf("fnc_receipt") == true) {
					this.H_View.A_head.push("\u53D7\u9818\u65E5");
				}
			}
	}

	getFileName(H_sess: {} | any[]) //表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			if (H_sess.SELF.get.dlmode == "reserve") {
				var filename = "TelephoneReserveInformation_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
			} else {
				filename = "TelephoneInformation_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
			}
		} else {
			if (H_sess.SELF.get.dlmode == "reserve") {
				filename = "\u96FB\u8A71\u4E88\u7D04\u60C5\u5831_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
			} else {
				filename = "\u96FB\u8A71\u60C5\u5831_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
			}
		}

		this.H_View.filename = mb_convert_encoding(filename, "SJIS-win", "UTF-8");
	}

	outputDataLine(A_auth: {} | any[], A_data: {} | any[], H_prop: {} | any[], H_sess: {} | any[], O_model) //オプション変換
	{
		var H_op = O_model.getAllOptionDiscount();
		A_data = O_model.convertSerialize(A_data, H_op, this.H_View.H_dlprop.separator2);
		var H_op_eng = O_model.getAllOptionDiscountEng();
		A_data = O_model.convertSerializeEng(A_data, H_op_eng, this.H_View.H_dlprop.separator2);
		var data_cnt = A_data.length;

		for (var cnt = 0; cnt < data_cnt; cnt++) //社員区分 k86
		//ダウンロードデータ管理権限があるが、ダウンロードデータマスクしない権限がない時
		//表示言語分岐
		//メモリ節約
		{
			if (TelDownloadView.AUTO_NAME == A_data[cnt].commflag) {
				A_data[cnt].commflag = TelDownloadView.AUTO_VALUE;
			} else if (TelDownloadView.MANUAL_NAME == A_data[cnt].commflag) {
				A_data[cnt].commflag = TelDownloadView.MANUAL_VALUE;
			}

			if (TelDownloadView.BUSINESS_NAME == A_data[cnt].division) {
				A_data[cnt].division = TelDownloadView.BUSINESS_VALUE;
			} else if (TelDownloadView.DEMO_NAME == A_data[cnt].division) {
				A_data[cnt].division = TelDownloadView.DEMO_VALUE;
			}

			if (A_data[cnt].pay_frequency > 1) {
				A_data[cnt].pay_monthly_sum = A_data[cnt].pay_monthly_sum;
			} else {
				A_data[cnt].pay_monthly_sum = undefined;
			}

			switch (A_data[cnt].employee_class) {
				case 1:
					A_data[cnt].employee_class = "\u4E00\u822C\u793E\u54E1";
					break;

				case 2:
					A_data[cnt].employee_class = "\u5E79\u90E8\u793E\u54E1";
					break;
			}

			{
				let _tmp_0 = A_data[cnt];

				for (var key in _tmp_0) {
					var val = _tmp_0[key];

					if (key == "contractdate" || key == "orderdate" || key == "bought_date" || preg_match("/^date(\\d)/", key) == true) {
						var val = val.substr(0, 10);
					} else if (key == "pay_startdate") {
						val = val.substr(0, 7);
					}

					if (key != "main_flg") {
						A_data[cnt][key] = this.H_View.H_dlprop.qt + strtr(val, this.H_View.H_dlprop.H_strtr) + this.H_View.H_dlprop.qt;
					}
				}
			}

			if (-1 !== A_auth.indexOf("fnc_dldata_mng_co") && !(-1 !== A_auth.indexOf("fnc_dldata_not_mask"))) //マスクする
				{
					var username = "********";
					var employeecode = "*****";
					var mail = "********@********";
				} else {
				username = A_data[cnt].username;
				employeecode = A_data[cnt].employeecode;
				mail = A_data[cnt].mail;
			}

			if (this.O_Sess.language == "ENG") //内線番号管理権限がある時
				//請求閲覧権限がある時
				//主端末なら「使用中」にマルを書く
				//予約ダウンロードのみの項目追加
				{
					var A_str = Array();
					A_str.push(A_data[cnt].postid);
					A_str.push(A_data[cnt].userpostid);
					A_str.push(A_data[cnt].postname);
					A_str.push(A_data[cnt].telno_view);
					A_str.push(A_data[cnt].telno);

					if (-1 !== A_auth.indexOf("fnc_extension_tel_co") == true) {
						A_str.push(A_data[cnt].extensionno);
					}

					A_str.push(mail);
					A_str.push(A_data[cnt].carname_eng);
					A_str.push(A_data[cnt].carid);
					A_str.push(A_data[cnt].cirname_eng);
					A_str.push(A_data[cnt].cirid);
					A_str.push(A_data[cnt].buyselname_eng);
					A_str.push(A_data[cnt].buyselid);
					A_str.push(A_data[cnt].cirtypename_eng);
					A_str.push(A_data[cnt].planname_eng);
					A_str.push(A_data[cnt].planid);
					A_str.push(A_data[cnt].packetname_eng);
					A_str.push(A_data[cnt].packetid);
					A_str.push(A_data[cnt].pointname_eng);
					A_str.push(A_data[cnt].pointid);
					A_str.push(A_data[cnt].arname_eng);
					A_str.push(A_data[cnt].arid);
					A_str.push(A_data[cnt].discounts_view_eng);
					A_str.push(A_data[cnt].options_view_eng);
					A_str.push(A_data[cnt].webreliefservice_lng);
					A_str.push(A_data[cnt].contractdate);
					A_str.push(A_data[cnt].orderdate);
					A_str.push(A_data[cnt].simcardno);
					A_str.push(username);
					A_str.push(employeecode);
					A_str.push(A_data[cnt].memo.trim());

					if (-1 !== A_auth.indexOf("fnc_card_billperson") == true) {
						A_str.push(A_data[cnt].userid);
						A_str.push(A_data[cnt].billusername);
					}

					if (-1 !== A_auth.indexOf("fnc_fjp_co") == true) //用途区分
						//FJ2018
						{
							A_str.push(A_data[cnt].recogname);
							A_str.push(A_data[cnt].recogcode);
							A_str.push(A_data[cnt].pbpostname);
							A_str.push(A_data[cnt].pbpostcode);
							A_str.push(A_data[cnt].cfbpostname);
							A_str.push(A_data[cnt].cfbpostcode);
							A_str.push(A_data[cnt].ioecode);
							A_str.push(A_data[cnt].coecode);
							A_str.push(A_data[cnt].commflag);

							if (-1 !== A_auth.indexOf("fnc_tel_division") == true) {
								A_str.push(A_data[cnt].division);
							}

							A_str.push(A_data[cnt].employee_class);
							A_str.push(A_data[cnt].executive_no);
							A_str.push(A_data[cnt].executive_name);
							A_str.push(A_data[cnt].executive_mail);
							A_str.push(A_data[cnt].salary_source_name);
							A_str.push(A_data[cnt].salary_source_code);
							A_str.push(A_data[cnt].office_code);
							A_str.push(A_data[cnt].office_name);
							A_str.push(A_data[cnt].building_name);
						}

					for (var key in H_prop) {
						var val = H_prop[key];
						A_str.push(A_data[cnt][key]);
					}

					var main = "";

					if (A_data[cnt].main_flg == true) {
						main = this.H_View.H_dlprop.qt + "\u25CF" + this.H_View.H_dlprop.qt;
					}

					var A_asscol = [A_data[cnt].assetsno, A_data[cnt].serialno, A_data[cnt].productname, A_data[cnt].productid, A_data[cnt].property, A_data[cnt].branchid, A_data[cnt].bought_date, A_data[cnt].bought_price, A_data[cnt].pay_startdate, A_data[cnt].pay_frequency, A_data[cnt].pay_monthly_sum, A_data[cnt].firmware, A_data[cnt].version, A_data[cnt].smpcirname, A_data[cnt].smpcirid, A_data[cnt].accessory, A_data[cnt].note, main];
					A_str = array_merge(A_str, A_asscol);

					if (undefined !== H_sess.get.dlmode == true && H_sess.get.dlmode == "reserve") //予約表示モード
						//予約種別
						{
							if (H_sess.post.r_mode == "0") {
								var res_date = A_data[cnt].reserve_date;
							} else {
								res_date = A_data[cnt].exe_date;
							}

							var res_type = this.convertReserveTypeEng(A_data[cnt].add_edit_flg);
							var A_reserve = [res_date, res_type, A_data[cnt].exe_postid, A_data[cnt].exe_postname, A_data[cnt].exe_userid, A_data[cnt].exe_username];
							A_str = array_merge(A_str, A_reserve);
						}

					if (-1 !== A_auth.indexOf("fnc_receipt") == true) {
						var receiptdate = str_replace("-", "/", A_data[cnt].receiptdate);
						A_str.push(receiptdate);
					}
				} else //内線番号管理権限がある時
				//請求閲覧権限がある時
				//主端末なら「使用中」にマルを書く
				//予約ダウンロードのみの項目追加
				{
					A_str = Array();
					A_str.push(A_data[cnt].postid);
					A_str.push(A_data[cnt].userpostid);
					A_str.push(A_data[cnt].postname);
					A_str.push(A_data[cnt].telno_view);
					A_str.push(A_data[cnt].telno);

					if (-1 !== A_auth.indexOf("fnc_extension_tel_co") == true) {
						A_str.push(A_data[cnt].extensionno);
					}

					A_str.push(mail);
					A_str.push(A_data[cnt].carname);
					A_str.push(A_data[cnt].carid);
					A_str.push(A_data[cnt].cirname);
					A_str.push(A_data[cnt].cirid);
					A_str.push(A_data[cnt].buyselname);
					A_str.push(A_data[cnt].buyselid);
					A_str.push(A_data[cnt].cirtypename);
					A_str.push(A_data[cnt].planname);
					A_str.push(A_data[cnt].planid);
					A_str.push(A_data[cnt].packetname);
					A_str.push(A_data[cnt].packetid);
					A_str.push(A_data[cnt].pointname);
					A_str.push(A_data[cnt].pointid);
					A_str.push(A_data[cnt].arname);
					A_str.push(A_data[cnt].arid);
					A_str.push(A_data[cnt].discounts_view);
					A_str.push(A_data[cnt].options_view);
					A_str.push(A_data[cnt].webreliefservice);
					A_str.push(A_data[cnt].contractdate);
					A_str.push(A_data[cnt].orderdate);
					A_str.push(A_data[cnt].simcardno);
					A_str.push(username);
					A_str.push(employeecode);
					A_str.push(A_data[cnt].memo.trim());

					if (-1 !== A_auth.indexOf("fnc_card_billperson") == true) {
						A_str.push(A_data[cnt].userid);
						A_str.push(A_data[cnt].billusername);
					}

					if (-1 !== A_auth.indexOf("fnc_fjp_co") == true) //用途区分
						//FJ2018
						{
							A_str.push(A_data[cnt].recogname);
							A_str.push(A_data[cnt].recogcode);
							A_str.push(A_data[cnt].pbpostname);
							A_str.push(A_data[cnt].pbpostcode);
							A_str.push(A_data[cnt].cfbpostname);
							A_str.push(A_data[cnt].cfbpostcode);
							A_str.push(A_data[cnt].ioecode);
							A_str.push(A_data[cnt].coecode);
							A_str.push(A_data[cnt].commflag);

							if (-1 !== A_auth.indexOf("fnc_tel_division") == true) {
								A_str.push(A_data[cnt].division);
							}

							A_str.push(A_data[cnt].employee_class);
							A_str.push(A_data[cnt].executive_no);
							A_str.push(A_data[cnt].executive_name);
							A_str.push(A_data[cnt].executive_mail);
							A_str.push(A_data[cnt].salary_source_name);
							A_str.push(A_data[cnt].salary_source_code);
							A_str.push(A_data[cnt].office_code);
							A_str.push(A_data[cnt].office_name);
							A_str.push(A_data[cnt].building_name);
						}

					for (var key in H_prop) {
						var val = H_prop[key];
						A_str.push(A_data[cnt][key]);
					}

					main = "";

					if (A_data[cnt].main_flg == true) {
						main = this.H_View.H_dlprop.qt + "\u25CF" + this.H_View.H_dlprop.qt;
					}

					A_asscol = [A_data[cnt].assetsno, A_data[cnt].serialno, A_data[cnt].productname_now, A_data[cnt].productid, A_data[cnt].property, A_data[cnt].branchid, A_data[cnt].bought_date, A_data[cnt].bought_price, A_data[cnt].pay_startdate, A_data[cnt].pay_frequency, pay_monthly_sum, A_data[cnt].firmware, A_data[cnt].version, A_data[cnt].smpcirname, A_data[cnt].smpcirid, A_data[cnt].accessory, A_data[cnt].note, main];
					A_str = array_merge(A_str, A_asscol);

					if (undefined !== H_sess.get.dlmode == true && H_sess.get.dlmode == "reserve") //予約表示モード
						//予約種別
						//予約登録者名
						{
							if (H_sess.post.r_mode == "0") {
								res_date = A_data[cnt].reserve_date;
							} else {
								res_date = A_data[cnt].exe_date;
							}

							res_type = this.convertReserveType(A_data[cnt].add_edit_flg);
							A_reserve = [res_date, res_type, A_data[cnt].exe_postid, A_data[cnt].exe_postname, A_data[cnt].exe_userid, A_data[cnt].exe_username];
							A_str = array_merge(A_str, A_reserve);
						}

					if (-1 !== A_auth.indexOf("fnc_receipt") == true) {
						receiptdate = str_replace("-", "/", A_data[cnt].receiptdate);
						A_str.push(receiptdate);
					}
				}

			var str = A_str.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC;

			if (TelDownloadView.DEBUG != "on") {
				print(this.mbConvertEncodingDL(str));
			} else {
				print(str + "<br>");
			}

			delete A_data[cnt];
		}
	}

	__destruct() {
		super.__destruct();
	}

};