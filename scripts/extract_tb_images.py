import os
import json
import argparse
from tensorboard.backend.event_processing.event_accumulator import EventAccumulator
import io
from PIL import Image

def extract_images_from_tfevents(events_file, output_dir, tag_name=None):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    print(f"Loading {events_file}...")
    # Initialize EventAccumulator, configuring it to load images
    ea = EventAccumulator(events_file, size_guidance={'images': 0})
    ea.Reload()

    tags = ea.Tags().get('images', [])
    if not tags:
        print("No image tags found in the event file.")
        return

    print(f"Available image tags: {tags}")

    if tag_name and tag_name not in tags:
        print(f"Tag {tag_name} not found.")
        return

    tags_to_extract = [tag_name] if tag_name else tags

    for t in tags_to_extract:
        events = ea.Images(t)
        json_data = []
        tag_dir = os.path.join(output_dir, t.replace('/', '_'))
        if not os.path.exists(tag_dir):
            os.makedirs(tag_dir)

        for event in events:
            step = event.step
            try:
                img = Image.open(io.BytesIO(event.encoded_image_string))
                filename = f"step_{step}.png"
                filepath = os.path.join(tag_dir, filename)
                img.save(filepath)

                json_data.append({
                    "step": step,
                    "image": f"assets/{filename}"
                })
            except Exception as e:
                print(f"Failed to extract image at step {step}: {e}")

        print(f"\nExtracted {len(events)} images for tag '{t}' into directory '{tag_dir}'")
        print("Here is the JSON for your markdown block:\n")
        print("```imageslider")
        print(json.dumps(json_data, indent=2))
        print("```")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract images from tfevents file for the React ImageSlider")
    parser.add_argument("events_file", help="Path to the tfevents file or the directory containing it")
    parser.add_argument("--output_dir", default="extracted_images", help="Output directory for the PNG files")
    parser.add_argument("--tag", default=None, help="Specific image tag to extract (optional)")
    args = parser.parse_args()

    # If a directory is provided, find the tfevents file inside it
    events_path = args.events_file
    if os.path.isdir(events_path):
        files = [f for f in os.listdir(events_path) if f.startswith("events.out.tfevents")]
        if not files:
            print("No tfevents file found in the directory.")
            exit(1)
        events_path = os.path.join(events_path, files[0])

    extract_images_from_tfevents(events_path, args.output_dir, args.tag)

