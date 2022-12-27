//
//ショップ：価格表一覧
//
//更新履歴：<br>
//2008/08/05 石崎公久 作成
//
//@uses ProcessBaseHtml
//@uses PactModel
//@uses PostModel
//@uses FuncModel
//@uses ShopModel
//@package Price
//@filesource
//@subpackage process
//@author ishizaki <ishizaki@motion.co.jp>
//@since 2008/08/05
//
//
//
//ショップ：価格表登録
//
//@uses ProcessBaseHtml
//@uses PactModel
//@uses PostModel
//@uses FuncModel
//@package Price
//@subpackage process
//@author ishizaki <ishizaki@motion.co.jp>
//@since 2008/08/05
//

require("MtSession.php");

require("process/ProcessBaseHtml.php");

require("model/Shop/Price/ShopPriceModel.php");

require("view/Shop/Price/ShopPriceListView.php");

require("model/ShopModel.php");

require("model/Order/ShopOrderMenuModel.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_param
//@access protected
//@return void
//
class ShopPriceListProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_Sess = MtSession.singleton();
		this.O_Shop = new ShopModel();
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//model の生成
	//価格表削除
	//販売店の価格表と管理者の価格表
	//$AH_pricelist = $this->O_model->getShopPriceList("hash", $this->O_view->gSess()->shopid, $this->O_view->gSess()->groupid);
	//$AH_pricelist = $this->O_model->getShopPriceList("hash", $A_shopid, $this->O_view->gSess()->groupid);
	//デフォルトではない価格表の一覧
	//$A_search_pact = $this->O_model->getShopPriceList("col", $this->O_view->gSess()->shopid, $this->O_view->gSess()->groupid, " pricelist_tb.defaultflg = false AND ");
	//$A_search_pact = $this->O_model->getShopPriceList("col", $A_shopid, $this->O_view->gSess()->groupid, " pricelist_tb.defaultflg = false AND ");
	//そのIDをソートするハッシュ
	//その販売店のデフォルト価格表で、最新のものを表示
	//$H_ppid_name = $this->O_model->getNewestDefaultPricelist($this->O_view->gSess()->groupid, $this->O_view->gSess()->shopid);
	//Smartyによる表示
	{
		this.O_view = new ShopPriceListView({
			"": "\u4FA1\u683C\u8868\u4E00\u89A7"
		});
		this.getSetting().loadConfig("price");
		this.O_view.startCheck();
		this.O_model = new ShopPriceModel();
		this.O_view.setAssign("H_opt", this.O_model.getPricePatternAssoc());
		var pricelistid = this.O_Sess.getSelf("pricelistid");
		var delflag = this.O_Sess.getSelf("delflag");

		if (false == is_null(pricelistid) && false == is_null(delflag)) {
			if (true == ShopOrderMenuModel.checkUnifyShop(this.O_view.gSess().shopid)) {
				var shopidlist = Object.keys(ShopOrderMenuModel.getChildShopID(this.O_view.gSess().shopid, this.O_view.gSess().personname, true));
			} else {
				shopidlist = Array();
			}

			if (this.O_model.getShopIDFromPricelistID(pricelistid) === this.O_view.gSess().shopid || shopidlist.length > 1 && true == (-1 !== shopidlist.indexOf(this.O_model.getShopIDFromPricelistID(pricelistid)))) //削除フラグ更新
				{
					this.O_model.changePricelistDelflag(pricelistid, delflag);
					var H_mnglog = {
						shopid: this.O_view.gSess().shopid,
						groupid: this.O_view.gSess().groupid,
						memid: this.O_view.gSess().memid,
						name: this.O_view.gSess().personname,
						postcode: this.O_view.gSess().postcode,
						comment1: "ID:" + this.O_view.gSess().memid,
						comment2: "Pricelistid" + pricelistid + "\u306E\u4FA1\u683C\u8868\u3092\u524A\u9664",
						kind: "Price",
						type: "\u4FA1\u683C\u8868\u524A\u9664",
						joker_flag: 0
					};
					this.getOut().writeShopMnglog(H_mnglog);
				}

			this.O_Sess.setSelf("pricelistid", undefined);
			this.O_Sess.setSelf("delflag", undefined);
		}

		var search_shopid = this.O_view.gSess().shopid;

		if (undefined !== this.O_view.gSess().getSelf("shopid") && "" != this.O_view.gSess().getSelf("shopid")) {
			search_shopid = this.O_view.gSess().getSelf("shopid");
		}

		this.O_view.gSess().setPub("/pricelist_shop", search_shopid);
		var A_shopid = Array();
		var A_tmp = this.O_Shop.getIncludeShop(this.O_view.gSess().shopid);
		A_shopid.push(this.O_view.gSess().shopid);
		A_shopid = array_merge(A_shopid, A_tmp);
		var AH_pricelist = this.O_model.getShopPriceList("hash", search_shopid, this.O_view.gSess().groupid);
		var count_pricelist = AH_pricelist.length;

		if (1 > count_pricelist) {
			this.O_view.setAssign("price_str", "\u4FA1\u683C\u8868\u304C\u4E00\u4EF6\u3082\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002");
		}

		var H_shopid = this.O_Shop.getIncludeShopWithName(this.O_view.gSess().shopid, true);

		if (1 < H_shopid.length) //$this->O_view->setAssign("shopid", $this->O_view->gSess()->shopid);
			{
				this.O_view.setAssign("H_shopid", H_shopid);
				this.O_view.setAssign("shopid", search_shopid);
			}

		var H_pricelist_tmp = Array();

		for (var i = 0; i < count_pricelist; i++) {
			if (true == AH_pricelist[i].defaultflg && false == (undefined !== H_pricelist_tmp[AH_pricelist[i].ppname][AH_pricelist[i].shopid]) && this.O_model.getToday() >= AH_pricelist[i].datefrom) {
				H_pricelist_tmp[AH_pricelist[i].ppname][AH_pricelist[i].shopid] = true;
				AH_pricelist[i].enable = true;
			}
		}

		var A_search_pact = this.O_model.getShopPriceList("col", search_shopid, this.O_view.gSess().groupid, " pricelist_tb.defaultflg = false AND ");
		var H_search_pact = Array();
		var count_search_pact = A_search_pact.length;

		for (var cnt = 0; cnt < count_search_pact; cnt++) {
			H_search_pact[A_search_pact[cnt]] = this.O_model.getPublishedPactCount(A_search_pact[cnt], search_shopid).length;
		}

		var H_ppid_name = this.O_model.getNewestDefaultPricelist(this.O_view.gSess().groupid, search_shopid);
		this.O_view.setAssign("H_ppid_name", H_ppid_name);
		this.O_view.setAssign("H_search_pact", H_search_pact);
		this.O_view.setAssign("AH_pricelist", AH_pricelist);
		this.O_view.displaySmarty(err_str);
	}

};