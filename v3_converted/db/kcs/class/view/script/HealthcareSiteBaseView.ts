//
//error_reporting(E_ALL|E_STRICT);

require("view/script/ViewBaseScript.php");

require("MtScriptArgs.php");

//private $debug = true;
//
//__construct
//コンストラクタ
//@author web
//@since 2016/04/22
//
//@access public
//@return void
//
//エラー出力
//
//getOAuth2
//アクセストークンの取得
//@author web
//@since 2016/04/22
//
//@access public
//@return void
//
//
//registTeam
//チーム情報の登録
//@author web
//@since 2016/04/22
//
//@access public
//@return void
//
//
//registPact
//
//@author web
//@since 2016/04/22
//
//@param mixed $token
//@param mixed $code
//@param mixed $name
//@access public
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2010/02/03
//
//@access public
//@return void
//
class HealthcareSiteBaseView extends ViewBaseScript {
  constructor() //親のコンストラクタを必ず呼ぶ
  //iniファイル読み込み
  //接続先URL取得
  //アクセストークン取得
  {
    super();
    this.SiteUrl = "";
    this.url = "";
    this.token = "";
    this.healthcare_ini = parse_ini_file(KCS_DIR + "/conf_sync/healthcare_site.ini");
    this.url = this.healthcare_ini.url;
    var basic = base64_encode("kcsmotion:" + this.healthcare_ini.OAuth2Secret);
    var res = this.getOAuth2(basic);

    if (is_null(res)) //エラー
      {
        this.token = "";
      } else {
      this.token = res.access_token;
    }
  }

  putError(title, res) //エラーチェック
  {
    if (undefined !== res.errors) {
      this.infoOut("Error!\t" + title, 0);

      for (var error of Object.values(res.errors)) {
        this.infoOut(error.code + "\t" + error.message, 0);
      }

      return false;
    }

    this.infoOut(title, 0);
    return true;
  }

  getOAuth2(basic) {
    var cmd = "curl" + " -X POST" + " --header 'Content-Type: application/x-www-form-urlencoded'" + " --header 'Accept: application/json'" + " --header 'Authorization: Basic " + basic + "'" + " -d 'grant_type=client_credentials&scope=client'" + " -k" + " -s" + " 'http://" + this.url + "/api/v1/oauth2/token'";
    var res = exec(cmd);
    res = JSON.parse(res);

    if (is_null(res)) {
      this.infoOut("auth2\u8A8D\u8A3C\u5931\u6557\n", 1);
      this.infoOut(cmd + "\n", 1);
    } else if (undefined !== res.error) {
      var str = res.error;
      str += "\t" + res.error_description;
      str += "\t" + cmd;
      str += "\n";
      this.infoOut(str, 1);
    } else {
      this.infoOut("auth\u8A8D\u8A3C\u6210\u529F\n", 0);
      return res;
    }

    return undefined;
  }

  getTeam(oid) {
    var per_page = 1;
    var next_url = "http://" + this.url + "/api/v1/organizations/" + oid + "/teams?page=1";
    var team_list = Array();

    do //エラーチェック
    //次のURL
    {
      var cmd = "curl" + " -X GET" + " --header 'Accept: application/json'" + " --header 'Authorization: Bearer " + this.token + "'" + " -k" + " -s" + " '" + next_url + "&per_page=" + per_page + "'";
      var res = exec(cmd);
      res = JSON.parse(res);

      if (undefined !== res.error) {
        break;
      }

      team_list = array_merge(team_list, res.teams);

      if (!(undefined !== res.next_url)) {
        break;
      }

      next_url = res.next_url;
    } while (!is_null(next_url));

    res = Array();

    for (var key in team_list) {
      var value = team_list[key];
      res[value.team_id] = {
        team_name: value.team_name,
        team_internal_id: value.team_internal_id
      };
    }

    return res;
  }

  changeTeam(_oid, _teamid, _teamname) //エラーチェック
  {
    var oid = urlencode(_oid);
    var teamid = urlencode(_teamid);
    var teamname = urlencode(_teamname);
    var cmd = "curl" + " -X PATCH" + " --header 'Content-Type: application/x-www-form-urlencoded'" + " --header 'Accept: application/json'" + " --header 'Authorization: Bearer " + this.token + "'" + " -d 'team_name=" + teamname + "'" + " -k" + " -s" + " 'http://" + this.url + "/api/v1/organizations/" + oid + "/teams/" + teamid + "'";
    var res = exec(cmd);
    res = JSON.parse(res);

    if (undefined !== res.error) //echo $res->error->code;         //      エラーコード
      //echo $res->error->message;      //      エラーメッセージ
      {
        return undefined;
      }

    return {
      team_id: res.team_id,
      team_name: res.team_name,
      team_internal_id: res.team_internal_id
    };
    return JSON.parse(res);
  }

  registTeam(_pactcode, _teamid, _teamname) //デバッグ中であれば・・
  //{
  //			"team_id": "string",
  //			"team_name": "string",
  //			"team_internal_id": 0
  //		}
  {
    var pactcode = urlencode(_pactcode);
    var teamid = urlencode(_teamid);
    var teamname = urlencode(_teamname);

    if (this.debug) {
      return Object({
        team_id: teamid,
        team_name: teamname
      });
    }

    var cmd = "curl" + " -X POST" + " --header 'Content-Type: application/x-www-form-urlencoded'" + " --header 'Accept: application/json'" + " --header 'Authorization: Bearer " + this.token + "'" + " -d 'team_id=" + teamid + "&team_name=" + teamname + "'" + " 'http://" + this.url + "/api/v1/organizations/" + pactcode + "/teams'";
    var res = exec(cmd);
    return JSON.parse(res);
  }

  getPact() {
    this.url = this.healthcare_ini.url;
    var per_page = 1;
    var next_url = "http://" + this.url + "/api/v1/organizations?page=1";
    var pact_list = Array();

    do //エラーチェック
    {
      var cmd = "curl" + " -X GET" + " --header 'Accept: application/json'" + " --header 'Authorization: Bearer " + this.token + "'" + " -s" + " -k" + " '" + next_url + "&per_page=" + per_page + "'";
      var res = exec(cmd);
      res = JSON.parse(res);
      pact_list = array_merge(pact_list, res.organizations);

      if (undefined !== res.error) {
        break;
      }

      if (!(undefined !== res.next_url)) {
        break;
      }

      next_url = res.next_url;
    } while (!is_null(next_url));

    res = Array();

    for (var key in pact_list) {
      var value = pact_list[key];
      res[value.organization_id] = {
        organization_name: value.organization_name,
        organization_internal_id: value.organization_internal_id
      };
    }

    return res;
  }

  registPact(_id, _name) //企業ID
  //ユーザーID
  {
    var id = urlencode(_id);
    var name = urlencode(_name);
    var cmd = "curl" + " -X POST" + " --header 'Content-Type: application/x-www-form-urlencoded'" + " --header 'Accept: application/json'" + " --header 'Authorization: Bearer " + this.token + "'" + " -d 'organization_id=" + id + "&organization_name=" + name + "'" + " -k" + " -s" + " 'http://" + this.url + "/api/v1/organizations'";
    var res = exec(cmd);
    res = JSON.parse(res);

    if (is_null(res)) //エラー
      {
        return undefined;
      }

    if (undefined !== res.error) //echo $res->error->code;         //      エラーコード
      //echo $res->error->message;      //      エラーメッセージ
      {
        return undefined;
      }

    return {
      organization_id: res.organization_id,
      organization_name: res.organization_name,
      organization_internal_id: res.organization_internal_id
    };
  }

  getUser(_oid) {
    var oid = urlencode(_oid);
    var per_page = 1;
    var next_url = "http://" + this.url + "/api/v1/organizations/" + oid + "/users?page=1";
    var user_list = Array();

    do //エラーチェック
    //次のURL
    {
      var cmd = "curl" + " -X GET" + " --header 'Accept: application/json'" + " --header 'Authorization: Bearer " + this.token + "'" + " -k" + " -s" + " '" + next_url + "&per_page=" + per_page + "'";
      var res = exec(cmd);
      res = JSON.parse(res);

      if (undefined !== res.error) {
        break;
      }

      user_list = array_merge(user_list, res.users);

      if (!(undefined !== res.next_url)) {
        break;
      }

      next_url = res.next_url;
    } while (!is_null(next_url));

    res = Array();

    for (var key in user_list) {
      var value = user_list[key];
      res.push({
        user_id: value.user_id,
        team_id: value.team_id
      });
    }

    return res;
  }

  registUser(_oid, _team_id, _user_id) //エラーチェック
  {
    var oid = urlencode(_oid);
    var user_id = urlencode(_user_id);
    var team_id = urlencode(_team_id);
    var cmd = "curl -X POST" + " --header 'Content-Type: application/x-www-form-urlencoded'" + " --header 'Accept: application/json'" + " --header 'Authorization: Bearer " + this.token + "'" + " -d 'user_id=" + user_id + "&team_id=" + team_id + "'" + " -k" + " -s" + " 'http://" + this.url + "/api/v1/organizations/" + oid + "/users'";
    var res = exec(cmd);
    res = JSON.parse(res);

    if (undefined !== res.error) //echo $res->error->code;         //      エラーコード
      //echo $res->error->message;      //      エラーメッセージ
      {
        return undefined;
      }

    return {
      user_id: res.user_id,
      team_id: res.team_name
    };
  }

  changeUserTeam(_oid, _team_id, _user_id) //エラーチェック
  {
    var oid = urlencode(_oid);
    var user_id = urlencode(_user_id);
    var team_id = urlencode(_team_id);
    var cmd = "curl -X PUT" + " --header 'Content-Type: application/x-www-form-urlencoded'" + " --header 'Accept: application/json'" + " --header 'Authorization: Bearer " + this.token + "'" + " -d 'team_id=" + team_id + "'" + " -k" + " -s" + " 'http://" + this.url + "/api/v1/organizations/" + oid + "/users/" + user_id + "/team'";
    var res = exec(cmd);
    res = JSON.parse(res);

    if (undefined !== res.error) //echo $res->error->code;         //      エラーコード
      //echo $res->error->message;      //      エラーメッセージ
      {
        return undefined;
      }

    return {
      user_id: res.user_id,
      team_id: res.team_id,
      user_internal_id: res.user_internal_id
    };
  }

  deleteUser(_oid, _user_id) ////      エラーチェック
  //        if( isset( $res->errors ) ){
  //            $this->infoOut( "ユーザー削除失敗(".$_oid.",".$_user_id.")" ,0);
  //            foreach( $res->errors as $error ){
  //                $this->infoOut( $error->code."\t".$error->message,0);
  //            }
  //            return NULL;
  //        }
  //        $this->infoOut( "ユーザー削除(".$_oid.",".$_user_id.")" ,0);
  //var_dump( $res );
  //        return array(   "user_id" => $res->user_id,
  //                        "team_id" => $res->team_id,
  //                        "user_internal_id" => $res->user_internal_id,
  //                );
  {
    var oid = urlencode(_oid);
    var user_id = urlencode(_user_id);
    var cmd = "curl -X DELETE" + " --header 'Content-Type: application/x-www-form-urlencoded'" + " --header 'Accept: application/json'" + " --header 'Authorization: Bearer " + this.token + "'" + " -k" + " -s" + " 'http://" + this.url + "/api/v1/organizations/" + oid + "/users/" + user_id + "/account'";
    var res = exec(cmd);
    res = JSON.parse(res);
    this.putError("\u30E6\u30FC\u30B6\u30FC\u524A\u9664\u5931\u6557(" + _oid + "," + _user_id + ")", res);
  }

  __destruct() //親のデストラクタを必ず呼ぶ
  {
    super.__destruct();
  }

};