FROM python:3.9-slim

# Install git and other system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV GIT_PYTHON_REFRESH=quiet

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]