import MtTableUtil from "../../MtTableUtil";
import ModelBase from "../../model/ModelBase";
import MtScriptAmbient from "../../MtScriptAmbient";
import PostModel from "../PostModel";
import * as Encoding from "encoding-japanese";
import * as fs from "fs";
import * as PATH from "path";
import { URL } from "url";

//MonotaROのcoid
//購入日のidx(csv)
//const slipno_idx = 11;			//	伝票番号のidx(csv)
//伝票番号のidx(csv)
//消費税のidx(csv)
//MtScriptAmbient
//PostModel
//recdateに入れる日付
//既に登録されているpurchidの一覧(purchase_tb)
//既に登録されているpurchidの一覧(purchase_xx_tb)
//purchase_xx_tbテーブルの名前を保持する
//purchase_details_xx_tbテーブルの名前を保持する
//現在のpactidのpostidのrootを取得する
//内訳
//pactidの保存
//仕様xxテーブルのxx部分
//detailnoのカウント用
export default class ImportMonotaroModel extends ModelBase {
	id_purchase_tb: Array<any>;
	id_purchase_xx_tb: Array<any>;
	purchase_xx_tb: string;
	purchase_details_xx_tb: string;
	utiwake: { [key: string]: any };
	pactid: number;
	tbno: string;
	detailno: Array<any>;
	O_msa: MtScriptAmbient;
	nowdate: string;
	O_Post: PostModel;
	postid_root: any;

	static coid = 4;
	static buydate_idx = 10;
	static slipno_idx = 13;
	static tax_idx = 23;

	constructor(O_MtScriptAmbient: MtScriptAmbient, billdate) //親のコンストラクタを必ず呼ぶ
	//テーブル番号を取得する
	//purchase_xx_tbのテーブル名を決定
	//purchase_details_xx_tbのテーブル名を決定
	{
		super();
		this.id_purchase_tb = Array();
		this.id_purchase_xx_tb = Array();
		this.purchase_xx_tb = "";
		this.purchase_details_xx_tb = "";
		this.utiwake = Array();
		this.pactid = 0;
		this.tbno = "";
		this.detailno = Array();
		this.O_msa = O_MtScriptAmbient;
		this.nowdate = this.get_DB().getNow();
// 2022cvt_015
		// var tb_util = new MtTableUtil();
		this.tbno = MtTableUtil.getTableNo(billdate);
		this.purchase_xx_tb = "purchase_" + this.tbno + "_tb";
		this.purchase_details_xx_tb = "purchase_details_" + this.tbno + "_tb";
		this.O_Post = new PostModel();
	}

	getTableNo() {
		return this.tbno;
	}

	async setPactID(pactid: number, mode: string) //既に登録されている購買IDを取得する(purchase_tb)
	//既に登録されている購買IDを取得する(purchase_xx_tb)
	//内訳の取得を行う
	//ルートpostidの取得
	{
		this.pactid = pactid;
// 2022cvt_015
		var sql = "select purchid,delete_flg from purchase_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and purchcoid=" + this.get_DB().dbQuote(ImportMonotaroModel.coid, "integer", true);
		this.id_purchase_tb = await this.get_DB().queryKeyAssoc(sql);
		sql = "select purchid,delete_flg from " + this.purchase_xx_tb + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and purchcoid=" + this.get_DB().dbQuote(ImportMonotaroModel.coid, "integer", true);
		this.id_purchase_xx_tb = await this.get_DB().queryKeyAssoc(sql);
// 2022cvt_016
		sql = "select code,purchcoid,name,taxtype,codetype from purchase_utiwake_tb where purchcoid=" + ImportMonotaroModel.coid;
		this.utiwake = await this.get_DB().queryKeyAssoc(sql);
		this.postid_root = await this.O_Post.getRootPostid(pactid, 0, this.tbno);

		// if (is_null(this.postid_root)) {
		if (!this.postid_root) {
			this.errorOut(1000, "\n" + "pactid=" + pactid + "にて、post_" + this.tbno + "_tbに部署が登録されていない", 0, "", "");
			return false;
		}

		if (mode == "O") //monotaroのdetailsを全て削除
			//detailnoをarrayで初期化
			{
				sql = "delete from " + this.purchase_details_xx_tb + " where" + " pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " and purchcoid=" + ImportMonotaroModel.coid;
				this.get_DB().exec(sql);
				this.detailno = Array();
			} else //追加モードの場合はASPとASXを削除する
			//各購買IDのdetailnoの最大値を取得する
			{
				sql = "delete from " + this.purchase_details_xx_tb + " where" + " pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " and purchcoid=" + ImportMonotaroModel.coid + " and code in ('ASP','ASX')";
				this.get_DB().exec(sql);
				sql = "select purchid,max(detailno) + 1 from " + this.purchase_details_xx_tb + " where" + " pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " and purchcoid=" + ImportMonotaroModel.coid + " group by purchid";
				this.detailno = await this.get_DB().queryAssoc(sql);
			}

		return true;
	}

	makeInsertPurchaseData(purchid: any) {
		return {
			pactid: this.pactid,
			postid: this.postid_root,
			purchid: purchid,
			purchcoid: ImportMonotaroModel.coid,
			loginid: undefined,
			registdate: undefined,
			registcomp: undefined,
			registpost: undefined,
			registzip: undefined,
			registaddr1: undefined,
			registaddr2: undefined,
			registbuilding: undefined,
			registtelno: undefined,
			registfaxno: undefined,
			registemail: undefined,
			username: undefined,
			employeecode: undefined,
			memo: undefined,
			recdate: this.nowdate,
			fixdate: this.nowdate,
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
			int4: undefined,
			int5: undefined,
			int6: undefined,
			date1: undefined,
			date2: undefined,
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
			delete_flg: "false",
			dummy_flg: "false",
			delete_date: undefined,
			pre_purchid: undefined,
			pre_purchcoid: undefined
		};
	}

	makeInsertPurchaseDetailsData(purchid: string | number, data: any[]) {
// 2022cvt_015
		var code = "001";
// 2022cvt_015
		var taxkubun = "個別";
// 2022cvt_015
		var green1 = "0";
// 2022cvt_015
		var green2 = "0";
// 2022cvt_015
		var green3 = "0";
// 2022cvt_015
		var green4 = "0";
// 2022cvt_015
		var detailno = this.detailno[purchid];
		this.detailno[purchid]++;
		return {
			pactid: this.pactid,
			purchid: purchid,
			purchcoid: ImportMonotaroModel.coid,
			code: code,
			codename: this.utiwake[code].name,
			charge: data[22],
			slipno: data[ImportMonotaroModel.slipno_idx],
			itemcode: data[15],
			itemname: data[16],
			itemsum: data[20],
			buydate: data[ImportMonotaroModel.buydate_idx],
			comment: undefined,
			taxkubun: undefined,
			detailno: detailno,
			recdate: this.nowdate,
			green1: green1,
			green2: green2,
			green3: green3,
			green4: green4
		};
	}

	makeInsertPurchaseDetailsTax(purchid: string | number, slipno: any, buydate: any, tax_sum: any) {
// 2022cvt_015
		var code = "009";
// 2022cvt_015
		var taxkubun = undefined;
// 2022cvt_015
		var green1 = "0";
// 2022cvt_015
		var green2 = "0";
// 2022cvt_015
		var green3 = "0";
// 2022cvt_015
		var green4 = "0";
// 2022cvt_015
		var detailno = this.detailno[purchid];
		this.detailno[purchid]++;
		return {
			pactid: this.pactid,
			purchid: purchid,
			purchcoid: ImportMonotaroModel.coid,
			code: code,
			codename: this.utiwake[code].name,
			charge: tax_sum,
			slipno: slipno,
			itemcode: undefined,
			itemname: "消費税",
			itemsum: undefined,
			buydate: buydate,
			comment: undefined,
			taxkubun: "",
			detailno: detailno,
			recdate: this.nowdate,
			green1: green1,
			green2: green2,
			green3: green3,
			green4: green4
		};
	}

	async addDataByFile(filename: string, TargetTable: string) //データを格納する
	//データを格納する
	//購買詳細
	//復活用購買IDをまとめる
	//復活用購買IDをまとめる
	//読み込み
	//消費税の合計
	//読み込みチェック
	//データの読み込み終わり
	//消費税追加
	//ディレクトリがなければ作る
	{
// 2022cvt_015
		var A_purchase_tb = Array();
// 2022cvt_015
		var A_purchase_xx_tb = Array();
// 2022cvt_015
		var A_purchase_details_xx_tb = Array();
// 2022cvt_015
		var A_id_rest_purchase_tb = Array();
// 2022cvt_015
		var A_id_rest_purchase_xx_tb = Array();
// 2022cvt_015
		// var datas = file(filename);
		var buffer;
		try {
			buffer = fs.readFileSync(filename, "utf8");
		} catch (e) {
			this.errorOut(1000, "\n" + "読み込みエラー(" + filename + ")\n", 0, "", "");
			return false;
		}
		var text = Encoding.convert(buffer, {
			from: 'SJIS',
			to: 'UNICODE',
			type: 'string',
    });
		var datas = text.toString().split("\r\n");

// 2022cvt_015
		var slipno: any;
// 2022cvt_015
		var buydate: any;
// 2022cvt_015
		var purchid: any;
// 2022cvt_015
		var tax_sum: any;

// 2022cvt_015
		for (var lineno in datas) //最初の行はデータ項目名なので無視するやで
		//改行コード除去
		//文字コード変換
		//カンマ区切り
		//登録されていないdetailnoの初期化
		//消費税の加算
		//請求の詳細を追加
		//purchase_tbに登録されていない場合、追加を行う
		{
// 2022cvt_015
			var line = datas[lineno];

			// if (lineno == 0) {
			if (!lineno) {
				continue;
			}

// 2022cvt_015
			// var data = rtrim(line, "\r\n");
			// data = mb_convert_encoding(data, "UTF8", "SJIS-WIN");
			// data = split("\\,", rtrim(data));

			var data = line.split("\\,")
// 2022cvt_015
			var data_count = data.length;

			if (data_count != this.getSetting().get("DATA_COUNT")) {
				this.errorOut(1000, "\n" + filename + "にて" + lineno + "行目のデータ数が" + data_count + "です\n", 0, "", "");
				this.errorOut(1000, "この値は" + this.getSetting().get("DATA_COUNT") + "でなければいけません\n", 0, "", "");
				return false;
			}

// 2022cvt_015
			var purchid_tmp = this.getSetting().get("LOGINID_HEADER") + data[3];

			if (!(undefined !== this.detailno[purchid_tmp])) {
				this.detailno[purchid_tmp] = 0;
			}

			// if (!is_null(slipno) && slipno != data[ImportMonotaroModel.slipno_idx]) //消費税を追加する
			if (!slipno && slipno != data[ImportMonotaroModel.slipno_idx]) //消費税を追加する
				//消費税のリセット
				{
					A_purchase_details_xx_tb.push(this.makeInsertPurchaseDetailsTax(purchid, slipno, buydate, tax_sum));
					tax_sum = 0;
				}

			purchid = purchid_tmp;
			slipno = data[ImportMonotaroModel.slipno_idx];
			buydate = data[ImportMonotaroModel.buydate_idx];
			tax_sum += data[ImportMonotaroModel.tax_idx];
			A_purchase_details_xx_tb.push(this.makeInsertPurchaseDetailsData(purchid, data));

			if (TargetTable == "N") {
				if (!(undefined !== this.id_purchase_tb[purchid])) //購買IDが登録されていないので追加
					//A_purchase_xx_tbに追加を行う
					{
						this.id_purchase_tb[purchid] = false;
						A_purchase_tb.push(this.makeInsertPurchaseData(purchid));
					} else if (this.id_purchase_tb[purchid]) //削除フラグが有効なので、削除フラグを削除
					//削除フラグをfalse
					//復活対象リストに追加
					{
						this.id_purchase_tb[purchid] = false;
						A_id_rest_purchase_tb.push(this.get_DB().dbQuote(purchid, "text", true));
					}
			}

			if (!(undefined !== this.id_purchase_xx_tb[purchid])) //この購買IDは追加済みというチェックを付ける
				//A_purchase_xx_tbに追加を行う
				{
					this.id_purchase_xx_tb[purchid] = false;
					A_purchase_xx_tb.push(this.makeInsertPurchaseData(purchid));
				} else if (this.id_purchase_xx_tb[purchid]) //削除フラグが有効なので、削除フラグを削除
				//削除フラグをfalse
				//復活対象リストに追加
				{
					this.id_purchase_xx_tb[purchid] = false;
					A_id_rest_purchase_xx_tb.push(this.get_DB().dbQuote(purchid, "text", true));
				}
		}

		// if (!is_null(slipno)) {
		if (slipno) {
			A_purchase_details_xx_tb.push(this.makeInsertPurchaseDetailsTax(purchid, slipno, buydate, tax_sum));
		}

		if (!!A_id_rest_purchase_tb) //エラーチェックだよお・・
			{
// 2022cvt_015
				var sql = "update purchase_tb set delete_flg=false where" + " pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " and purchcoid=" + this.get_DB().dbQuote(ImportMonotaroModel.coid, "integer", true) + " and purchid in (" + A_id_rest_purchase_tb.join(",") + ")";
// 2022cvt_015
				var res = await this.get_DB().exec(sql);

				if (!res == false) {
					this.errorOut(1000, "\npurchase_tbの削除フラグの削除が失敗", 0, "", "");
					return false;
				}
			}

		if (A_id_rest_purchase_xx_tb) //エラーチェックだよお・・
			{
				sql = "update " + this.purchase_xx_tb + " set delete_flg=false where" + " pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " and purchcoid=" + this.get_DB().dbQuote(ImportMonotaroModel.coid, "integer", true) + " and purchid in (" + A_id_rest_purchase_xx_tb.join(",") + ")";
				res = this.get_DB().exec(sql);

				if (!res == false) {
					this.errorOut(1000, "\n" + this.purchase_xx_tb + "の削除フラグの削除が失敗", 0, "", "");
					return false;
				}
			}

		if (A_purchase_tb) //エラーチェックだよお・・
			{
				res = this.get_DB().pgCopyFromArray("purchase_tb", A_purchase_tb);

				if (!res == false) {
					this.errorOut(1000, "\npurchase_tbへのデータ取込に失敗しました\n", 0, "", "");
					return false;
				}
			}

		if (A_purchase_xx_tb) //エラーチェックだよお・・
			{
				res = this.get_DB().pgCopyFromArray(this.purchase_xx_tb, A_purchase_xx_tb);

				if (!res == false) {
					this.errorOut(1000, "\n" + this.purchase_xx_tb + " へのデータ取込に失敗しました\n", 0, "", "");
					return false;
				}
			}

		if (A_purchase_details_xx_tb) //エラーチェックだよお・・
			{
				res = this.get_DB().pgCopyFromArray(this.purchase_details_xx_tb, A_purchase_details_xx_tb);

				if (!res == false) {
					this.errorOut(1000, "\n" + this.purchase_details_xx_tb + "へのデータ取込に失敗しました\n", 0, "", "");
					return false;
				}
			}

// 2022cvt_015
		// var fin_dir = dirname(filename) + "/fin";
		var path = PATH.parse(filename)
		var fin_dir = path.dir + "/fin"

// 2022cvt_015
        // var name = basename(filename);
		var name = path.base

		if (!fs.existsSync(fin_dir)) {
			fs.mkdirSync(fin_dir);
		}

		fs.renameSync(filename, fin_dir + "/" + name);
		return true;
		// if (!file_exists(fin_dir)) {
		// if (!fs.existsSync(fin_dir)) {
		// 	// mkdir(fin_dir);
		// 	fs.mkdirSync(fin_dir);
		// }

		// // rename(filename, fin_dir + "/" + name);
		// fs.renameSync(filename, fin_dir + "/" + name);
		// return true;
	}

	async addASP() //ASP利用料を取得する
	//ASP存在チェック
	//各purchidの末尾に対してASPとASXを追加する
	//detailsに追加
	{
// 2022cvt_015
		var sql = "select * from purchase_asp_charge_tb where" + " pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " and purchcoid=" + this.get_DB().dbQuote(ImportMonotaroModel.coid, "integer", true);
// 2022cvt_015
		var asp_charge = await this.get_DB().queryRowHash(sql);

		// if (is_null(asp_charge)) //ASPなし
		if (!asp_charge) //ASPなし
			{
				return false;
			}

// 2022cvt_015
		var asp = {
			pactid: this.pactid,
			purchid: "",
			purchcoid: ImportMonotaroModel.coid,
			code: "ASP",
			codename: this.utiwake.ASP.name,
			charge: asp_charge.charge,
			slipno: undefined,
			itemcode: undefined,
			itemname: "ASP利用料",
			itemsum: undefined,
			buydate: undefined,
			comment: undefined,
			taxkubun: "個別",
			detailno: undefined,
			recdate: this.nowdate,
			green1: undefined,
			green2: undefined,
			green3: undefined,
			green4: undefined
		};
// 2022cvt_015
		var A_data = Array();
		{
			let _tmp_0 = this.detailno;

// 2022cvt_015
			for (var purchid in _tmp_0) //purchidの設定
			//ASP追加
			//ASX追加
			{
// 2022cvt_015
				var detailno = _tmp_0[purchid];
				this.detailno[purchid]++;
				asp.purchid = purchid;
// 2022cvt_015
				var code = "ASP";
				asp.code = code;
				asp.codename = this.utiwake[code].name;
				asp.detailno = this.detailno[purchid];
				asp.charge = asp_charge.charge;
				asp.itemname = "ASP利用料";
				asp.taxkubun = "個別";
				this.detailno[purchid]++;
				A_data.push(asp);
				code = "ASX";
				asp.code = code;
				asp.codename = this.utiwake[code].name;
				asp.detailno = this.detailno[purchid];
				asp.charge = Math.round(asp_charge.charge * this.getSetting().get("excise_tax"));
				asp.itemname = "ASP利用料消費税";
				asp.taxkubun = "";
				this.detailno[purchid]++;
				A_data.push(asp);
			}
		}

		if (A_data) //エラーチェックだよお・・
			{
// 2022cvt_015
				var res = this.get_DB().pgCopyFromArray(this.purchase_details_xx_tb, A_data);

				if (!res == false) {
					this.errorOut(1000, "\n" + this.purchase_details_xx_tb + "へのデータ取込に失敗しました(ASP)\n", 0, "", "");
					return false;
				}
			}

		return true;
	}

	beginTransaction() {
		this.get_DB().beginTransaction();
	}

	rollback() //問題が発生したのでロールバックして終了
	{
		this.get_DB().rollback();
	}

	commit() //コミット
	{
		this.get_DB().commit();
		return true;
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};
