import os
import time
import shutil
import base64
import requests
import pdfplumber
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
WORDPRESS_URL = os.getenv("WORDPRESS_URL")
WORDPRESS_USER = os.getenv("WORDPRESS_USER")
WORDPRESS_APP_PASSWORD = os.getenv("WORDPRESS_APP_PASSWORD")

# Configure Gemini
if not GOOGLE_API_KEY:
    print("Error: GOOGLE_API_KEY not found in .env file.")
else:
    genai.configure(api_key=GOOGLE_API_KEY)

def extract_text_from_pdf(pdf_path):
    """
    Extracts text from a PDF file using pdfplumber.
    """
    print(f"Reading PDF: {pdf_path}...")
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return None

def generate_blog_post(legal_text):
    """
    Sends the legal text to Gemini to generate a blog post.
    """
    print("Generating blog post with Google Gemini...")
    
    system_prompt = """
    You are an expert legal content writer for a law firm's blog. 
    Your task is to rewrite complex court rulings into easy-to-understand, engaging blog posts for the general public.
    
    CRITICAL PRIVACY RULE: 
    - You must NEVER include real names of the plaintiff (won-go) or defendant (pi-go). 
    - Replace them with "A씨", "B씨" or "의뢰인", "상대방" as appropriate.
    - Remove specific addresses and replace them with general terms like "서울 서초구의 한 아파트".
    
    Structure the blog post as follows:
    1. **Start with the Title**: The very first line of your response MUST be "Title: [Your SEO Title]".
    2. **Introduction**: Briefly explain the situation in simple terms.
    3. **The Case**: Describe what happened, the legal conflict, and the client's difficulty.
    4. **Our Solution**: How the lawyer approached the case and the legal logic used (simplified).
    5. **The Result**: The court's favorable ruling.
    6. **Conclusion**: A call to action for consultation (e.g., "If you are facing a similar issue, contact us...").
    
    Format the body (after the title) as HTML suitable for WordPress (use <h2>, <p>, <ul>, etc.). 
    Do NOT wrap the output in markdown code blocks (like ```html). Just return the raw string starting with "Title: ...".
    """

    try:
        # Dynamically find a suitable model
        target_model = 'gemini-pro' # Default fallback
        try:
            print("Searching for available Gemini models...")
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    print(f"Found model: {m.name}")
                    if 'flash' in m.name.lower():
                        target_model = m.name
                        break
                    elif 'pro' in m.name.lower() and target_model == 'gemini-pro':
                         target_model = m.name
        except Exception as e:
            print(f"Warning: Could not list models ({e}). Using default.")

        print(f"Using model: {target_model}")
        model = genai.GenerativeModel(target_model)
        response = model.generate_content(f"{system_prompt}\n\nHere is the court ruling text:\n\n{legal_text}")
        return response.text
    except Exception as e:
        print(f"Error generating blog post: {e}")
        return None

def upload_to_wordpress(title, content):
    """
    Uploads the generated post to WordPress as a draft.
    """
    print("Uploading to WordPress...")
    
    url = f"{WORDPRESS_URL}/wp-json/wp/v2/posts"
    
    # Create the authorization header
    credentials = f"{WORDPRESS_USER}:{WORDPRESS_APP_PASSWORD}"
    token = base64.b64encode(credentials.encode())
    headers = {
        "Authorization": f"Basic {token.decode('utf-8')}",
        "Content-Type": "application/json"
    }
    
    post_data = {
        "title": title,
        "content": content,
        "status": "draft"  # Upload as draft for review
    }
    
    try:
        response = requests.post(url, headers=headers, json=post_data)
        response.raise_for_status()
        post_id = response.json().get('id')
        post_link = response.json().get('link')
        print(f"Success! Post uploaded. ID: {post_id}")
        print(f"Check it here: {post_link}")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error uploading to WordPress: {e}")
        if response.content:
            print(f"Server response: {response.content.decode()}")
        return None

def main():
    # Define directories
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    INPUT_DIR = os.path.join(BASE_DIR, "input")
    PROCESSED_DIR = os.path.join(BASE_DIR, "processed")
    ERROR_DIR = os.path.join(BASE_DIR, "error")

    # Ensure directories exist
    os.makedirs(INPUT_DIR, exist_ok=True)
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    os.makedirs(ERROR_DIR, exist_ok=True)

    print(f"Monitoring folder: {INPUT_DIR}")
    print("Drop PDF files there to auto-post to WordPress using Gemini.")
    print("Press Ctrl+C to stop.")

    while True:
        # Check for PDF files in input directory
        pdf_files = [f for f in os.listdir(INPUT_DIR) if f.lower().endswith('.pdf')]
        
        if not pdf_files:
            time.sleep(2)  # Wait 2 seconds before checking again
            continue

        for pdf_file in pdf_files:
            pdf_path = os.path.join(INPUT_DIR, pdf_file)
            print(f"\n[NEW FILE DETECTED] Processing: {pdf_file}")
            
            try:
                # 1. Extract Text
                text = extract_text_from_pdf(pdf_path)
                if not text:
                    raise Exception("Failed to extract text")

                # 2. Generate Content
                full_response = generate_blog_post(text)
                if not full_response:
                    raise Exception("Failed to generate content")

                parts = full_response.split('\n', 1)
                if len(parts) >= 2 and "Title:" in parts[0]:
                    title = parts[0].replace("Title:", "").strip()
                    content = parts[1].strip()
                else:
                    title = f"Legal Case Summary - {pdf_file}"
                    content = full_response

                # 3. Upload
                result = upload_to_wordpress(title, content)
                if not result:
                    raise Exception("Failed to upload to WordPress")

                # 4. Move to Processed
                shutil.move(pdf_path, os.path.join(PROCESSED_DIR, pdf_file))
                print(f"[SUCCESS] Moved {pdf_file} to 'processed' folder.")

            except Exception as e:
                error_msg = f"Error processing {pdf_file}: {str(e)}"
                print(f"[ERROR] {error_msg}")
                
                # Write error log FIRST (so we definitely have it)
                try:
                    log_path = os.path.join(ERROR_DIR, f"{pdf_file}_error.txt")
                    with open(log_path, "w", encoding="utf-8") as f:
                        f.write(error_msg)
                except Exception as log_e:
                    print(f"[CRITICAL] Could not write error log: {log_e}")

                # Move to Error (safely)
                try:
                    dest_path = os.path.join(ERROR_DIR, pdf_file)
                    if os.path.exists(dest_path):
                        os.remove(dest_path) # Remove existing file to allow move
                    shutil.move(pdf_path, dest_path)
                    print(f"[MOVED] Moved {pdf_file} to 'error' folder. Check the text file for details.")
                except Exception as move_e:
                    print(f"[CRITICAL] Could not move file: {move_e}")
        
        time.sleep(1)

        
        time.sleep(1)

if __name__ == "__main__":
    main()
