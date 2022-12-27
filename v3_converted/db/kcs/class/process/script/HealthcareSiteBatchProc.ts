//
//ヘルスケア取込処理 （Process）
//
//更新履歴：<br>
//2015/0710 伊達 作成
//
//CalcHealthcareProc
//
//@package
//@subpackage Process
//@author date
//@filesource
//@since 2015/07/10
//
//
//error_reporting(E_ALL|E_STRICT);
//require_once("model/TransitModel.php");	// ●未実装

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/BillModel.php");

require("model/PostModel.php");

require("model/FuncModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/HealthcareSiteBatchView.php");

require("model/script/HealthcareSiteBatchModel.php");

//
//コンストラクタ
//
//@author date
//@since 2015/07/10
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author date
//@since 2015/07/10
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author date
//@since 2015/07/10
//
//@access public
//@return void
//
class HealthcareSiteBatchProc extends ProcessBaseBatch {
								constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
								//$this->getSetting()->loadConfig("docomo_health");
								{
																super(H_param);
								}

								doExecute(H_param: {} | any[] = Array()) //Viewの生成
								//Modelの生成
								//error_reporting(0);
								//ini_set( 'display_errors', 0 );
								//警告は表示しない
								//処理開始
								//固有ログディレクトリの作成取得
								//スクリプトの二重起動防止ロック
								//$this->lockProcess($O_view->get_ScriptName());	//	テスト中はロックされると面倒なので外しておく
								//引数の値をメンバーに
								//$this->Mode = $O_view->get_HArgv("-m");
								//現在ヘルスケアランキングサイトの権限がある会社一覧について
								//会社一覧
								//現在ランキングサイトに登録されている企業一覧を取得する
								//サイトに登録されている企業一覧
								//会社関係のこと
								//チームの事
								//スクリプトの二重起動防止ロック解除
								//$this->unLockProcess($O_view->get_ScriptName());
								//終了
								{
																var O_view = new HealthcareSiteBatchView();
																var O_model = new HealthcareSiteBatchModel(this.get_MtScriptAmbient());
																ini_set("error_reporting", E_ERROR);
																this.infoOut("\u66F4\u65B0\u958B\u59CB\n", 0);
																this.set_Dirs(O_view.get_ScriptName());
																this.PactId = O_view.get_HArgv("-p");
																this.BillDate = O_view.get_HArgv("-y");
																this.Confirm = false;
																var y = date("Y");
																var m = date("m");
																var date = sprintf("%04d%02d", y, m);
																var tableNo = MtTableUtil.getTableNo(date, false);
																var pact_list = O_model.getPactList();
																var pactid_list = Array();
																var site_pact_list = O_view.getPact();
																var site_pactid_list = Object.keys(site_pact_list);

																for (var value of Object.values(pact_list)) //会社登録する
																//既に登録されている
																{
																								var oid = value.userid_ini;
																								var name = value.compname;
																								pactid_list.push(value.pactid);

																								if (undefined !== site_pact_list[oid]) //既に登録されている
																																{
																																								continue;
																																}

																								var res = O_view.registPact(oid, name);

																								if (is_null(res)) //登録に失敗した？
																																{
																																								continue;
																																}

																								site_pact_list[res.organization_id] = {
																																organization_name: res.organization_name,
																																organization_internal_id: res.organization_internal_id
																								};
																}

																for (var pact_value of Object.values(pact_list)) //ヘルスケアランキングの対象部署を取得
																//部署ごとに見ていく
																{
																								oid = pact_value.userid_ini;
																								var post_list = O_model.getPost(pact_value.pactid, tableNo);
																								var site_team_list = O_view.getTeam(pact_value.userid_ini);

																								for (var post_value of Object.values(post_list)) //この会社はサイトに登録されていない
																								{
																																var team_id = post_value.userid_ini + "_" + post_value.postid;
																																var team_name = post_value.postname;

																																if (!(undefined !== site_pact_list[oid])) //この会社の部署は処理しない
																																								{
																																																continue;
																																								}

																																if (undefined !== site_team_list[team_id]) //既に登録済であれば、チーム名の変更チェックを行う
																																								{
																																																if (site_team_list[team_id].team_name != team_name) //チーム名の変更を行う
																																																								{
																																																																O_view.changeTeam(oid, team_id, team_name);
																																																								}
																																								} else //チーム登録されていないので登録する
																																								//登録できたならヘルスケアランキング対象部署として登録
																																								{
																																																res = O_view.registTeam(oid, team_id, team_name);

																																																if (!is_null(res)) {
																																																								site_team_list[team_id] = {
																																																																team_name: res.team_name,
																																																																team_internal_id: res.team_internal_id
																																																								};
																																																} else //登録できなかった
																																																								{}
																																								}
																								}

																								var user_list = O_model.getHealthcareId(pact_value.pactid, tableNo);
																								var site_user_list = O_view.getUser(oid);

																								for (var user_value of Object.values(site_user_list)) {
																																var user_id = user_value.user_id;

																																if (!(undefined !== user_list[user_id])) //ユーザー消えてる
																																								//消えない？？
																																								{
																																																O_view.deleteUser(oid, user_id);
																																								}
																								}

																								for (var user_id in user_list) //チームが存在するかチェック
																								{
																																var user_value = user_list[user_id];
																																team_id = user_value.userid_ini + "_" + user_value.postid;

																																if (!(undefined !== site_team_list[team_id])) //このチームは処理しない
																																								{
																																																continue;
																																								}

																																if (undefined !== site_user_list[user_id]) //所属チームが変わっているか確認を行う
																																								{
																																																if (site_user_list[user_id].team_id != team_id) //所属チーム変わってる
																																																								{
																																																																O_view.changeUserTeam(oid, team_id, user_id);
																																																								}
																																								} else //登録できたならヘルスケアランキング対象部署として登録
																																								{
																																																res = O_view.registUser(oid, team_id, user_id);

																																																if (!is_null(res)) {
																																																								site_user_list[user_id] = {
																																																																team_id: res.team_id
																																																								};
																																																} else //登録できなかた
																																																								{}
																																								}
																								}
																}

																this.set_ScriptEnd();
																this.infoOut("\u66F4\u65B0\u7D42\u4E86", 0);
																throw die(result);
								}

								__destruct() //親のデストラクタを必ず呼ぶ
								{
																super.__destruct();
								}

};