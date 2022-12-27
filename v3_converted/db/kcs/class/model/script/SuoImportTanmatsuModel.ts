//
//ＳＵＯ 端末購買データ（ＫＣＳ）取込処理 （Model）
//
//更新履歴：<br>
//2008/04/01 前田 聡 作成
//
//SuoImportTanmatsuModel
//
//@package SUO
//@subpackage Model
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2008/04/01
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

class SuoImportTanmatsuModel extends ModelBase {
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	chkBillData(fileName) //エラーフラグ（false:エラー無し、true:エラー有り）
	//チェック完了したデータを格納
	//行番号
	//ファイル読み込み
	//データが１行もなかった場合はエラー
	//エラー無し
	{
		var errFlg = false;
		var H_checkedData = Array();
		var lineCounter = 1;
		var A_fileData = file(fileName);

		if (A_fileData.length == 0) {
			errFlg = true;
			this.warningOut(1000, fileName + " \u304C\u4E0D\u6B63\u3067\u3059\n", 1);
		}

		for (var lineData of Object.values(A_fileData)) //項目数エラー
		{
			var A_lineData = split(",", rtrim(lineData));

			if (this.getSetting().TANMATSU_DATA_COUNT != A_lineData.length) {
				errFlg = true;
				this.warningOut(1000, fileName + " " + lineCounter + "\u884C\u76EE\u306E\u9805\u76EE\u6570\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
			}

			if ("" == A_lineData[0] || "" == A_lineData[1] || "" == A_lineData[3] || "" == A_lineData[4]) {
				errFlg = true;
				this.warningOut(1000, fileName + " " + lineCounter + "\u884C\u76EE\u306E\u30C7\u30FC\u30BF\u306B\u7A7A\u6B04\u304C\u3042\u308A\u307E\u3059\n", 1);
			}

			if (-1 !== this.getSetting().A_CARNO_LIST.indexOf(A_lineData[4]) == false) {
				errFlg = true;
				this.warningOut(1000, fileName + " " + lineCounter + "\u884C\u76EE\u306E\u30AD\u30E3\u30EA\u30A2\u756A\u53F7\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
			}

			lineCounter++;
		}

		if (false == errFlg) //ファイルデータを返す
			//エラー有り
			{
				return A_fileData;
			} else {
			return false;
		}
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};