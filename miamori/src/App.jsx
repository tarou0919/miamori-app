import { useState, useEffect } from "react";
import styles from "./App.module.css";

const DEFAULT_PROFILE = { name: "田中 よし子", age: "78", address: "大阪府大阪市", memo: "" };
const DEFAULT_CONTACTS = [
  { id: 1, name: "田中 一郎",   phone: "090-1234-5678", relation: "長男"     },
  { id: 2, name: "田中 花子",   phone: "080-9876-5432", relation: "長女"     },
  { id: 3, name: "かかりつけ医", phone: "03-1234-5678",  relation: "医療機関" },
];
const DEFAULT_NOTIFICATION = { enabled: true, time: "09:00" };

const THEMES = [
  { id: "green",  label: "森林", primary: "#4a7c59", dark: "#2d5a3d", bg: "#f0ede8", card: "#faf8f5" },
  { id: "ocean",  label: "海",   primary: "#2e7fa8", dark: "#1a5c7a", bg: "#e8f0f5", card: "#f5f9fc" },
  { id: "sakura", label: "桜",   primary: "#c4637a", dark: "#9e4460", bg: "#f5eaed", card: "#fdf7f8" },
  { id: "earth",  label: "大地", primary: "#8b6914", dark: "#6b4f0f", bg: "#f2ede0", card: "#faf8f2" },
  { id: "night",  label: "夜空", primary: "#5b6fa6", dark: "#3d4f82", bg: "#e8eaf2", card: "#f4f5fa" },
];

const HEALTH_OPTIONS = ["良好", "普通", "やや不調", "不調"];
const MEAL_OPTIONS   = ["完食", "半分", "少し", "食べていない"];
const LOCATION_HISTORY = [
  { icon: "🏠", name: "自宅",           time: "今日 8:32"  },
  { icon: "🏪", name: "近所のスーパー", time: "今日 10:15" },
  { icon: "🏥", name: "かかりつけ医",   time: "昨日 14:00" },
  { icon: "🌳", name: "近くの公園",     time: "昨日 9:45"  },
];

const HEALTH_SCORE = { "良好": 4, "普通": 3, "やや不調": 2, "不調": 1 };
const HEALTH_LABEL = { 4: "良好", 3: "普通", 2: "やや不調", 1: "不調" };
const HEALTH_COLOR = { 4: "#4a7c59", 3: "#8bc34a", 2: "#ff9800", 1: "#e05252" };

const SAMPLE_GRAPH_DATA = [
  { date: "4/5",  score: 4, meal: "完食" },
  { date: "4/6",  score: 3, meal: "完食" },
  { date: "4/7",  score: 4, meal: "完食" },
  { date: "4/8",  score: 4, meal: "半分" },
  { date: "4/9",  score: 2, meal: "少し" },
  { date: "4/10", score: 2, meal: "少し" },
  { date: "4/11", score: 3, meal: "半分" },
  { date: "4/12", score: 4, meal: "完食" },
  { date: "4/13", score: 4, meal: "完食" },
  { date: "4/14", score: 3, meal: "完食" },
  { date: "4/15", score: 4, meal: "完食" },
  { date: "4/16", score: 4, meal: "完食" },
  { date: "4/17", score: 3, meal: "半分" },
  { date: "4/18", score: 4, meal: "完食" },
];

const TAB_CONFIG = [
  { id: "home",     icon: "🏠", label: "ホーム"   },
  { id: "health",   icon: "💊", label: "健康記録" },
  { id: "graph",    icon: "📈", label: "グラフ"   },
  { id: "sos",      icon: "🆘", label: "緊急"     },
  { id: "settings", icon: "⚙️", label: "設定"     },
];

function fmt(d)     { return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }); }
function fmtDate(d) { return d.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" }); }
function load(k, f) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; } }
function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

function Toast({ message, visible }) {
  return <div className={`${styles.toast} ${visible ? styles.toastShow : ""}`}>{message}</div>;
}

function LogList({ logs }) {
  return (
    <div className={styles.card} style={{ padding: "16px 16px 4px" }}>
      {logs.map((l, i) => (
        <div key={i} className={styles.logItem}>
          <span className={styles.logTime}>{l.time}</span>
          <span className={styles.logDot} />
          <span className={styles.logText}>{l.text}</span>
        </div>
      ))}
    </div>
  );
}

function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = e => { e.preventDefault(); setDeferredPrompt(e); setShow(true); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setShow(false);
  };
  if (!show) return null;
  return (
    <div className={styles.installBanner}>
      <span>📱 ホーム画面に追加できます</span>
      <div style={{ display: "flex", gap: 8 }}>
        <button className={styles.installBtn} onClick={install}>追加</button>
        <button className={styles.installDismiss} onClick={() => setShow(false)}>✕</button>
      </div>
    </div>
  );
}

function GraphTab({ logs }) {
  const [range, setRange] = useState("week");
  const logData = logs
    .filter(l => l.text.includes("体調："))
    .map(l => {
      const match = l.text.match(/体調：(.+)/);
      const score = match ? (HEALTH_SCORE[match[1]] || 3) : 3;
      return { date: l.time, score, meal: "—" };
    });
  const data = logData.length >= 3 ? logData.slice(0, 14).reverse() : SAMPLE_GRAPH_DATA;
  const displayData = range === "week" ? data.slice(-7) : data;
  const avgScore = (displayData.reduce((s, d) => s + d.score, 0) / displayData.length).toFixed(1);
  const goodDays = displayData.filter(d => d.score >= 3).length;
  const barH = 120;
  return (
    <>
      <p className={styles.sectionTitle}>📈 体調グラフ</p>
      <div className={styles.rangeToggle}>
        <button className={`${styles.rangeBtn} ${range === "week" ? styles.rangeBtnActive : ""}`} onClick={() => setRange("week")}>1週間</button>
        <button className={`${styles.rangeBtn} ${range === "two" ? styles.rangeBtnActive : ""}`} onClick={() => setRange("two")}>2週間</button>
      </div>
      <div className={styles.card}>
        <div className={styles.graphWrap}>
          <div className={styles.yAxis}>
            {["良好", "普通", "不調"].map((l, i) => <span key={i} className={styles.yLabel}>{l}</span>)}
          </div>
          <div className={styles.barChart}>
            {displayData.map((d, i) => (
              <div key={i} className={styles.barCol}>
                <div className={styles.barTrack} style={{ height: barH }}>
                  <div className={styles.bar} style={{ height: `${(d.score / 4) * 100}%`, background: HEALTH_COLOR[d.score] }} />
                </div>
                <span className={styles.barLabel}>{d.date}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.legend}>
          {Object.entries(HEALTH_COLOR).reverse().map(([score, color]) => (
            <div key={score} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: color }} />
              <span>{HEALTH_LABEL[score]}</span>
            </div>
          ))}
        </div>
      </div>
      <p className={styles.sectionTitle}>期間サマリー</p>
      <div className={styles.healthGrid}>
        <div className={styles.card} style={{ textAlign: "center" }}>
          <p className={styles.cardLabel}>平均体調</p>
          <p className={styles.cardValue} style={{ color: HEALTH_COLOR[Math.round(avgScore)] }}>{avgScore}</p>
          <p style={{ fontSize: 11, color: "#aaa" }}>/ 4.0</p>
        </div>
        <div className={styles.card} style={{ textAlign: "center" }}>
          <p className={styles.cardLabel}>好調な日</p>
          <p className={styles.cardValue} style={{ color: "#4a7c59" }}>{goodDays}日</p>
          <p style={{ fontSize: 11, color: "#aaa" }}>/ {displayData.length}日中</p>
        </div>
      </div>
      <p className={styles.sectionTitle}>食事の記録</p>
      <div className={styles.card}>
        {displayData.map((d, i) => {
          const mealScore = { "完食": 1, "半分": 0.75, "少し": 0.4, "食べていない": 0.1 };
          const w = (mealScore[d.meal] || 0.5) * 100;
          return (
            <div key={i} className={styles.mealRow}>
              <span className={styles.mealDate}>{d.date}</span>
              <div className={styles.mealBarTrack}><div className={styles.mealBar} style={{ width: `${w}%` }} /></div>
              <span className={styles.mealLabel}>{d.meal}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function HomeTab({ profile, lastCheckin, health, meal, logs, onCheckin }) {
  return (
    <>
      <div className={styles.checkinCard}>
        <p className={styles.checkinLabel}>{profile.name} の最終確認</p>
        <p className={styles.checkinLast}>{lastCheckin ? `本日 ${lastCheckin}` : "まだ確認されていません"}</p>
        <button className={styles.checkinBtn} onClick={onCheckin}>👋 元気です！</button>
      </div>
      <p className={styles.sectionTitle}>今日のサマリー</p>
      <div className={styles.healthGrid}>
        <div className={styles.card}><p className={styles.cardLabel}>体調</p><p className={styles.cardValue}>{health || "—"}</p></div>
        <div className={styles.card}><p className={styles.cardLabel}>食事</p><p className={styles.cardValue} style={{ fontSize: 14 }}>{meal || "—"}</p></div>
      </div>
      <p className={styles.sectionTitle}>最近の記録</p>
      <LogList logs={logs.slice(0, 5)} />
    </>
  );
}

function HealthTab({ health, meal, memo, logs, setHealth, setMeal, setMemo, onSave }) {
  return (
    <>
      <p className={styles.sectionTitle}>体調を記録する</p>
      <div className={styles.healthGrid}>
        <div className={styles.healthCard}>
          <p className={styles.healthCardTitle}>体調</p>
          <div className={styles.selectGroup}>
            {HEALTH_OPTIONS.map(o => <button key={o} className={`${styles.selectOpt} ${health === o ? styles.selected : ""}`} onClick={() => setHealth(o)}>{o}</button>)}
          </div>
        </div>
        <div className={styles.healthCard}>
          <p className={styles.healthCardTitle}>食事</p>
          <div className={styles.selectGroup}>
            {MEAL_OPTIONS.map(o => <button key={o} className={`${styles.selectOpt} ${meal === o ? styles.selected : ""}`} onClick={() => setMeal(o)}>{o}</button>)}
          </div>
        </div>
      </div>
      <p className={styles.sectionTitle}>メモ</p>
      <textarea className={styles.memoInput} rows={3} placeholder="気になることや体の様子を書いてください…" value={memo} onChange={e => setMemo(e.target.value)} />
      <button className={styles.saveBtn} onClick={onSave}>💾 記録を保存する</button>
      <p className={styles.sectionTitle}>記録履歴</p>
      <LogList logs={logs} />
    </>
  );
}

function SosTab({ contacts, onSOS, onCall }) {
  return (
    <>
      <p className={styles.sectionTitle}>緊急ボタン</p>
      <button className={styles.sosBtn} onClick={onSOS}>🚨 SOS 緊急連絡</button>
      <p className={styles.sectionTitle}>緊急連絡先</p>
      {contacts.map(c => (
        <div key={c.id} className={styles.contactItem}>
          <div className={styles.contactAvatar}>{c.relation === "医療機関" ? "🏥" : "👤"}</div>
          <div>
            <p className={styles.contactName}>{c.name}</p>
            <p className={styles.contactRel}>{c.relation}</p>
            <p className={styles.contactPhone}>{c.phone}</p>
          </div>
          <button className={styles.callBtn} onClick={() => onCall(c)}>📞</button>
        </div>
      ))}
    </>
  );
}

function SettingsTab({ profile, setProfile, contacts, setContacts, notification, setNotification, themeId, setThemeId, showToast }) {
  const [editing, setEditing] = useState(null);
  const [newC, setNewC]       = useState({ name: "", phone: "", relation: "" });
  const [showAdd, setShowAdd] = useState(false);
  const saveProfile = () => { save("miamori_profile", profile); showToast("✅ プロフィールを保存しました"); };
  const saveNotif   = () => { save("miamori_notification", notification); showToast("🔔 通知設定を保存しました"); };
  const deleteContact = id => { const u = contacts.filter(c => c.id !== id); setContacts(u); save("miamori_contacts", u); showToast("🗑️ 連絡先を削除しました"); };
  const updateContact = c => { const u = contacts.map(x => x.id === c.id ? c : x); setContacts(u); save("miamori_contacts", u); setEditing(null); showToast("✅ 連絡先を更新しました"); };
  const addContact = () => {
    if (!newC.name || !newC.phone) { showToast("名前と電話番号を入力してください"); return; }
    const u = [...contacts, { ...newC, id: Date.now() }];
    setContacts(u); save("miamori_contacts", u);
    setNewC({ name: "", phone: "", relation: "" }); setShowAdd(false);
    showToast("✅ 連絡先を追加しました");
  };
  return (
    <>
      <p className={styles.sectionTitle}>👤 プロフィール設定</p>
      <div className={styles.card}>
        {[["お名前","name","田中 よし子","text"],["年齢","age","78","number"],["住所","address","大阪府大阪市","text"]].map(([label,key,ph,type]) => (
          <div key={key} className={styles.settingRow}>
            <label className={styles.settingLabel}>{label}</label>
            <input className={styles.settingInput} type={type} value={profile[key]} placeholder={ph} onChange={e => setProfile({ ...profile, [key]: e.target.value })} />
          </div>
        ))}
        <div className={styles.settingRow} style={{ alignItems: "flex-start" }}>
          <label className={styles.settingLabel}>メモ</label>
          <textarea className={styles.settingInput} value={profile.memo} placeholder="持病・アレルギーなど" rows={2} style={{ resize: "none" }} onChange={e => setProfile({ ...profile, memo: e.target.value })} />
        </div>
        <button className={styles.saveBtn} onClick={saveProfile}>💾 保存する</button>
      </div>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionTitle} style={{ margin: 0 }}>📞 緊急連絡先</p>
        <button className={styles.addBtn} onClick={() => setShowAdd(!showAdd)}>＋ 追加</button>
      </div>
      {showAdd && (
        <div className={styles.card} style={{ marginBottom: 12 }}>
          <p className={styles.formTitle}>新しい連絡先</p>
          {[["名前","name"],["電話番号","phone"],["続柄（例：長男）","relation"]].map(([ph,k]) => (
            <input key={k} className={styles.settingInput} placeholder={ph} value={newC[k]} onChange={e => setNewC({ ...newC, [k]: e.target.value })} style={{ marginBottom: 8 }} />
          ))}
          <div className={styles.btnRow}>
            <button className={styles.saveBtn} onClick={addContact}>追加する</button>
            <button className={styles.cancelBtn} onClick={() => setShowAdd(false)}>キャンセル</button>
          </div>
        </div>
      )}
      {contacts.map(c => (
        <div key={c.id} className={styles.card} style={{ marginBottom: 10 }}>
          {editing?.id === c.id ? (
            <>
              {[["name","名前"],["phone","電話番号"],["relation","続柄"]].map(([k,ph]) => (
                <input key={k} className={styles.settingInput} placeholder={ph} value={editing[k]} onChange={e => setEditing({ ...editing, [k]: e.target.value })} style={{ marginBottom: 8 }} />
              ))}
              <div className={styles.btnRow}>
                <button className={styles.saveBtn} onClick={() => updateContact(editing)}>保存</button>
                <button className={styles.cancelBtn} onClick={() => setEditing(null)}>キャンセル</button>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className={styles.contactAvatar}>{c.relation === "医療機関" ? "🏥" : "👤"}</div>
              <div style={{ flex: 1 }}>
                <p className={styles.contactName}>{c.name}</p>
                <p className={styles.contactRel}>{c.relation}</p>
                <p className={styles.contactPhone}>{c.phone}</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className={styles.iconBtn} onClick={() => setEditing({ ...c })}>✏️</button>
                <button className={styles.iconBtn} style={{ background: "#fee2e2" }} onClick={() => deleteContact(c.id)}>🗑️</button>
              </div>
            </div>
          )}
        </div>
      ))}
      <p className={styles.sectionTitle}>🔔 通知・リマインダー</p>
      <div className={styles.card}>
        <div className={styles.settingRow}>
          <label className={styles.settingLabel}>チェックイン通知</label>
          <label className={styles.toggle}>
            <input type="checkbox" checked={notification.enabled} onChange={e => setNotification({ ...notification, enabled: e.target.checked })} />
            <span className={styles.toggleSlider} />
          </label>
        </div>
        {notification.enabled && (
          <div className={styles.settingRow}>
            <label className={styles.settingLabel}>通知時間</label>
            <input className={styles.settingInput} type="time" value={notification.time} onChange={e => setNotification({ ...notification, time: e.target.value })} />
          </div>
        )}
        <button className={styles.saveBtn} onClick={saveNotif}>💾 保存する</button>
      </div>
      <p className={styles.sectionTitle}>🎨 テーマカラー</p>
      <div className={styles.themeGrid}>
        {THEMES.map(t => (
          <button key={t.id} className={`${styles.themeBtn} ${themeId === t.id ? styles.themeBtnActive : ""}`}
            onClick={() => { setThemeId(t.id); save("miamori_theme", t.id); showToast(`🎨「${t.label}」に変更しました`); }}>
            <span className={styles.themeCircle} style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.dark})` }} />
            <span className={styles.themeLabel}>{t.label}</span>
            {themeId === t.id && <span className={styles.themeCheck}>✓</span>}
          </button>
        ))}
      </div>
    </>
  );
}

export default function App() {
  const [tab, setTab]         = useState("home");
  const [now, setNow]         = useState(new Date());
  const [lastCheckin, setLastCheckin] = useState(null);
  const [health, setHealth]   = useState("");
  const [meal, setMeal]       = useState("");
  const [memo, setMemo]       = useState("");
  const [toast, setToast]     = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [logs, setLogs]       = useState([
    { time: "09:12", text: "✅ 安否確認完了" },
    { time: "08:45", text: "☀️ 朝食：完食"  },
    { time: "08:00", text: "😊 体調：良好"  },
  ]);
  const [profile, setProfile]           = useState(() => load("miamori_profile", DEFAULT_PROFILE));
  const [contacts, setContacts]         = useState(() => load("miamori_contacts", DEFAULT_CONTACTS));
  const [notification, setNotification] = useState(() => load("miamori_notification", DEFAULT_NOTIFICATION));
  const [themeId, setThemeId]           = useState(() => load("miamori_theme", "green"));
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--primary",      theme.primary);
    r.style.setProperty("--primary-dark", theme.dark);
    r.style.setProperty("--bg",           theme.bg);
    r.style.setProperty("--card-bg",      theme.card);
  }, [themeId]);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const showToast = msg => { setToast(msg); setToastVisible(true); setTimeout(() => setToastVisible(false), 2500); };
  const handleCheckin = () => {
    const t = fmt(new Date());
    setLastCheckin(t);
    setLogs(prev => [{ time: t, text: "✅ 安否確認完了" }, ...prev]);
    showToast("✅ 安否確認を送信しました");
  };
  const handleSaveHealth = () => {
    const t = fmt(new Date());
    const entries = [];
    if (health) entries.push({ time: t, text: `😊 体調：${health}` });
    if (meal)   entries.push({ time: t, text: `🍱 食事：${meal}`   });
    if (memo)   entries.push({ time: t, text: `📝 ${memo}`         });
    if (!entries.length) { showToast("記録する内容を選択してください"); return; }
    setLogs(prev => [...entries, ...prev]);
    setMemo(""); showToast("💾 記録を保存しました");
  };
  return (
    <div className={styles.app}>
      <InstallBanner />
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.appTitle}>みまもり<span>Care &amp; Connect</span></div>
          <button className={styles.statusBadge} onClick={() => showToast(`接続中：${profile.name}`)}>
            <span className={styles.statusDot} />接続中
          </button>
        </div>
        <p className={styles.datetime}>{fmtDate(now)} {fmt(now)}</p>
      </header>
      <nav className={styles.nav}>
        {TAB_CONFIG.map(t => (
          <button key={t.id} className={`${styles.navBtn} ${tab === t.id ? styles.active : ""}`} onClick={() => setTab(t.id)}>
            <span className={styles.navIcon}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
      <main className={styles.content}>
        {tab === "home"     && <HomeTab profile={profile} lastCheckin={lastCheckin} health={health} meal={meal} logs={logs} onCheckin={handleCheckin} />}
        {tab === "health"   && <HealthTab health={health} meal={meal} memo={memo} logs={logs} setHealth={setHealth} setMeal={setMeal} setMemo={setMemo} onSave={handleSaveHealth} />}
        {tab === "graph"    && <GraphTab logs={logs} />}
        {tab === "sos"      && <SosTab contacts={contacts} onSOS={() => showToast("🚨 緊急連絡先に通知を送りました！")} onCall={c => showToast(`📞 ${c.name}に発信中…`)} />}
        {tab === "settings" && <SettingsTab profile={profile} setProfile={setProfile} contacts={contacts} setContacts={setContacts} notification={notification} setNotification={setNotification} themeId={themeId} setThemeId={setThemeId} showToast={showToast} />}
      </main>
      <Toast message={toast} visible={toastVisible} />
    </div>
  );
}