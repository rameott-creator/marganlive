// ─────────────────────────────────────────────────────────────
// Полутон — данные форума.
// Время генерируется относительно момента загрузки,
// поэтому «2 часа назад» выглядит естественно всегда.
// ─────────────────────────────────────────────────────────────

export type CategoryId = 'tech' | 'dev' | 'games' | 'digital' | 'talk' | 'offtop';
export type ReactionId = 'useful' | 'heart' | 'fire';

export interface Category {
  id: CategoryId;
  name: string;
  hint: string;
  icon: string;
}

export interface Author {
  id: string;
  name: string;
  handle: string;
  role?: string;
  rep: number;
  hue: number;
}

export interface Post {
  id: string;
  authorId: string;
  createdAt: string;
  body: string;
  reactions: Record<ReactionId, number>;
}

export interface Topic {
  id: string;
  category: CategoryId;
  title: string;
  excerpt: string;
  authorId: string;
  createdAt: string;
  tags: string[];
  views: number;
  pinned?: boolean;
  posts: Post[];
}

const now = Date.now();
const ago = (hours: number) => new Date(now - hours * 3600_000).toISOString();

export const CATEGORIES: Category[] = [
  { id: 'tech',    name: 'Технологии',    hint: 'железо, сети, homelab и всё, что шуршит вентилятором', icon: 'cpu' },
  { id: 'dev',     name: 'Разработка',    hint: 'код, инструменты, процессы и рабочие привычки',        icon: 'code' },
  { id: 'games',   name: 'Игры',          hint: 'кооперативы по вечерам, воспоминания и новинки',       icon: 'gamepad' },
  { id: 'digital', name: 'Цифровая жизнь',hint: 'как устроен ваш цифровой быт без лишнего шума',        icon: 'wifi' },
  { id: 'talk',    name: 'Обсуждение',    hint: 'серьёзные и несерьёзные разговоры на все темы',        icon: 'chat' },
  { id: 'offtop',  name: 'Оффтоп',        hint: 'всё, что не влезло в разделы, но просилось',           icon: 'coffee' },
];

export const categoryById = (id: CategoryId): Category =>
  CATEGORIES.find((c) => c.id === id)!;

export const AUTHORS: Author[] = [
  { id: 'kirasok',  name: 'Кира Соколова',  handle: '@kirasok',  role: 'вы',                 rep: 1240, hue: 265 },
  { id: 'mlesnoy',  name: 'Михаил Лесной',  handle: '@mlesnoy',  role: 'постоянный участник', rep: 2380, hue: 205 },
  { id: 'dvetrov',  name: 'Даниил Ветров',  handle: '@dvetrov',                              rep: 940,  hue: 24  },
  { id: 'agrey',    name: 'Алиса Грей',     handle: '@agrey',    role: 'модератор',          rep: 5200, hue: 340 },
  { id: 'tkarasev', name: 'Тимур Карасев',  handle: '@tkarasev',                              rep: 610,  hue: 150 },
  { id: 'pershova', name: 'Полина Ершова',  handle: '@pershova', role: 'постоянный участник', rep: 1730, hue: 55  },
  { id: 'slansky',  name: 'Сергей Ланской', handle: '@slansky',                               rep: 320,  hue: 290 },
  { id: 'emarinina',name: 'Ева Маринина',   handle: '@emarinina',                             rep: 2890, hue: 180 },
];

export const authorById = (id: string): Author =>
  AUTHORS.find((a) => a.id === id) ?? AUTHORS[0];

export const ME_ID = 'kirasok';

export const REACTION_META: { id: ReactionId; label: string; icon: string }[] = [
  { id: 'useful', label: 'Полезно', icon: 'lightbulb' },
  { id: 'heart',  label: 'Согласен', icon: 'heart' },
  { id: 'fire',   label: 'Огонь',    icon: 'flame' },
];

export const SEED_TOPICS: Topic[] = [
  {
    id: 't-setup-pc',
    category: 'tech',
    title: 'Перенёс домашний сервер на мини-ПК — вот что изменилось',
    excerpt: 'Был старенький десктоп-робот размером с микроволновку, стал скромный коробок под телевизором. Тишина, 9 ватт в простое и несколько граблей, на которые я наступил.',
    authorId: 'mlesnoy',
    createdAt: ago(3),
    tags: ['homelab', 'железо', 'linux'],
    views: 2841,
    posts: [
      { id: 'p-setup-1', authorId: 'mlesnoy', createdAt: ago(3), body: 'Кратко по железу: Ryzen 5 5600U, 16 ГБ распаянной памяти, NVMe 1 ТБ и внешний USB-бокс под бэкап. Шумит — то есть вообще не шумит. В простое тянет 9 ватт, под нагрузкой сферического Jellyfin — до 28.', reactions: { useful: 34, heart: 12, fire: 6 } },
      { id: 'p-setup-2', authorId: 'dvetrov', createdAt: ago(2.4), body: 'USB-бокс под бэкап — узкое место, если диск засыпает: первый доступ к файлам после пробуждения может ждать секунд 10. Я лечил hdparm, но у внешних коробочек капризный APM, проще прописать cron на обращение раз в час.', reactions: { useful: 18, heart: 4, fire: 1 } },
      { id: 'p-setup-3', authorId: 'kirasok', createdAt: ago(1.8), body: 'Покажите, как вы решаете вопрос с аптаймом при отключении электричества. У меня упска хватает минут на 12, и это боль для NVR-сценария.', reactions: { useful: 2, heart: 1, fire: 0 } },
      { id: 'p-setup-4', authorId: 'mlesnoy', createdAt: ago(1.1), body: 'Кира, я поставил NUT и маленький упска-шлемник: при пропадании сети сервер сам гасится через 3 минуты. В мире домашних серверов три минуты ожидания — это вечность, которой хватает за глаза.', reactions: { useful: 11, heart: 6, fire: 2 } },
    ],
  },
  {
    id: 't-desk-setup',
    category: 'tech',
    title: 'Покажите рабочий сетап, которым вы правда довольны',
    excerpt: 'Не один день в фотошопе, а тот самый: который пережил переезд, смену мотивации и плохие утра. Свет, кабели, стул — всё честно.',
    authorId: 'pershova',
    createdAt: ago(6),
    tags: ['сетап', 'стол', 'кабели'],
    views: 3120,
    posts: [
      { id: 'p-desk-1', authorId: 'emarinina', createdAt: ago(5), body: 'Мой ответ: глубокий стол 80 см и никаких кронштейнов. Монитор стоит на подставке, под ней документы, которые не хочется нести в сканер. Звук — маленький полевой усилитель и пара бумажных полочных колонок. Странно, но именно эта комбинация не утомляет за 10 часов.', reactions: { useful: 21, heart: 15, fire: 8 } },
      { id: 'p-desk-2', authorId: 'dvetrov', createdAt: ago(4.6), body: 'Кабели убрал в гофру под столешницей, оставил только то, чем реально пользуюсь ежедневно: один USB-C и один USB-A спереди. Всё остальное — «на чёрном ходу». Порядок на столе оказался на 80% про избавление от кабелей, а не про органайзеры.', reactions: { useful: 27, heart: 9, fire: 4 } },
      { id: 'p-desk-3', authorId: 'tkarasev', createdAt: ago(3.9), body: 'Стул важнее монитора. Ищите нормальный рабочий стул, а не «геймерское кресло» — через год спина скажет отдельное спасибо.', reactions: { useful: 19, heart: 13, fire: 0 } },
    ],
  },
  {
    id: 't-linux-month',
    category: 'digital',
    title: 'Переехал на Linux на основном ноутбуке: впечатления спустя месяц',
    excerpt: 'Месяц на Fedora: что поехало сразу, что требовало костылей, сколько раз ловил себя на желании открыть раздел с Windows. И честно про то, к чему пришлось привыкнуть.',
    authorId: 'dvetrov',
    createdAt: ago(9),
    tags: ['linux', 'опыт', 'fedora'],
    views: 3564,
    posts: [
      { id: 'p-linux-1', authorId: 'dvetrov', createdAt: ago(9), body: 'Что поехало сразу: терминал, пакеты, git, вся разработка. Что требовало рук: принтер, шрифты для макетов и один капризный VPN-клиент, у которого не было GUI под Linux. Костыль нашёлся через час, принтер победил лишь на второй день.', reactions: { useful: 29, heart: 8, fire: 3 } },
      { id: 'p-linux-2', authorId: 'slansky', createdAt: ago(8), body: 'Самая частая боль — это не система, а привычные приложения. Если ваш рабочий стек — браузер, редактор кода и терминал, переезд почти незаметен. Если же держитесь на специфичном софте, посчитайте сначала, чем его заменять.', reactions: { useful: 24, heart: 10, fire: 1 } },
      { id: 'p-linux-3', authorId: 'emarinina', createdAt: ago(7.2), body: 'Переезжала на Ubuntu ради интереса, вернулась через две недели: не из-за поломок, а потому что спешка. Дайте себе месяц, не пытайтесь повторить виндовый сценарий один в один — и будет нормально.', reactions: { useful: 15, heart: 11, fire: 0 } },
    ],
  },
  {
    id: 't-projects-graveyard',
    category: 'dev',
    title: 'Как вы организуете свои проекты, чтобы не бросать их через неделю?',
    excerpt: 'У меня папка «проекты» — музей хороших намерений. Интересуют ваши рабочие схемы: как выбрать один, как не потерять контекст и как понять, что пора остановиться.',
    authorId: 'kirasok',
    createdAt: ago(14),
    tags: ['процессы', 'мотивация', 'заметки'],
    views: 1920,
    posts: [
      { id: 'p-proj-1', authorId: 'pershova', createdAt: ago(13), body: 'Правило одного проекта: следующий начинаю только тогда, когда текущий либо выпущен, либо честно признан учебным и закрыт с записью «что поняла». Два активных проекта — уже кладбище третьего.', reactions: { useful: 31, heart: 14, fire: 2 } },
      { id: 'p-proj-2', authorId: 'mlesnoy', createdAt: ago(12), body: 'У меня приём «спящий проект»: вместо удаления — ветка archive/ и один абзац в README о состоянии дел. Возвращаешься через полгода и за 5 минут вспоминаешь, с чего начинал. Это работает лучше любой доски задач.', reactions: { useful: 26, heart: 9, fire: 0 } },
      { id: 'p-proj-3', authorId: 'agrey', createdAt: ago(10.5), body: 'И добавьте в любой проект короткую миссию в один предложение — не «что это», а «зачем я это делаю». Когда мотивация проседает, перечитываешь миссию и либо продолжаешь, либо честно закрываешь. Оба исхода — победа.', reactions: { useful: 22, heart: 17, fire: 3 } },
    ],
  },
  {
    id: 't-ts-discipline',
    category: 'dev',
    title: 'TypeScript в маленьких проектах: дисциплина против скорости',
    excerpt: 'В большом коде TS — это кислород. А в пет-проекте на выходных хочется просто написать и забыть. Где ваша граница: строгий tsconfig с первого коммита или any, пока не больно?',
    authorId: 'emarinina',
    createdAt: ago(20),
    tags: ['typescript', 'архитектура', 'привычки'],
    views: 1547,
    posts: [
      { id: 'p-ts-1', authorId: 'dvetrov', createdAt: ago(19), body: 'Строгий с первого дня, но без религии: strict: true, noUncheckedIndexedAccess выключен в песочницах. any использую только на границах (парсинг внешнего JSON), и всегда с комментарием, почему сознательно.', reactions: { useful: 17, heart: 6, fire: 0 } },
      { id: 'p-ts-2', authorId: 'tkarasev', createdAt: ago(17.3), body: 'В маленьких проектах TS окупается не типами, а автодополнением. Даже `any` с хорошими именами переменных даёт 80% комфорта. Строгость добавляю, когда проект перестаёт быть «на вечер».', reactions: { useful: 9, heart: 8, fire: 1 } },
    ],
  },
  {
    id: 't-codereview-old-self',
    category: 'dev',
    title: 'Как вы ревьюите код, который писали три месяца назад?',
    excerpt: 'Возвращаюсь в свой же репозиторий и думаю: кто это написал и почему здесь так странно? Расскажите приёмы: как быстро восстановить контекст и не ужаснуться.',
    authorId: 'tkarasev',
    createdAt: ago(28),
    tags: ['код-ревью', 'рефакторинг', 'практика'],
    views: 1280,
    posts: [
      { id: 'p-cr-1', authorId: 'agrey', createdAt: ago(27.5), body: 'Правило «сначала читай, потом суди»: прогоняю diff глазами без единого комментария и только потом возвращаюсь и пишу замечания. Первый проход снимает 90% эмоций «что это вообще такое».', reactions: { useful: 20, heart: 12, fire: 0 } },
      { id: 'p-cr-2', authorId: 'slansky', createdAt: ago(25), body: 'Экспортирую переписку/PR-описание в заметки — восстанавливаю не код, а ход мысли. Код — это след, а решение — история. Второе вспоминается куда быстрее, чем разбираешься в первом.', reactions: { useful: 8, heart: 5, fire: 0 } },
    ],
  },
  {
    id: 't-coop-evenings',
    category: 'games',
    title: 'Ищу компанию для кооперативных игр по вечерам',
    excerpt: 'Есть два взрослых человека со стабильным интернетом, диваном и желанием проходить кооперативы. Предпочтительно что-то атмосферное: Portal, It Takes Two, Overcooked. По понедельникам и четвергам, 20:00–22:00 по Москве.',
    authorId: 'kirasok',
    createdAt: ago(1.5),
    tags: ['кооператив', 'вечера'],
    views: 340,
    posts: [],
  },
  {
    id: 't-school-games',
    category: 'games',
    title: 'Семь лет спустя: во что играли в школе и что вспомнилось',
    excerpt: 'Кто-то недавно запустил картридж из детства и накрыло. Давайте поностальгируем без снобизма: что реально держало, а что мы перехвалили в памяти.',
    authorId: 'pershova',
    createdAt: ago(32),
    tags: ['ностальгия', 'воспоминания'],
    views: 2210,
    posts: [
      { id: 'p-sch-1', authorId: 'tkarasev', createdAt: ago(31), body: 'GTA: Vice City на пиратке с диска из магазина «Всё по 50». Перепрошёл ради интереса в прошлом году — половина игры выглядит как интерактивный слайд-шоу. И всё равно тепло.', reactions: { useful: 6, heart: 21, fire: 5 } },
      { id: 'p-sch-2', authorId: 'emarinina', createdAt: ago(30), body: 'CS 1.6 в компьютерном клубе на окраине. Ни одна современная соревновательная игра не даст того чувства, когда вся комната кричит из-за одного клатча.', reactions: { useful: 3, heart: 24, fire: 9 } },
    ],
  },
  {
    id: 't-phone-purge',
    category: 'digital',
    title: 'Цифровые привычки: что удалили из телефона и не пожалели',
    excerpt: 'Раз в полгода устраиваю чистку домашнего экрана. Интересует, что удаляли другие и насколько хватило силы воли не вернуть обратно.',
    authorId: 'agrey',
    createdAt: ago(40),
    tags: ['минимализм', 'фокус', 'привычки'],
    views: 1875,
    posts: [
      { id: 'p-ph-1', authorId: 'kirasok', createdAt: ago(39), body: 'Удалила все новостные пуши и переставила ленту соцсети в браузер вместо приложения. Отличия — колоссальные: «зайти посмотреть» стало в пять раз осознаннее, потому что надо вводить адрес вручную.', reactions: { useful: 18, heart: 13, fire: 2 } },
      { id: 'p-ph-2', authorId: 'mlesnoy', createdAt: ago(36), body: 'Удалил «приложения на всякий случай» — переводчики, сканеры, вторые версии мессенджеров. Оказалось, что 90% из них открывались реже одного раза в год. Храню одну страничку в заметках с альтернативами на случай реальной нужности.', reactions: { useful: 16, heart: 7, fire: 1 } },
    ],
  },
  {
    id: 't-family-archive',
    category: 'digital',
    title: 'Вопрос тем, кто ведёт цифровой архив семьи: чем пользуетесь?',
    excerpt: 'После сортировки бабушкиных коробок поняла, что семейный архив — это целый проект: сканы, подписи, структура папок и нервы. Что у вас работает лучше всего?',
    authorId: 'pershova',
    createdAt: ago(2.2),
    tags: ['архив', 'память'],
    views: 96,
    posts: [],
  },
  {
    id: 't-trip-money',
    category: 'talk',
    title: 'Как вы договариваетесь, кто платит в совместных поездках?',
    excerpt: 'Поездка с друзьями превращается в бухгалтерию, если не договориться заранее. Какие схемы пробовали и что реально спасало от неловкости и таблиц в чате?',
    authorId: 'kirasok',
    createdAt: ago(5),
    tags: ['поездки', 'дружба', 'деньги'],
    views: 780,
    posts: [],
  },
  {
    id: 't-night-rules',
    category: 'talk',
    title: 'Правила, которые у нас появились после ночных разговоров',
    excerpt: 'Некоторые решения мы приняли не на планёрке, а на кухне в час ночи. Делитесь: какие правила уживания/работы/дружбы у вас родились именно так?',
    authorId: 'emarinina',
    createdAt: ago(50),
    tags: ['уют', 'дом', 'разговоры'],
    views: 1432,
    posts: [
      { id: 'p-nr-1', authorId: 'pershova', createdAt: ago(48), body: '«Телефоны в коробку за ужином» родилось после долгого разговора о том, что мы все утыкаемся в экраны за столом. Через месяц привыкли так, что теперь это само собой.', reactions: { useful: 14, heart: 22, fire: 3 } },
      { id: 'p-nr-2', authorId: 'agrey', createdAt: ago(46), body: '«Напоминаем о планах заранее, особенно неприятным» — тоже ночное изобретение. Оказалось, что половина обид вырастает из неозвученных ожиданий.', reactions: { useful: 19, heart: 16, fire: 1 } },
    ],
  },
  {
    id: 't-focus-music',
    category: 'offtop',
    title: 'Что вы слушаете на фоне, пока работаете?',
    excerpt: 'Фоновая музыка, которая помогает думать: эмбиент, джаз, rain sounds, радио? Делитесь конкретными плейлистами и исполнителями — составим общую коллекцию.',
    authorId: 'slansky',
    createdAt: ago(26),
    tags: ['музыка', 'фокус', 'плейлисты'],
    views: 2560,
    posts: [
      { id: 'p-fm-1', authorId: 'emarinina', createdAt: ago(25), body: 'Нейтральный эмбиент без слов — иначе мозг начинает следить за текстом. Хорошо зашли стримы «постепенного дождя + дальний город»: уровень энергии низкий, но не сонный.', reactions: { useful: 13, heart: 10, fire: 4 } },
      { id: 'p-fm-2', authorId: 'dvetrov', createdAt: ago(24), body: 'Джаз для кода — моя гордость. Конкретно: тёмный модал-джаз конца 50-х. Барабаны с щётками не мешают алгоритмам, проверено сотнями часов.', reactions: { useful: 7, heart: 15, fire: 6 } },
      { id: 'p-fm-3', authorId: 'kirasok', createdAt: ago(22), body: 'Люблю радио, записанное с реальной станции (не стрим, а именно запись эфира с диджеем): получается эффект «кто-то рядом», и при этом никакого отвлечения, потому что не обращаешь внимания намеренно.', reactions: { useful: 9, heart: 11, fire: 2 } },
    ],
  },
];

// ── Уведомления ──────────────────────────────────────────────
export interface Notification {
  id: string;
  kind: 'reply' | 'mention' | 'rep' | 'follow';
  text: string;
  time: string;
  topicId?: string;
}

export const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'n-1', kind: 'reply',   text: 'Михаил Лесной ответил в теме «Перенёс домашний сервер на мини-ПК»', time: '23 мин назад', topicId: 't-setup-pc' },
  { id: 'n-2', kind: 'mention', text: 'Кира, вас упомянули в теме «Переехал на Linux…» — кажется, это про вас', time: '2 ч назад', topicId: 't-linux-month' },
  { id: 'n-3', kind: 'rep',     text: 'Ваш ответ получил +10 к репутации: «Правило одного проекта…»', time: '5 ч назад', topicId: 't-projects-graveyard' },
  { id: 'n-4', kind: 'follow',  text: 'Алиса Грей начала следить за темой в ваших закладках', time: 'вчера, 23:41' },
];

// ── Боковая колонка ──────────────────────────────────────────
export const ONLINE_USERS = [
  { id: 'agrey',    status: 'online' as const },
  { id: 'mlesnoy',  status: 'online' as const },
  { id: 'emarinina',status: 'online' as const },
  { id: 'pershova', status: 'online' as const },
  { id: 'dvetrov',  status: 'away'   as const },
  { id: 'tkarasev', status: 'online' as const },
  { id: 'slansky',  status: 'away'   as const },
];

export const COMMUNITY_STATS = [
  { label: 'участников', value: '2 847' },
  { label: 'тем за неделю', value: '132' },
  { label: 'сообщений сегодня', value: '318' },
  { label: 'сейчас на форуме', value: '214' },
];

export const HACKS_ABOUT = [
  'Никаких маркетплейсов и спонсорских постов — только разговоры.',
  'Прежде чем спросить — поищите: вдруг тема уже живёт в соседнем разделе.',
  'Не согласны — спорьте с аргументами, а не с тоном.',
  'Пишите так, чтобы ваш ответ пригодился тому, кто придёт из поиска через год.',
];

// ── Форматтеры ───────────────────────────────────────────────
export const fmtCount = (n: number) => n.toLocaleString('ru-RU');

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'вчера';
  if (days < 5) return `${days} дня назад`;
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}
