//
//ＫＧ通話明細データ（転送用詳細ファイル）取込処理 （Model）
//
//更新履歴：<br>
//2009/05/11 前田 聡 作成
//2009/10/19 通話先所在地欄に呼種区分を入れる 前田
//
//KgImportTuwaModel
//
//@package script
//@subpackage Model
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/05/11
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author maeda
//@since 2009/05/11
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//ファイル項目数チェック
//
//@author maeda
//@since 2009/05/12
//
//@param mixed $fileName：ファイル名
//@access public
//@return ファイルデータ
//
//
//請求取込に使用するデータを抜き出し加工して配列に格納する
//
//@author maeda
//@since 2009/05/13
//
//@param mixed $H_billData : 加工前データ
//@access public
//@return 請求取り込み用データ
//
//
//拠点毎に登録されている電話番号を取得する
//
//@author maeda
//@since 2009/05/08
//
//@param mixed $pactid 契約ＩＤ
//@param mixed $tableno 対象テーブルＮＯ
//@param array $carid 対象carid
//@access public
//@return array(basename(予備項目１) => array(telno))
//
//更新履歴
//
//
//__destruct
//
//@author maeda
//@since 2009/05/11
//
//@access public
//@return void
//
class KgImportTuwaModel extends ModelBase {
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	chkBillData(fileName, baseName) //エラーフラグ（false:エラー無し、true:エラー有り）
	//行番号
	//ファイル読み込み
	//データが１行もなかった場合はエラー
	//エラー無し
	{
		var errFlg = false;
		var lineCounter = 1;
		var A_fileData = file(fileName);

		if (A_fileData.length == 0) {
			errFlg = true;
			this.warningOut(1000, fileName + " \u304C\u4E0D\u6B63\u3067\u3059\n", 1);
		}

		for (var lineData of Object.values(A_fileData)) //項目数エラー
		{
			var A_lineData = split(this.getSetting().DELIM_TUWA, rtrim(lineData, "\r\n"));

			if (this.getSetting().DATA_COUNT_TUWA != A_lineData.length) {
				errFlg = true;
				this.warningOut(1000, fileName + " " + lineCounter + "\u884C\u76EE\u306E\u9805\u76EE\u6570\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
			}

			lineCounter++;
		}

		if (false == errFlg) //ファイルデータを返す
			//エラー有り
			{
				return {
					[baseName]: A_fileData
				};
			} else {
			return false;
		}
	}

	editBillData(H_billData) //拠点一覧を取得
	//拠点を１件ずつ処理する
	//拠点を１件ずつ処理する END
	{
		var H_rtnData = Array();
		var A_baseName = Object.keys(H_billData);
		A_baseName.sort();

		for (var baseName of Object.values(A_baseName)) //ファイルを１行ずつ処理する
		//ファイルを１行ずつ処理する END
		{
			for (var lineData of Object.values(H_billData[baseName])) //改行コード除去
			//文字コード変換
			//カラムに分割
			//発信種別が内線発信のもののみ取り込む
			//開始年月日を整形
			//通話時間を整形
			//2009/10/19 通話先所在地欄に呼種区分を入れる 前田
			//配列へ格納
			{
				var lineData = rtrim(lineData, "\r\n");
				lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");
				var A_lineData = split(this.getSetting().DELIM_BILL, rtrim(lineData));

				if (trim(A_lineData[2], "\"") != this.getSetting().NAISEN) {
					continue;
				}

				var telno = trim(A_lineData[13], "\"");
				var tmpDate = trim(A_lineData[16], "\"");
				var date = tmpDate.substr(0, 4) + "-" + tmpDate.substr(4, 2) + "-" + tmpDate.substr(6, 2) + " " + tmpDate.substr(8, 2) + ":" + tmpDate.substr(10, 2) + ":" + tmpDate.substr(12, 2);
				var tmpTime = trim(A_lineData[3], "\"");
				var hour = Math.floor(tmpTime / 3600);

				if (hour < 10) {
					hour = "0" + hour;
				}

				var time = sprintf("%s%s", hour, gmdate("is", tmpTime % 3600)) + "0";
				var tmpKosyu = "KOSYU_NAME" + trim(A_lineData[9], "\"");
				var kosyu = this.getSetting()[tmpKosyu];

				if (undefined !== H_rtnData[baseName][telno] == false) //必要なデータのみ保持する array(拠点名(array(電話番号 => DBDATA)))
					//２重引用符除去
					{
						H_rtnData[baseName][telno] = [{
							date: date,
							time: time,
							totelno: trim(A_lineData[20], "\""),
							charge: +trim(A_lineData[4], "\""),
							toplace: kosyu
						}];
					} else {
					H_rtnData[baseName][telno].push({
						date: date,
						time: time,
						totelno: trim(A_lineData[20], "\""),
						charge: +trim(A_lineData[4], "\""),
						toplace: kosyu
					});
				}
			}
		}

		return H_rtnData;
	}

	getTelnoBasename(pactid, tableno = undefined, carid) //現在テーブル
	//レコード数
	//１行ずつ処理し連想配列に格納する array(text1 => telno)
	{
		var H_dbData = Array();

		if (undefined == tableno) //過去テーブル
			{
				var tableName = "tel_tb";
			} else {
			tableName = "tel_" + tableno + "_tb";
		}

		var sql = "select telno,text1 " + "from " + tableName + " " + "where pactid = " + pactid + " " + "and carid = " + carid + " " + "order by text1,telno";
		var H_result = this.getDB().queryHash(sql);
		var recCnt = H_result.length;

		for (var recCounter = 0; recCounter < recCnt; recCounter++) {
			if (false == (undefined !== H_dbData[H_result[recCounter].text1])) {
				H_dbData[H_result[recCounter].text1] = [H_result[recCounter].telno];
			} else {
				H_dbData[H_result[recCounter].text1].push(H_result[recCounter].telno);
			}
		}

		return H_dbData;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};