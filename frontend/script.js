// ========== БОКОВОЕ МЕНЮ ==========
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');
const overlay = document.getElementById('overlay');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}
if (sidebarClose) {
    sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}
if (overlay) {
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// ========== БАЗА ДАННЫХ ВСЕХ СУБЪЕКТОВ ==========
const subjectsDatabase = {
    // === ДАЛЬНЕВОСТОЧНЫЙ ===
    "Камчатский край": {
        name: "Камчатский край",
        region: "Дальневосточный район",
        image: "https://s3.russpass.ru/rp-mag-public-prod/images/oblozhka_OX.format-webp.max-16383x16383.webpquality-100.webp",
        description: "Земля вулканов и гейзеров. Долина гейзеров, Кроноцкий заповедник, вулканы Ключевской и Авачинский.",
        tags: ["volcano", "nature", "extreme", "reserves", "mountains"],
        page: "Dalnevostochny_rayon/Kamchatka.html",
        
    },
    "Приморский край": {
        name: "Приморский край",
        region: "Дальневосточный район",
        image: "https://i.pinimg.com/originals/3f/75/9c/3f759cbbc2503c89efc6deaccec22a0e.jpg",
        description: "Владивосток с мостами, остров Русский, Уссурийская тайга, Дальневосточный морской заповедник.",
        tags: ["sea", "islands", "nature", "reserves"],
        page: "Dalnevostochny_rayon/Primorsky.html",
    },
    "Хабаровский край": {
        name: "Хабаровский край",
        region: "Дальневосточный район",
        image: "https://blog.ufs-online.ru/media/5684/shutterstock_455692555-min.jpg",
        description: "Шантарские острова, Амурские столбы, Большехехцирский заповедник.",
        tags: ["islands", "reserves", "rivers", "nature"],
        page: "Dalnevostochny_rayon/Khabarovsk.html",
    },
    "Амурская область": {
        name: "Амурская область",
        region: "Дальневосточный район",
        image: "https://i.pinimg.com/originals/2a/3d/b2/2a3db2a5549aa745d716a9d1cbf6232e.jpg",
        description: "Космодром Восточный, Хинганский заповедник, Зейское и Бурейское водохранилища.",
        tags: ["nature", "reserves", "rivers"],
        page: "Dalnevostochny_rayon/Amurskaya_oblast.html",
    },
    "Еврейская АО": {
        name: "Еврейская автономная область",
        region: "Дальневосточный район",
        image: "https://i.bigenc.ru/resizer/resize?sign=GZ5fOGfFJX2sL6XcItNTyA&filename=vault/dafb4dcd83c608da6546f50dd34b27d4.webp&width=3840",
        description: "Заповедник Бастак, живописные места вдоль Амура, уникальная история.",
        tags: ["reserves", "history", "rivers"],
        page: "Dalnevostochny_rayon/Evreyskaya_AO.html",
    },
    "Магаданская область": {
        name: "Магаданская область",
        region: "Дальневосточный район",
        image: "https://sdelanounas.ru/i/a/w/1/f_aW1nLmdlbGlvcGhvdG8uY29tL21hZ2FkYW4yMDIyLzA4X21hZ2FkYW4yMDIyLmpwZz9fX2lkPTE0ODE5Mw==.jpeg",
        description: "Колыма, памятник Маска Скорби, уникальные природные парки.",
        tags: ["history", "nature", "extreme"],
        page: "Dalnevostochny_rayon/Magadanskaya_oblast.html",
    },
    "Республика Саха (Якутия)": {
        name: "Республика Саха (Якутия)",
        region: "Дальневосточный район",
        image: "https://sdelanounas.ru/i/a/w/1/aW1nLWZvdGtpLnlhbmRleC5ydS9nZXQvOTEwNy8zMDM0ODE1Mi4yMjIvMF85MWJiMV83OTRjMTUwYV9vcmlnP19faWQ9OTEzMzQ=.jpg",
        description: "Ленские столбы (ЮНЕСКО), полюс холода в Оймяконе, алмазы, уникальная культура.",
        tags: ["unesco", "extreme", "culture", "winter"],
        page: "Dalnevostochny_rayon/Yakutia.html",
    },
    "Сахалинская область": {
        name: "Сахалинская область",
        region: "Дальневосточный район",
        image: "https://sdelanounas.ru/i/a/w/1/f_aW1nLmdlbGlvcGhvdG8uY29tL3V1cy8zOF91dXMuanBnP19faWQ9MTI1Mjg1.jpeg",
        description: "Курильские острова с вулканами, мыс Великан, грязевые вулканы.",
        tags: ["islands", "volcano", "sea", "nature"],
        page: "Dalnevostochny_rayon/Sakhalinskaya_oblast.html"
    },
    "Чукотский АО": {
        name: "Чукотский автономный округ",
        region: "Дальневосточный район",
        image: "https://i.pinimg.com/originals/64/ad/05/64ad0522611c1436d35e803e400351ff.jpg",
        description: "Берингов пролив, мыс Дежнева, петроглифы, лежбища моржей.",
        tags: ["extreme", "arctic", "culture"],
        page: "Dalnevostochny_rayon/Chukotskiy_AO.html"
    },
    "Забайкальский край": {
        name: "Забайкальский край",
        region: "Восточно-Сибирский район",
        image: "https://content-14.foto.my.mail.ru/mail/axey/30020/b-31418.JPG",
        description: "Сохондинский заповедник, национальный парк Чикой, Чарские пески.",
        tags: ["desert", "mountains", "reserves"],
        page: "Dalnevostochny_rayon/Zabaykalsky.html",
    },

    // === СЕВЕРО-ЗАПАДНЫЙ ===
    "Республика Коми": {
        name: "Республика Коми",
        region: "Северо-Западный район",
        image: "https://storage.yandexcloud.net/storage.yasno.media/nat-geo/images/2019/5/8/fa060b9687d342d5a7ff32c6f53f2ced.max-1200x800.jpg",
        description: "Девственные леса Коми (ЮНЕСКО), плато Маньпупунёр с каменными столбами, Печоро-Илычский заповедник.",
        tags: ["unesco", "rocks", "reserves", "extreme"],
        page: "Severo-zapad_rayon/Komi.html",
    },
    "Архангельская область": {
        name: "Архангельская область",
        region: "Северо-Западный район",
        image: "https://cdny.de/p/x/a/98c/7253005.jpg",
        description: "Соловецкие острова (ЮНЕСКО), музей деревянного зодчества Малые Корелы, Пинежские пещеры, Северная Двина.",
        tags: ["unesco", "islands", "wooden-architecture", "caves"],
        page: "Severo-zapad_rayon/Arkhangelskaya_oblast.html",
    },
    "Вологодская область": {
        name: "Вологодская область",
        region: "Северо-Западный район",
        image: "https://avatars.mds.yandex.net/i?id=ef879ab9af4cb2cc1182ca205799aa93_l-4456735-images-thumbs&n=13",
        description: "Вологодский кремль, Кирилло-Белозерский монастырь, Ферапонтово с фресками Дионисия, Великий Устюг (родина Деда Мороза).",
        tags: ["monasteries", "kremlin", "unesco", "winter"],
        page: "Severo-zapad_rayon/Vologodskaya_oblast.html"
    },
    "Мурманская область": {
        name: "Мурманская область",
        region: "Северо-Западный район",
        image: "https://b-port.com/mediafiles/news/3157d/4cd598f9f071fc8f23e524c762a09c36c1cd2539.jpg",
        description: "Северное сияние, Хибины, Териберка на берегу Баренцева моря, атомный ледокол Ленин.",
        tags: ["arctic", "mountains", "winter", "sea"],
        page: "Severo-zapad_rayon/Murmanskaya_oblast.html",
    },
    "Ненецкий АО": {
        name: "Ненецкий автономный округ",
        region: "Северо-Западный район",
        image: "https://goarctic.ru/upload/iblock/24d/24d003ae132a35b426f64973ae47ad81.jpg",
        description: "Пустозерск — первый русский город за Полярным кругом, оленеводство, Большеземельская тундра.",
        tags: ["arctic", "history", "extreme"],
        page: "Severo-zapad_rayon/Nenetskiy_AO.html",
    },
    "г. Санкт-Петербург": {
        name: "г. Санкт-Петербург",
        region: "Северо-Западный район",
        image: "https://i.ibb.co/nbM1GHF/23.jpg",
        description: "Эрмитаж, Петергоф, Исаакиевский собор, разводные мосты, Невский проспект, Русский музей.",
        tags: ["city", "palaces", "museums", "unesco"],
        page: "Severo-zapad_rayon/St_Petersburg.html",
    },

    "Республика Карелия": {
        name: "Республика Карелия",
        region: "Северо-Западный район",
        image: "https://photobooth.cdn.sports.ru/preset/wysiwyg/4/bc/1eb30126b4b7b8efd852d7611f7a8.jpeg?f=webp&q=90&s=2x&w=730",
        description: "Более 60 000 озер, тайга, умеренное лето (+18°C). Идеально для любителей природы.",
        tags: ["river-lake", "forest", "nature", "reserves"],
        page: "Severo-zapad_rayon/Karelia.html",
    },
    "Ленинградская область": {
        name: "Ленинградская область",
        region: "Северо-Западный район",
        image: "https://i.pinimg.com/originals/49/c7/41/49c741efa2fcc5f6a38105bba76e787f.jpg",
        description: "Крепость Орешек, дворцы Гатчины, Выборгский замок, Ладожское озеро.",
        tags: ["fortress", "palaces", "history"],
        page: "Severo-zapad_rayon/Leningradskaya_oblast.html",
    },
    "Новгородская область": {
        name: "Новгородская область",
        region: "Северо-Западный район",
        image: "https://moya-planeta.ru/upload/images/xl/c7/7b/c77b604bdf898f846b4f5f3aea8f65433a42f780.jpg",
        description: "Великий Новгород с древним кремлем, Софийский собор, Валдайское озеро.",
        tags: ["kremlin", "monasteries", "history"],
        page: "Severo-zapad_rayon/Novgorodskaya_oblast.html",
    },
    "Псковская область": {
        name: "Псковская область",
        region: "Северо-Западный район",
        image: "https://blog.ostrovok.ru/wp-content/uploads/2023/03/3копия-4.jpg",
        description: "Псковский кремль, Пушкинские Горы, Чудское озеро, древние монастыри.",
        tags: ["kremlin", "literature", "history"],
        page: "Severo-zapad_rayon/Pskovskaya_oblast.html",
    },
    "Калининградская область": {
        name: "Калининградская область",
        region: "Калининградский район",
        image: "https://avatars.mds.yandex.net/i?id=3c0add93dec30cdf0229d7b7d0cee8b0_l-5858058-images-thumbs&n=13",
        description: "Балтийское море, Куршская коса (ЮНЕСКО), старинная немецкая архитектура.",
        tags: ["sea", "beach", "unesco", "history"],
        page: "Severo-zapad_rayon/Kaliningradskaya_oblast.html",
    },

    // === ВОЛГО-ВЯТСКИЙ РАЙОН ===
    "Республика Марий Эл": {
        name: "Республика Марий Эл",
        region: "Волго-Вятский район",
        image: "https://ic.pics.livejournal.com/zdorovs/16627846/1475956/1475956_original.jpg",
        description: "Козьмодемьянск, Йошкар-Ола с новой архитектурой, национальный парк Марий Чодра, озеро Яльчик.",
        tags: ["river-lake", "culture", "forest"],
        page: "Volgo-vyatskiy_rayon/Mariy_El.html",
    },
    "Республика Мордовия": {
        name: "Республика Мордовия",
        region: "Волго-Вятский район",
        image: "https://avatars.mds.yandex.net/i?id=8702a8277f21669d54a278cde075d0bd_l-4118505-images-thumbs&ref=rim&n=13&w=2048&h=1234",
        description: "Саранск к ЧМ-2018, Макаровский монастырь, Мордовский заповедник, озеро Инерка.",
        tags: ["city", "monasteries", "reserves"],
        page: "Volgo-vyatskiy_rayon/Mordovia.html",
    },
    "Чувашская Республика": {
        name: "Чувашская Республика",
        region: "Волго-Вятский район",
        image: "https://rgdb.ru/images/News_main/2020/11/12/01/CHeboksary.jpg",
        description: "Чебоксарская ГЭС, музей пива, памятник Чапаеву, этнокомплекс в Моргаушах.",
        tags: ["volga", "culture", "rivers"],
        page: "Volgo-vyatskiy_rayon/Chuvashia.html" ,
    },
    "Кировская область": {
        name: "Кировская область",
        region: "Волго-Вятский район",
        image: "https://ic.pics.livejournal.com/zdorovs/16627846/2033959/2033959_original.jpg",
        description: "Вятка — родина дымковской игрушки, Кировский музей палеонтологии, усадьба Булычёва.",
        tags: ["culture", "museums", "history"],
        page: "Volgo-vyatskiy_rayon/Kirovskaya_oblast.html",
    },
    "Нижегородская область": {
        name: "Нижегородская область",
        region: "Волго-Вятский район",
        image: "https://avatars.mds.yandex.net/i?id=850a29083b291f9ef544d8519e5a708a_l-8497035-images-thumbs&ref=rim&n=13&w=1920&h=840",
        description: "Нижегородский кремль, Чкаловская лестница, Макарьевский монастырь, озеро Светлояр (град Китеж), Дивеево.",
        tags: ["kremlin", "volga", "monasteries", "river-lake"],
        page: "Volgo-vyatskiy_rayon/Nizhegorodskaya_oblast.html",
    },


    // === ЗАПАДНО-СИБИРСКИЙ РАЙОН ===
    "Кемеровская область": {
        name: "Кемеровская область (Кузбасс)",
        region: "Западно-Сибирский район",
        image: "https://cs8.pikabu.ru/post_img/2016/12/12/8/og_og_1481551024280942757.jpg",
        description: "Горная Шория, Томская писаница (петроглифы), музей-заповедник «Красная Горка», Азасская пещера.",
        tags: ["mountains", "archaeology", "caves"],
        page: "Zapadno-sibirskiy_rayon/Kemerovskaya_oblast.html",
    },
    "Новосибирская область": {
        name: "Новосибирская область",
        region: "Западно-Сибирский район",
        image: "https://avatars.dzeninfra.ru/get-zen_doc/60857/pub_5bea3201e8e69a00ab8f6706_5bea3274f682f800aadf42fa/scale_1200",
        description: "Новосибирский Академгородок, зоопарк, оперный театр, Обское море (водохранилище).",
        tags: ["city", "science", "river-lake"],
        page: "Zapadno-sibirskiy_rayon/Novosibirskaya_oblast.html",
    },
    "Омская область": {
        name: "Омская область",
        region: "Западно-Сибирский район",
        image: "https://i.pinimg.com/originals/7e/45/c1/7e45c1b6753839a77e7793f3e6a11ee0.jpg",
        description: "Омская крепость, Любинский проспект, Успенский собор, музей Достоевского, озеро Эбейты.",
        tags: ["fortress", "history", "literature"],
        page: "Zapadno-sibirskiy_rayon/Omskaya_oblast.html",
    },
    "Томская область": {
        name: "Томская область",
        region: "Западно-Сибирский район",
        image: "https://sdelanounas.ru/i/a/w/1/f_aW1nLmdlbGlvcGhvdG8uY29tL3RvbXNrLzIyX3RvbXNrLmpwZz9fX2lkPTEyNTY2OA==.jpeg",
        description: "Деревянное зодчество Томска, Воскресенская гора, Университетская роща, таёжные реки.",
        tags: ["wooden-architecture", "city", "forest"],
        page: "Zapadno-sibirskiy_rayon/Tomskaya_oblast.html",
    },
    "Тюменская область": {
        name: "Тюменская область",
        region: "Западно-Сибирский район",
        image: "https://cont.ws/uploads/posts/1148295.jpg",
        description: "Тюменский кремль (единственный за Уралом), горячие источники, Ялуторовск с декабристами.",
        tags: ["kremlin", "springs", "history"],
        page: "Zapadno-sibirskiy_rayon/Tyumenskaya_oblast.html",
    },
    "Ханты-Мансийский АО": {
        name: "Ханты-Мансийский автономный округ",
        region: "Западно-Сибирский район",
        image: "https://cdn.culture.ru/images/87a8befc-7646-5734-b565-518adc008b04",
        description: "Археопарк (бронзовые мамонты), Биатлонный центр, Югорский мост, Самаровский останец.",
        tags: ["archaeology", "winter", "nature"],
        page: "Zapadno-sibirskiy_rayon/Khanty-Mansiysk_AO.html",
    },
    "Ямало-Ненецкий АО": {
        name: "Ямало-Ненецкий автономный округ",
        region: "Западно-Сибирский район",
        image: "https://ruxpert.ru/images/1/19/Салехардский_Преображенский_собор.jpeg",
        description: "Полуостров Ямал, оленеводство, Салехард — единственный город на Полярном круге, метеоритный кратер.",
        tags: ["arctic", "extreme", "culture"],
        page: "Zapadno-sibirskiy_rayon/Yamalo-Nenets_AO.html",
    },

    // === ЦЕНТРАЛЬНЫЙ ===
    "Брянская область": {
        name: "Брянская область",
        region: "Центральный район",
        image: "https://yamal-media.ru/images/insecure/rs:fill-down:1920:1080/aHR0cHM6Ly9zdG9yYWdlLnlhbmRleGNsb3VkLm5ldC95bS1zaXRlcy1zdGF0aWMvODQ2MzgxOWEtYTFjLndlYnA.webp",
        description: "Брянский лес — заповедник, партизанские леса, Свенский монастырь, Десна.",
        tags: ["reserves", "forest", "history"],
        page: "Central_rayon/Bryanskaya_oblast.html",
    },
    "Владимирская область": {
        name: "Владимирская область",
        region: "Центральный район",
        image: "https://cdnn21.img.ria.ru/images/07e7/09/04/1894120518_0:113:3074:1842_1920x0_80_0_0_c5cb3c25952e3a0828306a8ce58377f6.jpg",
        description: "Золотое кольцо: Успенский и Дмитриевский соборы, Золотые ворота, Суздаль, Боголюбово, церковь Покрова на Нерли.",
        tags: ["unesco", "churches", "golden-ring", "history"],
        page: "Central_rayon/Vladimirskaya_oblast.html",
    },
    "Ивановская область": {
        name: "Ивановская область",
        region: "Центральный район",
        image: "https://avatars.mds.yandex.net/i?id=da4c7c5b5a9261d4267ed2bfd6d938cd_l-5236381-images-thumbs&n=https://turbazy.ru/uploads/2025/01/34fa573b809c.jpg",
        description: "Город невест, конструктивизм, Плес на Волге — город художника Левитана.",
        tags: ["volga", "culture", "architecture"],
        page: "Central_rayon/Ivanovskaya_oblast.html",
    },
    "Калужская область": {
        name: "Калужская область",
        region: "Центральный район",
        image: "https://avatars.mds.yandex.net/i?id=8d9c95a9e3c349442fe2a61e8fab2711_l-2462069-images-thumbs&n=13",
        description: "Музей космонавтики им. Циолковского, Оптина пустынь, Никитский парк, Таруса.",
        tags: ["space", "monasteries", "culture"],
        page: "Central_rayon/Kaluzhskaya_oblast.html",
    },
    "Костромская область": {
        name: "Костромская область",
        region: "Центральный район",
        image: "https://avatars.mds.yandex.net/i?id=ae0530de5e4d9d64218c73b2ba78f9da_l-3989655-images-thumbs&n=13",
        description: "Ипатьевский монастырь, Сусанинская площадь, Снегурочка, сыроварни.",
        tags: ["monasteries", "history", "culture"],
        page: "Central_rayon/Kostromskaya_oblast.html",
    },
    "Орловская область": {
        name: "Орловская область",
        region: "Центральный район",
        image: "https://bbratstvo.com/sites/default/files/inline-images/Ekskursii-po-Orlu-i-Orlovskoj-oblasti-tseny-i-otzyvy.jpg",
        description: "Родина Тургенева (Спасское-Лутовиново), Орловское полесье, писательские музеи.",
        tags: ["literature", "reserves", "estates"],
        page: "Central_rayon/Orlovskaya_oblast.html",
    },
    "Рязанская область": {
        name: "Рязанская область",
        region: "Центральный район",
        image: "https://images.unsplash.com/photo-15https://avatars.mds.yandex.net/i?id=f9f9239d863d1aaf2d5b14ffdc49f3ef_l-10651277-images-thumbs&n=1382979512210-99b6a53386f9",
        description: "Рязанский кремль, Мещёрские леса (родина Есенина), Константиново, Касимов.",
        tags: ["kremlin", "forest", "literature", "rivers"],
        page: "Central_rayon/Ryazanskaya_oblast.html",
    },
    "Смоленская область": {
        name: "Смоленская область",
        region: "Центральный район",
        image: "https://avatars.mds.yandex.net/i?id=0e63fdef0c34a5a2ca0ba32b05e3f701_l-4375317-images-thumbs&n=13",
        description: "Смоленская крепостная стена, Успенский собор, Катынь, национальный парк Смоленское Поозерье.",
        tags: ["fortress", "churches", "history", "reserves"],
        page: "Central_rayon/Smolenskaya_oblast.html",
    },
    "Тверская область": {
        name: "Тверская область",
        region: "Центральный район",
        image: "https://cdn.culture.ru/images/0a9776ce-84f1-53cc-8a80-88343fefad2c",
        description: "Озеро Селигер, исток Волги, Старица с пещерными храмами, Торжок, усадьба Знаменское-Раёк.",
        tags: ["river-lake", "volga", "caves", "estates"],
        page: "Central_rayon/Tverskaya_oblast.html",
    },
    "Тульская область": {
        name: "Тульская область",
        region: "Центральный район",
        image: "https://35photo.pro/photos_main/1819/9098587.jpg",
        description: "Тульский кремль, музей оружия, Ясная Поляна (родина Толстого), Куликово поле.",
        tags: ["kremlin", "museums", "literature", "military-history"],
        page: "Central_rayon/Tulskaya_oblast.html",
    },
    "Ярославская область": {
        name: "Ярославская область",
        region: "Центральный район",
        image: "https://avatars.mds.yandex.net/get-vertis-journal/4469561/shutterstock_1998132974.jpg_1734680860673/1600x1600",
        description: "Ярославский кремль, церковь Ильи Пророка, Ростов Великий, Переславль-Залесский, озеро Плещеево.",
        tags: ["golden-ring", "kremlin", "unesco", "river-lake"],
        page: "Central_rayon/Yaroslavskaya_oblast.html",
    },
    "г. Москва": {
        name: "г. Москва",
        region: "Центральный район",
        image: "https://i.pinimg.com/originals/b3/43/47/b343473fa82711f54ab14ad0e0de5dc1.jpg",
        description: "Красная площадь, Кремль, Большой театр, Третьяковка, ВДНХ, Парк Горького.",
        tags: ["city", "kremlin", "museums", "unesco"],
        page: "Central_rayon/Moscow.html",
    },

    "Московская область": {
        name: "Московская область",
        region: "Центральный район",
        image: "https://sdelanounas.ru/i/a/w/1/f_aW1nLmdlbGlvcGhvdG8uY29tL21vLzA1X21vLmpwZz9fX2lkPTEzNDI5Mw==.jpeg",
        description: "Сергиев Посад с Троице-Сергиевой лаврой, Коломна с кремлем, усадьбы.",
        tags: ["monasteries", "estates", "history"],
        page: "Central_rayon/Moskovskaya_oblast.html",
  
    },
    "Белгородская область": {
        name: "Белгородская область",
        region: "Центрально-Чернозёмный район",
        image: "https://i.pinimg.com/originals/4e/22/21/4e2221d0962990be896b4bbb7223212e.jpg",
        description: "Меловые горы, заповедник Лес на Ворскле, ратная история.",
        tags: ["mountains", "reserves", "history"],
        page: "Central_rayon/Belgorodskaya_oblast.html",
    },
    "Воронежская область": {
        name: "Воронежская область",
        region: "Центрально-Чернозёмный район",
        image: "https://cs13.pikabu.ru/post_img/2023/09/29/8/og_og_1695990455272647968.jpg",
        description: "Дивногорье с меловыми столбами и пещерными храмами, Хоперский заповедник.",
        tags: ["caves", "reserves", "nature"],
        page: "Central_rayon/Voronezhskaya_oblast.html",
    },
    "Курская область": {
        name: "Курская область",
        region: "Центрально-Чернозёмный район",
        image: "https://avatars.dzeninfra.ru/get-zen-vh/9832375/2a000001898de5cbe5e0076d398aae50ec3d/orig",
        description: "Курская дуга — место ключевого сражения ВОВ, Коренная пустынь.",
        tags: ["military-history", "monasteries"],
        page: "Central_rayon/Kurskaya_oblast.html",
    },
    "Липецкая область": {
        name: "Липецкая область",
        region: "Центрально-Чернозёмный район",
        image: "https://s01.yapfiles.ru/files/3558387/img1.wallspic.commo_si_kecheng_shi_jing_guantian_ji_xianhuo_cheniao_kan_tu3556x2000.jpg",
        description: "Заповедник Галичья гора — самый маленький заповедник России, Елец, Задонск.",
        tags: ["reserves", "monasteries"],
        page: "Central_rayon/Lipetskaya_oblast.html",
        
    },
    "Тамбовская область": {
        name: "Тамбовская область",
        region: "Центрально-Чернозёмный район",
        image: "https://avatars.mds.yandex.net/i?id=7b1cf9980e2ce953bc42f2c8193c2870_l-10877308-images-thumbs&ref=rim&n=13&w=1280&h=720",
        description: "Усадьба Рахманинова в Ивановке, тамбовский мед, провинциальные пейзажи.",
        tags: ["estates", "culture"],
        page: "Central_rayon/Tambovskaya_oblast.html",
    },


    // === СИБИРСКИЙ ===
    "Иркутская область": {
        name: "Иркутская область (Байкал)",
        region: "Восточно-Сибирский район",
        image: "https://familiya38.ru/_next/image?url=https%3A%2F%2Ffamiliya38.ru%2Fcms%2Fuploads%2F0b723880404dd22eccfed66e8a49466d_c38b7c502f.jpg&w=3840&q=95",
        description: "Озеро Байкал — самое глубокое озеро мира, остров Ольхон, уникальная природа.",
        tags: ["baikal", "river-lake", "mountains", "nature"],
        page: "Central_rayon/Irkutskaya_oblast.html",
    },
    "Красноярский край": {
        name: "Красноярский край",
        region: "Восточно-Сибирский район",
        image: "https://sdelanounas.ru/i/a/w/1/f_aW1nLmdlbGlvcGhvdG8uY29tL2tyc2syMDIwLzI2X2tyc2syMDIwLmpwZz9fX2lkPTEzNjk4OA==.jpeg",
        description: "Столбы, Енисей, Путоранский заповедник (ЮНЕСКО), Хакасские курганы.",
        tags: ["rocks", "reserves", "unesco"],
        page: "Central_rayon/Krasnoyarsk.html",
    },
    "Республика Бурятия": {
        name: "Республика Бурятия",
        region: "Восточно-Сибирский район",
        image: "https://s0.rbk.ru/v6_top_pics/media/img/1/18/347224338043181.jpeg",
        description: "Восточный берег Байкала, Иволгинский дацан, Баргузинская долина.",
        tags: ["baikal", "buddhism", "culture"],
        page: "Central_rayon/Buryatia.html",
    },
    "Республика Тыва": {
        name: "Республика Тыва",
        region: "Восточно-Сибирский район",
        image: "https://static.tildacdn.com/tild3766-6365-4864-a132-313133636237/76269d16-1898-11ee-a.jpeg",
        description: "Край шаманов и горлового пения, Долина царей, Убсунурская котловина.",
        tags: ["culture", "unesco", "steppe"],
        page: "Central_rayon/Tyva.html",
    },
    "Республика Хакасия": {
        name: "Республика Хакасия",
        region: "Восточно-Сибирский район",
        image: "https://s.rdrom.ru/4/travel/points/8022/big_point-8978.jpg",
        description: "Салбыкский курган, Сундуки, Хакасский заповедник, минеральные озера.",
        tags: ["archaeology", "river-lake", "reserves"],
        page: "Central_rayon/Khakasia.html",
    },
    "Республика Алтай": {
        name: "Республика Алтай",
        region: "Сибирский район",
        image: "https://sdelanounas.ru/i/a/w/1/f_aW1nLmdlbGlvcGhvdG8uY29tL2dvcm5vYWx0YXlzay8xN19nb3Jub2FsdGF5c2suanBnP19faWQ9MTQ3Mjk0.jpeg",
        description: "Горные пейзажи, чистые озера, этнография. Летом +22°C. Для активного отдыха.",
        tags: ["mountains", "river-lake", "nature", "reserves"],
        page: "Central_rayon/Altay.html",
    },
    "Алтайский край": {
        name: "Алтайский край",
        region: "Сибирский район",
        image: "https://sdelanounas.ru/i/a/w/1/f_aW1nLmdlbGlvcGhvdG8uY29tL2Jybi8yMF9icm4uanBnP19faWQ9MTEzODE4.jpeg",
        description: "Степные пейзажи, соленые озера, леса, горы.",
        tags: ["steppe", "river-lake", "forest", "mountains"],
        page: "Central_rayon/Altaysky.html",
    },

    // === СЕВЕРО-КАВКАЗСКИЙ ===
    "Чеченская Республика": {
        name: "Чеченская Республика",
        region: "Северо-Кавказский район",
        image: "https://ic.pics.livejournal.com/bersaev/53995429/506519/506519_original.jpg",
        description: "Мечеть Сердце Чечни в Грозном, озеро Кезеной-Ам, Аргунское ущелье, башенный комплекс Ушкалой.",
        tags: ["mountains", "river-lake", "culture"],
        page: "Severo-kavkazskiy_rayon/Chechnya.html",
    },
    "Республика Адыгея": {
        name: "Республика Адыгея",
        region: "Северо-Кавказский район",
        image: "https://sdelanounas.ru/i/a/w/1/f_aW1nLmdlbGlvcGhvdG8uY29tL21heWtvcC9tYXlrb3BfMjEuanBnP19faWQ9MTQ0Mzcx.jpeg",
        description: "Плато Лаго-Наки, каньон реки Белой, дольмены, водопады Руфабго, Хаджохская теснина.",
        tags: ["mountains", "canyons", "waterfall"],
        page: "Severo-kavkazskiy_rayon/Adygea.html",
    },
    "Республика Дагестан": {
        name: "Республика Дагестан",
        region: "Северо-Кавказский район",
        image: "https://sdelanounas.ru/i/a/w/1/f_aW1nLmdlbGlvcGhvdG8uY29tL2RlcmJlbnQvMzVfZGVyYmVudC5qcGc_X19pZD0xNDY5MDM=.jpeg",
        description: "Сулакский каньон, Дербентская крепость (ЮНЕСКО), бархан Сарыкум, Каспийское море.",
        tags: ["canyon", "unesco", "sea", "mountains"],
        page: "Severo-kavkazskiy_rayon/Dagestan.html",
    },
    "Республика Ингушетия": {
        name: "Республика Ингушетия",
        region: "Северо-Кавказский район",
        image: "https://img.ixbt.site/live/images/original/08/11/28/2025/07/12/5cf605f0dd.png",
        description: "Боевые башни в горных ущельях, средневековые некрополи, живописные пейзажи.",
        tags: ["towers", "mountains", "history"],
        page: "Severo-kavkazskiy_rayon/Ingushetia.html",
    },
    "Кабардино-Балкарская Республика": {
        name: "Кабардино-Балкарская Республика",
        region: "Северо-Кавказский район",
        image: "https://avatars.mds.yandex.net/get-shedevrum/14906380/img_9dbf60822ea811f0a6e1c69e8a5adaee/orig",
        description: "Гора Эльбрус (5642 м) — высочайшая вершина Европы, Чегемские водопады.",
        tags: ["mountains", "elbrus", "waterfall", "ski"],
        page: "Severo-kavkazskiy_rayon/Kabardino-Balkaria.html",
    },
    "Карачаево-Черкесская Республика": {
        name: "Карачаево-Черкесская Республика",
        region: "Северо-Кавказский район",
        image: "https://mrg-online.ru/wp-content/uploads/2023/09/b0eff0b058f444849a11a3a409686cd4.max-2500x1500-1.jpg",
        description: "Тебердинский заповедник, Домбай, горнолыжные курорты, живописные ущелья.",
        tags: ["mountains", "ski", "reserves"],
        page: "Severo-kavkazskiy_rayon/Karachay-Cherkessia.html",
    },
    "Республика Северная Осетия-Алания": {
        name: "Республика Северная Осетия-Алания",
        region: "Северо-Кавказский район",
        image: "https://s15.stc.all.kpcdn.net/russia/wp-content/uploads/2022/07/interesnye-mesta-v-severnoj-osetii-vladikavkaz.jpg",
        description: "Кармадонское ущелье, Мидаграбинские водопады, средневековые башни.",
        tags: ["mountains", "waterfall", "history"],
        page: "Severo-kavkazskiy_rayon/Severnaya_Osetia.html",
    },
    "Ставропольский край": {
        name: "Ставропольский край",
        region: "Северо-Кавказский район",
        image: "https://bron-top.ru/f/places/264/pjatigorsk.jpeg",
        description: "Кавказские Минеральные Воды (Кисловодск, Пятигорск, Ессентуки), санатории.",
        tags: ["springs", "sanatorium", "mountains"],
        page: "Severo-kavkazskiy_rayon/Stavropol.html",
    },

    // === ЮЖНЫЙ ===
    "Краснодарский край": {
        name: "Краснодарский край",
        region: "Южный район",
        image: "https://avatars.mds.yandex.net/i?id=da4c7c5b5a9261d4267ed2bfd6d938cd_l-5236381-images-thumbs&n=13",
        description: "Черное море, Сочи, Абрау-Дюрсо, субтропики, винодельни.",
        tags: ["sea", "beach", "mountains", "wine"],
        page: "Yuzhniy_rayon/Krasnodar.html",
    },
    "Ростовская область": {
        name: "Ростовская область",
        region: "Южный район",
        image: "https://bogoslov.ru/data/2024/03/19/1661475146_54-celes-.jpg/1661475146_54-celes-.jpg",
        description: "Ростов-на-Дону, станицы донских казаков, Таганрог (родина Чехова).",
        tags: ["city", "cossacks", "history"],
        page: "Yuzhniy_rayon/Rostovskaya_oblast.html",
    },
    "Республика Крым": {
        name: "Республика Крым",
        region: "Южный район",
        image: "https://avatars.mds.yandex.net/i?id=917ef89949fc9dc4dac6f4c88bf85bac_l-3028607-images-thumbs&n=13",
        description: "Ласточкино гнездо, Севастополь, Ай-Петри, Ханский дворец, винодельни.",
        tags: ["sea", "history", "mountains", "wine"],
        page: "Yuzhniy_rayon/Crimea.html",
    },
    "Волгоградская область": {
        name: "Волгоградская область",
        region: "Южный район",
        image: "https://avatars.mds.yandex.net/i?id=d73f33ac17206f9a9cbdd2c222bd172c_l-4901575-images-thumbs&n=13",
        description: "Мамаев курган, Родина-мать, Волга, место Сталинградской битвы.",
        tags: ["military-history", "museums", "rivers"],
        page: "Yuzhniy_rayon/Volgogradskaya_oblast.html",
    },
    "г. Севастополь": {
        name: "г. Севастополь",
        region: "Южный район",
        image: "https://forpostsevastopol.ru/wp-content/uploads/2016/09/k2_items_src_4484cda0e2a1bf5b50fe1938e92660a9.jpg",
        description: "Херсонес Таврический (ЮНЕСКО), Графская пристань, Панорама обороны Севастополя, Сапун-гора, бухты.",
        tags: ["sea", "history", "unesco"],
        page: "Yuzhniy_rayon/Sevastopol.html",
    },

    // === УРАЛЬСКИЙ ===

    "Удмуртская Республика": {
        name: "Удмуртская Республика",
        region: "Уральский район",
        image: "https://izhevsk.cosmosgroup.ru/api/optimized_proxy/https/site-m25.cosmosgroup.ru/files/hotel_service_blocks/369_1752588065.webp",
        description: "Ижевск — родина Калашникова (музей автомата), архитектура Роденевского, Нечкинский парк.",
        tags: ["museums", "city", "history"],
        page: "Ural_rayon/Udmurtia.html",
    },
    "Курганская область": {
        name: "Курганская область",
        region: "Уральский район",
        image: "https://avatars.mds.yandex.net/i?id=2edd1509e24ca2dc497063ef144208e0_l-7549266-images-thumbs&n=13",
        description: "Центр Илизарова, Далматовский монастырь, курганская свинина, озеро Медвежье.",
        tags: ["river-lake", "monasteries"],
        page: "Ural_rayon/Kurganskaya_oblast.html",
    },
    "Оренбургская область": {
        name: "Оренбургская область",
        region: "Уральский район",
        image: "https://ic.pics.livejournal.com/zdorovs/16627846/1771371/1771371_original.jpg",
        description: "Оренбургский пуховый платок, Беловка (горный массив), Соль-Илецк с солёными озёрами, Бузулукский бор.",
        tags: ["steppe", "river-lake", "forest", "history"],
        page: "Ural_rayon/Orenburgskaya_oblast.html",
    },
    "Республика Башкортостан": {
        name: "Республика Башкортостан",
        region: "Уральский район",
        image: "https://avatars.mds.yandex.net/get-altay/14064514/2a00000192725feab0e6f7027b247f4885a1/orig",
        description: "Гора Иремель, пещеры Капова и Шульган-Таш, национальный парк Башкирия.",
        tags: ["mountains", "caves", "nature"],
        page: "Ural_rayon/Bashkortostan.html",
    },
    "Пермский край": {
        name: "Пермский край",
        region: "Уральский район",
        image: "https://avatars.mds.yandex.net/i?id=5439cd4093215ba6c0c6f8f70af93350_l-9181263-images-thumbs&n=13",
        description: "Кунгурская ледяная пещера, архитектурный ансамбль Усолья, река Чусовая.",
        tags: ["caves", "rivers", "history"],
        page: "Ural_rayon/Perm.html",
    },
    "Свердловская область": {
        name: "Свердловская область",
        region: "Уральский район",
        image: "https://avatars.mds.yandex.net/get-altay/9954022/2a00000189de41b34a1cecc6fc1962f75d40/XXXL",
        description: "Екатеринбург, граница Европы и Азии, Невьянская башня.",
        tags: ["city", "border", "history"],
        page: "Ural_rayon/Sverdlovskaya_oblast.html",
    },
    "Челябинская область": {
        name: "Челябинская область",
        region: "Уральский район",
        image: "https://www.atorus.ru/sites/default/files/styles/head_carousel/public/2021-09/195b10.jpg.webp?itok=ppkUaILv",
        description: "Озеро Тургояк, национальный парк Таганай, Аркаим — древнее городище.",
        tags: ["river-lake", "mountains", "archaeology"],
        page: "Ural_rayon/Chelyabinskaya_oblast.html",
    },

        // === ПОВОЛЖСКИЙ ===
    "Республика Татарстан": {
        name: "Республика Татарстан",
        region: "Поволжский район",
        image: "https://avatars.mds.yandex.net/i?id=4a64b53fc57ddca698c75b426b6de8b8_l-10551030-images-thumbs&n=13",
        description: "Казанский кремль (ЮНЕСКО), остров-град Свияжск, Булгар, Волга.",
        tags: ["unesco", "kremlin", "history", "rivers"],
        page: "Povolzhye_rayon/Tatarstan.html"  
    },
    "Республика Калмыкия": {
        name: "Республика Калмыкия",
        region: "Поволжский район",
        image: "https://avatars.mds.yandex.net/i?id=a3146c5dc8056cdc51111082f5e88d78_l-12511685-images-thumbs&n=13",
        description: "Единственный буддийский регион Европы: Элиста с Золотой обителью Будды Шакьямуни, пагоды, пустынные ландшафты, озеро Маныч-Гудило.",
        tags: ["buddhism", "steppe", "desert", "culture"],
        page: "Povolzhye_rayon/Kalmykia.html",
    },
    "Aстраханская область": {
        name: "Астраханская область",
        region: "Поволжский район",
        image: "https://cdn.culture.ru/images/04d637b4-1192-59bf-bce6-fb017e9c26fd",
        description: "Астраханский кремль, дельта Волги, лотосы, заповедник, Каспийское море, рыбалка.",
        tags: ["kremlin", "river-lake", "reserves", "sea"],
        page: "Povolzhye_rayon/Astrakhanskaya_oblast.html",
    },
    "Пензенская область": {
        name: "Пензенская область",
        region: "Поволжский район",
        image: "https://media-prog-l.magput.ru/a8eaff50-5e28-46b6-941b-8af9dcd1ad25.jpg",
        description: "Музей одной картины, Тарханы — усадьба Лермонтова, Пензенская картинная галерея.",
        tags: ["literature", "museums", "estates"],
        page: "Povolzhye_rayon/Penzenskaya_oblast.html",
    },
    "Самарская область": {
        name: "Самарская область",
        region: "Поволжский район",
        image: "https://ic.pics.livejournal.com/zdorovs/16627846/1569872/1569872_original.jpg",
        description: "Самарская Лука (Жигулёвские горы), бункер Сталина, набережная Волги, ракета-носитель «Союз».",
        tags: ["volga", "mountains", "reserves", "space"],
        page: "Povolzhye_rayon/Samarskaya_oblast.html",
    },
    "Саратовская область": {
        name: "Саратовская область",
        region: "Поволжский район",
        image: "https://a.d-cd.net/vWAAAgD7--A-1920.jpg",
        description: "Саратовский мост через Волгу, набережная Космонавтов, музей Чернышевского, парк «Кумысная поляна», Энгельс.",
        tags: ["volga", "city", "museums"],
        page: "Povolzhye_rayon/Saratovskaya_oblast.html",
    },
    "Ульяновская область": {
        name: "Ульяновская область",
        region: "Поволжский район",
        image: "https://ic.pics.livejournal.com/zdorovs/16627846/1007707/1007707_original.jpg",
        description: "Родина Ленина (мемориал), музей-заповедник «Родина В.И. Ленина», Волга, Сенгилеевские горы.",
        tags: ["volga", "history", "mountains"],
        page: "Povolzhye_rayon/Ulyanovskaya_oblast.html",
    },


    // === НОВЫЕ РЕГИОНЫ (Южный макрорегион) ===
    "Донецкая Народная Республика": {
        name: "Донецкая Народная Республика",
        region: "Новые регионы",
        image: "https://avatars.mds.yandex.net/i?id=1edc28cde8505b12e8d54ff84cb79828_l-12484740-images-thumbs&ref=rim&n=13&w=800&h=620",
        description: "Донецк — город роз и угля, Святогорская лавра, курган Саур-Могила, парк кованых фигур.",
        tags: ["history", "monasteries", "military-history"],
        page: "New-regions/Donetsk.html",
        
    },
    "Луганская Народная Республика": {
        name: "Луганская Народная Республика",
        region: "Новые регионы",
        image: "https://sun9-63.userapi.com/impf/2xnWvQrMan2R19s-JuipSUhZIRXUcwwQ1pXR6w/Xm8TwFMbG7E.jpg?size=1280x548&quality=96&sign=d1542a991b65f5023e9de062d6287624&c_uniq_tag=bEClHSQ-BwaDqeIOMmRC3rZ4_QbTLEDDNZzJwKnVmA4&type=album",
        description: "Луганск — столица, музей авиации, завод «Лугансктепловоз», Стрелецкая степь.",
        tags: ["history", "steppe"],
        page: "New-regions/Lugansk.html",
    },
    "Запорожская область": {
        name: "Запорожская область",
        region: "Новые регионы",
        image: "https://berdyansk-news.ru/img/20230831/1fe9443c3cf1a520171adc870ecc70b5.jpg",
        description: "Остров Хортица с казацкой историей, заповедник Каменная Могила, Азовское море, Бердянск.",
        tags: ["history", "sea", "reserves"],
        page: "New-regions/Zaporozhskaya_oblast.html",
    },
    "Херсонская область": {
        name: "Херсонская область",
        region: "Новые регионы",
        image: "https://cdn2.opendemocracy.net/media/images/2CC97DN.width-2050.jpg",
        description: "Аскания-Нова — уникальный заповедник, Днепр, Арабатская стрелка, Чёрное море.",
        tags: ["reserves", "sea", "steppe"],
        page: "New-regions/Khersonskaya_oblast.html",
    }
};

// ========== ОСНОВНЫЕ 6 СУБЪЕКТОВ (ПО УМОЛЧАНИЮ) ==========
const defaultSubjects = [
    "Камчатский край",
    "Республика Карелия",
    "Республика Алтай",
    "Иркутская область",
    "Республика Крым",
    "Краснодарский край"
];

// ========== ОТОБРАЖЕНИЕ КАРТОЧЕК ==========
function renderCards(subjectNames) {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    if (!subjectNames || subjectNames.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <div style="font-size: 64px; margin-bottom: 20px;">🔍</div>
                <h3>Ничего не найдено</h3>
                <p>Попробуйте изменить запрос</p>
            </div>
        `;
        return;
    }
    
    let cardsHtml = '';
    for (const name of subjectNames) {
        const subject = subjectsDatabase[name];
        
        if (subject) {
            cardsHtml += `
                <div class="result-card">
                    <div class="card-image" style="background-image: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('${subject.image}');"></div>
                    <div class="card-content">
                        <div class="card-header">
                            <div class="card-title">${subject.name}</div>
                            
                        </div>
                        <div class="card-region">${subject.region}</div>
                        <p class="card-desc">${subject.description.substring(0, 120)}...</p>
                        <button class="card-button" data-region="${subject.name}" data-page="${subject.page || ''}">Подробнее</button>
                    </div>
                </div>
            `;
        } else {
            cardsHtml += `
                <div class="result-card">
                    <div class="card-image" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1544551763-46a013bb70d5');"></div>
                    <div class="card-content">
                        <div class="card-header">
                            <div class="card-title">${name}</div>
                            <div class="card-rating">Новый</div>
                        </div>
                        <div class="card-region">Регион России</div>
                        <p class="card-desc">Уникальный регион России с богатой историей и природой.</p>
                        <button class="card-button" data-region="${name}">Подробнее</button>
                    </div>
                </div>
            `;
        }
    }
    
    container.innerHTML = cardsHtml;
    
  
    document.querySelectorAll('.card-button').forEach(btn => {
        btn.addEventListener('click', function() {
            const regionName = this.dataset.region;
            const page = this.dataset.page;
            
            if (page && page !== '') {
                // Если указана страница - переходим на неё
                window.location.href = page;
            } else {
                // Если страница не указана - показываем сообщение
                alert(`Вы выбрали: ${regionName}\n\nСтраница региона в разработке.`);
            }
        });
    });
}

// ========== ОТПРАВКА ЗАПРОСА НА БЭКЕНД ==========
// Бэкенд получает запрос, отправляет в ML, ML возвращает массив названий субъектов (от 1 до 6)
// Бэкенд возвращает этот массив фронту, фронт вызывает updateResultsFromML()
async function sendQueryToBackend(query, tags) {
    try {
        // Стучимся на шлюз Дани (порт 8000). Если у вас бэк на 8002 — поменяй порт на 8002.
        const response = await fetch('/api/ai/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ query, tags })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Рекомендации от ML:", data);
            
            // Вытаскиваем массив строк ['Регион 1', 'Регион 2'] из объекта ответа ИИ
            const subjectNames = data && data.regions ? data.regions : (Array.isArray(data) ? data : []);
            
            // Скачиваем очищенный массив строк в родную функцию Евы
            renderCards(subjectNames); 
            
        } else {
            console.error('Ошибка бэкенда:', response.status);
            renderCards(defaultSubjects);
        }
    } catch (error) {
        console.error('Ошибка сети при запросе к ИИ:', error);
        renderCards(defaultSubjects);
    }
}

// ========== ПОИСК ==========
function performSearch(e) {
    // ЗАЩИТА: Если функция вызвана через клик или Enter, останавливаем перезагрузку страницы!
    if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
    }

    const query = document.getElementById('aiQuery').value.trim();
    const activeTags = Array.from(document.querySelectorAll('.tag.active'))
        .map(tag => tag.dataset.tag);
    
    if (!query && activeTags.length === 0) {
        renderCards(defaultSubjects);
        return;
    }
    
    sendQueryToBackend(query, activeTags);
}

// ========== ИНИЦИАЛИЗАЦИЯ ТЕГОВ ==========
function initTags() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('active');
            performSearch();
        });
    });
}

// ========== КАРТА И ТУЛТИПЫ ==========
document.addEventListener('DOMContentLoaded', function() {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.id = 'tooltip';
    document.body.appendChild(tooltip);
    
    function getEconomicClass(element) {
        const classes = element.getAttribute('class')?.split(' ') || [];
        for (let cls of classes) {
            if (cls.startsWith('ekran')) return cls;
        }
        return null;
    }
    
    function getEconomicName(className) {
        const names = {
            ekran1: 'Северный', ekran2: 'Северо-Западный', ekran3: 'Центральный',
            ekran4: 'Волго-Вятский', ekran5: 'Центрально-Чернозёмный', ekran6: 'Поволжский',
            ekran7: 'Северо-Кавказский', ekran8: 'Уральский', ekran9: 'Западно-Сибирский',
            ekran10: 'Восточно-Сибирский', ekran11: 'Дальневосточный', ekran12: 'Калининградский'
        };
        return names[className] || 'Неизвестный район';
    }
    
    function clearActiveRegions() {
        document.querySelectorAll('.map-container path[class*="ekran"]').forEach(el => {
            el.classList.remove('active');
        });
    }
    
    setTimeout(function() {
        const paths = document.querySelectorAll('.map-container path[class*="ekran"]');
        console.log('Найдено регионов:', paths.length);
        
        paths.forEach(path => {
            path.addEventListener('mouseenter', function(e) {
                const economicClass = getEconomicClass(this);
                if (!economicClass) return;
                clearActiveRegions();
                document.querySelectorAll(`.map-container path.${economicClass}`).forEach(el => {
                    el.classList.add('active');
                });
                tooltip.textContent = getEconomicName(economicClass);
                tooltip.classList.add('active');
            });
            
            path.addEventListener('mousemove', function(e) {
                tooltip.style.left = e.clientX + 'px';
                tooltip.style.top = (e.clientY - 40) + 'px';
            });
            
            path.addEventListener('mouseleave', function() {
                clearActiveRegions();
                tooltip.classList.remove('active');
            });
            
            path.addEventListener('click', function() {
                const economicClass = getEconomicClass(this);
                if (!economicClass) return;
                const regionName = getEconomicName(economicClass);
                
                const links = {
                    'Центральный': 'Central_rayon/Central_rayon.html',
                    'Центрально-Чернозёмный': 'Central-chernozem_rayon/Central-chernozem_rayon.html',
                    'Дальневосточный': 'Dalnevostochny_rayon/Dalnevostochny_rayon.html',
                    'Калининградский': 'Kaliningradskiy_rayon/Kaliningradskiy_rayon.html',
                    'Новые регионы': 'New-regions/New-regions.html',
                    'Поволжский': 'Povolzhye_rayon/Povolzhye_rayon.html',
                    'Северный': 'Severniy_rayon/Severniy_rayon.html',
                    'Северо-Кавказский': 'Severo-kavkazskiy_rayon/Severo-kavkazskiy_rayon.html',
                    'Северо-Западный': 'Severo-zapad_rayon/Severo-zapad_rayon.html',
                    'Уральский': 'Ural_rayon/Ural_rayon.html',
                    'Волго-Вятский': 'Volgo-vyatskiy_rayon/Volgo-vyatskiy_rayon.html',
                    'Восточно-Сибирский': 'Vostochno-sibirskiy_rayon/Vostochno-sibirskiy_rayon.html',
                    'Южный': 'Yuzhnii_rayon/Yuzhnii_rayon.html',
                    'Западно-Сибирский': 'Zapadno-sibirskiy_rayon/Zapadno-sibirskiy_rayon.html'
                };
                
                if (links[regionName]) {
                    window.location.href = links[regionName];
                } else {
                    alert(`Страница для района "${regionName}" в разработке`);
                }
            });
        });
    }, 500);
});

// ========== СТРЕЛОЧКА НАВЕРХ ==========
const scrollTopArrow = document.createElement('div');
scrollTopArrow.className = 'scroll-top-arrow';
scrollTopArrow.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollTopArrow);

const arrowStyles = document.createElement('style');
arrowStyles.textContent = `
    .scroll-top-arrow {
        position: fixed;
        bottom: 120px;
        right: 50px;
        width: 50px;
        height: 50px;
        background-color: #4CAF50;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(76,175,80,0.3);
        transition: all 0.3s ease;
        z-index: 998;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
    }
    .scroll-top-arrow.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    .scroll-top-arrow:hover {
        background-color: #388E3C;
        transform: scale(1.1);
    }
    .loading-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px;
        background: white;
        border-radius: 20px;
    }
    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #e0e0e0;
        border-top-color: #4CAF50;
        border-radius: 50%;
        margin: 0 auto 20px;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px;
        background: white;
        border-radius: 20px;
    }
    @media (max-width: 768px) {
        .scroll-top-arrow {
            bottom: 100px;
            right: 20px;
            width: 45px;
            height: 45px;
            font-size: 20px;
        }
    }
`;
document.head.appendChild(arrowStyles);

window.addEventListener('scroll', function() {
    scrollTopArrow.classList.toggle('show', window.scrollY > 300);
});

scrollTopArrow.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== МАСКОТ ==========
const mascotEl = document.getElementById('mascot');
if (mascotEl) {
    mascotEl.addEventListener('click', function() {
        this.style.animation = 'none';
        this.style.transform = 'scale(1.3) rotate(15deg)';
        setTimeout(() => {
            this.style.animation = 'float 6s ease-in-out infinite';
            this.style.transform = 'scale(1) rotate(0deg)';
        }, 500);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== ЗАПУСК ==========
document.addEventListener('DOMContentLoaded', function() {
    initTags();
    
    const searchBtn = document.getElementById('searchBtn');
    const aiQueryInput = document.getElementById('aiQuery');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => performSearch(e));
    }
    if (aiQueryInput) {
        aiQueryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    // Показываем 6 основных субъектов
    renderCards(defaultSubjects);
});

// Экспорт для бэкенда
window.renderCards = renderCards;
window.subjectsDatabase = subjectsDatabase;

// ========== УПРАВЛЕНИЕ АВТОРИЗАЦИЕЙ ==========
    function updateAuthUI() {
        const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        const authButtons = document.getElementById('authButtons');
        const userProfile = document.getElementById('userProfile');
        const userNameSpan = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');

        if (accessToken) {
            if (authButtons) authButtons.style.display = 'none';
            if (userProfile) userProfile.style.display = 'flex';

            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const username = userData.name ||
                userData.username ||
                (userData.email ? userData.email.split('@')[0] : 'Пользователь');

            if (userNameSpan) userNameSpan.textContent = username;
            if (userAvatar) userAvatar.textContent = username.charAt(0).toUpperCase();
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
        }
    }

    window.saveUserData = function(userData, tokens) {
        if (tokens && tokens.access) {
            localStorage.setItem('accessToken', tokens.access);
            if (tokens.refresh) localStorage.setItem('refreshToken', tokens.refresh);
        }
        if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData));
        }
        updateAuthUI();
    };

    window.logout = function() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        sessionStorage.removeItem('accessToken');
        updateAuthUI();
        window.location.reload();
    };

    // Выпадающее меню профиля
    document.addEventListener('click', function(e) {
        const profile = document.getElementById('userProfile');
        if (profile && profile.contains(e.target)) {
            const menu = document.getElementById('profileMenu');
            if (menu) {
                menu.classList.toggle('show');
            } else {
                const newMenu = document.createElement('div');
                newMenu.id = 'profileMenu';
                newMenu.className = 'profile-dropdown';
                newMenu.innerHTML = `
                    <a href="profile.html">👤 Мой профиль</a>
                    <a href="my-trips.html">✈️ Мои поездки</a>
                    <hr>
                    <a href="#" onclick="window.logout()">🚪 Выйти</a>
                `;
                document.body.appendChild(newMenu);
                const rect = profile.getBoundingClientRect();
                newMenu.style.position = 'fixed';
                newMenu.style.top = rect.bottom + 5 + 'px';
                newMenu.style.right = window.innerWidth - rect.right + 'px';
                newMenu.style.background = 'white';
                newMenu.style.borderRadius = '12px';
                newMenu.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                newMenu.style.padding = '8px 0';
                newMenu.style.minWidth = '180px';
                newMenu.style.zIndex = '1001';
                newMenu.style.display = 'block';

                newMenu.querySelectorAll('a').forEach(link => {
                    link.style.display = 'block';
                    link.style.padding = '10px 20px';
                    link.style.color = '#333';
                    link.style.textDecoration = 'none';
                    link.style.fontSize = '14px';
                    link.addEventListener('mouseenter', () => link.style.background = '#f5f5f5');
                    link.addEventListener('mouseleave', () => link.style.background = 'white');
                });

                setTimeout(() => {
                    document.addEventListener('click', function closeMenu(e) {
                        if (!profile.contains(e.target) && !newMenu.contains(e.target)) {
                            newMenu.remove();
                            document.removeEventListener('click', closeMenu);
                        }
                    });
                }, 0);
            }
        }
    });

    // Инициализация при загрузке
    document.addEventListener('DOMContentLoaded', function() {
        updateAuthUI();
    });
