#!/usr/bin/env python3
"""
Create placeholder pages for typewriters without blog posts.
"""

import yaml
from pathlib import Path

def create_placeholder_pages(yaml_path, output_dir):
    """Create placeholder pages for typewriters without blog posts."""
    # Read YAML file
    with open(yaml_path, 'r', encoding='utf-8') as f:
        typewriters = yaml.safe_load(f)
    
    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Create placeholder pages for typewriters without blog posts
    # Only create pages for typewriters with manufacturer, model, AND serial_number
    created_count = 0
    skipped_count = 0
    for tw in typewriters:
        blog_post = tw.get('blog_post', '')
        slug = tw.get('slug', '')
        manufacturer = tw.get('manufacturer', '')
        model = tw.get('model', '')
        serial_number = tw.get('serial_number', '')
        
        # Skip if blog post exists or no slug
        if blog_post and blog_post.strip():
            continue
        if not slug:
            skipped_count += 1
            continue
        
        # Validate required fields: manufacturer, model, AND serial_number must be present and non-empty
        # Also reject serial_number if it's '???' (unknown)
        if not manufacturer or not str(manufacturer).strip():
            skipped_count += 1
            continue
        if not model or not str(model).strip():
            skipped_count += 1
            continue
        serial_str = str(serial_number).strip() if serial_number else ''
        if not serial_str or serial_str == '???':
            skipped_count += 1
            continue
        
        # Create placeholder page
        page_path = output_path / f"{slug}.md"
        
        # Generate page content
        content = "---\n"
        content += "layout: page\n"
        content += f"title: {tw.get('manufacturer', '')} {tw.get('model', '')}\n"
        if tw.get('year') and str(tw.get('year')).strip():
            content += f"description: {tw.get('manufacturer', '')} {tw.get('model', '')} ({tw.get('year', '')}) typewriter details.\n"
        else:
            content += f"description: {tw.get('manufacturer', '')} {tw.get('model', '')} typewriter details.\n"
        content += "img: assets/img/12.jpg\n"
        content += f"permalink: /typewriters/{slug}/\n"
        content += "collection: typewriters\n"
        content += "---\n\n"
        
        # Add typewriter information
        content += f"## {tw.get('manufacturer', '')} {tw.get('model', '')}\n\n"
        if tw.get('year') and str(tw.get('year')).strip():
            content += f"**Year:** {tw.get('year', '')}\n\n"
        if tw.get('serial_number') and str(tw.get('serial_number')).strip():
            content += f"**Serial Number:** {tw.get('serial_number', '')}\n\n"
        if tw.get('color') and str(tw.get('color')).strip():
            content += f"**Color:** {tw.get('color', '')}\n\n"
        if tw.get('typeface') and str(tw.get('typeface')).strip():
            content += f"**Typeface:** {tw.get('typeface', '')}\n\n"
        if tw.get('portable_manual') and str(tw.get('portable_manual')).strip():
            content += f"**Type:** {tw.get('portable_manual', '')}\n\n"
        if tw.get('standard_portable') and str(tw.get('standard_portable')).strip():
            content += f"**Standard/Portable:** {tw.get('standard_portable', '')}\n\n"
        if tw.get('date_of_acquisition') and str(tw.get('date_of_acquisition')).strip():
            content += f"**Date Acquired:** {tw.get('date_of_acquisition', '')}\n\n"
        if tw.get('status') and str(tw.get('status')).strip():
            content += f"**Status:** {tw.get('status', '')}\n\n"
        if tw.get('notes') and str(tw.get('notes')).strip():
            content += f"**Notes:** {tw.get('notes', '')}\n\n"
        
        content += "---\n\n"
        content += "*This is a placeholder page. A detailed blog post about this typewriter may be added in the future.*\n"
        
        # Write file
        with open(page_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        created_count += 1
    
    print(f"Created {created_count} placeholder pages in {output_dir}")
    print(f"Skipped {skipped_count} typewriters (missing required fields or have blog posts)")
    return created_count

if __name__ == '__main__':
    yaml_path = '_data/typewriters.yml'
    output_dir = '_typewriters'
    
    create_placeholder_pages(yaml_path, output_dir)

