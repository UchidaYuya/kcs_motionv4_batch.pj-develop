//admin_docomo_web$B$N%m%0:o=|%P%C%A!#(B
///kcs_db/log/dl_docomo$B$N%m%0$r:o=|$9$k(B($B8=:_$h$j#2%v7nA0$N%m%0$,BP>](B)
//20151026 $B0KC#:n@.(B
//$B%G%#%l%/%H%j:o=|4X?t$@$h(B
//$B$3$3$+$i%a%$%s=hM}(B
//$B%G%#%l%/%H%j0lMw$N<hF@(B
//$B:o=|$9$k$Y$-%G%#%l%/%H%j$+H=Dj$7$F$$$/$h(B

require("../conf/batch_setting.php");

const LOG_DIR = KCS_DIR + "/log/dl_docomo";

function delete_directory(directory) //$B:G8e$K%G%#%l%/%H%j:o=|(B
{
	var dirs = scandir(directory);

	for (var dir of Object.values(dirs)) {
		if (dir == ".") continue;
		if (dir == "..") continue;
		var temp = directory + "/" + dir;

		if (is_dir(temp)) //$B%G%#%l%/%H%j$N>l9g$O:F5"(B
			{
				delete_directory(temp);
			} else //$B%U%!%$%k$N>l9g$O:o=|(B
			{
				unlink(temp);
			}
	}

	rmdir(directory);
};

var dirs = scandir(LOG_DIR);

for (var dir of Object.values(dirs)) //$B%G%#%l%/%H%j$+H=CG$9$k(B
//$B#2%v7n0JA0$N%G%#%l%/%H%j$+H=Dj$9$k(B
{
	if (is_dir(LOG_DIR + "/" + dir) == false) continue;
	if (dir.length != 6) continue;
	if (!is_numeric(dir)) continue;
	var year = dir.substr(0, 4);
	var month = dir.substr(4, 2);
	var now = Date.now() / 1000;
	var dir_time = mktime(0, 0, 0, month + 2, 1, year);
	if (dir_time > now) continue;
	delete_directory(LOG_DIR + "/" + dir);
}