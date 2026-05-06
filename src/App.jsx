
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import {
  Wallet, TrendingUp, TrendingDown, CalendarDays, Plus, Search,
  LogOut, ShieldCheck, Download, Pencil, RotateCcw, Smartphone,
  Loader2, Database, AlertTriangle
} from 'lucide-react';
import { supabase } from './lib/supabaseClient';

const RAW_ROWS = [["2026-04-29", 0, "", 0, "", 0, "", 0, "", 7400, 7400], ["2026-04-30", 29000, "Долг Намес", 68500, "ЗП проф-нн и долг намес", 22500, "Кредит", 22500, "Кредит", 13900, 53400], ["2026-05-01", 0, "", 0, "", 3000, "Подарок тете Ире", 4420, "Пообедали в сиба, мойка мазда и снюс", 10900, 48980], ["2026-05-02", 0, "", 0, "", 1900, "Бензин", 4060, "скинул Намесу(1180) в долг и заборику (480), покупка еды в деревне (2400)", 9000, 44920], ["2026-05-03", 0, "", 0, "", 5000, "Покупка еды", 1559, "Погуляли на набережной + поехали к Димосу", 4000, 43361], ["2026-05-04", 0, "", 0, "", 0, "", 3044, "Закупка еды и компы", 4000, 40317], ["2026-05-05", 40000, "ЗП проф-нн", 1180, "Намес вернул долг от 02.05", 0, "", 33250, "Ремонт ауди", 44000, 8247], ["2026-05-06", 0, "", 0, "", 0, "", 3817, "Магазин, снюс + бильярд 05.05 и бензин", 44000, 4430], ["2026-05-07", 0, "", 0, "", 4000, "Покупка еды", 0, "", 40000, 4430], ["2026-05-08", 145000, "Оплата 4вида (В)", 0, "", 1500, "Бензин", 0, "", 183500, 4430], ["2026-05-09", 0, "", 0, "", 0, "", 0, "", 183500, 4430], ["2026-05-10", 0, "", 0, "", 60000, "ремонт ауди", 0, "", 123500, 4430], ["2026-05-11", 0, "", 0, "", 15000, "Постановка на учет ауди", 0, "", 108500, 4430], ["2026-05-12", 0, "", 0, "", 10000, "развлечения", 0, "", 98500, 4430], ["2026-05-13", 0, "", 0, "", 0, "", 0, "", 98500, 4430], ["2026-05-14", 0, "", 0, "", 3000, "Покупка еды", 0, "", 95500, 4430], ["2026-05-15", 0, "", 0, "", 1500, "Бензин", 0, "", 94000, 4430], ["2026-05-16", 0, "", 0, "", 0, "", 0, "", 94000, 4430], ["2026-05-17", 0, "", 0, "", 0, "", 0, "", 94000, 4430], ["2026-05-18", 35000, "ЗП проф-нн", 0, "", 0, "", 0, "", 129000, 4430], ["2026-05-19", 0, "", 0, "", 0, "", 0, "", 129000, 4430], ["2026-05-20", 0, "", 0, "", 31000, "Оплата Кв", 0, "", 98000, 4430], ["2026-05-21", 0, "", 0, "", 3000, "Покупка еды", 0, "", 95000, 4430], ["2026-05-22", 0, "", 0, "", 1500, "Бензин", 0, "", 93500, 4430], ["2026-05-23", 0, "", 0, "", 5000, "карманные Настя", 0, "", 88500, 4430], ["2026-05-24", 0, "", 0, "", 5000, "карманные Егор", 0, "", 83500, 4430], ["2026-05-25", 75000, "ЗП Настя", 0, "", 11500, "3к маник, 3.5к педикюр, 5к развлечения", 0, "", 147000, 4430], ["2026-05-26", 0, "", 0, "", 0, "", 0, "", 147000, 4430], ["2026-05-27", 0, "", 0, "", 0, "", 0, "", 147000, 4430], ["2026-05-28", 0, "", 0, "", 3500, "Покупка еды", 0, "", 143500, 4430], ["2026-05-29", 0, "", 0, "", 1500, "Бензин", 0, "", 142000, 4430], ["2026-05-30", 60000, "Долг отец Егора", 0, "", 32500, "Кредит + кредитка", 0, "", 169500, 4430], ["2026-05-31", 70000, "4 вида (сайт)", 0, "", 0, "", 0, "", 239500, 4430], ["2026-06-01", 0, "", 0, "", 65000, "долг Дима телефон, долг Егор", 0, "", 174500, 4430], ["2026-06-02", 0, "", 0, "", 5000, "карманные Настя", 0, "", 169500, 0], ["2026-06-03", 0, "", 0, "", 5000, "карманные Егор", 0, "", 164500, 0], ["2026-06-04", 0, "", 0, "", 0, "", 0, "", 164500, 0], ["2026-06-05", 35000, "ЗП проф-нн", 0, "", 0, "", 0, "", 199500, 0], ["2026-06-06", 0, "", 0, "", 5000, "Покупка еды и бензин", 0, "", 194500, 0], ["2026-06-07", 0, "", 0, "", 0, "", 0, "", 194500, 0], ["2026-06-08", 115000, "Оплата 4вида (В)", 0, "", 50000, "Оплата Катя и Оптимизатор", 0, "", 259500, 0], ["2026-06-09", 0, "", 0, "", 7000, "В \"Фонд налогов\"", 0, "", 252500, 0], ["2026-06-10", 50000, "4 вида (сайт)", 0, "", 5000, "ДР заборика (учитываем как развлечение)", 0, "", 297500, 0], ["2026-06-11", 18000, "ЗП Настя", 0, "", 62500, "Долг Егор", 0, "", 253000, 0], ["2026-06-12", 0, "", 0, "", 40000, "Покупка одежды Настя и Егор и карманные каждому", 0, "", 213000, 0], ["2026-06-13", 0, "", 0, "", 6000, "Покупка еды и бензин", 0, "", 207000, 0], ["2026-06-14", 0, "", 0, "", 7000, "ДР отца Егор", 0, "", 200000, 0], ["2026-06-15", 0, "", 0, "", 0, "", 0, "", 200000, 0], ["2026-06-16", 0, "", 0, "", 0, "", 0, "", 200000, 0], ["2026-06-17", 0, "", 0, "", 0, "", 0, "", 200000, 0], ["2026-06-18", 0, "", 0, "", 0, "", 0, "", 200000, 0], ["2026-06-19", 35000, "ЗП проф-нн", 0, "", 7000, "Покупка еды и бензин", 0, "", 228000, 0], ["2026-06-20", 0, "", 0, "", 34000, "развлечения и оплата кв, маникюр Настя", 0, "", 194000, 0], ["2026-06-21", 0, "", 0, "", 0, "", 0, "", 194000, 0], ["2026-06-22", 0, "", 0, "", 5000, "карманные Настя", 0, "", 189000, 0], ["2026-06-23", 0, "", 0, "", 5000, "карманные Егор", 0, "", 184000, 0], ["2026-06-24", 0, "", 0, "", 0, "", 0, "", 184000, 0], ["2026-06-25", 75000, "ЗП Настя", 0, "", 0, "", 0, "", 259000, 0], ["2026-06-26", 0, "", 0, "", 7000, "Покупка еды и бензин", 0, "", 252000, 0], ["2026-06-27", 0, "", 0, "", 5000, "Развлечения", 0, "", 247000, 0], ["2026-06-28", 0, "", 0, "", 0, "", 0, "", 247000, 0], ["2026-06-29", 0, "", 0, "", 8000, "ДР мама Егор", 0, "", 239000, 0], ["2026-06-30", 0, "", 0, "", 85500, "Кредит, долг Яна, долг Родители", 0, "", 153500, 0], ["2026-07-01", 0, "", 0, "", 0, "", 0, "", 153500, 0], ["2026-07-02", 0, "", 0, "", 0, "", 0, "", 153500, 0], ["2026-07-03", 0, "", 0, "", 7000, "Покупка еды и бензин", 0, "", 146500, 0], ["2026-07-04", 0, "", 0, "", 5000, "Развлечения", 0, "", 141500, 0], ["2026-07-05", 0, "", 0, "", 5000, "карманные Настя", 0, "", 136500, 0], ["2026-07-06", 0, "", 0, "", 5000, "карманные Егор", 0, "", 131500, 0], ["2026-07-07", 0, "", 0, "", 0, "", 0, "", 131500, 0], ["2026-07-08", 115000, "Оплата 4вида (В)", 0, "", 50000, "Оплата Катя и Оптимизатор", 0, "", 196500, 0], ["2026-07-09", 0, "", 0, "", 7000, "В \"Фонд налогов\"", 0, "", 189500, 0], ["2026-07-10", 35000, "ЗП проф-нн", 0, "", 7000, "Покупка еды и бензин", 0, "", 217500, 0], ["2026-07-11", 18000, "ЗП Настя", 0, "", 5000, "Развлечения", 0, "", 230500, 0], ["2026-07-12", 0, "", 0, "", 0, "", 0, "", 230500, 0], ["2026-07-13", 0, "", 0, "", 0, "", 0, "", 230500, 0], ["2026-07-14", 0, "", 0, "", 0, "", 0, "", 230500, 0], ["2026-07-15", 0, "", 0, "", 5000, "карманные Настя", 0, "", 225500, 0], ["2026-07-16", 0, "", 0, "", 5000, "карманные Егор", 0, "", 220500, 0], ["2026-07-17", 0, "", 0, "", 7000, "Покупка еды и бензин", 0, "", 213500, 0], ["2026-07-18", 0, "", 0, "", 5000, "Развлечения", 0, "", 208500, 0], ["2026-07-19", 0, "", 0, "", 0, "", 0, "", 208500, 0], ["2026-07-20", 0, "", 0, "", 31000, "Оплата кв", 0, "", 177500, 0], ["2026-07-21", 0, "", 0, "", 3000, "Маникюр Настя", 0, "", 174500, 0], ["2026-07-22", 0, "", 0, "", 0, "", 0, "", 174500, 0], ["2026-07-23", 0, "", 0, "", 0, "", 0, "", 174500, 0], ["2026-07-24", 35000, "ЗП проф-нн", 0, "", 7000, "Покупка еды и бензин", 0, "", 202500, 0], ["2026-07-25", 75000, "ЗП Настя", 0, "", 5000, "Развлечения", 0, "", 272500, 0], ["2026-07-26", 0, "", 0, "", 5000, "карманные Настя", 0, "", 267500, 0], ["2026-07-27", 0, "", 0, "", 5000, "карманные Егор", 0, "", 262500, 0], ["2026-07-28", 0, "", 0, "", 0, "", 0, "", 262500, 0], ["2026-07-29", 0, "", 0, "", 0, "", 0, "", 262500, 0], ["2026-07-30", 0, "", 0, "", 32500, "Кредит + кредитка", 0, "", 230000, 0], ["2026-07-31", 0, "", 0, "", 0, "", 0, "", 230000, 0], ["2026-08-01", 0, "", 0, "", 0, "", 0, "", 230000, 0]];

const toSeedRows = (userId) => RAW_ROWS.map((r) => ({
  user_id: userId,
  day: r[0],
  income_plan: r[1] || 0,
  income_plan_comment: r[2] || '',
  income_fact: r[3] || 0,
  income_fact_comment: r[4] || '',
  expense_plan: r[5] || 0,
  expense_plan_comment: r[6] || '',
  expense_fact: r[7] || 0,
  expense_fact_comment: r[8] || '',
  balance_plan: r[9] || 0
}));

const toUiRow = (r) => ({
  id: r.id,
  date: r.day,
  incomePlan: Number(r.income_plan || 0),
  incomePlanComment: r.income_plan_comment || '',
  incomeFact: Number(r.income_fact || 0),
  incomeFactComment: r.income_fact_comment || '',
  expensePlan: Number(r.expense_plan || 0),
  expensePlanComment: r.expense_plan_comment || '',
  expenseFact: Number(r.expense_fact || 0),
  expenseFactComment: r.expense_fact_comment || '',
  balancePlan: Number(r.balance_plan || 0),
});

const toDbPatch = (row) => ({
  income_fact: Number(row.incomeFact || 0),
  income_fact_comment: row.incomeFactComment || '',
  expense_fact: Number(row.expenseFact || 0),
  expense_fact_comment: row.expenseFactComment || '',
});

const money = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
const rub = (v) => `${money.format(Math.round(Number(v || 0)))} ₽`;
const shortDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' });
const monthKey = (iso) => iso.slice(0, 7);
const monthName = (key) => new Date(key + '-01T00:00:00').toLocaleDateString('ru-RU', { month: 'long' });

function normalizeComment(existing, incoming) {
  const next = String(incoming || '').trim();
  if (!next) return existing || '';
  if (!existing) return next;
  return `${existing}; ${next}`;
}

function recalcFactBalances(rows, startBalance) {
  let running = Number(startBalance || 0);
  return rows.map((row) => {
    running += Number(row.incomeFact || 0) - Number(row.expenseFact || 0);
    return { ...row, balanceFact: running };
  });
}

function detectCategory(text) {
  const s = String(text || '').toLowerCase();
  if (!s.trim()) return 'Без комментария';
  if (/кредит|кредитк|долг/.test(s)) return 'Долги и кредиты';
  if (/еда|магазин|обед|закуп/.test(s)) return 'Еда и быт';
  if (/бензин|ауди|ремонт|учет|мойка/.test(s)) return 'Авто';
  if (/кв|маник|педик|одежд|карман/.test(s)) return 'Регулярные расходы';
  if (/развлеч|др|подар/.test(s)) return 'Развлечения и подарки';
  if (/налог|фонд/.test(s)) return 'Налоги';
  return 'Прочее';
}

function StatCard({ icon: Icon, title, value, caption, tone = 'dark' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`stat-card ${tone}`}>
      <div className="stat-top">
        <div>
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
        </div>
        <div className="stat-icon"><Icon size={22} /></div>
      </div>
      <p className="stat-caption">{caption}</p>
    </motion.div>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const result = mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
      if (result.error) throw result.error;
      if (mode === 'register') setMessage('Аккаунт создан. Если включено подтверждение email — проверь почту.');
    } catch (err) {
      setMessage(err.message || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-grid">
        <div className="auth-copy">
          <div className="pill"><ShieldCheck size={16} /> Private finance dashboard</div>
          <h1>Финансы, план и факт — в личном онлайн-кабинете.</h1>
          <p>React + Supabase + Vercel. Вход по email, база данных в Postgres, графики и быстрый ввод операций с телефона.</p>
          <div className="chips">
            <span>авторизация</span><span>база данных</span><span>дашборд</span><span>мобильный ввод</span>
          </div>
        </div>

        <form className="auth-card" onSubmit={submit}>
          <h2>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>
          <p>Для теста можно создать свой аккаунт и загрузить стартовые данные из Excel.</p>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          <label>Пароль</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="минимум 6 символов" />
          <button className="primary-btn" disabled={loading}>
            {loading ? <Loader2 className="spin" size={18} /> : null}
            {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
          <button type="button" className="link-btn" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
          {message ? <div className="form-message">{message}</div> : null}
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [settings, setSettings] = useState(null);
  const [month, setMonth] = useState('all');
  const [query, setQuery] = useState('');
  const [onlyActive, setOnlyActive] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [entry, setEntry] = useState({ date: '2026-05-06', type: 'expense', amount: '', comment: '' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) loadData();
  }, [session?.user?.id]);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [settingsResult, daysResult] = await Promise.all([
        supabase.from('finance_settings').select('*').maybeSingle(),
        supabase.from('finance_days').select('*').order('day', { ascending: true })
      ]);
      if (settingsResult.error) throw settingsResult.error;
      if (daysResult.error) throw daysResult.error;

      const loadedSettings = settingsResult.data || { start_balance_fact: 0, title: 'Финансовый план' };
      setSettings(loadedSettings);
      const uiRows = (daysResult.data || []).map(toUiRow);
      setRows(recalcFactBalances(uiRows, loadedSettings.start_balance_fact));
    } catch (err) {
      setError(err.message || 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  }

  async function seedData() {
    if (!session?.user) return;
    setLoading(true);
    setError('');
    try {
      const { error: settingsError } = await supabase.from('finance_settings').upsert({
        user_id: session.user.id,
        title: 'Финансовый план до августа',
        start_date: '2026-04-29',
        start_balance_fact: 7400
      }, { onConflict: 'user_id' });
      if (settingsError) throw settingsError;

      const { error: daysError } = await supabase.from('finance_days').upsert(
        toSeedRows(session.user.id),
        { onConflict: 'user_id,day' }
      );
      if (daysError) throw daysError;

      await loadData();
    } catch (err) {
      setError(err.message || 'Не удалось загрузить стартовые данные');
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function addEntry(e) {
    e.preventDefault();
    const amount = Number(String(entry.amount).replace(/\s/g, '').replace(',', '.'));
    if (!entry.date || !amount || !session?.user) return;

    setLoading(true);
    setError('');
    try {
      const existing = rows.find((r) => r.date === entry.date);
      if (existing) {
        const patch = entry.type === 'income'
          ? {
              income_fact: Number(existing.incomeFact || 0) + amount,
              income_fact_comment: normalizeComment(existing.incomeFactComment, entry.comment)
            }
          : {
              expense_fact: Number(existing.expenseFact || 0) + amount,
              expense_fact_comment: normalizeComment(existing.expenseFactComment, entry.comment)
            };
        const { error: updateError } = await supabase.from('finance_days').update(patch).eq('id', existing.id);
        if (updateError) throw updateError;
      } else {
        const patch = {
          user_id: session.user.id,
          day: entry.date,
          income_plan: 0,
          income_plan_comment: '',
          income_fact: entry.type === 'income' ? amount : 0,
          income_fact_comment: entry.type === 'income' ? entry.comment : '',
          expense_plan: 0,
          expense_plan_comment: '',
          expense_fact: entry.type === 'expense' ? amount : 0,
          expense_fact_comment: entry.type === 'expense' ? entry.comment : '',
          balance_plan: 0
        };
        const { error: insertError } = await supabase.from('finance_days').insert(patch);
        if (insertError) throw insertError;
      }
      setEntry((p) => ({ ...p, amount: '', comment: '' }));
      await loadData();
    } catch (err) {
      setError(err.message || 'Не удалось добавить операцию');
    } finally {
      setLoading(false);
    }
  }

  async function saveEdit() {
    if (!editing) return;
    setLoading(true);
    setError('');
    try {
      const { error: updateError } = await supabase.from('finance_days').update(toDbPatch(editing)).eq('id', editing.id);
      if (updateError) throw updateError;
      setEditing(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'Не удалось сохранить изменения');
    } finally {
      setLoading(false);
    }
  }

  async function resetData() {
    if (!session?.user) return;
    setLoading(true);
    setError('');
    try {
      const { error: deleteError } = await supabase.from('finance_days').delete().eq('user_id', session.user.id);
      if (deleteError) throw deleteError;
      await seedData();
    } catch (err) {
      setError(err.message || 'Не удалось сбросить данные');
    } finally {
      setLoading(false);
    }
  }

  function downloadData() {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial-dashboard-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  const enrichedRows = useMemo(() => rows.map((r) => ({ ...r, dateShort: shortDate(r.date), month: monthKey(r.date) })), [rows]);
  const months = useMemo(() => Array.from(new Set(rows.map((r) => monthKey(r.date)))), [rows]);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enrichedRows.filter((r) => {
      const byMonth = month === 'all' || r.month === month;
      const text = [r.incomePlanComment, r.incomeFactComment, r.expensePlanComment, r.expenseFactComment].join(' ').toLowerCase();
      const byQuery = !q || text.includes(q) || r.date.includes(q);
      const byActive = !onlyActive || r.incomePlan || r.incomeFact || r.expensePlan || r.expenseFact;
      return byMonth && byQuery && byActive;
    });
  }, [enrichedRows, month, query, onlyActive]);

  const monthly = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => {
      const key = monthKey(r.date);
      if (!map.has(key)) map.set(key, { key, name: monthName(key), incomePlan: 0, incomeFact: 0, expensePlan: 0, expenseFact: 0 });
      const item = map.get(key);
      item.incomePlan += r.incomePlan;
      item.incomeFact += r.incomeFact;
      item.expensePlan += r.expensePlan;
      item.expenseFact += r.expenseFact;
    });
    return Array.from(map.values());
  }, [rows]);

  const expenseCategories = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => {
      const amount = Number(r.expensePlan || 0) + Number(r.expenseFact || 0);
      if (!amount) return;
      const category = detectCategory(`${r.expensePlanComment} ${r.expenseFactComment}`);
      map.set(category, (map.get(category) || 0) + amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 7);
  }, [rows]);

  const totals = useMemo(() => {
    const last = rows[rows.length - 1];
    const lastFact = last?.balanceFact || Number(settings?.start_balance_fact || 0);
    const planEnd = last?.balancePlan || 0;
    const incomeFact = rows.reduce((s, r) => s + r.incomeFact, 0);
    const expenseFact = rows.reduce((s, r) => s + r.expenseFact, 0);
    const incomePlan = rows.reduce((s, r) => s + r.incomePlan, 0);
    const expensePlan = rows.reduce((s, r) => s + r.expensePlan, 0);
    return { lastFact, planEnd, gap: lastFact - planEnd, incomeFact, expenseFact, incomePlan, expensePlan };
  }, [rows, settings]);

  if (!authReady) return <div className="center-screen"><Loader2 className="spin" /> Загрузка...</div>;
  if (!session) return <AuthScreen />;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon"><Wallet size={22} /></div>
          <div><h1>Финансовый план</h1><p>React + Supabase · данные доступны с любого устройства</p></div>
        </div>
        <div className="header-actions">
          <button className="secondary-btn hide-sm" onClick={downloadData}><Download size={16} /> Экспорт</button>
          <button className="secondary-btn hide-sm" onClick={resetData}><RotateCcw size={16} /> Сброс</button>
          <button className="dark-btn" onClick={signOut}><LogOut size={17} /> Выйти</button>
        </div>
      </header>

      <main className="main">
        {error ? <div className="error"><AlertTriangle size={18} /> {error}</div> : null}

        {rows.length === 0 && !loading ? (
          <section className="empty-state">
            <Database size={44} />
            <h2>База подключена, но данных пока нет</h2>
            <p>Нажми кнопку ниже — приложение загрузит стартовые данные из твоего Excel в Supabase под твоим аккаунтом.</p>
            <button className="primary-btn" onClick={seedData}>Загрузить стартовые данные</button>
          </section>
        ) : null}

        {rows.length > 0 ? (
          <>
            <section className="stats-grid">
              <StatCard icon={Wallet} title="Факт остаток" value={rub(totals.lastFact)} caption="Пересчитывается после внесения операций" tone="dark" />
              <StatCard icon={CalendarDays} title="План на 01.08" value={rub(totals.planEnd)} caption={`Отклонение: ${rub(totals.gap)}`} tone="blue" />
              <StatCard icon={TrendingUp} title="Приход факт" value={rub(totals.incomeFact)} caption={`План: ${rub(totals.incomePlan)}`} tone="green" />
              <StatCard icon={TrendingDown} title="Расход факт" value={rub(totals.expenseFact)} caption={`План: ${rub(totals.expensePlan)}`} tone="red" />
            </section>

            <section className="dashboard-grid">
              <div className="card wide">
                <div className="card-head">
                  <div><h2>Динамика остатка</h2><p>Плановый и фактический остаток по дням</p></div>
                </div>
                <div className="chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={enrichedRows} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="plan" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                        <linearGradient id="fact" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="dateShort" minTickGap={28} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}к`} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip formatter={(v) => rub(v)} />
                      <Legend />
                      <Area type="monotone" dataKey="balancePlan" name="Остаток план" stroke="#6366f1" fill="url(#plan)" strokeWidth={3} />
                      <Area type="monotone" dataKey="balanceFact" name="Остаток факт" stroke="#10b981" fill="url(#fact)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card dark-card">
                <div className="card-head">
                  <div><h2>Внести факт</h2><p>Быстрый ввод с телефона</p></div>
                  <Smartphone size={24} />
                </div>
                <form onSubmit={addEntry} className="entry-form">
                  <label>Дата</label>
                  <input type="date" value={entry.date} onChange={(e) => setEntry({ ...entry, date: e.target.value })} />
                  <div className="segmented">
                    <button type="button" className={entry.type === 'income' ? 'active income' : ''} onClick={() => setEntry({ ...entry, type: 'income' })}>Приход</button>
                    <button type="button" className={entry.type === 'expense' ? 'active expense' : ''} onClick={() => setEntry({ ...entry, type: 'expense' })}>Расход</button>
                  </div>
                  <label>Сумма</label>
                  <input inputMode="numeric" placeholder="Например, 3500" value={entry.amount} onChange={(e) => setEntry({ ...entry, amount: e.target.value })} />
                  <label>Комментарий</label>
                  <textarea placeholder="На что / откуда" value={entry.comment} onChange={(e) => setEntry({ ...entry, comment: e.target.value })} />
                  <button className="light-btn" disabled={loading}><Plus size={18} /> Добавить операцию</button>
                </form>
              </div>
            </section>

            <section className="two-cols">
              <div className="card">
                <h2>Месячная сводка</h2>
                <p>Приходы и расходы по плану и факту</p>
                <div className="chart small">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}к`} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip formatter={(v) => rub(v)} />
                      <Legend />
                      <Bar dataKey="incomePlan" name="Приход план" fill="#a5b4fc" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="incomeFact" name="Приход факт" fill="#10b981" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="expensePlan" name="Расход план" fill="#fecaca" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="expenseFact" name="Расход факт" fill="#f43f5e" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <h2>Структура расходов</h2>
                <p>Группировка по комментариям</p>
                <div className="pie-wrap">
                  <div className="pie">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={expenseCategories} dataKey="value" nameKey="name" innerRadius={52} outerRadius={88} paddingAngle={3}>
                          {expenseCategories.map((_, i) => <Cell key={i} fill={['#0f172a', '#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4', '#a855f7'][i % 7]} />)}
                        </Pie>
                        <Tooltip formatter={(v) => rub(v)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="legend-list">
                    {expenseCategories.map((item, i) => (
                      <div key={item.name} className="legend-item">
                        <span style={{ background: ['#0f172a', '#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4', '#a855f7'][i % 7] }} />
                        <b>{item.name}</b><em>{rub(item.value)}</em>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="card table-card">
              <div className="table-head">
                <div><h2>План / факт по дням</h2><p>Поиск, фильтр по месяцу, редактирование факта</p></div>
                <div className="filters">
                  <div className="search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по комментарию" /></div>
                  <select value={month} onChange={(e) => setMonth(e.target.value)}>
                    <option value="all">Все месяцы</option>
                    {months.map((m) => <option key={m} value={m}>{monthName(m)}</option>)}
                  </select>
                  <button className={onlyActive ? 'filter active' : 'filter'} onClick={() => setOnlyActive(!onlyActive)}>Только движения</button>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead><tr><th>Дата</th><th>Приход план</th><th>Приход факт</th><th>Расход план</th><th>Расход факт</th><th>Остаток план</th><th>Остаток факт</th><th>Комментарий</th><th></th></tr></thead>
                  <tbody>
                    {filteredRows.map((r) => (
                      <tr key={r.date}>
                        <td><b>{new Date(r.date + 'T00:00:00').toLocaleDateString('ru-RU')}</b></td>
                        <td className="income">{r.incomePlan ? rub(r.incomePlan) : '—'}</td>
                        <td className="income strong">{r.incomeFact ? rub(r.incomeFact) : '—'}</td>
                        <td className="expense">{r.expensePlan ? rub(r.expensePlan) : '—'}</td>
                        <td className="expense strong">{r.expenseFact ? rub(r.expenseFact) : '—'}</td>
                        <td>{rub(r.balancePlan)}</td>
                        <td><b>{rub(r.balanceFact)}</b></td>
                        <td className="comment">{r.incomeFactComment || r.expenseFactComment || r.incomePlanComment || r.expensePlanComment || '—'}</td>
                        <td><button className="mini-btn" onClick={() => setEditing(r)}><Pencil size={14} /> Изм.</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : null}
      </main>

      {editing ? (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-head">
              <div><h3>Редактировать факт</h3><p>Дата: {new Date(editing.date + 'T00:00:00').toLocaleDateString('ru-RU')}</p></div>
              <button onClick={() => setEditing(null)}>Закрыть</button>
            </div>
            <div className="modal-grid">
              <label>Приход факт<input inputMode="numeric" value={editing.incomeFact} onChange={(e) => setEditing({ ...editing, incomeFact: e.target.value })} /></label>
              <label>Расход факт<input inputMode="numeric" value={editing.expenseFact} onChange={(e) => setEditing({ ...editing, expenseFact: e.target.value })} /></label>
              <label className="span-2">Комментарий к приходу<textarea value={editing.incomeFactComment} onChange={(e) => setEditing({ ...editing, incomeFactComment: e.target.value })} /></label>
              <label className="span-2">Комментарий к расходу<textarea value={editing.expenseFactComment} onChange={(e) => setEditing({ ...editing, expenseFactComment: e.target.value })} /></label>
            </div>
            <button className="primary-btn full" onClick={saveEdit} disabled={loading}>Сохранить изменения</button>
          </div>
        </div>
      ) : null}

      {loading ? <div className="floating-loader"><Loader2 className="spin" /> Синхронизация</div> : null}
    </div>
  );
}
