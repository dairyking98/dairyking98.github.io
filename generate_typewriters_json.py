#!/usr/bin/env python3
"""
Generate JSON file from typewriters YAML data for Bootstrap Tables.
Adds link field that points to blog post or placeholder page.
Reads img field from markdown files.
"""

import yaml
import json
import re
from pathlib import Path

def extract_front_matter_img(markdown_path):
    """Extract img field from markdown file front matter."""
    if not markdown_path.exists():
        return ''
    
    try:
        with open(markdown_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract front matter
        front_matter_match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
        if not front_matter_match:
            return ''
        
        front_matter = front_matter_match.group(1)
        
        # Extract img field
        img_match = re.search(r'^img:\s*(.+)$', front_matter, re.MULTILINE)
        if img_match:
            return img_match.group(1).strip()
        
        return ''
    except Exception:
        return ''

def generate_json_from_yaml(yaml_path, json_path, typewriters_dir='_typewriters'):
    """Read YAML file and generate JSON for Bootstrap Tables."""
    # Read YAML file
    with open(yaml_path, 'r', encoding='utf-8') as f:
        typewriters = yaml.safe_load(f)
    
    typewriters_path = Path(typewriters_dir)
    
    # Process typewriters and add link field
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
        
        # Add link field - blog post if exists, otherwise placeholder page
        blog_post = tw.get('blog_post', '')
        slug = tw.get('slug', '')
        if blog_post and blog_post.strip():
            item['link'] = blog_post
        elif slug:
            item['link'] = f'/typewriters/{slug}/'
        else:
            item['link'] = ''
        
        # Read img field from markdown file
        if slug:
            markdown_file = typewriters_path / f'{slug}.md'
            img_path = extract_front_matter_img(markdown_file)
            item['img'] = img_path
        
        json_data.append(item)
    
    # Write JSON file
    output_file = Path(json_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=2, ensure_ascii=False)
    
    print(f"Generated {len(json_data)} typewriters in {json_path}")
    return json_data

if __name__ == '__main__':
    yaml_path = '_data/typewriters.yml'
    json_path = 'assets/json/typewriters.json'
    typewriters_dir = '_typewriters'
    
    generate_json_from_yaml(yaml_path, json_path, typewriters_dir)

