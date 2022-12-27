//
//ＫＧ ＦＥＳＴＡ用データ出力処理 （Model）
//
//更新履歴：<br>
//2009/04/23 前田 聡 作成
//
//KgExportBillModel
//
//@package script
//@subpackage Model
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/04/23
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author maeda
//@since 2009/04/23
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//tel_details_X_tbよりデータを取得する
//
//@author maeda
//@since 2009/04/23
//
//@param mixed $pactid     pactid
//@param mixed $tableno    テーブル番号
//@param array $carid      キャリアＩＤ
//@param array $baseName   拠点名
//@param array $A_code_list	内訳種別コードリスト
//@access public
//@return データ配列 array(telno => 料金)
//
//
//__destruct
//
//@author maeda
//@since 2009/04/23
//
//@access public
//@return void
//
class KgExportBillModel extends ModelBase {
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	getTelDetailsDataBaseName(pactid, tableno, carid, baseName, A_code_list) //拠点が東京
	//レコード数
	//１行ずつ処理し連想配列に格納する array(telno => 料金))
	{
		var H_dbData = Array();
		var where = "where te.pactid = " + pactid + " and " + "te.carid = " + carid + " and " + "td.code in ('" + A_code_list.join("','") + "') and " + "te." + this.getSetting().BASENAME_COL + " = '";

		if (baseName == this.getSetting().FILE_HEAD_TOKYO) //同一電話番号用文字列置換え用
			//拠点が大阪
			{
				where += "\u6771\u4EAC'";
				var replaceStr = this.getSetting().LINE_BRANCH_TKY;
			} else if (baseName == this.getSetting().FILE_HEAD_OSAKA) //同一電話番号用文字列置換え用
			{
				where += "\u5927\u962A'";
				replaceStr = this.getSetting().LINE_BRANCH_OSK;
			} else {
			this.errorOut(1000, "\u62E0\u70B9\u540D\u304C\u4E0D\u6B63\u3067\u3059\n", 0, "", "");
			return false;
		}

		var sql = "select te.telno,sum(td.charge) as charge " + "from tel_" + tableno + "_tb te inner join tel_details_" + tableno + "_tb td " + "on te.pactid = td.pactid and " + "te.carid = td.carid and " + "te.telno = td.telno " + where + " " + "group by te.telno " + "order by te.telno";
		var H_result = this.getDB().queryHash(sql);
		var recCnt = H_result.length;

		for (var recCounter = 0; recCounter < recCnt; recCounter++) {
			H_dbData[str_replace(replaceStr, "", H_result[recCounter].telno)] = H_result[recCounter].charge;
		}

		return H_dbData;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};