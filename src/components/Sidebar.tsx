import { Icon } from './Icon';
import { EqBars } from './EqBars';
import { Avatar } from './Avatar';
import {
  authorById,
  categoryById,
  fmtCount,
  COMMUNITY_STATS,
  ONLINE_USERS,
  type Topic,
} from '../data/forum';

export interface HotEntry {
  topic: Topic;
  views: number;
  postsCount: number;
}

interface SidebarProps {
  hot: HotEntry[];
  onOpenTopic: (id: string) => void;
  onAbout: () => void;
}

export function Sidebar({ hot, onOpenTopic, onAbout }: SidebarProps) {
  return (
    <aside className="col-right" aria-label="Пока вы здесь">
      <section className="panel panel--hot">
        <div className="panel-title">
          <EqBars size={14} className="panel-title-eq" />
          Сейчас в движении
        </div>
        <ol className="hot-list">
          {hot.map(({ topic, views, postsCount }, index) => {
            const author = authorById(topic.authorId);
            return (
              <li key={topic.id}>
                <button type="button" className="hot-item" onClick={() => onOpenTopic(topic.id)}>
                  <span className="hot-rank" aria-hidden="true">{index + 1}</span>
                  <span className="hot-body">
                    <span className="hot-title">{topic.title}</span>
                    <span className="hot-meta">
                      <span className="hot-cat">{categoryById(topic.category).name}</span>
                      <span className="meta-dot" aria-hidden="true">·</span>
                      <Icon name="message" size={12} />
                      {postsCount}
                      <span className="meta-dot" aria-hidden="true">·</span>
                      <Icon name="eye" size={12} />
                      {fmtCount(views)}
                      <span className="meta-dot" aria-hidden="true">·</span>
                      {author.name.split(' ')[0]}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="panel panel--online">
        <div className="panel-title">
          <Icon name="users" size={15} />
          На связи · 214
        </div>
        <ul className="online-list">
          {ONLINE_USERS.map(({ id, status }) => {
            const user = authorById(id);
            return (
              <li key={id} className="online-item">
                <span className="online-avatar">
                  <Avatar author={user} size={30} />
                  <span className={`presence presence--${status}`} aria-hidden="true" />
                </span>
                <span className="online-info">
                  <span className="online-name">
                    {user.name}
                    {user.role === 'модератор' && <span className="role-chip">мод</span>}
                  </span>
                  <span className="online-handle">{user.handle}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="panel panel--stats">
        <div className="panel-title">
          <Icon name="zap" size={15} />
          Сообщество в цифрах
        </div>
        <div className="stats-grid">
          {COMMUNITY_STATS.map((stat) => (
            <div key={stat.label} className="stat-tile">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="side-badge">
        <Icon name="shield" size={18} />
        <p>
          Независимый форум: без рекламы и маркетплейсов, модерация вручную и по человечески.
        </p>
        <button type="button" className="link-btn" onClick={onAbout}>
          Как устроен margan.live
          <Icon name="chevronRight" size={15} />
        </button>
      </div>
    </aside>
  );
}
