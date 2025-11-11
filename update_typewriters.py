#!/usr/bin/env python3
"""
Update typewriter data from CSV master file.
Compares with existing YAML, updates only changed files, creates new ones,
and notifies user of duplicates and differences.
"""

import pandas as pd
import yaml
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple, Any
from collections import defaultdict

def slugify(text):
    """Convert text to URL-friendly slug."""
    if pd.isna(text):
        return ""
    # Convert to string, lowercase, replace spaces and special chars with hyphens
    slug = str(text).lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')

def generate_slug(row):
    """Generate slug from manufacturer, model, and serial_number."""
    parts = []
    manufacturer = row.get('manufacturer', '')
    model = row.get('model', '')
    serial_number = row.get('serial_number', '')
    
    if manufacturer and str(manufacturer).strip():
        parts.append(slugify(manufacturer))
    if model and str(model).strip():
        parts.append(slugify(model))
    if serial_number and str(serial_number).strip() and str(serial_number).strip() != '???':
        serial_str = str(serial_number).strip()
        parts.append(slugify(serial_str))
    
    return '-'.join(filter(None, parts))

def normalize_value(value):
    """Normalize a value for comparison (handle empty strings, None, etc.)."""
    if pd.isna(value) or value is None:
        return ""
    if isinstance(value, (int, float)):
        # Convert numeric year to string for comparison
        if isinstance(value, float) and value.is_integer():
            return str(int(value))
        return str(value)
    return str(value).strip()

def normalize_typewriter(tw: Dict) -> Dict:
    """Normalize typewriter dict for comparison."""
    normalized = {}
    for key in ['manufacturer', 'model', 'year', 'serial_number', 'color', 
                'typeface', 'portable_manual', 'date_of_acquisition', 'status', 'notes',
                'standard_portable']:
        normalized[key] = normalize_value(tw.get(key, ''))
    return normalized

def typewriters_equal(tw1: Dict, tw2: Dict) -> bool:
    """Check if two typewriters are equal (ignoring slug and blog_post)."""
    norm1 = normalize_typewriter(tw1)
    norm2 = normalize_typewriter(tw2)
    return norm1 == norm2

def extract_year(year_str):
    """Extract year from string (handle ranges like '1901-07' or single years)."""
    if pd.isna(year_str) or not year_str:
        return ""
    year_str = str(year_str).strip()
    # Try to extract first year from range (e.g., "1901-07" -> 1901)
    match = re.match(r'^(\d{4})', year_str)
    if match:
        try:
            return int(match.group(1))
        except ValueError:
            return ""
    # Try to convert to int
    try:
        return int(float(year_str))
    except (ValueError, TypeError):
        return ""

def read_csv_typewriters(csv_path: Path) -> List[Dict]:
    """Read typewriters from CSV file."""
    df = pd.read_csv(csv_path)
    
    # Map CSV columns to YAML fields
    column_mapping = {
        'manufacturer': ['Typewriter Brand', 'typewriter brand', 'manufacturer'],
        'model': ['Model', 'model'],
        'year': ['Year', 'year'],
        'serial_number': ['Serial No', 'serial no', 'Serial Number', 'serial_number'],
        'color': ['Color', 'color'],
        'typeface': ['Typeface', 'typeface'],
        'portable_manual': ['Electric/Manual', 'electric/manual', 'Electric/Manual'],
        'date_of_acquisition': ['Date Acquired', 'date acquired', 'Date of Acquisition'],
        'status': ['Work Needed', 'work needed', 'Status', 'status'],
        'notes': ['Notes', 'notes', 'Note', 'note'],
        'standard_portable': ['Size', 'size', 'Standard/Portable', 'standard/portable']
    }
    
    # Find actual column names
    actual_columns = {}
    for key, possible_names in column_mapping.items():
        for col in df.columns:
            col_lower = str(col).strip().lower()
            if col_lower in [name.lower() for name in possible_names]:
                actual_columns[key] = col
                break
    
    typewriters = []
    for idx, row in df.iterrows():
        typewriter = {}
        
        # Extract fields
        for key in column_mapping.keys():
            col_name = actual_columns.get(key)
            if col_name and col_name in df.columns:
                value = row[col_name]
                if pd.isna(value):
                    typewriter[key] = ""
                else:
                    if key == 'year':
                        typewriter[key] = extract_year(value)
                    elif key == 'date_of_acquisition':
                        if pd.notna(value):
                            if isinstance(value, pd.Timestamp):
                                typewriter[key] = value.strftime('%Y-%m-%d')
                            else:
                                typewriter[key] = str(value).strip()
                        else:
                            typewriter[key] = ""
                    elif key == 'standard_portable':
                        # Normalize Size column: convert to Standard or Portable
                        if pd.notna(value):
                            size_str = str(value).strip()
                            # Normalize common variations
                            if size_str.lower() in ['portable', 'p']:
                                typewriter[key] = 'Portable'
                            elif size_str.lower() in ['standard', 's', 'desktop']:
                                typewriter[key] = 'Standard'
                            else:
                                # Default to empty if unknown
                                typewriter[key] = ""
                        else:
                            typewriter[key] = ""
                    else:
                        typewriter[key] = str(value).strip()
            else:
                typewriter[key] = ""
        
        # Generate slug
        typewriter['slug'] = generate_slug(typewriter)
        
        # Initialize blog_post (will be preserved from existing data)
        typewriter['blog_post'] = ""
        
        typewriters.append(typewriter)
    
    return typewriters

def read_existing_yaml(yaml_path: Path) -> Tuple[List[Dict], Dict[str, Dict]]:
    """Read existing YAML file and return list and slug-indexed dict."""
    if not yaml_path.exists():
        return [], {}
    
    with open(yaml_path, 'r', encoding='utf-8') as f:
        typewriters = yaml.safe_load(f) or []
    
    # Create slug-indexed dict for quick lookup
    by_slug = {tw.get('slug', ''): tw for tw in typewriters if tw.get('slug')}
    
    return typewriters, by_slug

def compare_typewriters(csv_typewriters: List[Dict], 
                       existing_by_slug: Dict[str, Dict]) -> Dict[str, Any]:
    """Compare CSV typewriters with existing YAML."""
    results = {
        'new': [],  # New typewriters not in existing YAML
        'same': [],  # Typewriters that are identical
        'different': [],  # Typewriters with same slug but different data
        'duplicate_slugs': defaultdict(list),  # Multiple CSV entries with same slug
        'removed': []  # Typewriters in YAML but not in CSV
    }
    
    # Check for duplicate slugs in CSV
    csv_by_slug = defaultdict(list)
    for tw in csv_typewriters:
        slug = tw.get('slug', '')
        if slug:
            csv_by_slug[slug].append(tw)
    
    # Process each CSV typewriter
    processed_slugs = set()
    for tw in csv_typewriters:
        slug = tw.get('slug', '')
        if not slug:
            continue
        
        # Check for duplicates in CSV
        if len(csv_by_slug[slug]) > 1:
            if slug not in processed_slugs:
                results['duplicate_slugs'][slug] = csv_by_slug[slug]
                processed_slugs.add(slug)
            # For duplicates, only process the first occurrence
            # (we'll use the first one, but notify user about all)
            if slug in processed_slugs and tw != csv_by_slug[slug][0]:
                continue
        
        # Check against existing YAML
        if slug in existing_by_slug:
            existing_tw = existing_by_slug[slug]
            # Preserve blog_post from existing data
            tw['blog_post'] = existing_tw.get('blog_post', '')
            
            if typewriters_equal(tw, existing_tw):
                results['same'].append(slug)
            else:
                results['different'].append({
                    'slug': slug,
                    'old': existing_tw,
                    'new': tw
                })
        else:
            results['new'].append(tw)
    
    # Find removed typewriters (in YAML but not in CSV)
    csv_slugs = {tw.get('slug', '') for tw in csv_typewriters if tw.get('slug')}
    for slug, tw in existing_by_slug.items():
        if slug not in csv_slugs:
            results['removed'].append(tw)
    
    return results

def create_placeholder_page(tw: Dict, output_dir: Path) -> bool:
    """Create placeholder page for typewriter if it doesn't have a blog post."""
    blog_post = tw.get('blog_post', '')
    slug = tw.get('slug', '')
    manufacturer = tw.get('manufacturer', '')
    model = tw.get('model', '')
    serial_number = tw.get('serial_number', '')
    
    # Skip if blog post exists
    if blog_post and blog_post.strip():
        return False
    
    # Skip if no slug or missing required fields
    if not slug:
        return False
    if not manufacturer or not str(manufacturer).strip():
        return False
    if not model or not str(model).strip():
        return False
    serial_str = str(serial_number).strip() if serial_number else ''
    if not serial_str or serial_str == '???':
        return False
    
    # Create placeholder page
    page_path = output_dir / f"{slug}.md"
    
    # Generate page content
    content = "---\n"
    content += "layout: page\n"
    content += f"title: {manufacturer} {model}\n"
    if tw.get('year') and str(tw.get('year')).strip():
        content += f"description: {manufacturer} {model} ({tw.get('year', '')}) typewriter details.\n"
    else:
        content += f"description: {manufacturer} {model} typewriter details.\n"
    content += f"permalink: /typewriters/{slug}/\n"
    content += "collection: typewriters\n"
    content += "---\n\n"
    
    # Add typewriter information
    content += f"## {manufacturer} {model}\n\n"
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
    if tw.get('date_of_acquisition') and str(tw.get('date_of_acquisition')).strip():
        content += f"**Date Acquired:** {tw.get('date_of_acquisition', '')}\n\n"
    if tw.get('status') and str(tw.get('status')).strip():
        content += f"**Status:** {tw.get('status', '')}\n\n"
    if tw.get('notes') and str(tw.get('notes')).strip():
        content += f"**Notes:** {tw.get('notes', '')}\n\n"
    
    content += "---\n\n"
    content += "*This is a placeholder page. A detailed blog post about this typewriter may be added in the future.*\n"
    
    # Write file (overwrite if exists, since data might have changed)
    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def generate_json_from_yaml(yaml_path: Path, json_path: Path):
    """Generate JSON file from YAML data for Bootstrap Tables."""
    with open(yaml_path, 'r', encoding='utf-8') as f:
        typewriters = yaml.safe_load(f) or []
    
    json_data = []
    for tw in typewriters:
        item = {
            'manufacturer': tw.get('manufacturer', ''),
            'model': tw.get('model', ''),
            'year': tw.get('year', ''),
            'serial_number': tw.get('serial_number', ''),
            'color': tw.get('color', ''),
            'typeface': tw.get('typeface', ''),
            'portable_manual': tw.get('portable_manual', ''),
            'date_of_acquisition': tw.get('date_of_acquisition', ''),
            'status': tw.get('status', ''),
            'notes': tw.get('notes', ''),
            'standard_portable': tw.get('standard_portable', ''),
        }
        
        # Add link field
        blog_post = tw.get('blog_post', '')
        slug = tw.get('slug', '')
        if blog_post and blog_post.strip():
            item['link'] = blog_post
        elif slug:
            item['link'] = f'/typewriters/{slug}/'
        else:
            item['link'] = ''
        
        json_data.append(item)
    
    json_path.parent.mkdir(parents=True, exist_ok=True)
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=2, ensure_ascii=False)
    
    return len(json_data)

def print_diff(old_tw: Dict, new_tw: Dict):
    """Print differences between two typewriters."""
    fields = ['manufacturer', 'model', 'year', 'serial_number', 'color', 
              'typeface', 'portable_manual', 'date_of_acquisition', 'status', 'notes']
    print("    Differences:")
    for field in fields:
        old_val = normalize_value(old_tw.get(field, ''))
        new_val = normalize_value(new_tw.get(field, ''))
        if old_val != new_val:
            print(f"      {field}: '{old_val}' -> '{new_val}'")

def main():
    """Main update function."""
    csv_path = Path('tw_master.csv')
    yaml_path = Path('_data/typewriters.yml')
    json_path = Path('assets/json/typewriters.json')
    pages_dir = Path('_typewriters')
    
    if not csv_path.exists():
        print(f"Error: CSV file not found: {csv_path}")
        return
    
    print("Reading CSV file...")
    csv_typewriters = read_csv_typewriters(csv_path)
    print(f"Found {len(csv_typewriters)} typewriters in CSV")
    
    print("\nReading existing YAML file...")
    existing_typewriters, existing_by_slug = read_existing_yaml(yaml_path)
    print(f"Found {len(existing_typewriters)} typewriters in existing YAML")
    
    print("\nComparing typewriters...")
    comparison = compare_typewriters(csv_typewriters, existing_by_slug)
    
    # Print results
    print(f"\n{'='*60}")
    print("COMPARISON RESULTS")
    print(f"{'='*60}")
    
    print(f"\n[SAME] Same (unchanged): {len(comparison['same'])}")
    if comparison['same']:
        print("  Slugs:", ', '.join(comparison['same'][:10]))
        if len(comparison['same']) > 10:
            print(f"  ... and {len(comparison['same']) - 10} more")
    
    print(f"\n[NEW] New typewriters: {len(comparison['new'])}")
    for tw in comparison['new']:
        print(f"  - {tw.get('manufacturer', '')} {tw.get('model', '')} ({tw.get('slug', '')})")
    
    print(f"\n[CHANGED] Changed typewriters: {len(comparison['different'])}")
    for diff in comparison['different']:
        slug = diff['slug']
        old_tw = diff['old']
        new_tw = diff['new']
        print(f"  - {old_tw.get('manufacturer', '')} {old_tw.get('model', '')} ({slug})")
        print_diff(old_tw, new_tw)
    
    if comparison['duplicate_slugs']:
        print(f"\n[DUPLICATE] Duplicate slugs in CSV: {len(comparison['duplicate_slugs'])}")
        print("  WARNING: Multiple entries with the same slug were found in CSV.")
        print("  Only the FIRST occurrence will be used. Review the duplicates below:")
        for slug, tws in comparison['duplicate_slugs'].items():
            print(f"\n  Slug: {slug} ({len(tws)} entries)")
            for i, tw in enumerate(tws, 1):
                marker = " <-- USING THIS ONE" if i == 1 else " <-- IGNORED"
                print(f"    {i}. {tw.get('manufacturer', '')} {tw.get('model', '')}")
                print(f"       Serial: {tw.get('serial_number', 'N/A')}")
                print(f"       Year: {tw.get('year', 'N/A')}")
                print(f"       Color: {tw.get('color', 'N/A')}")
                print(f"       Status: {tw.get('status', 'N/A')}")
                print(f"       Notes: {tw.get('notes', 'N/A')[:50]}{'...' if len(tw.get('notes', '')) > 50 else ''}")
                print(f"       {marker}")
    
    if comparison['removed']:
        print(f"\n[REMOVED] Removed from CSV (still in YAML): {len(comparison['removed'])}")
        for tw in comparison['removed']:
            print(f"  - {tw.get('manufacturer', '')} {tw.get('model', '')} ({tw.get('slug', '')})")
        print("  Note: These will be kept in YAML but not updated.")
    
    # Merge: keep removed ones, update changed ones, add new ones
    print(f"\n{'='*60}")
    print("UPDATING FILES")
    print(f"{'='*60}")
    
    # Create updated typewriters list
    updated_typewriters = []
    
    # Add removed typewriters (keep them in YAML)
    for tw in comparison['removed']:
        updated_typewriters.append(tw)
        print(f"  Kept: {tw.get('manufacturer', '')} {tw.get('model', '')} ({tw.get('slug', '')})")
    
    # Add/update typewriters from CSV
    # For duplicates, we'll use the first occurrence from CSV
    processed_slugs = set()
    for tw in csv_typewriters:
        slug = tw.get('slug', '')
        if not slug:
            continue
        
        # Skip duplicates (keep first one only)
        if slug in processed_slugs:
            if slug in comparison['duplicate_slugs']:
                # This is a duplicate, skip it
                continue
        processed_slugs.add(slug)
        
        # Preserve blog_post if it existed
        if slug in existing_by_slug:
            tw['blog_post'] = existing_by_slug[slug].get('blog_post', '')
        
        updated_typewriters.append(tw)
        
        if slug in comparison['new']:
            print(f"  Added: {tw.get('manufacturer', '')} {tw.get('model', '')} ({slug})")
        elif slug in [d['slug'] for d in comparison['different']]:
            print(f"  Updated: {tw.get('manufacturer', '')} {tw.get('model', '')} ({slug})")
        elif slug in comparison['duplicate_slugs']:
            print(f"  Using first duplicate: {tw.get('manufacturer', '')} {tw.get('model', '')} ({slug})")
    
    # Write updated YAML
    print(f"\nWriting YAML file...")
    yaml_path.parent.mkdir(parents=True, exist_ok=True)
    with open(yaml_path, 'w', encoding='utf-8') as f:
        yaml.dump(updated_typewriters, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
    print(f"  Written {len(updated_typewriters)} typewriters to {yaml_path}")
    
    # Generate JSON
    print(f"\nGenerating JSON file...")
    json_count = generate_json_from_yaml(yaml_path, json_path)
    print(f"  Generated {json_count} entries in {json_path}")
    
    # Create/update placeholder pages
    print(f"\nCreating/updating placeholder pages...")
    pages_dir.mkdir(parents=True, exist_ok=True)
    created_count = 0
    for tw in updated_typewriters:
        if create_placeholder_page(tw, pages_dir):
            created_count += 1
    print(f"  Created/updated {created_count} placeholder pages in {pages_dir}")
    
    print(f"\n{'='*60}")
    print("UPDATE COMPLETE")
    print(f"{'='*60}")
    print(f"Total typewriters: {len(updated_typewriters)}")
    print(f"  - Same: {len(comparison['same'])}")
    print(f"  - New: {len(comparison['new'])}")
    print(f"  - Updated: {len(comparison['different'])}")
    if comparison['duplicate_slugs']:
        print(f"  - Duplicates in CSV: {len(comparison['duplicate_slugs'])}")
    if comparison['removed']:
        print(f"  - Removed from CSV (kept in YAML): {len(comparison['removed'])}")

if __name__ == '__main__':
    main()

