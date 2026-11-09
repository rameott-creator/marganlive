import { Icon } from './Icon';
import { CATEGORIES, type CategoryId } from '../data/forum';

export type CategoryFilter = CategoryId | 'all';

interface CategoryNavProps {
  active: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
  counts: Record<CategoryId, number>;
  totalCount: number;
  bookmarkedCount: number;
  bookmarkedOnly: boolean;
  onToggleBookmarkedOnly: () => void;
}

export function CategoryNav({
  active,
  onChange,
  counts,
  totalCount,
  bookmarkedCount,
  bookmarkedOnly,
  onToggleBookmarkedOnly,
}: CategoryNavProps) {
  return (
    <nav className="col-left" aria-label="Разделы форума">
      <div className="panel panel--nav">
        <div className="panel-title">Разделы</div>
        <ul className="nav-list">
          <li>
            <button
              type="button"
              className={`nav-item ${active === 'all' && !bookmarkedOnly ? 'is-active' : ''}`}
              onClick={() => onChange('all')}
              aria-current={active === 'all' ? 'true' : undefined}
            >
              <span className="nav-icon">
                <Icon name="compass" size={17} />
              </span>
              <span className="nav-text">
                <span className="nav-name">Все разделы</span>
              </span>
              <span className="nav-count">{totalCount}</span>
            </button>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                className={`nav-item ${active === cat.id && !bookmarkedOnly ? 'is-active' : ''}`}
                onClick={() => onChange(cat.id)}
                aria-current={active === cat.id ? 'true' : undefined}
                title={cat.hint}
              >
                <span className="nav-icon">
                  <Icon name={cat.icon} size={17} />
                </span>
                <span className="nav-text">
                  <span className="nav-name">{cat.name}</span>
                  <span className="nav-hint">{cat.hint}</span>
                </span>
                <span className="nav-count">{counts[cat.id]}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="nav-divider" aria-hidden="true" />
        <button
          type="button"
          className={`nav-item nav-item--bookmark ${bookmarkedOnly ? 'is-active' : ''}`}
          onClick={onToggleBookmarkedOnly}
          aria-pressed={bookmarkedOnly}
        >
          <span className="nav-icon">
            <Icon name="bookmark" size={17} filled={bookmarkedOnly} />
          </span>
          <span className="nav-text">
            <span className="nav-name">Закладки</span>
            <span className="nav-hint">темы, которые вы сохранили</span>
          </span>
          <span className="nav-count">{bookmarkedCount}</span>
        </button>
      </div>

      <div className="side-note">
        <Icon name="moon" size={14} />
        <p>Пик активности здесь — после 22:00. Приходите вечером, разговоры глубже.</p>
      </div>
    </nav>
  );
}
