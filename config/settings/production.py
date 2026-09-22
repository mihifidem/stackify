import os

from .base import *
from dotenv import load_dotenv

DEBUG = False

ALLOWED_HOSTS = os.getenv(
    "ALLOWED_HOSTS",
    "",
).split(",")