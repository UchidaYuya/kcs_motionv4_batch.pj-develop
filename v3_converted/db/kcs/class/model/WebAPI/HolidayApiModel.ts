//
//HolidayModel
//
//@uses ModelBase
//@package
//@author web
//@since 2018/06/20
//

require("model/ModelBase.php");

//
//__construct
//
//@author web
//@since 2018/06/20
//
//@param mixed $O_db0
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//getHoliday
//
//@author web
//@since 2018/06/20
//
//@param mixed $pactid
//@param mixed $postid
//@param mixed $loginid
//@param mixed $username
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2018/06/20
//
//@access public
//@return void
//
class HolidayApiModel extends ModelBase {
	constructor(O_db0) {
		super(O_db0);
	}

	getHoliday(year) //if( $loginid == "" && $username == "" ){
	//			return array();
	//		}
	//		$O_Post = new PostModel;
	//		$post_list = $O_Post->getChildList( $pactid, $postid );
	//		if( empty( $post_list) ){
	//			return array();
	//		}
	//		$sql = "select usr.userid,post.postname,usr.loginid,usr.username from user_tb as usr "
	//					." join post_tb post on post.pactid = usr.pactid and post.postid = usr.postid"
	//					." where"
	//					." usr.pactid=".$this->get_DB()->dbQuote($pactid,"integer",true)
	//					." and usr.postid in (".implode(",",$post_list).")";
	//		if( $loginid != "" ){
	//			$sql .= " and usr.loginid like ".$this->get_DB()->dbQuote("%".$loginid."%","text",true);
	//		}
	//		if( $username != "" ){
	//			$sql .= " and usr.username like ".$this->get_DB()->dbQuote("%".$username."%","text",true);
	//		}
	//		return $this->get_DB()->queryHash( $sql );
	{}

	__destruct() {
		super.__destruct();
	}

};