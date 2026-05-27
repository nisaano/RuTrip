import os
import re
import json
import httpx
import pymorphy3
from typing import List
from datetime import datetime

morph = pymorphy3.MorphAnalyzer()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_MODELS_URL = "https://models.github.ai/inference/chat/completions"
MODEL_NAME = "gpt-4o-mini"

CATEGORIES = {
    "Самый посещаемый": ["посещаемый", "популярный", "известный", "топ", "людный", "рейтинг"],
    "Летний отдых": ["летний", "лето", "июнь", "июль", "август", "жара", "тепло"],
    "Зимний отдых": ["зимний", "зима", "декабрь", "январь", "февраль", "снег", "мороз"],
    "Море": ["море", "морской", "черное", "балтийское", "каспийское", "волна"],
    "Пляжный отдых": ["пляж", "пляжный", "загар", "песок", "шезлонг", "купаться"],
    "Реки и озера": ["река", "озеро", "волга", "байкал", "водоем", "сплав", "рыбалка"],
    "Леса": ["лес", "лесной", "тайга", "дерево", "бор", "дубрава", "грибы"],
    "Горы": ["гора", "горный", "кавказ", "алтай", "пик", "вершина", "скала", "хребет"],
    "Степи": ["степь", "степной", "равнина", "поле", "простор"],
    "Вулканы": ["вулкан", "вулканический", "гейзер", "камчатка", "кратер", "лава"],
    "Водопады": ["водопад", "поток", "каскад", "брызги", "струя"],
    "Крайние точки": ["крайний", "точка", "граница", "мыс", "северный", "южный", "край"],
    "Горнолыжные курорты": ["горнолыжный", "лыжи", "сноуборд", "подъемник", "трасса", "склон"],
    "Храмы и крепости": ["храм", "крепость", "церковь", "монастырь", "собор", "стены", "башня"],
    "Заповедники": ["заповедник", "заказник", "парк", "охрана", "животное", "природа"],
    "Музеи": ["музей", "выставка", "экспонат", "галерея", "картина", "история"],
    "Древние города": ["древний", "город", "суздаль", "новгород", "старый", "русь", "история"],
    "Место боевой славы": ["боевой", "слава", "война", "памятник", "мемориал", "победа", "курган"],
    "Парки": ["парк", "сквер", "аллея", "прогулка", "зелень"],
    "Природные источники": ["источник", "родник", "ключ", "минеральный", "гейзер", "термальный"],
    "Острова": ["остров", "архипелаг", "сахалин", "курилы", "островной"],
    "Санатории": ["санаторий", "лечение", "оздоровление", "курорт", "профилакторий", "спа"],
    "Природные локации": ["природный", "локация", "красота", "ландшафт", "вид", "пейзаж"]
}

def normalize_text(text: str) -> List[str]:
    text = re.sub(r'[^а-яА-ЯёЁ\s]', '', text.lower())
    return [morph.parse(word)[0].normal_form for word in text.split()]

def detect_tags(words: List[str]) -> List[str]:
    found_tags = []
    for tag, keywords in CATEGORIES.items():
        if any(word in keywords for word in words):
            found_tags.append(tag)
    return list(set(found_tags))

async def get_ai_recommendation(query: str, tags: List[str]) -> dict:
    cleaned_query = query.strip() if query else ""
    if cleaned_query:
        raw_words = re.sub(r'[^а-яА-ЯёЁ\s]', '', cleaned_query.lower()).split()
        
        if raw_words:
            has_known_words = any(morph.parse(word)[0].is_known for word in raw_words)
            
            words = [morph.parse(word)[0].normal_form for word in raw_words]
            detected = detect_tags(words)
            
            if not detected and not has_known_words and not tags:
                print(f"\n!!! ЛИНГВИСТИЧЕСКИЙ ФИЛЬТР: Запрос '{query}' признан абракадаброй !!!\n", flush=True)
                return {
                    "text": "Пожалуйста, уточните ваш запрос!",
                    "regions": []
                }
    now = datetime.now()
    months_ru = {
        1: "Январь (Зима)", 2: "Февраль (Зима)", 3: "Март (Весна)",
        4: "Апрель (Весна)", 5: "Май (Весна)", 6: "Июнь (Лето)",
        7: "Июль (Лето)", 8: "Август (Лето)", 9: "Сентябрь (Осень)",
        10: "Октябрь (Осень)", 11: "Ноябрь (Осень)", 12: "Декабрь (Зима)"
    }
    current_month_text = months_ru[now.month]

    system_prompt = (
        "Ты — специализированный ИИ-помощник для поиска туристических регионов России.\n"
        "Твоя задача — проанализировать запрос пользователя и выданные теги, "
        "после чего подобрать список подходящих субъектов Российской Федерации (областей, краев, республик).\n\n"
        f"ВАЖНЫЙ КОНТЕКСТ РЕАЛЬНОГО ВРЕМЕНИ:\n"
        f"Сейчас на дворе: {current_month_text}, текущий год: {now.year}.\n"
        "Ты ОБЯЗАН учитывать текущее время года при подборе регионов! Если пользователь просит место, где 'сейчас тепло/жарко' или 'хочу поехать прямо сейчас', "
        "смотри на текущий месяц. Например, если сейчас зима, не предлагай пляжи Черного моря для купания, а предлагай горнолыжные курорты или культурный отдых. "
        "Если сейчас лето — учитывай доступность летних активностей.\n\n"
        "КРИТИЧЕСКИЕ ПРАВИЛА:\n"
        "1. Ответ должен быть СТРОГО в формате JSON. Никакого лишнего текста до или после JSON. Никаких markdown разметок типа ```json.\n"
        "2. Структура JSON должна быть ровно такой:\n"
        "{\n"
        '  "text": "Краткое текстовое пояснение, почему выбраны эти регионы.",\n'
        '  "regions": ["Название Региона 1", "Название Региона 2", "Название Региона 3"]\n'
        "}\n"
        "3. В массиве 'regions' пиши названия субъектов РФ строго с заглавной буквы, как принято в русском языке (например: 'Тульская область', 'Камчатский край', 'Республика Алтай').\n"
        "4. Выдавай ТОЛЬКО официальные названия регионов. Никаких городов (нельзя писать 'Сочи', 'Анапа'), никаких скобок и уточнений.\n"
        "5. Если запрос пустой, выбери 3 любых популярных региона на свой вкус."
    )

    user_message = f"Запрос пользователя: '{query}'. Выбранные теги: {tags}."

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.4,
        "max_tokens": 1000
    }

    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Content-Type": "application/json"
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(GITHUB_MODELS_URL, json=payload, headers=headers)
            response.raise_for_status()
            result = response.json()
            
            ai_text = result['choices'][0]['message']['content'].strip()
            
            if ai_text.startswith("```json"):
                ai_text = ai_text.split("```json")[1].split("```")[0].strip()
            elif ai_text.startswith("```"):
                ai_text = ai_text.split("```")[1].split("```")[0].strip()

            ai_content = json.loads(ai_text)

            if "regions" in ai_content and isinstance(ai_content["regions"], list):
                clean_regions = []
                for r in ai_content["regions"]:
                    if isinstance(r, str):
                        clean_regions.append(r)
                    elif isinstance(r, dict) and "region" in r:
                        clean_regions.append(r["region"])
                ai_content["regions"] = clean_regions

            print(f"\n!!! ОТВЕТ ОТ ML-МОДУЛЯ: {ai_content}\n", flush=True)
            return ai_content
            
    except Exception as e:
        print(f"Ошибка при запросе к AI через GitHub Models: {e}", flush=True)
        return {
            "text": "Сейчас мы не можем связаться с ИИ, но вот базовые рекомендации.",
            "regions": ["Тульская область", "Ярославская область"]
        }