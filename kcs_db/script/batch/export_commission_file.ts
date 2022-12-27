
import TableNo,{ ScriptDB } from './lib/script_db';
import { G_SCRIPT_INFO, G_SCRIPT_WARNING, G_SCRIPT_ERROR, G_SCRIPT_BEGIN, G_SCRIPT_END}  from './lib/script_log';
import { ScriptLogBase, ScriptLogFile,  ScriptLogAdaptor, } from './lib/script_log'
// import TelModel from '../../class/model/TelModel';

import * as fs from 'fs';
import * as iconv from 'iconv-lite';
import Encoding from 'encoding-japanese';
const _ = require('lodash');

(async () => {
	const DEBUG = 1;
	const COMMON_LOG_DIR = "/kcs/data/log";
	const AGREX_DIR = "/kcs/data/agrex/export";
	const LOG_DELIM = " ";
	const DELIM = "\",\"";
	const SCRIPTNAME = "export_commission_file.php";
	const PACTID = 76;
	const CARID = 13;
	const TAX_RATE = 1.05;
	// const TAX_KAZEI = "\u8AB2\u7A0E";
	const TAX_KAZEI = "課税";
	const TAX_KA_HIKAZEI = "課税／非課税";

	// 共通ログファイル名
	var dbLogFile = COMMON_LOG_DIR + "/billbat.log";

	// ログListener を作成
	var log_listener = new ScriptLogBase(0);
	// ログファイル名、ログ出力タイプを設定
	var log_listener_type = new ScriptLogFile(G_SCRIPT_INFO + G_SCRIPT_WARNING + G_SCRIPT_ERROR + G_SCRIPT_BEGIN + G_SCRIPT_END, dbLogFile);
	// ログListener にログファイル名、ログ出力タイプを渡す
	log_listener.putListener(log_listener_type);
	// DBハンドル作成
	var dbh = new ScriptDB(log_listener);
	// エラー出力用ハンドル
	var logh = new ScriptLogAdaptor(log_listener, true);

	var inFile: string = "";
	var year: number = 0;
	var month: number = 0;

	// パラメータチェック
	// if (_SERVER.argv.length != 3) {
	if (process.argv.length != 3 + 1) {
		usage("");
	} else {
		// var argvCnt = _SERVER.argv.length;
		var argvCnt = process.argv.length;

		// $argvCounter 0 はスクリプト名のため無視
		for (var argvCounter = 1 + 1; argvCounter < argvCnt; argvCounter++) {
			// 請求年月を取得
			// if (ereg("^-y=", _SERVER.argv[argvCounter]) == true) //請求年月文字列チェック
			if ( process.argv[argvCounter].match("^-y=")) {
				// var billdate = ereg_replace("^-y=", "", _SERVER.argv[argvCounter]);
				var billdate = process.argv[argvCounter].replace("-y=", "");

				// 請求年月文字列チェック
				// if (ereg("^[0-9]{6}$", billdate) == false) {
				if (!billdate.match("^[0-9]{6}$")) {
					// usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					usage("請求年月の指定が不正です");
				} else {
					year = parseInt(billdate.substring(0, 4));
					month = parseInt(billdate.substring(4, 6));

					// 年月チェック
					if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
						// usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
						usage("請求年月の指定が不正です");
					}
				}

				continue;
			}

			// コミッション設定ファイルを取得
			// if (ereg("^-f=", _SERVER.argv[argvCounter]) == true) //ファイル存在チェック
			if (process.argv[argvCounter].match("^-f=")) {
				// var inFile = ereg_replace("^-f=", "", _SERVER.argv[argvCounter]);
				inFile = process.argv[argvCounter].replace("-f=", "");

				// ファイル存在チェック
				// if (file_exists(inFile) == false) {
				if (fs.existsSync(inFile) == false) {
					// print("\n\u30D5\u30A1\u30A4\u30EB\uFF08" + inFile + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n\n");
					console.log("\nファイル（" + inFile + "）がみつかりません\n\n");
					// logh.putError(G_SCRIPT_ERROR, "\u30D5\u30A1\u30A4\u30EB\uFF08" + inFile + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
					logh.putError(G_SCRIPT_ERROR, "ファイル（" + inFile + "）がみつかりません");
				}
			}
		}
	}

	// 処理開始をログ出力
	// print("\u4EE3\u7406\u5E97\u5411\u3051\u30B3\u30DF\u30C3\u30B7\u30E7\u30F3\u6599\u51FA\u529B\u958B\u59CB\n");
	console.log("代理店向けコミッション料出力開始\n");
	// logh.putError(G_SCRIPT_BEGIN, "\u4EE3\u7406\u5E97\u5411\u3051\u30B3\u30DF\u30C3\u30B7\u30E7\u30F3\u6599\u51FA\u529B\u958B\u59CB");
	logh.putError(G_SCRIPT_BEGIN, "代理店向けコミッション料出力開始");

	// ２重起動防止ロックをかける
	lock(true);

	// コミッション料金設定ファイル読み込み
	// var A_inFile = file(inFile);
	var buffer = fs.readFileSync(inFile);
	var text = Encoding.convert(buffer, { from: "SJIS", to: "UNICODE", type: 'string' });
	var A_inFile = text.toString().split('\r\n');

	// ファイル行数を取得
	var lineCnt = A_inFile.length;

	var H_agent: { [key: string]: { [key: string]: any } } = {};

	// １行ずつ処理する
	for (var cnt = 0; cnt < lineCnt; cnt++) {
		// １行を配列に格納
		// var A_agent = split(",", A_inFile[cnt]);
		var A_agent = A_inFile[cnt].split(",");

		// 料率チェック
		// if (A_agent[2] == "\u6599\u7387" && (A_agent[3] < 0 || A_agent[3] > 100)) {
		if (A_agent[2] == "料率" && (parseInt(A_agent[3]) < 0 || parseInt(A_agent[3]) > 100)) {
			// print("\u4E0D\u6B63\u306A\u6599\u7387\u304C\u3042\u308B\u70BA\u3001\u51E6\u7406\u3092\u4E2D\u6B62\u3057\u307E\u3059\uFF08" + (cnt + 1) + "\u884C\u76EE\uFF09\n");
			console.log("不正な料率がある為、処理を中止します（" + (cnt + 1) + "行目）\n");
			// logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u4E0D\u6B63\u306A\u6599\u7387\u304C\u3042\u308B\u70BA\u3001\u51E6\u7406\u3092\u4E2D\u6B62\u3057\u307E\u3059\uFF08" + (cnt + 1) + "\u884C\u76EE\uFF09");
			logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "不正な料率がある為、処理を中止します（" + (cnt + 1) + "行目）");
			throw process.exit(1);
		}

		// 代理店情報を連想配列に格納
		_.setWith(
			H_agent,
			`${A_agent[0]}.commission.${A_agent[1]}`,
			[A_agent[2], A_agent[3]],
			Object
		)
		// H_agent[A_agent[0]].commission[A_agent[1]] = [A_agent[2], A_agent[3]];
	}

	// var O_tableNo = new TableNo();
	var O_tableNo = new TableNo();
	var tableNo = O_tableNo.get(year, month);
	var sql = "select userpostid,postid,postname from post_" + tableNo + "_tb " + "where pactid = " + PACTID + " and " + "ptext1 = '0' and " + "userpostid in ('" + Object.keys(H_agent).join("','") + "')";
	var H_result = await dbh.getHash(sql);
	console.log(H_result);
	var recCnt =  H_result.length;
	var H_targetAgent = Array();

	for (cnt = 0 + 1; cnt < recCnt; cnt++) //ＤＢに登録のあった代理店のみ別配列へ格納し、システム部署ＩＤを追加
	{
		H_targetAgent[H_result[cnt].userpostid] = H_agent[H_result[cnt].userpostid];
		H_targetAgent[H_result[cnt].userpostid].postid = H_result[cnt].postid;
		H_targetAgent[H_result[cnt].userpostid].postname = H_result[cnt].postname;
	}

	// var A_notFoundAgent = array_diff(Object.keys(H_agent), Object.keys(H_targetAgent));
	var A_notFoundAgent = Object.keys(H_agent).filter(x => !Object.keys(H_targetAgent).includes(x));

	if (A_notFoundAgent.length != 0) {
		// print("\u4EE5\u4E0B\u306E\u4EE3\u7406\u5E97\u306F\u767B\u9332\u304C\u306A\u3044\u70BA\u3001\u30B3\u30DF\u30C3\u30B7\u30E7\u30F3\u6599\u3092\u8A08\u7B97\u3067\u304D\u307E\u305B\u3093\uFF08" + A_notFoundAgent.join("\u3001") + "\uFF09\u51E6\u7406\u3092\u7D99\u7D9A\u3057\u307E\u3059\n");
		console.log("以下の代理店は登録がない為、コミッション料を計算できません（" + A_notFoundAgent.join("、") + "）処理を継続します\n");
		// logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u4EE5\u4E0B\u306E\u4EE3\u7406\u5E97\u306F\u767B\u9332\u304C\u306A\u3044\u70BA\u3001\u30B3\u30DF\u30C3\u30B7\u30E7\u30F3\u6599\u3092\u8A08\u7B97\u3067\u304D\u307E\u305B\u3093\uFF08" + A_notFoundAgent.join("\u3001") + "\uFF09\u51E6\u7406\u3092\u7D99\u7D9A\u3057\u307E\u3059");
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "v" + A_notFoundAgent.join("、") + "）処理を継続します");
	}

	var A_Buff = Array();

	// for (var agentcode of Object.values(Object.keys(H_targetAgent))) //代理店毎に初期化
	for (var agentcode of Object.keys(H_targetAgent)) //代理店毎に初期化
//部署情報格納配列
//処理が済んだ部署ＩＤを格納用（代理店毎でリセット）
//代理店毎電話件数
//代理店毎コミッション合計
//代理店配下のシステム部署ＩＤを取得する
//取得したシステム部署ＩＤのうち、登録区分が顧客(法人)か顧客(個人)で決済が完了しているものの情報を取得
//ＳＱＬ実行
//検索結果件数
//１件ずつ連想配列へ格納
//顧客(法人)か顧客(個人)毎に処理する
//取得したシステム部署ＩＤのうち、登録区分が代理店の部署ＩＤを取得
//ＳＱＬ実行
//代理店直下で決済が完了している電話の請求情報を取得（カード決済）
//コミッション計算対象内訳コードの請求情報を取得する
//ＳＱＬ実行
//検索結果件数
//コミッション計算対象があった場合
	{
		var H_postdata = Array();
		var A_postidDone = Array();
		var telCntAll = 0;
		var sumChargeAll = 0;
		var A_followerPostid = await getFollowerPost(PACTID, H_targetAgent[agentcode].postid, tableNo);
		sql = "select postid,postname,ptext3 from post_" + tableNo + "_tb " + "where pactid = " + PACTID + " " + "and ptext1 in ('1','2') " + "and ptext15 = '2' " + "and postid in (" + A_followerPostid.join(",") + ") " + "order by postid";
		H_result = await dbh.getHash(sql);
		recCnt = H_result.length;

		for (cnt = 0 + 1; cnt < recCnt; cnt++) {
			H_postdata[H_result[cnt].postid] = {
				postname: H_result[cnt].postname,
				ptext3: H_result[cnt].ptext3
			};
		}

		// for (var postid of Object.values(Object.keys(H_postdata))) //顧客(法人)か顧客(個人)毎に初期化
		for (var postid of Object.keys(H_postdata)) //顧客(法人)か顧客(個人)毎に初期化
	//顧客(法人)か顧客(個人)毎電話件数
	//顧客(法人)か顧客(個人)毎コミッション合計
	//既に処理済の部署なら処理をスキップする（顧客の下の顧客で２重計算しないための処理）
	//処理済部署ＩＤリストへ追加
	//コミッション計算対象内訳コードの請求情報を取得する
	//ＳＱＬ実行
	//レコード件数を取得
	//コミッション計算対象があった場合
		{
			var telCnt = 0;
			var sumCharge = 0;

			if (-1 !== A_postidDone.indexOf(postid) == true) {
				continue;
			}

			var A_postid = await getFollowerPost(PACTID, postid, tableNo);
			// A_postidDone = array_merge(A_postidDone, A_postid);
			A_postidDone = A_postidDone.concat(A_postid);
			sql = "select td.telno,td.code,te.postid,td.taxkubun,sum(td.charge) as charge " + "from tel_details_" + tableNo + "_tb td inner join tel_" + tableNo + "_tb te " + "on td.pactid = te.pactid and td.telno = te.telno and td.carid = te.carid " + "where td.pactid = " + PACTID + " " + "and td.carid = " + CARID + " " + "and te.postid in (" + A_postid.join(",") + ") " + "and td.code in ('" + Object.keys(H_targetAgent[agentcode].commission).join("','") + "') " + "group by td.telno,td.code,te.postid,td.taxkubun " + "order by td.telno";
			H_result = await dbh.getHash(sql);
			recCnt = H_result.length;

			if (recCnt != 0) //電話番号毎初期化
			//電話番号毎コミッション料（税込み）
			//電話番号毎課税対象コミッション料
			//電話番号毎課税非対象コミッション料
			//明細を１行ずつ処理する
			//最終行の処理
			//課税対象分は課税してコミッション料を算出
			//電話番号件数をインクリメント
			//ユーザ毎電話件数
			//代理店毎電話件数
			//ユーザ毎小計
			//代理店毎合計
			//顧客(法人)か顧客(個人)毎合計行を出力
			{
				var commCharge = 0;
				var commChargeTax = 0;
				var commChargeNoTax = 0;

				for (cnt = 0 + 1; cnt < recCnt; cnt++) //電話番号が前件と違う場合
				//電話番号を退避
				{
					if (cnt != 0 && telno_old != H_result[cnt].telno) //課税対象分は課税してコミッション料を算出（小数点以下切捨て）
						//出力バッファへ格納
						//電話番号件数をインクリメント
						//ユーザ毎電話件数
						//代理店毎電話件数
						//ユーザ毎合計
						//代理店毎合計
						//番号番号毎に初期化
						//コミッション料
						//課税用
						//非課税用
					{
						commCharge = Math.floor(commChargeTax * TAX_RATE) + commChargeNoTax;
						A_Buff.push(agentcode + "," + H_targetAgent[agentcode].postname + "," + H_postdata[postid].ptext3 + "," + H_postdata[postid].postname + "," + telno_old + "," + commCharge + "\r\n");
						telCnt++;
						telCntAll++;
						sumCharge = sumCharge + commCharge;
						sumChargeAll = sumChargeAll + commCharge;
						commCharge = 0;
						commChargeTax = 0;
						commChargeNoTax = 0;
					}

					// if (H_targetAgent[agentcode].commission[H_result[cnt].code][0] == "\u5B9A\u984D") //請求額が定額料より小さい場合
					if (H_targetAgent[agentcode].commission[H_result[cnt].code][0] == "定額") //請求額が定額料より小さい場合
						//料率計算の場合
					{
						if (H_result[cnt].charge * 1 < H_targetAgent[agentcode].commission[H_result[cnt].code][1] * 1) //金額が正の時のみ
						{
							if (H_result[cnt].charge * 1 > 0) //課税の場合
							{
								if (H_result[cnt].taxkubun == TAX_KAZEI || H_result[cnt].taxkubun == TAX_KA_HIKAZEI) //請求額全額をコミッション料に追加
								//非課税の場合
								{
									commChargeTax = commChargeTax + H_result[cnt].charge;
								} else //請求額全額をコミッション料に追加
								{
									commChargeNoTax = commChargeNoTax + H_result[cnt].charge;
								}
							}
						} else //課税の場合
						{
							if (H_result[cnt].taxkubun == TAX_KAZEI || H_result[cnt].taxkubun == TAX_KA_HIKAZEI) //定額をコミッション料に追加
							//非課税の場合
							{
								commChargeTax = commChargeTax + H_targetAgent[agentcode].commission[H_result[cnt].code][1];
							} else //定額をコミッション料に追加
							{
								commChargeNoTax = commChargeNoTax + H_targetAgent[agentcode].commission[H_result[cnt].code][1];
							}
						}
					} else //課税の場合
					{
						if (H_result[cnt].taxkubun == TAX_KAZEI || H_result[cnt].taxkubun == TAX_KA_HIKAZEI) //非課税の場合
						{
							commChargeTax = commChargeTax + Math.floor(H_result[cnt].charge * H_targetAgent[agentcode].commission[H_result[cnt].code][1] / 100);
						} else {
							commChargeNoTax = commChargeNoTax + Math.floor(H_result[cnt].charge * H_targetAgent[agentcode].commission[H_result[cnt].code][1] / 100);
						}
					}

					var telno_old = H_result[cnt].telno;
				}

				commCharge = Math.floor(commChargeTax * TAX_RATE) + commChargeNoTax;
				A_Buff.push(agentcode + "," + H_targetAgent[agentcode].postname + "," + H_postdata[postid].ptext3 + "," + H_postdata[postid].postname + "," + telno_old + "," + commCharge + "\r\n");
				telCnt++;
				telCntAll++;
				sumCharge = sumCharge + commCharge;
				sumChargeAll = sumChargeAll + commCharge;
				A_Buff.push(agentcode + "," + H_targetAgent[agentcode].postname + "," + H_postdata[postid].ptext3 + "," + H_postdata[postid].postname + "," + telCnt + "," + sumCharge + "\r\n");
			}
		}

		sql = "select postid from post_" + tableNo + "_tb " + "where pactid = " + PACTID + " " + "and ptext1 = '0' " + "and postid in (" + A_followerPostid.join(",") + ")";
		var A_result = await dbh.getCol(sql);
		sql = "select td.telno,td.code,td.taxkubun,sum(td.charge) as charge " + "from tel_details_" + tableNo + "_tb td inner join tel_" + tableNo + "_tb te " + "on td.pactid = te.pactid and td.telno = te.telno and td.carid = te.carid " + "where td.pactid = " + PACTID + " " + "and td.carid = " + CARID + " " + "and te.text11 = '2' " + "and te.postid in (" + A_result.join(",") + ") " + "and td.code in ('" + Object.keys(H_targetAgent[agentcode].commission).join("','") + "') " + "group by td.telno,td.code,te.postid,td.taxkubun " + "order by td.telno";
		H_result = await dbh.getHash(sql);
		recCnt = H_result.length;

		if (recCnt != 0) //電話番号毎初期化
		//電話番号毎コミッション料（税込み）
		//電話番号毎課税対象コミッション料
		//電話番号毎課税非対象コミッション料
		//明細を１行ずつ処理する
		//最終行の処理
		//課税対象分は課税してコミッション料を算出
		//出力バッファへ格納
		//電話番号件数をインクリメント
		//代理店毎電話件数
		//代理店毎合計
		{
			commCharge = 0;
			commChargeTax = 0;
			commChargeNoTax = 0;

			for (cnt = 0 + 1; cnt < recCnt; cnt++) //電話番号が前件と違う場合
			//電話番号を退避
			{
				if (cnt != 0 && telno_old != H_result[cnt].telno) //課税対象分は課税してコミッション料を算出（小数点以下切捨て）
					//出力バッファへ格納
					//電話番号件数をインクリメント
					//代理店毎電話件数
					//代理店毎合計
					//番号番号毎に初期化
					//コミッション料
					//課税用
					//非課税用
				{
					commCharge = Math.floor(commChargeTax * TAX_RATE) + commChargeNoTax;
					A_Buff.push(agentcode + "," + H_targetAgent[agentcode].postname + ",,," + telno_old + "," + commCharge + "\r\n");
					telCntAll++;
					sumChargeAll = sumChargeAll + commCharge;
					commCharge = 0;
					commChargeTax = 0;
					commChargeNoTax = 0;
				}

				// if (H_targetAgent[agentcode].commission[H_result[cnt].code][0] == "\u5B9A\u984D") //請求額が定額料より小さい場合
				if (H_targetAgent[agentcode].commission[H_result[cnt].code][0] == "定額") //請求額が定額料より小さい場合
					//料率計算の場合
				{
					if (H_result[cnt].charge * 1 < H_targetAgent[agentcode].commission[H_result[cnt].code][1] * 1) //金額が正の時のみ
					{
						if (H_result[cnt].charge * 1 > 0) //課税の場合
						{
							if (H_result[cnt].taxkubun == TAX_KAZEI || H_result[cnt].taxkubun == TAX_KA_HIKAZEI) //請求額全額をコミッション料に追加
							//非課税の場合
							{
								commChargeTax = commChargeTax + H_result[cnt].charge;
							} else //請求額全額をコミッション料に追加
							{
								commChargeNoTax = commChargeNoTax + H_result[cnt].charge;
							}
						}
					} else //課税の場合
					{
						if (H_result[cnt].taxkubun == TAX_KAZEI || H_result[cnt].taxkubun == TAX_KA_HIKAZEI) //定額をコミッション料に追加
						//非課税の場合
						{
							commChargeTax = commChargeTax + H_targetAgent[agentcode].commission[H_result[cnt].code][1];
						} else //定額をコミッション料に追加
						{
							commChargeNoTax = commChargeNoTax + H_targetAgent[agentcode].commission[H_result[cnt].code][1];
						}
					}
				} else //課税の場合
				{
					if (H_result[cnt].taxkubun == TAX_KAZEI || H_result[cnt].taxkubun == TAX_KA_HIKAZEI) //非課税の場合
					{
						commChargeTax = commChargeTax + Math.floor(H_result[cnt].charge * H_targetAgent[agentcode].commission[H_result[cnt].code][1] / 100);
					} else {
						commChargeNoTax = commChargeNoTax + Math.floor(H_result[cnt].charge * H_targetAgent[agentcode].commission[H_result[cnt].code][1] / 100);
					}
				}

				telno_old = H_result[cnt].telno;
			}

			commCharge = Math.floor(commChargeTax * TAX_RATE) + commChargeNoTax;
			A_Buff.push(agentcode + "," + H_targetAgent[agentcode].postname + ",,," + telno_old + "," + commCharge + "\r\n");
			telCntAll++;
			sumChargeAll = sumChargeAll + commCharge;
		}

		A_Buff.push(agentcode + "," + H_targetAgent[agentcode].postname + ",,," + telCntAll + "," + sumChargeAll + "\r\n");
	}

	var commissionFile = AGREX_DIR + "/commission" + year + month + ".csv";
	var fp_commission = fs.openSync(commissionFile, "w");

	// for (var value of Object.values(A_Buff)) {
	for (var value of A_Buff) {
		var buf = iconv.encode( value , "Shift_JIS" );
		// fs.writeFileSync(fp_commission, mb_convert_encoding(value, "SJIS-win", "UTF-8"));// 2022cvt_006
		fs.writeFileSync(fp_commission, buf);
	}

// fflush(fp_commission);
// fclose(fp_commission);
	fs.closeSync(fp_commission);
	lock(false);
// print("\u4EE3\u7406\u5E97\u5411\u3051\u30B3\u30DF\u30C3\u30B7\u30E7\u30F3\u6599\u51FA\u529B\u7D42\u4E86\n");
	console.log("代理店向けコミッション料出力終了\n");
// logh.putError(G_SCRIPT_END, "\u4EE3\u7406\u5E97\u5411\u3051\u30B3\u30DF\u30C3\u30B7\u30E7\u30F3\u6599\u51FA\u529B\u7D42\u4E86");
	logh.putError(G_SCRIPT_END, "代理店向けコミッション料出力終了");
	throw process.exit(0);

	function usage(comment) {
	// if (!("dbh" in global)) dbh = undefined;

		if (comment == "") {
			// comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
			comment = "パラメータが不正です";
		}

		// print("\n" + comment + "\n\n");
		console.log("\n" + comment + "\n\n");
		// print("Usage) " + SCRIPTNAME + " -y=\u8ACB\u6C42\u5E74\u6708(YYYYMM) -f=\u4EE3\u7406\u5E97\u30B3\u30DF\u30C3\u30B7\u30E7\u30F3\u6599\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\n\n");
		console.log("Usage) " + SCRIPTNAME + " -y=請求年月(YYYYMM) -f=代理店コミッション料設定ファイル\n\n");
		dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + comment);
		throw process.exit(1);
	};

	async function lock(is_lock) //ロックする
	{
		// if (!("dbh" in global)) dbh = undefined;
		var pre = "batch";
		var now = getTimestamp();

		if (is_lock == true) //既に起動中
			//ロック解除
		{
			dbh.begin();
			dbh.lock("clamptask_tb");
			var sql = "select count(*) from clamptask_tb " + "where command = '" + dbh.escape(pre + "_" + SCRIPTNAME) + "' and " + "status = 1;";
			var count = await dbh.getOne(sql);

			if (count != 0) {
				dbh.rollback();
				// print("\n\u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059\n\n");
				console.log("n既に起動しています\n\n");
				// dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + "\u591A\u91CD\u52D5\u4F5C");
				dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + "多重動作");
				return false;
			}

			sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + dbh.escape(pre + "_" + SCRIPTNAME) + "',1,'" + now + "');";
			dbh.query(sql);
			dbh.commit();
		} else {
			dbh.begin();
			dbh.lock("clamptask_tb");
			sql = "delete from clamptask_tb " + "where command = '" + dbh.escape(pre + "_" + SCRIPTNAME) + "';";
			dbh.query(sql);
			dbh.commit();
		}

		return true;
	};

	function getTimestamp() {
		// var tm = localtime(Date.now() / 1000, true);
		var tm = new Date();

		var yyyy = tm.getFullYear();
		// var yyyy = tm.tm_year + 1900;

		var mm = (tm.getMonth() + 1).toString();
		// var mm = tm.tm_mon + 1;
		if (mm.length == 1) {
			mm = "0" + mm;
		}
		// if (mm < 10) mm = "0" + mm;

		var dd = (tm.getDay() + 0).toString();
		// var dd = tm.tm_mday + 0;
		if (dd.length == 1) {
			dd = "0" + dd;
		}
		// if (dd < 10) dd = "0" + dd;

		var hh = (tm.getHours() + 0).toString();
		// var hh = tm.tm_hour + 0;
		if (hh.length == 1) {
			hh = "0" + hh;
		}
		// if (hh < 10) hh = "0" + hh;

		var nn = (tm.getMinutes() + 0).toString();
		// var nn = tm.tm_min + 0;
		if (nn.length == 1) {
			nn = "0" + nn;
		}
		// if (nn < 10) nn = "0" + nn;

		var ss = (tm.getSeconds() + 0).toString();
		if (ss.length == 1) {
			ss = "0" + ss;
		}
		// var ss = tm.tm_sec + 0;
		// if (ss < 10) ss = "0" + ss;
		return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
	};
// 	var yyyy = tm.tm_year + 1900;
//
// 	var mm = tm.tm_mon + 1;
// 	if (mm < 10) mm = "0" + mm;
//
// 	var dd = tm.tm_mday + 0;
// 	if (dd < 10) dd = "0" + dd;
//
// 	var hh = tm.tm_hour + 0;
// 	if (hh < 10) hh = "0" + hh;
//
// 	var nn = tm.tm_min + 0;
// 	if (nn < 10) nn = "0" + nn;
//
// 	var ss = tm.tm_sec + 0;
// 	if (ss < 10) ss = "0" + ss;
// 	return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;

	async function getFollowerPost(pactid, postid, tableNo = "") //pactid か postid が空の場合は空の配列を返す
//テーブルＮＯが無い場合は現在
//指定された部署が見つかったかどうか true：見つかった、false：見つかっていない
	{
	// if (!("dbh" in global)) dbh = undefined;

		if (pactid == "" || postid == "") {
			return Array();
		}

		var sql = "select postidparent,postidchild,level from ";

		if (tableNo == "") {
			sql += "post_relation_tb";
		} else {
			sql += "post_relation_" + tableNo + "_tb";
		}

		sql += " where pactid = " + pactid + " order by level";
		var H_return = await dbh.getHash(sql);
		var H_postid = Array();
		var A_postid_list = Array();
		var target_find = false;

		for (var cnt = 0 + 1; cnt < H_return.length; cnt++) //指定された部署が見つかっていない場合
		{
			var level = H_return[cnt].level;
			var parentid = H_return[cnt].postidparent;
			var childid = H_return[cnt].postidchild;

			if (target_find == false) //指定された部署が見つかった場合の処理
			{
				if (postid == childid) //指定された部署の階層
				{
					var target_level = level;
					H_postid[childid] = true;
					A_postid_list.push(childid);
					target_find = true;
				}
			} else //指定された部署配下
			{
				if (target_level < level) {
					if (undefined !== H_postid[parentid] && H_postid[parentid] == true) {
						H_postid[childid] = true;
						A_postid_list.push(childid);
					}
				}
			}
		}

		// delete H_postid;
		return A_postid_list;
	};
})();
