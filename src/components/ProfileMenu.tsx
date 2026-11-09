import { useState } from 'react';
import { Icon } from './Icon';
import { Avatar } from './Avatar';
import { ME_ID, authorById } from '../data/forum';
import { useClickOutside } from '../hooks';

interface ProfileMenuProps {
  topicsCount: number;
  answersCount: number;
  bookmarksCount: number;
  compact: boolean;
  notifyReplies: boolean;
  onToggleCompact: () => void;
  onToggleNotifyReplies: () => void;
  onSignOut: () => void;
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`switch ${checked ? 'is-on' : ''}`}
      onClick={onChange}
    >
      <span className="switch-track" aria-hidden="true">
        <span className="switch-thumb" />
      </span>
      <span className="switch-label">{label}</span>
    </button>
  );
}

export function ProfileMenu({
  topicsCount,
  answersCount,
  bookmarksCount,
  compact,
  notifyReplies,
  onToggleCompact,
  onToggleNotifyReplies,
  onSignOut,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const [showStorageNote, setShowStorageNote] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const me = authorById(ME_ID);

  const rep = me.rep;
  const nextBadge = 1500;
  const left = Math.max(0, nextBadge - rep);
  const progress = Math.min(100, Math.round((rep / nextBadge) * 100));

  return (
    <div className="menu-wrap" ref={ref}>
      <button
        type="button"
        className="avatar-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Профиль"
        aria-expanded={open}
      >
        <Avatar author={me} size={36} />
        <Icon name="chevronDown" size={15} className="avatar-btn-chevron" />
      </button>

      {open && (
        <div className="menu menu--profile" role="dialog" aria-label="Профиль">
          <div className="profile-head">
            <Avatar author={me} size={54} />
            <div className="profile-id">
              <span className="profile-name">{me.name}</span>
              <span className="profile-handle">{me.handle}</span>
              <span className="chip chip--role">участник</span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="pstat">
              <span className="pstat-value">{rep.toLocaleString('ru-RU')}</span>
              <span className="pstat-label">репутация</span>
            </div>
            <div className="pstat">
              <span className="pstat-value">{topicsCount}</span>
              <span className="pstat-label">темы</span>
            </div>
            <div className="pstat">
              <span className="pstat-value">{answersCount}</span>
              <span className="pstat-label">ответы</span>
            </div>
            <div className="pstat">
              <span className="pstat-value">{bookmarksCount}</span>
              <span className="pstat-label">закладки</span>
            </div>
          </div>

          <div className="rep-progress" aria-label={`До следующего значка: ${left} репутации`}>
            <div className="rep-progress-top">
              <span>До значка «Серебряный полутон»</span>
              <span>осталось {left}</span>
            </div>
            <div className="rep-bar">
              <div className="rep-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="profile-switches">
            <Switch checked={compact} onChange={onToggleCompact} label="Компактная лента" />
            <Switch checked={notifyReplies} onChange={onToggleNotifyReplies} label="Уведомления об ответах" />
          </div>

          <div className="profile-foot">
            <button type="button" className="link-btn link-btn--muted" onClick={() => setShowStorageNote((v) => !v)}>
              <Icon name="shield" size={15} />
              Где хранятся мои данные?
            </button>
            {showStorageNote && (
              <p className="storage-note">
                Локально, в вашем браузере: реакции, закладки, созданные темы и настройки.
                Ничего никуда не отправляется — переедете на другой браузер — всё начнётся с чистого листа.
              </p>
            )}
            <button type="button" className="link-btn link-btn--danger" onClick={onSignOut}>
              <Icon name="arrowLeft" size={15} />
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
