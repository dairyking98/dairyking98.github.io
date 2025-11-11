#!/usr/bin/env python3
"""
Check typewriters with ??? as serial number that have placeholder pages.
"""

import yaml
from pathlib import Path

# Read YAML file
with open('_data/typewriters.yml', 'r', encoding='utf-8') as f:
    typewriters = yaml.safe_load(f)

# Check typewriters directory
typewriters_dir = Path('_typewriters')
placeholder_files = {f.stem for f in typewriters_dir.glob('*.md') if f.is_file()}

# Find typewriters with ??? or empty serial numbers that have placeholder pages
issues = []
for tw in typewriters:
    slug = tw.get('slug', '')
    manufacturer = tw.get('manufacturer', '')
    model = tw.get('model', '')
    serial_number = str(tw.get('serial_number', '')).strip()
    blog_post = tw.get('blog_post', '')
    
    # Skip if has blog post
    if blog_post and str(blog_post).strip():
        continue
    
    # Check if placeholder exists
    has_placeholder = slug in placeholder_files
    
    # Check if serial number is invalid (empty or ???)
    is_invalid_serial = not serial_number or serial_number == '???'
    
    if is_invalid_serial and has_placeholder:
        issues.append({
            'slug': slug,
            'manufacturer': manufacturer,
            'model': model,
            'serial_number': tw.get('serial_number', ''),
        })

if issues:
    print(f"Found {len(issues)} typewriters with invalid serial numbers that have placeholder pages:\n")
    for issue in issues:
        print(f"  {issue['manufacturer']} {issue['model']}")
        print(f"    Slug: {issue['slug']}")
        print(f"    Serial Number: '{issue['serial_number']}'")
        print()
else:
    print("No issues found - all placeholder pages have valid serial numbers")

