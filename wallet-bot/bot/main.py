import asyncio
import logging
import aiohttp_autoreload
from telegram.ext import ApplicationBuilder

from config import DEBUG, BOT_KEY
from handlers import start

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)


async def startup() -> None:
    aiohttp_autoreload.start()


async def main() -> None:
    if DEBUG:
        await startup()
    app = ApplicationBuilder().token(token=BOT_KEY).build()
    app.add_handler(start)
    app.run_polling()


if __name__ == '__main__':
    asyncio.run(main())
