import os
import uuid
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet import preprocess_input

model = None

with open("data/class_indices.json") as f:
    idx_to_class = json.load(f)

def save_image(file):
    upload_dir = "static/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    filename = f"{uuid.uuid4().hex}.jpg"
    path = os.path.join(upload_dir, filename)
    file.save(path)
    return path

def predict_top3(img_path):
    global model
    if model is None:
        model = tf.keras.models.load_model("model/resnet50_best.h5", compile=False)
        print("Model loaded successfully!")

    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)

    pred_probs = model.predict(img_array, verbose=0)[0]
    top_3_idx = pred_probs.argsort()[-3:][::-1]
    top_3_probs = pred_probs[top_3_idx]
    top_3_probs_norm = top_3_probs / top_3_probs.sum()

    return [
        {
            "rank": i + 1,
            "stone": idx_to_class.get(str(idx), f"Class {idx}"),
            "probability": round(float(prob), 4)
        }
        for i, (idx, prob) in enumerate(zip(top_3_idx, top_3_probs_norm))
    ]