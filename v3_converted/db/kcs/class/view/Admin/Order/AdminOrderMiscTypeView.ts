require("MtSession.php");

require("view/ViewSmarty.php");

require("view/MakePankuzuLink.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

//
//ページ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//__construct
//
//@author web
//@since 2018/09/11
//
//@access public
//@return void
//
//
//checkCGIParam
//
//@author web
//@since 2018/09/11
//
//@access public
//@return void
//
//
//getLocalSession
//
//@author web
//@since 2018/09/25
//
//@access public
//@return void
//
//
//makeForm
//
//@author web
//@since 2018/09/25
//
//@access public
//@return void
//
//
//displaySmarty
//
//@author web
//@since 2018/09/11
//
//@param mixed $H_navi
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2018/09/11
//
//@access public
//@return void
//
class AdminOrderMiscTypeView extends ViewSmarty {
	constructor() {
		super({
			site: ViewBaseHtml.SITE_ADMIN
		});
		this.O_Sess = MtSession.singleton();
	}

	checkCGIParam() //グループぽよ
	//GETパラメーターは削除する
	{
		this.H_Local = this.O_Sess.getSelfAll();

		if (undefined !== _GET.g) {
			this.H_Local.groupid = +_GET.g;
		}

		if (undefined !== _GET.p) {
			this.H_Local.pactid = +_GET.p;
		}

		if (!(undefined !== this.H_Local.carid)) //初期値はドコモ(´･ω･`)
			{
				this.H_Local.carid = 1;
			}

		this.O_Sess.SetSelfAll(this.H_Local);

		if (!!_GET) {
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}
	}

	getLocalSession() {
		return this.H_Local;
	}

	makeForm(groupid, carriers) //$H_radio_carid = array();
	//		$A_carid = array(
	//						1 => "NTTドコモ",
	//						3 => "au",
	//						4 => "ソフトバンク",
	//						2 => "Y!mobile(旧WILLCOM)",
	//						15 => "Y!mobile(旧EMOBILE)",
	//						0 => "その他のキャリア",
	//					);
	//		foreach( $A_carid as $carid => $carname ){
	//			$H_radio_carid[ $carid ] =  array( 
	//					$carname."<br>" ,
	//					array( 
	//						"id" => "caird".$carid,
	//						"onclick" => "alert();",
	//					)
	//				);
	//		}
	//		$elements[]	=  array(
	//						"name" => "carid", 
	//						"label"=> "その他の内容を設定するキャリア", 
	//						"inputtype"=>"radio", 
	//						"data" => $H_radio_carid,
	//						"options"=>array("id"=>"carid")
	//					);
	//0は全てだが、その他で使う
	{
		var elements = Array();
		carriers[0] = "\u305D\u306E\u4ED6";
		elements.push({
			name: "carid",
			label: "\u30AD\u30E3\u30EA\u30A2",
			inputtype: "select",
			data: carriers,
			options: {
				id: "carid",
				onChange: "initialize_misc();"
			}
		});
		elements.push({
			name: "groupid",
			inputtype: "hidden",
			data: groupid,
			options: {
				id: "groupid"
			}
		});
		elements.push({
			name: "pactid",
			inputtype: "hidden",
			data: this.H_Local.pactid,
			options: {
				id: "pactid"
			}
		});
		var switch_list = {
			0: "\u521D\u671F\u5024\u3092\u4F7F\u7528\u3059\u308B",
			1: "\u8868\u793A\u5185\u5BB9\u3092\u7DE8\u96C6\u3059\u308B"
		};
		elements.push({
			name: "switch",
			label: "",
			inputtype: "select",
			data: switch_list,
			options: {
				id: "switch",
				onChange: "switching();"
			}
		});

		this.__makeForm("O_form", elements, {
			carid: this.H_Local.carid
		});
	}

	__makeForm(form_name, elements = Array(), default = Array()) //FormUtil生成
	//Form作成
	//フォームに初期値設定。
	//$util->setDefaultsWrapper( $default );
	//デフォルト値はこっちで・・
	//smarty用に作成
	//smartyに登録
	{
		var util = new QuickFormUtil("form");
		util.setFormElement(elements);
		var form = util.makeFormObject();
		form.setConstants(default);
		var render = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		form.accept(render);
		this.get_Smarty().assign(form_name, render.toArray());
	}

	displaySmarty(groupid, compname) //$this->get_Smarty()->display( $this->getDefaultTemplate());
	{
		var H_navi = Array();
		H_navi["menu.php"] = "\u305D\u306E\u4ED6\u306E\u5185\u5BB9\u8A2D\u5B9A";
		H_navi[""] = "\u8A2D\u5B9A";
		H_navi = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "admin");
		this.get_Smarty().assign("admin_submenu", H_navi);
		this.get_Smarty().assign("groupid", groupid);
		this.get_Smarty().assign("compname", compname);
		this.get_Smarty().assign("pactid", this.H_Local.pactid);
		this.get_Smarty().display(KCS_DIR + "/template/Admin/Order/misctype.tpl");
	}

	__destruct() {
		super.__destruct();
	}

};