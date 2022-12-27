//error_reporting(E_ALL|E_STRICT);
//
//シミュレーション再実行依頼
//
//更新履歴：<br>
//2008/11/21 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package Shop
//@author nakanita
//@since 2008/11/21
//
//
//
//シミュレーション再実行依頼
//
//@uses ProcessBaseHtml
//@package Shop
//@author nakanita
//@since 2008/02/08
//

require("process/ProcessBaseHtml.php");

require("view/Shop/MTHotline/Recom3/RecomRecalcView.php");

require("model/Recom/PlanRecalcModel.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/11/21
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author nakanita
//@since 2008/11/21
//
//@param array $H_param
//@access protected
//@return void
//
class RecomRecalcProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//model の生成
	//セッション情報取得
	//var_dump( $H_g_sess );
	//var_dump( $H_sess );
	//表示に必要なものを格納する配列を取得
	//パラメータのエラーチェック
	//Smartyによる表示
	{
		var O_view = new RecomRecalcView();
		O_view.startCheck();
		var O_model = new PlanRecalcModel(this.get_DB());
		var H_g_sess = O_view.getGlobalShopSession();
		var H_sess = O_view.getSelfSession();
		var H_view = O_view.getView();

		if (O_view.checkParamError(H_sess, H_g_sess) == true) //パラメーター不正
			{
				H_view.status = "bad";
			} else //二重登録防止、すでに登録があるか？
			//END existsHotlineEntry
			{
				var pactid = H_sess.get.pactid;
				var carid = H_sess.get.carid;

				if (O_model.existsHotlineEntry(pactid) > 0) {
					H_view.status = "double";
				} else //以前の結果を消す
					//全ての条件に渡ってエントリーを追加する
					//END month
					{
						O_model.deleteHotlineResult(pactid, carid);
						var A_month = [1, 2, 3, 6, 12];
						var A_buysel = ["", "on"];
						var A_pakefree = [0, 1, 2];

						for (var month of Object.values(A_month)) //変更無し
						//基本料の割引率、nullとしたい
						//通話通信料の割引率、nullとしたい
						//携帯の比率、nullなら現行の値
						//話時間の増減比率(、nullなら現行の値
						//平日昼間の比率、nullなら現行の値
						//通話時間の増減比率、nullなら100と見なす
						//パケット数の増減比率、nullなら100と見なす
						//nullなら変化なし
						//条件の中に現行部署を入れる -- Hotlineの場合、常にRoot部署なので不要
						//$H_cond['postid'] = $H_g_sess['current_postid'];
						//// 部署名を得る -- 表示しないので不要
						//if( $H_g_sess['current_postid'] != "" ){
						//$O_postmodel = new PostModel();
						//$H_cond['postname'] = $O_postmodel->getPostNameOne(
						//$H_g_sess['current_postid'] );
						//}
						//Hotlineからのエントリーではhandid=0というお約束にする
						//条件指定表示するときには、handid=0 を除くようにする
						//count( $H_condlist ) + 1;
						{
							var H_cond = Array();
							H_cond.discount_way = 0;
							H_cond.discount_base = undefined;
							H_cond.discount_tel = undefined;
							H_cond.ratio_cellular = undefined;
							H_cond.ratio_same_carrier = undefined;
							H_cond.ratio_daytime = undefined;
							H_cond.ratio_increase_tel = undefined;
							H_cond.ratio_increase_comm = undefined;
							H_cond.carid_after = undefined;
							H_sess.get.range = "all";
							H_sess.get.period = month;
							var handid = 0;

							for (var buysel of Object.values(A_buysel)) {
								for (var pakefree of Object.values(A_pakefree)) //シミュレーション依頼を出す
								{
									H_sess.get.buysel = buysel;
									H_sess.get.pakefree = pakefree;
									var result = O_model.setRecalcEntry(H_sess.get, H_cond, pactid, H_g_sess.shopid, H_g_sess.memid, H_sess.get.year, H_sess.get.month, handid);

									if (result == 1) //二重起動
										{
											H_view.status = "double";
										}
								}
							}
						}
					}
			}

		O_view.displaySmarty();
	}

};