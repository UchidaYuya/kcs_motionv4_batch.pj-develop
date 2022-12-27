//error_reporting(E_ALL|E_STRICT);
//
//シミュレーションメニューのプロセス実装
//
//更新履歴：<br>
//2008/07/17 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/07/17
//
//
//
//シミュレーションメニューのプロセス実装
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/07/17
//

require("process/ProcessBaseHtml.php");

require("model/Recom/RecomModel.php");

require("model/Recom/PlanRecalcModel.php");

require("model/Recom/SimTrendModel.php");

require("view/Recom/RecomMenuView.php");

require("model/PostModel.php");

require("TreeAJAX.php");

require("ListAJAX.php");

require("PostLinkGet.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/07/17
//
//@param array $H_param
//@access public
//@return void
//
//
//ここで必要となるViewを返す<br/>
//Hotline側と切り替えるための仕組み<br/>
//
//@author nakanita
//@since 2008/09/17
//
//@access protected
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author nakanita
//@since 2008/07/17
//
//@param array $H_param
//@access protected
//@return void
//
class RecomMenuProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getRecomView() {
		return new RecomMenuView();
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//model の生成
	//不要なセッションを消去する
	//セッション情報取得
	//var_dump( $H_g_sess );	// * DEBUG
	//var_dump( $H_sess );	// * DEBUG
	//パラメータのエラーチェック
	//表示に必要なものを格納する配列を取得
	//ユーザー権限一覧を得る
	//会社権限一覧を得る
	//var_dump( $A_auth );	// * DEBUG
	//結果ダウンロード権限
	//グラフ表示権限
	//条件指定シミュレーション
	//キャリア間シミュレーション権限
	//用途区分権限
	//パンくずリンクの生成
	//ツリーの作成
	//部署の位置
	//ショップの場合はショップ権限を付ける
	//モデルからキャリアの情報を得る
	//キャリアのデフォルト値をセット
	//var_dump( $H_view['H_sim'] ); // * DEBUG *
	//選択したキャリアの年月をセッションに付ける
	//mm の値はリセット時に使用する
	//shopid, memid を得る
	{
		var O_view = this.getRecomView();
		O_view.startCheck();
		var O_model = new RecomModel(this.get_DB());
		O_view.clearPreSession();
		var H_g_sess = O_view.getGlobalSession();
		var H_sess = O_view.getSelfSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var H_view = O_view.getView();
		var A_auth = O_view.getUserAuth();

		if (O_view.getSiteMode() == ViewBaseHtml.SITE_USER) {
			var A_pa_auth = O_view.getPactAuth();
		} else //if( $O_view->getSiteMode() == ViewBaseHtml::SITE_SHOP ){
			//ショップ側の場合は権限なし
			{
				A_pa_auth = Array();
			}

		var A_auth_all = array_merge(A_auth, A_pa_auth);

		if (-1 !== A_auth.indexOf("fnc_recom_download") == true || -1 !== A_auth.indexOf("fnc_shop_download") == true) //ショップ側の場合、共通ダウンロード権限をあてがう
			{
				H_view.fnc_recom_download = true;
			} else {
			H_view.fnc_recom_download = false;
		}

		if (-1 !== A_auth.indexOf("fnc_view_recomusegraph") == true || -1 !== A_auth.indexOf("fnc_shop_view_recomusegraph") == true) {
			H_view.fnc_view_recomusegraph = true;
		} else {
			H_view.fnc_view_recomusegraph = false;
		}

		if (-1 !== A_auth.indexOf("fnc_shop_condrecom") == true) {
			H_view.fnc_shop_condrecom = true;
		} else {
			H_view.fnc_shop_condrecom = false;
		}

		if (-1 !== A_auth.indexOf("fnc_shop_recom_car") == true) {
			H_view.fnc_shop_recom_car = true;
		} else {
			H_view.fnc_shop_recom_car = false;
		}

		if (-1 !== A_auth_all.indexOf("fnc_tel_division") == true && -1 !== A_auth_all.indexOf("fnc_fjp_co") == true) {
			H_view.fnc_tel_division = true;
		} else {
			H_view.fnc_tel_division = false;
		}

		H_view.page_path = O_view.makePankuzuLink();
		var pst = new PostLinkGet();
		H_view.post_path = pst.getPosttreeband(H_g_sess.pactid, H_g_sess.postid, H_g_sess.current_postid, "post_tb", "post_relation_tb");
		H_view.tree_js = TreeAJAX.treeJs() + ListAJAX.xlistJs();
		var O_tree = new TreeAJAX();
		H_view.tree_str = O_tree.makeTree(H_g_sess.postid);
		var O_xlist = new ListAJAX();

		if (O_view.getSiteMode() == ViewBaseHtml.SITE_SHOP) //ショップ権限ON
			{
				O_xlist.shop_auth = true;
			}

		H_view.xlist_str = O_xlist.makeList();
		var H_carrier = O_model.getSimCarrier(H_g_sess.pactid);
		H_view.H_car = H_carrier;

		if (H_sess.post.carid == "" && is_null(H_carrier[0].carid_before) == false) {
			H_sess.post.carid = H_carrier[0].carid_before;
		}

		if (H_sess.post.range == "") //全ての電話を指定
			{
				H_sess.post.range = "all";
			}

		if (H_sess.post.period == "") //デフォルト値は３ヶ月
			{
				H_sess.post.period = 3;
			}

		if (H_sess.post.buysel == "") //チェックなし
			{
				H_sess.post.buysel = "";
			}

		if (H_sess.post.pakefree == "") //チェックなし
			{
				H_sess.post.pakefree = 0;
			}

		if (H_sess.post.division == "") //チェックなし
			{
				H_sess.post.division = -1;
			}

		H_view.H_sim = H_sess.post;
		var mm = 0;

		for (var A_row of Object.values(H_carrier)) //キャリアと一致したら
		{
			if (A_row.carid_before == H_sess.post.carid) //年月をパブリックセッションに付ける
				{
					var yyyy = A_row.yyyymm.substr(0, 4);
					mm = A_row.yyyymm.substr(4, 2);
					O_view.setYYYYMMSession(yyyy, mm);

					if (H_g_sess.language === "ENG") {
						O_view.setCarrierInfo(A_row.carid_before, A_row.carname_eng);
						H_view.H_sim.carname = A_row.carname_eng;
					} else {
						O_view.setCarrierInfo(A_row.carid_before, A_row.carname);
						H_view.H_sim.carname = A_row.carname;
					}
				}
		}

		switch (O_view.getSiteMode()) {
			case ViewBaseHtml.SITE_USER:
				var shopid = 0;
				var user_memid = H_g_sess.userid;
				break;

			case ViewBaseHtml.SITE_SHOP:
				shopid = H_g_sess.shopid;
				user_memid = H_g_sess.memid;
				break;

			default:
				shopid = 0;
				user_memid = 0;
				break;
		}

		if (is_null(H_sess.post.reset_point) == false && H_sess.post.reset_point != "") {
			var O_trendmodel = new SimTrendModel();
			var pactid = H_g_sess.pactid;
			var carid = H_sess.post.carid;

			if (carid.length > 0) {
				H_view.H_sim.discount_base_0 = +O_trendmodel.getDisratio(pactid, carid);
				H_view.H_sim.discount_base_1 = +O_trendmodel.getAveDisratioBasic(pactid, carid, +mm);
				H_view.H_sim.discount_tel_1 = +O_trendmodel.getAveDisratioTalk(pactid, carid, +mm);
				H_view.H_sim.ratio_cellular = +O_trendmodel.getAveIsmobile(pactid, carid, +mm);
				H_view.H_sim.ratio_same_carrier = +O_trendmodel.getAveSameCarier(pactid, carid, +mm);
				H_view.H_sim.ratio_daytime = +O_trendmodel.getAveTimezone(pactid, carid, +mm);
			}

			O_view.clearResetSession();
		}

		if (is_null(H_sess.post.discount_way) == false && H_sess.post.discount_way != "") //print "Save!" . $H_sess['post']['regist_point'] . "<br/>";
			//条件の中に現行部署を入れる
			//部署名を得る
			//save_point の有無によって既存/新規を分ける
			//セッションから消す
			{
				var H_cond = Array();
				H_cond.discount_way = H_sess.post.discount_way;
				H_cond.discount_base = H_sess.post.discount_base;
				H_cond.discount_tel = H_sess.post.discount_tel;
				H_cond.ratio_cellular = H_sess.post.ratio_cellular;
				H_cond.ratio_same_carrier = H_sess.post.ratio_same_carrier;
				H_cond.ratio_daytime = H_sess.post.ratio_daytime;
				H_cond.ratio_increase_tel = H_sess.post.ratio_increase_tel;
				H_cond.ratio_increase_comm = H_sess.post.ratio_increase_comm;
				H_cond.carid_after = H_sess.post.carid_after;
				H_cond.postid = H_g_sess.current_postid;

				if (H_g_sess.current_postid != "") {
					var O_postmodel = new PostModel();
					H_cond.postname = O_postmodel.getPostNameOne(H_g_sess.current_postid);
				}

				var O_planmodel = new PlanRecalcModel();

				if (is_null(H_sess.post.save_point) == false && H_sess.post.save_point != "") //既存データをUPDATE
					{
						O_planmodel.upRecalcEntry(H_sess.post, H_cond, H_g_sess.pactid, shopid, user_memid, yyyy, mm);
					} else //新規に条件データをINSERT
					//handid を得るために現状のデータ数を得る
					{
						var H_condlist = O_model.getIndexList(H_g_sess.pactid, shopid, user_memid, 1);
						var handid = H_condlist.length + 1;
						O_planmodel.setRecalcEntry(H_sess.post, H_cond, H_g_sess.pactid, shopid, user_memid, yyyy, mm, handid);
					}

				O_view.clearCondSession();
			}

		if (is_null(H_sess.post.regist_point) == false && H_sess.post.regist_point != "") //print "Regist!" . $H_sess['post']['regist_point'] . "<br/>";
			//セッションから消す
			{
				O_planmodel = new PlanRecalcModel();
				O_planmodel.statRecalcEntry(H_sess.post.regist_point, 0);
				O_view.clearRegistSession();
			}

		if (H_view.H_sim.cond_open == "block") //パネルが開いていたら
			{
				H_view.H_condlist = O_model.getIndexList(H_g_sess.pactid, shopid, user_memid, 1);
			}

		O_view.displaySmarty();
	}

};