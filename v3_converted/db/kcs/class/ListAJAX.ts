//require_once("DBUtil.php");

require("common.php");

require("Authority.php");

//初期位置
//初期表示状態
//var	$disp = "block";
//typeによって挙動を変える
//(なし) : 標準型
//"post" : 部署管理型
//"recog" : 承認型
//"setpost" : 部署設定型
//"regist" : 登録型
//"move" : 移動型
//0 : 承認型以外
//1 : 部署登録変更
//2 : 部署新規登録
//レイヤー名、フォーム名の就職子
//1画面に複数表示したい場合に、ここにユニークな文字列を付加する
//部署移動(過去分)で"2"を入れている
//対象とするテーブル名、過去のときには_XX_tbに変わる
//キャリアID, 登録型で使用
//ショップ権限のときTrue
//「最下層のみ表示する」チェックボックスの表示
//日本語表示（英語化対応）
//
//コンストラクタ
//
//@author houshiyama
//@since 2008/12/24
//
//@access public
//@return void
//
////////////////////////////////////////////////////////////////
//Listの作成
//引数: psctid, postid、それぞれセッション値と異なる場合のみ指定
//※使用場面に伴う個々の事情は引数ではなくクラス変数に書き込む
////////////////////////////////////////////////////////////////
//JavaScript
class ListAJAX {
	constructor() {
		this.top = 150;
		this.left = 50;
		this.width = 575;
		this.height = 200;
		this.disp = "none";
		this.type = "";
		this.postnew = 0;
		this.modifier = "";
		this.post_tb = "post_tb";
		this.post_relation_tb = "post_relation_tb";
		this.carid = "";
		this.shop_auth = false;
		this.lowermost_auth = false;
		this.WindowTitle = "\u90E8\u7F72\u9078\u629E";
		this.CloseBtn = "\u9589\u3058\u308B";
		this.PostidView = "\u90E8\u7F72ID";
		this.PostnameView = "\u90E8\u7F72\u540D";
		this.SearchView = "\u691C\u7D22";
		this.MessView1 = "\u691C\u7D22\u7D50\u679C\u4E00\u89A7: <b>\u2193 </b>\u4E00\u89A7\u304B\u3089\u90E8\u7F72\u3092\u6307\u5B9A\u3057\u3066\u4E0B\u3055\u3044";
		this.MessView2 = "\u90E8\u7F72\u9078\u629E: <b>\u2193</b>\u30EA\u30F3\u30AF\uFF08\u90E8\u7F72\u540D\uFF09\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u90E8\u7F72\u3092\u78BA\u5B9A\u3057\u3066\u4E0B\u3055\u3044";
		this.ColView1 = "\u9805\u756A";
		this.ErrorMessView1 = "\u691C\u7D22\u6761\u4EF6\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044";
		this.ErrorMessView2 = "\u7D50\u679C\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F";
		this.ErrorMessView3 = "\u7D50\u679C\u3092\u6B63\u5E38\u306B\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F";
		this.ErrorMessView4 = "\u691C\u7D22\u7D50\u679C\u306F\uFF10\u4EF6\u3067\u3057\u305F";
		this.ErrorMessView5 = "\"\u691C\u7D22\u7D50\u679C\u306F \"+ cnt +\"\u4EF6\u3042\u308A\u307E\u3057\u305F. \u6700\u521D\u306E100\u4EF6\u3060\u3051\u3092\u8868\u793A\u3057\u307E\u3059.\\n\u898B\u3064\u304B\u3089\u306A\u3044\u5834\u5408\u306F\u3001\u6761\u4EF6\u3092\u3057\u307C\u3063\u3066\u518D\u5EA6\u691C\u7D22\u3092\u884C\u3063\u3066\u4E0B\u3055\u3044\u3002\"";

		if (undefined !== _SESSION.language == true && "ENG" == _SESSION.language) {
			this.WindowTitle = "Department search retrieval";
			this.CloseBtn = "Close";
			this.PostidView = "Department ID";
			this.PostnameView = "Department name";
			this.SearchView = "Search";
			this.MessView1 = "Search result list:<b>\u2193 </b>Please select your department from the list";
			this.MessView2 = "Select department:<b>\u2193 </b>Please click link(department name)";
			this.ColView1 = "No.";
			this.ErrorMessView1 = "Specify a search condition";
			this.ErrorMessView2 = "No results";
			this.ErrorMessView3 = "Unable to acquire results.";
			this.ErrorMessView4 = "0 search results";
			this.ErrorMessView5 = "cnt + \" search results. The first 100 results are displayed. \\n\" + \" If the desired result is not found, please refine search criteria and search again.\"";
		}
	}

	makeList(pactid = false, postid = false) //権限の取得
	//最下層表示する
	//Pactのデフォルトはセッションから取得
	//現状は最下層チェックボックスは追加請求のみ表示
	//JavaScript開始
	//END of rtn_str
	{
		var O_auth = new Authority();
		var H_auth = O_auth.getAllUserAuth(_SESSION.userid);
		this.lowermost_auth = -1 !== H_auth.indexOf(247) ? true : false;

		if (pactid == false) {
			pactid = _SESSION.pactid;
		}

		if (postid == false) {
			postid = _SESSION.postid;
		}

		var XList = "XList" + this.modifier;
		var xsearchform = "xsearchform" + this.modifier;
		var xpost_disp = "xpost_disp" + this.modifier;
		var Container = "Container" + this.modifier;
		var theXList = "theXList" + this.modifier;
		var PidTable = "PidTable" + this.modifier;
		var doSearch = "doSearch" + this.modifier;
		var LoadHandler = "LoadHandler" + this.modifier;
		var SelHandler = "SelHandler" + this.modifier;
		var RowSelHandler = "RowSelHandler" + this.modifier;
		var search_btn_row = 1;

		if (this.lowermost_auth && (strpos(_SERVER.REQUEST_URI, "/Bill/AddBill/") === 0 || strpos(_SERVER.REQUEST_URI, "/Management/AddBill/") === 0)) {
			var lowermost_checkbox = "\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan=\"4\">\n\t\t\t\t\t\t<label><input type=\"checkbox\" name=\"lowermost\" id=\"lowermost\" checked>\u6700\u4E0B\u5C64\u90E8\u7F72\u3067\u7D5E\u8FBC\u3092\u884C\u3046</label>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>";
			search_btn_row++;
			var lowermost_js = "'&lowermost='+" + xsearchform + ".lowermost.checked + ";
		} else {
			lowermost_checkbox = "";
			lowermost_js = "";
		}

		rtn_str += "\n<div class=\"layer\" id=\"" + XList + "\" style=\"z-index:2; position:absolute;\n\t\ttop:" + this.top + "; left:" + this.left + ";\n\t\twidth: " + this.width + "px;\n\t\tdisplay: " + this.disp + "\">\n\t<!-- height: " + this.height + "px; -->\n\t<table border=\"1\" bgcolor=\"#CCCCCC\" cellspacing=0 cellpadding=0>\n\t<tr>\n\t\t<td>\n\t\t<table width=\"100%\" border=\"0\" cellspacing=0 cellpadding=0>\n\t\t\t<tr>\n\t\t\t<td align=\"left\" valign=\"center\" height=\"24\" bgcolor=\"#666699\">\n\t\t\t\t<font color=\"white\">&nbsp;\u25A0<span id='XListTitle'>" + this.WindowTitle + "</span></font>\n\t\t\t</td>\n\t\t\t<td align=\"right\" valign=\"center\" height=\"24\" bgcolor=\"#666699\">\n\t\t\t\t<input type=\"button\" onClick=\"javascript:ShowHide('" + XList + "');\" value=\"" + this.CloseBtn + "\">\n\t\t\t</td>\n\t\t\t</tr>\n\t\t</table>\n\t\t</td>\n\t</tr>\n\t<tr>\n\t\t<td>\n\t\t<table width=\"100%\" cellpadding=4>\n\t\t<form name=\"" + xsearchform + "\">\n\t\t<tr>\n\t\t\t<td style=\"font-size:13px\" align=\"right\" nowrap>" + this.PostidView + ":</td>\n\t\t\t<td><input type=\"text\" name=\"xpostid\" size=\"20\" maxlength=\"256\" onclick=\"this.focus();\"></td>\n\t\t\t<td style=\"font-size:13px\" align=\"right\" nowrap>" + this.PostnameView + ":</td>\n\t\t\t<td><input type=\"text\" name=\"xpostname\" size=\"50\" maxlength=\"256\"  onclick=\"this.focus();\"></td>\n\t\t\t<td rowspan='" + search_btn_row + "'><input type=\"button\" value=\"" + this.SearchView + "\" onClick=\"" + doSearch + "();\"></td>\n\t\t</tr>\n\t\t" + lowermost_checkbox + "\n\t\t</form>\n\t\t</table>\n\t\t</td>\n\t</tr>\n\t<tr>\n\t\t<td style=\"font-size:13px\">\n\t\t\t&nbsp;" + this.MessView1 + "\n\t\t</td>\n\t</tr>\n\t<tr>\n\t\t<td><div id=\"" + Container + "\" style=\"height:200px\"></div></td>\n\t</tr>\n\t<tr>\n\t\t<td style=\"font-size:13px\">\n\t\t\t&nbsp;" + this.MessView2 + "\n\t\t\t<div class=\"layer\" id=\"" + xpost_disp + "\" style=\"\n\t\t\t\tfont-size:12px; height:42px; margin:4px;\n\t\t\t\tbackground-color:white;\n\t\t\t\tborder:solid 1px black; overflow:auto\">\n\t\t\t</div>\n\t\t</td>\n\t</tr>\n\t</table>\n<script language=\"JavaScript\">\n\n// \u30EA\u30B9\u30C8\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8\nvar\t" + theXList + " = null;\n\n// \u691C\u7D22\u5B9F\u884C\nfunction " + doSearch + "()\n{\n\tvar\txpostid   = " + xsearchform + ".xpostid.value;\n\tvar\txpostname = " + xsearchform + ".xpostname.value;\n\tif( xpostid == '' && xpostname == '' ){\n\t\talert( '" + this.ErrorMessView1 + "' );\n\t\t" + xsearchform + ".xpostid.focus();\n\t\treturn;\n\t}\n\t\n\tvar HeadColumns = [\n\t\t['" + this.ColView1 + "', '8%'],\n\t\t['ID', '12%'],\n\t\t['" + this.PostnameView + "', '80%']\n\t];\n\t\n\tvar\ttheElem;\n//\tif( theElem == null ){\t// \u6BCE\u56DE\u4F5C\u308A\u76F4\u3057\u305F\u65B9\u304C\u5B89\u5B9A\u3059\u308B\n\t\ttheElem = document.getElementById('" + Container + "');\n\t\t" + theXList + " = new WebFXColumnList();\n\t\t" + theXList + ".create( theElem, HeadColumns );\n//\t}\n//\t" + theXList + ".clear();\n\t\n\t" + theXList + ".setSortTypes([TYPE_NUMBER, TYPE_STRING, TYPE_STRING]);\n\t" + theXList + ".setColumnAlignment([ALIGN_CENTER, ALIGN_LEFT, ALIGN_LEFT]);\n\t" + theXList + ".multiple = false;\t// \u8907\u6570\u884C\u9078\u629E\u3057\u306A\u3044\n\t\n\t// AJAX\u3067\u30C7\u30FC\u30BF\u53D6\u5F97\u3059\u308B\n\tvar\tobjXReq = new XRequest();\n\tobjXReq.onload = " + LoadHandler + ";\t// \u30ED\u30FC\u30C9\u6642\u306E\u51E6\u7406\u3092\u6307\u5B9A\n\tvar\turl = '/XML/xlist.php';\n\tvar\tpostdata = 'pid=" + pactid + "' +\n\t\t'&postid=" + postid + "' +\n\t\t'&xpostid=' + encodeURIComponent(xpostid) +\n\t\t'&xpostname=' + encodeURIComponent(xpostname) +\n\t\t'&post_tb=" + this.post_tb + "' +\n\t\t'&type=" + this.type + "' +\n\t\t'&postnew=" + this.postnew + "' +\n\t\t'&carid=" + this.carid + "' +\n\t\t" + lowermost_js + "\n\t\t'&shop_auth=" + this.shop_auth + "';\n\tobjXReq.requestURL( postdata, 'POST', url, true );\n\t\n\t// \u691C\u7D22\u4E2D\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\n\t" + xpost_disp + ".innerHTML = '<img src=\"/images/treeajax/loading.gif\">';\n\t\n\t// Row\u9078\u629E\u6642\u306E\u30A2\u30AF\u30B7\u30E7\u30F3\n\t" + theXList + ".onselect = function(){\n\t\t" + SelHandler + "();\n\t}\n}\n\n// \u691C\u7D22\u7D50\u679C->\u90E8\u7F72ID\u5909\u63DB\nvar\t" + PidTable + " = null;\n\n// \u30ED\u30FC\u30C9\u6642\u306E\u51E6\u7406\u3001\u5F15\u6570\u306Fhttpobj\u304C\u5165\u3063\u3066\u304F\u308B\nfunction " + LoadHandler + "( httpobj ){\n\tif( httpobj == null ){\n\t\talert('LoadHandler, null httpobj.');\n\t\treturn;\n\t}\n\t\n\tvar\tresult = httpobj.responseText;\n\t" + xpost_disp + ".innerHTML = '';\t// \u691C\u7D22\u4E2D\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u306E\u505C\u6B62\n\t\n\tif( result == null ){\n\t\talert('" + this.ErrorMessView2 + "');\n\t\treturn;\n\t}\n\tif( ! result.match(/^OK/) ){ // \u5148\u982D\u304COK\u304C\u6B63\u5E38\n\t\talert('" + this.ErrorMessView3 + "');\n\t\treturn;\n\t}\n\t\n\t" + PidTable + " = new Array();\t// \u90E8\u7F72ID\u5909\u63DB\u30C6\u30FC\u30D6\u30EB\u3092\u7528\u610F\n\tvar\tallData = new Array();\t// \u5168\u7D50\u679C\u3092\u53D6\u5F97\u3059\u308B\u914D\u5217\u3092\u7528\u610F\n\tvar\tidx = 0;\n\tvar\tMAX_RESULT = 100;\t// \u7D50\u679C\u306E\u6700\u5927\u4EF6\u6570\n\t\n\tvar\tlines = result.split(\"\\n\");\n\tvar\theader = lines[0].split(\"\\t\");\n\tvar\tcnt = header[1];\t// OK\u884C\u306B\u306F\u4EF6\u6570\u304C\u5165\u3063\u3066\u3044\u308B\n\tif( cnt == 0 ){\n\t\talert('" + this.ErrorMessView4 + "');\n\t\treturn;\n\t}\n\telse if( cnt > MAX_RESULT ){ // \u3053\u306E\u4EF6\u6570\u3092\u8D8A\u3048\u305F\u3089\u8B66\u544A\n\t\tif( confirm(" + this.ErrorMessView5 + ") == false ){\n\t\t\treturn;\n\t\t}\n\t}\n\t\n\tfor( var i=1; i < lines.length && i <= MAX_RESULT; i++ ){ // 1\u884C\u76EE\u306F\u30B9\u30AD\u30C3\u30D7\n\t\t// 'END'\u3067\u7D42\u4E86\n\t\tif( lines[i].match(/^END$/) ){\n\t\t\tbreak;\n\t\t}\n\t//\talert( i + ' :: ' + lines[i] );\n\t\t// \u30D5\u30A9\u30FC\u30DE\u30C3\u30C8: i, postid, userpostid, postname\n\t\tvar\titems = lines[i].split(\"\\t\");\n\t\t\n\t\t" + PidTable + "[ i ] = items[1];\t// \u90E8\u7F72ID\u3092\u8A18\u9332\n\t\tallData[ idx ] = new Array( items[0], items[2], items[3] );\n\t\tidx++;\n\t}\n\t\n\tvar\ttheElem = document.getElementById('" + Container + "');\n\ttheElem.style.height=\"218px\";\t// \u9AD8\u3055\u3092\u4E0A\u3052\u308B\n\t\n\t" + theXList + ".addRows( allData );\n\t\n\ttheElem.style.height=\"200px\";\t// \u9AD8\u3055\u3092\u5143\u306B\u623B\u3059\n}\n\n// Row\u9078\u629E\u6642\u306E\u30A2\u30AF\u30B7\u30E7\u30F3\nfunction " + SelHandler + "(){\n\tif( " + theXList + " == null ){\n\t\treturn null;\n\t}\n\t\n\t// \u9078\u629E\u3057\u305F\u30BB\u30EB\u306E\u8868\u793A\n\tvar\tselnum = " + theXList + ".getCellValue( " + theXList + ".getSelectedRow(), 0 );\n//\tvar\tselid = " + theXList + ".getCellValue( " + theXList + ".getSelectedRow(), 1 );\n//\tvar\tselname = " + theXList + ".getCellValue( " + theXList + ".getSelectedRow(), 2 );\n//\talert( selid + ' : ' + selname );\n\t\n\t// \u9078\u629E\u3057\u305F\u90E8\u7F72ID\u3092\u6C42\u3081\u308B\n\tif( " + PidTable + " == null ){\n\t\treturn;\n\t}\n\tvar\tpostid = " + PidTable + "[ selnum ];\n\tif( postid == null ){\n\t\treturn;\n\t}\n\t// AJAX\u3067\u30C7\u30FC\u30BF\u53D6\u5F97\u3059\u308B\n\tvar\tobjXReq = new XRequest();\n\tobjXReq.onload = " + RowSelHandler + ";\t// \u30ED\u30FC\u30C9\u6642\u306E\u51E6\u7406\u3092\u6307\u5B9A\n\tvar\turl = '/XML/xlistpos.php';\n\tvar\tpostdata = 'pid=" + pactid + "' +\n\t\t'&postid=" + postid + "' +\n\t\t'&tgtpost=' + encodeURIComponent( postid ) +\n\t\t'&type=" + this.type + "' +\n\t\t'&dividname=" + XList + "' +\n\t\t'&post_tb=" + this.post_tb + "' +\n\t\t'&post_rel_tb=" + this.post_relation_tb + "' +\n\t\t'&postnew=" + this.postnew + "' +\n\t\t'&carid=" + this.carid + "' +\n\t\t'&shop_auth=" + this.shop_auth + "';\n\tobjXReq.requestURL( postdata , 'POST', url, true );\n}\n\n// Row\u9078\u629E\u6642\u306E\u51E6\u7406\u3001\u5F15\u6570\u306Fhttpobj\u304C\u5165\u3063\u3066\u304F\u308B\nfunction " + RowSelHandler + "( httpobj ){\n\tif( httpobj == null ){\n\t\talert('RowSelHandler, null httpobj.');\n\t\treturn;\n\t}\n\t\n\tvar\tresult = httpobj.responseText;\n\t\n\tif( result == null ){\n\t\talert('" + this.ErrorMessView2 + "');\n\t\treturn;\n\t}\n\tif( ! result.match(/^OK/) ){ // \u5148\u982D\u304COK\u304C\u6B63\u5E38\n\t\talert('" + tnis.ErrorMessView3 + "');\n\t\treturn;\n\t}\n\t\n\tvar\tlines = result.split(\"\\n\");\n\tfor( var i=1; i < lines.length; i++ ){ // 1\u884C\u76EE\u306EOK\u306F\u30B9\u30AD\u30C3\u30D7\n\t\t// 'END'\u3067\u7D42\u4E86\n\t\tif( lines[i].match(/^END$/) ){\n\t\t\tbreak;\n\t\t}\n\t\tvar\tpostpath = lines[i];\n\t}\n\t\n\t// \u9078\u629E\u90E8\u7F72\u306E\u8868\u793A\u306B\u53CD\u6620\n\t" + xpost_disp + ".innerHTML = postpath;\n}\n\n// \u30C9\u30E9\u30C3\u30B0\u79FB\u52D5\u958B\u59CB\ninitDrag('" + XList + "');\n\n</script>\n</div>\n";
		return rtn_str;
	}

	xlistJs() {
		return "\n\t\t\t<script type=\"text/javascript\" src=\"/js/sortabletable.js\"></script>\n\t\t\t<script type=\"text/javascript\" src=\"/js/columnlist.js\"></script>\n\t\t\t<script type=\"text/javascript\" src=\"/js/xlist.js\"></script>\n\t\t\t<script type=\"text/javascript\" src=\"/js/xrequest.js\"></script>\n\t\t\t<!-- script type=\"text/javascript\" src=\"/js/dragwin.js\"></script -->\n\t\t\t<link type=\"text/css\" rel=\"stylesheet\" href=\"/css/columnlist.css\" />";
	}

};