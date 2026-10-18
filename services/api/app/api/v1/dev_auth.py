"""Development authentication bypass.

When the local demo explicitly enables ``AISOC_DEV_AUTH_BYPASS`` and all
published host bindings are loopback, requests without a bearer token resolve
to a deterministic demo user. This keeps the demonstration frictionless
without silently enabling anonymous administrator access on a network host.

The demo IDs are also used by ``services/api/app/scripts/seed_demo.py`` so the
data the UI sees actually belongs to the user that the API hands back.

Production safety: this module reads its settings at call time and refuses
the bypass unless the environment is non-production, the explicit opt-in is
set, and every published host binding is loopback.
"""

from __future__ import annotations

import ipaddress
import os
import uuid

# Deterministic demo IDs — kept in sync with seed_demo.py
DEMO_TENANT_ID: uuid.UUID = uuid.UUID("00000000-0000-0000-0000-000000000001")
DEMO_USER_ID: uuid.UUID = uuid.UUID("00000000-0000-0000-0000-000000000002")
# Use a real TLD (not `.local`, which is reserved for mDNS and rejected by
# pydantic ``EmailStr``). Deterministic, public-demo-only credentials.
DEMO_USER_EMAIL: str = "demo@aisoc.dev"
DEMO_USER_PASSWORD: str = "aisoc-demo"
DEMO_USER_ROLE: str = "admin"

_DEV_ENVS = {"development", "dev", "local", "demo"}
_TRUTHY = {"1", "true", "yes", "on"}


def _is_loopback_binding(value: str) -> bool:
    host = value.strip().strip("[]").lower()
    if host == "localhost":
        return True
    try:
        return ipaddress.ip_address(host.split("%", 1)[0]).is_loopback
    except ValueError:
        return False


def is_dev_mode() -> bool:
    """True only for an explicitly enabled, loopback-only demo bypass."""
    env = (os.getenv("ENV") or os.getenv("ENVIRONMENT") or "").strip().lower()
    if env not in _DEV_ENVS:
        return False
    if os.getenv("AISOC_DEV_AUTH_BYPASS", "").strip().lower() not in _TRUTHY:
        return False
    bindings = [
        value.strip()
        for value in os.getenv("AISOC_PUBLISHED_BIND_ADDRS", "").split(",")
        if value.strip()
    ]
    return bool(bindings) and all(_is_loopback_binding(value) for value in bindings)
