//
//SUO：ETC（UFJ/Nicos）の取込　(process)
//
//更新履歴：<br>
//2008/04/25	石崎公久	作成
//
//@uses SUOBaseProc
//@package SUO
//@subpackage Process
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/25
//
//
//error_reporting(E_ALL|E_STRICT);
//
//SUO：ETC（UFJ/Nicos）の取込　(process)
//
//@uses SUOBaseProc
//@package SUO
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/25
//

require("process/SUOBaseProc.php");

require("view/script/SuoImportEtcUfjNicosView.php");

require("model/script/SuoImportEtcUfjNicosModel.php");

require("MtScriptAmbient.php");

//
//Viewオブジェクト
//
//@var TweakDetailsSUOView
//@access protected
//
//
//割引率調整Modelオブジェクト
//
//@var TweakDetailsSUOModel
//@access protected
//
//
//引数で渡されたYYYYMM
//
//@var String
//@access protected
//
//
//顧客IDを入れる
//
//@var integer
//@access protected
//
//
//実行中のスクリプト固有のログディレクトリ
//
//@var string
//@access protected
//
//
//調整額設定ハッシュ
//
//@var mixed
//@access protected
//
//
//エラーの生じた電話番号（tmp）
//
//@var string
//@access protected
//
//
//コンストラクター
//
//@author ishizaki
//@since 2008/08/05
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//１．固有のログディレクトリを作成<br>
//２．二重起動ロック<br>
//３．引数（pactid, yyyymm）をメンバー変数へ<br>
//（トランザクション開始）
//４．pactidを元にtweak_details_tb から割引額の設定情報を抜き出す<br>
//５．会社CDの登録されていない部署に所属する電話の有無をチェック<br>
//６．ドコモの処理<br>
//１．割引額の一覧（電話番号ごと）を取得<br>
//１．請求情報の電話番号が所属する会社CDから割引調整率を取得<br>
//２．調整後の割引額を反映<br>
//２．調整後の割引額を反映した消費税（合算）の一覧（電話番号ごと）<br>
//３．（個別）の消費税一覧を取得<br>
//４．調整後の消費税の反映<br>
//７．auの処理。<br>
//１．請求情報の一覧を取得
//１．請求情報の電話番号が所属する会社CDから割引調整率を取得<br>
//２．各電話ごとに、基本料、通話料、通信料の情報をまとめる<br>
//３．新しい割引率を反映させる<br>
//２．消費税金額の修正<br>
//３．合計金額の修正
//８．二重起動ロック解除
//
//2008/04/21 個別の税区分の処理を追加（不具合）
//
//@author ishizaki
//@since 2008/03/05
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
class SuoImportEtcUfjNicosProc extends SUOBaseProc {
	constructor(H_param: {} | any[] = Array()) //view の生成
	//引数確認の処理が終わっている
	//model作成
	{
		super(H_param);
		this.TelNoError = "";
		this.O_View = new TweakDetailsSUOView();
		this.O_Model = new TweakDetailsSUOModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //固有ディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//割引額設定取得
	//ドコモの処理終了
	//au処理
	//電話数取得
	//au処理終了
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactID = this.O_View.get_HArgv("-p");
		this.YYYYMM = this.O_View.get_HArgv("-y");
		this.H_TweakConf = this.O_Model.getTweakConf(this.PactID);

		if (false == this.H_TweakConf) {
			this.errorOut(1000, "\u6307\u5B9A\u3057\u305F\u9867\u5BA2ID\u306E\u5272\u5F15\u8A2D\u5B9A\u304C\u3001tweak_config_tb\u306B\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\n");
			this.unLockProcess(this.O_View.get_ScriptName());
			throw die(-1);
		}

		var A_no_cocd_post = this.O_Model.checkNullCocdPost(this.PactID, this.YYYYMM);

		if (0 < A_no_cocd_post.length) {
			var err_telno = "";

			for (var value of Object.values(A_no_cocd_post)) {
				if (err_telno != value.telno) {
					this.errorOut(1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + value.telno + "\uFF09\u306E\u6240\u5C5E\u3059\u308B\u7B2C\u4E09\u968E\u5C64\u306E\u90E8\u7F72\u306B\u4F1A\u793ECD\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\n");
					err_telno == value.telno;
				}
			}

			this.unLockProcess(this.O_View.get_ScriptName());
			throw die(-1);
		}

		var docomo_tel_count = this.O_Model.tweakDetailsTelno(this.PactID, this.YYYYMM, this.getSetting().car_docomo).length;

		if (1 > docomo_tel_count) {
			this.infoOut("\u51E6\u7406\u5BFE\u8C61\u3068\u306A\u308B\u30C9\u30B3\u30E2\u8ACB\u6C42\u60C5\u5831\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002\n");
		} else //トランザクション開始
			//問題が発生したとき、ここtrueに。trueの場合はコミットしない
			//各電話ごとの基本料合計の一覧
			//各電話ごとの現在の割引一覧の取得
			//割引額の調整
			//消費税の調整
			{
				this.infoOut("\u30C9\u30B3\u30E2\u306E\u5272\u5F15\u7387\u8ABF\u6574\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059\u3002\u5BFE\u8C61\u4EF6\u6570" + docomo_tel_count + "\u4EF6\u3002\n");
				this.get_DB().beginTransaction();
				var update_cansel = false;
				var H_docomo_newbase = this.O_Model.tweakNewBaseDocomo(this.PactID, this.YYYYMM);
				var A_docomo_base = this.O_Model.tweakBaseDocomo(this.PactID, this.YYYYMM);
				var b_telno = "";

				for (var cnt = 0; cnt < A_docomo_base.length; cnt++) //前回処理した番号と同じならば、その割引を削除して次へ
				{
					if (b_telno == A_docomo_base[cnt].telno) {
						this.infoOut("\u96FB\u8A71\u756A\u53F7\uFF08" + A_docomo_base[cnt].telno + "\uFF09\u306E\u4E8C\u4EF6\u76EE\u4EE5\u964D\u306E\u660E\u7D30\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664\u3002\n", 0);
						var return = this.O_Model.tweakDeleteRecode(this.PactID, this.YYYYMM, this.getSetting().car_docomo, A_docomo_base[cnt]);

						if (return != 1) {
							this.errorOut(1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + A_docomo_base[cnt].telno + "\uFF09\u306E\u5272\u5F15\u984D\u4FEE\u6B63\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u5272\u5F15\u984D\u524A\u9664\u306E\u30A8\u30E9\u30FC\n");
							update_cansel = true;
						}

						continue;
					}

					b_telno = A_docomo_base[cnt].telno;
					var H_telpost = this.O_Model.getCOCDofTel(this.PactID, A_docomo_base[cnt].telno, this.getSetting().car_docomo, this.YYYYMM);

					if (false == (undefined !== this.H_TweakConf[H_telpost.cocd])) {
						this.errorOut(1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + A_docomo_base[cnt].telno + "\uFF09\u304C\u6240\u5C5E\u3057\u3066\u3044\u308B\u90E8\u7F72\u306E\u4F1A\u793ECD\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\n");
						update_cansel = true;
					}

					if (false == this.H_TweakConf[H_telpost.cocd].docomo_tweak_flag) {
						continue;
					}

					A_docomo_base[cnt].tweakcharge = +(H_docomo_newbase[A_docomo_base[cnt].telno] * this.H_TweakConf[H_telpost.cocd].docomo_tweak_base / 100 * -1);
					this.infoOut("\u96FB\u8A71\u756A\u53F7\uFF08" + A_docomo_base[cnt].telno + "\uFF09\u306E\u57FA\u672C\u6599\u5272\u5F15\u984D\u306E\u8ABF\u6574\u3092\u884C\u3044\u307E\u3059\u3002\n");
					var num = this.O_Model.updateTweakBaseDocomo(this.PactID, this.YYYYMM, A_docomo_base[cnt]);

					if (1 != num) {
						this.errorOut(1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + A_docomo_base[cnt].telno + "\uFF09\u306E\u57FA\u672C\u6599\u5272\u5F15\u984D\u306E\u8ABF\u6574\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\n");
						update_cansel = true;
					}
				}

				delete A_docomo_base;
				delete H_docomo_newbase;
				var A_docomo_tax = this.O_Model.tweakTaxDocomo(this.PactID, this.YYYYMM);
				var docomo_tax_coount = A_docomo_tax.length;
				var H_docomo_new_tax = this.O_Model.tweakNewTaxDocomo(this.PactID, this.YYYYMM);
				var H_docomo_new_tax_ones = this.O_Model.tweakNewTaxOnesDocomo(this.PactID, this.YYYYMM);
				b_telno = "";

				for (cnt = docomo_tax_coount - 1;; cnt >= 0; cnt--) //複数の消費税をまとめる
				{
					if (b_telno == A_docomo_tax[cnt].telno) {
						this.infoOut("\u96FB\u8A71\u756A\u53F7\uFF08" + A_docomo_tax[cnt].telno + "\uFF09\u306E\u4E8C\u4EF6\u76EE\u4EE5\u964D\u306E\u6D88\u8CBB\u7A0E\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664\u3002\n", 0);
						this.O_Model.deleteTaxDocomo(this.PactID, this.YYYYMM, A_docomo_tax[cnt]);
						continue;
					}

					A_docomo_tax[cnt].tweakcharge = H_docomo_new_tax[A_docomo_tax[cnt].telno];

					if (true == (undefined !== H_docomo_new_tax_ones[A_docomo_tax[cnt].telno])) {
						A_docomo_tax[cnt].tweakcharge += H_docomo_new_tax_ones[A_docomo_tax[cnt].telno];
					}

					this.infoOut("\u96FB\u8A71\u756A\u53F7\uFF08" + A_docomo_tax[cnt].telno + "\uFF09\u306E\u5272\u5F15\u984D\u8ABF\u6574\u5F8C\u306E\u6D88\u8CBB\u7A0E\u3092\u4FEE\u6B63\u3002\n");
					num = this.O_Model.updateTaxDocomo(this.PactID, this.YYYYMM, A_docomo_tax[cnt]);

					if (1 != num) {
						this.errorOut(1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + A_docomo_tax[cnt].telno + "\uFF09\u306E\u5272\u5F15\u984D\u8ABF\u6574\u5F8C\u306E\u6D88\u8CBB\u7A0E\u306E\u4FEE\u6B63\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\n");
						update_cansel = true;
					}

					b_telno = A_docomo_tax[cnt].telno;
				}

				delete A_docomo_tax;
				delete docomo_tax_coount;
				delete H_docomo_new_tax;

				if (true == update_cansel) {
					this.infoOut("\u8ABF\u6574\u306B\u5931\u6557\u3057\u305F\u30EC\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u3057\u305F\u306E\u3067\u3001\u30C9\u30B3\u30E2\u306E\u5272\u5F15\u984D\u8ABF\u6574\u306F\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3057\u305F\u3002\n");
					this.get_DB().rollback();
				} else {
					this.get_DB().commit();
					this.infoOut("\u30C9\u30B3\u30E2\u306E\u5272\u5F15\u984D\u306E\u8ABF\u6574\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F\u3002\n");
				}
			}

		delete docomo_tel_count;
		var A_au_tel_count = this.O_Model.tweakDetailsTelno(this.PactID, this.YYYYMM, this.getSetting().car_au);

		if (1 > A_au_tel_count.length) {
			this.infoOut("\u51E6\u7406\u5BFE\u8C61\u3068\u306A\u308Bau\u8ACB\u6C42\u60C5\u5831\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002\n");
		} else //auの割引額調整を行う電話番号のみに絞り込む
			{
				b_telno = "";
				var A_au_tel_list = Array();

				for (cnt = 0;; cnt < A_au_tel_count.length; cnt++) {
					if (b_telno == A_au_tel_count[cnt].telno) {
						continue;
					}

					H_telpost = this.O_Model.getCOCDofTel(this.PactID, A_au_tel_count[cnt].telno, this.getSetting().car_au, this.YYYYMM);

					if (false == this.H_TweakConf[H_telpost.cocd].au_tweak_flag) {
						continue;
					}

					b_telno = A_au_tel_count[cnt].telno;
					A_au_tel_list.push(A_au_tel_count[cnt].telno);
				}

				b_telno = "";
				var au_tel_count = A_au_tel_list.length;

				if (1 > au_tel_count) {
					this.infoOut("\u51E6\u7406\u5BFE\u8C61\u3068\u306A\u308Bau\u8ACB\u6C42\u60C5\u5831\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002\n");
				} else //トランザクション開始
					//問題が発生したとき、ここtrueに。trueの場合はコミットしない
					//対象電話番号の請求情報を取得
					//修正データを格納
					//今調整中のコードに割引のレコードが出てきたか
					//前回処理した電話番号
					//所属部署の情報
					//親コードのカウント数
					//子コードスキップフラグ
					//調整金額算出
					//au調整後の消費税の修正
					//合計金額の修正
					{
						this.infoOut("au\u306E\u5272\u5F15\u984D\u8ABF\u6574\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059\u3002\u5BFE\u8C61\u4EF6\u6570" + au_tel_count + "\n");
						this.get_DB().beginTransaction();
						update_cansel = false;
						var A_details_au = this.O_Model.tweakDetailsAU(this.PactID, this.YYYYMM, A_au_tel_list);
						var tweak_au_details = 0;
						var tweak_flag = false;
						b_telno = "";
						H_telpost = Array();
						var parent_cnt = undefined;
						var skip_flag = true;

						for (cnt = 0;; cnt < A_details_au.length; cnt++) //電話番号が変わったら
						{
							if (b_telno != A_details_au[cnt].telno) //所属部署設定の取得
								{
									b_telno = A_details_au[cnt].telno;
									H_telpost = this.O_Model.getCOCDofTel(this.PactID, A_details_au[cnt].telno, this.getSetting().car_au, this.YYYYMM);
								}

							if (false == (undefined !== this.H_TweakConf[H_telpost.cocd])) {
								this.errorOut(1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + A_details_au[cnt].telno + "\uFF09\u304C\u6240\u5C5E\u3057\u3066\u3044\u308B\u90E8\u7F72\u306E\u4F1A\u793ECD\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\n");
								update_cansel = true;
							}

							if (0 == A_details_au[cnt].codetype) //割引調整対象親コード
								{
									if (true == (-1 !== this.getSetting().A_suo_au_datacodemaster.indexOf(A_details_au[cnt].code)) or true == (-1 !== this.getSetting().A_suo_au_tuwacodemaster.indexOf(A_details_au[cnt].code)) or A_details_au[cnt].code == this.getSetting().suo_au_basecodemaster) {
										skip_flag = false;
										parent_cnt = cnt;
										tweak_au_details = 0;
										tweak_flag = false;
									} else {
										skip_flag = true;
									}
								} else //スキップフラグがたっている場合
								{
									if (true == skip_flag) {
										continue;
									}

									if (true == (-1 !== this.getSetting().A_suo_au_basecode.indexOf(A_details_au[cnt].code))) {
										if (true == tweak_flag) {
											this.infoOut("\u96FB\u8A71\u756A\u53F7\uFF08" + A_details_au[cnt].telno + "\uFF09\u306E\u4E8C\u4EF6\u76EE\u4EE5\u964D\u306E\u5272\u5F15\u984D\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664\u3002\n", 0);
											num = this.O_Model.tweakDeleteRecode(this.PactID, this.YYYYMM, this.getSetting().car_au, A_details_au[cnt]);

											if (1 != num) {
												this.errorOut(1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + A_details_au[cnt].telno + "\uFF09\u306E\u5272\u5F15\u984D\u30EC\u30B3\u30FC\u30C9\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\n");
												update_cansel = true;
											}

											continue;
										}

										A_details_au[cnt].tdcomment = "";
										A_details_au[cnt].codename = this.getSetting().suo_tweak_codename;
										A_details_au[cnt].tweakcharge = +(tweak_au_details * this.H_TweakConf[H_telpost.cocd].au_tweak_base / 100 * -1);
										this.infoOut("\u96FB\u8A71\u756A\u53F7\uFF08" + A_details_au[cnt].telno + "\uFF09\u306E\u57FA\u672C\u6599\u5272\u5F15\u984D\u306E\u66F4\u65B0\u3002\n");
										num = this.O_Model.updateTweakAU(this.PactID, this.YYYYMM, A_details_au[cnt]);

										if (1 != num) {
											this.errorOut(1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + A_details_au[cnt].telno + "\uFF09\u306E\u5272\u5F15\u984D\u30EC\u30B3\u30FC\u30C9\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\n");
											update_cansel = true;
										}

										A_details_au[parent_cnt].tweakcharge = tweak_au_details + A_details_au[cnt].tweakcharge;
										this.infoOut("\u96FB\u8A71\u756A\u53F7\uFF08" + A_details_au[cnt].telno + "\uFF09\u306E\u57FA\u672C\u6599\u306E\u66F4\u65B0\u3002\n");
										num = this.O_Model.updateTweakAU(this.PactID, this.YYYYMM, A_details_au[parent_cnt]);

										if (1 != num) {
											this.errorOut(1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + A_details_au[cnt].telno + "\uFF09\u306E\u57FA\u672C\u6599\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\n");
											update_cansel = true;
										}

										tweak_flag = true;
									} else if (true == (-1 !== this.getSetting().A_suo_au_tuwacode.indexOf(A_details_au[cnt].code))) //if(true == $tweak_flag){
										//								$this->infoOut("電話番号（" . $A_details_au[$cnt]["telno"] . "）の二件目以降の割引額レコードを削除。\n", 0);
										//								$num = $this->O_Model->tweakDeleteRecode($this->PactID, $this->YYYYMM, $this->getSetting()->car_au, $A_details_au[$cnt]);
										//								if(1 != $num){
										//									$this->errorOut(1000, "電話番号（" . $A_details_au[$cnt]["telno"] . "）の割引額レコードの削除に失敗しました。\n");
										//									$update_cansel = true;
										//								}
										//								continue;
										//							}
										//$A_details_au[$cnt]["tweakcharge"] = (int)($tweak_au_details * $this->H_TweakConf[$H_telpost["cocd"]]["au_tweak_tuwa"] / 100) * -1;
										{
											A_details_au[cnt].tdcomment = "";
											A_details_au[cnt].codename = this.getSetting().suo_tweak_codename;
											A_details_au[cnt].tweakcharge = A_details_au[cnt].charge;
											this.infoOut("\u96FB\u8A71\u756A\u53F7\uFF08" + A_details_au[cnt].telno + "\uFF09\u306E\u901A\u8A71\u6599\u5272\u5F15\u984D\u3001\u30B3\u30FC\u30C9\u540D\u79F0\u306E\u66F4\u65B0\u3002\n");
											num = this.O_Model.updateTweakAU(this.PactID, this.YYYYMM, A_details_au[cnt]);

											if (1 != num) {
												this.errorOut(1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + A_details_au[cnt].telno + "\uFF09\u306E\u901A\u8A71\u6599\u5272\u5F15\u984D\u30EC\u30B3\u30FC\u30C9\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\n");
												update_cansel = true;
											}

											tweak_flag = true;
										} else if (true == (-1 !== this.getSetting().A_suo_au_datacode.indexOf(A_details_au[cnt].code))) //if(true == $tweak_flag){
										//								$this->infoOut("電話番号（" . $A_details_au[$cnt]["telno"] . "）の二件目以降の割引額レコードを削除。\n", 0);
										//								$num = $this->O_Model->tweakDeleteRecode($this->PactID, $this->YYYYMM, $this->getSetting()->car_au, $A_details_au[$cnt]);
										//								if(1 != $num){
										//									$this->errorOut(1000, "電話番号（" . $A_details_au[$cnt]["telno"] . "）の割引額レコードの削除に失敗しました。\n");
										//									$update_cansel = true;
										//								}
										//								continue;
										//							}
										//$A_details_au[$cnt]["tweakcharge"] = (int)($tweak_au_details * $this->H_TweakConf[$H_telpost["cocd"]]["au_tweak_tuwa"] / 100) * -1;
										{
											A_details_au[cnt].tdcomment = "";
											A_details_au[cnt].codename = this.getSetting().suo_tweak_codename;
											A_details_au[cnt].tweakcharge = A_details_au[cnt].charge;
											this.infoOut("\u96FB\u8A71\u756A\u53F7\uFF08" + A_details_au[cnt].telno + "\uFF09\u306E\u901A\u4FE1\u6599\u5272\u5F15\u984D\u306E\u66F4\u65B0\u3002\n");
											num = this.O_Model.updateTweakAU(this.PactID, this.YYYYMM, A_details_au[cnt]);

											if (1 != num) {
												this.errorOut(1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + A_details_au[cnt].telno + "\uFF09\u306E\u901A\u4FE1\u6599\u5272\u5F15\u984D\u30EC\u30B3\u30FC\u30C9\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\n");
												update_cansel = true;
											}

											tweak_flag = true;
										} else {
										tweak_au_details += A_details_au[cnt].charge;
									}
								}
						}

						delete A_details_au;
						delete H_telpost;
						var A_au_tax = this.O_Model.tweakTaxAU(this.PactID, this.YYYYMM, A_au_tel_list);
						this.infoOut(A_au_tax, 0);
						var au_tax_count = A_au_tax.length;
						var H_au_new_tax = this.O_Model.tweakNewTaxAU(this.PactID, this.YYYYMM, A_au_tel_list);
						this.infoOut(H_au_new_tax, 0);
						b_telno = "";

						for (cnt = au_tax_count - 1;; cnt >= 0; cnt--) //複数の消費税をまとめる
						{
							if (b_telno == A_au_tax[cnt].telno) {
								this.O_Model.deleteTaxAUTax(this.PactID, this.YYYYMM, A_au_tax[cnt]);
								continue;
							}

							A_au_tax[cnt].tweakcharge = H_au_new_tax[A_au_tax[cnt].telno];
							num = this.O_Model.updateTaxAU(this.PactID, this.YYYYMM, A_au_tax[cnt]);

							if (1 != num) {
								this.errorOut(1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + A_au_tax[cnt].telno + "\uFF09\u306E\u5272\u5F15\u984D\u8ABF\u6574\u5F8C\u306E\u6D88\u8CBB\u7A0E\u306E\u4FEE\u6B63\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\n");
								update_cansel = true;
							}

							b_telno = A_au_tax[cnt].telno;
						}

						delete A_au_tax;
						delete au_tax_count;
						delete H_au_new_tax;
						var A_au_total = this.O_Model.tweakTotalAU(this.PactID, this.YYYYMM, A_au_tel_list);
						this.infoOut(A_au_total, 0);
						var au_total_count = A_au_total.length;
						var H_au_new_total = this.O_Model.tweakNewTotalAU(this.PactID, this.YYYYMM, A_au_tel_list);
						this.infoOut(H_au_new_total, 0);
						num = "";

						for (cnt = 0;; cnt < au_total_count; cnt++) {
							A_au_total[cnt].tweakcharge = H_au_new_total[A_au_total[cnt].telno];
							num = this.O_Model.updateTotalAU(this.PactID, this.YYYYMM, A_au_total[cnt]);

							if (1 != num) {
								this.errorOut(1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + A_au_total[cnt].telno + "\uFF09\u306E\u5272\u5F15\u984D\u8ABF\u6574\u5F8C\u306E\u5408\u8A08\u91D1\u984D\u306E\u4FEE\u6B63\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\n");
								update_cansel = true;
							}
						}

						if (true == update_cansel) {
							this.infoOut("\u8ABF\u6574\u306B\u5931\u6557\u3057\u305F\u30EC\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u3057\u305F\u306E\u3067\u3001au\u306E\u5272\u5F15\u984D\u8ABF\u6574\u306F\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3057\u305F\u3002\n");
							this.get_DB().rollback();
						} else {
							this.get_DB().commit();
							this.infoOut("au\u306E\u5272\u5F15\u984D\u306E\u8ABF\u6574\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F\u3002\n");
						}
					}
			}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
	}

	__destruct() {
		super.__destruct();
	}

};