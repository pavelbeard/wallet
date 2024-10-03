import aiohttp
from bot import config


async def check_user(telegram_username=None, telegram_id=None) -> bool:
    async with aiohttp.ClientSession() as session:
        if telegram_username:
            data = {'telegram_username': telegram_username}
            async with session.post(
                    f'{config.BACKEND_URL}/api/users/check_user_by_telegram_username/', data=data
            ) as response:
                if response.status == 200:
                    return True
        elif telegram_id:
            data = {'telegram_id': telegram_id}
            async with session.post(
                    f'{config.BACKEND_URL}/api/users/check_user_by_telegram_id/', data=data
            ) as response:
                if response.status == 200:
                    return True

        return False
