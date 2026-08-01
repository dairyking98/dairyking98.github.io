#!/bin/bash
export PATH="$HOME/.local/share/gem/ruby/3.2.0/bin:$PATH"
bundle exec jekyll serve --livereload --host 0.0.0.0
