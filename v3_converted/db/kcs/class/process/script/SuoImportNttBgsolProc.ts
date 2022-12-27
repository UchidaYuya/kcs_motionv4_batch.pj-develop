//
//ＳＵＯ ＮＴＴビグソル請求データ取込処理 （Process）
//
//更新履歴：<br>
//2009/01/14 前田 聡 作成
//
//SuoImportNttBgsolProc
//
//@package SUO
//@subpackage Process
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/01/14
//@uses MtTableUtil
//@uses PactModel
//@uses BillModel
//@uses PostModel
//@uses TelModel
//@uses FuncModel
//@uses ProcessBaseBatch
//@uses SuoImportNttBgsolView
//@uses SuoImportNttBgsolModel
//
//
//error_reporting(E_ALL|E_STRICT);

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/BillModel.php");

require("model/PostModel.php");

require("model/TelModel.php");

require("model/FuncModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/SuoImportNttBgsolView.php");

require("model/script/SuoImportNttBgsolModel.php");

//
//コンストラクタ
//
//@author maeda
//@since 2009/01/14
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author maeda
//@since 2009/01/14
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2009/01/14
//
//@access public
//@return void
//
class SuoImportNttBgsolProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.getSetting().loadConfig("kccs");
		this.O_View = new SuoImportNttBgsolView();
		this.O_Model = new SuoImportNttBgsolModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //処理開始
	//固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//請求データディレクトリを取得
	//請求データディレクトリチェック（スクリプト終了）
	//PactModelインスタンス作成
	//会社マスターを作成
	//BillModelインスタンスを作成
	//内訳種別マスター情報を取得
	//対象テーブル番号を取得
	//テーブル名設定
	//出力件数カウント
	//pactid 毎に処理する
	//END FOR pactid 毎に処理する
	//処理する件数が０件なら直ちに終了する
	//モードがオーバーライトの時はデータをインポートする前にデリート
	//処理が完了したファイルを移動
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		this.infoOut("\uFF2B\uFF23\uFF23\uFF33\u8ACB\u6C42\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u958B\u59CB\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		this.TargetTable = this.O_View.get_HArgv("-t");
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.BillDate + this.getSetting().KCCS_DIR + "/";

		if (this.isDirCheck(dataDir, "rw") == false) {
			this.errorOut(1000, this.getSetting().KCCS + "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
			throw die(-1);
		} else //処理する契約ＩＤ配列を初期化
			//処理する契約ＩＤを取得する
			//pactidでソート
			//処理する契約ＩＤ数
			//処理する契約ＩＤが１件もない場合（スクリプト終了）
			{
				var A_pactid = Array();
				A_pactid = this.getPactList(dataDir, this.PactId);
				A_pactid.sort();
				var pactCnt = A_pactid.length;

				if (0 == pactCnt) {
					this.errorOut(1000, "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
					throw die(-1);
				}

				var A_pactDone = Array();
			}

		var O_PactModel = new PactModel();
		var H_pactid = O_PactModel.getPactIdCompNameFromPact();
		var O_BillModel = new BillModel();
		var H_utiwake = O_BillModel.getUtiwake(this.getSetting().A_CARID_LIST);
		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		var telX_tb = "tel_" + tableNo + "_tb";
		var teldetails_tb = "tel_details_" + tableNo + "_tb";
		var outTelCnt = outTelXCnt = outTeldetailsCnt = 0;

		for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) //pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
		//PostModelインスタンスを作成
		//請求月用のルート部署を取得
		//TelModelインスタンスを作成
		//請求月テーブルより電話番号マスターを取得する array(CARID => array(telno))
		//請求月テーブルに登録済み電話番号の部署ＩＤを取得する（キャリアが異なる同一電話番号が異なる部署ＩＤのものは除外）
		//ASP料金が true:発生する、false:発生しない
		//FuncModelインスタンスを作成
		//会社権限リストを取得
		//ASP料金が発生する場合
		//請求明細
		//電話番号管理テーブル
		//合計金額
		//請求合計額を取得
		//請求合計額をデータ配列から除去
		//現在テーブルにも追加する場合
		//電話番号一覧を取得
		//ファイルデータを１電話番号ずつ処理
		//ファイルデータを１電話番号ずつ処理 END
		//合計金額チェック
		{
			if (undefined !== H_pactid[A_pactid[pactCounter]] == false) //次のpactidへスキップ
				//pactid が会社マスターに登録されている場合
				{
					this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
					continue;
				} else //pactid 毎の請求データディレクトリ設定
				//請求データファイル名を取得
				//処理するファイル数
				//請求データファイルがなかった場合（スクリプト続行 次のpactidへスキップ）
				//ファイルエラーフラグ
				//全ファイルデータ配列
				//ファイル数分処理する
				//１ファイルでも不備があれば、そのpactidはスキップする（スクリプト続行 次のpactidへスキップ）
				//ログ出力
				{
					var dataDirPact = dataDir + A_pactid[pactCounter];
					var A_billFile = this.getFileList(dataDirPact);
					var fileCnt = A_billFile.length;

					if (0 == fileCnt) //次のpactidへスキップ
						{
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							continue;
						}

					A_billFile.sort();
					var fileErrFlg = false;
					var A_allFileData = Array();

					for (var fileCounter = 0; fileCounter < fileCnt; fileCounter++) //ファイルデータ配列
					//ファイル名から請求年月とpactidを取得するための準備
					//ファイル名から請求年月をチェック
					//データファイルチェックでエラーがあった場合（項目数）
					{
						var A_fileData = Array();
						var A_fileNameEle = split("-", str_replace(".txt", "", A_billFile[fileCounter].toLowerCase()));

						if (A_fileNameEle[0] != this.BillDate) {
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB " + A_billFile[fileCounter] + " \u306E\u8ACB\u6C42\u5E74\u6708\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
							fileErrFlg = true;
						}

						if (A_fileNameEle[1] != A_pactid[pactCounter]) {
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB " + A_billFile[fileCounter] + " \u306Epactid\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
							fileErrFlg = true;
						}

						A_fileData = this.O_Model.chkBillData(dataDirPact + "/" + A_billFile[fileCounter]);

						if (A_fileData == false) //データファイルチェックでエラーがなかった場合
							{
								fileErrFlg = true;
							} else //複数ファイルデータをマージ
							{
								A_allFileData = array_merge(A_allFileData, A_fileData);
							}
					}

					if (true == fileErrFlg) //次のpactidへスキップ
						{
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u4E0D\u6B63\u306A\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							continue;
						} else //必要なデータのみ保持する
						//array(電話番号 => array(明細行番号 => DBDATA)
						{
							var H_editAllFileData = this.O_Model.editBillData(A_allFileData);
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
				}

			var O_PostModel = new PostModel();
			var rootPostidX = O_PostModel.getRootPostid(A_pactid[pactCounter], 0, tableNo);
			var O_TelModel = new TelModel();
			var H_telnoX = O_TelModel.getCaridTelno(A_pactid[pactCounter], tableNo, this.getSetting().A_CARID_LIST);
			var H_postidUniqX = O_TelModel.getTelnoPostid(A_pactid[pactCounter], tableNo);
			var aspFlg = false;
			var O_FuncModel = new FuncModel();
			var H_pactFunc = O_FuncModel.getPactFunc(A_pactid[pactCounter], undefined, false);

			if (-1 !== Object.keys(H_pactFunc).indexOf("fnc_asp") == true) //ＡＳＰ料金を取得
				{
					aspFlg = true;
					var aspCharge = O_BillModel.getAspCharge(A_pactid[pactCounter], this.getSetting().KCCS_CARID);

					if ("" == aspCharge) //次のpactidへスキップ
						{
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\uFF21\uFF33\uFF30\u5229\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							continue;
						}

					var asxCharge = +(aspCharge * this.getSetting().excise_tax);
				}

			var A_outPutTelDetails = Array();
			var A_outPutTelX = Array();
			var sumcharge = 0;
			var allcharge = H_editAllFileData.allcharge[0].charge;
			delete H_editAllFileData.allcharge;

			if ("N" == this.TargetTable) //現在テーブルより電話番号マスターを取得する array(CARID => array(telno))
				//電話番号管理テーブル
				//電話管理に登録済み電話番号の部署ＩＤを取得する（キャリアが異なる同一電話番号が異なる部署ＩＤのものは除外）
				{
					var H_telno = O_TelModel.getCaridTelno(A_pactid[pactCounter], undefined, this.getSetting().A_CARID_LIST);
					var A_outPutTel = Array();
					var H_postidUniq = O_TelModel.getTelnoPostid(A_pactid[pactCounter], undefined);
				}

			var allFileDataCnt = A_allFileData.length;
			var now = this.get_DB().getNow();
			var A_telno = Object.keys(H_editAllFileData);
			A_telno.sort();

			for (var telno of Object.values(A_telno)) //電話番号を文字列認識させる
			//tel_X_tb に登録する必要があるかどうか false：無、true：有
			//キャリアＩＤを取得
			//tel_X_tb に電話番号がない場合
			//明細を１件ずつ処理する
			//tel_X_tb へ登録する必要有りの場合
			{
				var telno = telno + "";
				var telAddFlgX = false;
				var carid = H_editAllFileData[telno][0].carid;

				if (-1 !== H_telnoX[carid].indexOf(telno) == false) //copy_X_tb へ登録する必要有り
					{
						telAddFlgX = true;
					}

				if ("N" == this.TargetTable) //tel_tb に登録する必要があるかどうか false：無、true：有
					//tel_tb に電話番号がない場合
					{
						var telAddFlg = false;

						if (-1 !== H_telno[carid].indexOf(telno) == false) //tel_tb へ登録する必要有り
							{
								telAddFlg = true;
							}
					}

				var A_detailno = Object.keys(H_editAllFileData[telno]);
				A_detailno.sort();

				for (var detailno of Object.values(A_detailno)) //内訳コードマスターに存在しないコードがあった場合は処理中止
				//再掲区分が通常の場合は金額チェック用に料金を集計する
				{
					if (undefined !== H_utiwake[carid][H_editAllFileData[telno][detailno].code] == false) {
						this.errorOut(1000, "\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u5185\u8A33\u30B3\u30FC\u30C9[" + H_editAllFileData[telno][detailno].code + "]\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F\u3002\n\u5185\u8A33\u30B3\u30FC\u30C9\u3092\u66F4\u65B0\u3057\u3066\u304B\u3089\u3001\u518D\u5EA6\u51E6\u7406\u3092\u884C\u3063\u3066\u304F\u3060\u3055\u3044\u3002\n", 0, "", "");
						throw die(-1);
					}

					A_outPutTelDetails.push({
						pactid: A_pactid[pactCounter],
						telno: telno,
						code: H_editAllFileData[telno][detailno].code,
						codename: H_utiwake[carid][H_editAllFileData[telno][detailno].code].name,
						charge: H_editAllFileData[telno][detailno].charge,
						taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[carid][H_editAllFileData[telno][detailno].code].taxtype],
						detailno: detailno,
						recdate: now,
						carid: carid,
						tdcomment: undefined,
						prtelno: undefined,
						realcnt: undefined
					});
					outTeldetailsCnt++;

					if (this.getSetting().SAIKEI_NORMAL == H_utiwake[carid][H_editAllFileData[telno][detailno].code].codetype) {
						sumcharge = sumcharge + H_editAllFileData[telno][detailno].charge;
					}
				}

				if (true == telAddFlgX) //tel_X_tb 出力用配列へ格納
					//フラグを戻す
					{
						if (this.getSetting().KCCS_CARID == carid) {
							var arid = this.getSetting().KCCS_ARID;
							var cirid = this.getSetting().KCCS_CIRID;
						} else if (this.getSetting().KCCS_NTTEAST_CARID == carid) {
							arid = this.getSetting().KCCS_NTTEAST_ARID;
							cirid = this.getSetting().KCCS_NTTEAST_CIRID;
						} else if (this.getSetting().KCCS_NTTWEST_CARID == carid) {
							arid = this.getSetting().KCCS_NTTWEST_ARID;
							cirid = this.getSetting().KCCS_NTTWEST_CIRID;
						}

						if (undefined !== H_postidUniqX[telno] == true) {
							var postidX = H_postidUniqX[telno];
						} else {
							postidX = rootPostidX;
						}

						A_outPutTelX.push({
							pactid: A_pactid[pactCounter],
							postid: postidX,
							telno: telno,
							telno_view: H_editAllFileData[telno][0].telnoview,
							userid: undefined,
							carid: carid,
							arid: arid,
							cirid: cirid,
							machine: undefined,
							color: undefined,
							planid: undefined,
							planalert: undefined,
							packetid: undefined,
							packetalert: undefined,
							pointstage: undefined,
							employeecode: undefined,
							username: undefined,
							mail: undefined,
							orderdate: undefined,
							text1: undefined,
							text2: undefined,
							text3: undefined,
							text4: undefined,
							text5: undefined,
							text6: undefined,
							text7: undefined,
							text8: undefined,
							text9: undefined,
							text10: undefined,
							text11: undefined,
							text12: undefined,
							text13: undefined,
							text14: undefined,
							text15: undefined,
							int1: undefined,
							int2: undefined,
							int3: undefined,
							date1: undefined,
							date2: undefined,
							memo: undefined,
							movepostid: undefined,
							moveteldate: undefined,
							delteldate: undefined,
							recdate: now,
							fixdate: now,
							options: undefined,
							contractdate: undefined,
							finishing_f: undefined,
							schedule_person_name: undefined,
							schedule_person_userid: undefined,
							schedule_person_postid: undefined,
							kousiflg: undefined,
							kousiptn: undefined,
							exceptflg: undefined,
							handflg: undefined,
							hand_detail_flg: undefined,
							username_kana: undefined,
							kousi_fix_flg: undefined,
							int4: undefined,
							int5: undefined,
							int6: undefined,
							date3: undefined,
							date4: undefined,
							date5: undefined,
							date6: undefined,
							mail1: undefined,
							mail2: undefined,
							mail3: undefined,
							url1: undefined,
							url2: undefined,
							url3: undefined,
							buyselid: undefined,
							discounts: undefined,
							simcardno: undefined,
							pre_telno: undefined,
							pre_cardid: undefined,
							dummy_flg: undefined,
							webreliefservice: undefined,
							recogcode: undefined,
							pbpostcode: undefined,
							cfbpostcode: undefined,
							ioecode: undefined,
							coecode: undefined,
							pbpostcode_first: undefined,
							pbpostcode_second: undefined,
							cfbpostcode_first: undefined,
							cfbpostcode_second: undefined,
							commflag: undefined
						});
						outTelXCnt++;
						telAddFlgX = false;
					}

				if ("N" == this.TargetTable && true == telAddFlg) //tel_tb 出力用配列へ格納
					//フラグを戻す
					{
						if (this.getSetting().KCCS_CARID == carid) {
							arid = this.getSetting().KCCS_ARID;
							cirid = this.getSetting().KCCS_CIRID;
						} else if (this.getSetting().KCCS_NTTEAST_CARID == carid) {
							arid = this.getSetting().KCCS_NTTEAST_ARID;
							cirid = this.getSetting().KCCS_NTTEAST_CIRID;
						} else if (this.getSetting().KCCS_NTTWEST_CARID == carid) {
							arid = this.getSetting().KCCS_NTTWEST_ARID;
							cirid = this.getSetting().KCCS_NTTWEST_CIRID;
						}

						if (undefined !== H_postidUniq[telno] == true) {
							var postid = H_postidUniq[telno];
						} else {
							postid = rootPostidX;
						}

						A_outPutTel.push({
							pactid: A_pactid[pactCounter],
							postid: postid,
							telno: telno,
							telno_view: H_editAllFileData[telno][0].telnoview,
							userid: undefined,
							carid: carid,
							arid: arid,
							cirid: cirid,
							machine: undefined,
							color: undefined,
							planid: undefined,
							planalert: undefined,
							packetid: undefined,
							packetalert: undefined,
							pointstage: undefined,
							employeecode: undefined,
							username: undefined,
							mail: undefined,
							orderdate: undefined,
							text1: undefined,
							text2: undefined,
							text3: undefined,
							text4: undefined,
							text5: undefined,
							text6: undefined,
							text7: undefined,
							text8: undefined,
							text9: undefined,
							text10: undefined,
							text11: undefined,
							text12: undefined,
							text13: undefined,
							text14: undefined,
							text15: undefined,
							int1: undefined,
							int2: undefined,
							int3: undefined,
							date1: undefined,
							date2: undefined,
							memo: undefined,
							movepostid: undefined,
							moveteldate: undefined,
							delteldate: undefined,
							recdate: now,
							fixdate: now,
							options: undefined,
							contractdate: undefined,
							finishing_f: undefined,
							schedule_person_name: undefined,
							schedule_person_userid: undefined,
							schedule_person_postid: undefined,
							kousiflg: undefined,
							kousiptn: undefined,
							exceptflg: undefined,
							handflg: undefined,
							hand_detail_flg: undefined,
							username_kana: undefined,
							kousi_fix_flg: undefined,
							int4: undefined,
							int5: undefined,
							int6: undefined,
							date3: undefined,
							date4: undefined,
							date5: undefined,
							date6: undefined,
							mail1: undefined,
							mail2: undefined,
							mail3: undefined,
							url1: undefined,
							url2: undefined,
							url3: undefined,
							buyselid: undefined,
							discounts: undefined,
							simcardno: undefined,
							pre_telno: undefined,
							pre_cardid: undefined,
							dummy_flg: undefined,
							webreliefservice: undefined,
							recogcode: undefined,
							pbpostcode: undefined,
							cfbpostcode: undefined,
							ioecode: undefined,
							coecode: undefined,
							pbpostcode_first: undefined,
							pbpostcode_second: undefined,
							cfbpostcode_first: undefined,
							cfbpostcode_second: undefined,
							commflag: undefined
						});
						outTelCnt++;
						telAddFlg = false;
					}

				if (true == aspFlg) //合計用に２つ進める
					//ASP利用料を出力
					{
						detailno++;
						detailno++;
						A_outPutTelDetails.push({
							pactid: A_pactid[pactCounter],
							telno: telno,
							code: this.getSetting().UTIWAKE_ASP_CODE,
							codename: H_utiwake[carid][this.getSetting().UTIWAKE_ASP_CODE].name,
							charge: aspCharge,
							taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[carid][this.getSetting().UTIWAKE_ASP_CODE].taxtype],
							detailno: detailno,
							recdate: now,
							carid: carid,
							tdcomment: undefined,
							prtelno: undefined,
							realcnt: undefined
						});
						outTeldetailsCnt++;

						if (0 != asxCharge) //ASP利用料消費税を出力
							{
								detailno++;
								A_outPutTelDetails.push({
									pactid: A_pactid[pactCounter],
									telno: telno,
									code: this.getSetting().UTIWAKE_ASX_CODE,
									codename: H_utiwake[carid][this.getSetting().UTIWAKE_ASX_CODE].name,
									charge: asxCharge,
									taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[carid][this.getSetting().UTIWAKE_ASX_CODE].taxtype],
									detailno: detailno,
									recdate: now,
									carid: carid,
									tdcomment: undefined,
									prtelno: undefined,
									realcnt: undefined
								});
								outTeldetailsCnt++;
							}
					}
			}

			if (sumcharge != allcharge) //次のpactidへスキップ
				{
					this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u5408\u8A08\u91D1\u984D\u304C\u4E00\u81F4\u3057\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
					continue;
				}

			A_pactDone.push(A_pactid[pactCounter]);
			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(tel_tb:" + outTelCnt + "\u4EF6," + telX_tb + ":" + outTelXCnt + "\u4EF6," + teldetails_tb + ":" + outTeldetailsCnt + "\u4EF6)\n", 1);
			outTelCnt = outTelXCnt = outTeldetailsCnt = 0;
		}

		var pactDoneCnt = A_pactDone.length;

		if (0 == pactDoneCnt) //スクリプトの二重起動防止ロック解除
			//終了
			{
				this.warningOut(1000, "\u30A4\u30F3\u30DD\u30FC\u30C8\u53EF\u80FD\u306A\u8ACB\u6C42\u60C5\u5831\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\n", 1);
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				throw die(0);
			}

		if ("Y" == this.BackUpFlg) {
			var expFile = dataDir + teldetails_tb + date("YmdHis") + ".exp";

			if (false == this.expData(teldetails_tb, expFile, this.getSetting().NUM_FETCH)) {
				throw die(-1);
			}
		}

		this.get_DB().beginTransaction();

		if ("O" == this.Mode) {
			O_BillModel.delTelDetailsData(A_pactDone, tableNo, this.getSetting().A_CARID_LIST);
		}

		if (0 != A_outPutTelDetails.length) //tel_details_X_tb取込失敗
			{
				var rtn = this.get_DB().pgCopyFromArray(teldetails_tb, A_outPutTelDetails);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + teldetails_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut(teldetails_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				}
			}

		if (0 != A_outPutTelX.length) //tel_X_tbへデータ取込
			//tel_X_tb取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray(telX_tb, A_outPutTelX);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + telX_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut(telX_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				}
			}

		if (undefined !== A_outPutTel == true && 0 != A_outPutTel.length) //tel_tbへデータ取込
			//tel_tb取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray("tel_tb", A_outPutTel);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\ntel_tb \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut("tel_tb \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				}
			}

		this.get_DB().commit();

		for (var pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //移動元ディレクトリ
		//移動先ディレクトリ
		{
			var fromDir = dataDir + A_pactDone[pactDoneCounter];
			var finDir = fromDir + "/fin";
			this.mvFile(fromDir, finDir);
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("\uFF2B\uFF23\uFF23\uFF33\u8ACB\u6C42\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u7D42\u4E86\n", 1);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};