from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    from app.routes import ai_routes
    app.register_blueprint(ai_routes, url_prefix="/ai/predict")

    return app