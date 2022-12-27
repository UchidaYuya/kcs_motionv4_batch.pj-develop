//
//注文必須情報入力View（MNP）クラス
//
//更新履歴：<br>
//2008/07/18 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/07/18
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//
//error_reporting(E_ALL);
//
//注文必須情報入力View（MNP）クラス
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/07/18
//@uses MtSetting
//@uses MtSession
//
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("OrderUtil.php");

require("model/Order/OrderInputModelBase.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/Rule/OrderRule.php");

//
//ディレクトリ名
//
//
//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//
//ディレクトリ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//
//ページ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//
//表示に使う要素を格納する配列
//
//@var mixed
//@access protected
//
//
//
//セッティングオブジェクト
//
//@var mixed
//@access protected
//
//
//
//フォームオブジェクト
//
//@var mixed
//@access protected
//
//
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
//登録部署をセッションに入れる
//
//@author miyazawa
//@since 2009/09/29
//
//@param mixed $O_model
//@access protected
//@return void
//
//
//
//CGIパラメータから部署を取得
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
//登録部署をセッションにセット（OrderFormViewと重複している、上にまとめるべきか）
//
//@author miyazawa
//@since 2008/06/12
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access public
//@return int
//
//
//
//スタティック表示 <br>
//
//@author miyazawa
//@since 2008/06/16
//
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//
//hiddenパラメータ <br>
//
//@author miyazawa
//@since 2008/07/15
//
//@param mixed $H_g_sess
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
//setOrderByCategory
//
//@author web
//@since 2013/10/10
//
//@param mixed $pattern
//@access public
//@return void
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
class OrderInputMNPView extends ViewSmarty {
	static PUB = "/MTOrder";

	constructor() //英語化でテンプレートのディレクトリ変更 20090824miya
	{
		this.O_Sess = MtSession.singleton();
		var H_param = Array();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.H_Dir = this.O_Sess.getPub(OrderInputMNPView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();
	}

	getLocalSession() {
		var H_sess = {
			[OrderInputMNPView.PUB]: this.O_Sess.getPub(OrderInputMNPView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	clearUnderSession() //H_product を消す
	{
		this.clearLastForm();
		var A_exc = [OrderInputMNPView.PUB + "/order_form.php"];
		this.O_Sess.clearSessionListPub(A_exc);
		var H_pub = this.gSess().getPub(OrderInputMNPView.PUB);
		delete H_pub.H_product;
		this.gSess().setPub(OrderInputMNPView.PUB, H_pub);
	}

	makePankuzuLinkHash() {
		var H_link = {
			"": this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname
		};
		return H_link;
	}

	getCSS(site_flg) {
		if (site_flg == OrderInputMNPView.SITE_SHOP) {
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
	//末尾の項目が削られたときにformercarid, mnpnoが残るのを消す 20090409miya
	//getパラメータは消す
	{
		if (true == (undefined !== _GET.carid) && true == (undefined !== _GET.cirid) && true == (undefined !== _GET.type)) {
			this.H_Dir.carid = _GET.carid;
			this.H_Dir.cirid = _GET.cirid;
			this.H_Dir.type = _GET.type;
			this.H_Dir.ppid = _GET.ppid;
		}

		var needle = 0;

		for (var i = 0; i < 10; i++) //if ( true == isset($_POST["telno" . $i]) && true == 1 < strlen($_POST["telno" . $i]) ) {
		{
			if (true == (undefined !== _POST["telno" + i]) && true == 0 < _POST["telno" + i].length) //詰める前のセッションをきれいにしてから入れる 20090403miya
				//注文フォームから戻ってきた場合初回の入力が残ったままなので上書き 20090403miya
				{
					this.H_Local["telno" + needle] = _POST["telno" + i];
					this.H_Local["formercarid_" + needle] = _POST["formercarid_" + i];
					this.H_Local["mnpno_" + needle] = _POST["mnpno_" + i];
					this.H_Local["mnp_enable_date_" + needle] = _POST["mnp_enable_date_" + i];
					delete this.H_Dir["formercarid_" + i];
					delete this.H_Dir["mnpno_" + i];
					delete this.H_Dir["mnp_enable_date_" + i];
					this.H_Dir["formercarid_" + needle] = this.H_Local["formercarid_" + needle];
					this.H_Dir["mnpno_" + needle] = this.H_Local["mnpno_" + needle];
					this.H_Dir["mnp_enable_date_" + needle] = this.H_Local["mnp_enable_date_" + needle];
					delete this.H_Dir.telinfo["telno" + needle].mnpalert;
					delete this.H_Dir.telinfo["telno" + needle].telno;
					delete this.H_Dir.telinfo["telno" + needle].telno_view;
					needle++;
				}
		}

		for (i = 0;; i < 10; i++) {
			if (true == Array.isArray(this.H_Local)) {
				if (false == (undefined !== this.H_Local["telno" + i]) || 1 > this.H_Local["telno" + i].length) {
					delete this.H_Dir["formercarid_" + i];
					delete this.H_Dir["mnpno_" + i];
				}
			}
		}

		if (true == (undefined !== _POST.telcount)) {
			this.H_Dir.telcount = _POST.telcount;
		}

		if (true == (undefined !== _POST.recogpostid)) {
			this.H_Dir.recogpostid = _POST.recogpostid;
		}

		if (true == (undefined !== _POST.recogpostname)) {
			this.H_Dir.recogpostname = _POST.recogpostname;
		}

		this.O_Sess.setPub(OrderInputMNPView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);

		if (_GET.length > 0) {
			MtExceptReload.raise(undefined);
		}

		if (true == (undefined !== this.H_Local)) {
			var _POST = this.H_Local;
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
		this.O_Sess.setPub(OrderInputMNPView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);
	}

	setRecogPost() {
		this.H_Dir.recogpostid = this.H_View.recogpostid;
		this.H_Dir.recogpostname = this.H_View.recogpostname;
		this.O_Sess.setPub(OrderInputMNPView.PUB, this.H_Dir);
	}

	checkCGIParamNewOrder() {
		var H_telnos = Array();
		return H_telnos;
	}

	setTelInfoSession(H_info) //1件目がなければエラー
	{
		if (false == (undefined !== H_info.telno0)) {
			return false;
		}

		this.H_Dir.telinfo = H_info;
		this.H_Dir.telcount = H_info.length;
		this.O_Sess.setPub(OrderInputMNPView.PUB, this.H_Dir);
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

	makeInputForm(O_order, O_model, H_sess: {} | any[], O_info, A_auth = Array()) //英語化権限 20090210miya
	//件数
	//元のキャリア（DBから作るようにしなければならない）
	//$H_formercarid = array();
	//		$H_formercarid[""] = $formercarstr;
	//		$H_formercarid["1"] = $formercarstr1;
	//		$H_formercarid["2"] = $formercarstr2;
	//		$H_formercarid["3"] = $formercarstr3;
	//		$H_formercarid["4"] = $formercarstr4;
	//		$H_formercarid["15"] = $formercarstr15;
	//""=>選択してくださいがないのでエラーになる
	//$H_formercarid = $O_info->getPortableCarrier($H_sess[self::PUB]["carid"]);
	//unset( $H_formercarid[ $H_sess[self::PUB]["carid"] ] ) ;
	//キャリアを取得
	//選択してくださいを設定
	//キャリアをいれていく
	//フォーム要素の配列作成
	//telno0～telno9に電話番号で使用できる文字のチェックを入れた 20100630miya
	//mnp有効日の表示
	//英語化 20090402miya
	//$this->H_View["O_InputFormUtil"]->registerOriginalRules( array("CheckInputTelList", "CheckInputTelAndCarria") );
	//戻りのためのデフォルト値
	{
		var H_g_sess = this.getGlobalSession();

		if ("ENG" == H_g_sess.language) //telno0～telno9に電話番号で使用できる文字のチェックを入れた 20100630miya
			{
				var telnostr = "Mobile Phone Number";
				var formercaridstr = "Previous Carrier";
				var mnpnostr = "MNP Reservation No. (Optional)";
				var formercarstr = "Select";
				var formercarstr1 = "NTT docomo";
				var formercarstr2 = "Y!mobile(\u65E7WILLCOM)";
				var formercarstr3 = "au";
				var formercarstr4 = "softbank";
				var formercarstr15 = "Y!mobile(\u65E7EMOBILE)";
				var alert1 = "One or more mobile telephone number(s) must be entered.";
				var alert2_1 = "Mobile Phone Number";
				var alert2_2 = " and Previous Carrier must be entered as a set.";
				var alert3 = "Same mobile phone numbers are entered more than once.";
				var alert4 = "Only single-byte English characters, \"(\", \")\", and \"-\" are valid for the Phone Number.";
			} else //telno0～telno9に電話番号で使用できる文字のチェックを入れた 20100630miya
			{
				telnostr = "\u643A\u5E2F\u756A\u53F7";
				formercaridstr = "\u5143\u306E\u30AD\u30E3\u30EA\u30A2";
				mnpnostr = "MNP\u4E88\u7D04\u756A\u53F7\uFF08\u4EFB\u610F\uFF09";
				formercarstr = "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
				formercarstr1 = "NTT\u30C9\u30B3\u30E2";
				formercarstr2 = "Y!mobile(\u65E7WILLCOM)";
				formercarstr3 = "au";
				formercarstr4 = "\u30BD\u30D5\u30C8\u30D0\u30F3\u30AF";
				formercarstr15 = "Y!mobile(\u65E7EMOBILE)";
				alert1 = "\u643A\u5E2F\u756A\u53F7\u306F\u5FC5\u305A\uFF11\u4EF6\u4EE5\u4E0A\u3054\u5165\u529B\u304F\u3060\u3055\u3044";
				alert2_1 = "\u643A\u5E2F\u756A\u53F7";
				alert2_2 = "\u3001\u5143\u306E\u30AD\u30E3\u30EA\u30A2\u306F\u5FC5\u305A\u30BB\u30C3\u30C8\u3067\u8A18\u5165\u3057\u3066\u304F\u3060\u3055\u3044";
				alert3 = "\u540C\u3058\u643A\u5E2F\u756A\u53F7\u304C\u8907\u6570\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u3059";
				alert4 = "\u643A\u5E2F\u756A\u53F7\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u3001\u300C(\u300D,\u300C)\u300D\u3001\u300C-\u300D\u306E\u307F\u3067\u3059";
			}

		var H_selectval = Array();

		for (var i = 1; i <= 10; i++) {
			H_selectval[i] = i;
		}

		var temp = O_info.getPortableCarrier(H_sess[OrderInputMNPView.PUB].carid);
		var H_formercarid = Array();
		H_formercarid[""] = formercarstr;

		for (var key in temp) {
			var value = temp[key];

			if (H_sess[OrderInputMNPView.PUB].carid != key) {
				H_formercarid[key] = value;
			}
		}

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
		}];
		var year = date("Y");

		for (i = 0;; i < 10; i++) //mnp有効日の表示
		{
			A_formelement.push({
				name: "telno" + String(i),
				label: telnostr + String(+(i + 1)),
				inputtype: "text",
				options: {
					size: "30"
				}
			});
			A_formelement.push({
				name: "formercarid_" + String(i),
				label: formercaridstr,
				inputtype: "select",
				data: H_formercarid
			});
			A_formelement.push({
				name: "mnpno_" + String(i),
				label: mnpnostr,
				inputtype: "text",
				options: {
					size: "30"
				}
			});

			if (-1 !== A_auth.indexOf("fnc_mnp_date_show")) {
				A_formelement.push({
					name: "mnp_enable_date_" + String(i),
					label: "MNP\u4E88\u7D04\u756A\u53F7\u6709\u52B9\u65E5",
					inputtype: "date",
					data: {
						minYear: year - 1,
						maxYear: year + 1,
						format: "Y \u5E74 m \u6708 d \u65E5",
						language: "ja",
						addEmptyOption: true,
						emptyOptionValue: "",
						emptyOptionText: "--"
					}
				});
			}
		}

		var A_Rule = [{
			name: ["telno0", "telno1", "telno2", "telno3", "telno4", "telno5", "telno6", "telno7", "telno8", "telno9"],
			mess: alert1,
			type: "QRmultiRequired",
			format: 10
		}];

		for (var telquant = 0; telquant < 10; telquant++) {
			A_Rule.push({
				name: ["telno" + telquant, "formercarid_" + telquant],
				mess: alert2_1 + (telquant + 1) + alert2_2,
				type: "QRcompareRequired",
				format: undefined
			});
		}

		A_Rule.push({
			name: "telno0",
			mess: alert3,
			type: "QRcallOriginalFunction",
			format: "checkTelnoDuplication",
			validation: "client"
		});
		A_Rule.push({
			name: "telno0",
			mess: alert4,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno1",
			mess: alert4,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno2",
			mess: alert4,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno3",
			mess: alert4,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno4",
			mess: alert4,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno5",
			mess: alert4,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno6",
			mess: alert4,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno7",
			mess: alert4,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno8",
			mess: alert4,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		}, {
			name: "telno9",
			mess: alert4,
			type: "regex",
			format: "/^[A-Za-z0-9-]+$/",
			validation: "client"
		});

		if (-1 !== A_auth.indexOf("fnc_mnp_date_show")) {
			for (i = 0;; i < 10; i++) {
				A_Rule.push({
					name: "mnp_enable_date_" + String(i),
					mess: "MNP\u4E88\u7D04\u756A\u53F7\u6709\u52B9\u7F8E\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
					type: "QRCheckdate",
					format: undefined,
					validation: "client"
				});
			}
		}

		this.H_View.O_InputFormUtil = new QuickFormUtil("form");
		this.H_View.O_InputFormUtil.setFormElement(A_formelement);

		if ("ENG" == H_g_sess.language) {
			this.H_View.O_InputFormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_InputFormUtil.setDefaultWarningNote();
		}

		this.O_InputForm = this.H_View.O_InputFormUtil.makeFormObject();
		this.H_View.O_InputFormUtil.makeFormRule(A_Rule);
		var H_def = Array();

		if (true == Array.isArray(H_sess[OrderInputMNPView.PUB])) {
			if (true == Array.isArray(H_sess[OrderInputMNPView.PUB].telinfo)) {
				{
					let _tmp_0 = H_sess[OrderInputMNPView.PUB].telinfo;

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

			if (H_sess[OrderInputMNPView.PUB].recogpostid) {
				H_def.recogpostid = H_sess[OrderInputMNPView.PUB].recogpostid;
			}

			if (H_sess[OrderInputMNPView.PUB].recogpostname) {
				H_def.recogpostname = H_sess[OrderInputMNPView.PUB].recogpostname;
				this.H_View.recogpostname = H_sess[OrderInputMNPView.PUB].recogpostname;
			}

			for (var cnt = 0; cnt < 10; cnt++) {
				if ("" != H_sess[OrderInputMNPView.PUB]["formercarid_" + cnt]) {
					H_def["formercarid_" + cnt] = H_sess[OrderInputMNPView.PUB]["formercarid_" + cnt];
				}

				if ("" != H_sess[OrderInputMNPView.PUB]["mnpno_" + cnt]) {
					H_def["mnpno_" + cnt] = H_sess[OrderInputMNPView.PUB]["mnpno_" + cnt];
				}

				var date = H_sess[OrderInputMNPView.PUB]["mnp_enable_date_" + cnt];

				if ("" != date.Y + date.m + date.d) {
					H_def["mnp_enable_date_" + cnt] = H_sess[OrderInputMNPView.PUB]["mnp_enable_date_" + cnt];
				}
			}

			this.O_InputForm.setConstants(H_def);
		}
	}

	makeInputRule() {}

	makeRecogPostid(H_sess, H_g_sess) //機種変更、移行、付属品は電話の所属部署の住所を取得（付属品は電話番号入力が独立していないので除外していたが、第二階層のためにまた入れた 20060508miya）
	//一件のとき→電話の所属部署を取得
	//複数件のとき→ログインユーザの部署を取得
	//※第二階層権限を持つユーザはデフォルト値を第二階層部署の住所とする	***** ←未実装 *****
	{
		var type = H_sess[OrderInputMNPView.PUB].type;
		var telcount = H_sess[OrderInputMNPView.PUB].telcount;
		var telinfo_postid = H_sess[OrderInputMNPView.PUB].telinfo.telno0.postid;

		if (telinfo_postid != "" && -1 !== ["C", "S", "A"].indexOf(type) == true && telcount == 1) {
			var recogpostid = telinfo_postid;
		} else if ("" != H_sess[OrderInputMNPView.PUB].recogpostid && true == (-1 !== ["Nmnp"].indexOf(type))) //選択された部署
			{
				recogpostid = H_sess[OrderInputMNPView.PUB].recogpostid;
			} else {
			recogpostid = H_g_sess.postid;
		}

		return recogpostid;
	}

	makeFormStatic(H_g_sess: {} | any[]) //スタティック表示部分
	{
		this.H_View.O_InputFormUtil.O_Form.addElement("header", "ptn", this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname);
		this.H_View.O_InputFormUtil.O_Form.addElement("header", "comp", H_g_sess.compname);
		this.H_View.O_InputFormUtil.O_Form.addElement("header", "loginname", H_g_sess.loginname);
	}

	makeHiddenParam() //登録部署
	{
		this.H_View.O_InputFormUtil.O_Form.addElement("hidden", "recogpostname", this.H_View.recogpostname);
		this.H_View.O_InputFormUtil.O_Form.addElement("hidden", "recogpostid", this.H_View.recogpostid);
	}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[], A_alert: {} | any[] = Array()) //QuickFormとSmartyの合体
	//英語化権限 20090210miya
	//assign
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
		this.get_Smarty().assign("carname", H_sess[OrderInputMNPView.PUB].carname);
		this.get_Smarty().assign("ptnname", H_sess[OrderInputMNPView.PUB].ptnname);

		if ("shop" == MT_SITE) {
			this.get_Smarty().assign("title", this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname);
			this.get_Smarty().assign("shop_submenu", this.H_View.pankuzu_link);
			this.get_Smarty().assign("shop_person", this.gSess().name + " " + this.gSess().personname);
		}

		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js_show_hide", "ShowHide();");
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("H_jsfile", ["Order/order_select.js"]);
		this.get_Smarty().assign("recogpostname", this.H_View.recogpostname);
		this.get_Smarty().assign("A_alert", A_alert);
		this.get_Smarty().assign("eng", eng);
		this.get_Smarty().assign("A_auth", A_auth);
		var smarty_template = "input_mnp.tpl";
		this.get_Smarty().display(smarty_template);
	}

	setOrderByCategory(pattern) {
		this.get_Smarty().assign("OrderByCategory", pattern);
	}

	__destruct() {
		super.__destruct();
	}

};