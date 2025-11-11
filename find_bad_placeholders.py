#!/usr/bin/env python3
"""
Find all placeholder pages and check if their corresponding typewriters have serial numbers.
"""

import yaml
from pathlib import Path

# Read YAML file
with open('_data/typewriters.yml', 'r', encoding='utf-8') as f:
    typewriters = yaml.safe_load(f)

# Create lookup by slug
typewriter_lookup = {tw.get('slug'): tw for tw in typewriters}

# Check typewriters directory
typewriters_dir = Path('_typewriters')
placeholder_files = list(typewriters_dir.glob('*.md'))

print(f"Found {len(placeholder_files)} placeholder pages")
print("Checking each one for required fields...")
print("=" * 70)

issues = []
for pf in placeholder_files:
    slug = pf.stem
    tw = typewriter_lookup.get(slug)
    
    if not tw:
        print(f"WARNING: Placeholder page {slug}.md has no matching typewriter in YAML")
        continue
    
    manufacturer = tw.get('manufacturer', '')
    model = tw.get('model', '')
    serial_number = tw.get('serial_number', '')
    blog_post = tw.get('blog_post', '')
    
    # Check if has blog post (shouldn't have placeholder)
    if blog_post and str(blog_post).strip():
        issues.append({
            'slug': slug,
            'issue': 'has blog post but placeholder exists',
            'blog_post': blog_post
        })
        continue
    
    # Check required fields
    manufacturer_ok = bool(manufacturer and str(manufacturer).strip())
    model_ok = bool(model and str(model).strip())
    serial_ok = bool(serial_number and str(serial_number).strip())
    
    if not manufacturer_ok:
        issues.append({
            'slug': slug,
            'issue': 'missing manufacturer',
            'manufacturer': repr(manufacturer)
        })
    if not model_ok:
        issues.append({
            'slug': slug,
            'issue': 'missing model',
            'model': repr(model)
        })
    if not serial_ok:
        issues.append({
            'slug': slug,
            'issue': 'missing serial number',
            'serial_number': repr(serial_number),
            'manufacturer': manufacturer,
            'model': model
        })

if issues:
    print(f"\nFound {len(issues)} issues:\n")
    for issue in issues:
        print(f"Slug: {issue['slug']}")
        print(f"  Issue: {issue['issue']}")
        if 'manufacturer' in issue:
            print(f"  Manufacturer: {issue.get('manufacturer', 'N/A')}")
        if 'model' in issue:
            print(f"  Model: {issue.get('model', 'N/A')}")
        if 'serial_number' in issue:
            print(f"  Serial Number: {issue.get('serial_number', 'N/A')}")
        if 'blog_post' in issue:
            print(f"  Blog Post: {issue.get('blog_post', 'N/A')}")
        print()
else:
    print("\nAll placeholder pages are valid - they all have manufacturer, model, and serial_number")

