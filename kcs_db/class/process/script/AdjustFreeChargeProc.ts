
import MtTableUtil from "../../MtTableUtil";
import PactModel from "../../model/PactModel";
import BillModel from "../../model/BillModel";
import PostModel from "../../model/PostModel";
import TelModel from "../../model/TelModel";
import FuncModel from "../../model/FuncModel";
import ProcessBaseBatch from "../ProcessBaseBatch";
import AdjustFreeChargeView from "../../view/script/AdjustFreeChargeView";
import AdjustFreeChargeModel from "../../model/script/AdjustFreeChargeModel";

//
//コンストラクタ
//
//@author maeda
//@since 2009/06/16
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author maeda
//@since 2009/06/16
//
//@param array $H_param
//@access protected
//@return void
//
//
//tel_details_X_tb 用のデータを配列へ格納
//
//@author maeda
//@since 2009/07/01
//
//@param mixed $A_buff
//@param mixed $pactid
//@param mixed $telno
//@param mixed $code
//@param mixed $charge
//@param mixed $detailno
//@param mixed $timestamp
//@param mixed $carid
//@param mixed $H_utiwake
//@access public
//@return void
//
//無料通話内の通話料の場合用
//通話料分の無料通話料明細を作成（内訳種別コード290,291で作成）
//消費税明細を作成（勘定科目：基本料、通話料、その他を考慮）（税区分：合算、個別、非対称を考慮）
//
//outputTelData
//
//@author maeda
//@since 2009/07/01
//
//@param mixed $A_buff
//@param mixed $H_detailno
//@param mixed $H_tuwaChargeTel
//@param mixed $H_utiwake
//@param mixed $H_gassanChargeTel
//@param mixed $H_kobetsuTaxChargeTel
//@param mixed $pactid
//@param mixed $carid
//@param mixed $telno
//@param mixed $timestamp
//@param mixed $aspFlg
//@param mixed $aspCharge
//@param mixed $asxCharge
//@access public
//@return void
//
//
//outputTelFusokuData
//
//@author maeda
//@since 2009/07/01
//
//@param mixed $A_buff
//@param mixed $H_detailno
//@param mixed $H_tuwaChargeTel
//@param mixed $H_utiwake
//@param mixed $H_gassanChargeTel
//@param mixed $H_kobetsuTaxChargeTel
//@param mixed $pactid
//@param mixed $carid
//@param mixed $telno
//@param mixed $timestamp
//@param mixed $aspFlg
//@param mixed $aspCharge
//@param mixed $asxCharge
//@param mixed $freeCharge
//@param mixed $H_kobetsuChargeTel
//@access public
//@return void
//
//
//スクリプト終了処理
//
//@author maeda
//@since 2009/06/19
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2009/06/16
//
//@access public
//@return void
//
export class AdjustFreeChargeProc extends ProcessBaseBatch {
	O_View: AdjustFreeChargeView;
	O_Model: AdjustFreeChargeModel;
	PactId: any;
	BillDate: any;
	Mode: any;
	PostLevel: any;
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.getSetting().loadConfig("AdjustFreeCharge");
		this.O_View = new AdjustFreeChargeView();
		this.O_Model = new AdjustFreeChargeModel(this.get_MtScriptAmbient());
	}

	async execute(H_param: {} | any[] = Array()) //処理開始
	//固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//対象テーブル番号を取得
	//PactModelインスタンス作成
	//会社マスターを作成
	//会社の登録が無い場合
	//会社全体の回線数を請求明細より取得（A）
	//請求が無い場合
	//会社全体の通話料金の合計を請求明細より取得（C)
	//通話料が無料通話料金と等しい場合は何もせずにプログラム終了 (B)==(C)
	//トランザクション開始
	//調整した請求明細を入れる前にtel_details_X_tb から無料通話料、消費税、ＡＳＰ利用料明細を削除する
	//請求データ取込み
	//取込失敗
	//ダミー電話番号を登録する必要がある場合
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		var rootPostidX: any;
		var tableNo: any;
		var A_outPutTelDetails = Array();
		
		this.infoOut(this.getSetting().get("SCRIPT_MSG") + "開始\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.Mode = this.O_View.get_HArgv("-m");
		this.PostLevel = this.O_View.get_HArgv("-l");
// 2022cvt_015
		tableNo = MtTableUtil.getTableNo(this.BillDate, false);
// 2022cvt_015
		var O_PactModel = new PactModel();
// 2022cvt_015
		var H_pactid = O_PactModel.getPactIdCompNameFromPact();

		if (false == (undefined !== H_pactid[this.PactId])) {
			this.infoOut("契約ＩＤ：" + this.PactId + " は pact_tb に登録されていない為、処理を終了します\n", 1);
			this.endScript();
		}

// 2022cvt_015
		var O_BillModel = new BillModel();
// 2022cvt_015
		var telCntAll = O_BillModel.getTelCnt(this.PactId, tableNo, this.getSetting().get("CARID"));

		if (0 == await telCntAll) {
			this.infoOut(H_pactid[this.PactId] + "(" + this.PactId + ") の" + this.BillDate + "分請求データが存在しない為、処理を終了します\n", 1);
			this.endScript();
		}

// 2022cvt_015
		var freeChargeAll = await O_BillModel.getSumCharge(this.PactId, tableNo, this.getSetting().get("CARID"), this.getSetting().get("A_FREE_CODE")) * -1;
// 2022cvt_015
		var sumChargeAll = O_BillModel.getSumCharge(this.PactId, tableNo, this.getSetting().get("CARID"), this.getSetting().get("A_TUWA_CODE"));

		if (freeChargeAll == await sumChargeAll) //無料通話料が通話料より多い場合は無料通話対象コードが抜けている可能性有りの為、プログラム終了
			{
				this.infoOut(H_pactid[this.PactId] + "(" + this.PactId + ") の" + this.BillDate + "分の通話料は無料通話料内の為、処理を終了します\n", 1);
				this.endScript();
			} else if (freeChargeAll > await sumChargeAll) //通話料が無料通話料を超えている場合 (B)<(C)
			{
				this.infoOut(H_pactid[this.PactId] + "(" + this.PactId + ") の" + this.BillDate + "分の無料通話料が通話料を超えている為、処理を終了します\n", 1);
				this.endScript();
			} else //ダミー電話番号を取得
			//ダミー電話が登録されていない場合
			//TelModelインスタンスを作成
			//請求月テーブルより電話番号マスターを取得する array(CARID => array(telno))
			//tel_X_tb にダミー番号がない場合
			//無料通話適用可能な通話料金を税区分（合算、個別、非課税）毎に取得する
			//勘定科目が基本料、その他、通話料（無料通話料適用外）で税区分が合算のものは合計金額を集計し、後で消費税計算に使用する
			//勘定科目が基本料、その他、通話料（無料通話料適用外）で税区分が個別のものは個別に計算した消費税の合計を保持する
			//無料通話適用可能な通話料の内、税区分が個別のもののみ取得する
			//請求データから電話の所属部署を取得する
			//部署レベルを指定モード（モード１）
			//部署毎の無料通話超過額
			//請求明細出力用配列
			//各電話に割り当てた無料通話料合計
			//計算しなおした消費税合計
			//ＡＳＰ利用料
			//ＡＳＰ利用料消費税
			//電話毎のdetailnoの最大値を取得する
			//内訳種別マスター情報を取得
			//ASP料金が true:発生する、false:発生しない
			//FuncModelインスタンスを作成
			//会社権限リストを取得
			//ASP料金が発生する場合
			//対象部署リストを１件ずつ処理する
			//END 対象部署リストを１件ずつ処理する
			//通話料が無料通話を超過している部署リスト取得
			//通話料が無料通話を超過している部署リストを１件ずつ処理する (E)<(F)
			//END 通話料が無料通話を超過している部署リストを１件ずつ処理する (E)<(F)
			//無料通話料調整
			{
// 2022cvt_015
				var H_dummy = await O_BillModel.getDummy(this.PactId, this.getSetting().get("CARID"), undefined, tableNo);

				if (0 == H_dummy.length) //ダミー電話が複数登録されている場合
					{
						this.infoOut(H_pactid[this.PactId] + "(" + this.PactId + ") のダミー電話番号が登録されていない為、処理を終了します\n", 1);
						this.endScript();
					} else if (1 < H_dummy.length) //ダミー電話が１件登録されている場合
					{
						this.infoOut(H_pactid[this.PactId] + "(" + this.PactId + ") のダミー電話番号が複数登録されている為、処理を終了します\n", 1);
						this.endScript();
					} else //ダミー電話番号の所属部署が指定されていないかpost_X_tbに存在しない場合
					{
						if ("" == H_dummy[0].postid) {
							this.infoOut(H_pactid[this.PactId] + "(" + this.PactId + ") のダミー電話番号の所属部署が不明な為、処理を終了します\n", 1);
							this.endScript();
						}
					}

// 2022cvt_015
				var O_TelModel = new TelModel();
// 2022cvt_015
				var H_telnoX = O_TelModel.getCaridTelno(this.PactId, tableNo, [this.getSetting().get("CARID")]);
// 2022cvt_015
				var now = this.get_DB().getNow();

				var A_outPutTelX: any;

				if (-1 !== H_telnoX[this.getSetting().get("CARID")].indexOf(H_dummy[0].telno) == false) {
// 2022cvt_015
					var H_data = {
						pactid: this.PactId,
						postid: H_dummy[0].postid,
						telno: H_dummy[0].telno,
						telno_view: H_dummy[0].telno,
						carid: this.getSetting().get("CARID"),
						arid: this.getSetting().get("ARID"),
						cirid: this.getSetting().get("CIRID"),
						recdate: now,
						fixdate: now
					};
					this.O_Model.setOutPut("tel_" + tableNo + "_tb", A_outPutTelX, H_data);
				}

// 2022cvt_015
				var taxChargeAll = O_BillModel.getSumCharge(this.PactId, tableNo, this.getSetting().get("CARID"), this.getSetting().get("A_TAX_CODE"));
// 2022cvt_015
				var H_tuwaChargeTel = this.O_Model.getSumChargeTaxType(this.PactId, tableNo, this.getSetting().get("CARID"), this.getSetting().get("A_TUWA_CODE"));
// 2022cvt_015
				var H_gassanChargeTel = this.O_Model.getTelSumChargeGassan(this.PactId, tableNo, this.getSetting().get("CARID"), this.getSetting().get("A_TUWA_CODE").concat(this.getSetting().get("A_FREE_CODE"), this.getSetting().get("A_TAX_CODE"), this.getSetting().get("A_ASP_CODE")));
// 2022cvt_015
				var H_kobetsuTaxChargeTel = this.O_Model.getTelTaxKobetsu(this.PactId, tableNo, this.getSetting().get("CARID"), this.getSetting().get("A_TUWA_CODE").concat(this.getSetting().get("A_FREE_CODE"), this.getSetting().get("A_TAX_CODE"), this.getSetting().get("A_ASP_CODE")));
// 2022cvt_015
				var H_kobetsuChargeTel = this.O_Model.getChargeKobetsu(this.PactId, tableNo, this.getSetting().get("CARID"), this.getSetting().get("A_TUWA_CODE"));
// 2022cvt_015
				var H_teldetails = O_BillModel.getPostidTelno(this.PactId, tableNo, this.getSetting().get("CARID"));

				if ("1" == this.Mode) //所属部署置換え部署ＩＤリスト用配列
					//PostModelインスタンスを作成
					//請求月用のルート部署を取得
					//指定部署階層が第２階層以下の場合
					//変換先部署ＩＤリストを取得する
					//変換先部署ＩＤリストを１件ずつ処理する
					//END 変換先部署ＩＤリストを１件ずつ処理する
					{
// 2022cvt_015
						var H_substiPostid = Array();
// 2022cvt_015
						var O_PostModel = new PostModel();
// 2022cvt_015
						rootPostidX = O_PostModel.getRootPostid(this.PactId, 0, tableNo);

						if (1 < this.PostLevel) //ルート部署所属となる部署ＩＤリストを取得
							//指定階層の部署ＩＤリストを取得
							//指定階層の部署ＩＤ毎に処理する
							//指定部署階層が第１階層の時は全てルート部署所属
							{
								H_substiPostid[rootPostidX] = O_PostModel.getUpperLevelPostidList(this.PactId, this.PostLevel - 1, tableNo);
// 2022cvt_015
								var A_levelPostid = O_PostModel.getLevelPostidList(this.PactId, this.PostLevel - 1, tableNo);

// 2022cvt_015
								for (var cnt = 0; cnt < (await A_levelPostid).length; cnt++) //指定階層の部署ＩＤ毎の所属となる部署ＩＤリストを取得
								{
									H_substiPostid[A_levelPostid[cnt]] = O_PostModel.getChildList(this.PactId, A_levelPostid[cnt], tableNo);
								}
							} else //ルート部署所属となる部署ＩＤリストを取得
							{
								H_substiPostid[rootPostidX] = O_PostModel.getChildList(this.PactId, await rootPostidX, tableNo);
							}

// 2022cvt_015
						var A_postidTo = Object.keys(H_substiPostid);

// 2022cvt_015
						for (var postidTo of (A_postidTo) as any) //変換先部署ＩＤが変わるたびに電話番号リスト初期化
						//変換元部署ＩＤリストを取得する
						//変換元部署ＩＤリストを１件ずつ処理する
						//END 変換元部署ＩＤリストを１件ずつ処理する
						//電話の所属部署を変換先部署へ置き換える
						{
// 2022cvt_015
							var A_telno = Array();
// 2022cvt_015
							var A_postidFrom = (H_substiPostid[postidTo]);

// 2022cvt_015
							for (var postidFrom of (A_postidFrom)) //変換元部署データがあった場合
							{
								if (true == (undefined !== H_teldetails[postidFrom])) //変換元部署の電話リストを退避
									//変換元部署データを削除
									{
										A_telno = A_telno.concat(A_telno, H_teldetails[postidFrom]);
										delete H_teldetails[postidFrom];
									}
							}

							H_teldetails[postidTo] = A_telno;
						}
					}

// 2022cvt_015
				var sumFreeChargePostAmari = 0;
// 2022cvt_015
				var H_adjustPostidFusoku = Array();
// 2022cvt_015
				A_outPutTelDetails = Array();
// 2022cvt_015
				var sumFreeCharge = { "value": 0 };
// 2022cvt_015
				var sumTaxCharge = { "value": 0 };
// 2022cvt_015
				var aspCharge: any;
// 2022cvt_015
				var asxCharge = 0;
// 2022cvt_015
				var H_detailno = O_BillModel.getMaxDetailnoList(this.PactId, tableNo, [this.getSetting().get("CARID")], this.getSetting().get("A_FREE_CODE").concat(this.getSetting().get("A_TAX_CODE"), this.getSetting().get("A_ASP_CODE")));
// 2022cvt_015
				var H_utiwake = O_BillModel.getUtiwake([this.getSetting().get("CARID")]);
// 2022cvt_015
				var aspFlg = false;
// 2022cvt_015
				var O_FuncModel = new FuncModel();
// 2022cvt_015
				var H_pactFunc = O_FuncModel.getPactFunc(this.PactId, undefined, false);

				if (-1 !== Object.keys(H_pactFunc).indexOf("fnc_asp") == true) //ＡＳＰ料金を取得
					{
						aspFlg = true;
						aspCharge = O_BillModel.getAspCharge(this.PactId, this.getSetting().get("CARID"));

						if (!aspCharge) {
							this.infoOut(H_pactid[this.PactId] + "(" + this.PactId + ") のＡＳＰ利用料が設定されていない為、処理を終了します\n", 1);
							this.endScript();
						}

						asxCharge = +(aspCharge * this.getSetting().get("TAX_RATE"));
					}

// 2022cvt_015
				var A_adjustPostid = Object.keys(H_teldetails);

// 2022cvt_015
				for (var adjustPostid of (A_adjustPostid) as any) //部署毎の回線数を取得(D)
				//部署に電話が存在している場合
				{
// 2022cvt_015
					var telCntPost = H_teldetails[adjustPostid].length;

					if (0 != telCntPost) //部署毎の無料通話料を取得(E)=8000×(D)
						//部署毎の無料通話適用対象コードの通話料金合計を取得(F)
						//(E)>=(F) 無料通話>=通話料
						{
// 2022cvt_015
							var freeChargePost = this.getSetting().get("FREE_CHARGE") * telCntPost;
// 2022cvt_015
							var sumChargePost = O_BillModel.getSumCharge(this.PactId, tableNo, this.getSetting().get("CARID"), this.getSetting().get("A_TUWA_CODE"), H_teldetails[adjustPostid]);

							if (freeChargePost >= await sumChargePost) //電話番号を１件ずつ処理
								//END 電話番号を１件ずつ処理
								//(E)>(F) 無料通話余りあり
								{
// 2022cvt_015
									for (var telno of (H_teldetails[adjustPostid])) //明細を出力
									{
										this.outputTelData(A_outPutTelDetails, H_detailno, H_tuwaChargeTel, H_utiwake, H_gassanChargeTel, H_kobetsuTaxChargeTel, this.PactId, this.getSetting().get("CARID"), telno, now, aspFlg, aspCharge, asxCharge, sumFreeCharge, sumTaxCharge);
									}

									if (freeChargePost > await sumChargePost) //無料通話の余りを余り用変数へ追加(部署用） (G)
										{
											sumFreeChargePostAmari += freeChargePost - await sumChargePost;
										}
								} else //部署毎に無料通話を幾ら超過しているか (H)
								{
									H_adjustPostidFusoku[adjustPostid] = await sumChargePost - freeChargePost;
								}
						}
				}

// 2022cvt_015
				var A_adjustPostidFusoku = Object.keys(H_adjustPostidFusoku);

// 2022cvt_015
                //for (var adjustPostidFusoku of Object.values(A_adjustPostidFusoku)) //無料通話余り（部署用）がある (G) > 0
				for (var adjustPostidFusoku of (A_adjustPostidFusoku) as any) //無料通話余り（部署用）がある (G) > 0
				{
					if (sumFreeChargePostAmari > 0) //部署毎の超過率 (N) = (H) / (sumH)
						//部署毎に割り振る無料通話の余りを算出(O) = (G)×(N) 小数点以下切捨て
						//電話の無料通話料余り合計
						//電話毎の無料通話超過額
						//通話料が無料通話を超過している部署以下の回線数分のループ処理
						//END 通話料が無料通話を超過している部署以下の回線数分のループ処理
						//部署に割り振られた無料通話の余り(O)と部署内の電話の無料通話の余り合計(K)とを加算する (R)=(O)+(K)
						//無料通話余りは必ず有る（(K)==0でも(O)が必ずある）ので余りが無い場合は考えなくてよい
						//通話料が無料通話を超過している電話リスト取得
						//通話料が無料通話を超過している電話リストを１件ずつ処理する 8000<(J)
						//END 8000<(J) 通話料が無料通話を超過している電話数分のループ処理
						//無料通話余りが無い(全部署で無料通話オーバー) (G)<= 0
						{
// 2022cvt_015
							var freeChargePostAmari = Math.floor(H_adjustPostidFusoku[adjustPostidFusoku] / H_adjustPostidFusoku.reduce((accumulator, currentValue) => {
								return accumulator + currentValue;
							}) * sumFreeChargePostAmari);
// 2022cvt_015
							var sumFreeChargeTelAmari = 0;
// 2022cvt_015
							var H_adjustTelFusoku = Array();

// 2022cvt_015
							for (var telno of (H_teldetails[adjustPostidFusoku])) //8000>=(J) 無料通話>=通話料
							{
								if (undefined !== H_tuwaChargeTel[telno] == true) //電話毎の無料通話適用対象コードの通話料合計を取得(J)
									{
// 2022cvt_015
										var sumChargeTel = H_tuwaChargeTel[telno].reduce((accumulator:any, currentValue: any) => {
											return accumulator + currentValue;
										});
									} else {
									sumChargeTel = 0;
								}

								if (this.getSetting().get("FREE_CHARGE") >= sumChargeTel) //明細を出力
									//無料通話の余りを余り用変数へ追加(電話用）(K)
									{
										this.outputTelData(A_outPutTelDetails, H_detailno, H_tuwaChargeTel, H_utiwake, H_gassanChargeTel, H_kobetsuTaxChargeTel, this.PactId, this.getSetting().get("CARID"), telno, now, aspFlg, aspCharge, asxCharge, sumFreeCharge, sumTaxCharge);

										if (this.getSetting().get("FREE_CHARGE") > sumChargeTel) {
											sumFreeChargeTelAmari += this.getSetting().get("FREE_CHARGE") - sumChargeTel;
										}
									} else //電話毎に無料通話を幾ら超過しているか (L)
									{
										H_adjustTelFusoku[telno] = sumChargeTel - this.getSetting().get("FREE_CHARGE");
									}
							}

// 2022cvt_015
							var A_adjustTelFusoku = Object.keys(H_adjustTelFusoku);

// 2022cvt_015
                            //for (var adjustTelFusoku of Object.values(A_adjustTelFusoku)) //電話毎の超過率 (P) = (L) / (sumL)
							for (var adjustTelFusoku of (A_adjustTelFusoku) as any) //電話毎の超過率 (P) = (L) / (sumL)
							//電話毎に割り振る無料通話の余りを算出 (Q) = (R)×(P)  小数点以下切捨て
							//割り振られた通話料(Q)分の無料通話料明細を作成（内訳種別コード290,291で作成）
							//消費税明細を作成（勘定科目：基本料、通話料、その他を考慮）（税区分：合算、個別、非対称を考慮）
							//明細を出力
							{
// 2022cvt_015
								var freeChargeTelAmari = Math.floor(H_adjustTelFusoku[adjustTelFusoku] / H_adjustTelFusoku.reduce((accumulator, currentValue) => {
									return accumulator + currentValue;
								}) * (sumFreeChargeTelAmari + freeChargePostAmari)) + this.getSetting().get("FREE_CHARGE");
								this.outputTelFusokuData(A_outPutTelDetails, H_detailno, H_tuwaChargeTel, H_utiwake, H_gassanChargeTel, H_kobetsuTaxChargeTel, this.PactId, this.getSetting().get("CARID"), adjustTelFusoku, now, aspFlg, aspCharge, asxCharge, freeChargeTelAmari, H_kobetsuChargeTel, sumFreeCharge, sumTaxCharge);
							}
						} else //電話の無料通話料余り合計
						//電話毎の無料通話超過額
						//通話料が無料通話を超過している部署以下の回線数分のループ処理
						//END 通話料が無料通話を超過している部署以下の回線数分のループ処理
						//部署に割り振られた無料通話の余り(O==0)と部署内の電話の無料通話の余り合計(K)とを加算する (R)=(O)+(K)
						//無料通話余りは有るかどうかは不明（(K)==不明、(O)==0）
						//通話料が無料通話を超過している電話リスト取得
						//通話料が無料通話を超過している電話リストを１件ずつ処理する 8000<(J)
						//END 通話料が無料通話を超過している電話リストを１件ずつ処理する 8000<(J)
						{
							sumFreeChargeTelAmari = 0;
							H_adjustTelFusoku = Array();

// 2022cvt_015
							for (var telno of (H_teldetails[adjustPostidFusoku])) //電話毎の無料通話適用対象コードの通話料合計を取得(J)
							//無料通話対象内訳種別が無い場合にNoticeがでていたのを修正 2012/04/16 s.maeda
							//8000>=(J) 無料通話>=通話料
							{
								if (undefined !== H_tuwaChargeTel[telno] == true) {
									sumChargeTel = H_tuwaChargeTel[telno].reduce((accumulator:any, currentValue: any)=> {
										return accumulator + currentValue;
									});
								} else {
									sumChargeTel = 0;
								}

								if (this.getSetting().get("FREE_CHARGE") >= sumChargeTel) //明細を出力
									//無料通話の余りを余り用変数へ追加(電話用）(K)
									{
										this.outputTelData(A_outPutTelDetails, H_detailno, H_tuwaChargeTel, H_utiwake, H_gassanChargeTel, H_kobetsuTaxChargeTel, this.PactId, this.getSetting().get("CARID"), telno, now, aspFlg, aspCharge, asxCharge, sumFreeCharge, sumTaxCharge);

										if (this.getSetting().get("FREE_CHARGE") > sumChargeTel) {
											sumFreeChargeTelAmari += this.getSetting().get("FREE_CHARGE") - sumChargeTel;
										}
									} else //電話毎に無料通話を幾ら超過しているか (L)
									{
										H_adjustTelFusoku[telno] = sumChargeTel - this.getSetting().get("FREE_CHARGE");
									}
							}

							A_adjustTelFusoku = Object.keys(H_adjustTelFusoku);

// 2022cvt_015
							for (var adjustTelFusoku of (A_adjustTelFusoku) as any) //(R)>0 無料通話の余りが有る
							{
								if (0 < sumFreeChargeTelAmari) //電話毎の超過率 (P) = (L) / (sumL)
									//電話毎に割り振る無料通話の余りを算出 (Q) = (R)×(P) 小数点以下切捨て
									//割り振られた通話料(Q)分の無料通話料明細を作成（内訳種別コード290,291で作成）
									//消費税明細を作成（勘定科目：基本料、通話料、その他を考慮）（税区分：合算、個別、非対称を考慮）
									//明細を出力
									{
										freeChargeTelAmari = Math.floor(H_adjustTelFusoku[adjustTelFusoku] / H_adjustTelFusoku.reduce((accumulator, currentValue) => {
											return accumulator + currentValue;
										}) * sumFreeChargeTelAmari) + this.getSetting().get("FREE_CHARGE");
										this.outputTelFusokuData(A_outPutTelDetails, H_detailno, H_tuwaChargeTel, H_utiwake, H_gassanChargeTel, H_kobetsuTaxChargeTel, this.PactId, this.getSetting().get("CARID"), adjustTelFusoku, now, aspFlg, aspCharge, asxCharge, freeChargeTelAmari, H_kobetsuChargeTel, sumFreeCharge, sumTaxCharge);
									} else //(R)<=0 無料通話の余りが無い
									//消費税明細を作成（勘定科目：基本料、通話料、その他を考慮）（税区分：合算、個別、非対称を考慮）
									//8000円分の無料通話料明細を作成（内訳種別コード290,291で作成）
									//明細を出力
									{
										this.outputTelFusokuData(A_outPutTelDetails, H_detailno, H_tuwaChargeTel, H_utiwake, H_gassanChargeTel, H_kobetsuTaxChargeTel, this.PactId, this.getSetting().get("CARID"), adjustTelFusoku, now, aspFlg, aspCharge, asxCharge, this.getSetting().get("FREE_CHARGE"), H_kobetsuChargeTel, sumFreeCharge, sumTaxCharge);
									}
							}
						}
				}

				if (0 != freeChargeAll - sumFreeCharge.value) //無料通話料調整額を出力
					{
						this.teldetailsBuff(A_outPutTelDetails, this.PactId, H_dummy[0].telno, this.getSetting().get("FREE_CODE_HIKAZEI"), (freeChargeAll - sumFreeCharge.value) * -1, 0, now, this.getSetting().get("CARID"), H_utiwake);
					}

				if (0 != await taxChargeAll - sumTaxCharge.value) //消費税調整額を出力
					{
						this.teldetailsBuff(A_outPutTelDetails, this.PactId, H_dummy[0].telno, this.getSetting().get("TAX_CODE"), await taxChargeAll - sumTaxCharge.value, 1, now, this.getSetting().get("CARID"), H_utiwake);
					}
			}

		this.get_DB().beginTransaction();
		O_BillModel.delTelDetailsData([this.PactId], tableNo, [this.getSetting().get("CARID")], this.getSetting().get("A_FREE_CODE").concat((this.getSetting().get("A_TAX_CODE"), this.getSetting().get("A_ASP_CODE"))));
// 2022cvt_015
		var rtn = this.get_DB().pgCopyFromArray("tel_details_" + tableNo + "_tb", A_outPutTelDetails);

		if (await rtn == false) {
			this.get_DB().rollback();
			this.errorOut(1000, "\ntel_details_" + tableNo + "_tb へのデータ取込に失敗しました\n", 0, "", "");
			throw process.exit(-1);// 2022cvt_009
		} else {
			this.infoOut("tel_details_" + tableNo + "_tb へデーターインポート完了\n", 1);
		}

		if (undefined !== A_outPutTelX == true) //ダミー電話取込み
			//取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray("tel_" + tableNo + "_tb", A_outPutTelX);

				if (await rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\ntel_" + tableNo + "_tb のダミー電話番号取込に失敗しました\n", 0, "", "");
					throw process.exit(-1);// 2022cvt_009
				} else {
					this.infoOut("tel_" + tableNo + "_tb のダミー電話番号取込完了\n", 1);
				}
			}

		this.get_DB().commit();
		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut(this.getSetting().get("SCRIPT_MSG") + "終了\n", 1);
	}

	teldetailsBuff(A_buff:any, pactid: any, telno: any, code: any, charge: any, detailno: any, timestamp: any, carid: any, H_utiwake: any) //出力
	{
		A_buff.push({
			pactid: pactid,
			telno: telno,
			code: code,
			codename: H_utiwake[carid][code].name,
			charge: charge,
// 2022cvt_016
			taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[carid][code].taxtype],
			detailno: detailno,
			recdate: timestamp,
			carid: carid,
			tdcomment: undefined,
			prtelno: undefined,
			realcnt: undefined
		});
	}

	outputTelData(A_buff: any, H_detailno: any, H_tuwaChargeTel:any, H_utiwake: any, H_gassanChargeTel:any, H_kobetsuTaxChargeTel: any, pactid: any, carid: any, telno:any, timestamp: any, aspFlg: any, aspCharge:any, asxCharge: any, sumFreeCharge:{ [key: string]: number }, sumTaxCharge:{ [key: string]: number }) //税区分が合算の通話料合計金額がある場合
	//計算しなおした消費税合計へ加算
	//ASP利用料が発生している場合
	{
// 2022cvt_015
		var tuwaGassan = 0;
// 2022cvt_015
		var tuwaKobetsu = 0;
// 2022cvt_015
		var tuwaHikazei = 0;
// 2022cvt_015
		var tax = 0;

		if (!(undefined !== H_detailno[carid][telno])) {
			return;
		}

// 2022cvt_015
		var detailno = H_detailno[carid][telno] + 1;

		if (undefined !== H_tuwaChargeTel[telno][this.getSetting().get("TAX_GASSAN")] == true) //通話料（税区分：合算）
			{
				tuwaGassan = H_tuwaChargeTel[telno][this.getSetting().get("TAX_GASSAN")];
			}

		if (undefined !== H_tuwaChargeTel[telno][this.getSetting().get("TAX_KOBETSU")] == true) //通話料（税区分：個別）
			{
				tuwaKobetsu = H_tuwaChargeTel[telno][this.getSetting().get("TAX_KOBETSU")];
			}

		if (undefined !== H_tuwaChargeTel[telno][this.getSetting().get("TAX_HIKAZEI")] == true) //通話料（税区分：非課税）
			{
				tuwaHikazei = H_tuwaChargeTel[telno][this.getSetting().get("TAX_HIKAZEI")];
			}

		if (tuwaGassan + tuwaKobetsu != 0) //課税分の無料通話料を出力
			//各電話に割り当てた無料通話料合計へ加算
			{
				this.teldetailsBuff(A_buff, pactid, telno, this.getSetting().get("FREE_CODE_KAZEI"), (tuwaGassan + tuwaKobetsu) * -1, detailno, timestamp, carid, H_utiwake);
				detailno++;
				sumFreeCharge.value += tuwaGassan + tuwaKobetsu;
			}

		if (tuwaHikazei != 0) //非課税分の無料通話料を出力
			//各電話に割り当てた無料通話料合計へ加算
			{
				this.teldetailsBuff(A_buff, pactid, telno, this.getSetting().get("FREE_CODE_HIKAZEI"), tuwaHikazei * -1, detailno, timestamp, carid, H_utiwake);
				detailno++;
				sumFreeCharge.value += tuwaHikazei;
			}

		if (undefined !== H_gassanChargeTel[telno] == true) {
			tax = Math.floor(H_gassanChargeTel[telno] * this.getSetting().get("TAX_RATE"));
		}

		if (undefined !== H_kobetsuTaxChargeTel[telno] == true) {
			tax += H_kobetsuTaxChargeTel[telno];
		}

		this.teldetailsBuff(A_buff, pactid, telno, this.getSetting().get("TAX_CODE"), tax, detailno, timestamp, carid, H_utiwake);
		sumTaxCharge.value += tax;

		if (true == aspFlg) //ASP利用料明細出力
			//ASX明細出力
			{
				detailno += 2;
				this.teldetailsBuff(A_buff, pactid, telno, this.getSetting().get("ASP_CODE"), aspCharge, detailno, timestamp, carid, H_utiwake);
				detailno++;
				this.teldetailsBuff(A_buff, pactid, telno, this.getSetting().get("ASX_CODE"), asxCharge, detailno, timestamp, carid, H_utiwake);
			}
	}

	outputTelFusokuData(A_buff: any, H_detailno: any, H_tuwaChargeTel: any, H_utiwake: any, H_gassanChargeTel: any, H_kobetsuTaxChargeTel: any, pactid: any, carid: any, telno: any, timestamp: any, aspFlg: any, aspCharge: any, asxCharge: any, freeCharge: any, H_kobetsuChargeTel: any, sumFreeCharge:{ [key: string]: number }, sumTaxCharge:{ [key: string]: number }) //無料通話料(課税用)
	//無料通話料(非課税用)
	//個別用消費税計
	//detailnoを取得
	//税区分が合算の通話料合計金額がある場合
	//無料通話料の余りを計算する
	//個別金額リストを取得する
	//課税分の無料通話料を出力
	//各電話に割り当てた無料通話料合計へ加算
	//非課税分の無料通話料の割り当てがあった場合
	//if(0 != $freeHikazei){
	//消費税を加算（個別分）
	{
// 2022cvt_015
		var tuwaGassan = 0;
// 2022cvt_015
		var tuwaGassanNew = 0;
// 2022cvt_015
		var tuwaKobetsu = 0;
// 2022cvt_015
		var tuwaKobetsuNew = 0;
// 2022cvt_015
		var tuwaHikazei = 0;
// 2022cvt_015
		var tax = 0;
// 2022cvt_015
		var freeKazei = 0;
// 2022cvt_015
		var freeHikazei = 0;
// 2022cvt_015
		var sumTaxKobetsu = 0;
// 2022cvt_015
		var detailno = H_detailno[carid][telno] + 1;

		if (undefined !== H_tuwaChargeTel[telno][this.getSetting().get("TAX_GASSAN")] == true) //通話料（税区分：合算）
			{
				tuwaGassan = H_tuwaChargeTel[telno][this.getSetting().get("TAX_GASSAN")];
			}

		if (undefined !== H_tuwaChargeTel[telno][this.getSetting().get("TAX_KOBETSU")] == true) //通話料（税区分：個別）
			{
				tuwaKobetsu = H_tuwaChargeTel[telno][this.getSetting().get("TAX_KOBETSU")];
			}

		if (undefined !== H_tuwaChargeTel[telno][this.getSetting().get("TAX_HIKAZEI")] == true) //通話料（税区分：非課税）
			{
				tuwaHikazei = H_tuwaChargeTel[telno][this.getSetting().get("TAX_HIKAZEI")];
			}

		if (freeCharge >= tuwaGassan) //無料通話料(課税用)に合算金額を足す
			//合算分を０円にする
			//合算分全てに無料通話を適用できかった場合
			{
				freeKazei = tuwaGassan;
				tuwaGassanNew = 0;
			} else //無料通話料(課税用)に無料通話料を足す
			//合算分から無料通話料を減算する
			{
				freeKazei = freeCharge;
				tuwaGassanNew = tuwaGassan - freeCharge;
			}

		freeCharge -= tuwaGassan;

		if (undefined !== H_kobetsuChargeTel[telno] == true) //個別金額リストを１件ずつ処理する
			{
// 2022cvt_015
				var A_kobetsu = (H_kobetsuChargeTel[telno]);

// 2022cvt_015
				for (var kobetsu of (A_kobetsu)) //まだ無料通話料があまっていたら個別分に割り当てる
				{
					if (0 < freeCharge) //個別分は全て無料通話適用できる場合
						//無料通話料の余りを計算する
						//無料通話料があまっていない場合
						{
							if (freeCharge >= kobetsu) //無料通話料(課税用)に個別分を足す
								//個別分全てに無料通話を適用できかった場合
								{
									freeKazei += kobetsu;
								} else //無料通話料(課税用)に無料通話料を足す
								//個別分から無料通話料を減算する
								//消費税計算をする
								{
									freeKazei += freeCharge;
// 2022cvt_015
									var kobetsuNew = kobetsu - freeCharge;
									sumTaxKobetsu += Math.floor(kobetsuNew * this.getSetting().get("TAX_RATE"));
								}

							freeCharge -= kobetsu;
						} else //消費税計算をする
						{
							sumTaxKobetsu += Math.floor(kobetsu * this.getSetting().get("TAX_RATE"));
						}
				}
			}

		if (freeCharge >= tuwaHikazei) //無料通話料(非課税用)に非課税金額を足す
			//非課税分全てに無料通話を適用できかった場合
			{
				freeHikazei = tuwaHikazei;
			} else //無料通話料(非課税用)に無料通話料を足す
			{
				freeHikazei = freeCharge;
			}

		this.teldetailsBuff(A_buff, pactid, telno, this.getSetting().get("FREE_CODE_KAZEI"), freeKazei * -1, detailno, timestamp, carid, H_utiwake);
		sumFreeCharge.value += freeKazei;

		if (0 < freeHikazei) //非課税分の無料通話料を出力
			//各電話に割り当てた無料通話料合計へ加算
			{
				detailno++;
				this.teldetailsBuff(A_buff, pactid, telno, this.getSetting().get("FREE_CODE_HIKAZEI"), freeHikazei * -1, detailno, timestamp, carid, H_utiwake);
				sumFreeCharge.value += freeHikazei;
			}

		if (undefined !== H_gassanChargeTel[telno] == true) {
			tax = Math.floor((tuwaGassanNew + H_gassanChargeTel[telno]) * this.getSetting().get("TAX_RATE"));
		} else {
			tax = Math.floor(tuwaGassanNew * this.getSetting().get("TAX_RATE"));
		}

		tax += sumTaxKobetsu;

		if (undefined !== H_kobetsuTaxChargeTel[telno] == true) {
			tax += H_kobetsuTaxChargeTel[telno];
		}

		if (0 != tax) //消費税明細出力
			//計算しなおした消費税合計へ加算
			{
				detailno++;
				this.teldetailsBuff(A_buff, pactid, telno, this.getSetting().get("TAX_CODE"), tax, detailno, timestamp, carid, H_utiwake);
				sumTaxCharge.value += tax;
			}

		if (true == aspFlg) //ASP利用料明細出力
			//ASX明細出力
			{
				detailno += 2;
				this.teldetailsBuff(A_buff, pactid, telno, this.getSetting().get("ASP_CODE"), aspCharge, detailno, timestamp, carid, H_utiwake);
				detailno++;
				this.teldetailsBuff(A_buff, pactid, telno, this.getSetting().get("ASX_CODE"), asxCharge, detailno, timestamp, carid, H_utiwake);
			}
	}

	endScript() //スクリプトの二重起動防止ロック解除
	//終了
	{
		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut(this.getSetting().get("SCRIPT_MSG") + "終了\n", 1);
		throw process.exit(0);// 2022cvt_009
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
