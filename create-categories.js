// WordPress Category Creation Script
// Run this in the browser console while on the Categories page (wp-admin/edit-tags.php?taxonomy=category)

const categories = [
    '건축/건설',
    '경매',
    '계약/해약금',
    '공유물분할',
    '농지/토지/임야',
    '명의신탁',
    '부동산 세금',
    '부동산 최신 판결',
    '부동산 형사 고소',
    '분양 계약',
    '상가 임대차',
    '임대차/전세',
    '재개발/재건축',
    '지주택',
    '김앤현 부동산소개'
];

async function createCategory(name) {
    const formData = new FormData();
    formData.append('action', 'add-tag');
    formData.append('_wpnonce_add-tag', document.querySelector('#_wpnonce_add-tag').value);
    formData.append('taxonomy', 'category');
    formData.append('tag-name', name);

    const response = await fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        body: formData
    });

    return response;
}

async function createAllCategories() {
    console.log('Starting category creation...');
    for (let i = 0; i < categories.length; i++) {
        try {
            console.log(`Creating: ${categories[i]}...`);
            await createCategory(categories[i]);
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between requests
            console.log(`✓ Created: ${categories[i]}`);
        } catch (error) {
            console.error(`✗ Failed to create ${categories[i]}:`, error);
        }
    }
    console.log('Done! Reloading page...');
    setTimeout(() => location.reload(), 1000);
}

createAllCategories();
