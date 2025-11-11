---
layout: page
title: personal projects
permalink: /personal-projects/
description: Independent projects I've worked on in my spare time.
nav: false
nav_order: 5
display_categories: [personal-project]
horizontal: false
---

Independent projects I've worked on in my spare time.

These are projects I've pursued outside of coursework, exploring my interests in fabrication, electronics, design, and making.

You can browse all personal project posts by the [personal-project tag](/blog/tag/personal-project/).

<!-- pages/personal-projects.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_projects = "" | split: "," %}
  {% for project in site.projects %}
    {% assign category_match = false %}
    {% if project.category == category %}
      {% assign category_match = true %}
    {% else %}
      {% assign cat_start = category | append: ", " %}
      {% assign cat_end = ", " | append: category %}
      {% assign cat_middle = ", " | append: category | append: ", " %}
      {% if project.category contains cat_start or project.category contains cat_end or project.category contains cat_middle %}
        {% assign category_match = true %}
      {% endif %}
    {% endif %}
    {% if category_match %}
      {% assign categorized_projects = categorized_projects | push: project %}
    {% endif %}
  {% endfor %}
  {% comment %} Sort by category-specific importance, fallback to default importance {% endcomment %}
  {% assign importance_field = "importance_" | append: category %}
  {% assign sorted_projects = "" | split: "," %}
  {% for i in (1..100) %}
    {% for project in categorized_projects %}
      {% assign cat_importance = project[importance_field] %}
      {% if cat_importance == nil or cat_importance == blank %}
        {% assign cat_importance = project.importance %}
      {% endif %}
      {% assign cat_importance_int = cat_importance | plus: 0 %}
      {% if cat_importance_int == i %}
        {% assign sorted_projects = sorted_projects | push: project %}
      {% endif %}
    {% endfor %}
  {% endfor %}
  {% comment %} If no projects were sorted (all had importance 0 or none), use default sort {% endcomment %}
  {% if sorted_projects.size == 0 %}
    {% assign sorted_projects = categorized_projects | sort: "importance" %}
  {% endif %}
  <!-- Generate cards for each project -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display projects without categories -->

{% assign sorted_projects = site.projects | sort: "importance" %}

  <!-- Generate cards for each project -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>

