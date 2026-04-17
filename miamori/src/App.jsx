import { useState, useEffect } from "react";
import styles from "./App.module.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const EMERGENCY_CONTACTS = [
  { name: "子供 (田中 一郎)", phone: "090-1234-5678", relation: "長男" },
  { name: "子供 (田中 花子)", phone: "080-9876-5432", relation: "長女" },
  { name: "かかりつけ医", phone: "03-1234-5678", relation: "医療機関" },
];

const HEALTH_OPTIONS = ["良好", "普通", "やや不調", "不調"];
const MEAL_OPTIONS = ["完食", "半分", "少し", "食べていない"];

const LOCATION_HISTORY = [
  { icon: "🏠", name: "自宅", time: "今日 8:32" },
  { icon: "🏪", name: "近所のスーパー", time: "今日 10:15" },
  { icon: "🏥", name: "かかりつけ医", time: "昨日 14:00" },
  { icon: "🌳", name: "近くの公園", time: "昨日 9:45" },
];

const TAB_CONFIG = [
  { id: "home",     icon: "🏠", label: "ホーム"   },
  { id: "health",   icon: "💊", label: "健康記録" },
  { id: "location", icon: "📍", label: "位置情報" },
  { id: "sos",      icon: "🆘", label: "緊急"     },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(date) {
  return date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(date) {
  return date.toLocaleDateString("ja-JP", {
    month: "long", day: "numeric", weekday: "short",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toast({ message, visible }) {
  return (
    <div className={`${styles.toast} ${visible ? styles.toastShow : ""}`}>
      {message}
    </div>
  );
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

// ─── Tab: Home ────────────────────────────────────────────────────────────────

function HomeTab({ lastCheckin, health, meal, logs, onCheckin }) {
  return (
    <>
      <div className={styles.checkinCard}>
        <p className={styles.checkinLabel}>最終確認</p>
        <p className={styles.checkinLast}>
          {lastCheckin ? `本日 ${lastCheckin}` : "まだ確認されていません"}
        </p>
        <button className={styles.checkinBtn} onClick={onCheckin}>
          👋 元気です！
        </button>
      </div>

      <p className={styles.sectionTitle}>今日のサマリー</p>
      <div className={styles.healthGrid}>
        <div className={styles.card}>
          <p className={styles.cardLabel}>体調</p>
          <p className={styles.cardValue}>{health || "—"}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>食事</p>
          <p className={styles.cardValue} style={{ fontSize: 14 }}>{meal || "—"}</p>
        </div>
      </div>

      <p className={styles.sectionTitle}>最近の記録</p>
      <LogList logs={logs.slice(0, 5)} />
    </>
  );
}

// ─── Tab: Health ──────────────────────────────────────────────────────────────

function HealthTab({ health, meal, memo, logs, setHealth, setMeal, setMemo, onSave }) {
  return (
    <>
      <p className={styles.sectionTitle}>体調を記録する</p>
      <div className={styles.healthGrid}>
        <div className={styles.healthCard}>
          <p className={styles.healthCardTitle}>体調</p>
          <div className={styles.selectGroup}>
            {HEALTH_OPTIONS.map(o => (
              <button
                key={o}
                className={`${styles.selectOpt} ${health === o ? styles.selected : ""}`}
                onClick={() => setHealth(o)}
              >{o}</button>
            ))}
          </div>
        </div>
        <div className={styles.healthCard}>
          <p className={styles.healthCardTitle}>食事</p>
          <div className={styles.selectGroup}>
            {MEAL_OPTIONS.map(o => (
              <button
                key={o}
                className={`${styles.selectOpt} ${meal === o ? styles.selected : ""}`}
                onClick={() => setMeal(o)}
              >{o}</button>
            ))}
          </div>
        </div>
      </div>

      <p className={styles.sectionTitle}>メモ</p>
      <textarea
        className={styles.memoInput}
        rows={3}
        placeholder="気になることや体の様子を書いてください…"
        value={memo}
        onChange={e => setMemo(e.target.value)}
      />
      <button className={styles.saveBtn} onClick={onSave}>💾 記録を保存する</button>

      <p className={styles.sectionTitle}>記録履歴</p>
      <LogList logs={logs} />
    </>
  );
}

// ─── Tab: Location ────────────────────────────────────────────────────────────

function LocationTab({ now }) {
  return (
    <>
      <p className={styles.sectionTitle}>現在地</p>
      <div className={styles.locationMap}>
        <div className={styles.mapDot} />
        <p className={styles.mapLabel}>📍 自宅付近</p>
        <p className={styles.mapTime}>最終更新：{formatTime(now)}</p>
      </div>

      <p className={styles.sectionTitle}>行動履歴</p>
      <div className={styles.locationHistory}>
        {LOCATION_HISTORY.map((l, i) => (
          <div key={i} className={styles.locItem}>
            <span className={styles.locIcon}>{l.icon}</span>
            <div>
              <p className={styles.locName}>{l.name}</p>
              <p className={styles.locTime}>{l.time}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Tab: SOS ─────────────────────────────────────────────────────────────────

function SosTab({ onSOS, onCall }) {
  return (
    <>
      <p className={styles.sectionTitle}>緊急ボタン</p>
      <button className={styles.sosBtn} onClick={onSOS}>
        🚨 SOS 緊急連絡
      </button>

      <p className={styles.sectionTitle}>緊急連絡先</p>
      {EMERGENCY_CONTACTS.map((c, i) => (
        <div key={i} className={styles.contactItem}>
          <div className={styles.contactAvatar}>
            {c.relation === "医療機関" ? "🏥" : "👤"}
          </div>
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

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab]               = useState("home");
  const [now, setNow]               = useState(new Date());
  const [lastCheckin, setLastCheckin] = useState(null);
  const [health, setHealth]         = useState("");
  const [meal, setMeal]             = useState("");
  const [memo, setMemo]             = useState("");
  const [toast, setToast]           = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [logs, setLogs]             = useState([
    { time: "09:12", text: "✅ 安否確認完了" },
    { time: "08:45", text: "☀️ 朝食：完食"  },
    { time: "08:00", text: "😊 体調：良好"  },
  ]);

  // Clock ticker
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const handleCheckin = () => {
    const t = formatTime(new Date());
    setLastCheckin(t);
    setLogs(prev => [{ time: t, text: "✅ 安否確認完了" }, ...prev]);
    showToast("✅ 安否確認を送信しました");
  };

  const handleSaveHealth = () => {
    const t = formatTime(new Date());
    const entries = [];
    if (health) entries.push({ time: t, text: `😊 体調：${health}` });
    if (meal)   entries.push({ time: t, text: `🍱 食事：${meal}`   });
    if (memo)   entries.push({ time: t, text: `📝 ${memo}`         });
    if (!entries.length) { showToast("記録する内容を選択してください"); return; }
    setLogs(prev => [...entries, ...prev]);
    setMemo("");
    showToast("💾 記録を保存しました");
  };

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.appTitle}>
            みまもり
            <span>Care &amp; Connect</span>
          </div>
          <button
            className={styles.statusBadge}
            onClick={() => showToast("接続中：母（田中 よし子）")}
          >
            <span className={styles.statusDot} />
            接続中
          </button>
        </div>
        <p className={styles.datetime}>{formatDate(now)} {formatTime(now)}</p>
      </header>

      {/* Nav */}
      <nav className={styles.nav}>
        {TAB_CONFIG.map(t => (
          <button
            key={t.id}
            className={`${styles.navBtn} ${tab === t.id ? styles.active : ""}`}
            onClick={() => setTab(t.id)}
          >
            <span className={styles.navIcon}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className={styles.content}>
        {tab === "home"     && <HomeTab lastCheckin={lastCheckin} health={health} meal={meal} logs={logs} onCheckin={handleCheckin} />}
        {tab === "health"   && <HealthTab health={health} meal={meal} memo={memo} logs={logs} setHealth={setHealth} setMeal={setMeal} setMemo={setMemo} onSave={handleSaveHealth} />}
        {tab === "location" && <LocationTab now={now} />}
        {tab === "sos"      && <SosTab onSOS={() => showToast("🚨 緊急連絡先に通知を送りました！")} onCall={c => showToast(`📞 ${c.name}に発信中…`)} />}
      </main>

      <Toast message={toast} visible={toastVisible} />
    </div>
  );
}
