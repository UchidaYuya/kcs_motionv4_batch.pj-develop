//
//KDDIサービス取込み(伊達)
//
//error_reporting(E_ALL|E_STRICT);
//割引、最初の値
//割引、追加
//割引、余りの加算
//通話料、1回線ごとの割引からの超過額
//通話料、超過率
//以前の部署ID
//
//ImportKDDIServiceProc
//KDDIサービス取込み
//@uses ProcessBaseBatch
//@package
//@author web
//@since 2017/01/26
//

require("process/script/ImportBaseProc.php");

require("view/script/ApportionDiscountView.php");

require("model/script/ApportionDiscountModel.php");

const DEBUG_WARI_FIRST = 200;
const DEBUG_WARI_ADD = 201;
const DEBUG_WARI_AMARI = 203;
const DEBUG_TUWA_OVER = 204;
const DEBUG_TUWA_OVER_PER = 205;
const DEBUG_POSTID_OLD = 206;

//確認用に使う・・
//
//__construct
//コンストラクタ
//@author web
//@since 2017/02/22
//
//@param array $H_param
//@access public
//@return void
//
//
//getModel
//modelの作成
//@author web
//@since 2017/02/22
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@param 	 $billdate
//@access protected
//@return void
//
//
//getView
//viewの作成
//@author web
//@since 2017/02/22
//
//@access protected
//@return void
//
//
//doExecute
//実行
//@author web
//@since 2017/01/26
//
//@param array $H_param
//@access protected
//@return void
//
//
//createPostTrans
//部署の配置変更の参照リストを作成する
//第oo階層対応表の作成
//@author web
//@since 2017/07/06
//
//@access private
//@return void
//
//
//post_anbun
//部署ごとに割引金額を按分する
//@author web
//@since 2017/07/04
//
//@param mixed $H_tel
//@param mixed $free_charge
//@param mixed $total_wari
//@access private
//@return void
//
//
//post_tel_anbun
//部署ごとの按分
//@author web
//@since 2017/07/04
//
//@param mixed $H_tel
//@param mixed $free_charge
//@param mixed $total_wari
//@access private
//@return void
//
//
//tel_anbun
//電話回線毎の按分
//@author web
//@since 2017/07/04
//
//@param mixed $H_tel
//@param mixed $free_charge
//@param mixed $total_wari
//@access private
//@return void
//
//
//tel_wari_anbun
//割引を課税、非課税に按分する
//@author web
//@since 2017/07/04
//
//@param mixed $H_tel
//@access private
//@return void
//
//
//tel_add_tax
//税金の按分
//@author web
//@since 2017/07/05
//
//@param mixed $H_tel
//@param mixed $tax_per
//@access private
//@return void
//
//
//error_check
//
//@author web
//@since 2017/07/04
//
//@param mixed $H_tel
//@access private
//@return void
//
//
//Initialize
//初期化
//@author web
//@since 2017/02/23
//
//@access public
//@return void
//
//
//readINI
//ini読込
//@author web
//@since 2017/06/30
//
//@param mixed $pactid
//@access private
//@return void
//
//
//ary_merge
//array_mergeだとエラーが出るので、自作した
//@author web
//@since 2017/06/30
//
//@param mixed $src1
//@param mixed $src2
//@access private
//@return void
//
//
//デストラクタ
//
//@author date
//@since 2015/07/10
//
//@access public
//@return void
//
//
//view_data_view
//データ確認用
//@author web
//@since 2017/07/06
//
//@param mixed $H_tel
//@access private
//@return void
//
class ApportionDiscountProc extends ImportBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		this.debug = false;
		this.debug_out = false;
		super(H_param);
		this.A_post_info = Array();
		this.H_tel = Array();
	}

	createModel(billdate) //モデルの取得
	//script情報の設定
	//請求月の設定
	//テーブルの設定(setBillDateの後に呼ぶこと)
	{
		var model = new ApportionDiscountModel();
		model.setScriptAmbient(this.get_MtScriptAmbient());
		model.setBillDate(billdate);
		model.setTableName();
		return model;
	}

	createView() {
		return new ApportionDiscountView();
	}

	doExecute(H_param: {} | any[] = Array()) //処理開始
	//初期化
	//引数処理などもこの中でやってる
	//処理が終了した pactid を格納するための配列を初期化
	//デフォルト設定ファイルの取得
	//キャリアIDですぞ・・
	//税額の取得
	//実行対象のpactidの取得
	//結果表示のやつ
	//-----------------------------------------------------------------------------------
	//pactidごとに処理する
	//-----------------------------------------------------------------------------------
	//$this->errorOut(1000, "pactid=".$pactid."の取込み失敗\n",0,"","");
	//exit(0);
	{
		this.infoOut("\u53D6\u8FBC\u307F\u958B\u59CB(" + date("Y-m-d H:i:s") + ")\n", 0);
		this.initCommon();
		var A_pactDone = Array();
		var ini_file_default = this.readINI();
		var carid = ini_file_default.default.CARID;
		var ini_define = parse_ini_file(KCS_DIR + "/conf_sync/define.ini", false);
		var tax_rate = +ini_define.excise_tax;
		var pactid = this.O_view.get_HArgv("-p");

		if (pactid == "all") {
			var pactid_list = ini_file_default.default.PACTID_ALL.split(",");
		} else {
			pactid_list = [pactid];
		}

		var str_result = "";

		for (var i = 0; i < 10; i++) {
			str_result += " %14s |";
		}

		str_result += "\n";
		var str_result_pact = " %14s |\t%s\n";
		var str_result_prtel = " %14s | %14s |\t%s\n";
		var header = sprintf(str_result, "pactid", "prtelno", "old_tuwa_total", "old_wari_total", "one_wari", "tel_count", "new_wari_total", "sum_old", "sum_new", "result");
		this.infoOut("\n" + header, 1);

		for (var pactid of Object.values(pactid_list)) //iniファイルの読み込み
		//設定について、デフォルト値とマージ
		//-----------------------------------------------------------------------------------
		//親番号ごとに通話料と割引を算出し、按分する
		//-----------------------------------------------------------------------------------
		//対象の親番号の一覧を取得
		//処理対象親番号のチェック
		//第oo階層などのメモ
		//-----------------------------------------------------------------------------------
		//親番号単位で処理する
		//-----------------------------------------------------------------------------------
		{
			var ini_file_pact = this.readINI(pactid);
			var ini_pact = this.ini_merge(ini_file_default.default, ini_file_pact.default);

			if (!(undefined !== ini_pact.ASP_CODE)) {
				this.infoOut(sprintf(str_result_pact, pactid, "ASP_CODE\u304C\u672A\u8A2D\u5B9A"), 1);
				continue;
			}

			if (!(undefined !== ini_pact.ASX_CODE)) {
				this.infoOut(sprintf(str_result_pact, pactid, "ASX_CODE\u304C\u672A\u8A2D\u5B9A"), 1);
				continue;
			}

			this.O_model.setPactID(pactid, carid, ini_pact.ASP_CODE, ini_pact.ASX_CODE);

			if (this.Prtelno == "all") //親番号の除外リスト
				{
					var prtelno_list = this.O_model.getPrtelnoList(pactid, carid);

					if (undefined !== ini_pact.EXCLUDE_PRTELNO && !is_null(prtelno_list)) //除外リストを配列にする
						//対象の親番号を削除する
						{
							var exclude = ini_pact.EXCLUDE_PRTELNO.split(",");

							for (var key in exclude) {
								var value = exclude[key];

								if (undefined !== prtelno_list[value]) {
									delete prtelno_list[value];
									this.infoOut(sprintf(str_result_pact, pactid, "\u89AA\u756A\u53F7=" + value + "\u306F\u9664\u5916\u5BFE\u8C61\u3067\u3059"), 1);
								}
							}
						}
				} else {
				prtelno_list = {
					[this.Prtelno]: true
				};
			}

			if (is_null(prtelno_list) || !prtelno_list) {
				this.infoOut(sprintf(str_result_pact, pactid, "\u51E6\u7406\u5BFE\u8C61\u306E\u89AA\u756A\u53F7\u304C\u3042\u308A\u307E\u305B\u3093"), 1);
				continue;
			}

			var post_rel = this.O_model.getPostRelation(pactid);
			var post_level = -1;
			var post_trans = undefined;

			for (var prtelno in prtelno_list) //親番号からハイフンを抜く
			//iniファイルの設定。defalut設定、企業ごとの設定、親番号ごとの設定をマージする。
			//デバッグ表示をする？
			//対象の親番号が既に処理済みか調べる
			//-----------------------------------------------------------------------------------
			//対象回線の通話料と割引の取得を行う
			//-----------------------------------------------------------------------------------
			//件数の取得。0件なら何もしない
			//通話料の合計
			//割引の合計
			//課税通話料に税額を掛けた金額の合計(税金)
			//割引の合計
			//割引が通話料を上回っていないかチェック
			//割引総額
			//割引金額の有無のチェック
			//-----------------------------------------------------------------------------------
			//部署ごとの割引額を求める。
			//$H_telに以下の値を付与する
			//new_charge_wari・・・新しい割引額を付与する。
			//-----------------------------------------------------------------------------------
			//エラーチェキ
			//-----------------------------------------------------------------------------------
			//新しい割引料金を課税と非課税で分ける。
			//$H_telに以下の値を付与する
			//new_charge_wari_k・・・課税通話の新しい割引
			//new_charge_wari_h・・・非課税通話の新しい割引額
			//-----------------------------------------------------------------------------------
			//-----------------------------------------------------------------------------------
			//課税通話が0円でない回線に対して、消費税を付与する
			//$H_telに以下の値を付与する
			//new_charge_tuwa_tax・・・課税通話の新しい割引
			//-----------------------------------------------------------------------------------
			//$a =  $total_tuwa - $total_wari;
			//				$b =  $total_tuwa - $total_wari_origin;
			//				$c = 0;
			//				foreach( $H_tel as $key => $value ){
			//					$c += $value[CLM_NEW_TUWA_TAX];
			//				}
			//-----------------------------------------------------------------------------------
			//新規レコード
			//-----------------------------------------------------------------------------------
			//更新作業
			//-----------------------------------------------------------------------------------
			//エラーチェック
			//-----------------------------------------------------------------------------------
			{
				var value = prtelno_list[prtelno];
				var prtelno = str_replace("-", "", prtelno);
				var ini = undefined !== ini_file_pact[prtelno] ? this.ini_merge(ini_pact, ini_file_pact[prtelno]) : ini_pact;
				this.debug_out = Bool(ini.DEBUG_TEL_ANBUN);
				var tdcomments = Array();
				if (ini.DB_INSERT_KAZEI_TDCOMMENT != "NULL") tdcomments.push(ini.DB_INSERT_KAZEI_TDCOMMENT);
				if (ini.DB_INSERT_HIKAZEI_TDCOMMENT != "NULL") tdcomments.push(ini.DB_INSERT_HIKAZEI_TDCOMMENT);
				if (ini.DB_INSERT_TAX_TDCOMMENT != "NULL") tdcomments.push(ini.DB_INSERT_TAX_TDCOMMENT);

				if (!tdcomments) {
					this.infoOut(sprintf(str_result_prtel, pactid, prtelno, "\u5099\u8003\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u306E\u3067\u98DB\u3070\u3057\u307E\u3059"), 1);
					continue;
				}

				if (this.O_model.checkProcessed(pactid, carid, prtelno, tdcomments)) {
					this.infoOut(sprintf(str_result_prtel, pactid, prtelno, "\u51E6\u7406\u6E08\u307F\u306E\u305F\u3081\u98DB\u3070\u3057\u307E\u3059"), 1);
					continue;
				}

				var b_post_apportion = +ini.POST_LEVEL >= 0 ? true : false;
				var H_tel = this.O_model.getTelBill(pactid, carid, prtelno, ini.A_TUWA_CODE, ini.FREE_CODE_KAZEI, ini.FREE_CODE_HIKAZEI, ini.A_TAX_KUBUN, ini.TAX_CODE, ini.ASP_CODE, ini.ASX_CODE);
				var tel_count = H_tel.length;

				if (tel_count <= 0) {
					this.infoOut(sprintf(str_result_prtel, pactid, prtelno, "\u96FB\u8A71\u304C\u306A\u3044"), 1);
					continue;
				}

				if (b_post_apportion) //0の場合は階層なし
					{
						if (ini.POST_LEVEL > 0) //既に指定されている階層で処理されているなら同じものを使う
							{
								var level = ini.POST_LEVEL;

								if (post_level != level) {
									post_trans = this.createPostTrans(post_rel, level);
									post_level = level;
								}

								for (var key in H_tel) //過去の部署IDの保存
								{
									var value = H_tel[key];

									if (this.debug_out) {
										H_tel[key][DEBUG_POSTID_OLD] = H_tel[key][CLM_POSTID];
									}

									H_tel[key][CLM_POSTID] = post_trans[H_tel[key][CLM_POSTID]];
								}
							}
					}

				var total_tuwa = 0;
				var total_wari = 0;
				var total_tuwa_tax = 0;
				var total_wari_origin = 0;
				var check_k = "";
				var check_h = "";

				for (var key in H_tel) //出力
				//割引料金の合計
				//課税通話料の税金計算と、その合計
				//課税割引
				{
					var value = H_tel[key];

					if (this.debug_out) {
						H_tel[key][DEBUG_WARI_FIRST] = 0;
						H_tel[key][DEBUG_WARI_ADD] = 0;
						H_tel[key][DEBUG_WARI_AMARI] = 0;
						H_tel[key][DEBUG_TUWA_OVER] = 0;
						H_tel[key][DEBUG_TUWA_OVER_PER] = 0;
						H_tel[key][CLM_NEW_TUWA_TAX] = 0;
						H_tel[key][CLM_NEW_WARI] = 0;
						H_tel[key][CLM_NEW_WARI_K] = 0;
						H_tel[key][CLM_NEW_WARI_H] = 0;
						H_tel[key][CLM_TUWA_OVER] = 0;
					}

					total_tuwa += value[CLM_TUWA];
					total_wari += value[CLM_WARI_K] + value[CLM_WARI_H];
					var tax = +((value[CLM_TUWA_K] + value[CLM_WARI_K]) * tax_rate);
					H_tel[key][CLM_TUWA_TAX] = tax;
					total_tuwa_tax += tax;

					if (value[CLM_TUWA_K] + value[CLM_WARI_K] < 0) {
						if (check_k != "") {
							check_k += ",";
						}

						check_k += value[CLM_TELNO];
					}

					if (value[CLM_TUWA_H] + value[CLM_WARI_H] < 0) {
						if (check_h != "") {
							check_h += ",";
						}

						check_h += value[CLM_TELNO];
					}
				}

				if (check_k != "" || check_h != "") //課税割引チェック
					{
						if (check_k != "") {
							this.infoOut(sprintf(str_result_prtel, pactid, prtelno, "\u30A8\u30E9\u30FC\u8AB2\u7A0E:\u901A\u8A71\u6599\u3088\u308A\u5272\u5F15\u306E\u91D1\u984D\u304C\u5927\u304D\u3044:" + check_k), 1);
						}

						if (check_h != "") {
							this.infoOut(sprintf(str_result_prtel, pactid, prtelno, "\u30A8\u30E9\u30FC\u975E\u8AB2\u7A0E:\u901A\u8A71\u6599\u3088\u308A\u5272\u5F15\u306E\u91D1\u984D\u304C\u5927\u304D\u3044:" + check_h), 1);
						}

						this.infoOut(sprintf(str_result_prtel, pactid, prtelno, "\u5185\u8A33\u30B3\u30FC\u30C9\u306E\u8FFD\u52A0\u3001\u3082\u3057\u304F\u306F\u5185\u8A33\u306E\u7A0E\u533A\u5206\u306E\u78BA\u8A8D\u3092\u3057\u3066\u304F\u3060\u3055\u3044"), 1);
						this.infoOut(sprintf(str_result_prtel, pactid, prtelno, "\u5185\u8A33\u306E\u7A0E\u533A\u5206\u306B\u8AA4\u308A\u304C\u3042\u3063\u305F\u5834\u5408\u3001\u8ACB\u6C42\u306E\u518D\u53D6\u308A\u8FBC\u307F\u304C\u5FC5\u8981\u3067\u3059"), 1);
						continue;
					}

				total_wari_origin = total_wari = -total_wari;

				if (total_wari <= 0) {
					this.infoOut(sprintf(str_result_prtel, pactid, prtelno, "\u5272\u5F15\u30EC\u30B3\u30FC\u30C9\u304C\u306A\u3044"), 1);
					continue;
				}

				if (!ini.FREE_CHARGE) //ドコモからの請求を使用する
					{
						var free_charge = +(total_wari / tel_count);
					} else //iniファイルの設定を使用する
					//iniから1回線の割引額を設定
					{
						free_charge = +ini.FREE_CHARGE;
					}

				if (b_post_apportion) {
					this.A_post_info = Array();
					var res = this.post_tel_anbun(H_tel, free_charge, total_wari);
				} else {
					res = this.tel_anbun(H_tel, free_charge, total_wari);
				}

				if ("string" === typeof res) {
					this.infoOut(sprintf(str_result_prtel, pactid, prtelno, res), 1);

					if (this.debug_out) //エラーだった場合、$this->H_telに値を入れるようにしました・・・
						{
							this.view_data(this.H_tel);
						}

					continue;
				}

				H_tel = res;
				H_tel = this.tel_wari_anbun(H_tel);
				H_tel = this.tel_add_tax(H_tel, total_tuwa_tax);
				res = this.O_model.update_details(pactid, carid, prtelno, H_tel, ini.UPDATE_KAZEI_TYPE, ini.INSERT_KAZEI_CODE, ini.INSERT_KAZEI_CODENAME, ini.DB_INSERT_KAZEI_TDCOMMENT, ini.UPDATE_HIKAZEI_TYPE, ini.INSERT_HIKAZEI_CODE, ini.INSERT_HIKAZEI_CODENAME, ini.DB_INSERT_HIKAZEI_TDCOMMENT, ini.UPDATE_TAX_TYPE, ini.INSERT_TAX_CODE, ini.INSERT_TAX_CODENAME, ini.DB_INSERT_TAX_TDCOMMENT, ini.A_TAX_KUBUN[1], ini.A_TAX_KUBUN[4], ini.FREE_CODE_KAZEI, ini.FREE_CODE_HIKAZEI, ini.TAX_CODE, tax_rate, ini.ASP_CODE, ini.ASX_CODE);
				var str = sprintf(str_result, pactid, prtelno, total_tuwa, total_wari_origin, !ini.FREE_CHARGE ? free_charge : ini.FREE_CHARGE, tel_count, total_wari, res.sum_old, res.sum_new, res.error ? "error" : "successed");
				this.infoOut(str, 1);

				if (this.debug_out) {
					this.view_data(H_tel);
				}
			}
		}

		this.endCommon();
		this.infoOut("\u53D6\u8FBC\u307F\u7D42\u4E86(" + date("Y-m-d H:i:s") + ")\n", 0);
	}

	createPostTrans(post_rel, level) //post_relはpost_relation_xx_tbにて、levelでソートされてる前提
	//ルート部署
	//部署配置先リストの設定
	{
		var res = Array();
		var root = post_rel[0].postidparent;

		for (var key in post_rel) {
			var value = post_rel[key];

			if (value.level <= level) //指定された部署より上か同じ階層の部署なら単体で扱う
				{
					res[value.postidchild] = value.postidchild;
				} else //指定された階層より下の場合は、指定された階層の部署となる
				{
					res[value.postidchild] = res[value.postidparent];
				}
		}

		return res;
	}

	post_anbun(H_tel, free_charge, total_wari) //部署毎の集計で使う
	//部署ごとの通話料超過と、通話料合計を計算しましょう
	//割当てた割引金額が、ドコモからの割引金額を超えている。
	//割引額の余りを割り当てる
	//割引額の端数処理
	{
		var A_post_info = Array();

		for (var key in H_tel) //部署ごとの通話料などの集計
		//部署情報を初期化するぽよ
		{
			var value = H_tel[key];

			if (!(undefined !== A_post_info[value[CLM_POSTID]])) {
				A_post_info[value[CLM_POSTID]] = {
					charge_tuwa: 0,
					tuwa_over: 0,
					tel_num: 0
				};
			}

			A_post_info[value[CLM_POSTID]].charge_tuwa += value[CLM_TUWA];
			A_post_info[value[CLM_POSTID]].tel_num++;
		}

		var post_use_wari_total = 0;
		var post_tuwa_over_total = 0;

		for (var key in A_post_info) //割引の割り当て
		{
			var value = A_post_info[key];
			var waribiki = value.tel_num * free_charge;

			if (value.charge_tuwa <= waribiki) //部署の通話料合計が割引額より低いため、通話料全額を割引で賄う
				{
					A_post_info[key].charge_wari = value.charge_tuwa;
				} else //通話料合計が割引額より大きいため、割引x回線数を割り当てる
				//通話料の割引額を超えた金額を記録
				//通話料の割引額を超えた金額を加算しておく
				{
					A_post_info[key].charge_wari = waribiki;
					A_post_info[key].tuwa_over = value.charge_tuwa - waribiki;
					post_tuwa_over_total += A_post_info[key].tuwa_over;
				}

			if (this.debug_out) {
				A_post_info[key][DEBUG_WARI_FIRST] = A_post_info[key].charge_wari;
				A_post_info[key][DEBUG_TUWA_OVER_PER] = 0;
				A_post_info[key][DEBUG_WARI_ADD] = 0;
				A_post_info[key][DEBUG_WARI_AMARI] = 0;
			}

			post_use_wari_total += A_post_info[key].charge_wari;
		}

		if (total_wari < post_use_wari_total) {
			this.A_post_info = A_post_info;
			this.H_tel = H_tel;
			return "\u5272\u5F15\u984D\u306E\u30A8\u30E9\u30FC\u3001\u65B0\u5272\u5F15\u304C\u5B9F\u5272\u5F15\u3092\u8D85\u3048\u307E\u3057\u305F";
		}

		var amari = (total_wari - post_use_wari_total) / post_tuwa_over_total;
		post_use_wari_total = 0;

		for (var key in A_post_info) {
			var value = A_post_info[key];

			if (value.charge_tuwa != value.charge_wari) //割引が通話料を超えた場合は割引料を調整する
				{
					waribiki = +(amari * value.tuwa_over);
					var wari = value.charge_wari + waribiki;

					if (wari > value.charge_tuwa) {
						wari = value.charge_tuwa;
					}

					if (this.debug_out) {
						A_post_info[key][DEBUG_TUWA_OVER_PER] = value.tuwa_over / post_tuwa_over_total;
						A_post_info[key][DEBUG_WARI_ADD] = wari - A_post_info[key].charge_wari;
					}

					A_post_info[key].charge_wari = wari;
				}

			post_use_wari_total += A_post_info[key].charge_wari;
		}

		amari = total_wari - post_use_wari_total;

		if (amari > 0) {
			for (var key in A_post_info) {
				var value = A_post_info[key];

				if (value.charge_tuwa != value.charge_wari) //余り
					{
						A_post_info[key].charge_wari++;
						amari--;

						if (this.debug_out) {
							A_post_info[key][DEBUG_WARI_AMARI]++;
						}

						if (!amari) {
							break;
						}
					}
			}
		}

		return A_post_info;
	}

	post_tel_anbun(H_tel, free_charge, total_wari) //-----------------------------------------------------------------------------------
	//部署情報作成
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//回線毎に、1回線毎の割引金額を入れる
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//部署毎の割引金額の余りを予め計算しておく
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//割引按分率を求めて、余ってる割引を按分する
	//-----------------------------------------------------------------------------------
	//割引残を求める
	//割引額のカウント
	//-----------------------------------------------------------------------------------
	//余った割引額を出しておく
	//-----------------------------------------------------------------------------------
	//割引額から割振った割引額を引いて、余りの割引額を求める
	//余りの割引金額を加算してく
	{
		var A_post_info = this.post_anbun(H_tel, free_charge, total_wari);

		if ("string" === typeof A_post_info) {
			return A_post_info;
		}

		var A_post_temp = Array();

		for (var key in A_post_info) {
			var value = A_post_info[key];
			A_post_temp[key] = {
				is_muryo: value.charge_tuwa == value.charge_wari,
				tuwa_over: 0,
				use_wari: 0
			};
		}

		var use_wari_total = 0;

		for (var key in H_tel) //1回線毎の割引金額を入れる
		//割振られた割引金額をチェキする
		{
			var value = H_tel[key];

			if (value[CLM_TUWA] <= free_charge || A_post_temp[value[CLM_POSTID]].is_muryo) //通話料金が割引金額より低い場合は、通話料金が全額割引になる
				//割引金額
				{
					H_tel[key][CLM_NEW_WARI] = value[CLM_TUWA];
				} else //通話料金が割引金額以上
				//1回線毎の割引金額の超過通話料を記録しておく
				//超過額を加算
				//割引金額を設定しておく
				{
					H_tel[key][CLM_TUWA_OVER] = value[CLM_TUWA] - free_charge;
					A_post_temp[value[CLM_POSTID]].tuwa_over += H_tel[key][CLM_TUWA_OVER];
					H_tel[key][CLM_NEW_WARI] = free_charge;
				}

			A_post_temp[value[CLM_POSTID]].use_wari += H_tel[key][CLM_NEW_WARI];

			if (this.debug_out) //割引、最初の値
				//割引、追加
				//割引、余り
				//通話料、1回線ごとの割引からの超過額
				//通話料、超過率
				{
					H_tel[key][DEBUG_WARI_FIRST] = 0;
					H_tel[key][DEBUG_WARI_ADD] = 0;
					H_tel[key][DEBUG_WARI_AMARI] = 0;
					H_tel[key][DEBUG_TUWA_OVER] = 0;
					H_tel[key][DEBUG_TUWA_OVER_PER] = 0;
					H_tel[key][DEBUG_WARI_FIRST] = H_tel[key][CLM_NEW_WARI];

					if (undefined !== H_tel[key][CLM_TUWA_OVER]) {
						H_tel[key][DEBUG_TUWA_OVER] = H_tel[key][CLM_TUWA_OVER];
					}
				}
		}

		for (var key in A_post_temp) //余った割引額を按分する際の下準備
		//この変数は次でまた使いたいので初期化しておく
		{
			var value = A_post_temp[key];

			if (value.tuwa_over == 0) {
				A_post_temp[key].amari = 0;
			} else {
				A_post_temp[key].amari = (A_post_info[key].charge_wari - value.use_wari) / value.tuwa_over;
			}

			A_post_temp[key].use_wari = 0;
		}

		var amari = total_wari - use_wari_total;
		use_wari_total = 0;

		for (var key in H_tel) //割引割振りが終わっているかチェック
		{
			var value = H_tel[key];

			if (value[CLM_NEW_WARI] != value[CLM_TUWA]) //割引の割振りが終了していない回線に金額を振る
				//現在の割引を保存しておく
				//通話料金より割引額が大きくなっていないかチェックする
				//追加された割引額と、超過率の取得
				{
					if (this.debug_out) {
						var wari_origin = H_tel[key][CLM_NEW_WARI];
					}

					var waribiki = +(value[CLM_TUWA_OVER] * A_post_temp[value[CLM_POSTID]].amari);

					if (value[CLM_TUWA] <= value[CLM_NEW_WARI] + waribiki) //この回線は割引金額が通話料金以上になったので調整
						//割引金額
						{
							H_tel[key][CLM_NEW_WARI] = value[CLM_TUWA];
						} else //割引加算
						{
							H_tel[key][CLM_NEW_WARI] += waribiki;
						}

					if (this.debug_out) {
						H_tel[key][DEBUG_TUWA_OVER_PER] = value[CLM_TUWA_OVER] / A_post_temp[value[CLM_POSTID]].tuwa_over;
						H_tel[key][DEBUG_WARI_ADD] = H_tel[key][CLM_NEW_WARI] - wari_origin;
					}
				}

			A_post_temp[value[CLM_POSTID]].use_wari += H_tel[key][CLM_NEW_WARI];
		}

		for (var key in A_post_temp) {
			var value = A_post_temp[key];
			A_post_temp[key].amari = A_post_info[key].charge_wari - value.use_wari;
		}

		amari = total_wari - use_wari_total;

		for (var key in H_tel) //割引金額が余っているかチェック
		{
			var value = H_tel[key];

			if (!A_post_temp[value[CLM_POSTID]].amari) {
				continue;
			}

			if (value[CLM_TUWA] == value[CLM_NEW_WARI]) {
				continue;
			}

			if (this.debug_out) {
				H_tel[key][DEBUG_WARI_AMARI]++;
			}

			H_tel[key][CLM_NEW_WARI]++;
			A_post_temp[value[CLM_POSTID]].amari--;
		}

		if (this.debug_out) {
			this.A_post_info = A_post_info;
		}

		return H_tel;
	}

	tel_anbun(H_tel, free_charge, total_wari) //-----------------------------------------------------------------------------------
	//回線毎に、1回線毎の割引金額を入れる
	//-----------------------------------------------------------------------------------
	//割当てた割引金額が、ドコモからの割引金額を超えている。
	//割引額のカウント
	//割引額から割振った割引額を引いて、余りの割引額を求める
	//余りの割引金額を加算してく
	{
		var tuwa_over_total = 0;
		var use_wari_total = 0;

		for (var key in H_tel) //1回線毎の割引金額を入れる
		//確認用
		{
			var value = H_tel[key];

			if (value[CLM_TUWA] <= free_charge) //通話料金が割引金額より低い場合は、通話料金が全額割引になる
				//割引金額
				{
					H_tel[key][CLM_NEW_WARI] = value[CLM_TUWA];
				} else //通話料金が割引金額以上
				//1回線毎の割引金額の超過通話料を記録しておく
				//超過額を加算
				//割引金額を設定しておく
				{
					H_tel[key][CLM_TUWA_OVER] = value[CLM_TUWA] - free_charge;
					tuwa_over_total += H_tel[key][CLM_TUWA_OVER];
					H_tel[key][CLM_NEW_WARI] = free_charge;
				}

			use_wari_total += H_tel[key][CLM_NEW_WARI];

			if (this.debug_out) //割引、最初の値
				//割引、追加
				//割引、余り
				//通話料、1回線ごとの割引からの超過額
				//通話料、超過率
				{
					H_tel[key][DEBUG_WARI_FIRST] = 0;
					H_tel[key][DEBUG_WARI_ADD] = 0;
					H_tel[key][DEBUG_WARI_AMARI] = 0;
					H_tel[key][DEBUG_TUWA_OVER] = 0;
					H_tel[key][DEBUG_TUWA_OVER_PER] = 0;
					H_tel[key][DEBUG_WARI_FIRST] = H_tel[key][CLM_NEW_WARI];

					if (undefined !== H_tel[key][CLM_TUWA_OVER]) {
						H_tel[key][DEBUG_TUWA_OVER] = H_tel[key][CLM_TUWA_OVER];
					}
				}
		}

		if (total_wari < use_wari_total) {
			this.H_tel = H_tel;
			return "\u5272\u5F15\u984D\u306E\u30A8\u30E9\u30FC\u3001\u65B0\u5272\u5F15\u304C\u5B9F\u5272\u5F15\u3092\u8D85\u3048\u307E\u3057\u305F";
		}

		if (tuwa_over_total > 0) //割引残を求める
			{
				var amari = (total_wari - use_wari_total) / tuwa_over_total;
			} else {
			amari = 0;
		}

		use_wari_total = 0;

		for (var key in H_tel) //割引割振りが終わっているかチェック
		{
			var value = H_tel[key];

			if (value[CLM_NEW_WARI] != value[CLM_TUWA]) //割引の割振りが終了していない回線に金額を振る
				//割振り予定の割引額
				//現在の割引を保存しておく
				//追加された割引額と、超過率の取得
				{
					var waribiki = +(value[CLM_TUWA_OVER] * amari);

					if (this.debug_out) {
						var wari_origin = H_tel[key][CLM_NEW_WARI];
					}

					if (value[CLM_TUWA] <= value[CLM_NEW_WARI] + waribiki) //この回線は割引金額が通話料金以上になったので、割引終了とする
						//割引金額
						{
							H_tel[key][CLM_NEW_WARI] = value[CLM_TUWA];
						} else //割引加算
						{
							H_tel[key][CLM_NEW_WARI] += waribiki;
						}

					if (this.debug_out) {
						H_tel[key][DEBUG_TUWA_OVER_PER] = value[CLM_TUWA_OVER] / tuwa_over_total;
						H_tel[key][DEBUG_WARI_ADD] = H_tel[key][CLM_NEW_WARI] - wari_origin;
					}
				}

			use_wari_total += H_tel[key][CLM_NEW_WARI];
		}

		amari = total_wari - use_wari_total;

		if (amari) {
			for (var key in H_tel) //金額と割引が一致しているなら終わり
			//割引額を全額割振ったのチェック
			{
				var value = H_tel[key];

				if (value[CLM_TUWA] == value[CLM_NEW_WARI]) {
					continue;
				}

				if (this.debug_out) {
					H_tel[key][DEBUG_WARI_AMARI]++;
				}

				H_tel[key][CLM_NEW_WARI]++;
				amari--;

				if (!amari) {
					break;
				}
			}
		}

		return H_tel;
	}

	tel_wari_anbun(H_tel) //新しい課税、非課税割引の値をマイナスにしておく
	{
		for (var key in H_tel) //割引がない場合は何もしない
		{
			var value = H_tel[key];

			if (value[CLM_TUWA] == value[CLM_NEW_WARI]) {
				H_tel[key][CLM_NEW_WARI_K] = -value[CLM_TUWA_K];
				H_tel[key][CLM_NEW_WARI_H] = -value[CLM_TUWA_H];
				continue;
			}

			var wari_h = +(value[CLM_NEW_WARI] * (value[CLM_TUWA_H] / value[CLM_TUWA]));
			H_tel[key][CLM_NEW_WARI_K] = -(value[CLM_NEW_WARI] - wari_h);
			H_tel[key][CLM_NEW_WARI_H] = -wari_h;
		}

		return H_tel;
	}

	tel_add_tax(H_tel, total_tuwa_tax) //まず、新しい課税通話料の割引による、課税通話料の合計を計算する
	//課税通話料がない場合は何もしない
	//端数処理
	{
		var total = 0;

		for (var key in H_tel) {
			var value = H_tel[key];
			total += value[CLM_TUWA_K] + value[CLM_NEW_WARI_K];
		}

		if (total == 0) {
			for (var key in H_tel) {
				var value = H_tel[key];
				H_tel[key][CLM_NEW_TUWA_TAX] = 0;
			}

			return H_tel;
		}

		var new_total_tuwa_tax = 0;
		var temp = total_tuwa_tax / total;

		for (var key in H_tel) {
			var value = H_tel[key];
			H_tel[key][CLM_NEW_TUWA_TAX] = +(temp * (value[CLM_TUWA_K] + value[CLM_NEW_WARI_K]));
			new_total_tuwa_tax += H_tel[key][CLM_NEW_TUWA_TAX];
		}

		var amari = total_tuwa_tax - new_total_tuwa_tax;

		if (amari > 0) {
			for (var key in H_tel) {
				var value = H_tel[key];

				if (value[CLM_NEW_TUWA_TAX] > 0) {
					H_tel[key][CLM_NEW_TUWA_TAX]++;
					amari--;

					if (!amari) {
						break;
					}
				}
			}
		}

		return H_tel;
	}

	error_check(H_tel) //check
	{
		var wari_total = 0;
		var new_wari_total = 0;

		for (var key in H_tel) //$tuwa_k = $value["charge_tuwa_k"] - $value["new_charge_wari_k"];
		//$tuwa_h = $value["charge_tuwa_h"] - $value["new_charge_wari_h"];
		//通話料金より割引金額が大きくなってないかチェック
		{
			var value = H_tel[key];
			wari_total += value.charge_wari_k + value.charge_wari_h;
			new_wari_total += value.new_charge_wari_k + value.new_charge_wari_h;
			echo(value.telno + " " + value.new_charge_wari_k + " " + value.new_charge_wari_h + "\n");

			if (value.charge_tuwa_k < value.new_charge_wari_k) {
				echo("\u5927\u304D\u3044");
			}

			if (value.charge_tuwa_h < value.new_charge_wari_h) {
				echo("\u5927\u304D\u3044");
			}
		}

		echo("\u65B0\u65E7\u306E\u5272\u5F15\u984D\u306E\u5408\u8A08(" + wari_total + "," + new_wari_total + ")\n");
	}

	initCommon() //viewの作成
	//error_reporting(0);
	//ini_set( 'display_errors', 0 );
	//ini_set( 'error_reporting', E_ERROR );	//	警告は表示しない
	//固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//取込み対象月の指定
	//$this->Mode			= $O_view->get_HArgv("-e");	//	delete後Copyか追加か
	//バックアップについて
	//親番号の指定
	//modelの作成
	//エクスポートする場合
	//$this->dataDirectory	= $dataDir;
	{
		var O_view = this.getView();
		this.set_Dirs(O_view.get_ScriptName());

		if (!this.debug) {
			this.lockProcess(O_view.get_ScriptName());
		}

		this.BillDate = O_view.get_HArgv("-y");
		this.BackUpFlg = O_view.get_HArgv("-b");
		var prtelno = O_view.get_HArgv("-n");
		this.Prtelno = prtelno == "none" ? undefined : prtelno;
		var O_model = this.getModel();

		if ("Y" == this.BackUpFlg) //請求データディレクトリを取得
			//請求データディレクトリチェック（スクリプト終了）
			{
				var tblist = O_model.getBackUpTableNameList();
				var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.BillDate + "/" + "apportion";

				if (!this.isDirCheck(dataDir, "rw")) {
					if (!mkdir(dataDir)) {
						this.errorOut(1000, "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u30D5\u30A1\u30A4\u30EB\u306E\u4F5C\u6210\u5931\u6557(" + dataDir + ")\n", 0, "", "");
						throw die(-1);
					}
				}

				for (var tbname of Object.values(tblist)) {
					var expFile = dataDir + "/" + tbname + date("YmdHis") + ".exp";

					if (false == this.expData(tbname, expFile, 1000)) {
						throw die(-1);
					}
				}
			}

		this.O_model = O_model;
		this.O_view = O_view;
	}

	readINI(pactid = undefined) //ファイルの存在チェック
	{
		var id = is_null(pactid) ? "default" : pactid;
		var filename = KCS_DIR + "/conf_sync/apportion_discount/" + id + ".ini";

		if (!file_exists(filename)) {
			return undefined;
		}

		var ini = parse_ini_file(filename, true);

		for (var key in ini) //通話コードをシングルクォーテーションで括るようにする
		{
			var value = ini[key];

			if (undefined !== value.A_TUWA_CODE) {
				ini[key].A_TUWA_CODE = "'" + str_replace(",", "','", value.A_TUWA_CODE) + "'";
			}

			if (undefined !== value.TAX_CODE) {
				ini[key].TAX_CODE = "'" + str_replace(",", "','", value.TAX_CODE) + "'";
			}

			if (undefined !== value.A_TAX_KUBUN) {
				var temp = value.A_TAX_KUBUN.split(",");

				for (var no in temp) {
					var code = temp[no];
					temp[no] = "'" + code + "'";
				}

				ini[key].A_TAX_KUBUN = temp;
			}

			if (undefined !== value.FREE_CODE_KAZEI) {
				temp = value.FREE_CODE_KAZEI.split(",");

				for (var no in temp) {
					var code = temp[no];
					var a = code.split("|");
					temp[no] = ["'" + a[0] + "'", "'" + a[1] + "'"];
				}

				ini[key].FREE_CODE_KAZEI = temp;
			}

			if (undefined !== value.FREE_CODE_HIKAZEI) {
				temp = value.FREE_CODE_HIKAZEI.split(",");

				for (var no in temp) {
					var code = temp[no];
					a = code.split("|");
					temp[no] = ["'" + a[0] + "'", "'" + a[1] + "'"];
				}

				ini[key].FREE_CODE_HIKAZEI = temp;
			}

			if (undefined !== value.INSERT_KAZEI_TDCOMMENT) {
				if (!value.INSERT_KAZEI_TDCOMMENT) {
					ini[key].DB_INSERT_KAZEI_TDCOMMENT = "NULL";
				} else {
					ini[key].DB_INSERT_KAZEI_TDCOMMENT = "'" + value.INSERT_KAZEI_TDCOMMENT + "'";
				}
			}

			if (undefined !== value.INSERT_HIKAZEI_TDCOMMENT) {
				if (!value.INSERT_HIKAZEI_TDCOMMENT) {
					ini[key].DB_INSERT_HIKAZEI_TDCOMMENT = "NULL";
				} else {
					ini[key].DB_INSERT_HIKAZEI_TDCOMMENT = "'" + value.INSERT_HIKAZEI_TDCOMMENT + "'";
				}
			}

			if (undefined !== value.INSERT_TAX_TDCOMMENT) {
				if (!value.INSERT_TAX_TDCOMMENT) {
					ini[key].DB_INSERT_TAX_TDCOMMENT = "NULL";
				} else {
					ini[key].DB_INSERT_TAX_TDCOMMENT = "'" + value.INSERT_TAX_TDCOMMENT + "'";
				}
			}

			if (undefined !== value.POST_LEVEL) {
				ini[key].POST_LEVEL = +value.POST_LEVEL;
			}

			if (undefined !== value.DEBUG_TEL_ANBUN) {
				ini[key].DEBUG_TEL_ANBUN = Bool(value.DEBUG_TEL_ANBUN);
			} else if (is_null(pactid)) {
				ini[key].DEBUG_TEL_ANBUN = false;
			}
		}

		return ini;
	}

	ini_merge(src1, src2) //src2がnullなら何もしない
	{
		if (is_null(src2)) {
			return src1;
		}

		if (!Array.isArray(src1)) {
			return src2;
		}

		if (!Array.isArray(src2)) {
			return src1;
		}

		for (var key in src2) {
			var value = src2[key];
			src1[key] = value;
		}

		return src1;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

	view_post_trans(post_rel, post_trans) //部署の転置先を表示するぞい
	{
		echo(sprintf("%10s | %10s | %10s | %10s\n", "level", "parent", "child", "trans"));

		for (var key in post_rel) {
			var value = post_rel[key];
			echo(sprintf("%10s | %10s | %10s | %10s\n", value.level, value.postidparent, value.postidchild, post_trans[value.postidchild]));
		}
	}

	view_data(H_tel) //各データを表示する
	//合計の表示
	{
		if (!!this.A_post_info) {
			echo("\n");
			var header = ["\u90E8\u7F72ID", "\u56DE\u7DDA\u6570", "\u901A\u8A71\u6599", "1\u56DE\u7DDA\u6BCE\u306E\u5272\u5F15\u984D", "\u901A\u8A71\u6599\u8D85\u904E\u984D", "\u901A\u8A71\u6599\u8D85\u904E\u7387", "\u5272\u5F15\u8FFD\u52A0", "\u5272\u5F15\u4F59\u308A\u8FFD\u52A0", "\u65B0\u5272\u5F15\u984D"];
			echo(header.join(",") + "\n");
			var total = Array();

			for (var key in header) {
				var value = header[key];
				total[key] = 0;
			}

			{
				let _tmp_0 = this.A_post_info;

				for (var key in _tmp_0) //合計
				{
					var value = _tmp_0[key];
					var temp = [key, value.tel_num, value.charge_tuwa, value[DEBUG_WARI_FIRST], value.tuwa_over, value[DEBUG_TUWA_OVER_PER], value[DEBUG_WARI_ADD], value[DEBUG_WARI_AMARI], value.charge_wari];
					echo(temp.join(",") + "\n");

					for (var k in temp) {
						var v = temp[k];
						if (k == 0) continue;
						total[k] += v;
					}
				}
			}
			total[0] = "\u5408\u8A08";
			echo(total.join(",") + "\n");
			echo("--------------------------------------------------\n");
		}

		if (is_null(H_tel)) {
			return;
		}

		header = ["\u96FB\u8A71\u756A\u53F7", "\u65E7\u90E8\u7F72", "\u90E8\u7F72", "\u65E7\u8AB2\u7A0E\u901A\u8A71", "\u65E7\u975E\u8AB2\u7A0E\u901A\u8A71", "\u901A\u8A71\u6599\u5408\u8A08", "\u65E7\u8AB2\u7A0E\u5272\u5F15", "\u65E7\u975E\u8AB2\u7A0E\u5272\u5F15", "\u65E7\u5272\u5F15\u5408\u8A08", "1\u56DE\u7DDA\u6BCE\u306E\u5272\u5F15\u984D", "\u901A\u8A71\u6599\u8D85\u904E\u7387", "\u5272\u5F15\u8FFD\u52A0", "\u5272\u5F15\u4F59\u308A\u8FFD\u52A0", "\u65B0\u8AB2\u7A0E\u5272\u5F15", "\u65B0\u975E\u8AB2\u7A0E\u5272\u5F15", "\u65B0\u5272\u5F15\u984D\u5408\u8A08", "\u8AB2\u7A0E\u5272\u5F15\u5DEE\u66FF", "\u8AB2\u7A0E\u5272\u5F15\u5DEE\u8FBC", "\u975E\u8AB2\u7A0E\u5DEE\u66FF", "\u975E\u8AB2\u7A0E\u5DEE\u8FBC", "\u7A0E\u91D1", "\u901A\u8A71\u6599\u7A0E\u91D1", "\u65B0\u901A\u8A71\u6599\u7A0E\u91D1", "\u901A\u8A71\u6599\u7A0E\u91D1\u5DEE\u66FF", "\u901A\u8A71\u6599\u7A0E\u91D1\u5DEE\u8FBC"];
		echo(header.join(",") + "\n");
		total = Array();

		for (var key in header) {
			var value = header[key];
			total[key] = 0;
		}

		for (var key in H_tel) {
			var value = H_tel[key];
			temp = [value[CLM_TELNO].substr(0, 3) + "-" + value[CLM_TELNO].substr(3, 4) + "-" + value[CLM_TELNO].substr(7, 4), undefined !== value[DEBUG_POSTID_OLD] ? value[DEBUG_POSTID_OLD] : "", value[CLM_POSTID], value[CLM_TUWA_K], value[CLM_TUWA_H], value[CLM_TUWA], value[CLM_WARI_K], value[CLM_WARI_H], value[CLM_WARI_K] + value[CLM_WARI_H], value[DEBUG_WARI_FIRST], value[DEBUG_TUWA_OVER_PER], value[DEBUG_WARI_ADD], value[DEBUG_WARI_AMARI], value[CLM_NEW_WARI_K], value[CLM_NEW_WARI_H], value[CLM_NEW_WARI_K] + value[CLM_NEW_WARI_H], value[CLM_NEW_WARI_K], value[CLM_NEW_WARI_K] - value[CLM_WARI_K], value[CLM_NEW_WARI_H], value[CLM_NEW_WARI_H] - value[CLM_WARI_H], value[CLM_TAX], value[CLM_TUWA_TAX], value[CLM_NEW_TUWA_TAX], value[CLM_NEW_TUWA_TAX] - value[CLM_TUWA_TAX], value[CLM_TAX] - value[CLM_TUWA_TAX] + value[CLM_NEW_TUWA_TAX]];
			echo(temp.join(",") + "\n");

			for (var key in total) {
				var value = total[key];
				if (key == 0) continue;
				if (key == 1) continue;
				total[key] += temp[key];
			}
		}

		total[0] = "\u5408\u8A08";
		total[1] = "";
		echo(total.join(",") + "\n");
	}

};