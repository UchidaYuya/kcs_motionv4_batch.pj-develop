import ImportBaseModel from "../../model/script/ImportBaseModel";
import MtAuthority from "../../MtAuthority";
import * as Encoding from "encoding-japanese";

// const fs = require('fs');
import * as fs from "fs";
import PATH from "path";


//csvのデータの場所
//親番号
//消費税のidx(csv)
//内訳大項目
//内訳項目名
//内訳金
//課税区分名称
//記事欄
//内訳区分
//内訳コード
//課税コード
//固定区分
//pactidの保存
//キャリアID
//端末種別
//管理に登録済みの電話番号一覧
//管理に登録済みの電話番号一覧(過去月)
//内訳コード
//detailnoのカウント用(detailsのdetailnoの値はここを参照する)
//現在のpactidのpostidのrootを取得する
//使用するテーブル名の保存
//ダミー番号。調整金額などをここにいれる
//ASP
//権限
export default class ImportKDDIServiceModel extends ImportBaseModel {
	pactid: number;
	carid: string | undefined;
	cirid: string | undefined;
	telno_tel_tb: Array<any>;
	telno_tel_xx_tb: Array<any>;
	utiwake: any;
	detailno: Array<any>;
	tbname: { [key: string]: any };
	dummy_tel_tb: any;
	asp: any;
	A_Auth : Array<any>;
	tbno: any;

	static prtelno_idx = 2;
	static telno_idx = 7;
	static utiwake_first_name_idx = 11;
	static utiwake_name_idx = 12;
	static charge_idx = 13;
	static taxkubun_idx = 14;
	static comment_idx = 15;
	static utiwake_kubun_idx = 16;
	static utiwake_code_idx = 17;
// 2022cvt_016
	static taxtype_idx = 18;
	static koteikubun_idx = 19;
	postid_root: any;

	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.pactid = 0;
		this.carid = undefined;
		this.cirid = undefined;
		this.telno_tel_tb = Array();
		this.telno_tel_xx_tb = Array();
		this.utiwake = undefined;
		this.detailno = Array();
		this.tbname = Array();
		this.dummy_tel_tb = undefined;
		this.asp = undefined;
		this.A_Auth = Array();
	}

	setTableName() {
		// if (is_null(this.tbno)) {
		if (!this.tbno) {
			return false;
		}

		this.tbname.tel_xx_tb = "tel_" + this.tbno + "_tb";
		this.tbname.tel_details_xx_tb = "tel_details_" + this.tbno + "_tb";
		return true;
	}

	setCarrierId(carid, cirid) {
		this.carid = carid;
		this.cirid = cirid;
	}

	getBackUpTableNameList() {
		return [this.tbname.tel_details_xx_tb];
	}

	async setPactID(pactid: number, mode: string) //権限について
	//既に登録されている電話番号一覧を取得する
	//既に登録されている電話番号を取得する(tel_xx_tb)
	//内訳の取得を行う
	//ASPが有効かチェック
	//dummy_tel_tbがないためエラー
	{
		this.pactid = pactid;
// 2022cvt_015
		var O_Auth = MtAuthority.singleton(pactid.toString());
		this.A_Auth = O_Auth.getPactFuncIni();
// 2022cvt_015
		var sql = "select telno,true from tel_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(this.carid, "integer", true) + " and cirid=" + this.get_DB().dbQuote(this.cirid, "integer", true);
		this.telno_tel_tb = await this.get_DB().queryKeyAssoc(sql);
		sql = "select telno,true from " + this.tbname.tel_xx_tb + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(this.carid, "integer", true) + " and cirid=" + this.get_DB().dbQuote(this.cirid, "integer", true);
		this.telno_tel_xx_tb = await this.get_DB().queryKeyAssoc(sql);
// 2022cvt_016
		sql = "select code,name,taxtype,codetype from utiwake_tb where" + " carid=" + this.get_DB().dbQuote(this.carid, "integer", true);
		this.utiwake = this.get_DB().queryKeyAssoc(sql);
		this.asp = undefined;

		if (-1 !== this.A_Auth.indexOf("fnc_asp")) //ASP利用料のチェック
			{
				sql = "select charge,manual from asp_charge_tb where" + " carid = " + this.get_DB().dbQuote(this.carid, "integer") + " and pactid = " + this.get_DB().dbQuote(this.pactid, "integer");
				this.asp = this.get_DB().queryRowHash(sql);

				// if (is_null(this.asp)) {
				if (!this.asp) {
					this.errorOut(1000, "pactid=" + pactid + "は「ASP利用料表示設定」権限が設定されていますが、asp_charge_tbに登録されていません\n", 0, "", "");
				}

				if (!(undefined !== this.utiwake.ASP)) {
					this.errorOut(1000, "pactid=" + pactid + "は「ASP利用料表示設定」権限が設定されていますが、ASPの内訳コードがありません\n", 0, "", "");
					this.asp = undefined;
				}

				if (!(undefined !== this.utiwake.ASX)) {
					this.errorOut(1000, "pactid=" + pactid + "は「ASP利用料表示設定」権限が設定されていますが、ASXの内訳コードがありません\n", 0, "", "");
					this.asp = undefined;
				}

				// if (is_null(this.asp)) {
				if (!this.asp) {
					return false;
				}
			}

		this.postid_root = await this.O_Post.getRootPostid(pactid, 0, this.tbno);

		// if (is_null(this.postid_root)) {
		if (!this.postid_root) {
			this.errorOut(1000, "\n" + "pactid=" + pactid + "にて、post_" + this.tbno + "_tbに部署が登録されていない\n", 0, "", "");
			return false;
		}

		sql = "select * from dummy_tel_tb where" + " pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(this.carid, "integer", true);
		this.dummy_tel_tb = await this.get_DB().queryRowHash(sql);

		// if (is_null(this.dummy_tel_tb)) {
		if (!this.dummy_tel_tb) {
			this.errorOut(1000, "\n" + "pactid=" + pactid + "にて、ダミー番号が登録されていません。調整金額用として必要です。\n", 0, "", "");
			return false;
		}

		if (mode == "O") //monotaroのdetailsを全て削除
			//detailnoをarrayで初期化
			{
				sql = "delete from " + this.tbname.tel_details_xx_tb + " where" + " pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(this.carid, "integer", true);
				this.get_DB().exec(sql);
				this.detailno = Array();
			} else //追加モードの場合はASPとASXを削除する
			//各電話のdetailnoの最大値を取得する
			{
				sql = "delete from " + this.tbname.tel_details_xx_tb + " where" + " pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(this.carid, "integer", true) + " and code in ('ASP','ASX')";
				this.get_DB().exec(sql);
				sql = "select telno,max(detailno) + 1 from " + this.tbname.tel_details_xx_tb + " where" + " pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(this.carid, "integer", true) + " group by telno";
				this.detailno = await this.get_DB().queryAssoc(sql);
			}

		return true;
	}

	makeInsertUtiwakeData(data: any[]) //値の設定
	{
		var res;
		res.code = data[ImportKDDIServiceModel.utiwake_code_idx];
		res.name = data[ImportKDDIServiceModel.utiwake_name_idx];
		res.kamoku = "6";
// 2022cvt_016
		res.taxtype = 0;
// 2022cvt_016
		res.codetype = "4";
		res.carid = this.carid;
		res.fixdate = this.nowdate;
		res.recdate = this.nowdate;
		return res;
	}

	makeInsertKamokuRelUtiwakeData(code: any) {
// 2022cvt_015
		var res: { [key: string]: any } = {}
		res.pactid = 0;
		res.kamokuid = 0;
		res.code = code;
		res.carid = this.carid;
		res.fixdate = this.nowdate;
		return res;
	}

	getDetailNo(telno: string | number) //登録されていないtelnoのdetailnoの初期化
	//カウンターを足しておく
	{
		if (!(undefined !== this.detailno[telno])) {
			this.detailno[telno] = 0;
		}

// 2022cvt_015
		var res = this.detailno[telno];
		this.detailno[telno]++;
		return res;
	}

	makeInsertTelDetailsData(data: any[]) //内訳コード
	//値の設定
	{
		var res;
// 2022cvt_015
		var utiwake_code = data[ImportKDDIServiceModel.utiwake_code_idx];
		res.pactid = this.pactid;
		res.telno = data[ImportKDDIServiceModel.telno_idx];
		res.code = utiwake_code;
		res.codename = this.utiwake[utiwake_code].name;
		res.charge = data[ImportKDDIServiceModel.charge_idx];
		res.taxkubun = undefined !== data[ImportKDDIServiceModel.taxkubun_idx] ? data[ImportKDDIServiceModel.taxkubun_idx] : "";
		res.detailno = this.getDetailNo(data[ImportKDDIServiceModel.telno_idx]);
		res.recdate = this.nowdate;
		res.carid = this.carid;
		res.prtelno = data[ImportKDDIServiceModel.prtelno_idx];

		if (undefined !== data[ImportKDDIServiceModel.comment_idx]) {
			res.tdcomment = data[ImportKDDIServiceModel.comment_idx];
		}

		return res;
	}

	makeInsertTelData(telno: string) {
		var res;
		res.pactid = this.pactid;
		res.postid = this.postid_root;
// 2022cvt_020
        // res.telno = str_replace("-", "", telno);
		res.telno = telno.replace("-", "");
		res.telno_view = telno;
		res.carid = this.carid;
		res.arid = 0;
		res.cirid = this.cirid;
		res.recdate = this.nowdate;
		res.fixdate = this.nowdate;
		return res;
	}

	addASP(telno: string, prtelno: string) //ASPが設定されているかチェックを行う
	//初期データの作成
	{
		// if (is_null(this.asp)) {
		if (!this.asp) {

			return true;
		}

		if (!(undefined !== this.utiwake.ASP)) {
			return false;
		}

		var data: any;
		this.detailno[telno]++;
		data[ImportKDDIServiceModel.utiwake_code_idx] = "ASP";
		data[ImportKDDIServiceModel.telno_idx] = telno;
		data[ImportKDDIServiceModel.charge_idx] = this.asp.charge;
		data[ImportKDDIServiceModel.prtelno_idx] = prtelno;
		return this.makeInsertTelDetailsData(data);
	}

	addASX(telno: string, prtelno: string) //ASPが設定されているかチェックを行う
	{
		// if (is_null(this.asp)) {
		if (!this.asp) {
			return true;
		}

		if (!(undefined !== this.utiwake.ASX)) {
			return false;
		}

// 2022cvt_015
        var data: any;
		var asx = Math.round(this.asp.charge * this.getSetting().get("excise_tax"));
		data[ImportKDDIServiceModel.utiwake_code_idx] = "ASX";
		data[ImportKDDIServiceModel.telno_idx] = telno;
		data[ImportKDDIServiceModel.charge_idx] = asx;
		data[ImportKDDIServiceModel.prtelno_idx] = prtelno;
		return this.makeInsertTelDetailsData(data);
	}

	addDataByFile(filename: string, TargetTable: string) //createDataして
	//pushDataでデータいれて
	//execInsertDataでpushDataで入れたデータをDBに反映する
	//読み込み
	//読み込みチェック
	//一行ずつ見ていく
	//--------------------------------------------------------------------------------
	//ASP
	//--------------------------------------------------------------------------------
	//内訳テーブルのみインサートする
	//--------------------------------------------------------------------------------
	//最後にファイル移動させておわり
	//--------------------------------------------------------------------------------
	//ディレクトリがなければ作る
	{
// 2022cvt_015
		var telno: string | undefined = undefined;
// 2022cvt_015
		var prtelno: string | undefined = undefined;
// 2022cvt_015
		var utiwake_first_name: string | undefined = undefined;
// 2022cvt_015
		var bError = false;
// 2022cvt_015
		// var datas = file(filename);
		var buffer;
		try {
			buffer = fs.readFileSync('utf8.txt', 'utf8');
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

		this.clearData();

// 2022cvt_015
		for (var lineno in datas) //最初の行はデータ項目名なので無視するやで
		//改行コード除去
		//文字コード変換
		//ダブルクォーテーションを削除
		//頭5文字の空白を削除
		//改行と"を削除してカンマでsplitする
		//--------------------------------------------------------------------------------
		//データ数チェック
		//--------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------
		//請求詳細(tel_details_xx_tb)
		//--------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------
		//電話管理
		//--------------------------------------------------------------------------------
		//tel_tbに登録されていない場合、追加を行う
		{
// 2022cvt_015
			var line = datas[lineno];

			// if (lineno == 0) {
			if (!lineno) {
				continue;
			}

// 2022cvt_015
			// var data = rtrim(line, "\r\n");
			var data = line.replace("\r\n", "");
			// data = mb_convert_encoding(data, "UTF8", "SJIS-WIN");
// 2022cvt_020
			// data = str_replace("\"", "", data);
			data = data.replace("\"", "");
// 2022cvt_020
			// data = str_replace("\u3000\u3000\u3000\u3000\u3000", "", data);
			data = data.replace("         ", "");
			// data = split(",", data);
			var data_2: Array<any> = data.split(",");
// 2022cvt_015
			var data_count = data_2.length;

			if (data_count != this.getSetting().get("DATA_COUNT")) {
				this.errorOut(1000, "\n" + filename + "にて" + lineno + "行目のデータ数が" + data_count + "です\n", 0, "", "");
				this.errorOut(1000, "この値は" + this.getSetting().get("DATA_COUNT") + "でなければいけません\n", 0, "", "");
				return false;
			}

			if (data_2[ImportKDDIServiceModel.utiwake_code_idx] == "") {
				continue;
			}

			if (data_2[ImportKDDIServiceModel.koteikubun_idx] == "3") {
				data_2[ImportKDDIServiceModel.telno_idx] = this.dummy_tel_tb.telno;
			}

			// if (data[ImportKDDIServiceModel.telno_idx] != "" && (is_null(telno) || telno != data[ImportKDDIServiceModel.telno_idx])) //ASPの追加
			if (data_2[ImportKDDIServiceModel.telno_idx] != "" && (!telno || telno != data_2[ImportKDDIServiceModel.telno_idx])) //ASPの追加
				{
					// if (!bError && !is_null(telno) && !is_null(this.asp)) {
					if (!bError && !telno && !this.asp) {
						if (telno != this.dummy_tel_tb.telno) //ASP
							{
// 2022cvt_015
								var res = this.addASP(telno!, prtelno!);

								if (Array.isArray(res)) {
									this.pushData(this.tbname.tel_details_xx_tb, res);
								}

								res = this.addASX(telno!, prtelno!);

								if (Array.isArray(res)) {
									this.pushData(this.tbname.tel_details_xx_tb, res);
								}
							}
					}

					telno = data_2[ImportKDDIServiceModel.telno_idx];
					prtelno = data_2[ImportKDDIServiceModel.prtelno_idx];
					utiwake_first_name = undefined;
				}

			if (!telno) {
				this.errorOut(1000, "電話番号が空です\n", 0, "", "");
				return false;
			}

// 2022cvt_015
			var utiwake_code = data_2[ImportKDDIServiceModel.utiwake_code_idx];

			if (data_2[ImportKDDIServiceModel.utiwake_first_name_idx]) {
				utiwake_first_name = data_2[ImportKDDIServiceModel.utiwake_first_name_idx];
			}

			if (undefined !== this.utiwake[utiwake_code]) //未登録の内訳コードとして既に処理されてるかチェック
				{
					if (undefined !== this.utiwake[utiwake_code].insert_flg) //未登録の内訳コード
						{
							continue;
						}

// 2022cvt_016
					if (this.utiwake[utiwake_code].codetype == 4) //見登録の内訳コード
						{
							bError = true;
							this.errorOut(1000, "未登録の内訳コードがあります(" + utiwake_code + ")\n", 0, "", "");
							continue;
						}
				} else //未登録の内訳コードである
				//内訳項目名がない場合は大項目の名前を使用しよう
				//内訳コードを未登録で登録
				//$this->pushData("utiwake_tb",$this->makeInsertUtiwakeData($data));
				//$this->pushData("kamoku_rel_utiwake_tb",$this->makeInsertKamokuRelUtiwakeData( $data[self::utiwake_code_idx] ));
				//この内訳コードを処理済みとして登録しておく
				//エラー出力
				{
					bError = true;

					if (!data_2[ImportKDDIServiceModel.utiwake_name_idx]) {
						data_2[ImportKDDIServiceModel.utiwake_name_idx] = utiwake_first_name!;
					}

// 2022cvt_016
					data_2[ImportKDDIServiceModel.taxtype_idx] = 1;
					this.utiwake[utiwake_code] = {
// 2022cvt_016
						codetype: 4,
						insert_flg: true
					};
					this.errorOut(1000, "未登録の内訳コードがあります。以下を新規登録してください\n", 0, "", "");
					this.errorOut(1000, "\t内訳コード=" + utiwake_code + "\n", 0, "", "");
					this.errorOut(1000, "\t内訳項目名=" + data_2[ImportKDDIServiceModel.utiwake_name_idx] + "\n", 0, "", "");
					this.errorOut(1000, "\t課税区分名称=" + data_2[ImportKDDIServiceModel.taxkubun_idx] + "\n", 0, "", "");
					continue;
				}

			this.pushData(this.tbname.tel_details_xx_tb, this.makeInsertTelDetailsData(data_2));

			if (TargetTable == "N" && !(undefined !== this.telno_tel_tb[telno])) //
				{
					this.telno_tel_tb[telno] = true;

					if (telno != this.dummy_tel_tb.telno) //A_tel_xx_tbに追加を行う
						{
							this.pushData("tel_tb", this.makeInsertTelData(telno));
						}
				}

			if (!(undefined !== this.telno_tel_xx_tb[telno])) //この購買IDは追加済みというチェックを付ける
				//A_tel_xx_tbに追加を行う
				{
					this.telno_tel_xx_tb[telno] = true;
					this.pushData(this.tbname.tel_xx_tb, this.makeInsertTelData(telno));
				}
		}

		// if (!is_null(telno) && !is_null(this.asp)) {
		if (!telno && !this.asp) {
			if (telno != this.dummy_tel_tb.telno) {
				this.pushData(this.tbname.tel_details_xx_tb, this.addASP(telno!, prtelno!));
				this.pushData(this.tbname.tel_details_xx_tb, this.addASX(telno!, prtelno!));
			}
		}

		this.get_DB().beginTransaction();

		if (!this.execInsertData("utiwake_tb")) //エラーの場合はロールバック
			{
				this.get_DB().rollback();
				return false;
			}

		if (!this.execInsertData("kamoku_rel_utiwake_tb")) //エラーの場合はロールバック
			{
				this.get_DB().rollback();
				return false;
			}

		if (bError) //DBに反映
			//空にしておく
			{
				this.get_DB().commit();
				this.clearData();
				return false;
			}

		if (!this.execInsertData()) //エラーの場合はロールバック
			{
				this.get_DB().rollback();
				return false;
			}

		this.get_DB().commit();
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

		// fs.renameSync(filename, fin_dir + "/" + name);
		// return true;
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};
