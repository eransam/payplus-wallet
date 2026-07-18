import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  getTopicsForCategory,
  getTrackForSlug,
  learnTracks,
} from "../../data/learnTopics";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleSidebarPinned } from "../../store/slices/uiSlice";

type AppSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

function SidebarGroup({
  id,
  icon,
  label,
  open,
  onToggle,
  children,
  nested,
}: {
  id: string;
  icon: string;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  nested?: boolean;
}) {
  return (
    <div
      className={[
        "app-sidebar__group",
        open ? "app-sidebar__group--open" : "",
        nested ? "app-sidebar__group--nested" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className={
          nested
            ? "app-sidebar__group-btn app-sidebar__group-btn--nested"
            : "app-sidebar__group-btn"
        }
        aria-expanded={open}
        aria-controls={`sidebar-group-${id}`}
        onClick={onToggle}
        title={label}
      >
        {!nested ? (
          <span className="app-sidebar__icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span className="app-sidebar__label">{label}</span>
        <span className="app-sidebar__chevron app-sidebar__label" aria-hidden="true">
          {open ? "▾" : "◂"}
        </span>
      </button>
      {open ? (
        <div id={`sidebar-group-${id}`} className="app-sidebar__subnav">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function SubLink({
  to,
  label,
  end,
  onNavigate,
}: {
  to: string;
  label: string;
  end?: boolean;
  onNavigate: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `app-sidebar__sublink${isActive ? " active" : ""}`
      }
      onClick={onNavigate}
      title={label}
    >
      <span className="app-sidebar__sublink-text app-sidebar__label">{label}</span>
    </NavLink>
  );
}

function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isPinned = useAppSelector((state) => state.ui.sidebarPinned);
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia("(max-width: 991px)").matches,
  );

  const path = location.pathname;
  const walletSectionActive =
    path.startsWith("/merchants") ||
    path.startsWith("/wallets") ||
    path.startsWith("/transactions");
  const learnSectionActive = path.startsWith("/learn");

  const learnSlug = useMemo(() => {
    if (!learnSectionActive) return null;
    const slug = path.replace(/^\/learn\/?/, "").split("/")[0];
    return slug || null;
  }, [learnSectionActive, path]);

  const activeTrackId = useMemo(() => {
    if (!learnSlug) return null;
    return getTrackForSlug(learnSlug)?.id ?? null;
  }, [learnSlug]);

  const activeLearnCategoryId = useMemo(() => {
    if (!learnSlug || !activeTrackId) return null;
    const track = learnTracks.find((t) => t.id === activeTrackId);
    return track?.categories.find((cat) => cat.slugs.includes(learnSlug))?.id ?? null;
  }, [learnSlug, activeTrackId]);

  const [walletOpen, setWalletOpen] = useState(walletSectionActive);
  const [learnOpen, setLearnOpen] = useState(learnSectionActive);
  const [openTracks, setOpenTracks] = useState<Record<string, boolean>>({});
  const [openLearnCats, setOpenLearnCats] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    if (walletSectionActive) setWalletOpen(true);
  }, [walletSectionActive]);

  useEffect(() => {
    if (learnSectionActive) setLearnOpen(true);
  }, [learnSectionActive]);

  useEffect(() => {
    if (activeTrackId) {
      setOpenTracks((prev) => ({ ...prev, [activeTrackId]: true }));
    }
  }, [activeTrackId]);

  useEffect(() => {
    if (activeLearnCategoryId) {
      setOpenLearnCats((prev) => ({ ...prev, [activeLearnCategoryId]: true }));
    }
  }, [activeLearnCategoryId]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 991px)");
    const onChange = () => setIsMobile(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const togglePin = useCallback(() => {
    dispatch(toggleSidebarPinned());
  }, [dispatch]);

  const handleNavClick = useCallback(() => {
    if (isMobile) {
      onClose();
    }
  }, [isMobile, onClose]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
    onClose();
  }, [logout, navigate, onClose]);

  const toggleTrack = useCallback((id: string) => {
    setOpenTracks((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleLearnCat = useCallback((id: string) => {
    setOpenLearnCats((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <>
      <div
        className={`app-sidebar__backdrop ${isOpen ? "app-sidebar__backdrop--visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={[
          "app-sidebar",
          isOpen ? "app-sidebar--open" : "",
          isPinned ? "app-sidebar--pinned" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="app-sidebar__mobile-header">
          <span>תפריט</span>
          <button
            type="button"
            className="app-sidebar__close-btn"
            onClick={onClose}
            aria-label="סגור תפריט"
          >
            ✕
          </button>
        </div>

        <nav className="app-sidebar__nav" aria-label="תפריט ראשי">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `app-sidebar__link${isActive ? " active" : ""}`
            }
            onClick={handleNavClick}
          >
            <span className="app-sidebar__icon">⌂</span>
            <span className="app-sidebar__label">לוח בקרה</span>
          </NavLink>

          <SidebarGroup
            id="wallet-app"
            icon="💳"
            label="ארנק PayPlus"
            open={walletOpen}
            onToggle={() => setWalletOpen((v) => !v)}
          >
            <SubLink
              to="/merchants"
              label="סוחרים"
              onNavigate={handleNavClick}
            />
            <SubLink to="/wallets" label="ארנקים" onNavigate={handleNavClick} />
            <SubLink
              to="/transactions"
              label="עסקאות"
              onNavigate={handleNavClick}
            />
          </SidebarGroup>

          <SidebarGroup
            id="learn"
            icon="📚"
            label="למידה"
            open={learnOpen}
            onToggle={() => setLearnOpen((v) => !v)}
          >
            <SubLink
              to="/learn"
              label="מרכז הלמידה"
              end
              onNavigate={handleNavClick}
            />
            {learnTracks.map((track) => {
              const trackOpen = Boolean(openTracks[track.id]);
              return (
                <SidebarGroup
                  key={track.id}
                  id={`track-${track.id}`}
                  icon=""
                  label={track.title}
                  open={trackOpen}
                  onToggle={() => toggleTrack(track.id)}
                  nested
                >
                  {track.categories.map((category) => {
                    const topics = getTopicsForCategory(category);
                    const catOpen = Boolean(openLearnCats[category.id]);
                    return (
                      <SidebarGroup
                        key={category.id}
                        id={`learn-${category.id}`}
                        icon=""
                        label={category.title}
                        open={catOpen}
                        onToggle={() => toggleLearnCat(category.id)}
                        nested
                      >
                        {topics.map((topic) => (
                          <SubLink
                            key={topic.slug}
                            to={`/learn/${topic.slug}`}
                            label={`${topic.lesson}. ${topic.title}`}
                            onNavigate={handleNavClick}
                          />
                        ))}
                      </SidebarGroup>
                    );
                  })}
                </SidebarGroup>
              );
            })}
          </SidebarGroup>
        </nav>

        {!isMobile && (
          <div className="app-sidebar__rail-tools">
            <button
              type="button"
              className="app-sidebar__pin"
              onClick={togglePin}
              aria-pressed={isPinned}
              title={
                isPinned
                  ? "כיווץ לרצועה (פתיחה במעבר עכבר)"
                  : "הרחבה קבועה"
              }
            >
              <span className="app-sidebar__icon" aria-hidden="true">
                {isPinned ? "📌" : "«"}
              </span>
              <span className="app-sidebar__label app-sidebar__label--pin">
                {isPinned ? "מצב מורחב קבוע" : "הרחבה קבועה"}
              </span>
            </button>
          </div>
        )}

        <div className="app-sidebar__footer">
          <button
            type="button"
            className="app-sidebar__logout"
            onClick={handleLogout}
            title="התנתקות"
          >
            <span className="app-sidebar__icon" aria-hidden="true">
              ↪
            </span>
            <span className="app-sidebar__label">התנתקות</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AppSidebar;
