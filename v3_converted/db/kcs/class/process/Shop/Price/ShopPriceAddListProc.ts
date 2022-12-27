//
//ショップ：価格表リレーション登録
//
//更新履歴：<br>
//2008/08/05 石崎公久 作成
//
//@uses ProcessBaseHtml
//@uses PactModel
//@uses PostModel
//@uses FuncModel
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

require("view/Shop/Price/ShopPriceAddListView.php");

require("model/PactModel.php");

require("model/PostModel.php");

require("model/FuncModel.php");

require("Tree.php");

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
//
//modePactConf
//
//@author ishizaki
//@since 2008/08/07
//
//@access private
//@return void
//
//
//modePostConf
//
//@author ishizaki
//@since 2008/08/08
//
//@access private
//@return void
//
//
//価格表入力後の掲載企業選択ルーチン
//
//@author ishizaki
//@since 2008/08/06
//
//@access private
//@return void
//
//
//modePostSelect
//
//@author ishizaki
//@since 2008/08/07
//
//@access public
//@return void
//
//
//registPost
//
//@author ishizaki
//@since 2008/08/11
//
//@access private
//@return void
//
//
//registPact
//
//@author ishizaki
//@since 2008/08/11
//
//@access private
//@return void
//
class ShopPriceAddListProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_Sess = MtSession.singleton();
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//model の生成
	//価格表ID
	//価格表IDからキャリアIDを引き出す
	//価格表からSHOPIDを抜き出す
	//モード判定
	//Smartyによる表示
	//$this->O_view->displaySmarty();
	{
		this.O_view = new ShopPriceAddListView({
			"/Shop/MTPrice/menu.php": "\u4FA1\u683C\u8868\u4E00\u89A7",
			"": "\u4FA1\u683C\u8868\u767B\u9332"
		});
		this.getSetting().loadConfig("price");
		this.O_view.startCheck();
		this.O_model = new ShopPriceModel();
		this.O_PactModel = new PactModel();
		this.O_PostModel = new PostModel();
		this.O_FuncModel = new FuncModel();
		this.PricelistID = this.O_view.getPricelistID();
		this.CarID = this.O_model.getCaridFromPricelistID(this.PricelistID);
		this.ShopID = this.O_model.getShopidFromPricelistID(this.PricelistID);

		if (0 == this.ShopID) {
			this.ShopID = this.O_Sess.getPub("/pricelist_shop");
		}

		var A_selectedlist = this.O_model.getSelectedRelationlist(this.PricelistID, this.ShopID);
		this.Mode = this.O_view.getMode();

		if (true == is_null(this.Mode) && 0 < A_selectedlist.length) {
			if (A_selectedlist[0].postid == 0) {
				this.Mode = "pact";
				var A_pactlist = Array();

				for (var value of Object.values(A_selectedlist)) {
					A_pactlist.push(value.pactid);
				}

				this.O_view.setAssign("A_pactid", A_pactlist);
			} else {
				this.Mode = "post";
				this.O_Sess.setSelf("pactid", A_selectedlist[0].pactid);
				var A_postlist = Array();

				for (var value of Object.values(A_selectedlist)) {
					A_postlist.push(value.postid);
				}

				this.O_view.setAssign("A_postid", A_postlist);
			}
		} else if (true == is_null(this.Mode)) {
			this.Mode = "pact";
		}

		if ("post" === this.Mode) {
			this.modePostSelect();
		} else if ("pact" === this.Mode) {
			this.modePactSelect();
		} else if ("pactconf" === this.Mode) {
			this.modePactConf();
		} else if ("postconf" === this.Mode) {
			this.modePostConf();
		} else if ("registpost" === this.Mode) {
			this.registPost();
		} else if ("registpact" === this.Mode) {
			this.registPact();
		} else {
			console.log("Mode:" + this.Mode);
			console.log("\u5224\u5B9A\u4E0D\u80FD\u3067\u3059");
			throw die(0);
		}
	}

	modePactConf() {
		var H_pactid_pactname = this.O_PactModel.getPactHash("assoc", this.ShopID, this.CarID);
		this.O_view.displayPactConfHTML(H_pactid_pactname);
	}

	modePostConf() {
		var H_postid_postname = this.O_PostModel.getPostHash(this.O_Sess.getSelf("pactid"), this.ShopID, "assoc", this.CarID);
		this.O_view.setAssign("H_postid_postname", H_postid_postname);
		this.O_view.setAssign("compname", this.O_PactModel.getCompname(this.O_Sess.getSelf("pactid")));
		this.O_view.displayPostConfHTML();
	}

	modePactSelect() //販売店に割り当てられている企業の一覧を取得
	//管理者（shopid == 0）の場合はセッションから自分の価格表IDを取得
	{
		if (0 == this.ShopID) {
			var shopid = this.O_view.gSess().shopid;
		} else {
			shopid = this.ShopID;
		}

		var H_pactid_pactname = this.O_PactModel.getPactHash("assoc", shopid, this.CarID);

		if (1 > H_pactid_pactname.length) {
			this.O_view.displaySmarty("\u73FE\u5728\u306E\u8CA9\u58F2\u5E97\u306B\u5272\u308A\u5F53\u3066\u3089\u308C\u305F\u9867\u5BA2\u306F\u4E00\u4EF6\u3082\u3042\u308A\u307E\u305B\u3093\u3002");
		}

		var A_pactidlist = Object.keys(H_pactid_pactname);
		var H_pactid_ininame = this.O_model.getPactHadShopPriceFunction("assoc", A_pactidlist);

		if (1 > H_pactid_ininame.length) //$this->O_view->displaySmarty("現在の販売店が価格表表示を担当する部署は一件もありません。");
			{
				this.O_view.displaySmarty("\u73FE\u5728\u306E\u8CA9\u58F2\u5E97\u306B\u5272\u308A\u5F53\u3066\u3089\u308C\u305F\u9867\u5BA2\u306F\u4E00\u4EF6\u3082\u3042\u308A\u307E\u305B\u3093\u3002");
			}

		this.O_view.displayPactHTML(H_pactid_pactname, H_pactid_ininame);
	}

	modePostSelect() //販売店に割り当てられている部署の一覧を取得
	{
		var O_tree = new Tree();
		var H_post_all = O_tree.getPostTreeHash(this.O_Sess.getSelf("pactid"));
		var H_post_incarid = this.O_PostModel.getPostHash(this.O_Sess.getSelf("pactid"), this.ShopID, "assoc", this.CarID);
		this.O_view.displayPostHTML(H_post_all, H_post_incarid, this.O_PactModel.getCompname(this.O_Sess.getSelf("pactid")));
	}

	registPost() //関連付けを登録
	{
		var res = this.O_model.registPriceRelation("post", this.PricelistID, this.O_Sess.getSelf("pactid"), this.ShopID, this.O_Sess.getSelf("A_postlist"));

		if (res == -1) {
			this.infoOut("\u60F3\u5B9A\u5916");
		}

		this.O_view.clearSessSelf();
		this.O_view.displayFinish();
	}

	registPact() //関連付けを登録
	{
		var res = this.O_model.registPriceRelation("pact", this.PricelistID, this.O_Sess.getSelf("A_pactlist"), this.ShopID);

		if (res == -1) {
			this.infoOut("\u60F3\u5B9A\u5916");
		}

		this.O_view.clearSessSelf();
		this.O_view.displayFinish();
	}

};