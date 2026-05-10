// WordPress Settings Update via JavaScript
// Run this in the browser console while logged in to WordPress admin

async function updateHomepageSettings() {
    console.log('Updating homepage settings...');

    // Get nonce from the page
    const nonce = wpApiSettings?.nonce || wp?.api?.nonce;

    if (!nonce) {
        console.error('Could not find WordPress nonce. Make sure you are on a WordPress admin page.');
        return;
    }

    try {
        // Update homepage to show posts
        const response = await fetch('/wp-json/wp/v2/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': nonce
            },
            body: JSON.stringify({
                show_on_front: 'posts'
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✓ Homepage settings updated successfully!');
            console.log('New settings:', data);
            console.log('\nNavigating to homepage...');
            setTimeout(() => {
                window.open('/', '_blank');
            }, 1000);
        } else {
            console.error('✗ Failed to update settings:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('✗ Error:', error);
    }
}

updateHomepageSettings();
