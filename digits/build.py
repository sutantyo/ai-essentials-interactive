# Inlines weights.json into template.html so the page works from any static host (or straight from disk).
import pathlib
here = pathlib.Path(__file__).parent
out = here.parent / "slides/public/digits/index.html"
out.write_text((here / "template.html").read_text().replace("__WEIGHTS__", (here.parent / "slides/public/models/trained.json").read_text()))
print("wrote", out)
