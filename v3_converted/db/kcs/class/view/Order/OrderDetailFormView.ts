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

require("OrderFormView.php");

require("model/Order/OrderInputModelBase.php");

require("model/Order/OrderFormModel.php");

//
//submitボタン名
//
//
//submitボタン名（確認画面用）
//
//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//userid と chargerid が等しいとき true
//
//@var mixed
//@access public
//
//
//model
//
//@var mixed
//@access protected
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
//setModel
//
//@author ishizaki
//@since 2011/06/15
//
//@param OrderDetailFormModel $model
//@access public
//@return this
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
//セッションが無い時デフォルト値を入れる
//
//表示件数セッションが無ければ作る（デフォルトは10）<br>
//カレントページがセッションに無ければ作る<br>
//
//@author miyazawa
//@since 2008/09/03
//
//@access private
//@return void
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
//オーダー情報のうち必要なものをH_Dirに入れる
//
//@author miyazawa
//@since 2008/08/04
//
//@access public
//@return none
//
//
//_cancel
//
//@author ishizaki
//@since 2011/06/14
//
//@access private
//@return void
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
//スタティック表示 <br>
//
//@author miyazawa
//@since 2008/06/16
//
//@param mixed $H_g_sess
//@param mixed $H_order
//@access public
//@return void
//
//
//注文詳細フォームのデフォルト値作成
//
//@author miyazawa
//@since 2008/04/11
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $O_form_model
//@param mixed $H_view
//@param mixed $H_order
//@param mixed $H_ordersub	// 一括プラン変更用 20090130miya
//@access public
//@return mixed
//
//
//注文詳細フォーム電話情報のデフォルト値作成
//
//@author miyazawa
//@since 2008/09/02
//
//@param mixed $H_order
//@access public
//@return mixed
//
//
//注文ごとの履歴をユーザ側と販売店側に振り分ける
//
//@author miyazawa
//@since 2008/11/11
//
//@param array $H_hist_all
//
//@access public
//@return mixed
//
//
//getExtensionDisplay
//
//@author igarashi
//@since 2011/10/24
//
//@param mixed $H_order
//@access protected
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
//@param array $H_order
//@param array $H_hist_all
//@param array $H_g_sess
//
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
//cancelComplete
//
//@author ishizaki
//@since 2011/06/15
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
class OrderDetailFormView extends OrderFormView {
	static NEXTNAME = "\u78BA\u8A8D\u753B\u9762\u3078";
	static RECNAME = "\u6CE8\u6587\u3059\u308B";
	static CANCEL_SUBMIT = "\u6CE8\u6587\u306E\u30AD\u30E3\u30F3\u30BB\u30EB\u3092\u78BA\u5B9A\u3059\u308B";

	constructor() {
		super();
		this.userid_eq_chargerid = false;
	}

	makePankuzuLinkHash() //英語化権限 20090210miya
	{
		if (true == this.H_Dir.eng) {
			var H_link = {
				"/MTOrderList/menu.php": "Order History",
				"": "Detail"
			};
		} else {
			H_link = {
				"/MTOrderList/menu.php": "\u3054\u6CE8\u6587\u30FB\u3054\u4F9D\u983C\u5C65\u6B74",
				"": "\u3054\u6CE8\u6587\u30FB\u3054\u4F9D\u983C\u8A73\u7D30"
			};
		}

		return H_link;
	}

	setModel(model: OrderDetailFormModel) {
		this.model = model;
		return this;
	}

	getCSS() {
		return "csOrderList";
	}

	setDefaultSession() //表示件数がセッションに無ければ作る
	{
		if (undefined !== this.H_Dir.limit_d == false) //クッキーに表示件数があればそれを使う
			{
				if (undefined !== _COOKIE.order_limit_d == true) {
					this.H_Dir.limit_d = _COOKIE.order_limit_d;
				} else {
					this.H_Dir.limit_d = 10;
				}
			}

		if (undefined !== this.H_Dir.offset == false) {
			this.H_Dir.offset = 1;
		}

		this.O_Sess.SetPub(OrderDetailFormView.PUB, this.H_Dir);
	}

	checkCGIParam() {
		this.setDefaultSession();
		var sess = this.getLocalSession();

		if (true == (undefined !== _GET.o)) {
			this.H_Dir.orderid = _GET.o;
			this.O_Sess.SetPub(OrderDetailFormView.PUB, this.H_Dir);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		if (false == (undefined !== this.H_Dir.orderid)) {
			this.getOut().errorOut(0, "orderid\u304C\u3042\u308A\u307E\u305B\u3093", false);
		}

		if (undefined !== _GET.p == true) {
			this.H_Dir.offset = _GET.p;
		}

		if (undefined !== _POST.limit == true && true == is_numeric(_POST.limit)) {
			if (this.H_Dir.limit_d != _POST.limit) //ローカルセッションに入れて読み込み直し
				{
					this.H_Dir.limit_d = _POST.limit;
					this.H_Dir.offset = 1;
					delete _POST.limit_d;

					for (var gky in _POST) {
						var gvl = _POST[gky];
						this.H_Local[gky] = gvl;
					}

					this.O_Sess.SetPub(OrderDetailFormView.PUB, this.H_Dir);
					this.O_Sess.SetSelfAll(this.H_Local);
					header("Location: " + _SERVER.PHP_SELF);
					throw die();
				}
		}

		if (!(undefined !== this.H_Dir.offset) || !this.H_Dir.offset) {
			this.H_Dir.offset = 1;
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

		if (undefined !== _POST.comment && "" != _POST.comment) {
			this.H_Dir.comment = _POST.comment;
			this.H_Dir.conf = true;
			this.O_Sess.SetPub(OrderDetailFormView.PUB, this.H_Dir);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		this.H_Dir.carid = +this.H_Dir.carid;
		this.H_Dir.cirid = +this.H_Dir.cirid;
		this.H_Dir.orderid = +this.H_Dir.orderid;
		this.H_Local.applyprice = +this.H_Local.applyprice;
		this.H_Local.point = +this.H_Local.point;
		this.O_Sess.SetPub(OrderDetailFormView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);

		if (undefined !== _GET.r) {
			this._cancel();
		}

		var pub = this.O_Sess.GetPub(OrderDetailFormView.PUB);

		if (_POST.submit == OrderDetailFormView.CANCEL_SUBMIT) {
			this.H_Dir.cancel_submit = true;
			this.O_Sess.SetPub(OrderDetailFormView.PUB, this.H_Dir);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}
	}

	setOrderInfo(O_db0, H_g_sess, H_order) //PplやTcpをPやTに丸めている
	{
		this.H_Dir.type = this.cutOrderType(H_order.order.ordertype);
		this.H_Dir.carid = +H_order.order.carid;
		this.H_Dir.cirid = +H_order.order.cirid;
		this.H_Dir.telcount = +H_order.order.telcnt;
		this.H_Dir.applypostid = +H_order.order.applypostid;
		var O_oimb = new OrderInputModelBase(O_db0, H_g_sess, this.getSiteMode());
		var orderpatern = O_oimb.getOrderPatternName(this.H_Dir);
		this.H_Dir.carname = orderpatern.carname;
		this.H_Dir.ptnname = orderpatern.ptnname;
		this.H_Dir.shopid = orderpatern.shopid;
		this.H_Dir.memid = orderpatern.memid;
		this.H_Dir.ppid = O_oimb.getPpidFromOrderPtn(this.H_Dir.type, this.H_Dir.carid, this.H_Dir.cirid);
		this.O_Sess.SetPub(OrderDetailFormView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	_cancel() {
		delete this.H_Dir.conf;
		this.O_Sess.SetPub(OrderDetailFormView.PUB, this.H_Dir);
		var sess = this.getLocalSession();
		header("Location: " + _SERVER.PHP_SELF);
		throw die();
	}

	freezeForm() //ダブルクリック防止
	{
		this.H_View.O_OrderFormUtil.O_Form.addElement("submit", "submitName", OrderDetailFormView.RECNAME, {
			id: "submitName",
			value: OrderDetailFormView.RECNAME
		});
		this.H_View.O_OrderFormUtil.updateAttributesWrapper({
			onsubmit: "return stop_w_click();"
		});
		this.H_View.O_OrderFormUtil.freezeWrapper();

		if (this.H_Dir.conf === true) {
			if ("" != this.H_Dir.comment) {
				this.get_Smarty().assign("conf", true);
			} else {
				this._cancel();
			}
		}

		if (undefined !== this.H_Dir.comment && "" != this.H_Dir.comment) {
			this.get_Smarty().assign("comment", this.H_Dir.comment);
		}
	}

	unfreezeForm() //$this->H_View["O_OrderFormUtil"]->updateAttributesWrapper( array( "onsubmit" => "return activate_and_submit();" ) );	// カゴ入力項目活性化
	{
		this.H_View.O_OrderFormUtil.O_Form.addElement("submit", "submitName", OrderDetailFormView.NEXTNAME, {
			id: "submitName",
			value: OrderDetailFormView.NEXTNAME
		});

		if (this.A_frz.length > 0) {
			this.H_View.O_OrderFormUtil.O_Form.freeze(this.A_frz);
		}
	}

	makeFormStatic(H_g_sess: {} | any[], H_order: {} | any[], A_auth: {} | any[] = Array()) //ルート部署非表示権限がある会社で、注文部署がルート部署でなければ第二階層の部署を取得 20091009miya
	//applypostidだったのをrecogpostidに修正 20100727miya
	//スタティック表示部分
	{
		var O_Post = new PostModel();
		var ordpost = H_order.order.recogpostid;
		var rootpostid = O_Post.getRootPostid(H_g_sess.pactid);

		if (true == (-1 !== A_auth.indexOf("fnc_not_view_root"))) {
			rootpostid = O_Post.getTargetRootPostid(H_g_sess.pactid, ordpost, "post_relation_tb", 2);
			var compname = O_Post.getPostNameOne(rootpostid);
		} else {
			compname = H_order.order.compname;
		}

		this.H_View.O_OrderFormUtil.O_Form.addElement("header", "ptn", this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname);
		this.H_View.O_OrderFormUtil.O_Form.addElement("header", "comp", compname);
		this.H_View.O_OrderFormUtil.O_Form.addElement("header", "loginname", H_order.order.chargername);
		this.H_View.O_OrderFormUtil.O_Form.addElement("header", "orderid", H_order.order.orderid);
		this.H_View.O_OrderFormUtil.O_Form.addElement("header", "ansdate", H_order.order.ansdate);
		this.H_View.O_OrderFormUtil.O_Form.addElement("header", "recdate", H_order.order.recdate);
	}

	makeOrderDefault(H_g_sess: {} | any[], H_sess: {} | any[], O_form_model: OrderFormModel, H_view, H_order, H_ordersub = Array()) //デフォルト値配列
	//$H_sess["SELF"]を別変数にコピー
	//ここでPOSTデータから更新するかどうかのフラグを決定
	//一括プラン変更のページ遷移、表示件数も条件に追加（$H_self["p"]、$H_self["limit"]）
	//購入方式と割賦回数
	//価格表で選びなおした場合$H_sess[self::PUB]["H_product"]["tel"]に入ってくる
	//色のサニタイズ 20100715miya
	//色を変えていたら上書き
	//付属品にチェックつける
	//一括プラン変更の場合
	//時間(この値は、現状はAUでしか使われない・・)
	{
		var H_default = Array();
		var H_self = Array.from(H_sess.SELF);
		var self_flg = false;
		var A_self_acce = Array();

		if (H_self.submitName == "\u78BA\u8A8D\u753B\u9762\u3078" || H_self.submitName == "\u627F\u8A8D\u30FB\u56DE\u7B54" || H_self.submitName == "\u6CE8\u6587\u5185\u5BB9\u3092\u5909\u66F4\u3059\u308B" || true == (undefined !== H_self.p) && true == H_self.p > 0 || true == (undefined !== H_self.limit_d) && H_self.p < 1) //色もここでとっておく
			{
				self_flg = true;
				var color = H_self.color;

				for (var sky in H_self) {
					var svl = H_self[sky];

					if (true == preg_match("/^acce/", sky)) {
						var kyid = sky.replace(/^acce/g, "");

						if ("" != kyid && true == is_numeric(kyid)) {
							A_self_acce.push(kyid);
						}
					}
				}
			}

		if (H_self.length > 0 && (H_self.handopen == "" || H_self.handopen != "" && H_self.handopen != 1)) //unset($H_self["color"]);
			//unset($H_self["purchase"]);
			//unset($H_self["pay_frequency"]);
			//価格表を開くときに使われている変数
			{
				delete H_self.carid;
				delete H_self.cirid;
				delete H_self.type;
				delete H_self.ppid;
				delete H_self.productname;
				delete H_self.submitName;
				delete H_self.handopen;
				delete H_self.boxopen;
				delete H_self.open;

				if (H_self.applyprice == 0) {
					delete H_self.applyprice;
				}

				if (H_self.point == 0) {
					delete H_self.point;
				}
			} else //「直接入力で注文」ボタンが押されて手入力フォームが出たときはフォームの中をきれいにする（ここは役に立ってない？）
			{
				if (H_self.handopen != "" && H_self.handopen == 1) {
					delete H_self.color;
					delete H_self.productname;
					delete H_self.purchase;
					delete H_self.pay_frequency;
				}
			}

		if ("" == H_sess[OrderDetailFormView.PUB].H_product.tel.buyselid && "" != H_order.order.buyselid) {
			H_order.order.purchase = +H_order.order.buyselid;
		} else if ("" != H_sess[OrderDetailFormView.PUB].H_product.tel.buyselid) {
			H_order.order.purchase = +H_sess[OrderDetailFormView.PUB].H_product.tel.buyselid;
		}

		if ("" == H_sess[OrderDetailFormView.PUB].H_product.tel.paycnt && "" != H_order.sub[0].pay_frequency) {
			H_order.order.pay_frequency = +H_order.sub[0].pay_frequency;
		} else if ("" != H_sess[OrderDetailFormView.PUB].H_product.tel.paycnt) {
			H_order.order.pay_frequency = +H_sess[OrderDetailFormView.PUB].H_product.tel.paycnt;
		}

		if (true == H_order.order.terminal_del) {
			H_order.order.terminal_del = "do";
		} else if (false == H_order.order.terminal_del) {
			H_order.order.terminal_del = "dont";
		}

		H_order.order.color = H_order.sub[0].property;
		H_order.order.contractor = H_order.sub[0].contractor;
		H_order.order.userid = H_order.sub[0].userid;
		H_order.order.holdername = H_order.sub[0].holdername;
		H_order.order.plan = H_order.sub[0].plan;
		H_order.order.planradio = H_order.sub[0].planradio;
		H_order.order.packet = H_order.sub[0].packet;
		H_order.order.packetradio = H_order.sub[0].packetradio;
		H_order.order.option = unserialize(H_order.sub[0].option);
		H_order.order.waribiki = unserialize(H_order.sub[0].waribiki);
		H_order.order.discounttel = unserialize(H_order.sub[0].discounttel);
		H_order.order.passwd = H_order.sub[0].passwd;
		H_order.order.memory = H_order.sub[0].memory;
		H_order.order.recovery = H_order.sub[0].recovery;
		H_order.order.color = stripslashes(H_order.order.color);

		if (true == self_flg && "" != color) {
			H_order.order.color = color;
		}

		if (this.H_Dir.carid == 4) {
			H_order.order.vodalive = Array();
			H_order.order.vodayuryo = Array();

			if (true == Array.isArray(H_order.order.option)) {
				{
					let _tmp_0 = H_order.order.option;

					for (var key in _tmp_0) {
						var value = _tmp_0[key];

						if (-1 !== this.O_Set.A_voda_live_op.indexOf(key) == true) {
							H_order.order.vodalive[key] = value;
							delete H_order.order.option[key];
						} else if (-1 !== this.O_Set.A_voda_yuryo_op.indexOf(key) == true) {
							H_order.order.vodayuryo[key] = value;
							delete H_order.order.option[key];
						}
					}
				}
			}
		}

		var A_discounttel = unserialize(H_order.sub[0].discounttel);

		for (var recCnt = 0; recCnt < A_discounttel.length; recCnt++) {
			H_order.order["discounttel" + (recCnt + 1)] = A_discounttel[recCnt];
		}

		if (true == (undefined !== H_sess[OrderDetailFormView.PUB].H_product.acce)) //付属品のproductidと数量の対応表を作る
			{
				var H_acce_number = Array();
				{
					let _tmp_1 = H_order.sub;

					for (var skey in _tmp_1) {
						var sval = _tmp_1[skey];

						if (true == (undefined !== sval.productid) && true == (undefined !== sval.number) && false == sval.machineflg) {
							H_acce_number[sval.productid] = sval.number;
						} else if (true == (undefined !== sval.productname) && true == (undefined !== sval.number) && false == sval.machineflg) {
							H_acce_number[sval.productname] = sval.number;
						}
					}
				}
				{
					let _tmp_2 = H_sess[OrderDetailFormView.PUB].H_product.acce;

					for (var key in _tmp_2) {
						var val = _tmp_2[key];

						if ("A" == H_sess[OrderDetailFormView.PUB].type) {
							if (true == is_numeric(val.productid)) //付属品の注文のときは数を入れなければならない
								{
									H_order.order["acce" + val.productid] = H_acce_number[val.productid];
								} else //付属品の注文のときは数を入れなければならない
								{
									H_order.order["acce" + val.productname] = H_acce_number[val.productname];
								}
						} else {
							if (true == is_numeric(val.productid)) {
								if (self_flg == false && 0 < H_acce_number[val.productid] || self_flg == true && true == (-1 !== A_self_acce.indexOf(val.productid))) {
									H_order.order["acce" + val.productid] = 1;
								}
							} else {
								if (0 < H_acce_number[val.productname]) //手入力のときはproductidではなくproductname
									{
										H_order.order["acce" + val.productname] = 1;
									}
							}
						}
					}
				}
			}

		H_order.order.telno = H_order.sub[0].telno_view;
		H_order.order.number = H_order.order.telcnt;
		H_order.order.telusername = H_order.sub[0].telusername;
		H_order.order.employeecode = H_order.sub[0].employeecode;
		H_order.order.ciridradio = H_order.order.cirid;
		H_order.order.chargermail = H_order.order.chargermail;

		if ("B" == H_order.order.ordertype) //limit, offset適用前の配列から地域会社デフォルト値を作成 20090130miya
			{
				var bulkCnt = H_ordersub.length;

				for (var counter = 0; counter < bulkCnt; counter++) {
					H_bulk[counter] = {
						cirname: H_ordersub[counter].cirname,
						telno_view: H_ordersub[counter].telno_view,
						telno: H_ordersub[counter].telno,
						postname: H_ordersub[counter].postname,
						bef_planname: H_ordersub[counter].bef_planname,
						planname: H_ordersub[counter].planname,
						bef_packetname: H_ordersub[counter].bef_packetname,
						packetname: H_ordersub[counter].packetname,
						substatus: H_ordersub[counter].substatus
					};
				}

				for (var subval of Object.values(H_order.sub)) //一括プラン変更の地域会社（画面上では"arid09012345678"という形式のPOSTデータ） 20090128miya
				//POSTデータ上書きのため取っておく
				{
					var arid_det = "arid" + subval.telno;
					H_order.order[arid_det] = subval.arid_det;
					A_arid_det.push(arid_det);
				}

				H_order.order.bulkplan.data = H_bulk;
				H_order.order.bulkplan.cnt = H_order.bulkcnt;
			}

		var A_tom = this.makeTomorrow();

		if (H_order.order.datechange != "") {
			var hour = H_order.order.datechange.substr(11, 2);
			H_order.order.datechangeH = hour;
		}

		if (H_order.order.datefrom == "") {
			H_order.order.datefrom = {
				Y: A_tom[0],
				m: A_tom[1],
				d: A_tom[2],
				H: 12
			};
		}

		if (H_order.order.dateto == "") {
			H_order.order.dateto = {
				Y: A_tom[0],
				m: A_tom[1],
				d: A_tom[2],
				H: 12
			};
		}

		if (H_order.order.datechange == "") {
			H_order.order.datechange = {
				Y: A_tom[0],
				m: A_tom[1],
				d: A_tom[2],
				H: 12
			};
		}

		H_default = H_order.order + H_sess[OrderDetailFormView.PUB];

		if ("M" == H_order.order.ordertype) {
			if (undefined !== H_order.sub[0].productname) {
				H_default.productname = H_order.sub[0].productname;
			}
		}

		if (true == self_flg) //一括プラン変更の場合 20090128miya
			{
				H_default.applyprice = H_self.applyprice;
				H_default.userid = H_self.userid;
				H_default.contractor = H_self.contractor;
				H_default.planradio = H_self.planradio;
				H_default.packetradio = H_self.packetradio;
				H_default.plan = H_self.plan;
				H_default.packet = H_self.packet;
				H_default.passwd = H_self.passwd;
				H_default.dateradio = H_self.dateradio;
				H_default.datechangeradio = H_self.datechangeradio;
				H_default.option = H_self.option;
				H_default.waribiki = H_self.waribiki;
				H_default.vodalive = H_self.vodalive;
				H_default.vodayuryo = H_self.vodayuryo;
				H_default.pointradio = H_self.pointradio;
				H_default.point = H_self.point;
				H_default.billradio = H_self.billradio;
				H_default.parent = H_self.parent;
				H_default.billaddress = H_self.billaddress;
				H_default.recovery = H_self.recovery;
				H_default.memory = H_self.memory;
				H_default.terminal_del = H_self.terminal_del;
				H_default.fee = H_self.fee;
				H_default.discounttel1 = H_self.discounttel1;
				H_default.discounttel2 = H_self.discounttel2;
				H_default.discounttel3 = H_self.discounttel3;
				H_default.discounttel4 = H_self.discounttel4;
				H_default.discounttel5 = H_self.discounttel5;
				H_default.misctype = H_self.misctype;
				H_default.number = H_self.number;
				H_default.service = H_self.service;
				H_default.transfer = H_self.transfer;
				H_default.sendhow = H_self.sendhow;
				H_default.sendname = H_self.sendname;
				H_default.sendpost = H_self.sendpost;
				H_default.zip1 = H_self.zip1;
				H_default.zip2 = H_self.zip2;
				H_default.addr1 = H_self.addr1;
				H_default.addr2 = H_self.addr2;
				H_default.building = H_self.building;
				H_default.sendtel = H_self.sendtel;
				H_default.datefrom = H_self.datefrom;
				H_default.dateto = H_self.dateto;
				H_default.datechange = H_self.datechange;
				H_default.note = H_self.note;
				H_default.reason = H_self.reason;
				H_default.webreliefservice = H_self.webreliefservice;
				H_default.datechangeH = H_self.datechangeH;

				if ("B" == H_order.order.ordertype) {
					if (true == Array.isArray(A_arid_det)) {
						for (var arid of Object.values(A_arid_det)) {
							H_default[arid] = H_self[arid];
						}
					}
				}
			}

		return H_default;
	}

	makeTelInfoFromOrderData(H_order: {} | any[]) //デフォルト値配列
	//データ作成
	//デフォルト値を返す
	{
		var H_telinfo = Array();
		{
			let _tmp_3 = H_order.sub;

			for (var key in _tmp_3) {
				var val = _tmp_3[key];

				if (true == val.machineflg) //違約金表示のため追加 20100114miya
					//違約金表示のため追加 20100114miya
					{
						H_row.telno = val.telno;

						if ("" != val.telno_view) {
							H_row.telno_view = val.telno_view;
						} else {
							H_row.telno_view = val.telno;
						}

						H_row.postid = H_order.order.recogpostid;
						H_row.arid = val.arid;
						H_row.carid = H_order.order.carid;
						H_row.cirid = H_order.order.cirid;
						H_row.userid = val.userid;
						H_row.username = val.holdername;
						H_row.telusername = val.telusername;
						H_row.simcardno = val.teldetail_simcardno;
						H_row.employeecode = val.employeecode;
						H_row.mail = val.mail;
						H_row.text1 = val.text1;
						H_row.text2 = val.text2;
						H_row.text3 = val.text3;
						H_row.text4 = val.text4;
						H_row.text5 = val.text5;
						H_row.text6 = val.text6;
						H_row.text7 = val.text7;
						H_row.text8 = val.text8;
						H_row.text9 = val.text9;
						H_row.text10 = val.text10;
						H_row.text11 = val.text11;
						H_row.text12 = val.text12;
						H_row.text13 = val.text13;
						H_row.text14 = val.text14;
						H_row.text15 = val.text15;
						H_row.int1 = val.int1;
						H_row.int2 = val.int2;
						H_row.int3 = val.int3;
						H_row.int4 = val.int4;
						H_row.int5 = val.int5;
						H_row.int6 = val.int6;
						H_row.date1 = val.date1;
						H_row.date2 = val.date2;
						H_row.date3 = val.date3;
						H_row.date4 = val.date4;
						H_row.date5 = val.date5;
						H_row.date6 = val.date6;
						H_row.mail1 = val.mail1;
						H_row.mail2 = val.mail2;
						H_row.mail3 = val.mail3;
						H_row.url1 = val.url1;
						H_row.url2 = val.url2;
						H_row.url3 = val.url3;
						H_row.select1 = val.select1;
						H_row.select2 = val.select2;
						H_row.select3 = val.select3;
						H_row.select4 = val.select4;
						H_row.select5 = val.select5;
						H_row.select6 = val.select6;
						H_row.select7 = val.select7;
						H_row.select8 = val.select8;
						H_row.select9 = val.select9;
						H_row.select10 = val.select10;
						H_row.memo = val.memo;
						H_row.kousiradio = val.kousiradio;
						H_row.kousi = val.kousiid;
						H_row.formercarid = val.formercarid;
						H_row.mnpno = val.mnpno;
						H_row.mnp_enable_date = val.mnp_enable_date;
						H_row.buyselid = H_order.order.buyselid;
						H_row.orderdate = val.orderdate;
						H_row.extensionno = val.extensionno;
						H_row.telorderdate = val.telorderdate;
						H_telinfo[val.detail_sort] = H_row;
					}
			}
		}
		return H_telinfo;
	}

	historyDivide(H_hist_all = Array()) //ユーザと販売店を振り分ける
	{
		var H_hist = Array();
		var hist_cnt = 0;
		var H_hist_shop = Array();
		var hist_shop_cnt = 0;

		if (true == 0 < H_hist_all.length) {
			for (var i = 0; i < H_hist_all.length; i++) //answercommentはなしでも承認できるので条件から外した
			//if($H_hist_all[$i]["chpostid"] != "" && $H_hist_all[$i]["answercomment"] != ""){
			{
				if (H_hist_all[i].chpostid != "") {
					H_hist.push(H_hist_all[i]);
					hist_cnt++;
				} else if (H_hist_all[i].shopid != "" && H_hist_all[i].shopcomment != "") {
					H_hist_shop.push(H_hist_all[i]);
					hist_shop_cnt++;
				}
			}
		}

		H_hist_divided.H_hist = H_hist;
		H_hist_divided.hist_cnt = hist_cnt;
		H_hist_divided.H_hist_shop = H_hist_shop;
		H_hist_divided.hist_shop_cnt = hist_shop_cnt;
		return H_hist_divided;
	}

	getExtensionDisplay(H_order) {
		if (OrderDetailFormView.SITE_SHOP == this.getSiteMode()) {
			var O_Auth = MtAuthority.singleton(H_order.order.pactid);
		} else {
			O_Auth = this.getAuth();
		}

		if (O_Auth.chkPactFuncId(OrderDetailFormView.FUNC_EXTENSION)) {
			if (-1 !== ["M", "A", "Tcp", "Tpc"].indexOf(H_order.order.ordertype)) {
				this.get_Smarty().assign("extensionno", H_order.sub[0].extensionno);
			}

			this.get_Smarty().assign("displayExtension", true);
		} else {
			this.get_Smarty().assign("displayExtension", false);
		}
	}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[], H_order: {} | any[], H_hist_all: {} | any[] = Array(), H_g_sess) //$H_g_sess追加 20100331miya
	//個人別請求権限
	//公私分計権限
	//資産管理権限 20090317miya
	//販売店の受注内容変更では表示する 20090324miya
	//履歴分割
	//assign
	//暫定
	//暫定
	//資産管理権限 20090317miya
	//MotionとHotlineの表示分けのため 20100331miya
	//合計の税込み対応
	{
		if (undefined !== H_sess[OrderDetailFormView.PUB].cancel_submit && true == H_sess[OrderDetailFormView.PUB].cancel_submit) {
			this.cancelComplete(H_order);
			return;
		}

		if (true == (-1 !== ["P", "Ppl", "Pdc", "Pop"].indexOf(H_sess[OrderDetailFormView.PUB].type))) {
			var O_buysel = new BuySelectModel();

			if ("" != H_sess[OrderDetailFormView.PUB].buyselid) {
				if (true == this.H_Dir.eng) {
					this.get_Smarty().assign("buyselname", O_buysel.getBuySelectNameEng(H_sess[OrderDetailFormView.PUB].buyselid));
				} else {
					this.get_Smarty().assign("buyselname", O_buysel.getBuySelectName(H_sess[OrderDetailFormView.PUB].buyselid));
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

		if (this.userid_eq_chargerid) {
			this.get_Smarty().assign("fjp_cancel_form", "true");
		}

		this.H_View.js = "\n<script language=\"JavaScript\" type=\"text/javascript\">\n<!--\nfunction checkParam(f) {\n\tif ( \"\" == f.comment.value) {\n\t\talert(\"\u30B3\u30E1\u30F3\u30C8\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\");\n\t\treturn false;\n\t}\n\treturn true;\n}\n// -->\n</script>\n";
		this.getExtensionDisplay(H_order);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("status", H_order.order.status);
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
		this.get_Smarty().assign("telcount", H_sess[OrderDetailFormView.PUB].telcount);

		if ("M" == H_sess[OrderDetailFormView.PUB].telcount) {
			this.get_Smarty().assign("telcount", 1);
		}

		var detailCnt = 0;

		for (var sub of Object.values(H_order.sub)) {
			if (sub.machineflg) {
				detailCnt++;
			}
		}

		this.get_Smarty().assign("detailcnt", detailCnt);
		this.get_Smarty().assign("telpropertyjsflg", 1);
		this.get_Smarty().assign("smartphone", true);
		this.get_Smarty().assign("type", H_sess[OrderDetailFormView.PUB].type);
		this.get_Smarty().assign("H_tax", H_order.tax);
		this.get_Smarty().assign("disptype", this.H_View.smarty_template);
		this.get_Smarty().assign("dispmainonly", true);
		this.get_Smarty().assign("useCharge", useCharge);
		this.get_Smarty().assign("kousiFlg", kousiFlg);
		this.get_Smarty().assign("assetsFlg", assetsFlg);
		this.get_Smarty().assign("point_flg", this.checkPointUseType(H_sess[OrderDetailFormView.PUB]));
		this.get_Smarty().assign("H_hist", H_hist_divided.H_hist);
		this.get_Smarty().assign("hist_cnt", H_hist_divided.hist_cnt);
		this.get_Smarty().assign("H_hist_shop", H_hist_divided.H_hist_shop);
		this.get_Smarty().assign("hist_shop_cnt", H_hist_divided.hist_shop_cnt);
		this.get_Smarty().assign("telpenalty", this.H_View.telpenalty);
		this.get_Smarty().assign("bulkplan", this.H_View.bulkplan);
		this.get_Smarty().assign("mnpalert", this.H_View.mnpalert);
		this.get_Smarty().assign("limit", H_sess[OrderDetailFormView.PUB].limit_d);
		this.get_Smarty().assign("page_link", this.H_View.page_link);
		this.get_Smarty().assign("telusername", H_sess["/MTOrder"].telinfo[0].telusername);
		this.get_Smarty().assign("employeecode", H_sess["/MTOrder"].telinfo[0].employeecode);
		this.get_Smarty().assign("slipno", H_order.order.slipno);
		this.get_Smarty().assign("message", H_order.order.message);
		this.get_Smarty().assign("pacttype", H_g_sess.pacttype);
		this.get_Smarty().assign("carid", H_order.order.carid);
		this.get_Smarty().assign("userid", H_g_sess.userid);
		this.get_Smarty().assign("pagetype", "history");
		this.get_Smarty().assign("extension", this.O_fjp.getSelectExtension(H_sess[OrderDetailFormView.PUB].type));

		if (this.O_fjp.checkAuth("co")) {
			this.get_Smarty().assign("fjpco", true);
			this.get_Smarty().assign("notedit", true);
			this.get_Smarty().assign("fjpname", this.O_fjp.reverseExtensionCode(H_order.order));
		}

		this.get_Smarty().assign("A_auth", A_auth);

		if (-1 !== this.O_Set.A_carrior_list.indexOf(H_order.order.carid)) //ポイント税込み対応の機能をアップした 2013-09-20 を起点とする
			//2013-09-20 23:59:59 = 1379689199;
			{
				var recdatetime = strtotime(H_order.order.recdate);

				if (recdatetime > 1379689199) {
					this.get_Smarty().assign("in_tax", true);
				}
			}

		if (-1 !== A_auth.indexOf("fnc_receipt") == true) {
			this.get_Smarty().assign("receipt", true);
		}

		if (undefined !== this.H_View.orderListDetailShippingMask) {
			this.get_Smarty().assign("orderListDetailShippingMask", this.H_View.orderListDetailShippingMask);
		}

		if (undefined !== this.H_View.deleteOrderDisplayTelDetaile) {
			this.get_Smarty().assign("deleteOrderDisplayTelDetaile", this.H_View.deleteOrderDisplayTelDetaile);
		}

		var smarty_template = "order_detail.tpl";
		this.get_Smarty().display(smarty_template);
	}

	clearUnderSession() {
		this.clearLastForm();
		var A_exc = [OrderDetailFormView.PUB];
		this.O_Sess.clearSessionListPub(A_exc);
	}

	cancelComplete(H_order) //ステータスの更新
	//echo($this->model->makeUpdateOrderStatusSQL($this->getGlobalSession(), $localSession, $recog, array(), array()));
	//echo($this->model->makeInsertOrderhistorySQL($this->getGlobalSession(), $localSession, $recog));
	{
		this.checkLastForm();
		this.writeLastForm();
		var localSession = this.getLocalSession();
		localSession.SELF.answer = "30";
		localSession.SELF.answercomment = localSession[OrderDetailFormView.PUB].comment;
		var recog = Array();
		var upd_sql = this.model.makeUpdateOrderStatusSQL(this.getGlobalSession(), localSession, recog, Array(), Array());
		upd_sql += this.model.releaseExtensionNo(H_order);
		this.model.execUpdateOrderStatus(upd_sql, this.model.makeInsertOrderhistorySQL(this.getGlobalSession(), localSession, recog));
		delete this.H_Dir.conf;
		delete this.H_Dir.comment;
		delete this.H_Dir.cancel_submit;
		this.O_Sess.SetPub(OrderDetailFormView.PUB, this.H_Dir);
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u6CE8\u6587\u306E\u30AD\u30E3\u30F3\u30BB\u30EB", "/MTOrderList/order_detail.php", "\u6CE8\u6587\u8A73\u7D30\u753B\u9762\u3078", "", "JPN");
		this.clearLastForm();
	}

	endOrderFormView(orderid) //英語化権限 20090210miya
	//セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		if (true == this.H_Dir.eng) {
			var backbtn0 = "Back to Order History Menu";
			var fintxt0_1 = "Order No.";
			var fintxt0_2 = " <BR>Order";
			var language = "ENG";
		} else {
			backbtn0 = "\u6CE8\u6587\u5C65\u6B74\u30E1\u30CB\u30E5\u30FC\u3078";
			fintxt0_1 = "\u6CE8\u6587\u756A\u53F7 ";
			fintxt0_2 = " <BR>\u6CE8\u6587";
			language = "JPN";
		}

		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish(fintxt0_1 + str_pad(orderid, 10, "0", STR_PAD_LEFT) + fintxt0_2, "/MTOrderList/menu.php", backbtn0, "", language);
	}

	__destruct() {
		super.__destruct();
	}

};