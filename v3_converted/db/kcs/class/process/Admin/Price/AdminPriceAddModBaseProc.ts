//
//管理者：価格表登録修正Base
//
//更新履歴：<br>
//2008/08/05 上杉勝史 作成
//
//@package Price
//@subpackage Process
//@author katsushi
//@since 2008/08/05
//@filesource
//@uses ProcessBaseHtml
//@uses AdminPriceModel
//@uses AdminProductModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理者：価格表登録修正Base
//
//@package Price
//@subpackage Process
//@author katsushi
//@since 2008/08/05
//@uses ProcessBaseHtml
//

require("process/ProcessBaseHtml.php");

require("model/Admin/Price/AdminPriceModel.php");

require("model/Admin/Product/AdminProductModel.php");

//
//O_Sess
//
//@var mixed
//@access protected
//
//
//O_model
//
//@var mixed
//@access protected
//
//
//O_view
//
//@var mixed
//@access protected
//
//
//shopid
//
//@var mixed
//@access protected
//
//
//groupid
//
//@var mixed
//@access protected
//
//
//personname
//
//@var mixed
//@access protected
//
//
//pricelistid
//
//@var mixed
//@access protected
//
//
//コンストラクター
//
//@author ishizaki
//@since 2008/06/26
//
//@param array $H_param
//@access public
//@return void
//
//
//setView
//
//@author katsushi
//@since 2008/08/06
//
//@abstract
//@access protected
//@return void
//
//
//getView
//
//@author katsushi
//@since 2008/08/06
//
//@access protected
//@return void
//
//
//model取得
//
//@author ishizaki
//@since 2008/07/08
//
//@access protected
//@return void
//
//
//setStepParam
//
//@author katsushi
//@since 2008/08/07
//
//@param string $form_step
//@access protected
//@return void
//
//
//setModData
//
//@author katsushi
//@since 2008/08/12
//
//@access protected
//@return void
//
//
//execFormStep
//
//@author katsushi
//@since 2008/08/06
//
//@access protected
//@return void
//
//
//execSelectProductStep
//
//@author katsushi
//@since 2008/08/06
//
//@access protected
//@return void
//
//
//execPriceListStep
//
//@author katsushi
//@since 2008/08/09
//
//@param mixed $back
//@access protected
//@return void
//
//
//execFinishPriceList
//
//@author katsushi
//@since 2008/08/07
//
//@access protected
//@return void
//
//
//createDBData
//
//@author katsushi
//@since 2008/08/08
//
//@access protected
//@return void
//
//
//getSess
//
//@author katsushi
//@since 2008/08/05
//
//@access protected
//@return void
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/04/10
//
//@access public
//@return void
//
class AdminPriceAddModBaseProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_model = new AdminPriceModel();
		this.getSetting().loadConfig("price");
		this.pricelistid = undefined;
	}

	getView() {
		return this.O_view;
	}

	getModel() {
		return this.O_model;
	}

	setStepParam(form_step = "") {
		if (form_step == "input_pricelist") {
			this.getView().setSubmitName("\u78BA\u8A8D\u753B\u9762\u3078");
		} else if (form_step == "confirm_pricelist") {
			this.getView().setSubmitName("\u767B\u9332");
		} else {
			this.getView().setSubmitName("\u4FA1\u683C\u5165\u529B\u3078");
		}
	}

	setModData() //セッションにpatternがなかったらDBから値を取得する
	{
		this.pricelistid = this.getSess().getSelf("pricelistid");

		if (this.getSess().getSelf("pattern") === undefined) //$this->getSess()->setSelf("step", "confirm_pricelist");
			//価格表データの取得
			//包括用ロジック
			//ソート番号の振りなおしを行う
			//セッション復元
			{
				var H_pricelist = this.getModel().getPriceListSimple(this.pricelistid);

				if (H_pricelist.shopid != this.getSess().shopid) {
					this.getSess().setSelf("ex", 1);
				}

				var A_memo = this.getModel().getPriceMemoSimple(this.pricelistid);
				var sort = 10;

				for (var key in A_memo) {
					var value = A_memo[key];
					A_memo[key].sort = sort;
					sort += 10;
				}

				if (H_pricelist.length < 1 || A_memo.length < 1) //エラー
					{
						this.getOut().errorOut(39, "setModData:\u767B\u9332\u3059\u308B\u5546\u54C1\u304C\u3042\u308A\u307E\u305B\u3093", false, "menu.php");
					}

				this.getSess().setSelf("step", "input_pricelist");
				this.getView().setFormStep("input_pricelist");
				this.getSess().setSelf("pattern", H_pricelist.ppid);
				var H_postdata = Array();
				H_postdata.pricename = H_pricelist.pricename;
				H_postdata.listheader = H_pricelist.listheader;
				H_postdata.listfooter = H_pricelist.listfooter;
				H_postdata.sortcomment = H_pricelist.sortcomment;
				H_postdata.listcomment = H_pricelist.listcomment;

				if (H_pricelist.datefrom != "") {
					var dfY, dfm, dfd;
					[dfY, dfm, dfd] = H_pricelist.datefrom.split("-");
					H_postdata.datefrom = {
						Y: dfY,
						m: dfm,
						d: dfd
					};
				} else {
					H_postdata.datefrom = {
						Y: "",
						m: "",
						d: ""
					};
				}

				if (H_pricelist.dateto != "") {
					var dtY, dtm, dtd;
					[dtY, dtm, dtd] = H_pricelist.dateto.split("-");
					H_postdata.dateto = {
						Y: dtY,
						m: dtm,
						d: dtd
					};
				} else {
					H_postdata.dateto = {
						Y: "",
						m: "",
						d: ""
					};
				}

				if (H_pricelist.defaultflg == true) {
					H_postdata.defaultflg = {
						"1": "1"
					};
				}

				H_postdata.productid = Array();

				for (var i = 0; i < A_memo.length; i++) {
					H_postdata.productid[A_memo[i].productid] = "1";
					H_postdata["_" + A_memo[i].productid + "_sort"] = String(A_memo[i].sort);
					H_postdata["_" + A_memo[i].productid + "_memo"] = A_memo[i].memo;
				}

				var A_detail = this.getModel().getPriceDetailSimple(this.pricelistid);

				for (i = 0;; i < A_detail.length; i++) {
					H_postdata["_" + A_detail[i].productid + "_" + A_detail[i].buytype1 + "-" + A_detail[i].buytype2 + "_" + A_detail[i].buyselid + "_" + A_detail[i].paycnt] = A_detail[i].onepay;

					if (A_detail[i].paycnt > 1) {
						H_postdata["_" + A_detail[i].productid + "_" + A_detail[i].buytype1 + "-" + A_detail[i].buytype2 + "_" + A_detail[i].buyselid + "_downmoney"] = A_detail[i].downmoney;
					}
				}

				this.getSess().setSelf("postdata", H_postdata);
			}

		if (undefined != this.getSess().getSelf("ex")) {
			this.getView().setAssign("ex", 1);
		}
	}

	execFormStep() //フォームの順番を取得
	//フォーム画面別に処理を振り分ける
	{
		if (this.getSess().getSelf("pattern") === undefined || is_numeric(this.getSess().getSelf("pattern")) == false) {
			this.getOut().errorOut(15, "PPID\u304C\u3042\u308A\u307E\u305B\u3093", false, "menu.php");
		}

		this.getView().setPPName(this.getModel().getPPName(this.getSess().getSelf("pattern")));
		var form_step = this.getView().getFormStep();
		this.getView().setAssign("form_step", form_step);

		if (form_step == false || String(form_step === "select_product")) {
			this.setStepParam("select_product");
			this.execSelectProductStep();
		} else if (String(form_step === "input_pricelist")) {
			this.setStepParam("input_pricelist");
			this.execPriceListStep();
		} else if (String(form_step === "confirm_pricelist")) {
			this.setStepParam("confirm_pricelist");
			this.execPriceListStep(true);
		} else if (String(form_step === "finish_pricelist")) {
			this.setStepParam("finish_pricelist");
			this.execFinishPriceList();
		}
	}

	execSelectProductStep() //Smartyによる表示
	{
		var O_product = new AdminProductModel();
		var H_product = O_product.getProductListPPID(this.groupid, this.getSess().getSelf("pattern"));

		for (var key in H_product) {
			var val = H_product[key];
			H_product[key] = htmlspecialchars(val);
		}

		if (H_product.length < 1) {
			this.getOut().errorOut(39, "execSelectProductStep:\u5546\u54C1\u304C\u3042\u308A\u307E\u305B\u3093", false, "menu.php");
		}

		this.getView().makeFormSelectProductStep(H_product);
		this.getView().setDefaults();
		this.getView().assignForm();
		this.getView().displaySmarty();
	}

	execPriceListStep(back = false) //Smartyによる表示
	{
		this.getView().makeFormPriceListStep();

		if (back === true) {
			this.getView().makeFromBackButton();
		}

		this.getView().setDefaults();
		this.getView().assignForm();
		this.getView().setAssign("inputtpl", KCS_DIR + PRICE_DIR + "/" + this.getModel().getAdminPriceTemplate(this.getSess().getSelf("pattern")));
		this.getView().displaySmarty();
	}

	execFinishPriceList() {
		var H_pricelist, H_data;
		[H_pricelist, H_data] = this.createDBData();

		if (this.pricelistid != undefined && is_numeric(this.pricelistid) == true) {
			this.getModel().updatePriceListAll(this.pricelistid, H_pricelist, H_data);

			if (undefined === this.getView().gSess().admin_shopid) {
				var H_mnglog = {
					shopid: this.getView().gSess().shopid,
					groupid: this.getView().gSess().groupid,
					memid: this.getView().gSess().memid,
					name: this.getView().gSess().personname,
					postcode: this.getView().gSess().postcode,
					comment1: "ID:" + this.getView().gSess().memid,
					comment2: "Pricelistid" + this.pricelistid + "\u306E\u4FA1\u683C\u8868\u3092\u7DE8\u96C6",
					kind: "Price",
					type: "\u4FA1\u683C\u8868\u7DE8\u96C6",
					joker_flag: 0
				};
				this.getOut().writeShopMnglog(H_mnglog);
			} else {
				H_mnglog = {
					shopid: this.getView().gSess().admin_shopid,
					shopname: this.getView().gSess().admin_name,
					username: this.getView().gSess().admin_personname,
					kind: "Price",
					type: "\u4FA1\u683C\u8868\u7DE8\u96C6",
					comment: "pricelistid" + this.pricelistid + "\u306E\u4FA1\u683C\u8868\u3092\u7DE8\u96C6"
				};
				this.getOut().writeAdminMnglog(H_mnglog);
			}
		} else {
			this.getModel().insertPriceListAll(H_pricelist, H_data);

			if (undefined === this.getView().gSess().admin_shopid) {
				H_mnglog = {
					shopid: this.getView().gSess().shopid,
					groupid: this.getView().gSess().groupid,
					memid: this.getView().gSess().memid,
					name: this.getView().gSess().personname,
					postcode: this.getView().gSess().postcode,
					comment1: "ID:" + this.getView().gSess().memid,
					comment2: "\u4FA1\u683C\u8868\u306E\u65B0\u898F\u4F5C\u6210",
					kind: "Price",
					type: "\u4FA1\u683C\u8868\u767B\u9332",
					joker_flag: 0
				};
				this.getOut().writeShopMnglog(H_mnglog);
			} else {
				H_mnglog = {
					shopid: this.getView().gSess().admin_shopid,
					shopname: this.getView().gSess().admin_name,
					username: this.getView().gSess().admin_personname,
					kind: "Price",
					type: "\u4FA1\u683C\u8868\u767B\u9332",
					comment: "\u4FA1\u683C\u8868\u306E\u65B0\u898F\u4F5C\u6210"
				};
				this.getOut().writeAdminMnglog(H_mnglog);
			}
		}

		this.getView().clearSessSelf();
		this.getView().displayFinish();
	}

	createDBData() //pricelist_tb用の配列
	//コピーかどうか
	//productのリスト
	//pricelist_memo_tb,price_detail_tb用の配列生成、後でH_dataに正しく置き換える
	//ソートする
	//実際に更新するproductidだけに限定する
	//2個の配列を返すので取得するときは listで・・・
	{
		var H_postdata = this.getSess().getSelf("postdata");
		var H_pricelist = Array();
		H_pricelist.shopid = this.shopid;
		H_pricelist.carid = this.getModel().getCaridFromPPID(this.getSess().getSelf("pattern"));
		H_pricelist.ppid = this.getSess().getSelf("pattern");
		H_pricelist.mailstatus = H_postdata.mailstatus;

		if (undefined !== H_postdata.copy == true && H_postdata.copy["1"] === "1") //$pricename = $this->getModel()->getPriceListName($this->pricelistid);
			{
				var H_pl = this.getModel().getPriceListSimple(this.pricelistid);
				var pricename = H_pl.pricename;

				if (H_postdata.pricename == pricename) {
					H_postdata.pricename = pricename + " \u306E\u30B3\u30D4\u30FC";
				}

				this.pricelistid = undefined;
				H_pricelist.shopid = H_pl.shopid;
			}

		H_pricelist.pricename = H_postdata.pricename;
		H_pricelist.datefrom = date("Y-m-d H:i:s", mktime(0, 0, 0, H_postdata.datefrom.m, H_postdata.datefrom.d, H_postdata.datefrom.Y));

		if (undefined !== H_postdata.dateto == true && is_numeric(H_postdata.dateto.Y) == true && is_numeric(H_postdata.dateto.m) == true && is_numeric(H_postdata.dateto.d) == true) {
			H_pricelist.dateto = date("Y-m-d H:i:s", mktime(0, 0, 0, H_postdata.dateto.m, H_postdata.dateto.d, H_postdata.dateto.Y));
		} else {
			H_pricelist.dateto = undefined;
		}

		H_pricelist.listheader = H_postdata.listheader;
		H_pricelist.listfooter = H_postdata.listfooter;
		H_pricelist.sortcomment = undefined;
		if (undefined !== H_postdata.sortcomment && is_numeric(H_postdata.sortcomment)) H_pricelist.sortcomment = H_postdata.sortcomment;
		H_pricelist.listcomment = H_postdata.listcomment;
		H_pricelist.groupid = this.groupid;

		if (undefined !== H_postdata.defaultflg == true && H_postdata.defaultflg["1"] === "1") {
			H_pricelist.defaultflg = true;
			H_pricelist.dateto = undefined;
		} else {
			H_pricelist.defaultflg = false;
		}

		H_pricelist.author = this.personname;
		var H_product_list = H_postdata.productid;
		var H_tmpwork = Array();
		var downmoney = 0;

		for (var key in H_postdata) {
			var value = H_postdata[key];

			if (preg_match("/^_[0-9]+_/", key) == true) {
				var gomi, prid, type, buyselid, paycnt;
				[gomi, prid, type, buyselid, paycnt] = key.split("_");

				if (Array.isArray(H_tmpwork[prid]) == false) {
					H_tmpwork[prid] = Array();
				}

				if (String(type === "sort")) {
					H_tmpwork[prid].sort = value;

					if (prid in H_product_list == true) {
						H_product_list[prid] = +value;
					}
				} else if (String(type === "memo")) {
					H_tmpwork[prid].memo = value;
				} else {
					if (String(paycnt === "downmoney")) {
						downmoney = value;
					} else {
						if (paycnt == 1) {
							downmoney = 0;
						}

						[buytype1, buytype2] = type.split("-");
						H_tmpwork[prid].push({
							buytype1: buytype1,
							buytype2: buytype2,
							paycnt: paycnt,
							downmoney: downmoney,
							onepay: value,
							totalprice: downmoney + paycnt * value,
							buyselid: buyselid
						});
					}
				}
			}
		}

		asort(H_product_list);
		var H_data = Array();

		for (var prid in H_product_list) {
			var sort = H_product_list[prid];
			H_data[prid] = H_tmpwork[prid];
		}

		return [H_pricelist, H_data];
	}

	getSess() {
		return this.getView().gSess();
	}

	__destruct() {
		super.__destruct();
	}

};