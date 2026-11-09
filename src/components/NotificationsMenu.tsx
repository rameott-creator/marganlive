import { useState } from 'react';
import { Icon } from './Icon';
import type { Notification } from '../data/forum';
import { useClickOutside } from '../hooks';

interface NotificationsMenuProps {
  notifications: Notification[];
  readIds: string[];
  onConsume: (notification: Notification) => void;
  onMarkAllRead: () => void;
}

const KIND_ICON: Record<Notification['kind'], string> = {
  reply: 'message',
  mention: 'zap',
  rep: 'trending',
  follow: 'users',
};

export function NotificationsMenu({ notifications, readIds, onConsume, onMarkAllRead }: NotificationsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const unread = notifications.filter((n) => !readIds.includes(n.id)).length;

  return (
    <div className="menu-wrap" ref={ref}>
      <button
        type="button"
        className={`icon-btn ${open ? 'is-active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={unread > 0 ? `Уведомления, непрочитанных: ${unread}` : 'Уведомления'}
        aria-expanded={open}
      >
        <Icon name="bell" size={19} />
        {unread > 0 && <span className="badge">{unread > 9 ? '9+' : unread}</span>}
      </button>

      {open && (
        <div className="menu menu--notif" role="dialog" aria-label="Уведомления">
          <div className="menu-head">
            <span>Уведомления</span>
            <button type="button" className="link-btn" onClick={onMarkAllRead}>
              <Icon name="checkCheck" size={15} />
              Прочитать все
            </button>
          </div>
          <ul className="notif-list">
            {notifications.map((n) => {
              const isUnread = !readIds.includes(n.id);
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    className={`notif-item ${isUnread ? 'is-unread' : ''}`}
                    onClick={() => {
                      onConsume(n);
                      setOpen(false);
                    }}
                  >
                    <span className="notif-icon" aria-hidden="true">
                      <Icon name={KIND_ICON[n.kind]} size={16} />
                    </span>
                    <span className="notif-body">
                      <span className="notif-text">{n.text}</span>
                      <span className="notif-time">{n.time}</span>
                    </span>
                    {isUnread && <span className="unread-dot" aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
