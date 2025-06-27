FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5002
<<<<<<< HEAD
CMD ["python", "main.py"]
=======
CMD ["python", "app.py"]
>>>>>>> 37e17af197e8b3701d5ae4e87093d73b95fec5aa
