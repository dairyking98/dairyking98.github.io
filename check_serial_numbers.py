#!/usr/bin/env python3
"""
Check all typewriters and their serial numbers.
"""

import yaml
from pathlib import Path

# Read YAML file
with open('_data/typewriters.yml', 'r', encoding='utf-8') as f:
    typewriters = yaml.safe_load(f)

# Check typewriters directory
typewriters_dir = Path('_typewriters')
placeholder_files = {f.stem: f for f in typewriters_dir.glob('*.md') if f.is_file()}

print("Checking typewriters with empty or missing serial numbers:")
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
    
    # Check serial number
    serial_str = str(serial_number).strip() if serial_number is not None else ''
    has_serial = bool(serial_str and serial_str != '')
    
    # Check if placeholder exists
    has_placeholder = slug in placeholder_files
    
    # If no serial but has placeholder, that's an issue
    if not has_serial and has_placeholder:
        issues.append({
            'slug': slug,
            'manufacturer': manufacturer,
            'model': model,
            'serial_number': repr(serial_number),
            'serial_str': serial_str,
            'has_placeholder': has_placeholder
        })

if issues:
    print(f"Found {len(issues)} typewriters without serial numbers that have placeholder pages:\n")
    for issue in issues:
        print(f"Slug: {issue['slug']}")
        print(f"  Manufacturer: '{issue['manufacturer']}'")
        print(f"  Model: '{issue['model']}'")
        print(f"  Serial Number (raw): {issue['serial_number']}")
        print(f"  Serial Number (stripped): '{issue['serial_str']}'")
        print(f"  Has Placeholder: {issue['has_placeholder']}")
        print()
else:
    print("No typewriters without serial numbers have placeholder pages.")
    print("\nChecking all typewriters without serial numbers:")
    print("-" * 70)
    no_serial = [tw for tw in typewriters if not str(tw.get('serial_number', '')).strip() and not (tw.get('blog_post') and str(tw.get('blog_post')).strip())]
    for tw in no_serial[:10]:  # Show first 10
        print(f"  {tw.get('manufacturer')} {tw.get('model')} - slug: {tw.get('slug')} - serial: '{tw.get('serial_number')}'")
    print(f"\nTotal typewriters without serial numbers: {len(no_serial)}")

