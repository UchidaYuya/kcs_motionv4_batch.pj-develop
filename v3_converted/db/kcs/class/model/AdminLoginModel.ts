//
//MtAdminLoginで使用するモデル
//
//@filesource
//@package Base
//@subpackage Login
//@author nakanita
//@since 2008/04/17
//
//
//
//MtAdminLoginで使用するモデル
//
//@package Base
//@subpackage Model
//@author nakanita
//@since 2008/04/17
//

require("MtDBUtil.php");

require("MtOutput.php");

require("MtSetting.php");

require("LoginModel.php");

//
//コンストラクタ
//
//@author nakanita
//@since 2008/04/17
//
//@param object $O_db
//@access public
//@return void
//
//
//ログイン情報更新で使用する情報を取得する
//
//@author nakanita
//@since 2008/04/17
//
//@param integer $memid
//@access public
//@return array
//
//
//ログインで使用する情報を全て取得する
//
//@author nakanita
//@since 2008/04/17
//
//@param string $loginid
//@access public
//@return array
//
//
//IP制限テーブルから設定一覧を取得する
//
//@author nakanita
//@since 2008/04/17
//
//@param integer $pactid
//@access public
//@return array
//
//public function getIpRestrict($shopid){
//		if(is_numeric($shopid) == false){
//			$this->getOut()->errorOut(5, "ショップID(shopid)が正しく指定されていません", false);
//		}
//		$sql = "select " .
//					"net," .
//					"start_time," .
//					"end_time," .
//					"week," .
//					"type " .
//				"from " .
//					"shop_ip_restrict_tb " .
//				"where " .
//					"shopid = " . $shopid . " " . 
//				"order by " .
//					"sort";
//		return $this->getDB()->queryHash($sql);
//	}
//
//現在ログイン中であることをセッション情報に書き込む。
//二重ログインチェックに用いている
//
//@author nakanita
//@since 2008/05/01
//
//@param mixed $shopid
//@param mixed $memid
//@param mixed $sess_id
//@access public
//@return integer 更新した行数、0 なら失敗
//
//public function setLoginSessInfo( $shopid, $memid, $sess_id ){
//		// まず $shopid, $memid だけで検索を行う
//		$A_pact_user_num = $this->getLoginSessInfo( $shopid, $memid );
//		// 他に無ければ新規作成
//		if(count($A_pact_user_num) == 0){
//			$pact_user_sql = "INSERT INTO shop_login_rel_sess_tb(shopid, memid, sess)values(" .
//					$shopid . "," . $memid . ",'" . $sess_id ."')";
//			$cnt = $this->getDB()->exec($pact_user_sql);
//		}
//		// 既にあれば、新しいセッションで上書きする、つまり後勝ち
//		else if(count($A_pact_user_num) == 1){
//			$pact_user_sql = "UPDATE shop_login_rel_sess_tb SET sess = '" . $sess_id .
//					"' WHERE shopid = " . $shopid . " and memid = " . $memid;
//			$cnt = $this->getDB()->exec($pact_user_sql);
//		}
//		else{ // ２つ以上セッションがあった、これは異常
//			return 0;
//		}
//		return $cnt;
//	}
//
//現在ログイン中のセッション情報を取得する。
//二重ログインチェックに用いている
//
//@author nakanita
//@since 2008/04/23
//
//@param integer $shopid
//@param integer $memid
//@param string $sess_id
//@access public
//@return void
//
//public function getLoginSessInfo( $shopid, $memid, $sess_id="" ){
//		$pact_user_sql = "SELECT * FROM shop_login_rel_sess_tb " .
//				" WHERE shopid = " . $shopid .
//				" AND memid = " . $memid ;
//		
//		// セッションID条件
//		if( $sess_id != "" ){
//			$pact_user_sql .= (" AND sess ='" . $sess_id . "'");
//		}
//		
//	//	$this->getOut()->debugOut( $pact_user_sql );
//		
//		return $this->getDB()->queryHash($pact_user_sql);
//	}
//
//パスワードの変更日付を得る
//
//@author nakanita
//@since 2008/04/23
//
//@param integer $userid
//@access public
//@return void
//
//public function getLoginPasschanged( $memid ){
//		$sql = "select passchanged from shop_member_tb where memid = " . $memid;
//		return $this->getDB()->queryOne($sql);
//	}
//
//パスワードの失敗回数を得る
//
//@author nakanita
//@since 2008/06/20
//
//@param integer $shopid
//@param integer $memid
//@access public
//@return void
//
//private function getMiscount( $shopid, $memid ){
//		
//		$sql = "select " .
//			"miscount " .
//			"from " .
//				"shop_member_tb " .
//			"where " .
//			"shopid = " . $shopid .
//			" and memid = " . $memid;
//		
//	//	$this->debugOut( $sql );
//		return  $this->getDB()->queryOne($sql);
//	}
//
//パスワードの失敗回数を変更する
//
//@author nakanita
//@since 2008/06/20
//
//@param integer $shopid
//@param integer $memid
//@param boolean $flag trueのとき+1する、falseのときリセットで０に戻す
//@access public
//@return integer
//
//public function setMiscount( $shopid, $memid, $flag ){
//		if( $flag == true ){
//			$cnt = $this->getMiscount( $shopid, $memid );
//			$cnt++;
//		}else{
//			$cnt = 0;
//		}
//		
//		$sql = "update shop_member_tb set miscount = ". $cnt .
//			" where " .
//			" shopid = " . $shopid .
//			" and memid = " . $memid;
//		
//		$ret_line = $this->getDB()->exec($sql);
//		if( $ret_line != 1 ){
//		//	更新された数が１ではない
//			return -1;	// 失敗
//		}
//		return $cnt;	// 成功
//	}
class AdminLoginModel extends LoginModel {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getUserInfo(admin_shopid) //$this->getOut()->debugOut( $sql );
	{
		if (is_numeric(admin_shopid) == false) {
			this.getOut().errorOut(5, "Admin\u30B7\u30E7\u30C3\u30D7ID(admin_shopid)\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var sql = "select " + "shop_tb.shopid," + "shop_tb.groupid," + "shop_tb.name," + "shop_member_tb.mail," + "shop_tb.postcode," + "shop_member_tb.name," + "shop_tb.fiscalmonth " + "from " + "shop_tb " + " inner join shop_member_tb on shop_tb.memid = shop_member_tb.memid " + "where " + "shop_tb.shopid = " + admin_shopid;
		return this.getDB().queryRowHash(sql);
	}

	getUserInfoAll(userid_ini = "", loginid = "") //$this->getOut()->debugOut( $sql );
	{
		if (loginid == "") {
			this.getOut().errorOut(5, "\u8CA9\u58F2\u5E97\u30B3\u30FC\u30C9(userid_ini)\u3001\u30ED\u30B0\u30A4\u30F3ID(loginid)\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044", false);
		}

		var sql = "select " + "shop_tb.shopid," + "shop_tb.groupid," + "shop_tb.passwd," + "shop_tb.name," + "shop_member_tb.name," + "shop_member_tb.mail," + "shop_tb.postcode," + "shop_tb.fiscalmonth " + "from " + "shop_tb inner join shop_member_tb on shop_tb.memid = shop_member_tb.memid " + "where " + "shop_tb.loginid = '" + loginid + "' " + "and shop_tb.type = 'A' " + "and shop_tb.delflg = false";
		return this.getDB().queryRowHash(sql);
	}

};