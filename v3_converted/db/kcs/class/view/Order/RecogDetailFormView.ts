//
//注文履歴詳細フォームViewの基底クラス
//
//更新履歴：<br>
//2008/08/04 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/08/04
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//require_once("view/ViewSmarty.php");
//
//注文フォームViewの基底クラス
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/05/19
//@uses MtSetting
//@uses MtSession
//

require("OrderDetailFormView.php");

//
//submitボタン名
//
//
//submitボタン名（確認画面用）
//
//
//コンストラクタ <br>
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
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
//CSSを返す
//
//@author miyazawa
//@since 2008/03/07
//
//@access public
//@return string
//
//
//CGIパラメータを取得する
//
//@author igarashi
//@since 2008/06/09
//
//@access public
//@return none
//
//
//フォーム表示項目作成（項目freezeのためオーバーライド）
//
//@author miyazawa
//@since 2008/05/20
//
//@param mixed $O_order
//@param array $H_items
//@param array $H_dir
//@param array $H_g_sess
//@param int $telcount
//@param array $H_product
//@access protected
//@return void
//
//
//承認フォーム
//
//@author miyazawa
//@since 2008/09/08
//
//@param object $O_model(OrderDetailFormModel)
//@param int $H_sess(セッション情報)
//
//@access public
//@return boolean
//
//
//freeze処理をする <br>
//
//ボタン名の変更 <br>
//エラーチェックを外す <br>
//freezeする <br>
//
//@author miyazawa
//@since 2008/03/11
//
//@access public
//@return void
//
//
//freezeさせない時の処理 <br>
//
//ボタン名の変更 <br>
//
//@author houshiyama
//@since 2008/03/12
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
//@since 2008/02/20
//
//@param array $H_sesstion（CGIパラメータ）
//@param array $A_auth（権限一覧）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//配下のセッション消し
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
//
//完了画面表示 <br>
//
//セッションクリア <br>
//2重登録防止メソッド呼び出し <br>
//完了画面表示 <br>
//
//@author miyazawa
//@since 2008/06/27
//
//@access protected
//@param int $orderid
//@param bool $orderid_disp（完了画面への受付番号表示フラグ）
//@param int $shopid
//@param int $groupid
//@return void
//
//
//承認確認画面遷移時の履歴数をセットする(承認時の承認履歴数と比べて他の人が承認してないか確認するため)
//
//@author hanashima
//@since 2020/03/03
//
//@access public
//@return void
//
//
//承認エラーをセットする
//
//@author hanashima
//@since 2020/03/03
//
//@access public
//@return void
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
class RecogDetailFormView extends OrderDetailFormView {
	static NEXTNAME = "\u78BA\u8A8D\u753B\u9762\u3078";
	static NEXTNAME_ENG = "To Confirmation Screen";
	static RECNAME = "\u627F\u8A8D\u30FB\u56DE\u7B54";
	static RECNAME_ENG = "Respond";

	constructor() {
		super();
	}

	makePankuzuLinkHash() {
		if (true == this.H_Dir.eng) {
			var H_link = {
				"/MTRecog/menu.php": "Approval",
				"": "Details"
			};
		} else {
			H_link = {
				"/MTRecog/menu.php": "\u627F\u8A8D",
				"": "\u627F\u8A8D\u8A73\u7D30"
			};
		}

		return H_link;
	}

	getCSS() {
		return "csRecog";
	}

	checkCGIParam() //getパラメータは消す
	{
		this.setDefaultSession();
		var sess = this.getLocalSession();

		if (true == (undefined !== _GET.o)) {
			this.H_Dir.orderid = _GET.o;
			this.O_Sess.SetPub(RecogDetailFormView.PUB, this.H_Dir);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		if (undefined !== _GET.p == true) {
			this.H_Dir.offset = _GET.p;
		}

		if (undefined !== _GET.limit == true) {
			this.H_Dir.limit = _GET.limit;
			this.H_Dir.offset = 1;
		}

		if (!is_numeric(this.H_Dir.limit) || 1 > this.H_Dir.limit) {
			this.H_Dir.limit = 10;
		}

		if (false == (undefined !== this.H_Dir.orderid)) {
			this.getOut().errorOut(0, "orderid\u304C\u3042\u308A\u307E\u305B\u3093", false);
		}

		var infcnt = 0;

		for (var key in _POST) {
			var val = _POST[key];

			if (true == (-1 !== this.A_boxinput.indexOf(key))) {
				infcnt++;
			}

			this.H_Local[key] = val;
		}

		if (this.A_boxinput.length == infcnt) {
			this.H_Local.openflg = true;
		} else {
			this.H_Local.openflg = false;
		}

		if (undefined !== sess.SELF.csrfid && !this.H_Local.csrfid) {
			this.H_Local.csrfid = sess.SELF.csrfid;
		}

		this.H_Dir.carid = +this.H_Dir.carid;
		this.H_Dir.cirid = +this.H_Dir.cirid;
		this.H_Dir.orderid = +this.H_Dir.orderid;
		this.H_Local.applyprice = +this.H_Local.applyprice;
		this.H_Local.point = +this.H_Local.point;
		this.O_Sess.SetPub(RecogDetailFormView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);

		if (_GET.length > 0) {
			MtExceptReload.raise(undefined);
		}
	}

	makeOrderFormItem(O_order, O_form_model: OrderFormModel, O_telinfo_model: OrderTelInfoModel, H_items: {} | any[], H_dir: {} | any[], H_g_sess: {} | any[], telcount = 1, H_product, H_view) //配列に引数をまとめてしまう
	//キャリアの代表エリア(関東圏)を取得
	//フォーム表示項目のうち必要なものを電話詳細表示用に名前を変える
	//DBから取得した注文ページに表示するフォーム個数分、回す
	//ここがないと割引等がfrozenにならない
	{
		H_dir.pactid = H_g_sess.pactid;
		H_dir.arid = O_telinfo_model.getAreatoCarrier(H_dir.carid);
		H_items = this.makeOrderFormItemToTelDetail(H_items, telcount);

		for (var i = 0; i < H_items.length; i++) //select
		//入力しないものは最初から確定
		{
			if (H_items[i].inputtype == "select") {
				this.makeFormItemSelect(O_form_model, O_telinfo_model, H_dir, H_items[i], H_product, H_view, H_g_sess);
			} else if (H_items[i].inputtype == "checkbox") {
				this.makeFormItemCheckbox(O_form_model, O_telinfo_model, H_dir, H_items[i], H_product);
			} else if (H_items[i].inputtype == "radio_child") {
				global[H_items[i].inputname].push(HTML_QuickForm.createElement("radio", undefined, undefined, H_items[i].itemname, H_items[i].inputdef, H_items[i].property));
			} else if (H_items[i].inputtype == "radio") {
				if (H_items[i].inputname == "option") {
					this.makeFormItemRadio(O_form_model, O_telinfo_model, H_dir, H_items[i], H_product);
				} else //下の1行をmakeItemRadioに入れたらなぜかradioボタンが生成できなかった。
					//時間がないのでif文ごと外に出して対応。
					{
						this.H_View.O_OrderFormUtil.O_Form.addGroup(global[H_items[i].inputname], H_items[i].inputname, H_items[i].itemname, H_items[i].property);
					}
			} else {
				var H_property = unserialize(H_items[i].property);

				if (H_property == "") {
					H_property = H_items[i].property;
				}

				if (H_items[i].inputtype == "date") //英語化権限 20090331miya
					//前後1ヵ月なので1を設定
					//20110314iga
					{
						if (true == this.H_Dir.eng) {
							if (H_property.format == "Y \u5E74 m \u6708 d \u65E5") {
								H_property.format = "Y / m / d";
							} else if (H_property.format == "Y \u5E74 m \u6708 d \u65E5\u307E\u3067") {
								H_property.format = "\\T\\o      Y / m / d";
							} else if (H_property.format == "Y \u5E74 m \u6708 d \u65E5 \u4EE5\u964D") {
								H_property.format = "\\F\\r\\o\\m Y / m / d";
							} else if (H_property.format == "Y \u5E74 m \u6708 d \u65E5 H \u6642\u307E\u3067") {
								H_property.format = "\\T\\o      Y / m / d H:00";
							} else if (H_property.format == "Y \u5E74 m \u6708 d \u65E5 H \u6642\u4EE5\u964D") {
								H_property.format = "\\F\\r\\o\\m Y / m / d H:00";
							}
						}

						var now = Date.now() / 1000;
						var context = 1;
						var max = mktime(0, 0, 0, date("n", now) + context, 1, date("Y", now));
						var min = mktime(0, 0, 0, date("n", now) - context, 1, date("Y", now));
						var maxY = date("Y", max);
						var minY = date("Y", min);
						var H_def_year = {
							minYear: minY,
							maxYear: maxY
						};
						H_property = Array.from(H_property + Array.from(H_def_year));
					}

				this.H_View.O_OrderFormUtil.O_Form.addElement(H_items[i].inputtype, H_items[i].inputname, H_items[i].itemname, H_property);
			}

			if (H_items[i].inputdef == "frz") {
				this.A_frz.push(H_items[i].inputname);
			}
		}

		this.A_frz.push("waribiki");
		this.A_frz.push("vodalive");
		this.A_frz.push("vodayuryo");
	}

	makeAnswerBox(O_model, H_sess) //英語化権限 20090210miya
	//QuickFormオブジェクトが作成されているか確認
	//承認用にフォームエレメント追加
	//英語化 20090402miya
	{
		if (true == this.H_Dir.eng) {
			var okstr = "Approval";
			var stat20str = "Hold";
			var stat30str = "Disapproval";
			var answerstr = "Response";
			var answercommentstr = "Comment";
			var answerrulestr = "Select a response.";
		} else {
			okstr = "\u627F\u8A8D";
			stat20str = "\u4FDD\u7559";
			stat30str = "\u5374\u4E0B";
			answerstr = "\u56DE\u7B54";
			answercommentstr = "\u30B3\u30E1\u30F3\u30C8";
			answerrulestr = "\u56DE\u7B54\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044";
		}

		this.checkQuickFormObject();
		O_answer.push(HTML_QuickForm.createElement("radio", undefined, undefined, okstr, "ok"));
		O_answer.push(HTML_QuickForm.createElement("radio", undefined, undefined, stat20str, "20"));
		O_answer.push(HTML_QuickForm.createElement("radio", undefined, undefined, stat30str, "30"));
		this.H_View.O_OrderFormUtil.addGroupWrapper(O_answer, "answer", answerstr);
		this.H_View.O_OrderFormUtil.O_Form.addElement("text", "answercomment", answercommentstr, {
			size: "80"
		});

		if (true == this.H_Dir.eng) {
			this.H_View.O_OrderFormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_OrderFormUtil.setDefaultWarningNote();
		}

		this.H_View.O_OrderFormUtil.addRuleWrapper("answer", answerrulestr, "required", undefined, "client");
	}

	freezeForm() //英語化権限
	//ダブルクリック防止
	{
		if (true == this.H_Dir.eng) {
			var recnamestr = RecogDetailFormView.RECNAME_ENG;
			var backnamestr = RecogDetailFormView.BACKNAME_ENG;
		} else {
			recnamestr = RecogDetailFormView.RECNAME;
			backnamestr = RecogDetailFormView.BACKNAME;
		}

		this.H_View.O_OrderFormUtil.O_Form.addElement("submit", "submitName", recnamestr, {
			id: "submitName",
			value: recnamestr
		});
		this.H_View.O_OrderFormUtil.O_Form.addElement("submit", "backName", backnamestr, {
			id: "backName",
			value: backnamestr
		});
		this.H_View.O_OrderFormUtil.updateAttributesWrapper({
			onsubmit: "return stop_w_click();"
		});
		this.H_View.O_OrderFormUtil.freezeWrapper();
	}

	unfreezeForm() //$this->H_View["O_OrderFormUtil"]->updateAttributesWrapper( array( "onsubmit" => "return activate_and_submit();" ) );	// カゴ入力項目活性化
	{
		if (true == this.H_Dir.eng) {
			var nextnamestr = RecogDetailFormView.NEXTNAME_ENG;
		} else {
			nextnamestr = RecogDetailFormView.NEXTNAME;
		}

		this.H_View.O_OrderFormUtil.O_Form.addElement("submit", "submitName", nextnamestr, {
			id: "submitName",
			value: nextnamestr
		});

		if (this.A_frz.length > 0) {
			this.H_View.O_OrderFormUtil.O_Form.freeze(this.A_frz);
		}
	}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[], H_order: {} | any[], H_hist_all: {} | any[] = Array(), H_g_sess: {} | any[]) //プランの時だけ表示用端末買い方を取得する
	//個人別請求権限
	//公私分計権限
	//資産管理権限 20090317miya
	//販売店の受注内容変更では表示する 20090324miya
	//履歴分割
	//assign
	//暫定
	//暫定
	//資産管理権限 20090317miya
	//S224 解約注文時電話詳細項目表示 hanashima 20200717
	{
		if (true == (-1 !== ["P", "Ppl", "Pdc", "Pop"].indexOf(H_sess[RecogDetailFormView.PUB].type))) {
			var O_buysel = new BuySelectModel();

			if ("" != H_sess[RecogDetailFormView.PUB].buyselid) {
				if (true == this.H_Dir.eng) {
					this.get_Smarty().assign("buyselname", O_buysel.getBuySelectNameEng(H_sess[RecogDetailFormView.PUB].buyselid));
				} else {
					this.get_Smarty().assign("buyselname", O_buysel.getBuySelectName(H_sess[RecogDetailFormView.PUB].buyselid));
				}
			} else {
				if (true == this.H_Dir.eng) {
					this.get_Smarty().assign("buyselname", O_buysel.getBuySelectNameFromTelnoEng(H_sess["/MTOrder"].telinfo[0].telno));
				} else {
					this.get_Smarty().assign("buyselname", O_buysel.getBuySelectNameFromTelno(H_sess["/MTOrder"].telinfo[0].telno));
				}
			}
		}

		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_OrderForm.accept(O_renderer);

		if (-1 !== A_auth.indexOf("fnc_kojinbetu_vw") == true) {
			var useCharge = true;
		} else {
			useCharge = false;
		}

		if (-1 !== A_auth.indexOf("fnc_kousi") == true) {
			var kousiFlg = true;
		} else {
			kousiFlg = false;
		}

		if (-1 !== A_auth.indexOf("fnc_assets_manage_adm_co") == true || site == 1) {
			var assetsFlg = true;
		} else {
			assetsFlg = false;
		}

		var H_hist_divided = this.historyDivide(H_hist_all);
		this.getExtensionDisplay(H_order);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("postname", H_order.order.postname);
		this.get_Smarty().assign("css", this.H_View.css);
		this.get_Smarty().assign("cssTh", this.H_View.css + "Th");
		this.get_Smarty().assign("boxopen", true);
		this.get_Smarty().assign("boxinfo", H_sess.SELF);
		this.get_Smarty().assign("ordinfo", H_order.order);
		this.get_Smarty().assign("H_sub", H_order.sub);
		this.get_Smarty().assign("teldisplay", this.H_View.teldisplay);

		if ("M" != H_sess[RecogDetailFormView.PUB].type) {
			this.get_Smarty().assign("telcount", H_sess[RecogDetailFormView.PUB].telcount);
		} else {
			this.get_Smarty().assign("telcount", 1);
		}

		this.get_Smarty().assign("telpropertyjsflg", 1);
		this.get_Smarty().assign("smartphone", true);
		this.get_Smarty().assign("type", H_sess[RecogDetailFormView.PUB].type);
		this.get_Smarty().assign("H_tax", H_order.tax);
		this.get_Smarty().assign("disptype", this.H_View.smarty_template);
		this.get_Smarty().assign("dispmainonly", true);
		this.get_Smarty().assign("useCharge", useCharge);
		this.get_Smarty().assign("kousiFlg", kousiFlg);
		this.get_Smarty().assign("assetsFlg", assetsFlg);
		this.get_Smarty().assign("point_flg", this.checkPointUseType(H_sess[RecogDetailFormView.PUB]));
		this.get_Smarty().assign("kousiFlg", kousiFlg);
		this.get_Smarty().assign("H_hist", H_hist_divided.H_hist);
		this.get_Smarty().assign("hist_cnt", H_hist_divided.hist_cnt);
		this.get_Smarty().assign("H_hist_shop", H_hist_divided.H_hist_shop);
		this.get_Smarty().assign("hist_shop_cnt", H_hist_divided.hist_shop_cnt);
		this.get_Smarty().assign("telpenalty", this.H_View.telpenalty);
		this.get_Smarty().assign("bulkplan", this.H_View.bulkplan);
		this.get_Smarty().assign("mnpalert", this.H_View.mnpalert);
		this.get_Smarty().assign("limit", H_sess[RecogDetailFormView.PUB].limit);
		this.get_Smarty().assign("page_link", this.H_View.page_link);
		this.get_Smarty().assign("telusername", H_sess["/MTOrder"].telinfo[0].telusername);
		this.get_Smarty().assign("employeecode", H_sess["/MTOrder"].telinfo[0].employeecode);
		this.get_Smarty().assign("slipno", H_order.order.slipno);
		this.get_Smarty().assign("message", H_order.order.message);
		this.get_Smarty().assign("postid", H_g_sess.postid);
		this.get_Smarty().assign("carid", H_order.order.carid);
		this.get_Smarty().assign("fjpauth", this.O_fjp.checkAuth("co"));
		var viewflag = false;

		if (50 > H_order.order.status) //承認部署なら表示
			{
				if (H_order.order.nextpostid == H_g_sess.postid) {
					viewflag = true;
				}

				if ((5 == H_order.order.status || 7 == H_order.order.status) && H_order.order.recoguserid == H_g_sess.userid) {
					viewflag = true;
				}

				if ((5 == H_order.order.status || 7 == H_order.order.status) && H_order.order.recoguserid != H_g_sess.userid) {
					viewflag = false;
				}

				if (-1 !== A_auth.indexOf("fnc_su_all_recog") && H_g_sess.su) {
					viewflag = true;
				}
			}

		this.get_Smarty().assign("recogviewflag", viewflag);
		this.get_Smarty().assign("extension", this.O_fjp.getSelectExtension(H_sess[RecogDetailFormView.PUB].type));

		if (this.O_fjp.checkAuth("co")) {
			this.get_Smarty().assign("fjpco", true);
			this.get_Smarty().assign("notedit", true);
			this.get_Smarty().assign("fjpname", this.O_fjp.reverseExtensionCode(H_order.order));
		}

		this.get_Smarty().assign("pagetype", "recog");
		this.get_Smarty().assign("A_auth", A_auth);

		if (undefined !== this.H_View.deleteOrderDisplayTelDetaile) {
			this.get_Smarty().assign("deleteOrderDisplayTelDetaile", this.H_View.deleteOrderDisplayTelDetaile);
		}

		var smarty_template = "recog_detail.tpl";
		this.get_Smarty().display(smarty_template);
	}

	clearUnderSession() {
		this.clearLastForm();
		var A_exc = [RecogDetailFormView.PUB];
		this.O_Sess.clearSessionListPub(A_exc);
	}

	endOrderFormView(orderid, orderid_disp = false, shopid = "", groupid = "") //英語化権限
	//セッションクリア
	//2重登録防止メソッド
	//受付時間の取得
	//超簡易対応なので、あとで必ず修正すること!!!!!!!!!!
	//池袋でドコモなら処理を変えよう(´･ω･`)
	//超簡易処理なので、あとで必ず変更すること
	//完了画面表示
	{
		if (true == this.H_Dir.eng) {
			var backbtn0 = "Return to Approval Menu";
			var outtxt0_1 = "Ordering closed for the day at ";
			var outtxt0_2 = ":00.";
			var fintxt0_1 = "Order No. ";
			var fintxt0_2 = " <BR>Respond";
			var fintxt1 = "Respond";
			var language = "ENG";
		} else {
			backbtn0 = "\u627F\u8A8D\u30E1\u30CB\u30E5\u30FC\u3078";
			outtxt0_1 = "\u672C\u65E5\u306E\u53D7\u4ED8\u306F";
			outtxt0_2 = "\u6642\u3067\u7D42\u4E86\u3044\u305F\u3057\u307E\u3057\u305F\u3002";
			fintxt0_1 = "\u6CE8\u6587\u756A\u53F7 ";
			fintxt0_2 = " <BR>\u627F\u8A8D\u30FB\u56DE\u7B54";
			fintxt1 = "\u627F\u8A8D\u30FB\u56DE\u7B54";
			language = "JPN";
		}

		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var outtxtafter = "";

		if (this.isIkebukuro(groupid, this.H_Dir.shopid) && this.H_Dir.carid == 1) //池袋でドコモの場合、受付時間が15時終わり
			//ここで終わり
			{
				var limittime = 15;

				if (limittime <= +date("G")) {
					outtxtafter = "</font></h2><h3><font color='red'>" + "\u5546\u54C1\u3092\u4F34\u3046\u3054\u6CE8\u6587\u306F15\u6642\u3067\u7D42\u4E86\u3044\u305F\u3057\u307E\u3057\u305F<br>" + "\u5546\u54C1\u3092\u4F34\u308F\u306A\u3044\u3054\u6CE8\u6587\u306F16\u6642\u3067\u7D42\u4E86\u3044\u305F\u3057\u307E\u3059" + " </h3>" + "</font><font><h2>";
				}
			} else //このif文の中身が通常処理です
			//受付時間の取得
			//完了画面に出すメッセージ（フォントのサイズ、色をタグで指定している）
			{
				limittime = this.getReceptionTimeLimit(groupid, this.H_Dir.shopid, this.H_Dir.carid);

				if (limittime <= +date("G")) {
					outtxtafter = "</font></h2><h3><font color='red'>" + outtxt0_1 + limittime + outtxt0_2 + "</h3>\n                <font size=2><BR>" + outtxt1 + "</font></font><font><h2>";
				}
			}

		var O_finish = new ViewFinish();

		if (true == orderid_disp) //最終承認者の場合は受付番号表示
			{
				O_finish.displayFinish(fintxt0_1 + str_pad(orderid, 10, "0", STR_PAD_LEFT) + fintxt0_2, "/MTRecog/menu.php", backbtn0, outtxtafter, language);
			} else {
			O_finish.displayFinish(fintxt1, "/MTRecog/menu.php", backbtn0, "", language);
		}
	}

	makeHistoryCount(count = 0) {
		this.H_View.O_OrderFormUtil.O_Form.addElement("hidden", "history_count", count, {
			id: "history_count"
		});
	}

	setApprovalErrorMessage() {
		this.get_Smarty().assign("error_approval", "\u627F\u8A8D\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002");
	}

	__destruct() {
		super.__destruct();
	}

};