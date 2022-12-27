//
//monotaro取込み 伊達
//
//error_reporting(E_ALL|E_STRICT);
//
//ImportMonotaroModel
//Monotaro取込み
//@uses ModelBase
//@package
//@author web
//@since 2017/01/26
//

require("MtTableUtil.php");

require("model/ModelBase.php");

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
//
//__construct
//コンストラクタ
//@author web
//@since 2017/01/26
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//getTableNo
//テーブル番号の取得
//@author web
//@since 2017/02/09
//
//@access public
//@return void
//
//
//setPactID
//pactidの設定と、それに対する初期化処理
//@author web
//@since 2017/02/02
//
//@param mixed $pactid
//@param mixed $mode
//@access public
//@return void
//
//
//makeInsertPurchaseData
//purchase_tbの新規登録用データ
//@author web
//@since 2017/01/31
//
//@param mixed $pactid
//@param mixed $purchid
//@access protected
//@return void
//
//
//makeInsertPurchaseDetailsData
//purchase_details_xx_tbへの追加を行う
//@author web
//@since 2017/02/02
//
//@param mixed $purchid
//@param mixed $data
//@param mixed $detailno
//@access protected
//@return void
//
//
//makeInsertPurchaseDetailsTax
//purchase_details_xx_tbに消費税追加
//@author web
//@since 2017/02/02
//
//@param mixed $purchid
//@param mixed $data
//@access protected
//@return void
//
//
//AddDataByFile
//ファイルを読み込み、内容をDBに書きこむ
//@author web
//@since 2017/01/27
//
//@param mixed $pactid
//@param mixed $filename
//@access public
//@return void
//
//
//addEndData
//ASP利用料の追加を行うよ
//@author web
//@since 2017/02/02
//
//@access public
//@return void
//
//
//beginTransaction
//トランザクション開始
//@author web
//@since 2017/01/30
//
//@access public
//@return void
//
//
//rollback
//ロールバックを行う
//@author web
//@since 2017/01/30
//
//@access public
//@return void
//
//
//commit
//SQLをcommitする
//@author web
//@since 2017/01/30
//
//@access public
//@return void
//
//
//__destruct
//デストラクタ
//@author web
//@since 2017/01/26
//
//@access public
//@return void
//
class ImportMonotaroModel extends ModelBase {
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
		var tb_util = new MtTableUtil();
		this.tbno = tb_util.getTableNo(billdate);
		this.purchase_xx_tb = "purchase_" + this.tbno + "_tb";
		this.purchase_details_xx_tb = "purchase_details_" + this.tbno + "_tb";
		this.O_Post = new PostModel();
	}

	getTableNo() {
		return this.tbno;
	}

	setPactID(pactid, mode) //既に登録されている購買IDを取得する(purchase_tb)
	//既に登録されている購買IDを取得する(purchase_xx_tb)
	//内訳の取得を行う
	//ルートpostidの取得
	{
		this.pactid = pactid;
		var sql = "select purchid,delete_flg from purchase_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and purchcoid=" + this.get_DB().dbQuote(ImportMonotaroModel.coid, "integer", true);
		this.id_purchase_tb = this.get_DB().queryKeyAssoc(sql);
		sql = "select purchid,delete_flg from " + this.purchase_xx_tb + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and purchcoid=" + this.get_DB().dbQuote(ImportMonotaroModel.coid, "integer", true);
		this.id_purchase_xx_tb = this.get_DB().queryKeyAssoc(sql);
		sql = "select code,purchcoid,name,taxtype,codetype from purchase_utiwake_tb where purchcoid=" + ImportMonotaroModel.coid;
		this.utiwake = this.get_DB().queryKeyAssoc(sql);
		this.postid_root = this.O_Post.getRootPostid(pactid, 0, this.tbno);

		if (is_null(this.postid_root)) {
			this.errorOut(1000, "\n" + "pactid=" + pactid + "\u306B\u3066\u3001post_" + this.tbno + "_tb\u306B\u90E8\u7F72\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\n", 0, "", "");
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
				this.detailno = this.get_DB().queryAssoc(sql);
			}

		return true;
	}

	makeInsertPurchaseData(purchid) {
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

	makeInsertPurchaseDetailsData(purchid, data) {
		var code = "001";
		var taxkubun = "\u500B\u5225";
		var green1 = "0";
		var green2 = "0";
		var green3 = "0";
		var green4 = "0";
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

	makeInsertPurchaseDetailsTax(purchid, slipno, buydate, tax_sum) {
		var code = "009";
		var taxkubun = undefined;
		var green1 = "0";
		var green2 = "0";
		var green3 = "0";
		var green4 = "0";
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
			itemname: "\u6D88\u8CBB\u7A0E",
			itemsum: undefined,
			buydate: buydate,
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

	addDataByFile(filename, TargetTable) //データを格納する
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
		var A_purchase_tb = Array();
		var A_purchase_xx_tb = Array();
		var A_purchase_details_xx_tb = Array();
		var A_id_rest_purchase_tb = Array();
		var A_id_rest_purchase_xx_tb = Array();
		var datas = file(filename);
		var slipno = undefined;
		var buydate = undefined;
		var purchid = undefined;
		var tax_sum = 0;

		if (!datas) {
			this.errorOut(1000, "\n" + "\u8AAD\u307F\u8FBC\u307F\u30A8\u30E9\u30FC(" + filename + ")\n", 0, "", "");
			return false;
		}

		for (var lineno in datas) //最初の行はデータ項目名なので無視するやで
		//改行コード除去
		//文字コード変換
		//カンマ区切り
		//登録されていないdetailnoの初期化
		//消費税の加算
		//請求の詳細を追加
		//purchase_tbに登録されていない場合、追加を行う
		{
			var line = datas[lineno];

			if (lineno == 0) {
				continue;
			}

			var data = rtrim(line, "\r\n");
			data = mb_convert_encoding(data, "UTF8", "SJIS-WIN");
			data = split("\\,", rtrim(data));
			var data_count = data.length;

			if (data_count != this.getSetting().DATA_COUNT) {
				this.errorOut(1000, "\n" + filename + "\u306B\u3066" + lineno + "\u884C\u76EE\u306E\u30C7\u30FC\u30BF\u6570\u304C" + data_count + "\u3067\u3059\n", 0, "", "");
				this.errorOut(1000, "\u3053\u306E\u5024\u306F" + this.getSetting().DATA_COUNT + "\u3067\u306A\u3051\u308C\u3070\u3044\u3051\u307E\u305B\u3093\n", 0, "", "");
				return false;
			}

			var purchid_tmp = this.getSetting().LOGINID_HEADER + data[3];

			if (!(undefined !== this.detailno[purchid_tmp])) {
				this.detailno[purchid_tmp] = 0;
			}

			if (!is_null(slipno) && slipno != data[ImportMonotaroModel.slipno_idx]) //消費税を追加する
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

		if (!is_null(slipno)) {
			A_purchase_details_xx_tb.push(this.makeInsertPurchaseDetailsTax(purchid, slipno, buydate, tax_sum));
		}

		if (!!A_id_rest_purchase_tb) //エラーチェックだよお・・
			{
				var sql = "update purchase_tb set delete_flg=false where" + " pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " and purchcoid=" + this.get_DB().dbQuote(ImportMonotaroModel.coid, "integer", true) + " and purchid in (" + A_id_rest_purchase_tb.join(",") + ")";
				var res = this.get_DB().exec(sql);

				if (res == false) {
					this.errorOut(1000, "\npurchase_tb\u306E\u524A\u9664\u30D5\u30E9\u30B0\u306E\u524A\u9664\u304C\u5931\u6557\n", 0, "", "");
					return false;
				}
			}

		if (!!A_id_rest_purchase_xx_tb) //エラーチェックだよお・・
			{
				sql = "update " + this.purchase_xx_tb + " set delete_flg=false where" + " pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " and purchcoid=" + this.get_DB().dbQuote(ImportMonotaroModel.coid, "integer", true) + " and purchid in (" + A_id_rest_purchase_xx_tb.join(",") + ")";
				res = this.get_DB().exec(sql);

				if (res == false) {
					this.errorOut(1000, "\n" + this.purchase_xx_tb + "\u306E\u524A\u9664\u30D5\u30E9\u30B0\u306E\u524A\u9664\u304C\u5931\u6557\n", 0, "", "");
					return false;
				}
			}

		if (!!A_purchase_tb) //エラーチェックだよお・・
			{
				res = this.get_DB().pgCopyFromArray("purchase_tb", A_purchase_tb);

				if (res == false) {
					this.errorOut(1000, "\npurchase_tb\u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					return false;
				}
			}

		if (!!A_purchase_xx_tb) //エラーチェックだよお・・
			{
				res = this.get_DB().pgCopyFromArray(this.purchase_xx_tb, A_purchase_xx_tb);

				if (res == false) {
					this.errorOut(1000, "\n" + this.purchase_xx_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					return false;
				}
			}

		if (!!A_purchase_details_xx_tb) //エラーチェックだよお・・
			{
				res = this.get_DB().pgCopyFromArray(this.purchase_details_xx_tb, A_purchase_details_xx_tb);

				if (res == false) {
					this.errorOut(1000, "\n" + this.purchase_details_xx_tb + "\u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					return false;
				}
			}

		var fin_dir = dirname(filename) + "/fin";
		var name = basename(filename);

		if (!file_exists(fin_dir)) {
			mkdir(fin_dir);
		}

		rename(filename, fin_dir + "/" + name);
		return true;
	}

	addASP() //ASP利用料を取得する
	//ASP存在チェック
	//各purchidの末尾に対してASPとASXを追加する
	//detailsに追加
	{
		var sql = "select * from purchase_asp_charge_tb where" + " pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " and purchcoid=" + this.get_DB().dbQuote(ImportMonotaroModel.coid, "integer", true);
		var asp_charge = this.get_DB().queryRowHash(sql);

		if (is_null(asp_charge)) //ASPなし
			{
				return false;
			}

		var asp = {
			pactid: this.pactid,
			purchid: undefined,
			purchcoid: ImportMonotaroModel.coid,
			code: "ASP",
			codename: this.utiwake.ASP.name,
			charge: asp_charge.charge,
			slipno: undefined,
			itemcode: undefined,
			itemname: "ASP\u5229\u7528\u6599",
			itemsum: undefined,
			buydate: undefined,
			comment: undefined,
			taxkubun: "\u500B\u5225",
			detailno: undefined,
			recdate: this.nowdate,
			green1: undefined,
			green2: undefined,
			green3: undefined,
			green4: undefined
		};
		var A_data = Array();
		{
			let _tmp_0 = this.detailno;

			for (var purchid in _tmp_0) //purchidの設定
			//ASP追加
			//ASX追加
			{
				var detailno = _tmp_0[purchid];
				this.detailno[purchid]++;
				asp.purchid = purchid;
				var code = "ASP";
				asp.code = code;
				asp.codename = this.utiwake[code].name;
				asp.detailno = this.detailno[purchid];
				asp.charge = asp_charge.charge;
				asp.itemname = "ASP\u5229\u7528\u6599";
				asp.taxkubun = "\u500B\u5225";
				this.detailno[purchid]++;
				A_data.push(asp);
				code = "ASX";
				asp.code = code;
				asp.codename = this.utiwake[code].name;
				asp.detailno = this.detailno[purchid];
				asp.charge = Math.round(asp_charge.charge * this.getSetting().excise_tax);
				asp.itemname = "ASP\u5229\u7528\u6599\u6D88\u8CBB\u7A0E";
				asp.taxkubun = undefined;
				this.detailno[purchid]++;
				A_data.push(asp);
			}
		}

		if (!!A_data) //エラーチェックだよお・・
			{
				var res = this.get_DB().pgCopyFromArray(this.purchase_details_xx_tb, A_data);

				if (res == false) {
					this.errorOut(1000, "\n" + this.purchase_details_xx_tb + "\u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F(ASP)\n", 0, "", "");
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

	__destruct() {
		super.__destruct();
	}

};