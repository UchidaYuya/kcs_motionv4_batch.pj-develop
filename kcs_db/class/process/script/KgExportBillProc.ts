//ＫＧ ＦＥＳＴＡ用データ出力処理 （Process）

import MtTableUtil from '../../MtTableUtil';
import ProcessBaseBatch from '../ProcessBaseBatch';
import KgExportBillView from '../../view/script/KgExportBillView';
import KgExportBillModel from '../../model/script/KgExportBillModel';
import Encoding from 'encoding-japanese';


const fs = require('fs');
export default class KgExportBillProc extends ProcessBaseBatch {
	O_View: KgExportBillView;
	O_Model: KgExportBillModel;
	PactId!: string;
	BillDate: string | undefined;
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	{
		super(H_param);
		this.getSetting().loadConfig("kg");
		this.O_View = new KgExportBillView();
		this.O_Model = new KgExportBillModel(this.get_MtScriptAmbient());
	}

	async doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.infoOut(this.getSetting().get("KG_BILL_EXP") + "開始\n", 1);
		await this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		const dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + this.getSetting().get("KG_DIR_EXP") + "/" + this.PactId + "/";
		
		if (this.isDirCheck(dataDir) == false) {
			this.errorOut(1000, "ＦＥＳＴＡ用データ出力ディレクトリ（" + dataDir + "）がみつかりません\n", 0, "", "");
			throw process.exit(-1);
		}
		
		const tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		
		const now = this.get_DB().getNow().replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("");
		
		for (var baseName of this.getSetting().getArray("A_FILE_HEAD_LIST")) //ファイル出力バッファ初期化
		{
			let A_fileBuff = Array();
			
			for (let kubunNo of this.getSetting().getArray("A_TUWA_KUBUN_LIST")) //通話区分毎の対象内訳種別コード設定変数名
			{	
				const kubunName = "A_KUBUN" + kubunNo + "_CODE_LIST";
				
				const H_expData = await this.O_Model.getTelDetailsDataBaseName(this.PactId, tableNo, this.getSetting().get("CARID"), baseName, this.getSetting().getArray(kubunName));
				
				if (H_expData === false) {
					throw process.exit(-1);
				}

				if (!H_expData) {		
					continue;
				}

				const A_telno = Object.keys(H_expData);
				
				A_telno.sort();
				
				for (let telno of A_telno) //電話番号を文字列認識させる
				{
					const telnoLen = telno.length;
					
					if (telnoLen > this.getSetting().get("TELNO_LEN")) //警告を出すのみ 処理続行
						//電話番号桁数不足
						{
							this.warningOut(1000, telno + "の電話番号桁数が" + this.getSetting().get("TELNO_LEN") + "桁を超えています\n", 1);
						} else if (telnoLen < this.getSetting().get("TELNO_LEN")) //電話番号の文字列数を調整する
						{
							for (var cnt = 0; cnt < this.getSetting().get("TELNO_LEN") - telnoLen; cnt++) {
								telno = telno + this.getSetting().get("TELNO_BLANK");
							}
						}
						
					let charge = H_expData[telno];
					
					const chargeLen = charge?.length;
					if (chargeLen > this.getSetting().get("CHARGE_LEN")) //警告を出すのみ 処理続行
						{
							this.warningOut(1000, telno + "の利用金額桁数が" + this.getSetting().get("CHARGE_LEN") + "桁を超えています\n", 1);
						} else if (chargeLen < this.getSetting().get("CHARGE_LEN")) //利用金額の文字列数を調整する
						{
							for (cnt = 0; cnt < this.getSetting().get("CHARGE_LEN") - chargeLen; cnt++) {
								charge = this.getSetting().get("CHARGE_BLANK") + charge;
							}
						}
					A_fileBuff.push(telno + kubunNo + charge + "\r\n");
				}
			}
			
			A_fileBuff.sort();
			
			const fileName = dataDir + baseName + "Data" + now;
			
			// 出力ファイル作成
			const fp = fs.openSync(fileName, 'w');

			for (let lineBuff of A_fileBuff) {
				lineBuff = Encoding.convert(lineBuff, {
					from: "SJIS",
					to: "UNICODE",
					type: "string"
				});
				fs.writeSync(fp, lineBuff)
			}

			fs.closeSync(fp);
			this.infoOut("ファイル出力完了 " + fileName + "\n", 1);
		}

		await this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut(this.getSetting().get("KG_BILL_EXP") + "終了\n", 1);
	}
	
};
