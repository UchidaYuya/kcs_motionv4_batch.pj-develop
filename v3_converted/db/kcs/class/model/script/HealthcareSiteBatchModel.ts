//
//ヘルスケアランキングサイトへの情報登録用
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author miyazawa
//@since 2010/02/03
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//getPactList
//会社情報の取得
//@author web
//@since 2016/04/22
//
//@access public
//@return void
//
//
//getTeam
//チーム情報の取得
//@author web
//@since 2016/04/22
//
//@access public
//@return void
//
//
//getHealthcareId
//ヘルスケアID一覧を取得する
//@author web
//@since 2016/04/22
//
//@access public
//@return void
//
//
//__destruct
//
//@author miyazawa
//@since 2010/02/03
//
//@access public
//@return void
//
class HealthcareSiteBatchModel extends ModelBase {
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
		this.O_Post = new PostModel();
	}

	getPactList() //pactidをkeyにして返す
	{
		var sql = "select" + " fnc.pactid" + ",pact.userid_ini" + ",pact.compname" + " from fnc_relation_tb as fnc" + " join pact_tb pact on pact.pactid=fnc.pactid" + " where" + " fnc.fncid=246";
		return this.get_DB().queryHash(sql);
	}

	getPost(pactid, tableNo) //
	{
		var sql = "select hlt.pactid,hlt.postid,pact.userid_ini,post.postname" + " from healthcare_" + tableNo + "_tb as hlt" + " join pact_tb pact on pact.pactid = hlt.pactid" + " join post_" + tableNo + "_tb post on post.pactid = hlt.pactid and post.postid = hlt.postid" + " where" + " hlt.pactid = " + this.get_DB().dbQuote(pactid, "integer", true) + " group by" + " hlt.pactid,hlt.postid,pact.userid_ini,post.postname";
		return this.get_DB().queryHash(sql);
	}

	getHealthcareId(pactid, tableNo) {
		var sql = "select" + " hlt.healthid" + ",pact.userid_ini" + ",hlt.postid" + " from healthcare_" + tableNo + "_tb as hlt" + " join pact_tb pact on pact.pactid = hlt.pactid" + " join post_" + tableNo + "_tb post on post.pactid = hlt.pactid and post.postid = hlt.postid" + " where" + " hlt.pactid = " + this.get_DB().dbQuote(pactid, "integer", true) + " and hlt.delete_flg != true";
		return this.get_DB().queryKeyAssoc(sql);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};