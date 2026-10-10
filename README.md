# The Unread Book

A dependency-free interactive browser story. No install or build step is required.

## Run locally

From this folder, start a local web server:

```powershell
py -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in a browser.

If the `py` launcher is unavailable, use `python -m http.server 8000` instead.

## Test checklist

1. Open the game and click **Restart** to begin from a clean save.
2. Click the four flowers, then the mossy stone; enter `moon` in its puzzle.
3. Follow the library route and confirm the scene changes, Journal opens, and hints work.
4. Open `http://localhost:8000/editor.html`, make a harmless text change, click **Publish to the game**, then refresh the game to confirm it persists.
5. Use **Export JSON**, then **Import JSON**, to verify story backups restore correctly.

Progress and editor content are intentionally stored in the browser's local storage. Use **Reset progress** or **Restore default story** in the editor to clear them.
