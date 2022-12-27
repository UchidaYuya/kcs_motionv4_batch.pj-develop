//
//ＫＧ対応 KCS Motion上の電話の所属部署がＦＥＳＴＡ上の電話の部署情報と同じかをチェックする （Model）
//
//更新履歴：<br>
//2009/04/08 前田 聡 作成
//
//KgCheckTelnoPostidModel
//
//@package script
//@subpackage Model
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/04/08
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author maeda
//@since 2009/04/08
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//ファイル項目数チェック
//
//@author maeda
//@since 2009/04/08
//
//@param mixed $fileName：ファイル名
//@access public
//@return ファイルデータ
//
//
//ＦＥＳＴＡ電話所属部署データを電話と部署に分離して配列に格納する
//
//@author maeda
//@since 2009/04/09
//
//@param mixed $H_billData : 加工前データ
//@access public
//@return 電話番号をキー、ユーザ部署ＩＤを値とした連想配列データ
//
//
//__destruct
//
//@author maeda
//@since 2009/04/08
//
//@access public
//@return void
//
class KgCheckTelnoPostidModel extends ModelBase {
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	chkFestaData(fileName) //エラーフラグ（false:エラー無し、true:エラー有り）
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

			if (this.getSetting().DATA_COUNT != A_lineData.length) {
				errFlg = true;
				this.warningOut(1000, fileName + " " + lineCounter + "\u884C\u76EE\u306E\u9805\u76EE\u6570\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
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

	editFestaData(H_billData) //ファイル種類毎に処理する
	{
		var H_rtnData = Array();

		for (var fileType of Object.values(this.getSetting().A_FILE_HEAD_LIST)) //ファイルを１行ずつ処理する
		{
			for (var lineData of Object.values(H_billData[fileType])) //改行コード除去
			//文字コード変換
			//電話番号を取得
			//電話番号をキー、ユーザ部署ＩＤを値とした連想配列データ
			{
				var lineData = rtrim(lineData, "\r\n");
				lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");
				var telno = lineData.substr(0, 4);
				var userPostid = rtrim(lineData.substr(4, 5));
				H_rtnData[fileType][telno] = userPostid;
			}
		}

		return H_rtnData;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};