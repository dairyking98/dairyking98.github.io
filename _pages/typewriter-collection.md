---
layout: page
title: typewriter collection
permalink: /typewriter-collection/
description: A comprehensive list of typewriters in my collection.
nav: false
---

#### Summary Statistics

<div class="row mt-4 mb-4">
  <div class="col-md-3">
    <div class="card text-center">
      <div class="card-body">
        <h4 class="card-title">{{ site.data.typewriters.size }}</h4>
        <p class="card-text">Total Typewriters</p>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card text-center">
      <div class="card-body">
        {% assign manufacturer_groups = site.data.typewriters | group_by: "manufacturer" %}
        <h4 class="card-title">{{ manufacturer_groups.size }}</h4>
        <p class="card-text">Manufacturers</p>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card text-center">
      <div class="card-body">
        {% assign with_year = 0 %}
        {% for tw in site.data.typewriters %}
          {% if tw.year and tw.year != '' and tw.year != 0 %}
            {% assign with_year = with_year | plus: 1 %}
          {% endif %}
        {% endfor %}
        <h4 class="card-title">{{ with_year }}</h4>
        <p class="card-text">With Year Data</p>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card text-center">
      <div class="card-body">
        {% assign with_status = 0 %}
        {% for tw in site.data.typewriters %}
          {% if tw.status and tw.status != '' %}
            {% assign with_status = with_status | plus: 1 %}
          {% endif %}
        {% endfor %}
        <h4 class="card-title">{{ with_status }}</h4>
        <p class="card-text">With Status Issues</p>
      </div>
    </div>
  </div>
</div>

### List View

<div class="mb-3">
  <label for="sort-select" class="form-label">Sort by:</label>
  <select id="sort-select" class="form-select" style="width: auto; display: inline-block;">
    <option value="manufacturer">Manufacturer (A-Z)</option>
    <option value="model">Model (A-Z)</option>
    <option value="year">Year (Oldest First)</option>
    <option value="year-desc">Year (Newest First)</option>
  </select>
</div>

<div id="typewriter-list">

{% for typewriter in site.data.typewriters %}
  {% assign type_class = typewriter.standard_portable | default: 'Standard' %}
  {% if type_class == '' %}
    {% assign type_class = 'Standard' %}
  {% endif %}
  {% comment %} Find matching typewriter page to get img field {% endcomment %}
  {% assign typewriter_page = nil %}
  {% if typewriter.slug %}
    {% for page in site.typewriters %}
      {% assign page_slug = page.permalink | remove: '/typewriters/' | remove: '/' %}
      {% if page_slug == typewriter.slug %}
        {% assign typewriter_page = page %}
        {% break %}
      {% endif %}
    {% endfor %}
  {% endif %}
  <div class="card mb-3 mt-4 typewriter-card" 
       data-manufacturer="{{ typewriter.manufacturer | default: '' }}" 
       data-model="{{ typewriter.model | default: '' }}"
       data-year="{{ typewriter.year | default: '' }}"
       data-type="{{ type_class }}">
    <div class="row no-gutters">
      {% if typewriter_page.img %}
        <div class="col-md-6">
          {% include figure.liquid loading="lazy" path=typewriter_page.img sizes="(min-width: 768px) 156px, 50vw" alt="typewriter thumbnail" class="card-img" %}
        </div>
      {% endif %}
      <div class="{% if typewriter_page.img %}col-md-6{% else %}col-md-12{% endif %}">
        <div class="card-body">
      <h3 class="card-title">
        {% if typewriter.year and typewriter.year != '' %}
          {{ typewriter.year }}
        {% endif %}
        {{ typewriter.manufacturer }} {{ typewriter.model }}
      </h3>
      <div class="row">
        <div class="col-md-6">
          <p class="card-text">
            <strong>Serial Number:</strong> 
            {% if typewriter.serial_number and typewriter.serial_number != '' %}
              {{ typewriter.serial_number }}
            {% else %}
              N/A
            {% endif %}
            <br>
            <strong>Color:</strong> 
            {% if typewriter.color and typewriter.color != '' %}
              {{ typewriter.color }}
            {% else %}
              N/A
            {% endif %}
            <br>
            <strong>Typeface:</strong> 
            {% if typewriter.typeface and typewriter.typeface != '' %}
              {{ typewriter.typeface }}
            {% else %}
              N/A
            {% endif %}
            <br>
            <strong>Type:</strong> 
            {% if typewriter.portable_manual and typewriter.portable_manual != '' %}
              {{ typewriter.portable_manual }}
            {% else %}
              N/A
            {% endif %}
            <br>
            <strong>Standard/Portable:</strong> 
            {% if typewriter.standard_portable and typewriter.standard_portable != '' %}
              {{ typewriter.standard_portable }}
            {% else %}
              Standard
            {% endif %}
          </p>
        </div>
        <div class="col-md-6">
          <p class="card-text">
            <strong>Date Acquired:</strong> 
            {% if typewriter.date_of_acquisition and typewriter.date_of_acquisition != '' %}
              {{ typewriter.date_of_acquisition }}
            {% else %}
              N/A
            {% endif %}
            <br>
            <strong>Status:</strong> 
            {% if typewriter.status and typewriter.status != '' %}
              {{ typewriter.status }}
            {% else %}
              No issues reported
            {% endif %}
          </p>
        </div>
      </div>
      {% if typewriter.notes and typewriter.notes != '' %}
        <p class="card-text"><strong>Notes:</strong> {{ typewriter.notes }}</p>
      {% endif %}
      <div class="mt-2">
        {% if typewriter.blog_post and typewriter.blog_post != '' %}
          <a href="{{ typewriter.blog_post | relative_url }}" class="btn btn-primary">Read Blog Post</a>
        {% else %}
          <a href="{{ '/typewriters/' | append: typewriter.slug | append: '/' | relative_url }}" class="btn btn-secondary">View Details</a>
        {% endif %}
      </div>
        </div>
      </div>
    </div>
  </div>
{% endfor %}
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const sortSelect = document.getElementById('sort-select');
  const listContainer = document.getElementById('typewriter-list');
  const cards = Array.from(listContainer.querySelectorAll('.typewriter-card'));
  
  function sortCards(sortBy) {
    const sortedCards = cards.slice().sort((a, b) => {
      let aVal, bVal;
      
      if (sortBy === 'manufacturer') {
        aVal = (a.dataset.manufacturer || '').toLowerCase();
        bVal = (b.dataset.manufacturer || '').toLowerCase();
        return aVal.localeCompare(bVal);
      } else if (sortBy === 'model') {
        aVal = (a.dataset.model || '').toLowerCase();
        bVal = (b.dataset.model || '').toLowerCase();
        return aVal.localeCompare(bVal);
      } else if (sortBy === 'year') {
        aVal = parseInt(a.dataset.year) || 0;
        bVal = parseInt(b.dataset.year) || 0;
        return aVal - bVal;
      } else if (sortBy === 'year-desc') {
        aVal = parseInt(a.dataset.year) || 0;
        bVal = parseInt(b.dataset.year) || 0;
        return bVal - aVal;
      }
      return 0;
    });
    
    // Clear container
    listContainer.innerHTML = '';
    
    // Append sorted cards
    sortedCards.forEach(card => {
      listContainer.appendChild(card);
    });
  }
  
  // Initial sort by manufacturer
  sortCards('manufacturer');
  
  // Handle sort change
  sortSelect.addEventListener('change', function() {
    sortCards(this.value);
  });
});
</script>

