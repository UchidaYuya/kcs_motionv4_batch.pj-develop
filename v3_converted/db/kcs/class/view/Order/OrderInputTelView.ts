//
//注文必須情報入力View（電話番号入力）クラス
//
//更新履歴：<br>
//2008/04/17 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/17
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//
//error_reporting(E_ALL);
//
//注文必須情報入力View（電話番号入力）クラス
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/17
//@uses MtSetting
//@uses MtSession
//
//

require("model/Order/OrderInputModelBase.php");

require("view/Order/OrderInputViewBase.php");

//
//コンストラクタ <br>
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//
//ローカルセッションを取得する
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//
//
//
//配下のセッション消し
//
//@author miyazawa
//@since 2008/05/13
//
//@access public
//@return void
//
//
//
//パンくずリンク用配列を返す
//
//@author miyazawa
//@since 2008/05/13
//
//@access public
//@return array
//
//
//
//CSSを返す
//
//@author miyazawa
//@since 2008/03/07
//
//@access public
//@return string
//
//
//
//表示に使用する物を格納する配列を返す
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return mixed
//
//
//
//CGIパラメータのチェックを行う<br>
//
//配列をセッションに入れる<br>
//
//@author miyazawa
//@since 2008/05/15
//
//@access public
//@return void
//@uses MtExceptReload
//
//
//
//注文パターンをセッションに入れる
//
//@author miyazawa
//@since 2008/06/16
//
//@param mixed $O_model
//@access protected
//@return void
//
//
//
//CGIパラメータから電話情報を取得
//
//@author miyazawa
//@since 2008/04/17
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//
//CGIパラメータから番号を取得
//
//@author miyazawa
//@since 2008/04/17
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//
//CGIパラメータから件数をカウントする
//
//@author miyazawa
//@since 2008/04/17
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//
//フォームを作成する<br>
//
//@author miyazawa
//@since 2008/05/14
//
//@param mixed $O_order
//@param mixed $O_model
//@param array $H_sess
//@access public
//@return void
//
//
//
//回線種別選択 <br>
//
//@author miyazawa
//@since 2008/10/09
//
//@param mixed $O_model
//@param carid
//
//@access public
//@return void
//
//
//
//購入方式選択 <br>
//
//@author miyazawa
//@since 2008/10/09
//
//@param mixed $O_model
//@param carid
//
//@access public
//@return void
//
//
//
//フォームのエラーチェック作成
//
//@author miyazawa
//@since 2008/05/14
//
//@access public
//@return void
//
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
//@param array $A_auth（権限一覧）
//@param array $A_alert（警告）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//
//
class OrderInputTelView extends OrderInputViewBase {
	constructor() //英語化でテンプレートのディレクトリ変更 20090824miya
	{
		this.O_Sess = MtSession.singleton();
		var H_param = Array();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.H_Dir = this.O_Sess.getPub(OrderInputTelView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();
	}

	getLocalSession() {
		var H_sess = {
			[OrderInputTelView.PUB]: this.O_Sess.getPub(OrderInputTelView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	clearUnderSession() //H_product を消す
	{
		this.clearLastForm();
		var A_exc = [OrderInputTelView.PUB + "/order_form.php"];
		this.O_Sess.clearSessionListPub(A_exc);
		var H_pub = this.gSess().getPub(OrderInputTelView.PUB);
		delete H_pub.H_product;
		this.gSess().setPub(OrderInputTelView.PUB, H_pub);
	}

	makePankuzuLinkHash() {
		var H_link = {
			"": this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname
		};
		return H_link;
	}

	getCSS(site_flg) {
		if (site_flg == OrderInputTelView.SITE_SHOP) {
			return "actorderDetail";
		} else {
			return "csOrder";
		}
	}

	get_View() {
		return this.H_View;
	}

	checkCGIParam() //GETパラメータ
	//あいだが空いた複数件の入力を詰めるための変数 20090331miya
	//getパラメータは消す
	{
		if (true == (undefined !== _GET.carid) && true == (undefined !== _GET.cirid) && true == (undefined !== _GET.type)) {
			this.H_Dir.carid = _GET.carid;
			this.H_Dir.cirid = _GET.cirid;
			this.H_Dir.type = _GET.type;
			this.H_Dir.ppid = _GET.ppid;
		}

		var needle = 0;

		for (var i = 0; i < 10; i++) {
			if (true == (undefined !== _POST["telno" + i]) && true == 0 < _POST["telno" + i].length) {
				this.H_Local["telno" + needle] = _POST["telno" + i];
				needle++;
			}
		}

		this.switchCarrier(_POST);

		if (undefined !== _POST.othercarid) {
			this.H_Local.othercarid = _POST.othercarid;
		}

		if (true == (undefined !== _POST.ciridradio)) {
			this.H_Dir.cirid = _POST.ciridradio;
		}

		if (true == (undefined !== _POST.buyselid)) {
			this.H_Dir.buyselid = _POST.buyselid;
		}

		this.O_Sess.setPub(OrderInputTelView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);

		if (_GET.length > 0) {
			MtExceptReload.raise(undefined);
		}

		if (true == (undefined !== this.H_Local)) //上ので回線種別と購入方式がPOSTから消えてるので、もしあれば入れなおす 20090520miya
			{
				var _POST = this.H_Local;

				if (true == (undefined !== this.H_Dir.cirid)) {
					_POST.ciridradio = this.H_Dir.cirid;
				}

				if (true == (undefined !== this.H_Dir.buyselid)) {
					_POST.buyselid = this.H_Dir.buyselid;
				}
			}
	}

	setOrderPatternSession(O_model: OrderInputModelBase) //表示するキャリア名、注文種別をセットしてしまう
	{
		var orderpatern = O_model.getOrderPatternName(this.H_Dir);
		this.H_Dir.carname = orderpatern.carname;
		this.H_Dir.ptnname = orderpatern.ptnname;
		this.H_Dir.shopid = orderpatern.shopid;
		this.H_Dir.memid = orderpatern.memid;
		this.H_Dir.tplfile = orderpatern.tplfile;
		delete this.H_Dir.H_product;
		delete this.H_Dir.price_detailid;
		this.O_Sess.setPub(OrderInputTelView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);
	}

	setTelInfoSession(H_info, cirid = undefined) //これ入れないと最新の情報取ってこない！ 200903005miya
	//1件目がなければエラー
	//移行のとき
	{
		this.H_Dir = this.O_Sess.getPub(OrderInputTelView.PUB);

		if (false == (undefined !== H_info.telno0)) {
			return false;
		}

		this.H_Dir.telinfo = H_info;
		this.H_Dir.telcount = H_info.length;

		if (this.H_Dir.type == "S") {
			switch (H_info.telno0.cirid) {
				case 1:
					if (!cirid) {
						this.H_Dir.cirid = 79;
					} else {
						this.H_Dir.cirid = cirid;
					}

					break;

				case 2:
					this.H_Dir.cirid = 1;
					break;

				case 8:
					this.H_Dir.cirid = 78;
					break;

				case 9:
					if (!cirid) {
						this.H_Dir.cirid = 78;
					} else {
						this.H_Dir.cirid = cirid;
					}

					break;

				case 79:
					if (!cirid) {
						this.H_Dir.cirid = 1;
					} else {
						this.H_Dir.cirid = cirid;
					}

					break;

				case 78:
					if (!cirid) {
						this.H_Dir.cirid = 9;
					} else {
						this.H_Dir.cirid = cirid;
					}

					break;

				default:
					if ("" != H_info.telno0.cirid) {
						this.H_Dir.cirid = H_info.telno0.cirid;
					}

					break;
			}
		} else {
			if ("" != H_info.telno0.cirid) {
				this.H_Dir.cirid = H_info.telno0.cirid;
			}
		}

		this.O_Sess.setPub(OrderInputTelView.PUB, this.H_Dir);
	}

	checkCGIParamTelno() {
		var H_telnos = Array();

		for (var i = 0; i < 10; i++) {
			var telno = "";
			telno = _POST["telno" + i].replace(/ /g, "");
			telno = telno.replace(/\-/g, "");
			telno = telno.replace(/\(/g, "");
			telno = telno.replace(/\)/g, "");

			if (telno != "" && telno != undefined) {
				H_telnos[i] = telno;
			}
		}

		return H_telnos;
	}

	countTel(H_telnos = Array()) {
		var telcount = H_telnos.length;
		return telcount;
	}

	makeInputForm(O_order, O_model, H_sess: {} | any[], H_g_sess) //英語化権限 20090210miya
	//フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	//戻りのためのデフォルト値
	{
		H_g_sess = this.getGlobalSession();

		if ("ENG" == H_g_sess.language) {
			var telnostr = "Phone Number";
			var alert0 = "Phone with more than one purchase method is specified.";
		} else {
			telnostr = "\u643A\u5E2F\u756A\u53F7";
			alert0 = "\u8907\u6570\u306E\u8CB7\u3044\u65B9\u306E\u96FB\u8A71\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u3002";
		}

		var carList = O_model.getOtherCarrierList(H_g_sess.pactid, H_g_sess.postid, true, false);
		var A_formelement = [{
			name: "movesubmit",
			label: "\u6B21\u3078",
			inputtype: "submit"
		}, {
			name: "cancel",
			label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
			inputtype: "button",
			options: {
				onClick: "javascript:ask_cancel()"
			}
		}, {
			name: "reset",
			label: "\u30EA\u30BB\u30C3\u30C8",
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='?r=1'"
			}
		}, {
			name: "telno0",
			label: telnostr + "1",
			inputtype: "text",
			options: {
				size: "30"
			}
		}, {
			name: "telno1",
			label: telnostr + "2",
			inputtype: "text",
			options: {
				size: "30"
			}
		}, {
			name: "telno2",
			label: telnostr + "3",
			inputtype: "text",
			options: {
				size: "30"
			}
		}, {
			name: "telno3",
			label: telnostr + "4",
			inputtype: "text",
			options: {
				size: "30"
			}
		}, {
			name: "telno4",
			label: telnostr + "5",
			inputtype: "text",
			options: {
				size: "30"
			}
		}, {
			name: "telno5",
			label: telnostr + "6",
			inputtype: "text",
			options: {
				size: "30"
			}
		}, {
			name: "telno6",
			label: telnostr + "7",
			inputtype: "text",
			options: {
				size: "30"
			}
		}, {
			name: "telno7",
			label: telnostr + "8",
			inputtype: "text",
			options: {
				size: "30"
			}
		}, {
			name: "telno8",
			label: telnostr + "9",
			inputtype: "text",
			options: {
				size: "30"
			}
		}, {
			name: "telno9",
			label: telnostr + "10",
			inputtype: "text",
			options: {
				size: "30"
			}
		}, {
			name: "othercarid",
			label: "\u30AD\u30E3\u30EA\u30A2",
			inputtype: "select",
			data: carList
		}];
		this.H_View.O_InputFormUtil = new QuickFormUtil("form");
		this.H_View.O_InputFormUtil.setFormElement(A_formelement);
		this.O_InputForm = this.H_View.O_InputFormUtil.makeFormObject();
		var H_def = Array();

		if (true == Array.isArray(H_sess[OrderInputTelView.PUB]) && "" == H_sess.SELF) {
			if (true == Array.isArray(H_sess[OrderInputTelView.PUB].telinfo)) {
				{
					let _tmp_0 = H_sess[OrderInputTelView.PUB].telinfo;

					for (var key in _tmp_0) {
						var val = _tmp_0[key];

						if ("" != val.telno_view) {
							H_def[key] = val.telno_view;
						} else {
							H_def[key] = val.telno;
						}
					}
				}
			}

			if (H_sess[OrderInputTelView.PUB].buyselid) {
				H_def.buyselid = H_sess[OrderInputTelView.PUB].buyselid;
			}

			if (H_sess[OrderInputTelView.PUB].ciridradio) {
				H_def.ciridradio = H_sess[OrderInputTelView.PUB].ciridradio;
			}

			this.O_InputForm.setConstants(H_def);
		}

		if ("P" == H_sess[OrderInputTelView.PUB].type && true == (undefined !== H_sess.SELF)) {
			var A_telno = array_unique(H_sess.SELF);
			A_telno.sort();

			if (A_telno[0] === "") {
				A_telno.shift();
			}

			var H_temp = O_model.checkTelBuysel(A_telno, H_sess[OrderInputTelView.PUB].carid);

			if (1 < H_temp.length && "H" != PACTTYPE) {
				this.H_View.O_InputFormUtil.setElementErrorWrapper("telno0", alert0);
			}
		}
	}

	makeFormCiridRadio(O_model: OrderInputModelBase, carid) {
		var H_circuit = O_model.getOrderCircuit(carid);

		for (var key in H_circuit) {
			var val = H_circuit[key];
			A_ciridradio.push(HTML_QuickForm.createElement("radio", undefined, undefined, val.cirname, val.cirid));
		}

		this.H_View.O_InputFormUtil.O_Form.addGroup(A_ciridradio, "ciridradio", "\u56DE\u7DDA\u7A2E\u5225");
	}

	makeFormBuyselidSelect(O_model: OrderInputModelBase, carid) //英語化権限 20090210miya
	{
		var H_g_sess = this.getGlobalSession();

		if ("ENG" == H_g_sess.language) {
			var eng = true;
		} else {
			eng = false;
		}

		this.H_View.O_InputFormUtil.O_Form.addElement("select", "buyselid", "\u8CFC\u5165\u65B9\u5F0F", {
			"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"
		} + O_model.getPurchaseId(carid, eng));
	}

	makeInputRule() //英語化権限 20090210miya
	//注文の独自ルールをregist
	//telno0～telno9に電話番号で使用できる文字のチェックを入れた 20100630miya
	{
		var H_g_sess = this.getGlobalSession();

		if ("ENG" == H_g_sess.language) //telno0～telno9に電話番号で使用できる文字のチェックを入れた 20100630miya
			{
				var alert0 = "Phone Number1 is Required.";
				var alert1 = "Same telephone numbers are entered more than once.";
				var alert2 = "Please select a Service Type.";
				var alert3 = "Please select a Method of Purchase";
				var alert4 = "Only \"No selection\" is available for mova.";
				var alert5 = "Enter the following categories\n";
				var alert6 = "\nEnter correctly.";
				var alert7 = "Items with \u203B are required.";
				var alert8 = "Only single-byte English characters, \"(\", \")\", and \"-\" are valid for the Phone Number.";
			} else //telno0～telno9に電話番号で使用できる文字のチェックを入れた 20100630miya
			{
				alert0 = "\u643A\u5E2F\u756A\u53F71\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
				alert1 = "\u540C\u3058\u643A\u5E2F\u756A\u53F7\u304C\u8907\u6570\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u3059";
				alert2 = "\u56DE\u7DDA\u7A2E\u5225\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
				alert3 = "\u8CFC\u5165\u65B9\u5F0F\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
				alert4 = "\u30E0\u30FC\u30D0\u3067\u9078\u3079\u308B\u306E\u306F\u300C\u9078\u629E\u306A\u3057\u300D\u306E\u307F\u3067\u3059";
				alert5 = "\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n";
				alert6 = "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
				alert7 = "\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059";
				alert8 = "\u643A\u5E2F\u756A\u53F7\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u3001\u300C(\u300D,\u300C)\u300D\u3001\u300C-\u300D\u306E\u307F\u3067\u3059";
			}

		var A_order_rules = ["RadioCompareSelectParam"];
		this.H_View.O_InputFormUtil.registerOriginalRules(A_order_rules);
		var A_rule = [{
			name: "telno0",
			mess: alert0,
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "telno0",
			mess: alert1,
			type: "QRcallOriginalFunction",
			format: "checkTelnoDuplication",
			validation: "client"
		}, {
			name: "telno0",
			mess: alert8,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno1",
			mess: alert8,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno2",
			mess: alert8,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno3",
			mess: alert8,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno4",
			mess: alert8,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno5",
			mess: alert8,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno6",
			mess: alert8,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno7",
			mess: alert8,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno8",
			mess: alert8,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno9",
			mess: alert8,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "ciridradio",
			mess: alert2,
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "buyselid",
			mess: alert3,
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: ["ciridradio", "buyselid"],
			mess: alert4,
			type: "RadioCompareSelectParam",
			format: [2, 1],
			validation: "client"
		}];
		this.H_View.O_InputFormUtil.setJsWarningsWrapper(alert5, alert6);
		this.H_View.O_InputFormUtil.setRequiredNoteWrapper("<font color=red>" + alert7 + "</font>");
		this.H_View.O_InputFormUtil.makeFormRule(A_rule);
		var session = this.O_Sess.getPub(OrderInputTelView.PUB);

		if (OrderInputTelView.OTHER_CARID == session.carid) {
			this.H_View.O_InputFormUtil.O_Form.addRule("othercarid", "\u30AD\u30E3\u30EA\u30A2\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044", "required", undefined, "client");
		}
	}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[], A_alert: {} | any[] = Array()) //QuickFormとSmartyの合体
	//英語化権限 20090210miya
	//assign
	//20101201iga
	//20101201iga
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_InputForm.accept(O_renderer);
		var H_g_sess = this.getGlobalSession();

		if ("ENG" == H_g_sess.language) {
			var eng = true;
		} else {
			eng = false;
		}

		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("css", this.H_View.css);
		this.get_Smarty().assign("cssTh", this.H_View.css + "Th");
		this.get_Smarty().assign("O_form", O_renderer.toArray());

		if ("shop" == MT_SITE) {
			this.get_Smarty().assign("title", this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname);
			this.get_Smarty().assign("shop_submenu", this.H_View.pankuzu_link);
			this.get_Smarty().assign("shop_person", this.gSess().name + " " + this.gSess().personname);
		}

		this.get_Smarty().assign("carname", H_sess[OrderInputTelView.PUB].carname);
		this.get_Smarty().assign("ptnname", H_sess[OrderInputTelView.PUB].ptnname);
		this.get_Smarty().assign("A_alert", A_alert);
		this.get_Smarty().assign("H_jsfile", ["Order/order_select.js"]);
		this.get_Smarty().assign("eng", eng);
		this.get_Smarty().assign("carid", H_sess[OrderInputTelView.PUB].carid);
		this.get_Smarty().assign("type", H_sess[OrderInputTelView.PUB].type);

		if (H_sess[OrderInputTelView.PUB].type == "Dsimple" && H_sess[OrderInputTelView.PUB].carid == 15) //emobileの解約は静的HTMLを表示
			{
				var smarty_template = "emobile_dissolution_simple.tpl";
			} else {
			smarty_template = "input_tel.tpl";
		}

		this.get_Smarty().display(smarty_template);
	}

	__destruct() {
		super.__destruct();
	}

};