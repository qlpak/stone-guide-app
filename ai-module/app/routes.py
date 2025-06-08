from flask import Blueprint, request, jsonify
from .utils import predict_top3, save_image

ai_routes = Blueprint("ai_routes", __name__)

@ai_routes.route("/", methods=["GET", "POST"], strict_slashes=False)
def predict():
    if request.method == "GET":
        return "AI module is running", 200

    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']
    img_path = save_image(file)
    predictions = predict_top3(img_path)
    return jsonify(predictions)
