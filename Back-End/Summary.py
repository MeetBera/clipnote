import os
import yt_dlp
from urllib.parse import urlparse, parse_qs

# Function to extract video ID
def get_video_id(yt_url):
    parsed_url = urlparse(yt_url)
    if parsed_url.hostname in ["youtu.be"]:
        return parsed_url.path[1:]
    elif parsed_url.hostname in ["www.youtube.com", "youtube.com"]:
        return parse_qs(parsed_url.query).get("v", [None])[0]
    return None

# Function to download audio and set dynamic path
def download_audio_as_id(yt_url, save_dir):
    video_id = get_video_id(yt_url)
    if not video_id:
        raise ValueError("Invalid YouTube URL or missing video ID")

    # Create full save path
    output_file = os.path.join(save_dir, f"{video_id}.mp3")

    ydl_opts = {
    'format': 'bestaudio/best',
    'outtmpl': 'C:/Users/Lenovo/OneDrive/Desktop/PROGRAMMING/python/Summary/%(id)s.%(ext)s',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
}
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([yt_url])

    print(f"Audio saved at: {output_file}")
    return output_file

# Example usage
youtube_link = "https://youtu.be/0guSWBSO8lo"
save_directory = r"C:\Users\Lenovo\OneDrive\Desktop\PROGRAMMING\python\Summary"

audio_path = download_audio_as_id(youtube_link, save_directory)
print("Dynamic audio path:", audio_path)

import torch 
import whisper

device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model("medium", device=device)
result = model.transcribe(audio_path, task="translate", language="hi")
transcript = result["text"]

print("Transcript:\n", transcript)

import google.generativeai as genai
import textwrap
# Configure Gemini
genai.configure(api_key="AIzaSyAfGnJTYNVXIpIz25wb7ppd79pvexI0QJY")

# Use flash model (fast and cost-efficient)
model = genai.GenerativeModel("gemini-1.5-flash")

def explain_in_chunks(transcript, chunk_size=3000):
    chunks = textwrap.wrap(transcript, chunk_size)
    explanations = []
    
    for i, chunk in enumerate(chunks, start=1):
        prompt = f"""
        explain this {chunk} in very simple language + give summary in easy points
        """
        print(f"Processing chunk {i}/{len(chunks)}...")
        response = model.generate_content(prompt)
        explanations.append(response.text)
    
    return "\n\n".join(explanations)

# Example usage
final_explanation = explain_in_chunks(transcript)
print(final_explanation)
