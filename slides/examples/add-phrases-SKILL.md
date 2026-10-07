---
name: add-phrases
description: Add Japanese phrases for a travel situation to the phrasebook, written the way Daniel likes them. Use when asked for phrases for a situation ("phrases for checking into a hotel", "add some phrases for the train") or asked to add specific phrases.
---

# Add phrases for a situation

## 1. Check what's already there

Run `npm run phrase -- collections`, then `npm run phrase -- list --search <keyword>` for the situation's key words.

The command only refuses exact duplicates, so look for **similar** phrases yourself: the same meaning in other
words, or very close in English or Japanese. Search for the key words of each phrase you plan to add
(English, Japanese and romaji), not just the situation.

## 2. Write the phrases

Unless asked for a number, write 3 to 6 phrases a traveller would actually need in that situation.

- **Polite form** (です / ます). I'm a stranger asking for help.
- **Short.** Something I can say in one breath at a counter. Split long ideas into two phrases.
- **Japanese as a native speaker would write it**, with normal kanji and kana.
  Questions end with 「？」 and everything else with 「。」, like the phrases already in the book.
- **Romaji in Hepburn with macrons**: Kyōto, arigatō, menyū. Sentence case, with the same end punctuation as the Japanese.
- **English** says what I mean, in plain natural English.

## 3. Pick the collection

One collection per situation, with a short English name in title case ("Hotel", "Trains", "Pharmacy").
Reuse an existing collection if one fits.

## 4. Show me first

Show the phrases as a table (English, Japanese, romaji) and wait for my OK before adding anything.

If any new phrase is similar to one already in the phrasebook, list those separately under the table: the new
phrase, the existing one with its id, and how they differ. Ask me about each one: add it anyway, or skip it.
Don't add a similar phrase unless I say so; a general OK on the table doesn't cover it.

## 5. Add them

Use one `import`, one phrase per line, in the format `japanese | english | romaji`:

```bash
npm run phrase -- import --collection "Hotel" <<'EOF'
チェックインをお願いします。 | I'd like to check in, please. | Chekku-in o onegai shimasu.
EOF
```

Then tell me what was added and what was skipped. The command refuses duplicates by itself.

## Never

- Delete anything, or try to. There is no delete, on purpose.
- Run `npm run demo:reset` (that's for Daniel), or touch `data/phrasebook.db` directly.
