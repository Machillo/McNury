from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Mac Nury API"
    app_env: str = "development"
    frontend_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    payment_provider: str = "mock"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
