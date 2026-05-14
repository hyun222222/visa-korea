#!/bin/bash
# WordPress Homepage Configuration Script
# This script changes the homepage to display latest posts instead of a static page

# Change homepage to show blog posts
curl -X POST "https://kimnhyunlaw.com/wp-json/wp/v2/settings" \
  -H "Content-Type: application/json" \
  -u "admin:YOUR_PASSWORD_HERE" \
  -d '{
    "show_on_front": "posts"
  }'

echo "Homepage configuration updated!"
