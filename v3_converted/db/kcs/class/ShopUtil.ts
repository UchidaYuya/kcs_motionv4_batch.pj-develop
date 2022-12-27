//
// ユーティリティ・クラス(販売店用)
//
//
// 作成日：2005/11/14
// 作成者： 前田
//

require("DBUtil.php");

require("ErrorUtil.php");

require("common.conf");

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//都道府県ＵＩ(プルダウン)
//
//[引　数] なし
//[返り値] $A_options：SQLリザルト
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
class ShopUtil {
	makeAddrAreaSelecter(O_form, name, label) //都道府県一覧を取得
	{
		if (file_exists(KCS_DIR + "/define/area.master") == true) {
			var A_area = file(KCS_DIR + "/define/area.master");
		}

		var H_area = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
		};

		for (var x = 0; x < A_area.length; x++) {
			A_area[x] = rtrim(A_area[x]);
			H_area[A_area[x]] = A_area[x];
		}

		O_form.addElement("select", name, label, H_area);
	}

	makeSimIntervalSelecter(O_form, name, label) {
		var H_interval = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
		};

		for (var cnt = 1; cnt <= 12; cnt++) {
			H_interval[cnt] = cnt + "\u30F6\u6708";
		}

		O_form.addElement("select", name, label, H_interval);
	}

};