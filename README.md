# leonardchau.com

Personal portfolio and blog for Leonard Chau — mechanical engineer, maker, and researcher.

Built with [Jekyll](https://jekyllrb.com/) and the [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) theme, hosted on GitHub Pages.

## Local development

```bash
bundle install
bundle exec jekyll serve
```

Site will be available at `http://localhost:4000`.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the Jekyll site and publishes it to the `gh-pages` branch.
