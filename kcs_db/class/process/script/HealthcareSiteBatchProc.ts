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
// //error_reporting(E_ALL|E_STRICT);// 2022cvt_011
// 2022cvt_025
//require_once("model/TransitModel.php");	// ●未実装

// require("MtTableUtil.php");
import MtTableUtil from '../../MtTableUtil';

// require("model/PactModel.php");
import PactModel from '../../model/PactModel';

// require("model/BillModel.php");
import BillModel from '../../model/BillModel';

// require("model/PostModel.php");
import PostModel from '../../model/PostModel';

// require("model/FuncModel.php");
import FuncModel from '../../model/FuncModel';

// require("process/ProcessBaseBatch.php");
import ProcessBaseBatch from '../ProcessBaseBatch';

// require("view/script/HealthcareSiteBatchView.php");
import * as HealthcareSiteBatchView from '../../view/script/HealthcareSiteBatchView';

// require("model/script/HealthcareSiteBatchModel.php");
import * as HealthcareSiteBatchModel from '../../model/script/HealthcareSiteBatchModel';

import * as define from '../../../db_define/define';

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
export default class HealthcareSiteBatchProc extends ProcessBaseBatch {

	PactId; any;
	BillDate: any;
	Confirm: any;

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//$this->getSetting()->loadConfig("docomo_health");
	{
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //Viewの生成
	//Modelの生成
// 	//error_reporting(0);// 2022cvt_011
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
// 2022cvt_015
		var O_view = new HealthcareSiteBatchView.HealthcareSiteBatchView();
// 2022cvt_015
		var O_model = new HealthcareSiteBatchModel.HealthcareSiteBatchModel(this.get_MtScriptAmbient());
// 		ini_set("error_reporting", E_ERROR);// 2022cvt_011
		// this.infoOut("\u66F4\u65B0\u958B\u59CB\n", 0);
		this.infoOut("更新開始\n", 0);
		this.set_Dirs(O_view.get_ScriptName());
		this.PactId = O_view.get_HArgv("-p");
		this.BillDate = O_view.get_HArgv("-y");
		this.Confirm = false;
// 2022cvt_017
// 2022cvt_015
		var d = new Date();
		// var y = date("Y");
		var y = d.getFullYear();
// 2022cvt_018
// 2022cvt_015
		// var m = date("m");
		var m = d.getMonth() - 1;
// 2022cvt_021
// 2022cvt_015
		var date = define.sprintf("%04d%02d", y, m);
// 2022cvt_015
		var tableNo = MtTableUtil.getTableNo(date, false);
// 2022cvt_015
		var pact_list = O_model.getPactList();
// 2022cvt_015
		var pactid_list = Array();
// 2022cvt_015
		var site_pact_list = O_view.getPact();
// 2022cvt_015
		var site_pactid_list = Object.keys(site_pact_list);

// 2022cvt_015
		// for (var value of Object.values(pact_list)) //会社登録する
		for (var value of pact_list) //会社登録する
		//既に登録されている
		{
// 2022cvt_015
			var oid = value.userid_ini;
// 2022cvt_015
			var name = value.compname;
			pactid_list.push(value.pactid);

			if (undefined !== site_pact_list[oid]) //既に登録されている
			{
				continue;
			}

// 2022cvt_015
			var res = O_view.registPact(oid, name);

			// if (is_null(res)) //登録に失敗した？
			if (!res) //登録に失敗した？
			{
				continue;
			}

			site_pact_list[res.organization_id] = {
				organization_name: res.organization_name,
				organization_internal_id: res.organization_internal_id
			};
		}

// 2022cvt_015
		// for (var pact_value of Object.values(pact_list)) //ヘルスケアランキングの対象部署を取得
		for (var pact_value of pact_list) //ヘルスケアランキングの対象部署を取得
		//部署ごとに見ていく
		{
			oid = pact_value.userid_ini;
// 2022cvt_015
			var post_list = O_model.getPost(pact_value.pactid, tableNo);
// 2022cvt_015
			var site_team_list = O_view.getTeam(pact_value.userid_ini);

// 2022cvt_015
			// for (var post_value of Object.values(post_list)) //この会社はサイトに登録されていない
			for (var post_value of post_list) //この会社はサイトに登録されていない
			{
// 2022cvt_015
				var team_id = post_value.userid_ini + "_" + post_value.postid;
// 2022cvt_015
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

					// if (!is_null(res)) {
					if (!res) {
						site_team_list[team_id] = {
							team_name: res.team_name,
							team_internal_id: res.team_internal_id
						};
					} else //登録できなかった
					{}
				}
			}

// 2022cvt_015
			var user_list = O_model.getHealthcareId(pact_value.pactid, tableNo);
// 2022cvt_015
			var site_user_list = O_view.getUser(oid);

// 2022cvt_015
			// for (var user_value of Object.values(site_user_list)) {
			for (var user_value of site_user_list) {
// 2022cvt_015
				var user_id = user_value.user_id;

				if (!(undefined !== user_list[user_id])) //ユーザー消えてる
					//消えない？？
				{
					O_view.deleteUser(oid, user_id);
				}
			}

// 2022cvt_015
			for (var user_id in user_list) //チームが存在するかチェック
			{
// 2022cvt_015
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

					// if (!is_null(res)) {
					if (!res) {
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
		throw process.exit(result);// 2022cvt_009
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
