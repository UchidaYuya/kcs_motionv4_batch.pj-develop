//
//注文更新用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author miyazawa
//@since 2008/04/01
//@uses OrderModel
//@uses OrderUtil
//
//
//
//注文更新用Model
//
//@uses ModelBase
//@package Order
//@author miyazawa
//@since 2008/04/01
//
//OrderFormModel(form作成用class)OrderModifyModelは設計で話をしていた段階で
//親子関係ではなく、それぞれの担当機能を持った兄弟(ツリーにすると同列)なので継承しちゃいかんと思うのです。 iga
//class OrderModifyModel extends OrderFormModel{

require("OrderUtil.php");

require("OrderModifyModelBase.php");

require("view/ViewError.php");

require("Post.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//mt_order_tbにINSERTするデータを作成 <br>
//
//@author miyazawa
//@since 2008/06/30
//
//@access public
//@param integer $orderid
//@param array $H_g_sess
//@param array $H_sess
//@param array $H_recog
//@param array $A_auth
//@param array $H_actord
//@param array $H_view
//@param array $H_sub_data
//@return mixed
//
//
//mt_order_sub_tbにINSERTするデータを作成 <br>
//
//@author miyazawa
//@since 2008/07/03
//
//@access public
//@param integer $orderid
//@param array $H_g_sess
//@param array $H_sess
//@param array $H_recog
//@param array $A_auth
//@return mixed
//
//
//mt_order_teldetail_tbにINSERTするデータを作成 <br>
//
//@author miyazawa
//@since 2008/07/03
//
//@access public
//@param integer $orderid
//@param array $H_g_sess
//@param array $H_sess
//@return mixed
//
//
//mt_order_tbにinsertするためのsqlを作成する
//
//@author igarashi
//@since 2008/05/30
//
//@param array $A_order_data
//@access public
//@return string
//
//
//mt_order_sub_tbにinsertするためのsqlを作成する
//
//@author igarashi
//@since 2008/05/30
//
//@param array $H_sub_data
//@access public
//@return string
//
//
//mt_order_teldetail_tbにinsertするためのsqlを作成する
//
//@author igarashi
//@since 2008/05/30
//
//@param array $H_detail_data
//@access public
//@return string
//
//
//order,order_detail,order_subのprepareをまとめて作成する
//
//@author igarashi
//@since 2008/05/30
//
//@param array $A_order_data
//@param array $H_sub_data
//@param array $H_detail_data
//@access public
//@return none
//
//
//mt_order_tbにinsertする<br>
//失敗したらrollbackする
//
//@author igarashi
//@since 2008/06/03
//
//@access public
//@return boolean
//
//
//mt_order_teldetail_tbにinsertする<br>
//失敗したらrollbackする
//
//@author igarashi
//@since 2008/06/03
//
//@param $H_info(order_teldetail_tbに格納する注文情報)
//
//@access public
//@return boolean
//
//
//mt_order_sub_tbにinsertする<br>
//失敗したらrollbackする
//
//@author igarashi
//@since 2008/06/03
//
//@param $H_info(order_sub_tbに格納する注文情報)
//
//@access public
//@return boolean
//
//
//order_tb、order_teldetail_tb、order_sub_tbにまとめてinsertする<br>
//
//@author igarashi
//@since 2008/06/03
//
//@access public
//@return boolean
//
//
//mt_order_history_tbに代行注文の販売店コメントをinsertする<br>
//
//@author miyazawa
//@since 2008/11/11
//
//@access public
//@return boolean
//
//
//注文種別を細分化して返す
//
//@author miyazawa
//@since 2008/09/21
//
//@param mixed $H_sess
//@access public
//@return string
//
//
//mt_order_teldetail_tbに一括プラン変更の地域会社をアップデートする<br>
//
//@author miyazawa
//@since 2009/01/28
//
//@param int $orderid
//@param mixed $H_self
//@access public
//@return void
//
//
//getAutoRecogCondition
//
//@author
//@since 2010/11/29
//
//@param mixed $orderid
//@access public
//@return void
//
//
//checkLastRecogPost
//
//@author
//@since 2010/11/30
//
//@param mixed $postid
//@access protected
//@return void
//
//
//getRecogStatus
//
//@author
//@since 2010/11/29
//
//@access protected
//@return void
//
//
//insertAutoRecogHistory
//
//@author
//@since 2010/11/30
//
//@param mixed $orderid
//@param mixed $H_g_shop_sess
//@param mixed $H_sess
//@access public
//@return void
//
//
//getPostName
//
//@author igarashi
//@since 2011/12/14
//
//@param mixed $userpostid
//@access public
//@return void
//
//
//setBillModel
//
//@author web
//@since 2013/04/07
//
//@param mixed $obj
//@access public
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
class OrderModifyModel extends OrderModifyModelBase {
	constructor(O_db0, H_g_sess, site_flg = OrderModifyModel.SITE_USER) {
		super(O_db0, H_g_sess, site_flg);
	}

	makeOrderTableData(orderid, O_model, O_view, H_g_sess: {} | any[], H_sess: {} | any[], H_recog: {} | any[], A_auth: {} | any[], H_actord: {} | any[], H_view: {} | any[], H_sub_data: {} | any[] = Array()) //複数窓などでセッションが消えてたらエラー 20090210miya
	//抜けてたので追加 20100531miya
	//お客様情報追加 20091126miya
	//お客様情報追加 20091126miya
	//お客様情報追加 20091126miya
	//お客様情報追加 20100412miya
	//ルート部署の第2階層代行注文権限があれば処理しない（OrderFormProcで入れられる$H_view["actready"]がtrueの場合 20090619miya）
	//(注文した電話の所属する部署の承認部署＝ログインユーザの部署の場合、承認処理を行わずに発注していたが、
	//代行権限での発注では承認をユーザーが行う(条件をつけない場合、管理者代行の文言もDBに登録されない))
	//自動承認なら通過(true === $H_recog["autorecog"]) 20101129iga
	//承認先がない(自部署承認ですらない)場合の暫定対応(ケツの||追加) 20110204iga
	//件数
	//端末削除フラグ
	//資産管理権限がある会社のユーザが明示的に「削除しない」とした場合以外は一律trueでよい 20100317miya
	//サービス
	//メールアドレス
	//商品を注文する場合は商品情報にbuyselidが入ってくる
	//請求先
	//orderid
	//orderid_view
	//pactid
	//pacttype
	//ordertype
	//status
	//chargerid
	//chargername
	//chargermail
	//shopid
	//shopmemid
	//salesshopid
	//actorder
	//actordershopid
	//recdate
	//carid
	//cirid
	//pointradio
	//point
	//applyprice
	//billradio
	//parent
	//billaddress
	//dateradio
	//datefrom
	//dateto
	//datechangeradio
	//datechange
	//fee
	//sendhow
	//sendname
	//sendpost
	//zip1
	//zip2
	//addr1
	//addr2
	//building
	//sendtel
	//note
	//reason
	//shopnote
	//transfer
	//buyselid
	//chpostid
	//chpostname
	//nextpostid
	//nextpostname
	//anspost
	//ansuser
	//ansdate
	//receipt
	//telcnt
	//terminal_del
	//service
	//misctype
	//refercharge
	//applymail
	//recogmail
	//applypostid
	//applyuserid
	//destinationcode
	//salepost
	//knowledge
	//certificate
	//certificatelimit 抜けてたので追加 20100531miya
	//matterno
	//解約解除料 20091117miya
	//解約解除料 20091117miya
	//worldtel追加 20091126miya
	//accountcomment追加 20091126miya
	//existcircuit追加 20091126miya
	//tdbcode追加 20100412miya
	//ウェブ安心サービス 20101022iga
	//端末種別
	//recogcode
	//pbpostcode
	//cfbpostcode
	//ioecode
	//coecode
	//commflag
	//recoguserid
	//pbpostname
	//cfbpostname
	//解約時に電話管理に残すか残さないか 20190116伊達
	{
		if ("" == H_sess.SELF || false == Array.isArray(H_sess.SELF) || false == 0 < H_sess.SELF.length) {
			var str = "OrderModifyModel::\u8907\u6570\u7A93\u306A\u3069\u3067\u30BB\u30C3\u30B7\u30E7\u30F3\u304C\u6D88\u3048\u3066\u3044\u308B";
			this.errorOut(10, str, false);
			this.get_DB().rollback();
			return false;
		}

		if ("" == H_sess[OrderModifyModel.PUB].type || "" == H_sess[OrderModifyModel.PUB].carid || "" == H_sess[OrderModifyModel.PUB].cirid || "" == H_sess[OrderModifyModel.PUB].shopid || "" == H_sess[OrderModifyModel.PUB].memid) {
			str = "OrderModifyModel::\u8907\u6570\u7A93\u306A\u3069\u3067\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u30BB\u30C3\u30B7\u30E7\u30F3\u304C\u6D88\u3048\u3066\u3044\u308B";
			this.errorOut(10, str, false);
			this.get_DB().rollback();
			return false;
		}

		if (Array.isArray(H_sess.SELF.datefrom) == true && H_sess.SELF.datefrom.Y != "") {
			H_sess.SELF.datefrom = OrderUtil.adjustdate(H_sess.SELF.datefrom.Y, H_sess.SELF.datefrom.m, H_sess.SELF.datefrom.d, H_sess.SELF.datefrom.H + 0);
		} else {
			H_sess.SELF.datefrom = undefined;
		}

		if (Array.isArray(H_sess.SELF.dateto) == true && H_sess.SELF.dateto.Y != "") {
			H_sess.SELF.dateto = OrderUtil.adjustdate(H_sess.SELF.dateto.Y, H_sess.SELF.dateto.m, H_sess.SELF.dateto.d, H_sess.SELF.dateto.H + 0);
		} else {
			H_sess.SELF.dateto = undefined;
		}

		if (Array.isArray(H_sess.SELF.datechange) == true && H_sess.SELF.datechange.Y != "") //時間とるようにする
			{
				var hour = undefined;

				if (undefined !== H_sess.SELF.datechange.H) //ドコモなど
					{
						hour = H_sess.SELF.datechange.H;
					} else if (undefined !== H_sess.SELF.datechangeH) //AUなどはこっち。
					//時間指定の関係で、datechangeHとしてformを作成している
					{
						hour = H_sess.SELF.datechangeH;
					}

				H_sess.SELF.datechange = OrderUtil.adjustdate(H_sess.SELF.datechange.Y, H_sess.SELF.datechange.m, H_sess.SELF.datechange.d, hour);
			} else {
			H_sess.SELF.datechange = undefined;
		}

		var destinationcode = undefined;
		var salepost = undefined;
		var knowledge = undefined;
		var certificate = undefined;
		var certificatelimit = undefined;
		var matterno = undefined;
		var worldtel = undefined;
		var accountcomment = undefined;
		var existcircuit = undefined;
		var tdbcode = undefined;

		if (H_g_sess.pacttype == "H" || H_g_sess.pacttype == "M" && -1 !== A_auth.indexOf("fnc_mt_recog") == true && H_recog.postidto == H_g_sess.postid && H_actord.actorder != true && H_view.actready != true || MT_SITE == "shop" || true === H_recog.autorecog || false === H_recog.autorecog && !H_recog.postidto || true === H_recog.authautorecog && H_actord.actorder && H_view.actready) //販売店以外のfjpは個人承認にする(承認ルートと部署設定が実際どうなるかわからないのでここにも入れておく
			//受注時には売り上げ部門等の情報を取ってきて入れる 20090410miya
			//引数にpactidを入れるべきところを$H_g_sess["postid"]を入れていたのを修正 20100115miya
			//ルート部署非表示権限がある会社で、自分がルート部署でなければ第二階層の部署を取得
			{
				H_recog.status = 50;

				if (this.O_fjp.checkAuth("co") && MT_SITE != "shop") //if ($H_g_sess['userid'] != $H_sess['SELF']['h_recoguserid']) {
					//}
					{
						H_recog.status = OrderModifyModel.PRIVATE_RECOG_STAT;
					}

				H_recog.postidto = undefined;
				H_recog.postname = undefined;
				var ansdate = MtDateUtil.getNow();
				var O_Post = new Post();
				var rootpostid = O_Post.getRootPostid(H_g_sess.pactid);

				if (true == (-1 !== A_auth.indexOf("fnc_not_view_root")) && H_g_sess.postid != rootpostid) {
					rootpostid = O_Post.getTargetRootPostid(H_g_sess.pactid, H_g_sess.postid, "post_relation_tb", 2);
				}

				if ("" != rootpostid) //worldtel,accountcomment,existcircuit追加 20091126miya
					//tdbcode追加 20100412miya
					//第二証明書対応 20100531miya
					//第二証明書対応 20100531miya
					//証明書有効期限抜けてたので追加 20100531miya
					//お客様情報追加 20091126miya
					//お客様情報追加 20091126miya
					//お客様情報追加 20091126miya
					//お客様情報追加 20100412miya
					{
						var prsi_sql = "SELECT pactcode,salepost,knowledge,signedget,signed,signeddate,aobnumber,worldtel,accountcomment,existcircuit,tdbcode,idv_signedget," + "idv_signeduse_0,idv_signed_0,idv_signeddate_0," + "idv_signeduse_1,idv_signed_1,idv_signeddate_1," + "idv_signeduse_2,idv_signed_2,idv_signeddate_2," + "idv_signeduse_3,idv_signed_3,idv_signeddate_3," + "idv_signeduse_4,idv_signed_4,idv_signeddate_4," + "idv_signeduse_5,idv_signed_5,idv_signeddate_5," + "idv_signeduse_6,idv_signed_6,idv_signeddate_6," + "idv_signeduse_7,idv_signed_7,idv_signeddate_7," + "idv_signeduse_8,idv_signed_8,idv_signeddate_8," + "idv_signeduse_9,idv_signed_9,idv_signeddate_9" + " FROM post_rel_shop_info_tb WHERE pactid=" + H_g_sess.pactid + " AND postid=" + rootpostid + " AND shopid=" + H_sess[OrderModifyModel.PUB].shopid;
						var H_prsi = this.get_DB().queryRowHash(prsi_sql);
						destinationcode = H_prsi.pactcode;
						salepost = H_prsi.salepost;
						knowledge = H_prsi.knowledge;
						var A_certificate = Array();

						if ("anytime" != H_prsi.signedget) //随時取得でなければ第一証明書セット
							{
								if ("" != String(H_prsi.signed)) {
									A_certificate.push(H_prsi.signed);
									A_certificate.push("----------------------------------------");
								}
							}

						if ("anytime" != H_prsi.idv_signedget) //随時取得でなければ第二証明書セット
							{
								for (var ci = 0; ci < 10; ci++) {
									var idv_isset = false;

									if ("" != String(H_prsi["idv_signeduse_" + ci])) {
										A_certificate.push(H_prsi["idv_signeduse_" + ci]);
										idv_isset = true;
									}

									if ("" != String(H_prsi["idv_signed_" + ci])) {
										A_certificate.push(H_prsi["idv_signed_" + ci]);
										idv_isset = true;
									}

									if ("" != String(H_prsi["idv_signeddate_" + ci])) {
										A_certificate.push(H_prsi["idv_signeddate_" + ci]);
										idv_isset = true;
									}

									if (true == idv_isset) {
										A_certificate.push("----------------------------------------");
									}
								}
							}

						if (0 < A_certificate.length) {
							certificate = join("\n", A_certificate);
						} else {
							certificate = undefined;
						}

						certificatelimit = undefined;

						if (undefined != certificate && undefined != H_prsi.signeddate) {
							certificatelimit = H_prsi.signeddate;
						}

						matterno = H_prsi.aobnumber;
						worldtel = H_prsi.worldtel;
						accountcomment = H_prsi.accountcomment;
						existcircuit = H_prsi.existcircuit;
						tdbcode = H_prsi.tdbcode;
					}
			} else {
			H_recog.status = 10;

			if (this.O_fjp.checkAuth("co") && MT_SITE != "shop") //if ($H_g_sess['userid'] != $H_sess['SELF']['h_recoguserid']) {
				//}
				{
					H_recog.status = OrderModifyModel.PRIVATE_RECOG_STAT;
				}

			ansdate = undefined;
		}

		if (H_sess[OrderModifyModel.PUB].type == "M") //その他は「数量」から入ってくる
			{
				var cnt = H_sess.SELF.number;
			} else //ホットラインの名義変更などで電話情報がないときは1にしておく（受注一覧に0で出てしまうのを防ぐため） 20090410miya
			{
				cnt = +H_sess[OrderModifyModel.PUB].telcount;

				if ("" == cnt) {
					cnt = 1;
				}
			}

		if (H_sess.SELF.terminal_del == "dont") {
			var terminal_del = false;
		} else {
			terminal_del = true;
		}

		if (Array.isArray(H_sess.SELF.service) == true) {
			H_sess.SELF.service = serialize(H_sess.SELF.service);
		}

		var ordertype = this.adjustOrderType(H_sess);

		if ("" != H_g_sess.userid) //$H_chargermail = $H_selfmail["mail"];				//	S179 注文履歴メールアドレス追加 20141212
			//D024 メールはFormから入れるように変更
			//販売店からのメールを受け取る設定のみメールアドレスを入れる
			//入力担当者メールアドレスを使う
			//$applymail = $selfmailstr;
			//最終承認時にはrecogmailも入れる
			{
				var get_selfmail_sql = "SELECT user_tb.mail, user_tb.acceptmail5 FROM user_tb WHERE userid=" + H_g_sess.userid;
				var H_selfmail = this.get_DB().queryRowHash(get_selfmail_sql);
				var H_chargermail = H_sess.SELF.chargermail;

				if (H_selfmail.mail != "" && H_selfmail.acceptmail5 == 1) {
					var selfmailstr = H_selfmail.mail;
				} else {
					selfmailstr = undefined;
				}

				if (!!H_chargermail && H_selfmail.acceptmail5 == 1) //編集されたメールアドレスを使うようにしました
					{
						var applymail = H_chargermail;
					} else {
					applymail = undefined;
				}

				if (50 == H_recog.status) //$recogmail = $selfmailstr;
					//編集されたメールアドレスを入れるようにしました
					{
						var recogmail = H_chargermail;
					} else {
					recogmail = undefined;
				}
			}

		var buyselid = undefined;

		if ("" != H_sess[OrderModifyModel.PUB].H_product.tel.buyselid) //商品がなくてbuyselidが入ってくる場合（プラン変更）
			//hotlineじゃないと動かないぞ、これ 20101129iga
			{
				buyselid = H_sess[OrderModifyModel.PUB].H_product.tel.buyselid;
			} else if ("" == H_sess[OrderModifyModel.PUB].H_product.tel.buyselid && "" != H_sess[OrderModifyModel.PUB].buyselid) //motion型で動くように直す 20101129iga
			{
				buyselid = H_sess[OrderModifyModel.PUB].buyselid;
			} else if (undefined !== H_sess[OrderModifyModel.PUB].telinfo.telno0.buyselid && !!H_sess[OrderModifyModel.PUB].telinfo.telno0.buyselid) {
			buyselid = H_sess[OrderModifyModel.PUB].telinfo.telno0.buyselid;
		}

		var actorder = undefined;
		var actordershopid = undefined;

		if (MT_SITE == "shop") {
			actorder = true;
			actordershopid = H_sess[OrderModifyModel.PUB].shopid;
		}

		var A_reason_mongon = ["\u8CA9\u58F2\u5E97\u3078\u306E\u9023\u7D61\u306F\u7533\u8ACB/\u6CE8\u6587\u5185\u5BB9\u6B04\u306B\u3054\u8A18\u5165\u304F\u3060\u3055\u3044", "\u8CA9\u58F2\u5E97\u3078\u306E\u9023\u7D61\u306F\u5099\u8003\u6B04\u306B\u3054\u8A18\u5165\u304F\u3060\u3055\u3044", "Leave any comments for the store in the Content of Order/Request column.", "Leave any comments for the store in the Notes column."];

		if (true == (-1 !== A_reason_mongon.indexOf(H_sess.SELF.reason))) {
			H_sess.SELF.reason = undefined;
		}

		if ("not_specify" == H_sess.SELF.dateradio) {
			H_sess.SELF.datefrom = undefined;
			H_sess.SELF.dateto = undefined;
		}

		if ("not_specify" == H_sess.SELF.datechangeradio) {
			H_sess.SELF.datechange = undefined;
		}

		var smpcirid = undefined;

		if (undefined !== H_sess.SELF.smartphonetype) {
			smpcirid = H_sess.SELF.smartphonetype;
		}

		if (is_numeric(H_sess[OrderModifyModel.PUB].H_product.tel.productid)) {
			smpcirid = this.convertSmartPhoneTypeId(this.getSmartType(H_sess[OrderModifyModel.PUB].H_product.tel.productid));
		}

		require("model/Order/SearchPostModel.php");

		var O_search = new SearchPostModel();
		var pb_splitcode = O_search.splitCode(H_sess.SELF.h_pbpostcode);
		var cfb_splitcode = O_search.splitCode(H_sess.SELF.h_cfbpostcode);

		if (!!H_sess.SELF.ioecode) {
			var ioecode = H_sess.SELF.ioecode;
		} else {
			ioecode = H_sess.SELF.h_ioecode;
		}

		if (!!H_sess.SELF.coecode) {
			var coecode = H_sess.SELF.coecode;
		} else {
			coecode = H_sess.SELF.h_coecode;
		}

		if (!!H_sess.SELF.fjpcommflag) {
			var commflag = H_sess.SELF.fjpcommflag;
		} else {
			commflag = H_sess.SELF.h_commflag;
		}

		if (!!H_sess.SELF.pbpostcode_second) {
			var pbpostcode_second = H_sess.SELF.pbpostcode_second;
		} else {
			pbpostcode_second = H_sess.SELF.h_pbpostcode_f;
		}

		if (!!H_sess.SELF.cfbpostcode_second) {
			var cfbpostcode_second = H_sess.SELF.cfbpostcode_second;
		} else {
			cfbpostcode_second = H_sess.SELF.h_cfbpostcode_f;
		}

		if (this.O_Set.existsKey("order_billing_select")) {}

		this.O_Set.loadConfig("order");

		if (O_view.assignBillView()) {
			if (undefined !== H_sess.SELF.billid) {
				require("model/Order/BillingModelBase.php");

				var billModel = this.getBillModel(O_view);

				if (!H_sess.SELF.billid) {
					var billData = billModel.getDefaultBill(H_g_sess.pactid);

					if (is_null(billData)) {
						billData = O_model.getCompAddr(O_view);
					}
				} else {
					billData = billModel.getBillData(H_sess.SELF.billid);
				}
			} else {
				billData = O_model.getCompAddr(O_view);
			}
		}

		var A_data = Array();
		A_data.push(this.get_DB().dbQuote(orderid, "integer", true));
		A_data.push(this.get_DB().dbQuote(str_pad(orderid, 10, "0", STR_PAD_LEFT), "text", true));
		A_data.push(this.get_DB().dbQuote(H_g_sess.pactid, "integer", true));

		if (true == actorder) //postid
			//postname
			{
				A_data.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].recogpostid, "integer", true));
				A_data.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].recogpostname, "text", false));
			} else //postid
			//postname
			{
				A_data.push(this.get_DB().dbQuote(H_view.recogpostid, "integer", true));
				A_data.push(this.get_DB().dbQuote(H_view.recogpostname, "text", false));
			}

		A_data.push(this.get_DB().dbQuote(H_g_sess.pacttype, "text", true));
		A_data.push(this.get_DB().dbQuote(ordertype, "text", true));
		A_data.push(this.get_DB().dbQuote(H_recog.status, "integer", true));
		A_data.push(this.get_DB().dbQuote(H_g_sess.userid, "integer", false));
		A_data.push(this.get_DB().dbQuote(H_g_sess.loginname, "text", true));
		A_data.push(this.get_DB().dbQuote(H_chargermail, "text", true));
		A_data.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].shopid, "integer", true));
		A_data.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].memid, "integer", true));
		A_data.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].shopid, "integer", true));
		A_data.push(this.get_DB().dbQuote(actorder, "boolean", false));
		A_data.push(this.get_DB().dbQuote(actordershopid, "text", false));
		A_data.push(this.get_DB().dbQuote(MtDateUtil.getNow(), "timestamp", true));
		A_data.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].carid, "integer", true));
		A_data.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].cirid, "integer", true));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.pointradio, "text", true));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.point, "integer", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.applyprice, "integer", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.billradio, "text", true));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.parent, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.billaddress, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.dateradio, "text", true));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.datefrom, "timestamp", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.dateto, "timestamp", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.datechangeradio, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.datechange, "timestamp", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.fee, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.sendhow, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.sendname, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.sendpost, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.zip1, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.zip2, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.addr1, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.addr2, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.building, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.sendtel, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.note, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.reason, "text", false));
		A_data.push(this.get_DB().dbQuote(undefined, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.transfer, "text", false));
		A_data.push(this.get_DB().dbQuote(buyselid, "integer", false));
		A_data.push(this.get_DB().dbQuote(H_g_sess.postid, "integer", false));
		A_data.push(this.get_DB().dbQuote(H_g_sess.postname, "text", false));
		A_data.push(this.get_DB().dbQuote(H_recog.postidto, "text", false));
		A_data.push(this.get_DB().dbQuote(H_recog.postname, "text", false));
		A_data.push(this.get_DB().dbQuote(undefined, "text", false));
		A_data.push(this.get_DB().dbQuote(undefined, "text", false));
		A_data.push(this.get_DB().dbQuote(ansdate, "text", false));
		A_data.push(0);
		A_data.push(this.get_DB().dbQuote(cnt, "int", false));
		A_data.push(this.get_DB().dbQuote(terminal_del, "boolean", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.service, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.misctype, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sub_data.refercharge, "integer", false));
		A_data.push(this.get_DB().dbQuote(applymail, "text", true));
		A_data.push(this.get_DB().dbQuote(recogmail, "text", true));
		A_data.push(this.get_DB().dbQuote(H_g_sess.postid, "integer", false));
		A_data.push(this.get_DB().dbQuote(H_g_sess.userid, "integer", false));
		A_data.push(this.get_DB().dbQuote(destinationcode, "text", false));
		A_data.push(this.get_DB().dbQuote(salepost, "text", false));
		A_data.push(this.get_DB().dbQuote(knowledge, "text", false));
		A_data.push(this.get_DB().dbQuote(certificate, "text", false));
		A_data.push(this.get_DB().dbQuote(certificatelimit, "timestamp", false));
		A_data.push(this.get_DB().dbQuote(matterno, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.disfee, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.disfeecharge, "integer", false));
		A_data.push(this.get_DB().dbQuote(worldtel, "text", false));
		A_data.push(this.get_DB().dbQuote(accountcomment, "text", false));
		A_data.push(this.get_DB().dbQuote(existcircuit, "text", false));
		A_data.push(this.get_DB().dbQuote(tdbcode, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.webreliefservice, "text", false));
		A_data.push(this.get_DB().dbQuote(smpcirid, "int", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.h_recogcode, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.pbpostcode_first + pbpostcode_second, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.cfbpostcode_first + cfbpostcode_second, "text", false));
		A_data.push(this.get_DB().dbQuote(ioecode, "text", false));
		A_data.push(this.get_DB().dbQuote(coecode, "text", false));
		A_data.push(this.get_DB().dbQuote(commflag, "text", false));
		A_data.push(this.get_DB().dbQuote(H_sess.SELF.h_recoguserid, "text", false));
		A_data.push(this.get_DB().dbQuote(pb_splitcode.split1, "text", false));
		A_data.push(this.get_DB().dbQuote(pbpostcode_second, "text", false));
		A_data.push(this.get_DB().dbQuote(cfb_splitcode.split1, "text", false));
		A_data.push(this.get_DB().dbQuote(cfbpostcode_second, "text", false));
		A_data.push(this.get_DB().dbQuote(this.getPostName(H_g_sess.pactid, H_sess.SELF.pbpostcode_first), "text", false));
		A_data.push(this.get_DB().dbQuote(this.getPostName(H_g_sess.pactid, H_sess.SELF.cfbpostcode_first), "text", false));

		if (undefined !== billData) {
			A_data.push(this.get_DB().dbQuote(billData.billname, "text", false));
			A_data.push(this.get_DB().dbQuote(billData.billpost, "text", false));
			A_data.push(this.get_DB().dbQuote(billData.receiptname, "text", false));
			A_data.push(this.get_DB().dbQuote(billData.zip1, "text", false));
			A_data.push(this.get_DB().dbQuote(billData.zip2, "text", false));
			A_data.push(this.get_DB().dbQuote(billData.addr1, "text", false));
			A_data.push(this.get_DB().dbQuote(billData.addr2, "text", false));
			A_data.push(this.get_DB().dbQuote(billData.building, "text", false));
			A_data.push(this.get_DB().dbQuote(billData.billtel, "text", false));
			A_data.push(this.get_DB().dbQuote(billData.billhow, "text", false));
		} else {
			A_data.push(this.get_DB().dbQuote(undefined, "text", false));
			A_data.push(this.get_DB().dbQuote(undefined, "text", false));
			A_data.push(this.get_DB().dbQuote(undefined, "text", false));
			A_data.push(this.get_DB().dbQuote(undefined, "text", false));
			A_data.push(this.get_DB().dbQuote(undefined, "text", false));
			A_data.push(this.get_DB().dbQuote(undefined, "text", false));
			A_data.push(this.get_DB().dbQuote(undefined, "text", false));
			A_data.push(this.get_DB().dbQuote(undefined, "text", false));
			A_data.push(this.get_DB().dbQuote(undefined, "text", false));
			A_data.push(this.get_DB().dbQuote(undefined, "text", false));
		}

		if (this.orderByCategoryFlag) {
			if (undefined !== H_sess[OrderModifyModel.PUB].telinfo.telno0.division) {
				A_data.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].telinfo.telno0.division, "int", false));
			} else {
				A_data.push(this.get_DB().dbQuote(this.orderByCategoryPattern, "int", false));
			}
		} else {
			A_data.push(this.get_DB().dbQuote(undefined, "int", false));
		}

		//残すか残さないかをいれる
		{
			var is_not_delete_tel = !!H_sess.SELF.is_not_delete_tel ? true : false;
			A_data.push(this.get_DB().dbQuote(is_not_delete_tel, "bool", false));
		}
		return A_data;
	}

	makeOrderSubData(orderid, H_g_sess: {} | any[], H_sess: {} | any[], H_recog: {} | any[], A_auth: {} | any[], H_actord: {} | any[]) //複数窓などでセッションが消えてたらエラー makeOrderTableDataだけで充分かと思ったが途中で消えるケースがあるようなのでここにも入れた 20090520miya
	//ステータスが既に入力されてたら処理しない	20101129iga
	//if(!empty($H_recog["status"])){
	//			// ルート部署の第2階層代行注文権限があれば処理しない
	//			// (注文した電話の所属する部署の承認部署＝ログインユーザの部署の場合、承認処理を行わずに発注していたが、
	//			// 代行権限での発注では承認をユーザーが行う(条件をつけない場合、管理者代行の文言もDBに登録されない))
	//			if($H_g_sess["pacttype"] == "H" ||
	//				($H_g_sess["pacttype"] == "M" && in_array("fnc_mt_recog", $A_auth) == true && $H_recog["postidto"] == $H_g_sess["postid"] && $H_actord["actorder"] != true) ||
	//				MT_SITE == "shop"
	//			){
	//				$H_recog["status"] = 50;
	//			} else {
	//				$H_recog["status"] = 10;
	//			}
	//		}
	//参考金額合計
	//電話のデータ
	//注文が1件以上のproductidのみ配列に入れておく 20100702miya
	//注文が1件以上のproductnameのみ配列に入れておく 20100707miya
	{
		if ("" == H_sess.SELF || false == Array.isArray(H_sess.SELF) || false == 0 < H_sess.SELF.length) {
			var str = "OrderModifyModel::\u8907\u6570\u7A93\u306A\u3069\u3067\u30BB\u30C3\u30B7\u30E7\u30F3\u304C\u6D88\u3048\u3066\u3044\u308B";
			this.errorOut(10, str, false);
			this.get_DB().rollback();
			return false;
		}

		var H_data = Array();
		this.getRecogStatus(H_g_sess, H_sess, A_auth, H_actord, H_recog);
		var number = 1;

		if ("M" == H_sess[OrderModifyModel.PUB].type) {
			if (is_numeric(H_sess.SELF.number)) {
				number = H_sess.SELF.number;
			}
		} else if (1 < +H_sess[OrderModifyModel.PUB].telcount) {
			number = +H_sess[OrderModifyModel.PUB].telcount;
		}

		var taxrate = this.O_Set.excise_tax;
		var refercharge = 0;

		if (0 < +H_sess[OrderModifyModel.PUB].telcount) //機種の色
			//税金
			//数量をかけた 20090402miya
			//小計
			//参考金額合計に＋
			//orderid
			//ordersubid
			//lineno
			//substatus
			//salesshopid
			//expectflg
			//expectdate
			//fixdate
			//memory
			//recovery
			//number
			//productid
			//productname
			//property
			//detail_sort
			//machineflg
			//anspassprice
			//taxprice
			//subtotal
			//fixedsubtotal
			//branchid
			//pricelistid
			//recdate
			//20130606
			{
				var property = "";

				if (H_sess.SELF.color != "") {
					property = H_sess.SELF.color;
				}

				if ("" != H_sess[OrderModifyModel.PUB].H_product.tel.productid && "" != property) {
					var branch_sql = "SELECT branchid FROM product_branch_tb WHERE productid=" + H_sess[OrderModifyModel.PUB].H_product.tel.productid + " AND property='" + property + "'";
					var branchid = this.get_DB().queryOne(branch_sql);
				}

				var anspassprice = undefined;

				if (H_sess[OrderModifyModel.PUB].H_product.tel.paycnt > 1) {
					if (H_sess[OrderModifyModel.PUB].H_product.tel.downmoney != undefined) {
						anspassprice = H_sess[OrderModifyModel.PUB].H_product.tel.downmoney;
					}
				} else {
					anspassprice = H_sess[OrderModifyModel.PUB].H_product.tel.totalprice;
				}

				var taxprice = +(anspassprice * taxrate * number);
				var subtotal = +(anspassprice * number);
				refercharge = +(refercharge + +subtotal);
				var A_row = Array();
				A_row.push(this.get_DB().dbQuote(orderid, "integer", true));
				A_row.push(0);
				A_row.push(0);
				A_row.push(this.get_DB().dbQuote(H_recog.status, "integer", true));
				A_row.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].shopid, "integer", false));
				A_row.push(0);
				A_row.push(this.get_DB().dbQuote(undefined, "timestamp", false));
				A_row.push(this.get_DB().dbQuote(undefined, "timestamp", false));
				A_row.push(this.get_DB().dbQuote(H_sess.SELF.memory, "text", false));
				A_row.push(this.get_DB().dbQuote(H_sess.SELF.recovery, "text", false));
				A_row.push(this.get_DB().dbQuote(number, "integer", false));
				A_row.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].H_product.tel.productid, "integer", false));
				A_row.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].H_product.tel.productname, "text", false));
				A_row.push(this.get_DB().dbQuote(property, "text", false));
				A_row.push(0);
				A_row.push("true");
				A_row.push(this.get_DB().dbQuote(anspassprice, "integer", false));
				A_row.push(this.get_DB().dbQuote(taxprice, "integer", false));
				A_row.push(this.get_DB().dbQuote(subtotal, "integer", false));
				A_row.push(this.get_DB().dbQuote(subtotal, "integer", false));
				A_row.push(this.get_DB().dbQuote(branchid, "integer", false));
				A_row.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].H_product.tel.pricelistid, "integer", false));
				A_row.push(this.get_DB().dbQuote(MtDateUtil.getNow(), "timestamp", false));
				A_row.push(this.get_DB().dbQuote(number, "integer", false));
				H_data.push(A_row);
				delete A_row;
			}

		var acce_i = 0;
		var acce_sort = H_sess[OrderModifyModel.PUB].telcount;

		if ("" == acce_sort) {
			acce_sort = 1;
		}

		var A_ordered_productid = Array();
		var A_ordered_productname = Array();

		if (true == Array.isArray(H_sess[OrderModifyModel.PUB].H_product.acce)) {
			var H_acce_temp = Array();
			{
				let _tmp_0 = H_sess[OrderModifyModel.PUB].H_product.acce;

				for (var akey in _tmp_0) {
					var aval = _tmp_0[akey];

					if (true == (undefined !== aval.productid) && true == (-1 !== Object.keys(H_sess.SELF).indexOf("acce" + aval.productid))) {
						if ("" != H_sess.SELF["acce" + aval.productid] && 0 < H_sess.SELF["acce" + aval.productid]) //注文が1件以上のproductidのみ配列に入れておく 20100702miya
							{
								H_acce_temp.push(aval);
								A_ordered_productid.push(aval.productid);
							}
					} else {
						if (true == (undefined !== aval.productname) && true == (-1 !== Object.keys(H_sess.SELF).indexOf("acce" + aval.productname))) {
							if ("" != H_sess.SELF["acce" + aval.productname] && 0 < +H_sess.SELF["acce" + aval.productname]) //注文が1件以上のproductnameのみ配列に入れておく 20100707miya
								{
									H_acce_temp.push(aval);
									A_ordered_productname.push(aval.productname);
								}
						}
					}
				}
			}
			H_sess[OrderModifyModel.PUB].H_product.acce = H_acce_temp;
		}

		if (true == (undefined !== H_sess[OrderModifyModel.PUB].H_product.acce) && 0 < H_sess[OrderModifyModel.PUB].H_product.acce.length) {
			{
				let _tmp_1 = H_sess.SELF;

				for (var key in _tmp_1) //acceidつきのパラメータのとき 注文一件以上の商品のみ 20100702miya
				//電話の直接入力が抜けていた productnameも追加 20100707miya
				{
					var val = _tmp_1[key];
					var acce_param = str_replace("acce", "", key);

					if (true == ereg("^acce", key) && "acce" != key && (true == (-1 !== A_ordered_productid.indexOf(acce_param)) || true == (-1 !== A_ordered_productname.indexOf(acce_param)))) //付属品の数量
						//単価
						//小計
						//参考金額合計に＋
						//付属品のbranchidも入れる 20080105miya
						//orderid
						//ordersubid
						//lineno
						//substatus
						//salesshopid
						//expectflg
						//expectdate
						//fixdate
						//memory
						//recovery
						//number
						//productid
						//productname
						//property
						//detail_sort
						//machineflg
						//anspassprice
						//taxprice
						//subtotal
						//fixedsubtotal
						//branchid
						//pricelistid
						//recdate
						//20130606
						{
							if ("A" == H_sess[OrderModifyModel.PUB].type) //付属品のときは数が入力される
								{
									var acce_number = H_sess.SELF[key];
								} else //電話の台数と同じ
								{
									acce_number = number;
								}

							anspassprice = undefined;

							if (H_sess[OrderModifyModel.PUB].H_product.acce[acce_i].totalprice > 0) {
								anspassprice = H_sess[OrderModifyModel.PUB].H_product.acce[acce_i].totalprice;
							}

							taxprice = +(anspassprice * taxrate * acce_number);
							subtotal = +(anspassprice * acce_number);
							refercharge = +(refercharge + +subtotal);
							var acce_branchid = undefined;

							if ("" != H_sess[OrderModifyModel.PUB].H_product.acce[acce_i].productid) {
								var acce_branch_sql = "SELECT branchid FROM product_branch_tb WHERE productid=" + H_sess[OrderModifyModel.PUB].H_product.acce[acce_i].productid + " AND delflg=false";
								acce_branchid = this.get_DB().queryOne(acce_branch_sql);
							}

							A_row.push(this.get_DB().dbQuote(orderid, "integer", true));
							A_row.push(this.get_DB().dbQuote(acce_i + 1, "integer", true));
							A_row.push(this.get_DB().dbQuote(acce_i + 1, "integer", true));
							A_row.push(this.get_DB().dbQuote(H_recog.status, "integer", true));
							A_row.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].shopid, "integer", false));
							A_row.push(0);
							A_row.push(this.get_DB().dbQuote(undefined, "timestamp", false));
							A_row.push(this.get_DB().dbQuote(undefined, "timestamp", false));
							A_row.push(this.get_DB().dbQuote(H_sess.SELF.memory, "text", false));
							A_row.push(this.get_DB().dbQuote(H_sess.SELF.recovery, "text", false));
							A_row.push(this.get_DB().dbQuote(acce_number, "integer", false));
							A_row.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].H_product.acce[acce_i].productid, "integer", false));
							A_row.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].H_product.acce[acce_i].productname, "text", false));
							A_row.push(this.get_DB().dbQuote(undefined, "text", false));
							A_row.push(this.get_DB().dbQuote(acce_sort, "integer", false));
							A_row.push("false");
							A_row.push(this.get_DB().dbQuote(anspassprice, "integer", false));
							A_row.push(this.get_DB().dbQuote(taxprice, "integer", false));
							A_row.push(this.get_DB().dbQuote(subtotal, "integer", false));
							A_row.push(this.get_DB().dbQuote(subtotal, "integer", false));
							A_row.push(this.get_DB().dbQuote(acce_branchid, "integer", false));
							A_row.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].H_product.acce[acce_i].pricelistid, "integer", false));
							A_row.push(this.get_DB().dbQuote(MtDateUtil.getNow(), "timestamp", false));
							A_row.push(this.get_DB().dbQuote(acce_number, "integer", false));
							H_data.push(A_row);
							delete A_row;
							acce_i++;
							acce_sort++;
						}
				}
			}
		}

		if ("A" == H_sess[OrderModifyModel.PUB].type && (undefined != H_sess[OrderModifyModel.PUB].free_acce && 0 < H_sess[OrderModifyModel.PUB].free_acce.length)) {
			{
				let _tmp_2 = H_sess[OrderModifyModel.PUB].free_acce;

				for (var free_key in _tmp_2) //productname 半角を全角に置換 20100630miya
				//orderid
				//ordersubid
				//lineno
				//substatus
				//salesshopid
				//expectflg
				//expectdate
				//fixdate
				//memory
				//recovery
				//number
				//productid
				//productname 半角スペースを全角に置換 20100623miya
				//property
				//detail_sort
				//machineflg
				//anspassprice
				//taxprice
				//subtotal
				//fixedsubtotal
				//branchid
				//pricelistid
				//recdate
				//20130606
				{
					var free_val = _tmp_2[free_key];
					free_val.free_productname = str_replace(" ", "\u3000", free_val.free_productname);
					A_row.push(this.get_DB().dbQuote(orderid, "integer", true));
					A_row.push(this.get_DB().dbQuote(acce_i + 1, "integer", true));
					A_row.push(this.get_DB().dbQuote(acce_i + 1, "integer", true));
					A_row.push(this.get_DB().dbQuote(H_recog.status, "integer", true));
					A_row.push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].shopid, "integer", false));
					A_row.push(0);
					A_row.push(this.get_DB().dbQuote(undefined, "timestamp", false));
					A_row.push(this.get_DB().dbQuote(undefined, "timestamp", false));
					A_row.push(this.get_DB().dbQuote(H_sess.SELF.memory, "text", false));
					A_row.push(this.get_DB().dbQuote(H_sess.SELF.recovery, "text", false));
					A_row.push(this.get_DB().dbQuote(free_val.free_count, "integer", false));
					A_row.push(this.get_DB().dbQuote(undefined, "integer", false));
					A_row.push(this.get_DB().dbQuote(free_val.free_productname, "text", false));
					A_row.push(this.get_DB().dbQuote(free_val.free_property, "text", false));
					A_row.push(this.get_DB().dbQuote(acce_sort, "integer", false));
					A_row.push("false");
					A_row.push(this.get_DB().dbQuote(undefined, "integer", false));
					A_row.push(this.get_DB().dbQuote(undefined, "integer", false));
					A_row.push(this.get_DB().dbQuote(undefined, "integer", false));
					A_row.push(this.get_DB().dbQuote(undefined, "integer", false));
					A_row.push(this.get_DB().dbQuote(undefined, "integer", false));
					A_row.push(this.get_DB().dbQuote(undefined, "integer", false));
					A_row.push(this.get_DB().dbQuote(MtDateUtil.getNow(), "timestamp", false));
					A_row.push(this.get_DB().dbQuote(free_val.free_count, "integer", false));
					H_data.push(A_row);
					delete A_row;
					acce_i++;
					acce_sort++;
				}
			}
		}

		H_data.refercharge = refercharge;
		return H_data;
	}

	makeOrderDetailData(orderid, H_g_sess: {} | any[], H_sess: {} | any[], H_recog: {} | any[], A_auth: {} | any[], H_actord: {} | any[]) //複数窓などでセッションが消えてたらエラー makeOrderTableDataだけで充分かと思ったが途中で消えるケースがあるようなのでここにも入れた 20090520miya
	//// ルート部署の第2階層代行注文権限があれば処理しない
	//        // (注文した電話の所属する部署の承認部署＝ログインユーザの部署の場合、承認処理を行わずに発注していたが、
	//        // 代行権限での発注では承認をユーザーが行う(条件をつけない場合、管理者代行の文言もDBに登録されない))
	//        if($H_g_sess["pacttype"] == "H" ||
	//        	($H_g_sess["pacttype"] == "M" && in_array("fnc_mt_recog", $A_auth) == true && $H_recog["postidto"] == $H_g_sess["postid"] && $H_actord["actorder"] != true) ||
	//        	MT_SITE == "shop"
	//        ){
	//        	$H_recog["status"] = 50;
	//        } else{
	//        	$H_recog["status"] = 10;
	//        }
	{
		if ("" == H_sess.SELF || false == Array.isArray(H_sess.SELF) || false == 0 < H_sess.SELF.length) {
			var str = "OrderModifyModel::\u8907\u6570\u7A93\u306A\u3069\u3067\u30BB\u30C3\u30B7\u30E7\u30F3\u304C\u6D88\u3048\u3066\u3044\u308B";
			this.errorOut(10, str, false);
			this.get_DB().rollback();
			return false;
		}

		this.getRecogStatus(H_g_sess, H_sess, A_auth, H_actord, H_recog);

		if (0 < +H_sess[OrderModifyModel.PUB].telcount) //pointAにあったロジックをループ外に移動
			//ループ内でやると複数台注文でoptionが消えてしまう(serializeされるから)
			//ここから 20101014iga
			//配列整形
			{
				if (Array.isArray(H_sess.SELF.vodalive) == true) {
					if (Array.isArray(H_sess.SELF.option) == true) {
						H_sess.SELF.option = H_sess.SELF.option + H_sess.SELF.vodalive;
					} else {
						H_sess.SELF.option = H_sess.SELF.vodalive;
					}
				}

				if (Array.isArray(H_sess.SELF.vodayuryo) == true) {
					if (Array.isArray(H_sess.SELF.option) == true) {
						H_sess.SELF.option = H_sess.SELF.option + H_sess.SELF.vodayuryo;
					} else {
						H_sess.SELF.option = H_sess.SELF.vodayuryo;
					}
				}

				if (Array.isArray(H_sess.SELF.option) == true) {
					H_sess.SELF.option = serialize(H_sess.SELF.option);
				}

				if (Array.isArray(H_sess.SELF.waribiki) == true) {
					H_sess.SELF.waribiki = serialize(H_sess.SELF.waribiki);
				}

				for (var i = 0; i < H_sess[OrderModifyModel.PUB].telcount; i++) //日付を整形しておく
				//電話番号整形（注文パターンによって違うようだ。要調査）
				//$telno = $H_sess["SELF"]["telno"];
				//タブ対策 20100629miya
				//代行注文でtelnoが抜け落ちる場合がある？　再現できないのでチェックを入れておく 20100114miya
				//スマートフォンの付属品がここでひっかかっていた！　修正 20100630miya
				//電話詳細情報で入力がなかったら現状のデータを入れておく項目
				//地域会社
				//aridが空だったら固定で100を入れる 20090413miya
				//代行注文は権限クラス作りなおす
				//このデータの取り扱いはキチガイの所業
				//orderid
				//ordersubid
				//arid
				//telno
				//contractor
				//holdername
				//userid
				//planradio
				//plan
				//packetradio
				//packet
				//option
				//waribiki
				//discounttel
				//passwd
				//pay_startdate
				//pay_monthly_sum
				//pay_frequency
				//mail
				//telusername
				//employeecode
				//text1
				//text2
				//text3
				//text4
				//text5
				//text6
				//text7
				//text8
				//text9
				//text10
				//text11
				//text12
				//text13
				//text14
				//text15
				//int1
				//int2
				//int3
				//int4
				//int5
				//int6
				//date1
				//date2
				//date3
				//date4
				//date5
				//date6
				//mail1
				//mail2
				//mail3
				//url1
				//url2
				//url3
				//select1
				//select2
				//select3
				//select4
				//select5
				//select6
				//select7
				//select8
				//select9
				//select10
				//memo
				//kousiradio
				//kousi
				//detail_sort
				//machineflg
				//buytype1
				//buytype2
				//formercarid
				//mnpno
				//number
				//telno_view
				//substatus
				//registdate
				//contractdate
				//bef_plan
				//bef_packet
				//postid
				//productid
				{
					for (var datecounter = 1; datecounter < 7; datecounter++) {
						if (Array.isArray(H_sess.SELF["date" + datecounter + "_" + i]) == true && H_sess.SELF["date" + datecounter + "_" + i].Y != "") {
							H_sess.SELF["date" + datecounter + "_" + i] = OrderUtil.adjustdate(H_sess.SELF["date" + datecounter + "_" + i].Y, H_sess.SELF["date" + datecounter + "_" + i].m, H_sess.SELF["date" + datecounter + "_" + i].d, H_sess.SELF["date" + datecounter + "_" + i].H);
						} else {
							H_sess.SELF["date" + datecounter + "_" + i] = undefined;
						}
					}

					var telno = H_sess[OrderModifyModel.PUB].telinfo["telno" + i].telno;
					telno = telno.replace(/ /g, "");
					telno = telno.replace(/\-/g, "");
					telno = telno.replace(/\(/g, "");
					telno = telno.replace(/\)/g, "");
					telno = telno.replace(/	/g, "");

					if ("N" != H_sess[OrderModifyModel.PUB].type && 28 != H_sess[OrderModifyModel.PUB].carid) {
						if ("" == telno) //「ログインされていません」だったのでエラーの種類を変えた 20100128miya
							{
								str = "OrderModifyModel::\u96FB\u8A71\u756A\u53F7\u304C\u6D88\u3048\u3066\u3044\u308B:" + H_sess[OrderModifyModel.PUB].telinfo["telno" + i].telno;
								this.errorOut(16, str, false, "../menu.php");
								this.get_DB().rollback();
								return false;
							}
					}

					var A_discounttel = Array();
					A_discounttel.push(H_sess.SELF.discounttel1);
					A_discounttel.push(H_sess.SELF.discounttel2);
					A_discounttel.push(H_sess.SELF.discounttel3);
					A_discounttel.push(H_sess.SELF.discounttel4);
					A_discounttel.push(H_sess.SELF.discounttel5);

					if (undefined !== A_discounttel == true) {
						H_sess.SELF.discounttel = serialize(A_discounttel);
					} else {
						H_sess.SELF.discounttel = undefined;
					}

					var simcardno = undefined;

					if ("M" == H_sess[OrderModifyModel.PUB].type && undefined !== H_sess.SELF.misctelno && "" === H_sess.SELF.misctelno) //20141119プルダウン追加date　S178
						{
							var employeecode = H_sess[OrderModifyModel.PUB].telinfo["telno" + i].employeecode;
							var telusername = H_sess[OrderModifyModel.PUB].telinfo["telno" + i].telusername;
							var mail = H_sess[OrderModifyModel.PUB].telinfo["telno" + i].mail;
							var memo = H_sess[OrderModifyModel.PUB].telinfo["telno" + i].memo;
							var text = Array();

							for (var text_i = 1; text_i < 16; text_i++) {
								text[text_i] = H_sess[OrderModifyModel.PUB].telinfo["telno" + i]["text" + text_i];
							}

							var int = Array();

							for (var int_i = 1; int_i < 7; int_i++) {
								int[int_i] = H_sess[OrderModifyModel.PUB].telinfo["telno" + i]["int" + int_i];
							}

							var date = Array();

							for (var date_i = 1; date_i < 7; date_i++) {
								date[date_i] = H_sess[OrderModifyModel.PUB].telinfo["telno" + i]["date" + date_i];
							}

							var mails = Array();

							for (var mail_i = 1; mail_i < 4; mail_i++) {
								mails[mail_i] = H_sess[OrderModifyModel.PUB].telinfo["telno" + i]["mail" + mail_i];
							}

							for (var url_i = 1; url_i < 4; url_i++) {
								url[url_i] = H_sess[OrderModifyModel.PUB].telinfo["telno" + i]["url" + url_i];
							}

							var select = Array();

							for (var select_i = 1; select_i <= 10; select_i++) {
								select[select_i] = H_sess[OrderModifyModel.PUB].telinfo["telno" + i]["select" + select_i];
							}
						} else //電話設定項目追加、メモ追加 20091016miya
						{
							if ("C" == H_sess[OrderModifyModel.PUB].type && H_sess[OrderModifyModel.PUB].telinfo["telno" + i].carid == 15) {
								simcardno = H_sess.SELF["simcardno" + "_" + i];
							} else if ("C" == H_sess[OrderModifyModel.PUB].type && H_sess[OrderModifyModel.PUB].carid == 15 && H_g_sess.pacttype == "H") //ホットライン用
								{
									simcardno = H_sess.SELF["simcardno" + "_" + i];
								}

							if (true == (undefined !== H_sess.SELF["employeecode" + "_" + i])) {
								employeecode = H_sess.SELF["employeecode" + "_" + i];
							} else {
								employeecode = H_sess[OrderModifyModel.PUB].telinfo["telno" + i].employeecode;
							}

							if (true == (undefined !== H_sess.SELF["telusername" + "_" + i])) {
								telusername = H_sess.SELF["telusername" + "_" + i];
							} else {
								telusername = H_sess[OrderModifyModel.PUB].telinfo["telno" + i].telusername;
							}

							if (true == (undefined !== H_sess.SELF["mail" + "_" + i])) {
								mail = H_sess.SELF["mail" + "_" + i];
							} else {
								mail = H_sess[OrderModifyModel.PUB].telinfo["telno" + i].mail;
							}

							if (true == (undefined !== H_sess.SELF["memo" + "_" + i])) {
								memo = H_sess.SELF["memo" + "_" + i];
							} else {
								memo = H_sess[OrderModifyModel.PUB].telinfo["telno" + i].memo;
							}

							text = Array();

							for (text_i = 1;; text_i < 16; text_i++) {
								if (true == (undefined !== H_sess.SELF["text" + text_i + "_" + i])) {
									text[text_i] = H_sess.SELF["text" + text_i + "_" + i];
								} else {
									text[text_i] = H_sess[OrderModifyModel.PUB].telinfo["telno" + i]["text" + text_i];
								}
							}

							int = Array();

							for (int_i = 1;; int_i < 7; int_i++) {
								if (true == (undefined !== H_sess.SELF["int" + int_i + "_" + i])) {
									int[int_i] = H_sess.SELF["int" + int_i + "_" + i];
								} else {
									int[int_i] = H_sess[OrderModifyModel.PUB].telinfo["telno" + i]["int" + int_i];
								}
							}

							date = Array();

							for (date_i = 1;; date_i < 7; date_i++) {
								if (true == (undefined !== H_sess.SELF["date" + date_i + "_" + i])) {
									date[date_i] = H_sess.SELF["date" + date_i + "_" + i];
								} else {
									date[date_i] = H_sess[OrderModifyModel.PUB].telinfo["telno" + i]["date" + date_i];
								}
							}

							mails = Array();

							for (mail_i = 1;; mail_i < 4; mail_i++) ////	20160520date
							//						//	管理項目がないのに、勝手に値が入っているので調査して、という案件対応
							//						}elseif (true == isset($H_sess["SELF"]["mail_" . $i])) {
							//							$mails[$mail_i] = $H_sess["SELF"]["mail_" . $i];
							//						} else {
							//							$mails[$mail_i] = $H_sess[self::PUB]["telinfo"]["telno" . $i]["mail" .$mail_i];
							//						}
							{
								if (true == (undefined !== H_sess.SELF["mail" + mail_i + "_" + i])) {
									mails[mail_i] = H_sess.SELF["mail" + mail_i + "_" + i];
								} else //S224の対応で削除の場合など電話詳細の情報を入れたいので編集　hanashima 20200716
									//$mails[$mail_i] = "";
									{
										if (-1 !== ["D", "A", "P"].indexOf(H_sess[OrderModifyModel.PUB].type)) {
											mails[mail_i] = H_sess[OrderModifyModel.PUB].telinfo["telno" + i]["mail" + mail_i];
										} else {
											mails[mail_i] = "";
										}
									}
							}

							for (url_i = 1;; url_i < 4; url_i++) {
								if (true == (undefined !== H_sess.SELF["url" + url_i + "_" + i])) {
									url[url_i] = H_sess.SELF["url" + url_i + "_" + i];
								} else {
									url[url_i] = H_sess[OrderModifyModel.PUB].telinfo["telno" + i]["url" + url_i];
								}
							}

							select = Array();

							for (select_i = 1;; select_i <= 10; select_i++) {
								if (true == (undefined !== H_sess.SELF["select" + select_i + "_" + i])) {
									select[select_i] = H_sess.SELF["select" + select_i + "_" + i];
								} else {
									select[select_i] = H_sess[OrderModifyModel.PUB].telinfo["telno" + i]["select" + select_i];
								}
							}
						}

					if ("" != H_sess[OrderModifyModel.PUB].telinfo["telno" + i].arid) {
						var arid = H_sess[OrderModifyModel.PUB].telinfo["telno" + i].arid;
					} else //電話情報がなければ販売店の地域会社取得
						{
							if ("" != H_sess[OrderModifyModel.PUB].shopid && "" != H_sess[OrderModifyModel.PUB].carid) {
								arid = this.getShopArea(H_sess[OrderModifyModel.PUB].shopid, H_sess[OrderModifyModel.PUB].carid);
							} else {
								arid = 100;
							}
						}

					if (undefined == arid) {
						arid = 100;
					}

					var userid = undefined;

					if (true == is_numeric(H_sess.SELF.userid)) {
						userid = H_sess.SELF.userid;
					}

					var serialno = undefined;
					var ordertype = this.adjustOrderType(H_sess);

					if ("C" == H_sess[OrderModifyModel.PUB].type || "S" == H_sess[OrderModifyModel.PUB].type || "Nmnp" == H_sess[OrderModifyModel.PUB].type || "M" == H_sess[OrderModifyModel.PUB].type) {
						var assetsid = this.getAssetsID(H_sess[OrderModifyModel.PUB].telinfo["telno" + i].telno, H_sess[OrderModifyModel.PUB].telinfo["telno" + i].carid, H_g_sess.pactid);

						if (is_null(simcardno)) {
							simcardno = this.getSimNo(H_sess[OrderModifyModel.PUB].telinfo["telno" + i].telno, H_sess[OrderModifyModel.PUB].telinfo["telno" + i].carid, H_g_sess.pactid);
						}

						serialno = this.getSerialNo(assetsid);
					}

					var extensionno = "";
					var FuncExtension = false;

					if ("user" == MT_SITE) {
						FuncExtension = this.O_Auth.chkPactFuncId(OrderModifyModel.FUNC_EXTENSION);
					} else {
						var O_Auth = MtAuthority.singleton(H_g_sess.pactid);
						FuncExtension = O_Auth.chkPactFuncId(OrderModifyModel.FUNC_EXTENSION);
					}

					if (FuncExtension) {
						if ("N" == H_sess[OrderModifyModel.PUB].type || "Nmnp" == H_sess[OrderModifyModel.PUB].type) //内線番号生成
							//内線番号有効化(ロック)
							{
								require("model/ExtensionTelModel.php");

								var O_extension = new ExtensionTelModel();
								extensionno = O_extension.getExtensionNo(H_g_sess.pactid, H_sess[OrderModifyModel.PUB].carid);

								if (false !== extensionno) //ロックはすぐ実行しないと2代目以降に同じ番号振ってしまう
									{
										var sql = O_extension.makeActivateExtensionNoSQL(H_g_sess.pactid, extensionno, H_sess[OrderModifyModel.PUB].carid);
										this.get_DB().exec(sql);
									} else {
									extensionno = undefined;
								}
							} else {
							extensionno = this.getRegisteredExtensionNo(H_g_sess.pactid, H_sess[OrderModifyModel.PUB].telinfo["telno" + i].carid, H_sess[OrderModifyModel.PUB].telinfo["telno" + i].telno);
						}
					}

					var mnp_enable_date = undefined;
					var inputname = "mnp_enable_date_" + i;
					var temp = H_sess.SELF[inputname];

					if (true == (undefined !== temp) && temp.Y + temp.m + temp.d != "") {
						mnp_enable_date = sprintf("%04s-%02s-%02s", temp.Y, temp.m, temp.d);
					} else {
						mnp_enable_date = undefined;
					}

					H_data[i].push(this.get_DB().dbQuote(orderid, "integer", true));
					H_data[i].push(0);
					H_data[i].push(this.get_DB().dbQuote(arid, "integer", false));
					H_data[i].push(this.get_DB().dbQuote(telno, "text", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess.SELF.contractor, "text", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess.SELF.holdername, "text", false));
					H_data[i].push(this.get_DB().dbQuote(userid, "integer", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess.SELF.planradio, "text", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess.SELF.plan, "integer", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess.SELF.packetradio, "text", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess.SELF.packet, "integer", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess.SELF.option, "text", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess.SELF.waribiki, "text", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess.SELF.discounttel, "text", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess.SELF.passwd, "text", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess.SELF.pay_startdate, "timestamp", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].H_product.tel.onepay, "integer", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].H_product.tel.paycnt, "integer", false));
					H_data[i].push(this.get_DB().dbQuote(mail, "text", false));
					H_data[i].push(this.get_DB().dbQuote(telusername, "text", false));
					H_data[i].push(this.get_DB().dbQuote(employeecode, "text", false));
					H_data[i].push(this.get_DB().dbQuote(text[1], "text", false));
					H_data[i].push(this.get_DB().dbQuote(text[2], "text", false));
					H_data[i].push(this.get_DB().dbQuote(text[3], "text", false));
					H_data[i].push(this.get_DB().dbQuote(text[4], "text", false));
					H_data[i].push(this.get_DB().dbQuote(text[5], "text", false));
					H_data[i].push(this.get_DB().dbQuote(text[6], "text", false));
					H_data[i].push(this.get_DB().dbQuote(text[7], "text", false));
					H_data[i].push(this.get_DB().dbQuote(text[8], "text", false));
					H_data[i].push(this.get_DB().dbQuote(text[9], "text", false));
					H_data[i].push(this.get_DB().dbQuote(text[10], "text", false));
					H_data[i].push(this.get_DB().dbQuote(text[11], "text", false));
					H_data[i].push(this.get_DB().dbQuote(text[12], "text", false));
					H_data[i].push(this.get_DB().dbQuote(text[13], "text", false));
					H_data[i].push(this.get_DB().dbQuote(text[14], "text", false));
					H_data[i].push(this.get_DB().dbQuote(text[15], "text", false));
					H_data[i].push(this.get_DB().dbQuote(int[1], "integer", false));
					H_data[i].push(this.get_DB().dbQuote(int[2], "integer", false));
					H_data[i].push(this.get_DB().dbQuote(int[3], "integer", false));
					H_data[i].push(this.get_DB().dbQuote(int[4], "integer", false));
					H_data[i].push(this.get_DB().dbQuote(int[5], "integer", false));
					H_data[i].push(this.get_DB().dbQuote(int[6], "integer", false));
					H_data[i].push(this.get_DB().dbQuote(date[1], "timestamp", false));
					H_data[i].push(this.get_DB().dbQuote(date[2], "timestamp", false));
					H_data[i].push(this.get_DB().dbQuote(date[3], "timestamp", false));
					H_data[i].push(this.get_DB().dbQuote(date[4], "timestamp", false));
					H_data[i].push(this.get_DB().dbQuote(date[5], "timestamp", false));
					H_data[i].push(this.get_DB().dbQuote(date[6], "timestamp", false));
					H_data[i].push(this.get_DB().dbQuote(mails[1], "text", false));
					H_data[i].push(this.get_DB().dbQuote(mails[2], "text", false));
					H_data[i].push(this.get_DB().dbQuote(mails[3], "text", false));
					H_data[i].push(this.get_DB().dbQuote(url[1], "text", false));
					H_data[i].push(this.get_DB().dbQuote(url[2], "text", false));
					H_data[i].push(this.get_DB().dbQuote(url[3], "text", false));
					H_data[i].push(this.get_DB().dbQuote(select[1], "text", false));
					H_data[i].push(this.get_DB().dbQuote(select[2], "text", false));
					H_data[i].push(this.get_DB().dbQuote(select[3], "text", false));
					H_data[i].push(this.get_DB().dbQuote(select[4], "text", false));
					H_data[i].push(this.get_DB().dbQuote(select[5], "text", false));
					H_data[i].push(this.get_DB().dbQuote(select[6], "text", false));
					H_data[i].push(this.get_DB().dbQuote(select[7], "text", false));
					H_data[i].push(this.get_DB().dbQuote(select[8], "text", false));
					H_data[i].push(this.get_DB().dbQuote(select[9], "text", false));
					H_data[i].push(this.get_DB().dbQuote(select[10], "text", false));
					H_data[i].push(this.get_DB().dbQuote(memo, "text", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess.SELF["kousiradio" + "_" + i], "text", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess.SELF["kousi" + "_" + i], "integer", false));
					H_data[i].push(i);
					H_data[i].push("true");
					H_data[i].push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].H_product.tel.buytype1, "integer", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].H_product.tel.buytype2, "integer", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess.SELF["formercarid" + "_" + i], "integer", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess.SELF["mnpno" + "_" + i], "text", false));
					H_data[i].push(this.get_DB().dbQuote(1, "integer", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].telinfo["telno" + i].telno_view, "text", false));
					H_data[i].push(this.get_DB().dbQuote(H_recog.status, "integer", true));
					H_data[i].push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].telinfo["telno" + i].orderdate, "timestamp", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].telinfo["telno" + i].contractdate, "timestamp", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].telinfo["telno" + i].planid, "integer", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].telinfo["telno" + i].packetid, "integer", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].telinfo["telno" + i].postid, "integer", false));
					H_data[i].push(this.get_DB().dbQuote(H_sess[OrderModifyModel.PUB].H_product.tel.productid, "integer", false));
					H_data[i].push(this.get_DB().dbQuote(simcardno, "text", false));
					H_data[i].push(this.get_DB().dbQuote(serialno, "text", false));
					H_data[i].push(this.get_DB().dbQuote(extensionno, "text", false));
					H_data[i].push(this.get_DB().dbQuote(mnp_enable_date, "date", false));
				}
			}

		return H_data;
	}

	makeOrderTableSQL(A_order_data) {
		this.ordtbl = "INSERT INTO mt_order_tb (" + Object.keys(this.A_ordcol).join(",") + ") " + "VALUES(" + A_order_data.join(",") + ")";
	}

	makeOrderSubTableSQL(H_sub_data) {
		if (H_sub_data != "") {
			for (var key in H_sub_data) {
				var A_val = H_sub_data[key];

				if (true == Array.isArray(A_val)) {
					this.ordsub += "INSERT INTO mt_order_sub_tb (" + Object.keys(this.A_subcol).join(",") + ") " + "VALUES(" + A_val.join(",") + "); ";
				}
			}
		}
	}

	makeOrderDetailTableSQL(H_detail_data) {
		if (H_detail_data != "") {
			for (var key in H_detail_data) {
				var A_val = H_detail_data[key];
				this.orddetail += "INSERT INTO mt_order_teldetail_tb (" + Object.keys(this.A_detcol).join(",") + ") " + "VALUES(" + A_val.join(",") + "); ";
			}
		}
	}

	makeOrderRelatedSQL(A_order_data, H_sub_data, H_detail_data) {
		this.makeOrderTableSQL(A_order_data);
		this.makeOrderSubTableSQL(H_sub_data);
		this.makeOrderDetailTableSQL(H_detail_data);
	}

	insertOrderTableSQL() //sql文がなければ処理しない
	//戻るボタンの飛び先が間違っていた 20100128miya
	{
		if ("" != this.ordtbl) {
			this.get_DB().exec(this.ordtbl);
			return true;
		} else {
			var str = "OrderModifyModel::order_tb\u306Esql\u672A\u5B9A\u7FA9";
		}

		this.get_DB().rollback();
		this.errorOut(0, str, false, "../menu.php");
		return false;
	}

	insertOrderDetailSQL() //sql文がなければ処理しない
	{
		if ("" != this.orddetail) //} else {	// 必ずしも電話番号があるとは限らないので（smartphoneなど）エラーは出さないようにした
			//$str = "OrderModifyModel::order_teldetail_tbのsql未定義";
			{
				this.get_DB().exec(this.orddetail);
				return true;
			}
	}

	insertOrderSubSQL() //sql文がなければ処理しない
	{
		if ("" != this.ordsub) //} else {	// 必ずしも電話番号があるとは限らないので（smartphoneなど）エラーは出さないようにした
			//$str = "OrderModifyModel::order_sub_tbのsql未定義";
			{
				this.get_DB().exec(this.ordsub);
				return true;
			}
	}

	insertOrderRelatedSQL() //transaction開始
	//prepare実行
	{
		this.get_DB().beginTransaction();
		this.insertOrderTableSQL();
		this.insertOrderSubSQL();
		this.insertOrderDetailSQL();
		this.get_DB().commit();
	}

	insertActorderHistory(orderid, H_g_shop_sess, H_sess) {
		var hist_sql = "INSERT INTO mt_order_history_tb(" + "orderid," + "chdate," + "shopid," + "shopname," + "shopperson," + "shopcomment," + "status) " + "VALUES(" + orderid + "," + "'" + MtDateUtil.getNow() + "'," + H_g_shop_sess.shopid + "," + "'" + H_g_shop_sess.shopname + "'," + this.get_DB().dbQuote(H_sess.SELF.member, "text", false) + "," + this.get_DB().dbQuote(H_sess.SELF.shopcomment, "text", false) + "," + "50)";
		this.get_DB().query(hist_sql);
	}

	adjustOrderType(H_sess) {
		var ordertype = H_sess[OrderModifyModel.PUB].type;
		var waribiki_str = "";
		var option_str = "";

		if (true == Array.isArray(H_sess.SELF.waribiki)) {
			waribiki_str = serialize(H_sess.SELF.waribiki);
		}

		if (true == Array.isArray(H_sess.SELF.option)) {
			option_str = serialize(H_sess.SELF.option);
		}

		if (ordertype == "P") //名義変更はTpc（個人→法人）、Tcp（法人→個人）、Tcc（法人→法人）
			{
				if ("" != H_sess.SELF.plan || "" != H_sess.SELF.packet) {
					return "Ppl";
				} else if ("" != waribiki_str && (ereg("put", waribiki_str) || ereg("remove", waribiki_str))) {
					return "Pdc";
				} else if ("" != option_str && (ereg("put", option_str) || ereg("remove", option_str))) {
					return "Pop";
				} else //すべて変更なしの場合、Pplにしておく（Pのままだと受注一覧に表示されない。Pplにしておけば受注内容変更で対応できる）20090226miya
					{
						return "Ppl";
					}
			} else if (ordertype == "T") {
			if ("\u500B\u4EBA\uFF08\u4ED6:\u4ED6\u793E\u540D\u7FA9\uFF09\u2192\u6CD5\u4EBA\uFF08\u81EA:\u81EA\u793E\u540D\u7FA9\uFF09" == H_sess.SELF.transfer) {
				return "Tpc";
			} else if ("\u6CD5\u4EBA\uFF08\u81EA:\u81EA\u793E\u540D\u7FA9\uFF09\u2192\u500B\u4EBA\uFF08\u4ED6:\u4ED6\u793E\u540D\u7FA9\uFF09" == H_sess.SELF.transfer) {
				return "Tcp";
			} else if ("\u6CD5\u4EBA\uFF08\u4ED6:\u4ED6\u793E\u540D\u7FA9\uFF09\u2192\u6CD5\u4EBA\uFF08\u81EA:\u81EA\u793E\u540D\u7FA9\uFF09" == H_sess.SELF.transfer) {
				return "Tcc";
			} else //万が一どれにも引っかからない場合はエラーにしてしまう（お金が絡むので注文させない）20090226miya
				//戻るボタンの飛び先が間違っていた 20100128miya
				{
					this.errorOut(5, "\u6CE8\u6587\u7A2E\u5225\u304C\u4E0D\u6B63\u3067\u3059", false, "../menu.php");
					return undefined;
				}
		}

		return ordertype;
	}

	updateBulkPlan(orderid, H_self) {
		var upd_sql = "";

		for (var key in H_self) {
			var val = H_self[key];

			if (1 == preg_match("/arid(.+)/", key)) {
				var telno = key.replace(/arid/g, "");
				upd_sql += "UPDATE mt_order_teldetail_tb SET arid=" + this.get_DB().dbQuote(val, "integer", false) + " WHERE telno='" + telno + "' AND orderid=" + orderid + ";";
			}
		}

		if ("" != upd_sql) //aridがない場合にSQLエラーにならないよう修正 20091207miya
			{
				this.get_DB().query(upd_sql);
			}
	}

	getAutoRecogCondition(pactid, postid, userid, nextpostid = undefined, postcheck = true) //販売店は処理しない
	//recog_batch_tbに存在すれば処理
	{
		if ("shop" == MT_SITE) //fjpなら処理する わけわからん
			{
				if (!this.O_fjp.checkAuth("co")) {
					return false;
				}
			}

		if (postcheck) //最終承認部署は自動承認しない
			{
				if (!this.checkLastRecogPost(pactid, postid, userid)) {
					return false;
				}
			}

		var A_key = [{
			pactid: pactid,
			postid: undefined,
			recogid: undefined
		}, {
			pactid: pactid,
			postid: postid,
			recogid: undefined
		}, {
			pactid: pactid,
			postid: undefined,
			recogid: nextpostid
		}];

		for (var val of Object.values(A_key)) {
			var sql = "SELECT * " + "FROM " + "recog_batch_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(val.pactid, "int", true);

			if (undefined === val.postid) {
				sql += " AND orderpostid IS NULL";
			} else {
				sql += " AND orderpostid=" + this.get_DB().dbQuote(val.postid, "int", false);
			}

			if (undefined === val.recogid) {
				sql += " AND recogpostid IS NULL";
			} else {
				sql += " AND recogpostid=" + this.get_DB().dbQuote(val.recogid, "int", false);
			}

			var H_data = this.get_DB().queryRowHash(sql);

			if (undefined != H_data) {
				break;
			}
		}

		var autorecog = false;

		if (Array.isArray(H_data)) //申請部署がrecog_batch_tbに登録されてたら承認
			{
				if (postid == H_data.orderpostid) {
					autorecog = true;
				}

				if (nextpostid == H_data.recogpostid) {
					autorecog = true;
				}

				if (!H_data.orderpostid && !H_data.recogpostid) {
					autorecog = true;
				}
			}

		return autorecog;
	}

	checkLastRecogPost(pactid, postid, userid) //渡されたpostidが承認元として登録されてなければ最終承認
	{
		var sql = "SELECT COUNT(*) FROM recognize_tb WHERE postidfrom=" + this.get_DB().dbQuote(postid, "int", true);
		var cnt = this.get_DB().queryOne(sql);
		var autorecog = true;

		if (0 == cnt) {
			autorecog = false;
		} else //承認元と先が渡されたpostidなら最終承認(cnt=1)(自部署承認)
			//承認元に渡されたpostidが存在するが、承認先は違う(cnt=0)(通常の承認ツリー)
			{
				sql += " AND postidto=" + this.get_DB().dbQuote(postid, "int", true);
				cnt = this.get_DB().queryOne(sql);

				if (1 == cnt) {
					sql = "SELECT COUNT(*) FROM fnc_relation_tb WHERE pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND userid=" + this.get_DB().dbQuote(userid, "int", false) + " AND fncid=123";

					if (0 < this.get_DB().queryOne(sql)) {
						autorecog = false;
					}
				}
			}

		return autorecog;
	}

	getRecogStatus(H_g_sess, H_sess, A_auth, H_actord, H_recog) {
		if (true === H_recog.autorecog) {
			H_recog.status = 50;
		} else //ルート部署の第2階層代行注文権限があれば処理しない
			//(注文した電話の所属する部署の承認部署＝ログインユーザの部署の場合、承認処理を行わずに発注していたが、
			//代行権限での発注では承認をユーザーが行う(条件をつけない場合、管理者代行の文言もDBに登録されない))
			{
				if (H_g_sess.pacttype == "H" || H_g_sess.pacttype == "M" && -1 !== A_auth.indexOf("fnc_mt_recog") == true && H_recog.postidto == H_g_sess.postid && H_actord.actorder != true || MT_SITE == "shop") {
					H_recog.status = 50;
				} else {
					H_recog.status = 10;

					if (this.O_fjp.checkAuth("co") && MT_SITE != "shop") //if ($H_g_sess['userid'] != $H_sess['SELF']['h_recoguserid']) {
						//}
						{
							H_recog.status = OrderModifyModel.PRIVATE_RECOG_STAT;
						}
				}
			}
	}

	insertAutoRecogHistory(orderid, H_g_sess, H_sess, H_recog, actorder) //if (isset($H_sess[self::PUB]["recogpostid"])) {
	//$A_recogpostid[] = $H_sess[self::PUB]["recogpostid"];
	{
		var chdate = MtDateUtil.getNow();

		if (undefined !== H_recog.postidto && !!H_recog.postidto) {
			A_recogpostid.push(H_recog.postidto);
		} else {
			var sql = "SELECT nextpostid FROM mt_order_tb WHERE orderid= " + this.get_DB().dbQuote(orderid, "int", true);
			A_recogpostid.push(this.get_DB().queryOne(sql));
		}

		if (!A_recogpostid[0]) {
			return true;
		}

		for (var i = 1; i < 100; i++) //自部署承認
		{
			sql = "SELECT postidfrom, postidto " + "FROM " + "recognize_tb " + "WHERE " + "postidfrom=" + this.get_DB().dbQuote(A_recogpostid[i - 1], "int", true);
			var temp = this.get_DB().queryRowHash(sql);

			if (temp.postidfrom == temp.postidto || is_null(temp)) {
				break;
			}

			if (temp.postidto == A_recogpostid[i - 1]) {
				break;
			}

			A_recogpostid[i] = temp.postidto;
		}

		var fnc_recog = false;

		if (actorder) {
			var message = "'\u4EE3\u884C\u6CE8\u6587\u306E\u305F\u3081\u81EA\u52D5\u627F\u8A8D', ";
		} else {
			message = "'\u30B7\u30B9\u30C6\u30E0\u306B\u3088\u308B\u81EA\u52D5\u627F\u8A8D', ";
			sql = "SELECT COUNT(*) FROM fnc_relation_tb " + "WHERE fncid=" + this.get_DB().dbQuote(OrderModifyModel.MT_RECOGID, "int", true) + " AND userid=" + this.get_DB().dbQuote(H_g_sess.userid, "int", true);

			if (0 < this.get_DB().queryOne(sql)) {
				fnc_recog = true;
			}
		}

		var cnt = A_recogpostid.length;

		for (var key in A_recogpostid) //操作中の部署が承認部署で、操作中のユーザーが承認権限を持っていたら自動承認の履歴に残さない
		{
			var recogpostid = A_recogpostid[key];
			sql = "SELECT postid, postname " + "FROM " + "post_tb " + "WHERE " + "postid = " + this.get_DB().dbQuote(recogpostid, "int", true);
			var postinfo = this.get_DB().queryRowHash(sql);
			var status = 10;

			if (cnt - 1 == key) {
				status = 50;
			}

			sql = "INSERT INTO mt_order_history_tb (" + "orderid," + "chpostid, " + "chpostname," + "chname, " + "chdate, " + "status" + ") " + "VALUES(" + this.get_DB().dbQuote(orderid, "int", true) + ", " + this.get_DB().dbQuote(postinfo.postid, "int", true) + ", " + this.get_DB().dbQuote(postinfo.postname, "text", true) + ", " + message + this.get_DB().dbQuote(chdate, "timestamp", true) + ", " + status + ")";

			if (recogpostid == H_g_sess.postid && fnc_recog) {
				continue;
			}

			this.get_DB().query(sql);
		}
	}

	getPostName(pactid, userpostid) {
		if (is_numeric(pactid) && !!userpostid) {
			var sql = "SELECT postname FROM post_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND userpostid=" + this.get_DB().dbQuote(userpostid, "text", true);
			return this.get_DB().queryOne(sql);
		}

		return undefined;
	}

	setBillModel(obj) {
		if (is_null(this.billModel) && "object" === typeof obj) {
			this.billModel = obj;
		}
	}

	__destruct() {
		super.__destruct();
	}

};