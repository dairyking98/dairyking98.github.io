#!/usr/bin/env python3
"""
Check which placeholder pages were created for typewriters without serial numbers.
"""

import yaml
from pathlib import Path

# Read YAML file
with open('_data/typewriters.yml', 'r', encoding='utf-8') as f:
    typewriters = yaml.safe_load(f)

# Check which typewriters have placeholder pages but are missing serial numbers
typewriters_dir = Path('_typewriters')
placeholder_files = {f.stem for f in typewriters_dir.glob('*.md') if f.is_file()}

print("Typewriters without serial numbers that have placeholder pages:")
print("=" * 70)

issues = []
for tw in typewriters:
    slug = tw.get('slug', '')
    manufacturer = tw.get('manufacturer', '')
    model = tw.get('model', '')
    serial_number = tw.get('serial_number', '')
    blog_post = tw.get('blog_post', '')
    
    # Skip if has blog post
    if blog_post and str(blog_post).strip():
        continue
    
    # Check if placeholder page exists
    if slug in placeholder_files:
        # Check if missing serial number
        serial_str = str(serial_number).strip() if serial_number else ''
        if not serial_str:
            issues.append({
                'slug': slug,
                'manufacturer': manufacturer,
                'model': model,
                'serial_number': serial_number,
                'has_manufacturer': bool(manufacturer and str(manufacturer).strip()),
                'has_model': bool(model and str(model).strip()),
                'has_serial': bool(serial_str)
            })

if issues:
    for issue in issues:
        print(f"Slug: {issue['slug']}")
        print(f"  Manufacturer: '{issue['manufacturer']}' (has: {issue['has_manufacturer']})")
        print(f"  Model: '{issue['model']}' (has: {issue['has_model']})")
        print(f"  Serial Number: '{issue['serial_number']}' (has: {issue['has_serial']})")
        print()
    print(f"Total: {len(issues)} typewriters without serial numbers have placeholder pages")
else:
    print("No issues found - all placeholder pages have serial numbers")

