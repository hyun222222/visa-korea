const fs = require('fs');
const path = require('path');
const { posts } = require('./seed_blog_posts.js');

function escapeSql(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/'/g, "''");
}

function formatValue(key, val) {
    if (val === null || val === undefined) {
        return 'NULL';
    }
    if (key === 'keywords') {
        const escapedItems = val.map(item => `'${escapeSql(item)}'`).join(',');
        return `ARRAY[${escapedItems}]::text[]`;
    }
    if (key === 'body') {
        return `'${escapeSql(JSON.stringify(val))}'::jsonb`;
    }
    if (typeof val === 'number') {
        return val;
    }
    return `'${escapeSql(val)}'`;
}

async function generate() {
    console.log("Generating SQL seed script...");
    
    let sql = `-- ============================================================\n`;
    sql += `-- Korea Visa Law — Seed Translations Migration\n`;
    sql += `-- Run this in Supabase SQL Editor to populate translated blogs.\n`;
    sql += `-- ============================================================\n\n`;
    
    // Clear old posts first to avoid primary key/unique slug conflicts
    const slugs = posts.map(p => p.slug);
    const slugList = slugs.map(s => `'${escapeSql(s)}'`).join(', ');
    sql += `-- 1. Clear existing seed posts to avoid duplicate slug conflicts\n`;
    sql += `DELETE FROM blog_posts WHERE slug IN (${slugList});\n\n`;
    
    sql += `-- 2. Insert new localized posts (5 articles * 4 languages)\n`;
    sql += `INSERT INTO blog_posts (slug, title, title_en, excerpt, category, keywords, read_minutes, author, body, published_at) VALUES\n`;
    
    const valueLines = posts.map(post => {
        const values = [
            formatValue('slug', post.slug),
            formatValue('title', post.title),
            formatValue('title_en', post.title_en),
            formatValue('excerpt', post.excerpt),
            formatValue('category', post.category),
            formatValue('keywords', post.keywords),
            formatValue('read_minutes', post.read_minutes),
            formatValue('author', post.author),
            formatValue('body', post.body),
            `now()`
        ];
        return `(${values.join(', ')})`;
    });
    
    sql += valueLines.join(',\n') + ';\n';
    
    const outputPath = path.join(__dirname, 'database', 'seed_translations.sql');
    fs.writeFileSync(outputPath, sql, 'utf-8');
    console.log(`Successfully generated SQL script at: ${outputPath}`);
}

generate();
