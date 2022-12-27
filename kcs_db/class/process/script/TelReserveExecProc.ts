//電話予約処理 （Process）
//更新履歴：<br>
//2008/09/08 宝子山 作成
// require("model/ExtensionTelModel.php");
import MtTableUtil from '../../MtTableUtil';
import MtAuthority from '../../MtAuthority';
import UserModel from '../../model/UserModel';
import PostModel from '../../model/PostModel';
import ExtensionTelModel from '../../model/ExtensionTelModel';
import ProcessBaseBatch from '..//ProcessBaseBatch';
import TelReserveExecView from '../../view/script/TelReserveExecView';
import TelReserveExecModel from '../../model/script/TelReserveExecModel';
export default class TelReserveExecProc extends ProcessBaseBatch {
	static ADDMODE = 0;
	static MODMODE = 1;
	static MOVEMODE = 2;
	static DELMODE = 3;
	O_extension! : ExtensionTelModel;

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	{
		super(H_param);
	}

	async doExecute(H_param: {} | any[] = Array()) //Viewの生成
	{
		var O_view = new TelReserveExecView();
		var O_model = new TelReserveExecModel(this.get_MtScriptAmbient());
		var O_post = new PostModel();
		var O_user = new UserModel();
		this.infoOut("電話予約実行開始", 1);
		this.set_Dirs(O_view.get_ScriptName());
		this.lockProcess(O_view.get_ScriptName());
		var A_reserve = await O_model.getTelReserveListUnExec();
		this.infoOut(A_reserve.length + "件の未実行予約が見つかりました\n", 1);
		O_model.beginWrapper();

		for (var cnt = 0; cnt < A_reserve.length; cnt++) //名前が長いので
		//部署、ユーザIDが無ければログ書いて次へ
		{
			var H_tel = A_reserve[cnt];

			if (await O_post.checkPostExist(H_tel.postid) == false || undefined !== H_tel.userid && !O_user.checkUserExist(H_tel.userid)) //ログ書き出し
				{
					O_model.updateTelReserveExec(H_tel.pactid, H_tel.telno, H_tel.carid, H_tel.reserve_date, H_tel.add_edit_flg);
					O_model.doPostNotExistLogSQL(H_tel);
					O_model.doPostNotExistLogSQLV2(H_tel);
					this.infoOut("[" + H_tel.pactid + ":" + H_tel.telno + ":" + H_tel.carid + "]登録部署又は請求閲覧者が無いので処理不可\n", 1);
					continue;
				}

			if (TelReserveExecProc.DELMODE == H_tel.add_edit_flg) //更新対象の電話があるか調べる
				{
					if (true == H_tel.order_flg) //ログ書き出し
						{
							this.infoOut("[" + H_tel.pactid + ":" + H_tel.telno + ":" + H_tel.carid + "]]の解約処理に伴う削除\n", 1);
						} else //ログ書き出し
						{
							this.infoOut("[" + H_tel.pactid + ":" + H_tel.telno + ":" + H_tel.carid + "]の削除予約処理\n", 1);
						}

					if (await O_model.checkTelExist(H_tel.pactid, H_tel.telno, H_tel.carid) == true) //ログ書き出し
						//delteldate更新
						//tel_tb更新
						//内線番号削除
						//端末も削除ならば紐付き取得
						{
							this.infoOut("\t通常削除\n", 1);
							O_model.doUpdateDelteldate(H_tel);
							O_model.doTelDelSQL(H_tel);

							if (H_tel.extensionno != "") {
								var O_extension = this.getExtensionTelModel();
								O_extension.disactivateExtensionNo(H_tel.pactid, H_tel.extensionno);
							}

							O_model.updateTelReserveExec(H_tel.pactid, H_tel.telno, H_tel.carid, H_tel.reserve_date, H_tel.add_edit_flg);

// 2022cvt_016
							if (1 == H_tel.delete_type) //あれば削除
								{
									var A_relass = await O_model.getTelRelAssetsList(H_tel.pactid, H_tel.telno, H_tel.carid);

									if (A_relass.length > 0) {
										for (var rcnt = 0; rcnt < A_relass.length; rcnt++) //名前が長いので
										//この端末を使用している紐付き一覧取得
										//あれば削除
										//あれば削除
										{
											var H_tra = A_relass[rcnt];
											var A_allrelass = await O_model.getTelRelAssetsListFromAssetsID(H_tra.pactid, H_tra.assetsid);

											if (A_allrelass.length > 0) {
												for (var acnt = 0; acnt < A_allrelass.length; acnt++) //名前が長いので
												//ログ書き出し
												//あれば削除
												{
													var H_atra = A_allrelass[acnt];
													this.infoOut("\t[" + H_atra.assetsid + "]端末紐付き削除\n", 1);
													O_model.doTelRelAssetsDelSQL(H_atra.pactid, H_atra.telno, H_atra.carid, H_atra.assetsid);
												}
											}

											var A_assets = await O_model.getAssetsList(H_tra.pactid, H_tra.assetsid);

											if (A_assets.length > 0) {
												for (acnt = 0; acnt < A_assets.length; acnt++) //名前が長いので
												//ログ書き出し
												//端末削除
												{
													var H_ass = A_assets[acnt];
													this.infoOut("\t[" + H_ass.assetsid + "]端末削除\n", 1);
													O_model.doAssetsDelSQL(H_tel.pactid, H_ass.assetsid);
												}
											}
										}
									}
								}

							if (true == H_tel.order_flg) {
								O_model.doTelDissolutionLogSQL(H_tel);
							} else {
								O_model.doTelDelLogSQL(H_tel);
								O_model.doTelDelLogSQLV2(H_tel);
							}
						} else //ログ書き出し
						//tel_reserve_tb更新
						{
							this.infoOut("\t対象無し\n", 1);
							O_model.updateTelReserveExec(H_tel.pactid, H_tel.telno, H_tel.carid, H_tel.reserve_date, H_tel.add_edit_flg, 2);
							continue;
						}
				} else if (TelReserveExecProc.MOVEMODE == H_tel.add_edit_flg) //ログ書き出し
				//更新対象の電話があるか調べる
				{
					this.infoOut("[" + H_tel.pactid + ":" + H_tel.telno + ":" + H_tel.carid + "]の移動予約処理\n", 1);

					if (await O_model.checkTelExist(H_tel.pactid, H_tel.telno, H_tel.carid) == true) //ログ書き出し
						//tel_tb更新
						//change_post_tb更新
						//tel_reserve_tb更新
						//資産管理していない会社ならば端末も移動 20090408houshi
						{
							this.infoOut("\t通常移動\n", 1);
							O_model.doTelMoveSQL(H_tel);
							O_model.doInsertChangePost(H_tel, "MT");
							O_model.updateTelReserveExec(H_tel.pactid, H_tel.telno, H_tel.carid, H_tel.reserve_date, H_tel.add_edit_flg);
							var O_auth:any = MtAuthority.singleton(H_tel.pactid);
							
							if (false == O_auth.chkPactFuncIni("fnc_assets_manage_adm_co")) //あれば移動
								{
									A_relass = O_model.getTelRelAssetsList(H_tel.pactid, H_tel.telno, H_tel.carid);

									if (A_relass.length > 0) {
										for (rcnt = 0; rcnt < A_relass.length; rcnt++) //名前が長いので
										{
											H_tra = A_relass[rcnt];
											O_model.doAssetsMoveSQL(H_tel, H_tra.assetsid);
										}
									}
								}

							O_model.doTelMoveLogSQL(H_tel);
							O_model.doTelMoveLogSQLV2(H_tel);
						} else //ログ書き出し
						//tel_reserve_tb更新
						{
							this.infoOut("\t対象無し\n", 1);
							O_model.updateTelReserveExec(H_tel.pactid, H_tel.telno, H_tel.carid, H_tel.reserve_date, H_tel.add_edit_flg, 2);
							continue;
						}
				} else if (TelReserveExecProc.MODMODE == H_tel.add_edit_flg) //ログ書き出し
				//更新対象の電話があるか調べる
				//端末予約があるか？紐付き予約取得
				//あれば登録
				//あれば登録
				{
					this.infoOut("[" + H_tel.pactid + ":" + H_tel.telno + ":" + H_tel.carid + "]の変更予約処理\n", 1);

					if (await O_model.checkTelExist(H_tel.pactid, H_tel.telno, H_tel.carid) == true) //ログ書き出し
						//tel_reserve_tb更新
						//管理記録
						{
							this.infoOut("\t通常変更\n", 1);
							O_extension = this.getExtensionTelModel();
							var extensionno = O_extension.getUseExtensionNo(H_tel.pactid, H_tel.telno, H_tel.carid);

							if (!!extensionno && extensionno != H_tel.extensionno) {
								O_extension.disactivateExtensionNo(H_tel.pactid, extensionno);
							}

							O_model.doTelModSQL(H_tel);
							O_model.updateTelReserveExec(H_tel.pactid, H_tel.telno, H_tel.carid, H_tel.reserve_date, H_tel.add_edit_flg);
							O_model.doTelModLogSQL(H_tel);
							O_model.doTelModLogSQLV2(H_tel);
						} else //ログ書き出し
						//tel_reserve_tb更新
						{
							this.infoOut("\t対象無し\n", 1);
							O_model.updateTelReserveExec(H_tel.pactid, H_tel.telno, H_tel.carid, H_tel.reserve_date, H_tel.add_edit_flg, 2);
							continue;
						}

					A_relass = O_model.getTelRelAssetsReserveList(H_tel.pactid, H_tel.telno, H_tel.carid, H_tel.reserve_date, H_tel.add_edit_flg);

					if (A_relass.length > 0) {
						for (rcnt = 0; rcnt < A_relass.length; rcnt++) //名前が長いので
						//端末予約取得
						//あれば登録
						{
							H_tra = A_relass[rcnt];
							var A_assreserve = await O_model.getAssetsReserveList(H_tra.pactid, H_tra.assetsid, H_tra.reserve_date, H_tra.add_edit_flg);

							if (A_assreserve.length > 0) {
								for (acnt = 0; acnt < A_assreserve.length; acnt++) //名前が長いので
								//端末との紐付きを切る予約
								{
									H_ass = A_assreserve[acnt];

									if (1 == H_ass.rel_flg) //紐付きレコードがあるか調べる
										{
											if (await O_model.checkTelRelAssetsExist(H_tel.pactid, H_tel.telno, H_tel.carid, H_ass.assetsid) == true) //ログ書き出し
												//あれば削除
												//tel_rel_assets_reserve_tb更新
												//紐付きを切った事により回線無し端末になったらダミー回線登録
												{
													this.infoOut("\t端末紐付き削除\n", 1);
													O_model.doTelRelAssetsDelSQL(H_tel.pactid, H_tel.telno, H_tel.carid, H_ass.assetsid);
													O_model.updateTelRelAssetsReserveExec(H_tel.pactid, H_tel.telno, H_tel.carid, H_ass.assetsid, H_tel.reserve_date, H_tel.add_edit_flg);

													if (await O_model.checkUsedTerminal(H_tel.pactid, H_tel.telno, H_tel.carid, H_ass.assetsid) == false) //ログ書き出し
														//ダミー電話番号生成
														//tel_tbに登録
														//tel_rel_assets_tb更新
														{
															this.infoOut("\t端末にダミー回線紐付け\n", 1);
															var H_tmp = H_tel;
															var dummytelno = O_model.makeDummyTelNo(H_tel.pactid);
															H_tmp.telno = dummytelno;
															H_tmp.telno_view = dummytelno;
															H_tmp.dummy_flg = true;
															O_model.doTelAddSQL(H_tel);
															O_model.doTelRelAssetsAddSQL(H_tmp.pactid, H_tmp.telno, H_tmp.carid, H_ass.assetsid);
														}
												} else //ログ書き出し
												{
													this.infoOut("\t対象の紐付きレコードが無い\n", 1);
												}
										} else if (2 == H_ass.rel_flg) //あれば削除
										//assets_reserve_tb更新
										{
											A_relass = O_model.getTelRelAssetsList(H_tel.pactid, H_tel.telno, H_tel.carid);

											if (A_relass.length > 0) {
												for (rcnt = 0; rcnt < A_relass.length; rcnt++) //名前が長いので
												//この端末を使用している紐付き一覧取得
												//あれば削除
												//あれば削除
												{
													var H_tra_now = A_relass[rcnt];
													A_allrelass = O_model.getTelRelAssetsListFromAssetsID(H_tra_now.pactid, H_tra_now.assetsid);

													if (A_allrelass.length > 0) {
														for (acnt = 0; acnt < A_allrelass.length; acnt++) //名前が長いので
														//ログ書き出し
														//あれば削除
														{
															H_atra = A_allrelass[acnt];
															this.infoOut("\t[" + H_atra.assetsid + "]端末紐付き削除\n", 1);
															O_model.doTelRelAssetsDelSQL(H_atra.pactid, H_atra.telno, H_atra.carid, H_atra.assetsid);
														}
													}

													A_assets = O_model.getAssetsList(H_tra_now.pactid, H_tra_now.assetsid);

													if (A_assets.length > 0) {
														for (acnt = 0; acnt < A_assets.length; acnt++) //名前が長いので
														//ログ書き出し
														//端末削除
														{
															H_ass = A_assets[acnt];
															this.infoOut("\t[" + H_ass.assetsid + "]端末削除\n", 1);
															O_model.doAssetsDelSQL(H_tel.pactid, H_ass.assetsid);
														}
													}
												}
											}

											O_model.updateTelRelAssetsReserveExec(H_tel.pactid, H_tel.telno, H_tel.carid, H_tra.assetsid, H_tel.reserve_date, H_tel.add_edit_flg);
											O_model.updateAssetsReserveExec(H_tel.pactid, H_tra.assetsid, H_tel.reserve_date, H_tel.add_edit_flg);
										} else //既に存在する端末と紐付き更新
										{
											if (await O_model.checkAssetsExist(H_ass.pactid, H_ass.assetsid) == true) //assets_tb更新
												//assets_reserve_tb更新
												//紐付きレコードがあるか調べる
												{
													O_model.doAssetsModSQL(H_ass);
													O_model.updateAssetsReserveExec(H_tel.pactid, H_ass.assetsid, H_tel.reserve_date, H_tel.add_edit_flg);

													if (await O_model.checkTelRelAssetsExist(H_tel.pactid, H_tel.telno, H_tel.carid, H_ass.assetsid) == false) //tel_rel_assets_tb更新
														//tel_rel_assets_reserve_tb更新
														{
															O_model.doTelRelAssetsAddSQL(H_tel.pactid, H_tel.telno, H_tel.carid, H_ass.assetsid);
															O_model.updateTelRelAssetsReserveExec(H_tel.pactid, H_tel.telno, H_tel.carid, H_ass.assetsid, H_tel.reserve_date, H_tel.add_edit_flg);
														}
												} else //assets_tb更新
												//assets_reserve_tb更新
												//この電話のmain_flgをfalseにする
												//assets_tb更新
												//tel_rel_assets_reserve_tb更新
												{
													O_model.doAssetsAddSQL(H_ass);
													O_model.updateAssetsReserveExec(H_tel.pactid, H_ass.assetsid, H_tel.reserve_date, H_tel.add_edit_flg);
													O_model.setTelRelAssetsMainFlagFalse(H_tel.pactid, H_tel.telno, H_tel.carid);
													O_model.doTelRelAssetsAddSQL(H_tel.pactid, H_tel.telno, H_tel.carid, H_ass.assetsid);
													O_model.updateTelRelAssetsReserveExec(H_tel.pactid, H_tel.telno, H_tel.carid, H_ass.assetsid, H_tel.reserve_date, H_tel.add_edit_flg);
												}
										}
								}
							}
						}
					}

					var A_reltel = await O_model.getTelRelTelReserveList(H_tel.pactid, H_tel.telno, H_tel.carid, H_tel.reserve_date, H_tel.add_edit_flg);

					if (A_reltel.length > 0) {
						for (var tcnt = 0; tcnt < A_reltel.length; tcnt++) //既にレコードが無いか存在チェック
						{
							if (await O_model.checkTelRelTelExist(H_trt.pactid, H_trt.telno, H_trt.carid) == false) //ログ書き出し
								//tel_rel_tel_tbに登録
								{
									this.infoOut("\ttel_rel_tel_tbを更新\n", 1);
									O_model.doTelRelTelAddSQL(H_trt.pactid, H_trt.telno, H_trt.carid, H_trt.rel_telno, H_trt.rel_carid);
								}
						}
					}
				} else if (TelReserveExecProc.ADDMODE == H_tel.add_edit_flg) //更新対象の電話があるか調べる
				//端末予約があるか？
				//あれば登録
				//あれば登録
				{
					if (false == H_tel.order_flg) //ログ書き出し
						{
							this.infoOut("[" + H_tel.pactid + ":" + H_tel.telno + ":" + H_tel.carid + "]の新規登録予約処理\n", 1);
						} else //ログ書き出し
						{
							this.infoOut("[" + H_tel.pactid + ":" + H_tel.telno + ":" + H_tel.carid + "]の解約処理に伴う削除\n", 1);
						}

					if (await O_model.checkTelExist(H_tel.pactid, H_tel.telno, H_tel.carid) == false) //ログ書き出し
						//tel_tbに登録
						//tel_reserve_tb更新
						//管理記録
						{
							this.infoOut("\ttel_tbに通常登録\n", 1);
							O_model.doTelAddSQL(H_tel);
							O_model.updateTelReserveExec(H_tel.pactid, H_tel.telno, H_tel.carid, H_tel.reserve_date, H_tel.add_edit_flg);
							O_model.doTelAddLogSQL(H_tel);
							O_model.doTelAddLogSQLV2(H_tel);
						} else //ログ書き出し
						//tel_tb更新
						//tel_reserve_tb更新
						//管理記録
						{
							this.infoOut("\ttel_tbに既に存在するので更新\n", 1);
							O_model.doTelModSQL(H_tel);
							O_model.updateTelReserveExec(H_tel.pactid, H_tel.telno, H_tel.carid, H_tel.reserve_date, H_tel.add_edit_flg);
							O_model.doTelAddLogSQL(H_tel, 1);
							O_model.doTelAddLogSQLV2(H_tel, 1);
						}

					A_relass = O_model.getTelRelAssetsReserveList(H_tel.pactid, H_tel.telno, H_tel.carid, H_tel.reserve_date, H_tel.add_edit_flg);

					if (A_relass.length > 0) //ログ書き出し
						//（あってもひとつのはずだが念のためループ）
						{
							this.infoOut("\t端末予約あり\n", 1);

							for (rcnt = 0; rcnt < A_relass.length; rcnt++) //名前が長いので
							//端末予約取得
							//あれば登録
							{
								H_tra = A_relass[rcnt];
								A_assreserve = O_model.getAssetsReserveList(H_tra.pactid, H_tra.assetsid, H_tra.reserve_date, H_tra.add_edit_flg);

								if (A_assreserve.length > 0) //（あってもひとつのはずだが念のためループ）
									{
										for (acnt = 0; acnt < A_assreserve.length; acnt++) //名前が長いので
										//既に存在する端末と紐付け
										{
											H_ass = A_assreserve[acnt];

											if (await O_model.checkAssetsExist(H_ass.pactid, H_ass.assetsid) == true) //ログ書き出し
												//assets_tb更新
												{
													this.infoOut("\t既存端末更新\n", 1);
													O_model.doAssetsModSQL(H_ass);

													if (await O_model.checkTelRelAssetsExist(H_tel.pactid, H_tel.telno, H_tel.carid, H_ass.assetsid) == false) //tel_rel_assets_tb更新
														{
															O_model.doTelRelAssetsAddSQL(H_tel.pactid, H_tel.telno, H_tel.carid, H_ass.assetsid);
														}
												} else //ログ書き出し
												//assets_tb更新
												//assets_tb更新
												{
													this.infoOut("\tassets_tbに新規登録\n", 1);
													O_model.doAssetsAddSQL(H_ass);
													O_model.doTelRelAssetsAddSQL(H_tel.pactid, H_tel.telno, H_tel.carid, H_ass.assetsid);
												}
										}
									}
							}
						}

					A_reltel = O_model.getTelRelTelReserveList(H_tel.pactid, H_tel.telno, H_tel.carid, H_tel.reserve_date, H_tel.add_edit_flg);

					if (A_reltel.length > 0) {
						for (tcnt = 0; tcnt < A_reltel.length; tcnt++) //名前が長いので
						//既にレコードが無いか存在チェック
						{
							var H_trt = A_reltel[tcnt];

							if (await O_model.checkTelRelTelExist(H_trt.pactid, H_trt.telno, H_trt.carid) == false) //ログ書き出し
								//tel_rel_tel_tbに登録
								{
									this.infoOut("\ttel_rel_tel_tbを更新\n", 1);
									O_model.doTelRelTelAddSQL(H_trt.pactid, H_trt.telno, H_trt.carid, H_trt.rel_telno, H_trt.rel_carid);
								}
						}
					}
				} else {}
		}

		this.getOut().flushMessage();
		this.unLockProcess(O_view.get_ScriptName());
	}

	getExtensionTelModel() {
		
		if (! (this.O_extension instanceof ExtensionTelModel)) {
			this.O_extension = new ExtensionTelModel();
		}

		return this.O_extension;
	}

};
