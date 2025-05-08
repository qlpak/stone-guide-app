import os
import io
from app import create_app
from flask import Response
import pytest
from unittest.mock import patch
import numpy as np
from app.utils import predict_top3
from unittest.mock import patch, MagicMock

app = create_app()
client = app.test_client()

TEST_IMAGE_PATH = "static/uploads/fa334daa11c14da78987544c4b115c17.jpg"

@pytest.fixture(scope="module", autouse=True)
def setup_upload_example():
    os.makedirs("static/uploads", exist_ok=True)
    test_img_path = TEST_IMAGE_PATH
    if not os.path.exists(test_img_path):
        with open(test_img_path, "wb") as f:
            f.write(os.urandom(1024))  # fake image content

def test_get_root():
    response: Response = client.get("/ai-stone-recognition/")
    assert response.status_code == 200
    assert "AI module is running" in response.get_data(as_text=True)

def test_post_without_file():
    response: Response = client.post("/ai-stone-recognition/")
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
                "/ai-stone-recognition/",
                content_type="multipart/form-data",
                data=data
            )

    assert response.status_code == 200
    result = response.get_json()
    assert result[0]["stone"] == "taj-mahal"

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
    fake_pred = np.zeros(203)
    fake_pred[55] = 0.9
    fake_pred[77] = 0.08
    fake_pred[88] = 0.02

    with patch("app.utils.model") as mock_model:
        mock_model.predict = MagicMock(return_value=[fake_pred])

        img_path = TEST_IMAGE_PATH 
        result = predict_top3(img_path)

        assert isinstance(result, list)
        assert len(result) == 3
        assert result[0]["probability"] > 0.8
        assert "stone" in result[0]