export default function preg_match_all(pattern, subject, flags) {
    var recs, re, lines, parts, i, j, lines_length, parts_length;
    recs = [];
    re = new RegExp(pattern, "gm");
    lines = subject.match(re);
    re = new RegExp(pattern, "");
    lines_length = lines.length;
    for (i = 0; i < lines_length; i++) {
      parts = lines[i].match(re);
      parts_length = parts.length;
      if (flags === "PREG_PATTERN_ORDER" || flags === "") {
        for (j = 0; j < parts_length; j++) {
          if (typeof (recs[j]) === "undefined") {
            recs[j] = [];
          }
          recs[j][i] = parts[j];
        }
      } else if (flags === "PREG_SET_ORDER") {
        recs[i] = [];
        for (j = 0; j < parts_length; j++) {
          recs[i][j] = parts[j];
        }
      }
    }
    return recs;
  }