import os
from supabase import create_client
from datetime import datetime

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_BUCKET = "avatar"  # Ton bucket

supabase = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase client initialisé")
    except Exception as e:
        print(f"⚠️ Erreur d'initialisation Supabase : {e}")
else:
    print("⚠️ Supabase non configuré (variables d'environnement manquantes)")


def upload_image(file, filename_prefix="chat"):
    """
    Upload une image vers Supabase et retourne l'URL publique.
    - file : fichier binaire (image)
    - filename_prefix : préfixe pour nommer le fichier
    """
    if not supabase:
        raise Exception("Supabase client non initialisé")

    # Nom unique
    filename = f"{filename_prefix}_{datetime.now().strftime('%Y%m%d%H%M%S')}.jpg"

    try:
        # Upload
        res = supabase.storage.from_(SUPABASE_BUCKET).upload(filename, file)
        if res:
            # Obtenir l'URL publique
            public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(
                filename
            )
            return public_url
        else:
            raise Exception("Erreur upload image Supabase")
    except Exception as e:
        print(f"⚠️ Erreur upload Supabase : {e}")
        return None
