import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { CATEGORIES, HACKS_ABOUT, type CategoryId } from '../data/forum';

export interface NewTopicData {
  title: string;
  category: CategoryId;
  tags: string[];
  body: string;
}

interface NewTopicModalProps {
  onClose: () => void;
  onSubmit: (data: NewTopicData) => void;
}

export function NewTopicModal({ onClose, onSubmit }: NewTopicModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('dev');
  const [tagsRaw, setTagsRaw] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = () => {
    const nextErrors: typeof errors = {};
    if (title.trim().length < 8) nextErrors.title = 'Заголовок должен быть не короче 8 символов.';
    if (body.trim().length < 20) nextErrors.body = 'Добавьте хотя бы пару предложений — от 20 символов.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const tags = tagsRaw
      .split(',')
      .map((tag) => tag.trim().replace(/^#/, '').toLowerCase())
      .filter(Boolean)
      .slice(0, 4);

    onSubmit({ title: title.trim(), category, tags, body: body.trim() });
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-topic-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h2 id="new-topic-title">Новая тема</h2>
            <p className="modal-sub">Пишите так, чтобы через год ваш вопрос помог кому-то ещё из поиска.</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Закрыть">
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="modal-body">
          <label className="field" htmlFor="nt-title">
            <span className="field-label">Заголовок</span>
            <input
              id="nt-title"
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Например: Покажите рабочий сетап, которым вы правда довольны"
              maxLength={140}
            />
            <span className="field-foot">
              {errors.title ? <span className="field-error">{errors.title}</span> : <span />}
              <span className="field-count">{title.trim().length}/140</span>
            </span>
          </label>

          <div className="field-row">
            <label className="field" htmlFor="nt-category">
              <span className="field-label">Раздел</span>
              <select id="nt-category" value={category} onChange={(e) => setCategory(e.target.value as CategoryId)}>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field" htmlFor="nt-tags">
              <span className="field-label">Теги через запятую · до 4</span>
              <input
                id="nt-tags"
                type="text"
                value={tagsRaw}
                onChange={(e) => setTagsRaw(e.target.value)}
                placeholder="linux, опыт, fedora"
                autoComplete="off"
              />
            </label>
          </div>

          <label className="field" htmlFor="nt-body">
            <span className="field-label">Текст темы</span>
            <textarea
              id="nt-body"
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setErrors((prev) => ({ ...prev, body: undefined }));
              }}
              rows={5}
              placeholder="Контекст, детали, что уже пробовали — всё это экономит всем время."
            />
            <span className="field-foot">
              {errors.body ? <span className="field-error">{errors.body}</span> : <span />}
              <span className="field-count">{body.trim().length} символов</span>
            </span>
          </label>
        </div>

        <div className="modal-foot">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Отмена
          </button>
          <button type="button" className="btn btn--primary" onClick={submit}>
            <Icon name="send" size={16} />
            Опубликовать тему
          </button>
        </div>
      </div>
    </div>
  );
}

export function AboutModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal modal--about"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h2 id="about-title">Как устроен margan.live</h2>
            <p className="modal-sub">Коротко, честно и без корпоративного тона.</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Закрыть">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="modal-body">
          <ul className="about-list">
            {HACKS_ABOUT.map((rule) => (
              <li key={rule}>
                <span className="about-check">
                  <Icon name="check" size={15} />
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
          <p className="about-note">
            Сейчас margan.live живёт в вашем браузере: темы, ответы и реакции сохраняются локально.
            Сервер и настоящая регистрация — следующий шаг, когда сообществу станет тесно в одном окне.
          </p>
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn--primary" onClick={onClose}>
            Понятно, идём в ленту
          </button>
        </div>
      </div>
    </div>
  );
}
