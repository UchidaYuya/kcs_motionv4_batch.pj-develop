
import ModelBase from '../../model/ModelBase'
import MtScriptAmbient from '../../MtScriptAmbient';
import * as Encoding from 'encoding-japanese';
import * as fs from 'fs';

export  class SuoImportFukuyamaModel extends ModelBase {
	O_msa: MtScriptAmbient;

	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	chkBillData(fileName: string) //エラーフラグ（false:エラー無し、true:エラー有り）
	//チェック完了したデータを格納
	//行番号
	//ファイル読み込み
	//データが１行もなかった場合はエラー
	//エラー無し
	{
		var errFlg = false;
		var H_checkedData = Array();
		var lineCounter = 0;
		// var A_fileData = file(fileName);
		var A_fileData = fs.readFileSync(fileName).toString().split('\r\n');

		if (A_fileData.length == 0) {
			errFlg = true;
			// this.warningOut(1000, fileName + " \u304C\u4E0D\u6B63\u3067\u3059\n", 1);
			this.warningOut(1000, fileName + " が不正です\n", 1);
		}

		// for (var lineData of Object.values(A_fileData)) {
		for (var lineData of A_fileData) {
			lineCounter++;

			if (true == 2 < lineCounter) //データは三行目から
				//カンマ区切り
				//項目数エラー
				{
					// var A_lineData = split("\\,", rtrim(lineData, "\r\n"));
					var A_lineData = lineData.replace("\r\n", "").split("\\,");


					if (this.getSetting().get("DATA_COUNT") != A_lineData.length - 1) //最後がカンマで終わるので一個多くカウントされるのを-1
						{
							errFlg = true;
							// this.warningOut(1000, fileName + " " + lineCounter + "\u884C\u76EE\u306E\u9805\u76EE\u6570\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
							this.warningOut(1000, fileName + " " + lineCounter + "行目の項目数が不正です\n", 1);
						}
				}
		}

		if (false == errFlg) //ヘッダー行を除去
			//ファイルデータを返す
			//エラー有り
			{
				// var A_rtnData = A_fileData.splice(2);
				var A_rtnData = A_fileData.splice(1);
				return A_rtnData;
			} else {
			return false;
		}
	}

	editBillData(A_billData: any[]) //原票番号複数対応 20100802miya
	//このリストは同じ原票番号が重複する（来たものをどんどん入れていく））
	//ファイルを１行ずつ処理する
	{
		var H_rtnData = Array();
		var A_code_list = Array();

		// for (var lineData of Object.values(A_billData)) //改行コード除去
		for (var lineData of A_billData) //改行コード除去

		//文字コード変換
		//カラムに分割
		//カンマ区切り
		//原票番号の頭の数字の意味
		//99         ：往復宅配便
		//9［9以外］ ：メール便
		//1          ：着払い
		//2          ：着払い
		//3          ：宅配便
		//金額がマイナスの場合は数量をマイナスにする
		//福山通運では個数不要
		//if((trim($A_lineData[14],"\"") * 1) < 0){
		//$itemsum = trim($A_lineData[12],"\"") * (-1);
		//}else{
		//$itemsum = trim($A_lineData[12],"\"") * 1;
		//}
		//行番号（原票番号複数対応）
		//原票番号それぞれの今までの出現回数を数える
		//行番号出してから原票番号を配列に入れる
		//重量
		//荷受人住所
		//荷受人名称
		//■があったら除去
		//荷受人TEL
		//備考
		//必要なデータのみ保持する array(得意先コード => array(発送年月 => array(原票番号 => array(行番号 => DBDATA)))
		//２重引用符除去、小数点以下切捨て
		{
			// var lineData = rtrim(lineData, "\r\n");
			var lineData = lineData.replace("\r\n", "");
			// lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");

			const buffer = fs.readFileSync(lineData, 'utf8');
			const text = Encoding.convert(buffer, {
				from: 'SJIS',
				to: 'UNICODE', 
				type: 'string',
			});

			// var A_lineData = split("\\,", rtrim(lineData));
			var A_lineData = lineData.replace(lineData, "").split("\\,");
			// var charge = trim(A_lineData[14], "\"") * 1;
			var charge = A_lineData[14].replace("\"", "") * 1;
			// var lineno = undefined;
			var lineno;
			// var H_cl = array_count_values(A_code_list);
			var counts = {};
			for(var i=0;i< A_code_list.length;i++)
			{
				var key = A_code_list[i];
				counts[key] = counts[key] ? counts[key] + 1 : 1 ;
			}

			// if (true == Array.isArray(H_cl) && 0 < H_cl.length) {
			if (true == Array.isArray(A_code_list) && 0 < A_code_list.length) {
				// if (true == (undefined !== H_cl[A_lineData[11]]) && true == is_numeric(H_cl[A_lineData[11]])) {
				if (true == (undefined !== A_code_list[A_lineData[11]]) && true == !isNaN(Number(A_code_list[A_lineData[11]]))) {
					lineno = A_code_list[A_lineData[11]];
				}
			}

			// if (undefined == lineno || false == is_numeric(lineno)) {
			if (undefined == lineno || false == !isNaN(Number(lineno))) {
				lineno = 0;
			}

			A_code_list.push(A_lineData[11]);

			if ("9" == A_lineData[11].substring(0, 1) && "9" != A_lineData[11].substring(1, 1)) //メール便はなし（空白）
				{
					var weight = 0;
				} else {
				// weight = trim(A_lineData[13], "\"");
				weight = A_lineData[13].replace("\"");
			}

			// var to_address1 = trim(A_lineData[20], "\"");
			var to_address1 = A_lineData[20].replace("\"");
			// var to_address2 = trim(A_lineData[21], "\"");
			var to_address2 = A_lineData[21].replace("\"");


			if ("9" == A_lineData[11].substring(0, 1) && "9" != A_lineData[11].substring(1, 1)) //メール便は「メール便」
				{
					// var to_name1 = "\u30E1\u30FC\u30EB\u4FBF";
					var to_name1 = "メール便";

					var to_name2 = "";
				} else {
				// if (true == is_numeric(trim(A_lineData[22], "\"")) || "" == trim(A_lineData[22], "\"") || undefined == trim(A_lineData[22], "\"")) //荷受人名称１が数字もしくは空白なら荷受人住所１を表示
				if (true == !isNaN(Number(A_lineData[22].replace("\""))) || "" == A_lineData[22].split("\"") || undefined == A_lineData[22].split( "\"")) //荷受人名称１が数字もしくは空白なら荷受人住所１を表示
					
				{
						to_name1 = to_address1;
						// to_name2 = undefined;
						to_name2 = "";
					} else {
					to_name1 = A_lineData[22].replace("\"");
					to_name2 = A_lineData[23].replace("\"");
				}
			}

			if (true == (0 < to_name1.length)) {
// 2022cvt_020
				// to_name1 = str_replace("\u25A0", "", to_name1);
				to_name1 = to_name1.replace("■", "");
			}

			if (true == (0 < to_name2.length)) {
// 2022cvt_020
				// to_name2 = str_replace("\u25A0", "", to_name2);
				to_name2 = to_name2.replace("■", "");
			}

			var to_name = String(to_name1 + String(to_name2));

			// if (true == is_numeric(trim(A_lineData[25], "\""))) //荷受人TELが数字の場合、戦闘に「0」を追加
			if (true == !isNaN(Number(A_lineData[25].replace("\"")))) //荷受人TELが数字の場合、戦闘に「0」を追加
				
			{
					// var to_telno = trim(A_lineData[25], "\"");
					var to_telno = A_lineData[25].replace("\"");
					to_telno = "0" + String(to_telno);
				} else //荷受人ＴＥＬが数字ではなく、荷受人名称１が数字の場合は、荷受人名称１の頭に"0"を追加
				{
					// if (false == is_numeric(trim(A_lineData[25], "\"")) && true == is_numeric(trim(A_lineData[22], "\""))) {
						if (false == !isNaN(Number(A_lineData[25].replace("\""))) && true == !isNaN(Number(A_lineData[22].replace("\"")))) {
						// to_telno = trim(A_lineData[22], "\"");
						to_telno = A_lineData[22].replace("\"");
						to_telno = "0" + String(to_telno);
					} else {
						// to_telno = trim(A_lineData[25], "\"");
						to_telno = A_lineData[25].replace("\"");

					}
				}

			if (0 < A_lineData[24].length) //元から備考にデータがあれば、それを使う
				{
					var comment = A_lineData[24];
				} else if ("1" == A_lineData[11].substring(0, 1) || "2" == A_lineData[11].substring(0, 1)) //着払いは「着払い」と表示
				{
					// comment = "\u7740\u6255\u3044";
					comment = "着払い";
				} else if ("99" == A_lineData[11].substring(0, 2)) //往復宅配便は「往復宅配便」と表示 20100422miya
				{
					// comment = "\u5F80\u5FA9\u5B85\u914D\u4FBF";
					comment = "往復宅配便";
				} else //それ以外は取得しない
				{
					comment = undefined;
				}

			// H_rtnData[trim(A_lineData[0], "\"") + ""][trim(A_lineData[10], "\"")][trim(A_lineData[11], "\"")][lineno] = {
			H_rtnData[A_lineData[0].replace("\"") + ""][A_lineData[10].replace("\"")][A_lineData[11].replace("\"")][lineno] = {
				
				weight: +weight,
				charge: +charge,
				// sendcount: +trim(A_lineData[12], "\""),
				sendcount: +A_lineData[12].replace("\""),
				// insurance: +trim(A_lineData[16], "\""),
				insurance: +A_lineData[16].replace("\""),
				// excise: +trim(A_lineData[17], "\""),
				excise: +A_lineData[17].replace("\""),
				to_name: to_name,
				to_telno: to_telno,
				comment: comment
			};
		}

		return H_rtnData;
	}

	transitIsExist(pactid, tranid: string, trancoid: string, tablename = "transit_tb") {
		var sql = "SELECT count(*) FROM " + tablename + " WHERE pactid=" + pactid + " AND tranid='" + tranid + "' AND trancoid=" + trancoid;
		return this.get_DB().queryOne(sql);
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
