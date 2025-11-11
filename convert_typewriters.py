#!/usr/bin/env python3
"""
Convert Excel typewriter data to YAML format for Jekyll.
Extracts only specified fields and generates slugs.
"""

import pandas as pd
import yaml
import re
from pathlib import Path

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
        # Use serial number instead of year
        serial_str = str(serial_number).strip()
        parts.append(slugify(serial_str))
    
    return '-'.join(filter(None, parts))

def convert_excel_to_yaml(excel_path, output_path):
    """Read Excel file and convert to YAML format."""
    # Read Excel file
    df = pd.read_excel(excel_path)
    
    # Print column names to help debug
    print("Columns found in Excel file:")
    print(df.columns.tolist())
    print("\nFirst few rows:")
    print(df.head())
    
    # Map column names (handle case variations and spaces)
    # Based on actual Excel columns: Typewriter Brand, Model, Year, Serial No, Color, Typeface, Electric/Manual, Date Acquired, Notes, Work Needed
    column_mapping = {
        'manufacturer': ['typewriter brand', 'Typewriter Brand', 'manufacturer', 'Manufacturer'],
        'model': ['model', 'Model', 'MODEL'],
        'year': ['year', 'Year', 'YEAR'],
        'serial_number': ['serial no', 'Serial No', 'serial number', 'serial_number', 'Serial Number'],
        'color': ['color', 'Color', 'COLOR'],
        'typeface': ['typeface', 'Typeface', 'TYPEFACE'],
        'portable_manual': ['electric/manual', 'Electric/Manual', 'portable/manual', 'portable_manual', 'Portable/Manual'],
        'date_of_acquisition': ['date acquired', 'Date Acquired', 'date of acquisition', 'date_of_acquisition', 'Date of Acquisition'],
        'status': ['work needed', 'Work Needed', 'status', 'Status', 'STATUS'],
        'notes': ['notes', 'Notes', 'NOTES', 'note', 'Note']
    }
    
    # Find actual column names (case-insensitive matching)
    actual_columns = {}
    for key, possible_names in column_mapping.items():
        for col in df.columns:
            col_lower = str(col).strip().lower()
            if col_lower in [name.lower() for name in possible_names]:
                actual_columns[key] = col
                break
    
    print("\nColumn mapping:")
    for key, col in actual_columns.items():
        print(f"  {key} -> {col}")
    
    # Extract data
    typewriters = []
    for idx, row in df.iterrows():
        typewriter = {}
        for key in column_mapping.keys():
            col_name = actual_columns.get(key)
            if col_name and col_name in df.columns:
                value = row[col_name]
                # Handle NaN values
                if pd.isna(value):
                    typewriter[key] = ""
                else:
                    # Convert to appropriate type
                    if key == 'year':
                        try:
                            # Try to convert to int
                            year_val = int(float(value))
                            typewriter[key] = year_val
                        except (ValueError, TypeError):
                            # If conversion fails, keep as empty string
                            typewriter[key] = ""
                    elif key == 'date_of_acquisition':
                        # Try to format date
                        if pd.notna(value):
                            if isinstance(value, pd.Timestamp):
                                typewriter[key] = value.strftime('%Y-%m-%d')
                            else:
                                typewriter[key] = str(value)
                        else:
                            typewriter[key] = ""
                    else:
                        typewriter[key] = str(value).strip()
            else:
                typewriter[key] = ""
        
        # Generate slug
        typewriter['slug'] = generate_slug(typewriter)
        
        # Add blog_post field (empty by default, can be filled manually)
        typewriter['blog_post'] = ""
        
        typewriters.append(typewriter)
    
    # Write to YAML file
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        yaml.dump(typewriters, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
    
    print(f"\nConverted {len(typewriters)} typewriters to {output_path}")
    return typewriters

if __name__ == '__main__':
    excel_path = r'C:\Users\Leonard\Downloads\Untitled spreadsheet.xlsx'
    output_path = '_data/typewriters.yml'
    
    convert_excel_to_yaml(excel_path, output_path)

