# Build Performance Optimization Guide

## Why Builds Are Slow (~233 seconds)

Your Jekyll build takes a long time due to several factors:

**Note:** If you're building on GitHub Actions, see the [GitHub Actions Optimization](#github-actions-optimization) section below.

### 1. **External API Calls** ⏱️ **MAJOR IMPACT**

- `external-posts.rb` fetches RSS feeds and scrapes external URLs
- `google-scholar-citations.rb` makes HTTP requests with 1.5-3.5 second delays
- `inspirehep-citations.rb` makes API calls with 5-second timeouts
- **Impact**: Network latency adds significant time to builds

### 2. **ImageMagick Processing** 🖼️

- Processes all images in `assets/img/`
- Generates multiple WebP versions at different widths (480, 800, 1400px)
- **Impact**: CPU-intensive image processing

### 3. **Many Plugins** 🔌

- 20+ Jekyll plugins running during build
- Each plugin processes content, which adds overhead

### 4. **External Sources** 📡

- Configured in `_config.yml` to fetch RSS feeds during build
- Scrapes external URLs for content

## Quick Fixes for Faster Builds

### Option 1: Use Fast Build Script (Recommended for Development)

```batch
build-fast.bat
```

- Uses incremental builds (only processes changed files)
- Skips some slow operations
- Much faster for development

### Option 2: Disable Slow Features Temporarily

1. **Disable ImageMagick** (biggest win for image-heavy sites):
   In `_config.yml`, change:

   ```yaml
   imagemagick:
     enabled: false # Change from true to false
   ```

2. **Disable External Sources**:
   In `_config.yml`, comment out or remove:

   ```yaml
   external_sources:
     # - name: medium.com
     #   rss_url: https://medium.com/@al-folio/feed
   ```

3. **Use Incremental Builds**:
   ```batch
   bundle exec jekyll build --incremental
   ```
   Only rebuilds changed files (much faster on subsequent builds)

### Option 3: Use Development Config Override

```batch
bundle exec jekyll build --config _config.yml,_config_dev.yml
```

This uses `_config_dev.yml` to override settings and disable slow features.

## Production vs Development Builds

- **Development**: Use `build-fast.bat` or incremental builds
- **Production**: Use `build.bat` for full build with all features

## Further Optimization Tips

1. **Skip External Sources During Development**:

   - Only enable external sources when you need them
   - Consider fetching external content manually and caching it

2. **Optimize Images Before Build**:

   - Pre-process images outside of Jekyll
   - Use optimized formats (WebP) before adding to repository

3. **Reduce Plugin Count**:

   - Disable unused plugins in `_config.yml`
   - Review if all plugins are necessary

4. **Use Jekyll Incremental Builds**:

   ```batch
   bundle exec jekyll build --incremental --watch
   ```

   Watch mode with incremental builds for fastest development

5. **Consider Parallel Builds** (Advanced):
   - Some plugins can be parallelized
   - Consider splitting large collections

## Expected Build Times

- **Full build**: ~233 seconds (current)
- **Fast build** (no ImageMagick, no external sources): ~30-60 seconds
- **Incremental build** (after first build): ~5-15 seconds
- **Incremental build with watch**: ~1-5 seconds per change

## GitHub Actions Optimization

If you're building on GitHub Actions, the main time consumers are:

### Current Workflow Issues:

1. **`apt-get update`** takes ~10-15 seconds (installing ImageMagick)
2. **External API calls** (RSS feeds, citations) add network latency
3. **ImageMagick processing** is CPU-intensive
4. **No caching** for ImageMagick installation

### Optimizations Applied:

I've updated `.github/workflows/deploy.yml` with:

- Faster `apt-get` updates (`-qq` flag for quiet)
- Option to disable external sources via environment variable
- Better error handling and verbose output

### Use Fast Workflow:

A new optimized workflow file `.github/workflows/deploy-fast.yml` is available with:

- **Cached ImageMagick installation** (saves ~15 seconds on subsequent builds)
- **Automatic disabling of external sources** (removes network calls)
- **Optimized package installation**

To use it, either:

1. Rename `deploy-fast.yml` to `deploy.yml` to replace the current workflow
2. Or keep both and use `deploy-fast.yml` for faster development builds

### Expected GitHub Actions Build Times:

- **Current workflow**: ~233 seconds
- **Optimized workflow** (no external sources, cached ImageMagick): ~60-90 seconds
- **After first build** (with caching): ~45-70 seconds

### Additional GitHub Actions Tips:

1. **Skip ImageMagick if not needed**:

   - If you don't need responsive images, disable ImageMagick entirely
   - Edit the workflow to remove ImageMagick installation

2. **Use Matrix Strategy** (for parallel builds):

   - Build multiple pages/collections in parallel if your site is very large

3. **Cache Jekyll dependencies**:

   - Already enabled via `bundler-cache: true`
   - This saves ~10-20 seconds per build

4. **Disable external sources in CI**:
   - External sources add network latency
   - Consider fetching them manually or using a separate job

## Troubleshooting

If builds are still slow after optimizations:

1. Check network connectivity (external API calls)
2. Verify ImageMagick is actually disabled
3. Check Jekyll verbose output: `bundle exec jekyll build --verbose`
4. Profile specific plugins that might be slow
5. **For GitHub Actions**: Check Actions logs to identify slowest step
6. **For GitHub Actions**: Enable verbose mode to see what's taking time
