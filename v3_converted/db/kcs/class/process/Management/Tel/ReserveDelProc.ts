//
//予約削除Proccess基底
//
//更新履歴：<br>
//2008/08/14 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/14
//@filesource
//@uses ProcessBaseHtml
//@uses ManagementUtil
//
//
//error_reporting(E_ALL|E_STRICT);
//
//予約削除Proccess基底
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/14
//@uses ProcessBaseHtml
//@uses ManagementUtil
//

require("process/ProcessBaseHtml.php");

require("ManagementUtil.php");

require("view/Management/Tel/ReserveDelView.php");

require("model/Management/Tel/ManagementTelModel.php");

require("model/Management/Assets/ManagementAssetsModel.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/08/14
//
//@param array $H_param
//@access public
//@return void
//
//
//view取得
//
//@author houshiyama
//@since 2008/08/14
//
//@abstract
//@access protected
//@return void
//
//
//モデル取得
//
//@author houshiyama
//@since 2008/08/14
//
//@param array $H_g_sess
//@param mixed $O_manage
//@abstract
//@access protected
//@return void
//
//
//プロセス処理のメイン<br>
//
//viewオブジェクトの取得 <br>
//セッション情報取得（グローバル） <br>
//管理情報用の関数集のオブジェクト生成 <br>
//modelオブジェクト取得 <br>
//ログインチェック <br>
//権限一覧取得 <br>
//自ページを表示できるかチェック <br>
//セッション情報取得（ローカル） <br>
//資産モデル生成 <br>
//テーブル名決定 <br>
//予約リスト取得 <br>
//予約削除用sql生成 <br>
//DB更新 <br>
//
//@author houshiyama
//@since 2008/08/14
//
//@param array $H_param
//@access protected
//@return void
//@uses ManagementUtil
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/08/14
//
//@access public
//@return void
//
class ReserveDelProc extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ReserveDelView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementTelModel(this.get_DB(), H_g_sess, O_manage);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//cgiパラメータ処理
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//資産モデル生成
	//テーブル名の決定
	//予約リスト取得
	//予約種別
	//予約削除用sql生成
	//DB更新成功
	{
		var O_view = this.get_View();
		O_view.checkCGIParam();
		var H_g_sess = O_view.getGlobalSession();
		var O_manage = new ManagementUtil(H_g_sess);
		var O_model = this.get_Model(H_g_sess, O_manage);
		var H_sess = O_view.getLocalSession();
		var O_assets = new ManagementAssetsModel(this.get_DB(), H_g_sess, O_manage);
		O_model.setTableName(H_sess[ReserveDelProc.PUB].cym);
		O_assets.setTableName(H_sess[ReserveDelProc.PUB].cym);
		var A_reserve = O_model.getTelReserveListAtDate(H_sess.SELF.get.telno, H_sess.SELF.get.carid, H_sess.SELF.get.date, H_sess.SELF.get.flg);
		var str = O_view.convertReserveType(A_reserve[0].add_edit_flg);
		var str_eng = O_view.convertReserveType(A_reserve[0].add_edit_flg);
		var A_sql = O_model.deleteReserveProc(A_reserve, str + "\u4E88\u7D04\u524A\u9664", "\u2605" + str_eng + "\u4E88\u7D04\u524A\u9664", "\u4E88\u7D04\u524A\u9664");

		if (O_model.execDB(A_sql) == true) //メニューに戻る
			{
				O_view.endReserveDel();
				throw die();
			} else //エラー画面
			{
				this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "./menu.php");
			}
	}

	__destruct() {
		super.__destruct();
	}

};