//修正2004/06/25 中西 SHOPエラー時の戻り先追加.
//修正2004/06/29 森原 メインメニューに戻るエラー種別を追加可能に
//修正2004/07/09 宮澤 ワーニング画面の戻り先を指定できるように変更
//修正2004/07/30 宮澤 エラー画面の戻るボタンの文言を指定できるように変更
//修正2005/02/21 勝史 エラー画面からトップメニューにもどる機能を追加
//修正2006/12/06 石崎 二重ログイン防止用エラーコードを A_error_topmenu に追加
//修正2009/02/02 石崎　エラー時の戻りURLのグループ化抜け
//修正2009/08/12 宮澤　別ドメイン対応
import Logger from "./log";
import { KCS_DIR } from "../conf/batch_setting";

export default class ErrorUtil {
	static HLINDEX_I = "/Hotline/index.htm";
	static HLINDEX_D = "/Hotline/";
	A_error_main: any;
	A_error_topmenu: any;
	O_errlog: any;
	to_mail: any;
	
	constructor() //20040629森原追加
	{
		Logger.initialize();
		var logopt = {
			mode: 600,
			timeFormat: "%Y/%m/%d %X"
		};
		this.O_errlog = Logger.singleton("file", KCS_DIR + "/log/err.log", "", logopt);
		this.to_mail = global.def_errorto;
		this.A_error_main = [7, 8, 9, 10, 32];
		this.A_error_topmenu = [1, 12];
	}

	addMain(err: number) {
		this.A_error_main.push(err);
	}

	errorOut(code: number, errstr = "", mailflg = 1) //ログ吐き出しオブジェクト
	//グループとホットラインの対応
	//画面表示
	{}

	warningOut(code: number, errstr = "", displayflg = 1, goto = "", buttonstr = "戻 る") //$displayflgのデフォルト値を1にした 20070723miya
	{}

	getErrorMessage(code: number ) //// DBクラスを呼べない（呼ぶとループになってしまう）ので独自に接続
	{}

	toMail(address: any) {
		this.to_mail = address;
	}
};
