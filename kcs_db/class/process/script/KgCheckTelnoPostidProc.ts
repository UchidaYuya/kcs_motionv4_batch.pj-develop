//ＫＧ対応 KCS Motion上の電話の所属部署がＦＥＳＴＡ上の電話の部署情報と同じかをチェックする （Process）


import MtTableUtil from '../../MtTableUtil';
import PactModel from '../../model/PactModel';
import TelModel from '../../model/TelModel';
import ProcessBaseBatch from '../../process/ProcessBaseBatch';
import KgCheckTelnoPostidView from '../../view/script/KgCheckTelnoPostidView';
import KgCheckTelnoPostidModel from '../../model/script/KgCheckTelnoPostidModel';

export default class KgCheckTelnoPostidProc extends ProcessBaseBatch {
	O_View: KgCheckTelnoPostidView;
	PactId!: string;
	BillDate: string | undefined;
	O_Model: KgCheckTelnoPostidModel;
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	{
		super(H_param);
		this.getSetting().loadConfig("kg");
		this.O_View = new KgCheckTelnoPostidView();
		this.O_Model = new KgCheckTelnoPostidModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param:any = Array()) //固有ログディレクトリの作成取得
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.infoOut(this.getSetting().get("KG") + "開始\n", 1);
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		const dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + this.BillDate + this.getSetting().get("KG_DIR") + "/";

		if (this.isDirCheck(dataDir) == false) {
			this.errorOut(1000, "ＦＥＳＴＡ電話所属部署データファイルディレクトリ（" + dataDir + "）がみつかりません\n", 0, "", "");
			throw process.exit(-1);
		} else //処理する契約ＩＤ配列を初期化
			{
				var A_pactid = Array();
				A_pactid = this.getPactList(dataDir, this.PactId);
				A_pactid.sort();
				var pactCnt = A_pactid.length;

				if (0 == pactCnt) {
					this.errorOut(1000, "ＦＥＳＴＡ電話所属データファイルがみつかりません\n", 0, "", "");
					throw process.exit(-1);
				}

				const A_pactDone = Array();
			}

		const O_PactModel = new PactModel();
		const H_pactid = O_PactModel.getPactIdCompNameFromPact();
		const tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		const telX_tb = "tel_" + tableNo + "_tb";

		for (let pactCounter = 0; pactCounter < pactCnt; pactCounter++) //pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
		//TelModelインスタンスを作成
		{
			if (undefined !== H_pactid[A_pactid[pactCounter]] == false) //次のpactidへスキップ
				//pactid が会社マスターに登録されている場合
			{
				this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " は pact_tb に登録されていません スキップします\n", 1);
				continue;
			} else //pactid 毎のＦＥＳＴＡ電話所属部署データディレクトリ設定
			{
				const dataDirPact = dataDir + A_pactid[pactCounter];
				const A_festaFile = this.getFileList(dataDirPact);
				const fileCnt = A_festaFile.length;

				if (0 == fileCnt) //次のpactidへスキップ
				{
					this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のＦＥＳＴＡ電話所属部署データファイルがみつかりません スキップします\n", 1);
					continue;
				}

				A_festaFile.sort();
				let fileErrFlg = false;
				const H_allFileData: string[] = Array();

				for (let fileCounter = 0; fileCounter < fileCnt; fileCounter++) //ファイルデータ配列
				//データファイルを取得
				{
					let A_fileData:any = Array();
					A_fileData = this.O_Model.chkFestaData(dataDirPact + "/" + A_festaFile[fileCounter]);

					if (A_fileData == false) //データファイルチェックでエラーがなかった場合
						{
							fileErrFlg = true;
						} else //東京用部門ファイル
						{
							if (A_festaFile[fileCounter].match("/^" + this.getSetting().get("FILE_HEAD_TOKYO") + "/") == true) //ファイル識別子をキーファイルデータを値とした連想配列へ格納
								//大阪用部門ファイル
								{
									H_allFileData[this.getSetting().get("FILE_HEAD_TOKYO")] = A_fileData;
								} else if (A_festaFile[fileCounter].match("/^" + this.getSetting().get("FILE_HEAD_OSAKA") + "/") == true) //ファイル識別子をキーファイルデータを値とした連想配列へ格納
								//不明ファイル
								{
									H_allFileData[this.getSetting().get("FILE_HEAD_OSAKA")] = A_fileData;
								} else //次のpactidへスキップ
								{
									this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のＦＥＳＴＡ電話所属部署データファイル" + A_festaFile[fileCounter] + "の種類が不明な為、スキップします\n", 1);
									continue;
								}
						}
				}

				if (true == fileErrFlg) //次のpactidへスキップ
				{
					this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のＦＥＳＴＡ電話所属部署データファイルが不正な為、スキップします\n", 1);
					continue;
				} else //ＦＥＳＴＡ電話所属部署データを電話と部署に分離して配列に格納する
				{
					var H_editAllFileData = this.O_Model.editFestaData(H_allFileData);
				}
				this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_festaFile.join(",") + "\n", 0);
			}

			const O_TelModel = new TelModel();
			const H_telnoX = O_TelModel.getPostInfo(A_pactid[pactCounter], tableNo, this.getSetting().get("CARID"));
			const A_baseName = Object.keys(H_editAllFileData);
			A_baseName.sort();

			for (var baseName of Object.values(A_baseName)) //拠点日本語名を取得
			//電話番号一覧を取得
			{
				if (baseName == this.getSetting().get("FILE_HEAD_TOKYO")) {
					var baseNameJP = this.getSetting().get("BASENAME_TOKYO");
				} else if (baseName == this.getSetting().get("FILE_HEAD_OSAKA")) {
					baseNameJP = this.getSetting().get("BASENAME_OSAKA");
				}

				const allFileDataCnt = H_editAllFileData[baseName].length;
				const A_telno = Object.keys(H_editAllFileData[baseName]);
				A_telno.sort();

				for (var telno of Object.values(A_telno)) //電話番号を文字列認識させる
				//ＤＢに登録が無い電話の場合
				{
					var telno = telno + "";

					if (undefined !== H_telnoX[baseNameJP][telno] == false) //ＤＢに登録が有る電話の場合
						{
							console.log("電話番号" + telno + "が" + telX_tb + "の部署" + H_editAllFileData[baseName][telno] + "に存在しません\n");
						} else //ＦＥＳＴＡの登録部署と異なる部署に登録されている場合
						{
							if (H_editAllFileData[baseName][telno] != H_telnoX[baseNameJP][telno].userpostid) {
								console.log("電話番号" + telno + "はＦＥＳＴＡでの登録部署" + H_editAllFileData[baseName][telno] + "と" + telX_tb + "での登録部署\n");
							}
						}
				}
			}

			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") チェック完了\n", 1);
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut(this.getSetting().get("KG") + "終了\n", 1);
	}

};
