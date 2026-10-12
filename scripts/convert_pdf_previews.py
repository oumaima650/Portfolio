import os
import fitz  # PyMuPDF

os.makedirs('public/certifications', exist_ok=True)
os.makedirs('public/projects/helpora', exist_ok=True)
os.makedirs('public/projects/automates', exist_ok=True)
os.makedirs('public/experiences', exist_ok=True)

items = [
    ('public/certifications/Coursera XC6SYAVU084N.pdf', 'public/certifications/preview_cicd.png'),
    ('public/certifications/Coursera OS42YJ4VZUCA (1).pdf', 'public/certifications/preview_github_actions.png'),
    ('public/certifications/1771009406870.pdf', 'public/certifications/preview_python.png'),
    ('public/certifications/1753277670516.pdf', 'public/certifications/preview_networking.png'),
    ('public/Rapport_Finale.pdf', 'public/projects/helpora/preview_report.png'),
    ('public/Rapport_projet_THL.pdf', 'public/projects/automates/preview_report.png'),
    ('public/experiences/Rapport_PFA.pdf', 'public/experiences/preview_report_pfa.png'),
    ('public/experiences/Rapport_Stage_Initiation.pdf', 'public/experiences/preview_report_initiation.png'),
]

for src, dst in items:
    if os.path.exists(src):
        try:
            doc = fitz.open(src)
            page = doc.load_page(0)
            pix = page.get_pixmap(dpi=150)
            pix.save(dst)
            print(f'SUCCESS: {dst} ({pix.width}x{pix.height})')
        except Exception as e:
            print(f'ERROR on {src}: {e}')
    else:
        print(f'MISSING: {src}')
