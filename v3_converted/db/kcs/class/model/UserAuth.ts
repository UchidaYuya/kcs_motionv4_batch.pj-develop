require("MtAuthority.php");

class UserAuth {
	constructor(auth: MtAuthority) {
		this.auth = auth;
	}

	getUserini(userid) {
		return this.auth.getUserFuncIni(userid);
	}

	getPactini() {
		return this.auth.getPactFuncIni();
	}

	getAllini(userid) {
		return array_merge(this.getUserini(userid), this.getPactini());
	}

};