//
//ＳＵＯ 福山通運請求データ取込処理 （Model）
//
//更新履歴：<br>
//2010/02/03 宮澤龍彦 作成
//
//SuoImportFukuyamaModel
//
//@package SUO
//@subpackage Model
//@author miyazawa<miyazawa@motion.co.jp>
//@filesource
//@since 2010/02/03
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author miyazawa
//@since 2010/02/03
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//ファイル項目数チェック
//
//@author miyazawa
//@since 2010/02/03
//
//@param mixed $fileName：ファイル名
//@access public
//@return void
//
//
//請求取込に使用するデータを抜き出し加工して配列に格納する（利用明細）
//
//@author miyazawa
//@since 2010/02/03
//
//@param mixed $A_billData : 加工前データ
//@access public
//@return 利用明細用データ
//
//
//既に運送IDが登録されているかどうかチェック
//
//@author miyazawa
//@since 2010/03/08
//
//@param int $pactid : 契約ID
//@param string $tranid : 運送ID
//@param int $trancoid : 運送会社ID
//@param string $tablename : transit_xx_tbのテーブル名
//@access public
//@return 請求明細用データ
//
//
//__destruct
//
//@author miyazawa
//@since 2010/02/03
//
//@access public
//@return void
//
class ImportDocomoHealthModel extends ModelBase {
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
		var lineCounter = 0;
		var entryLine = 1;
		var A_fileData = file(fileName);

		if (A_fileData.length == 0) {
			errFlg = true;
			this.warningOut(1000, fileName + " \u304C\u4E0D\u6B63\u3067\u3059\n", 1);
		}

		for (var lineData of Object.values(A_fileData)) {
			lineCounter++;

			if (1 < lineCounter) //データは2行目から
				//カンマ区切り
				{
					var A_lineData = split("\\,", rtrim(lineData, "\r\n"));
					var line_num = A_lineData.length;

					if (line_num < this.getSetting().DATA_COUNT) {
						this.warningOut(1000, fileName + " " + lineCounter + "\u884C\u76EE\u306E\u9805\u76EE\u6570\u304C\u5C11\u306A\u3044\u3067\u3059\n", 1);
						errFlg = true;
					} else if (line_num > this.getSetting().DATA_COUNT) {
						this.infoOut(fileName + " " + lineCounter + "\u884C\u76EE\u306E\u9805\u76EE\u6570\u304C\u591A\u3044\u3067\u3059\n", 0);
					}
				}
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

	editBillData(pactid, A_billData) //ファイルを１行ずつ処理する
	{
		var H_rtnData = Array();

		for (var lineData of Object.values(A_billData)) //改行コード除去
		//文字コード変換
		//カラムに分割
		//カンマ区切り
		//データ
		//ヘルスケアID
		//各項目の取得
		//誕生日
		//身長
		//体重
		//基礎代謝
		//$H_data["datadate"] = preg_replace( '/(\d+)月(\d+)日/i','${1}-${2}',trim($A_lineData[6],"\"" ));	//	日付
		//日付
		//歩数
		//移動距離
		//消費カロリー
		//脂肪燃焼量
		//睡眠時間
		//測定開始時間
		//入眠時刻
		//起床時刻
		//中途覚醒時間(分)
		//空のテキストはNULLにする
		//ヘルスケアIDの配列を作る
		{
			var lineData = rtrim(lineData, "\r\n");
			lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");
			var A_lineData = split("\\,", rtrim(lineData));
			var H_data = Array();
			H_data.healthid = trim(A_lineData[0], "\"");

			switch (trim(A_lineData[1], "\"")) {
				case "\u7537":
					H_data.gender = 0;
					break;

				case "\u5973":
					H_data.gender = 1;
					break;
			}

			H_data.birthday = trim(A_lineData[2], "\"").replace(///g, "-");
			H_data.height = +trim(A_lineData[3], "\"");
			H_data.weight = +trim(A_lineData[4], "\"");
			H_data.metabolism = +trim(A_lineData[5], "\"");
			H_data.datadate = trim(A_lineData[6], "\"").replace(/(\d+)\/(\d+)/gi, "${1}-${2}");
			H_data.steps = +trim(A_lineData[7], "\"");
			H_data.move = +trim(A_lineData[8], "\"");
			H_data.calories = +trim(A_lineData[9], "\"");
			H_data.amount_fatburned = +trim(A_lineData[10], "\"");
			H_data.sleep = +trim(A_lineData[11], "\"");
			H_data.measurement_start = trim(A_lineData[12], "\"");
			H_data.onset_sleep = trim(A_lineData[13], "\"");
			H_data.wakeup = trim(A_lineData[14], "\"");
			H_data.arousal_during_sleep = +trim(A_lineData[15], "\"");

			for (var key in H_data) {
				var value = H_data[key];

				if (value === "") {
					H_data[key] = undefined;
				}
			}

			if (!(undefined !== H_rtnData[H_data.healthid])) {
				H_rtnData[H_data.healthid] = Array();
			}

			H_rtnData[H_data.healthid].push(H_data);
		}

		return H_rtnData;
	}

	healthcareIsExist(pactid, healthid, healthcoid, tablename = "healthcare_tb") {
		var sql = "SELECT count(*) FROM " + tablename + " WHERE pactid=" + pactid + " AND healthid='" + healthid + "' AND healthcoid=" + healthcoid;
		return this.get_DB().queryOne(sql);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};