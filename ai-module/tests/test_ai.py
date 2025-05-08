import os
import io
from app import create_app
from flask import Response
import pytest

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
    with open(TEST_IMAGE_PATH, "rb") as f:
        data = {"image": (io.BytesIO(f.read()), "example.jpg")}
        response: Response = client.post(
            "/ai-stone-recognition/", content_type="multipart/form-data", data=data
        )

    assert response.status_code == 200
    result = response.get_json()
    assert isinstance(result, list)
    assert "stone" in result[0]
    assert "probability" in result[0]
