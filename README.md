# nikitakaraevv.github.io

Personal website, built with [Jekyll](https://jekyllrb.com/) and deployed on GitHub Pages.
No CSS framework, no jQuery: one hand-written stylesheet (`css/style.css`) and one small script (`js/main.js`).

## Editing content

| What | Where |
| --- | --- |
| Name, bio, links, analytics | `_config.yml` |
| News items | `_data/news.yml` |
| Publications | `_data/publications.yml` |
| Co-authors (name + website) | `_data/authors.yml` |
| Teaser videos + poster frames | `images/*.mp4`, `images/posters/*.jpg` |

A publication needs an `image` (mp4 in `images/`) and a matching poster JPEG in `images/posters/` with the same base name.
Generate a poster with ffmpeg:

```bash
ffmpeg -ss 1 -i images/NAME.mp4 -frames:v 1 -vf scale=640:-2 -q:v 4 images/posters/NAME.jpg
```

## Local preview

```bash
bundle install
bundle exec jekyll serve --livereload   # http://127.0.0.1:4000
```

## Credits

Originally based on [keunhong.github.io](https://github.com/keunhong/keunhong.github.io) (CC BY-SA 4.0), since rewritten.

## License

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
