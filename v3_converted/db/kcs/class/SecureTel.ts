//
// セキュア電話帳クラス
//
//
//
// 作成日：2006/04/18
// 作成者：宮澤龍彦
// 修正履歴：
//

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//キャリア取得SQL
//
//[引　数] なし
//[返り値] $H_carrier：SQLリザルト
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//地域会社取得SQL
//
//[引　数] $carid : キャリアID
//[返り値] $H_area：SQLリザルト
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//回線種別取得SQL
//
//[引　数] $carid : キャリアID
//[返り値] $H_circuit：SQLリザルト
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//地域会社項目取得SQL
//
//[引　数] $carid：キャリア
//[返り値] $H_areaAll：SQLリザルト
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//回線種別項目取得SQL
//
//[引　数] $carid：キャリア
//[返り値] $H_cirAll：SQLリザルト
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//電話情報取得SQL
//
//[引　数] $telno：電話番号
//$carid：キャリア
//$pactid：顧客ID
//$table：テーブル名（デフォルトはtel_tb）
//[返り値] $H_tel：SQLリザルト
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//電話存在チェックSQL
//
//[引　数] $telno：電話番号
//$pactid：顧客ID
//$cirid：回線種別
//$carid：キャリア
//$type：発注種別（デフォルトは空白文字列）
//[返り値] TRUE/FALSE
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//電話機種相違確認SQL（電話番号チェックで「機種が違います」というエラーを別に出すため作った）
//
//[引　数] $telno：電話番号
//$pactid：顧客ID
//$carid：キャリア
//[返り値] $TRUE/FALSE
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//セキュア電話存在確認SQL
//
//[引　数] $telno：電話番号
//$pactid：顧客ID
//$carid：キャリア
//$table：テーブル名（デフォルトはsecure_tb）
//[返り値] $TRUE/FALSE
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//セキュアユーザID存在チェックSQL
//
//[引　数] $pactid：顧客ID
//$user_id：セキュアユーザID
//[返り値] TRUE/FALSE
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//IP電話番号存在チェックSQL
//
//[引　数] $pactid：顧客ID
//$carid：キャリアID
//$ip_phone_number：IP電話番号
//$telno：電話番号（登録変更のとき必要）
//[返り値] TRUE/FALSE
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//セキュア電話帳利用台数とIP電話利用台数を求める関数
//
//[引　数] $H_sectels：
//
//[返り値] 台数を収めた配列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//日時文字列をタイムスタンプに整形L
//
//[引　数] $y：年
//$m：月
//$d：日
//$hr：時
//[返り値] $timestamp：タイムスタンプ
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
class SecureTel {
    getCarrier(pactid) //SQL文
    //DB接続エラーを検出してエラーメッセージを出力
    {
        var sql_str = "SELECT car.carid, car.carname FROM carrier_tb car, pact_rel_carrier_tb rl ";
        sql_str += "WHERE car.carname NOT IN ('\u5168\u3066', '\u4E0D\u660E') ";
        sql_str += "AND car.carid = rl.carid ";
        sql_str += "AND rl.pactid=" + pactid + " ";
        sql_str += "AND car.secureuseflg = TRUE ORDER BY car.carid";
        var H_carrier = GLOBALS.GO_db.getAssoc(sql_str);
        return H_carrier;
    }

    getArea(carid) //SQL文
    //DB接続エラーを検出してエラーメッセージを出力
    {
        var sql_str = "SELECT arid, arname FROM area_tb WHERE carid=" + carid + " ORDER BY sort";
        var H_area = GLOBALS.GO_db.getAssoc(sql_str);
        return H_area;
    }

    getCircuit(carid) //SQL文
    //DB接続エラーを検出してエラーメッセージを出力
    {
        var sql_str = "SELECT cirid, cirname FROM circuit_tb WHERE carid=" + carid + " AND secureuseflg = TRUE ORDER BY sort";
        var H_circuit = GLOBALS.GO_db.getAssoc(sql_str);
        return H_circuit;
    }

    getAreaAllJs() //SQL文
    {
        var sql_str = "SELECT carid, arid, arname FROM area_tb ORDER BY carid, sort";
        var H_areas = GLOBALS.GO_db.getHash(sql_str);
        var H_areaAll = Array();

        for (var i = 0; i < H_areas.length; i++) {
            if (Array.isArray(H_areaAll["CAR_area_" + H_areas[i].carid]) == false) {
                H_areaAll["CAR_area_" + H_areas[i].carid] = Array();
            }

            H_areaAll["CAR_area_" + H_areas[i].carid].push("'" + H_areas[i].arid + ":" + H_areas[i].arname + "'");
        }

        delete H_areas;
        return H_areaAll;
    }

    getCircuitAllJs() //SQL文
    {
        var sql_str = "SELECT carid, cirid, cirname FROM circuit_tb WHERE secureuseflg = TRUE ORDER BY carid, sort";
        var H_circuit = GLOBALS.GO_db.getHash(sql_str);
        var H_cirAll = Array();

        for (var i = 0; i < H_circuit.length; i++) {
            if (Array.isArray(H_cirAll["CAR_circuit_" + H_circuit[i].carid]) == false) {
                H_cirAll["CAR_circuit_" + H_circuit[i].carid] = Array();
            }

            H_cirAll["CAR_circuit_" + H_circuit[i].carid].push("'" + H_circuit[i].cirid + ":" + H_circuit[i].cirname + "'");
        }

        delete H_circuit;
        return H_cirAll;
    }

    getTel(telno, carid, pactid, table = "tel_tb") //SQL文
    {
        var sql_str = "SELECT ";
        sql_str += "tel.postid,";
        sql_str += "tel.telno,";
        sql_str += "tel.telno_view,";
        sql_str += "tel.carid,";
        sql_str += "tel.arid,";
        sql_str += "tel.cirid,";
        sql_str += "tel.username,";
        sql_str += "tel.username_kana,";
        sql_str += "pos.postname,";
        sql_str += "pos.userpostid,";
        sql_str += "res.func,";
        sql_str += "res.status AS resstatus,";
        sql_str += "sec.user_id,";
        sql_str += "sec.user_password,";
        sql_str += "sec.ip_status,";
        sql_str += "sec.ip_phone_number,";
        sql_str += "sec.ip_phone_number_view,";
        sql_str += "sec.ip_phone_pass,";
        sql_str += "sec.iapl_password,";
        sql_str += "sec.authenticate_type,";
        sql_str += "sec.terminal_id,";
        sql_str += "sec.forward_pnumber2,";
        sql_str += "sec.forward_pnumber3,";
        sql_str += "sec.forward_pnumber4,";
        sql_str += "sec.forward_pnumber5,";
        sql_str += "sec.forward_pnumber6,";
        sql_str += "sec.forward_pnumber2_view,";
        sql_str += "sec.forward_pnumber3_view,";
        sql_str += "sec.forward_pnumber4_view,";
        sql_str += "sec.forward_pnumber5_view,";
        sql_str += "sec.forward_pnumber6_view,";
        sql_str += "sec.status,";
        sql_str += "sec.secstartdate, ";
        sql_str += "res.expectdate ";
        sql_str += "FROM (" + table + " tel LEFT JOIN secure_tb sec ON (tel.telno=sec.telno AND tel.carid=sec.carid)) ";
        sql_str += "LEFT JOIN post_tb pos ON tel.postid=pos.postid ";
        sql_str += "LEFT JOIN secure_reserve_tb res ON (tel.telno=res.telno AND tel.carid=res.carid) ";
        sql_str += "WHERE tel.telno = '" + telno + "' ";
        sql_str += "AND tel.carid = " + carid + " ";
        sql_str += "AND tel.pactid = " + pactid;
        var H_tel = GLOBALS.GO_db.getRowHash(sql_str);
        return H_tel;
    }

    telExistCheck(telno, pactid, cirid, carid, type = "") //ハイフンあったら取る
    //SQL文
    //引数に回線種別がない場合、あるいは0（解約や付属品）の場合、発注種別がS（移行）の場合
    {
        telno = str_replace("-", "", telno);
        var sql_str = "SELECT telno, cirid FROM tel_tb WHERE telno='" + telno + "' AND pactid=" + pactid + " AND carid=" + carid;
        var H_exist = GLOBALS.GO_db.getHash(sql_str);

        if (cirid == "" || cirid == "0" || type == "S") //回線種別で判別できる場合
            {
                if (H_exist.length > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
            for (var key in H_exist) {
                var value = H_exist[key];

                if (value.cirid == cirid) {
                    return true;
                }
            }
        }

        return false;
    }

    telCirCheck(telno, pactid, carid) //ハイフンあったら取る
    //SQL文
    {
        telno = str_replace("-", "", telno);
        var sql_str = "SELECT telno,cirid FROM tel_tb WHERE telno='" + telno + "' AND pactid=" + pactid + " AND carid=" + carid;
        var H_exist = GLOBALS.GO_db.getRowHash(sql_str);

        if (H_exist.telno != "") {
            return true;
        } else {
            return false;
        }
    }

    secureExist(telno, pactid, carid, table = "secure_tb") //ハイフンあったら取る
    //SQL文
    {
        telno = str_replace("-", "", telno);
        var sql_str = "SELECT telno FROM " + table + " WHERE telno='" + telno + "' AND pactid=" + pactid + " AND carid=" + carid;
        var sectel = GLOBALS.GO_db.getOne(sql_str);

        if (sectel != "") {
            return true;
        } else {
            return false;
        }
    }

    chkSecureUser(pactid, user_id, telno = "") //SQL文
    //pactidやtelnoを条件に入れていたが、セキュアのuser_idはそれ自体でユニークなので修正 20060927miya
    //        $sql_str = "SELECT user_id FROM secure_tb WHERE pactid=". $pactid . " AND user_id='" . $user_id . "' ";
    //        if ($telno != "") {
    //        	$sql_str.= "AND telno != '" . $telno . "'";
    //        }
    {
        var sql_str = "SELECT user_id FROM secure_tb WHERE user_id='" + user_id + "' ";
        var result = GLOBALS.GO_db.getOne(sql_str);

        if (result != "") {
            return true;
        } else {
            return false;
        }
    }

    chkIPPhone(pactid, carid, ip_phone_number, telno = "") //SQL文
    {
        var sql_str = "SELECT ip_phone_number FROM secure_tb WHERE pactid=" + pactid + " AND carid=" + carid + " AND ip_phone_number='" + ip_phone_number + "'";

        if (telno != "") {
            sql_str += " AND telno !='" + telno + "'";
        }

        var result = GLOBALS.GO_db.getOne(sql_str);

        if (result != "") {
            return true;
        } else {
            return false;
        }
    }

    getSecTelNum(H_sectels) //セキュア電話台数
    //セキュア電話台数（使用中）
    //セキュアコール（IP電話）台数
    //セキュアコール（IP電話）台数（使用中）
    {
        var secnum = 0;
        var secnum_use = 0;
        var ipnum = 0;
        var ipnum_use = 0;

        for (var key in H_sectels) {
            var val = H_sectels[key];

            if (val.status != undefined) {
                secnum++;

                if (val.status == 1 || val.status == 2) {
                    secnum_use++;
                }

                if (val.ip_status != undefined) {
                    ipnum++;

                    if (val.ip_status == 1) {
                        ipnum_use++;
                    }
                }
            }
        }

        return {
            secnum: secnum,
            secnum_use: secnum_use,
            ipnum: ipnum,
            ipnum_use: ipnum_use
        };
    }

    adjustdate(y, m, d, hr = "00:00") {
        var timestamp = mktime(hr, 0, 0, m, d, y);
        timestamp = date("Y-m-d H:i:s", timestamp);
        return timestamp;
    }

};