//
//SUOパーク２４請求データ取込処理 （Model）
//
//更新履歴：<br>
//2010/11/29 宝子山浩平 作成
//
//SuoImportPark24Model
//
//@package SUO
//@subpackage Model
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2010/11/29
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author houshiyama
//@since 2010/11/29
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//請求データディレクトリ取得
//
//@author
//@since 2010/11/30
//
//@param mixed $BillDate
//@access public
//@return void
//
//
//ファイル内容をかみ砕いて取得<br>
//DBのテーブルに合わせた形に加工
//
//@author
//@since 2010/12/08
//
//@param mixed $pactid
//@param mixed $fileName
//@access public
//@return void
//
//
//__destruct
//
//@author houshiyama
//@since 2010/11/29
//
//@access public
//@return void
//
class SuoImportPark24Model extends ModelBase {
	static SEIKYU_CODE = "002";
	static SEIKYU_CODENAME = "\u8ACB\u6C42\u91D1\u984D";
	static CHUSHA_CODE = "001";
	static CHUSHA_CODENAME = "\u99D0\u8ECA\u6599\u91D1";
	static ASPX_CODE = "ASPX";
	static ASPX_CODENAME = "ASP\u4F7F\u7528\u6599\uFF08\u7A0E\u8FBC\uFF09";

	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	getDataDir(BillDate) {
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + BillDate + this.getSetting().PARK24_DIR + "/";
		return dataDir;
	}

	getBillData(pactid, fileName) //エラーフラグ（false:エラー無し、true:エラー有り）
	//行番号
	//チェック完了したデータを格納
	//ファイル読み込み
	//データが１行もなかった場合はエラー
	//エラー無し
	{
		var errFlg = false;
		var cnt = 0;
		var H_data = Array();
		var A_fileData = file(fileName);

		if (A_fileData.length == 0) {
			errFlg = true;
			throw new Error(fileName + " \u304C\u4E0D\u6B63\u3067\u3059\n", 1);
		}

		for (var line of Object.values(A_fileData)) {
			cnt++;

			if (1 < cnt) //データは2行目から
				//カンマ区切り
				//項目数エラー
				{
					var A_line = split("\\,", rtrim(mb_convert_encoding(line, "UTF8", "SJIS"), "\r\n"));

					if (this.getSetting().DATA_COUNT != A_line.length && this.getSetting().DATA_COUNT != A_line.length + 1) {
						errFlg = true;
						this.warningOut(1000, fileName + " " + cnt + "\u884C\u76EE\u306E\u9805\u76EE\u6570\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
					}

					var H_tmp = Array();
					var H_date = strptime(A_line[4], "%Y/%m/%d %H:%M");
					H_tmp.pactid = pactid;
					H_tmp.postname = A_line[1];
					H_tmp.cardno_view = A_line[3];
					H_tmp.cardno = A_line[3].replace(/-/g, "");
					H_tmp.in_id = A_line[4].replace(/\//g, "-");
					H_tmp.out_id = A_line[5].replace(/\//g, "-");
					H_tmp.charge = A_line[7];
					H_tmp.note = "\u99D0\u8ECA\u6642\u9593/\uFF08\u5206\uFF09\uFF1A" + A_line[6];
					H_tmp.car_type = A_line[8];
					H_tmp.in_name = A_line[9];

					if (true == (undefined !== A_line[10])) {
						H_tmp.discount1 = "\u8ECA\u5BA4\u756A\u53F7\uFF1A" + A_line[10];
					} else {
						H_tmp.discount1 = "";
					}

					H_tmp.code = SuoImportPark24Model.CHUSHA_CODE;
					H_tmp.codename = SuoImportPark24Model.CHUSHA_CODENAME;
					H_tmp.date = A_line[4];
					H_tmp.recdate = this.get_DB().getNow();
					H_tmp.fixdate = this.get_DB().getNow();
					H_tmp.delete_flg = "false";
					H_tmp.date = H_date.tm_year + 1900 + "-" + (H_date.tm_mon + 1) + "-" + H_date.tm_mday;
					H_tmp.cardcoid = this.getSetting().PARK24_CARDCOID;
					H_data.push(H_tmp);
				}
		}

		if (false == errFlg) //ファイルデータを返す
			//エラー有り
			{
				return H_data;
			} else {
			return false;
		}
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};