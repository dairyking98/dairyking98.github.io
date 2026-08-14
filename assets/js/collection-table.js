/* Click-to-sort for the /collections/ inventory tables.
 *
 * Progressive enhancement: the table is fully readable without this file, in
 * the order the data file happens to be in (chronological, for typewriters).
 * This only reorders existing rows — nothing is fetched, nothing is hidden.
 *
 * Sorting rules that matter for this data:
 *   - Missing values (rendered as an em dash) always sort last, in both
 *     directions. A machine with no year recorded is not "older than 1890";
 *     it's unknown, and burying it at the bottom either way is honest.
 *   - Values are compared numerically when every present value in the column
 *     parses as a leading number. That covers years given as ranges
 *     ("1901-07" sorts as 1901) and pitch written as a pair ("10/12" -> 10).
 *   - Everything else compares as text, case- and accent-insensitively, with
 *     numeric collation so serial "A-9" precedes "A-10".
 */
(function () {
  "use strict";

  var PLACEHOLDER = /^[—–-]$/;
  var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

  function cellText(row, index) {
    var cell = row.children[index];
    return cell ? cell.textContent.trim() : "";
  }

  function isMissing(text) {
    return text === "" || PLACEHOLDER.test(text);
  }

  /* A column is numeric only if every value that is actually present parses
   * as a leading number. One stray text value and we fall back to text, which
   * is the safe direction — sorting text numerically would drop information,
   * whereas sorting numbers as text merely looks odd. */
  function numericParser(rows, index) {
    var seen = false;
    for (var i = 0; i < rows.length; i++) {
      var text = cellText(rows[i], index);
      if (isMissing(text)) continue;
      if (!/^-?\d+(\.\d+)?/.test(text)) return null;
      seen = true;
    }
    return seen ? function (text) { return parseFloat(text); } : null;
  }

  function sortRows(tbody, index, ascending) {
    var rows = Array.prototype.slice.call(tbody.rows);
    var toNumber = numericParser(rows, index);

    rows.sort(function (a, b) {
      var textA = cellText(a, index);
      var textB = cellText(b, index);
      var missingA = isMissing(textA);
      var missingB = isMissing(textB);

      // Unknowns sink to the bottom regardless of direction.
      if (missingA && missingB) return 0;
      if (missingA) return 1;
      if (missingB) return -1;

      var result = toNumber
        ? toNumber(textA) - toNumber(textB)
        : collator.compare(textA, textB);
      return ascending ? result : -result;
    });

    // Re-appending a node moves it; no need to detach the old rows first.
    var fragment = document.createDocumentFragment();
    rows.forEach(function (row) { fragment.appendChild(row); });
    tbody.appendChild(fragment);
  }

  function enhance(table) {
    var tbody = table.tBodies[0];
    if (!tbody || tbody.rows.length < 2) return;
    var headers = Array.prototype.slice.call(table.tHead.rows[0].cells);

    headers.forEach(function (header, index) {
      var button = header.querySelector(".collection-table__sort");
      if (!button) return; // the image column has no button

      button.addEventListener("click", function () {
        var ascending = header.getAttribute("aria-sort") !== "ascending";

        headers.forEach(function (other) {
          if (other.hasAttribute("aria-sort")) other.setAttribute("aria-sort", "none");
        });
        header.setAttribute("aria-sort", ascending ? "ascending" : "descending");

        sortRows(tbody, index, ascending);
      });
    });

    table.classList.add("is-sort-ready");
  }

  function init() {
    document.querySelectorAll("table.is-sortable").forEach(enhance);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
