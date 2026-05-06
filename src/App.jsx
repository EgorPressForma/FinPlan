import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import {
  Wallet, TrendingUp, TrendingDown, CalendarDays, Plus, Search,
  LogOut, ShieldCheck, Download, Pencil, RotateCcw, Smartphone,
  Loader2, Database, AlertTriangle, Trash2, LayoutDashboard, ListChecks,
  PiggyBank, ReceiptText, SlidersHorizontal, Save, CheckCircle2
} from 'lucide-react';
import { supabase } from './lib/supabaseClient';

const RAW_ROWS = [["2026-04-29", 0, "", 0, "", 0, "", 0, "", 7400, 7400], ["2026-04-30", 29000, "Долг Намес", 68500, "ЗП проф-нн и долг намес", 22500, "Кредит", 22500, "Кредит", 13900, 53400], ["2026-05-01", 0, "", 0, "", 3000, "Подарок тете Ире", 4420, "Пообедали в сиба, мойка мазда и снюс", 10900, 48980], ["2026-05-02", 0, "", 0, "", 1900, "Бензин", 4060, "скинул Намесу(1180) в долг и заборику (480), покупка еды в деревне (2400)", 9000, 44920], ["2026-05-03", 0, "", 0, "", 5000, "Покупка еды", 1559, "Погуляли на набережной + поехали к Димосу", 4000, 43361], ["2026-05-04", 0, "", 0, "", 0, "", 3044, "Закупка еды и компы", 4000, 40317], ["2026-05-05", 40000, "ЗП проф-нн", 1180, "Намес вернул долг от 02.05", 0, "", 33250, "Ремонт ауди", 44000, 8247], ["2026-05-06", 0, "", 0, "", 0, "", 3817, "Магазин, снюс + бильярд 05.05 и бензин", 44000, 4430], ["2026-05-07", 0, "", 0, "", 4000, "Покупка еды", 0, "", 40000, 4430], ["2026-05-08", 145000, "Оплата 4вида (В)", 0, "", 1500, "Бензин", 0, "", 183500, 4430], ["2026-05-09", 0, "", 0, "", 0, "", 0, "", 183500, 4430], ["2026-05-10", 0, "", 0, "", 60000, "ремонт ауди", 0, "", 123500, 4430], ["2026-05-11", 0, "", 0, "", 15000, "Постановка на учет ауди", 0, "", 108500, 4430], ["2026-05-12", 0, "", 0, "", 10000, "развлечения", 0, "", 98500, 4430], ["2026-05-13", 0, "", 0, "", 0, "", 0, "", 98500, 4430], ["2026-05-14", 0, "", 0, "", 3000, "Покупка еды", 0, "", 95500, 4430], ["2026-05-15", 0, "", 0, "", 1500, "Бензин", 0, "", 94000, 4430], ["2026-05-16", 0, "", 0, "", 0, "", 0, "", 94000, 4430], ["2026-05-17", 0, "", 0, "", 0, "", 0, "", 94000, 4430], ["2026-05-18", 35000, "ЗП проф-нн", 0, "", 0, "", 0, "", 129000, 4430], ["2026-05-19", 0, "", 0, "", 0, "", 0, "", 129000, 4430], ["2026-05-20", 0, "", 0, "", 31000, "Оплата Кв", 0, "", 98000, 4430], ["2026-05-21", 0, "", 0, "", 3000, "Покупка еды", 0, "", 95000, 4430], ["2026-05-22", 0, "", 0, "", 1500, "Бензин", 0, "", 93500, 4430], ["2026-05-23", 0, "", 0, "", 5000, "карманные Настя", 0, "", 88500, 4430], ["2026-05-24", 0, "", 0, "", 5000, "карманные Егор", 0, "", 83500, 4430], ["2026-05-25", 75000, "ЗП Настя", 0, "", 11500, "3к маник, 3.5к педикюр, 5к развлечения", 0, "", 147000, 4430], ["2026-05-26", 0, "", 0, "", 0, "", 0, "", 147000, 4430], ["2026-05-27", 0, "", 0, "", 0, "", 0, "", 147000, 4430], ["2026-05-28", 0, "", 0, "", 3500, "Покупка еды", 0, "", 143500, 4430], ["2026-05-29", 0, "", 0, "", 1500, "Бензин", 0, "", 142000, 4430], ["2026-05-30", 60000, "Долг отец Егора", 0, "", 32500, "Кредит + кредитка", 0, "", 169500, 4430], ["2026-05-31", 70000, "4 вида (сайт)", 0, "", 0, "", 0, "", 239500, 4430], ["2026-06-01", 0, "", 0, "", 65000, "долг Дима телефон, долг Егор", 0, "", 174500, 4430], ["2026-06-02", 0, "", 0, "", 5000, "карманные Настя", 0, "", 169500, 0], ["2026-06-03", 0, "", 0, "", 5000, "карманные Егор", 0, "", 164500, 0], ["2026-06-04", 0, "", 0, "", 0, "", 0, "", 164500, 0], ["2026-06-05", 35000, "ЗП проф-нн", 0, "", 0, "", 0, "", 199500, 0], ["2026-06-06", 0, "", 0, "", 5000, "Покупка еды и бензин", 0, "", 194500, 0], ["2026-06-07", 0, "", 0, "", 0, "", 0, "", 194500, 0], ["2026-06-08", 115000, "Оплата 4вида (В)", 0, "", 50000, "Оплата Катя и Оптимизатор", 0, "", 259500, 0], ["2026-06-09", 0, "", 0, "", 7000, "В \"Фонд налогов\"", 0, "", 252500, 0], ["2026-06-10", 50000, "4 вида (сайт)", 0, "", 5000, "ДР заборика (учитываем как развлечение)", 0, "", 297500, 0], ["2026-06-11", 18000, "ЗП Настя", 0, "", 62500, "Долг Егор", 0, "", 253000, 0], ["2026-06-12", 0, "", 0, "", 40000, "Покупка одежды Настя и Егор и карманные каждому", 0, "", 213000, 0], ["2026-06-13", 0, "", 0, "", 6000, "Покупка еды и бензин", 0, "", 207000, 0], ["2026-06-14", 0, "", 0, "", 7000, "ДР отца Егор", 0, "", 200000, 0], ["2026-06-15", 0, "", 0, "", 0, "", 0, "", 200000, 0], ["2026-06-16", 0, "", 0, "", 0, "", 0, "", 200000, 0], ["2026-06-17", 0, "", 0, "", 0, "", 0, "", 200000, 0], ["2026-06-18", 0, "", 0, "", 0, "", 0, "", 200000, 0], ["2026-06-19", 35000, "ЗП проф-нн", 0, "", 7000, "Покупка еды и бензин", 0, "", 228000, 0], ["2026-06-20", 0, "", 0, "", 34000, "развлечения и оплата кв, маникюр Настя", 0, "", 194000, 0], ["2026-06-21", 0, "", 0, "", 0, "", 0, "", 194000, 0], ["2026-06-22", 0, "", 0, "", 5000, "карманные Настя", 0, "", 189000, 0], ["2026-06-23", 0, "", 0, "", 5000, "карманные Егор", 0, "", 184000, 0], ["2026-06-24", 0, "", 0, "", 0, "", 0, "", 184000, 0], ["2026-06-25", 75000, "ЗП Настя", 0, "", 0, "", 0, "", 259000, 0], ["2026-06-26", 0, "", 0, "", 7000, "Покупка еды и бензин", 0, "", 252000, 0], ["2026-06-27", 0, "", 0, "", 5000, "Развлечения", 0, "", 247000, 0], ["2026-06-28", 0, "", 0, "", 0, "", 0, "", 247000, 0], ["2026-06-29", 0, "", 0, "", 8000, "ДР мама Егор", 0, "", 239000, 0], ["2026-06-30", 0, "", 0, "", 85500, "Кредит, долг Яна, долг Родители", 0, "", 153500, 0], ["2026-07-01", 0, "", 0, "", 0, "", 0, "", 153500, 0], ["2026-07-02", 0, "", 0, "", 0, "", 0, "", 153500, 0], ["2026-07-03", 0, "", 0, "", 7000, "Покупка еды и бензин", 0, "", 146500, 0], ["2026-07-04", 0, "", 0, "", 5000, "Развлечения", 0, "", 141500, 0], ["2026-07-05", 0, "", 0, "", 5000, "карманные Настя", 0, "", 136500, 0], ["2026-07-06", 0, "", 0, "", 5000, "карманные Егор", 0, "", 131500, 0], ["2026-07-07", 0, "", 0, "", 0, "", 0, "", 131500, 0], ["2026-07-08", 115000, "Оплата 4вида (В)", 0, "", 50000, "Оплата Катя и Оптимизатор", 0, "", 196500, 0], ["2026-07-09", 0, "", 0, "", 7000, "В \"Фонд налогов\"", 0, "", 189500, 0], ["2026-07-10", 35000, "ЗП проф-нн", 0, "", 7000, "Покупка еды и бензин", 0, "", 217500, 0], ["2026-07-11", 18000, "ЗП Настя", 0, "", 5000, "Развлечения", 0, "", 230500, 0], ["2026-07-12", 0, "", 0, "", 0, "", 0, "", 230500, 0], ["2026-07-13", 0, "", 0, "", 0, "", 0, "", 230500, 0], ["2026-07-14", 0, "", 0, "", 0, "", 0, "", 230500, 0], ["2026-07-15", 0, "", 0, "", 5000, "карманные Настя", 0, "", 225500, 0], ["2026-07-16", 0, "", 0, "", 5000, "карманные Егор", 0, "", 220500, 0], ["2026-07-17", 0, "", 0, "", 7000, "Покупка еды и бензин", 0, "", 213500, 0], ["2026-07-18", 0, "", 0, "", 5000, "Развлечения", 0, "", 208500, 0], ["2026-07-19", 0, "", 0, "", 0, "", 0, "", 208500, 0], ["2026-07-20", 0, "", 0, "", 31000, "Оплата кв", 0, "", 177500, 0], ["2026-07-21", 0, "", 0, "", 3000, "Маникюр Настя", 0, "", 174500, 0], ["2026-07-22", 0, "", 0, "", 0, "", 0, "", 174500, 0], ["2026-07-23", 0, "", 0, "", 0, "", 0, "", 174500, 0], ["2026-07-24", 35000, "ЗП проф-нн", 0, "", 7000, "Покупка еды и бензин", 0, "", 202500, 0], ["2026-07-25", 75000, "ЗП Настя", 0, "", 5000, "Развлечения", 0, "", 272500, 0], ["2026-07-26", 0, "", 0, "", 5000, "карманные Настя", 0, "", 267500, 0], ["2026-07-27", 0, "", 0, "", 5000, "карманные Егор", 0, "", 262500, 0], ["2026-07-28", 0, "", 0, "", 0, "", 0, "", 262500, 0], ["2026-07-29", 0, "", 0, "", 0, "", 0, "", 262500, 0], ["2026-07-30", 0, "", 0, "", 32500, "Кредит + кредитка", 0, "", 230000, 0], ["2026-07-31", 0, "", 0, "", 0, "", 0, "", 230000, 0], ["2026-08-01", 0, "", 0, "", 0, "", 0, "", 230000, 0]];

const INCOME_CATEGORIES = ['Зарплата', 'Проекты', 'Возврат долга', 'Подарки', 'Прочее'];
const EXPENSE_CATEGORIES = ['Еда и быт', 'Авто', 'Долги и кредиты', 'Квартира', 'Развлечения', 'Одежда и красота', 'Налоги', 'Подарки', 'Прочее'];
const ALL_CATEGORIES = Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]));
const COLORS = ['#0f172a', '#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4', '#a855f7', '#14b8a6', '#fb7185'];
const DEFAULT_EXPENSE_BUDGETS = {
  'Еда и быт': 30000,
  'Авто': 20000,
  'Долги и кредиты': 32500,
  'Квартира': 31000,
  'Развлечения': 20000,
  'Одежда и красота': 15000,
  'Налоги': 7000,
  'Подарки': 8000,
  'Прочее': 10000,
};

const money = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
const rub = (v) => `${money.format(Math.round(Number(v || 0)))} ₽`;
const shortDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' });
const fullDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('ru-RU');
const monthKey = (iso) => iso.slice(0, 7);
const monthStart = (key) => `${key}-01`;
const todayIso = () => new Date().toISOString().slice(0, 10);
const monthName = (key) => new Date(key + '-01T00:00:00').toLocaleDateString('ru-RU', { month: 'long' });
const normalizeAmount = (value) => Number(String(value || '').replace(/\s/g, '').replace(',', '.')) || 0;

function guessCategory(type, text) {
  const s = String(text || '').toLowerCase();
  if (type === 'income') {
    if (/зп|зарплат|проф|настя/.test(s)) return 'Зарплата';
    if (/4\s?вида|сайт|оплат/.test(s)) return 'Проекты';
    if (/долг|вернул|возврат/.test(s)) return 'Возврат долга';
    if (/подар/.test(s)) return 'Подарки';
    return 'Прочее';
  }
  if (/еда|магазин|обед|закуп|сиба|снюс|компы/.test(s)) return 'Еда и быт';
  if (/бензин|ауди|ремонт|учет|мойка|мазда|машин/.test(s)) return 'Авто';
  if (/кредит|кредитк|долг|телефон|родител|яна/.test(s)) return 'Долги и кредиты';
  if (/кв|квартир|коммун/.test(s)) return 'Квартира';
  if (/развлеч|бильярд|набережн|погулял|димос/.test(s)) return 'Развлечения';
  if (/маник|педик|одежд|карман/.test(s)) return 'Одежда и красота';
  if (/налог|фонд/.test(s)) return 'Налоги';
  if (/др|подар/.test(s)) return 'Подарки';
  return 'Прочее';
}

const toSeedDays = (userId) => RAW_ROWS.map((r) => ({
  user_id: userId,
  day: r[0],
  income_plan: r[1] || 0,
  income_plan_comment: r[2] || '',
  income_fact: 0,
  income_fact_comment: '',
  expense_plan: r[5] || 0,
  expense_plan_comment: r[6] || '',
  expense_fact: 0,
  expense_fact_comment: '',
  balance_plan: r[9] || 0,
}));

const toSeedTransactions = (userId) => RAW_ROWS.flatMap((r) => {
  const items = [];
  if (Number(r[3] || 0) > 0) {
    items.push({
      user_id: userId,
      day: r[0],
      type: 'income',
      amount: Number(r[3] || 0),
      category: guessCategory('income', r[4] || r[2]),
      comment: r[4] || r[2] || '',
      source: 'seed',
      source_key: `seed-${r[0]}-income`,
    });
  }
  if (Number(r[7] || 0) > 0) {
    items.push({
      user_id: userId,
      day: r[0],
      type: 'expense',
      amount: Number(r[7] || 0),
      category: guessCategory('expense', r[8] || r[6]),
      comment: r[8] || r[6] || '',
      source: 'seed',
      source_key: `seed-${r[0]}-expense`,
    });
  }
  return items;
});

const toUiDay = (r) => ({
  id: r.id,
  date: r.day,
  incomePlan: Number(r.income_plan || 0),
  incomePlanComment: r.income_plan_comment || '',
  expensePlan: Number(r.expense_plan || 0),
  expensePlanComment: r.expense_plan_comment || '',
  balancePlan: Number(r.balance_plan || 0),
});

const toUiTransaction = (r) => ({
  id: r.id,
  date: r.day,
  type: r.type,
  amount: Number(r.amount || 0),
  category: r.category || 'Прочее',
  comment: r.comment || '',
  source: r.source || 'manual',
  createdAt: r.created_at,
});

function buildRows(days, transactions, startBalance) {
  const dayMap = new Map(days.map((d) => [d.date, d]));
  const txMap = new Map();
  transactions.forEach((tx) => {
    if (!txMap.has(tx.date)) txMap.set(tx.date, { income: 0, expense: 0, incomeComments: [], expenseComments: [] });
    const item = txMap.get(tx.date);
    if (tx.type === 'income') {
      item.income += tx.amount;
      if (tx.comment) item.incomeComments.push(tx.comment);
    } else {
      item.expense += tx.amount;
      if (tx.comment) item.expenseComments.push(tx.comment);
    }
  });

  const allDates = Array.from(new Set([...dayMap.keys(), ...txMap.keys()])).sort();
  let running = Number(startBalance || 0);
  return allDates.map((date) => {
    const planned = dayMap.get(date) || { date, incomePlan: 0, incomePlanComment: '', expensePlan: 0, expensePlanComment: '', balancePlan: 0 };
    const fact = txMap.get(date) || { income: 0, expense: 0, incomeComments: [], expenseComments: [] };
    running += fact.income - fact.expense;
    return {
      ...planned,
      date,
      incomeFact: fact.income,
      incomeFactComment: fact.incomeComments.join('; '),
      expenseFact: fact.expense,
      expenseFactComment: fact.expenseComments.join('; '),
      balanceFact: running,
    };
  });
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
          <p>React + Supabase + Vercel. Вход по email, история операций, бюджеты по категориям и быстрый ввод с телефона.</p>
          <div className="chips">
            <span>авторизация</span><span>операции</span><span>бюджеты</span><span>PWA</span>
          </div>
        </div>

        <form className="auth-card" onSubmit={submit}>
          <h2>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>
          <p>Создай аккаунт или войди, чтобы работать с данными с любого устройства.</p>
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

function NavButton({ active, icon: Icon, children, onClick }) {
  return <button className={active ? 'nav-btn active' : 'nav-btn'} onClick={onClick}><Icon size={18} /> {children}</button>;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [settings, setSettings] = useState(null);
  const [view, setView] = useState('dashboard');
  const [month, setMonth] = useState('all');
  const [query, setQuery] = useState('');
  const [onlyActive, setOnlyActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [entry, setEntry] = useState({ date: todayIso(), type: 'expense', amount: '', category: 'Еда и быт', comment: '' });
  const [editingTx, setEditingTx] = useState(null);
  const [budgetMonth, setBudgetMonth] = useState('2026-05');
  const [budgetDraft, setBudgetDraft] = useState({ ...DEFAULT_EXPENSE_BUDGETS });

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

  const rows = useMemo(() => buildRows(days, transactions, settings?.start_balance_fact || 0), [days, transactions, settings]);
  const months = useMemo(() => Array.from(new Set(rows.map((r) => monthKey(r.date)))).sort(), [rows]);
  const selectedMonth = month === 'all' ? months[0] || budgetMonth : month;

  useEffect(() => {
    if (months.length && !months.includes(budgetMonth)) setBudgetMonth(months[0]);
  }, [months.join('|')]);

  useEffect(() => {
    const next = { ...DEFAULT_EXPENSE_BUDGETS };
    budgets.filter((b) => b.month_start?.slice(0, 7) === budgetMonth).forEach((b) => {
      next[b.category] = Number(b.limit_amount || 0);
    });
    setBudgetDraft(next);
  }, [budgets, budgetMonth]);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [settingsResult, daysResult, transactionsResult, budgetsResult] = await Promise.all([
        supabase.from('finance_settings').select('*').maybeSingle(),
        supabase.from('finance_days').select('*').order('day', { ascending: true }),
        supabase.from('finance_transactions').select('*').order('day', { ascending: false }).order('created_at', { ascending: false }),
        supabase.from('finance_budgets').select('*').order('month_start', { ascending: true }),
      ]);
      if (settingsResult.error) throw settingsResult.error;
      if (daysResult.error) throw daysResult.error;
      if (transactionsResult.error) throw transactionsResult.error;
      if (budgetsResult.error) throw budgetsResult.error;

      const loadedSettings = settingsResult.data || { start_balance_fact: 0, title: 'Финансовый план' };
      setSettings(loadedSettings);
      setDays((daysResult.data || []).map(toUiDay));
      setTransactions((transactionsResult.data || []).map(toUiTransaction));
      setBudgets(budgetsResult.data || []);
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
        start_balance_fact: 7400,
      }, { onConflict: 'user_id' });
      if (settingsError) throw settingsError;

      const { error: daysError } = await supabase.from('finance_days').upsert(toSeedDays(session.user.id), { onConflict: 'user_id,day' });
      if (daysError) throw daysError;

      const seedTx = toSeedTransactions(session.user.id);
      if (seedTx.length) {
        const { error: txError } = await supabase.from('finance_transactions').upsert(seedTx, { onConflict: 'user_id,source_key' });
        if (txError) throw txError;
      }

      const budgetRows = Object.entries(DEFAULT_EXPENSE_BUDGETS).map(([category, limit_amount]) => ({
        user_id: session.user.id,
        month_start: '2026-05-01',
        category,
        limit_amount,
      }));
      const { error: budgetError } = await supabase.from('finance_budgets').upsert(budgetRows, { onConflict: 'user_id,month_start,category' });
      if (budgetError) throw budgetError;

      setSuccess('Стартовые данные загружены');
      await loadData();
    } catch (err) {
      setError(err.message || 'Не удалось загрузить стартовые данные');
    } finally {
      setLoading(false);
    }
  }

  async function signOut() { await supabase.auth.signOut(); }

  async function addTransaction(e) {
    e.preventDefault();
    const amount = normalizeAmount(entry.amount);
    if (!entry.date || !amount || !session?.user) return;
    setLoading(true);
    setError('');
    try {
      const { error: insertError } = await supabase.from('finance_transactions').insert({
        user_id: session.user.id,
        day: entry.date,
        type: entry.type,
        amount,
        category: entry.category || (entry.type === 'income' ? 'Прочее' : 'Прочее'),
        comment: entry.comment || '',
        source: 'manual',
      });
      if (insertError) throw insertError;
      setEntry((p) => ({ ...p, amount: '', comment: '' }));
      setSuccess('Операция добавлена');
      await loadData();
    } catch (err) {
      setError(err.message || 'Не удалось добавить операцию');
    } finally {
      setLoading(false);
    }
  }

  async function saveTransaction() {
    if (!editingTx) return;
    const amount = normalizeAmount(editingTx.amount);
    if (!amount) return;
    setLoading(true);
    setError('');
    try {
      const { error: updateError } = await supabase.from('finance_transactions').update({
        day: editingTx.date,
        type: editingTx.type,
        amount,
        category: editingTx.category,
        comment: editingTx.comment || '',
      }).eq('id', editingTx.id);
      if (updateError) throw updateError;
      setEditingTx(null);
      setSuccess('Операция обновлена');
      await loadData();
    } catch (err) {
      setError(err.message || 'Не удалось сохранить операцию');
    } finally {
      setLoading(false);
    }
  }

  async function deleteTransaction(id) {
    setLoading(true);
    setError('');
    try {
      const { error: deleteError } = await supabase.from('finance_transactions').delete().eq('id', id);
      if (deleteError) throw deleteError;
      setSuccess('Операция удалена');
      await loadData();
    } catch (err) {
      setError(err.message || 'Не удалось удалить операцию');
    } finally {
      setLoading(false);
    }
  }

  async function saveBudgets() {
    if (!session?.user || !budgetMonth) return;
    setLoading(true);
    setError('');
    try {
      const rowsToUpsert = EXPENSE_CATEGORIES.map((category) => ({
        user_id: session.user.id,
        month_start: monthStart(budgetMonth),
        category,
        limit_amount: normalizeAmount(budgetDraft[category]),
      }));
      const { error: budgetError } = await supabase.from('finance_budgets').upsert(rowsToUpsert, { onConflict: 'user_id,month_start,category' });
      if (budgetError) throw budgetError;
      setSuccess('Бюджеты сохранены');
      await loadData();
    } catch (err) {
      setError(err.message || 'Не удалось сохранить бюджеты');
    } finally {
      setLoading(false);
    }
  }

  async function resetData() {
    if (!session?.user) return;
    setLoading(true);
    setError('');
    try {
      await supabase.from('finance_transactions').delete().eq('user_id', session.user.id);
      await supabase.from('finance_days').delete().eq('user_id', session.user.id);
      await supabase.from('finance_budgets').delete().eq('user_id', session.user.id);
      setLoading(false);
      await seedData();
    } catch (err) {
      setError(err.message || 'Не удалось сбросить данные');
      setLoading(false);
    }
  }

  function downloadData() {
    const payload = { days, transactions, budgets, settings };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finplan-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  const chartRows = useMemo(() => rows.map((r) => ({ ...r, dateShort: shortDate(r.date), month: monthKey(r.date) })), [rows]);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chartRows.filter((r) => {
      const byMonth = month === 'all' || r.month === month;
      const text = [r.incomePlanComment, r.incomeFactComment, r.expensePlanComment, r.expenseFactComment].join(' ').toLowerCase();
      const byQuery = !q || text.includes(q) || r.date.includes(q);
      const byActive = !onlyActive || r.incomePlan || r.incomeFact || r.expensePlan || r.expenseFact;
      return byMonth && byQuery && byActive;
    });
  }, [chartRows, month, query, onlyActive]);

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
    transactions.filter((tx) => tx.type === 'expense').forEach((tx) => {
      map.set(tx.category, (map.get(tx.category) || 0) + tx.amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 9);
  }, [transactions]);

  const totals = useMemo(() => {
    const last = rows[rows.length - 1];
    const lastFact = last?.balanceFact || Number(settings?.start_balance_fact || 0);
    const planEnd = last?.balancePlan || 0;
    const incomeFact = transactions.filter((tx) => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
    const expenseFact = transactions.filter((tx) => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0);
    const incomePlan = days.reduce((s, r) => s + r.incomePlan, 0);
    const expensePlan = days.reduce((s, r) => s + r.expensePlan, 0);
    return { lastFact, planEnd, gap: lastFact - planEnd, incomeFact, expenseFact, incomePlan, expensePlan };
  }, [rows, days, transactions, settings]);

  const history = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter((tx) => {
      const byMonth = month === 'all' || monthKey(tx.date) === month;
      const text = [tx.comment, tx.category, tx.type].join(' ').toLowerCase();
      return byMonth && (!q || text.includes(q) || tx.date.includes(q));
    }).sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`));
  }, [transactions, month, query]);

  const budgetRows = useMemo(() => {
    const monthTransactions = transactions.filter((tx) => tx.type === 'expense' && monthKey(tx.date) === budgetMonth);
    return EXPENSE_CATEGORIES.map((category) => {
      const spent = monthTransactions.filter((tx) => tx.category === category).reduce((s, tx) => s + tx.amount, 0);
      const limit = normalizeAmount(budgetDraft[category]);
      const percent = limit > 0 ? Math.min(999, Math.round((spent / limit) * 100)) : 0;
      return { category, spent, limit, percent, left: limit - spent };
    });
  }, [transactions, budgetMonth, budgetDraft]);

  const selectedCategories = entry.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    const valid = entry.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (!valid.includes(entry.category)) setEntry((p) => ({ ...p, category: valid[0] }));
  }, [entry.type]);

  if (!authReady) return <div className="center-screen"><Loader2 className="spin" /> Загрузка...</div>;
  if (!session) return <AuthScreen />;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon"><Wallet size={22} /></div>
          <div><h1>Финансовый план</h1><p>Онлайн-дашборд · операции · бюджеты · PWA</p></div>
        </div>
        <div className="header-actions">
          <button className="secondary-btn hide-sm" onClick={downloadData}><Download size={16} /> Экспорт</button>
          <button className="secondary-btn hide-sm" onClick={resetData}><RotateCcw size={16} /> Сброс</button>
          <button className="dark-btn" onClick={signOut}><LogOut size={17} /> Выйти</button>
        </div>
      </header>

      <main className="main">
        {error ? <div className="error"><AlertTriangle size={18} /> {error}</div> : null}
        {success ? <div className="success"><CheckCircle2 size={18} /> {success} <button onClick={() => setSuccess('')}>×</button></div> : null}

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
            <nav className="section-nav">
              <NavButton active={view === 'dashboard'} icon={LayoutDashboard} onClick={() => setView('dashboard')}>Дашборд</NavButton>
              <NavButton active={view === 'quick'} icon={Smartphone} onClick={() => setView('quick')}>Быстрый ввод</NavButton>
              <NavButton active={view === 'history'} icon={ReceiptText} onClick={() => setView('history')}>Операции</NavButton>
              <NavButton active={view === 'budget'} icon={PiggyBank} onClick={() => setView('budget')}>Бюджет</NavButton>
              <NavButton active={view === 'plan'} icon={ListChecks} onClick={() => setView('plan')}>План/факт</NavButton>
            </nav>

            <section className="stats-grid">
              <StatCard icon={Wallet} title="Факт остаток" value={rub(totals.lastFact)} caption="Пересчитывается по истории операций" tone="dark" />
              <StatCard icon={CalendarDays} title="План на 01.08" value={rub(totals.planEnd)} caption={`Отклонение: ${rub(totals.gap)}`} tone="blue" />
              <StatCard icon={TrendingUp} title="Приход факт" value={rub(totals.incomeFact)} caption={`План: ${rub(totals.incomePlan)}`} tone="green" />
              <StatCard icon={TrendingDown} title="Расход факт" value={rub(totals.expenseFact)} caption={`План: ${rub(totals.expensePlan)}`} tone="red" />
            </section>

            {view === 'dashboard' ? (
              <>
                <section className="dashboard-grid">
                  <div className="card wide">
                    <div className="card-head"><div><h2>Динамика остатка</h2><p>Плановый и фактический остаток по дням</p></div></div>
                    <div className="chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartRows} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
                  <QuickInputCard entry={entry} setEntry={setEntry} addTransaction={addTransaction} categories={selectedCategories} loading={loading} />
                </section>

                <section className="two-cols">
                  <div className="card">
                    <h2>Месячная сводка</h2><p>Приходы и расходы по плану и факту</p>
                    <div className="chart small"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthly}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} /><YAxis tickFormatter={(v) => `${Math.round(v / 1000)}к`} tick={{ fontSize: 12, fill: '#64748b' }} /><Tooltip formatter={(v) => rub(v)} /><Legend /><Bar dataKey="incomePlan" name="Приход план" fill="#a5b4fc" radius={[8,8,0,0]} /><Bar dataKey="incomeFact" name="Приход факт" fill="#10b981" radius={[8,8,0,0]} /><Bar dataKey="expensePlan" name="Расход план" fill="#fecaca" radius={[8,8,0,0]} /><Bar dataKey="expenseFact" name="Расход факт" fill="#f43f5e" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></div>
                  </div>
                  <div className="card">
                    <h2>Структура расходов</h2><p>Группировка по выбранным категориям</p>
                    <div className="pie-wrap">
                      <div className="pie"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={expenseCategories} dataKey="value" nameKey="name" innerRadius={52} outerRadius={88} paddingAngle={3}>{expenseCategories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v) => rub(v)} /></PieChart></ResponsiveContainer></div>
                      <div className="legend-list">{expenseCategories.map((item, i) => <div key={item.name} className="legend-item"><span style={{ background: COLORS[i % COLORS.length] }} /><b>{item.name}</b><em>{rub(item.value)}</em></div>)}</div>
                    </div>
                  </div>
                </section>
              </>
            ) : null}

            {view === 'quick' ? <section className="mobile-layout"><QuickInputCard entry={entry} setEntry={setEntry} addTransaction={addTransaction} categories={selectedCategories} loading={loading} large /><LastOperations transactions={history.slice(0, 8)} onEdit={setEditingTx} onDelete={deleteTransaction} /></section> : null}

            {view === 'history' ? (
              <HistorySection history={history} month={month} setMonth={setMonth} months={months} query={query} setQuery={setQuery} onEdit={setEditingTx} onDelete={deleteTransaction} />
            ) : null}

            {view === 'budget' ? (
              <BudgetSection budgetMonth={budgetMonth} setBudgetMonth={setBudgetMonth} months={months} budgetRows={budgetRows} budgetDraft={budgetDraft} setBudgetDraft={setBudgetDraft} saveBudgets={saveBudgets} loading={loading} />
            ) : null}

            {view === 'plan' ? (
              <PlanFactTable filteredRows={filteredRows} month={month} setMonth={setMonth} months={months} query={query} setQuery={setQuery} onlyActive={onlyActive} setOnlyActive={setOnlyActive} />
            ) : null}
          </>
        ) : null}
      </main>

      {editingTx ? (
        <TransactionModal tx={editingTx} setTx={setEditingTx} save={saveTransaction} />
      ) : null}
    </div>
  );
}

function QuickInputCard({ entry, setEntry, addTransaction, categories, loading, large = false }) {
  return (
    <div className={large ? 'card dark-card quick-large' : 'card dark-card'}>
      <div className="card-head"><div><h2>Внести факт</h2><p>Быстрый ввод с телефона</p></div><Smartphone size={24} /></div>
      <form onSubmit={addTransaction} className="entry-form">
        <label>Дата</label>
        <input type="date" value={entry.date} onChange={(e) => setEntry({ ...entry, date: e.target.value })} />
        <div className="segmented">
          <button type="button" className={entry.type === 'income' ? 'active income' : ''} onClick={() => setEntry({ ...entry, type: 'income' })}>Приход</button>
          <button type="button" className={entry.type === 'expense' ? 'active expense' : ''} onClick={() => setEntry({ ...entry, type: 'expense' })}>Расход</button>
        </div>
        <label>Категория</label>
        <select value={entry.category} onChange={(e) => setEntry({ ...entry, category: e.target.value })}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select>
        <label>Сумма</label>
        <input inputMode="decimal" placeholder="Например, 3500" value={entry.amount} onChange={(e) => setEntry({ ...entry, amount: e.target.value })} />
        <label>Комментарий</label>
        <textarea placeholder="На что / откуда" value={entry.comment} onChange={(e) => setEntry({ ...entry, comment: e.target.value })} />
        <button className="light-btn" disabled={loading}><Plus size={18} /> Добавить операцию</button>
      </form>
    </div>
  );
}

function LastOperations({ transactions, onEdit, onDelete }) {
  return (
    <div className="card">
      <h2>Последние операции</h2><p>Быстрая проверка после внесения факта</p>
      <div className="operation-list compact">{transactions.map((tx) => <OperationItem key={tx.id} tx={tx} onEdit={onEdit} onDelete={onDelete} />)}</div>
    </div>
  );
}

function HistorySection({ history, month, setMonth, months, query, setQuery, onEdit, onDelete }) {
  return (
    <section className="card">
      <div className="table-head">
        <div><h2>История операций</h2><p>Каждая трата и каждый приход теперь хранятся отдельной записью</p></div>
        <div className="filters">
          <div className="search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск" /></div>
          <select value={month} onChange={(e) => setMonth(e.target.value)}><option value="all">Все месяцы</option>{months.map((m) => <option key={m} value={m}>{monthName(m)}</option>)}</select>
        </div>
      </div>
      <div className="operation-list">{history.map((tx) => <OperationItem key={tx.id} tx={tx} onEdit={onEdit} onDelete={onDelete} />)}</div>
    </section>
  );
}

function OperationItem({ tx, onEdit, onDelete }) {
  const isIncome = tx.type === 'income';
  return (
    <div className="operation-item">
      <div className={isIncome ? 'operation-badge income' : 'operation-badge expense'}>{isIncome ? '+' : '−'}</div>
      <div className="operation-main">
        <div className="operation-title"><b>{tx.category}</b><span>{fullDate(tx.date)}</span></div>
        <p>{tx.comment || 'Без комментария'}</p>
      </div>
      <div className={isIncome ? 'operation-amount income' : 'operation-amount expense'}>{isIncome ? '+' : '−'} {rub(tx.amount)}</div>
      <div className="operation-actions"><button onClick={() => onEdit(tx)}><Pencil size={15} /></button><button onClick={() => onDelete(tx.id)}><Trash2 size={15} /></button></div>
    </div>
  );
}

function BudgetSection({ budgetMonth, setBudgetMonth, months, budgetRows, budgetDraft, setBudgetDraft, saveBudgets, loading }) {
  const totalLimit = budgetRows.reduce((s, r) => s + r.limit, 0);
  const totalSpent = budgetRows.reduce((s, r) => s + r.spent, 0);
  const totalPercent = totalLimit ? Math.round((totalSpent / totalLimit) * 100) : 0;
  return (
    <section className="card">
      <div className="table-head">
        <div><h2>Ежемесячный бюджет</h2><p>Лимиты по категориям и прогресс расходования</p></div>
        <div className="filters"><select value={budgetMonth} onChange={(e) => setBudgetMonth(e.target.value)}>{months.map((m) => <option key={m} value={m}>{monthName(m)}</option>)}</select><button className="dark-btn" onClick={saveBudgets} disabled={loading}><Save size={16} /> Сохранить лимиты</button></div>
      </div>
      <div className="budget-total"><div><b>{rub(totalSpent)}</b><span>из {rub(totalLimit)} · {totalPercent}%</span></div><div className="progress"><i style={{ width: `${Math.min(totalPercent, 100)}%` }} /></div></div>
      <div className="budget-list">{budgetRows.map((row) => <div key={row.category} className="budget-row"><div className="budget-info"><b>{row.category}</b><span>Потрачено {rub(row.spent)} · осталось {rub(row.left)}</span><div className="progress"><i className={row.percent > 100 ? 'danger' : ''} style={{ width: `${Math.min(row.percent, 100)}%` }} /></div></div><input inputMode="numeric" value={budgetDraft[row.category] ?? ''} onChange={(e) => setBudgetDraft((p) => ({ ...p, [row.category]: e.target.value }))} /></div>)}</div>
    </section>
  );
}

function PlanFactTable({ filteredRows, month, setMonth, months, query, setQuery, onlyActive, setOnlyActive }) {
  return (
    <section className="card table-card">
      <div className="table-head">
        <div><h2>План / факт по дням</h2><p>Факт считается по истории операций</p></div>
        <div className="filters"><div className="search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по комментарию" /></div><select value={month} onChange={(e) => setMonth(e.target.value)}><option value="all">Все месяцы</option>{months.map((m) => <option key={m} value={m}>{monthName(m)}</option>)}</select><button className={onlyActive ? 'filter active' : 'filter'} onClick={() => setOnlyActive(!onlyActive)}><SlidersHorizontal size={16} /> Только движения</button></div>
      </div>
      <div className="table-wrap"><table><thead><tr><th>Дата</th><th>Приход план</th><th>Приход факт</th><th>Расход план</th><th>Расход факт</th><th>Остаток план</th><th>Остаток факт</th><th>Комментарий</th></tr></thead><tbody>{filteredRows.map((r) => <tr key={r.date}><td><b>{fullDate(r.date)}</b></td><td className="income-text">{r.incomePlan ? rub(r.incomePlan) : '—'}</td><td className="income-text strong">{r.incomeFact ? rub(r.incomeFact) : '—'}</td><td className="expense-text">{r.expensePlan ? rub(r.expensePlan) : '—'}</td><td className="expense-text strong">{r.expenseFact ? rub(r.expenseFact) : '—'}</td><td>{rub(r.balancePlan)}</td><td><b>{rub(r.balanceFact)}</b></td><td className="comment-cell">{r.incomeFactComment || r.expenseFactComment || r.incomePlanComment || r.expensePlanComment || '—'}</td></tr>)}</tbody></table></div>
    </section>
  );
}

function TransactionModal({ tx, setTx, save }) {
  const cats = tx.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="card-head"><div><h2>Редактировать операцию</h2><p>{fullDate(tx.date)}</p></div><button className="secondary-btn" onClick={() => setTx(null)}>Закрыть</button></div>
        <div className="modal-grid">
          <label>Дата<input type="date" value={tx.date} onChange={(e) => setTx({ ...tx, date: e.target.value })} /></label>
          <label>Тип<select value={tx.type} onChange={(e) => setTx({ ...tx, type: e.target.value, category: e.target.value === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0] })}><option value="income">Приход</option><option value="expense">Расход</option></select></label>
          <label>Категория<select value={tx.category} onChange={(e) => setTx({ ...tx, category: e.target.value })}>{cats.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
          <label>Сумма<input inputMode="decimal" value={tx.amount} onChange={(e) => setTx({ ...tx, amount: e.target.value })} /></label>
          <label className="wide-label">Комментарий<textarea value={tx.comment} onChange={(e) => setTx({ ...tx, comment: e.target.value })} /></label>
        </div>
        <button className="primary-btn" onClick={save}>Сохранить</button>
      </div>
    </div>
  );
}
