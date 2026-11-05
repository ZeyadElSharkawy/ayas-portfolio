# Proxima Nova

These four files are **Fontspring demo cuts** (`Fontspring-DEMO-proximanova-*.otf`), renamed.

- They contain only the 97 basic ASCII characters. Curly quotes, en and em dashes, the middle dot, arrows and accented letters are missing.
- The digit 4 and these symbols are replaced by a watermark glyph: `! " # $ % & ' ( ) * + - / < = > @ [  ] ^ _ ` { | } ~`.
- So `app/layout.tsx` limits them with `unicode-range` to letters, the other digits, space and `, . : ; ?`. Montserrat supplies everything else, which means the digit 4 and symbols visibly differ.
- Demo fonts are for evaluation. Check the licence at http://www.marksimonson.com/info/licenses and buy a web licence before the site goes public.

To upgrade, replace these files with the licensed versions, keeping the same names (update the paths in `app/layout.tsx` if the format changes to `.woff2`). Then remove the `declarations` line and the Montserrat fallback.
