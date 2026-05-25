# Region Search ML Module

Модуль семантического поиска регионов на базе `sentence-transformers` (модель `paraphrase-multilingual-MiniLM-L12-v2`) и гибридного скоринга (векторная близость + keyword/tag boosting).

## Структура проекта

- `ml_module.py` — основной класс `RegionSearchML`.
- `main.py` — консольный интерфейс для тестирования работы модуля.
- `data/regions.csv` — база данных регионов с их описаниями и тегами.

## Как запустить локально

1. Создать виртуальное окружение:

2. Установить зависимости:
   pip install -r requirements.txt

3. Запустить тестовый поиск:
   python main.py
