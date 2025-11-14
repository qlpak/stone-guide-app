import os
import io
from app import create_app
from flask import Response
import pytest
from unittest.mock import patch, MagicMock
import numpy as np
from app.utils import predict_top3, save_image
from PIL import Image

app = create_app()
client = app.test_client()

TEST_IMAGE_PATH = "static/uploads/fa334daa11c14da78987544c4b115c17.jpg"

@pytest.fixture(scope="module", autouse=True)
def setup_upload_example():
    os.makedirs("static/uploads", exist_ok=True)
    test_img_path = TEST_IMAGE_PATH
    if not os.path.exists(test_img_path):
        img = Image.new("RGB", (224, 224), color=(100, 150, 200))
        img.save(test_img_path)

def test_get_root():
    response: Response = client.get("/ai/predict/")
    assert response.status_code == 200
    assert "AI module is running" in response.get_data(as_text=True)

def test_post_without_file():
    response: Response = client.post("/ai/predict/")
    assert response.status_code == 400
    assert response.get_json()["error"] == "No image uploaded"

def test_post_with_file():
    with patch("app.routes.predict_top3") as mocked_predict:
        mocked_predict.return_value = [
            {"rank": 1, "stone": "taj-mahal", "probability": 0.95},
            {"rank": 2, "stone": "nero-marquina", "probability": 0.03},
            {"rank": 3, "stone": "verde-evo", "probability": 0.02}
        ]

        with open(TEST_IMAGE_PATH, "rb") as f:
            data = {"image": (io.BytesIO(f.read()), "example.jpg")}
            response: Response = client.post(
                "/ai/predict/",
                content_type="multipart/form-data",
                data=data
            )

    assert response.status_code == 200
    result = response.get_json()
    assert result[0]["stone"] == "taj-mahal"

def test_save_image():
    """Test the save_image utility function."""
    from werkzeug.datastructures import FileStorage
    
    img = Image.new("RGB", (100, 100), color=(255, 0, 0))
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    file = FileStorage(stream=img_bytes, filename="test.jpg", content_type="image/jpeg")
    
    saved_path = save_image(file)
    
    assert os.path.exists(saved_path)
    assert saved_path.startswith("static/uploads/")
    assert saved_path.endswith(".jpg")
    
    if os.path.exists(saved_path):
        os.remove(saved_path)

def test_predict_top3_real():
    img_path = TEST_IMAGE_PATH 

    if not os.path.exists("model/resnet50_best.h5"):
        pytest.skip("Model file not found – skipping real model test")

    result = predict_top3(img_path)

    assert isinstance(result, list)
    assert len(result) == 3
    for r in result:
        assert "rank" in r
        assert "stone" in r
        assert "probability" in r
        assert isinstance(r["probability"], float)

def test_predict_top3_with_mocked_model():
    from PIL import Image

    img_path = "static/uploads/test_ai_image.jpg"
    os.makedirs("static/uploads", exist_ok=True)
    img = Image.new("RGB", (224, 224), color=(0, 255, 0))
    img.save(img_path)

    fake_pred = np.zeros(203)
    fake_pred[55] = 0.9
    fake_pred[77] = 0.08
    fake_pred[88] = 0.02

    with patch("app.utils.model") as mock_model:
        mock_model.predict = MagicMock(return_value=[fake_pred])

        result = predict_top3(img_path)

        assert isinstance(result, list)
        assert len(result) == 3
        assert result[0]["probability"] > 0.8

def test_predict_top3_forces_model_load():
    from app import utils

    utils.model = None

    fake_pred = np.zeros(203)
    fake_pred[55] = 0.9
    fake_pred[77] = 0.08
    fake_pred[88] = 0.02

    img_path = "static/uploads/test_force_load.jpg"
    img = Image.new("RGB", (224, 224), color=(123, 123, 123))
    img.save(img_path)

    with patch("app.utils.tf.keras.models.load_model") as mock_loader:
        mock_loader.return_value.predict = MagicMock(return_value=[fake_pred])
        result = utils.predict_top3(img_path)

    assert result[0]["stone"]
        
