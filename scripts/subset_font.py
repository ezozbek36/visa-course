import sys
import os
import argparse
import base64
import io
from fontTools import subset

def process_font(font_path, text, output_path=None, to_stdout=False):
    # Check if font exists
    if not os.path.exists(font_path):
        sys.stderr.write(f"Error: Font file not found at {font_path}\n")
        return False

    # Options
    options = subset.Options()
    options.flavor = 'woff2'
    options.desubroutinize = True 
    
    try:
        # Load
        font = subset.load_font(font_path, options)
        
        # Subset
        subsetter = subset.Subsetter(options)
        unique_chars = set(text)
        unicodes = [ord(c) for c in unique_chars]
        subsetter.populate(unicodes=unicodes)
        subsetter.subset(font)
        
        if to_stdout:
            # Save to memory
            buf = io.BytesIO()
            font.save(buf)
            buf.seek(0)
            # Encode to base64
            b64_data = base64.b64encode(buf.read()).decode('utf-8')
            print(b64_data)
        else:
            # Create output directory if it doesn't exist
            if output_path:
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                font.save(output_path)
                
                print(f"Processed {os.path.basename(font_path)}")
                print(f"  Saved to: {output_path}")

                original_size = os.path.getsize(font_path)
                new_size = os.path.getsize(output_path)
                print(f"  Original size: {original_size} bytes")
                print(f"  New size: {new_size} bytes")
                print(f"  Reduction: {((original_size - new_size) / original_size) * 100:.1f}%")
        
        return True

    except Exception as e:
        sys.stderr.write(f"Error processing font {font_path}: {e}\n")
        return False

def main():
    parser = argparse.ArgumentParser(description="Subset fonts based on usage.")
    parser.add_argument("--font", type=str, help="Name of the font to process")
    args = parser.parse_args()

    # Paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    fonts_to_process = [
        {
            "name": "Kuunari-Bold",
            "path": os.path.join(project_root, 'public', 'fonts', 'subset-Kuunari-Bold.woff2'),
            "text": "YouViza | SO'NGI QABUL",
            "output": os.path.join(script_dir, 'subset-Kuunari-Bold.woff2')
        },
        {
            "name": "BigShouldersDisplay-Black",
            "path": os.path.join(project_root, 'public', 'fonts', 'subset-BigShouldersDisplay-Black.woff2'),
            # Text from: hero__title, section-title, feature-card__title, stat-card__number, form-intro__title
            "text": "2026 yil Viza menejer kasbini o'rganib, oylik 2000$ daromadga chiqishni xohlaysizmi? kurs haqida ma'lumot kurs muddati barchasi 0 dan bonus mavzular Kurs muallifi 1000+ 4 yil o'quvchilarimiz fikrlari kursga qatnashish uchun quyidagi anketani to'ldiring'".upper(),
            "output": os.path.join(script_dir, 'subset-BigShouldersDisplay-Black.woff2')
        },
        {
            "name": "BigShouldersDisplay-ExtraBold",
            "path": os.path.join(project_root, 'public', 'fonts', 'subset-BigShouldersDisplay-ExtraBold.woff2'),
            # Text from: cta-button, anketa-form__heading
            "text": "kursga qatnashish ma'lumotlaringizni kiritib ularni bizga yuboring ma'lumotlarni yuborish".upper(),
            "output": os.path.join(script_dir, 'subset-BigShouldersDisplay-ExtraBold.woff2')
        },
        {
            "name": "RFDewiCondensed-Bold.woff2",
            "path": os.path.join(project_root, 'public', 'fonts', 'subset-RFDewiCondensed-Bold.woff2'),
            # Text from: footer__text
            "text": "soatdan so'ng qabul yopiladi: 1234567890".upper(),
            "output": os.path.join(script_dir, 'subset-RFDewiCondensed-Bold.woff2')
        }
    ]

    if args.font:
        # Find specific font
        config = next((f for f in fonts_to_process if f['name'] == args.font), None)
        if config:
            success = process_font(config['path'], config['text'], config['output'], to_stdout=True)
            if not success:
                sys.exit(1)
        else:
            sys.stderr.write(f"Error: Font '{args.font}' not found in configuration.\n")
            sys.stderr.write("Available fonts: " + ", ".join([f['name'] for f in fonts_to_process]) + "\n")
            sys.exit(1)
    else:
        # Process all (legacy behavior, print to stdout usually fine or we can keep as is)
        for config in fonts_to_process:
            process_font(config['path'], config['text'], config['output'], to_stdout=False)

if __name__ == "__main__":
    main()
