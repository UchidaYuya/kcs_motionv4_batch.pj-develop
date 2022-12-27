//
//オーダー取得・更新用Model
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
//別ドメイン対応 20090812miya
//20180220伊達
//
//注文フォーム用Model
//
//@uses ModelBase
//@package Order
//@author miyazawa
//@since 2008/04/01
//

require("model/CombinationModel.php");

require("model/Price/UserPriceModel.php");

require("model/GroupModel.php");

require("OrderMainModel.php");

require("OrderTelInfoModel.php");

require("OrderUtil.php");

require("MtMailUtil.php");

require("MtSetting.php");

require("model/UserModel.php");

//s183 旧プラン
//s183旧パケット
//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_order
//@access public
//@return void
//
//
//注文画面に表示する入力項目をcirid,carid,発注種別をもとに取得する
//
//@author igarashi
//@since 2008/05/21
//
//@param $type(発注種別)
//@param $cirid(キャリアID)
//@param $carid(回線種別)
//
//@access public
//@return hash
//
//
//オプションをcirid,caridをもとに取得する
//
//@author igarashi
//@since 2008/05/21
//
//@param $H_info(ディレクトリセッション)
//@param $H_product(商品情報)
//@param $eng(英語化)	// 20090210miya
//
//@access public
//@return hash
//
//
//サービスを取得する
//
//@author miyazawa
//@since 2008/07/29
//
//@param $H_info(ディレクトリセッション)
//@access public
//@return hash
//
//
//付属品をcirid,caridをもとに取得する
//
//@author igarashi
//@since 2008/05/21
//
//@param $cirid(キャリアID)
//@param $carid(回線種別)
//
//@access public
//@return hash
//
//
//指定した会社・部署に所属するユーザーを返す
//
//@author igarashi
//@since 2008/05/21
//
//@param $pactid
//@param $postid
//
//@access public
//@return hash
//
//
//指定したキャリア、回線種別、地域のプランを取得する
//
//@author igarashi
//@since 2008/05/21
//
//@param $H_info(ディレクトリセッション)
//@param $H_product(商品情報)
//@param $eng(英語化)	// 20090210miya
//@param $H_view(雛型を含む情報)	// 20090716miya
//$param $withoutorderview 注文時のみ表示するフラグ
//
//@access public
//@return hash
//
//
//指定したキャリア、回線種別、地域のパケットパックを取得する
//
//@author igarashi
//@since 2008/05/21
//
//@param $H_info(ディレクトリセッション)
//@param $H_product(商品情報)
//@param $eng(英語化)	// 20090210miya
//
//@access public
//@return hash
//
//
//指定したキャリア、会社から一括請求組込先を取得する
//
//@author igarashi
//@since 2008/05/21
//
//@param $pactid
//@param $carid(キャリアID)
//
//@access public
//@return hash
//
//public function getParentTelno($carid, $pactid){
//
//指定した会社、部署の承認先部署を取得する
//
//@author igarashi
//@since 2008/05/21
//
//@param $H_g_sess
//@param $H_sess
//@param $postid
//@param $postname
//@param $H_actord(第２階層代行注文用情報)
//@param $H_actord["actorder"](trueなら第２階層代行注文)
//@param $H_actord["curpostid"](代行している部署ID(第２階層の部署))
//@param $H_actord["curpostname"](代行している部署名(第２階層の部署))
//
//@access public
//@return hash
//
//
//指定した会社、部署の承認先部署を取得する
//
//@author date
//@since 2014/11/13
//
//@param $H_g_sess
//@param $H_sess
//@param $postid
//@param $postname
//@param $H_actord(第２階層代行注文用情報)a
//@param $H_actord["actorder"](trueなら第２階層代行注文)
//@param $H_actord["curpostid"](代行している部署ID(第２階層の部署))
//@param $H_actord["curpostname"](代行している部署名(第２階層の部署))
//
//@access public
//@return hash
//
//
//指定した会社、部署の住所を取得する
//
//@author igarashi
//@since 2008/05/21
//
//@param $pactid
//@param $postid
//
//@access public
//@return hash
//
//
//getUserInfo
//ユーザー情報の取得
//ただ、今のところはメールアドレスだけあれば問題ない・・
//必要があれば随時足していくこと。
//@author date
//@since 2017/12/08
//
//@param mixed $pactid
//@param mixed $postid
//@access public
//@return void
//
//
//指定した発注種別、キャリア、回線種別の注文時に表示する文言を取得する
//
//
//@author igarashi
//@since 2008/05/21
//
//@param  $pactid
//@param  $carid
//
//@access public
//@return boolean
//
//
//注文された情報を取得する
//
//
//@author igarashi
//@since 2008/05/21
//
//@param integer $orderid
//@param string $language
//
//@access public
//@return boolean
//
//
//テンプレート取得
//
//@author miyazawa
//@since 2008/05/21
//
//@param mixed $H_sess
//@access public
//@return string
//
//
//フォーム入力ルール取得
//
//@author miyazawa
//@since 2008/05/20
//
//@param mixed $H_sess
//@access public
//@return
//
//
//割賦回数取得
//
//@author igarashi
//@since 2008/06/09
//
//@param int $carid
//@param boolean $eng
//@access public
//@return $hash
//
//素晴らしい！強化書に載せたいぐらいの素晴らしいコードだ(´・ω・`)
//	public function getPayCountId($carid, $eng=false){
//		// 英語化対応 20090311miya
//		if (true == $eng) {
//			$c0 = "Select";
//			$c1 = "Lump Sum";
//			$c12 = "12 Installments";
//			$c24 = "24 Installments";
//			$cno = "Not Selected";
//		} else {
//			$c0 = "選択してください";
//			$c1 = "割賦なし（一括支払い）";	// 表記変更 20100105miya
//			$c12 = "12回";
//			$c24 = "24回";
//			$cno = "選択なし";
//		}
//		if($this->O_Set->car_docomo){
//			$A_loan = array("0"=>$c0,
//							"1"=>$c1,
//							"12"=>$c12,
//							"24"=>$c24);
//		}elseif($this->O_Set->car_willcom){
//			$A_loan = array("0"=>$c0,
//							"1"=>$c1,
//							"12"=>$c12,
//							"24"=>$c24);
//		}elseif($this->O_Set->car_au){
//			$A_loan = array("0"=>$c0,
//							"1"=>$c1,
//							"12"=>$c12,
//							"24"=>$c24);
//		}elseif($this->O_Set->car_softbank){
//			$A_loan = array("0"=>$c0,
//							"1"=>$c1,
//							"12"=>$c12,
//							"24"=>$c24);
//		}elseif($this->O_Set->car_emobile){
//			$A_loan = array("0"=>$c0,
//							"1"=>$c1,
//							"12"=>$c12,
//							"24"=>$c24);
//		}else{
//			$A_loan = array("0"=>$cno);
//		}
//		return $A_loan;
//	}
//
//getPayCountId
//割賦回数取得・・・
//@author 伊達
//@since 2019/05/29
//
//@param mixed $carid
//@param mixed $eng
//@access public
//@return void
//
//
//価格表からの注文の詳細を取得
//
//@author miyazawa
//@since 2008/08/05
//
//@param integer $price_detailid
//@access public
//@return array
//
//
//価格表からの注文の詳細を取得（price_detailidから購入方式が取れない場合）
//
//@author miyazawa
//@since 2009/03/27
//
//@param integer $price_detailid
//@access public
//@return array
//
//
//価格表からの注文の詳細を取得（付属品）
//
//@author miyazawa
//@since 2008/08/18
//
//@param integer $price_detailid
//@access public
//@return array
//
//
//関連する商品を取得
//
//@author miyazawa
//@since 2008/08/05
//
//@param integer $productid
//@access public
//@return array
//
//
//関連する商品を取得（手入力用）
//
//@author miyazawa
//@since 2008/08/20
//
//@param integer $productid
//@access public
//@return array
//
//
//注文データから詳細を作成（getPriceDetailと同じ形式で返す）
//
//@author miyazawa
//@since 2008/08/27
//
//@param mixed $H_order
//@param string $language
//@access public
//@return array
//
//
//雛型データから詳細を作成（必要な引数を整えてgetPriceDetailFromOrderDataに投げる）
//
//@author miyazawa
//@since 2009/01/23
//
//@param mixed $H_defproduct
//@access public
//@return array
//
//
//関連する商品を取得 （getRelatedProductと同じ形式で返す）
//
//@author miyazawa
//@since 2008/08/05
//
//@param mixed $H_order
//@access public
//@return array
//
//
//買い物カゴに表示する付属品を取得（注文種別が付属品のとき）※使わない
//
//@author miyazawa
//@since 2008/08/08
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@access public
//@return array
//
//
//端末の色候補を取得
//
//@author miyazawa
//@since 2008/08/05
//
//@param integer $productid
//@access public
//@return array
//
//
//端末の回線種別、シリーズ、機種取得
//
//@author miyazawa
//@since 2008/08/05
//
//@param mixed $H_dir
//@access public
//@return array
//
//
//NG/必須組み合わせチェック
//
//@author miyazawa
//@since 2008/08/09
//
//@param mixed $H_sess
//@access public
//@return array
//
//
//キャリアの使用できるポイント単位を返す
//
//@author igarashi
//@since 2008/08/28
//
//@param $carid
//
//@access public
//@return int
//
//
//代行注文コメント欄の販売店メンバー取得
//
//@author miyazawa
//@since 2008/11/11
//
//@param $shopid
//
//@access public
//@return mixed
//
//
//注文時メールを送信する
//
//@author miyazawa
//@since 2008/10/06
//
//@param $H_sess
//@param $H_order(注文情報)
//
//@access public
//@return bool
//
//
//申請メール送信先リスト取得
//
//@author miyazawa
//@since 2008/10/06
//
//@param $pactid
//@param $postidto
//@param $language
//
//@access public
//@return mixed
//
//
//発注メール送信先リスト取得
//
//@author miyazawa
//@since 2008/10/06
//
//@param $H_dir
//
//@access public
//@return mixed
//
//
//販売店側受付メール送信先リスト取得
//
//@author miyazawa
//@since 2008/10/06
//
//@param $userid
//@param $posttreestr
//@param $loginname
//
//@access public
//@return mixed
//
//
//証明書期限切れメール送信先リスト取得
//
//@author miyazawa
//@since 2010/06/08
//
//@param $H_dir
//@param $H_g_sess
//@param $rootpostid
//
//@access public
//@return mixed
//
//
//メールサブジェクト・本文作成<br>
//
//@author miyazawa
//@since 2008/10/06
//
//@param $H_sess
//@param $H_mailparam：メールに使用するパラメータの配列
//@param $shopid
//@param $language
//
//@access public
//@return hash
//
//
//証明書有効期限メールの文面を作る
//
//@author miyazawa
//@since 2010/06/08
//
//@param $H_sd
//
//@access public
//@return mixed
//
//
//証明書期限を取得する
//
//@author miyazawa
//@since 2010/06/08
//
//@param $userid
//
//@access public
//@return mixed
//
//
//ユーザの言語を取得する
//
//@author miyazawa
//@since 2009/04/17
//
//@param $userid
//
//@access public
//@return mixed
//
//
//settingOrderMail
//
//@author
//@since 2010/11/29
//
//@param mixed $O_post
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $H_view
//@access public
//@return void
//
//
//getReceiveMailList
//注文を受け取るメール
//@author web
//@since 2018/02/20
//
//@param mixed $userid
//@param mixed $poststr
//@param mixed $name
//@access public
//@return void
//
//
//getOrderStatus
//
//@author igarashi
//@since 2011/07/08
//
//@param mixed $orderid
//@access public
//@return void
//
//
//getNotExistsTels
//
//@author igarashi
//@since 2011/08/18
//
//@param mixed $telinfo
//@access public
//@return void
//
//
//setMiscType
//
//@author igarashi
//@since 2011/08/29
//
//@param mixed $actorder
//@access public
//@return void
//
//
//extractMiscType
//
//@author igarashi
//@since 2011/08/29
//
//@param mixed $data
//@access protected
//@return void
//
//
//preCheckAccQuant
//
//@author igarashi
//@since 2011/09/06
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//getBillDefault
//
//@author web
//@since 2013/04/04
//
//@access public
//@return void
//
//
//getCompAddr
//
//@author web
//@since 2013/04/16
//
//@param mixed $O_view
//@access public
//@return void
//
//
//getMtOrderTeldetailMailAddressList
//
//@author hanashima
//@since 2020/03/16
//
//@param mixed $orderid
//@param mixed $pactid
//@access public
//@return array
//
//
//getOrderMailTemplate
//
//@author hanashima
//@since 2020/03/18
//
//@param mixed $userid
//@access public
//@return string
//
//
//orderMailSend
//
//@author hanashima
//@since 2020/03/18
//
//@param mixed $H_g_sess
//@param mixed $toDatas
//@param mixed $ccDatas
//@param mixed $mailData
//@param mixed $userdata
//@access public
//@return void
//
//
//updateUserMailTpl
//
//@author hanashima
//@since 2020/03/18
//
//@param mixed $userid
//@param mixed $tpl
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
class OrderFormModel extends OrderMainModel {
	constructor(O_db0, H_g_sess, site_flg = OrderFormModel.SITE_USER) {
		super(O_db0, H_g_sess, site_flg);
		this.O_oldplan = Array();
		this.O_oldpacket = Array();
		this.O_telinfo = new OrderTelInfoModel(O_db0, H_g_sess, site_flg);
		this.O_combi = new CombinationModel(O_db0);
		this.O_group = new GroupModel(O_db0);
	}

	getOrderItem(H_info) //英語化権限 20090210miya
	//$cirid = $H_info["cirid"];
	//		if("M" == $H_info["type"]){
	//		}
	//sql
	{
		if (true == Array.isArray(H_info) && true == H_info.eng) {
			var itemname_str = "itemname_eng AS itemname";
			var itemname_grp = "itemname_eng";
		} else {
			itemname_str = "itemname";
			itemname_grp = "itemname";
		}

		var sql = "SELECT " + itemname_str + ", itemgrade, inputtype, inputname, inputdef, usertype, property " + "FROM mt_order_item_tb WHERE type='" + H_info.type + "' AND cirid='" + H_info.cirid + "' AND carid='" + H_info.carid + "' " + "GROUP BY " + itemname_grp + ", type, cirid, carid, itemname, inputtype, inputname, inputdef, itemgrade, usertype, property, show_order " + "ORDER BY itemgrade DESC, show_order, inputdef, inputname, inputtype";
		this.getOut().debugOut("model/Order/OrderFormModel::getOrderItem()->sql:" + sql, false);
		return this.get_DB().queryHash(sql);
	}

	getOrderOption(H_info, H_product, eng = false) //除外IDのstring
	//英語化権限 20090210miya
	{
		var except = "";
		var productid = H_product.tel.productid;

		if (productid != "") {
			var product_sql = "SELECT option,service FROM product_tb WHERE productid=" + productid;
			var H_result = this.get_DB().queryRowHash(product_sql);
			var A_temp = Array();

			if (H_result.option != "") {
				A_temp = array_merge(A_temp, unserialize(H_result.option));
			}

			if (H_result.service != "") {
				A_temp = array_merge(A_temp, unserialize(H_result.service));
			}

			if (A_temp.length > 0) {
				except = join(",", A_temp);
			}
		} else {
			var A_pid = Array();

			if (true == (undefined !== H_info.telinfo) && true == Array.isArray(H_info.telinfo)) {
				{
					let _tmp_0 = H_info.telinfo;

					for (var pky in _tmp_0) {
						var pvl = _tmp_0[pky];

						if ("" != pvl.productid) {
							A_pid.push(pvl.productid);
						}
					}
				}

				if (0 < A_pid.length) {
					product_sql = "SELECT option,service FROM product_tb WHERE productid IN (" + join(",", A_pid) + ")";
					H_result = this.get_DB().queryHash(product_sql);
					A_temp = Array();

					if (H_result != "") {
						for (var hkey in H_result) {
							var hval = H_result[hkey];

							if ("" != hval.option) {
								A_temp = array_merge(A_temp, unserialize(hval.option));
							}

							if ("" != hval.service) {
								A_temp = array_merge(A_temp, unserialize(hval.service));
							}
						}

						if (0 < A_temp.length) {
							except = join(",", A_temp);
						}
					}
				}
			}
		}

		if (true == eng) {
			var opnamestr = "opname_eng AS opname";
		} else {
			opnamestr = "opname";
		}

		var sql = "SELECT opid, " + opnamestr + ",discountflg FROM option_tb WHERE cirid=" + H_info.cirid + " AND carid=" + H_info.carid + " AND ordviewflg=TRUE ";

		if (except != "") {
			sql += "AND opid NOT IN (" + except + ") ";
		}

		sql += "ORDER BY sort";
		return this.get_DB().queryHash(sql);
	}

	getOrderService(H_info) //英語化権限 20090210miya
	{
		if (true == H_info.eng) {
			var opnamestr = "opname_eng AS opname";
		} else {
			opnamestr = "opname";
		}

		var sql = "SELECT opid, " + opnamestr + " FROM service_tb WHERE ordviewflg=TRUE ORDER BY sort";
		return this.get_DB().queryHash(sql);
	}

	getOrderAccessory(H_info) {
		var sql = "SELECT cirid, acceid, accename FROM accessory_tb WHERE ";

		if (true == (undefined !== H_info.cirid) && "" != H_info.cirid) {
			sql += "cirid=" + H_info.cirid + " AND ";
		}

		sql += "carid=" + H_info.carid + "AND ordviewflg=TRUE ORDER BY cirid, sort";
		return this.get_DB().queryHash(sql);
	}

	getOrderBelongUser(pactid, postid) {
		var sql = "SELECT userid, username FROM user_tb WHERE pactid=" + pactid + " AND postid=" + postid + " AND type!='CO' ORDER BY loginid";
		var H_user = this.get_DB().queryAssoc(sql);

		for (var key in H_user) {
			var val = H_user[key];
			H_user[key] = htmlspecialchars(val);
		}

		return H_user;
	}

	loadOrderOldPlan(pactid) {
		if (!this.O_oldplan) //過去のプランを注文できるようにするぽよ
			{
				this.O_Set.loadConfig("H_order_oldplan");
				var key = "orderoldplan_pact" + pactid;

				if (this.O_Set.existsKey(key)) {
					this.O_oldplan = this.O_Set[key];
				}
			}
	}

	loadOrderOldPacket(pactid) {
		if (!this.O_oldpacket) //過去のパケットを注文できるようにするぽよ
			{
				this.O_Set.loadConfig("H_order_oldpacket");
				var key = "orderoldpacket_pact" + pactid;

				if (this.O_Set.existsKey(key)) {
					this.O_oldpacket = this.O_Set[key];
				}
			}
	}

	getOrderPlan(H_info, H_product, eng = false, H_view = Array(), withoutorderview = false) //除外IDのstring
	//購入方式での絞り込み
	//MNPで雛型を適用した場合、雛型の買い方を入れないとプランリストが取得できない。
	//また、雛型選択後商品・買い方を選びなおした場合、$H_info["H_product"]["tel"]["buyselid"]に買い方が入ってくる 20090716miya
	//英語化権限 20090210miya
	//プラン読み込み s183 20150324 date
	//s183 旧プランの追加
	//購入方式が指定されていない場合
	{
		var except = "";
		var productid = H_product.tel.productid;

		if (productid != "") {
			var product_sql = "SELECT plan FROM product_tb WHERE productid=" + productid;
			var result = this.get_DB().queryOne(product_sql);

			if (result != "") {
				var A_temp = unserialize(result);

				if (true == Array.isArray(A_temp) && A_temp.length > 0) {
					except = join(",", A_temp);
				}
			}
		} else {
			var A_pid = Array();

			if (true == (undefined !== H_info.telinfo) && true == Array.isArray(H_info.telinfo)) {
				{
					let _tmp_1 = H_info.telinfo;

					for (var pky in _tmp_1) {
						var pvl = _tmp_1[pky];

						if ("" != pvl.productid) {
							A_pid.push(pvl.productid);
						}
					}
				}

				if (0 < A_pid.length) {
					product_sql = "SELECT plan FROM product_tb WHERE productid IN (" + join(",", A_pid) + ")";
					var A_result = this.get_DB().queryCol(product_sql);

					if (A_result != "") {
						var A_except = Array();

						for (var planstr of Object.values(A_result)) {
							if ("" != planstr) {
								A_temp = unserialize(planstr);

								if (true == Array.isArray(A_temp) && A_temp.length > 0) {
									A_except = array_merge(A_except, A_temp);
								}
							}
						}

						if (0 < A_except.length) {
							except = join(",", A_except);
						}
					}
				}
			}
		}

		var buyselstr = "";

		if (true == (undefined !== H_info.H_product.tel.buyselid) && is_numeric(H_info.H_product.tel.buyselid)) {
			buyselstr = " AND buyselid=" + H_info.H_product.tel.buyselid + " ";
		} else //追加 買い方が取得できていない状態なら電話管理の買い方があれば使う
			{
				if ("Nmnp" == H_info.type && true == (undefined !== H_view.H_templatevalue.purchase) && true == is_numeric(H_view.H_templatevalue.purchase)) {
					buyselstr = " AND buyselid=" + H_view.H_templatevalue.purchase + " ";
				} else {
					if (true == (undefined !== H_product.tel.buyselid) && "" != H_product.tel.buyselid) {
						buyselstr = " AND buyselid=" + H_product.tel.buyselid + " ";
					} else {
						if (undefined !== H_view.H_templatevalue.purchase && is_numeric(H_view.H_templatevalue.purchase)) {
							buyselstr = " AND buyselid=" + this.get_DB().dbQuote(H_view.H_templatevalue.purchase, "int", false);
						}
					}
				}

				if (!buyselstr && undefined !== H_info.telinfo.telno0.buyselid) {
					buyselstr = " AND buyselid=" + H_info.telinfo.telno0.buyselid + " ";
				}
			}

		if (true == eng) {
			var plannamestr = "planname_eng";
			var plannameasstr = " AS planname";
			var buyselmongonstr = "Method of Purchase\uFF1A";
			var buyselsqlstr = "bs.buyselname_eng";
		} else {
			plannamestr = "planname";
			plannameasstr = "";
			buyselmongonstr = "\u8CFC\u5165\u65B9\u5F0F\uFF1A";
			buyselsqlstr = "bs.buyselname";
		}

		this.loadOrderOldPlan(H_info.pactid);
		var oldplan = this.O_oldplan["carid" + H_info.carid];

		if ("" == buyselstr) //購入方式「選択なし」のbuyselidで引いてくる
			//$noselect_sql = "SELECT buyselid FROM buyselect_tb WHERE buyselname='選択なし' AND carid=" . $H_info["carid"];
			//$noselect_buyselid = $this->get_DB()->queryOne($noselect_sql);
			//if ("" != $noselect_buyselid) {
			//$buyselstr = " AND buyselid=" . $noselect_buyselid . " ";
			//}
			//購入方式をプラン名の後にくっつけることにした
			//地域会社は100（「地域会社無」）
			//if (!$withoutorderview)
			//            {
			//                $sql .= "AND pl.ordviewflg=TRUE ";
			//            }
			//            //  ↑直した↓    20150323date
			{
				var sql = "SELECT " + "pl.planid, pl." + plannamestr + " || ' \u3010" + buyselmongonstr + "' || " + buyselsqlstr + " ||'\u3011'" + plannameasstr + " FROM " + "plan_tb pl LEFT JOIN buyselect_tb bs ON pl.buyselid=bs.buyselid" + " WHERE " + "pl.cirid=" + H_info.cirid + " AND pl.carid=" + H_info.carid + " AND pl.arid=100 ";

				if (!withoutorderview) {
					var tmp_plan = "";

					if (!!oldplan) {
						tmp_plan = " OR pl.planid IN(" + oldplan + ")";
					}

					if (tmp_plan == "") {
						sql += "AND pl.ordviewflg=TRUE ";
					} else {
						sql += "AND (pl.ordviewflg=TRUE" + tmp_plan + ") ";
					}
				}

				if (except != "") {
					sql += "AND pl.planid NOT IN (" + except + ") ";
				}

				sql += "ORDER BY pl.buyselid, pl.sort";
			} else //地域会社は100（「地域会社無」）
			//if (!$withoutorderview)
			//            {
			//                $sql .= "AND ordviewflg=TRUE ";
			//            }
			//            //  ↑直した↓    20150323date
			{
				sql = "SELECT planid, " + plannamestr + " FROM plan_tb WHERE cirid=" + H_info.cirid + " AND carid=" + H_info.carid + buyselstr + " AND arid=100 ";

				if (!withoutorderview) //s183 旧プランの追加
					{
						tmp_plan = "";
						oldplan = this.O_oldplan["carid" + H_info.carid];

						if (!!oldplan) {
							tmp_plan = " OR planid IN (" + oldplan + ")";
						}

						if (tmp_plan == "") {
							sql += "AND ordviewflg=TRUE ";
						} else {
							sql += "AND (ordviewflg=TRUE" + tmp_plan + ") ";
						}
					}

				if (except != "") {
					sql += "AND planid NOT IN (" + except + ") ";
				}

				sql += "ORDER BY sort";
			}

		return this.get_DB().queryAssoc(sql);
	}

	getOrderPacket(H_info, H_product, eng = false) //$arid = $this->O_telinfo->getAreatoCarrier($H_info["carid"]);	// キャリアの代表地域会社
	//地域会社は100（「地域会社無」）
	//除外IDのstring
	//英語化権限 20090210miya
	//ビジネスセーバー対応 20090416miya
	//if ($add_pk != "") {
	//			$sql.= " AND (ordviewflg=TRUE OR (ordviewflg=FALSE AND packetid IN (" . $add_pk . "))) ";
	//		} else {
	//			$sql.= " AND ordviewflg=TRUE ";
	//		}
	//        //  ↑のやつだと追加めんどくさいから分解した↓    20150323 date
	{
		var arid = 100;
		var except = "";
		var productid = H_product.tel.productid;

		if (productid != "") {
			var product_sql = "SELECT packet FROM product_tb WHERE productid=" + productid;
			var result = this.get_DB().queryOne(product_sql);

			if (result != "") {
				var A_temp = unserialize(result);

				if (true == Array.isArray(A_temp) && A_temp.length > 0) {
					except = join(",", A_temp);
				}
			}
		} else {
			var A_pid = Array();

			if (true == (undefined !== H_info.telinfo) && true == Array.isArray(H_info.telinfo)) {
				{
					let _tmp_2 = H_info.telinfo;

					for (var pky in _tmp_2) {
						var pvl = _tmp_2[pky];

						if ("" != pvl.productid) {
							A_pid.push(pvl.productid);
						}
					}
				}

				if (0 < A_pid.length) {
					product_sql = "SELECT packet FROM product_tb WHERE productid IN (" + join(",", A_pid) + ")";
					var A_result = this.get_DB().queryCol(product_sql);

					if (A_result != "") {
						var A_except = Array();

						for (var packetstr of Object.values(A_result)) {
							if ("" != packetstr) {
								A_temp = unserialize(packetstr);

								if (true == Array.isArray(A_temp) && A_temp.length > 0) {
									A_except = array_merge(A_except, A_temp);
								}
							}
						}

						if (0 < A_except.length) {
							except = join(",", A_except);
						}
					}
				}
			}
		}

		if (true == eng) {
			var packetnamestr = "packetname_eng AS packetname";
		} else {
			packetnamestr = "packetname";
		}

		if (1 == H_info.carid) //ドコモのとき
			//pact_except_tbを見る。ドコモパケットパックの例外処理を行う会社として登録されていたら、ordviewflgがFALSEでもパケットパック１０、パケットパック３０を注文画面に表示する
			//disratio_tbの割引率設定は見なくてよい
			//パケットパック６０、パケットパック９０も追加 20090710miya
			{
				var ex_sql = "SELECT code FROM pact_except_tb WHERE pactid=" + H_info.pactid + " AND code='docomo_packetpack_enable'";
				var ex = this.get_DB().queryOne(ex_sql);

				if (true == 0 < ex.length) {
					var pk_sql = "SELECT packetid FROM packet_tb WHERE packetname IN ('\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\uFF11\uFF10','\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\uFF13\uFF10','\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\uFF16\uFF10','\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\uFF19\uFF10') AND arid=" + arid;
					var A_pk = this.get_DB().queryCol(pk_sql);

					if (true == 0 < A_pk.length) {
						var add_pk = join(",", A_pk);
					}
				}
			}

		var sql = "SELECT packetid, " + packetnamestr + " FROM packet_tb " + "WHERE carid=" + H_info.carid + " AND arid=" + arid + " AND cirid=" + H_info.cirid;
		var tmp_packet = "";

		if (add_pk != "") {
			tmp_packet += " OR (ordviewflg=FALSE AND packetid IN (" + add_pk + "))";
		}

		this.loadOrderOldPacket(H_info.pactid);
		var oldpacket = this.O_oldpacket["carid" + H_info.carid];

		if (!!oldpacket) {
			tmp_packet += " OR packetid IN (" + oldpacket + ")";
		}

		if (tmp_packet == "") {
			sql += " AND ordviewflg=TRUE ";
		} else {
			sql += " AND (ordviewflg=TRUE " + tmp_packet + ") ";
		}

		if (except != "") {
			sql += "AND packetid NOT IN (" + except + ") ";
		}

		sql += "ORDER BY sort";
		return this.get_DB().queryAssoc(sql);
	}

	getParentTelno(pactid, carid) {
		var sql = "SELECT prtelno, prtelname" + " FROM bill_prtel_tb" + " WHERE" + " pactid=" + pactid + " AND carid=" + carid + " ORDER BY prtelname,prtelno";
		var H_parent = this.get_DB().queryAssoc(sql);

		for (var prtelno in H_parent) {
			var prtelname = H_parent[prtelno];

			if (prtelno != prtelname) {
				H_parent[prtelno] = prtelname + " (" + prtelno + ")";
			}
		}

		return H_parent;
	}

	getRecogPost(H_g_sess, H_sess, postid, postname, H_actord = Array()) //無駄
	//承認権限ID
	//$fnc_sql = "SELECT fncid FROM function_tb WHERE ininame='fnc_mt_recog'";
	//$recogid = $this->get_DB()->queryOne($fnc_sql);
	//if ($recogid == "") {
	//return false;
	//}
	//まず自部署に承認者がいるかどうか調べる
	//ルート部署による代行注文のときは、代行先部署でチェック 20090625miya
	//承認者がいた場合
	{
		if (true == H_actord.actorder) {
			var chkpost = H_actord.curpostid;
		} else {
			chkpost = postid;
		}

		var usr_sql = "SELECT usr.userid FROM user_tb usr INNER JOIN fnc_relation_tb frel ON usr.userid = frel.userid " + "WHERE frel.fncid=" + OrderFormModel.MT_RECOGID + " AND usr.postid=" + chkpost;
		var A_uid = this.get_DB().queryCol(usr_sql);

		if (A_uid.length > 0) //ログインユーザが承認者の中にいないとき（第二階層代行注文はいないはず、$A_uidはあくまで代行先部署のuseridなので）
			{
				if (false == (-1 !== A_uid.indexOf(H_g_sess.userid))) //ルート部署による代行注文ではないときは承認部署として自部署を返す
					{
						if (true != H_actord.actorder) {
							if (!this.O_fjp.checkAuth("co") && !(undefined !== H_sess.SELF.h_recoguserid)) {
								return {
									postidto: H_g_sess.postid,
									postname: H_g_sess.postname
								};
							}
						}
					}
			}

		var sql = "SELECT recognize_tb.postidto, post_tb.postname FROM recognize_tb, post_tb WHERE recognize_tb.pactid=" + H_g_sess.pactid + " AND recognize_tb.postidfrom=" + chkpost + " AND recognize_tb.pactid=post_tb.pactid AND recognize_tb.postidto=post_tb.postid";
		return this.get_DB().queryRowHash(sql);
	}

	getRecogPostUser(H_g_sess, H_sess, postid, postname, H_actord = Array()) //まず自部署に承認者がいるかどうか調べる
	//ルート部署による代行注文のときは、代行先部署でチェック 20090625miya
	//承認者がいた場合
	//送信者一覧
	//"AND usr.mail != '' ".
	//"AND usr.mail IS NOT NULL ";
	//"AND usr.acceptmail4 = 1 ";
	{
		var select_recog_mail_flg = true;

		if (true == H_actord.actorder) {
			var chkpost = H_actord.curpostid;
		} else {
			chkpost = postid;
		}

		var usr_sql = "SELECT usr.userid FROM user_tb usr INNER JOIN fnc_relation_tb frel ON usr.userid = frel.userid " + "WHERE frel.fncid=" + OrderFormModel.MT_RECOGID + " AND usr.postid=" + chkpost;
		var A_uid = this.get_DB().queryCol(usr_sql);

		if (A_uid.length > 0) //ログインユーザが承認者の中にいないとき（第二階層代行注文はいないはず、$A_uidはあくまで代行先部署のuseridなので）
			{
				if (false == (-1 !== A_uid.indexOf(H_g_sess.userid))) //ルート部署による代行注文ではないときは承認部署として自部署を返す
					{
						if (true != H_actord.actorder) {
							if (!this.O_fjp.checkAuth("co") && !(undefined !== H_sess.SELF.h_recoguserid)) {
								var samerecog = {
									postidto: H_g_sess.postid,
									postname: H_g_sess.postname
								};
							}
						}
					}
			}

		if (undefined !== samerecog) //同じ部署に承認者がいる
			{
				var tmprecog = samerecog;
			} else //自部署承認ではなかった場合
			{
				var sql = "SELECT recognize_tb.postidto, post_tb.postname FROM recognize_tb, post_tb WHERE recognize_tb.pactid=" + H_g_sess.pactid + " AND recognize_tb.postidfrom=" + chkpost + " AND recognize_tb.pactid=post_tb.pactid AND recognize_tb.postidto=post_tb.postid";
				var uprecog = this.get_DB().queryRowHash(sql);

				if (true != H_actord.actorder) {
					if (postid == uprecog.postidto) //最終承認部署
						{
							return false;
						}
				}

				tmprecog = uprecog;
			}

		sql = "SELECT " + "usr.userid,usr.username,usr.mail,usr.acceptmail4 " + "FROM " + "user_tb usr INNER JOIN fnc_relation_tb frel ON " + "usr.userid=frel.userid AND usr.pactid=frel.pactid " + "WHERE " + "usr.postid=" + tmprecog.postidto + " " + "AND usr.pactid=" + H_g_sess.pactid + " " + "AND frel.fncid= " + OrderFormModel.MT_RECOGID + " ";
		var res = this.get_DB().queryHash(sql);
		var recog_list = {
			"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"
		};
		var recog_mail_null_flg = false;

		for (var key in res) {
			var value = res[key];

			if (value.mail == undefined || value.mail == "" || value.acceptmail4 == 0) {
				recog_list[value.userid] = "*" + value.username;
				recog_mail_null_flg = true;
			} else {
				recog_list[value.userid] = value.username;
			}
		}

		return [select_recog_mail_flg, recog_list, recog_mail_null_flg];
	}

	getPostAddr(pactid, postid) {
		var sql = "SELECT zip, addr1, addr2, building, telno FROM post_tb WHERE pactid=" + pactid + " AND postid=" + postid;
		return this.get_DB().queryRowHash(sql);
	}

	getUserInfo(pactid, userid) {
		var sql = "SELECT" + " mail" + " FROM user_tb" + " WHERE" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND userid=" + this.get_DB().dbQuote(userid, "integer", true);
		return this.get_DB().queryRowHash(sql);
	}

	getOrderComment(H_info) {
		if (false == (-1 !== ["A"].indexOf(H_info.type))) {
			var sql_str = "SELECT plancomment, packetcomment, optioncomment, accecomment FROM comment_tb " + "WHERE carid=" + H_info.carid + " AND cirid=" + H_info.cirid + " AND type='" + H_info.type + "'";
			var A_comment = this.get_DB().queryRowHash(sql_str);
		} else {
			var cirsql = "SELECT cirid FROM circuit_tb WHERE carid = " + H_info.carid;
			var A_cirid = this.get_DB().queryCol(cirsql);
			A_comment = Array();

			for (var key in A_cirid) {
				var val = A_cirid[key];
				sql_str = "SELECT plancomment, packetcomment, optioncomment, accecomment FROM comment_tb " + "WHERE carid=" + H_info.carid + " AND cirid=" + val + " AND type='" + H_info.type + "'";
				A_comment[val] = this.get_DB().RowHash(sql_str);
			}
		}

		return A_comment;
	}

	getOrderInfo(orderid, language = "JPN") //英語化 20090428miya
	//shoppoint, fixedsubtotal追加 20090224miya
	{
		if ("ENG" == language) {
			var buyselname_str = "buy.buyselname_eng AS buyselname";
		} else {
			buyselname_str = "buy.buyselname";
		}

		var ordsql = "SELECT " + "stat.forcustomer, car.carname, ord.orderid, ord.pactid, ord.postid as recogpostid, " + "ord.postname, ord.ordertype, ord.status, ord.shopid, ord.recdate, " + "ord.cirid, ord.chargername, ord.chargerid, ord.carid, ord.pointradio, ord.point, " + "ord.billradio, ord.parent, ord.billaddress, ord.dateradio, ord.datefrom, ord.dateto, " + "ord.datechangeradio, ord.datechange, ord.note, ord.sendhow, ord.sendname, ord.addr1, " + "ord.addr2, ord.sendtel, ord.reason, ord.shopnote, ord.billtotal, ord.billsubtotal, " + "ord.fee, ord.applyprice, ord.chpostid, ord.chpostname, ord.nextpostid, ord.nextpostname, " + "ord.anspost, ord.ansuser, ord.ansdate, ord.transfer, ord.buyselid, ord.applypostid, ord.applyuserid, " + "ptn.ptnname, ptn.tplfile, pa.compname, pa.userid_ini, cir.cirname, shmem.name as memname, " + "area.arid, area.arname, " + buyselname_str + ", stat.forshop, stat.forcustomer, prsi.signeddate ";
		var ordfrom = "FROM " + OrderFormModel.ORD_TB + " ord " + "INNER JOIN mt_status_tb stat ON ord.status=stat.status " + "INNER JOIN mt_order_pattern_tb ptn ON ord.ordertype=ptn.type AND ord.carid=ptn.carid AND ord.cirid=ptn.cirid " + "INNER JOIN carrier_tb car ON ord.carid=car.carid " + "LEFT JOIN mt_transfer_tb tran on ord.orderid=tran.orderid " + "LEFT JOIN " + OrderFormModel.ORD_DET_TB + " det ON ord.orderid=det.orderid " + "LEFT JOIN pact_tb pa ON ord.pactid=pa.pactid " + "LEFT JOIN circuit_tb cir ON ord.cirid=cir.cirid " + "LEFT JOIN area_tb area ON det.arid=area.arid AND ord.carid=area.carid " + "LEFT JOIN buyselect_tb buy ON ord.buyselid=buy.buyselid " + "LEFT JOIN shop_member_tb shmem ON ord.shopmemid=shmem.memid " + "LEFT JOIN post_rel_shop_info_tb prsi ON prsi.postid=ord.postid ";
		var subsql = "SELECT " + "sub.orderid, sub.ordersubid, sub.expectdate, sub.fixdate, sub.memory, sub.recovery, sub.substatus, stat.forshop, " + "stat.forsub, sub.machineflg, sub.expectflg, " + "sub.anspassprice, sub.saleprice, sub.shoppoint, sub.fixedsubtotal, sub.number ";
		var subfrom = "FROM " + OrderFormModel.ORD_TB + " ord " + "INNER JOIN mt_status_tb stat ON ord.status=stat.status " + "LEFT JOIN mt_transfer_tb tran on ord.orderid=tran.orderid " + "LEFT JOIN " + OrderFormModel.ORD_SUB_TB + " sub ON ord.orderid=sub.orderid " + (detsql = "SELECT " + "det.orderid, det.ordersubid, det.contractor, det.productid, det.productname, det.property, " + "det.planradio, det.plan, det.packetradio, det.packet, det.passwd, det.userid, det.discounttel, " + "det.machineflg, det.telno, det.option, det.registdate, det.employeecode, det.telusername, " + "det.holdername, det.kousiradio, det.kousi as kousiid, kousi.patternname as kousi, tel.simcardno, " + "det.mnpno, det.formercarid, formercar.carname as formercarname, " + "det.pay_startdate, det.pay_monthly_sum, det.pay_frequency, tel.contractdate, asts.serialno, " + "plan.planname, plan.viewflg as planview, packet.packetname, usr.username, tel.orderdate, tel.arid, area.arname, " + "tel.extensionno ");
		var detfrom = "FROM " + OrderFormModel.ORD_TB + " ord " + "LEFT JOIN mt_transfer_tb tran on ord.orderid=tran.orderid " + "LEFT JOIN " + OrderFormModel.ORD_DET_TB + " det ON ord.orderid=det.orderid " + "LEFT JOIN plan_tb plan ON det.plan=plan.planid " + "LEFT JOIN packet_tb packet ON det.packet=packet.packetid " + "LEFT JOIN user_tb usr ON det.userid=usr.userid " + "LEFT JOIN area_tb area ON det.arid=area.arid AND ord.carid=area.carid " + "LEFT JOIN kousi_pattern_tb kousi ON det.kousi=kousi.patternid " + "LEFT JOIN tel_tb tel ON det.telno=tel.telno " + "LEFT JOIN tel_rel_assets_tb tra ON tel.telno=tra.telno " + "LEFT JOIN assets_tb asts ON asts.assetsid=tra.assetsid ";
		"LEFT JOIN carrier_tb formercar ON det.formercarid=formercar.carid ";
		var where = "WHERE " + "ord.orderid=" + orderid + " ";
		var ordsub = "ORDER BY sub.detail_sort";
		var orddet = "ORDER BY det.detail_sort";
		H_data.order = this.get_DB().queryRowHash(ordsql + ordfrom + where);
		H_data.sub = this.mergeOrderData(this.get_DB().queryHash(detsql + detfrom + where + orddet), this.get_DB().queryHash(subsql + subfrom + where + ordsub));
		return H_data;
	}

	getSmartyTemplate(H_info) {
		var sql = "SELECT tplfile FROM mt_order_pattern_tb WHERE type='" + H_info.type + "' AND cirid=" + H_info.cirid + " AND carid=" + H_info.carid;
		return this.get_DB().queryOne(sql);
	}

	getRule(H_info) //英語化権限 20090210miya
	//ホットラインの場合以下の項目のチェックは不要
	//terminal_del
	{
		if (true == H_info.eng) {
			var messstr = "rule_message_eng";
		} else {
			messstr = "rule_message";
		}

		var without_str = "";

		if ("H" == PACTTYPE) {
			without_str = " AND (rule_element NOT LIKE '%terminal_del%') ";
		}

		var sql = "SELECT rule_element AS name, " + messstr + " AS mess, rule_type AS type, rule_format AS format, rule_validation AS validation, " + "rule_reset AS reset, rule_force AS force FROM mt_addrule_tb " + "WHERE type='" + H_info.type + "' AND cirid=" + H_info.cirid + " AND carid=" + H_info.carid + without_str + " ORDER BY sort;";
		return this.get_DB().queryHash(sql);
	}

	getPayCountId(carid, eng = false) //英語化対応 20090311miya
	//キャリアごとに管理
	{
		if (true == eng) {
			var c0 = "Select";
			var c1 = "Lump Sum";
			var c12 = "12 Installments";
			var c24 = "24 Installments";
			var c36 = "36 Installments";
			var cno = "Not Selected";
		} else //表記変更 20100105miya
			{
				c0 = "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
				c1 = "\u5272\u8CE6\u306A\u3057\uFF08\u4E00\u62EC\u652F\u6255\u3044\uFF09";
				c12 = "12\u56DE";
				c24 = "24\u56DE";
				c36 = "36\u56DE";
				cno = "\u9078\u629E\u306A\u3057";
			}

		switch (carid) {
			case 1:
				var A_loan = {
					"0": c0,
					"1": c1,
					"12": c12,
					"24": c24,
					"36": c36
				};
				break;

			case 2:
				A_loan = {
					"0": c0,
					"1": c1,
					"12": c12,
					"24": c24
				};
				break;

			case 3:
				A_loan = {
					"0": c0,
					"1": c1,
					"12": c12,
					"24": c24
				};
				break;

			case 4:
				A_loan = {
					"0": c0,
					"1": c1,
					"12": c12,
					"24": c24
				};
				break;

			case 15:
				A_loan = {
					"0": c0,
					"1": c1,
					"12": c12,
					"24": c24
				};
				break;

			default:
				A_loan = {
					"0": c0,
					"1": c1,
					"12": c12,
					"24": c24
				};
				break;
		}

		return A_loan;
	}

	getPriceDetail(price_detailid) {
		var sql = "SELECT pr.productname, de.productid, de.pricelistid, de.buytype1, de.buytype2, de.paycnt, de.downmoney, de.onepay, de.totalprice, de.buyselid, bs.buyselname ";
		sql += "FROM price_detail_tb de INNER JOIN product_tb pr ON de.productid = pr.productid ";
		sql += "LEFT JOIN buyselect_tb bs ON de.buyselid = bs.buyselid ";
		sql += "WHERE de.price_detailid = " + price_detailid;
		return this.get_DB().queryRowHash(sql);
	}

	getPriceDetailCoverBuysel(H_sess) {
		if (true == H_sess[OrderFormModel.PUB].eng) {
			var buyselname_str = "buyselname_eng AS buyselname";
		} else {
			buyselname_str = "buyselname";
		}

		var price_detailid = H_sess[OrderFormModel.PUB].price_detailid;
		var sql = "SELECT pr.productname, de.productid, de.pricelistid, de.buytype1, de.buytype2, de.paycnt, de.downmoney, de.onepay, de.totalprice, de.buyselid, bs." + buyselname_str + " ";
		sql += "FROM price_detail_tb de INNER JOIN product_tb pr ON de.productid = pr.productid ";
		sql += "LEFT JOIN buyselect_tb bs ON de.buyselid = bs.buyselid ";
		sql += "WHERE de.price_detailid = " + price_detailid;
		var H_detail = this.get_DB().queryRowHash(sql);

		if ("\u9078\u629E\u306A\u3057" == H_detail.buyselname && "" != H_sess[OrderFormModel.PUB].purchase && H_detail.buyselid != H_sess[OrderFormModel.PUB].purchase) {
			H_detail.buyselid = H_sess[OrderFormModel.PUB].purchase;
			H_detail.buyselname = this.get_DB().queryOne("SELECT " + buyselname_str + " FROM buyselect_tb WHERE buyselid=" + H_sess[OrderFormModel.PUB].purchase);
		}

		return H_detail;
	}

	getAcceDetail(price_detailid) {
		var sql = "SELECT pr.productname, pr.modelnumber, de.productid, de.pricelistid, de.buytype1, de.buytype2, de.paycnt, de.downmoney, de.onepay, de.totalprice, de.buyselid ";
		sql += "FROM price_detail_tb de INNER JOIN product_tb pr ON de.productid = pr.productid ";
		sql += "WHERE de.price_detailid = " + price_detailid;
		return this.get_DB().queryRowHash(sql);
	}

	getRelatedProduct(H_g_sess: {} | any[], H_sess: {} | any[], A_auth: {} | any[], productid) //セッションエラーキャッチ 20090827miya
	//// 価格表閲覧の単位を見る
	//		if(true === $this->O_Auth->chkPactFuncIni("fnc_mt_price_admin")){
	//			$price_auth_type = "fnc_mt_price_admin";
	//		}elseif(true === $this->O_Auth->chkPactFuncIni("fnc_mt_price_shop")){
	//			$price_auth_type = "fnc_mt_price_shop";
	//		}elseif(true === $this->O_Auth->chkPactFuncIni("fnc_mt_price_pact")){
	//			$price_auth_type = "fnc_mt_price_pact";
	//		}elseif(true === $this->O_Auth->chkPactFuncIni("fnc_mt_price_post")){
	//			$price_auth_type = "fnc_mt_price_post";
	//		}
	//postidが登録部署のものになるよう修正 20090722miya
	//2014-08-06 最新の価格表が取得出来なかったらmt_order_sub_tbの電話端末から価格表を取得を試みる（期限切れの価格表を取得する）
	{
		if ("" == H_sess[OrderFormModel.PUB].shopid) {
			this.errorOut(8, "OrderFormModel::getRelatedProduct  shopid\u304C\u306A\u3044\uFF08\u30D6\u30E9\u30A6\u30B6\u30D0\u30C3\u30AF/\u5225\u7A93\uFF09", false, "../Menu/menu.php");
		}

		var groupid_sql = "SELECT groupid FROM shop_tb WHERE shopid=" + H_sess[OrderFormModel.PUB].shopid;
		var groupid = this.get_DB().queryOne(groupid_sql);
		var H_acce = Array();

		if (true == is_null(H_g_sess.pactid) && false == is_null(H_sess[OrderFormModel.PUB].pactid)) {
			H_g_sess.pactid = H_sess[OrderFormModel.PUB].pactid;
		}

		var O_price = new UserPriceModel(H_g_sess.pactid, H_g_sess.postid);

		if (true == (undefined !== H_sess[OrderFormModel.PUB].applypostid)) {
			var postid = H_sess[OrderFormModel.PUB].applypostid;
		} else {
			postid = H_g_sess.postid;
		}

		var pricelistid = O_price.getPricelistID(H_sess[OrderFormModel.PUB].ppid, H_sess[OrderFormModel.PUB].shopid, groupid, price_auth_type, H_g_sess.pactid, postid);

		if (is_null(pricelistid)) {
			var sql = "SELECT pricelistid from mt_order_sub_tb where machineflg=TRUE AND orderid=" + H_sess[OrderFormModel.PUB].orderid;
			pricelistid = this.get_DB().queryOne(sql);
		}

		if (String(pricelistid != "")) //子供を取得
			//branchidがないものは表示しないようにする 20090105miya
			{
				var rel_sql = "SELECT productid FROM product_relation_tb WHERE productparentid=" + productid;
				var A_acce_productid = this.get_DB().queryCol(rel_sql);

				if (A_acce_productid.length > 0) {
					var branch_sql = "SELECT productid, branchid FROM product_branch_tb WHERE delflg = false AND productid IN (" + join(",", A_acce_productid) + ")";
					var H_branch = this.get_DB().queryAssoc(branch_sql);
					var A_acce_temp = Array();

					for (var prid of Object.values(A_acce_productid)) //要望により制限解除
					//if ("" != $H_branch[$prid]) {
					//}
					{
						A_acce_temp.push(prid);
					}

					A_acce_productid = A_acce_temp;
				}

				if (A_acce_productid.length > 0) //付属品用の購入方式ID
					//グループID取得
					//価格を取得
					//getNowPriceの中でgetPricelistIDを呼ぶために引数追加 20090722miya
					//[productid] => array(
					//[downmoney] => 値
					//[totalprice] => 値
					//[buyselid] => 値	)
					//という形で来る
					//価格表がない場合は
					//[productid] => NULL
					//商品情報取得
					//誤字訂正 bueselid->buyselid 20090327miya
					//商品情報に価格を埋め込む
					{
						var buysel_sql = "SELECT buyselid FROM buyselect_tb WHERE buyselname='\u9078\u629E\u306A\u3057' AND carid=" + H_sess[OrderFormModel.PUB].carid;
						var buyselid = this.get_DB().queryOne(buysel_sql);
						groupid_sql = "SELECT groupid FROM shop_tb WHERE shopid=" + H_sess[OrderFormModel.PUB].shopid;
						groupid = this.get_DB().queryOne(groupid_sql);
						var H_price = O_price.getNowPrice(A_acce_productid, H_sess[OrderFormModel.PUB].carid, "A", 0, 0, 1, buyselid, H_sess[OrderFormModel.PUB].shopid, groupid, price_auth_type, H_g_sess.pactid, postid);
						sql = "SELECT pr.productname, pr.modelnumber, pr.productid, " + pricelistid + " AS pricelistid, null AS buytype1, null AS buytype1, null AS paycnt, null AS downmoney, null AS onepay, null AS totalprice, null AS buyselid ";
						sql += "FROM product_tb pr ";
						sql += "WHERE pr.productid in (" + join(",", A_acce_productid) + ") AND pr.delflg=false ORDER BY pr.productname ";
						H_acce = this.get_DB().queryHash(sql);

						if (true == Array.isArray(H_acce) && 0 < H_acce.length) {
							for (var key in H_acce) {
								var A_val = H_acce[key];

								if (H_price[A_val.productid] != undefined) {
									A_val.downmoney = H_price[A_val.productid].downmoney;
									A_val.totalprice = H_price[A_val.productid].totalprice;
									A_val.buyselid = H_price[A_val.productid].buyselid;
									H_acce[key] = A_val;
								}
							}
						}
					}
			}

		return H_acce;
	}

	getRelatedProductHand(H_g_sess: {} | any[], H_sess: {} | any[], A_auth: {} | any[]) //INIファイルから手入力用のproductnameを取得
	//$H_sess[self::PUB]["carid"]に0が入ってくることがある（nullがキャストされてる？）のでif文追加 20090413miya
	{
		var H_acce = Array();

		if (true == is_numeric(H_sess[OrderFormModel.PUB].carid) && true == 0 < H_sess[OrderFormModel.PUB].carid) {
			var acce_ini = "A_order_hand_acce_" + H_sess[OrderFormModel.PUB].carid;

			if (!this.O_Set.existsKey(acce_ini)) {
				acce_ini = "A_order_hand_acce_other";
			}

			var A_hand_accename = this.O_Set[acce_ini];

			if (true == Array.isArray(A_hand_accename)) {
				for (var productname of Object.values(A_hand_accename)) {
					H_acce.push({
						productname: productname,
						modelnumber: undefined,
						productid: undefined,
						pricelistid: undefined,
						buytype1: undefined,
						buytype2: undefined,
						paycnt: undefined,
						downmoney: undefined,
						onepay: undefined,
						totalprice: undefined,
						buyselid: undefined
					});
				}
			}
		}

		return H_acce;
	}

	getPriceDetailFromOrderData(H_order: {} | any[], language = "JPN") {
		var H_tel = Array();

		if (undefined != H_order.sub[0] && true == Array.isArray(H_order.sub[0])) {
			if (H_order.sub[0].machineflg == true) //グループID取得
				//購入種別名称取得
				//英語化 20090428miya
				{
					var groupid_sql = "SELECT groupid FROM shop_tb WHERE shopid=" + H_order.order.shopid;
					var groupid = this.get_DB().queryOne(groupid_sql);

					if ("ENG" == language) {
						var buyselname_str = "buyselname_eng AS buyselname";
					} else {
						buyselname_str = "buyselname";
					}

					var buyselname = undefined;

					if (true == (undefined !== H_order.order.buyselid)) {
						var buysel_sql = "SELECT " + buyselname_str + " FROM buyselect_tb WHERE buyselid=" + H_order.order.buyselid;
						buyselname = this.get_DB().queryOne(buysel_sql);
					}

					if (true == (undefined !== H_g_sess.pactid)) {
						var O_price = new UserPriceModel(H_g_sess.pactid, H_g_sess.postid);
					} else {
						O_price = new UserPriceModel(H_order.order.pactid, H_order.order.recogpostid);
					}

					var H_price = O_price.getNowPrice(H_order.sub[0].productid, H_order.order.carid, H_order.order.ordertype, H_order.sub[0].buytype1, H_order.sub[0].buytype2, H_order.sub[0].pay_frequency, H_order.order.buyselid, H_order.order.shopid, groupid);
					H_tel = {
						productname: H_order.sub[0].productname,
						productid: H_order.sub[0].productid,
						pricelistid: undefined,
						buytype1: H_order.sub[0].buytype1,
						buytype2: H_order.sub[0].buytype2,
						paycnt: H_order.sub[0].pay_frequency,
						downmoney: H_price.downmoney,
						onepay: H_order.sub[0].pay_monthly_sum,
						totalprice: H_price.totalprice,
						buyselid: H_order.order.buyselid,
						buyselname: buyselname
					};
				}
		}

		return H_tel;
	}

	getPriceDetailFromTemplate(H_defproduct: {} | any[], shopid, pactid, recogpostid, ordertype, carid) //開発中
	//$H_tel = $this->getPriceDetailFromOrderData($H_order);
	//$H_acce = $this->
	//$H_defproduct["tel"] = $H_tel;
	//$H_defproduct["acce"] = $H_acce;
	{
		var H_tel = Array();
		var H_acce = Array();
		var H_order = Array();
		H_order.order.shopid = shopid;
		H_order.order.buyselid = H_defproduct.tel.buyselid;
		H_order.order.pactid = pactid;
		H_order.order.recogpostid = recogpostid;
		H_order.order.ordertype = ordertype;
		H_order.order.carid = carid;
		H_order.sub[0] = H_defproduct.tel;
		H_order.sub[0].machineflg = true;
		return H_defproduct;
	}

	getRelatedProductFromOrderData(H_order: {} | any[]) //グループID取得
	//付属品用の購入方式ID
	//付属品のproductidのリスト
	{
		var H_acce = Array();
		var groupid_sql = "SELECT groupid FROM shop_tb WHERE shopid=" + H_order.order.shopid;
		var groupid = this.get_DB().queryOne(groupid_sql);
		var buysel_sql = "SELECT buyselid FROM buyselect_tb WHERE buyselname='\u9078\u629E\u306A\u3057' AND carid=" + H_order.order.carid;
		var buyselid = this.get_DB().queryOne(buysel_sql);
		var A_acce_productid = Array();
		{
			let _tmp_3 = H_order.sub;

			for (var key in _tmp_3) {
				var val = _tmp_3[key];

				if (true == (undefined !== val.productid)) {
					A_acce_productid.push(val.productid);
				} else if (false == (undefined !== val.productid) && true == (undefined !== val.productname)) //productidがなくてもproductnameが入っていることはある（手入力の場合）
					{
						var handacceflg = true;
					}
			}
		}

		if (undefined != A_acce_productid && true == Array.isArray(A_acce_productid) || handacceflg == true) //現在の価格取得
			{
				if (true == (undefined !== H_g_sess.pactid)) {
					var O_price = new UserPriceModel(H_g_sess.pactid, H_g_sess.postid);
				} else {
					O_price = new UserPriceModel(H_order.order.pactid, H_order.order.recogpostid);
				}

				var H_price = O_price.getNowPrice(A_acce_productid, H_order.order.carid, "A", 0, 0, 1, buyselid, H_order.order.shopid, groupid);
				{
					let _tmp_4 = H_order.sub;

					for (var key in _tmp_4) {
						var val = _tmp_4[key];

						if (val.machineflg == false) //商品情報に埋め込む価格
							{
								var downmoney = undefined;
								var totalprice = undefined;

								if (H_price[val.productid] != undefined) {
									downmoney = H_price[val.productid].downmoney;
									totalprice = H_price[val.productid].totalprice;
								}

								H_acce.push({
									productname: val.productname,
									productid: val.productid,
									pricelistid: undefined,
									buytype1: undefined,
									buytype2: undefined,
									paycnt: undefined,
									downmoney: downmoney,
									onepay: undefined,
									totalprice: totalprice,
									saleprice: val.saleprice,
									shoppoint: val.shoppoint,
									fixedsubtotal: val.fixedsubtotal,
									property: val.property,
									buyselid: buyselid,
									buyselname: undefined
								});
							}
					}
				}
			}

		return H_acce;
	}

	getAcceProduct(H_g_sess: {} | any[], H_sess: {} | any[], A_auth: {} | any[]) //グループID取得
	//// 価格表閲覧の単位を見る
	//		if(true === $this->O_Auth->chkPactFuncIni("fnc_mt_price_admin")){
	//			$price_auth_type = "fnc_mt_price_admin";
	//		}elseif(true === $this->O_Auth->chkPactFuncIni("fnc_mt_price_shop")){
	//			$price_auth_type = "fnc_mt_price_shop";
	//		}elseif(true === $this->O_Auth->chkPactFuncIni("fnc_mt_price_pact")){
	//			$price_auth_type = "fnc_mt_price_pact";
	//		}elseif(true === $this->O_Auth->chkPactFuncIni("fnc_mt_price_post")){
	//			$price_auth_type = "fnc_mt_price_post";
	//		}
	//電話から来たとき
	{
		var groupid_sql = "SELECT groupid FROM shop_tb WHERE shopid=" + H_sess[OrderFormModel.PUB].shopid;
		var groupid = this.get_DB().queryOne(groupid_sql);

		if (true == is_null(H_g_sess.pactid) && false == is_null(H_sess[OrderFormModel.PUB].pactid)) {
			H_g_sess.pactid = H_sess[OrderFormModel.PUB].pactid;
		}

		var O_price = new UserPriceModel(H_g_sess.pactid, H_g_sess.postid);
		var pricelistid = O_price.getPricelistID(H_sess[OrderFormModel.PUB].ppid, H_sess[OrderFormModel.PUB].shopid, groupid, price_auth_type, H_g_sess.pactid, H_g_sess.postid);

		if (H_sess.SELF.acceradio == "fromtel" && String(H_sess.SELF.telno != "")) //シリーズ・機種から来たとき
			{
				var telno = H_sess.SELF.telno;
				var rel_sql = "SELECT ast.productid FROM assets_tb ast LEFT JOIN tel_rel_assets_tb rel ON ast.assetsid = rel.assetsid ";
				rel_sql += "WHERE rel.pactid= " + H_g_sess.pactid + " AND rel.carid = " + H_sess[OrderFormModel.PUB].carid + " AND rel.telno='" + telno + "'";
			} else if (H_sess.SELF.acceradio == "fromproduct" && String(H_sess.SELF.series != "" || String(H_sess.SELF.telproduct != ""))) //機種まで指定されていた場合
			{
				if (String(H_sess.SELF.telproduct != "")) //シリーズまでのみ指定されていた場合
					{
						rel_sql = "SELECT productid FROM product_relation_tb WHERE productparentid=" + H_sess.SELF.telproduct;
					} else {
					rel_sql = "SELECT productid FROM product_relation_tb WHERE productparentid IN (SELECT productid FROM product_tb WHERE seriesname='" + H_sess.SELF.series + "' AND carid=" + H_sess[OrderFormModel.PUB].carid + ")";
				}
			}

		var A_acce_productid = Array();
		var H_acce = Array();

		if (String(rel_sql != "" && String(pricelistid != ""))) {
			A_acce_productid = this.get_DB().queryCol(rel_sql);

			if (A_acce_productid.length > 0) {
				var sql = "SELECT pr.productname, pr.modelnumber, de.productid, de.pricelistid, de.buytype1, de.buytype2, de.paycnt, de.downmoney, de.onepay, de.totalprice, de.buyselid ";
				sql += "FROM price_detail_tb de INNER JOIN product_tb pr ON de.productid = pr.productid ";
				sql += "WHERE de.productid in (" + join(",", A_acce_productid) + ") AND de.pricelistid=" + pricelistid + " ORDER BY pr.productname, de.downmoney";
				H_acce = this.get_DB().queryHash(sql);
			}
		}

		return H_acce;
	}

	getProductProperty(productid) {
		var sql = "SELECT property, property ";
		sql += "FROM product_branch_tb ";
		sql += "WHERE productid = " + productid + " AND delflg = false ORDER BY branchid";
		return this.get_DB().queryAssoc(sql);
	}

	getTelProduct(H_dir) {
		var sql = "SELECT DISTINCT cirid, seriesname, productid, productname FROM product_tb WHERE seriesname != '' AND carid=" + H_dir.carid + " ORDER BY cirid, seriesname, productname";
		return this.get_DB().queryHash(sql);
	}

	checkCombination(H_sess) //英語化権限 20090331miya
	//オプション整形
	//プランとパケット、オプションとの組み合わせ
	//オプションとオプションとの組み合わせ
	{
		if (true == H_sess[OrderFormModel.PUB].eng) {
			var language = "ENG";
		} else {
			language = "JPN";
		}

		var H_result = Array();
		var H_option = Array();

		if (true == Array.isArray(H_sess.SELF.option)) {
			H_option += H_sess.SELF.option;
		}

		if (true == Array.isArray(H_sess.SELF.waribiki)) {
			H_option += H_sess.SELF.waribiki;
		}

		if (true == Array.isArray(H_sess.SELF.vodalive)) {
			H_option += H_sess.SELF.vodalive;
		}

		if (true == Array.isArray(H_sess.SELF.vodayuryo)) {
			H_option += H_sess.SELF.vodayuryo;
		}

		if (H_option != "") {
			var A_option_put = Array();
			var A_option_remove = Array();

			for (var key in H_option) {
				var val = H_option[key];

				if (String(val == "1" || String(val == "put"))) {
					A_option_put.push(key);
				} else if (String(val == "remove")) {
					A_option_remove.push(key);
				}
			}
		}

		H_result += this.O_combi.chkCombinationBuysel(H_sess.SELF.purchase, H_sess.SELF.plan, A_option_put, A_option_remove, language);
		H_result += this.O_combi.chkCombinationPlan(H_sess.SELF.plan, H_sess.SELF.packet, A_option_put, A_option_remove, language);
		H_result += this.O_combi.chkCombinationOption(A_option_put, A_option_remove, language);
		return H_result;
	}

	getPointUnit(carid) {
		var sql = "SELECT unit FROM carrier_tb WHERE carid=" + carid;
		return this.get_DB().queryOne(sql);
	}

	getShopMemberSelect(shopid) {
		var mem_sql = "SELECT name,name FROM shop_member_tb WHERE shopid=" + shopid;
		return this.get_DB().queryAssoc(mem_sql);
	}

	sendOrderMail(H_mailcontent, H_addr = Array(), from = "", fromname = "") {
		var O_mail = new MtMailUtil();
		O_mail.multiSend(H_addr, H_mailcontent.message, "", H_mailcontent.subject, fromname);
		return true;
	}

	getApplyMailSendList(pactid, postidto, language = "") //セッションエラーキャッチ 送信先がない場合は空の配列を返すようにした 20090909miya
	//メール送信用(tmp)
	//配列の重複を削除する
	//メール送信用
	{
		if ("" == pactid || "" == postidto) {
			var A_mail_list = Array();
			return A_mail_list;
		}

		var lang_str = "";

		if ("" != language) {
			lang_str = "AND usr.language='" + language + "' ";
		}

		var get_mail_sql = "SELECT " + "usr.username AS to_name, usr.mail AS to " + "FROM " + "user_tb usr INNER JOIN fnc_relation_tb frel ON " + "usr.userid=frel.userid AND usr.pactid=frel.pactid " + "WHERE " + "usr.postid=" + postidto + " " + "AND usr.pactid=" + pactid + " " + "AND frel.fncid= " + OrderFormModel.MT_RECOGID + " " + "AND usr.mail != '' AND usr.mail IS NOT NULL " + "AND usr.acceptmail4 = 1 " + lang_str + "GROUP BY " + "usr.username, usr.mail";
		var H_get_mail = this.get_DB().queryHash(get_mail_sql);
		var A_mail_list_tmp = Array();

		for (var i = 0; i < H_get_mail.length; i++) {
			var H_mailto = {
				to_name: strip_tags(H_get_mail[i].to_name),
				to: H_get_mail[i].to
			};
			A_mail_list_tmp.push(serialize(H_mailto));
		}

		A_mail_list = Array();
		A_mail_list_tmp = array_unique(A_mail_list_tmp);

		for (var key in A_mail_list_tmp) {
			var val = A_mail_list_tmp[key];
			A_mail_list.push(unserialize(val));
		}

		return A_mail_list;
	}

	getApplyMailSendByUserId(pactid, postidto, userid) //セッションエラーキャッチ 送信先がない場合は空の配列を返すようにした 20090909miya
	//メール送信用(tmp)
	//配列の重複を削除する
	//メール送信用
	{
		if ("" == pactid || "" == postidto) {
			var A_mail_list = Array();
			return A_mail_list;
		}

		var get_mail_sql = "SELECT " + "usr.username AS to_name, usr.mail AS to " + "FROM " + "user_tb usr INNER JOIN fnc_relation_tb frel ON " + "usr.userid=frel.userid AND usr.pactid=frel.pactid " + "WHERE " + "usr.postid=" + postidto + " " + "AND usr.pactid=" + pactid + " " + "AND frel.fncid= " + OrderFormModel.MT_RECOGID + " " + "AND usr.mail != '' AND usr.mail IS NOT NULL " + "AND usr.acceptmail4 = 1 " + "AND usr.userid = " + userid + " " + "GROUP BY " + "usr.username, usr.mail";
		var H_get_mail = this.get_DB().queryHash(get_mail_sql);
		var A_mail_list_tmp = Array();

		for (var i = 0; i < H_get_mail.length; i++) {
			var H_mailto = {
				to_name: strip_tags(H_get_mail[i].to_name),
				to: H_get_mail[i].to
			};
			A_mail_list_tmp.push(serialize(H_mailto));
		}

		A_mail_list = Array();
		A_mail_list_tmp = array_unique(A_mail_list_tmp);

		for (var key in A_mail_list_tmp) {
			var val = A_mail_list_tmp[key];
			A_mail_list.push(unserialize(val));
		}

		return A_mail_list;
	}

	getOrderMailSendList(H_dir) //メール送信用(tmp)
	//配列の重複を削除する
	//メール送信用
	{
		var A_mail_list_tmp = Array();
		var get_mail_sql = "SELECT mem.name AS to_name, mem.mail AS to FROM shop_member_tb mem, shop_tb shop " + "WHERE shop.shopid=" + H_dir.shopid + " " + "AND (mem.memid=shop.memid " + "OR mem.memid=" + H_dir.memid + ") " + "AND mem.mail != '' AND mem.mail IS NOT NULL";
		var H_get_mail = this.get_DB().queryHash(get_mail_sql);
		A_mail_list_tmp = Array();

		for (var i = 0; i < H_get_mail.length; i++) {
			var H_mailto = {
				to_name: strip_tags(H_get_mail[i].to_name),
				to: H_get_mail[i].to
			};
			A_mail_list_tmp.push(serialize(H_mailto));
		}

		var A_mail_list = Array();
		A_mail_list_tmp = array_unique(A_mail_list_tmp);

		for (var key in A_mail_list_tmp) {
			var val = A_mail_list_tmp[key];
			A_mail_list.push(unserialize(val));
		}

		return A_mail_list;
	}

	getReceiptMailSendList(userid, posttreestr = "", loginname) //メール送信用
	{
		var A_mail_list_forcustomer = Array();

		if ("" != userid) //自分のメール取得
			//販売店からのメールを受け取る設定のみメールアドレスを入れる
			{
				var get_selfmail_sql = "SELECT user_tb.mail, user_tb.acceptmail5 FROM user_tb WHERE userid=" + userid;
				var H_selfmail = this.get_DB().queryRowHash(get_selfmail_sql);

				if (H_selfmail.mail != "" && H_selfmail.acceptmail5 == 1) {
					var H_mail_tmp = {
						to_name: posttreestr + " " + loginname,
						to: H_selfmail.mail
					};
					A_mail_list_forcustomer.push(H_mail_tmp);
				}
			}

		return A_mail_list_forcustomer;
	}

	getSignedWarnMailSendList(H_dir, H_g_sess, rootpostid) //メール送信用
	//ショップ管理者
	//KCSだったらルートの担当者/第二階層の担当者
	//HotlineだったらHLの担当者
	//キャリアで区別はしない
	{
		var H_mail = Array();
		var sql = "SELECT mail AS to, name AS to_name FROM shop_member_tb WHERE type='SU' AND shopid=" + H_dir.shopid;
		var H_shopadminmail = this.get_DB().queryRow(sql);
		sql = "SELECT mail AS to, name AS to_name FROM shop_member_tb  WHERE memid IN " + "(SELECT DISTINCT memid FROM shop_relation_tb WHERE shopid=" + H_dir.shopid + " AND postid=" + rootpostid + " AND mail != '" + H_shopadminmail.to + "')";
		H_mail = this.get_DB().queryHash(sql);

		if (true == Array.isArray(H_mail) && 0 < H_mail.length) {
			H_mail.push({
				to: H_shopadminmail.to,
				to_name: H_shopadminmail.to_name
			});
		}

		return H_mail;
	}

	orderMailWrite(mailtype, H_mailparam, shopid = "", language = "JPN") //使用パラメータ
	//発注種別
	//キャリア
	//回線種別
	//作業部署
	//申請元部署
	//発注会社名
	//受付番号
	//キャリアと回線種別
	//不明の場合は空白
	//同上
	//受付番号桁揃え
	//振り分け
	//apply		:	申請（次の承認者へ飛ぶ）
	//order		:	発注（販売店の代表メールアドレスと担当者に飛ぶ）
	//receipt		:	販売店側受付（最終承認者と申請者に飛ぶ）
	//complete		:	完了（最終承認者と申請者に飛ぶ）
	//applycancell	:	承認中キャンセル（申請元の部署に飛ぶ）
	//ordercancell	:	発注中キャンセル（最終承認者と申請者に飛ぶ）
	//グループID取得
	//KCSはURL変更なしとのこと
	//別ドメイン対応で条件追加 20090819miya
	{
		var type = H_mailparam.type;
		var carid = H_mailparam.carid;
		var cirid = H_mailparam.cirid;
		var postname = H_mailparam.postname;
		var applypostname = H_mailparam.applypostname;
		var compname = H_mailparam.compname;
		var orderid = H_mailparam.orderid;
		var carstr = "";
		var cirstr = "";
		var get_car_cir_sql = "SELECT " + "carrier_tb.carname, circuit_tb.cirname FROM carrier_tb,circuit_tb " + "WHERE carrier_tb.carid=" + carid + " " + "AND circuit_tb.cirid=" + cirid;
		var H_car_cir = this.get_DB().queryRowHash(get_car_cir_sql);

		if (carid == 99) {
			carstr = "";
		} else {
			carstr = H_car_cir.carname;
		}

		if (cirid == 0) {
			cirstr = "";
		} else {
			cirstr = H_car_cir.cirname;
		}

		var orderidstr = str_pad(orderid, 10, "0", STR_PAD_LEFT);

		if ("" != shopid) {
			var groupid_sql = "SELECT groupid FROM shop_tb WHERE shopid=" + shopid;
			var groupid = this.get_DB().queryOne(groupid_sql);
		}

		var O_conf = MtSetting.singleton();
		O_conf.loadConfig("group");

		if (true == O_conf.existsKey("groupid" + groupid + "_is_original_domain") && true == O_conf["groupid" + groupid + "_is_original_domain"]) {
			var original_domain = true;
		} else {
			original_domain = false;
		}

		var groupname = this.O_group.getGroupName(groupid);
		var systemname = this.getSystemName(groupid, language, H_mailparam.pacttype);
		var usernamesql = "SELECT username FROM user_tb WHERE userid=(SELECT applyuserid FROM mt_order_tb WHERE orderid=" + this.get_DB().dbQuote(orderid, "int", true) + ")";
		var applyusername = this.get_DB().queryOne(usernamesql);
		var url = "https://" + _SERVER.SERVER_NAME + "/" + groupname + "/\n";
		var url_shop = "https://" + _SERVER.SERVER_NAME + "/" + groupname + "/index_shop.php\n";

		if (1 >= groupid || true == original_domain) {
			url = "https://" + _SERVER.SERVER_NAME + "/\n";
			url_shop = "https://" + _SERVER.SERVER_NAME + "/index_shop.php\n";
		}

		if ("H" == PACTTYPE) //$systemname = "KCS Hotline";	// KCS以外のグループだと「KCS Hotline」はおかしいので「KCS」を抜いた 20090130miya
			//KCS以外はURL変える 20090514miya
			//別ドメイン対応で条件追加 20090819miya
			{
				systemname = "Hotline";

				if (1 == groupid || true == original_domain) {
					url = "https://" + _SERVER.SERVER_NAME + "/Hotline/index.php\n";
				} else {
					url = "https://" + _SERVER.SERVER_NAME + "/" + groupname + "/hotline.php\n";
				}
			}

		if (mailtype == "apply") //発注種別
			//却下（申請部署へ飛ぶ）
			{
				if ("ENG" == language) {
					var typestr = "";
					var type_sql = "SELECT usertypename_eng FROM mt_order_pattern_tb WHERE carid=" + carid + " AND cirid=" + cirid + " AND type='" + type + "'";
					typestr = this.get_DB().queryOne(type_sql);
					var subject = systemname + "\uFF1A" + typestr + " (" + postname + ")";
					var message = "<< " + systemname + " : " + typestr + " >>\n";
					message += "-------------------------------------------------------------\n";
					message += "A " + typestr + " application has been transmitted from " + postname + " " + applyusername + ".\n";
					message += "\n";
					message += "Please access " + systemname + " website to confirm the details.\n";
					message += "\n";
					message += url;
					message += "-------------------------------------------------------------\n";
					message += "Please do not directly respond to this email.";
				} else {
					typestr = "";
					type_sql = "SELECT usertypename FROM mt_order_pattern_tb WHERE carid=" + carid + " AND cirid=" + cirid + " AND type='" + type + "'";
					typestr = this.get_DB().queryOne(type_sql);
					subject = systemname + "\uFF1A" + typestr + "\u306E\u7533\u8ACB\uFF08" + postname + "\uFF09";
					message = "<< " + systemname + " : " + typestr + "\u306E\u7533\u8ACB >>\n";
					message += "-------------------------------------------------------------\n";
					message += postname + "\u306E" + applyusername + "\u304B\u3089" + typestr + "\u306E\u7533\u8ACB\u304C\u5C4A\u3044\u305F\u3053\u3068\u3092\u304A\u77E5\u3089\u305B\u3057\u307E\u3059\u3002\n";
					message += "\n";

					if (true === this.O_Auth.chkPactFuncIni("fnc_fjp_co")) {
						message += "\uFF1C\u627F\u8A8D\u51E6\u7406\u306E\u304A\u9858\u3044\uFF1E\n";
						message += "FJP \u56DE\u7DDA\u7BA1\u7406\u30B5\u30FC\u30D3\u30B9\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3001\u4E0B\u8A18\u624B\u9806\u306B\u3066\u51E6\u7406\u3092\u304A\u9858\u3044\u3057\u307E\u3059\u3002\n";
						message += "(1)\u300C\u3054\u6CE8\u6587\u300D\u21D2\u300C\u627F\u8A8D\u300D\u21D2\u753B\u9762\u4E0A\u306E\u627F\u8A8D\u5F85\u3061\uFF08\u5E79\u90E8\u793E\u54E1\u627F\u8A8D\u5F85\u3061\uFF09\u7533\u8ACB\u3092\u78BA\u8A8D\n";
						message += "(2)\u53D7\u4ED8\u756A\u53F7\u6B04\u306E\u300C\u627F\u8A8D\u56DE\u7B54\u300D\u21D2\u4F9D\u983C\u5185\u5BB9\u3092\u78BA\u8A8D\n";
						message += "(3)\u753B\u9762\u4E0B\u90E8\u306E\u300C\u627F\u8A8D\u300D\u300C\u4FDD\u7559\u300D\u300C\u5374\u4E0B\u300D\u306E\u3044\u305A\u308C\u304B\u3092\u9078\u629E\u21D2\u300C\u78BA\u8A8D\u753B\u9762\u3078\u300D\n";
						message += "(4)\u753B\u9762\u4E0B\u90E8\u306E\u300C\u627F\u8A8D\u30FB\u56DE\u7B54\u300D\n";
					} else {
						var sql = "select userid_ini from pact_tb where pactid=" + H_mailparam.pactid;
						var userid_ini = this.get_DB().queryOne(sql);
						message += systemname + "\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u3001\u8A73\u7D30\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n";
						message += "(" + H_mailparam.orderid + userid_ini + ")\n";
					}

					message += "\n";
					message += url;
					message += "-------------------------------------------------------------\n";
					message += "\u306A\u304A\u3001\u672C\u30E1\u30FC\u30EB\u306F\u914D\u4FE1\u5C02\u7528\u3067\u3059\u3002\u3053\u306E\u30E1\u30FC\u30EB\u306B\u5BFE\u3057\u3066\u8FD4\u4FE1\u3057\u306A\u3044\u3088\u3046\u304A\u9858\u3044\u3057\u307E\u3059\u3002";
				}
			} else if (mailtype == "cancel") //発注（販売店の代表メールアドレスと担当者に飛ぶ）
			{
				if ("ENG" == language) {
					typestr = "";
					type_sql = "SELECT usertypename_eng FROM mt_order_pattern_tb WHERE carid=" + carid + " AND cirid=" + cirid + " AND type='" + type + "'";
					typestr = this.get_DB().queryOne(type_sql);
					subject = systemname + "\uFF1A" + typestr + " Canceled (" + applypostname + ")";
					message = "<< " + systemname + " : " + typestr + " Canceled >>\n";
					message += "-------------------------------------------------------------\n";
					message += "A " + typestr + " application from " + applypostname + " has been canceled.\n";
					message += "\n";
					message += "Please access " + systemname + " website to confirm the details.\n";
					message += "\n";
					message += url;
					message += "-------------------------------------------------------------\n";
					message += "Please do not directly respond to this email.";
				} else {
					typestr = "";
					type_sql = "SELECT usertypename FROM mt_order_pattern_tb WHERE carid=" + carid + " AND cirid=" + cirid + " AND type='" + type + "'";
					typestr = this.get_DB().queryOne(type_sql);
					subject = systemname + "\uFF1A" + typestr + "\u306E\u7533\u8ACB\u53D6\u6D88\uFF08" + applypostname + "\uFF09";
					message = "<< " + systemname + " : " + typestr + "\u306E\u7533\u8ACB\u53D6\u6D88 >>\n";
					message += "-------------------------------------------------------------\n";
					message += applypostname + "\u304B\u3089\u306E" + typestr + "\u306E\u7533\u8ACB\u304C\u53D6\u308A\u6D88\u3055\u308C\u307E\u3057\u305F\u3002\n";
					message += "\n";
					message += systemname + "\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u3001\u8A73\u7D30\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n";
					message += "\n";
					message += url;
					message += "-------------------------------------------------------------\n";
					message += "\u306A\u304A\u3001\u672C\u30E1\u30FC\u30EB\u306F\u914D\u4FE1\u5C02\u7528\u3067\u3059\u3002\u3053\u306E\u30E1\u30FC\u30EB\u306B\u5BFE\u3057\u3066\u8FD4\u4FE1\u3057\u306A\u3044\u3088\u3046\u304A\u9858\u3044\u3057\u307E\u3059\u3002";
				}
			} else if (mailtype == "order") //発注種別
			//解約は回線種別を表示しない
			//販売店側受付（最終承認者と申請者に飛ぶ）
			{
				typestr = "";
				type_sql = "SELECT ordersubject FROM mt_order_pattern_tb WHERE carid=" + carid + " AND cirid=" + cirid + " AND type='" + type + "'";
				typestr = this.get_DB().queryOne(type_sql);

				if ("D" == type) {
					cirstr = "";
				}

				var datetostr = str_replace(" 00:00", "", dateto.substr(0, 16));
				var datefromstr = str_replace(" 00:00", "", datefrom.substr(0, 16));
				var datechangestr = str_replace(" 00:00", "", datechange.substr(0, 16));
				subject = "[" + compname + "]" + orderidstr + "/" + carstr + " " + typestr + "/" + systemname;
				message = "<< " + systemname + " : " + typestr + " >>\n";
				message += "-------------------------------------------------------------\n";
				message += typestr + "\u304C\u5C4A\u3044\u305F\u3053\u3068\u3092\u304A\u77E5\u3089\u305B\u3057\u307E\u3059\u3002\n";
				message += "-------------------------------------------------------------\n";
				message += "\u4F1A\u793E : " + compname + "\n";
				message += "\u767B\u9332\u90E8\u7F72 : " + applypostname + "\n";
				message += "-------------------------------------------------------------\n";
				message += carstr + " " + typestr + " " + cirstr + "\n";
				message += "-------------------------------------------------------------\n";
				message += systemname + "\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u3001\u8A73\u7D30\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n";
				message += "\n";
				message += url_shop;
				message += "-------------------------------------------------------------\n";
			} else if (mailtype == "receipt") //証明書警告メール（販売店の代表メールアドレスと担当者に飛ぶ） 20100608miya
			{
				if ("ENG" == language) //発注種別
					{
						typestr = "";
						typestr = "";
						type_sql = "SELECT returnsubject_eng FROM mt_order_pattern_tb WHERE carid=" + carid + " AND cirid=" + cirid + " AND type='" + type + "'";
						typestr = this.get_DB().queryOne(type_sql);
						subject = systemname + "\uFF1A" + typestr + " has been received (" + orderidstr + ")";
						message = "<< " + systemname + " : Shop Reception Completed >>\n";
						message += "-------------------------------------------------------------\n";
						message += "A " + typestr + " has been received by the shop.\n";
						message += "\n";
						message += "Please access the " + systemname + " website to confirm the details.\n";
						message += "Order ID is " + orderidstr + ".\n";
						message += "\n";
						message += url;
						message += "-------------------------------------------------------------\n";
						message += "Please do not directly respond to this email.";
					} else //発注種別
					{
						typestr = "";
						typestr = "";
						type_sql = "SELECT returnsubject FROM mt_order_pattern_tb WHERE carid=" + carid + " AND cirid=" + cirid + " AND type='" + type + "'";
						typestr = this.get_DB().queryOne(type_sql);
						subject = systemname + "\uFF1A" + typestr + "\u3092\u53D7\u3051\u4ED8\u3051\u307E\u3057\u305F\uFF08" + orderidstr + "\uFF09";
						message = "<< " + systemname + " : \u8CA9\u58F2\u5E97\u53D7\u4ED8\u306E\u304A\u77E5\u3089\u305B >>\n";
						message += "-------------------------------------------------------------\n";
						message += typestr + "\u3092\u53D7\u3051\u4ED8\u3051\u307E\u3057\u305F\u3053\u3068\u3092\u304A\u77E5\u3089\u305B\u3057\u307E\u3059\u3002\n";
						message += "\n";
						message += systemname + "\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u3001\u8A73\u7D30\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n";
						message += "\u53D7\u4ED8\u756A\u53F7\u306F " + orderidstr + " \u3067\u3059\u3002\n";
						message += "\n";
						message += url;
						message += "-------------------------------------------------------------\n";
						message += "\u306A\u304A\u3001\u672C\u30E1\u30FC\u30EB\u306F\u914D\u4FE1\u5C02\u7528\u3067\u3059\u3002\u3053\u306E\u30E1\u30FC\u30EB\u306B\u5BFE\u3057\u3066\u8FD4\u4FE1\u3057\u306A\u3044\u3088\u3046\u304A\u9858\u3044\u3057\u307E\u3059\u3002";
					}
			} else if (mailtype == "signedwarn") {
			subject = "[" + compname + "]" + systemname + " \u8A3C\u660E\u66F8\u8B66\u544A";
			message = "<< " + systemname + " : \u8A3C\u660E\u66F8\u8B66\u544A>>\n";
			message += "-------------------------------------------------------------\n";
			message += "\u4F1A\u793E : " + compname + "\n";
			message += "\u767B\u9332\u90E8\u7F72 : " + applypostname + "\n";
			message += "-------------------------------------------------------------\n";
			message += H_mailparam.signed_warn;
			message += systemname + "\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u3001\u8A73\u7D30\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n";
			message += "\n";
			message += url_shop;
			message += "-------------------------------------------------------------\n";
		}

		var H_mailcontent = {
			subject: subject,
			message: message
		};
		return H_mailcontent;
	}

	makeSignedWarn(H_sd = Array()) //第一証明書
	{
		var nowtime = Date.now() / 1000;
		var signed_warn = "";

		if ("keep" == H_sd.signedget) {
			if (undefined != H_sd.signeddate && nowtime > strtotime(H_sd.signeddate)) {
				signed_warn += "\u7B2C\u4E00\u8A3C\u660E\u66F8\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059\n";
			}
		} else if ("anytime" == H_sd.signedget) {
			signed_warn += "\u7B2C\u4E00\u8A3C\u660E\u66F8\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\n";
		}

		if ("keep" == H_sd.idv_signedget) {
			if (undefined != H_sd.idv_signeddate_0 && nowtime > strtotime(H_sd.idv_signeddate_0)) {
				signed_warn += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(1)\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059\n";
			}

			if (undefined != H_sd.idv_signeddate_1 && nowtime > strtotime(H_sd.idv_signeddate_1)) {
				signed_warn += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(2)\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059\n";
			}

			if (undefined != H_sd.idv_signeddate_2 && nowtime > strtotime(H_sd.idv_signeddate_2)) {
				signed_warn += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(3)\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059\n";
			}

			if (undefined != H_sd.idv_signeddate_3 && nowtime > strtotime(H_sd.idv_signeddate_3)) {
				signed_warn += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(4)\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059\n";
			}

			if (undefined != H_sd.idv_signeddate_4 && nowtime > strtotime(H_sd.idv_signeddate_4)) {
				signed_warn += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(5)\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059\n";
			}

			if (undefined != H_sd.idv_signeddate_5 && nowtime > strtotime(H_sd.idv_signeddate_5)) {
				signed_warn += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(6)\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059\n";
			}

			if (undefined != H_sd.idv_signeddate_6 && nowtime > strtotime(H_sd.idv_signeddate_6)) {
				signed_warn += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(7)\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059\n";
			}

			if (undefined != H_sd.idv_signeddate_7 && nowtime > strtotime(H_sd.idv_signeddate_7)) {
				signed_warn += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(8)\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059\n";
			}

			if (undefined != H_sd.idv_signeddate_8 && nowtime > strtotime(H_sd.idv_signeddate_8)) {
				signed_warn += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(9)\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059\n";
			}

			if (undefined != H_sd.idv_signeddate_9 && nowtime > strtotime(H_sd.idv_signeddate_9)) {
				signed_warn += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(10)\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059\n";
			}
		} else if ("anytime" == H_sd.idv_signedget) {
			signed_warn += "\u7B2C\u4E8C\u8A3C\u660E\u66F8\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\n";
		}

		return signed_warn;
	}

	getSignedDate(H_g_sess, H_sess, rootpostid) {
		var prsi_sql = "SELECT signedget, signeddate, idv_signedget, " + "idv_signeddate_0, idv_signeddate_1, idv_signeddate_2, idv_signeddate_3, idv_signeddate_4, idv_signeddate_5, idv_signeddate_6, idv_signeddate_7, idv_signeddate_8, idv_signeddate_9" + " FROM post_rel_shop_info_tb WHERE pactid=" + H_g_sess.pactid + " AND postid=" + rootpostid + " AND shopid=" + H_sess[OrderFormModel.PUB].shopid;
		var H_sd = this.get_DB().queryRowHash(prsi_sql);
		return H_sd;
	}

	getUserLanguage(userid) {
		var sql = "SELECT language FROM user_tb WHERE userid=" + userid;
		var language = this.get_DB().queryOne(sql);
		return language;
	}

	settingOrderMail(O_post, H_g_sess, H_sess, A_auth, H_view, H_mailparam) //自動承認対応時にクラス化 20101129iga
	//発注メール
	//ルート部署非表示権限がある会社で、自分がルート部署でなければ第二階層の部署を取得
	{
		var H_addr = Array();
		var from = "";
		var from_name = this.getSystemName(H_g_sess.groupid, H_g_sess.language, H_mailparam.pacttype);
		H_addr = Array();
		H_addr = this.getOrderMailSendList(H_sess[OrderFormModel.PUB]);

		if (Array() != H_addr) {
			var H_mailcontent = this.orderMailWrite("order", H_mailparam, H_sess[OrderFormModel.PUB].shopid, "JPN");
			this.sendOrderMail(H_mailcontent, H_addr, from, from_name);
		}

		var mail = this.getReceiveOrderMail(H_g_sess.pactid, H_g_sess.userid, H_view.posttreestr, H_g_sess.loginname, H_sess.SELF.chargermail);

		if (!!mail) {
			H_addr = [mail];
			H_mailcontent = this.orderMailWrite("receipt", H_mailparam, H_sess[OrderFormModel.PUB].shopid, H_g_sess.language);
			this.sendOrderMail(H_mailcontent, H_addr, from, from_name);
		}

		var rootpostid = O_post.getRootPostid(H_g_sess.pactid);

		if (true == (-1 !== A_auth.indexOf("fnc_not_view_root")) && H_g_sess.postid != rootpostid) {
			rootpostid = O_post.getTargetRootPostid(H_g_sess.pactid, H_g_sess.postid, "post_relation_tb", 2);
		}

		var H_sd = this.getSignedDate(H_g_sess, H_sess, rootpostid);
		var signed_warn = this.makeSignedWarn(H_sd);
		H_mailparam.signed_warn = signed_warn;

		if ("" != signed_warn) {
			H_addr = Array();
			H_addr = this.getSignedWarnMailSendList(H_sess[OrderFormModel.PUB], H_g_sess, rootpostid);
			H_mailcontent = this.orderMailWrite("signedwarn", H_mailparam, H_sess[OrderFormModel.PUB].shopid, "JPN");
			this.sendOrderMail(H_mailcontent, H_addr, from, from_name);
		}
	}

	getReceiveOrderMail(pactid, userid, poststr, name, mail) {
		if (!userid) {
			return Array();
		}

		var O_user = new UserModel();
		O_user.initialize(pactid, userid);

		if (!!mail && O_user.receiveMailFromShop()) {
			return {
				to_name: poststr + " " + name,
				to: mail
			};
		}

		return Array();
	}

	getOrderStatus(orderid) {
		var sql = "SELECT status FROM mt_order_tb WHERE orderid=" + orderid;
		return this.get_DB().queryOne(sql);
	}

	getNotExistsTels(telinfo) {
		var i = 0;
		var result = Array();

		for (var val of Object.values(telinfo)) {
			if (!(undefined !== val.carid)) {
				result.push(i);
			}

			i++;
		}

		return result;
	}

	setMiscType(groupid, language, H_dir) //レベルが低い方から処理 追加より削除の方が高位
	{
		var actorder = false;

		if (!(undefined !== H_dir.orderid) || !H_dir.orderid) {
			if (true == ereg("MTActorder", getcwd())) {
				actorder = true;
			}
		} else {
			var sql = "SELECT actorder FROM mt_order_tb WHERE orderid=" + this.get_DB().dbQuote(H_dir.orderid, "int", true);
			actorder = this.get_DB().queryOne(sql);
		}

		if (!is_numeric(groupid) && undefined !== H_dir.orderid && !!H_dir.orderid) {
			sql = "SELECT groupid FROM pact_tb WHERE pactid = (" + "SELECT pactid FROM mt_order_tb WHERE orderid=" + this.get_DB().dbQuote(H_dir.orderid, "int", true) + ")";
			groupid = this.get_DB().queryOne(sql);
		}

		if ("ENG" == language) {
			var filename = KCS_DIR + "/conf_sync/order_misc_eng.ini";
		}

		if (!filename || !file_exists(filename)) {
			filename = KCS_DIR + "/conf_sync/order_misc.ini";

			if (!file_exists(filename)) {
				this.errorOut(8, "OrderFormModel::setMiscType  \u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u304C\u306A\u3044", false, "../Menu/menu.php");
			}
		}

		var inifile = parse_ini_file(filename);
		adds[1] = adds[2] = adds[3] = dels[1] = dels[2] = dels[3] = Array();

		for (var key in inifile) {
			var val = inifile[key];
			var level = 0;

			if (preg_match("/^A_add/", key)) //条件数をレベルとして扱い、保存する
				{
					level = this.extractMiscType(key.replace(/^A_add_/g, ""), groupid, H_dir.carid, actorder);

					if (0 < level) {
						adds[level].push(val.split(","));
					}
				} else if (preg_match("/^A_del/", key)) {
				level = this.extractMiscType(key.replace(/^A_del_/g, ""), groupid, H_dir.carid, actorder);

				if (0 < level) {
					dels[level].push(val.split(","));
				}
			}
		}

		var base = inifile.A_misctype.split(",");

		for (var item of Object.values(base)) {
			if (undefined !== nullkey) {
				material[item] = item;
			} else {
				material[""] = item;
				var nullkey = true;
			}
		}

		for (var i = 1; i <= 3; i++) //追加
		//削除
		{
			for (var addItems of Object.values(adds[i])) {
				for (var add of Object.values(addItems)) {
					if (!(undefined !== material[add])) {
						material[add] = add;
					}
				}
			}

			for (var delItems of Object.values(dels[i])) {
				for (var del of Object.values(delItems)) {
					if (undefined !== material[del]) {
						delete material[del];
					}
				}
			}
		}

		return material;
	}

	extractMiscType(key, groupid, carid, actorder) //指定条件数とマッチした回数が同じならレベルとして返す
	{
		var grp = "group" + groupid;
		var car = "carrier" + carid;
		var ord = "order";

		if (true === actorder) {
			ord = "act";
		}

		var branch = key.split("_");
		var cnt = 0;

		if (-1 !== branch.indexOf(grp)) {
			cnt++;
		}

		if (-1 !== branch.indexOf(car)) {
			cnt++;
		}

		if (-1 !== branch.indexOf(ord)) {
			cnt++;
		}

		var result = 0;

		if (COUNT(branch) == cnt) {
			result = cnt;
		}

		return result;
	}

	preCheckAccQuant(H_sess) {
		if ("A" != H_sess.type) {
			return false;
		}

		var temp = Array();

		if (undefined !== H_sess.H_product.acce) {
			for (var val of Object.values(H_sess.H_product.acce)) {
				temp.push("acce" + val.productid);
			}
		}

		if (undefined !== H_sess.free_acce) {
			{
				let _tmp_5 = H_sess.free_acce;

				for (var key in _tmp_5) {
					var val = _tmp_5[key];
					temp.push("free_acce" + key);
				}
			}
		}

		if (temp != Array()) {
			var result = temp.join(",");
			return result;
		}

		return false;
	}

	getBillDefault(O_view, pactid) {
		var billModel = this.getBillModel(O_view);
		return billModel.getDefaultBill(pactid);
	}

	getCompAddr(O_view) {
		var sql = "SELECT compname AS billname, crg_post AS billpost, chargername AS receiptname, " + "zip, addr1, addr2, building, telno AS billtel " + "FROM " + "pact_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(O_view.gSess().pactid, "int", true);
		var language = O_view.gSess().language;

		if (is_null(language)) {
			language = "JPN";
		}

		var data = this.get_DB().queryRowHash(sql);
		data.zip1 = data.zip.replace(/-[0-9]{4}$/g, "");
		data.zip2 = data.zip.replace(/^[0-9]{3}-/g, "");
		data.billhowview = O_view.getBillView().getLangLists(["billhow", "misc", language]);
		data.billhow = "misc";
		return data;
	}

	getMtOrderTeldetailMailAddressList(orderid, pactid) {
		var sql1 = "select col from management_property_tb where ordviewflg = true and mid = 1 and col like 'mail%' and pactid = " + this.get_DB().dbQuote(pactid, "int", true);
		var cols = this.get_DB().queryCol(sql1);
		var col = "mot.telno, mot.telusername, mot.employeecode, mot.mail, mo.postname";

		if (!!cols) //$col = $col . "," . implode(",", $cols);
			{
				var mailsCol = "";

				for (var c of Object.values(cols)) {
					mailsCol += ", CASE WHEN mot." + c + " is null THEN t." + c + " ELSE mot." + c + " END as " + c;
				}

				col += mailsCol;
			}

		var sql2 = "select " + col + " from mt_order_tb mo " + "inner join mt_order_teldetail_tb mot on (mo.orderid = mot.orderid) " + "left join tel_tb t on (t.telno = mot.telno and mo.carid = t.carid and mo.pactid = t.pactid) " + "where mot.mail is not null and mot.orderid = " + this.get_DB().dbQuote(orderid, "int", true);
		return this.get_DB().queryHash(sql2);
	}

	getOrderMailTemplate(userid) //メールテンプレートの取得
	{
		var sql = "select * from user_mail_template_tb where userid = " + this.get_DB().dbQuote(userid, "int", true);
		var data = this.get_DB().queryHash(sql);

		if (!data) //初期値
			{
				var tpl = "<POST>\n<USER>\n<ORDERUSER>";
			} else {
			tpl = data[0].mail_template;
		}

		return tpl;
	}

	orderMailSend(H_g_sess, toDatas, ccDatas, mailData, userdata) //本文で置換する項目
	//企業別の追加ccアドレスを取得
	{
		var target = ["<POST>", "<USER>", "<ORDERUSER>"];
		var O_mail = new MtMailUtil();
		var ini = parse_ini_file(KCS_DIR + "/conf_sync/order_fin_mail_pact_cc.ini");
		var pactid = H_g_sess.pactid;
		var pactCc = Array();
		var from = mailData.from;
		var from_name = mailData.name;
		var subj = undefined;

		if (!!ini && (!!pactid && pactid != 0)) {
			if (undefined !== ini["pact_cc_add_" + pactid]) {
				var pactCcStr = ini["pact_cc_add_" + pactid];
				pactCc = pactCcStr.split(",");
			}

			if (undefined !== ini["mail_from_" + pactid]) {
				from = ini["mail_from_" + pactid];
			}

			if (undefined !== ini["mail_from_name_" + pactid]) {
				from_name = ini["mail_from_name_" + pactid];
			}

			if (undefined !== ini["mail_subj_" + pactid]) {
				subj = ini["mail_subj_" + pactid];
			}
		}

		for (var key in toDatas) //配列初期化
		//toが空の場合は、飛ばす
		{
			var to = toDatas[key];
			var A_to = Array();

			if (!!to) //toの設定
				//ccの設定
				//本文を置換する
				//メール送信実行
				//templateを更新する
				{
					A_to.push({
						type: "To",
						mail: to,
						name: ""
					});

					if (undefined !== ccDatas[key]) {
						{
							let _tmp_6 = ccDatas[key];

							for (var key2 in _tmp_6) {
								var cc = _tmp_6[key2];
								A_to.push({
									type: "Cc",
									mail: cc,
									name: ""
								});
							}
						}
					}

					if (!!pactCc) {
						for (var pcc of Object.values(pactCc)) {
							A_to.push({
								type: "Cc",
								mail: pcc,
								name: ""
							});
						}
					}

					var messageData = Array();

					if (undefined !== userdata[key]) {
						messageData.push(userdata[key].postname);
						messageData.push(!userdata[key].telusername ? to : userdata[key].telusername);
					} else {
						messageData.push("");
						messageData.push("");
					}

					messageData.push(mailData.name);
					var message = str_replace(target, messageData, mailData.tpl);
					message = preg_replace(["/\r\n/", "/\r/", "/\n/"], "\n", message);
					O_mail.multiSend2(A_to, message, from, subj, from_name);
					this.updateUserMailTpl(H_g_sess.userid, mailData.tpl);
				}
		}
	}

	updateUserMailTpl(userid, tpl = "") {
		var sql;
		var select = sql = "select * from user_mail_template_tb where userid = " + this.get_DB().dbQuote(userid, "int", true);
		var data = this.get_DB().queryHash(select);

		if (!data) {
			sql = "insert into user_mail_template_tb (userid, mail_template) values (" + this.get_DB().dbQuote(userid, "int", true) + ", " + this.get_DB().dbQuote(tpl, "text") + ")";
		} else {
			sql = "update user_mail_template_tb set mail_template = " + this.get_DB().dbQuote(tpl, "text") + " where userid = " + this.get_DB().dbQuote(userid, "int", true);
		}

		this.get_DB().exec(sql);
	}

	__destruct() {
		super.__destruct();
	}

};