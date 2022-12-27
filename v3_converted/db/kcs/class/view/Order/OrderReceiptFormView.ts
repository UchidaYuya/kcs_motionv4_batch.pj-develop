//
//管理情報Viewの基底クラス
//
//更新履歴：<br>
//2008/03/14 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/14
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//管理情報Viewの基底クラス
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/14
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("view/QuickFormUtil.php");

require("view/Rule/ManagementRule.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("MtUniqueString.php");

require("view/ViewFinish.php");

//
//submitボタン名
//
//
//submitボタン名（確認画面用）
//
//
//submitボタン名（確認画面からの戻り用）
//
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
//セッティングオブジェクト
//
//@var mixed
//@access protected
//
//
//コンストラクタ <br>
//
//@author houshiyama
//@since 2008/03/03
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//セッションのpactidを返す
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
//
//セッションのpostidを返す
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
//
//ローカルセッションを取得する
//
//@author houshiyama
//@since 2008/03/11
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author houshiyama
//@since 2008/03/07
//
//@access public
//@return mixed
//
//
//POSTをsessionにセットする<br>
//
//@author date
//@since 2014/01/15
//
//@access public
//@return none
//
//
//資産新規登録フォームのエラーチェック作成
//
//@author houshiyama
//@since 2008/08/18
//
//@access public
//@return void
//
//setDefault
//
//最低限必要なセッション情報が無ければエラー表示
//
//@author houshiyama
//@since 2008/04/04
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/03/07
//
//@access public
//@return void
//
//
//パン屑リンクを作る
//
//@author igarashi
//@since 2008/09/17
//
//@access public
//@return hash
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
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class OrderReceiptFormView extends ViewSmarty {
	static NEXTNAME = "\u78BA\u8A8D\u753B\u9762\u3078";
	static RECNAME = "\u767B\u9332\u3059\u308B";
	static BACKNAME = "\u5165\u529B\u753B\u9762\u306B\u623B\u308B";
	static RETURNNAME = "\u623B\u308B";
	static PUB = "/MTOrder";

	constructor() {
		this.O_Sess = MtSession.singleton();
		var H_param = Array();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.H_Dir = this.O_Sess.getPub(OrderReceiptFormView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();

		if (is_numeric(this.O_Sess.pactid) == true) {
			this.O_Auth = MtAuthority.singleton(this.O_Sess.pactid);
		} else {
			this.errorOut(10, "\u30BB\u30C3\u30B7\u30E7\u30F3\u306Bpactid\u304C\u7121\u3044", false);
		}
	}

	get_Pactid() {
		return this.pactid;
	}

	get_Postid() {
		return this.postid;
	}

	getLocalSession() {
		var H_sess = {
			[OrderReceiptFormView.PUB]: this.O_Sess.getPub(OrderReceiptFormView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	get_View() {
		return this.H_View;
	}

	checkCGIParam() //// GETパラメータ
	//		// リセット
	//		if($_GET["r"] != ""){
	//			// 商品情報消す
	//			unset($this->H_Dir["price_detailid"]);
	//			unset($this->H_Dir["free_acce"]);
	//			unset($this->H_Dir["tempid"]);	// リセットするときは雛型もクリア 20090508miya
	//			unset($this->H_Local["tempid"]);	// 同上 20090508miya
	//			$this->O_Sess->SetPub(self::PUB, $this->H_Dir);
	//echo "test";
	//			unset( $this->H_local );
	//			$this->O_Sess->SetSelfAll($this->H_Local);
	//		    header("Location: " . $_SERVER["PHP_SELF"]);
	//		    exit();
	//		}
	//ご注文・ご依頼詳細からきた場合は受注日入力と入っている。
	//$this->O_Sess->clearSessionSelf();
	{
		this.H_Local.post = Array();

		for (var key in _POST) {
			var val = _POST[key];
			this.H_Local.post[key] = val;
		}

		if (this.H_Local.post.submitToReceipt == "\u53D7\u9818\u65E5\u5165\u529B") //いらないので消しとく
			{
				delete this.H_Local.post.submitToReceipt;
			}

		this.O_Sess.SetPub(OrderReceiptFormView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	makeForm(H_sess, H_SubDetail) //機種IDを取得
	//オプション
	//フォーム足していく
	//ユニーク文字列生成用
	//クイックフォームオブジェクト生成
	{
		var A_formelement = Array();
		var A_dateopt = {
			minYear: date("Y") - 3,
			maxYear: date("Y") + 3,
			addEmptyOption: true,
			emptyOptionText: "--",
			format: "Y \u5E74 m \u6708 d \u65E5",
			id: "receipt_date",
			language: "ja"
		};

		for (var key in H_SubDetail) {
			var value = H_SubDetail[key];

			if (value.substatus != 230) //名前の設定
				//オプションのIDだけ設定する
				{
					var name = "receipt_date_" + value.detail_sort;
					A_dateopt.id = name;
					A_formelement.push({
						name: name,
						label: "\u53D7\u9818\u65E5",
						inputtype: "date",
						data: A_dateopt
					});
				}
		}

		var O_unique = MtUniqueString.singleton();

		if (!(undefined !== H_sess.SELF.post.uniqueid)) {
			var A_tmp = {
				name: "uniqueid",
				inputtype: "hidden",
				data: O_unique.getNewUniqueId(),
				options: {
					id: "uniqueid"
				}
			};
			A_formelement.push(A_tmp);
		} else {
			A_tmp = {
				name: "uniqueid",
				inputtype: "hidden",
				data: H_sess.SELF.post.uniqueid,
				options: {
					id: "uniqueid"
				}
			};
			A_formelement.push(A_tmp);
		}

		this.H_View.O_FormUtil = new QuickFormUtil("form");
		this.H_View.O_FormUtil.setFormElement(A_formelement);
		this.O_Form = this.H_View.O_FormUtil.makeFormObject();
	}

	makeRule(H_order) //ここで使用する自作関数の読込
	//表示言語分岐
	{
		var rules = Array();

		for (var key in H_order) {
			var value = H_order[key];

			if (value.substatus != 230) //日付の整合性チェック
				//$rules[] = array(  "name" => "receipt_date_".$value["detail_sort"],
				//    		                       "mess" => $value["productname"]."の受領日を入力して下さい",
				//        		                   "type" => "QRCheckDateEmptyYMD",
				//            		               "format" => null,
				//                		           "validation" => "client",
				//                    	    	   "reset" => false,
				//                        		   "force" => false
				//	                      );
				{
					rules.push({
						name: "receipt_date_" + value.detail_sort,
						mess: value.productname + "\u306E\u53D7\u9818\u65E5\u304C\u7121\u52B9\u3067\u3059\u3002",
						type: "QRCheckDate",
						format: undefined,
						validation: "client",
						reset: false,
						force: false
					});
				}
		}

		var A_orgrule = ["QRCheckDate", "QRCheckMonth", "QRIntNumeric", "QRalnumRegex"];
		this.H_View.O_FormUtil.registerOriginalRules(A_orgrule);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_FormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_FormUtil.setDefaultWarningNote();
		}

		this.H_View.O_FormUtil.makeFormRule(rules);
	}

	setDefault(H_sess, H_order) {
		if (!H_sess.SELF.post) //postの値がないのでDBの値を使用するよ
			{
				var defaults = Array();

				for (var key in H_order) {
					var value = H_order[key];

					if (value.substatus != 230 && !is_null(value.receiptdate)) {
						var temp = value.receiptdate.split("-");
						defaults["receipt_date_" + value.detail_sort].Y = temp[0];
						defaults["receipt_date_" + value.detail_sort].m = temp[1];
						defaults["receipt_date_" + value.detail_sort].d = temp[2];
					}
				}

				this.H_View.O_FormUtil.setDefaultsWrapper(defaults);
			} else //postの値を使用するよ
			{
				this.H_View.O_FormUtil.setDefaultsWrapper(H_sess.SELF.post);
			}
	}

	checkParamError(H_sess, H_g_sess) //// 最低限必要なセッションが無ければエラー
	//		if( isset( $H_sess[self::PUB]["cym"] ) == false || isset( $H_sess[self::PUB]["current_postid"] ) == false || isset( $H_sess[self::PUB]["posttarget"] ) == false ){
	//			$this->errorOut( 8, "sessionが無い", false );
	//			exit();
	//		}
	{}

	getHeaderJS() {}

	makePankuzuLinkHash() {
		var H_link = {
			"/MTOrderList/menu.php": "\u3054\u6CE8\u6587\u30FB\u3054\u4F9D\u983C\u5C65\u6B74",
			"/MTOrderList/order_detail.php": "\u3054\u6CE8\u6587\u30FB\u3054\u4F9D\u983C\u8A73\u7D30",
			"": "\u53D7\u9818\u65E5\u5165\u529B"
		};
		return H_link;
	}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[], H_order: {} | any[]) //QuickFormとSmartyの合体
	//$this->get_Smarty()->assign( "postname", $H_order["order"]["postname"] );
	//$this->get_Smarty()->assign( "css", $this->H_View["css"] );
	//$this->get_Smarty()->assign( "cssTh", $this->H_View["css"] . "Th" );
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_Form.accept(O_renderer);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("H_order", H_order);
		this.get_Smarty().assign("css", "csOrderList");
		this.get_Smarty().assign("cssTh", "csOrderListTh");
		var smarty_template = "order_receipt.tpl";
		this.get_Smarty().display(smarty_template);
	}

	freezeForm() //ダブルクリック防止
	{
		var recnamestr = OrderReceiptFormView.RECNAME;
		var backnamestr = OrderReceiptFormView.BACKNAME;
		this.H_View.O_FormUtil.O_Form.addElement("submit", "submitRec", recnamestr, {
			id: "submitRec",
			value: recnamestr
		});
		this.H_View.O_FormUtil.O_Form.addElement("submit", "backName", backnamestr, {
			id: "backName",
			value: backnamestr
		});
		this.H_View.O_FormUtil.updateAttributesWrapper({
			onsubmit: "return stop_w_click();"
		});
		this.H_View.O_FormUtil.freezeWrapper();
	}

	unfreezeForm() //英語化権限
	{
		var nextnamestr = OrderReceiptFormView.NEXTNAME;
		var backnamestr = OrderReceiptFormView.RETURNNAME;
		this.H_View.O_FormUtil.O_Form.addElement("submit", "submitName", nextnamestr, {
			id: "submitName",
			value: nextnamestr
		});
		this.H_View.O_FormUtil.O_Form.addElement("button", "returnName", backnamestr, {
			id: "returnName",
			onClick: "javascript:location.href='/MTOrderList/order_detail.php';"
		});

		if (this.A_frz.length > 0) {
			this.H_View.O_FormUtil.O_Form.freeze(this.A_frz);
		}
	}

	endFormReceiptFormView() //セッションクリア
	//終了画面
	{
		this.O_Sess.clearSessionSelf();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u53D7\u9818\u65E5\u306E\u8A2D\u5B9A", "/MTOrderList/order_detail.php", "\u3054\u6CE8\u6587\u30FB\u3054\u4F9D\u983C\u8A73\u7D30\u306B\u623B\u308B", "", "JPN");
		throw die();
	}

	__destruct() {
		super.__destruct();
	}

};