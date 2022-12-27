//
//ＳＵＯ リコーコピー機請求データ取込処理 （Model）
//
//更新履歴：<br>
//2008/06/27 前田 聡 作成
//
//SuoImportRicohBillModel
//
//@package SUO
//@subpackage Model
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2008/06/27
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author maeda
//@since 2008/06/27
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//chkBillData
//
//@author maeda
//@since 2008/06/30
//
//@param mixed $fileName：ファイル名
//@access public
//@return ファイルデータ
//
//
//請求取込に使用するデータを抜き出し加工して配列に格納する
//
//@author maeda
//@since 2008/06/30
//
//@param mixed $A_billData : 加工前データ
//@access public
//@return 請求取り込み用データ
//
//
//__destruct
//
//@author maeda
//@since 2008/06/27
//
//@access public
//@return void
//
class SuoImportRicohBillModel extends ModelBase {
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
			var A_lineData = split("\t", rtrim(lineData, "\r\n"));

			if (this.getSetting().DATA_COUNT_BILL != A_lineData.length) {
				errFlg = true;
				this.warningOut(1000, fileName + " " + lineCounter + "\u884C\u76EE\u306E\u9805\u76EE\u6570\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
			}

			lineCounter++;
		}

		if (false == errFlg) //ヘッダー行を除去
			//ファイルデータを返す
			//エラー有り
			{
				var A_rtnData = A_fileData.splice(1);
				return A_rtnData;
			} else {
			return false;
		}
	}

	editBillData(A_billData) //ファイルを１行ずつ処理する
	{
		var H_rtnData = Array();

		for (var lineData of Object.values(A_billData)) //改行コード除去
		//文字コード変換
		//カラムに分割
		//必要なデータのみ保持する array(コピー機ＩＤ => DBDATA)
		//２重引用符、３桁区切り文字除去
		{
			var lineData = rtrim(lineData, "\r\n");
			lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");
			var A_lineData = split("\t", rtrim(lineData));
			H_rtnData[trim(A_lineData[3], "\"") + ""] = {
				copyname: trim(A_lineData[0], "\""),
				monocnt: str_replace(",", "", trim(A_lineData[4], "\"")),
				monocntpast: str_replace(",", "", trim(A_lineData[5], "\"")),
				colorcnt: str_replace(",", "", trim(A_lineData[6], "\"")),
				colorcntpast: str_replace(",", "", trim(A_lineData[7], "\"")),
				charge: str_replace(",", "", trim(A_lineData[12], "\"")),
				tax: str_replace(",", "", trim(A_lineData[13], "\""))
			};
		}

		return H_rtnData;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};