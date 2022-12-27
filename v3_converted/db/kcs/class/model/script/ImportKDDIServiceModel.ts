//
//kddiサービス取込み 伊達
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

require("ImportBaseModel.php");

require("MtAuthority.php");

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
//setManageTableName
//テーブル名の設定
//@author web
//@since 2017/02/22
//
//@param mixed $name
//@access public
//@return void
//
//
//setCarrierId
//キャリアIDと端末種別の設定
//@author web
//@since 2017/02/23
//
//@param mixed $carid
//@param mixed $cirid
//@access public
//@return void
//
//
//getBackUpTableNameList
//バックアップ対象のテーブル名一覧を返す
//@author web
//@since 2017/02/23
//
//@access public
//@return void
//
//
//setPactID
//pactidの設定と、それに対する初期化処理
//登録済みの電話番号などの一覧を取得する
//@author web
//@since 2017/02/02
//
//@param mixed $pactid
//@param mixed $mode
//@access public
//@return void
//
//
//makeInsertUtiwakeData
//内訳insert用
//@author web
//@since 2017/02/27
//
//@param mixed $data
//@access private
//@return void
//
//
//makeInsertKamokuRelUtiwakeData
//
//@author web
//@since 2017/03/10
//
//@param mixed $code
//@access private
//@return void
//
//
//getDetatailNo
//detailno取得
//@author date
//@since 2017/02/28
//
//@access private
//@return void
//
//
//makeInsertTelDetailsData
//tel_details_xx_tbのインサート用データの作成
//@author web
//@since 2017/02/27
//
//@param mixed $data
//@access private
//@return void
//
//
//makeInsertTelData
//
//@author web
//@since 2017/02/28
//
//@param mixed $telno
//@access private
//@return void
//
//
//addASP
//ASP用データの作成
//@author web
//@since 2017/03/03
//
//@param mixed $telno
//@param mixed $prtelno
//@access public
//@return void
//
//
//addASX
//ASX用データの作成
//@author web
//@since 2017/03/03
//
//@param mixed $telno
//@param mixed $prtelno
//@access public
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
//__destruct
//デストラクタ
//@author web
//@since 2017/01/26
//
//@access public
//@return void
//
class ImportKDDIServiceModel extends ImportBaseModel {
	static prtelno_idx = 2;
	static telno_idx = 7;
	static utiwake_first_name_idx = 11;
	static utiwake_name_idx = 12;
	static charge_idx = 13;
	static taxkubun_idx = 14;
	static comment_idx = 15;
	static utiwake_kubun_idx = 16;
	static utiwake_code_idx = 17;
	static taxtype_idx = 18;
	static koteikubun_idx = 19;

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
		if (is_null(this.tbno)) {
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

	setPactID(pactid, mode) //権限について
	//既に登録されている電話番号一覧を取得する
	//既に登録されている電話番号を取得する(tel_xx_tb)
	//内訳の取得を行う
	//ASPが有効かチェック
	//dummy_tel_tbがないためエラー
	{
		this.pactid = pactid;
		var O_Auth = MtAuthority.singleton(pactid);
		this.A_Auth = O_Auth.getPactFuncIni();
		var sql = "select telno,true from tel_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(this.carid, "integer", true) + " and cirid=" + this.get_DB().dbQuote(this.cirid, "integer", true);
		this.telno_tel_tb = this.get_DB().queryKeyAssoc(sql);
		sql = "select telno,true from " + this.tbname.tel_xx_tb + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(this.carid, "integer", true) + " and cirid=" + this.get_DB().dbQuote(this.cirid, "integer", true);
		this.telno_tel_xx_tb = this.get_DB().queryKeyAssoc(sql);
		sql = "select code,name,taxtype,codetype from utiwake_tb where" + " carid=" + this.get_DB().dbQuote(this.carid, "integer", true);
		this.utiwake = this.get_DB().queryKeyAssoc(sql);
		this.asp = undefined;

		if (-1 !== this.A_Auth.indexOf("fnc_asp")) //ASP利用料のチェック
			{
				sql = "select charge,manual from asp_charge_tb where" + " carid = " + this.get_DB().dbQuote(this.carid, "integer") + " and pactid = " + this.get_DB().dbQuote(this.pactid, "integer");
				this.asp = this.get_DB().queryRowHash(sql);

				if (is_null(this.asp)) {
					this.errorOut(1000, "pactid=" + pactid + "\u306F\u300CASP\u5229\u7528\u6599\u8868\u793A\u8A2D\u5B9A\u300D\u6A29\u9650\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u304C\u3001asp_charge_tb\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\n", 0, "", "");
				}

				if (!(undefined !== this.utiwake.ASP)) {
					this.errorOut(1000, "pactid=" + pactid + "\u306F\u300CASP\u5229\u7528\u6599\u8868\u793A\u8A2D\u5B9A\u300D\u6A29\u9650\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u304C\u3001ASP\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u305B\u3093\n", 0, "", "");
					this.asp = undefined;
				}

				if (!(undefined !== this.utiwake.ASX)) {
					this.errorOut(1000, "pactid=" + pactid + "\u306F\u300CASP\u5229\u7528\u6599\u8868\u793A\u8A2D\u5B9A\u300D\u6A29\u9650\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u304C\u3001ASX\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u305B\u3093\n", 0, "", "");
					this.asp = undefined;
				}

				if (is_null(this.asp)) {
					return false;
				}
			}

		this.postid_root = this.O_Post.getRootPostid(pactid, 0, this.tbno);

		if (is_null(this.postid_root)) {
			this.errorOut(1000, "\n" + "pactid=" + pactid + "\u306B\u3066\u3001post_" + this.tbno + "_tb\u306B\u90E8\u7F72\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\n", 0, "", "");
			return false;
		}

		sql = "select * from dummy_tel_tb where" + " pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(this.carid, "integer", true);
		this.dummy_tel_tb = this.get_DB().queryRowHash(sql);

		if (is_null(this.dummy_tel_tb)) {
			this.errorOut(1000, "\n" + "pactid=" + pactid + "\u306B\u3066\u3001\u30C0\u30DF\u30FC\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\u8ABF\u6574\u91D1\u984D\u7528\u3068\u3057\u3066\u5FC5\u8981\u3067\u3059\u3002\n", 0, "", "");
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
				this.detailno = this.get_DB().queryAssoc(sql);
			}

		return true;
	}

	makeInsertUtiwakeData(data) //値の設定
	{
		res.code = data[ImportKDDIServiceModel.utiwake_code_idx];
		res.name = data[ImportKDDIServiceModel.utiwake_name_idx];
		res.kamoku = "6";
		res.taxtype = 0;
		res.codetype = "4";
		res.carid = this.carid;
		res.fixdate = this.nowdate;
		res.recdate = this.nowdate;
		return res;
	}

	makeInsertKamokuRelUtiwakeData(code) {
		var res = Array();
		res.pactid = 0;
		res.kamokuid = 0;
		res.code = code;
		res.carid = this.carid;
		res.fixdate = this.nowdate;
		return res;
	}

	getDetailNo(telno) //登録されていないtelnoのdetailnoの初期化
	//カウンターを足しておく
	{
		if (!(undefined !== this.detailno[telno])) {
			this.detailno[telno] = 0;
		}

		var res = this.detailno[telno];
		this.detailno[telno]++;
		return res;
	}

	makeInsertTelDetailsData(data) //内訳コード
	//値の設定
	{
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

	makeInsertTelData(telno) {
		res.pactid = this.pactid;
		res.postid = this.postid_root;
		res.telno = str_replace("-", "", telno);
		res.telno_view = telno;
		res.carid = this.carid;
		res.arid = 0;
		res.cirid = this.cirid;
		res.recdate = this.nowdate;
		res.fixdate = this.nowdate;
		return res;
	}

	addASP(telno, prtelno) //ASPが設定されているかチェックを行う
	//初期データの作成
	{
		if (is_null(this.asp)) {
			return true;
		}

		if (!(undefined !== this.utiwake.ASP)) {
			return false;
		}

		this.detailno[telno]++;
		data[ImportKDDIServiceModel.utiwake_code_idx] = "ASP";
		data[ImportKDDIServiceModel.telno_idx] = telno;
		data[ImportKDDIServiceModel.charge_idx] = this.asp.charge;
		data[ImportKDDIServiceModel.prtelno_idx] = prtelno;
		return this.makeInsertTelDetailsData(data);
	}

	addASX(telno, prtelno) //ASPが設定されているかチェックを行う
	{
		if (is_null(this.asp)) {
			return true;
		}

		if (!(undefined !== this.utiwake.ASX)) {
			return false;
		}

		var asx = Math.round(this.asp.charge * this.getSetting().excise_tax);
		data[ImportKDDIServiceModel.utiwake_code_idx] = "ASX";
		data[ImportKDDIServiceModel.telno_idx] = telno;
		data[ImportKDDIServiceModel.charge_idx] = asx;
		data[ImportKDDIServiceModel.prtelno_idx] = prtelno;
		return this.makeInsertTelDetailsData(data);
	}

	addDataByFile(filename, TargetTable) //createDataして
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
		var telno = undefined;
		var prtelno = undefined;
		var utiwake_first_name = undefined;
		var bError = false;
		var datas = file(filename);

		if (!datas) {
			this.errorOut(1000, "\n" + "\u8AAD\u307F\u8FBC\u307F\u30A8\u30E9\u30FC(" + filename + ")\n", 0, "", "");
			return false;
		}

		this.clearData();

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
			var line = datas[lineno];

			if (lineno == 0) {
				continue;
			}

			var data = rtrim(line, "\r\n");
			data = mb_convert_encoding(data, "UTF8", "SJIS-WIN");
			data = str_replace("\"", "", data);
			data = str_replace("\u3000\u3000\u3000\u3000\u3000", "", data);
			data = split(",", data);
			var data_count = data.length;

			if (data_count != this.getSetting().DATA_COUNT) {
				this.errorOut(1000, "\n" + filename + "\u306B\u3066" + lineno + "\u884C\u76EE\u306E\u30C7\u30FC\u30BF\u6570\u304C" + data_count + "\u3067\u3059\n", 0, "", "");
				this.errorOut(1000, "\u3053\u306E\u5024\u306F" + this.getSetting().DATA_COUNT + "\u3067\u306A\u3051\u308C\u3070\u3044\u3051\u307E\u305B\u3093\n", 0, "", "");
				return false;
			}

			if (data[ImportKDDIServiceModel.utiwake_code_idx] == "") {
				continue;
			}

			if (data[ImportKDDIServiceModel.koteikubun_idx] == "3") {
				data[ImportKDDIServiceModel.telno_idx] = this.dummy_tel_tb.telno;
			}

			if (data[ImportKDDIServiceModel.telno_idx] != "" && (is_null(telno) || telno != data[ImportKDDIServiceModel.telno_idx])) //ASPの追加
				{
					if (!bError && !is_null(telno) && !is_null(this.asp)) {
						if (telno != this.dummy_tel_tb.telno) //ASP
							{
								var res = this.addASP(telno, prtelno);

								if (Array.isArray(res)) {
									this.pushData(this.tbname.tel_details_xx_tb, res);
								}

								res = this.addASX(telno, prtelno);

								if (Array.isArray(res)) {
									this.pushData(this.tbname.tel_details_xx_tb, res);
								}
							}
					}

					telno = data[ImportKDDIServiceModel.telno_idx];
					prtelno = data[ImportKDDIServiceModel.prtelno_idx];
					utiwake_first_name = undefined;
				}

			if (!telno) {
				this.errorOut(1000, "\u96FB\u8A71\u756A\u53F7\u304C\u7A7A\u3067\u3059\n", 0, "", "");
				return false;
			}

			var utiwake_code = data[ImportKDDIServiceModel.utiwake_code_idx];

			if (!!data[ImportKDDIServiceModel.utiwake_first_name_idx]) {
				utiwake_first_name = data[ImportKDDIServiceModel.utiwake_first_name_idx];
			}

			if (undefined !== this.utiwake[utiwake_code]) //未登録の内訳コードとして既に処理されてるかチェック
				{
					if (undefined !== this.utiwake[utiwake_code].insert_flg) //未登録の内訳コード
						{
							continue;
						}

					if (this.utiwake[utiwake_code].codetype == 4) //見登録の内訳コード
						{
							bError = true;
							this.errorOut(1000, "\u672A\u767B\u9332\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u3059(" + utiwake_code + ")\n", 0, "", "");
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

					if (!data[ImportKDDIServiceModel.utiwake_name_idx]) {
						data[ImportKDDIServiceModel.utiwake_name_idx] = utiwake_first_name;
					}

					data[ImportKDDIServiceModel.taxtype_idx] = 1;
					this.utiwake[utiwake_code] = {
						codetype: 4,
						insert_flg: true
					};
					this.errorOut(1000, "\u672A\u767B\u9332\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u3059\u3002\u4EE5\u4E0B\u3092\u65B0\u898F\u767B\u9332\u3057\u3066\u304F\u3060\u3055\u3044\n", 0, "", "");
					this.errorOut(1000, "\t\u5185\u8A33\u30B3\u30FC\u30C9=" + utiwake_code + "\n", 0, "", "");
					this.errorOut(1000, "\t\u5185\u8A33\u9805\u76EE\u540D=" + data[ImportKDDIServiceModel.utiwake_name_idx] + "\n", 0, "", "");
					this.errorOut(1000, "\t\u8AB2\u7A0E\u533A\u5206\u540D\u79F0=" + data[ImportKDDIServiceModel.taxkubun_idx] + "\n", 0, "", "");
					continue;
				}

			this.pushData(this.tbname.tel_details_xx_tb, this.makeInsertTelDetailsData(data));

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

		if (!is_null(telno) && !is_null(this.asp)) {
			if (telno != this.dummy_tel_tb.telno) {
				this.pushData(this.tbname.tel_details_xx_tb, this.addASP(telno, prtelno));
				this.pushData(this.tbname.tel_details_xx_tb, this.addASX(telno, prtelno));
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
		var fin_dir = dirname(filename) + "/fin";
		var name = basename(filename);

		if (!file_exists(fin_dir)) {
			mkdir(fin_dir);
		}

		rename(filename, fin_dir + "/" + name);
		return true;
	}

	__destruct() {
		super.__destruct();
	}

};