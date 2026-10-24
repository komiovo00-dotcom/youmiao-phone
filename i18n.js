'use strict';
/* ============================================================
   中文界面文案 · 日期时间（单语言：简体中文，window.LANG 固定 zh）
   ============================================================ */
const LANG = 'zh';
const STORY = { y: 2026, m: 10, d: 24 };   // 故事发生的“今天”：2026年10月24日 星期六

const UI = {
  /* 通用 */
  home: '主屏幕', now: '现在', cancel: '取消', delete: '删除', back: '返回', edit: '编辑',
  search: '搜索', add: '添加', share: '分享', more: '更多', moreInfo: '更多信息', info: '信息', noInfo: '暂无更多信息',
  all: '全部', allDay: '全天', today: '今天', yesterday: '昨天', noEvents: '无日程', calendars: '日历',
  swipeUp: '向上轻扫以打开', enterPass: '输入密码', emergency: '紧急情况', hintPass: '密码 0805 · 由淼的生日',
  photo: '照片', video: '视频', voiceMsg: '语音消息', msgInput: '发消息',
  giftSent: '送出了礼物。', giftArrived: '礼物到啦', giftItem: '一杯热可可', giftCheck: '查看礼物',
  fileColon: '文件：', expired: '已过期', expPhoto: '照片已过期', expVideo: '视频已过期',
  space: '空格', ret: '换行', searchWeb: '搜索或输入网址', recentSearches: '最近搜索', clear: '清除',
  /* 应用名 */
  app_wechat: '微信', app_phone: '电话', app_photos: '相册', app_xhs: '小红书',
  app_mail: '邮件', app_calendar: '日历', app_clock: '时钟', app_notes: '备忘录',
  app_weather: '天气', app_settings: '设置', app_safari: 'Safari', app_music: '音乐',
  app_maps: '地图', app_recipe: '菜谱',
  /* 微信 */
  chats: '微信', friends: '通讯录', openChat: '发现', shopping: '购物', more2: '更多',
  sendTo: '发消息',
  /* 天气 */
  city: '上海', mostlySunny: '多云转晴', hiLo: '最高 22° 最低 15°', myLoc: '我的位置',
  wxSummary: '今天傍晚云量逐渐减少，夜里偏北风 3 级，适合出门散步，记得给脚脚带上小外套。',
  tenDay: '10 天预报', uv: '紫外线指数', moderate: '中等', sunset: '日落', sunrise: '日出',
  /* 备忘录 / 日历 / 时钟 */
  folders: '文件夹', pinned: '置顶', notesSec: '备忘录', nNotes: '{0} 个备忘录',
  alarm: '闹钟', alarmLabel: '闹钟', sleepWake: '🛏 睡眠 | 起床', noAlarm: '无闹钟', setUp: '设置',
  other: '其他', worldClock: '世界时钟', stopwatch: '秒表', timer: '计时器',
  /* 电话 */
  missed: '未接', recents: '最近通话', mobile: '手机', favorites: '个人收藏', contacts: '通讯录',
  keypad: '拨号键盘', voicemail: '语音留言', calling: '正在呼叫…', callEnded: '通话结束', noAnswer: '无人接听',
  missedCall: '未接来电', slideAnswer: '滑动来接听', decline: '拒绝', accept: '接听',
  speaker: '免提', mute: '静音', addCall: '添加通话', endCall: '挂断', liveCap: '实时字幕',
  inviteVoice: '邀请你语音通话', wechatCall: '微信语音通话', remind: '提醒我', message2: '信息',
  /* 邮件 */
  inbox: '收件箱', mailboxes: '邮箱', updatedNow: '刚刚更新', toMe: '收件人：我 ›',
  /* 照片 */
  library: '图库', select: '选择', nPhotos: '{0} 张照片', years: '年', months: '月', allPhotos: '所有照片',
  screenshot: '{0} · 截屏',
  /* 小红书 */
  posts: '笔记', followers: '粉丝', following: '关注', followingBtn: '已关注 ˅', followingTag: '已关注',
  message: '发消息', bio: '艾斯兔的小宠物 · 莱恩 / 莱财 / 脚脚 🐾', cover: '· 日常',
  likedBy: '{0} 人觉得很赞', origAudio: '♫ 原声 · 莱恩莱财脚脚',
  reels: '视频',
  /* 音乐 */
  songs: '歌曲', libraryMu: '资料库', play: '播放', shuffle: '⤮ 随机播放',
  listenNow: '现在就听', browse: '浏览', radio: '广播', voiceMemo: '语音备忘录',
  /* 地图 */
  m_univ: '剧场区', m_park: '徐家汇公园', m_road: '衡山路', m_back: '剧场后巷', m_alley: '弄堂',
  m_cafe: '咖啡街', m_union: '社区中心', m_lib: '书店', m_gate: '小区正门', m_stream: '蒲汇塘',
  currentLoc: '当前位置', walkMin: '步行 {0} 分钟', minN: '{0} 分钟', favorite: '收藏', favorited: '已收藏',
  searchMaps: '搜索地图', recentsMap: '最近', myLoc: '我的位置',
  /* Safari */
  favoritesSf: '个人收藏', privacyReport: '隐私报告', privacyText: '过去 7 天，Safari 已阻止 <b>12 个跟踪器</b>分析你的浏览记录。',
  readingList: '阅读列表', readingEmpty: '阅读列表为空', aa: '大小',
  sf_portal: '微博', sf_acad: '哔哩哔哩', sf_lib: '口袋48', sf_elearn: '淘宝', sf_pe: '高德地图',
  sf_mail: '微信读书', sf_news: '潇湘阁', sf_shop: '闲鱼',
  /* 设置 / 屏幕使用时间 */
  acct: '账户、iCloud、媒体与购买项目', airplane: '飞行模式', on: '打开', cellular: '蜂窝网络', battery: '电池',
  general: '通用', access: '辅助功能', camera: '相机', wallpaper: '墙纸', notif: '通知',
  sound: '声音与触感', focus: '专注模式', screenTime: '屏幕使用时间', faceid: '面容 ID 与密码', privacy: '隐私与安全性',
  youmiaoIphone: '由淼的 iPhone', dailyAvg: '日均', hm: '{0} 小时 {1} 分钟', mOnly: '{0} 分钟',
  upPct: '比上周增加 {0}%', mostUsed: '最常使用', pickups: '拿起次数', firstPickup: '首次拿起',
  avgPickups: '日均拿起', pickN: '{0} 次', firstUsed: '拿起后首先使用', notifSec: '通知',
  perDay: '日均 {0} 条', wifiName: '由淼家-WiFi', resetProgress: '还原此手机的进度',
  /* 生日 / 文件占位 */
  bdayTitle: '周湘生日 🎂', bdayEvent: '周湘生日', inDays: '{0} 天后',
  f_assign: '公演曲目单.pdf', f_assign2: '公演曲目单_修改版.pdf', f_check: '脚脚训练记录.xlsx',
  /* 邮件模板（正文直接展示，保留键位兼容） */
  mailSchool: '{0}\n\n{1}\n\n——\n此邮件由系统发送，请勿直接回复。',
  mailShop: '{0}\n\n{1}',
};

/* 聊天里 [xxx] 占位符推断用的中文关键词 */
const KIND_WORDS = {
  gift: /礼物|券|礼盒|花束|蛋糕|奶茶/,
  file: /文件|剧本|行程|曲目|表格|资料/,
  video: /视频|片段|花絮|vlog|空镜/,
  audio: /语音/,
  image: /照片|自拍|截图|拍|图|照/,
};

function t(k, ...a) {
  let s = Object.prototype.hasOwnProperty.call(UI, k) ? UI[k] : k;
  a.forEach((v, i) => { s = s.split('{' + i + '}').join(v); });
  return s;
}
const dn = n => (typeof DISPLAY !== 'undefined' && DISPLAY[n]) || n;

/* ---------- 日期 / 时间（固定为简体中文） ---------- */
const _WD = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const _WD_SHORT = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const _WD_NARROW = ['日', '一', '二', '三', '四', '五', '六'];
const _mk = (y, m, d) => new Date(y, m - 1, d, 12, 0);
const _wd = (y, m, d) => _WD[_mk(y, m, d).getDay()];
const _pad2 = n => String(n).padStart(2, '0');

function fmtTime(min) {
  min = ((Math.round(min) % 1440) + 1440) % 1440;
  return _pad2(Math.floor(min / 60)) + ':' + _pad2(min % 60);
}
const fmtFull = (y, m, d) => `${m}月${d}日 ${_wd(y, m, d)}`;
const fmtYMD = (y, m, d) => `${y}年${m}月${d}日`;
const fmtMD = (m, d) => `${m}月${d}日`;
const fmtYM = (y, m) => `${y}年${m}月`;
const fmtMonth = m => `${m}月`;
const fmtYear = y => `${y}年`;
const fmtNum = (y, m, d) => `${y}/${m}/${d}`;
const wdLong = (y, m, d) => _wd(y, m, d);
const wdShort = (y, m, d) => _WD_SHORT[_mk(y, m, d).getDay()];
const wdNarrow = () => _WD_NARROW.slice();
const fmtLockDate = () => `${STORY.m}月${STORY.d}日 ${_wd(STORY.y, STORY.m, STORY.d)}`;
const fmtHour = h => `${h}时`;

function alarmParts(h, mi) {
  return { dp: h < 12 ? '上午' : '下午', tm: (h % 12 || 12) + ':' + _pad2(mi), before: true };
}
function parseLabel(l) {
  let m = l.match(/^(\d{4})年(\d+)月(\d+)日$/);
  if (m) return { y: +m[1], m: +m[2], d: +m[3] };
  m = l.match(/^(\d{4})年(\d+)月$/);
  if (m) return { y: +m[1], m: +m[2] };
  m = l.match(/^(\d+)月(\d+)日$/);
  if (m) return { y: STORY.y, m: +m[1], d: +m[2] };
  return null;
}
function fmtLabel(l, full) {
  if (l === '今天') return full ? fmtFull(STORY.y, STORY.m, STORY.d) : t('today');
  if (l === '昨天') return t('yesterday');
  const p = parseLabel(l);
  if (!p) return l;
  if (!p.d) return fmtYM(p.y, p.m);
  if (full) return fmtFull(p.y, p.m, p.d);
  if (p.m === STORY.m && p.d === STORY.d) return t('today');
  return p.y === STORY.y ? fmtMD(p.m, p.d) : fmtYMD(p.y, p.m, p.d);
}
document.documentElement.lang = 'zh-CN';
