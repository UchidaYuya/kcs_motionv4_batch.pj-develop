//
//受注用Viewの基底クラス
//
//更新履歴：<br>
//2008/10/07 igarashi 作成
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/10/07
//@filesource
//@uses ShopOrderDetailView
//
//
//error_reporting(E_ALL);
//
//注文Viewの基底クラス
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/06/30
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/ViewFinish.php");

require("view/Order/ShopOrderMenuView.php");

require("model/Order/ShopOrderDownloadModel.php");

//
//コンストラクタ <br>
//
//@author igarashi
//@since 2008/06/30
//
//@access public
//@return void
//
//
//getLocalSession
//
//@author web
//@since 2014/01/21
//
//@access public
//@return void
//
//
//clearUnderSession
//
//@author web
//@since 2014/01/21
//
//@param array $A_exc
//@access public
//@return void
//
//
//項目名出力。sortArrayと同じ順番にすること
//
//@author igarashi
//@since 2009/02/18
//
//@access public
//@return void
//
//
//csvに出力
//
//@author igarashi
//@since 2009/02/18
//
//@param mixed $H_sub
//@access public
//@return void
//
//
//記号や改行を除去
//
//@author igarashi
//@since 2008/00/00
//
//@param mixed $str
//@access public
//@return void
//
//
//checkParamError
//
//@author web
//@since 2014/03/18
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/06/30
//
//@access public
//@return void
//
class ShopOrderDownloadView extends ShopOrderMenuView {
	constructor(H_param = Array()) {
		super(H_param);
	}

	getLocalSession() {
		if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
			this.pub = "/Shop/MTOrder/rapid";
		} else {
			this.pub = ShopOrderDownloadView.PUB;
		}

		var H_sess = {
			[this.pub]: this.O_Sess.getPub(this.pub),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	clearUnderSession(A_exc: {} | any[]) {
		this.clearLastForm();
		this.O_Sess.clearSessionExcludeListPub(A_exc);
	}

	getLabelArray() {
		var A_label = ["\u53D7\u6CE8\u756A\u53F7", "\u679D\u756A", "\u8B58\u5225", "\u6CE8\u6587\u533A\u5206", "\u4F01\u696D\u30B3\u30FC\u30C9", "\u9867\u5BA2ID", "\u643A\u5E2F\u756A\u53F7", "\u4F7F\u7528\u8005", "\u5730\u57DF\u4F1A\u793E", "\u793E\u54E1\u756A\u53F7", "\u304A\u5BA2\u69D8\u30B3\u30FC\u30C9", "\u30AD\u30E3\u30EA\u30A2", "\u767A\u6CE8\u7A2E\u5225", "\u8CA9\u58F2\u65B9\u5F0F", "\u5206\u5272\u56DE\u6570", "\u30B9\u30C6\u30FC\u30BF\u30B9", "\u53D7\u6CE8\u65E5", "\u7D0D\u54C1\u65E5", "\u51E6\u7406\u65E5", "\u66F4\u65B0\u65E5", "\u767B\u9332\u65E5", "\u56DE\u7DDA\u7A2E\u5225", "\u9867\u5BA2\u5074\u5165\u529B\u62C5\u5F53\u8005\u540D", "\u5951\u7D04\u540D\u7FA9", "\u767A\u6CE8\u540D\u7FA9", "\u767B\u9332\u90E8\u7F72", "\u767B\u9332\u90E8\u7F72ID", "\u7533\u8ACB\u91D1\u984D", "\u5546\u54C1\u7A2E\u5225", "\u5546\u54C1\u540D", "\u8272", "\u6599\u91D1\u30D7\u30E9\u30F3", "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF", "\u53F0\u6570", "\u62C5\u5F53\u4EF6\u6570", "\u30AA\u30D7\u30B7\u30E7\u30F3", "\u5272\u5F15\u30B5\u30FC\u30D3\u30B9", "\u30B5\u30FC\u30D3\u30B9", "\u30A6\u30A7\u30D6\u5B89\u5FC3\u30B5\u30FC\u30D3\u30B9", "au\u3001Y\uFF01mobile(\u65E7WILLCOM)\u6307\u5B9A\u5272", "MNP\u7533\u3057\u8FBC\u307F", "MNP\u53D7\u4ED8\u756A\u53F7", "\u540D\u7FA9\u5909\u66F4\u7A2E\u5225", "\u5E0C\u671B\u65E5\u6642(FROM)", "\u5E0C\u671B\u65E5\u6642(TO)", "\u5207\u66FF\u65E5\u6642", "\u6307\u5B9A\u30DD\u30A4\u30F3\u30C8", "\u30DD\u30A4\u30F3\u30C8\u63DB\u7B97\u984D", "\u65E7\u7AEF\u672B\u56DE\u53CE", "\u8ACB\u6C42\u65B9\u6CD5", "\u89AA\u756A\u53F7", "\u4E8B\u52D9\u624B\u6570\u6599\u306E\u652F\u6255\u3044\u65B9\u6CD5", "\u8ACB\u6C42\u66F8\u9001\u4ED8\u5148", "\u7D0D\u54C1\u65B9\u6CD5", "\u767A\u9001\u5148\u540D\u79F0", "\u53D7\u53D6\u4EBA\u540D", "\u90F5\u4FBF\u756A\u53F7", "\u90FD\u9053\u5E9C\u770C", "\u5E02\u533A\u753A\u6751\u756A\u5730", "\u30D3\u30EB\u540D", "\u9023\u7D61\u5148\u96FB\u8A71\u756A\u53F7", "\u9867\u5BA2\u8A18\u5165\u306E\u5099\u8003", "\u5951\u7D04\u65E5", "\u8CFC\u5165\u65E5", "\u6587\u5B57\u52171", "\u6587\u5B57\u52172", "\u6587\u5B57\u52173", "\u6570\u50241", "\u6570\u50242", "\u6CE8\u6587\u6642\u4FA1\u683C", "\u4FA1\u683C", "\u5229\u7528\u30DD\u30A4\u30F3\u30C8", "\u4FA1\u683C\u5C0F\u8A08", "\u8ACB\u6C42\u91D1\u984D", "\u58F2\u4E0A\u90E8\u9580", "\u51FA\u8377\u5148\u30B3\u30FC\u30C9", "\u53D7\u6CE8\u5143\u90E8\u9580\u30B3\u30FC\u30C9", "\u632F\u66FF\u5148\u90E8\u9580\u30B3\u30FC\u30C9", "\u632F\u66FF\u5185\u5BB9", "\u6700\u7D42\u66F4\u65B0\u8005", "\u8CA9\u58F2\u5E97\u5099\u8003", "\u8CA9\u58F2\u5E97\u30E1\u30E2", "\u88FD\u9020\u756A\u53F7", "SIM\u756A\u53F7", "\u5728\u5EAB\u533A\u5206", "\u30D5\u30EA\u30FC\u9805\u76EE1", "\u30D5\u30EA\u30FC\u9805\u76EE2", "\u30D5\u30EA\u30FC\u9805\u76EE3", "\u30D5\u30EA\u30FC\u9805\u76EE4", "\u5185\u7DDA\u756A\u53F7", "\u627F\u8A8D\u8005", "\u627F\u8A8D\u8005\u540D", "\u8CFC\u5165\u8CA0\u62C5\u90E8\u9580\u8077\u5236", "\u8CFC\u5165\u8CA0\u62C5\u90E8\u9580\u8077\u5236\u540D", "\u901A\u4FE1\u8CA0\u62C5\u90E8\u9580\u8077\u5236", "\u901A\u4FE1\u8CA0\u62C5\u90E8\u9580\u8077\u5236\u540D", "\u8CFC\u5165\u30AA\u30FC\u30C0", "\u901A\u4FE1\u8CBB\u30AA\u30FC\u30C0", "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5909\u66F4\u30D5\u30E9\u30B0", "\u652F\u6255\u3044\u65B9\u6CD5", "\u8ACB\u6C42\u5148\u540D", "\u8ACB\u6C42\u90E8\u7F72", "\u8ACB\u6C42\u53D7\u53D6\u4EBA\u540D", "\u8ACB\u6C42\u90F5\u4FBF\u756A\u53F7", "\u8ACB\u6C42\u90FD\u9053\u5E9C\u770C", "\u8ACB\u6C42\u5E02\u533A\u753A\u6751\u756A\u5730", "\u8ACB\u6C42\u5EFA\u7269\u540D", "\u8ACB\u6C42\u9023\u7D61\u5148\u96FB\u8A71\u756A\u53F7", "\u30DD\u30A4\u30F3\u30C8\uFF08\u7A0E\u8FBC\uFF09", "\u4FA1\u683C\u5C0F\u8A08\uFF08\u7A0E\u8FBC\uFF09", "\u8ACB\u6C42\u91D1\u984D\uFF08\u7A0E\u8FBC\uFF09", "\u7528\u9014", "MNP\u4E88\u7D04\u756A\u53F7\u6709\u52B9\u65E5"];
		return A_label;
	}

	outOrderList(H_sub) //ドコモ監査対応。ドコモに関係ないやつがあれば番号を控えて削除する
	{
		var A_label = this.getLabelArray();
		var filename = "\u53D7\u6CE8\u4E00\u89A7.csv";
		header("Pragma: private");

		if (preg_match("/MSIE/i", _SERVER.HTTP_USER_AGENT) == true || preg_match("/Trident/i", _SERVER.HTTP_USER_AGENT) == true) //header("Content-Disposition: inline; filename=\"" . mb_convert_encoding($filename, "SJIS-win", "UTF-8") . "\"");
			{
				header("Content-Disposition: attachment; filename=\"" + mb_convert_encoding(filename, "SJIS-win", "UTF-8") + "\"");
			} else if (preg_match("/Gecko/i", _SERVER.HTTP_USER_AGENT) == true) {
			header("Content-Disposition: attachment; filename=\"" + filename + "\"");
		}

		header("Content-type: application/octet-stream");

		if (this.O_Sess.docomo_only == true) {
			for (var key in A_label) {
				var value = A_label[key];

				if (value == "\u30A6\u30A7\u30D6\u5B89\u5FC3\u30B5\u30FC\u30D3\u30B9") {
					var web_ansin = key;
					delete A_label[key];
				}

				if (value == "au\u3001Y\uFF01mobile(\u65E7WILLCOM)\u6307\u5B9A\u5272") {
					var siteiwari = key;
					delete A_label[key];
				}
			}
		}

		echo(mb_convert_encoding(A_label.join("\t") + "\r\n", "SJIS-win", "UTF-8"));

		for (var key in H_sub) //どこも監査フラグがあれば、ドコモに関係ないやつを削除する
		{
			var val = H_sub[key];

			if (undefined !== web_ansin == true) {
				delete val[web_ansin];
			}

			if (undefined !== siteiwari == true) {
				delete val[siteiwari];
			}

			this.replaceDownloadString(val);
			echo(mb_convert_encoding(val.join("\t") + "\r\n", "SJIS-win", "UTF-8"));
		}
	}

	viewOrderList(H_sub) //ラベルをかく
	//echo mb_convert_encoding(implode("\t", $A_label). "\r\n", "SJIS-win", "UTF-8");
	{
		var A_label = this.getLabelArray();
		echo(A_label.join("\t") + "\r\n");

		for (var key in H_sub) //echo mb_convert_encoding(implode("\t", $val). "\r\n", "SJIS-win", "UTF-8");
		{
			var val = H_sub[key];
			this.replaceDownloadString(val);
			echo(val.join("\t") + "\r\n");
		}
	}

	replaceDownloadString(str) //"”’"に置換していた。どうも間違いだと思われるので"”"に直した	20100715miyamiya
	//シングルクォート、ダブルクォートのstripslashes代わり（stripslashesをそのままかけるとこの関数の帰り先のimplodeでエラーになってしまう） 20100715miya
	{
		str = str.replace(/(')/g, "\u2019");
		str = str.replace(/(")/g, "\u201D");
		str = preg_replace("/(\r\n|\r|\n|\t)/", " ", str);
		str = str.replace(/(\\’)/g, "\u2019");
		str = str.replace(/(\\”)/g, "\u201D");
		return str;
	}

	checkParamError(key, H_sess, H_g_sess) {
		if (!(undefined !== H_sess[key].down) || !(undefined !== H_sess[key].down.where)) {
			this.errorOut(8, "session\u304C\u7121\u3044", false);
			throw die();
		}
	}

	__destruct() {
		super.__destruct();
	}

};