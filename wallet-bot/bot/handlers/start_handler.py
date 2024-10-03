from aiohttp import ClientConnectorError
from telegram import Update
from telegram.ext import ContextTypes, CommandHandler

from bot.services import check_user


async def command_start_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        if update.message.from_user.username:
            await context.bot.send_message(chat_id=update.effective_chat.id, text=f'Hello {update.message.from_user.username}')
            result = await check_user(update.message.from_user.username)
            if result:
                await context.bot.send_message(chat_id=update.effective_chat.id, text='Your username has been '
                                                                                      'checked: +')
            else:
                await context.bot.send_message(chat_id=update.effective_chat.id, text='Your username has been '
                                                                                      'checked: -')
        else:
            await context.bot.send_message(chat_id=update.effective_chat.id, text=f'Hello {update.message.from_user.first_name}')
    except ClientConnectorError:
        await context.bot.send_message(chat_id=update.effective_chat.id, text="Backend doesn't respond")

start = CommandHandler("start", command_start_handler)
