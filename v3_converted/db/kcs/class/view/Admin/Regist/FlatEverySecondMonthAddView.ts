//
//ShopメニューViewクラス
//
//@uses ViewSmarty
//@package ShopMenu
//@filesource
//@author houshiyama
//@since 2008/10/16
//
//
//error_reporting(E_ALL);
//
//ShopメニューViewクラス
//
//@uses ViewSmarty
//@package ShopMenu
//@author houshiyama
//@since 2008/10/16
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

require("MtSession.php");

require("view/MakePankuzuLink.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("MtUniqueString.php");

require("view/ViewFinish.php");

//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//__construct
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
//
//セッションが無い時デフォルト値を入れる
//
//年月セッションが無ければ作る（デフォルトは今月）<br>
//カレント部署がセッションが無ければ作る（デフォルトは自部署）<br>
//表示件数セッションが無ければ作る（デフォルトは10）<br>
//ソート条件セッションが無ければ作る（デフォルトは部署降順）<br>
//カレントページがセッションに無ければ作る<br>
//
//@author houshiyama
//@since 2009/01/08
//
//@access private
//@return void
//
//
//パラメータのチェック <br>
//
//デフォルト値を入れる<br>
//
//表示年月の変更がされたら配列に入れる <br>
//表示件数が変更されたら配列に入れるCookieも書き換える） <br>
//ソート条件が変更されたら配列に入れる<br>
//カレントページが変更されたら配列に入れる<br>
//
//配列をセッションに入れる<br>
//ページが指定された時以外はページを１に戻す<br>
//CGIパラメータがあればリロード<br>
//
//@author nakanita
//@since 2009/01/08
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author houshiyama
//@since 2008/03/07
//
//@access public
//@return mixed
//
//
//checkAuth
//
//@author houshiyama
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//getAuthBase
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
//
//getAuthPact
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
//
//ローカルセッションを取得する
//
//@author houshiyama
//@since 2008/03/11
//
//@access public
//@return void
//
//
//setAssign
//
//@author houshiyama
//@since 2008/10/16
//
//@param mixed $key
//@param mixed $value
//@access public
//@return void
//
//
//addJs
//
//@author houshiyama
//@since 2008/10/16
//
//@param mixed $jsfile
//@access protected
//@return void
//
//
//getYearArray
//対象年月の取得を行う
//@author web
//@since 2015/09/09
//
//@access private
//@return void
//
//
//getMonthArray
//1～12月の値をarrayで受取るよ
//@author web
//@since 2015/09/09
//
//@access private
//@return void
//
//
//createInputForm
//フューチャーフォンなど
//@author web
//@since 2015/09/15
//
//@param mixed $prefix
//@access private
//@return void
//
//
//フォーム作成<br>
//
//@author houshiyama
//@since 2008/03/30
//
//@param mixed $O_model
//@access public
//@return void
//
// makeAddRule 
// ルールの追加
// @author web 
// @since 2015/09/15
// 
// @param mixed $O_manage 
// @param mixed $O_model 
// @param array $H_sess 
// @access public
// @return void
//
//getParentTel
//親番号のデフォルト値の設定
//@author web
//@since 2015/09/24
//
//@param mixed $prtel_data
//@access private
//@return void
//
//
//getDefaultValue
//DBから取得したデータを設定する
//@author date
//@since 2015/09/24
//
//@param mixed $esm_data
//@param mixed $prtel_data
//@access private
//@return void
//
//
//makeDefaultValue
//formのデフォルト値を設定
//@author web
//@since 2015/09/24
//
//@param array $H_sess
//@param mixed $esm_data
//@param array $prtel_data
//@access public
//@return void
//
//
//メンバー変数をsmarty assign
//
//@author houshiyama
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//unfreezeForm
//
//@author web
//@since 2015/09/15
//
//@access public
//@return void
//
//
//freezeForm
//formをフリーズさせる
//@author web
//@since 2015/09/15
//
//@access public
//@return void
//
//
//endAddView
//完了画面
//@author web
//@since 2015/09/15
//
//@param array $H_sess
//@access public
//@return void
//
//
//画面表示
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
//
//uploadFile
//アップロードされたファイルの取得を行うよ
//@author web
//@since 2015/09/16
//
//@access public
//@return void
//
//
//uploadFiles
//ファイルの取得を行う
//@author web
//@since 2015/09/17
//
//@access public
//@return void
//
//
//__destruct
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
class FlatEverySecondMonthAddView extends ViewSmarty {
	constructor() //ショップ属性を付ける
	{
		super({
			site: ViewBaseHtml.SITE_ADMIN
		});
		this.NextName = "\u78BA\u8A8D\u753B\u9762\u3078";
		this.RecName = "\u767B\u9332";
		this.BackName = "\u623B\u308B";
		this.CancelName = "\u30AD\u30E3\u30F3\u30BB\u30EB";
		this.flats = Array();
		this.O_Sess = MtSession.singleton();
		this.H_Local = this.O_Sess.getSelfAll();
		this.H_js = Array();
		this.H_assign = Array();
		this.flats = {
			1: {
				prefix: "sp",
				label: "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3"
			},
			2: {
				prefix: "fp",
				label: "\u30D5\u30E5\u30FC\u30C1\u30E3\u30FC\u30D5\u30A9\u30F3"
			},
			3: {
				prefix: "dc",
				label: "\u30C7\u30FC\u30BF\u30AB\u30FC\u30C9"
			},
			4: {
				prefix: "etc",
				label: "\u305D\u306E\u4ED60"
			},
			5: {
				prefix: "etc01",
				label: "\u305D\u306E\u4ED61"
			},
			6: {
				prefix: "etc02",
				label: "\u305D\u306E\u4ED62"
			},
			7: {
				prefix: "etc03",
				label: "\u305D\u306E\u4ED63"
			},
			8: {
				prefix: "etc04",
				label: "\u305D\u306E\u4ED64"
			},
			9: {
				prefix: "etc05",
				label: "\u305D\u306E\u4ED65"
			},
			10: {
				prefix: "etc06",
				label: "\u305D\u306E\u4ED66"
			}
		};
	}

	setDefaultSession() //カレント部署がセッションに無ければ作る（デフォルトは自部署）
	//呼び出し元
	{
		if (undefined !== this.H_Dir.current_postid == false) {
			this.H_Dir.current_postid = _SESSION.postid;
		}

		this.H_Local.groupid = this.O_Sess.admin_groupid;
		this.H_Local.mode = "admin";
	}

	getFlatTypes() {
		return this.flats;
	}

	setExcludeCount(id, cnt) {
		this.flats[id].exclude_cnt = cnt;
	}

	setPrtelCount(id, cnt) {
		this.flats[id].prtel_cnt = cnt;
	}

	checkCGIParam() //これはリロードするとき
	{
		this.setDefaultSession();

		if (undefined !== _GET.pactid) {
			this.H_Local.pactid = _GET.pactid;
		}

		if (undefined !== this.H_Local.post == false) {
			this.H_Local.post = Array();
		}

		if (!_POST == false) {
			for (var key in _POST) {
				var value = _POST[key];
				this.H_Local.post[key] = value;
			}
		}

		this.O_Sess.setSelfAll(this.H_Local);

		if (_GET.length > 0) {
			MtExceptReload.raise(undefined);
		}
	}

	get_View() {
		return this.H_View;
	}

	checkAuth() {
		this.checkCustomAuth();
	}

	getAuthBase() {
		return this.getAuth().getUserFuncId(this.gSess().memid);
	}

	getAuthShop() {
		return this.getAuth().getShopFuncId();
	}

	getLocalSession() {
		var H_sess = this.O_Sess.getSelfAll();
		return H_sess;
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	addJs(jsfile) {
		if (Array.isArray(this.H_assign.H_jsfile) == false) {
			this.H_assign.H_jsfile = Array();
		}

		this.H_assign.H_jsfile.push(jsfile);
	}

	getYearArray() {
		var res = Array();
		var year = date("Y");

		for (var i = -1; i < 4; i++) {
			var tmp = year + i;
			res[tmp] = tmp;
		}

		return res;
	}

	getMonthArray() {
		var res = Array();

		for (var i = 1; i <= 12; i++) {
			res[i] = i;
		}

		return res;
	}

	createInputForm(prefix, id, bill_parent) //$elem[$index++] = array(
	//							"name"=>$prefix."use",
	//							"inputtype"=>"radio",
	//							"data"=>array(	
	//										"use"=>array("有効", 
	//													array(
	//														"id"=>$prefix."use_yes",
	//														"onClick"=>"setEnable('".$prefix."',true)"
	//													)
	//												),
	//										""=>array("無効", 
	//													array(
	//														"id"=>$prefix."use_no",
	//														"onClick"=>"setEnable('".$prefix."',false)"
	//													)
	//											)
	//									),
	//							"options"=>array("id"=>$prefix."use")
	//						);
	//フューチャーフォン
	//除外回線のアップロードボタン
	//除外回線のダウンロードボタン
	//親番号のダウンロードボタン
	{
		var elem = Array();
		elem.push({
			name: prefix + "fee",
			label: "",
			inputtype: "text",
			options: {
				id: prefix + "fee",
				size: "3",
				maxlength: "10"
			}
		});
		elem.push({
			name: prefix + "stop",
			label: "\u5E73\u6E96\u5316\u306E\u505C\u6B62",
			inputtype: "checkbox",
			options: {
				id: prefix + "stop"
			}
		});
		elem.push({
			name: prefix + "exempt",
			label: "CSV\u53D6\u8FBC",
			inputtype: "file",
			options: {
				id: prefix + "exempt"
			}
		});

		if (_SERVER.REQUEST_URI == "/Admin/Regist/flat_esm_mod.php") {
			elem.push({
				name: prefix + "exempt_dl",
				label: "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9",
				inputtype: "button",
				options: {
					id: prefix + "exempt_dl",
					onClick: "doDownloadExempt(" + id + ")"
				}
			});
		}

		elem.push({
			name: prefix + "prtel",
			label: "\u89AA\u756A\u53F7\u53D6\u8FBC",
			inputtype: "file",
			options: {
				id: prefix + "prtel"
			}
		});

		if (_SERVER.REQUEST_URI == "/Admin/Regist/flat_esm_mod.php") {
			elem.push({
				name: prefix + "prtel_dl",
				label: "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9",
				inputtype: "button",
				options: {
					id: prefix + "prtttel_dl",
					onClick: "doDownloadPrtel(" + id + ")"
				}
			});
		}

		return elem;
	}

	makeForm(uniqueid, bill_parent) //フォーム要素の配列作成
	//開始年
	//開始月
	////	開始月の有料無料
	//		$A_formelement[] = array(
	//							"name"=>"start_fee",
	//							"inputtype"=>"radio",
	//							"data"=>array(	
	//										"fee_toll"=>array("有料", array("id"=>"fee_toll")),		//	有料
	//										"fee_free"=>array("無料", array("id"=>"fee_free"))		//	無料
	//									),
	//							"options"=>array("id"=>"start_fee")
	//						);
	//月数
	////	備考
	//		$A_formelement[] = array( 
	//								"name" => "comment",
	//								"label" => "",
	//								"inputtype" => "text",
	//								"options" => array( "size" => "100", "maxlength" => "255" ) ,
	//							);
	//確認
	//// ユニーク文字列生成用
	//		if(!isset($uniqueid)){
	//			$O_unique = MtUniqueString::singleton();
	//			$A_formelement[] =  array(	"name" => "uniqueid",
	//										"inputtype" => "hidden",
	//										"data" => $O_unique->getNewUniqueId(),
	//										"options" => array("id" => "uniqueid")
	//								);
	//		} else {
	//			$A_formelement[] = array(
	//								"name" => "uniqueid",
	//								"inputtype" => "hidden",
	//								"data" => $uniqueid,
	//								"options" => array("id" => "uniqueid")
	//							);
	//		}
	//クイックフォームオブジェクト生成
	{
		var A_formelement = Array();
		A_formelement.push({
			name: "start_year",
			label: "",
			inputtype: "select",
			data: this.getYearArray()
		});
		A_formelement.push({
			name: "start_month",
			label: "",
			inputtype: "select",
			data: this.getMonthArray()
		});
		A_formelement.push({
			name: "month",
			label: "",
			inputtype: "select",
			data: {
				12: 12,
				24: 24,
				36: 36
			}
		});
		A_formelement.push({
			name: "submit",
			label: this.NextName,
			inputtype: "submit"
		});
		{
			let _tmp_0 = this.flats;

			for (var id in _tmp_0) {
				var data = _tmp_0[id];
				A_formelement = array_merge(A_formelement, this.createInputForm(data.prefix + "_", id, bill_parent));
			}
		}
		this.H_View.O_FormUtil = new QuickFormUtil("form");
		this.H_View.O_FormUtil.setFormElement(A_formelement);
		this.O_Form = this.H_View.O_FormUtil.makeFormObject();
	}

	makeAddInputRule(prefix, name, bill_parent, index_entry) //
	//親番号の重複チェック
	//$A_rule[$idx++] = array(	"name" => $prefix."fee",
	//									"mess" => $name."の基本料は偶数を入れてください",
	//									"type" => "QRIntNumericEven",
	//									"format" => null,
	//									"validation" => "client"
	//						);
	//$A_rule[$idx++] = array(	"name" => $prefix."fee",
	//									"mess" => $name."の基本料は0、マイナスの値は指定できません",
	//									"type" => "QRIntNumericNotZero",
	//									"format" => $prefix."use",
	//									"validation" => "client"
	//						);
	{
		var idx = index_entry;
		var A_rule = Array();
		A_rule[idx++] = {
			name: [prefix + "use", prefix + "fee"],
			mess: name + "\u306E\u57FA\u672C\u6599\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "QRRadioCompare",
			format: "use",
			validation: "client"
		};
		A_rule[idx++] = {
			name: [prefix + "fee", prefix + "bill_parent"],
			mess: name + "\u306E\u89AA\u756A\u53F7\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "QRNumInequalityArray",
			format: 0,
			validation: "client"
		};
		A_rule[idx++] = {
			name: [prefix + "fee", prefix + "bill_parent"],
			mess: name + "\u306E\u89AA\u756A\u53F7\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "QRNumInequalityArray",
			format: 0,
			validation: "client"
		};
		A_rule[idx++] = {
			name: prefix + "fee",
			mess: name + "\u306E\u57FA\u672C\u6599\u306F\u6570\u5B57\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "QRIntNumeric",
			format: "required",
			validation: "client"
		};
		A_rule[idx++] = {
			name: prefix + "fee",
			mess: name + "\u306E\u57FA\u672C\u6599\u306F\u6B63\u6570\u3092\u3044\u308C\u3066\u304F\u3060\u3055\u3044",
			type: "QRIntPositive",
			format: undefined,
			validation: "client"
		};
		var data = Array();
		data.key = Array();

		for (var value of Object.values(bill_parent)) {
			data.key.push(value.prtelname + ":" + value.prtelno);
		}

		data.my = prefix + "bill_parent";
		data.tgt = ["sp_bill_parent", "fp_bill_parent", "dc_bill_parent", "etc_bill_parent"];
		A_rule[idx++] = {
			name: prefix + "fee",
			mess: name + "\u3067\u6307\u5B9A\u3055\u308C\u3066\u3044\u308B\u89AA\u756A\u53F7\u304C\u4ED6\u3067\u4F7F\u308F\u308C\u3066\u3044\u307E\u3059",
			type: "QRAdvCheckBoxMulti",
			format: data,
			validation: "client"
		};
		return A_rule;
	}

	makeAddRule(bill_parent) //基底クラスから新規登録フォームルール取得
	//$A_rule[] =  array( "name" => "comment",
	//							"mess" => "備考を入力してください。",
	//							"type" => "required",
	//							"format" => null,
	//							"validation" => "client");
	//$A_rule[] =	array( "name" => "enddate",
	//							"mess" => "掲載期限を指定してください。",
	//							"type" => "required",
	//							"format" => null,
	//							"validation" => "client" );
	//		$A_rule[] =  array( "name" => "enddate",
	//							"mess" => "掲載期限は年月日すべてを指定してください。存在しない日付の指定はできません。",
	//							"type" => "QRCheckdate",
	//							"format" => null,
	//							"validation" => "client" );
	//		$A_rule[] = array( "name" => "enddate",
	//							"mess" => "掲載期限は過去の日付は選択できません。",
	//							"type" => "QRManagementDateBefore",
	//							"format" => null,
	//							"validation" => "client" );
	//						);
	//ここで使用する自作関数の読込
	{
		var A_rule = Array();
		{
			let _tmp_1 = this.flats;

			for (var id in _tmp_1) {
				var data = _tmp_1[id];
				A_rule += this.makeAddInputRule(data.prefix + "_", data.label, bill_parent, A_rule.length);
			}
		}
		var A_orgrule = ["QRCheckDate", "QRIntNumeric", "QRalnumRegex"];
		this.H_View.O_FormUtil.registerOriginalRules(A_orgrule);
		this.H_View.O_FormUtil.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		this.H_View.O_FormUtil.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		this.H_View.O_FormUtil.makeFormRule(A_rule);
	}

	getParentTel(prtel_data) {
		var res = {
			1: Array(),
			2: Array(),
			3: Array(),
			4: Array(),
			5: Array(),
			6: Array(),
			7: Array(),
			8: Array(),
			9: Array(),
			10: Array()
		};

		for (var key in prtel_data) {
			var value = prtel_data[key];
			var mcntype = value.mcntype;
			var tmp = value.prtelno + ":" + value.prtelname;
			res[mcntype][tmp] = "1";
		}

		return res;
	}

	getDefaultValue(esm_data, prtel_data) //if( $esm_data['start_fee'] == true ){
	//			$res['start_fee'] = 'fee_toll';
	//		}else{
	//			$res['start_fee'] = 'fee_free';
	//		}
	{
		var res = Array();
		var prtel = this.getParentTel(prtel_data);
		res.start_year = esm_data.start_date.substr(0, 4);
		res.start_month = +esm_data.start_date.substr(5, 2);
		res.month = esm_data.month;
		res.comment = esm_data.comment;
		{
			let _tmp_2 = this.flats;

			for (var id in _tmp_2) {
				var data = _tmp_2[id];
				res[data.prefix + "_fee"] = esm_data[data.prefix + "_fee"];
				res[data.prefix + "_bill_parent"] = prtel[key];

				if (esm_data[data.prefix + "_stop"] == true) {
					res[data.prefix + "_stop"] = "1";
				}
			}
		}
		return res;
	}

	makeDefaultValue(H_sess: {} | any[], esm_data = Array(), prtel_data = Array()) {
		var H_default = Array();

		if (!H_sess.post == true) {
			if (!esm_data) //データがない
				{
					{
						let _tmp_3 = this.flats;

						for (var id in _tmp_3) {
							var data = _tmp_3[id];
							H_default[data.prefix + "_use"] = "use";
							H_default[data.prefix + "_fee"] = 0;
						}
					}
				} else //postに入力がない(デフォルト値を表示する)
				{
					H_default = this.getDefaultValue(esm_data, prtel_data);
				}
		} else //postに入力がある
			{
				H_default = H_sess.post;
			}

		return H_default;
	}

	assignSmarty() {
		{
			let _tmp_4 = this.H_assign;

			for (var key in _tmp_4) {
				var value = _tmp_4[key];
				this.get_Smarty().assign(key, value);
			}
		}
	}

	unfreezeForm() {
		this.H_View.O_FormUtil.updateElementAttrWrapper("submit", {
			value: this.NextName
		});
	}

	freezeForm() {
		this.H_View.O_FormUtil.updateElementAttrWrapper("submit", {
			value: this.RecName
		});
		this.H_View.O_FormUtil.updateElementAttrWrapper("submit_back", {
			value: this.CancelName
		});
		this.H_View.O_FormUtil.updateAttributesWrapper({
			onsubmit: false
		});
		this.H_View.O_FormUtil.freezeWrapper();
	}

	endAddView(H_sess: {} | any[]) //セッションクリア
	//一時的に無効化。あとでコメント外しといて
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u5E73\u6E96\u5316\u767B\u9332", "/Admin/Regist/regist_list.php", "\u4F1A\u793E\u4E00\u89A7\u3078");
	}

	displaySmarty() //セッションを取得
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_Form.accept(O_renderer);
		this.setAssign("O_form", O_renderer.toArray());
		var H_sess = this.getLocalSession();
		{
			let _tmp_5 = this.flats;

			for (var id in _tmp_5) {
				var data = _tmp_5[id];
				var exempt = data.prefix + "_exempt";
				var prtel = data.prefix + "_prtel";

				if (undefined !== H_sess.upload[exempt].up_name) {
					this.flats[id].exempt_name = H_sess.upload[exempt].up_name;
				}

				if (undefined !== H_sess.upload[prtel].up_name) {
					this.flats[id].prtel_name = H_sess.upload[prtel].up_name;
				}
			}
		}
		this.setAssign("flats", this.flats);
		this.assignSmarty();
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	uploadFile(elemname) //ユニークファイル名を生成
	//ファイルは保持しないことになったのでtmpにおいてしまう
	//ファイル名の生成
	//ファイル情報の取得(元ファイル名など入ってる)
	//一意なファイル名を生成する
	//
	//リネームする
	//添付ファイルがある場合はファイルを/files以下に保存
	//セッションにいれる
	//メッセージ返す
	{
		var message = Array();

		if (_FILES[elemname].name == "") {
			return "";
		}

		if (_FILES[elemname].name != "" && preg_match("/\\.(csv)$/i", _FILES[elemname].name) == false) {
			message.push("\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u53EF\u80FD\u306A\u62E1\u5F35\u5B50\u306Fcsv\u3067\u3059");
		}

		if (!!message) {
			return message;
		}

		var upload_info = Array();
		mkdir(up_dir);
		var getfile = pathinfo(_FILES[elemname].name);
		var tmpf_name = tempnam(up_dir, "upload_");
		var f_name = tmpf_name + "." + getfile.extension;
		rename(tmpf_name, f_name);

		if (move_uploaded_file(_FILES[elemname].tmp_name, f_name) == true) //添付のファイルサイズを取得
			{
				var up_filesize = _FILES[elemname].size;

				if (up_filesize > 1024) {
					if (up_filesize > 1024 * 1024) {
						up_filesize = sprintf("%0.1f", up_filesize / (1024 * 1024)) + " Mbyte";
					} else {
						up_filesize = sprintf("%0.1f", up_filesize / 1024) + " Kbyte";
					}
				}

				var H_file_attr = {
					up_file: f_name,
					up_type: up_type,
					up_filesize: up_filesize,
					up_name: _FILES[elemname].name,
					filestat: _FILES[elemname].error
				};
			} else //失敗した
			{
				H_file_attr = {
					filestat: _FILES[elemname].error
				};
			}

		this.H_Local.upload[elemname] = H_file_attr;
		this.O_Sess.setSelfAll(this.H_Local);
		return message;
	}

	uploadFiles() {
		var update_session = false;
		{
			let _tmp_6 = this.flats;

			for (var id in _tmp_6) //スマートフォンの除外回線
			{
				var data = _tmp_6[id];
				var pre = data.prefix;
				var elemname = pre + "_exempt";

				if (_FILES[elemname].name != "") //ファイルのアップロード
					//エラーチェック
					{
						var uperr = this.uploadFile(elemname);

						if (!uperr) {
							update_session = true;
						} else //拡張子やサイズエラー
							{
								var msg = "<br><font color='red'>" + uperr.join("<br>") + "<br>" + "</font>";
								this.H_View.O_FormUtil.setElementErrorWrapper(elemname, msg);
							}
					}

				elemname = pre + "_prtel";

				if (_FILES[elemname].name != "") //ファイルのアップロード
					//エラーチェック
					{
						uperr = this.uploadFile(elemname);

						if (!uperr) {
							update_session = true;
						} else //拡張子やサイズエラー
							{
								msg = "<br><font color='red'>" + uperr.join("<br>") + "<br>" + "</font>";
								this.H_View.O_FormUtil.setElementErrorWrapper(elemname, msg);
							}
					}
			}
		}
		return update_session;
	}

	__destruct() {
		super.__destruct();
	}

};