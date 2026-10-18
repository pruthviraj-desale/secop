from __future__ import annotations

import pytest

from app.api.v1.dev_auth import is_dev_mode


@pytest.fixture(autouse=True)
def clean_demo_auth_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    for key in (
        "ENV",
        "ENVIRONMENT",
        "AISOC_DEV_AUTH_BYPASS",
        "AISOC_PUBLISHED_BIND_ADDRS",
    ):
        monkeypatch.delenv(key, raising=False)


def test_anonymous_demo_access_requires_explicit_opt_in(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("ENV", "development")
    monkeypatch.setenv("AISOC_PUBLISHED_BIND_ADDRS", "127.0.0.1")

    assert is_dev_mode() is False


@pytest.mark.parametrize("address", ["127.0.0.1", "localhost", "::1", "[::1]"])
def test_anonymous_demo_access_allows_only_loopback_bindings(
    monkeypatch: pytest.MonkeyPatch, address: str
) -> None:
    monkeypatch.setenv("ENV", "development")
    monkeypatch.setenv("AISOC_DEV_AUTH_BYPASS", "1")
    monkeypatch.setenv("AISOC_PUBLISHED_BIND_ADDRS", address)

    assert is_dev_mode() is True


@pytest.mark.parametrize("address", ["0.0.0.0", "192.168.1.25", "example.test"])
def test_anonymous_demo_access_refuses_network_bindings(
    monkeypatch: pytest.MonkeyPatch, address: str
) -> None:
    monkeypatch.setenv("ENV", "development")
    monkeypatch.setenv("AISOC_DEV_AUTH_BYPASS", "1")
    monkeypatch.setenv("AISOC_PUBLISHED_BIND_ADDRS", address)

    assert is_dev_mode() is False
