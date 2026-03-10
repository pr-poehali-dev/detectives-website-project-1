import json
import os
import urllib.request
import urllib.parse


def handler(event: dict, context) -> dict:
    """Отправка сообщения обратной связи через Telegram-бот администратору @tormelatoninov"""

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    tg = body.get('tg', '').strip().lstrip('@')
    message = body.get('message', '').strip()

    if not name or not tg:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Имя и Telegram обязательны'}, ensure_ascii=False)
        }

    token = os.environ['TELEGRAM_BOT_TOKEN']
    chat_id = '@tormelatoninov'

    text = (
        f"🕵️ *Новая заявка с сайта Детективы*\n\n"
        f"👤 *Имя:* {name}\n"
        f"✈️ *Telegram:* @{tg}\n"
        f"💬 *Сообщение:* {message or 'не указано'}"
    )

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = urllib.parse.urlencode({
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'Markdown'
    }).encode()

    req = urllib.request.Request(url, data=data, method='POST')
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read())

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'ok': True, 'message': 'Заявка отправлена'})
    }