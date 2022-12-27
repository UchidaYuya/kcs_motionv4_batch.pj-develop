//
//雛型変更View
//
//更新履歴：<br>
//2008/07/17 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/07/08
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//雛型変更View
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/07/17
//@uses MtSetting
//@uses MtSession
//

require("view/Order/TemplateAddView.php");

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
//パンくずリンク用配列を返す
//
//@author miyazawa
//@since 2008/05/13
//
//@access public
//@return array
//
//
//POSTをsessionにセットする<br>
//
//@author miyazawa
//@since 2008/06/09
//
//@access public
//@return none
//
//
//注文フォームのデフォルト値作成
//
//@author miyazawa
//@since 2008/04/11
//
//@param mixed $H_g_sess
//@param mixed $H_Dir
//@param mixed $O_form_model
//@param mixed $H_view
//@access protected
//@return mixed
//
//
//テンプレート取得（order_formとは異なり、DBが無関係なのでViewから取得する）
//
//@author miyazawa
//@since 2008/07/09
//
//@param mixed $H_sess
//@access public
//@return string
//
//
//makeFjpDefault
//
//@author igarashi
//@since 2011/06/07
//
//@access public
//@return void
//
//
//assignPlanList
//
//@author web
//@since 2013/03/29
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//setCaridAndCirid
//
//@author web
//@since 2014/03/03
//
//@param mixed $carid
//@param mixed $cirid
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
class TemplateModView extends TemplateAddView {
	getHeaderJS() {}

	makePankuzuLinkHash() {
		if (MT_SITE == "shop") {
			var H_link = {
				"/Shop/MTHLTemplate/templatemenu.php": "\u3054\u6CE8\u6587\u30FB\u3054\u4F9D\u983C\u96DB\u578B\u767B\u9332",
				"": "\u96DB\u578B\u5909\u66F4\uFF08" + this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname + "\uFF09"
			};
		} else //英語化権限 20090210miya
			{
				if (true == this.H_Dir.eng) {
					H_link = {
						"/MTTemplate/menu.php": "Order Template",
						"": "Template Change\uFF08" + this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname + "\uFF09"
					};
				} else {
					H_link = {
						"/MTTemplate/menu.php": "\u3054\u6CE8\u6587\u30FB\u3054\u4F9D\u983C\u96DB\u578B\u767B\u9332",
						"": "\u96DB\u578B\u5909\u66F4\uFF08" + this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname + "\uFF09"
					};
				}
			}

		return H_link;
	}

	checkCGIParam() //リセット
	//電話の件数は1を入れておく
	//チェックボックスはここでいったん消してPOSTから入れる（一度入れたwaribiki等でNG/必須エラーが出たとき、空にしてもセッションに残っていてエラーが消えないから） 20090507miya
	//確認画面からの戻りボタンの処理
	//ここで登録部署を設定
	{
		if (_GET.r != "") //商品情報消す
			//商品リセットフラグ
			//これを消しておかないと確認画面からの戻り後リセットしたときにmakeOrderDefaultを通らないので 20090508miya
			//同上 20090508miya
			{
				delete this.H_Dir.price_detailid;
				delete this.H_Local.prflg;
				delete this.H_Local.submitName;
				delete this.H_Local.backName;
				this.O_Sess.SetPub(TemplateModView.PUB, this.H_Dir);
				this.O_Sess.SetSelfAll(this.H_Local);
				header("Location: " + _SERVER.PHP_SELF);
				throw die();
			}

		if (_GET.pr != "") //商品情報消す
			{
				delete this.H_Dir.price_detailid;
				delete this.H_Dir.H_product;
				delete this.H_Dir.free_acce;
				delete this.H_Local.productname;
				delete this.H_Local.color;
				this.H_Local.prflg = 1;
				this.O_Sess.SetPub(TemplateModView.PUB, this.H_Dir);
				this.O_Sess.SetSelfAll(this.H_Local);
				header("Location: " + _SERVER.PHP_SELF);
				throw die();
			}

		if (_POST.tempid != "") {
			this.H_Dir.tempid = _POST.tempid;
		}

		var A_type_car_cir = Array();

		if (_POST.kind != "") {
			A_type_car_cir = split("-", _POST.kind);
		}

		if (true == (undefined !== A_type_car_cir[0]) && "" != A_type_car_cir[0]) {
			this.H_Dir.type = A_type_car_cir[0];
		}

		if (true == (undefined !== A_type_car_cir[1]) && true == is_numeric(A_type_car_cir[1])) {
			this.H_Dir.carid = A_type_car_cir[1];
		}

		if (true == (undefined !== A_type_car_cir[2]) && true == is_numeric(A_type_car_cir[2])) {
			this.H_Dir.cirid = A_type_car_cir[2];
		}

		if (true == (undefined !== A_type_car_cir[3])) {
			this.H_Dir.ppid = A_type_car_cir[3];
		}

		this.switchCarrier(_POST);

		if (undefined !== _POST.othercarid) {
			this.H_Local.othercarid = _POST.othercarid;
		}

		this.H_Dir.from_template = true;
		this.H_Dir.telcount = 1;
		delete this.H_Local.option;
		delete this.H_Local.waribiki;
		delete this.H_Local.vodalive;
		delete this.H_Local.vodayuryo;

		for (var key in _POST) //かご
		{
			var val = _POST[key];

			if (true == (-1 !== this.A_boxinput.indexOf(key))) {
				infcnt++;
			}

			this.H_Local[key] = val;
		}

		if (_POST.submitName != "") {
			delete this.H_Local.backName;
		} else if (_POST.backName) {
			delete this.H_Local.submitName;
		}

		if (this.H_Dir.type == "A") //電話から来たとき
			{
				if (this.H_Local.acceradio == "fromtel" && String(this.H_Local.telno != "")) //シリーズ・機種から来たとき
					{
						this.H_Local.boxopen = true;
					} else if (this.H_Local.acceradio == "fromproduct" && String(this.H_Local.series != "" || String(this.H_Local.telproduct != ""))) {
					this.H_Local.boxopen = true;
				}

				if (true == (undefined !== this.H_Local.free_productname) && 0 < this.H_Local.free_productname.length || true == (undefined !== this.H_Local.free_count) && 0 < this.H_Local.free_count.length || true == (undefined !== this.H_Local.free_property) && 0 < this.H_Local.free_property.length) //確認画面に行ったときは自由記入欄のパラメータを無視
					{
						if (false == (undefined !== this.H_Local.submitName) || "" == this.H_Local.submitName) {
							var H_free_acce = {
								free_productname: this.H_Local.free_productname,
								free_count: this.H_Local.free_count,
								free_property: this.H_Local.free_property
							};
						}

						delete _POST.free_productname;
						delete _POST.free_count;
						delete _POST.free_property;
						delete this.H_Local.free_productname;
						delete this.H_Local.free_count;
						delete this.H_Local.free_property;
					}

				if (undefined != this.H_Dir.free_acce && true == Array.isArray(this.H_Dir.free_acce)) {
					for (var frcnt = 0; frcnt < this.H_Dir.free_acce.length; frcnt++) {
						if (true == (undefined !== this.H_Local["free_acce" + frcnt]) && true == is_integer(+this.H_Local["free_acce" + frcnt])) {
							this.H_Dir.free_acce[frcnt].free_count = this.H_Local["free_acce" + frcnt];
						}
					}
				}
			} else {
			if (true == (-1 !== ["N", "Nmnp", "C", "S"].indexOf(this.H_Dir.type))) //POSTで飛んでくるhandopenとboxopenの二つのフラグでカゴとカゴ以降の表示・非表示を切り替えている
				//初期はhandopen==0、boxopen==0（「価格表」「直接入力」のボタンが二つ表示されているだけの状態）
				{
					if (false == Array.isArray(this.H_Local) || 1 > this.H_Local.length) //手入力ならhandopen==1、boxopen==0。price_detailidを消す
						{
							if (true == (undefined !== this.H_Dir.price_detailid)) {
								this.H_Local.handopen = 0;
								this.H_Local.boxopen = 1;
							} else {
								this.H_Local.handopen = 0;
								this.H_Local.boxopen = 0;
							}
						} else {
						if (+(this.H_Local.handopen == 1 && +(this.H_Local.boxopen == 0))) //unset($this->H_Local["color"]);
							//手入力フォームの「購入リストに入れる」を押したとき
							{
								delete this.H_Dir.price_detailid;
								delete this.H_Local.productid;
								delete this.H_Local.productname;
								this.H_Local.color = "\u9078\u629E\u306A\u3057";
								delete this.H_Local.buyselid;
								delete this.H_Local.buytype1;
								delete this.H_Local.buytype2;
								delete this.H_Local.downmoney;
								delete this.H_Local.onepay;
								delete this.H_Local.totalprice;
								delete this.H_Local.purchase;
								delete this.H_Local.pay_frequency;
							} else if (+(this.H_Local.handopen == 0 && +(this.H_Local.boxopen == 1))) //それ以外はhandopen==0、boxopen==1
							{
								delete this.H_Local.productid;
								delete this.H_Local.buyselid;
								delete this.H_Local.buytype1;
								delete this.H_Local.buytype2;
								delete this.H_Local.downmoney;
								delete this.H_Local.onepay;
								delete this.H_Local.totalprice;
							} else {
							this.H_Local.handopen = 0;
							this.H_Local.boxopen = 1;
						}
					}
				} else {
				this.H_Local.handopen = undefined;
				this.H_Local.boxopen = undefined;
			}
		}

		if (String(_POST.recogpostid != "")) {
			this.H_View.recogpostid = _POST.recogpostid;
			this.H_View.recogpostname = _POST.recogpostname;
		}

		if (this.H_View.recogpostid == "" || this.H_View.recogpostname == "") {
			this.H_View.recogpostid = this.H_G_sess.postid;
			this.H_View.recogpostname = this.H_G_sess.current_postname;
		}

		if (!!_POST.h_recogcode) {
			this.H_View.recogcode = _POST.h_recogcode;
			this.H_View.recogname = _POST.h_recogname;
			this.H_Local.recogcode = _POST.h_recogcode;
			this.H_Local.recogname = _POST.h_recogname;
		}

		if (!!_POST.h_pbpostcode_h) {
			this.H_View.pbpostcode_h = _POST.h_pbpostcode_h;

			if (!this.H_Local.pbpostcode_first) {
				this.H_Local.pbpostcode_first = _POST.h_pbpostcode_h;
			}
		}

		if (!!_POST.h_pbpostcode_f) {
			this.H_View.pbpostcode_f = _POST.h_pbpostcode_f;

			if (!this.H_Local.pbpostcode_second) {
				this.H_Local.pbpostcode_second = _POST.h_pbpostcode_f;
			}
		}

		if (!!_POST.h_pbpostcode) {
			this.H_View.pbpostcode = _POST.h_pbpostcode;
		}

		if (!!_POST.h_pbpostname) {
			this.H_View.pbpostname = _POST.h_pbpostname;

			if (!this.H_Local.pbpostname) {
				this.H_Local.pbpostname = _POST.h_pbpostname;
			}
		}

		if (!!_POST.h_cfbpostcode_h) {
			this.H_View.cfbpostcode_h = _POST.h_cfbpostcode_h;

			if (!this.H_Local.cfbpostcode_first) {
				this.H_Local.cfbpostcode_first = _POST.h_cfbpostcode_h;
			}
		}

		if (!!_POST.h_cfbpostcode_f) {
			this.H_View.cfbpostcode_f = _POST.h_cfbpostcode_f;

			if (!this.H_Local.cfbpostcode_second) {
				this.H_Local.cfbpostcode_second = _POST.h_cfbpostcode_f;
			}
		}

		if (!!_POST.h_cfbpostname) {
			this.H_View.cfbpostname = _POST.h_cfbpostname;

			if (!this.H_Local.cfbpostname) {
				this.H_Local.cfbpostname = _POST.h_cfbpostname;
			}
		}

		if (!!_POST.h_cfbpostcode) {
			this.H_View.cfbpostcode = _POST.h_cfbpostcode;

			if (!this.H_Local.cfbpostcode) {
				this.H_Local.cfbpostcode = _POST.h_cfbpostcode;
			}
		}

		if (this.A_boxinput.length == infcnt) {
			this.H_Local.openflg = true;
		} else {
			this.H_Local.openflg = false;
		}

		if (true == (undefined !== H_free_acce)) {
			this.H_Dir.free_acce.push(H_free_acce);
		}

		this.O_Sess.SetPub(TemplateModView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	makeOrderDefault(H_g_sess: {} | any[], H_sess: {} | any[], O_form_model: OrderFormModel, H_view) //デフォルト値配列
	//$H_sess["SELF"]を別変数にコピー
	//上書きしたくない余計なパラメータを抜く
	//まだ$H_selfに中身があったらデフォルトセット
	//20110104追加　houshiyama
	{
		var H_default = Array();
		var H_self = Array.from(H_sess.SELF);

		if (H_self.length > 0 && (H_self.handopen == "" || H_self.handopen != "" && H_self.handopen != 1)) //価格表を開くときに使われている変数
			{
				delete H_self.tempid;
				delete H_self.carid;
				delete H_self.cirid;
				delete H_self.type;
				delete H_self.ppid;
				delete H_self.productname;
				delete H_self.purchase;
				delete H_self.pay_frequency;
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

				delete H_self.kind;
				delete H_self.mask;
				delete H_self.openflg;
			} else //「直接入力で注文」ボタンが押されて手入力フォームが出たときはフォームの中をきれいにする（ここは役に立ってない？）
			{
				if (H_self.handopen != "" && H_self.handopen == 1) {
					delete H_self.color;
					delete H_self.productname;
					delete H_self.purchase;
					delete H_self.pay_frequency;
				}
			}

		if (H_self.length > 0) //価格表からの入力 下のelseの中だけでなくこっちにもないと価格表から商品を取り直したときに購入方式がデフォルトセットされない 20090327miya
			{
				H_default = H_self;

				if (true == (undefined !== H_sess[TemplateModView.PUB].price_detailid) && true == Array.isArray(H_sess[TemplateModView.PUB].H_product)) {
					var H_product = H_sess[TemplateModView.PUB].H_product;

					if ("" != H_product.tel.buyselid) {
						H_default.purchase = H_product.tel.buyselid;
					}

					if ("" != H_product.tel.paycnt) {
						H_default.pay_frequency = H_product.tel.paycnt;
					}
				}
			} else //雛型があったら整形
			{
				if (true == (undefined !== H_view.H_templatevalue) && 0 < H_view.H_templatevalue.length) {
					var H_adjusted_template = this.adjustTemplateValue(H_view.H_templatevalue, H_sess[TemplateModView.PUB].telcount);
					H_default = H_adjusted_template;
				}

				if (true == (undefined !== H_sess[TemplateModView.PUB].price_detailid) && true == Array.isArray(H_sess[TemplateModView.PUB].H_product)) {
					H_product = H_sess[TemplateModView.PUB].H_product;

					if ("" != H_product.tel.buyselid) {
						H_default.purchase = H_product.tel.buyselid;
					}

					if ("" != H_product.tel.paycnt) {
						H_default.pay_frequency = H_product.tel.paycnt;
					}
				}

				H_default = H_default + H_self;
			}

		if (false == (undefined !== H_default.datechange)) {
			H_default.datechange = {
				Y: date("Y"),
				m: date("m"),
				d: date("d"),
				H: date("H")
			};
		}

		return H_default;
	}

	getSmartyTemplate(H_info) {
		var template = "";

		switch (H_info.carid) {
			case this.O_Set.car_docomo:
				template = "docomo";
				break;

			case this.O_Set.car_au:
				template = "au";
				break;

			case this.O_Set.car_willcom:
				template = "willcom";
				break;

			case this.O_Set.car_softbank:
				template = "vodafone";
				break;

			case this.O_Set.car_emobile:
				template = "emobile";
				break;

			case this.O_Set.car_smartphone:
				template = "smartphone";
				break;

			default:
				if (is_numeric(H_info.carid)) {
					template = "other";
				} else {
					template = "";
				}

		}

		if (template != "") {
			return template + "_templatemod.tpl";
		}

		return false;
	}

	makeFjpDefault() {
		if (undefined !== this.H_View.recogcode) {
			H_default.h_recogcode = this.H_View.recogcode;
			H_default.recogcode = this.H_View.recogcode;
			H_default.recogname = this.H_View.recogname;
		}

		if (undefined !== this.H_View.pbpostcode_h) {
			H_default.h_pbpostcode_h = this.H_View.pbpostcode_h;
			H_default.pbpostcode_first = this.H_View.pbpostcode_h;
		}

		if (undefined !== this.H_View.pbpostcode_f) {
			H_default.h_pbpostcode_f = this.H_View.pbpostcode_f;
			H_default.pbpostcode_second = this.H_View.pbpostcode_f;
		}

		if (undefined !== this.H_View.pbpostname) {
			H_default.pbpostname = this.H_View.pbpostname;
		}

		if (undefined !== this.H_View.pbpostcode) {
			H_default.h_pbpostcode = this.H_View.pbpostcode;
		}

		if (undefined !== this.H_View.cfbpostcode_h) {
			H_default.h_cfbpostcode_h = this.H_View.cfbpostcode_h;
			H_default.cfbpostcode_first = this.H_View.cfbpostcode_h;
		}

		if (undefined !== this.H_View.cfbpostcode_f) {
			H_default.h_cfbpostcode_f = this.H_View.cfbpostcode_f;
			H_default.cfbpostcode_second = this.H_View.cfbpostcode_f;
		}

		if (undefined !== this.H_View.cfbpostcode) {
			H_default.h_cfbpostcode = this.H_View.cfbpostcode;
		}

		if (undefined !== this.H_View.cfbpostname) {
			H_default.cfbpostname = this.H_View.cfbpostname;
		}

		return H_default;
	}

	assignPlanList(H_sess, H_def, H_g_sess) {
		var model = new PlanModel(undefined, H_g_sess);
		this.get_Smarty().assign("jsplanlist", model.getPlanHashKeyisBuyselid(H_sess[TemplateModView.PUB].carid, H_sess[TemplateModView.PUB].cirid, H_sess[TemplateModView.PUB].cirid, this.gSess().language));
		var selectedPlan = undefined;

		if (undefined !== H_sess.SELF.plan && "" != H_sess.SELF.plan) {
			selectedPlan = H_sess.SELF.plan;
		} else if (undefined !== H_def.plan && "" != H_def.plan) {
			selectedPlan = H_def.plan;
		} else {
			selectedPlan = -1;
		}

		this.get_Smarty().assign("selectedPlan", selectedPlan);
	}

	setCaridAndCirid(carid, cirid) {
		this.H_Dir.carid = carid;
		this.H_Dir.cirid = cirid;
	}

	__destruct() {
		super.__destruct();
	}

};