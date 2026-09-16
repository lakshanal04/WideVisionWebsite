"""Validate the static site's actual routes and semantic invariants; stdlib only."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
PAGES = ("index.html", "services.html", "about.html", "contact.html")


class Document(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids = set()
        self.references = []
        self.counts = {"h1": 0, "main": 0}
        self.current = []
        self.feed(text)

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag in self.counts:
            self.counts[tag] += 1
        if "id" in attrs:
            assert attrs["id"] not in self.ids, f"Duplicate id: {attrs['id']}"
            self.ids.add(attrs["id"])
        for key in ("href", "src"):
            if attrs.get(key):
                self.references.append(attrs[key])
        if attrs.get("aria-current") == "page":
            self.current.append(attrs.get("href"))
        if tag == "img":
            assert "alt" in attrs, "Image missing alt attribute"


documents = {name: Document((ROOT / name).read_text()) for name in PAGES}
for name, document in documents.items():
    assert document.counts == {"h1": 1, "main": 1}, f"{name}: invalid landmarks"
    assert document.current == [name], f"{name}: wrong active navigation"
    for reference in document.references:
        url = urlsplit(reference)
        if url.scheme or url.netloc:
            continue
        target = unquote(url.path) or name
        assert (ROOT / target).is_file(), f"{name}: missing file {target}"
        if url.fragment and target in documents:
            assert url.fragment in documents[target].ids, f"{name}: broken fragment {reference}"
    print(f"PASS {name}: landmarks, active navigation, image labels, local links and assets")
assert 'url=index.html' in (ROOT / "main.html").read_text(), "Legacy homepage redirect missing"
print("PASS main.html: legacy homepage compatibility")
