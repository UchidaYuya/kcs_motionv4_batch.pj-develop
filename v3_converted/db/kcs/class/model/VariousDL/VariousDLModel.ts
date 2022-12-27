//
//汎用ダウンロードModel
//
//更新履歴：<br>
//2009/02/17 宝子山浩平 作成
//
//@package VariousDL
//@subpackage Model
//@author houshiyama
//@since 2009/02/17
//@filesource
//@uses ModelBase
//@uses model/ModelBase.php
//@uses MtAuthority.php
//@uses MtTableUtil.php
//@uses MtUtil.php
//@uses model/PostModel.php
//@uses MtPostUtil.php
//@uses TreeAJAX.php
//@uses ListAJAX.php
//@uses model/CarrierModel.php
//@uses model/CardCoModel.php
//@uses model/PurchaseCoModel.php
//@uses model/CopyCoModel.php
//@uses model/AssetsTypeModel.php
//@uses model/CircuitModel.php
//@uses model/PostPropertyModel.php
//@uses model/ManagementPropertyTbModel.php
//@uses model/KamokuModel.php
//@uses model/SummaryFormulaModel.php
//@uses model/CardKamokuModel.php
//@uses model/PurchaseKamokuModel.php
//@uses model/CopyKamokuModel.php
//@uses model/OptionModel.php
//
//
//
//ダウンロードパターン登録画面Model
//
//@package VariousDL
//@subpackage Model
//@author houshiyama
//@since 2009/02/17
//@uses ModelBase
//@uses model/ModelBase.php
//@uses MtAuthority.php
//@uses MtTableUtil.php
//@uses MtUtil.php
//@uses model/PostModel.php
//@uses MtPostUtil.php
//@uses TreeAJAX.php
//@uses ListAJAX.php
//@uses model/CarrierModel.php
//@uses model/CardCoModel.php
//@uses model/PurchaseCoModel.php
//@uses model/CopyCoModel.php
//@uses model/AssetsTypeModel.php
//@uses model/CircuitModel.php
//@uses model/PostPropertyModel.php
//@uses model/ManagementPropertyTbModel.php
//@uses model/KamokuModel.php
//@uses model/SummaryFormulaModel.php
//@uses model/CardKamokuModel.php
//@uses model/PurchaseKamokuModel.php
//@uses model/CopyKamokuModel.php
//@uses model/OptionModel.php
//

require("model/ModelBase.php");

require("MtAuthority.php");

require("MtTableUtil.php");

require("MtUtil.php");

require("model/PostModel.php");

require("MtPostUtil.php");

require("TreeAJAX.php");

require("ListAJAX.php");

require("model/CarrierModel.php");

require("model/CardCoModel.php");

require("model/PurchaseCoModel.php");

require("model/CopyCoModel.php");

require("model/AssetsTypeModel.php");

require("model/CircuitModel.php");

require("model/PostPropertyModel.php");

require("model/ManagementPropertyTbModel.php");

require("model/KamokuModel.php");

require("model/SummaryFormulaModel.php");

require("model/CardKamokuModel.php");

require("model/PurchaseKamokuModel.php");

require("model/CopyKamokuModel.php");

require("model/OptionModel.php");

//
//ディレクトリ名
//
//
//管理種別ID
//
//
//モード
//
//交通費対応 20100527miya
//交通費対応 20100527miya
//交通費対応 20100527miya
//
//メンバー変数
//
//@var mixed
//@access private
//
//グローバルセッション
//MtAuthorityオブジェクト
//権限一覧
//MtPostUtilオブジェクト
//現在時刻
//MtSettingオブジェクト
//MtUtilオブジェクト
//テーブル一覧
//テーブル別名一覧
//テーブル別名一覧
//英語ユーザ置き換えカラム一覧
//英語ユーザ置き換えカラム一覧
//科目設定があるかないかフラグ
//
//コンストラクター
//
//@author houshiyama
//@since 2008/02/21
//
//@param MtSetting $O_Set0
//@param MtOutput $O_Out0
//@param objrct $O_db0
//@param objrct $pactid
//@param objrct $O_manage
//@access public
//@return void
//
//
//ユーザ権限一覧を返す
//
//@author houshiyama
//@since 2009/02/17
//
//@access public
//@return void
//
//
//ツリー表示のための一連の処理をする
//
//部署テーブル名の決定
//Javascriptの生成
//部署名の取得
//
//@author houshiyama
//@since 2008/02/26
//
//@param mixed $H_sess（CGIパラメータ）
//@param mixed $postid
//@access public
//@return array
//@uses PostLinkPost
//@uses TreeAJAX
//@uses ListAJAX
//
//
//用途取得
//
//@author houshiyama
//@since 2009/02/17
//
//@access public
//@return void
//
//
//区切り文字配列生成
//
//@author houshiyama
//@since 2009/02/17
//
//@access public
//@return void
//
//
//引用符配列生成
//
//@author houshiyama
//@since 2009/02/17
//
//@access public
//@return void
//
//
//対象部署指定配列生成
//
//@author houshiyama
//@since 2009/02/17
//
//@access public
//@return void
//
//
//ダウンロードパターン取得
//
//@author houshiyama
//@since 2009/02/17
//
//@access public
//@return void
//
//
//不等号配列生成
//
//@author houshiyama
//@since 2009/02/18
//
//@param string $type
//@access public
//@return void
//
//
//ソートタイプ配列生成
//
//@author houshiyama
//@since 2009/02/18
//
//@access public
//@return void
//
//
//キャリア配列取得
//
//@author houshiyama
//@since 2009/02/18
//
//@access public
//@return void
//
//
//回線種別配列取得
//
//@author houshiyama
//@since 2009/02/18
//
//@access public
//@return void
//
//
//カード会社配列取得
//
//@author houshiyama
//@since 2009/02/18
//
//@access public
//@return void
//
//
//購買先配列取得
//
//@author houshiyama
//@since 2009/02/18
//
//@access public
//@return void
//
//
//コピー機会社配列取得
//
//@author houshiyama
//@since 2009/02/18
//
//@access public
//@return void
//
//
//資産種別配列取得
//
//@author houshiyama
//@since 2009/02/18
//
//@access public
//@return void
//
//
//部署管理ユーザ設定項目取得
//
//@author houshiyama
//@since 2009/02/20
//
//@param mixed $mid
//@access public
//@return void
//
//
//管理情報ユーザ設定項目取得
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $mid
//@access public
//@return void
//
//
//科目取得
//
//@author houshiyama
//@since 2009/02/20
//
//@access public
//@return void
//
//
//科目取得
//
//@author houshiyama
//@since 2009/02/18
//
//@access public
//@return void
//
//
//パターン名からdlidを取得
//
//@author houshiyama
//@since 2009/02/19
//
//@param mixed $dlname
//@access public
//@return void
//
//
//DLパターン登録の一連の処理
//
//@author houshiyama
//@since 2009/02/19
//
//@param mixed $H_post
//@access public
//@return void
//
//
//インサート時に使用するdlidのシーケンス番号取得
//
//@author houshiyama
//@since 2009/02/19
//
//@access private
//@return void
//
//
//dl_pattern_tbへのインサート文作成
//
//@author houshiyama
//@since 2009/02/19
//
//@param mixed $H_post
//@access private
//@return void
//
//
//dl_column_tbへのインサート文作成
//
//@author houshiyama
//@since 2009/02/19
//
//@param mixed $H_post
//@access private
//@return void
//
//
//dl_pattern_tbへインサートする時のカラム
//
//@author houshiyama
//@since 2009/02/19
//
//@access private
//@return void
//
//
//dl_pattern_tbへインサートする時のカラム
//
//@author houshiyama
//@since 2009/02/19
//
//@access private
//@return void
//
//
//dl_pattern_tbへインサートする時の値
//
//@author houshiyama
//@since 2009/02/19
//
//@access private
//@return void
//
//
//dl_column_tbへインサートする時の値
//
//@author houshiyama
//@since 2009/02/20
//
//@param mixed $H_post
//@access private
//@return void
//
//
//dl_pattern_tbへのdelete文作成
//
//@author houshiyama
//@since 2009/02/20
//
//@param mixed $dlid
//@access private
//@return void
//
//
//dl_column_tbへのdelete文作成
//
//@since 2009/02/20
//
//@param mixed $dlid
//@param mixed $col
//@access private
//@return void
//
//
//dl_column_tbからcol_name一覧取得
//
//@author houshiyama
//@since 2009/02/20
//
//@param mixed $dlid
//@access private
//@return void
//
//
//選択されたパターン取得
//
//@author houshiyama
//@since 2009/02/19
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//選択されたパターンを削除
//
//@author houshiyama
//@since 2009/02/19
//
//@param mixed $dlid
//@access public
//@return void
//
//
//配列に入ったsql文を実行する（更新用）
//
//@author houshiyama
//@since 2008/03/13
//
//@param mixed $A_sql
//@access public
//@return true,false
//
//
//ダウンロード選択用ツリー作成
//
//@author houshiyama
//@since 2009/02/26
//
//@access public
//@return void
//
//
//対象年月指定配列生成
//
//@author houshiyama
//@since 2009/02/23
//
//@access public
//@return void
//
//
//対象年月指定配列生成（英語）
//
//@author houshiyama
//@since 2009/02/23
//
//@access public
//@return void
//
//
//使用可能なパターンを取得
//
//@author houshiyama
//@since 2009/02/23
//
//@param mixed $mode
//@access public
//@return void
//
//
//SQL中で使用するテーブルの名前を決める
//
//@author houshiyama
//@since 2009/02/26
//
//@param mixed $cym
//@access public
//@return void
//
//
//ダウンロード対象部署一覧取得
//
//@author houshiyama
//@since 2009/02/26
//
//@param mixed $postid
//@param mixed $trg
//@access public
//@return void
//
//
//用途全て系で、最新月を選ばれた時の処理
//
//@author houshiyama
//@since 2009/07/03
//
//@param mixed $A_pattern
//@param mixed $H_sess
//@access private
//@return void
//
//
//一覧データ取得
//
//@author houshiyama
//@since 2009/02/26
//
//@param mixed $A_pattern
//@param mixed $H_sess
//@param mixed $A_postid
//@access public
//@return void
//
//
//mselect句作成関数
//
//@author houshiyama
//@since 2009/02/27
//
//@param mixed $A_pattern
//@param mixed $H_element
//@access public
//@return void
//
//
//公私分計部分のselect部分（複雑） <br>
//
//@author houshiyama
//@since 2009/02/27
//
//@access private
//@return void
//
//
//用途部署用from句生成関数
//
//@author houshiyama
//@since 2009/02/26
//
//@access public
//@return void
//
//
//電話請求情報（部署単位）用from句生成関数
//
//@author houshiyama
//@since 2009/02/26
//
//@access public
//@return void
//
//
//ETC請求情報（部署単位）用from句生成関数
//
//@author houshiyama
//@since 2009/02/26
//
//@access public
//@return void
//
//
//購買請求情報（部署単位）用from句生成関数
//
//@author houshiyama
//@since 2009/02/26
//
//@access public
//@return void
//
//
//コピー機請求情報（部署単位）用from句生成関数
//
//@author houshiyama
//@since 2009/02/26
//
//@access public
//@return void
//
//
//電話請求情報（電話単位）用from句生成関数
//
//@author houshiyama
//@since 2009/02/26
//
//@access public
//@return void
//
//
//ETC請求情報（カード単位）用from句生成関数
//
//@author houshiyama
//@since 2009/02/26
//
//@access public
//@return void
//
//
//購買請求情報（購買ID単位）用from句生成関数
//
//@author houshiyama
//@since 2009/02/26
//
//@access public
//@return void
//
//
//コピー機請求情報（コピー機単位）用from句生成関数
//
//@author houshiyama
//@since 2009/02/26
//
//@access public
//@return void
//
//
//交通費請求情報（部署単位）用from句生成関数
//
//@author miyazawa
//@since 2010/05/27
//
//@access public
//@return void
//
//
//交通費請求情報（ユーザ単位）用from句生成関数
//
//@author miyazawa
//@since 2010/05/27
//
//@access public
//@return void
//
//
//電話情報用from句生成関数
//
//@author houshiyama
//@since 2009/02/26
//
//@access private
//@return void
//
//
//ETC情報用from句生成関数
//
//@author houshiyama
//@since 2009/02/26
//
//@access private
//@return void
//
//
//購買情報用from句生成関数
//
//@author houshiyama
//@since 2009/02/26
//
//@access private
//@return void
//
//
//コピー機情報用from句生成関数
//
//@author houshiyama
//@since 2009/02/26
//
//@access private
//@return void
//
//
//資産情報用from句生成関数
//
//@author houshiyama
//@since 2009/02/26
//
//@access public
//@return void
//
//
//部署・電話情報用from句生成関数
//
//@author houshiyama
//@since 2009/07/01
//
//@access private
//@return void
//
//
//部署・ETC情報用from句生成関数
//
//@author houshiyama
//@since 2009/07/01
//
//@access private
//@return void
//
//
//部署・購買情報用from句生成関数
//
//@author houshiyama
//@since 2009/07/01
//
//@access private
//@return void
//
//
//部署・コピー機情報用from句生成関数
//
//@author houshiyama
//@since 2009/07/01
//
//@access private
//@return void
//
//
//部署・資産情報用from句生成関数
//
//@author houshiyama
//@since 2009/07/01
//
//@access private
//@return void
//
//
//電話全部用from句生成関数
//
//@author houshiyama
//@since 2009/02/27
//
//@access private
//@return void
//
//
//ETC全部用from句生成関数
//
//@author houshiyama
//@since 2009/02/27
//
//@access private
//@return void
//
//
//購買全部用from句生成関数
//
//@author houshiyama
//@since 2009/02/27
//
//@access private
//@return void
//
//
//コピー機全部用from句生成関数
//
//@author houshiyama
//@since 2009/02/27
//
//@access private
//@return void
//
//
//where句作成関数
//
//@author houshiyama
//@since 2009/02/27
//
//@param mixed $A_pattern
//@param mixed $H_element
//@access private
//@return void
//
//
//order句作成
//
//@author houshiyama
//@since 2009/03/04
//
//@param mixed $A_pattern
//@param mixed $H_element
//@access private
//@return void
//
//
//文字列型の等号、値部分作成
//
//@author houshiyama
//@since 2009/02/27
//
//@param mixed $sign
//@param mixed $value
//@access private
//@return void
//
//
//公私分計where部分作成
//
//@author houshiyama
//@since 2009/02/27
//
//@access private
//@return void
//
//
//重複する資産は電話の契約日が古いほうのみ残す
//
//@author houshiyama
//@since 2008/10/16
//
//@param mixed $A_data
//@access public
//@return void
//
//
//全部系の時、表示しないデータ行、列を消す
//
//@author houshiyama
//@since 2009/07/03
//
//@param mixed $A_data
//@access private
//@return void
//
//
//シリアライズデータを表示用に変換
//
//@author houshiyama
//@since 2009/03/03
//
//@param mixed $A_data
//@param mixed $H_view
//@access private
//@return void
//
//
//オプションデータ部分のSQL
//
//@author houshiyama
//@since 2009/09/11
//
//@param mixed $sign
//@param mixed $value
//@param mixed $type
//@param mixed $ptn_lang
//@access private
//@return void
//
//
//SummaryFormulaModel取得
//
//@author houshiyama
//@since 2011/04/18
//
//@access private
//@return void
//
//
//insertTelMngLog
//
//@author web
//@since 2016/04/01
//
//@param mixed $pactid
//@param mixed $postid
//@param mixed $postname
//@param mixed $userid
//@param mixed $username
//@param mixed $loginid
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/17
//
//@access public
//@return void
//
class VariousDLModel extends ModelBase {
	static PUB = "/VariousDL";
	static TELMID = 1;
	static ETCMID = 2;
	static PURCHMID = 3;
	static COPYMID = 4;
	static ASSMID = 5;
	static POSTMODE = "post";
	static TELMODE = "tel";
	static ETCMODE = "etc";
	static PURCHMODE = "purch";
	static COPYMODE = "copy";
	static ASSMODE = "assets";
	static ICCARDMODE = "iccard";
	static POSTTELMODE = "posttel";
	static POSTETCMODE = "postetc";
	static POSTPURCHMODE = "postpurch";
	static POSTCOPYMODE = "postcopy";
	static POSTASSMODE = "postassets";
	static TELBILLMODE = "telbill";
	static ETCBILLMODE = "etcbill";
	static PURCHBILLMODE = "purchbill";
	static COPYBILLMODE = "copybill";
	static TELPOSTBILLMODE = "telpostbill";
	static ETCPOSTBILLMODE = "etcpostbill";
	static PURCHPOSTBILLMODE = "purchpostbill";
	static COPYPOSTBILLMODE = "copypostbill";
	static ICCARDPOSTBILLMODE = "iccardpostbill";
	static ICCARDUSERBILLMODE = "iccarduserbill";
	static TELALLMODE = "telall";
	static ETCALLMODE = "etcall";
	static PURCHALLMODE = "purchall";
	static COPYALLMODE = "copyall";

	constructor(H_g_sess) //テーブル別名設定
	//表示言語分岐
	//英語置き換えがあるカラム
	{
		super();
		this.FormulaSettingFlag = false;
		this.H_G_Sess = H_g_sess;
		this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
		this.A_Auth = this.O_Auth.getUserFuncIni(this.H_G_Sess.userid, false);
		this.O_Post = new PostModel();
		this.NowTime = this.get_DB().getNow();
		this.O_Set = MtSetting.singleton();
		this.O_Util = new MtUtil();
		this.H_Tbname = {
			post_X_tb: "po",
			post_X_tb2: "po2",
			post_relation_X_tb: "porl",
			tel_X_tb: "te",
			bill_X_tb: "tepob",
			tel_bill_X_tb: "teb",
			kousi_bill_X_tb: "kotepob",
			kousi_tel_bill_X_tb: "koteb",
			summary_bill_X_tb: "sutepob",
			summary_tel_bill_X_tb: "suteb",
			card_X_tb: "ca",
			card_post_bill_X_tb: "capob",
			card_bill_X_tb: "cab",
			purchase_X_tb: "pu",
			purchase_post_bill_X_tb: "pupob",
			purchase_bill_X_tb: "pub",
			copy_X_tb: "co",
			copy_post_bill_X_tb: "copob",
			copy_bill_X_tb: "cob",
			assets_X_tb: "ass",
			tel_rel_assets_X_tb: "terass",
			iccard_post_bill_X_tb: "icpob",
			iccard_bill_X_tb: "icb"
		};

		if ("ENG" == this.H_G_Sess.language) //公私分計変数
			{
				var H_Kousilabel = {
					label_not_use: "Not billed",
					label_not_com: "Automatic calculation",
					label_edit: "Being edited",
					label_fix: "Confirmed",
					label_else: "",
					no_not_use: "1",
					no_not_com: "2",
					no_edit: "3",
					no_fix: "4",
					no_else: ""
				};
			} else //公私分計変数
			{
				H_Kousilabel = {
					label_not_use: "\u5BFE\u8C61\u5916",
					label_not_com: "\u81EA\u52D5\u8A08\u7B97",
					label_edit: "\u7DE8\u96C6\u4E2D",
					label_fix: "\u78BA\u5B9A\u6E08",
					label_else: "",
					no_not_use: "1",
					no_not_com: "2",
					no_edit: "3",
					no_fix: "4",
					no_else: ""
				};
			}

		this.H_Engcol = {
			carname: "carname_eng",
			cirname: "cirname_eng",
			buyselname: "buyselname_eng",
			planname: "planname_eng",
			packetname: "packetname_eng",
			pointname: "pointname_eng",
			arname: "arname_eng",
			cardconame: "cardconame_eng",
			purchconame: "purchconame_eng",
			copyconame: "copyconame_eng",
			smpcirname: "smpcirname_eng"
		};
	}

	getAuthIni() {
		return this.A_Auth;
	}

	getTreeJS(H_sess) //テーブル名の決定
	{
		var H_tree = Array();
		var post_tb = "post_tb";
		var post_relation_tb = "post_relation_tb";
		var tb_no = "";
		H_tree.js = TreeAJAX.treeJs() + ListAJAX.xlistJs();
		var O_post = new MtPostUtil();
		H_tree.post_name = O_post.getPostTreeBand(this.H_G_Sess.pactid, this.H_G_Sess.postid, H_sess.post.recogpostid, tb_no, " -> ", "", 1, false);
		var O_tree = new TreeAJAX();
		O_tree.post_tb = post_tb;
		O_tree.post_relation_tb = post_relation_tb;
		H_tree.tree_str = O_tree.makeTree(this.H_G_Sess.postid);
		var O_xlist = new ListAJAX();
		O_xlist.post_tb = post_tb;
		O_xlist.post_relation_tb = post_relation_tb;
		H_tree.xlist_str = O_xlist.makeList();
		return H_tree;
	}

	getUsage() //表示言語分岐
	{
		if ("ENG" == this.H_G_Sess.language) //用途
			//権限を観て要素追加
			{
				var H_use = {
					"-1": "--Please select--"
				};

				if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true) {
					H_use[VariousDLModel.POSTMODE] = "Department information";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_tel_bill") == true) {
					H_use[VariousDLModel.TELPOSTBILLMODE] = "Telephone billing information (department)";
					H_use[VariousDLModel.TELBILLMODE] = "Telephone billing information (telephone)";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_card_detail") == true) {
					H_use[VariousDLModel.ETCPOSTBILLMODE] = "ETC billing information (department)";
					H_use[VariousDLModel.ETCBILLMODE] = "ETC billing information (card)";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_purch_bill") == true) {
					H_use[VariousDLModel.PURCHPOSTBILLMODE] = "Purchase billing information (department)";
					H_use[VariousDLModel.PURCHBILLMODE] = "Purchase billing information (purchase ID)";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_copy_bill") == true) {
					H_use[VariousDLModel.COPYPOSTBILLMODE] = "Copy machine billing information (department)";
					H_use[VariousDLModel.COPYBILLMODE] = "Copy machine billing information (copy machine)";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_iccard_bill_view") == true) {
					H_use[VariousDLModel.ICCARDPOSTBILLMODE] = "\u2605\u4EA4\u901A\u8CBB\u8ACB\u6C42\u60C5\u5831\uFF08\u90E8\u7F72\u5358\u4F4D\uFF09";
					H_use[VariousDLModel.ICCARDUSERBILLMODE] = "\u2605\u4EA4\u901A\u8CBB\u8ACB\u6C42\u60C5\u5831\uFF08\u30E6\u30FC\u30B6\u5358\u4F4D\uFF09";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_tel_manage_adm") == true || -1 !== this.A_Auth.indexOf("fnc_tel_adm") == true) {
					H_use[VariousDLModel.TELMODE] = "Telephone information";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_etc_manage_adm") == true) {
					H_use[VariousDLModel.ETCMODE] = "ETC information";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_purch_manage_adm") == true) {
					H_use[VariousDLModel.PURCHMODE] = "Purchase ID information";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_copy_manage_adm") == true) {
					H_use[VariousDLModel.COPYMODE] = "Copy machine information";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_us") == true) {
					H_use[VariousDLModel.ASSMODE] = "Property information";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_tel_manage_adm") == true) {
					H_use[VariousDLModel.POSTTELMODE] = "Department/telephone information";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_etc_manage_adm") == true) {
					H_use[VariousDLModel.POSTETCMODE] = "Department/ETC information";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_purch_manage_adm") == true) {
					H_use[VariousDLModel.POSTPURCHMODE] = "Department/purchase ID information";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_copy_manage_adm") == true) {
					H_use[VariousDLModel.POSTCOPYMODE] = "Department/copy machine information";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_us") == true) {
					H_use[VariousDLModel.POSTASSMODE] = "Department/property information";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_tel_bill") == true && -1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_tel_manage_adm") == true) {
					H_use[VariousDLModel.TELALLMODE] = "Department/telephone billing information";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_card_detail") == true && -1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_etc_manage_adm") == true) {
					H_use[VariousDLModel.ETCALLMODE] = "Department/ETC billing information";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_purch_bill") == true && -1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_purch_manage_adm") == true) {
					H_use[VariousDLModel.PURCHALLMODE] = "Department/purchase ID billing information";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_copy_bill") == true && -1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_copy_manage_adm") == true) {
					H_use[VariousDLModel.COPYALLMODE] = "Department/copy machine billing information";
				}
			} else //用途
			//権限を観て要素追加
			{
				H_use = {
					"-1": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
				};

				if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true) {
					H_use[VariousDLModel.POSTMODE] = "\u90E8\u7F72\u60C5\u5831";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_tel_bill") == true) {
					H_use[VariousDLModel.TELPOSTBILLMODE] = "\u96FB\u8A71\u8ACB\u6C42\u60C5\u5831\uFF08\u90E8\u7F72\u5358\u4F4D\uFF09";
					H_use[VariousDLModel.TELBILLMODE] = "\u96FB\u8A71\u8ACB\u6C42\u60C5\u5831\uFF08\u96FB\u8A71\u5358\u4F4D\uFF09";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_card_detail") == true) {
					H_use[VariousDLModel.ETCPOSTBILLMODE] = "ETC\u8ACB\u6C42\u60C5\u5831\uFF08\u90E8\u7F72\u5358\u4F4D\uFF09";
					H_use[VariousDLModel.ETCBILLMODE] = "ETC\u8ACB\u6C42\u60C5\u5831\uFF08\u30AB\u30FC\u30C9\u5358\u4F4D\uFF09";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_purch_bill") == true) {
					H_use[VariousDLModel.PURCHPOSTBILLMODE] = "\u8CFC\u8CB7\u8ACB\u6C42\u60C5\u5831\uFF08\u90E8\u7F72\u5358\u4F4D\uFF09";
					H_use[VariousDLModel.PURCHBILLMODE] = "\u8CFC\u8CB7\u8ACB\u6C42\u60C5\u5831\uFF08\u8CFC\u8CB7ID\u5358\u4F4D\uFF09";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_copy_bill") == true) {
					H_use[VariousDLModel.COPYPOSTBILLMODE] = "\u30B3\u30D4\u30FC\u6A5F\u8ACB\u6C42\u60C5\u5831\uFF08\u90E8\u7F72\u5358\u4F4D\uFF09";
					H_use[VariousDLModel.COPYBILLMODE] = "\u30B3\u30D4\u30FC\u6A5F\u8ACB\u6C42\u60C5\u5831\uFF08\u30B3\u30D4\u30FC\u6A5F\u5358\u4F4D\uFF09";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_iccard_bill_view") == true) {
					H_use[VariousDLModel.ICCARDPOSTBILLMODE] = "\u4EA4\u901A\u8CBB\u8ACB\u6C42\u60C5\u5831\uFF08\u90E8\u7F72\u5358\u4F4D\uFF09";
					H_use[VariousDLModel.ICCARDUSERBILLMODE] = "\u4EA4\u901A\u8CBB\u8ACB\u6C42\u60C5\u5831\uFF08\u30E6\u30FC\u30B6\u5358\u4F4D\uFF09";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_tel_manage_adm") == true || -1 !== this.A_Auth.indexOf("fnc_tel_adm") == true) {
					H_use[VariousDLModel.TELMODE] = "\u96FB\u8A71\u60C5\u5831";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_etc_manage_adm") == true) {
					H_use[VariousDLModel.ETCMODE] = "ETC\u60C5\u5831";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_purch_manage_adm") == true) {
					H_use[VariousDLModel.PURCHMODE] = "\u8CFC\u8CB7ID\u60C5\u5831";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_copy_manage_adm") == true) {
					H_use[VariousDLModel.COPYMODE] = "\u30B3\u30D4\u30FC\u6A5F\u60C5\u5831";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_us") == true) {
					H_use[VariousDLModel.ASSMODE] = "\u8CC7\u7523\u60C5\u5831";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_tel_manage_adm") == true) {
					H_use[VariousDLModel.POSTTELMODE] = "\u90E8\u7F72\u30FB\u96FB\u8A71\u60C5\u5831";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_etc_manage_adm") == true) {
					H_use[VariousDLModel.POSTETCMODE] = "\u90E8\u7F72\u30FBETC\u60C5\u5831";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_purch_manage_adm") == true) {
					H_use[VariousDLModel.POSTPURCHMODE] = "\u90E8\u7F72\u30FB\u8CFC\u8CB7ID\u60C5\u5831";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_copy_manage_adm") == true) {
					H_use[VariousDLModel.POSTCOPYMODE] = "\u90E8\u7F72\u30FB\u30B3\u30D4\u30FC\u6A5F\u60C5\u5831";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_us") == true) {
					H_use[VariousDLModel.POSTASSMODE] = "\u90E8\u7F72\u30FB\u8CC7\u7523\u60C5\u5831";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_tel_bill") == true && -1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_tel_manage_adm") == true) {
					H_use[VariousDLModel.TELALLMODE] = "\u90E8\u7F72\u30FB\u96FB\u8A71\u30FB\u8ACB\u6C42\u60C5\u5831";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_card_detail") == true && -1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_etc_manage_adm") == true) {
					H_use[VariousDLModel.ETCALLMODE] = "\u90E8\u7F72\u30FBETC\u30FB\u8ACB\u6C42\u60C5\u5831";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_purch_bill") == true && -1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_purch_manage_adm") == true) {
					H_use[VariousDLModel.PURCHALLMODE] = "\u90E8\u7F72\u30FB\u8CFC\u8CB7ID\u30FB\u8ACB\u6C42\u60C5\u5831";
				}

				if (-1 !== this.A_Auth.indexOf("fnc_copy_bill") == true && -1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_copy_manage_adm") == true) {
					H_use[VariousDLModel.COPYALLMODE] = "\u90E8\u7F72\u30FB\u30B3\u30D4\u30FC\u6A5F\u30FB\u8ACB\u6C42\u60C5\u5831";
				}
			}

		return H_use;
	}

	getSeparator() //表示言語分岐
	{
		if ("ENG" == this.H_G_Sess.language) {
			var H_separator = {
				comma: "\",\"(Comma)",
				tab: "\"\t\"(Tab)",
				space: "\" \"(Space)"
			};
		} else {
			H_separator = {
				comma: "\",\"\uFF08\u30AB\u30F3\u30DE\uFF09",
				tab: "\"\t\"\uFF08\u30BF\u30D6\uFF09",
				space: "\" \"\uFF08\u30B9\u30DA\u30FC\u30B9\uFF09"
			};
		}

		return H_separator;
	}

	getQuote() //表示言語分岐
	{
		if ("ENG" == this.H_G_Sess.language) {
			var H_quote = {
				none: "None",
				single: "''(Single quotation)",
				double: "\"\"(Double quotation)"
			};
		} else {
			H_quote = {
				none: "\u306A\u3057",
				single: "''\uFF08\u30B7\u30F3\u30B0\u30EB\u30AF\u30A9\u30FC\u30C8\uFF09",
				double: "\"\"\uFF08\u30C0\u30D6\u30EB\u30AF\u30A9\u30FC\u30C8\uFF09"
			};
		}

		return H_quote;
	}

	getPostTarget() //表示言語分岐
	{
		if ("ENG" == this.H_G_Sess.language) {
			var H_res = this.O_Util.getHashPostTargetEng();
		} else {
			H_res = this.O_Util.getHashPostTarget();
		}

		var H_trg = Array();

		for (var key in H_res) {
			var H_row = H_res[key];
			H_trg[key] = H_row[0];
		}

		return H_trg;
	}

	getDLPattern() //表示言語分岐
	{
		var sql = "select " + " dlid " + ",dlname " + " from " + " dl_pattern_tb " + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " order by dlid";
		var H_data = this.get_DB().queryAssoc(sql);

		if ("ENG" == this.H_G_Sess.language) {
			H_data["-1"] = "--Please select--";
		} else {
			H_data["-1"] = "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--";
		}

		ksort(H_data);
		return H_data;
	}

	getSignArray(type = "text") //表示言語分岐
	{
		if ("ENG" == this.H_G_Sess.language) {
			if (type == "select") {
				var A_sign = {
					"=": "=",
					"!=": "Disagreement"
				};
			} else if (type == "integer") {
				A_sign = {
					"=": "=",
					"!=": "Disagreement",
					">=": ">=",
					"<=": "<=",
					">": ">",
					"<": "<"
				};
			} else if (type == "date" || type == "month") {
				A_sign = {
					"=": "=",
					"!=": "Disagreement",
					">=": ">=",
					"<=": "<=",
					">": ">",
					"<": "<"
				};
			} else {
				A_sign = {
					"=": "=",
					"!=": "Disagreement",
					like: "Fuzzy search",
					flike: "Prefix search",
					blike: "Suffix search",
					notlike: "Parts of disagreement "
				};
			}
		} else {
			if (type == "select") {
				A_sign = {
					"=": "=",
					"!=": "\u7B49\u3057\u304F\u306A\u3044"
				};
			} else if (type == "integer") {
				A_sign = {
					"=": "=",
					"!=": "\u7B49\u3057\u304F\u306A\u3044",
					">=": ">=",
					"<=": "<=",
					">": ">",
					"<": "<"
				};
			} else if (type == "date" || type == "month") {
				A_sign = {
					"=": "=",
					"!=": "\u7B49\u3057\u304F\u306A\u3044",
					">=": ">=",
					"<=": "<=",
					">": ">",
					"<": "<"
				};
			} else {
				A_sign = {
					"=": "=",
					"!=": "\u7B49\u3057\u304F\u306A\u3044",
					like: "\u90E8\u5206\u4E00\u81F4",
					flike: "\u524D\u65B9\u4E00\u81F4",
					blike: "\u5F8C\u65B9\u4E00\u81F4",
					notlike: "\u90E8\u5206\u4E0D\u4E00\u81F4"
				};
			}
		}

		return A_sign;
	}

	getSortArray() //表示言語分岐
	{
		if ("ENG" == this.H_G_Sess.language) {
			var A_sort = {
				asc: "Ascending order",
				desc: "Descending order"
			};
		} else {
			A_sort = {
				asc: "\u6607\u9806",
				desc: "\u964D\u9806"
			};
		}

		return A_sort;
	}

	getCarrierHash(flag = false) //表示言語分岐
	{
		var O_model = new CarrierModel();

		if ("ENG" == this.H_G_Sess.language) {
			if (flag == true) {
				var H_data = {
					"": "",
					"0": "ALL"
				};
			} else {
				H_data = {
					"": ""
				};
			}

			var H_res = O_model.getPactCarrierEngKeyHash(this.H_G_Sess.pactid);
		} else {
			if (flag == true) {
				H_data = {
					"": "",
					"0": "\u5168\u3066"
				};
			} else {
				H_data = {
					"": ""
				};
			}

			H_res = O_model.getPactCarrierKeyHash(this.H_G_Sess.pactid);
		}

		H_data = H_data + H_res;
		return H_data;
	}

	getCircuitHash() //表示言語分岐
	{
		var O_model = new CircuitModel();
		var H_data = {
			"": ""
		};

		if ("ENG" == this.H_G_Sess.language) {
			var H_res = O_model.getPactAllCircuitEngKeyHash(this.H_G_Sess.pactid);
		} else {
			H_res = O_model.getPactAllCircuitKeyHash(this.H_G_Sess.pactid);
		}

		H_data = H_data + H_res;
		return H_data;
	}

	getCardCoHash() //表示言語分岐
	{
		var O_model = new CardCoModel();

		if ("ENG" == this.H_G_Sess.language) {
			var H_data = {
				"": "",
				"0": "ALL"
			};
			var H_res = O_model.getCardCoEngKeyHash();
		} else {
			H_data = {
				"": "",
				"0": "\u5168\u3066"
			};
			H_res = O_model.getCardCoKeyHash();
		}

		H_data = H_data + H_res;
		return H_data;
	}

	getPurchaseCoHash() //表示言語分岐
	{
		var O_model = new PurchaseCoModel();

		if ("ENG" == this.H_G_Sess.language) {
			var H_data = {
				"": "",
				"0": "ALL"
			};
			var H_res = O_model.getPurchCoEngKeyHash();
		} else {
			H_data = {
				"": "",
				"0": "\u5168\u3066"
			};
			H_res = O_model.getPurchCoKeyHash();
		}

		H_data = H_data + H_res;
		return H_data;
	}

	getCopyCoHash() //表示言語分岐
	{
		var O_model = new CopyCoModel();

		if ("ENG" == this.H_G_Sess.language) {
			var H_data = {
				"": "",
				"0": "ALL"
			};
			var H_res = O_model.getCopyCoEngKeyHash();
		} else {
			H_data = {
				"": "",
				"0": "\u5168\u3066"
			};
			H_res = O_model.getCopyCoKeyHash();
		}

		H_data = H_data + H_res;
		return H_data;
	}

	getAssetsTypeHash() {
		var O_model = new AssetsTypeModel();
		var H_data = {
			"": ""
		};
		var H_res = O_model.getAssetsTypeKeyHash(this.H_G_Sess.pactid);
		H_data = H_data + H_res;
		return H_data;
	}

	getPostPropertyHash() {
		var O_model = new PostPropertyModel();
		var H_data = O_model.getPostPropertyData(this.H_G_Sess.pactid);
		return H_data;
	}

	getManagementPropertyHash(mid) {
		var O_model = new ManagementPropertyTbModel();
		var H_data = O_model.getManagementPropertyData(this.H_G_Sess.pactid, mid);
		return H_data;
	}

	getManageKamokuHash(mid) //pactを絞る
	//表示言語分岐
	//電話の時はその他設定
	{
		if (mid == VariousDLModel.TELMID) {
			var O_model = new KamokuModel();
			var H_res = O_model.getTelKamokuKeyHash(this.H_G_Sess.pactid);
		} else if (mid == VariousDLModel.ETCMID) {
			O_model = new CardKamokuModel();
			H_res = O_model.getCardKamokuKeyHash(this.H_G_Sess.pactid);
		} else if (mid == VariousDLModel.PURCHMID) {
			O_model = new PurchaseKamokuModel();
			H_res = O_model.getPurchKamokuKeyHash(this.H_G_Sess.pactid);
		} else if (mid == VariousDLModel.COPYMID) {
			O_model = new CopyKamokuModel();
			H_res = O_model.getCopyKamokuKeyHash(this.H_G_Sess.pactid);
		}

		var H_tmp = Array();

		for (var col in H_res) {
			var name = H_res[col];
			H_tmp["kamoku" + col] = name;
		}

		var H_kamoku = Array();

		if ("ENG" == this.H_G_Sess.language) {
			var H_data = {
				kamoku1: "Account1",
				kamoku2: "Account2",
				kamoku3: "Account3",
				kamoku4: "Account4",
				kamoku5: "Account5",
				kamoku6: "Account6",
				kamoku7: "Account7",
				kamoku8: "Account8",
				kamoku9: "Account9",
				kamoku10: "Account10"
			};
		} else {
			H_data = {
				kamoku1: "\u79D1\u76EE1",
				kamoku2: "\u79D1\u76EE2",
				kamoku3: "\u79D1\u76EE3",
				kamoku4: "\u79D1\u76EE4",
				kamoku5: "\u79D1\u76EE5",
				kamoku6: "\u79D1\u76EE6",
				kamoku7: "\u79D1\u76EE7",
				kamoku8: "\u79D1\u76EE8",
				kamoku9: "\u79D1\u76EE9",
				kamoku10: "\u79D1\u76EE10"
			};
		}

		if (mid == VariousDLModel.TELMID) {
			H_data["kamoku" + (this.O_Set.kamoku_default + 1)] = this.O_Set.kamoku_default_label;
		}

		for (var col in H_data) {
			var name = H_data[col];
			H_kamoku[col] = name;

			if (undefined !== H_tmp[col] == true) {
				H_kamoku[col] = H_tmp[col];
			}
		}

		return H_kamoku;
	}

	getFormulaHash() //返り値となるハッシュ
	//表示言語分岐
	{
		var O_model = this.getSummaryFormulaModel();
		var H_tmp = O_model.getSummaryFormulaKeyHash(this.H_G_Sess.pactid);

		if ("ENG" == this.H_G_Sess.language) {
			var H_data = {
				calc1: "Variable item 1",
				calc2: "Variable item 2",
				cond1: "Variable item 3",
				cond2: "Variable item 4",
				cond3: "Variable item 5",
				sum1: "Total item 1",
				sum2: "Total item 2",
				sum3: "Total amount"
			};
		} else {
			H_data = {
				calc1: "\u5909\u6570\u9805\u76EE1",
				calc2: "\u5909\u6570\u9805\u76EE2",
				cond1: "\u5909\u6570\u9805\u76EE3",
				cond2: "\u5909\u6570\u9805\u76EE4",
				cond3: "\u5909\u6570\u9805\u76EE5",
				sum1: "\u5408\u8A08\u9805\u76EE1",
				sum2: "\u5408\u8A08\u9805\u76EE2",
				sum3: "\u5168\u5408\u8A08"
			};
		}

		for (var key in H_tmp) {
			var val = H_tmp[key];
			H_data[key] = H_tmp[key];
		}

		return H_data;
	}

	getDlidFromPatternName(dlname) {
		var sql = "select " + " dlid " + " from " + " dl_pattern_tb " + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and " + " dlname=" + this.get_DB().dbQuote(dlname, "text", true, "dlname");
		var A_dlid = this.get_DB().queryCol(sql);
		return A_dlid;
	}

	doAddDLPatternSQL(H_post, H_element) //トランザクション開始
	//同名のDLパターン情報取得
	//同名のフォーマットは消す
	//dl_pattern_tbへのインサート文作成
	//更新ＳＱＬ実行
	{
		var A_sql = Array();
		this.get_DB().beginTransaction();
		var A_dupli = this.getDlidFromPatternName(H_post.dlname);

		if (A_dupli.length != 0) {
			for (var pcnt = 0; pcnt < A_dupli.length; pcnt++) //dl_column_tbからcol_name一覧取得
			//dl_pattern_tbから消すSQL文作成
			{
				var A_cols = this.getDlColumnColName(A_dupli[pcnt]);

				for (var ccnt = 0; ccnt < A_cols.length; ccnt++) //dl_column_tbから消すSQL文作成
				{
					A_sql.push(this.makeDeleteDlColumnTbSQL(A_dupli[pcnt], A_cols[ccnt]));
				}

				A_sql.push(this.makeDeleteDlPatternTbSQL(A_dupli[pcnt]));
			}
		}

		H_post.dlid = this.getNextDlid();
		var sql = this.makeAddDlPatternTbSQL(H_post);
		A_sql.push(sql);

		for (var col in H_element) //dl_column_tbへのインサート文作成
		{
			var H_type = H_element[col];

			if (undefined !== H_post[col] == false) {
				this.errorOut(1, "\u30D5\u30A9\u30FC\u30E0\u4F5C\u6210\u6642\u306E\u30AD\u30FC\u3068\u53D7\u3051\u53D6\u3063\u305F\u30D1\u30E9\u30E1\u30FC\u30BF\u306E\u30AD\u30FC\u306B\u5DEE\u304C\u3042\u308B" + col, false);
			}

			H_post.col = col;
			H_post.tb = H_type.tb;
			sql = this.makeAddDlColumnTbSQL(H_post);
			A_sql.push(sql);
		}

		return this.execDB(A_sql);
	}

	getNextDlid() {
		var dlid = this.get_DB().queryOne("select nextval('dl_pattern_tb_dlid_seq')");
		return dlid;
	}

	makeAddDlPatternTbSQL(H_post) {
		var sql = "insert into dl_pattern_tb " + " (" + this.makeDlPatternTbCols().join(",") + ") " + " values " + " (" + this.makeDlPatternTbValue(H_post).join(",") + ")";
		return sql;
	}

	makeAddDlColumnTbSQL(H_post) {
		var sql = "insert into dl_column_tb " + " (" + this.makeDlColumnTbCols().join(",") + ") " + " values " + " (" + this.makeDlColumnTbValue(H_post).join(",") + ")";
		return sql;
	}

	makeDlPatternTbCols() {
		var A_col = ["dlid", "pactid", "postid", "dlname", "download_type", "template_type", "usablepost_type", "separator", "textize", "postid_table", "recdate", "fixdate"];
		return A_col;
	}

	makeDlColumnTbCols() {
		var A_col = ["dlid", "tb_name", "col_name", "view_order", "sort_order", "sort_type", "sign", "value", "download"];
		return A_col;
	}

	makeDlPatternTbValue(H_post) {
		if (!(undefined !== H_post.postid_table)) {
			H_post.postid_table = "po";
		}

		var A_val = [this.get_DB().dbQuote(H_post.dlid, "integer", true, "dlid"), this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid"), this.get_DB().dbQuote(H_post.recogpostid, "integer", true, "recogpostid"), this.get_DB().dbQuote(H_post.dlname, "text", true, "dlname"), this.get_DB().dbQuote(H_post.use, "text", true, "download_type"), this.get_DB().dbQuote(H_post.use, "text", true, "template_type"), this.get_DB().dbQuote(H_post.usablepost_type, "text", true, "usablepost_type"), this.get_DB().dbQuote(H_post.separator, "text", true, "separator"), this.get_DB().dbQuote(H_post.textize, "text", true, "textize"), this.get_DB().dbQuote(H_post.postid_table, "text", true, "postid_table"), this.get_DB().dbQuote(this.get_DB().getNow(), "timestamp", true, "recdate"), this.get_DB().dbQuote(this.get_DB().getNow(), "timestamp", true, "fixdate")];
		return A_val;
	}

	makeDlColumnTbValue(H_post) //チェックボックスの値
	//日付型のとき
	{
		if (H_post[H_post.col + "_c"] == "1") {
			var download = 1;
		} else {
			download = 0;
		}

		if (Array.isArray(H_post[H_post.col]) == true) {
			var value = this.O_Util.convertDatetime(H_post[H_post.col]);
		} else {
			value = H_post[H_post.col];
		}

		var A_val = [this.get_DB().dbQuote(H_post.dlid, "integer", true, "dlid"), this.get_DB().dbQuote(H_post.tb, "text", true, "tb_name"), this.get_DB().dbQuote(H_post.col, "text", true, "col_name"), this.get_DB().dbQuote(H_post[H_post.col + "_v"], "integer", false, "view_order"), this.get_DB().dbQuote(H_post[H_post.col + "_s"], "integer", false, "sort_order"), this.get_DB().dbQuote(H_post[H_post.col + "_t"], "text", false, "sort_type"), this.get_DB().dbQuote(H_post[H_post.col + "_p"], "text", false, "sign"), this.get_DB().dbQuote(value, "text", false, "value"), this.get_DB().dbQuote(download, "integer", true, "download")];
		return A_val;
	}

	makeDeleteDlPatternTbSQL(dlid) {
		var sql = "delete from dl_pattern_tb where dlid=" + this.get_DB().dbQuote(dlid, "integer", true, "dlid");
		return sql;
	}

	makeDeleteDlColumnTbSQL(dlid, col) {
		var sql = "delete from dl_column_tb " + " where " + " dlid=" + this.get_DB().dbQuote(dlid, "integer", true, "dlid") + " and " + " col_name=" + this.get_DB().dbQuote(col, "text", true, "col_name");
		return sql;
	}

	getDlColumnColName(dlid) {
		var sql = "select col_name from dl_column_tb where dlid=" + this.get_DB().dbQuote(dlid, "integer", true, "dlid");
		var A_data = this.get_DB().queryCol(sql);
		return A_data;
	}

	getSelectPattern(dlid) {
		var sql = "select " + " dp.dlid " + " ,dp.pactid " + " ,dp.postid " + " ,dp.dlname " + " ,dp.download_type " + " ,dp.template_type " + " ,dp.usablepost_type " + " ,dp.separator " + " ,dp.textize " + " ,coalesce(dp.postid_table,'po') as postid_table " + " ,dc.tb_name " + " ,dc.col_name " + " ,dc.view_order " + " ,dc.sort_order " + " ,dc.sort_type " + " ,dc.sign " + " ,dc.value " + " ,dc.download " + " from " + " dl_pattern_tb as dp left join dl_column_tb as dc on dp.dlid = dc.dlid " + " where " + " dp.dlid=" + this.get_DB().dbQuote(dlid, "integer", true, "dlid") + " and " + " dp.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid");
		var H_data = this.get_DB().queryHash(sql);
		return H_data;
	}

	deleteSelectPattern(dlid) //dl_column_tbからcol_name一覧取得
	//dl_pattern_tbから消すSQL文作成
	{
		var A_sql = Array();
		var A_cols = this.getDlColumnColName(dlid);

		for (var ccnt = 0; ccnt < A_cols.length; ccnt++) //dl_column_tbから消すSQL文作成
		{
			A_sql.push(this.makeDeleteDlColumnTbSQL(dlid, A_cols[ccnt]));
		}

		A_sql.push(this.makeDeleteDlPatternTbSQL(dlid));
		return this.execDB(A_sql);
	}

	execDB(A_sql) //トランザクションの開始
	//更新ＳＱＬ実行
	{
		var cnt = 0;
		this.get_DB().beginTransaction();

		for (var sql of Object.values(A_sql)) {
			var tmpcnt = this.get_DB().exec(sql);
			cnt += tmpcnt;
		}

		if (A_sql.length == cnt) {
			this.get_DB().commit();
			return true;
		} else {
			this.get_DB().rollback();
			return false;
		}
	}

	getTreePostJS() //部署設定型
	{
		var O_tree = new TreeAJAX();
		O_tree.post_tb = this.H_Tb.post_tb;
		O_tree.post_relation_tb = this.H_Tb.post_relation_tb;
		var O_xlist = new ListAJAX();
		O_xlist.post_tb = this.H_Tb.post_tb;
		O_xlist.post_relation_tb = this.H_Tb.post_relation_tb;
		H_tree.js = O_tree.treeJs() + O_xlist.xlistJs();
		O_tree.setPost = true;
		O_tree.current_postid = this.H_G_Sess.current_postid;
		H_tree.tree_str = O_tree.makeTreePost(this.H_G_Sess.postid);
		O_xlist.type = "setpost";
		H_tree.xlist_str = O_xlist.makeList();
		return H_tree;
	}

	getMonthTarget() //現在登録、最新請求用
	{
		var H_month = Array();

		for (var mon = 0; mon <= 23; mon++) //対象の年、月を取得
		//請求年、月を取得
		//0は最新（今月）の事
		{
			var trg_year = date("Y", mktime(0, 0, 0, date("m") - mon, 1, date("Y")));
			var trg_mon = date("m", mktime(0, 0, 0, date("m") - mon, 1, date("Y")));
			var bill_year = date("Y", mktime(0, 0, 0, date("m") - mon + 1, 1, date("Y")));
			var bill_mon = date("m", mktime(0, 0, 0, date("m") - mon + 1, 1, date("Y")));

			if (mon == 0) {
				var key = "latest";
				H_month[key] = "\u6700\u65B0";
			} else {
				H_month[trg_year + trg_mon] = bill_year + "\u5E74" + bill_mon + "\u6708\u8ACB\u6C42\u5206(" + trg_year + "\u5E74" + trg_mon + "\u6708\u767B\u9332\u5206)";
			}
		}

		H_month.now = date("Y") + "\u5E74" + date("m") + "\u6708\u8ACB\u6C42\u5206(" + date("Y") + "\u5E74" + date("m") + "\u6708\u767B\u9332\u5206)";
		return H_month;
	}

	getMonthTargetEng() //現在登録、最新請求用
	{
		var H_month = Array();

		for (var mon = 0; mon <= 23; mon++) //対象の年、月を取得
		//請求年、月を取得
		//0は最新（今月）の事
		{
			var trg_year = date("Y", mktime(0, 0, 0, date("m") - mon, 1, date("Y")));
			var trg_mon = date("m", mktime(0, 0, 0, date("m") - mon, 1, date("Y")));
			var bill_year = date("Y", mktime(0, 0, 0, date("m") - mon + 1, 1, date("Y")));
			var bill_mon = date("m", mktime(0, 0, 0, date("m") - mon + 1, 1, date("Y")));

			if (mon == 0) {
				var key = "latest";
				H_month[key] = "Latest";
			} else {
				H_month[trg_year + trg_mon] = "Billing information for " + bill_mon + "/" + bill_year + "(for registration in " + trg_mon + "/" + trg_year + ")";
			}
		}

		H_month.now = "Billing information for " + date("m") + "/" + date("Y") + "(for registration in " + date("m") + "/" + date("Y") + ")";
		return H_month;
	}

	getUsableDLPattern(mode) //----------------------諸々試し---------------------------------------------
	//20180606伊達
	//パターンダウンロードに追加するタイプ
	//パターンダウンロードの修正が入ったら、今後はuse_type_listに置き換える
	//$where = を $use_type_list = array("パターンダウンロードのタイプ");
	//--------------------------------------------------------------------------
	//モードによるパターンの絞込み
	//----------------------------------------------------------------------------------------
	//20180606伊達
	//諸々試し
	//use_type_listに指定されているパターンダウンロードのタイプを確認して、whereに追加する
	//今後、権限見てパターンダウンロードのタイプを追加するなら、これ使う・・
	//スーパーユーザーは全てのパターンを使用可
	{
		var A_type = Array();
		var where = "";
		var use_type_list = Array();

		if (mode == VariousDLModel.POSTMODE) {
			use_type_list = ["post"];
		} else if (mode == VariousDLModel.TELMODE) {
			use_type_list = ["tel", "posttel", "telbill", "telpostbill", "telall"];
		} else if (mode == VariousDLModel.ETCMODE) {
			where = " and download_type in ('etc') ";
		} else if (mode == VariousDLModel.PURCHMODE) {
			where = " and download_type in ('purch') ";
		} else if (mode == VariousDLModel.COPYMODE) {
			where = " and download_type in ('copy') ";
		} else if (mode == VariousDLModel.ASSMODE) {
			where = " and download_type in ('assets') ";
		} else if (mode == VariousDLModel.TELPOSTBILLMODE) {
			where = " and download_type in ('telpostbill','telall') ";
		} else if (mode == VariousDLModel.TELBILLMODE) {
			where = " and download_type in ('telbill','telall') ";
		} else if (mode == VariousDLModel.ETCPOSTBILLMODE) {
			where = " and download_type in ('etcpostbill','etcall') ";
		} else if (mode == VariousDLModel.ETCBILLMODE) {
			where = " and download_type in ('etcbill','etcall') ";
		} else if (mode == VariousDLModel.PURCHPOSTBILLMODE) {
			where = " and download_type in ('purchpostbill','purchall') ";
		} else if (mode == VariousDLModel.PURCHBILLMODE) {
			where = " and download_type in ('purchbill','purchall') ";
		} else if (mode == VariousDLModel.COPYPOSTBILLMODE) {
			where = " and download_type in ('copypostbill','copyall') ";
		} else if (mode == VariousDLModel.COPYBILLMODE) {
			where = " and download_type in ('copybill','copyall') ";
		} else if (mode == VariousDLModel.ICCARDPOSTBILLMODE) //交通費対応 20100727miya
			{
				where = " and download_type in ('iccardpostbill') ";
			} else if (mode == VariousDLModel.ICCARDUSERBILLMODE) //交通費対応 20100727miya
			{
				where = " and download_type in ('iccarduserbill') ";
			} else {
			A_type = Array();

			if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true) {
				A_type.push("'post'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_tel_bill") == true) {
				A_type.push("'telpostbill'");
				A_type.push("'telbill'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_card_detail") == true) {
				A_type.push("'etcpostbill'");
				A_type.push("'etcbill'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_purch_bill") == true) {
				A_type.push("'purchpostbill'");
				A_type.push("'purchbill'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_copy_bill") == true) {
				A_type.push("'copypostbill'");
				A_type.push("'copybill'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_tel_manage_vw") == true || -1 !== this.A_Auth.indexOf("fnc_tel_vw") == true) {
				A_type.push("'tel'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_etc_manage_adm") == true) {
				A_type.push("'etc'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_purch_manage_adm") == true) {
				A_type.push("'purch'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_copy_manage_adm") == true) {
				A_type.push("'copy'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_us") == true) {
				A_type.push("'assets'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_tel_manage_vw") == true) {
				A_type.push("'posttel'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_etc_manage_adm") == true) {
				A_type.push("'postetc'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_purch_manage_adm") == true) {
				A_type.push("'postpurch'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_copy_manage_adm") == true) {
				A_type.push("'postcopy'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_us") == true) {
				A_type.push("'postassets'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_tel_bill") == true && -1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_tel_manage_vw") == true) {
				A_type.push("'telall'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_card_detail") == true && -1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_etc_manage_adm") == true) {
				A_type.push("'etcall'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_purch_bill") == true && -1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_purch_manage_adm") == true) {
				A_type.push("'purchall'");
			}

			if (-1 !== this.A_Auth.indexOf("fnc_copy_bill") == true && -1 !== this.A_Auth.indexOf("fnc_const_vw") == true && -1 !== this.A_Auth.indexOf("fnc_copy_manage_adm") == true) {
				A_type.push("'copyall'");
			}

			where = " and download_type in (" + A_type.join(",") + ") ";
		}

		if (!!use_type_list) //権限のビット
			//権限をチェックして、$fnc_flagに追加する
			//部署
			//部署と電話
			//電話請求情報(電話単位)
			//電話請求情報(部署単位)
			//電話・部署・請求
			//電話
			//権限を確認し、A_typeにダウンロードタイプを追加
			//where
			{
				var FNC_POST_VIEW = 1 << 0;
				var FNC_TEL_VIEW = 1 << 1;
				var FNC_TEL_BILL = 1 << 2;
				var fnc_flag = 0;
				if (-1 !== this.A_Auth.indexOf("fnc_const_vw")) fnc_flag |= FNC_POST_VIEW;
				if (-1 !== this.A_Auth.indexOf("fnc_tel_manage_vw")) fnc_flag |= FNC_TEL_VIEW;
				if (-1 !== this.A_Auth.indexOf("fnc_tel_bill")) fnc_flag |= FNC_TEL_BILL;
				var type_list = Array();
				type_list.post = FNC_POST_VIEW;
				type_list.posttel = FNC_POST_VIEW | FNC_TEL_VIEW;
				type_list.telbill = FNC_TEL_BILL;
				type_list.telpostbill = FNC_TEL_BILL;
				type_list.telall = FNC_POST_VIEW | FNC_TEL_VIEW | FNC_TEL_BILL;
				type_list.tel = FNC_TEL_VIEW;
				A_type = Array();

				for (var type of Object.values(use_type_list)) //必要な権限
				//必要な権限
				//必要な権限を全て持っているなら、追加
				{
					var bit = type_list[type];

					if ((fnc_flag & bit) == bit) {
						A_type.push(this.get_DB().dbQuote(type, "text", true));
					}
				}

				if (!A_type) //何も表示しない
					{
						where = " and false";
					} else //検索
					{
						where = " and download_type in (" + A_type.join(",") + ") ";
					}
			}

		if ("ENG" == this.H_G_Sess.language) {
			H_pattern["-1"] = "--Please select--";
		} else {
			H_pattern["-1"] = "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--";
		}

		if (this.H_G_Sess.su == 1) {
			var sql = "select " + " dlid||'|'||download_type as strdlid " + " ,dlname " + " from " + " dl_pattern_tb " + " where " + " pactid=" + this.H_G_Sess.pactid + where + " order by dlid";
			var H_pattern_tmp = this.get_DB().queryAssoc(sql);

			for (var key in H_pattern_tmp) {
				var val = H_pattern_tmp[key];
				H_pattern[key] = val;
			}
		} else //結果用配列
			{
				sql = "select " + " dlid||'|'||download_type as strdlid " + ",postid " + ",dlname " + ",usablepost_type " + " from " + " dl_pattern_tb " + " where " + " pactid=" + this.H_G_Sess.pactid + where + " order by dlid";
				var A_list = this.get_DB().queryHash(sql);

				for (var cnt = 0; cnt < A_list.length; cnt++) //登録部署が自分の部署なら普通に追加
				{
					if (A_list[cnt].postid == this.H_G_Sess.postid) {
						H_pattern[A_list[cnt].strdlid] = A_list[cnt].dlname;
					} else {
						if (A_list[cnt].usablepost_type == 1) //自分の部署があれば配列に追加
							{
								var A_postid = this.O_Post.getChildList(this.H_G_Sess.pactid, A_list[cnt].postid, this.H_Tb.tableno);

								if (-1 !== A_postid.indexOf(this.H_G_Sess.postid) == true) {
									H_pattern[A_list[cnt].strdlid] = A_list[cnt].dlname;
								}
							}
					}
				}
			}

		return H_pattern;
	}

	setTableName(cym) //現在
	{
		var O_table = new MtTableUtil();

		if (this.YM == cym || cym == "latest") {
			this.H_Tb.tableno = "";
			this.H_Tb.tel_tb = "tel_tb";
			this.H_Tb.post_tb = "post_tb";
			this.H_Tb.post_relation_tb = "post_relation_tb";
			this.H_Tb.card_tb = "card_tb";
			this.H_Tb.purchase_tb = "purchase_tb";
			this.H_Tb.copy_tb = "copy_tb";
			this.H_Tb.assets_tb = "assets_tb";
			this.H_Tb.tel_rel_assets_tb = "tel_rel_assets_tb";
			this.H_Tb.tel_rel_tel_tb = "tel_rel_tel_tb";
		} else if (cym == "now") //対象テーブル番号の取得
			//対象テーブル番号の取得
			//交通費対応 20100527miya
			//交通費対応 20100527miya
			{
				cym = date("Ym", mktime(0, 0, 0, this.NowTime.substr(5, 2) - 1, 1, this.NowTime.substr(0, 4)));
				this.H_Tb.tableno = O_table.getTableNo(cym, true);
				this.H_Tb.tel_tb = "tel_tb";
				this.H_Tb.post_tb = "post_tb";
				this.H_Tb.post_relation_tb = "post_relation_tb";
				this.H_Tb.card_tb = "card_tb";
				this.H_Tb.purchase_tb = "purchase_tb";
				this.H_Tb.copy_tb = "copy_tb";
				this.H_Tb.assets_tb = "assets_tb";
				this.H_Tb.tel_rel_assets_tb = "tel_rel_assets_tb";
				this.H_Tb.tel_rel_tel_tb = "tel_rel_tel_tb";
				this.H_Tb.tel_details_tb = "tel_details_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.card_details_tb = "card_details_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.purchase_details_tb = "purchase_details_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.copy_details_tb = "copy_details_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.bill_tb = "bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.tel_bill_tb = "tel_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.kousi_bill_tb = "kousi_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.kousi_tel_bill_tb = "kousi_tel_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.summary_bill_tb = "summary_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.summary_tel_bill_tb = "summary_tel_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.card_post_bill_tb = "card_post_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.card_bill_tb = "card_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.purchase_post_bill_tb = "purchase_post_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.purchase_bill_tb = "purchase_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.copy_post_bill_tb = "copy_post_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.copy_bill_tb = "copy_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.iccard_post_bill_tb = "iccard_post_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.iccard_bill_tb = "iccard_bill_" + this.H_Tb.tableno + "_tb";
			} else //対象テーブル番号の取得
			//対象テーブル名
			//交通費対応 20100527miya
			//交通費対応 20100527miya
			{
				this.H_Tb.tableno = O_table.getTableNo(cym, true);
				this.H_Tb.tel_tb = "tel_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.post_tb = "post_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.post_relation_tb = "post_relation_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.card_tb = "card_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.purchase_tb = "purchase_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.copy_tb = "copy_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.assets_tb = "assets_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.tel_rel_assets_tb = "tel_rel_assets_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.tel_rel_tel_tb = "tel_rel_tel_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.tel_details_tb = "tel_details_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.card_details_tb = "card_details_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.purchase_details_tb = "purchase_details_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.copy_details_tb = "copy_details_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.bill_tb = "bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.tel_bill_tb = "tel_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.kousi_bill_tb = "kousi_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.kousi_tel_bill_tb = "kousi_tel_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.summary_bill_tb = "summary_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.summary_tel_bill_tb = "summary_tel_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.card_post_bill_tb = "card_post_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.card_bill_tb = "card_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.purchase_post_bill_tb = "purchase_post_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.purchase_bill_tb = "purchase_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.copy_post_bill_tb = "copy_post_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.copy_bill_tb = "copy_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.iccard_post_bill_tb = "iccard_post_bill_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.iccard_bill_tb = "iccard_bill_" + this.H_Tb.tableno + "_tb";
			}
	}

	getPostidList(postid, trg) //部署一覧取得
	{
		if (1 == trg) {
			var A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, postid, this.H_Tb.tableno);
		} else {
			A_post = [+postid];
		}

		return A_post;
	}

	checkAboutManageAll(A_pattern, H_sess) {
		if (H_sess.post.trg_month == "latest" && (H_sess.post.use == VariousDLModel.TELALLMODE || H_sess.post.use == VariousDLModel.ETCALLMODE || H_sess.post.use == VariousDLModel.PURCHALLMODE || H_sess.post.use == VariousDLModel.COPYALLMODE)) {
			var A_ex = ["bill_X_tb", "tel_bill_X_tb", "kousi_bill_X_tb", "kousi_tel_bill_X_tb", "summary_bill_X_tb", "summary_tel_bill_X_tb", "card_post_bill_X_tb", "card_bill_X_tb", "purchase_post_bill_X_tb", "purchase_bill_X_tb", "copy_post_bill_X_tb", "copy_bill_X_tb"];
			var A_res = Array();

			for (var cnt = 0; cnt < A_pattern.length; cnt++) {
				if (-1 !== A_ex.indexOf(A_pattern[cnt].tb_name) == false) {
					A_res.push(A_pattern[cnt]);
				}
			}
		} else {
			A_res = A_pattern;
		}

		return A_res;
	}

	getList(A_pattern, H_element, H_sess, A_postid) //科目設定取得
	//設定なし
	//select句作成
	//用途毎にfrom句作成（電話系統の時はついでにオプション一覧取得）
	//対象年月で最新が選択されたら強制的に部署で絞り込み
	//電話が絡む時はオプション、割引サービス
	{
		var O_model = this.getSummaryFormulaModel();
		var H_formula = O_model.getSummaryFormulaKeyHash(this.H_G_Sess.pactid);

		if (!!H_formula) {
			this.FormulaSettingFlag = true;
		}

		A_pattern = this.checkAboutManageAll(A_pattern, H_sess);
		var select = this.makeSelectSQL(A_pattern, H_element);

		if (H_sess.post.use == VariousDLModel.POSTMODE) {
			var from = this.makePostFromSQL();
		} else if (H_sess.post.use == VariousDLModel.TELMODE) //表示言語分岐
			{
				from = this.makeTelFromSQL();
				var O_option = new OptionModel();

				if ("ENG" == this.H_G_Sess.language) {
					var H_op = O_option.getAllOptionDiscountEngKeyHash();
				} else {
					H_op = O_option.getAllOptionDiscountKeyHash();
				}
			} else if (H_sess.post.use == VariousDLModel.ETCMODE) {
			from = this.makeCardFromSQL();
		} else if (H_sess.post.use == VariousDLModel.PURCHMODE) {
			from = this.makePurchaseFromSQL();
		} else if (H_sess.post.use == VariousDLModel.COPYMODE) {
			from = this.makeCopyFromSQL();
		} else if (H_sess.post.use == VariousDLModel.ASSMODE) //重複削除するためselectにassetsno（sysno）とcontractdate（sysdate）を追加
			//表示言語分岐
			{
				select += ",ass.assetsno as sysno,coalesce(te.contractdate,te.recdate) as sysdate";
				from = this.makeAssetsFromSQL();
				O_option = new OptionModel();

				if ("ENG" == this.H_G_Sess.language) {
					H_op = O_option.getAllOptionDiscountEngKeyHash();
				} else {
					H_op = O_option.getAllOptionDiscountKeyHash();
				}
			} else if (H_sess.post.use == VariousDLModel.POSTTELMODE) //表示言語分岐
			{
				from = this.makePostTelFromSQL();
				O_option = new OptionModel();

				if ("ENG" == this.H_G_Sess.language) {
					H_op = O_option.getAllOptionDiscountEngKeyHash();
				} else {
					H_op = O_option.getAllOptionDiscountKeyHash();
				}
			} else if (H_sess.post.use == VariousDLModel.POSTETCMODE) {
			from = this.makePostCardFromSQL();
		} else if (H_sess.post.use == VariousDLModel.POSTPURCHMODE) {
			from = this.makePostPurchaseFromSQL();
		} else if (H_sess.post.use == VariousDLModel.POSTCOPYMODE) {
			from = this.makePostCopyFromSQL();
		} else if (H_sess.post.use == VariousDLModel.POSTASSMODE) //重複削除するためselectにassetsno（sysno）とcontractdate（sysdate）を追加
			//表示言語分岐
			{
				select += ",ass.assetsno as sysno,coalesce(te.contractdate,te.recdate) as sysdate";
				from = this.makePostAssetsFromSQL();
				O_option = new OptionModel();

				if ("ENG" == this.H_G_Sess.language) {
					H_op = O_option.getAllOptionDiscountEngKeyHash();
				} else {
					H_op = O_option.getAllOptionDiscountKeyHash();
				}
			} else if (H_sess.post.use == VariousDLModel.TELPOSTBILLMODE) //表示言語分岐
			{
				from = this.makeTelPostBillFromSQL();
				O_option = new OptionModel();

				if ("ENG" == this.H_G_Sess.language) {
					H_op = O_option.getAllOptionDiscountEngKeyHash();
				} else {
					H_op = O_option.getAllOptionDiscountKeyHash();
				}
			} else if (H_sess.post.use == VariousDLModel.ETCPOSTBILLMODE) {
			from = this.makeCardPostBillFromSQL();
		} else if (H_sess.post.use == VariousDLModel.PURCHPOSTBILLMODE) {
			from = this.makePurchasePostBillFromSQL();
		} else if (H_sess.post.use == VariousDLModel.COPYPOSTBILLMODE) {
			from = this.makeCopyPostBillFromSQL();
		} else if (H_sess.post.use == VariousDLModel.TELBILLMODE) //表示言語分岐
			{
				from = this.makeTelBillFromSQL();
				O_option = new OptionModel();

				if ("ENG" == this.H_G_Sess.language) {
					H_op = O_option.getAllOptionDiscountEngKeyHash();
				} else {
					H_op = O_option.getAllOptionDiscountKeyHash();
				}
			} else if (H_sess.post.use == VariousDLModel.ETCBILLMODE) {
			from = this.makeCardBillFromSQL();
		} else if (H_sess.post.use == VariousDLModel.PURCHBILLMODE) {
			from = this.makePurchaseBillFromSQL();
		} else if (H_sess.post.use == VariousDLModel.COPYBILLMODE) {
			from = this.makeCopyBillFromSQL();
		} else if (H_sess.post.use == VariousDLModel.ICCARDPOSTBILLMODE) //交通費対応 20100527miya
			{
				from = this.makeICCardPostBillFromSQL();
			} else if (H_sess.post.use == VariousDLModel.ICCARDUSERBILLMODE) //交通費対応 20100527miya
			{
				from = this.makeICCardUserBillFromSQL();
			} else if (H_sess.post.use == VariousDLModel.TELALLMODE) //最新月の時は請求削る
			//表示言語分岐
			{
				if (H_sess.post.trg_month == "latest") {
					from = this.makePostTelFromSQL();
				} else {
					select += ",tepob.flag as sysflag";
					from = this.makeTelAllFromSQL(A_pattern[0]);
				}

				O_option = new OptionModel();

				if ("ENG" == this.H_G_Sess.language) {
					H_op = O_option.getAllOptionDiscountEngKeyHash();
				} else {
					H_op = O_option.getAllOptionDiscountKeyHash();
				}
			} else if (H_sess.post.use == VariousDLModel.ETCALLMODE) //最新月の時は請求削る
			{
				if (H_sess.post.trg_month == "latest") {
					from = this.makePostCardFromSQL();
				} else {
					select += ",capob.flag as sysflag";
					from = this.makeCardAllFromSQL(A_pattern[0]);
				}
			} else if (H_sess.post.use == VariousDLModel.PURCHALLMODE) //最新月の時は請求削る
			{
				if (H_sess.post.trg_month == "latest") {
					from = this.makePostPurchaseFromSQL();
				} else {
					select += ",pupob.flag as sysflag";
					from = this.makePurchaseAllFromSQL(A_pattern[0]);
				}
			} else if (H_sess.post.use == VariousDLModel.COPYALLMODE) //最新月の時は請求削る
			{
				if (H_sess.post.trg_month == "latest") {
					from = this.makePostCopyFromSQL();
				} else {
					select += ",copob.flag as sysflag";
					from = this.makeCopyAllFromSQL(A_pattern[0]);
				}
			}

		var where = this.makeWhereSQL(A_pattern, H_element);
		var sql = "select " + select + " from " + from + " where " + " po.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid");

		if (H_sess.post.trg_month == "latest") {
			sql += " and po.postid in (" + A_postid.join(",") + ")";
		} else {
			sql += " and " + A_pattern[0].postid_table + ".postid in (" + A_postid.join(",") + ")";
		}

		if (where != "") {
			sql += " and " + where;
		}

		sql += " order by " + this.makeOrderBySQL(A_pattern, H_element);
		var A_data = this.get_DB().queryHash(sql);

		if (undefined !== H_op == true) {
			A_data = this.convertSerialize(A_data, H_op);
		}

		if (VariousDLModel.ASSMODE == H_sess.post.use || VariousDLModel.POSTASSMODE == H_sess.post.use) {
			A_data = this.deleteDupliAssets(A_data);
		}

		if (VariousDLModel.TELALLMODE == H_sess.post.use || VariousDLModel.ETCALLMODE == H_sess.post.use || VariousDLModel.PURCHALLMODE == H_sess.post.use || VariousDLModel.COPYALLMODE == H_sess.post.use) {
			A_data = this.deleteNoViewData(A_data);
		}

		return A_data;
	}

	makeSelectSQL(A_pattern, H_element) {
		var A_columns = Array();

		for (var cnt = 0; cnt < A_pattern.length; cnt++) {
			if (A_pattern[cnt].download == 1) //テーブルに別名がついているか否か
				//英語ユーザの時はカラムが違う
				//エイリアスの特別処理
				//一回払いなら割賦月額はなくす
				{
					if (undefined !== this.H_Tbname[A_pattern[cnt].tb_name] == true) {
						var tb_name = this.H_Tbname[A_pattern[cnt].tb_name];
					} else {
						tb_name = A_pattern[cnt].tb_name;
					}

					if ("ENG" == this.H_G_Sess.language) {
						if (true == (-1 !== Object.keys(this.H_Engcol).indexOf(A_pattern[cnt].col_name))) {
							A_pattern[cnt].col_name = this.H_Engcol[A_pattern[cnt].col_name];
						}
					} else {
						A_pattern[cnt].col_name = A_pattern[cnt].col_name.replace(/_eng$/g, "");
					}

					if (undefined !== H_element[A_pattern[cnt].col_name].alias == true) //合計項目３
						{
							if (A_pattern[cnt].col_name == "tpsum3") //設定なし
								{
									if (this.FormulaSettingFlag == false) //設定あり
										{
											var str = "(tepob.kamoku1\n\t\t\t\t\t\t\t\t\t+tepob.kamoku2\n\t\t\t\t\t\t\t\t\t+tepob.kamoku3\n\t\t\t\t\t\t\t\t\t+tepob.kamoku4\n\t\t\t\t\t\t\t\t\t+tepob.kamoku5\n\t\t\t\t\t\t\t\t\t+tepob.kamoku6\n\t\t\t\t\t\t\t\t\t+tepob.kamoku7\n\t\t\t\t\t\t\t\t\t+tepob.kamoku8\n\t\t\t\t\t\t\t\t\t+tepob.kamoku9\n\t\t\t\t\t\t\t\t\t+tepob.kamoku10) as " + A_pattern[cnt].col_name;
										} else {
										str = tb_name + "." + H_element[A_pattern[cnt].col_name].alias + " as " + A_pattern[cnt].col_name;
									}
								} else if (A_pattern[cnt].col_name == "sum3") //設定なし
								{
									if (this.FormulaSettingFlag == false) //設定なし
										{
											str = "(teb.kamoku1\n\t\t\t\t\t\t\t\t\t+teb.kamoku2\n\t\t\t\t\t\t\t\t\t+teb.kamoku3\n\t\t\t\t\t\t\t\t\t+teb.kamoku4\n\t\t\t\t\t\t\t\t\t+teb.kamoku5\n\t\t\t\t\t\t\t\t\t+teb.kamoku6\n\t\t\t\t\t\t\t\t\t+teb.kamoku7\n\t\t\t\t\t\t\t\t\t+teb.kamoku8\n\t\t\t\t\t\t\t\t\t+teb.kamoku9\n\t\t\t\t\t\t\t\t\t+teb.kamoku10) as " + A_pattern[cnt].col_name;
										} else {
										str = tb_name + "." + H_element[A_pattern[cnt].col_name].alias + " as " + A_pattern[cnt].col_name;
									}
								} else {
								str = tb_name + "." + H_element[A_pattern[cnt].col_name].alias + " as " + A_pattern[cnt].col_name;
							}
						} else //assetstypenameは会社単位で設定できるので特別処理
						{
							if (A_pattern[cnt].col_name == "assetstypename") {
								str = "case when att1.assetstypeid is not null then att1.assetstypename else att2.assetstypename end as assetstypename";
							} else if (A_pattern[cnt].col_name == "kousiflg") //表示言語分岐
								{
									if ("ENG" == this.H_G_Sess.language) {
										str = " case when te.kousiflg = '0' then 'Classify business and private uses' " + " when te.kousiflg = '1' then 'Do not classify business and private uses' " + " when te.kousiflg is null then 'Not created (company's basic settings are applied)' end as kousiflg ";
									} else {
										str = " case when te.kousiflg = '0' then '\u516C\u79C1\u5206\u8A08\u3059\u308B' " + " when te.kousiflg = '1' then '\u516C\u79C1\u5206\u8A08\u3057\u306A\u3044' " + " when te.kousiflg is null then '\u672A\u8A2D\u5B9A\uFF08\u4F1A\u793E\u306E\u57FA\u672C\u8A2D\u5B9A\u3092\u4F7F\u7528\uFF09' end as kousiflg ";
									}
								} else if (A_pattern[cnt].col_name == "kousibunkei") {
								str = this.makeKousiSelectSQL();
							} else if (A_pattern[cnt].col_name == "assetstypeid") {
								str = "case when att1.assetstypeid is not null then att1.assetstypename else att2.assetstypename end as assetstypename";
							} else if (A_pattern[cnt].col_name == "main_flg") //表示言語分岐
								{
									if ("ENG" == this.H_G_Sess.language) {
										str = " case when terass.main_flg = true then 'Active' " + " when terass.main_flg = false then 'Unused' end as main_flg ";
									} else {
										str = " case when terass.main_flg = true then '\u4F7F\u7528\u4E2D' " + " when terass.main_flg = false then '\u672A\u4F7F\u7528' end as main_flg ";
									}
								} else if (A_pattern[cnt].col_name == "commflag") {
								str = " case when te.commflag = 'auto' then '\u81EA\u52D5\u66F4\u65B0\u3059\u308B' " + " when te.commflag = 'manual' then '\u81EA\u52D5\u66F4\u65B0\u3057\u306A\u3044' end as commflag ";
							} else if (A_pattern[cnt].col_name == "productname") {
								str = "case when prd.productname is null then ass.productname else prd.productname end as productname";
							} else {
								str = tb_name + "." + A_pattern[cnt].col_name;
							}
						}

					if (str == "ass.pay_monthly_sum") {
						str = "case when ass.pay_frequency = 1 then NULL else ass.pay_monthly_sum end as pay_monthly_sum";
					}

					A_columns.push(str);
				}
		}

		return A_columns.join(",");
	}

	makeKousiSelectSQL() //公私締日より後
	//select部分
	{
		var sql = "select coalesce(kousilimitday,0) from pact_tb where pactid=" + this.H_G_Sess.pactid;
		var kousilimitday = this.get_DB().queryAll(sql);
		var today = this.NowTime.substr(8, 2);

		if (today > kousilimitday) {
			this.H_Kousilabel.label_else = this.H_Kousilabel.label_edit;
			this.H_Kousilabel.no_else = this.H_Kousilabel.no_edit;
		} else {
			this.H_Kousilabel.label_else = this.H_Kousilabel.label_fix;
			this.H_Kousilabel.no_else = this.H_Kousilabel.no_fix;
		}

		var str = "case" + " when coalesce(te.kousiflg,'1') = '1' then '" + this.H_Kousilabel.label_not_use + "'" + " when (case" + " when kousi_pattern_tb.patternid is null then kousi_pattern_default_tb.patternid" + " else kousi_pattern_tb.patternid end) not in" + " (select patternid from kousi_pattern_tb where coalesce(comhistflg,'0')='1') then '" + this.H_Kousilabel.label_not_com + "'" + " when coalesce(te.kousi_fix_flg,0) = 2 then '" + this.H_Kousilabel.label_edit + "'" + " when coalesce(te.kousi_fix_flg,0) = 1 then '" + this.H_Kousilabel.label_fix + "'" + " else '" + this.H_Kousilabel.label_else + "'" + " end as kousibunkei";
		return str;
	}

	makePostFromSQL() //from句作成
	{
		var from = this.H_Tb.post_tb + " po " + " left outer join " + this.H_Tb.post_relation_tb + " porl on po.postid=porl.postidchild" + " left outer join " + this.H_Tb.post_tb + " po2 on po2.postid=porl.postidparent ";
		return from;
	}

	makeTelPostBillFromSQL() //from句作成
	{
		var from = this.H_Tb.bill_tb + " tepob " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=tepob.postid " + " left outer join carrier_tb on tepob.carid = carrier_tb.carid " + " left outer join " + this.H_Tb.kousi_bill_tb + " kotepob on tepob.postid=kotepob.postid " + " and tepob.flag=kotepob.flag and tepob.carid=kotepob.carid " + " left outer join " + this.H_Tb.summary_bill_tb + " sutepob on tepob.postid=sutepob.postid " + " and tepob.flag=sutepob.flag and tepob.carid=sutepob.carid ";
		return from;
	}

	makeCardPostBillFromSQL() //from句作成
	{
		var from = this.H_Tb.card_post_bill_tb + " capob " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=capob.postid " + " left outer join card_co_tb on capob.cardcoid = card_co_tb.cardcoid ";
		return from;
	}

	makePurchasePostBillFromSQL() //from句作成
	{
		var from = this.H_Tb.purchase_post_bill_tb + " pupob " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=pupob.postid " + " left outer join purchase_co_tb on pupob.purchcoid = purchase_co_tb.purchcoid ";
		return from;
	}

	makeCopyPostBillFromSQL() //from句作成
	{
		var from = this.H_Tb.copy_post_bill_tb + " copob " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=copob.postid " + " left outer join copy_co_tb on copob.copycoid = copy_co_tb.copycoid ";
		return from;
	}

	makeTelBillFromSQL() //from句作成
	{
		var from = this.H_Tb.tel_bill_tb + " teb " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=teb.postid " + " left outer join " + this.H_Tb.tel_tb + " te on te.telno=teb.telno " + " and teb.carid=te.carid and te.pactid=teb.pactid " + " left outer join carrier_tb on teb.carid=carrier_tb.carid " + " left outer join " + this.H_Tb.kousi_tel_bill_tb + " koteb on teb.postid=koteb.postid " + " and teb.telno=koteb.telno and teb.carid=koteb.carid " + " left outer join " + this.H_Tb.summary_tel_bill_tb + " suteb on teb.postid=suteb.postid " + " and teb.telno=suteb.telno and teb.carid=suteb.carid " + " left outer join kousi_pattern_tb on te.kousiptn=kousi_pattern_tb.patternid " + " left outer join kousi_default_tb on te.pactid=kousi_default_tb.pactid " + " and te.carid=kousi_default_tb.carid " + " left join kousi_pattern_tb as kousi_pattern_default_tb on kousi_default_tb.patternid=kousi_pattern_default_tb.patternid ";
		return from;
	}

	makeCardBillFromSQL() //from句作成
	{
		var from = this.H_Tb.card_bill_tb + " cab " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=cab.postid " + " left outer join " + this.H_Tb.card_tb + " ca on ca.cardno=cab.cardno " + " left outer join card_co_tb on cab.cardcoid=card_co_tb.cardcoid ";
		return from;
	}

	makePurchaseBillFromSQL() //from句作成
	{
		var from = this.H_Tb.purchase_bill_tb + " pub " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=pub.postid " + " left outer join " + this.H_Tb.purchase_tb + " pu on pu.purchid=pub.purchid " + " and pub.purchcoid=pu.purchcoid " + " left outer join purchase_co_tb on pub.purchcoid=purchase_co_tb.purchcoid ";
		return from;
	}

	makeCopyBillFromSQL() //from句作成
	{
		var from = this.H_Tb.copy_bill_tb + " cob " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=cob.postid " + " left outer join " + this.H_Tb.copy_tb + " co on co.copyid=cob.copyid " + " left outer join copy_co_tb on cob.copycoid=copy_co_tb.copycoid ";
		return from;
	}

	makeICCardPostBillFromSQL() //from句作成
	{
		var from = this.H_Tb.iccard_post_bill_tb + " icpob " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=icpob.postid " + " left outer join iccard_co_tb on icpob.iccardcoid=iccard_co_tb.iccardcoid ";
		return from;
	}

	makeICCardUserBillFromSQL() //from句作成
	{
		var from = this.H_Tb.iccard_bill_tb + " icb " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=icb.postid " + " left outer join iccard_co_tb on icb.iccardcoid=iccard_co_tb.iccardcoid ";
		return from;
	}

	makeTelFromSQL() //from句作成
	//機種名を最新のものを表示して欲しいと言われました #53
	{
		var from = this.H_Tb.tel_tb + " te " + " left outer join carrier_tb on carrier_tb.carid=te.carid " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=te.postid " + " left outer join area_tb on area_tb.arid=te.arid " + " left outer join buyselect_tb on buyselect_tb.buyselid=te.buyselid " + " left outer join circuit_tb on circuit_tb.cirid=te.cirid " + " left outer join plan_tb on plan_tb.planid=te.planid " + " left outer join user_tb on user_tb.userid=te.userid " + " left outer join packet_tb on packet_tb.packetid=te.packetid " + " left outer join point_tb on point_tb.pointid=te.pointstage " + " left outer join kousi_pattern_tb on kousi_pattern_tb.patternid=te.kousiptn " + " left outer join " + this.H_Tb.tel_rel_assets_tb + " terass on te.pactid=terass.pactid " + " and te.telno=terass.telno and te.carid=terass.carid " + " left outer join " + this.H_Tb.assets_tb + " ass on terass.assetsid=ass.assetsid " + " and ass.delete_flg=false " + " left outer join smart_circuit_tb on smart_circuit_tb.smpcirid=ass.smpcirid " + " left outer join (select pactid, username as recogname, employeecode from user_tb) as recogu on te.recogcode = recogu.employeecode and te.pactid = recogu.pactid " + " left outer join (select pactid, postname as pbpostname, userpostid from " + this.H_Tb.post_tb + ") as pbp on te.pbpostcode_first = pbp.userpostid and te.pactid = pbp.pactid " + " left outer join (select pactid, postname as cfbpostname, userpostid from " + this.H_Tb.post_tb + ") as cfbp on te.cfbpostcode_first = cfbp.userpostid and te.pactid = cfbp.pactid ";
		from += " left outer join product_tb as prd on prd.productid = ass.productid ";
		return from;
	}

	makeCardFromSQL() //from句作成
	{
		var from = this.H_Tb.card_tb + " ca " + " left outer join card_co_tb on card_co_tb.cardcoid=ca.cardcoid " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=ca.postid " + " left outer join user_tb on user_tb.userid=ca.userid ";
		return from;
	}

	makePurchaseFromSQL() //from句作成
	{
		var from = this.H_Tb.purchase_tb + " pu " + " left outer join purchase_co_tb on purchase_co_tb.purchcoid=pu.purchcoid " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=pu.postid ";
		return from;
	}

	makeCopyFromSQL() //from句作成
	{
		var from = this.H_Tb.copy_tb + " co " + " left outer join copy_co_tb on copy_co_tb.copycoid=co.copycoid " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=co.postid ";
		return from;
	}

	makeAssetsFromSQL() //from句作成
	{
		var from = this.H_Tb.assets_tb + " ass " + " left outer join carrier_tb carrier_tb2 on carrier_tb2.carid=ass.search_carid " + " left outer join circuit_tb circuit_tb2 on circuit_tb2.cirid=ass.search_cirid " + " left outer join assets_type_tb as att1 on ass.assetstypeid=att1.assetstypeid " + " and ass.pactid=att1.pactid " + " left outer join assets_type_tb as att2 on ass.assetstypeid=att2.assetstypeid " + " and att2.pactid=0" + " left outer join " + this.H_Tb.tel_rel_assets_tb + " terass on ass.assetsid=terass.assetsid " + " left outer join " + this.H_Tb.tel_tb + " te on terass.pactid=te.pactid " + " and te.telno=terass.telno and te.carid=terass.carid and te.dummy_flg=false " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=ass.postid " + " left outer join carrier_tb on carrier_tb.carid=te.carid " + " left outer join area_tb on area_tb.arid=te.arid " + " left outer join buyselect_tb on buyselect_tb.buyselid=te.buyselid " + " left outer join circuit_tb on circuit_tb.cirid=te.cirid " + " left outer join plan_tb on plan_tb.planid=te.planid " + " left outer join user_tb on user_tb.userid=te.userid " + " left outer join packet_tb on packet_tb.packetid=te.packetid " + " left outer join point_tb on point_tb.pointid=te.pointstage " + " left outer join kousi_pattern_tb on kousi_pattern_tb.patternid=te.kousiptn " + " left outer join smart_circuit_tb on smart_circuit_tb.smpcirid=ass.smpcirid ";
		return from;
	}

	makePostTelFromSQL() //from句作成
	//機種名を最新のものを表示して欲しいと言われました #53
	{
		var from = this.H_Tb.tel_tb + " te " + " left outer join carrier_tb on carrier_tb.carid=te.carid " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=te.postid " + " left outer join " + this.H_Tb.post_relation_tb + " porl on po.postid=porl.postidchild" + " left outer join " + this.H_Tb.post_tb + " po2 on po2.postid=porl.postidparent " + " left outer join area_tb on area_tb.arid=te.arid " + " left outer join buyselect_tb on buyselect_tb.buyselid=te.buyselid " + " left outer join circuit_tb on circuit_tb.cirid=te.cirid " + " left outer join plan_tb on plan_tb.planid=te.planid " + " left outer join user_tb on user_tb.userid=te.userid " + " left outer join packet_tb on packet_tb.packetid=te.packetid " + " left outer join point_tb on point_tb.pointid=te.pointstage " + " left outer join kousi_pattern_tb on kousi_pattern_tb.patternid=te.kousiptn " + " left outer join " + this.H_Tb.tel_rel_assets_tb + " terass on te.pactid=terass.pactid " + " and te.telno=terass.telno and te.carid=terass.carid " + " left outer join " + this.H_Tb.assets_tb + " ass on terass.assetsid=ass.assetsid " + " and ass.delete_flg=false " + " left outer join smart_circuit_tb on smart_circuit_tb.smpcirid=ass.smpcirid " + " left outer join (select pactid, username as recogname, employeecode from user_tb) as recogu on te.recogcode = recogu.employeecode and te.pactid = recogu.pactid " + " left outer join (select pactid, postname as pbpostname, userpostid from " + this.H_Tb.post_tb + ") as pbp on te.pbpostcode_first = pbp.userpostid and te.pactid = pbp.pactid " + " left outer join (select pactid, postname as cfbpostname, userpostid from " + this.H_Tb.post_tb + ") as cfbp on te.cfbpostcode_first = cfbp.userpostid and te.pactid = cfbp.pactid ";
		from += " left outer join product_tb as prd on prd.productid = ass.productid ";
		return from;
	}

	makePostCardFromSQL() //from句作成
	{
		var from = this.H_Tb.card_tb + " ca " + " left outer join card_co_tb on card_co_tb.cardcoid=ca.cardcoid " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=ca.postid " + " left outer join " + this.H_Tb.post_relation_tb + " porl on po.postid=porl.postidchild" + " left outer join " + this.H_Tb.post_tb + " po2 on po2.postid=porl.postidparent " + " left outer join user_tb on user_tb.userid=ca.userid ";
		return from;
	}

	makePostPurchaseFromSQL() //from句作成
	{
		var from = this.H_Tb.purchase_tb + " pu " + " left outer join purchase_co_tb on purchase_co_tb.purchcoid=pu.purchcoid " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=pu.postid " + " left outer join " + this.H_Tb.post_relation_tb + " porl on po.postid=porl.postidchild" + " left outer join " + this.H_Tb.post_tb + " po2 on po2.postid=porl.postidparent ";
		return from;
	}

	makePostCopyFromSQL() //from句作成
	{
		var from = this.H_Tb.copy_tb + " co " + " left outer join copy_co_tb on copy_co_tb.copycoid=co.copycoid " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=co.postid " + " left outer join " + this.H_Tb.post_relation_tb + " porl on po.postid=porl.postidchild" + " left outer join " + this.H_Tb.post_tb + " po2 on po2.postid=porl.postidparent ";
		return from;
	}

	makePostAssetsFromSQL() //from句作成
	{
		var from = this.H_Tb.assets_tb + " ass " + " left outer join carrier_tb carrier_tb2 on carrier_tb2.carid=ass.search_carid " + " left outer join circuit_tb circuit_tb2 on circuit_tb2.cirid=ass.search_cirid " + " left outer join assets_type_tb as att1 on ass.assetstypeid=att1.assetstypeid " + " and ass.pactid=att1.pactid " + " left outer join assets_type_tb as att2 on ass.assetstypeid=att2.assetstypeid " + " and att2.pactid=0" + " left outer join " + this.H_Tb.tel_rel_assets_tb + " terass on ass.assetsid=terass.assetsid " + " left outer join " + this.H_Tb.tel_tb + " te on terass.pactid=te.pactid " + " and te.telno=terass.telno and te.carid=terass.carid and te.dummy_flg=false " + " left outer join " + this.H_Tb.post_tb + " po on po.postid=ass.postid " + " left outer join " + this.H_Tb.post_relation_tb + " porl on po.postid=porl.postidchild" + " left outer join " + this.H_Tb.post_tb + " po2 on po2.postid=porl.postidparent " + " left outer join carrier_tb on carrier_tb.carid=te.carid " + " left outer join area_tb on area_tb.arid=te.arid " + " left outer join buyselect_tb on buyselect_tb.buyselid=te.buyselid " + " left outer join circuit_tb on circuit_tb.cirid=te.cirid " + " left outer join plan_tb on plan_tb.planid=te.planid " + " left outer join user_tb on user_tb.userid=te.userid " + " left outer join packet_tb on packet_tb.packetid=te.packetid " + " left outer join point_tb on point_tb.pointid=te.pointstage " + " left outer join kousi_pattern_tb on kousi_pattern_tb.patternid=te.kousiptn " + " left outer join smart_circuit_tb on smart_circuit_tb.smpcirid=ass.smpcirid ";
		return from;
	}

	makeTelAllFromSQL(H_pattern) //from句作成
	//機種名を最新のものを表示して欲しいと言われました #53
	{
		if (H_pattern.postid_table == "teb") {
			var from = this.H_Tb.post_tb + " po " + " left outer join " + this.H_Tb.post_relation_tb + " porl on po.postid=porl.postidchild " + " left outer join " + this.H_Tb.post_tb + " po2 on po2.postid=porl.postidparent " + " left outer join " + this.H_Tb.tel_bill_tb + " teb on po.postid=teb.postid " + " left outer join " + this.H_Tb.bill_tb + " tepob on po.postid=tepob.postid " + " and tepob.carid=teb.carid " + " left outer join " + this.H_Tb.tel_tb + " te on po.pactid=te.pactid " + " and te.telno=teb.telno and te.carid=teb.carid ";
		} else {
			from = this.H_Tb.post_tb + " po " + " left outer join " + this.H_Tb.post_relation_tb + " porl on po.postid=porl.postidchild " + " left outer join " + this.H_Tb.post_tb + " po2 on po2.postid=porl.postidparent " + " left outer join " + this.H_Tb.tel_tb + " te on po.postid=te.postid " + " left outer join " + this.H_Tb.bill_tb + " tepob on po.postid=tepob.postid " + " and tepob.carid=te.carid " + " left outer join " + this.H_Tb.tel_bill_tb + " teb on po.postid=teb.postid " + " and te.telno=teb.telno and te.carid=teb.carid ";
		}

		from += " left outer join carrier_tb on carrier_tb.carid=te.carid " + " left outer join area_tb on area_tb.arid=te.arid " + " left outer join buyselect_tb on buyselect_tb.buyselid=te.buyselid " + " left outer join circuit_tb on circuit_tb.cirid=te.cirid " + " left outer join plan_tb on plan_tb.planid=te.planid " + " left outer join user_tb on user_tb.userid=te.userid " + " left outer join packet_tb on packet_tb.packetid=te.packetid " + " left outer join point_tb on point_tb.pointid=te.pointstage " + " left outer join " + this.H_Tb.kousi_bill_tb + " kotepob on po.postid=kotepob.postid " + " and tepob.carid=kotepob.carid " + " and tepob.flag=kotepob.flag " + " left outer join " + this.H_Tb.kousi_tel_bill_tb + " koteb on teb.postid=koteb.postid " + " and teb.telno=koteb.telno and teb.carid=koteb.carid " + " left outer join " + this.H_Tb.summary_bill_tb + " sutepob on teb.postid=sutepob.postid " + " and tepob.carid=sutepob.carid " + " and tepob.flag=sutepob.flag " + " left outer join " + this.H_Tb.summary_tel_bill_tb + " suteb on teb.postid=suteb.postid " + " and teb.telno = suteb.telno and teb.carid = suteb.carid " + " left outer join " + this.H_Tb.tel_rel_assets_tb + " terass on te.pactid=terass.pactid " + " and te.telno = terass.telno and te.carid = terass.carid " + " left outer join " + this.H_Tb.assets_tb + " ass on terass.assetsid=ass.assetsid " + " and ass.delete_flg=false " + " left outer join smart_circuit_tb on smart_circuit_tb.smpcirid=ass.smpcirid" + " left outer join kousi_pattern_tb on te.kousiptn=kousi_pattern_tb.patternid " + " left outer join kousi_default_tb on te.pactid=kousi_default_tb.pactid " + " and te.carid=kousi_default_tb.carid " + " left outer join kousi_pattern_tb as kousi_pattern_default_tb on kousi_default_tb.patternid = kousi_pattern_default_tb.patternid " + " left outer join (select pactid, username as recogname, employeecode from user_tb) as recogu on te.recogcode = recogu.employeecode and te.pactid = recogu.pactid " + " left outer join (select pactid, postname as pbpostname, userpostid from " + this.H_Tb.post_tb + ") as pbp on te.pbpostcode_first = pbp.userpostid and te.pactid = pbp.pactid " + " left outer join (select pactid, postname as cfbpostname, userpostid from " + this.H_Tb.post_tb + ") as cfbp on te.cfbpostcode_first = cfbp.userpostid and te.pactid = cfbp.pactid ";
		from += " left outer join product_tb as prd on prd.productid = ass.productid ";
		return from;
	}

	makeCardAllFromSQL(H_pattern) //from句作成
	{
		if (H_pattern.postid_table == "cab") {
			var from = this.H_Tb.post_tb + " po " + " left outer join " + this.H_Tb.post_relation_tb + " porl on po.postid=porl.postidchild " + " left outer join " + this.H_Tb.post_tb + " po2 on po2.postid=porl.postidparent " + " left outer join " + this.H_Tb.card_bill_tb + " cab on po.postid=cab.postid " + " left outer join " + this.H_Tb.card_post_bill_tb + " capob on po.postid=capob.postid " + " and cab.cardcoid=capob.cardcoid " + " left outer join " + this.H_Tb.card_tb + " ca on po.pactid=ca.pactid " + " and ca.cardno=cab.cardno ";
		} else {
			from = this.H_Tb.post_tb + " po " + " left outer join " + this.H_Tb.post_relation_tb + " porl on po.postid=porl.postidchild " + " left outer join " + this.H_Tb.post_tb + " po2 on po2.postid=porl.postidparent " + " left outer join " + this.H_Tb.card_tb + " ca on po.postid=ca.postid " + " left outer join " + this.H_Tb.card_post_bill_tb + " capob on ca.postid=capob.postid " + " and ca.cardcoid=capob.cardcoid " + " left outer join " + this.H_Tb.card_bill_tb + " cab on po.postid=cab.postid " + " and ca.cardno=cab.cardno ";
		}

		from += " left outer join card_co_tb on card_co_tb.cardcoid=ca.cardcoid " + " left outer join user_tb on user_tb.userid=ca.userid ";
		return from;
	}

	makePurchaseAllFromSQL(H_pattern) //from句作成
	{
		if (H_pattern.postid_table == "pub") {
			var from = this.H_Tb.post_tb + " po " + " left outer join " + this.H_Tb.post_relation_tb + " porl on po.postid=porl.postidchild " + " left outer join " + this.H_Tb.post_tb + " po2 on po2.postid=porl.postidparent " + " left outer join " + this.H_Tb.purchase_bill_tb + " pub on po.postid=pub.postid " + " left outer join " + this.H_Tb.purchase_post_bill_tb + " pupob on po.postid=pupob.postid " + " and pupob.purchcoid=pub.purchcoid " + " left outer join " + this.H_Tb.purchase_tb + " pu on po.pactid=pu.pactid " + " and pu.purchid=pub.purchid and pu.purchcoid=pub.purchcoid ";
		} else {
			from = this.H_Tb.post_tb + " po " + " left outer join " + this.H_Tb.post_relation_tb + " porl on po.postid=porl.postidchild " + " left outer join " + this.H_Tb.post_tb + " po2 on po2.postid=porl.postidparent " + " left outer join " + this.H_Tb.purchase_tb + " pu on po.postid=pu.postid " + " left outer join " + this.H_Tb.purchase_post_bill_tb + " pupob on pu.postid=pupob.postid " + " and pupob.purchcoid=pu.purchcoid " + " left outer join " + this.H_Tb.purchase_bill_tb + " pub on pu.purchid=pub.purchid " + " and pu.postid=pub.postid and pu.purchcoid=pub.purchcoid ";
		}

		from += " left outer join purchase_co_tb on purchase_co_tb.purchcoid=pu.purchcoid ";
		return from;
	}

	makeCopyAllFromSQL(H_pattern) //from句作成
	{
		if (H_pattern.postid_table == "pub") {
			var from = this.H_Tb.post_tb + " po " + " left outer join " + this.H_Tb.post_relation_tb + " porl on po.postid=porl.postidchild " + " left outer join " + this.H_Tb.post_tb + " po2 on po2.postid=porl.postidparent " + " left outer join " + this.H_Tb.copy_bill_tb + " cob on po.postid=cob.postid " + " left outer join " + this.H_Tb.copy_post_bill_tb + " copob on co.postid=copob.postid " + " and copob.copycoid=co.copycoid " + " left outer join " + this.H_Tb.copy_tb + " co on po.pactid=co.pactid " + " and co.copyid=cob.copyid and co.copycoid=cob.copycoid ";
		} else {
			from = this.H_Tb.post_tb + " po " + " left outer join " + this.H_Tb.post_relation_tb + " porl on po.postid=porl.postidchild " + " left outer join " + this.H_Tb.post_tb + " po2 on po2.postid=porl.postidparent " + " left outer join " + this.H_Tb.copy_tb + " co on po.postid=co.postid " + " left outer join " + this.H_Tb.copy_post_bill_tb + " copob on co.postid=copob.postid " + " and copob.copycoid=co.copycoid " + " left outer join " + this.H_Tb.copy_bill_tb + " cob on co.copyid=cob.copyid " + " and co.postid=cob.postid and co.copycoid=cob.copycoid ";
		}

		from += " left outer join copy_co_tb on copy_co_tb.copycoid=co.copycoid ";
		return from;
	}

	makeWhereSQL(A_pattern, H_element) //パターンの言語取得
	//請求部署単位系はflag追加
	{
		var A_where = Array();

		for (var cnt = 0; cnt < A_pattern.length; cnt++) {
			if (true == (-1 !== Object.values(this.H_Engcol).indexOf(A_pattern[cnt].col_name))) {
				var ptn_lang = "ENG";
				break;
			} else {
				ptn_lang = "JPN";
			}
		}

		for (cnt = 0;; cnt < A_pattern.length; cnt++) {
			if (A_pattern[cnt].value != undefined && A_pattern[cnt].value != "") //テーブルに別名がついているか否か
				//selectとwhereのカラム名が別か否か
				//数値型
				{
					if (undefined !== this.H_Tbname[A_pattern[cnt].tb_name] == true) {
						var tb_name = this.H_Tbname[A_pattern[cnt].tb_name];
					} else {
						tb_name = A_pattern[cnt].tb_name;
					}

					if (undefined !== H_element[A_pattern[cnt].col_name].where == true) {
						var col_name = H_element[A_pattern[cnt].col_name].where;
					} else if (undefined !== H_element[A_pattern[cnt].col_name.replace(/_eng$/g, "")].where == true) {
						col_name = H_element[A_pattern[cnt].col_name.replace(/_eng$/g, "")].where;
					} else if (undefined !== H_element[this.H_Engcol[A_pattern[cnt].col_name]].where == true) {
						col_name = H_element[this.H_Engcol[A_pattern[cnt].col_name]].where;
					} else //別名を付けているか否か
						{
							if (undefined !== H_element[A_pattern[cnt].col_name].alias == true) {
								col_name = H_element[A_pattern[cnt].col_name].alias;
							} else if (undefined !== H_element[this.H_Engcol[A_pattern[cnt].col_name]].alias == true) {
								col_name = H_element[this.H_Engcol[A_pattern[cnt].col_name]].alias;
							} else if (undefined !== H_element[A_pattern[cnt].col_name.replace(/_eng$/g, "")].alias == true) {
								col_name = H_element[A_pattern[cnt].col_name.replace(/_eng$/g, "")].alias;
							} else {
								col_name = A_pattern[cnt].col_name;
							}
						}

					if (H_element[A_pattern[cnt].col_name].type == "integer") //合計項目3は特別処理
						{
							if (A_pattern[cnt].col_name == "sum3") //設定なし
								{
									if (this.FormulaSettingFlag == false) {
										var str = "(teb.kamoku1\n\t\t\t\t\t\t\t\t\t+teb.kamoku2\n\t\t\t\t\t\t\t\t\t+teb.kamoku3\n\t\t\t\t\t\t\t\t\t+teb.kamoku4\n\t\t\t\t\t\t\t\t\t+teb.kamoku5\n\t\t\t\t\t\t\t\t\t+teb.kamoku6\n\t\t\t\t\t\t\t\t\t+teb.kamoku7\n\t\t\t\t\t\t\t\t\t+teb.kamoku8\n\t\t\t\t\t\t\t\t\t+teb.kamoku9\n\t\t\t\t\t\t\t\t\t+teb.kamoku10) " + A_pattern[cnt].sign + this.get_DB().dbQuote(+A_pattern[cnt].value, "integer", true);
									} else {
										str = tb_name + "." + col_name + A_pattern[cnt].sign + this.get_DB().dbQuote(+A_pattern[cnt].value, "integer", true);
									}
								} else if (A_pattern[cnt].col_name == "tpsum3") //設定なし
								{
									if (this.FormulaSettingFlag == false) {
										str = "(tepob.kamoku1\n\t\t\t\t\t\t\t\t\t+tepob.kamoku2\n\t\t\t\t\t\t\t\t\t+tepob.kamoku3\n\t\t\t\t\t\t\t\t\t+tepob.kamoku4\n\t\t\t\t\t\t\t\t\t+tepob.kamoku5\n\t\t\t\t\t\t\t\t\t+tepob.kamoku6\n\t\t\t\t\t\t\t\t\t+tepob.kamoku7\n\t\t\t\t\t\t\t\t\t+tepob.kamoku8\n\t\t\t\t\t\t\t\t\t+tepob.kamoku9\n\t\t\t\t\t\t\t\t\t+tepob.kamoku10) " + A_pattern[cnt].sign + this.get_DB().dbQuote(+A_pattern[cnt].value, "integer", true);
									} else {
										str = tb_name + "." + col_name + A_pattern[cnt].sign + this.get_DB().dbQuote(+A_pattern[cnt].value, "integer", true);
									}
								} else {
								str = tb_name + "." + col_name + A_pattern[cnt].sign + this.get_DB().dbQuote(+A_pattern[cnt].value, "integer", true);
							}
						} else if (H_element[A_pattern[cnt].col_name].type == "date" || H_element[A_pattern[cnt].col_name].type == "month") {
						str = tb_name + "." + col_name + this.getValueFormat(A_pattern[cnt].sign, A_pattern[cnt].value, H_element[A_pattern[cnt].col_name].type);
					} else //公私分計の絞り込みは特別処理
						{
							if (A_pattern[cnt].col_name == "kousibunkei") {
								str = this.makeKousiWhereSQL(A_pattern[cnt].sign, A_pattern[cnt].value);
							} else if (A_pattern[cnt].col_name == "options" || A_pattern[cnt].col_name == "discounts") {
								str = this.getOptionsSQL(A_pattern[cnt].sign, A_pattern[cnt].value, A_pattern[cnt].col_name, ptn_lang);
							} else if (H_element[A_pattern[cnt].col_name].type == "select" || H_element[A_pattern[cnt].col_name.replace(/_eng$/g, "")].type == "select" || H_element[this.H_Engcol[A_pattern[cnt].col_name]].type == "select") //電話の回線管理
								{
									if (A_pattern[cnt].col_name == "cirname" || A_pattern[cnt].col_name == "cirname_eng") {
										str = "coalesce(" + tb_name + "." + col_name + ",'')" + A_pattern[cnt].sign + this.get_DB().dbQuote(A_pattern[cnt].value, "text", true);
									} else if (A_pattern[cnt].col_name == "main_flg") //使用中での絞り込み
										{
											if (A_pattern[cnt].value == "true") {
												if (A_pattern[cnt].sign == "=") {
													str = "(terass.main_flg=TRUE or terass.main_flg is null)";
												} else {
													str = "terass.main_flg=FALSE";
												}
											} else {
												if (A_pattern[cnt].sign == "=") {
													str = "terass.main_flg=FALSE";
												} else {
													str = "(terass.main_flg=TRUE or terass.main_flg is null)";
												}
											}
										} else if (A_pattern[cnt].col_name == "assetstypename") {
										str = "case when att1.assetstypeid is not null then att1.assetstypeid " + A_pattern[cnt].sign + this.get_DB().dbQuote(A_pattern[cnt].value, "integer", true) + " else att2.assetstypeid " + A_pattern[cnt].sign + this.get_DB().dbQuote(A_pattern[cnt].value, "integer", true) + " end";
									} else if (A_pattern[cnt].col_name == "commflag") {
										str = tb_name + "." + col_name + A_pattern[cnt].sign + this.get_DB().dbQuote(A_pattern[cnt].value, "text", true);
									} else {
										str = tb_name + "." + col_name + A_pattern[cnt].sign + this.get_DB().dbQuote(A_pattern[cnt].value, "integer", true);
									}
								} else //_view系
								{
									if (A_pattern[cnt].col_name == "telno_view" || A_pattern[cnt].col_name.cardno_view == "cardno_view") {
										A_pattern[cnt].value = this.O_Util.convertNoView(A_pattern[cnt].value);
									}

									str = "coalesce(" + tb_name + "." + col_name + ",'')" + this.getValueFormat(A_pattern[cnt].sign, A_pattern[cnt].value, H_element[A_pattern[cnt].col_name].type);
								}
						}

					if (str != "") {
						A_where.push(str);
					}
				}
		}

		if (A_pattern[0].download_type == VariousDLModel.TELPOSTBILLMODE) {
			A_where.push("tepob.flag='0'");
			A_where.push("coalesce(tepob.phone,0)>0");
		} else if (A_pattern[0].download_type == VariousDLModel.ETCPOSTBILLMODE) {
			A_where.push("capob.flag='0'");
			A_where.push("coalesce(capob.card,0)>0");
		} else if (A_pattern[0].download_type == VariousDLModel.PURCHPOSTBILLMODE) {
			A_where.push("pupob.flag='0'");
			A_where.push("coalesce(pupob.purchid_num,0)>0");
		} else if (A_pattern[0].download_type == VariousDLModel.COPYPOSTBILLMODE) {
			A_where.push("copob.flag='0'");
			A_where.push("coalesce(copob.copyid_num,0)>0");
		} else if (A_pattern[0].download_type == VariousDLModel.ICCARDPOSTBILLMODE) //交通費対応 20100527miya
			{
				A_where.push("icpob.flag='0'");
				A_where.push("icpob.iccardcoid != 0");
			}

		if (A_pattern[0].download_type == VariousDLModel.TELMODE || A_pattern[0].download_type == VariousDLModel.POSTTELMODE || A_pattern[0].download_type == VariousDLModel.TELALLMODE) {
			A_where.push("(te.dummy_flg=false or te.dummy_flg is null)");
		} else if (A_pattern[0].download_type == VariousDLModel.ETCMODE || A_pattern[0].download_type == VariousDLModel.POSTETCMODE || A_pattern[0].download_type == VariousDLModel.ETCALLMODE) {
			A_where.push("ca.delete_flg=false");
		} else if (A_pattern[0].download_type == VariousDLModel.PURCHMODE || A_pattern[0].download_type == VariousDLModel.POSTPURCHMODE || A_pattern[0].download_type == VariousDLModel.PURCHALLMODE) {
			A_where.push("pu.delete_flg=false");
		} else if (A_pattern[0].download_type == VariousDLModel.COPYMODE || A_pattern[0].download_type == VariousDLModel.POSTCOPYMODE || A_pattern[0].download_type == VariousDLModel.COPYALLMODE) {
			A_where.push("co.delete_flg=false");
		} else if (A_pattern[0].download_type == VariousDLModel.ASSMODE || A_pattern[0].download_type == VariousDLModel.POSTASSMODE) {
			A_where.push("ass.delete_flg=false");
		}

		return A_where.join(" and ");
	}

	makeOrderBySQL(A_pattern, H_element) {
		var A_order = Array();

		for (var cnt = 0; cnt < A_pattern.length; cnt++) {
			if (undefined != A_pattern[cnt].sort_order) //テーブルに別名がついているか否か
				//英語ユーザの時はカラムが違う
				//assetstypenameは会社単位で設定できるので特別処理
				{
					if (undefined !== this.H_Tbname[A_pattern[cnt].tb_name] == true) {
						var tb_name = this.H_Tbname[A_pattern[cnt].tb_name];
					} else {
						tb_name = A_pattern[cnt].tb_name;
					}

					if ("ENG" == this.H_G_Sess.language) {
						if (true == (-1 !== Object.keys(this.H_Engcol).indexOf(A_pattern[cnt].col_name))) {
							A_pattern[cnt].col_name = this.H_Engcol[A_pattern[cnt].col_name];
						}
					} else {
						A_pattern[cnt].col_name = A_pattern[cnt].col_name.replace(/_eng$/g, "");
					}

					if (A_pattern[cnt].col_name == "assetstypename") {
						A_order[A_pattern[cnt].sort_order] = "case when att1.assetstypeid is not null then att1.assetstypename else att2.assetstypename end " + A_pattern[cnt].sort_type;
					} else if (A_pattern[cnt].col_name == "kousibunkei") {
						var str = "case" + " when coalesce(te.kousiflg,'1') = '1' then '" + this.H_Kousilabel.label_not_use + "'" + " when (case" + " when kousi_pattern_tb.patternid is null then kousi_pattern_default_tb.patternid" + " else kousi_pattern_tb.patternid end) not in" + " (select patternid from kousi_pattern_tb where coalesce(comhistflg,'0')='1') then '" + this.H_Kousilabel.label_not_com + "'" + " when coalesce(te.kousi_fix_flg,0) = 2 then '" + this.H_Kousilabel.label_edit + "'" + " when coalesce(te.kousi_fix_flg,0) = 1 then '" + this.H_Kousilabel.label_fix + "'" + " else '" + this.H_Kousilabel.label_else + "'" + " end ";
						A_order[A_pattern[cnt].sort_order] = str + " " + A_pattern[cnt].sort_type;
					} else if (A_pattern[cnt].col_name == "sum3") //設定なし
						{
							if (this.FormulaSettingFlag == false) {
								str = "(teb.kamoku1\n\t\t\t\t\t\t\t\t+teb.kamoku2\n\t\t\t\t\t\t\t\t+teb.kamoku3\n\t\t\t\t\t\t\t\t+teb.kamoku4\n\t\t\t\t\t\t\t\t+teb.kamoku5\n\t\t\t\t\t\t\t\t+teb.kamoku6\n\t\t\t\t\t\t\t\t+teb.kamoku7\n\t\t\t\t\t\t\t\t+teb.kamoku8\n\t\t\t\t\t\t\t\t+teb.kamoku9\n\t\t\t\t\t\t\t\t+teb.kamoku10)";
								A_order[A_pattern[cnt].sort_order] = str + " " + A_pattern[cnt].sort_type;
							} else {
								A_order[A_pattern[cnt].sort_order] = tb_name + ".sum3 " + A_pattern[cnt].sort_type;
							}
						} else if (A_pattern[cnt].col_name == "tpsum3") //設定なし
						{
							if (this.FormulaSettingFlag == false) {
								str = "(tepob.kamoku1\n\t\t\t\t\t\t\t\t+tepob.kamoku2\n\t\t\t\t\t\t\t\t+tepob.kamoku3\n\t\t\t\t\t\t\t\t+tepob.kamoku4\n\t\t\t\t\t\t\t\t+tepob.kamoku5\n\t\t\t\t\t\t\t\t+tepob.kamoku6\n\t\t\t\t\t\t\t\t+tepob.kamoku7\n\t\t\t\t\t\t\t\t+tepob.kamoku8\n\t\t\t\t\t\t\t\t+tepob.kamoku9\n\t\t\t\t\t\t\t\t+tepob.kamoku10)";
								A_order[A_pattern[cnt].sort_order] = str + " " + A_pattern[cnt].sort_type;
							} else {
								A_order[A_pattern[cnt].sort_order] = tb_name + ".sum3 " + A_pattern[cnt].sort_type;
							}
						} else //エイリアスの特別処理
						{
							if (undefined !== H_element[A_pattern[cnt].col_name].alias == true) {
								A_order[A_pattern[cnt].sort_order] = tb_name + "." + H_element[A_pattern[cnt].col_name].alias + " " + A_pattern[cnt].sort_type;
							} else {
								A_order[A_pattern[cnt].sort_order] = tb_name + "." + A_pattern[cnt].col_name + " " + A_pattern[cnt].sort_type;
							}
						}
				}
		}

		if (true == !A_order) {
			A_order = ["po.postid"];
		}

		ksort(A_order);
		return A_order.join(",");
	}

	getValueFormat(sign, value, type) {
		switch (sign) {
			case "like":
				var str = " like '%" + value + "%'";
				break;

			case "flike":
				str = " like '" + value + "%'";
				break;

			case "blike":
				str = " like '%" + value + "'";
				break;

			case "notlike":
				str = " not like '%" + value + "%'";
				break;

			default:
				if (type == "date" || type == "month") {
					str = sign + this.get_DB().dbQuote(value, "timestamp", true);
				} else {
					str = sign + this.get_DB().dbQuote(value, "text", true);
				}

				break;
		}

		return str;
	}

	makeKousiWhereSQL(sign, value) {
		var str = "case" + " when coalesce(te.kousiflg,'1')='1' then " + this.H_Kousilabel.no_not_use + " when (case" + " when kousi_pattern_tb.patternid is null then kousi_pattern_default_tb.patternid" + " else kousi_pattern_tb.patternid end) not in" + " (select patternid from kousi_pattern_tb where coalesce(comhistflg,'0')='1') then '" + this.H_Kousilabel.no_not_com + "'" + " when coalesce(te.kousi_fix_flg,0)=2 then " + this.H_Kousilabel.no_edit + " when coalesce(te.kousi_fix_flg,0)=1 then " + this.H_Kousilabel.no_fix + " else " + this.H_Kousilabel.no_else + " end " + sign + value;
		return str;
	}

	deleteDupliAssets(A_data) //まず重複の管理番号を調べる
	//重複削除
	//自前ソート（空き番埋め）
	{
		var A_assetsno = Array();
		var A_delkey = Array();

		for (var cnt = 0; cnt < A_data.length; cnt++) {
			if (A_data[cnt].sysno != "") {
				if (-1 !== A_assetsno.indexOf(A_data[cnt].sysno + "") == false) {
					A_assetsno.push(A_data[cnt].sysno);
				} else //重複している番号ならば電話の日付を調べる
					{
						for (var dcnt = 0; dcnt < A_data.length; dcnt++) //同じ番号のデータが来たら比較
						{
							if (A_data[cnt].sysno == A_data[dcnt].sysno) //日付が古い方を残す（新しい方のキーは消す用の配列へ）
								{
									if (A_data[cnt].sysdate < A_data[dcnt].sysdate) {
										A_delkey.push(dcnt);
									} else {
										A_delkey.push(cnt);
									}

									break;
								}
						}
					}
			}
		}

		for (cnt = 0;; cnt < A_delkey.length; cnt++) {
			delete A_data[A_delkey[cnt]];
		}

		var A_res = Array();

		for (cnt = 0;; cnt < A_data.length; cnt++) {
			if (A_data[cnt] != undefined) {
				A_res.push(A_data[cnt]);
			}
		}

		return A_res;
	}

	deleteNoViewData(A_data) {
		var A_res = Array();

		for (var cnt = 0; cnt < A_data.length; cnt++) {
			if ("1" != A_data[cnt].sysflag) {
				delete A_data[cnt].sysflag;
				A_res.push(A_data[cnt]);
			}
		}

		return A_res;
	}

	convertSerialize(A_data, H_view) {
		for (var cnt = 0; cnt < A_data.length; cnt++) {
			if (A_data[cnt].options != undefined) //オプションを日本語文字列に変換
				{
					var op = "";
					var A_op = unserialize(A_data[cnt].options);

					if (A_op.length > 0) {
						var A_tmp = Array();

						for (var key in A_op) {
							var val = A_op[key];
							A_tmp.push(H_view[key]);
						}

						op = A_tmp.join("|");
					}

					A_data[cnt].options = op;
				}

			if (A_data[cnt].discounts != undefined) //割引サービスを日本語文字列に変換
				{
					var dis = "";
					var A_dis = unserialize(A_data[cnt].discounts);

					if (A_dis.length > 0) {
						A_tmp = Array();

						for (var key in A_dis) {
							var val = A_dis[key];
							A_tmp.push(H_view[key]);
						}

						dis = A_tmp.join("|");
					}

					A_data[cnt].discounts = dis;
				}
		}

		return A_data;
	}

	getOptionsSQL(sign, value, type, ptn_lang = "JPN") //まず条件にあったopidを取得
	//パターン作成者の言語のカラムが対象
	//結果からSQL文作成
	{
		var sql = "select opid from option_tb ";

		if ("ENG" == ptn_lang) {
			var opname_col = "opname_eng";
		} else {
			opname_col = "opname";
		}

		switch (sign) {
			case sign == "=" || sign == "!=":
				sql += " where " + opname_col + "=" + this.get_DB().dbQuote(value, "text", true, "options");
				break;

			case sign == "like" || sign == "notlike":
				sql += " where " + opname_col + " like '%" + value + "%'";
				break;

			case "flike":
				sql += " where " + opname_col + " like '" + value + "%'";
				break;

			case "blike":
				sql += " where " + opname_col + " like '%" + value + "'";
				break;

			default:
				break;
		}

		if ("discounts" == type) {
			sql += " and discountflg=1";
			var col_name = "discounts";
		} else {
			sql += " and discountflg=0";
			col_name = "options";
		}

		var A_ids = this.get_DB().queryCol(sql);
		var str = "";
		var A_str = Array();

		if (A_ids.length > 0) {
			switch (sign) {
				case "=":
					for (var cnt = 0; cnt < A_ids.length; cnt++) {
						var tmp = "te.options='a:1:{i:" + A_ids[cnt] + ";s:1:\"1\";}'";
						A_str.push(tmp);
					}

					str = "(" + A_str.join(" or ") + ")";
					break;

				case "!=":
					for (cnt = 0;; cnt < A_ids.length; cnt++) {
						tmp = "te.options!='a:1:{i:" + A_ids[cnt] + ";s:1:\"1\";}'";
						A_str.push(tmp);
					}

					str = "(" + A_str.join(" and ") + ")";
					break;

				case sign == "like" || sign == "flike" || sign == "blike":
					for (cnt = 0;; cnt < A_ids.length; cnt++) {
						tmp = "te.options like '%i:" + A_ids[cnt] + ";%'";
						A_str.push(tmp);
					}

					str = "(" + A_str.join(" or ") + ")";
					break;

				case "notlike":
					for (cnt = 0;; cnt < A_ids.length; cnt++) {
						tmp = "te.options not like '%i:" + A_ids[cnt] + ";%'";
						A_str.push(tmp);
					}

					str = "(" + A_str.join(" and ") + ")";
					break;

				default:
					break;
			}
		}

		return str;
	}

	getSummaryFormulaModel() {
		if (this.SummaryFormulaModel instanceof SummaryFormulaModel) {
			return this.SummaryFormulaModel;
		} else {
			return new SummaryFormulaModel();
		}
	}

	insertTelMngLog(pactid, postid, postname, userid, username, loginid, month, mode, joker) {
		switch (mode) {
			case "tel":
				var comment2 = "\u96FB\u8A71\u7BA1\u7406\u306E\u30D1\u30BF\u30FC\u30F3\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9";
				break;

			case "telpostbill":
				comment2 = "\u8ACB\u6C42\u60C5\u5831\u306E\u30D1\u30BF\u30FC\u30F3\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9";
				break;

			case "telbill":
				comment2 = "\u8ACB\u6C42\u60C5\u5831\u306E\u30D1\u30BF\u30FC\u30F3\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9";
				break;
		}

		if (month == "latest") {
			comment2 += "(\u6700\u65B0)";
		} else {
			comment2 += "(" + month + ")";
		}

		var data = Array();
		data.pactid = this.get_DB().dbQuote(pactid, "int", true);
		data.postid = this.get_DB().dbQuote(postid, "int", true);
		data.targetpostid = this.get_DB().dbQuote(postid, "int", true);
		data.postname = this.get_DB().dbQuote(postname, "text", true);
		data.userid = this.get_DB().dbQuote(userid, "int", true);
		data.username = this.get_DB().dbQuote(username, "text", true);
		data.recdate = this.get_DB().dbQuote(date("Y-m-d H:i:s"), "date", true);
		data.comment1 = this.get_DB().dbQuote("ID\uFF1A" + loginid, "text", true);
		data.comment2 = this.get_DB().dbQuote(comment2, "text", true);
		data.comment1_eng = this.get_DB().dbQuote("ID\uFF1A" + loginid, "text", true);
		data.comment2_eng = this.get_DB().dbQuote("pattern download tel management", "text", true);
		data.kind = this.get_DB().dbQuote("D", "text", true);
		data.type = this.get_DB().dbQuote("\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9", "text", true);
		data.joker_flag = this.get_DB().dbQuote(joker === 1 ? 1 : 0, "integer", true);
		var keys = Object.keys(data);
		var sql = "INSERT INTO mnglog_tb (" + keys.join(",") + ")VALUES(" + data.join(",") + ")";
		this.get_DB().query(sql);
	}

	__destruct() {
		super.__destruct();
	}

};