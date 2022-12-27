
import {  } from './lib/script_db'

import { G_SCRIPT_WARNING } from './lib/script_log'
import ImportEtcCardBase from './lib/import_etc_base';
import preg_match_all from '../../class/preg_match_all';
import { G_CODE_ASPX } from './lib/script_common';
import * as fs from 'fs';
import * as Encoding from 'encoding-japanese';

const NICOS_UTICODE = "001";
const NICOS_SEIKYU_UTICODE = "002";
const CON_TAX = 0.08;
const AFTER_ENCO = "UTF-8";
const BEFORE_ENCO = "SJIS";

export class ImportEtcNicosHist extends ImportEtcCardBase {

	SumUp: number = 0;

	CompCode = Array();
	trg_post: any;

	iniSetting() //このスクリプトの名前
	//会社IDの設定
	//NICOSのcoid
	//ローカルログファイル名
	//ログに出力するデータ名称
	//デバッグフラグ、本番では0にすること
	//1;
	{
		this.SCRIPT_NAME = "import_etc_nicos.php";
		// this.COID = 8;
		this.COID = "8";
		this.CoDir = "/ETC/NICOS";
		this.LocalLogName = "import_etc_nicos.log";
		// this.DataTitle = "NICOS\u6CD5\u4EBA\u7528ETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF";
		this.DataTitle = "NICOS法人用ETCカード請求データ";
		this.DEBUG = 0;
	}

	doEachFile(ifp, billfile, pactid, A_prcardno, PACT_result, CARD_result, CARD_now_result, CARD_now_delete_result, A_del_sql) //合計金額
	//------------------------------------
	//レコード毎の処理（１行毎）
	//------------------------------------
	//ファイル１行ずつ処理するwhile閉じ
	//成功リターン
	{

		var line;
		this.SumUp = 0;
		
		var buffer = fs.readFileSync(ifp);
		const text = Encoding.convert(buffer, {
			from: 'SJIS',
			to: 'UNICODE', 
			type: 'string',
		});
		var lines  = text.toString().split('\r\n');
		for(line of lines)
	
		// while (line = fgets(ifp)) //-----------------------------------------------
		//ファイルのエンコーディングを変更（バッファ上）
		//-----------------------------------------------
		//カンマ区切りで配列に取得する
		//先頭の１文字によってレコード処理を分ける
		{
			// line = mb_convert_encoding(line, AFTER_ENCO, BEFORE_ENCO);

			// var A_line = split(",", line);
			var A_line = line.split(",");


			for (var idx = 0 + 1; idx < A_line.length; idx++) //前後の空白を除く
			{
				A_line[idx] = A_line[idx].trim();
			}

			switch (A_line[0]) {
				case 1:
					if (true == this.doHeaderRecord(A_line, billfile, pactid, A_prcardno, PACT_result, CARD_result, CARD_now_result, CARD_now_delete_result, A_del_sql)) //失敗
						{
							return true;
						}

					break;

				case 2:
					if (true == this.doDataRecord(A_line, billfile, pactid, A_prcardno, PACT_result, CARD_result, CARD_now_result, CARD_now_delete_result, A_del_sql)) //失敗
						{
							return true;
						}

					break;

				case 9:
					// if (this.DEBUG) this.logging("INFO: \u5408\u8A08\u91D1\u984D\u306F " + this.SumUp + " \u5186\u3067\u3059 " + billfile);
					if (this.DEBUG) this.logging("INFO: 合計金額は " + this.SumUp + " 円です " + billfile);

					if (A_line[2] != this.SumUp) {
						// this.logging("WARNING: \u91D1\u984D\u306E\u5408\u8A08\u5024 " + this.SumUp + " \u304C\u5408\u8A08\u30EC\u30B3\u30FC\u30C9 " + A_line[2] + " \u3068\u7570\u306A\u308A\u307E\u3059 " + billfile);
						this.logging("WARNING: 金額の合計値 " + this.SumUp + " が合計レコード " + A_line[2] + " と異なります " + billfile);
					}

					break;

				default:
					// if (this.DEBUG) this.logging("WARNING: \u672A\u77E5\u306E\u30EC\u30B3\u30FC\u30C9(" + A_line[0] + ")\u3067\u3059 " + billfile);
					if (this.DEBUG) this.logging("WARNING: 未知のレコード(" + A_line[0] + ")です " + billfile);
					// this.logh!.putError(G_SCRIPT_WARNING, this.SCRIPT_NAME + " " + this.DataTitle + "\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + billfile + " \u672A\u77E5\u306E\u30EC\u30B3\u30FC\u30C9(" + A_line[0] + ")\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\u3002\uFF11\u4EF6\u3082\u53D6\u8FBC\u307E\u305B\u3093\u3067\u3057\u305F\u3002 " + billfile);
					this.logh!.putError(G_SCRIPT_WARNING, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + PACT_result + " " + billfile + " 未知のレコード(" + A_line[0] + ")が含まれています。処理を中断します。１件も取込ませんでした。 " + billfile);
					return true;
			}
		}

		return false;
	}

	doHeaderRecord(A_line, billfile, pactid, A_prcardno, PACT_result, CARD_result, CARD_now_result, CARD_now_delete_result, A_del_sql) //法人コードを取得する
	//会社CD
	//----------------------
	//親番号チェック
	//----------------------
	//対象会社の親番号一覧にファイルの番号が無い時
	//成功
	{
		this.CompCode = A_line[3];

		if (-1 !== A_prcardno.indexOf(this.CompCode) == false) //失敗
			{
				// if (this.DEBUG) this.logging("WARNING: \u30D5\u30A1\u30A4\u30EB\u306B\u8A18\u8F09\u3055\u308C\u3066\u3044\u308B\u4F1A\u793ECD(" + this.CompCode + ")\u3068\u767B\u9332\u3055\u308C\u305F\u304A\u5BA2\u69D8\u756A\u53F7(" + A_prcardno.join(",") + ")\u304C\u7570\u306A\u308A\u307E\u3059 " + billfile);
				if (this.DEBUG) this.logging("WARNING: ファイルに記載されている会社CD(" + this.CompCode + ")と登録されたお客様番号(" + A_prcardno.join(",") + ")が異なります " + billfile);
				// this.logh!.putError(G_SCRIPT_WARNING, this.SCRIPT_NAME + " " + this.DataTitle + "\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + billfile + " \u30D5\u30A1\u30A4\u30EB\u306B\u8A18\u8F09\u3055\u308C\u3066\u3044\u308B\u4F1A\u793ECD(" + this.CompCode + ")\u3068\u767B\u9332\u3055\u308C\u305F\u304A\u5BA2\u69D8\u756A\u53F7(" + A_prcardno.join(",") + ")\u304C\u7570\u306A\u308A\u307E\u3059\u3002\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\u3002\uFF11\u4EF6\u3082\u53D6\u8FBC\u307E\u305B\u3093\u3067\u3057\u305F\u3002");
				this.logh!.putError(G_SCRIPT_WARNING, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + PACT_result + " " + billfile + " ファイルに記載されている会社CD(" + this.CompCode + ")と登録されたお客様番号(" + A_prcardno.join(",") + ")が異なります。処理を中断します。１件も取込ませんでした。");
				return true;
			}


		var sql_post = "select postid from card_bill_master_tb where pactid = " + this.dbh!.escape(pactid) + " and card_master_no = '" + this.CompCode + "';";
		this.trg_post = this.dbh!.getOne(sql_post, true);

		if (this.trg_post == "") //失敗
			{
				// if (this.DEBUG) this.logging("WARNING: \u672A\u767B\u9332\u30AB\u30FC\u30C9\u306E\u767B\u9332\u5148\u90E8\u7F72\u304C\u6B63\u3057\u304F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093" + sql_post);
				if (this.DEBUG) this.logging("WARNING: 未登録カードの登録先部署が正しく登録されていません" + sql_post);
				this.logh!.putError(G_SCRIPT_WARNING, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + PACT_result + " " + pactid + " 未登録カードの登録先部署が取得できません");
				return true;
			}

		return false;
	}

	doDataRecordDebug(A_line, billfile, pactid, A_prcardno, PACT_result, CARD_result, CARD_now_result, CARD_now_delete_result, A_del_sql) //とりあえず表示してみる
	{

		for (var idx = 0 + 1; idx < A_line.length; idx++) {
			// print(idx + ": " + A_line[idx] + "\n");
			console.log(idx + ": " + A_line[idx] + "\n");
		}

		// print("-------------------------------------------------------\n");
		console.log("-------------------------------------------------------\n");
	}

	doDataRecord(A_line, billfile, pactid, A_prcardno, PACT_result, CARD_result, CARD_now_result, CARD_now_delete_result, A_del_sql) //とりあえず表示してみる * DEBUG *
	//	for( $idx=0; $idx < count($A_line); $idx++ ){
	//		print $idx . ": " . $A_line[$idx] . "\n";
	//	}
	//	print "-------------------------------------------------------\n";
	//	/* DEBUG
	//カード番号
	//利用日がオール０の場合は、レコードをスキップする
	//１３番目のカラムデータが「１」の場合は金額はマイナスにする 2009/7/29 s.maeda
	//ここまで １３番目のカラムデータが「１」の場合は金額はマイナスにする 2009/7/29 s.maeda
	//通行料金
	//ASP利用料がONの場合
	//利用日付
	//利用時間は取得できない
	//入り口と出口を得る
	//list( $enter, $leave ) = split( '-', $A_line[7] );
	//まずハイフンで２つに分ける
	//利用明細
	//請求元カード会社
	//---------------------------------------------
	//card_XX_tbに各行のcardnoがあるか？存在チェック
	//---------------------------------------------
	//---------------------------------------------
	//最新の指定がある時card_tbの存在チェック
	//---------------------------------------------
	//金額を合計する
	//成功リターン
	{
		if (this.checkFormat(A_line) == false) //失敗
			{
				// if (this.DEBUG) this.logging("WARNING: \u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u7570\u306A\u308A\u307E\u3059 " + billfile);
				if (this.DEBUG) this.logging("WARNING: フォーマットが異なります " + billfile);
				// this.logh!.putError(G_SCRIPT_WARNING, this.SCRIPT_NAME + " " + this.DataTitle + "\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + billfile + " \u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u7570\u306A\u308A\u307E\u3059\u3002\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\u3002\uFF11\u4EF6\u3082\u53D6\u8FBC\u307E\u305B\u3093\u3067\u3057\u305F\u3002 " + billfile);
				this.logh!.putError(G_SCRIPT_WARNING, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + PACT_result + " " + billfile + " データファイルのフォーマットが異なります。処理を中断します。１件も取込ませんでした。 " + billfile);
				return true;
			}


		var cardNo = A_line[4];

		if (A_line[6] == 0) //成功
			{
				// if (this.DEBUG) this.logging("WARNING: \u5229\u7528\u65E5\u304C\u5168\u3066\uFF10\u306E\u30EC\u30B3\u30FC\u30C9\u306F\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059 " + billfile + "(" + cardNo + ")");
				if (this.DEBUG) this.logging("WARNING: 利用日が全て０のレコードはスキップします " + billfile + "(" + cardNo + ")");
				return false;
			}


		var viewcnt = 1;

		var copy_buf = "";

		if ("1" == A_line[12]) {

			var charge = +(A_line[8] * -1);
		} else {
			charge = +A_line[8];
		}

		// if (preg_match("/" + pactid + "\t" + cardNo + "\t" + NICOS_UTICODE + "\t\u901A\u884C\u6599\u91D1\t/", this.detail_write_buf) == false) //法人番号
		if (this.detail_write_buf.match("/" + pactid + "\t" + cardNo + "\t" + NICOS_UTICODE + "\t通行料金\t/")) //法人番号
			//法人番号
			{
				// this.detail_write_buf += pactid + "\t" + cardNo + "\t" + NICOS_UTICODE + "\t" + "\u901A\u884C\u6599\u91D1" + "\t" + charge + "\t" + "\t" + viewcnt + "\t" + this.nowtime + "\t" + this.COID + "\t" + this.CompCode + "\n";
				this.detail_write_buf += pactid + "\t" + cardNo + "\t" + NICOS_UTICODE + "\t" + "通行料金" + "\t" + charge + "\t" + "\t" + viewcnt + "\t" + this.nowtime + "\t" + this.COID + "\t" + this.CompCode + "\n";
				viewcnt++;
				// this.detail_write_buf += pactid + "\t" + cardNo + "\t" + NICOS_SEIKYU_UTICODE + "\t" + "\u8ACB\u6C42\u91D1\u984D\t" + charge + "\t" + "\t" + viewcnt + "\t" + this.nowtime + "\t" + this.COID + "\t" + this.CompCode + "\n";
				this.detail_write_buf += pactid + "\t" + cardNo + "\t" + NICOS_SEIKYU_UTICODE + "\t" + "請求金額\t" + charge + "\t" + "\t" + viewcnt + "\t" + this.nowtime + "\t" + this.COID + "\t" + this.CompCode + "\n";
			} else //通行料金、請求金額の置き換え
			//通行料金加算
			//通行料置き換え
			//請求金額置き換え
			{
				// preg_match_all("/" + pactid + "\t" + cardNo + "\t" + NICOS_UTICODE + "\t.*\n/", this.detail_write_buf, A_match);
				this.detail_write_buf = preg_match_all("/" + pactid + "\t" + cardNo + "\t" + NICOS_UTICODE + "\t.*\n/", A_match, "");

				var A_match;
				// var A_match_col = split("\t", A_match[0][0]);
				var A_match_col = A_match[0][0].split("\t");
				A_match_col[4] = A_match_col[4] + charge;

				var new_buf = A_match_col.join("\t");
				// this.detail_write_buf = preg_replace("/" + pactid + "\t" + cardNo + "\t" + NICOS_UTICODE + "\t.*\n/", new_buf, this.detail_write_buf);
				this.detail_write_buf = this.detail_write_buf.replace("/" + pactid + "\t" + cardNo + "\t" + NICOS_UTICODE + "\t.*\n/", new_buf);
				A_match_col[2] = NICOS_SEIKYU_UTICODE;
				// A_match_col[3] = "\u8ACB\u6C42\u91D1\u984D";
				A_match_col[3] = "請求金額";
				A_match_col[6]++;
				new_buf = A_match_col.join("\t");
				// this.detail_write_buf = preg_replace("/" + pactid + "\t" + cardNo + "\t" + NICOS_SEIKYU_UTICODE + "\t.*\n/", new_buf, this.detail_write_buf);
				this.detail_write_buf = this.detail_write_buf.replace("/" + pactid + "\t" + cardNo + "\t" + NICOS_SEIKYU_UTICODE + "\t.*\n/", new_buf);
			}

		// if (this.aspFlg == true && preg_match("/" + pactid + "\t" + cardNo + "\t" + G_CODE_ASPX + "\tASP\u4F7F\u7528\u6599/", this.detail_write_buf) == false) //合計行のために１つ表示順を空ける
		if (this.aspFlg == true && this.detail_write_buf.match("/" + pactid + "\t" + cardNo + "\t" + G_CODE_ASPX + "\tASP使用料/")) //合計行のために１つ表示順を空ける
			//法人番号
			{
				// this.detail_write_buf += pactid + "\t" + cardNo + "\t" + G_CODE_ASPX + "\t" + "ASP\u4F7F\u7528\u6599\t" + this.asp_charge + "\t" + "\t" + "100\t" + this.nowtime + "\t" + this.COID + "\t" + this.CompCode + "\n";
				this.detail_write_buf += pactid + "\t" + cardNo + "\t" + G_CODE_ASPX + "\t" + "ASP使用料\t" + this.asp_charge + "\t" + "\t" + "100\t" + this.nowtime + "\t" + this.COID + "\t" + this.CompCode + "\n";
			}

		copy_buf = "";

		var day = A_line[15];

		var usedate = "\"" + day.substring(0, 4) + "-" + day.substring(4, 2) + "-" + day.substring(6, 2) + "\"";

		var usetime = "";

		// var A_entlv = split("-", A_line[7]);
		var A_entlv = A_line[7].split("-");

		if (A_entlv.length == 2) {

			var enter = A_entlv[0].trim();

			var leave = A_entlv[1].trim();
		// } else if (mb_substr(A_line[7], 10, 1) === "-") //10文字目にハイフンがあれば、そこで分ける
		} else if (A_line[7].substring(10, 1) === "-") //10文字目にハイフンがあれば、そこで分ける
			//print "DEBUG: ハイフン特例処理、$enter and $leave \n";
			{
				// enter = mb_substr(A_line[7], 0, 10).trim();
				enter = A_line[7].substring(0, 10).trim();
				// leave = mb_substr(A_line[7], 11).trim();
				leave = A_line[7].substring(11).trim();
			} else //if($this->DEBUG) $this->logging("WARNING: 入口、出口の区別がつかない、" .  $A_line[7] .", ". $billfile);
			//入口に全部入れる
			{
				// this.logh!.putError(G_SCRIPT_WARNING, this.SCRIPT_NAME + " " + this.DataTitle + "\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + billfile + "\u5165\u53E3\u3001\u51FA\u53E3\u306E\u533A\u5225\u304C\u3064\u304B\u306A\u3044\u3001(" + A_line[7] + ")");
				this.logh!.putError(G_SCRIPT_WARNING, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + PACT_result + " " + billfile + "入口、出口の区別がつかない、(" + A_line[7] + ")");
				enter = A_line[7].trim();
				leave = "";
			}

		this.history_write_buf += pactid + "\t" + cardNo + "\t" + this.CompCode + "\t" + "\t" + "\t" + enter + "\t" + "\t" + leave + "\t" + usedate + "\t" + usetime + "\t" + charge + "\t" + "\t" + A_line[24] + "\t" + "\t" + this.COID + "\n";

		if (-1 !== CARD_result.indexOf(cardNo) == false) {
			// if (preg_match("/" + cardNo + "/", this.card_xx_write_buf) == false) //card_xx_tbへのコピー文のバッファ
			if (this.card_xx_write_buf.match("/" + cardNo + "/")) //card_xx_tbへのコピー文のバッファ
				//削除フラグ
				{
					copy_buf = pactid + "\t" + this.trg_post + "\t" + cardNo + "\t" + cardNo + "\t" + "\t" + "\t" + this.CompCode + "\t" + "\t" + A_line[5] + "\t" + "\t" + "\t" + this.COID + "\t" + this.nowtime + "\t" + this.nowtime + "\t" + "false";

					if (String(this.SUOspec === "y")) //SUO特別対応
						//使用者 <- ETCカード名義
						{
							copy_buf += "\t" + A_line[5] + "\n";
						} else {
						copy_buf += "\n";
					}

					this.card_xx_write_buf += copy_buf;
				}
		} else //既にあるカードについては使用者をアップデート
			{
				if (undefined !== this.card_xx_meigi_write_buf[cardNo] == false) //ETCカード名義
					{
						this.card_xx_meigi_write_buf[cardNo] = A_line[5];
					}
			}

		if (String(this.target === "n")) //card_tbにデータが無いときはコピー文作成
			//card_tb削除済にデータがある時は一回データを消す
			{
				if (-1 !== CARD_now_result.indexOf(cardNo) == false) {
					// if (preg_match("/" + cardNo + "/", this.card_write_buf) == false) //削除フラグ
					if ( this.card_write_buf.match("/" + cardNo + "/")) //削除フラグ
						{
							copy_buf = pactid + "\t" + this.trg_post + "\t" + cardNo + "\t" + cardNo + "\t" + "\t" + "\t" + this.CompCode + "\t" + "\t" + A_line[5] + "\t" + "\t" + "\t" + this.COID + "\t" + this.nowtime + "\t" + this.nowtime + "\t" + "false";

							if (String(this.SUOspec === "y")) //SUO特別対応
								//使用者 <- ETCカード名義
								{
									copy_buf += "\t" + A_line[5] + "\n";
								} else {
								copy_buf += "\n";
							}

							this.card_write_buf += copy_buf;
						}
				} else //既にあるカードについては使用者をアップデート
					{
						if (undefined !== this.card_meigi_write_buf[cardNo] == false) //ETCカード名義
							{
								this.card_meigi_write_buf[cardNo] = A_line[5];
							}
					}

				if (-1 !== CARD_now_delete_result.indexOf(cardNo) == true) {

					var del_sql = "delete from card_tb where cardno='" + cardNo + "' and pactid=" + pactid + " and delete_flg=true";

					if (-1 !== A_del_sql.indexOf(del_sql) == false) {
						A_del_sql.push(del_sql);
					}
				}
			}

		this.SumUp += charge;
		return false;
	}

	checkFormat(A_line) //2.集計部署コード
	{

		var errcnt = 0;

		// if (preg_match("/^(\\d){0,10}$/", A_line[1]) == false) {
		if (A_line[1].match("/^(\\d){0,10}$/") == false) {
			// if (this.DEBUG) this.logging("\u96C6\u8A08\u90E8\u7F72\u30B3\u30FC\u30C9\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[1] + "(" + A_line[4] + ")");
			if (this.DEBUG) this.logging("集計部署コードのフォーマットが違います " + A_line[1] + "(" + A_line[4] + ")");
			errcnt++;
		}

		// if (preg_match("/^(\\d){0,10}$/", A_line[2]) == false) {
		if (A_line[2].match("/^(\\d){0,10}$/") == false) {
			// if (this.DEBUG) this.logging("\u4E88\u7B97\u5358\u4F4D\u30B3\u30FC\u30C9\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[2] + "(" + A_line[4] + ")");
			if (this.DEBUG) this.logging("予算単位コードのフォーマットが違います " + A_line[2] + "(" + A_line[4] + ")");
			errcnt++;
		}

		// if (preg_match("/^.{0,10}$/", A_line[3]) == false) {
		if (A_line[3].match("/^.{0,10}$/") == false) {
			// if (this.DEBUG) this.logging("\u793E\u54E1\u30B3\u30FC\u30C9\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[3] + "(" + A_line[4] + ")");
			if (this.DEBUG) this.logging("社員コードのフォーマットが違います " + A_line[3] + "(" + A_line[4] + ")");
			errcnt++;
		}

		// if (preg_match("/^(\\d){0,}$/", A_line[4]) == false) {
		if (A_line[4].match("/^(\\d){0,}$/") == false) {
			// if (this.DEBUG) this.logging("ETC\u30AB\u30FC\u30C9\u756A\u53F7\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[4] + "(" + A_line[4] + ")");
			if (this.DEBUG) this.logging("ETCカード番号のフォーマットが違います " + A_line[4] + "(" + A_line[4] + ")");
			errcnt++;
		}

		// if (preg_match("/^(\\d){0,}$/", A_line[8]) == false) {
		if (A_line[8].match("/^(\\d){0,}$/") == false) {
			// if (this.DEBUG) this.logging("\u5186\u91D1\u984D\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[8] + "(" + A_line[4] + ")");
			if (this.DEBUG) this.logging("円金額のフォーマットが違います " + A_line[8] + "(" + A_line[4] + ")");
			errcnt++;
		}

		// if (preg_match("/^(\\d){0,8}$/", A_line[15]) == false) {
		if (A_line[15].match("/^(\\d){0,8}$/") == false) {
			// if (this.DEBUG) this.logging("\u5229\u7528\u65E5\u4ED8\uFF12\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[15] + "(" + A_line[4] + ")");
			if (this.DEBUG) this.logging("利用日付２のフォーマットが違います " + A_line[15] + "(" + A_line[4] + ")");
			errcnt++;
		}

		if (errcnt != 0) {
			return false;
		} else {
			return true;
		}
	}

	doSUOspec(cardX_tb) //成功
	{
		{
			let _tmp_0 = this.card_meigi_write_buf;


			for (var cardNo in _tmp_0) //print "DEBUG: $sql\n";
			{

				var meigi = _tmp_0[cardNo];

				var sql = "update card_tb set username='" + meigi + "' where cardno='" + cardNo + "'";
				this.dbh!.query(sql);
			}
		}

		if (String(this.target === "n")) {
			{
				let _tmp_1 = this.card_xx_meigi_write_buf;


				for (var cardNo in _tmp_1) //print "DEBUG: $sql\n";
				{

					var meigi = _tmp_1[cardNo];
					sql = "update " + cardX_tb + " set username='" + meigi + "' where cardno='" + cardNo + "'";
					this.dbh!.query(sql);
				}
			}
		}

		return false;
	}

};

(() => {
var O_Instance = new ImportEtcNicosHist();
O_Instance.Execute();
throw process.exit(0);
})();