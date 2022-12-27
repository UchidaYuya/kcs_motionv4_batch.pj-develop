//error_reporting(E_ALL|E_STRICT);
//
//シミュレーション結果表示のプロセス実装
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
//ぱんくずリンクを作る
//makePankuzuLinkHTML( $H_link, $type = "user", $menulink = true )
//ページリンクを作る
//function makePageLinkHTML( $cnt, $limit, $offset, $view=10 )
//
//シミュレーション結果表示のプロセス実装
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/07/17
//

require("process/ProcessBaseHtml.php");

require("model/Recom/RecomModel.php");

require("view/Recom/RecomResultView.php");

require("view/MakePankuzuLink.php");

require("view/MakePageLink.php");

require("TreeAJAX.php");

require("ListAJAX.php");

require("PostLinkGet.php");

require("Post.php");

require("model/Recom/RecomResultModel.php");

require("model/Recom/RecomResultPropertyModel.php");

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
class RecomResultProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getRecomView() {
		return new RecomResultView();
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//除外電話番号
	//セッション情報取得
	//結果モデル
	//パラメータのエラーチェック
	//表示に必要なものを格納する配列を取得
	//ユーザー権限一覧を得る
	//会社権限一覧を得る
	//電話情報表示権限があれば、カラム変更を行うことができる
	//結果ダウンロード権限
	//用途区分と警告の権限をテンプレートに渡す
	//ご注文権限
	//disp_point の有無によって、postidの取得先を切り替える
	//セッション情報をViewに渡す
	//キャリア名をセッションから得る
	//buysel, pakefree を表示にもってゆく
	//現行の部署ID=シミュレーション対象部署
	//指定した電話番号
	//現行部署の位置
	//部署の位置
	//パンくずリンクの生成
	//部署範囲の設定
	//削減金額の設定
	//全て、のフラグを作る
	//モデルからシミュレーション結果を得る
	//END done_state
	//除外電話番号の処理
	//シミュレーション結果を保持
	//simid をシミュレーション条件に保存する
	//from句、where句を保持する
	//月を渡す、整数型で
	//最終計算日
	//ページリンク
	//現在のページ、==1 だった場合にグラフを出す
	//初回アクセスであることを表す
	//ショップ側の場合、最終シミュレーション日を更新
	//Smartyによる表示
	{
		var O_view = this.getRecomView();
		O_view.startCheck();
		var session_key = "/Recom3/skip_telno.php";
		var line = "";
		if (undefined !== _SESSION[session_key]) line = _SESSION[session_key];
		var A_skip_telno = Array();
		if (line.length) A_skip_telno = line.split(",");
		if (!Array.isArray(A_skip_telno)) A_skip_telno = Array();
		var O_model = new RecomModel(this.get_DB());
		var H_g_sess = O_view.getGlobalSession();
		var H_p_sess = O_view.getPubSession();
		var H_sess = O_view.getSelfSession();
		var H_options = {
			[RecomResultPropertyModel.G_SESS]: H_g_sess,
			[RecomResultPropertyModel.P_SESS]: H_p_sess,
			[RecomResultPropertyModel.S_SESS]: H_sess
		};
		var O_property = new RecomResultPropertyModel(H_options);
		var O_resultModel = new RecomResultModel();
		O_resultModel.setProperty(O_property);
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

		if (-1 !== A_auth.indexOf("fnc_tel_vw") == true || -1 !== A_auth.indexOf("fnc_tel_manage_vw") == true || O_view.getSiteMode() == ViewBaseHtml.SITE_SHOP) //ショップ側は無条件で利用可
			{
				H_view.fnc_tel_vw = true;
			} else {
			H_view.fnc_tel_vw = false;
		}

		if (-1 !== A_auth.indexOf("fnc_recom_download") == true || -1 !== A_auth.indexOf("fnc_shop_download") == true) //ショップ側の場合、共通ダウンロード権限をあてがう
			{
				H_view.fnc_recom_download = true;
			} else {
			H_view.fnc_recom_download = false;
		}

		if (-1 !== A_auth_all.indexOf("fnc_tel_division") == true && -1 !== A_auth_all.indexOf("fnc_fjp_co") == true) {
			H_view.fnc_tel_division = true;
		} else {
			H_view.fnc_tel_division = false;
		}

		if (-1 !== A_auth_all.indexOf("fnc_show_admonition") == true && (!(undefined !== H_g_sess.su) || !H_g_sess.su)) //警告抑止権限があり、スーパーユーザーではない
			{
				H_view.fnc_show_admonition = false;
			} else {
			H_view.fnc_show_admonition = true;
		}

		if ((-1 !== A_auth.indexOf("fnc_mt_order_adm") == true && (H_sess.post.carid == this.getSetting().car_docomo && -1 !== A_pa_auth.indexOf("fnc_order_docomo") == true || H_sess.post.carid == this.getSetting().car_au && -1 !== A_pa_auth.indexOf("fnc_order_au") == true || H_sess.post.carid == this.getSetting().car_softbank && -1 !== A_pa_auth.indexOf("fnc_order_softbank") == true) || -1 !== A_auth.indexOf("fnc_shopactorderv2") == true || -1 !== A_auth.indexOf("fnc_shop_actorder") == true) && (H_sess.post.disp_point == "" || H_sess.post.disp_point == 0)) //ショップ側の場合、V2,V3の代行注文権限
			{
				H_view.fnc_sim_order = true;
			} else {
			H_view.fnc_sim_order = false;
		}

		if (H_sess.post.disp_point != "" && H_sess.post.disp_point != 0) //有りの場合、CGIパラメータから得る
			{
				var current_postid = H_sess.post.postid;
			} else //無しの場合にはグローバルセッションから
			{
				current_postid = H_g_sess.current_postid;
			}

		H_view.H_sim = H_sess.post;
		H_view.H_sim.carname = H_p_sess.carname;
		H_view.H_sim.buysel = H_sess.post.buysel;
		H_view.H_sim.pakefree = H_sess.post.pakefree;
		H_view.H_sim.postid = current_postid;
		H_view.H_sim.telno = H_sess.post.telno;
		var pst = new Post();
		H_view.post_path = pst.getPosttreeband(_SESSION.pactid, _SESSION.postid, current_postid, "post_tb", "post_relation_tb");
		H_view.page_path = O_view.makePankuzuLink();
		O_model.setRange(H_sess.post.range, H_sess.post.telno, H_g_sess.pactid, H_g_sess.postid, current_postid);
		O_model.setBorder(H_sess.ptn.border_sel, H_sess.ptn.border, H_sess.ptn.slash, H_sess.post.buysel);

		if (H_sess.ptn.border_sel === "all") {
			var allflag = true;
		} else {
			allflag = false;
		}

		var done_state = 0;

		while (done_state < 9) //9 は完了ステータス
		//件数が０件で削減額が０でなかった場合、削減額条件なしで再度sqlを実行する
		//そうしないと、削減金額を上げて０件になったときに困るぞ！
		{
			var H_data = O_resultModel.getRecomResult();
			var H_sum = O_resultModel.getResultCnt();

			if (H_sum[0].count == 0 && done_state == 0 && H_sess.ptn.border_sel == "on") {
				O_property.setBorder(1).setSlash(undefined);
				done_state = 1;
			} else if (done_state == 1) //再実行
				//ステータスを完了に
				{
					if (H_sum[0].count > 0) //再実行で結果が出た
						//メッセージを出そう
						//金額をリセットする
						//削減金額を 1に設定し直す
						//違約金を設定無しに戻す
						//削減金額と違約金をセッションから消す
						{
							if (H_g_sess.language === "ENG") {
								var border_msg = "<br>No result with an estimated cutback amount of " + H_sess.ptn.border + " or more";

								if (H_sess.post.buysel === "on") //買い換えありの場合、違約金も表示
									{
										border_msg += " and penalty of " + +(H_sess.ptn.slash + " or below");
									}
							} else {
								border_msg = "<br>\u4E88\u6E2C\u524A\u6E1B\u984D\u304C " + H_sess.ptn.border + "\u5186\u4EE5\u4E0A";

								if (H_sess.post.buysel === "on") //買い換えありの場合、違約金も表示
									{
										border_msg += "\u3001\u9055\u7D04\u91D1\u304C " + +(H_sess.ptn.slash + "\u5186\u4EE5\u4E0B");
									}

								border_msg += "\u306E\u7D50\u679C\u306F\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002";
							}

							H_view.border_msg = border_msg;
							H_sess.ptn.border = 1;
							H_sess.ptn.slash = "";
							O_view.resetBorderSlash();
						}

					done_state = 9;
				} else //結果があれば、それで完了
				{
					done_state = 9;
				}
		}

		var all_on = true;
		var all_off = true;
		var A_telno_all = Array();

		for (var key in H_data) {
			var H_line = H_data[key];
			if (!(undefined !== H_line.telno)) continue;
			var telno = H_line.telno;
			A_telno_all.push(telno);
			H_data[key].telno_serial = telno;

			if (-1 !== A_skip_telno.indexOf(telno)) {
				all_off = false;
				H_data[key].telno_skip = 1;
			} else {
				all_on = false;
				H_data[key].telno_skip = 0;
			}
		}

		H_view.telno_serial_all = A_telno_all.join(",");
		H_view.telno_skip_all = all_on ? 1 : 0;
		H_view.H_table = H_data;
		H_view.H_sim.simid = O_resultModel.getSimId();
		H_view.fromsql = O_model.getFromSQL1();
		H_view.wheresql = O_model.getWhereSQL1();
		H_view.bordersql = O_model.getBorderSQL();
		H_sum[0].sumbefore = H_sum[0].basicbefore + H_sum[0].tuwabefore + H_sum[0].etcbefore;
		H_sum[0].sumafter = H_sum[0].basicafter + H_sum[0].tuwaafter + H_sum[0].etcafter;
		H_sum[0].mm = +H_p_sess.month;
		H_sum[0].max_fixdate = H_sum[0].max_fixdate;
		H_view.H_sum = H_sum[0];
		var O_plink = new MakePageLink();

		if (H_g_sess.language === "ENG") //offset
			{
				H_view.page_link = O_plink.makePageLinkHTMLEng(H_sum[0].count, H_sess.ptn.limit, H_sess.get.p);
			} else //offset
			{
				H_view.page_link = O_plink.makePageLinkHTML(H_sum[0].count, H_sess.ptn.limit, H_sess.get.p);
			}

		H_view.current = H_sess.get.p;
		H_view.is_first = H_sess.post.is_first;
		H_view.limit = H_sess.ptn.limit;
		H_view.border_sel = H_sess.ptn.border_sel;
		H_view.border = H_sess.ptn.border;
		H_view.slash = H_sess.ptn.slash;

		if (O_view.getSiteMode() == ViewBaseHtml.SITE_SHOP) {
			O_model.upSimDate(H_g_sess.pactid, H_sess.post.carid);
		}

		O_view.arrangeDisp(H_p_sess);
		O_view.displaySmarty();
	}

};