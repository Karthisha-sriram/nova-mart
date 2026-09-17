import requests

BASE_URL = "http://localhost:3000"


def test_application_is_reachable():
    response = requests.get(BASE_URL, timeout=10)

    assert response.status_code == 200
