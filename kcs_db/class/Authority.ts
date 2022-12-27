//機能権限クラス
//
//修正履歴<br>
//2004/05/09 各メソッドの初期値を修正 上杉勝史<br>
//2004/05/09 メソッドgetAllFuncを追加 上杉勝史<br>
//2004/05/27 森原	chkUserAuthで、エラー画面を出さない機能を追加<br>
//getFollowerPostで、過去分を検索可能に
//2004/11/18 宮澤 getFollowerAndRecogPost追加 宮澤龍彦
//2004/11/19 宮澤 getFollowerAndRecogPost修正 宮澤龍彦
//2005/02/24 chkPactAuthで、エラー画面を出さない機能を追加 上杉勝史
//2006/11/20 chkFollowerETCを追加 宝子山
//2007/10/01 夜間注文用判定関数を追加 chkPathAuthExtend
import DBUtil from './DBUtil';
import ErrorUtil from './ErrorUtil';
const PATH = require('path');

export default class Authority {
	hhmm: any;
	extend: any;
	constructor() //$this->hhmm = 200;
	//夜間注文ステータスを取得
	//このしたのコメントアウトをはずし、上の一行を削除する
	//$this->extend = BusinessDay::chkBizTime();
	
	{
		if (global.GO_db == false) {
			global.GO_db = new DBUtil();
		}

		if (global.GO_errlog == false) {
			global.GO_errlog = new ErrorUtil();
		}

		this.getTime();
		this.extend = "normal";
	}

	getAllPactAuth(pactid = "") //有効無効フラグ true:有効、false:無効
	//2007-10-02 katsushi 夜間注文対応
	//権限ＩＤのリストを返す
	{}

	getAllUserAuth(userid = "", time = false, supers = false) //権限ＩＤのリストを返す
	{}

	getAllUserAuthHashEng(userid = "", time = false, supers = true, assoc = false) //有効無効フラグ true:有効、false:無効
	//権限ＩＤのリストを返す
	{}

	chkPactAuth(fncid: number, pactid = "", myerr = false) //利用可能終了時間
	{}

	chkUserAuth(fncid: string, userid = "", myerr = false) //有効無効フラグ true:有効、false:無効
	//2007-10-02 katsushi 夜間注文対応
	{}

	chkUserAuthAll(fncid: string, userid = "") //有効無効フラグ true:有効、false:無効
	{}

	chkPathAuth(userid = "", path = "") //2007-10-02 katsushi 夜間注文対応
	{}

	chkSuperUser() {}

	getAllFunc(userid = "") {}

	getFollowerAndRecogPost(orderid: string, postid = "", pactid = "") {}

	checkFollowerUser(targetuserid: string, postid = "", pactid = "") {}

	checkRecog(postid = "") {}

	getTime() //jokerでログインした場合は現在時間を１２時にする
	{}

	checkFollowerTel(targettelno: string, carid: string, tableno = "", postid = "", pactid = "") //電話の部署ＩＤ取得
	{}

	checkFollowerTelReserve(targettelno: string, carid: string, postid = "", pactid = "") {}

	checkFollowerETC(etc_cardno: string, tableno = "", postid = "", pactid = "") //電話の部署ＩＤ取得
	{}

	getPactID(userid = "") {}

	getUseridIni(pactid = "") {}

};
