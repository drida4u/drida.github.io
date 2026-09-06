path = "courses.html"
with open(path, encoding='utf-8') as f:
    c = f.read()

old = """    .course-poster {
      width: 200px;
      min-width: 200px;
      max-width: 200px;
      flex-shrink: 0;
      height: auto;
      object-fit: contain;
      display: block;
      background: var(--paper);
      border-right: 1px solid var(--line-soft);
      /* align-self:start above stops grid's default stretch from
         inflating this box past the image's own height — that stretch
         is what was letterboxing shorter posters with peach bands. */
    }"""
assert old in c, "old block not found"

new = """    .course-poster {
      width: 200px;
      min-width: 200px;
      max-width: 200px;
      height: 260px;
      flex-shrink: 0;
      object-fit: cover;
      object-position: center top;
      display: block;
      background: var(--paper);
      border-right: 1px solid var(--line-soft);
    }"""

c = c.replace(old, new)
with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print("ok")
