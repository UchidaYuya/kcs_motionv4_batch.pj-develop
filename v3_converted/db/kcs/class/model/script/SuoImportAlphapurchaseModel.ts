//
//ＳＵＯ アルファパーチェス購買データ取込処理 （Model）
//
//更新履歴：<br>
//2008/06/05 前田 聡 作成
//
//SuoImportAlphapurchaseModel
//
//@package SUO
//@subpackage Model
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2008/06/05
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author maeda
//@since 2008/04/23
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//請求取込に使用するデータを抜き出し加工して配列に格納する
//
//@author maeda
//@since 2008/04/30
//
//@param mixed $A_billData : 加工前データ
//@access public
//@return 請求取り込み用データ
//
//
//__destruct
//
//@author maeda
//@since 2008/04/23
//
//@access public
//@return void
//
class SuoImportAlphapurchaseModel extends ModelBase {
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
			var A_lineData = split(",", rtrim(lineData, "\r\n"));

			if (this.getSetting().DATA_COUNT != A_lineData.length) {
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
		//アルファパーチェスのエコフラグをKCS Motionでのエコフラグに付け替え
		//数量＆金額がマイナスなら赤伝扱いする
		//必要なデータのみ保持する array(申請者アカウント => array(受注日 => array(受注番号 => array(赤黒区分 => array(受注明細番号 => DBDATA)))
		{
			var lineData = rtrim(lineData, "\r\n");
			lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");
			var A_lineData = split(",", rtrim(lineData));
			A_lineData[33] = str_replace("n", 0, A_lineData[33].toLowerCase());
			A_lineData[33] = str_replace("y", 1, A_lineData[33].toLowerCase());
			A_lineData[34] = str_replace("n", 0, A_lineData[34].toLowerCase());
			A_lineData[34] = str_replace("y", 1, A_lineData[34].toLowerCase());
			A_lineData[35] = str_replace("n", 0, A_lineData[35].toLowerCase());
			A_lineData[35] = str_replace("y", 1, A_lineData[35].toLowerCase());

			if (A_lineData[18] < 0 && A_lineData[19]) {
				var akakuro = 1;
			} else {
				akakuro = 0;
			}

			H_rtnData[A_lineData[32] + ""][A_lineData[7]][A_lineData[11]][akakuro][A_lineData[12]] = {
				registcomp: A_lineData[3],
				registpost: A_lineData[5],
				username: A_lineData[6],
				itemcode: A_lineData[14],
				itemname: A_lineData[15],
				itemsum: A_lineData[18],
				charge: A_lineData[19],
				tax: A_lineData[24],
				shiptoname1: A_lineData[29],
				shiptoname2: A_lineData[30],
				shiptoname3: A_lineData[31],
				green1: A_lineData[33],
				green2: A_lineData[34],
				green3: A_lineData[35],
				delcharge: A_lineData[36],
				delchargetax: A_lineData[37]
			};
		}

		return H_rtnData;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};