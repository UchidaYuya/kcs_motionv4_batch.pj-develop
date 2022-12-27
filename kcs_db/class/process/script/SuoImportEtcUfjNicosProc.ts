//SUO：ETC（UFJ/Nicos）の取込　(process)
//2008/04/25	石崎公久	作成
import SUOBaseProc from "../SUOBaseProc";
import TweakDetailsSUOView from "../../view/script/TweakDetailsSUOView";
import TweakDetailsSUOModel from "../../model/script/TweakDetailsSUOModel";

export default class SuoImportEtcUfjNicosProc extends SUOBaseProc {
	O_View: TweakDetailsSUOView;
	O_Model: TweakDetailsSUOModel;
	YYYYMM: string;
	PactID: number;
	H_TweakConf: any;
	TelNoError: string = "";

	constructor(H_param: {} | any[] = Array()) //view の生成
	//引数確認の処理が終わっている
	//model作成
	{
		super(H_param);
		this.TelNoError = "";
		this.O_View = new TweakDetailsSUOView();
		this.O_Model = new TweakDetailsSUOModel(this.get_MtScriptAmbient());
		this.YYYYMM = this.O_View.get_HArgv("-y");
		this.PactID = this.O_View.get_HArgv("-p");
	}

	async doExecute(H_param: {} | any[] = Array())
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.H_TweakConf = this.O_Model.getTweakConf(this.PactID);

		if (false == this.H_TweakConf) {
			this.errorOut(1000, "指定した顧客IDの割引設定が、tweak_config_tbに入力されていません。\n");
			this.unLockProcess(this.O_View.get_ScriptName());
			throw process.exit(-1);
		}

		var A_no_cocd_post = await this.O_Model.checkNullCocdPost(this.PactID, this.YYYYMM);

		if (0 < A_no_cocd_post.length) {
			var err_telno = "";

			for (var value of A_no_cocd_post) {
				if (err_telno != value.telno) {
					this.errorOut(1000, "電話番号（" + value.telno + "）の所属する第三階層の部署に会社CDが設定されていません。\n");
					err_telno == value.telno;
				}
			}

			this.unLockProcess(this.O_View.get_ScriptName());
			throw process.exit(-1);
		}

		var docomo_tel_count = (await this.O_Model.tweakDetailsTelno(this.PactID, this.YYYYMM, this.getSetting().get("car_docomo"))).length;

		if (1 > docomo_tel_count) {
			this.infoOut("処理対象となるドコモ請求情報がありませんでした。\n");
		} else //トランザクション開始
			{
				this.infoOut("ドコモの割引率調整処理を開始します。対象件数" + docomo_tel_count + "件。\n");
				this.get_DB().beginTransaction();
				var update_cansel = false;
				var H_docomo_newbase = await this.O_Model.tweakNewBaseDocomo(this.PactID, this.YYYYMM);
				var A_docomo_base = await this.O_Model.tweakBaseDocomo(this.PactID, this.YYYYMM);
				var b_telno = "";

				for (var cnt = 0; cnt < A_docomo_base.length; cnt++) //前回処理した番号と同じならば、その割引を削除して次へ
				{
					if (b_telno == A_docomo_base[cnt].telno) {
						this.infoOut("電話番号（" + A_docomo_base[cnt].telno + "）の二件目以降の明細レコードを削除。\n", 0);
						var return_0 = await this.O_Model.tweakDeleteRecode(this.PactID, this.YYYYMM, this.getSetting().get("car_docomo"), A_docomo_base[cnt]);

						if (return_0 != 1) {
							this.errorOut(1000, "電話番号（" + A_docomo_base[cnt].telno + "）の割引額修正に失敗しました。割引額削除のエラー\n");
							update_cansel = true;
						}

						continue;
					}

					b_telno = A_docomo_base[cnt].telno;
					var H_telpost = await this.O_Model.getCOCDofTel(this.PactID, A_docomo_base[cnt].telno, this.getSetting().get("car_docomo"), this.YYYYMM);

					if (false == (undefined !== this.H_TweakConf[H_telpost.cocd])) {
						this.errorOut(1000, "電話番号（" + A_docomo_base[cnt].telno + "）が所属している部署の会社CDが設定されていません。\n");
						update_cansel = true;
					}

					if (false == this.H_TweakConf[H_telpost.cocd].docomo_tweak_flag) {
						continue;
					}

					A_docomo_base[cnt].tweakcharge = +(H_docomo_newbase[A_docomo_base[cnt].telno] * this.H_TweakConf[H_telpost.cocd].docomo_tweak_base / 100 * -1);
					this.infoOut("電話番号（" + A_docomo_base[cnt].telno + "）の基本料割引額の調整を行います。\n");
					var num = await this.O_Model.updateTweakBaseDocomo(this.PactID, this.YYYYMM, A_docomo_base[cnt]);

					if (1 != num) {
						this.errorOut(1000, "電話番号（" + A_docomo_base[cnt].telno + "）の基本料割引額の調整に失敗しました。\n");
						update_cansel = true;
					}
				}

				A_docomo_base = undefined;
				H_docomo_newbase = [];
				var A_docomo_tax = await this.O_Model.tweakTaxDocomo(this.PactID, this.YYYYMM);
				var docomo_tax_coount = A_docomo_tax.length;
				var H_docomo_new_tax = await this.O_Model.tweakNewTaxDocomo(this.PactID, this.YYYYMM);
				var H_docomo_new_tax_ones = this.O_Model.tweakNewTaxOnesDocomo(this.PactID, this.YYYYMM);
				b_telno = "";

				for (cnt = docomo_tax_coount - 1; cnt >= 0; cnt--) //複数の消費税をまとめる
				{
					if (b_telno == A_docomo_tax[cnt].telno) {
						this.infoOut("電話番号（" + A_docomo_tax[cnt].telno + "）の二件目以降の消費税レコードを削除。\n", 0);
						this.O_Model.deleteTaxDocomo(this.PactID, this.YYYYMM, A_docomo_tax[cnt]);
						continue;
					}

					A_docomo_tax[cnt].tweakcharge = H_docomo_new_tax[A_docomo_tax[cnt].telno];

					if (true == (undefined !== H_docomo_new_tax_ones[A_docomo_tax[cnt].telno])) {
						A_docomo_tax[cnt].tweakcharge += H_docomo_new_tax_ones[A_docomo_tax[cnt].telno];
					}

					this.infoOut("電話番号（" + A_docomo_tax[cnt].telno + "）の割引額調整後の消費税を修正。\n");
					num = await this.O_Model.updateTaxDocomo(this.PactID, this.YYYYMM, A_docomo_tax[cnt]);

					if (1 != num) {
						this.errorOut(1000, "電話番号（" + A_docomo_tax[cnt].telno + "）の割引額調整後の消費税の修正に失敗しました。\n");
						update_cansel = true;
					}

					b_telno = A_docomo_tax[cnt].telno;
				}

				A_docomo_tax = undefined;
				docomo_tax_coount = undefined;
				H_docomo_new_tax = [];

				if (true == update_cansel) {
					this.infoOut("調整に失敗したレコードがありましたので、ドコモの割引額調整はキャンセルしました。\n");
					this.get_DB().rollback();
				} else {
					this.get_DB().commit();
					this.infoOut("ドコモの割引額の調整が完了しました。\n");
				}
			}

		docomo_tel_count = undefined;
		var A_au_tel_count = await this.O_Model.tweakDetailsTelno(this.PactID, this.YYYYMM, this.getSetting().get("car_au"));

		if (1 > A_au_tel_count.length) {
			this.infoOut("処理対象となるau請求情報がありませんでした。\n");
		} else //auの割引額調整を行う電話番号のみに絞り込む
			{
				b_telno = "";
				var A_au_tel_list = Array();

				for (cnt = 0; cnt < A_au_tel_count.length; cnt++) {
					if (b_telno == A_au_tel_count[cnt].telno) {
						continue;
					}

					H_telpost = this.O_Model.getCOCDofTel(this.PactID, A_au_tel_count[cnt].telno, this.getSetting().get("car_au"), this.YYYYMM);

					if (false == this.H_TweakConf[H_telpost.cocd].au_tweak_flag) {
						continue;
					}

					b_telno = A_au_tel_count[cnt].telno;
					A_au_tel_list.push(A_au_tel_count[cnt].telno);
				}

				b_telno = "";
				var au_tel_count = A_au_tel_list.length;

				if (1 > au_tel_count) {
					this.infoOut("処理対象となるau請求情報がありませんでした。\n");
				} else //トランザクション開始
					{
						this.infoOut("auの割引額調整処理を開始します。対象件数" + au_tel_count + "\n");
						this.get_DB().beginTransaction();
						update_cansel = false;
						var A_details_au = await this.O_Model.tweakDetailsAU(this.PactID, this.YYYYMM, A_au_tel_list);
						var tweak_au_details = 0;
						var tweak_flag = false;
						b_telno = "";
						H_telpost = Array();
						var parent_cnt:any;
						var skip_flag = true;

						for (cnt = 0; cnt < A_details_au.length; cnt++) //電話番号が変わったら
						{
							if (b_telno != A_details_au[cnt].telno) //所属部署設定の取得
								{
									b_telno = A_details_au[cnt].telno;
									H_telpost = this.O_Model.getCOCDofTel(this.PactID, A_details_au[cnt].telno, this.getSetting().get("car_au"), this.YYYYMM);
								}

							if (false == (undefined !== this.H_TweakConf[H_telpost.cocd])) {
								this.errorOut(1000, "電話番号（" + A_details_au[cnt].telno + "）が所属している部署の会社CDが設定されていません。\n");
								update_cansel = true;
							}

							if (0 == A_details_au[cnt].codetype) //割引調整対象親コード
								{
									if (true == (-1 !== this.getSetting().get("A_suo_au_datacodemaster").indexOf(A_details_au[cnt].code)) || true == (-1 !== this.getSetting().get("A_suo_au_tuwacodemaster").indexOf(A_details_au[cnt].code)) || A_details_au[cnt].code == this.getSetting().get("suo_au_basecodemaster")) {
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

									if (true == (-1 !== this.getSetting().get("A_suo_au_basecode").indexOf(A_details_au[cnt].code))) {
										if (true == tweak_flag) {
											this.infoOut("電話番号（" + A_details_au[cnt].telno + "）の二件目以降の割引額レコードを削除。\n", 0);
											num = this.O_Model.tweakDeleteRecode(this.PactID, this.YYYYMM, this.getSetting().get("car_au"), A_details_au[cnt]);

											if (1 != num) {
												this.errorOut(1000, "電話番号（" + A_details_au[cnt].telno + "）の割引額レコードの削除に失敗しました。\n");
												update_cansel = true;
											}

											continue;
										}

										A_details_au[cnt].tdcomment = "";
										A_details_au[cnt].codename = this.getSetting().get("suo_tweak_codename");
										A_details_au[cnt].tweakcharge = +(tweak_au_details * this.H_TweakConf[H_telpost.cocd].au_tweak_base / 100 * -1);
										this.infoOut("電話番号（" + A_details_au[cnt].telno + "）の基本料割引額の更新。\n");
										num = this.O_Model.updateTweakAU(this.PactID, this.YYYYMM, A_details_au[cnt]);

										if (1 != num) {
											this.errorOut(1000, "電話番号（" + A_details_au[cnt].telno + "）の割引額レコードの更新に失敗しました。\n");
											update_cansel = true;
										}

										A_details_au[parent_cnt].tweakcharge = tweak_au_details + A_details_au[cnt].tweakcharge;
										this.infoOut("電話番号（" + A_details_au[cnt].telno + "）の基本料の更新。\n");
										num = this.O_Model.updateTweakAU(this.PactID, this.YYYYMM, A_details_au[parent_cnt]);

										if (1 != num) {
											this.errorOut(1000, "電話番号（" + A_details_au[cnt].telno + "）の基本料の更新に失敗しました。\n");
											update_cansel = true;
										}

										tweak_flag = true;
									} else if (true == (-1 !== this.getSetting().get("A_suo_au_tuwacode").indexOf(A_details_au[cnt].code))) //if(true == $tweak_flag){
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
											A_details_au[cnt].codename = this.getSetting().get("suo_tweak_codename");
											A_details_au[cnt].tweakcharge = A_details_au[cnt].charge;
											this.infoOut("電話番号（" + A_details_au[cnt].telno + "）の通話料割引額、コード名称の更新。\n");
											num = this.O_Model.updateTweakAU(this.PactID, this.YYYYMM, A_details_au[cnt]);

											if (1 != num) {
												this.errorOut(1000, "電話番号（" + A_details_au[cnt].telno + "）の通話料割引額レコードの更新に失敗しました。\n");
												update_cansel = true;
											}

											tweak_flag = true;
										} else if (true == (-1 !== this.getSetting().get("A_suo_au_datacode").indexOf(A_details_au[cnt].code))) //if(true == $tweak_flag){
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
											A_details_au[cnt].codename = this.getSetting().get("suo_tweak_codename");
											A_details_au[cnt].tweakcharge = A_details_au[cnt].charge;
											this.infoOut("電話番号（" + A_details_au[cnt].telno + "）の通信料割引額の更新。\n");
											num = this.O_Model.updateTweakAU(this.PactID, this.YYYYMM, A_details_au[cnt]);

											if (1 != num) {
												this.errorOut(1000, "電話番号（" + A_details_au[cnt].telno + "）の通信料割引額レコードの更新に失敗しました。\n");
												update_cansel = true;
											}

											tweak_flag = true;
										} else {
										tweak_au_details += A_details_au[cnt].charge;
									}
								}
						}

						A_details_au = undefined;
						H_telpost = undefined;
						var A_au_tax = await this.O_Model.tweakTaxAU(this.PactID, this.YYYYMM, A_au_tel_list);
						this.infoOut(A_au_tax, 0);
						var au_tax_count = A_au_tax.length;
						var H_au_new_tax = await this.O_Model.tweakNewTaxAU(this.PactID, this.YYYYMM, A_au_tel_list);
						// this.infoOut(H_au_new_tax, 0); 
						b_telno = "";

						for (cnt = au_tax_count - 1; cnt >= 0; cnt--) //複数の消費税をまとめる
						{
							if (b_telno == A_au_tax[cnt].telno) {
								this.O_Model.deleteTaxAU(this.PactID, this.YYYYMM, A_au_tax[cnt]);
								continue;
							}

							A_au_tax[cnt].tweakcharge = H_au_new_tax[A_au_tax[cnt].telno];
							num = this.O_Model.updateTaxAU(this.PactID, this.YYYYMM, A_au_tax[cnt]);

							if (1 != num) {
								this.errorOut(1000, "電話番号（" + A_au_tax[cnt].telno + "）の割引額調整後の消費税の修正に失敗しました。\n");
								update_cansel = true;
							}

							b_telno = A_au_tax[cnt].telno;
						}

						A_au_tax = undefined;
						au_tax_count = undefined;
						H_au_new_tax = [];
						var A_au_total = await this.O_Model.tweakTotalAU(this.PactID, this.YYYYMM, A_au_tel_list);
						this.infoOut(A_au_total, 0);
						var au_total_count = A_au_total.length;
						var H_au_new_total = await this.O_Model.tweakNewTotalAU(this.PactID, this.YYYYMM, A_au_tel_list);
						this.infoOut(String(H_au_new_total), 0);
						num = "";

						for (cnt = 0; cnt < au_total_count; cnt++) {
							A_au_total[cnt].tweakcharge = H_au_new_total[A_au_total[cnt].telno];
							num = this.O_Model.updateTotalAU(this.PactID, this.YYYYMM, A_au_total[cnt]);

							if (1 != num) {
								this.errorOut(1000, "電話番号（" + A_au_total[cnt].telno + "）の割引額調整後の合計金額の修正に失敗しました。\n");
								update_cansel = true;
							}
						}

						if (true == update_cansel) {
							this.infoOut("調整に失敗したレコードがありましたので、auの割引額調整はキャンセルしました。\n");
							this.get_DB().rollback();
						} else {
							this.get_DB().commit();
							this.infoOut("auの割引額の調整が完了しました。\n");
						}
					}
			}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
	}
	
};
