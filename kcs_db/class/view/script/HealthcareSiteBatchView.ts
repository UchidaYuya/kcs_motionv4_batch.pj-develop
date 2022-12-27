//
// //error_reporting(E_ALL|E_STRICT);// 2022cvt_011
//
//HealthcareRegistTeamView
//
//@uses ViewBaseScript
//@package
//@author web
//@since 2016/04/22
//

// 2022cvt_026
require("view/script/ViewBaseScript.php");

// 2022cvt_026
require("MtScriptArgs.php");

// 2022cvt_026
require("view/script/HealthcareSiteBaseView.php");

//
//スクリプト実行オプション処理クラス
//
// 2022cvt_015
//@var mixed
//@access public
//
//
//デストラクタ
//
//@author miyazawa
//@since 2010/02/03
//
//@access public
//@return void
//
class HealthcareSiteBatchView extends HealthcareSiteBaseView {
	constructor() //親のコンストラクタを必ず呼ぶ
	//$A_arg_help[] = array(
	//							"-y",
	//							"YYYYMMnone",
	//							"請求年月\t\tYYYY:年,MM:月,none:指定なし(recalcのみ有効)"
	//						);
	//		$A_arg_help[] = array(
	//							"-p",
	//							"pactid",
	//							"契約ＩＤ\t\tall:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行"
	//						);
	//		if( $this->get_ScriptName() == "calc_addbill.php" ){
	//			$A_arg_help[] = array(
	//							"-c",
	//							"CharSwitch",
	//							"確定を請求年月にコピー\tY:する,N:しない",
	//							"Y,N",
	//						);
	//		}
	//// 引数がおかしかった場合に使用法を表示し終了
	//function go_usage($message,$argv=""){
	//	print "\n\n";
	//	print $message . ":" . $argv . "\n";
	//	print "php card_calc.php [m|p|y|c]=各パラメータ(指定なしのデフォルト値)\n\n";
	//	print "		-m={0|1}			実行前に問い合わせる場合は1(1)\n";
	//	print "		-p=pactid		処理対象顧客（全顧客）\n";
	//	print "		-y=yyyymm		処理対象請求年月（現在の年月）\n";
	//	print "		-c=cardcoid		処理対象請求元会社ID（全会社）\n";
	//	exit(1);
	//}
	{
		super();
		this.healthcare_ini = parse_ini_file(KCS_DIR + "/conf_sync/healthcare_site.ini");
		this.secret = base64_encode(this.healthcare_site_ini.OAuth2Secret);
		this.url = this.healthcare_site_ini.url;
// 2022cvt_015
		var A_arg_help = Array();
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\n");
		}

		this.checkArg(this.O_MtScriptArgs);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};
